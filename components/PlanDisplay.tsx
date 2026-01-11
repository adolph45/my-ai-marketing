
import React, { useState } from 'react';
import { MarketingPlan, SocialPost } from '../types';
import { Download, CheckCircle, Clock, ArrowUpRight, Loader2, Sparkles, Send } from 'lucide-react';
import { generatePostImage } from '../services/geminiService';

interface Props {
  plan: MarketingPlan;
  username: string;
  onUpdatePostStatus: (weekIdx: number, postIdx: number) => void;
}

const PostCard: React.FC<{ post: SocialPost, onComplete: () => void }> = ({ post, onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const url = await generatePostImage(post.imagePrompt);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      alert(`圖片生成失敗：${err.message || '請稍後再試'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-[32px] overflow-hidden border-none transition-all bg-[#D3D3D3] shadow-md ${post.isCompleted ? 'opacity-50 grayscale' : ''}`}>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/60 shadow-sm font-black text-[14px] text-emerald-700 border border-white/40">
              {post.platform}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{post.dayOfWeek}</span>
              <span className="text-[12px] font-bold text-slate-800">{post.date}</span>
            </div>
          </div>
          <button 
            onClick={onComplete}
            className={`no-print w-10 h-10 rounded-full flex items-center justify-center transition-all ${post.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/40 shadow-sm text-slate-500 hover:text-black hover:bg-white'}`}
          >
            <CheckCircle size={20} />
          </button>
        </div>
        
        <div className="space-y-4 text-left">
          <div className="post-content-text text-slate-800 font-medium">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-emerald-800 font-bold bg-white/40 px-3 py-1.5 rounded-lg border border-white/20">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black/5 p-8 border-t border-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-600">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI 視覺設計推薦</span>
          </div>
          {!imageUrl && (
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold tracking-widest transition-all hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              <span>{isGenerating ? '正在繪製...' : '生成圖片'}</span>
            </button>
          )}
        </div>

        {imageUrl ? (
          <div className="relative group rounded-2xl overflow-hidden shadow-inner aspect-square bg-slate-400/20">
            <img src={imageUrl} alt="Generated visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print">
               <button onClick={handleGenerateImage} className="px-5 py-2.5 bg-white rounded-full text-[10px] font-black text-black shadow-xl">重新生成</button>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-white/20 rounded-2xl border border-dashed border-black/10 text-left">
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium italic opacity-80">「{post.imagePrompt}」</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<Props> = ({ plan, username, onUpdatePostStatus }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-16 animate-in fade-in duration-700 min-h-screen pb-20 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 bg-[#F8F8FF]">
      <div className="bg-[#D3D3D3] rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm border border-white/40">
        <div className="space-y-6 flex-1 text-left">
          <div className="flex items-center space-x-3 text-emerald-700">
            <Sparkles size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">AI文案助手</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              {username} 的
            </h2>
            <h3 className="text-xl font-bold tracking-tight text-slate-600 mt-2">
              貼文計畫
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-[11px] font-bold uppercase tracking-widest">
             <div className="flex items-center space-x-2">
                <span className="status-dot"></span>
                <span>{plan.input.brandName || plan.input.industry}</span>
             </div>
             <div className="flex items-center space-x-2">
                <ArrowUpRight size={14} className="text-emerald-600" />
                <span>12 週完整藍圖</span>
             </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 no-print w-full md:w-auto">
          <button 
             onClick={handlePrint}
             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center space-x-3 px-10 py-5 text-[12px] font-black tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 uppercase"
           >
            <Download size={16} />
            <span>匯出計畫</span>
           </button>
        </div>
      </div>

      <div className="space-y-24">
        {plan.weeks.map((week, wIdx) => (
          <div key={wIdx} className="space-y-12">
            <div className="flex items-end justify-between border-b-2 border-black/5 pb-8">
              <div className="space-y-1 text-left">
                <h3 className="text-3xl font-black text-slate-900">第 {week.weekNumber} 週</h3>
                <p className="text-emerald-700 font-black uppercase tracking-[0.3em] text-[10px]">週一啟動：{week.startDate}</p>
              </div>
              <div className="w-14 h-14 bg-[#D3D3D3] rounded-2xl flex items-center justify-center shadow-sm border border-white/50">
                <Clock size={24} className="text-slate-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {week.prepPhase && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="rounded-[32px] p-10 bg-[#D3D3D3] text-left border border-white/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles size={40} />
                    </div>
                    <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-6">人物誌 (Persona)</h4>
                    <p className="text-xl leading-relaxed text-slate-800 font-bold">「{week.prepPhase.persona}」</p>
                  </div>
                  <div className="rounded-[32px] p-10 bg-[#D3D3D3] text-left border border-white/20 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-6">品牌定位策略</h4>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-bold">{week.prepPhase.brandPositioning}</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-10">
                {week.posts.map((post, pIdx) => (
                  <PostCard 
                    key={pIdx} 
                    post={post} 
                    onComplete={() => onUpdatePostStatus(wIdx, pIdx)} 
                  />
                ))}
              </div>
            </div>
            {wIdx < plan.weeks.length - 1 && <div className="page-break"></div>}
          </div>
        ))}
      </div>
      
      <footer className="pt-24 pb-12 text-center opacity-40 no-print">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 italic">系統由 AI 行銷隨身顧問 驅動 · 專業計畫僅供參考</p>
      </footer>
    </div>
  );
};

export default PlanDisplay;
