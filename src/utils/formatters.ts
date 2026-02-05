import { format } from 'date-fns'

export const parseAmount = (value: string | number): number => {
  if (typeof value === 'number') return value
  return parseFloat(value.replace(/[¥,]/g, ''))
}

export const formatAmount = (amount: number): string => {
  return `¥${amount.toFixed(2)}`
}

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return dateString
  }
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const detectPlatform = (filename: string): 'wechat' | 'alipay' | 'jd' | null => {
  const lower = filename.toLowerCase()
  if (lower.includes('微信') || lower.includes('wechat')) return 'wechat'
  if (lower.includes('支付宝') || lower.includes('alipay')) return 'alipay'
  if (lower.includes('京东') || lower.includes('jd')) return 'jd'
  return null
}
