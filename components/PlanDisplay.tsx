
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
    } catch (err) {
      console.error(err);
      alert("圖片生成失敗，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-[32px] overflow-hidden border-none transition-all bg-[#D3D3D3] shadow-md ${post.isCompleted ? 'opacity-50 grayscale' : ''}`}>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 shadow-sm font-bold text-[12px] text-black border border-white/20">
              {post.platform}
            </span>
            <div className="flex items-center space-x-2">
              <span className="status-dot"></span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{post.date}</span>
            </div>
          </div>
          <button 
            onClick={onComplete}
            className={`no-print w-10 h-10 rounded-full flex items-center justify-center transition-all ${post.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/40 shadow-sm text-slate-500 hover:text-black hover:bg-white'}`}
          >
            <CheckCircle size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="post-content-text text-slate-800 font-medium text-[1.1rem] leading-relaxed">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-700 font-bold bg-white/30 px-2 py-1 rounded-md">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/20 p-8 border-t border-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-600">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI 視覺化輔助</span>
          </div>
          {!imageUrl && (
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold tracking-widest transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              <span>{isGenerating ? '生成中...' : '生成圖片'}</span>
            </button>
          )}
        </div>

        {imageUrl ? (
          <div className="relative group rounded-2xl overflow-hidden shadow-sm aspect-square bg-slate-400/20">
            <img src={imageUrl} alt="Generated visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button onClick={handleGenerateImage} className="px-4 py-2 bg-white rounded-full text-[10px] font-bold">重新生成</button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white/20 rounded-xl border border-dashed border-slate-500/30">
            <p className="text-xs text-slate-700 leading-relaxed italic">「{post.imagePrompt}」</p>
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
      <div className="bg-[#D3D3D3] rounded-[40px] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-lg border border-white/20">
        <div className="space-y-6 flex-1 text-left">
          <div className="flex items-center space-x-3 text-emerald-700">
            <Sparkles size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">AI文案助手</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {username} 的
            </h2>
            <h3 className="text-xl font-bold tracking-tight text-slate-600">
              貼文計畫
            </h3>
          </div>
          <div className="flex items-center space-x-6 text-slate-600 text-xs font-semibold">
             <div className="flex items-center space-x-2">
                <span className="status-dot"></span>
                <span>{plan.input.brandName || plan.input.industry}</span>
             </div>
             <div className="flex items-center space-x-2">
                <ArrowUpRight size={14} />
                <span>12 週內容藍圖</span>
             </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 no-print">
          <button 
             onClick={handlePrint}
             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center space-x-3 px-8 py-4 text-[11px] font-bold tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
           >
            <Download size={14} />
            <span>匯出貼文計畫</span>
           </button>
        </div>
      </div>

      <div className="space-y-20">
        {plan.weeks.map((week, wIdx) => (
          <div key={wIdx} className="space-y-10">
            <div className="flex items-end justify-between border-b border-black/10 pb-6">
              <div className="space-y-1 text-left">
                <h3 className="text-2xl font-bold text-slate-800">第 {week.weekNumber} 週</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[0.9rem]">啟動日期：{week.startDate}</p>
              </div>
              <div className="w-12 h-12 bg-[#D3D3D3] rounded-2xl flex items-center justify-center shadow-inner border border-white/20">
                <Clock size={20} className="text-slate-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {week.prepPhase && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="rounded-[32px] p-10 bg-[#D3D3D3] text-left border border-white/10 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 mb-4">人物誌洞察 (Persona)</h4>
                    <p className="text-lg leading-relaxed text-slate-800 font-medium">「{week.prepPhase.persona}」</p>
                  </div>
                  <div className="rounded-[32px] p-10 bg-[#D3D3D3] text-left border border-white/10 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 mb-4">品牌價值定位</h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{week.prepPhase.brandPositioning}</p>
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
      
      <footer className="pt-20 pb-10 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600">系統授權確認 · AI 輔助規劃完成</p>
      </footer>
    </div>
  );
};

export default PlanDisplay;
