export type Language = 'en' | 'zh-TW' | 'zh-CN';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    beaconTitle: 'Sparks Beacon',
    beaconSubtitle: 'Extreme Disaster Offline Lifeline & Mutual Aid',
    offlineBadge: 'Global Humanitarian Lifeline · Offline Ready',
    reassurance: 'Pure non-profit disaster lifeline. Built for extreme weather, mudslides, power blackouts, and isolated zones. Fully functional offline. Stay calm and preserve warmth — hope is with you.',
    tibetBlessing: 'May all beings be safe & protected',

    // 4 Primary Lifelines
    lifelineSectionTitle: 'Direct Emergency Lifelines (Tap to use)',
    lifelineSectionSubtitle: 'Zero-learning curve · Fully offline',
    emergencySMS: 'Emergency SMS / Satellite',
    emergencySMSDesc: 'Auto-fetches precise GPS, altitude, and status. Directly launches SMS/satellite text to family or rescuers.',
    emergencySMSTag: 'Zero-Data / SMS',
    sosBeacon: 'Visual & Audio Beacon',
    sosBeaconDesc: 'Fullscreen Morse code SOS strobe + 3.1kHz penetrating rescuer whistle to guide search & rescue teams.',
    sosBeaconTag: 'Night & Heavy Fog',
    directReport: 'Direct Help & Injury Report',
    directReportDesc: 'Log trapped location, party count, injuries, and critical supplies. Safely queued offline with QR code.',
    directReportTag: 'Offline Auto-Queue',
    safetyCheckin: 'Safety Roster & Find Family',
    safetyCheckinDesc: 'Search shelter survivor roster by name or phone digits, or register yourself as safe.',
    safetyCheckinTag: 'Shelter Search',

    // Mental First Aid & Field Guide
    mentalAidTitle: 'Beacon of Hope · Mental First Aid & Micro-Community',
    mentalAidDesc: '4-7-8 visual breathing ring to steady rapid heartbeat; 72-hour rescue timeline to dispel panic; sealed love capsules for family.',
    mentalAidBtn: 'Start Breathing Anchor & Hope',
    fieldGuideTitle: 'Mudslide & Highland Survival Guide',
    fieldGuideDesc: 'Escape perpendicular to slopes; watch for dammed lakes; 4-step hypothermia prevention & emergency water purification.',
    fieldGuideBtn: 'View Survival Guide & Hypothermia Protocol',

    // Responder Workspace
    responderWorkspace: 'Responders & Disaster Coordination Workspace',
    responderWorkspaceTag: 'Command & Backup',
    responderDesc: 'For on-site rescue coordinators, volunteer teams, and spreadsheet syncing (click to expand/collapse)',
    activeIncidents: 'Active Rescue Channels & Incident Dashboard',
    activeIncidentsDesc: 'Click any channel to view command dashboard, urgency heatmaps, and AI triage',
    exportAll: 'Export All Backup',
    exporting: 'Exporting...',
    importData: 'Import & Merge Data',
    importing: 'Importing...',
    newIncident: 'New Crisis Channel',
    noIncidents: 'No other specific crisis channels currently',
    createFirstForm: 'Create First Crisis Form',
    designPhilosophy: 'Read Design Philosophy',
    createdTime: 'Created',
    channelId: 'ID',

    // Mobile Dock
    dockSMS: 'SMS SOS',
    dockBeacon: 'Beacon',
    dockReport: 'Report',
    dockCheckin: 'Check-in',
    dockHope: 'Hope',

    // Public Submit Form
    backToHome: 'Back to Sparks Beacon Home',
    emergencyChannelTitle: 'Emergency Direct SOS & Needs Intake',
    emergencyChannelDesc: 'For all stranded victims and witnesses. Submissions are saved locally when offline and auto-uploaded when reconnected. You can also generate an SOS QR code or emergency SMS.',
    offlineModeNotice: 'Offline Mode - Submissions will be saved locally and queued',
    yourName: 'Your Name / Nickname',
    contactInfo: 'Contact (Phone / Radio Frequency / Satellite)',
    whatDoYouNeed: 'Urgent Needs & Situation (Injuries, Party Size, Food, Water, Warmth)',
    locationLabel: 'Location / Landmark / GPS Coordinates',
    submitRequest: 'Submit Emergency Request',
    voiceSOS: 'Voice SOS Recording',
    showQRCode: 'Show SOS QR Code to Responders',
    sendSMS: 'Send Emergency SMS',
    scanQR: 'Scan Victim QR Code',
    backupJSON: 'Backup JSON',
    restoreJSON: 'Restore JSON',
    mapView: 'Map View',
    listView: 'List View',
    runAITriage: 'Run AI Triage',
    filterByDistance: 'Sort by Proximity',
  },
  'zh-TW': {
    beaconTitle: 'Sparks Beacon · 星火應急信標',
    beaconSubtitle: '極境離線求生與災後互助生命線',
    offlineBadge: '全球人道應急 · 全天候離線運作',
    reassurance: '純公益防災求生站。專為暴雨、山體滑坡、泥石流、斷網斷電、高寒失溫的極端場景打造。支援完全離線與零流量運行。請保持鎮定、保存體溫，微光雖小，星火為你守候。',
    tibetBlessing: '願所有穿越風暴與落石的生靈，皆得護佑與歸途',

    lifelineSectionTitle: '現場遇險 · 緊急自救通道（點擊即用）',
    lifelineSectionSubtitle: '零學習成本 · 離線可用',
    emergencySMS: '一鍵短信/衛星呼救',
    emergencySMSDesc: '自動提取高精度GPS、海拔與傷情，直接調起手機短信發送給親友或救援隊。',
    emergencySMSTag: '零流量 / 衛星短信',
    sosBeacon: '聲光救援信標',
    sosBeaconDesc: '全屏國際標準摩斯 SOS 強光頻閃 + 3.1kHz 穿透性高頻求生哨，引導搜救分隊定位。',
    sosBeaconTag: '夜間 / 濃霧穿透',
    directReport: '現場求助與傷情直報',
    directReportDesc: '登記受困位置、人數、傷員與急缺物資，離線也能安全記錄排隊，生成核驗二維碼。',
    directReportTag: '斷網自動排隊',
    safetyCheckin: '報平安 & 尋親名冊',
    safetyCheckinDesc: '查尋失聯親友是否在避難所名單（輸入姓名/手機尾號快查），或登記自己脫險平安。',
    safetyCheckinTag: '避難所查人',

    mentalAidTitle: '微光與希望 · 心理平復與互助站',
    mentalAidDesc: '恐慌時跟隨 4-7-8 呼吸光圈平抑心跳；了解 72小時科學搜救推進時間線破除絕望；寫下封存於本地的愛的時空膠囊。',
    mentalAidBtn: '開啟微光守護與呼吸平復',
    fieldGuideTitle: '泥石流垂直逃生與高原自救',
    fieldGuideDesc: '絕不順著山溝跑，往垂直兩側高地跑；警惕堰塞湖異常；隔絕地面的防失溫四步法與自制飲水淨化。',
    fieldGuideBtn: '查看避險手冊與防失溫指南',

    responderWorkspace: '救援隊與應急協同工作台',
    responderWorkspaceTag: '協調指揮 / 備份管理',
    responderDesc: '面向現場救援協調者、志願者團隊及表格協同（點擊展開/收起）',
    activeIncidents: '活躍救援通道與事件看板',
    activeIncidentsDesc: '點擊任意通道即可進入指揮看板、查看求助熱力與AI分診',
    exportAll: '導出全部備份',
    exporting: '導出中...',
    importData: '導入數據合併',
    importing: '導入中...',
    newIncident: '新建救災專案',
    noIncidents: '暫無其他特定救援專案',
    createFirstForm: '創建第一個救援表單',
    designPhilosophy: '查閱系統設計哲學 (Design Philosophy)',
    createdTime: '創建時間',
    channelId: '通道ID',

    dockSMS: '短信呼救',
    dockBeacon: '聲光信標',
    dockReport: '求助直報',
    dockCheckin: '報平安/尋親',
    dockHope: '微光希望',

    backToHome: '返回星火信標主頁 (Home)',
    emergencyChannelTitle: '現場緊急求助與災情直報通道',
    emergencyChannelDesc: '此通道面向所有現場受災受困人員及目擊者。即使離線無信號，您的求助資訊也會加密保存在本地離線隊列，恢復網絡時自動同步。',
    offlineModeNotice: '離線模式 - 提交內容將安全保存在本地隊列',
    yourName: '您的姓名 / 稱呼',
    contactInfo: '聯絡電話 / 衛星號 / 對講頻率',
    whatDoYouNeed: '您需要什麼幫助？(傷員、受困人數、急缺物資)',
    locationLabel: '詳細位置 / 地標 / GPS 坐標',
    submitRequest: '立即提交求助',
    voiceSOS: '語音 SOS 錄音輸入',
    showQRCode: '出示 SOS 二維碼',
    sendSMS: '發送保底緊急短信',
    scanQR: '掃描受災者二維碼',
    backupJSON: '備份 JSON 數據',
    restoreJSON: '還原 JSON 數據',
    mapView: '地圖視圖',
    listView: '列表視圖',
    runAITriage: '運行 AI 緊急度分級',
    filterByDistance: '按距離由近到遠排序',
  },
  'zh-CN': {
    beaconTitle: 'Sparks Beacon · 星火应急信标',
    beaconSubtitle: '极境离线求生与灾后互助生命线',
    offlineBadge: '全球人道应急 · 全天候离线运行',
    reassurance: '纯公益防灾求生站。专为暴雨、山体滑坡、泥石流、断网断电、高寒失温的极端场景打造。支持完全离线与零流量运行。请保持镇定、保存体温，微光虽小，星火为你守候。',
    tibetBlessing: '愿所有穿越风暴与落石的生灵，皆得护佑与归途',

    lifelineSectionTitle: '现场遇险 · 紧急自救通道（点击即用）',
    lifelineSectionSubtitle: '零学习成本 · 离线可用',
    emergencySMS: '一键短信/卫星呼救',
    emergencySMSDesc: '自动提取高精度GPS、海拔与伤情，直接调起手机短信发送给亲友或救援队。',
    emergencySMSTag: '零流量 / 卫星短信',
    sosBeacon: '声光救援信标',
    sosBeaconDesc: '全屏国际标准摩斯 SOS 强光频闪 + 3.1kHz 穿透性高频求生哨，引导搜救分队定位。',
    sosBeaconTag: '夜间 / 浓雾穿透',
    directReport: '现场求助与伤情直报',
    directReportDesc: '登记受困位置、人数、伤员与急缺物资，离线也能安全记录排队，生成核验二维码。',
    directReportTag: '断网自动排队',
    safetyCheckin: '报平安 & 寻亲名册',
    safetyCheckinDesc: '查寻失联亲友是否在避难所名单（输入姓名/手机尾号快查），或登记自己脱险平安。',
    safetyCheckinTag: '避难所查人',

    mentalAidTitle: '微光与希望 · 心理平复与互助站',
    mentalAidDesc: '恐慌时跟随 4-7-8 呼吸光圈平抑心跳；了解 72小时科学搜救推进时间线破除绝望；写下封存于本地的爱的时空胶囊。',
    mentalAidBtn: '开启微光守护与呼吸平复',
    fieldGuideTitle: '泥石流垂直逃生与高原自救',
    fieldGuideDesc: '绝不顺着山沟跑，往垂直两侧高地跑；警惕堰塞湖异常；隔绝地面的防失温四步法与自制饮水净化。',
    fieldGuideBtn: '查看避险手册与防失温指南',

    responderWorkspace: '救援队与应急协同工作台',
    responderWorkspaceTag: '协调指挥 / 备份管理',
    responderDesc: '面向现场救援协调者、志愿者团队及表格协同（点击展开/收起）',
    activeIncidents: '活跃救援通道与事件看板',
    activeIncidentsDesc: '点击任意通道即可进入指挥看板、查看求助热力与AI分诊',
    exportAll: '导出全部备份',
    exporting: '导出中...',
    importData: '导入数据合并',
    importing: '导入中...',
    newIncident: '新建救灾专案',
    noIncidents: '暂无其他特定救援专案',
    createFirstForm: '创建第一个救援表单',
    designPhilosophy: '查阅系统设计哲学 (Design Philosophy)',
    createdTime: '创建时间',
    channelId: '通道ID',

    dockSMS: '短信呼救',
    dockBeacon: '声光信标',
    dockReport: '求助直报',
    dockCheckin: '报平安/寻亲',
    dockHope: '微光希望',

    backToHome: '返回星火信标主页 (Home)',
    emergencyChannelTitle: '现场紧急求助与灾情直报通道',
    emergencyChannelDesc: '此通道面向所有现场受灾受困人员及目击者。即使离线无信号，您的求助信息也会加密保存在本地离线队列，恢复网络时自动同步。',
    offlineModeNotice: '离线模式 - 提交内容将安全保存在本地队列',
    yourName: '您的姓名 / 称呼',
    contactInfo: '联系电话 / 卫星号 / 对讲频率',
    whatDoYouNeed: '您需要什么帮助？(伤员、受困人数、急缺物资)',
    locationLabel: '详细位置 / 地标 / GPS 坐标',
    submitRequest: '立即提交求助',
    voiceSOS: '语音 SOS 录音输入',
    showQRCode: '出示 SOS 二维码',
    sendSMS: '发送保底紧急短信',
    scanQR: '扫描受灾者二维码',
    backupJSON: '备份 JSON 数据',
    restoreJSON: '还原 JSON 数据',
    mapView: '地图视图',
    listView: '列表视图',
    runAITriage: '运行 AI 紧急度分级',
    filterByDistance: '按距离由近到远排序',
  }
};

function getInitialLang(): Language {
  const saved = localStorage.getItem('crisiskit_lang') as Language;
  if (saved && ['en', 'zh-CN', 'zh-TW'].includes(saved)) {
    return saved;
  }
  // Auto-detect browser locale
  const navLang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : '';
  if (navLang.startsWith('zh-TW') || navLang.startsWith('zh-HK')) return 'zh-TW';
  if (navLang.startsWith('zh')) return 'zh-CN';
  return 'en';
}

let currentLang: Language = getInitialLang();

export function getLang(): Language {
  return currentLang;
}

export function setLang(lang: Language): void {
  currentLang = lang;
  localStorage.setItem('crisiskit_lang', lang);
  window.dispatchEvent(new Event('crisiskit_lang_change'));
}

export function t(key: string): string {
  return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}
