export interface ArticleSection {
  title: string;
  titleEn: string;
  content: string[];
  contentEn: string[];
  alert?: {
    type: 'warning' | 'danger' | 'tip';
    text: string;
    textEn: string;
  };
}

export interface SurvivalArticle {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: 'stockpile' | 'blackout' | 'earthquake' | 'volcano' | 'hypothermia' | 'mutualaid';
  categoryLabel: string;
  categoryLabelEn: string;
  readTime: string;
  date: string;
  author: string;
  seoKeywords: string[];
  sections: ArticleSection[];
  relatedTool: 'stockpile' | 'beacon' | 'sms' | 'mutualaid' | 'fieldguide';
  toolCtaText: string;
  toolCtaTextEn: string;
}

export const SURVIVAL_ARTICLES: SurvivalArticle[] = [
  {
    slug: 'family-stockpile-guide',
    title: '应对极端危机：72小时与7天家庭备灾物资科学储备全指南（北欧/德国家民防标准）',
    titleEn: 'Extreme Crisis Preparedness: Scientific 72-Hour & 7-Day Family Stockpile Guide (Nordic & German Standards)',
    summary: '当断电断水、物流中断或极寒灾害来袭，家庭是第一道生命防线。依据瑞典民防局(MSB)与德国民防局(BBK)官方标准，全面拆解生命饮用水、高能免烹饪口粮、14天慢病处方药与断电热源的精准测算。',
    summaryEn: 'When grid failure, tap water contamination, or severe storms strike, your home is the first frontline. Based on Swedish (MSB) and German (BBK) civil defence directives, this guide details exact potable water, non-perishable high-calorie food, 14-day chronic medicine buffer, and emergency heat calculations.',
    category: 'stockpile',
    categoryLabel: '🎒 备灾储备',
    categoryLabelEn: '🎒 Stockpile',
    readTime: '6 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['家庭备灾清单', '72小时应急储备', '7天应急口粮', '民防指南', '家庭防灾计算器', '断水储备', 'disaster stockpile checklist', 'civil defence 72 hours'],
    relatedTool: 'stockpile',
    toolCtaText: '开启家庭备灾计算器（按家庭人数自动测算）',
    toolCtaTextEn: 'Open Family Stockpile Calculator (Auto-Calculate for Household)',
    sections: [
      {
        title: '一、为什么是“72小时与7天”法则？',
        titleEn: '1. Why the "72-Hour & 7-Day" Golden Rule?',
        content: [
          '重大地质灾害或极端极端气象（如暴雪封路、强震破坏桥梁）发生后，专业重型搜救与应急物资调拨进入灾区通常需要 48 至 72 小时。',
          '北欧诸国（瑞典、芬兰、挪威）自2024年起向全体公民发放新版《如果危机或战争来临》手册，明确要求所有家庭必须具备“至少脱离外部市政供给自给自足独立生活7天”的应急储备。',
          '家庭备灾不是盲目恐慌囤积，而是通过科学计算配额，建立低损耗、常态滚动的生命保障底线。'
        ],
        contentEn: [
          'Following major geological disasters or extreme blizzard disruptions, professional heavy rescue machinery and mass relief convoys typically require 48 to 72 hours to clear corridors into ground zero.',
          'Nordic civil defence agencies (Swedish MSB, Norwegian DSB) mandate that every household must be prepared to sustain itself entirely without municipal electricity, running water, or store deliveries for at least 7 days.',
          'Preparedness is not panic hoarding; it is establishing a scientific, zero-waste rolling buffer of survival necessities.'
        ]
      },
      {
        title: '二、生命饮用水储备：严控每人每天 3.5 升底线',
        titleEn: '2. Potable Water: Strict 3.5 Liters per Person per Day',
        content: [
          '人在断水环境下耐受极限通常只有 3 至 5 天。极境储备按每人每天 3.5 升计算：其中 2.5 升保障饮用与脱水补充，1 升用于极简食物冲泡与口腔基本卫生。',
          '若家中有宠物（猫狗），需额外增加每只每天 0.8 至 1 升。一个三口之家储备 7 天，总储水量约为 75 至 80 升（约4大桶20L桶装水）。',
          '建议选购食品级密封桶装水，放置在阴凉避光处，并常备二氧化氯或漂白粉净水药片作为野外取水补充。'
        ],
        contentEn: [
          'Without potable water, human endurance drops critically within 3 to 5 days. Scientific civil defence standards require 3.5 liters per adult per day: 2.5L for core metabolic hydration and 1L for minimal hygiene and freeze-dried food reconstitution.',
          'Pets require an additional 0.8 to 1.0 liter per day. A household of 3 people targeting 7 days requires approximately 75 to 80 liters of bottled water.',
          'Store factory-sealed mineral water in cool, dark spots and keep chlorine dioxide purification tablets as a secondary barrier for raw river/rain water.'
        ],
        alert: {
          type: 'danger',
          text: '特别警示：市政断水时，自来水管初期恢复的水往往带有重金属泥沙与倒灌细菌，严禁直接生饮！必须经过沉淀、过滤并持续沸腾3分钟以上。',
          textEn: 'CRITICAL ALERT: When municipal water restarts post-disaster, pipes contain heavy rust, sediments, and back-siphoned pathogens. Never drink directly without filtering and rolling boil for at least 3 minutes.'
        }
      },
      {
        title: '三、免烹饪高能耐存口粮：热量与蛋白优先',
        titleEn: '3. Non-Perishable Food: Calories & High-Density Protein First',
        content: [
          '停电停气状态下，冰箱内的冷冻生鲜在 24 小时内即会变质。家庭应急口粮必须满足“开罐即食、耐常温、高热量”三大原则。',
          '成年人每日基础能量消耗按 2100~2200 大卡储备。推荐物资包括：午餐肉与金枪鱼罐头、高蛋白坚果、花生酱、燕麦片、压缩干粮及电解质冲剂。',
          '务必在备灾箱内绑上一把【手动机械开罐器】，大量家庭在断电断网时因找不到开罐工具导致罐头无法开启。'
        ],
        contentEn: [
          'During grid blackouts, freezers and refrigerators spoil within 24 hours. Emergency food must be ready-to-eat without municipal power or extensive cooking.',
          'Target 2,100 to 2,200 kcal per person per day. Recommended items include canned meats (tuna, luncheon meat), peanut butter, roasted nuts, rolled oats, high-energy biscuits, and oral electrolyte salts.',
          'MANDATORY TOOL: Tape a manual mechanical can opener to your emergency food crate. Many families find their canned food completely inaccessible in the dark.'
        ]
      },
      {
        title: '四、14~30天慢病处方药与急救耗材',
        titleEn: '4. 14 to 30-Day Prescription Medicines & Trauma Supplies',
        content: [
          '震后与封控断路时，社区卫生院与药店最先断供。高血压、冠心病、糖尿病（胰岛素）、重度哮喘患者必须常备 14 至 30 天的处方药滚动库存。',
          '创伤急救包内应优先包含旋压式止血带（CAT）、含止血剂的无菌纱布卷、医用弹性绷带、烧烫伤敷料及抗过敏药物。'
        ],
        contentEn: [
          'During widespread disasters, pharmacies run out of chronic medication within 12 hours. Patients with hypertension, asthma, diabetes, or heart disease must maintain a rolling 14 to 30-day buffer.',
          'Your first-aid kit must prioritize tourniquets (CAT), hemostatic dressing, elastic compression bandages, burn gel, and pediatric fever suspension.'
        ]
      },
      {
        title: '五、滚动储备法（Rolling Stock）：告别过期浪费',
        titleEn: '5. The Rolling Stock Method: Zero Waste & Constant Readiness',
        content: [
          '许多人担心备灾物资会过期扔掉。最佳方法是“先进先出、常态轮换”：平时日常饮食消耗快到期（如半年内）的罐头与干粮，采购最新日期的批次补充进备灾箱。',
          '每半年检查一次水和药品的有效期，使家庭应急系统始终保持在高度战备状态。'
        ],
        contentEn: [
          'The biggest hesitation for families is expired waste. Practice FIFO (First In, First Out): consume foods nearing expiry in daily meals and restock your emergency kit with fresh batches.',
          'Audit your water and medical inventory every 6 months to maintain peak operational readiness.'
        ]
      }
    ]
  },
  {
    slug: 'grid-outage-phone-beacon',
    title: '断网、断电、零信号孤岛：如何用一部手机发出最后的求生信标？',
    titleEn: 'Total Grid Outage & Zero Signal: How to Turn Your Mobile Phone into an Offline Survival Beacon',
    summary: '当通信基站倒塌、光纤切断、手机显示“无服务”时，你的手机依然是一台集成高精度传感器、大功率闪光灯与音频振膜的救生仪器。深度拆解离线省电、屏幕SOS频闪与3.1kHz穿透哨音的实战用法。',
    summaryEn: 'When cellular base stations collapse and your screen shows "No Service", your phone remains a powerful sensory beacon with precision GPS, an OLED emitter, and an audio membrane. Learn how to maximize survival mode, screen SOS flashes, and 3.1kHz acoustic whistles.',
    category: 'blackout',
    categoryLabel: '📡 离线信标',
    categoryLabelEn: '📡 Beacon',
    readTime: '5 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['断网求救', '手机没信号发SOS', '屏幕SOS频闪', '3.1kHz救生哨', '离线信标', '卫星短报文', 'offline emergency beacon', 'phone SOS strobe'],
    relatedTool: 'beacon',
    toolCtaText: '立即开启声光救援信标（屏幕频闪 + 3.1kHz哨）',
    toolCtaTextEn: 'Activate Audio-Visual Beacon (Screen Strobe + 3.1kHz Whistle)',
    sections: [
      {
        title: '一、电量就是生命：第一时间开启“纯黑生存模式”',
        titleEn: '1. Battery is Life: Switch to True OLED Survival Mode Immediately',
        content: [
          '现代智能手机普遍采用 OLED 屏幕。OLED 每一个像素点都是独立发光的，当屏幕显示纯黑（#000000）时，像素点处于完全断电状态，能耗降低 60% 至 80%。',
          '在断电孤岛中，务必立即关闭一切震动、通知、后台应用刷新与复杂动画。星火应急信标内置的“省电生存模式”专门锁死全局无动画纯黑像素，将每一毫安时电量锁在关键求生时刻。'
        ],
        contentEn: [
          'Modern smartphones use OLED displays where every sub-pixel emits its own light. Pure black (#000000) pixels are physically powered off, cutting screen battery consumption by 60% to 80%.',
          'In a grid blackout, disable vibrations, animations, and background app refreshes. Sparks Beacon’s Survival Mode enforces zero-animation pure OLED black to stretch remaining battery for hours.'
        ]
      },
      {
        title: '二、为什么 3.1kHz 救生哨能穿透风雨与轰鸣？',
        titleEn: '2. Why the 3.1kHz Acoustic Whistle Penetrates Disaster Roar',
        content: [
          '人在极度疲劳、失温或被压埋时，大声呼喊只能维持十几分钟，且极易导致声带水肿充血、加速肺部耗氧与脱水。',
          '声学与听力学研究表明：人类耳蜗听觉敏感峰值在 3000Hz 至 3500Hz（3.1kHz）。自然界泥石流与暴风雨多为低频轰鸣（100Hz~500Hz），高频的 3.1kHz 方波救生哨音具有最强的听觉穿透性，能穿过数百米风雨被搜救人员与搜救犬第一时间察觉。'
        ],
        contentEn: [
          'Screaming for help when trapped quickly exhausts vocal cords, accelerates dehydration, and consumes vital oxygen.',
          'Acoustics research proves that human ear canal resonance peaks between 3,000Hz and 3,500Hz (3.1kHz). While mudslides and storms generate low-frequency rumbles (100-500Hz), a 3.1kHz square wave pierces directly through ambient chaos.'
        ]
      },
      {
        title: '三、夜间摩尔斯 SOS 强光频闪与空中搜救对接',
        titleEn: '3. Morse SOS Visual Strobe for Aerial Helicopter SAR',
        content: [
          '在夜间或浓雾开阔地带，搜救直升机与山地搜救队员多佩戴微光夜视仪（NVG）。手机屏幕以国际标准摩尔斯电码（··· ─── ···）进行全屏黑白爆闪，能产生极具辨识度的规律反光。',
          '将手机屏幕斜向45度面向天空或搜救灯光方向摆放，可作为被动救援信标持续工作。'
        ],
        contentEn: [
          'At night or across foggy ravines, rescue helicopters and search teams utilize night-vision goggles (NVG). A synchronized Morse code SOS (··· ─── ···) screen flash generates unmistakable flashes of light.',
          'Angle your phone 45 degrees towards the sky or valley search lights to serve as a beacon.'
        ],
        alert: {
          type: 'tip',
          text: '救生技巧：如果处于浓雾或积雪环境中，在手机屏幕前覆盖一层半透明塑料袋或矿泉水瓶，可将点光源散射为大面积漫射光环，空中识别范围扩大3倍！',
          textEn: 'SURVIVAL TIP: In dense fog or snow, placing a translucent plastic bag or filled water bottle over the screen turns a point source into an omnidirectional halo, tripling aerial visibility.'
        }
      }
    ]
  },
  {
    slug: 'earthquake-survival-protocol',
    title: '地震被困室内外生死法则：“伏地、遮挡、抓牢”与敲击废墟求生真相',
    titleEn: 'Earthquake Survival Protocols: Drop, Cover, Hold On & Why You Must Tap, Not Scream',
    summary: '地震发生时几秒内做出错误决定往往致命。国际地震专家与各国应急救援队一致认可的“伏地、遮挡、抓牢”究竟该如何执行？废墟被埋压时如何利用三连击声学法则坚守72小时黄金窗口？',
    summaryEn: 'Making the wrong move during the initial 5 seconds of an earthquake is fatal. Discover why international search and rescue teams endorse "Drop, Cover, Hold On", debunk the dangerous "Triangle of Life" myth, and master the 3-tap survival rule under rubble.',
    category: 'earthquake',
    categoryLabel: '🌋 地震自救',
    categoryLabelEn: '🌋 Earthquake',
    readTime: '5 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['地震自救', '伏地遮挡抓牢', '地震被困求生', '地震废墟敲击', '地震逃生常识', 'earthquake drop cover hold on', 'earthquake survival'],
    relatedTool: 'fieldguide',
    toolCtaText: '查看多灾种自救避险手册（地震避险完整指南）',
    toolCtaTextEn: 'Open Multi-Hazard Survival Guide (Earthquake Protocols)',
    sections: [
      {
        title: '一、粉碎谣言：为什么坚决摒弃“生命三角”？',
        titleEn: '1. Mythbusting: Why You Must Abandon the "Triangle of Life"',
        content: [
          '网络长期流传的“生命三角论”由未经工程验证的理论演化而来。实际震害调查表明：绝大多数地震伤亡不是因为建筑垂直粉碎性垮塌，而是由于被剧烈晃动甩出、或被头顶坠落的书架、吊灯、玻璃与吊顶砸伤！',
          '在剧烈颠簸中试图站立奔跑去寻找所谓的“三角空间”，90%以上的人会被甩倒摔伤或直接被飞来横物击中。'
        ],
        contentEn: [
          'The internet myth of the "Triangle of Life" has been repeatedly disproven by structural engineers and FEMA. Real-world post-earthquake data shows the vast majority of casualties are caused by falling ceiling tiles, shattering glass, overturning bookcases, or being tossed violently to the ground.',
          'Attempting to run across shaking floors to locate an imagined void results in severe fractures and head trauma.'
        ]
      },
      {
        title: '二、全球通用生死黄金法则：伏地、遮挡、抓牢（Drop, Cover, Hold On）',
        titleEn: '2. The Proven Standard: Drop, Cover, and Hold On',
        content: [
          '1. **伏地（Drop）**：立即双膝跪地、手肘支撑。低重心能防止被剧烈震波甩倒，同时保护腹部脏器；',
          '2. **遮挡（Cover）**：迅速爬入结实的书桌、餐桌底下，一手护住颈部与头部后侧；若无桌子，紧靠坚固内承重墙角蜷曲身躯；',
          '3. **抓牢（Hold On）**：双手牢牢抓住桌腿。晃动会移动桌子，抓紧桌腿能确保桌子始终罩在身体上方，直到主震停止。'
        ],
        contentEn: [
          '1. **Drop**: Drop down onto your hands and knees. This low posture prevents you from being thrown and protects vital organs;',
          '2. **Cover**: Crawl beneath a sturdy desk or table. Shield your head and neck with one arm;',
          '3. **Hold On**: Grip the table legs firmly with both hands. Tables shift during violent shaking; holding on ensures your shield moves with you until shaking stops.'
        ],
        alert: {
          type: 'warning',
          text: '严禁行为：切勿在地震晃动中冲向楼梯或冲向电梯！楼梯极易错位垮塌，电梯会瞬间断电坠坠停卡死。',
          textEn: 'STRICTLY PROHIBITED: Never rush down stairs or enter elevators during active shaking! Stairwells shear apart first, and elevators stall immediately.'
        }
      },
      {
        title: '三、若不幸被埋压废墟：三连击声学敲击法则',
        titleEn: '3. Trapped Under Rubble: The 3-Tap Acoustic Survival Code',
        content: [
          '若被困狭小空间，首要原则是【保持冷静、闭上嘴鼻防灰尘】。撕下衣服捂住口鼻，避免吸入强碱性水泥粉尘导致窒息。',
          '严禁盲目大哭大喊！喊叫会耗尽氧气与体液。找到石头或金属物件，在听到搜救犬或人声靠近时，有节奏地敲击铁质暖气管、水管或坚硬水泥板：【敲3下 — 停5秒 — 再敲3下】。',
          '固体金属与混凝土的声波传播速度是空气的 15 倍，搜救队的微震声波探测仪能在数百米外捕获这种规律声响。'
        ],
        contentEn: [
          'If trapped, your primary directive is to protect your respiratory tract. Cover mouth and nose with cotton clothing to block caustic alkaline dust.',
          'Never shout continuously. Shouting exhausts oxygen and parches your throat. Use a stone or metal object to tap rhythmically on metal plumbing pipes or concrete slabs: [TAP-TAP-TAP — PAUSE 5s — TAP-TAP-TAP].',
          'Acoustic waves travel through steel pipes 15 times faster than through air. Search geophones pick up rhythmic metallic taps from hundreds of feet away.'
        ]
      }
    ]
  },
  {
    slug: 'volcano-ash-defense',
    title: '火山喷发与火山灰防灾：为什么火山灰是细碎玻璃？呼吸道与眼部防护死则',
    titleEn: 'Volcanic Ash Defense: Why Ash is Microscopic Glass & Why Contact Lenses Blind',
    summary: '火山爆发遮天蔽日，空气中弥漫的不是普通泥尘，而是边缘如剃刀般锋利的微观火山玻璃与硅酸盐。吸入肺部会形成永久固化结石，戴隐形眼镜揉眼会导致永久失明。一文读懂火山灰极境生存要诀。',
    summaryEn: 'Volcanic ash is not soft chimney soot; it is razor-sharp pulverized volcanic glass and silica. Inhaling it causes acute chemical bronchitis, and wearing contact lenses scratches corneas into permanent blindness. Master volcanic defense protocols.',
    category: 'volcano',
    categoryLabel: '🌋 火山防护',
    categoryLabelEn: '🌋 Volcano',
    readTime: '4 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['火山灰防护', '火山喷发自救', '火山灰隐形眼镜', '火山灰压垮屋顶', '火山避险指南', 'volcanic ash protection', 'volcano survival guide'],
    relatedTool: 'fieldguide',
    toolCtaText: '查看多灾种自救避险手册（火山灰防灾要点）',
    toolCtaTextEn: 'Open Multi-Hazard Survival Guide (Volcano Defense)',
    sections: [
      {
        title: '一、认识火山灰的致命本质：微观玻璃锋刃',
        titleEn: '1. The True Danger: Microscopic Razor Glass',
        content: [
          '火山灰是岩浆在极高压下被气体撕碎喷发、急速骤冷形成的颗粒物，硬度高达莫氏硬度 5~7。在显微镜下，每一粒火山灰都是棱角森然的锋利玻璃与矿物结晶。',
          '普通粉尘吸入会被支气管纤毛排出，但细颗粒火山灰深入肺泡后与水分结合，会与呼吸道粘液固结为类似泥浆的硬块，诱发急性肺水肿与呼吸窘迫综合征。'
        ],
        contentEn: [
          'Volcanic ash is formed when magma is pulverized by volatile gases and flash-frozen into microscopic shards of silica glass with a Mohs hardness of 5 to 7.',
          'Unlike wood soot, when fine volcanic glass enters bronchial branches, it binds with pulmonary moisture to create a cement-like paste, causing severe chemical bronchitis.'
        ]
      },
      {
        title: '二、眼部防护铁律：坚决摘掉隐形眼镜！',
        titleEn: '2. The Eye Protection Law: Absolute Ban on Contact Lenses',
        content: [
          '在火山灰降落区域，必须立即摘下隐形眼镜（包括美瞳），换戴全封闭护目镜或普通框架眼镜。',
          '微米级的锋利玻璃颗粒一旦进入角膜与隐形眼镜之间的缝隙，任何眨眼或揉眼动作都会使镜片变成“研磨盘”，瞬间划穿角膜上皮，造成不可逆角膜溃疡甚至失明。',
          '若眼睛进灰，绝对不可揉搓！应用大量清洁生理盐水或包装饮用水自内眼角向外冲洗。'
        ],
        contentEn: [
          'In any ash-fall sector, immediately remove contact lenses and switch to sealed safety goggles or standard spectacles.',
          'Sharp silica shards trapped beneath a soft contact lens act as abrasive sandpaper. Blinking or rubbing grinding glass shards directly into corneas causes permanent ulceration and blindness.',
          'If ash enters eyes, NEVER rub. Flush thoroughly from the inner corner outwards using clean saline solution.'
        ],
        alert: {
          type: 'danger',
          text: '致盲警告：火山灰降落时，手沾了火山灰绝对不可揉眼睛！必须立即取下隐形眼镜并密封保存。',
          textEn: 'BLINDNESS WARNING: If ash touches your face, never rub your eyes. Remove contact lenses immediately.'
        }
      },
      {
        title: '三、湿火山灰极重：谨防屋顶断裂垮塌',
        titleEn: '3. Heavy Ash Hazard: Wet Ash Equals Wet Cement',
        content: [
          '干燥火山灰堆积密度约为 500~700 kg/m³；一旦遭遇降雨或湿冷凝结，湿火山灰密度瞬间激增至 1500~2000 kg/m³，其重量相当于湿水泥！',
          '厚度超过 10 至 15 厘米的湿积灰即可压跨普通的轻钢龙骨、彩钢瓦与木质农房屋顶。切勿在轻质棚屋、温室大棚内躲避；若条件安全，应用长杆自远处拉除平房屋顶积灰。'
        ],
        contentEn: [
          'Dry ash weighs roughly 500-700 kg/m³. However, upon encountering rainfall, wet ash density spikes to 1,500-2,000 kg/m³ — identical to wet concrete.',
          'Just 10 to 15 centimeters of wet ash collapses standard corrugated metal, flat tile roofs, and prefabricated shelters. Never seek shelter under flat carports or greenhouses.'
        ]
      }
    ]
  },
  {
    slug: 'hypothermia-ground-insulation',
    title: '高寒极冷与湿冷失温的生死时速：冰冷地面导热是空气32倍的防失温真相',
    titleEn: 'Hypothermia in Extreme Wet Cold: Why the Ground Drains Heat 32x Faster Than Air',
    summary: '失温被称为户外与废墟中无声的杀手。人在暴风雪或泥泞废墟中，最快的致命降温并不是来自吹拂的冷风，而是直接坐卧在冰冷泥水地面上。掌握隔温垫层、核心四步复温法则，保住生命核心体温。',
    summaryEn: 'Hypothermia is the silent killer across rubble and blizzards. Rapid core heat loss does not come from cold air, but from direct contact with damp stone and mud. Master the ground barrier rule and 4-step core rewarming.',
    category: 'hypothermia',
    categoryLabel: '❄️ 防失温',
    categoryLabelEn: '❄️ Hypothermia',
    readTime: '5 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['失温自救', '防失温生死法则', '地面导热失温', '高寒自救', '失温不能喝酒', 'hypothermia ground barrier', 'hypothermia rewarming'],
    relatedTool: 'fieldguide',
    toolCtaText: '查看多灾种自救避险手册（防失温复温操作）',
    toolCtaTextEn: 'Open Multi-Hazard Survival Guide (Hypothermia Protocols)',
    sections: [
      {
        title: '一、传导散热陷阱：地面吸热速度是空气的 32 倍',
        titleEn: '1. The Conduction Trap: The Ground Drains Heat 32x Faster',
        content: [
          '热力学研究表明：水和潮湿固体的热传导率是静止空气的 25 至 32 倍。',
          '许多受困人员在暴风雪或雨后废墟中，即使身穿厚羽绒服，如果直接坐在泥浆或冰冷岩石上，身体核心热量会在 30 分钟内被身下湿冷地面疯狂抽走，迅速滑入中度甚至重度失温。',
          '【第一戒律：身下必须垫至少 10 厘米厚隔温层】。收集干燥纸箱、枯枝落叶、多余衣服或背包垫在身下，将核心躯干与冰冷地面物理阻断。'
        ],
        contentEn: [
          'Physics dictates that damp earth and cold rock conduct heat away from the body 25 to 32 times faster than still air.',
          'Many trapped victims wearing thick jackets succumb to hypothermia within 30 minutes simply because they sat directly on wet mud, draining their pelvic and core temperatures.',
          'THE FIRST SURVIVAL LAW: Build a 10cm insulating barrier beneath your body. Pile dry cardboard, branches, backpacks, or tires to disconnect from frozen soil.'
        ]
      },
      {
        title: '二、失温的三个阶段与危险信号',
        titleEn: '2. The 3 Stages of Hypothermia & Warning Signals',
        content: [
          '1. **轻度失温（35°C~32°C）**：身体不受控制地剧烈发抖、说话颤抖、双手僵硬动作迟缓。这是身体在通过肌肉抽动自卫产热；',
          '2. **中度失温（32°C~28°C）**：**【停止发抖】**（极度危险信号！代表体内糖原耗竭，产热机制崩溃）、意识模糊、言语错乱；',
          '3. **重度失温（低于28°C）**：出现“反常脱衣”（Paradoxical Undressing）幻觉，瞳孔散大，心律失常直至心跳骤停。'
        ],
        contentEn: [
          '1. **Mild (35°C–32°C)**: Violent involuntary shivering, slurred speech, clumsy fingers. The body is fighting to produce heat;',
          '2. **Moderate (32°C–28°C)**: **[SHIVERING STOPS]** (Lethal red flag! Glycogen is exhausted and metabolic thermogenesis collapses), confusion, apathy;',
          '3. **Severe (Below 28°C)**: "Paradoxical undressing" hallucinations, loss of consciousness, ventricular fibrillation, and cardiac arrest.'
        ]
      },
      {
        title: '三、生死误区：严禁喝酒！严禁揉搓手脚！严禁热水烫！',
        titleEn: '3. Fatal Mistakes: Never Drink Alcohol, Rub Snow, or Take Hot Baths',
        content: [
          '**误区一：喝酒暖身**。酒精会导致体表毛细血管剧烈扩张，带来短暂燥热幻觉，实际上把体内深处的心肺血液强行引向体表散热，加速冻死！',
          '**误区二：用雪搓四肢**。冻僵的四肢组织已形成微小冰晶，揉搓会直接破坏毛细血管导致坏死，且将四肢冰冷酸性血液挤回心脏，引发心室纤颤（致死性“回温休克”）。',
          '**正确做法**：更换干衣服，用铝箔毯或塑料薄膜包裹躯干防风，在腋下、颈部、腹股沟等大动脉处放置温水袋（约40°C），少量多次喂服温糖水。'
        ],
        contentEn: [
          '**MISTAKE 1: Drinking alcohol**. Alcohol dilates peripheral capillaries, causing a fleeting flush while funneling core blood to the cold exterior, accelerating fatal core drop.',
          '**MISTAKE 2: Rubbing limbs or snow friction**. Frostbitten tissue contains sharp ice micro-crystals; rubbing shreds capillaries and drives cold, acidic venous blood into the heart, causing fatal rewarming cardiac arrest.',
          '**CORRECT REWARMING**: Strip wet clothes, wrap trunk in thermal foil blankets, place 40°C warm packs against arterial centers (armpits, neck, groin), and sip warm sugar water.'
        ],
        alert: {
          type: 'danger',
          text: '致死警示：发现中重度失温患者，绝不可搬动其做剧烈运动，必须轻柔平卧，防止四肢冷血回流冲击心脏停搏。',
          textEn: 'FATAL WARNING: Never force hypothermic patients to exercise. Handle them gently to prevent cold venous blood surges into the heart.'
        }
      }
    ]
  },
  {
    slug: 'community-shelter-mutual-aid',
    title: '避难所断网孤岛余缺互济：如何在灾后临时安置点组织物物调剂与自救',
    titleEn: 'Community Shelter Mutual Aid: Organizing Offline Barter & Resource Sharing in Isolation',
    summary: '外界重装救援未抵达的头72小时，避难所里每个家庭的物资结构都不平衡：有的家庭有多余发电机电能，有的急需婴儿奶粉，有的急需降压药。如何用去中心化的互助信息板，建立灾后互信自治网络？',
    summaryEn: 'During the first 72 hours before mass aid arrives, household supplies in temporary shelters are deeply asymmetrical. Learn how decentralized offline barter boards turn isolated strangers into resilient mutual aid networks.',
    category: 'mutualaid',
    categoryLabel: '🤝 社区互助',
    categoryLabelEn: '🤝 Mutual Aid',
    readTime: '5 min',
    date: '2026-11-07',
    author: '星火应急生命线教研组 · Sparks Beacon Research',
    seoKeywords: ['社区避难所互助', '灾后物物调剂', '避难所余缺互济', '灾难自治网络', '安置点发电机共享', 'shelter mutual aid', 'disaster barter board'],
    relatedTool: 'mutualaid',
    toolCtaText: '进入社区避难所余缺互助调剂板',
    toolCtaTextEn: 'Open Community Mutual Aid Barter Board',
    sections: [
      {
        title: '一、灾后头72小时的“物资结构性失衡”',
        titleEn: '1. Structural Supply Asymmetry in the First 72 Hours',
        content: [
          '任何大灾过后，受灾家庭的短缺并不是绝对的，而是结构性的：',
          '开小卖部的老乡仓库里有大量矿泉水和饼干，但家人受惊血压高达180急缺两片络活喜；开修理铺的师傅有发电机和柴油，但家中婴儿断奶急求配方奶粉。',
          '在外界物流中断的盲区中，把“我有余/可提供”与“我急需/求帮助”就地撮合调剂，是平息恐慌、维系生命的最高效机制。'
        ],
        contentEn: [
          'In post-disaster isolation, shortages are rarely absolute; they are asymmetrical.',
          'A shopkeeper may have crates of bottled water but desperately needs two tablets of blood pressure medication for an elderly parent; a mechanic has generator fuel but urgently needs baby formula.',
          'Locally matching "I Can Share" with "I Need Help" stabilizes communities long before outside convoys penetrate road blocks.'
        ]
      },
      {
        title: '二、星火信标离线调剂板的设计精髓',
        titleEn: '2. Sparks Beacon’s Zero-Network Barter Architecture',
        content: [
          '1. **零网络持久化**：信息无需依赖中心化服务器，保存在避难点志愿者的手机或平板本地；',
          '2. **红绿双通道**：🟢 绿色代表“我有余”（发电机按时段充电、多余净水片、工具借用）；🔴 红色代表“我急需”（处方药、婴儿奶粉、防潮被褥）；',
          '3. **危重症爆闪标定**：涉及生命垂危的药品求助可一键加急，优先展示；',
          '4. **离线二维码流转**：可通过面对面扫码在不同避难帐篷的志愿者设备间同步名册。'
        ],
        contentEn: [
          '1. **Zero-Network Persistence**: Entries save directly into volunteer devices via browser LocalStorage;',
          '2. **Color-Coded Dual Channels**: 🟢 Green for "I Can Share" (generator charging windows, water tablets); 🔴 Red for "I Need Help" (prescriptions, infant formula, blankets);',
          '3. **Urgent Medical Banners**: Critical life-safety requests pulse prominently at the top;',
          '4. **Offline QR Sync**: Responders pass rosters between shelters via camera QR scans without cell service.'
        ]
      },
      {
        title: '三、共渡难关：守望相助是最大的微光',
        titleEn: '3. Humanity in the Dark: Solidarity is the Strongest Light',
        content: [
          '灾难是对人性与社会信任的严峻考验。历史经验反复证明，自发组织互助调剂的避难所，踩踏与抢夺风险降低90%以上，疫病控制与受困者生存率显著高于被动等待救援的群体。',
          '微光虽小，星火相连。在危机面前，每一个分享出一块电池、一片药丸的人，都是照亮黑暗的灯塔。'
        ],
        contentEn: [
          'Disaster severely tests social cohesion. History demonstrates that communities organizing proactive mutual aid cut looting and panic by over 90%, with significantly lower infection and mortality rates.',
          'Every battery shared and every pill exchanged is a lighthouse in the dark.'
        ]
      }
    ]
  }
];

export function getArticleBySlug(slug: string): SurvivalArticle | undefined {
  return SURVIVAL_ARTICLES.find(a => a.slug === slug);
}
