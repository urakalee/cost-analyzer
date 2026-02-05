import * as XLSX from 'xlsx'
import { Transaction, ParseResult } from '@/types/transaction'
import { parseAmount, generateId } from '@/utils/formatters'

export const parseWechatExcel = async (file: File): Promise<ParseResult> => {
  const errors: string[] = []
  const transactions: Transaction[] = []

  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][]

    // 找到表头行（包含"交易时间"的行）
    const headerIndex = rows.findIndex(row => {
      if (!Array.isArray(row)) return false
      return row.some(cell => cell === '交易时间')
    })

    if (headerIndex === -1) {
      errors.push('未找到微信账单表头')
      return { transactions, errors }
    }

    // 从表头下一行开始解析
    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i] as string[]

      if (!row || row.length < 11 || !row[0]) continue

      const type = row[4]?.toString().trim() // 收/支

      // 仅解析支出
      if (type !== '支出') continue

      try {
        const amountStr = row[5]?.toString() || '0'

        const transaction: Transaction = {
          id: generateId(),
          platform: 'wechat',
          time: row[0]?.toString().trim() || '',
          merchant: row[2]?.toString().trim() || '',
          product: row[3]?.toString().trim() || '',
          amount: parseAmount(amountStr),
          category: row[1]?.toString().trim() || '未分类',
          paymentMethod: row[6]?.toString().trim() || '',
          status: row[7]?.toString().trim() || '',
          transactionId: row[8]?.toString().trim() || '',
          merchantOrderId: row[9]?.toString().trim() || '',
          note: '',
        }

        transactions.push(transaction)
      } catch (error) {
        errors.push(`第 ${i + 1} 行解析失败: ${error}`)
      }
    }
  } catch (error) {
    errors.push(`解析微信文件失败: ${error}`)
  }

  return { transactions, errors }
}
