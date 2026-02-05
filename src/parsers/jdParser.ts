import Papa from 'papaparse'
import { Transaction, ParseResult } from '@/types/transaction'
import { parseAmount, generateId } from '@/utils/formatters'

export const parseJDCSV = async (file: File): Promise<ParseResult> => {
  const errors: string[] = []
  const transactions: Transaction[] = []

  try {
    const text = await file.text()

    const parseResult = Papa.parse(text, {
      delimiter: ',',
      skipEmptyLines: true,
      comments: false,
    })

    if (parseResult.errors.length > 0) {
      // 过滤掉分隔符警告（不是真正的错误）
      const realErrors = parseResult.errors.filter((e: any) =>
        e.type !== 'Delimiter' && e.code !== 'UndetectableDelimiter'
      )
      if (realErrors.length > 0) {
        errors.push(...realErrors.map((e: any) => e.message))
      }
    }

    const rows = parseResult.data as string[][]

    // 找到表头行（包含"交易时间"的行）
    const headerIndex = rows.findIndex(row =>
      row[0] === '交易时间' || row.includes('交易时间')
    )

    if (headerIndex === -1) {
      errors.push('未找到京东账单表头')
      return { transactions, errors }
    }

    // 从表头下一行开始解析
    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i]

      if (row.length < 11 || !row[0]) continue

      const type = row[6]?.trim() // 收/支

      // 仅解析支出（排除"不计收支"）
      if (type !== '支出') continue

      try {
        const transaction: Transaction = {
          id: generateId(),
          platform: 'jd',
          time: row[0]?.trim() || '',
          merchant: row[1]?.trim() || '',
          product: row[2]?.trim() || '',
          amount: parseAmount(row[3]?.trim() || '0'),
          category: row[7]?.trim() || '未分类',
          paymentMethod: row[4]?.trim() || '',
          status: row[5]?.trim() || '',
          transactionId: row[8]?.trim() || '',
          merchantOrderId: row[9]?.trim() || '',
          note: '',
        }

        transactions.push(transaction)
      } catch (error) {
        errors.push(`第 ${i + 1} 行解析失败: ${error}`)
      }
    }
  } catch (error) {
    errors.push(`解析京东文件失败: ${error}`)
  }

  return { transactions, errors }
}
