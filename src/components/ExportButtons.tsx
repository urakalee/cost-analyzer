import { useMemo } from 'react'
import { useTransactionStore } from '@/store/useTransactionStore'
import { exportToExcel, exportToCSV } from '@/utils/export'
import { Button } from './ui/button'
import { FileSpreadsheet, FileText } from 'lucide-react'

export function ExportButtons() {
  const filteredTransactions = useTransactionStore(state => state.filteredTransactions)
  const threshold = useTransactionStore(state => state.threshold)
  const selectedCategory = useTransactionStore(state => state.selectedCategory)

  const data = useMemo(() => filteredTransactions(), [filteredTransactions, threshold, selectedCategory])

  const handleExportExcel = () => {
    if (data.length === 0) return
    exportToExcel(data)
  }

  const handleExportCSV = () => {
    if (data.length === 0) return
    exportToCSV(data)
  }

  const disabled = data.length === 0

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={handleExportExcel}
        disabled={disabled}
        className="gap-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        导出 Excel
      </Button>

      <Button
        onClick={handleExportCSV}
        disabled={disabled}
        variant="outline"
        className="gap-2"
      >
        <FileText className="w-4 h-4" />
        导出 CSV
      </Button>

      {data.length > 0 && (
        <span className="text-sm text-muted-foreground">
          共 {data.length} 条记录
        </span>
      )}
    </div>
  )
}
