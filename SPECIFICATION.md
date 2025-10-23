# Stock Dashboard - 功能规格说明 (Specification)

> **版本**: 1.0  
> **创建日期**: 2025-10-12  
> **用途**: AI代码生成参考文档

---

## 1. 项目概述

### 1.1 项目名称
股票/ETF量化分析仪表盘系统

### 1.2 核心功能
一个基于JavaScript的前端应用，用于展示和分析ETF数据，支持自定义脚本计算、动量分析、列管理等高级功能。

### 1.3 技术栈
- **前端**: 纯JavaScript (Vanilla JS) + HTML + CSS
- **数据格式**: JSON
- **运行环境**: 浏览器（支持ES6+）
- **依赖**: 无外部框架依赖

---

## 2. 数据结构规范

### 2.1 输入数据格式

```json
{
  "stocks": [
    {
      "info": {
        "symbol": "510010",
        "name": "ETF510010",
        "market": "上海"
      },
      "data": [
        {
          "date": "20240902",
          "open": null,
          "high": null,
          "low": null,
          "close": 1.412,
          "volume": null,
          "turnover": null,
          "change": 0,
          "changePercent": 0,
          "amplitude": null,
          "turnoverRate": null,
          "pe": null,
          "pb": null,
          "marketCap": null,
          "circulatingCap": null,
          "premium": null,
          "marginTradable": null
        }
      ]
    }
  ]
}
```

### 2.2 数据字段说明

#### 股票基本信息 (info)
- `symbol`: String - ETF代码
- `name`: String - ETF名称
- `market`: String - 所属市场（"上海" | "深圳"）

#### 每日交易数据 (data[])
- `date`: String - 交易日期 (YYYYMMDD格式)
- `close`: Number - **收盘价（必需，唯一真实数据源）**
- `change`: Number - 涨跌额（自动计算）
- `changePercent`: Number - 涨跌幅%（自动计算）
- 其他字段: null | Number - 可选扩展字段

---

## 3. 核心功能需求

### 3.1 数据展示

#### 3.1.1 表格展示
- **需求**: 以表格形式展示股票列表和计算结果
- **特性**:
  - 响应式布局
  - 固定表头
  - 行悬停高亮
  - 支持大数据量（200+ 股票）

#### 3.1.2 列配置系统
列分为两类：

**基础信息列** (Basic Columns):
- 名称
- 代码
- 最新价格
- 当天涨跌幅
- 溢折率
- 成交额
- 换手率
- 5日/10日/20日/30日/60日涨跌幅
- 是否可融资

**量化计算列** (Quantitative Columns):
- 动量26天/29天/31天/34天
- 动量二阶导数26天/29天/31天/34天
- 站上均线天数

### 3.2 列管理功能

#### 3.2.1 列显示设置
- **需求**: 用户可勾选/取消勾选列来控制显示
- **实现**: 
  - 两个独立的复选框区域（基础信息列 + 量化计算列）
  - 点击复选框立即生效
  - 设置持久化到localStorage

#### 3.2.2 列排序
- **需求**: 点击列表头进行升序/降序排序
- **交互**: 
  - 首次点击：升序 ↑
  - 再次点击：降序 ↓
  - 表头显示排序指示器
  - 只支持单列排序

#### 3.2.3 列拖拽排序（预留）
- **需求**: 支持拖拽调整列顺序
- **状态**: 当前版本未实现，接口预留

### 3.3 脚本引擎

#### 3.3.1 自定义列脚本
- **需求**: 每列通过JavaScript脚本定义计算逻辑
- **脚本上下文**:
  ```javascript
  {
    stock: { symbol, name, market },      // 股票基本信息
    latest: { date, close, change, ... }, // 最新交易日数据
    data: [...],                          // 完整历史数据数组
    
    // 工具函数
    period(days),                         // 获取最近N天数据
    avg(field, days),                     // 字段平均值
    sum(field, days),                     // 字段求和
    max(field, days),                     // 字段最大值
    min(field, days),                     // 字段最小值
    sma(days),                            // 简单移动平均
    momentum(days),                       // 动量得分
    momentumSecondDerivative(days),       // 动量二阶导数
    daysAboveAllMA(),                     // 站上均线天数
    periodReturn(days)                    // N日收益率
  }
  ```

#### 3.3.2 脚本示例

**简单脚本**:
```javascript
// 最新价格
return latest.close;

// 当天涨跌幅
return latest.changePercent;

// 5日涨跌幅
return periodReturn(5);
```

