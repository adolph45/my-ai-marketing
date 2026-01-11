
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
    '無印風',
    '工業風',
    '時尚風',
    '簡約風',
    '卡通漫畫',
    '日系動漫',
    '韓系偶像',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MarketingInput, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const inputClasses = "w-full bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 text-indigo-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border border-white/40 font-['Noto_Sans_TC'] text-[0.9rem]";
  const labelClasses = "font-['Noto_Serif_TC'] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2 block ml-1 text-[1.1rem]";
  const sectionTitleClasses = "font-['Noto_Serif_TC'] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-[1.1rem]";

  return (
    <form onSubmit={handleSubmit} className="dashboard-card p-8 md:p-12 space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="text-left">
          <h3 className="text-xl font-bold font-['Noto_Serif_TC'] text-[#1a1a1a]">行銷參數設定</h3>
          <p className="text-xs text-slate-500 mt-1">配置您的 AI 策略生成器</p>
        </div>
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center">
          <Info size={18} />
        </div>
      </div>

      {/* 基本設定 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1 text-left">
          <label className={labelClasses}>我從事的產業類型</label>
          <input
            type="text"
            className={inputClasses}
            placeholder="請輸入您的產業（例如：咖啡廳、室內設計、電商...）"
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 text-left">
          <label className={labelClasses}>我的品牌名稱</label>
          <input
            type="text"
            className={inputClasses}
            placeholder="例如：美好生活咖啡"
            value={formData.brandName}
            onChange={(e) => handleChange('brandName', e.target.value)}
          />
        </div>

        <div className="space-y-1 text-left">
          <label className={labelClasses}>創意風格</label>
          <select
            className={inputClasses}
            value={formData.style}
            onChange={(e) => handleChange('style', e.target.value)}
          >
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-1 text-left">
          <label className={labelClasses}>主要受眾</label>
          <select
            className={inputClasses}
            value={formData.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
          >
            <option value="B端中盤商">B端中盤商</option>
            <option value="B端零售商">B端零售商</option>
            <option value="C端消費者">C端消費者</option>
            <option value="準備要創業">準備要創業</option>
            <option value="企業經營者">企業經營者</option>
          </select>
        </div>

        <div className="space-y-1 text-left">
          <label className={labelClasses}>戰略目標</label>
          <select
            className={inputClasses}
            value={formData.marketingGoal}
            onChange={(e) => handleChange('marketingGoal', e.target.value)}
          >
            <option value="行業專業權威性">行業專業權威性</option>
            <option value="吸引客戶詢問下單">吸引客戶詢問下單</option>
            <option value="有趣的專業領域知識">有趣的專業領域知識</option>
            <option value="活潑的介紹我的專業">活潑的介紹我的專業</option>
            <option value="生活化的介紹專業知識">生活化的介紹專業知識</option>
            <option value="產生同業合作機會">產生同業合作機會</option>
          </select>
        </div>

        <div className="space-y-1 text-left">
          <label className={labelClasses}>核心重點</label>
          <select
            className={inputClasses}
            value={formData.strategyFocus}
            onChange={(e) => handleChange('strategyFocus', e.target.value)}
          >
            <option value="更多主要客戶的銷售">更多主要客戶的銷售</option>
            <option value="更多陌生客戶的開發">更多陌生客戶的開發</option>
            <option value="我與粉絲的互動">我與粉絲的互動</option>
            <option value="讓有興趣的人來詢問">讓有興趣的人來詢問</option>
          </select>
        </div>
      </div>

      {/* 目標品牌與參考帳號 */}
      <div className="space-y-10 pt-6 border-t border-black/5">
        <div className="space-y-6">
          <h4 className={sectionTitleClasses}>
            <Target size={14} className="text-indigo-500" />
            我的行業中我想看齊的目標品牌或社群帳號
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1 text-left">
              <label className={labelClasses}>品牌名稱</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="輸入品牌名稱"
                value={formData.targetBrandName}
                onChange={(e) => handleChange('targetBrandName', e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className={labelClasses}>參考網址</label>
              <input
                type="url"
                className={inputClasses}
                placeholder="https://..."
                value={formData.targetBrandUrl}
                onChange={(e) => handleChange('targetBrandUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className={sectionTitleClasses}>
            <Heart size={14} className="text-pink-500" />
            我最喜歡的 (不一定是相關行業) 社群媒體經營帳號
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1 text-left">
              <label className={labelClasses}>帳號名稱</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="輸入帳號名稱"
                value={formData.favoriteCreatorName}
                onChange={(e) => handleChange('favoriteCreatorName', e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className={labelClasses}>參考網址</label>
              <input
                type="url"
                className={inputClasses}
                placeholder="https://..."
                value={formData.favoriteCreatorUrl}
                onChange={(e) => handleChange('favoriteCreatorUrl', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-black/5 text-left">
        <label className={labelClasses}>行動呼籲與聯絡資訊</label>
        <textarea
          className={`${inputClasses} h-32 resize-none`}
          placeholder="貼文中包含的聯絡方式..."
          value={formData.contactInfo}
          onChange={(e) => handleChange('contactInfo', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-5 font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-3 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] font-['Noto_Serif_TC'] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>AI 策略計算中...</span>
          </>
        ) : (
          <>
            <Wand2 size={20} />
            <span>打造你的行銷計畫</span>
          </>
        )}
      </button>
    </form>
  );
};

export default MarketingForm;
