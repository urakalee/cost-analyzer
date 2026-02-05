import { useState, useMemo, memo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { useTransactionStore } from '@/store/useTransactionStore'
import { Transaction } from '@/types/transaction'
import { formatAmount, formatDateTime } from '@/utils/formatters'
import { Badge } from './ui/badge'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

const platformNames = {
  wechat: '微信',
  alipay: '支付宝',
  jd: '京东',
}

export function TransactionTable() {
  const updateNote = useTransactionStore(state => state.updateNote)
  const threshold = useTransactionStore(state => state.threshold)
  const selectedCategory = useTransactionStore(state => state.selectedCategory)
  const filteredTransactions = useTransactionStore(state => state.filteredTransactions)
  const transactions = useTransactionStore(state => state.transactions)

  const [sorting, setSorting] = useState<SortingState>([{ id: 'time', desc: true }])
  const [editingId, setEditingId] = useState<string | null>(null)

  // 重新计算数据（依赖原始数据、阈值和分类变化）
  const data = useMemo(() => filteredTransactions(), [filteredTransactions, threshold, selectedCategory, transactions.length])

  const handleUpdateNote = useCallback((id: string, note: string) => {
    updateNote(id, note)
    setEditingId(null)
  }, [updateNote])

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'time',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-2 hover:text-primary"
          >
            交易时间
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm whitespace-nowrap">
            {formatDateTime(row.original.time)}
          </div>
        ),
        size: 160,
      },
      {
        accessorKey: 'platform',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-2 hover:text-primary"
          >
            平台
            {column.getIsSorted() && (
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )
            )}
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant="outline">
            {platformNames[row.original.platform]}
          </Badge>
        ),
        size: 80,
      },
      {
        id: 'merchantProduct',
        header: '商户/商品',
        cell: ({ row }) => (
          <div className="max-w-md">
            <div className="font-medium truncate">{row.original.merchant}</div>
            <div className="text-sm text-muted-foreground truncate">
              {row.original.product}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-2 hover:text-primary"
          >
            分类
            {column.getIsSorted() && (
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )
            )}
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.category}</Badge>
        ),
        size: 120,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-2 hover:text-primary"
          >
            金额
            {column.getIsSorted() && (
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-red-600">
            {formatAmount(row.original.amount)}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'paymentMethod',
        header: '支付方式',
        cell: ({ row }) => (
          <div className="text-sm">{row.original.paymentMethod}</div>
        ),
        size: 140,
      },
      {
        accessorKey: 'note',
        header: '备注',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id

          return (
            <div className="min-w-[150px]">
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  defaultValue={row.original.note}
                  onBlur={(e) => {
                    handleUpdateNote(row.original.id, e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateNote(row.original.id, e.currentTarget.value)
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div
                  onClick={() => setEditingId(row.original.id)}
                  className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1 min-h-[2rem] flex items-center"
                >
                  {row.original.note || (
                    <span className="text-muted-foreground italic">点击添加备注</span>
                  )}
                </div>
              )}
            </div>
          )
        },
        size: 150,
      },
    ],
    [editingId, handleUpdateNote]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无数据，请上传账单文件
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                    style={{ width: header.column.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-muted/25 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
