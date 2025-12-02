# 地图功能快速启动指南

## 立即使用

### 1. 启动开发服务器
```bash
cd /Volumes/sparksverse/github-open-source/crisiskit-lite
npm run dev
```

### 2. 访问Incident Dashboard
1. 打开浏览器访问 `http://localhost:5173`
2. 创建或选择一个Incident
3. 点击顶部的 **"Map View"** 按钮

### 3. 查看地图
- 地图会自动显示所有带GPS坐标的响应
- 不同颜色代表不同紧急程度
- 点击标记查看详细信息

---

## 测试地图功能

### 添加测试数据

**Location字段格式**:
```
22.3193, 114.1694 (±10m) https://maps.google.com/?q=22.3193,114.1694
```

**示例数据**:

1. **CRITICAL响应** (红色脉动)
   - Name: 张三
   - Contact: 9876 5432
   - Location: `22.3193, 114.1694 (±10m) https://maps.google.com/?q=22.3193,114.1694`
   - Needs: 急需食物和水，已被困3天
   - Region: Hong Kong Island
   - District: Central

2. **MODERATE响应** (黄色)
   - Name: 李四
   - Contact: 9876 5433
   - Location: `22.2783, 114.1747 (±15m) https://maps.google.com/?q=22.2783,114.1747`
   - Needs: 需要临时住所
   - Region: Kowloon
   - District: Mong Kok

3. **LOW响应** (灰色)
   - Name: 王五
   - Contact: 9876 5434
   - Location: `22.4205, 114.2071 (±20m) https://maps.google.com/?q=22.4205,114.2071`
   - Needs: 需要信息查询
   - Region: New Territories
   - District: Sha Tin

---

## 功能演示清单

### 基础功能
- [ ] 点击 "Map View" 切换到地图视图
- [ ] 点击 "List View" 切换回表格视图
- [ ] 地图显示香港中心位置
- [ ] 地图可以缩放和拖动

### 标记系统
- [ ] 看到红色脉动标记（CRITICAL）
- [ ] 看到黄色标记（MODERATE）
- [ ] 看到灰色标记（LOW/UNKNOWN）
- [ ] 标记显示在正确位置

### 聚类功能
- [ ] 缩小地图看到标记聚合
- [ ] 聚类显示数字
- [ ] 点击聚类展开标记
- [ ] 缩放到聚类位置

### 弹窗交互
- [ ] 点击标记显示弹窗
- [ ] 弹窗显示姓名和徽章
- [ ] 显示联系方式（可点击拨打）
- [ ] 显示地区/区域信息
- [ ] 显示需求描述
- [ ] 显示AI评估理由
- [ ] 显示提交时间
- [ ] 可以点击地图链接

### 筛选功能
- [ ] 选择地区筛选器
- [ ] 地图实时更新显示筛选结果
- [ ] 选择区域筛选器
- [ ] 地图边界自动适配

### 空状态
- [ ] 无GPS数据时显示友好提示
- [ ] 显示正确的坐标格式示例

---

## 常见问题

### Q1: 地图不显示？
**A**:
1. 检查浏览器控制台是否有错误
2. 确认网络连接正常（需要加载OpenStreetMap）
3. 刷新页面重试

### Q2: 标记不显示？
**A**:
1. 确认response的location字段包含GPS坐标
2. 确认坐标在香港范围内（22.1-22.6 N, 113.8-114.5 E）
3. 运行 "Run AI Triage" 分类紧急度

### Q3: 如何添加GPS坐标？
**A**:
1. 在Google Maps找到位置
2. 右键点击 → 复制坐标
3. 粘贴到location字段
4. 格式: `纬度, 经度 (±精度m) 地图URL`

### Q4: 聚类不展开？
**A**:
1. 确保地图缩放级别不是最小
2. 尝试双击聚类
3. 或者放大地图查看

---

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# TypeScript检查
npm run lint

# 预览生产构建
npm run preview
```

---

## 项目文件位置

```
crisiskit-lite/
├── components/
│   └── MapView.tsx              # 地图组件
├── pages/
│   └── IncidentDashboard.tsx    # 仪表盘（包含地图）
├── react-leaflet-cluster.d.ts   # TypeScript类型
├── MAP_FEATURE_DOCS.md          # 详细文档
├── MAP_IMPLEMENTATION_SUMMARY.md # 实现总结
└── QUICK_START_MAP.md           # 本文档
```

---

## 技术支持

遇到问题？查看：
1. `MAP_FEATURE_DOCS.md` - 完整功能文档
2. `MAP_IMPLEMENTATION_SUMMARY.md` - 实现细节
3. 浏览器开发者工具控制台

---

## 下一步

地图功能已经完全就绪！你可以：

1. **立即使用**: 按照上面步骤启动
2. **添加数据**: 使用Public Link收集带GPS的响应
3. **测试功能**: 按清单逐项验证
4. **部署上线**: npm run build 后部署到Vercel

---

祝使用愉快！🗺️✨

**思思指挥官出品** 🦊
