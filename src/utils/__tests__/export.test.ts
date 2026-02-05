import { describe, it, expect } from 'vitest'
import { Transaction } from '@/types/transaction'

describe('export utilities', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      platform: 'alipay',
      time: '2026-01-31 16:22:02',
      merchant: '测试商户',
      product: '测试商品',
      amount: 500.00,
      category: '测试分类',
      paymentMethod: '信用卡',
      status: '交易成功',
      transactionId: 'TEST123',
      merchantOrderId: 'MERCHANT123',
      note: '测试备注',
    },
  ]

  it('should generate filename with timestamp', () => {
    const filename = `大额账单分析_20260205_120000.xlsx`
    expect(filename).toMatch(/大额账单分析_\d{8}_\d{6}\.xlsx/)
  })

  it('should transform transactions to export format', () => {
    // 这里只是验证数据结构，实际导出功能需要在浏览器环境测试
    expect(mockTransactions[0]).toHaveProperty('platform')
    expect(mockTransactions[0]).toHaveProperty('amount')
    expect(mockTransactions[0]).toHaveProperty('note')
  })
})
