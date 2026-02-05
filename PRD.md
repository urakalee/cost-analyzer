# 📋 成本分析工具 - 产品需求文档（PRD）

**版本：** v1.0
**日期：** 2026-02-05
**项目名称：** Cost Analyzer（成本分析器）

---

## 一、项目概述

### 1.1 产品定位
纯前端Web应用，用于分析微信/支付宝/京东账单，自动筛选和标注大额支出交易，支持分类筛选和备注管理，导出分析结果。

### 1.2 核心价值
- **隐私安全：** 数据完全在本地浏览器处理，不上传服务器
- **操作简便：** 拖拽上传账单文件，自动解析展示
- **精准筛选：** 可调金额阈值，快速定位大额支出
- **灵活管理：** 支持分类筛选和自定义备注

### 1.3 目标用户
个人用户、家庭财务管理者、需要分析支出记录的个体

---

## 二、账单格式分析

### 2.1 支付宝账单

**文件格式：** CSV（GBK编码）

**元数据区域：**
- 第1-24行：导出信息、说明、统计数据
- 第25行：表头

**数据字段：**
| 字段名 | 示例 | 说明 |
|-------|------|------|
| 交易时间 | 2026-01-31 16:22:02 | 完整时间戳 |
| 交易分类 | 保险、餐饮美食、商业服务 | 支付宝分类 |
| 交易对方 | 中国人民人寿保险股份有限公司 | 商户名称 |
| 对方账号 | ext***@stripe.com 或 / | 脱敏账号 |
| 商品说明 | 保险承保-全民保... | 商品详情 |
| 收/支 | 支出、收入 | 交易方向 |
| 金额 | 300.00 | 数字（无货币符号） |
| 收/付款方式 | 浙商银行信用购 | 支付工具 |
| 交易状态 | 交易成功、交易关闭 | 状态 |
| 交易订单号 | 20260131872428130105 | 支付宝订单号 |
| 商家订单号 | 202601311100300908... | 商户订单号 |
| 备注 | 空 | 用户备注 |

**解析规则：**
- 跳过前24行元数据
- 使用GBK编码读取
- 数据从第26行开始

---

### 2.2 微信账单

**文件格式：** Excel (.xlsx)

**元数据区域：**
- 第1-16行：账单说明、统计信息
- 第17行：表头

**数据字段：**
| 字段名 | 示例 | 说明 |
|-------|------|------|
| 交易时间 | 2026-01-31 22:44:07 | 完整时间戳 |
| 交易类型 | 商户消费、退款 | 微信分类 |
| 交易对方 | 招商交建、腾讯云费用账户 | 商户名称 |
| 商品 | 高速通行代扣... | 商品详情 |
| 收/支 | 支出、收入 | 交易方向 |
| 金额(元) | ¥4.75 | 带货币符号 |
| 支付方式 | 招商银行信用卡(1807)、零钱 | 支付工具 |
| 当前状态 | 支付成功、已退款 | 状态 |
| 交易单号 | 4200003041202601313406758602 | 微信订单号 |
| 商户单号 | WXVP2026013120344803 | 商户订单号 |
| 备注 | / | 用户备注 |

**解析规则：**
- 跳过前16行元数据
- 使用openpyxl读取
- 数据从第18行开始
- 金额需移除"¥"符号

---

### 2.3 京东账单

**文件格式：** CSV（UTF-8编码）

**元数据区域：**
- 第1-21行：导出信息、说明
- 第22行：表头

**数据字段：**
| 字段名 | 示例 | 说明 |
|-------|------|------|
| 交易时间 | 2026-01-31 21:11:58 | 完整时间戳 |
| 商户名称 | 京东平台商户 | 固定值 |
| 交易说明 | 京东京造洁影镜片清洁湿巾... | 商品详情 |
| 金额 | 13.90 | 数字（无符号） |
| 收/付款方式 | 招商银行信用卡(1807) | 支付工具 |
| 交易状态 | 交易成功 | 状态 |
| 收/支 | 支出、收入、不计收支 | 交易方向 |
| 交易分类 | 清洁纸品、医疗保健、手机通讯 | 京东分类 |
| 交易订单号 | 3395460015543393 | 京东订单号 |
| 商家订单号 | 14083452601312111580208134698 | 商户订单号 |
| 备注 | 空 | 用户备注 |

**解析规则：**
- 跳过前21行元数据
- UTF-8编码
- 数据从第23行开始

---

## 三、功能需求

### 3.1 文件上传

