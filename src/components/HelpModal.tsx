import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, CreditCard, ShoppingCart } from "lucide-react"

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>账单导出指引</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="wechat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wechat" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              微信
            </TabsTrigger>
            <TabsTrigger value="alipay" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              支付宝
            </TabsTrigger>
            <TabsTrigger value="jd" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              京东
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wechat" className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold text-base mb-3">微信账单导出（CSV/Excel）</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>打开微信，点击<span className="font-medium text-foreground">我</span></li>
                <li>点击<span className="font-medium text-foreground">服务</span></li>
                <li>点击<span className="font-medium text-foreground">钱包</span></li>
                <li>点击<span className="font-medium text-foreground">账单</span></li>
                <li>点击右上角<span className="font-medium text-foreground">"..."</span></li>
                <li>点击<span className="font-medium text-foreground">下载账单</span></li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="alipay" className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold text-base mb-3">支付宝账单导出（CSV/Excel）</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>打开支付宝手机端，点击<span className="font-medium text-foreground">我的</span></li>
                <li>点击<span className="font-medium text-foreground">账单</span></li>
                <li>点击右上角<span className="font-medium text-foreground">"..."</span></li>
                <li>选择<span className="font-medium text-foreground">开具交易流水证明</span></li>
              </ol>
              <p className="text-sm text-muted-foreground mt-3">
                💡 密码需要去申请记录中查看
              </p>
            </div>
          </TabsContent>

          <TabsContent value="jd" className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold text-base mb-3">京东账单导出（CSV/Excel）</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>打开京东APP，点击<span className="font-medium text-foreground">我的</span></li>
                <li>点击个人头像</li>
                <li>点击<span className="font-medium text-foreground">本月账单</span></li>
                <li>点击右上角<span className="font-medium text-foreground">三个点</span></li>
                <li>选择<span className="font-medium text-foreground">账单导出</span>（仅限个人对账）</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            💡 提示：导出的账单文件支持 .csv 和 .xlsx 格式，可直接拖拽到本应用上传区域进行分析。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
