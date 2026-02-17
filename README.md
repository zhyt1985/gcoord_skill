# Gcoord Skill

一个用于 Claude Code 的地理坐标系转换工具，专门处理中国地图坐标系互转问题。

## 功能特性

- 🔄 **多坐标系支持**：WGS84 / GCJ02 / BD09 / BD09MC / WebMercator
- 📄 **文件操作**：支持读取 GeoJSON 文件并进行批量转换
- 🚀 **大文件处理**：自动使用流式处理，支持超过 10MB 的大型文件
- 📊 **进度显示**：实时显示转换进度，便于监控大批量数据处理
- 💬 **自然语言**：支持中英文自然语言指令调用
- 🌏 **坐标系别名**：支持 `高德`、`百度`、`GPS` 等中文别名

## 支持的坐标系

| 代码 | 中文名称 | 适用平台 | 别名 |
|------|----------|----------|------|
| WGS84 | 地球坐标系 | GPS 原始坐标 | `gps`, `地球坐标` |
| GCJ02 | 火星坐标系 | 高德、腾讯地图 | `高德`, `amap`, `腾讯`, `火星坐标` |
| BD09 | 百度坐标系 | 百度地图 | `百度`, `baidu`, `bmap` |
| BD09MC | 百度米制坐标 | 百度地图米制 | `百度米制` |
| WebMercator | 墨卡托投影 | Web 地图 | `墨卡托`, `epsg3857` |

## 安装

将此 skill 安装到 `~/.claude/skills/gcoord/` 目录：

```bash
git clone https://github.com/zhyt1985/gcoord_skill.git ~/.claude/skills/gcoord_skill
cd ~/.claude/skills/gcoord_skill/gcoord
npm install
```

## 使用方法

### 在 Claude Code 中使用

使用自然语言调用：

```
# 单点坐标转换
帮我把 116.403988,39.914266 转成高德坐标

# 文件转换
把 data.geojson 转成百度坐标系

# 坐标系互转
WGS84 转 GCJ02: [116.403988, 39.914266]
```

### 命令行使用

```bash
# 单点坐标转换
node index.js --input "116.403988,39.914266" --from WGS84 --to GCJ02

# GeoJSON 字符串转换
node index.js --input '{"type":"Point","coordinates":[116.403988,39.914266]}' --from WGS84 --to BD09

# 文件转换
node index.js --file data.geojson --from WGS84 --to GCJ02 --output result.geojson

# 原地转换（覆盖原文件）
node index.js --file data.geojson --from WGS84 --to GCJ02 --in-place

# 大文件流式处理
node index.js --file large-data.geojson --from WGS84 --to GCJ02 --stream
```

### 命令行参数

| 参数 | 简写 | 说明 |
|------|------|------|
| `--input <string>` | `-i` | 输入坐标或 GeoJSON 字符串 |
| `--file <path>` | `-F` | 指定输入文件路径 |
| `--output <path>` | `-o` | 指定输出文件路径 |
| `--from <crs>` | `-f` | 源坐标系 |
| `--to <crs>` | `-t` | 目标坐标系 |
| `--in-place` | `-I` | 原地转换，覆盖原文件 |
| `--stream` | `-s` | 强制启用流式处理 |

## 使用示例

### 示例 1：转换单点坐标

```bash
node index.js --input "116.403988,39.914266" --from WGS84 --to GCJ02
```

**输出：**
```
转换: WGS84 → GCJ02
结果: 116.410232, 39.915670
```

### 示例 2：转换 GeoJSON 文件

```bash
node index.js --file beijing-poi.geojson --from WGS84 --to GCJ02 --output beijing-poi-gcj02.geojson
```

**输出：**
```
文件: beijing-poi.geojson
大小: 0.83 MB
转换: WGS84 → GCJ02

处理中...
[██████████████████████████████] 100.0% (853/853) ETA: 0.0s
✓ 已保存到: beijing-poi-gcj02.geojson
```

### 示例 3：使用中文别名

```bash
# 使用中文别名
node index.js --input "116.403988,39.914266" --from gps --to 高德

# 转换到百度坐标系
node index.js --file data.geojson --from wgs84 --to 百度
```

## 支持的输入格式

- **单点坐标**：`116.403988,39.914266`
- **坐标数组**：`[116.403988, 39.914266]`
- **GeoJSON 字符串**：`{ "type": "Point", "coordinates": [...] }`
- **GeoJSON 文件**：通过 `--file` 参数指定

## 依赖

- [gcoord](https://github.com/hujiulong/gcoord) v1.0.7 - 坐标转换核心库

## 注意事项

1. **坐标系选择**：GPS 设备获取的原始坐标是 WGS84，在中国地图服务上显示需要先转换为 GCJ02（高德/腾讯）或 BD09（百度）
2. **原地转换**：使用 `--in-place` 会直接覆盖原文件，请确保有备份
3. **大文件处理**：文件大于 10MB 时自动启用流式处理以节省内存

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [Claude Code](https://claude.ai/code) - Claude AI 的命令行工具
- [gcoord 库](https://github.com/hujiulong/gcoord) - 坐标转换核心算法
