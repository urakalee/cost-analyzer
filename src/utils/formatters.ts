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

/**
 * 从交易状态中提取退款金额
 * 支持格式：
 * - "已退款(￥17.88)" -> 17.88
 * - "已退款(¥17.88)" -> 17.88
 * - "已退款￥17.88" -> 17.88
 * - "已全额退款" -> null (需要调用方判断是否完全过滤)
 */
export const extractRefundAmount = (status: string): number | null => {
  if (!status) return null

  // 检查是否包含退款关键词
  if (!status.includes('退款')) return null

  // 全额退款：返回 null，由调用方决定如何处理（通常是完全过滤该记录）
  if (status.includes('全额退款')) return null

  // 提取退款金额：已退款(￥17.88) 或 已退款￥17.88
  const match = status.match(/[¥￥](\d+\.?\d*)/)
  if (match && match[1]) {
    return parseFloat(match[1])
  }

  return null
}

/**
 * 计算净支出金额（原始金额 - 退款金额）
 * 返回 null 表示应该完全过滤该交易（全额退款）
 */
export const calculateNetAmount = (originalAmount: number, status: string): number | null => {
  const refundAmount = extractRefundAmount(status)

  // 全额退款：返回 null 表示应该过滤
  if (refundAmount === null && status.includes('全额退款')) {
    return null
  }

  // 无退款或者无法解析退款金额：返回原始金额
  if (refundAmount === null || refundAmount === 0) {
    return originalAmount
  }

  // 部分退款：返回净金额
  return originalAmount - refundAmount
}
