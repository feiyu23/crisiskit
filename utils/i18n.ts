export type Language = 'en' | 'zh-TW' | 'zh-CN';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'CrisisKit Lite',
    tagline: '10-Second Crisis Form & AI Triage',
    sosLocation: 'SOS Location',
    selfRescue: 'Self Rescue',
    yourName: 'Your Name',
    contactInfo: 'Contact Info',
    whatDoYouNeed: 'What do you need?',
    submitRequest: 'Submit Request',
    voiceSOS: 'Voice SOS Input',
    showQRCode: 'Show SOS QR Code',
    sendSMS: 'Send Emergency SMS',
    scanQR: 'Scan Victim QR',
    backupJSON: 'Backup JSON',
    restoreJSON: 'Restore JSON',
    mapView: 'Map View',
    listView: 'List View',
    runAITriage: 'Run AI Triage',
    sosSoundOn: 'SOS Sound ON',
    sosSoundOff: 'SOS Sound OFF',
    filterByDistance: 'Sort by Proximity',
  },
  'zh-TW': {
    appTitle: 'CrisisKit Lite',
    tagline: '10秒极度快速求助与 AI 智能分级',
    sosLocation: '一键定位 SOS',
    selfRescue: '自救指引',
    yourName: '您的姓名',
    contactInfo: '联络电话 / 微信 / WhatsApp',
    whatDoYouNeed: '您需要什么帮助？',
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
    sosSoundOn: 'SOS 警报音效开',
    sosSoundOff: 'SOS 警报音效关',
    filterByDistance: '按距离由近到远排序',
  },
  'zh-CN': {
    appTitle: 'CrisisKit Lite',
    tagline: '10秒急速求助与 AI 智能分级',
    sosLocation: '一键定位 SOS',
    selfRescue: '自救指引',
    yourName: '您的姓名',
    contactInfo: '联系电话 / 微信 / WhatsApp',
    whatDoYouNeed: '您需要什么帮助？',
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
    sosSoundOn: 'SOS 警示音效开',
    sosSoundOff: 'SOS 警示音效关',
    filterByDistance: '按距离由近到远排序',
  }
};

let currentLang: Language = (localStorage.getItem('crisiskit_lang') as Language) || 'en';

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