**复杂脚本（动量计算）**:
```javascript
const days = 26;
const periodData = data.slice(-Math.min(days, data.length));
if (periodData.length < 10) return 0;

// 对数价格
const logPrices = periodData.map(item => Math.log(item.close));
const n = logPrices.length;
const x = Array.from({length: n}, (_, i) => i);

// 线性增加权重
const weights = Array.from({length: n}, (_, i) => 1 + i / (n - 1));

// 加权线性回归
const sumW = weights.reduce((sum, w) => sum + w, 0);
const sumWX = weights.reduce((sum, w, i) => sum + w * x[i], 0);
const sumWY = weights.reduce((sum, w, i) => sum + w * logPrices[i], 0);
const sumWXX = weights.reduce((sum, w, i) => sum + w * x[i] * x[i], 0);
const sumWXY = weights.reduce((sum, w, i) => sum + w * x[i] * logPrices[i], 0);

const slope = (sumW * sumWXY - sumWX * sumWY) / (sumW * sumWXX - sumWX * sumWX);
const intercept = (sumWY - slope * sumWX) / sumW;

// 年化收益率 = (e^slope)^250 - 1
const annualizedReturn = Math.pow(Math.exp(slope), 250) - 1;

// 加权R²
const yMean = sumWY / sumW;
let ssTot = 0, ssRes = 0;
for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    ssTot += weights[i] * Math.pow(logPrices[i] - yMean, 2);
    ssRes += weights[i] * Math.pow(logPrices[i] - predicted, 2);
}
const rSquared = 1 - (ssRes / ssTot);

// 最终得分 = 年化收益率 × R²
return annualizedReturn * rSquared;
```

#### 3.3.3 脚本编辑器
- **功能**: 
  - 下拉选择要编辑的列
  - 文本框编辑脚本代码
  - 输入列名
  - 验证脚本语法
  - 添加/修改列
  - 查看脚本模板

### 3.4 缓存机制

#### 3.4.1 计算结果缓存
- **需求**: 避免重复计算，提升性能
- **实现**: 
  - 使用Map存储计算结果
  - 缓存键：`${股票代码}_${列ID}`
  - 列隐藏/显示时清除相关缓存
  - 数据刷新时清空所有缓存

### 3.5 数据持久化

#### 3.5.1 列设置持久化
- **需求**: 刷新页面后保持用户的列显示设置
- **实现**: 
  - 使用localStorage存储
  - 键名: `stockDashboard_columnSettings`
  - 存储内容: `{ columnId: { visible, width } }`
  - 页面加载时自动恢复设置

#### 3.5.2 重置功能
- **需求**: 提供"重置列设置"按钮恢复默认配置
- **实现**: 清除localStorage并重新加载页面

---

## 4. 量化计算规范

### 4.1 动量得分计算

**算法要求**:
1. 使用加权线性回归（权重线性递增）
2. 对收盘价取对数
3. 计算回归斜率和截距
4. 年化收益率公式: `(e^slope)^250 - 1`
5. 计算加权R²
6. 最终得分 = 年化收益率 × R²

**参数**:
- 支持多个周期: 26天、29天、31天、34天
- 最少数据点: 10个

### 4.2 动量二阶导数

**算法要求**:
1. 计算当前周期动量 M(t)
2. 计算前一个周期动量 M(t-1)
3. 计算前两个周期动量 M(t-2)
4. 一阶导数: `M'(t) = M(t) - M(t-1)`
5. 前一阶导数: `M'(t-1) = M(t-1) - M(t-2)`
6. 二阶导数: `M''(t) = M'(t) - M'(t-1)`

**用途**: 识别动量加速/减速变化

### 4.3 周期收益率

**公式**: 
```javascript
periodReturn(days) = ((最新价 - N天前价格) / N天前价格) × 100
```

### 4.4 站上均线天数

**算法要求**:
1. 计算5/10/20/30/60日简单移动平均线
2. 从最新日期向前遍历
3. 统计连续站上所有均线的天数
4. 任一均线跌破则停止计数

---

## 5. 用户界面规范

### 5.1 布局结构

```
┌─────────────────────────────────────────┐
│ 头部标题区                                │
│ - 标题："股票数据展示系统"                 │
│ - 副标题：功能描述                         │
│ - 刷新按钮、脚本编辑器按钮                  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 列显示设置区                               │
│ ├─ 基础信息列（复选框）                    │
│ └─ 量化计算列（复选框）                    │
│ 重置列设置按钮                             │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 数据表格区                                 │
│ ├─ 表头（可点击排序）                      │
│ └─ 数据行                                 │
│ 统计信息（共N只股票，排序状态）             │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 脚本编辑器（可折叠）                        │
│ ├─ 选择列下拉框                           │
│ ├─ 列名输入框                             │
│ ├─ 脚本代码文本框                         │
│ └─ 操作按钮（添加/验证/模板）              │
└─────────────────────────────────────────┘
```

