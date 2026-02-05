# Cost Analyzer - 成本分析工具

一个纯前端的账单分析工具，用于分析微信/支付宝/京东账单，筛选大额支出并导出分析结果。

## ✨ 特性

- 🔒 **隐私安全**: 数据完全在浏览器本地处理，不上传服务器
- 📊 **多平台支持**: 支持微信、支付宝、京东三大平台账单
- 🎯 **智能筛选**: 可调金额阈值，快速定位大额支出
- 🏷️ **分类管理**: 按分类筛选交易记录
- 📝 **备注功能**: 为交易添加自定义备注
- 📤 **灵活导出**: 支持导出为 Excel 或 CSV 格式
- 🎨 **现代界面**: 基于 Tailwind CSS 的清新界面设计

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

## 📖 使用指南

### 1. 上传账单文件

- 拖拽文件到上传区域，或点击选择文件
- 支持 `.csv` 和 `.xlsx` 格式
- 自动识别平台（微信/支付宝/京东）

### 2. 设置筛选条件

- **金额阈值**: 默认 500 元，可自定义
- **分类筛选**: 选择特定分类查看

### 3. 查看分析结果

- 查看统计卡片：交易笔数、总金额、平均金额、最大单笔
- 浏览详细交易表格，支持排序
- 点击备注列添加自定义备注

### 4. 导出数据

- 点击"导出 Excel"或"导出 CSV"
- 仅导出符合筛选条件的大额交易

## 📋 账单文件格式

### 支付宝账单

- **格式**: CSV (GBK 编码)
- **导出路径**: 支付宝 App → 我的 → 账单 → 右上角设置 → 下载账单
- **注意**: 选择"仅支出"类型

### 微信账单

- **格式**: Excel (.xlsx)
- **导出路径**: 微信 → 我 → 服务 → 钱包 → 账单 → 常见问题 → 下载账单
- **注意**: 选择"全部"或"支出"类型

### 京东账单

- **格式**: CSV (UTF-8 编码)
- **导出路径**: 京东 App → 我的 → 我的钱包 → 交易明细 → 导出
- **注意**: 选择"支出"类型

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **表格**: @tanstack/react-table
- **状态管理**: Zustand
- **文件解析**: PapaParse (CSV), SheetJS (Excel)
- **测试**: Vitest

## 📁 项目结构

```
cost-analyzer/
├── src/
│   ├── components/        # React 组件
│   │   ├── ui/           # 基础 UI 组件
│   │   ├── FileUploader.tsx
│   │   ├── FilterBar.tsx
│   │   ├── StatisticsCards.tsx
│   │   ├── TransactionTable.tsx
│   │   └── ExportButtons.tsx
│   ├── parsers/          # 文件解析器
│   │   ├── alipayParser.ts
│   │   ├── wechatParser.ts
│   │   ├── jdParser.ts
│   │   └── index.ts
│   ├── store/            # Zustand 状态管理
│   │   └── useTransactionStore.ts
│   ├── types/            # TypeScript 类型定义
│   │   └── transaction.ts
│   ├── utils/            # 工具函数
│   │   ├── formatters.ts
│   │   └── export.ts
│   ├── App.tsx
│   └── main.tsx
├── sample-data/          # 测试数据
├── PRD.md               # 产品需求文档
└── README.md
```

## 🧪 测试

项目包含完整的单元测试：

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test -- --watch

# 查看覆盖率
npm run test -- --coverage
```

测试覆盖：
- 工具函数测试 (formatters, export)
- 状态管理测试 (useTransactionStore)
- 组件集成测试

## 🔒 隐私说明

- ✅ 所有数据在浏览器本地处理
- ✅ 不发送任何数据到服务器
- ✅ 不使用任何第三方追踪
- ✅ 不保存历史记录（刷新页面数据清空）

## 📝 开发日志

完整的开发过程和需求分析请参考 [PRD.md](./PRD.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
