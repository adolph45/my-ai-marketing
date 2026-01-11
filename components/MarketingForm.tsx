
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
    { name: '無印風', desc: '低彩度、簡潔' },
    { name: '工業風', desc: '鮮明對比、深色' },
    { name: '時尚風', desc: '明亮、主視覺強' },
    { name: '簡約風', desc: '線條乾淨、低彩' },
    { name: '卡通漫畫', desc: '美式風格' },
    { name: '日系動漫', desc: '細緻動漫' },
    { name: '韓系偶像', desc: '細緻潮流' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MarketingInput, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const labelClasses = "font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block ml-4 text-[10px]";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-12 md:p-16 space-y-16 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-slate-100 pb-10">
        <div className="text-left space-y-1">
          <h3 className="text-2xl font-extrabold text-slate-900">行銷策略參數</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configure AI Strategy Engine</p>
        </div>
        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm"><Info size={24} /></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="space-y-2 text-left">
          <label className={labelClasses}>產業類型</label>
          <input type="text" placeholder="例如：咖啡廳..." value={formData.industry} onChange={(e) => handleChange('industry', e.target.value)} required />
        </div>
        <div className="space-y-2 text-left">
          <label className={labelClasses}>創意風格</label>
          <select value={formData.style} onChange={(e) => handleChange('style', e.target.value)}>
            {styles.map(s => <option key={s.name} value={s.name}>{s.name} ({s.desc})</option>)}
          </select>
        </div>
        <div className="space-y-2 text-left">
          <label className={labelClasses}>主要受眾</label>
          <select value={formData.audience} onChange={(e) => handleChange('audience', e.target.value)}>
            {['B端中盤商', 'C端消費者', 'B端零售商', '準備要創業', '企業經營者'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-2 text-left">
          <label className={labelClasses}>戰略目標</label>
          <select value={formData.marketingGoal} onChange={(e) => handleChange('marketingGoal', e.target.value)}>
            {['行業專業權威性', '有趣的專業領域知識', '活潑的介紹我的專業', '生活化的介紹專業知識', '產生同業合作機會'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-2 text-left">
          <label className={labelClasses}>核心重點</label>
          <select value={formData.strategyFocus} onChange={(e) => handleChange('strategyFocus', e.target.value)}>
            {['更多我主要客戶的銷售', '更多陌生客戶的開發', '我與粉絲的互動', '讓有興趣的人來詢問'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-2 text-left">
          <label className={labelClasses}>品牌名稱</label>
          <input type="text" placeholder="選填" value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
        </div>
      </div>

      <div className="space-y-12 pt-12 border-t border-slate-100">
        <div className="space-y-8 text-left">
          <h4 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.3em]"><Target size={18} className="text-emerald-500" /> Benchmark Brands</h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}>看齊品牌</label>
              <input type="text" placeholder="品牌名稱" value={formData.targetBrandName} onChange={(e) => handleChange('targetBrandName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>參考網址</label>
              <input type="url" placeholder="URL" value={formData.targetBrandUrl} onChange={(e) => handleChange('targetBrandUrl', e.target.value)} />
            </div>
          </div>
        </div>
        
        <div className="space-y-8 text-left">
          <h4 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.3em]"><Heart size={18} className="text-pink-500" /> Inspiration Accounts</h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}>喜歡的創作者</label>
              <input type="text" placeholder="名稱" value={formData.favoriteCreatorName} onChange={(e) => handleChange('favoriteCreatorName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>參考網址</label>
              <input type="url" placeholder="URL" value={formData.favoriteCreatorUrl} onChange={(e) => handleChange('favoriteCreatorUrl', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-100 text-left">
        <label className={labelClasses}>聯絡資訊與 Call-to-Action</label>
        <textarea className="w-full h-40 !rounded-[32px]" placeholder="官方LINE、網站連結等..." value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} />
      </div>

      <button type="submit" disabled={loading} className="w-full btn-emerald py-8 font-black text-sm tracking-[0.3em] uppercase flex items-center justify-center space-x-4 shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50">
        {loading ? <><Loader2 className="animate-spin" /><span>策略引擎運算中...</span></> : <><Wand2 /><span>啟動我的行銷計畫</span></>}
      </button>
    </form>
  );
};

export default MarketingForm;
