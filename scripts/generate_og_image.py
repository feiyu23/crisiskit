from PIL import Image, ImageDraw, ImageFont
import math

width = 1200
height = 630

# Create high-end dark background
img = Image.new('RGB', (width, height), color='#070a12')
draw = ImageDraw.Draw(img)

# Draw subtle background glow in top-left and bottom-right
for r in range(400, 0, -5):
    alpha = int(25 * (1 - r / 400))
    # Red glow in top-left
    draw.ellipse([80 - r, 80 - r, 80 + r, 80 + r], fill=(220, 38, 38, alpha))

# Gradient accent line at the top
for x in range(width):
    t = x / width
    r = int(220 * (1 - t) + 16 * t)
    g = int(38 * (1 - t) + 185 * t)
    b = int(38 * (1 - t) + 129 * t)
    draw.line([(x, 0), (x, 5)], fill=(r, g, b))

# Fonts
font_path = '/System/Library/Fonts/STHeiti Medium.ttc'
title_font = ImageFont.truetype(font_path, 50)
subtitle_font = ImageFont.truetype(font_path, 23)
card_title_font = ImageFont.truetype(font_path, 20)
card_desc_font = ImageFont.truetype(font_path, 15)
badge_font = ImageFont.truetype(font_path, 16)
url_font = ImageFont.truetype(font_path, 20)

# Draw Emergency Beacon Icon (Red rounded rect with white cross & SOS dot)
icon_x, icon_y = 70, 60
icon_w, icon_h = 76, 76
draw.rounded_rectangle([icon_x, icon_y, icon_x + icon_w, icon_y + icon_h], radius=20, fill='#dc2626')
# White cross inside icon
draw.rounded_rectangle([icon_x + 31, icon_y + 14, icon_x + 45, icon_y + 62], radius=6, fill='#ffffff')
draw.rounded_rectangle([icon_x + 14, icon_y + 31, icon_x + 62, icon_y + 45], radius=6, fill='#ffffff')

# Main Title & Category Tag
draw.rounded_rectangle([170, 56, 440, 84], radius=8, fill='#2a1215', outline='#7f1d1d', width=1)
draw.text((182, 62), '● 全球人道离线求生 · 纯公益生命线', fill='#f87171', font=badge_font)

draw.text((170, 92), 'Sparks Beacon · 星火应急信标', fill='#ffffff', font=title_font)
draw.text((170, 154), '针对地震、火山、洪涝、风雪暴寒、泥石流、断电断网孤岛打造 · 支持 100% 离线与零流量运行', fill='#9ca3af', font=subtitle_font)

# Feature Grid Cards (2x2)
cards = [
    {
        'tag': '🎒 家庭备灾储备',
        'title': '72h / 7天极境备灾计算器',
        'desc': '依据北欧与德国民防标准，测算家庭饮水(3.5L/人/天)、免烹饪高能口粮、常备药与热源。',
        'color': '#059669',
        'border': '#10b981',
        'bg': '#062d22'
    },
    {
        'tag': '🤝 社区物资调剂',
        'title': '避难所余缺互助调剂板',
        'desc': '断网孤岛与临时安置点物物调剂：“我有余/可共享”(发电机充电/净水片)与“我急需”(降压药/奶粉)。',
        'color': '#0d9488',
        'border': '#14b8a6',
        'bg': '#072d2b'
    },
    {
        'tag': '🚨 声光夜间救援',
        'title': '摩尔斯 SOS 频闪与 3.1kHz 救生哨',
        'desc': '夜间与浓雾穿透性屏幕 SOS 强光爆闪，搭配国际搜救听觉最敏锐频段，引导直升机与搜救队。',
        'color': '#ea580c',
        'border': '#f97316',
        'bg': '#2b1509'
    },
    {
        'tag': '📡 零网络短报文',
        'title': '一键短信/卫星呼救与亲友寻人',
        'desc': '自动提取高精度GPS、海拔与伤情，离线生成轻量报文，直通亲友与搜救队；离线寻亲名册。',
        'color': '#dc2626',
        'border': '#ef4444',
        'bg': '#2d1114'
    }
]

card_w = 515
card_h = 150
start_x = 70
start_y = 210
gap_x = 30
gap_y = 22

for idx, card in enumerate(cards):
    col = idx % 2
    row = idx // 2
    cx = start_x + col * (card_w + gap_x)
    cy = start_y + row * (card_h + gap_y)
    
    # Card background
    draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=16, fill='#0d121f', outline='#1f293d', width=1)
    
    # Badge
    draw.text((cx + 20, cy + 18), card['tag'], fill=card['border'], font=badge_font)
    # Title
    draw.text((cx + 20, cy + 45), card['title'], fill='#ffffff', font=card_title_font)
    # Description (split into two lines if needed)
    d = card['desc']
    if len(d) > 28:
        line1 = d[:28]
        line2 = d[28:56]
        draw.text((cx + 20, cy + 82), line1, fill='#94a3b8', font=card_desc_font)
        draw.text((cx + 20, cy + 106), line2, fill='#94a3b8', font=card_desc_font)
    else:
        draw.text((cx + 20, cy + 85), d, fill='#94a3b8', font=card_desc_font)

# Bottom Bar
bottom_y = 555
draw.line([(70, bottom_y), (1130, bottom_y)], fill='#1e293b', width=1)

draw.text((70, bottom_y + 16), '🌐 官方访问地址：', fill='#64748b', font=badge_font)
draw.text((215, bottom_y + 14), 'https://sos.sparkbeacon.org', fill='#38bdf8', font=url_font)

draw.text((820, bottom_y + 16), '纯公益 · 零流量 · 支持 PWA 离线安装', fill='#10b981', font=badge_font)

# Save image
img.save('public/og-image.png', 'PNG', optimize=True)
print('Successfully generated public/og-image.png (1200x630)')
