
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
      alert(`生成失敗：${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-[32px] overflow-hidden bg-[#D3D3D3] shadow-md border border-black/5 ${post.isCompleted ? 'opacity-50 grayscale' : ''}`}>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/60 shadow-sm font-black text-[14px] text-emerald-700 border border-white/40 uppercase">
              {post.platform}
            </span>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">社群文案</span>
          </div>
          <button onClick={onComplete} className={`no-print w-10 h-10 rounded-full flex items-center justify-center ${post.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/40 text-slate-500'}`}>
            <CheckCircle size={20} />
          </button>
        </div>
        <div className="space-y-4 text-left">
          <p className="post-content-text text-slate-800 font-medium whitespace-pre-wrap">{post.content}</p>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag, i) => <span key={i} className="text-[10px] text-emerald-800 font-bold bg-white/40 px-3 py-1.5 rounded-lg">#{tag}</span>)}
          </div>
        </div>
      </div>
      <div className="bg-black/5 p-8 border-t border-black/5">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">視覺指令生成</span>
           {!imageUrl && (
             <button onClick={handleGenerateImage} disabled={isGenerating} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold">
               {isGenerating ? <Loader2 size={12} className="animate-spin" /> : '生成圖片'}
             </button>
           )}
        </div>
        {imageUrl ? <img src={imageUrl} className="rounded-2xl w-full aspect-square object-cover shadow-sm" /> : 
          <p className="text-[11px] text-slate-600 italic text-left opacity-70">「{post.imagePrompt}」</p>
        }
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<Props> = ({ plan, username, onUpdatePostStatus }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-16 animate-in fade-in duration-700 min-h-screen pb-20 bg-[#F8F8FF] -mx-4 md:-mx-12 px-4 md:px-12">
      <div className="bg-[#D3D3D3] rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm border border-white/40">
        <div className="space-y-6 flex-1 text-left">
          <div className="flex items-center space-x-3 text-emerald-700 font-bold uppercase tracking-[0.4em] text-[11px]">
            <Sparkles size={16} />
            <span>AI文案助手</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 leading-none">{username} 的</h2>
            <h3 className="text-xl font-bold text-slate-600">貼文計畫</h3>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2"><div className="status-dot"></div><span>{plan.input.brandName || plan.input.industry}</span></div>
            <div className="flex items-center gap-2"><ArrowUpRight size={14} /><span>12 週計畫</span></div>
          </div>
        </div>
        <button onClick={handlePrint} className="no-print bg-emerald-600 text-white rounded-2xl px-10 py-5 text-[12px] font-black tracking-widest shadow-xl uppercase transition-all active:scale-95">匯出計畫</button>
      </div>

      <div className="space-y-24">
        {plan.weeks.map((week, wIdx) => (
          <div key={wIdx} className="space-y-12">
            <div className="flex items-end justify-between border-b-2 border-black/5 pb-8">
              <div className="text-left space-y-1">
                <h3 className="text-3xl font-black text-slate-900">第 {week.weekNumber} 週</h3>
                <p className="text-emerald-700 font-black tracking-[0.3em] text-[10px] uppercase">啟動時間：{week.startDate}</p>
              </div>
              <div className="w-14 h-14 bg-[#D3D3D3] rounded-2xl flex items-center justify-center border border-white/50"><Clock size={24} className="text-slate-700" /></div>
            </div>

            {week.prepPhase ? (
              <div className="grid grid-cols-1 gap-10">
                <div className="bg-[#D3D3D3] rounded-[32px] p-10 text-left border border-white/20 shadow-sm">
                  <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-6">深度人物誌洞察 (Persona Insight)</h4>
                  <div className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">{week.prepPhase.persona}</div>
                </div>
                <div className="bg-[#D3D3D3] rounded-[32px] p-10 text-left border border-white/20 shadow-sm">
                  <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-6">品牌定位策略 (Brand Positioning)</h4>
                  <div className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">{week.prepPhase.brandPositioning}</div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-10">
                {week.posts.map((post, pIdx) => <PostCard key={pIdx} post={post} onComplete={() => onUpdatePostStatus(wIdx, pIdx)} />)}
              </div>
            )}
            {wIdx < plan.weeks.length - 1 && <div className="page-break"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;
