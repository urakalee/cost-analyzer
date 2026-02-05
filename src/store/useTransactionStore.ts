import { create } from 'zustand'
import { Transaction, Platform } from '@/types/transaction'

interface TransactionStore {
  transactions: Transaction[]
  threshold: number
  selectedCategory: string
  platform: Platform | null

  // 缓存过滤结果
  _filteredCache: Transaction[] | null
  _lastThreshold: number
  _lastCategory: string

  setTransactions: (transactions: Transaction[]) => void
  updateNote: (id: string, note: string) => void
  setThreshold: (threshold: number) => void
  setSelectedCategory: (category: string) => void
  setPlatform: (platform: Platform | null) => void

  // 计算属性
  filteredTransactions: () => Transaction[]
  categories: () => string[]
  statistics: () => {
    count: number
    total: number
    average: number
    max: number
  }
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  threshold: 500,
  selectedCategory: '全部分类',
  platform: null,

  _filteredCache: null,
  _lastThreshold: 500,
  _lastCategory: '全部分类',

  setTransactions: (transactions) => set({
    transactions,
    _filteredCache: null // 清除缓存
  }),

  updateNote: (id, note) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, note } : t
      ),
      _filteredCache: state._filteredCache?.map((t) =>
        t.id === id ? { ...t, note } : t
      ) || null,
    })),

  setThreshold: (threshold) => set({
    threshold,
    _filteredCache: null // 清除缓存
  }),

  setSelectedCategory: (category) => set({
    selectedCategory: category,
    _filteredCache: null // 清除缓存
  }),

  setPlatform: (platform) => set({ platform }),

  filteredTransactions: () => {
    const state = get()
    const { transactions, threshold, selectedCategory, _filteredCache, _lastThreshold, _lastCategory } = state

    // 如果筛选条件没变，返回缓存
    if (_filteredCache && threshold === _lastThreshold && selectedCategory === _lastCategory) {
      return _filteredCache
    }

    // 重新计算
    const filtered = transactions.filter((t) => {
      const meetsThreshold = t.amount >= threshold
      const meetsCategory =
        selectedCategory === '全部分类' || t.category === selectedCategory
      return meetsThreshold && meetsCategory
    })

    // 更新缓存
    set({
      _filteredCache: filtered,
      _lastThreshold: threshold,
      _lastCategory: selectedCategory
    })

    return filtered
  },

  categories: () => {
    const { transactions } = get()
    const categorySet = new Set(transactions.map((t) => t.category))
    return ['全部分类', ...Array.from(categorySet).sort()]
  },

  statistics: () => {
    const filtered = get().filteredTransactions()
    const count = filtered.length
    const total = filtered.reduce((sum, t) => sum + t.amount, 0)
    const average = count > 0 ? total / count : 0
    const max = count > 0 ? Math.max(...filtered.map((t) => t.amount)) : 0

    return { count, total, average, max }
  },
}))
