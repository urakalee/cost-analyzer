import { useState, useEffect } from 'react'
import { useTransactionStore } from '@/store/useTransactionStore'
import { Input } from './ui/input'
import { Select } from './ui/select'

export function FilterBar() {
  const threshold = useTransactionStore(state => state.threshold)
  const selectedCategory = useTransactionStore(state => state.selectedCategory)
  const categories = useTransactionStore(state => state.categories)
  const setThreshold = useTransactionStore(state => state.setThreshold)
  const setSelectedCategory = useTransactionStore(state => state.setSelectedCategory)

  // 本地状态用于即时显示输入值
  const [localThreshold, setLocalThreshold] = useState(threshold.toString())

  // 同步外部阈值变化到本地状态
  useEffect(() => {
    setLocalThreshold(threshold.toString())
  }, [threshold])

  // 防抖处理：延迟更新 store
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = parseFloat(localThreshold)
      if (!isNaN(value) && value >= 0 && value !== threshold) {
        setThreshold(value)
      }
    }, 500) // 500ms 防抖

    return () => clearTimeout(timer)
  }, [localThreshold, threshold, setThreshold])

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalThreshold(e.target.value)
  }

  return (
    <div className="flex items-center gap-6 p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-3">
        <label htmlFor="threshold" className="text-sm font-medium whitespace-nowrap">
          金额阈值:
        </label>
        <Input
          id="threshold"
          type="number"
          min="0"
          step="0.01"
          value={localThreshold}
          onChange={handleThresholdChange}
          className="w-32"
        />
        <span className="text-sm text-muted-foreground">元</span>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="category" className="text-sm font-medium whitespace-nowrap">
          分类:
        </label>
        <Select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-48"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