**FR-1.1 文件上传组件**
- 支持拖拽上传
- 支持点击选择文件
- 支持的格式：`.csv`, `.xlsx`
- 单次仅上传一个文件

**FR-1.2 文件格式自动识别**
- 根据文件名关键词识别平台：
  - 微信：包含"微信"、"wechat"
  - 支付宝：包含"支付宝"、"alipay"
  - 京东：包含"京东"、"jd"
- 解析失败时提示用户手动选择平台

---

### 3.2 数据解析

**FR-2.1 支付宝解析器**
- 使用PapaParse解析CSV
- 转码GBK → UTF-8
- 跳过前24行，从第25行读取表头
- 仅解析"支出"类型

**FR-2.2 微信解析器**
- 使用SheetJS解析Excel
- 跳过前16行，从第17行读取表头
- 仅解析"支出"类型
- 金额字段移除"¥"符号

**FR-2.3 京东解析器**
- 使用PapaParse解析CSV
- UTF-8编码
- 跳过前21行，从第22行读取表头
- 仅解析"支出"类型（排除"不计收支"）

**FR-2.4 数据归一化**
统一字段映射为：
```typescript
interface Transaction {
  id: string;              // 唯一ID（前端生成）
  platform: 'wechat' | 'alipay' | 'jd'; // 平台
  time: string;            // 交易时间（ISO格式）
  merchant: string;        // 商户名称
  product: string;         // 商品说明
  amount: number;          // 金额（数字）
  category: string;        // 分类
  paymentMethod: string;   // 支付方式
  status: string;          // 交易状态
  transactionId: string;   // 交易订单号
  merchantOrderId: string; // 商户订单号
  note: string;            // 备注（用户填写）
}
```

---

### 3.3 数据筛选和展示

**FR-3.1 金额阈值设置**
- 默认值：500元
- 支持用户输入自定义数值（正整数或小数）
- 实时过滤大于等于阈值的支出

**FR-3.2 分类筛选**
- 提供下拉选择框
- 选项：全部分类 + 动态提取的所有分类
- 支持单选

**FR-3.3 数据表格展示**
显示字段：
| 列名 | 宽度 | 排序 | 说明 |
|-----|------|------|------|
| 交易时间 | 160px | 支持 | 默认倒序 |
| 平台 | 80px | 支持 | 微信/支付宝/京东 |
| 商户/商品 | 自适应 | 不支持 | 合并显示 |
| 分类 | 120px | 支持 | 标签样式 |
| 金额 | 100px | 支持 | 红色高亮 |
| 支付方式 | 140px | 不支持 | |
| 备注 | 150px | 不支持 | 可内联编辑 |

**FR-3.4 统计信息卡片**
- 大额交易笔数
- 大额交易总金额
- 平均金额
- 最大单笔金额

---

### 3.4 备注管理

**FR-4.1 内联编辑**
- 点击备注单元格进入编辑模式
- 输入框，支持多行文本
- 失焦或按Enter保存

**FR-4.2 本地状态管理**
- 备注数据存储在组件状态中
- 不持久化到LocalStorage

---

### 3.5 数据导出

**FR-5.1 导出Excel**
- 使用SheetJS生成`.xlsx`文件
- 仅导出大额交易记录
- 包含用户填写的备注
- 文件名：`大额账单分析_YYYYMMDD_HHmmss.xlsx`

**FR-5.2 导出CSV**
- 使用PapaParse生成`.csv`文件
- UTF-8编码（带BOM，兼容Excel）
- 内容同Excel
- 文件名：`大额账单分析_YYYYMMDD_HHmmss.csv`

**FR-5.3 导出内容字段**
| 字段 | 示例 |
|-----|------|
| 交易时间 | 2026-01-31 16:22:02 |
| 平台 | 支付宝 |
| 商户 | 中国人民人寿保险 |
| 商品 | 保险承保-全民保... |
| 分类 | 保险 |
| 金额 | 300.00 |
| 支付方式 | 浙商银行信用购 |
| 交易状态 | 交易成功 |
| 交易订单号 | 20260131872428130105 |
| 商户订单号 | 202601311100300908... |
| 备注 | 用户备注内容 |

---

## 四、非功能需求

### 4.1 性能要求
- **文件大小限制：** 支持最大50MB账单文件
- **解析速度：** 1万条记录 < 3秒
- **UI响应：** 操作反馈 < 200ms

### 4.2 浏览器兼容
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

### 4.3 响应式设计
- 最小屏幕宽度：1280px（桌面端）
- 不支持移动端

