import { FileUploader } from './components/FileUploader'
import { FilterBar } from './components/FilterBar'
import { StatisticsCards } from './components/StatisticsCards'
import { TransactionTable } from './components/TransactionTable'
import { ExportButtons } from './components/ExportButtons'
import { useTransactionStore } from './store/useTransactionStore'
import { BarChart3 } from 'lucide-react'

function App() {
  const { transactions } = useTransactionStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cost Analyzer</h1>
              <p className="text-sm text-muted-foreground">支出分析工具</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* File Uploader */}
        <section>
          <FileUploader />
        </section>

        {/* Show content only when data is loaded */}
        {transactions.length > 0 && (
          <>
            {/* Filter Bar */}
            <section>
              <FilterBar />
            </section>

            {/* Statistics Cards */}
            <section>
              <StatisticsCards />
            </section>

            {/* Export Buttons */}
            <section>
              <ExportButtons />
            </section>

            {/* Transaction Table */}
            <section>
              <TransactionTable />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>数据完全在本地处理，不上传服务器 • 隐私安全</p>
        </div>
      </footer>
    </div>
  )
}

export default App
