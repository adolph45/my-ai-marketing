
import React, { useState } from 'react';
import { MarketingPlan, SocialPost } from '../types';
import { Download, ImageIcon, CheckCircle, Clock, Rocket, Share2, ArrowUpRight, Loader2, Sparkles, Send } from 'lucide-react';
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
    <div className={`dashboard-card overflow-hidden border-none transition-all ${post.isCompleted ? 'opacity-50 grayscale' : ''}`}>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm font-bold text-[10px] text-black">
              {post.platform}
            </span>
            <div className="flex items-center space-x-2">
              <span className="status-dot"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
            </div>
          </div>
          <button 
            onClick={onComplete}
            className={`no-print w-8 h-8 rounded-full flex items-center justify-center transition-all ${post.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white shadow-sm text-slate-200 hover:text-black'}`}
          >
            <CheckCircle size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="post-content-text text-slate-800 font-medium">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-400 font-bold border border-black/5 px-2 py-1 rounded-md">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/40 p-8 border-t border-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI 視覺化輔助</span>
          </div>
          {!imageUrl && (
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold tracking-widest transition-all hover:bg-emerald-600 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              <span>{isGenerating ? '生成中...' : '生成圖片'}</span>
            </button>
          )}
        </div>

        {imageUrl ? (
          <div className="relative group rounded-2xl overflow-hidden shadow-sm aspect-square bg-slate-200">
            <img src={imageUrl} alt="Generated visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button onClick={handleGenerateImage} className="px-4 py-2 bg-white rounded-full text-[10px] font-bold">重新生成</button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white/50 rounded-xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 leading-relaxed">「{post.imagePrompt}」</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<Props> = ({ plan, username, onUpdatePostStatus }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="dashboard-card p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-6 flex-1 text-left">
          <div className="flex items-center space-x-3 text-emerald-500">
            <Sparkles size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">AI 策略中心</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none text-slate-900">
            {username} 的<br/><span className="text-slate-400">行銷戰略矩陣</span>
          </h2>
          <div className="flex items-center space-x-6 text-slate-500 text-xs font-semibold">
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
             className="btn-primary flex items-center justify-center space-x-3 px-8 py-4 text-[11px] font-bold tracking-widest shadow-xl shadow-emerald-500/20"
           >
            <Download size={14} />
            <span>匯出戰略矩陣</span>
           </button>
           <button className="btn-secondary flex items-center justify-center space-x-3 px-8 py-4 text-[11px] font-bold tracking-widest">
            <Share2 size={14} />
            <span>分享存取權限</span>
           </button>
        </div>
      </div>

      <div className="space-y-20">
        {plan.weeks.map((week, wIdx) => (
          <div key={wIdx} className="space-y-10">
            <div className="flex items-end justify-between border-b border-black/5 pb-6">
              <div className="space-y-1 text-left">
                <h3 className="text-2xl font-bold">第 {week.weekNumber} 週</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest" style={{ fontSize: '1.1rem' }}>啟動日期：{week.startDate}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Clock size={18} className="text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {week.prepPhase && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="dashboard-card p-10 bg-white/60 text-left">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-4">人物誌洞察 (Persona)</h4>
                    <p className="text-lg leading-relaxed text-slate-800 font-medium">「{week.prepPhase.persona}」</p>
                  </div>
                  <div className="dashboard-card p-10 bg-white/60 text-left">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-4">品牌價值定位</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{week.prepPhase.brandPositioning}</p>
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
      
      <footer className="pt-20 pb-10 text-center opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">系統授權確認 · 策略規劃完成</p>
      </footer>
    </div>
  );
};

export default PlanDisplay;
