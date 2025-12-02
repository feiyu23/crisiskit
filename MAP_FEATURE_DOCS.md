# 地图可视化功能文档

## 功能概述

CrisisKit现已支持地图可视化，可在地理视图中查看所有紧急响应请求的位置分布。

## 核心功能

### 1. 地图组件 (MapView.tsx)
- **技术**: Leaflet + OpenStreetMap + React Leaflet
- **中心坐标**: 香港 [22.3, 114.2]
- **响应式设计**: 完全适配移动端和桌面端
- **容器高度**: 600px，带圆角和阴影

### 2. GPS坐标解析
**支持格式**:
```
22.12345, 114.54321 (±10m) https://maps.google.com/...
```

**解析功能**:
- 自动提取经纬度坐标
- 识别精度信息 (±Xm)
- 提取地图URL链接
- 验证香港区域范围（22.1-22.6 N, 113.8-114.5 E）

### 3. 颜色编码标记系统

| 紧急度 | 颜色 | 效果 |
|--------|------|------|
| CRITICAL | 红色 (#dc2626) | 脉动动画 |
| MODERATE | 黄色 (#f59e0b) | 静态标记 |
| LOW | 灰色 (#9ca3af) | 静态标记 |
| UNKNOWN | 灰色 (#9ca3af) | 静态标记 |

**脉动动画**: CRITICAL标记会以2秒循环脉动，吸引注意力

### 4. 标记聚类
- **库**: react-leaflet-cluster
- **聚类半径**: 50px
- **功能**:
  - 自动合并相近标记
  - 点击展开聚类（spider效果）
  - 显示聚类内标记数量
  - 缩放到聚类边界

### 5. 交互弹窗 (Popup)

**显示内容**:
- 姓名 + 紧急度徽章
- 状态徽章
- 可拨打的联系方式 (tel: 链接)
- 地区/区域信息
- GPS精度
- 需求描述（最多3行）
- AI评估理由
- 相对时间
- 在地图中打开链接

**交互功能**:
- 点击联系方式可直接拨打电话
- 点击地图链接在新窗口打开
- 响应式布局，最大宽度300px

### 6. 仪表盘集成

**视图切换**:
- Map View: 显示地图
- List View: 显示表格

**筛选功能保持**:
- 地区筛选器工作正常
- 区域筛选器工作正常
- 筛选后的结果同步显示在地图上

**自动适配边界**:
- 地图自动缩放以包含所有标记
- 智能padding (50px)
- 最大缩放级别: 14

### 7. 无数据处理
**场景**: 没有可映射的位置数据
**显示**: 友好的空状态提示
- 地图图标
- "No mappable locations"标题
- 说明文字
- 坐标格式示例

## 技术细节

### 依赖包
```json
{
  "react-leaflet": "^5.0.0",
  "leaflet": "^1.9.4",
  "react-leaflet-cluster": "^4.0.0",
  "@types/leaflet": "^1.9.x"
}
```

### Leaflet默认图标修复
```typescript
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/...',
  iconUrl: 'https://cdnjs.cloudflare.com/...',
  shadowUrl: 'https://cdnjs.cloudflare.com/...',
});
```

### TypeScript类型定义
创建了 `react-leaflet-cluster.d.ts` 以提供类型支持

### CSS导入
```typescript
import 'leaflet/dist/leaflet.css';
```

## 使用方法

### 用户操作流程

1. **访问Incident Dashboard**
   - 导航到任何incident详情页

2. **切换到地图视图**
   - 点击顶部的 "Map View" 按钮

3. **查看标记**
   - 红色脉动标记 = CRITICAL紧急
   - 黄色标记 = MODERATE中等
   - 灰色标记 = LOW/UNKNOWN

4. **点击标记查看详情**
   - 弹出窗口显示完整信息
   - 可直接拨打联系电话
   - 可打开地图链接

5. **使用聚类**
   - 缩小地图时，相近标记自动聚合
   - 点击聚类数字展开查看
   - 缩放到聚类位置

6. **筛选功能**
   - 使用地区/区域筛选器
   - 地图实时更新显示筛选结果

### 管理员配置

**无需配置** - 地图功能开箱即用

**数据要求**:
- Response的 `location` 字段需包含GPS坐标
- 格式: "lat, lng (±精度) URL"
- 示例: "22.123, 114.456 (±10m) https://maps.google.com/..."

## 性能优化

1. **懒加载**: 地图库按需加载
2. **聚类**: 减少大量标记时的渲染压力
3. **Memoization**: useMemo缓存标记数据解析
4. **智能边界**: 仅在响应数据变化时重新计算

## 浏览器兼容性

- Chrome/Edge: 完全支持
- Firefox: 完全支持
- Safari: 完全支持
- 移动浏览器: 完全支持（触摸手势）

## 未来增强

可能的功能扩展：
- 热力图层（密度可视化）
- 路径规划（响应者路线）
- 实时位置更新
- 地理围栏告警
- 自定义地图样式
- 卫星视图切换

## 故障排除

### 问题: 地图不显示
**解决**:
1. 检查浏览器控制台错误
2. 确认 leaflet.css 已加载
3. 验证网络连接（OpenStreetMap）

### 问题: 标记不显示
**解决**:
1. 检查location字段格式
2. 验证坐标在香港范围内
3. 运行AI Triage分类紧急度

### 问题: 聚类不工作
**解决**:
1. 缩小地图查看效果
2. 检查标记数量（>1）
3. 验证聚类库已正确安装

## 文件结构

```
crisiskit-lite/
├── components/
│   └── MapView.tsx          # 主地图组件
├── pages/
│   └── IncidentDashboard.tsx # 集成地图视图
├── react-leaflet-cluster.d.ts # TypeScript类型
└── MAP_FEATURE_DOCS.md      # 本文档
```

## 测试清单

- [x] 地图正确显示
- [x] 标记颜色编码正确
- [x] CRITICAL标记脉动动画
- [x] 聚类功能工作
- [x] 弹窗交互正常
- [x] 联系方式可拨打
- [x] 地图链接可打开
- [x] 筛选器同步工作
- [x] 响应式布局正常
- [x] 无TypeScript错误
- [x] 构建成功

## 贡献者

- 思思狐狸 🦊 - 全栈开发与实现

---

思思指挥官任务完成！🗺️✨
