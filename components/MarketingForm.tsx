
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

  // 標題文字加大 100% (原本 text-[10px] 改為 text-[20px] 或 text-xl)
  const labelClasses = "font-black text-[#4A3728]/80 uppercase tracking-[0.2em] mb-4 block ml-2 text-xl";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-14 md:p-20 space-y-20 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between border-b-2 border-[#F2E7D5]/40 pb-12">
        <div className="text-left space-y-2">
          <h3 className="text-3xl font-black text-[#4A3728]">核心策略配置</h3>
          <p className="text-[10px] text-[#D69A73] font-black uppercase tracking-[0.5em]">Configure Strategy Parameters</p>
        </div>
        <div className="w-16 h-16 bg-white text-[#F2E7D5] rounded-[24px] flex items-center justify-center border border-[#F2E7D5] shadow-xl"><Info size={28} /></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* 順序 1: 產業類型 */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>產業類型</label>
          <input type="text" placeholder="例如：精品咖啡店..." value={formData.industry} onChange={(e) => handleChange('industry', e.target.value)} required />
        </div>

        {/* 順序 2: 品牌名稱 */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>品牌名稱</label>
          <input type="text" placeholder="選填品牌名..." value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
        </div>

        {/* 順序 3: 主要受眾 */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>主要受眾</label>
          <select value={formData.audience} onChange={(e) => handleChange('audience', e.target.value)}>
            {['B端中盤商', 'C端消費者', 'B端零售商', '準備要創業', '企業經營者'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 順序 4: 戰略目標 */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>戰略目標</label>
          <select value={formData.marketingGoal} onChange={(e) => handleChange('marketingGoal', e.target.value)}>
            {['行業專業權威性', '有趣的專業領域知識', '活潑的介紹我的專業', '生活化的介紹專業知識', '產生同業合作機會'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 順序 5: 核心重點 */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>核心重點</label>
          <select value={formData.strategyFocus} onChange={(e) => handleChange('strategyFocus', e.target.value)}>
            {['更多我主要客戶的銷售', '更多陌生客戶的開發', '我與粉絲的互動', '讓有興趣的人來詢問'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 順序 6: 創意風格 (隱藏描述) */}
        <div className="space-y-3 text-left col-span-full lg:col-span-1">
          <label className={labelClasses}>創意風格</label>
          <select value={formData.style} onChange={(e) => handleChange('style', e.target.value)}>
            {styles.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-16 pt-16 border-t-2 border-[#F2E7D5]/40">
        <div className="space-y-10 text-left">
          <h4 className="flex items-center gap-4 text-xs font-black text-[#4A3728]/40 uppercase tracking-[0.5em]"><Target size={20} className="text-[#D69A73]" /> 競爭品牌對標</h4>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className={labelClasses}>對標對象</label>
              <input type="text" placeholder="品牌或粉專名稱" value={formData.targetBrandName} onChange={(e) => handleChange('targetBrandName', e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className={labelClasses}>參考網址</label>
              <input type="url" placeholder="https://..." value={formData.targetBrandUrl} onChange={(e) => handleChange('targetBrandUrl', e.target.value)} />
            </div>
          </div>
        </div>
        
        <div className="space-y-10 text-left">
          <h4 className="flex items-center gap-4 text-xs font-black text-[#4A3728]/40 uppercase tracking-[0.5em]"><Heart size={20} className="text-[#D69A73]" /> 靈感來源帳號</h4>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className={labelClasses}>喜歡的帳號</label>
              <input type="text" placeholder="帳號名稱" value={formData.favoriteCreatorName} onChange={(e) => handleChange('favoriteCreatorName', e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className={labelClasses}>參考網址</label>
              <input type="url" placeholder="https://..." value={formData.favoriteCreatorUrl} onChange={(e) => handleChange('favoriteCreatorUrl', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t-2 border-[#F2E7D5]/40 text-left">
        <label className={labelClasses}>聯絡資訊與 Call-to-Action (CTA)</label>
        <textarea className="w-full h-48 !rounded-[24px] !p-[3px] !px-4" placeholder="請提供您的聯絡方式，將自動生成於貼文末端..." value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} />
      </div>

      <button type="submit" disabled={loading} className="w-full btn-primary-coffee py-9 font-black text-sm tracking-[0.4em] uppercase flex items-center justify-center space-x-5 shadow-3xl shadow-[#D69A73]/30 disabled:opacity-50">
        {loading ? <><Loader2 className="animate-spin" size={24} /><span>策略調配中，請稍候...</span></> : <><Wand2 size={24} /><span>產生我的貼文計畫</span></>}
      </button>
    </form>
  );
};

export default MarketingForm;
