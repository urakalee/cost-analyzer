import { useMemo } from 'react'
import { useTransactionStore } from '@/store/useTransactionStore'
import { formatAmount } from '@/utils/formatters'
import { Card, CardContent } from './ui/card'
import { TrendingUp, Hash, DollarSign, Award } from 'lucide-react'

export function StatisticsCards() {
  const filteredTransactions = useTransactionStore(state => state.filteredTransactions)

  const stats = useMemo(() => {
    const count = filteredTransactions.length
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
    const average = count > 0 ? total / count : 0
    const max = count > 0 ? Math.max(...filteredTransactions.map((t) => t.amount)) : 0
    return { count, total, average, max }
  }, [filteredTransactions])

  const cards = [
    {
      title: '大额交易',
      value: `${stats.count} 笔`,
      icon: Hash,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '总金额',
      value: formatAmount(stats.total),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '平均金额',
      value: formatAmount(stats.average),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: '最大单笔',
      value: formatAmount(stats.max),
      icon: Award,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
