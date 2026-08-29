import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { X, Send, Copy, Check, Phone, MapPin, Radio, ShieldCheck, AlertOctagon, HeartHandshake, UserPlus, Trash2 } from 'lucide-react';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const DEFAULT_CONTACTS_KEY = 'crisiskit_emergency_contacts';

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({ isOpen, onClose }) => {
  // Contacts state
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem(DEFAULT_CONTACTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', name: '家人/亲属', phone: '', relation: 'Family' },
      { id: '2', name: '紧急救援 / 领事保护', phone: '110', relation: 'Rescue' }
    ];
  });

  const [selectedContactPhone, setSelectedContactPhone] = useState<string>('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  // Status & Location state
  const [userName, setUserName] = useState(() => localStorage.getItem('crisiskit_my_name') || '');
  const [statusType, setStatusType] = useState<'safe' | 'trapped' | 'critical'>('safe');
  const [companions, setCompanions] = useState<number>(1);
  const [extraNeeds, setExtraNeeds] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number; alt?: number; acc?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [copied, setCopied] = useState(false);

  // Save contacts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DEFAULT_CONTACTS_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.error(e);
    }
  }, [contacts]);

  // Save name
  useEffect(() => {
    if (userName) {
      localStorage.setItem('crisiskit_my_name', userName);
    }
  }, [userName]);

  // Automatically fetch GPS when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLocation();
    }
  }, [isOpen]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('当前设备不支持地理定位');
      return;
    }
    setIsLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          alt: pos.coords.altitude ? Math.round(pos.coords.altitude) : undefined,
          acc: Math.round(pos.coords.accuracy)
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError('无法获取精确GPS，请手动提供或在开阔处重试');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleAddContact = () => {
    if (!newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContactName.trim() || '联系人',
      phone: newContactPhone.trim(),
      relation: 'Custom'
    };
    setContacts(prev => [...prev, newContact]);
    setSelectedContactPhone(newContact.phone);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Build high-density crisis message
  const generateMessage = (): string => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const locationStr = coords 
      ? `[${coords.lat},${coords.lng}${coords.alt ? ` 海拔${coords.alt}m` : ''} 误差±${coords.acc || 0}m]` 
      : '[GPS未知]';

    const who = userName.trim() ? userName.trim() : '我';
    
    if (statusType === 'safe') {
      return `【平安报备】我是${who}，于${timeStr}确认安全。同行${companions}人。现位置${locationStr}。网络微弱但安全，勿念！`;
    }

    if (statusType === 'trapped') {
      return `【受困求援】我是${who}，于${timeStr}受困泥石流/塌方。同行${companions}人。位置${locationStr}。急需撤离协助${extraNeeds ? '及' + extraNeeds : ''}，请代为报警！`;
    }

    // critical SOS
    return `【🚨危急SOS】我是${who}！泥石流灾情严重，同行${companions}人，有伤员！位置${locationStr}。急需直升机/担架及医疗救援${extraNeeds ? '，' + extraNeeds : ''}！救命！`;
  };

  const messageText = generateMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSMS = () => {
    const phone = selectedContactPhone || (contacts.length > 0 ? contacts[0].phone : '');
    // SMS URI standard format
    // iOS and modern Android support: sms:PHONE?body=MSG (or ;body= on older iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&body=' : '?body=';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const smsUrl = `sms:${cleanPhone}${separator}${encodeURIComponent(messageText)}`;
    window.location.href = smsUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                亲友紧急联络 & 短报文
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                适配 2G 弱信号与北斗/卫星短报文（零流量依赖）
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Identity & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                您的姓名/称呼
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="如: 张三 / 小张"
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                同行总人数
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={companions}
                onChange={(e) => setCompanions(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Quick Status Buttons */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              当前状态
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatusType('safe')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  statusType === 'safe'
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 ring-2 ring-green-500/20 font-bold'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-1 text-green-500" />
                我已平安
              </button>
              <button
                type="button"
                onClick={() => setStatusType('trapped')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  statusType === 'trapped'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 ring-2 ring-yellow-500/20 font-bold'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <HeartHandshake className="w-5 h-5 mb-1 text-yellow-500" />
                受困待援
              </button>
              <button
                type="button"
                onClick={() => setStatusType('critical')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  statusType === 'critical'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 ring-2 ring-red-500/20 font-bold'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <AlertOctagon className="w-5 h-5 mb-1 text-red-500" />
                危急 SOS
              </button>
            </div>
          </div>

          {/* Location Badge */}
          <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              {isLocating ? (
                <span className="animate-pulse text-gray-500">正在定位精准GPS...</span>
              ) : coords ? (
                <span>
                  {coords.lat}, {coords.lng} {coords.alt ? `(海拔${coords.alt}m)` : ''} ±{coords.acc}m
                </span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-400">{locationError || '未获取到GPS'}</span>
              )}
            </div>
            <button
              type="button"
              onClick={fetchLocation}
              disabled={isLocating}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {isLocating ? '获取中' : '刷新GPS'}
            </button>
          </div>

          {/* Optional Extra Notes */}
          {statusType !== 'safe' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                补充紧急需求 (选填)
              </label>
              <input
                type="text"
                value={extraNeeds}
                onChange={(e) => setExtraNeeds(e.target.value)}
                placeholder="如: 止血带/夹板/保暖睡袋/饮用水断绝"
                className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}

          {/* Generated Text Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                生成的高密度短报文 ({messageText.length} 字)
              </label>
              <span className="text-[10px] text-gray-400">
                {messageText.length <= 70 ? '🟢 符合单条卫星短报文' : '🟡 稍长，建议精简'}
              </span>
            </div>
            <div className="p-3 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-800 break-all leading-relaxed select-all">
              {messageText}
            </div>
          </div>

          {/* Emergency Contacts Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                发送对象 (手机号)
              </label>
              <button
                type="button"
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {showAddContact ? '收起' : '管理联系人'}
              </button>
            </div>

            {showAddContact && (
              <div className="p-3 mb-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="姓名 (如: 妈妈)"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-1/3 text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <input
                    type="tel"
                    placeholder="手机号"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="flex-1 text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <Button size="sm" onClick={handleAddContact}>
                    添加
                  </Button>
                </div>
                <div className="space-y-1">
                  {contacts.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <span>{c.name}: {c.phone || '(未填号码)'}</span>
                      <button onClick={() => handleDeleteContact(c.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setSelectedContactPhone(contact.phone)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    selectedContactPhone === contact.phone
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  {contact.name} {contact.phone ? `(${contact.phone})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleSendSMS}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              一键唤起原生短信 / 卫星发送
            </button>
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制报文' : '复制文本(微信/群发)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
