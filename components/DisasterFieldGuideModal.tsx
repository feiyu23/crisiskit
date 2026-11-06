import React, { useState } from 'react';
import { 
  X, BookOpen, AlertTriangle, ShieldAlert, ThermometerSnowflake, 
  Droplets, Activity, ChevronRight, CheckCircle2, Flame, Wind 
} from 'lucide-react';
import { getLang } from '../utils/i18n';

interface DisasterFieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisasterFieldGuideModal: React.FC<DisasterFieldGuideModalProps> = ({ isOpen, onClose }) => {
  const lang = getLang();
  const isEn = lang === 'en';

  const [activeSection, setActiveSection] = useState<'earthquake' | 'mudslide' | 'volcano' | 'hypothermia' | 'water' | 'pandemic'>('earthquake');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in safe-area-inset">
      <div className="bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-800/60 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600 text-white rounded-2xl shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {isEn ? 'Multi-Hazard Field Survival Guide' : '极境多灾种离线自救与避险手册'}
                </h2>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  {isEn ? 'Earthquake · Volcano · Flood · Cold · Epidemic' : '地震 · 火山 · 泥石流 · 极寒 · 疫情'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isEn 
                  ? 'Offline actionable protocols for life-or-death decisions in extreme global disasters.'
                  : '全球极端灾害断网离线图解 · 生死抉择与救命避险指南'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-bold">
          <button
            onClick={() => setActiveSection('earthquake')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'earthquake'
                ? 'border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Earthquake' : '地震避险'}
          </button>
          <button
            onClick={() => setActiveSection('mudslide')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'mudslide'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Mudslide/Flood' : '泥石流/山洪'}
          </button>
          <button
            onClick={() => setActiveSection('volcano')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'volcano'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Volcano/Ash' : '火山/火山灰'}
          </button>
          <button
            onClick={() => setActiveSection('hypothermia')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'hypothermia'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Hypothermia' : '防失温冻伤'}
          </button>
          <button
            onClick={() => setActiveSection('water')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'water'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Clean Water' : '净水与卫生'}
          </button>
          <button
            onClick={() => setActiveSection('pandemic')}
            className={`py-3 px-1 text-center border-b-2 transition-all ${
              activeSection === 'pandemic'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {isEn ? 'Epidemic' : '疫情与封控'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
          {/* 1. Earthquake */}
          {activeSection === 'earthquake' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: DROP, COVER, HOLD ON! Never use elevators during or after tremors.' : '核心法则：伏地、遮挡、抓牢！震时千万不要盲目跳楼或乘坐电梯。'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Indoors: Drop, Cover, Hold On' : '1. 室内避震：伏地、遮挡、抓牢'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Drop to your hands and knees. Cover your head and neck under a sturdy table or desk. If no shelter nearby, drop next to an interior wall and cover your head with your arms.'
                      : '迅速趴下，躲在坚固的桌子或承重墙角下，用手臂护住头颈。远离窗户、吊灯、玻璃和高大橱柜。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Outdoors: Move to Open Ground' : '2. 室外避震：迅速转移到开阔地'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Stay clear of buildings, power lines, chimneys, brick walls, and signboards. Beware of falling glass shards and debris.'
                      : '远离高大建筑物、广告牌、立交桥和高压电线。在开阔地蹲下，用背包护住头部。在山区警惕滚石与滑坡。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Trapped Under Rubble: Conserve Energy & Tap Pipes' : '3. 若不幸被埋压：保存体能，敲击发声'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Cover mouth/nose with cloth against toxic concrete dust. Avoid screaming continuously (wastes oxygen). Tap on metallic pipes, stones, or blow a whistle to signal rescuers.'
                      : '用衣物捂住口鼻防吸入粉尘。不要盲目大喊以节省氧气和体力。用石块敲击铁管、墙壁或吹响求生哨，在听到外界搜救声时再呼救。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Mudslide & Flood */}
          {activeSection === 'mudslide' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: NEVER run down the valley! Run PERPENDICULAR to the mudslide direction.' : '核心法则：绝不顺着山沟往下跑！必须向泥石流流向垂直的两侧高地跑！'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Perpendicular Climbing Principle' : '1. 垂直两侧高坡逃生'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Mudslides travel at 30-50 km/h down gullies. Running downwards is fatal. Immediately scramble up the left or right slopes perpendicular to the path.'
                      : '泥石流顺沟谷而下的速度可达每秒十米以上，顺沟跑绝无生还可能。发现响声或山洪必须立刻向垂直两侧山坡高处攀爬。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Beware of Dammed Lake Breaches (堰塞湖溃决)' : '2. 警惕上游断流与轰鸣（堰塞湖溃决前兆）'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'If a heavy-flowing mountain river suddenly dries up or turns muddy into a trickle, upstream landslides have blocked it. A catastrophic breach will occur within minutes. Evacuate valleys immediately.'
                      : '雨后溪水若突然大幅减小甚至断流，且上游伴有沉闷轰鸣，说明上游已被滑坡堵截成堰塞湖！随时会发生特大溃决，所有人必须立刻撤离低洼河谷！'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Avoid Climbing Trees or Weak Structures' : '3. 切勿躲在树上或土质斜坡下'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Massive boulders and root-tearing mud easily uproot giant trees and flatten single-story structures. Climb onto solid bedrock ridges.'
                      : '泥石流冲刷力巨大，连根拔起巨树和冲毁瓦房是瞬间的事。不要爬树躲避，也不要在陡峭土坡下停留，应选择基岩坚固的高脊。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Volcano & Ash */}
          {activeSection === 'volcano' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: Volcanic ash is crushed glass and silica! Protect lungs, eyes, and beware of roof collapse.' : '核心法则：火山灰是细碎的火山玻璃与硅酸盐！保护呼吸道、护眼，严防屋顶压塌。'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Respiratory Protection' : '1. 口鼻与呼吸道防护'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Wear an N95/FFP2 mask or breathe through a damp cloth. Inhaling volcanic ash causes acute pulmonary distress and chemical pneumonia.'
                      : '必须佩戴 N95/KN95 口罩，或用湿毛巾捂住口鼻。火山灰吸入肺部会与水结合形成粘固物，造成急性窒息与肺部化学灼伤。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Eye Protection: No Contact Lenses' : '2. 眼睛防护：严禁佩戴隐形眼镜'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Wear sealed goggles. Contact lenses combined with sharp volcanic glass particles will scratch and blind corneas.'
                      : '必须摘掉隐形眼镜换用框架眼镜或密封护目镜。尖锐的微观玻璃碎屑进入眼眶揉搓会导致角膜永久刮伤致盲。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Heavy Ash Hazard: Roof Collapse' : '3. 火山灰极重：防范屋顶积灰压塌'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Dry ash is heavy; wet ash is as dense as wet cement (10-15 cm can collapse standard roofs). Stay away from flat corrugated or lightweight roofs.'
                      : '干燥火山灰极其沉重，一旦吸水密度等同于湿水泥，10厘米厚即可压垮轻钢和瓦房屋顶。不要躲在轻质棚屋下。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Hypothermia */}
          {activeSection === 'hypothermia' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: Wet cold kills faster than starvation! Ground conducts body heat 32x faster than air.' : '核心法则：湿冷失温杀人速度远超饥饿！冰冷地面导热速度是空气的32倍。'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Ground Barrier (Top Priority)' : '1. 身下隔绝地面（第一生死戒条）'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Never sleep or sit directly on damp rock or mud. Pile dry leaves, branches, corrugated cardboard, or backpacks to create a 10cm insulating barrier.'
                      : '绝不可直接坐在泥水或冰冷岩石上！收集树枝、纸箱、背包垫在身下，形成至少10厘米厚的隔温层。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Keep Clothes Dry & Layer Up' : '2. 严控湿衣服，锁住核心体温'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Wet clothes drain warmth. Strip soaked outer layers if you have dry replacements, or wrap a thermal foil space blanket inside your jacket.'
                      : '湿衣服是吸热器。如果有干衣物应立即更换；若没有，用塑料袋或保温铝箔毯紧贴身体内层隔水防风。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Rewarming Protocol: Warm Sugar Water' : '3. 复温禁忌与温糖水补充'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Never give alcohol or rub frostbitten limbs with snow. Give warm sugary liquids if conscious. Huddle together chest-to-chest.'
                      : '严禁饮酒暖身（酒精导致外周血管扩张，加速核心失温），严禁搓揉冻伤手脚。应补充温糖水，多人胸贴胸抱团取暖。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Clean Water & Sanitation */}
          {activeSection === 'water' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: Diarrhea in disasters causes rapid shock. Clear, boil, or chemical treat all water.' : '核心法则：灾后腹泻致脱水休克极度危险！所有生水必须澄清、煮沸或药剂净化。'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Three-Step Clarification' : '1. 野外泥水三步简易澄清法'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Muddy flood water contains pathogens. Let it settle in a container for 1-2 hours. Filter top water through folded cloth, sand, or charcoal to remove turbidity.'
                      : '山洪泥水静置沉淀1-2小时，将上方清水用多层棉布、沙子或木炭碎过滤，去浊除杂。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Rolling Boil for 1-3 Minutes' : '2. 持续煮沸 1~3 分钟'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Boiling is the most reliable pathogen kill. At high altitudes (over 2000m), boil for a full 3 minutes as water boils at lower temperatures.'
                      : '煮沸是杀灭寄生虫和细菌最可靠方式。在海拔2000米以上高原，因沸点降低，必须维持滚沸状态持续至少3分钟。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Never Defecate Near Water Sources' : '3. 避难所水源上游严禁排泄'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Designate latrines at least 50 meters downhill and away from collected water sources to prevent cholera and norovirus outbreaks.'
                      : '临时厕所必须设置在饮用水源下方至少50米处，排泄物必须深埋或用垃圾袋装扎，防止霍乱与诺如病毒爆发。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. Epidemic & Quarantine */}
          {activeSection === 'pandemic' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-bold">
                ⚠️ {isEn ? 'Core Rule: In epidemics and lockdown: Rolling stock for medicine, sanitize hands, isolate sick quarters.' : '核心法则：疫情与封控断运时：处方药滚动备足、严格洗手消毒、避难所单设隔离角。'}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '1. Shelter Isolation Corner' : '1. 避难所必须设立专属隔离角'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Anyone exhibiting high fever, persistent coughing, or severe diarrhea must be isolated at the downwind corner of the shelter.'
                      : '避难所人口密集极易交叉感染。发热、持续剧咳或呕吐腹泻者必须安置在下风向独立隔离角，佩戴口罩并指定专人送餐。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '2. Disinfection of High-Touch Surfaces' : '2. 高频接触面酒精与含氯消毒'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Door handles, water taps, and toilet seats should be wiped with 75% alcohol or diluted bleach regularly.'
                      : '门把手、共用水龙头、马桶圈用75%酒精或84消毒液稀释擦拭，饭前便后使用洗手液或含酒精手消液。'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">
                    {isEn ? '3. Critical Medication Continuity' : '3. 长期服药者的用药持续性管理'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'Do not stop chronic treatments abruptly during quarantines. Use the Community Mutual Aid Board to request emergency dose borrows.'
                      : '封控断药切勿擅自断服降压药、抗凝药或抗抑郁药。利用社区余缺互助板向邻里借药应急。'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            {isEn ? 'Knowledge is the first armor in survival.' : '灾前懂自救，灾时少慌乱 · 科学知识是生命的第一道防线'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition"
          >
            {isEn ? 'Close' : '关闭手册'}
          </button>
        </div>
      </div>
    </div>
  );
};