---

## 五、UI/UX设计

### 5.1 设计风格
- **主题：** 现代清新（Tailwind默认配色）
- **配色：**
  - 主色：蓝色（#3B82F6）
  - 成功：绿色（#10B981）
  - 警告：橙色（#F59E0B）
  - 危险：红色（#EF4444）
  - 中性：灰色系（#6B7280 / #F3F4F6）

### 5.2 页面布局
```
┌────────────────────────────────────────────┐
│          Cost Analyzer - 成本分析工具       │ Header
├────────────────────────────────────────────┤
│  [拖拽上传区域]                             │
│  或点击选择文件（支持 .csv / .xlsx）        │
├────────────────────────────────────────────┤
│  金额阈值: [500] 元   分类: [全部分类 ▼]    │ 筛选栏
├────────────────────────────────────────────┤
│  ┌─────┬─────┬─────┬─────┬─────┬─────┐   │
│  │大额交易 │总金额 │平均金额│最大单笔│     │ 统计卡片
│  │ 12笔  │¥8,500│¥708   │¥2,000 │     │
│  └─────┴─────┴─────┴─────┴─────┴─────┘   │
├────────────────────────────────────────────┤
│  交易时间 ▼ │平台│商户/商品│分类│金额 ▼│备注│ 表格
│  ----------│----│--------│----│------│----│
│  2026-01-31│支付│中国...  │保险│¥300 │... │
│  ...                                       │
├────────────────────────────────────────────┤
│  [导出Excel]  [导出CSV]                    │ 操作栏
└────────────────────────────────────────────┘
```

### 5.3 组件库
- **UI框架：** shadcn/ui
- **表格：** @tanstack/react-table
- **图标：** lucide-react

---

## 六、技术实现

### 6.1 技术栈
```json
{
  "框架": "React 18 + TypeScript",
  "构建工具": "Vite",
  "样式": "Tailwind CSS",
  "UI组件": "shadcn/ui",
  "文件解析": {
    "CSV": "papaparse",
    "Excel": "xlsx (SheetJS)"
  },
  "表格": "@tanstack/react-table",
  "状态管理": "zustand",
  "工具库": "date-fns (日期处理)"
}
```

### 6.2 项目结构
```
cost-analyzer/
├── src/
│   ├── components/
│   │   ├── FileUploader.tsx        # 文件上传
│   │   ├── FilterBar.tsx           # 筛选栏
│   │   ├── StatisticsCards.tsx     # 统计卡片
│   │   ├── TransactionTable.tsx    # 数据表格
│   │   └── ExportButtons.tsx       # 导出按钮
│   ├── parsers/
│   │   ├── alipayParser.ts         # 支付宝解析
│   │   ├── wechatParser.ts         # 微信解析
│   │   ├── jdParser.ts             # 京东解析
│   │   └── index.ts                # 解析器工厂
│   ├── types/
│   │   └── transaction.ts          # 类型定义
│   ├── store/
│   │   └── useTransactionStore.ts  # Zustand状态
│   ├── utils/
│   │   ├── export.ts               # 导出工具
│   │   └── formatters.ts           # 格式化工具
│   ├── App.tsx
│   └── main.tsx
├── sample-data/                     # 测试数据
├── package.json
├── vite.config.ts
└── README.md
```

### 6.3 关键算法

**编码检测与转换（支付宝）：**
```typescript
// 使用浏览器原生 TextDecoder（支持 GB18030/GBK）
const decoder = new TextDecoder('gb18030')
let text = decoder.decode(bytes)

// 关键：标准化换行符（GBK文件使用\r\n，PapaParse需要\n）
text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
```

**金额解析：**
```typescript
const parseAmount = (value: string): number => {
  return parseFloat(value.replace(/[¥,]/g, ''));
};
```

**状态管理架构（预计算派生状态）：**
```typescript
// 使用预计算模式，避免渲染期间更新状态
interface Store {
  transactions: Transaction[]
  threshold: number
  filteredTransactions: Transaction[]  // 预计算的派生状态（非函数）

  setThreshold: (threshold) => {
    const filtered = computeFiltered(transactions, threshold, category)
    set({ threshold, filteredTransactions: filtered })  // 仅在action中更新
  }
}
```

---

## 七、开发计划

### Phase 1: 项目搭建 ✅
- [x] 初始化Vite + React + TypeScript项目
- [x] 配置Tailwind CSS
- [x] 安装shadcn/ui核心组件
- [x] 创建基础项目结构

