import { create } from 'zustand'
import { Transaction, Platform } from '@/types/transaction'

interface TransactionStore {
  transactions: Transaction[]
  threshold: number
  selectedCategory: string
  platform: Platform | null

  // 预计算的派生状态
  filteredTransactions: Transaction[]
  categories: string[]

  setTransactions: (transactions: Transaction[]) => void
  updateNote: (id: string, note: string) => void
  setThreshold: (threshold: number) => void
  setSelectedCategory: (category: string) => void
  setPlatform: (platform: Platform | null) => void

  // 辅助计算函数
  _computeFiltered: (transactions: Transaction[], threshold: number, category: string) => Transaction[]
  _computeCategories: (transactions: Transaction[]) => string[]
}

export const useTransactionStore = create<TransactionStore>((set, get) => {
  // 辅助计算函数
  const computeFiltered = (transactions: Transaction[], threshold: number, category: string) => {
    return transactions.filter((t) => {
      const meetsThreshold = t.amount >= threshold
      const meetsCategory = category === '全部分类' || t.category === category
      return meetsThreshold && meetsCategory
    })
  }

  const computeCategories = (transactions: Transaction[]) => {
    const categorySet = new Set(transactions.map((t) => t.category))
    return ['全部分类', ...Array.from(categorySet).sort()]
  }

  return {
    transactions: [],
    threshold: 500,
    selectedCategory: '全部分类',
    platform: null,
    filteredTransactions: [],
    categories: ['全部分类'],

    _computeFiltered: computeFiltered,
    _computeCategories: computeCategories,

    setTransactions: (transactions) => {
      const state = get()
      const filtered = computeFiltered(transactions, state.threshold, state.selectedCategory)
      const categories = computeCategories(transactions)
      set({ transactions, filteredTransactions: filtered, categories })
    },

    updateNote: (id, note) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, note } : t
        ),
        filteredTransactions: state.filteredTransactions.map((t) =>
          t.id === id ? { ...t, note } : t
        ),
      })),

    setThreshold: (threshold) => {
      const state = get()
      const filtered = computeFiltered(state.transactions, threshold, state.selectedCategory)
      set({ threshold, filteredTransactions: filtered })
    },

    setSelectedCategory: (category) => {
      const state = get()
      const filtered = computeFiltered(state.transactions, state.threshold, category)
      set({ selectedCategory: category, filteredTransactions: filtered })
    },

    setPlatform: (platform) => set({ platform }),
  }
})
