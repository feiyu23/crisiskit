import React, { useState, useEffect } from 'react';
import { 
  X, Backpack, Droplets, Utensils, Pill, Zap, 
  Sparkles, CheckCircle2, ShieldCheck, Heart, AlertTriangle, 
  RotateCcw, Share2 
} from 'lucide-react';
import { getLang } from '../utils/i18n';

interface FamilyStockpileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STOCKPILE_CHECKED_KEY = 'crisiskit_stockpile_checked';

export const FamilyStockpileModal: React.FC<FamilyStockpileModalProps> = ({ isOpen, onClose }) => {
  const lang = getLang();
  const isEn = lang === 'en';

  // Family profile inputs
  const [adults, setAdults] = useState<number>(2);
  const [seniors, setSeniors] = useState<number>(0);
  const [children, setChildren] = useState<number>(1);
  const [pets, setPets] = useState<number>(0);
  const [days, setDays] = useState<number>(7); // Default 7 days (Nordic/German standard)

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STOCKPILE_CHECKED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STOCKPILE_CHECKED_KEY, JSON.stringify(checkedItems));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetChecklist = () => {
    if (confirm(isEn ? 'Reset all checked items?' : '重置所有清点勾选标记？')) {
      setCheckedItems({});
    }
  };

  if (!isOpen) return null;

  // Total people
  const totalPeople = adults + seniors + children;
  
  // Calculations based on MSB (Sweden), BBK (Germany), FEMA guidelines
  // 3-4 liters per person per day for drinking + minimal cooking
  const waterLiters = totalPeople * days * 3.5 + pets * days * 1;
  // ~2100 kcal per day
  const totalKcal = (adults * 2200 + seniors * 1900 + children * 1600) * days;
  // Gas canisters for camping stove (1 canister = ~2-3 days for basic hot water/meals)
  const gasCanisters = Math.max(1, Math.ceil((days / 3) * (totalPeople > 2 ? 1.5 : 1)));

  const categories = [
    {
      id: 'water',
      title: isEn ? '💧 Potable Water & Hydration' : '💧 饮用水与生命水源',
      subtitle: isEn 
        ? `Target: ${Math.round(waterLiters)} Liters (3.5L/person/day + 1L/pet)`
        : `目标储备量：约 ${Math.round(waterLiters)} 升 (按每人每天3.5升+宠物1升计算)`,
      items: [
        {
          id: 'w1',
          name: isEn ? `Bottled/Sealed water: at least ${Math.round(waterLiters)} L` : `密封瓶装饮用水：至少 ${Math.round(waterLiters)} 升`,
          tip: isEn ? 'Keep in cool, dark place. Freeze some in plastic PET bottles as emergency ice packs.' : '放置于阴凉避光处，可冷冻部分PET塑料瓶兼作停电冰袋'
        },
        {
          id: 'w2',
          name: isEn ? 'Water purification tablets / Camping straw filter' : '二氧化氯净水药片 / 户外便携滤水吸管',
          tip: isEn ? 'Treat natural water sources in case pipes are severed or contaminated.' : '自来水管爆裂或断供时，用于净化河溪水与雨水'
        },
        {
          id: 'w3',
          name: isEn ? 'Collapsible food-grade water container (10-20L)' : '折叠食品级储水袋 / 水桶 (10~20升)',
          tip: isEn ? 'Essential for collecting water from emergency municipal trucks.' : '应急供水车进驻或寻找干净水源时搬运用'
        }
      ]
    },
    {
      id: 'food',
      title: isEn ? '🥫 Shelf-Stable Nutrition' : '🥫 耐存高热量免烹饪食物',
      subtitle: isEn 
        ? `Target: ~${Math.round(totalKcal / 1000)}k Calories for ${days} Days`
        : `目标储备热量：约 ${Math.round(totalKcal / 1000)} 千大卡 (${days}天自给)`,
      items: [
        {
          id: 'f1',
          name: isEn ? 'Ready-to-eat proteins: Canned fish/meat/beans' : '开罐即食蛋白类：鱼罐头、午餐肉、鹰嘴豆罐头',
          tip: isEn ? 'No refrigeration or electricity needed. Eat cold if required.' : '无需冷藏，断电断燃气时开罐即可冷食补充体力'
        },
        {
          id: 'f2',
          name: isEn ? 'High-density energy: Peanut butter, nuts, energy bars' : '高能脂质与坚果：花生酱、混合坚果、压缩饼干、黑巧克力',
          tip: isEn ? 'High calorie density per gram, quick blood sugar boost.' : '单位体积热量最高，迅速补充血糖抵御寒冷'
        },
        {
          id: 'f3',
          name: isEn ? 'Dry staple carbs: Oats, quick pasta, vacuum rice' : '耐存碳水主食：速食燕麦片、免煮米线、真空包装挂面',
          tip: isEn ? 'Can be softened with minimal warm water.' : '保质期长达1-2年，只需少量温水即可泡软食用'
        },
        {
          id: 'f4',
          name: isEn ? 'Manual mechanical can opener (Crucial!)' : '手动机械开罐器 (至关重要！)',
          tip: isEn ? 'Do not rely on electric openers.' : '很多罐头无拉环，避免断电后对着罐头干着急'
        }
      ]
    },
    {
      id: 'medical',
      title: isEn ? '💊 Critical Medicine & First Aid' : '💊 关键医药与急救耗材',
      subtitle: isEn ? 'At least 14 days of personal prescription drugs' : '个人慢性病处方药至少备足14天份',
      items: [
        {
          id: 'm1',
          name: isEn ? 'Personal prescription meds: 14-30 day buffer' : '家庭成员专属慢性病处方药 (高血压/哮喘/糖尿病等)',
          tip: isEn ? 'Pharmacies and logistics collapse first in extreme crises.' : '大灾或封控时药店断货最快，必须常态化滚动保持余量'
        },
        {
          id: 'm2',
          name: isEn ? 'OTC First Aid Kit: Antiseptic, bandages, tourniquet' : '创伤急救包：碘伏消毒棉片、弹力绷带、止血带、医用胶带',
          tip: isEn ? 'Treat cuts and fractures from broken glass, rubble, or falls.' : '应对地震、滑坡碎石与玻璃割伤'
        },
        {
          id: 'm3',
          name: isEn ? 'Essential OTCs: Oral rehydration salts, ibuprofen, anti-diarrhea' : '常备非处方药：口服补液盐(ORS)、布洛芬退烧止痛、蒙脱石散',
          tip: isEn ? 'Dehydration from acute diarrhea in disasters is life-threatening.' : '不洁水源引发腹泻时补液盐能防止重度脱水休克'
        }
      ]
    },
    {
      id: 'energy',
      title: isEn ? '⚡ Heat, Power & Communication' : '⚡ 供暖、电能与离线通信',
      subtitle: isEn ? 'Prepare for total grid blackout and zero cellular network' : '做好电网全断、天然气停供、手机基站瘫痪准备',
      items: [
        {
          id: 'e1',
          name: isEn ? `Portable camping cassette stove + ${gasCanisters} gas canisters` : `便携式卡式炉 + 至少 ${gasCanisters} 罐丁烷气罐`,
          tip: isEn ? 'Boil water, warm food, melt snow safely.' : '断气断电时烧水消毒与制作热食的核心保障'
        },
        {
          id: 'e2',
          name: isEn ? 'Solar / Hand-crank emergency radio with FM/AM' : '手摇发电 / 太阳能应急收音机 (支持FM/AM)',
          tip: isEn ? 'Official emergency frequencies broadcast when internet and cell towers go dark.' : '断网断信号时获取政府搜救通告与空投信息的唯一渠道'
        },
        {
          id: 'e3',
          name: isEn ? 'Large power banks (20,000mAh+) kept at 100%' : '20,000mAh+ 充电宝至少2块 (常态保持满电)',
          tip: isEn ? 'Keep phones and flashlights charged.' : '保持手机充沛电量用于离线GPS定位和离线求生手册'
        },
        {
          id: 'e4',
          name: isEn ? 'Emergency thermal foil blankets (1 per person)' : '便携铝箔防失温保温毯 (每人至少1-2条)',
          tip: isEn ? 'Reflects 90% of body heat. Windproof and waterproof.' : '轻便防风防水，能反射90%人体热量，高寒与雨水救命神器'
        }
      ]
    },
    {
      id: 'sanitation',
      title: isEn ? '🧻 Sanitation, Waste & Dust Protection' : '🧻 应急卫生、排泄与防尘防烟',
      subtitle: isEn ? 'Prevent secondary disease outbreaks in power/water collapse' : '断水断排污时阻断次生传染病爆发',
      items: [
        {
          id: 's1',
          name: isEn ? 'Heavy-duty black trash bags (30L-50L) + cat litter/sawdust' : '加厚大号黑色垃圾袋 + 简易便携马桶/猫砂/凝固粉',
          tip: isEn ? 'If water pressure is gone, never flush toilets with stored water. Line toilet with bag.' : '停水时严禁用水冲马桶，套入加厚垃圾袋加凝固粉封扎'
        },
        {
          id: 's2',
          name: isEn ? 'N95 / FFP2 protective masks' : 'N95 / KN95 防尘防烟防护口罩',
          tip: isEn ? 'Protection from building dust, volcanic ash, or airborne pathogens.' : '抵御地震倒塌水泥灰、火山灰硅质微粒及呼吸道传染病'
        },
        {
          id: 's3',
          name: isEn ? 'Physical small-denomination cash in waterproof pouch' : '小额纸质现金零钱 (密封防水袋存装)',
          tip: isEn ? 'Electronic payments (WeChat/Alipay/Cards) fail completely during power & internet outage.' : '断网断电刷卡机与手机移动支付全瘫痪时的硬通货'
        }
      ]
    }
  ];

  // Specific infant or pet cards if applicable
  if (children > 0) {
    categories.push({
      id: 'infant',
      title: isEn ? '👶 Infant & Child Care' : '👶 婴幼儿专属生命储备',
      subtitle: isEn ? `${children} child(ren) accounted for` : `针对家中 ${children} 名儿童的专属准备`,
      items: [
        {
          id: 'inf1',
          name: isEn ? 'Infant milk formula powder (2-3 cans buffer)' : '婴儿配方奶粉 (常态化储备2-3罐余量)',
          tip: isEn ? 'Children have zero tolerance for nutritional gaps.' : '灾区最难临时调配的刚需物资'
        },
        {
          id: 'inf2',
          name: isEn ? 'Diapers, wet wipes, and pediatric fever suspension' : '纸尿裤、婴儿湿巾、儿童对乙酰氨基酚/布洛芬混悬液',
          tip: isEn ? 'Keep dry and sealed.' : '高寒湿冷下防止红屁股并应对半夜突发高烧'
        }
      ]
    });
  }

  // Count progress
  const allItemIds = categories.flatMap(c => c.items.map(i => i.id));
  const totalCount = allItemIds.length;
  const checkedCount = allItemIds.filter(id => checkedItems[id]).length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in safe-area-inset">
      <div className="bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-800/60 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Backpack className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {isEn ? 'Family Disaster Stockpile Calculator' : '家庭极境备灾物资计算器'}
                </h2>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {isEn ? 'Nordic & German Standards' : '国际权威民防标准'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isEn 
                  ? 'Calculate scientific rations for Earthquakes, Volcanoes, Floods, Blizzards & Pandemics'
                  : '科学测算水粮医药配额 · 应对地震、火山、极端暴雪、断电孤岛与公共卫生危机'}
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

        {/* Family Configuration Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 space-y-3">
          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>{isEn ? '1. Configure Household Members & Duration:' : '1. 设置家庭成员构成与自给天数：'}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
              {totalPeople} {isEn ? 'People' : '人'} · {days} {isEn ? 'Days Buffer' : '天储备'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {/* Adults */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">{isEn ? 'Adults' : '成人'}</span>
              <div className="flex items-center justify-between mt-1">
                <button 
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >-</button>
                <span className="font-bold text-sm text-gray-900 dark:text-white">{adults}</span>
                <button 
                  onClick={() => setAdults(adults + 1)}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >+</button>
              </div>
            </div>

            {/* Seniors */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">{isEn ? 'Seniors (65+)' : '老人 (慢性病)'}</span>
              <div className="flex items-center justify-between mt-1">
                <button 
                  onClick={() => setSeniors(Math.max(0, seniors - 1))}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >-</button>
                <span className="font-bold text-sm text-gray-900 dark:text-white">{seniors}</span>
                <button 
                  onClick={() => setSeniors(seniors + 1)}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >+</button>
              </div>
            </div>

            {/* Children */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">{isEn ? 'Children/Babies' : '婴幼儿/儿童'}</span>
              <div className="flex items-center justify-between mt-1">
                <button 
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >-</button>
                <span className="font-bold text-sm text-gray-900 dark:text-white">{children}</span>
                <button 
                  onClick={() => setChildren(children + 1)}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >+</button>
              </div>
            </div>

            {/* Pets */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">{isEn ? 'Pets' : '伴侣宠物'}</span>
              <div className="flex items-center justify-between mt-1">
                <button 
                  onClick={() => setPets(Math.max(0, pets - 1))}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >-</button>
                <span className="font-bold text-sm text-gray-900 dark:text-white">{pets}</span>
                <button 
                  onClick={() => setPets(pets + 1)}
                  className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >+</button>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-emerald-400 dark:border-emerald-600 flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">{isEn ? 'Days Target' : '自给储备天数'}</span>
              <div className="flex items-center justify-around mt-1">
                <button 
                  onClick={() => setDays(3)} 
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${days === 3 ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                >3d</button>
                <button 
                  onClick={() => setDays(7)} 
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${days === 7 ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                >7d</button>
                <button 
                  onClick={() => setDays(10)} 
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${days === 10 ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                >10d</button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {isEn ? 'Preparedness Completion:' : '家庭备灾准备进度：'}
                <span className="text-emerald-600 font-black">{progressPercent}%</span>
                <span className="text-gray-400 font-normal">({checkedCount}/{totalCount})</span>
              </span>
              <button
                onClick={handleResetChecklist}
                className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                {isEn ? 'Reset Checks' : '重置勾选'}
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-gray-800 dark:text-gray-200">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
              <div className="mb-3">
                <h3 className="font-black text-sm text-gray-900 dark:text-white">{cat.title}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{cat.subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked 
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-750 hover:border-gray-300'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                        isChecked 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-bold ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.tip}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-gray-500 dark:text-gray-400 text-center sm:text-left">
            💡 {isEn ? 'Rolling stock: Eat foods near expiry and replace with fresh ones to avoid waste.' : '建议采用“滚动储备法”：平时吃快到期的，买新的补上，避免浪费'}
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
          >
            {isEn ? 'Save & Close' : '保存清点并返回'}
          </button>
        </div>
      </div>
    </div>
  );
};
