import { useCallback, useState } from 'react'
import { Upload, AlertCircle } from 'lucide-react'
import { useTransactionStore } from '@/store/useTransactionStore'
import { parseFile } from '@/parsers'
import { detectPlatform } from '@/utils/formatters'
import { Platform } from '@/types/transaction'
import { Select } from './ui/select'

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { setTransactions, setPlatform } = useTransactionStore()

  const handleFile = async (file: File, platform: Platform) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await parseFile(file, platform)

      if (result.errors.length > 0) {
        setError(result.errors.join('; '))
      }

      if (result.transactions.length === 0) {
        setError('未找到支出交易记录，请检查文件格式')
      } else {
        setTransactions(result.transactions)
        setPlatform(platform)
      }
    } catch (err) {
      setError(`文件解析失败: ${err}`)
    } finally {
      setIsLoading(false)
      setSelectedFile(null)
      setDetectedPlatform(null)
    }
  }

  const onFileSelect = useCallback((file: File) => {
    setError(null)
    const platform = detectPlatform(file.name)

    if (platform) {
      handleFile(file, platform)
    } else {
      setSelectedFile(file)
      setDetectedPlatform(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handlePlatformSelect = (platform: string) => {
    if (selectedFile && platform !== 'select') {
      handleFile(selectedFile, platform as Platform)
    }
  }

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <div>
            <p className="text-lg font-medium mb-2">
              {isLoading ? '解析中...' : '拖拽文件到这里，或点击选择'}
            </p>
            <p className="text-sm text-muted-foreground">
              支持 .csv 和 .xlsx 格式（微信/支付宝/京东账单）
            </p>
          </div>

          {selectedFile && !detectedPlatform && (
            <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-background">
              <p className="text-sm mb-2">
                无法自动识别平台，请手动选择：
              </p>
              <Select
                onChange={(e) => handlePlatformSelect(e.target.value)}
                defaultValue="select"
              >
                <option value="select">请选择平台...</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信</option>
                <option value="jd">京东</option>
              </Select>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
