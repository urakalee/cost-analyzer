import { describe, it, expect, beforeEach } from 'vitest'
import { useTransactionStore } from '../useTransactionStore'
import { Transaction } from '@/types/transaction'

describe('useTransactionStore', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      platform: 'alipay',
      time: '2026-01-31 16:22:02',
      merchant: '商户A',
      product: '商品A',
      amount: 600,
      category: '餐饮',
      paymentMethod: '信用卡',
      status: '成功',
      transactionId: 'A123',
      merchantOrderId: 'MA123',
      note: '',
    },
    {
      id: '2',
      platform: 'wechat',
      time: '2026-01-30 12:00:00',
      merchant: '商户B',
      product: '商品B',
      amount: 300,
      category: '购物',
      paymentMethod: '余额',
      status: '成功',
      transactionId: 'B123',
      merchantOrderId: 'MB123',
      note: '',
    },
    {
      id: '3',
      platform: 'jd',
      time: '2026-01-29 10:00:00',
      merchant: '商户C',
      product: '商品C',
      amount: 800,
      category: '餐饮',
      paymentMethod: '信用卡',
      status: '成功',
      transactionId: 'C123',
      merchantOrderId: 'MC123',
      note: '',
    },
  ]

  beforeEach(() => {
    // 重置store状态
    useTransactionStore.setState({
      transactions: [],
      threshold: 500,
      selectedCategory: '全部分类',
      platform: null,
    })
  })

  it('should initialize with default values', () => {
    const store = useTransactionStore.getState()
    expect(store.transactions).toEqual([])
    expect(store.threshold).toBe(500)
    expect(store.selectedCategory).toBe('全部分类')
  })

  it('should set transactions', () => {
    useTransactionStore.getState().setTransactions(mockTransactions)
    const store = useTransactionStore.getState()
    expect(store.transactions).toHaveLength(3)
  })

  it('should filter transactions by threshold', () => {
    const store = useTransactionStore.getState()
    store.setTransactions(mockTransactions)
    store.setThreshold(500)

    const filtered = store.filteredTransactions()
    expect(filtered).toHaveLength(2) // 600 and 800
    expect(filtered.every(t => t.amount >= 500)).toBe(true)
  })

  it('should filter transactions by category', () => {
    const store = useTransactionStore.getState()
    store.setTransactions(mockTransactions)
    store.setThreshold(0)
    store.setSelectedCategory('餐饮')

    const filtered = store.filteredTransactions()
    expect(filtered).toHaveLength(2)
    expect(filtered.every(t => t.category === '餐饮')).toBe(true)
  })

  it('should filter by both threshold and category', () => {
    const store = useTransactionStore.getState()
    store.setTransactions(mockTransactions)
    store.setThreshold(700)
    store.setSelectedCategory('餐饮')

    const filtered = store.filteredTransactions()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('3')
  })

  it('should calculate statistics correctly', () => {
    const store = useTransactionStore.getState()
    store.setTransactions(mockTransactions)
    store.setThreshold(500)

    const stats = store.statistics()
    expect(stats.count).toBe(2)
    expect(stats.total).toBe(1400)
    expect(stats.average).toBe(700)
    expect(stats.max).toBe(800)
  })

  it('should extract unique categories', () => {
    const store = useTransactionStore.getState()
    store.setTransactions(mockTransactions)

    const categories = store.categories()
    expect(categories).toContain('全部分类')
    expect(categories).toContain('餐饮')
    expect(categories).toContain('购物')
  })

  it('should update note', () => {
    useTransactionStore.getState().setTransactions(mockTransactions)
    useTransactionStore.getState().updateNote('1', '新备注')

    const store = useTransactionStore.getState()
    const transaction = store.transactions.find(t => t.id === '1')
    expect(transaction?.note).toBe('新备注')
  })
})