### Phase 2: 文件解析 ✅
- [x] 实现支付宝CSV解析器（含GBK转码）
- [x] 实现微信Excel解析器
- [x] 实现京东CSV解析器
- [x] 数据归一化和验证
- [x] 单元测试

### Phase 3: UI组件 ✅
- [x] 文件上传组件（拖拽+选择）
- [x] 筛选栏（阈值输入+分类下拉，含防抖）
- [x] 统计卡片（4个指标）
- [x] 数据表格（排序+内联编辑）

### Phase 4: 导出功能 ✅
- [x] Excel导出（SheetJS）
- [x] CSV导出（PapaParse，含UTF-8 BOM）
- [x] 文件名生成（带时间戳）

### Phase 5: 测试和优化 ✅
- [x] 使用样例数据测试
- [x] 边界情况测试
- [x] 性能优化（缓存、防抖、预计算）
- [x] 错误处理

**状态：已完成 ✅**

---

## 八、风险和约束

### 8.1 技术风险
| 风险 | 影响 | 缓解措施 | 状态 |
|-----|------|---------|------|
| 浏览器内存限制 | 大文件解析失败 | Web Worker + 分块读取 | 未实现 |
| 编码问题 | 中文乱码 | 使用浏览器原生TextDecoder | ✅ 已解决 |
| Excel库兼容性 | 旧版本文件打不开 | SheetJS支持广泛 | ✅ 已验证 |

### 8.2 已知约束
- 不支持持久化（刷新页面数据丢失）
- 不支持多文件批量上传
- 不支持移动端

---

## 九、技术问题与解决方案

### 9.1 支付宝CSV解析失败（已解决 ✅）

**问题描述：**
- 症状：上传支付宝账单后提示"未找到支出交易记录"
- 根因：GBK编码转换后文本使用Windows风格换行符（`\r\n`），PapaParse无法正确识别行结构，将整个文件当作单行处理（1129列而非正确的12列）

**解决方案：**
```typescript
// 在 readFileWithEncoding() 中，解码成功后立即标准化换行符
const decoder = new TextDecoder('gb18030')
let text = decoder.decode(bytes)
text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')  // 关键修复
```

**应用原则：**
- 数据标准化：在边界处理外部数据格式差异
- 防御式编程：不假设输入数据格式一致性

**相关文件：** `src/parsers/alipayParser.ts:153, 169, 182, 193`

---

### 9.2 React渲染期间setState警告（已解决 ✅）

**问题描述：**
- 症状：控制台警告"Cannot update a component (FileUploader) while rendering a different component (StatisticsCards)"
- 根因：违反React规则 - 在渲染期间（调用`filteredTransactions()`和`statistics()`函数时）调用`set()`更新store

**原始错误架构：**
```typescript
// ❌ 在渲染期间调用set()
filteredTransactions: () => {
  const filtered = transactions.filter(...)
  set({ _filteredCache: filtered })  // 违反React规则！
  return filtered
}
```

**重构后的正确架构：**
```typescript
// ✅ 派生状态预计算，仅在action中更新
interface Store {
  filteredTransactions: Transaction[]  // 预计算的属性（非函数）

  setThreshold: (threshold) => {
    const filtered = computeFiltered(transactions, threshold, category)
    set({ threshold, filteredTransactions: filtered })  // 仅在action中更新
  }
}
```

**应用原则：**
- **单一数据流**：状态变更只在action函数中发生
- **派生状态预计算**：在数据源变化时计算，而非读取时计算
- **纯渲染函数**：组件渲染过程中只读取state，不触发更新
- **DRY原则**：避免在多个组件中重复计算同一派生状态

**相关文件：**
- `src/store/useTransactionStore.ts` - Store重构
- `src/components/StatisticsCards.tsx` - 改用直接读取
- `src/components/TransactionTable.tsx` - 改用直接读取
- `src/components/ExportButtons.tsx` - 改用直接读取
- `src/components/FilterBar.tsx` - 改用选择器模式

**测试结果：** 20个单元测试全部通过 ✅

---

### 9.3 阈值输入卡顿（已解决 ✅）

**问题描述：**
- 症状：调整金额阈值时浏览器卡死
- 根因：每次键盘输入立即触发全量数据过滤和表格重渲染

**解决方案：**
```typescript
// FilterBar组件中实现500ms防抖
const [localThreshold, setLocalThreshold] = useState(threshold.toString())

useEffect(() => {
  const timer = setTimeout(() => {
    const value = parseFloat(localThreshold)
    if (!isNaN(value) && value >= 0) {
      setThreshold(value)  // 延迟更新store
    }
  }, 500)
  return () => clearTimeout(timer)
}, [localThreshold, threshold, setThreshold])
```

