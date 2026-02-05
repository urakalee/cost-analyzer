import { describe, it, expect } from 'vitest'
import { parseAmount, formatAmount, detectPlatform, generateId } from '@/utils/formatters'

describe('formatters', () => {
  describe('parseAmount', () => {
    it('should parse numeric amount', () => {
      expect(parseAmount(100)).toBe(100)
      expect(parseAmount(99.99)).toBe(99.99)
    })

    it('should parse string with currency symbol', () => {
      expect(parseAmount('¥100')).toBe(100)
      expect(parseAmount('¥99.99')).toBe(99.99)
    })

    it('should parse string with comma', () => {
      expect(parseAmount('1,000.50')).toBe(1000.50)
      expect(parseAmount('¥1,234.56')).toBe(1234.56)
    })

    it('should handle edge cases', () => {
      expect(parseAmount('0')).toBe(0)
      expect(parseAmount('¥0.00')).toBe(0)
    })
  })

  describe('formatAmount', () => {
    it('should format amount with currency symbol', () => {
      expect(formatAmount(100)).toBe('¥100.00')
      expect(formatAmount(99.99)).toBe('¥99.99')
      expect(formatAmount(1234.5)).toBe('¥1234.50')
    })
  })

  describe('detectPlatform', () => {
    it('should detect wechat', () => {
      expect(detectPlatform('微信支付账单.xlsx')).toBe('wechat')
      expect(detectPlatform('wechat_bill.csv')).toBe('wechat')
    })

    it('should detect alipay', () => {
      expect(detectPlatform('支付宝交易明细.csv')).toBe('alipay')
      expect(detectPlatform('alipay_transactions.csv')).toBe('alipay')
    })

    it('should detect jd', () => {
      expect(detectPlatform('京东交易流水.csv')).toBe('jd')
      expect(detectPlatform('jd_orders.csv')).toBe('jd')
    })

    it('should return null for unknown platform', () => {
      expect(detectPlatform('unknown.csv')).toBe(null)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })
})
