import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { Transaction } from '@/types/transaction'
import { format } from 'date-fns'

const platformNames = {
  wechat: '微信',
  alipay: '支付宝',
  jd: '京东',
}

interface ExportData {
  交易时间: string
  平台: string
  商户: string
  商品: string
  分类: string
  金额: number
  支付方式: string
  交易状态: string
  交易订单号: string
  商户订单号: string
  备注: string
}

function transformTransactions(transactions: Transaction[]): ExportData[] {
  return transactions.map((t) => ({
    交易时间: t.time,
    平台: platformNames[t.platform],
    商户: t.merchant,
    商品: t.product,
    分类: t.category,
    金额: t.amount,
    支付方式: t.paymentMethod,
    交易状态: t.status,
    交易订单号: t.transactionId,
    商户订单号: t.merchantOrderId,
    备注: t.note,
  }))
}

function generateFilename(extension: string): string {
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
  return `大额账单分析_${timestamp}.${extension}`
}

export function exportToExcel(transactions: Transaction[]) {
  const data = transformTransactions(transactions)

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '大额账单')

  // 设置列宽
  const columnWidths = [
    { wch: 20 }, // 交易时间
    { wch: 10 }, // 平台
    { wch: 30 }, // 商户
    { wch: 40 }, // 商品
    { wch: 15 }, // 分类
    { wch: 12 }, // 金额
    { wch: 20 }, // 支付方式
    { wch: 12 }, // 交易状态
    { wch: 25 }, // 交易订单号
    { wch: 30 }, // 商户订单号
    { wch: 30 }, // 备注
  ]
  worksheet['!cols'] = columnWidths

  const filename = generateFilename('xlsx')
  XLSX.writeFile(workbook, filename)
}

export function exportToCSV(transactions: Transaction[]) {
  const data = transformTransactions(transactions)

  const csv = Papa.unparse(data, {
    header: true,
  })

  // 添加BOM以支持Excel打开时正确显示中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = generateFilename('csv')
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