**应用原则：**
- 性能优化：防抖高频操作
- 用户体验：本地状态提供即时反馈

**相关文件：** `src/components/FilterBar.tsx:14-31`

---

### 9.4 文件上传后列表不刷新（已解决 ✅）

**问题描述：**
- 症状：上传微信账单后再上传京东账单，列表仍显示微信数据
- 根因：Store缓存未正确失效，`_filteredCache`设为null但缓存条件检查仍通过

**解决方案：**
```typescript
setTransactions: (transactions) => {
  const state = get()
  const filtered = computeFiltered(transactions, state.threshold, state.selectedCategory)
  const categories = computeCategories(transactions)
  set({ transactions, filteredTransactions: filtered, categories })
}
```

**应用原则：**
- 缓存失效：数据源变更时主动重新计算
- 数据一致性：确保派生状态与源数据同步

**相关文件：** `src/store/useTransactionStore.ts:51-56`

---

## 十、未来迭代方向（V2.0）

1. **数据持久化：** 使用IndexedDB存储历史记录
2. **高级分析：** 月度趋势图、分类占比饼图
3. **智能分类：** 基于关键词自动识别商品类别
4. **多文件对比：** 上传多个月账单对比分析
5. **PDF报告：** 生成可视化分析报告

---

## 十一、附录

### 11.1 测试数据位置
```
/Users/liqiang/appplayground/cost-analyzer/sample-data/
├── 支付宝交易明细(20260101-20260131).csv
├── 微信支付账单流水文件(20260101-20260131)_20260204190110.xlsx
└── 京东交易流水(申请时间2026年02月05日09时01分02秒)_118.csv
```

### 11.2 测试覆盖率
```
✓ src/utils/__tests__/export.test.ts (2 tests)
✓ src/store/__tests__/useTransactionStore.test.ts (8 tests)
✓ src/parsers/__tests__/formatters.test.ts (10 tests)

Test Files  3 passed (3)
Tests       20 passed (20)
```

### 11.3 参考文档
- [PapaParse文档](https://www.papaparse.com/)
- [SheetJS文档](https://docs.sheetjs.com/)
- [shadcn/ui文档](https://ui.shadcn.com/)
- [TanStack Table文档](https://tanstack.com/table/latest)
- [Zustand文档](https://docs.pmnd.rs/zustand/getting-started/introduction)

### 11.4 编程原则应用总结

本项目严格遵循以下工程原则：

**KISS（简单至上）：**
- 纯前端架构，无后端复杂度
- 直接使用浏览器原生API（TextDecoder）而非引入额外库
- 简洁的组件结构和清晰的职责划分

**DRY（杜绝重复）：**
- 统一的Transaction类型定义
- 共用的formatters工具函数
- 预计算派生状态，避免多处重复计算

**YAGNI（精益求精）：**
- 仅实现明确需求，不过度设计
- 无持久化（用户未要求）
- 无复杂权限系统（不需要）

**SOLID原则：**
- **单一职责**：每个parser专注一种文件格式
- **开闭原则**：通过解析器工厂扩展新平台
- **依赖倒置**：组件依赖store接口而非实现

---

## 十二、项目交付清单

### 12.1 功能清单
- ✅ 支付宝/微信/京东账单文件上传
- ✅ GBK/UTF-8编码自动处理
- ✅ 大额交易自动筛选（可调阈值）
- ✅ 分类筛选
- ✅ 交易数据表格展示（排序、备注编辑）
- ✅ 统计卡片（笔数/总额/均值/最大）
- ✅ Excel/CSV导出（含时间戳文件名）
- ✅ 20个单元测试全部通过

### 12.2 技术文档
- ✅ PRD产品需求文档（本文档）
- ✅ TypeScript类型定义
- ✅ 内联代码注释
- ✅ 技术问题与解决方案记录

### 12.3 已验证场景
- ✅ 支付宝账单解析（93条支出记录）
- ✅ 微信账单解析
- ✅ 京东账单解析
- ✅ 文件替换上传
- ✅ 阈值动态调整
- ✅ 分类筛选
- ✅ 备注编辑
- ✅ Excel/CSV导出
- ✅ 所有单元测试通过

---

**文档版本：** v1.1
**文档状态：** ✅ 已完成
**项目状态：** ✅ 已交付
**最后更新：** 2026-02-05
