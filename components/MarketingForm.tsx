
import React from 'react';
import { MarketingInput } from '../types';
import { Wand2, Loader2, Info, Target, Heart } from 'lucide-react';

interface Props {
  formData: MarketingInput;
  setFormData: (data: MarketingInput) => void;
  onSubmit: (data: MarketingInput) => void;
  loading: boolean;
}

const MarketingForm: React.FC<Props> = ({ formData, setFormData, onSubmit, loading }) => {
  const styles = [
    { name: '無印風', desc: '白灰色、莫蘭迪低彩度、簡潔' },
    { name: '工業風', desc: '風格強烈、鮮明對比、50%深色' },
    { name: '時尚風', desc: '明亮主色、低彩度輔色、主視覺強調' },
    { name: '簡約風', desc: '低彩度中間明度、線條俐落' },
    { name: '卡通漫畫', desc: '美式漫畫風格' },
    { name: '日系動漫', desc: '日式細緻動漫風格' },
    { name: '韓系偶像', desc: '韓系細緻潮流風格' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MarketingInput, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const inputClasses = "w-full bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border border-white/40 text-[0.9rem]";
  const labelClasses = "font-bold text-[#1a1a1a] uppercase tracking-wider mb-2 block ml-1 text-[1rem]";
  const sectionTitleClasses = "font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-[1rem]";

  return (
    <form onSubmit={handleSubmit} className="dashboard-card p-8 md:p-12 space-y-12 animate-in fade-in duration-500 bg-[#D3D3D3]">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-xl font-bold text-[#1a1a1a]">行銷參數設定</h3>
          <p className="text-xs text-slate-500 mt-1">配置您的 AI 策略引擎</p>
        </div>
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center"><Info size={18} /></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-1 text-left">
          <label className={labelClasses}>我從事的產業類型</label>
          <input type="text" className={inputClasses} placeholder="例如：咖啡廳、室內設計..." value={formData.industry} onChange={(e) => handleChange('industry', e.target.value)} required />
        </div>
        <div className="space-y-1 text-left">
          <label className={labelClasses}>創意風格</label>
          <select className={inputClasses} value={formData.style} onChange={(e) => handleChange('style', e.target.value)}>
            {styles.map(s => <option key={s.name} value={s.name}>{s.name} ({s.desc})</option>)}
          </select>
        </div>
        <div className="space-y-1 text-left">
          <label className={labelClasses}>主要受眾</label>
          <select className={inputClasses} value={formData.audience} onChange={(e) => handleChange('audience', e.target.value)}>
            {['B端中盤商', 'C端消費者', 'B端零售商', '準備要創業', '企業經營者'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-1 text-left">
          <label className={labelClasses}>戰略目標</label>
          <select className={inputClasses} value={formData.marketingGoal} onChange={(e) => handleChange('marketingGoal', e.target.value)}>
            {['行業專業權威性', '有趣的專業領域知識', '活潑的介紹我的專業', '生活化的介紹專業知識', '產生同業合作機會'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-1 text-left">
          <label className={labelClasses}>核心重點</label>
          <select className={inputClasses} value={formData.strategyFocus} onChange={(e) => handleChange('strategyFocus', e.target.value)}>
            {['更多我主要客戶的銷售', '更多陌生客戶的開發', '我與粉絲的互動', '讓有興趣的人來詢問'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-1 text-left">
          <label className={labelClasses}>我的品牌名稱</label>
          <input type="text" className={inputClasses} placeholder="選填" value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
        </div>
      </div>

      <div className="space-y-10 pt-10 border-t border-black/10">
        <div className="space-y-6">
          <h4 className={sectionTitleClasses}><Target size={14} className="text-indigo-500" /> 看齊目標品牌 (選填)</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" className={inputClasses} placeholder="目標名稱" value={formData.targetBrandName} onChange={(e) => handleChange('targetBrandName', e.target.value)} />
            <input type="url" className={inputClasses} placeholder="參考網址" value={formData.targetBrandUrl} onChange={(e) => handleChange('targetBrandUrl', e.target.value)} />
          </div>
        </div>
        <div className="space-y-6">
          <h4 className={sectionTitleClasses}><Heart size={14} className="text-pink-500" /> 喜歡的帳號風格 (選填)</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" className={inputClasses} placeholder="創作者名稱" value={formData.favoriteCreatorName} onChange={(e) => handleChange('favoriteCreatorName', e.target.value)} />
            <input type="url" className={inputClasses} placeholder="參考網址" value={formData.favoriteCreatorUrl} onChange={(e) => handleChange('favoriteCreatorUrl', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-black/10 text-left">
        <label className={labelClasses}>聯絡資訊與 CTA</label>
        <textarea className={`${inputClasses} h-32`} placeholder="官方LINE、網站連結等..." value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-6 font-bold tracking-[0.2em] flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95 disabled:opacity-50">
        {loading ? <><Loader2 className="animate-spin" /><span>策略運算中...</span></> : <><Wand2 /><span>打造我的貼文計畫</span></>}
      </button>
    </form>
  );
};

export default MarketingForm;
