import React, { useState } from 'react';
import { 
  X, BookOpen, AlertTriangle, ShieldAlert, ThermometerSnowflake, 
  Droplets, Activity, ChevronRight, CheckCircle2 
} from 'lucide-react';

interface DisasterFieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisasterFieldGuideModal: React.FC<DisasterFieldGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'mudslide' | 'hypothermia' | 'water' | 'firstaid'>('mudslide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                离线泥石流与高原自救手册
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                断网环境下常驻本地的生死应急避险指南
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

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('mudslide')}
            className={`py-3 px-2 text-center border-b-2 transition-all ${
              activeSection === 'mudslide'
                ? 'border-red-500 text-red-600 dark:text-red-400 font-bold bg-white dark:bg-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            泥石流逃生
          </button>
          <button
            onClick={() => setActiveSection('hypothermia')}
            className={`py-3 px-2 text-center border-b-2 transition-all ${
              activeSection === 'hypothermia'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            高原防失温
          </button>
          <button
            onClick={() => setActiveSection('water')}
            className={`py-3 px-2 text-center border-b-2 transition-all ${
              activeSection === 'water'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-bold bg-white dark:bg-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            水源净化
          </button>
          <button
            onClick={() => setActiveSection('firstaid')}
            className={`py-3 px-2 text-center border-b-2 transition-all ${
              activeSection === 'firstaid'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            落石外伤
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 text-xs leading-relaxed space-y-4">
          {activeSection === 'mudslide' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl">
                <span className="font-bold text-sm text-red-800 dark:text-red-300 block mb-1">
                  🚨 生死铁律：必须垂直向两侧高坡跑！
                </span>
                <p className="text-red-700 dark:text-red-200">
                  绝对不要顺着泥石流冲刷的沟谷方向往下跑！泥石流流速可达数十米每秒，人类奔跑速度无法抗衡。向与泥石流流动方向垂直的两侧高地山坡全力攀登。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  前兆识别与警戒
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 pl-1">
                  <li><strong>异常轰鸣声</strong>：山谷深处传来如火车行进或打雷般的闷响。</li>
                  <li><strong>河流异常突变</strong>：原本清澈的溪水瞬间变得极度浑浊，或河水突然暴涨、突然断流（警惕上游形成堰塞湖）。</li>
                  <li><strong>落石与树木倾斜</strong>：山体上方有碎石崩落或树木发生歪斜，代表土体正在剧烈滑动。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  避难位置选择
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  切勿在陡峭山坡下方、凹形谷底、大树下或滚石易堆积区停留；应选择地势开阔、基岩坚固的高台高地作为临时避难所。
                </p>
              </div>
            </div>
          )}

          {activeSection === 'hypothermia' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-r-xl">
                <span className="font-bold text-sm text-blue-800 dark:text-blue-300 block mb-1">
                  ❄️ 高原失温是隐形头号杀手
                </span>
                <p className="text-blue-700 dark:text-blue-200">
                  泥石流常伴随强降雨和山风，高原气温在淋湿后几十分钟内即可导致核心体温降至 35℃ 以下引发致命失温。
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-500" />
                  防失温急救四步法
                </h3>
                <div className="grid gap-2">
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white block mb-0.5">1. 立即隔绝湿冷</strong>
                    <span className="text-gray-600 dark:text-gray-300">迅速脱掉被泥浆和冰水浸湿的外衣，换上干衣服；如果没有干衣服，用塑料袋、救生毯包裹身体核心部位防风。</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white block mb-0.5">2. 隔绝冰冷地面</strong>
                    <span className="text-gray-600 dark:text-gray-300">严禁直接坐在或躺在湿泥冰地上。用树枝、背包、塑料板垫在身下，减少热量通过传导流失。</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white block mb-0.5">3. 核心区域复温</strong>
                    <span className="text-gray-600 dark:text-gray-300">温水壶（或同行人体温）应优先贴附在颈部两侧、腋下、腹股沟（大动脉流经处），严禁先泡热水或烘烤四肢。</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white block mb-0.5">4. 严禁事项</strong>
                    <span className="text-gray-600 dark:text-gray-300">严禁饮酒（酒精会扩张血管加速散热），严禁大力揉搓或拍打冻僵身体部位，避免引发严重心律失常。</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'water' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 rounded-r-xl">
                <span className="font-bold text-sm text-teal-800 dark:text-teal-300 block mb-1">
                  💧 泥石流污染水源后的应急净化
                </span>
                <p className="text-teal-700 dark:text-teal-200">
                  灾后河道水源充满泥沙、重金属和人畜粪便病原体，强行直接饮用会导致严重呕吐腹泻，在高原加速脱水危及生命。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-teal-500" />
                  野外三步取水净化法
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-gray-600 dark:text-gray-300">
                  <li><strong>泥水静置沉淀</strong>：将浑浊泥水装入容器静置 30~60 分钟，上层清液吸出或倾倒至另一容器。如有草木灰或微量盐可加速絮凝沉淀。</li>
                  <li><strong>简易分层过滤</strong>：将塑料瓶底部剪开，由下至上填入：干净衣物布料（底层）- 捣碎木炭（吸附异味）- 细沙（截留微粒）- 粗砂石（粗滤）。</li>
                  <li><strong>必须彻底煮沸</strong>：高海拔沸点低（如3000米海拔沸点约90℃），因此必须保持大滚沸腾持续 3 分钟以上方可杀灭病原菌。</li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'firstaid' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500 rounded-r-xl">
                <span className="font-bold text-sm text-purple-800 dark:text-purple-300 block mb-1">
                  🩹 落石砸伤与骨折急救固定
                </span>
                <p className="text-purple-700 dark:text-purple-200">
                  山体崩塌易造成肢体骨折或开放性大出血，现场抢救原则是：先止血、再包扎、严禁盲目复位骨折端。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-500" />
                  外伤处置要领
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 pl-1">
                  <li><strong>大出血止血</strong>：用干净布料压迫伤口直接止血。如喷射状出血，在伤口上方近心端使用止血带或撕开的衣物强力扎紧，并在纸上标注止血带扎紧时间（每隔45分钟需松开放松1~2分钟）。</li>
                  <li><strong>骨折简易夹板</strong>：利用登山杖、树枝、硬纸壳放在受伤肢体两侧，用鞋带或布条固定，固定范围必须超过骨折部位的上下两个相邻关节。</li>
                  <li><strong>脊柱与颈部疑似骨折</strong>：严禁一人抱头一人抬腿搬运，必须至少3人以“轴线滚动法”协同将伤员平移至平整硬板上。</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