### 5.2 样式规范

#### 5.2.1 颜色方案
- 主背景: `#f9fafb`
- 卡片背景: `#ffffff`
- 边框: `#e5e7eb`
- 主色调: `#3b82f6` (蓝色)
- 正值: `#dc2626` (红色)
- 负值: `#16a34a` (绿色)
- 中性: `#6b7280` (灰色)

#### 5.2.2 表格样式
- 表头背景: `#f9fafb`
- 行高: `padding: 15px 20px`
- 悬停效果: 背景变浅
- 排序指示器: ↕ ↑ ↓

#### 5.2.3 响应式
- 最大宽度: 1200px
- 移动端适配（<768px）
- 字体缩放

### 5.3 数据格式化

| 格式类型 | 规则 | 示例 |
|---------|------|------|
| `text` | 原样显示 | "ETF510010" |
| `number` | 保留N位小数 | "0.1234" |
| `currency` | 千分位+2位小数 | "1,234.56" |
| `percent` | 百分号+2位小数 | "12.34%" |
| `null` | 显示"--" | "--" |

---

## 6. 交互行为规范

### 6.1 数据加载

**流程**:
1. 尝试加载 `realTestData.json`（完整数据）
2. 失败则加载 `sampleTestData.json`（样本数据）
3. 再失败则加载 `testData.json`（备用数据）
4. 显示加载错误提示

### 6.2 列显示切换

**流程**:
1. 用户点击复选框
2. 更新列配置的visible属性
3. 同步更新basicColumns和quantitativeColumns
4. 保存到localStorage
5. 清除相关缓存
6. 重新计算表格数据
7. 重新渲染表格

### 6.3 列排序

**流程**:
1. 用户点击列表头
2. 判断当前排序状态
   - 未排序 → 升序
   - 升序 → 降序
   - 降序 → 升序
3. 更新sortConfig
4. 重新渲染表格
5. 显示排序指示器

### 6.4 脚本编辑

**流程**:
1. 选择列 → 加载该列的脚本和名称
2. 编辑脚本 → 实时编辑
3. 点击"验证脚本" → 语法检查
4. 点击"添加/修改列" → 更新列配置并刷新表格

### 6.5 数据刷新

**流程**:
1. 点击"刷新数据"按钮
2. 清空scriptCache
3. 重新加载数据
4. 重新计算
5. 重新渲染

---

## 7. 性能要求

### 7.1 计算性能
- 使用缓存避免重复计算
- 单次完整计算时间 < 1秒（200只股票）
- 排序操作 < 100ms

### 7.2 渲染性能
- 初始渲染 < 500ms
- 列切换/排序 < 200ms
- 避免不必要的DOM操作

### 7.3 内存管理
- 使用Map而非Object存储缓存
- 及时清理过期缓存
- 避免内存泄漏

---

## 8. 扩展接口设计

### 8.1 数据源接口（预留）

```typescript
interface DataSource {
  // 加载股票数据
  loadStocks(): Promise<Stock[]>;
  
  // 刷新单只股票
  refreshStock(symbol: string): Promise<Stock>;
  
  // 批量更新
  batchUpdate(symbols: string[]): Promise<Stock[]>;
}
```

### 8.2 列配置接口

```typescript
interface ColumnConfig {
  id: string;              // 列唯一标识
  name: string;            // 显示名称
  script: string;          // 计算脚本
  visible: boolean;        // 是否可见
  width: number;           // 列宽度
  sortable: boolean;       // 是否可排序
  format: 'text' | 'number' | 'currency' | 'percent';
  decimals?: number;       // 小数位数
  category: 'basic' | 'quantitative';  // 列类别
}
```

### 8.3 脚本上下文接口

```typescript
interface ScriptContext {
  stock: StockInfo;        // 基本信息
  latest: DailyData;       // 最新数据
  data: DailyData[];       // 历史数据
  
  // 工具函数
  period: (days: number) => DailyData[];
  avg: (field: string, days: number) => number;
  sum: (field: string, days: number) => number;
  max: (field: string, days: number) => number;
  min: (field: string, days: number) => number;
  sma: (days: number) => number;
  momentum: (days: number) => number;
  momentumSecondDerivative: (days: number) => number;
  daysAboveAllMA: () => number;
  periodReturn: (days: number) => number;
}
```

### 8.4 事件系统（预留）

