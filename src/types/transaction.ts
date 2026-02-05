export type Platform = 'wechat' | 'alipay' | 'jd'

export interface Transaction {
  id: string              // 唯一ID（前端生成）
  platform: Platform      // 平台
  time: string           // 交易时间（ISO格式）
  merchant: string       // 商户名称
  product: string        // 商品说明
  amount: number         // 金额（数字）
  category: string       // 分类
  paymentMethod: string  // 支付方式
  status: string         // 交易状态
  transactionId: string  // 交易订单号
  merchantOrderId: string // 商户订单号
  note: string           // 备注（用户填写）
}

export interface ParseResult {
  transactions: Transaction[]
  errors: string[]
}

export interface ParserConfig {
  skipRows: number
  encoding?: string
}
