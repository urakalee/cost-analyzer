import Papa from 'papaparse'
import { Transaction, ParseResult } from '@/types/transaction'
import { parseAmount, generateId } from '@/utils/formatters'

export const parseAlipayCSV = async (file: File): Promise<ParseResult> => {
  const errors: string[] = []
  const transactions: Transaction[] = []

  try {
    // 读取文件并处理编码
    const text = await readFileWithEncoding(file)

    console.log('🔍 支付宝文件编码转换完成')
    console.log('前100个字符:', text.substring(0, 100))

    const parseResult = Papa.parse(text, {
      delimiter: ',',
      skipEmptyLines: true,
      comments: false,
    })

    if (parseResult.errors.length > 0) {
      // 过滤掉分隔符警告（不是真正的错误）
      const realErrors = parseResult.errors.filter(e =>
        e.type !== 'Delimiter' && e.code !== 'UndetectableDelimiter'
      )
      if (realErrors.length > 0) {
        errors.push(...realErrors.map(e => e.message))
      }
    }

    const rows = parseResult.data as string[][]
    console.log('📊 解析行数:', rows.length)

    // 找到表头行（包含"交易时间"的行）
    const headerIndex = rows.findIndex((row, index) => {
      const hasTime = Array.isArray(row) && row.some(cell => cell && cell.toString().includes('交易时间'))
      if (hasTime) {
        console.log(`✅ 找到表头在第 ${index + 1} 行:`, row.slice(0, 5))
      }
      return hasTime
    })

    if (headerIndex === -1) {
      console.error('❌ 未找到表头行')
      console.log('前10行数据:', rows.slice(0, 10))
      errors.push('未找到支付宝账单表头。提示：如果出现乱码，请用 Excel 打开 CSV 文件，另存为 UTF-8 编码格式后重试')
      return { transactions, errors }
    }

    const headers = rows[headerIndex].map(h => h?.toString() || '')
    console.log('📋 表头字段:', headers)

    // 找到各列的索引
    const timeIdx = headers.findIndex(h => h.includes('交易时间'))
    const categoryIdx = headers.findIndex(h => h.includes('交易分类'))
    const merchantIdx = headers.findIndex(h => h.includes('交易对方'))
    const productIdx = headers.findIndex(h => h.includes('商品说明'))
    const typeIdx = headers.findIndex(h => h.includes('收/支'))
    const amountIdx = headers.findIndex(h => h.includes('金额'))
    const paymentIdx = headers.findIndex(h => h.includes('收/付款方式'))
    const statusIdx = headers.findIndex(h => h.includes('交易状态'))
    const transactionIdIdx = headers.findIndex(h => h.includes('交易订单号'))
    const merchantOrderIdIdx = headers.findIndex(h => h.includes('商家订单号'))

    console.log('🔢 列索引:', { timeIdx, categoryIdx, merchantIdx, typeIdx, amountIdx })

    if (typeIdx === -1 || amountIdx === -1) {
      errors.push('账单格式不正确，缺少必要字段（收/支、金额）')
      return { transactions, errors }
    }

    // 从表头下一行开始解析数据
    let supportCount = 0
    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i]

      // 检查是否是有效数据行
      if (!Array.isArray(row) || row.length < 10 || !row[timeIdx]) continue

      const type = row[typeIdx]?.toString().trim()

      // 仅解析支出
      if (type !== '支出') {
        continue
      }

      supportCount++
      if (supportCount <= 3) {
        console.log(`📝 支出记录 ${supportCount}:`, {
          time: row[timeIdx],
          type: row[typeIdx],
          amount: row[amountIdx],
          merchant: row[merchantIdx]
        })
      }

      try {
        const transaction: Transaction = {
          id: generateId(),
          platform: 'alipay',
          time: row[timeIdx]?.toString().trim() || '',
          merchant: row[merchantIdx]?.toString().trim() || '',
          product: row[productIdx]?.toString().trim() || '',
          amount: parseAmount(row[amountIdx]?.toString().trim() || '0'),
          category: row[categoryIdx]?.toString().trim() || '未分类',
          paymentMethod: row[paymentIdx]?.toString().trim() || '',
          status: row[statusIdx]?.toString().trim() || '',
          transactionId: row[transactionIdIdx]?.toString().trim() || '',
          merchantOrderId: row[merchantOrderIdIdx]?.toString().trim() || '',
          note: '',
        }

        transactions.push(transaction)
      } catch (error) {
        errors.push(`第 ${i + 1} 行解析失败: ${error}`)
      }
    }

    console.log(`✅ 共解析到 ${transactions.length} 条支出记录`)

    if (transactions.length === 0 && errors.length === 0) {
      errors.push('未找到支出交易记录，请检查账单文件是否包含支出数据')
    }
  } catch (error) {
    console.error('❌ 解析失败:', error)
    errors.push(`解析支付宝文件失败: ${error}`)
  }

  return { transactions, errors }
}

async function readFileWithEncoding(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const bytes = new Uint8Array(arrayBuffer)

        console.log('📁 文件大小:', bytes.length, 'bytes')

        // 方案1: 尝试浏览器原生支持的 gb18030（GBK 的超集）
        try {
          const decoder = new TextDecoder('gb18030')
          let text = decoder.decode(bytes)

          // 检查是否正确解码（包含中文字符）
          if (/[\u4e00-\u9fa5]/.test(text)) {
            console.log('✅ 使用 gb18030 解码成功')
            // 标准化换行符（关键修复）
            text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
            resolve(text)
            return
          }
        } catch (e) {
          console.log('⚠️ gb18030 不支持')
        }

        // 方案2: 尝试 gbk
        try {
          const decoder = new TextDecoder('gbk')
          let text = decoder.decode(bytes)

          if (/[\u4e00-\u9fa5]/.test(text)) {
            console.log('✅ 使用 gbk 解码成功')
            // 标准化换行符
            text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
            resolve(text)
            return
          }
        } catch (e) {
          console.log('⚠️ gbk 不支持')
        }

        // 方案3: UTF-8
        try {
          const decoder = new TextDecoder('utf-8', { fatal: true })
          let text = decoder.decode(bytes)
          console.log('✅ 使用 utf-8 解码')
          text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          resolve(text)
          return
        } catch (e) {
          console.log('⚠️ utf-8 失败')
        }

        // 方案4: 默认编码
        console.log('⚠️ 使用默认编码')
        const decoder = new TextDecoder()
        let text = decoder.decode(bytes)
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        resolve(text)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}
