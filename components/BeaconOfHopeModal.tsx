import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Wind, Clock, Users, Mail, Sparkles, 
  CheckCircle2, Shield, AlertCircle, Send, Trash2 
} from 'lucide-react';
import { messageCapsuleService, MessageCapsule } from '../services/messageCapsuleService';
import { Button } from './Button';

interface BeaconOfHopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeaconOfHopeModal: React.FC<BeaconOfHopeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'timeline' | 'roles' | 'capsule'>('breathing');

  // 4-7-8 Breathing state: inhale(4s), hold(7s), exhale(8s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4);

  // Message capsule state
  const [capsules, setCapsules] = useState<MessageCapsule[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [senderName, setSenderName] = useState(() => localStorage.getItem('crisiskit_my_name') || '');
  const [messageText, setMessageText] = useState('');
  const [sealedSuccess, setSealedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCapsules();
    }
  }, [isOpen]);

  const loadCapsules = async () => {
    const list = await messageCapsuleService.getAllCapsules();
    setCapsules(list);
  };

  // Breathing loop timer
  useEffect(() => {
    if (!isOpen || activeTab !== 'breathing') return;

    let timer: any;
    if (breathPhase === 'inhale') {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathPhase('hold');
            return 7;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (breathPhase === 'hold') {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathPhase('exhale');
            return 8;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (breathPhase === 'exhale') {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathPhase('inhale');
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOpen, activeTab, breathPhase]);

  const handleSealCapsule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !messageText.trim()) return;

    await messageCapsuleService.saveCapsule({
      recipientName: recipientName.trim(),
      recipientContact: recipientContact.trim(),
      senderName: senderName.trim() || '我',
      messageText: messageText.trim()
    });

    setSealedSuccess(true);
    setMessageText('');
    setRecipientName('');
    setRecipientContact('');
    await loadCapsules();
    setTimeout(() => setSealedSuccess(false), 2000);
  };

  const handleDeleteCapsule = async (id: string) => {
    await messageCapsuleService.deleteCapsule(id);
    await loadCapsules();
  };

  const handleSendCapsuleSMS = (capsule: MessageCapsule) => {
    const text = `【离线爱的留言】亲爱的${capsule.recipientName}，我是${capsule.senderName}：\n"${capsule.messageText}"\n（来自CrisisKit灾后脱险自动发送）`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&body=' : '?body=';
    const cleanPhone = capsule.recipientContact.replace(/[^0-9+]/g, '');
    window.location.href = `sms:${cleanPhone}${separator}${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-700/50 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Warm cultural header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  微光与希望 · 心理与互助站
                </h2>
                <span className="text-[11px] font-serif text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                  བཀྲ་ཤིས་བདེ་ལེགས
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                生命有限，爱与信念无限 · 黑暗中我们守护彼此
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'breathing'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            呼吸平复
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            救援节奏
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'roles'
                ? 'border-green-500 text-green-600 dark:text-green-400 font-bold bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            临时自治
          </button>
          <button
            onClick={() => setActiveTab('capsule')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'capsule'
                ? 'border-red-500 text-red-600 dark:text-red-400 font-bold bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            爱的胶囊
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed">
          {/* TAB 1: BREATHING ANCHOR */}
          {activeTab === 'breathing' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-fade-in">
              <div className="text-center max-w-sm">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block mb-1">
                  4-7-8 极境心理平复呼吸环
                </span>
                <p className="text-gray-500 dark:text-gray-400">
                  人在极度恐惧时会过度换气、加速失温。请放松肩膀，把注意力集中在微光光圈上：
                </p>
              </div>

              {/* Breathing Visual Ring */}
              <div className="relative flex items-center justify-center w-48 h-48">
                {/* Pulsing ring */}
                <div 
                  className={`absolute rounded-full border-4 transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'w-44 h-44 border-amber-400 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                      : breathPhase === 'hold'
                      ? 'w-44 h-44 border-blue-400 bg-blue-400/20 shadow-[0_0_40px_rgba(96,165,250,0.5)]'
                      : 'w-24 h-24 border-emerald-400 bg-emerald-400/5 shadow-none'
                  }`}
                />
                <div className="z-10 text-center select-none">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {breathCounter}s
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 mt-1">
                    {breathPhase === 'inhale' ? '深深吸气 4秒' : breathPhase === 'hold' ? '屏住呼吸 7秒' : '缓缓吐气 8秒'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl max-w-md w-full space-y-2 text-gray-700 dark:text-gray-300">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <Heart className="w-4 h-4 text-red-500" />
                  现场老人与儿童安抚要领：
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>握紧双手</strong>：身体接触能直接刺激副交感神经，迅速降低体内肾上腺素。</li>
                  <li><strong>平视双眼</strong>：蹲下身体平视受惊孩子的眼睛，用极其平缓坚定的声调说：“我们现在在一起，非常安全。”</li>
                  <li><strong>不要说“别怕”</strong>：直接肯定他们的勇敢——“你刚才做得非常棒，我们正在安全处等待直升机叔叔”。</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE OF HOPE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-r-xl">
                <span className="font-bold text-sm text-blue-900 dark:text-blue-200 block mb-1">
                  ⏱️ 72小时黄金搜救时间线：外界正在日夜兼程奔赴你
                </span>
                <p className="text-blue-800 dark:text-blue-300">
                  通信中断并不代表你被世界遗忘。国家遥感卫星、应急测绘无人机已在泥石流发生数分钟内启动响应。
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 shadow" />
                  <div className="font-bold text-gray-900 dark:text-white">第 0 ~ 6 小时：紧急集结与空中勘察</div>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                    边防武警、消防特勤力量集结；高分卫星与大型无人机进入灾区空域勘探塌方点；直升机起降场与航线管制就绪。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900 shadow" />
                  <div className="font-bold text-gray-900 dark:text-white">第 6 ~ 18 小时：先头搜救挺进与临时通信恢复</div>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                    地面先遣分队徒步绕过滑坡体开辟便道；应急通信车、系留气球基站向断网孤岛边缘推进；首批空中侦察机飞临搜寻地面反光与烟火。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 shadow" />
                  <div className="font-bold text-gray-900 dark:text-white">第 18 ~ 36 小时：空投补给与重伤员直升机转运</div>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                    大型救援直升机展开悬停吊运，对无降落条件的高地空投高能食品、干衣、防失温保温毯与急救药品。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 shadow" />
                  <div className="font-bold text-gray-900 dark:text-white">第 36 ~ 72 小时：生命陆路打通与地毯式排查</div>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                    大型工程机械抢通塌方阻断道路，搜救犬与生命探测仪完成村落、避难所全覆盖排查，伤员全面后方转运。
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 text-center font-medium">
                💡 此时此刻你最需要做的事：<strong>保存手机电量、保持体温干燥、轮流值守休息。</strong>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-r-xl">
                <span className="font-bold text-sm text-green-900 dark:text-green-200 block mb-1">
                  🤝 避难所自治：从受害者转为守护彼此的英雄
                </span>
                <p className="text-green-800 dark:text-green-300">
                  当人们开始认领角色、分工协作时，群体的绝望与恐慌将烟消云散。请向身边的同胞宣读以下 5 个守护角色：
                </p>
              </div>

              <div className="grid gap-2.5">
                <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">落石与水流哨兵（2人轮流）</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">面向山坡与溪水，每隔30分钟轮换一次，警惕山谷闷响、落石或溪水突然断流等二次险情。</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">保暖与地面隔绝员</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">收集干燥树枝、纸壳、背包，垫在老人与孩子身下，确保无人直接接触冰冷湿地，防止失温。</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">物资规划与纯净水分发员</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">统筹现场所有干粮与饮用水，按“优先供给伤员老人幼儿、少量多次饮用”的原则科学分发。</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">离线名册与信息记录员</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">拿一台手机在 CrisisKit 中把现场所有人员录入“平安名册”，并写好一张纸质名单备份在口袋中。</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">关怀陪伴与心理互勉员</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">握住哭泣者的手，带大家做 4-7-8 呼吸，带领大家轻声唱起家乡熟悉的歌或祷词，驱散黑暗。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGE CAPSULE */}
          {activeTab === 'capsule' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl">
                <span className="font-bold text-sm text-red-900 dark:text-red-200 block mb-1">
                  💌 封存给至亲的爱与牵挂
                </span>
                <p className="text-red-800 dark:text-red-300">
                  写下你最想对父母、爱人、孩子说的话。消息将安全封存于你的手机。一旦连接到微弱网络或搜救基站，支持一键发送。给心中燃起活下去见面的强光。
                </p>
              </div>

              {sealedSuccess && (
                <div className="p-3 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2 font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  爱的胶囊已封存入手机本地存储！
                </div>
              )}

              <form onSubmit={handleSealCapsule} className="space-y-3 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      收信人称呼 (如: 爸爸妈妈 / 老婆)
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="亲人称呼"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      收信人手机号 (选填)
                    </label>
                    <input
                      type="tel"
                      value={recipientContact}
                      onChange={(e) => setRecipientContact(e.target.value)}
                      placeholder="138xxxxxxxx"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    心里话 (温暖、叮嘱、鼓励)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="不要担心我，我和同胞们互相照应得很好，我会坚强走出去见你们！"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl shadow hover:opacity-95 transition flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  离线封存这份爱与信念
                </button>
              </form>

              {/* Saved capsules list */}
              {capsules.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                    已封存的信件 ({capsules.length})：
                  </div>
                  {capsules.map((cap) => (
                    <div 
                      key={cap.id}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">
                          致：{cap.recipientName} {cap.recipientContact ? `(${cap.recipientContact})` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          {cap.recipientContact && (
                            <button
                              onClick={() => handleSendCapsuleSMS(cap)}
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <Send className="w-3 h-3" />
                              调起短信发TA
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCapsule(cap.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900/40 p-2 rounded">
                        "{cap.messageText}"
                      </p>
                      <div className="text-[10px] text-gray-400">
                        封存时间：{new Date(cap.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with blessing quote */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 text-center text-[11px] text-gray-500 dark:text-gray-400">
          “愿所有穿越风暴与落石的生灵，皆得护佑与归途 · 扎西德勒”
        </div>
      </div>
    </div>
  );
};
