#!/usr/bin/env node

const gcoord = require('gcoord');

// 坐标系别名映射
const CRS_ALIAS = {
  // WGS84 别名
  'wgs84': 'WGS84',
  'wgs-84': 'WGS84',
  'gps': 'WGS84',
  '地球坐标': 'WGS84',
  '地球坐标系': 'WGS84',

  // GCJ02 别名
  'gcj02': 'GCJ02',
  'gcj-02': 'GCJ02',
  '火星坐标': 'GCJ02',
  '火星坐标系': 'GCJ02',
  '高德': 'GCJ02',
  'amap': 'GCJ02',
  '腾讯': 'GCJ02',

  // BD09 别名
  'bd09': 'BD09',
  'bd-09': 'BD09',
  '百度': 'BD09',
  'baidu': 'BD09',
  'bmap': 'BD09',

  // BD09MC 别名
  'bd09mc': 'BD09MC',
  'bd09-mc': 'BD09MC',
  '百度米制': 'BD09MC',

  // WebMercator 别名
  'webmercator': 'WebMercator',
  '墨卡托': 'WebMercator',
  'epsg3857': 'WebMercator',
  'epsg-3857': 'WebMercator'
};

/**
 * 解析输入格式
 */
function parseInput(input) {
  // GeoJSON 格式
  if (input.trim().startsWith('{')) {
    return { type: 'geojson', data: JSON.parse(input) };
  }

  // 数组格式 [lng, lat]
  if (input.trim().startsWith('[')) {
    return { type: 'array', data: JSON.parse(input) };
  }

  // 批量文本格式（多行）
  if (input.includes('\n')) {
    const lines = input.trim().split('\n');
    const coords = lines.map(line => {
      const parts = line.split(/[,\s]+/).filter(Boolean);
      return [parseFloat(parts[0]), parseFloat(parts[1])];
    });
    return { type: 'batch', data: coords };
  }

  // 单点坐标格式
  const parts = input.split(/[,\s]+/).filter(Boolean);
  if (parts.length >= 2) {
    return { type: 'point', data: [parseFloat(parts[0]), parseFloat(parts[1])] };
  }

  throw new Error('无法解析输入格式');
}

/**
 * 格式化输出（保持与输入相同格式）
 */
function formatOutput(result, inputType) {
  switch (inputType) {
    case 'geojson':
      return JSON.stringify(result);
    case 'array':
      return JSON.stringify(result);
    case 'batch':
      return result.map(c => c.join(', ')).join('\n');
    case 'point':
      return result.join(', ');
    default:
      return JSON.stringify(result);
  }
}

/**
 * 标准化坐标系代码
 */
function normalizeCRS(code) {
  const normalized = code.toLowerCase().trim();
  return CRS_ALIAS[normalized] || code.toUpperCase();
}

// 命令行参数解析
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^-+/, '');
  params[key] = args[i + 1];
}

// 执行转换
try {
  const input = parseInput(params.input || params.i || '');
  const from = normalizeCRS(params.from || params.f || 'WGS84');
  const to = normalizeCRS(params.to || params.t || 'GCJ02');

  let result;
  if (input.type === 'geojson') {
    result = gcoord.transform(input.data, gcoord[from], gcoord[to]);
  } else {
    result = gcoord.transform(input.data, gcoord[from], gcoord[to]);
  }

  const output = formatOutput(result, input.type);

  console.log(`转换: ${from} → ${to}`);
  console.log('结果:', output);

} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
