
import React, { useState } from 'react';
import { MarketingPlan, SocialPost } from '../types';
import { CheckCircle, Clock, ArrowUpRight, Loader2, Sparkles, Send, Facebook, Instagram, ChevronRight } from 'lucide-react';
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
      alert(`生成失敗：${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const PlatformIcon = post.platform === 'FB' ? Facebook : Instagram;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-500 ${post.isCompleted ? 'opacity-40 grayscale scale-[0.98]' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
      <div className="p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${post.platform === 'FB' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
              <PlatformIcon size={24} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{post.platform} Post</span>
              <h4 className="text-lg font-extrabold text-slate-800 leading-none mt-1">社群文案內容</h4>
            </div>
          </div>
          <button onClick={onComplete} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${post.isCompleted ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-emerald-50 hover:text-emerald-500'}`}>
            <CheckCircle size={24} />
          </button>
        </div>

        <div className="bg-slate-50/50 rounded-[32px] p-8 text-left space-y-6 border border-slate-100/50">
          <p className="text-slate-800 font-medium leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
          <div className="flex flex-wrap gap-3">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-[11px] text-emerald-700 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-50">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400">
               <Sparkles size={14} className="text-emerald-400" />
               <span className="text-[10px] font-black uppercase tracking-widest">Visual Direction</span>
            </div>
            {!imageUrl && (
              <button 
                onClick={handleGenerateImage} 
                disabled={isGenerating} 
                className="btn-emerald px-6 py-3 text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-100 flex items-center gap-2"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {isGenerating ? '繪製中...' : '生成圖片'}
              </button>
            )}
          </div>

          {imageUrl ? (
            <div className="relative group rounded-[32px] overflow-hidden shadow-2xl aspect-video bg-white">
              <img src={imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print">
                 <button onClick={handleGenerateImage} className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">重新生成</button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-[32px] p-8 text-left">
              <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                「{post.imagePrompt}」
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<Props> = ({ plan, username, onUpdatePostStatus }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-20 animate-in fade-in duration-1000">
      <header className="glass-card p-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-left space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100">
            <Sparkles size={14} className="mr-2" />
            Active Marketing Campaign
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              {username} 的 <span className="text-emerald-500">12 週貼文計畫</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
              產業分類：{plan.input.industry} • 品牌目標：{plan.input.marketingGoal}
            </p>
          </div>
        </div>
        <button onClick={handlePrint} className="no-print btn-coral px-12 py-5 text-sm font-black tracking-widest uppercase shadow-2xl shadow-coral-100">
          匯出執行手冊
        </button>
      </header>

      <div className="space-y-32">
        {plan.weeks.map((week, wIdx) => (
          <section key={wIdx} className="space-y-12">
            <div className="flex items-end justify-between border-b-2 border-slate-200/50 pb-8">
              <div className="text-left space-y-2">
                <span className="text-emerald-500 font-black text-[10px] tracking-[0.5em] uppercase">Timeline</span>
                <h3 className="text-4xl font-extrabold text-slate-900">第 {week.weekNumber} 週</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <Clock size={14} /> 啟動日期：{week.startDate}
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-slate-50">
                <ChevronRight size={32} className="text-slate-200" />
              </div>
            </div>

            {week.prepPhase ? (
              <div className="grid grid-cols-1 gap-12">
                <div className="glass-card p-12 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Sparkles size={120} />
                  </div>
                  <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500 mb-10 border-b border-slate-100 pb-6">深度人物誌洞察 (Persona Insight)</h4>
                  <div className="prose prose-slate max-w-none">
                    <div className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{week.prepPhase.persona}</div>
                  </div>
                </div>
                <div className="glass-card p-12 text-left">
                  <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500 mb-10 border-b border-slate-100 pb-6">品牌定位策略 (Brand Positioning)</h4>
                  <div className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{week.prepPhase.brandPositioning}</div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-12">
                {week.posts.map((post, pIdx) => <PostCard key={pIdx} post={post} onComplete={() => onUpdatePostStatus(wIdx, pIdx)} />)}
              </div>
            )}
            {wIdx < plan.weeks.length - 1 && <div className="page-break"></div>}
          </section>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;