```typescript
// 列变化事件
onColumnChange(callback: (columnId: string, visible: boolean) => void);

// 排序变化事件
onSortChange(callback: (columnId: string, direction: 'asc' | 'desc') => void);

// 数据刷新事件
onDataRefresh(callback: (stocks: Stock[]) => void);

// 脚本执行错误事件
onScriptError(callback: (error: Error, columnId: string) => void);
```

---

## 9. 文件结构

```
stock-dashboard-simple/
├── index.html              # 主页面
├── app.js                  # 核心应用逻辑
├── etf/                    # 原始数据目录
│   ├── SH/                 # 上海市场
│   │   └── price_*.txt     # 价格数据文件
│   └── SZ/                 # 深圳市场
│       └── price_*.txt     # 价格数据文件
├── generateRealData.js     # 数据生成脚本
├── createSampleData.js     # 样本数据生成脚本
├── realTestData.json       # 完整真实数据
├── sampleTestData.json     # 样本数据
├── testData.json           # 备用测试数据
├── DATA_STRUCTURE.md       # 数据结构文档
└── SPECIFICATION.md        # 本规格说明文档
```

---

## 10. 实现要点

### 10.1 必须实现
✅ 表格展示  
✅ 列显示切换  
✅ 列排序  
✅ 脚本引擎  
✅ 缓存机制  
✅ 设置持久化  
✅ 动量计算  
✅ 数据格式化  

### 10.2 可选实现
⭕ 列拖拽排序（预留接口）  
⭕ 实时数据更新（预留接口）  
⭕ 导出功能  
⭕ 图表可视化  
⭕ 数据筛选  

### 10.3 禁止事项
❌ 不使用外部框架（React/Vue等）  
❌ 不修改原始数据文件  
❌ 不在前端生成随机数据  
❌ 不硬编码股票列表  

---

## 11. 测试用例

### 11.1 功能测试

```javascript
// 测试1: 数据加载
- 加载realTestData.json成功
- 显示正确的股票数量
- 数据格式符合规范

// 测试2: 列显示切换
- 勾选列后立即显示
- 取消勾选后立即隐藏
- 设置保存到localStorage
- 刷新页面后设置保持

// 测试3: 排序功能
- 点击表头切换排序方向
- 数据按升序/降序正确排列
- 排序指示器正确显示

// 测试4: 脚本执行
- 简单脚本正确计算
- 复杂动量脚本正确计算
- 错误脚本显示错误信息

// 测试5: 缓存机制
- 首次计算缓存结果
- 再次访问使用缓存
- 切换列清除相关缓存
```

### 11.2 性能测试

```javascript
// 测试1: 大数据量
- 200只股票 × 263天数据
- 初始加载 < 1秒
- 排序操作 < 100ms

// 测试2: 复杂计算
- 动量计算（含回归分析）
- 单只股票 < 10ms
- 全部股票 < 1秒（使用缓存）

// 测试3: 内存占用
- 完整数据加载后 < 100MB
- 无内存泄漏
```

---

## 12. 已知限制

1. **数据完整性**: 仅有收盘价，无开高低、成交量等数据
2. **浏览器兼容**: 需要ES6+支持
3. **并发处理**: 单线程计算，大数据量可能卡顿
4. **数据实时性**: 静态JSON文件，无实时更新
5. **列拖拽**: 当前版本未实现

---

## 13. 后续优化方向

1. **Web Worker**: 将计算移至后台线程
2. **虚拟滚动**: 支持更大数据量（1000+股票）
3. **列拖拽**: 实现拖拽调整列顺序
4. **图表集成**: 添加K线图、趋势图
5. **数据筛选**: 添加高级筛选器
6. **导出功能**: 导出Excel/CSV
7. **WebSocket**: 实时数据推送
8. **插件系统**: 支持自定义计算插件

---

## 附录A: 快速开始示例

```javascript
// 1. 加载数据
const response = await fetch('./sampleTestData.json');
const jsonData = await response.json();

// 2. 定义列
const columns = [
  {
    id: 'name',
    name: '名称',
    script: 'return stock.name;',
    visible: true,
    format: 'text'
  },
  {
    id: 'latest_price',
    name: '最新价格',
    script: 'return latest.close;',
    visible: true,
    format: 'currency'
  }
];

// 3. 执行脚本计算
const tableData = stocks.map(stock => {
  const context = createScriptContext(stock.info, stock.data);
  return columns.reduce((row, col) => {
    row[col.id] = executeScript(col.script, context);
    return row;
  }, {});
});

// 4. 渲染表格
renderTable(tableData, columns);
```

---

**文档结束**

> 此规格文档定义了股票仪表盘系统的完整功能需求和技术规范，可作为AI代码生成的参考。实际实现时，接口和细节可根据具体需求调整。
