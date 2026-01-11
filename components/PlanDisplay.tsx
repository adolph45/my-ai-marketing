
import React, { useState } from 'react';
import { MarketingPlan, SocialPost } from '../types';
import { CheckCircle, Clock, Loader2, Sparkles, Send, Facebook, Instagram, ChevronRight } from 'lucide-react';
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
    <div className={`glass-card overflow-hidden transition-all duration-700 ${post.isCompleted ? 'opacity-30 grayscale' : 'hover:shadow-3xl hover:-translate-y-2'}`}>
      <div className="p-12 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg ${post.platform === 'FB' ? 'bg-[#E7F0FF] text-[#1877F2]' : 'bg-[#FFF0F5] text-[#E4405F]'}`}>
              <PlatformIcon size={28} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-[#4A3728]/40 uppercase tracking-[0.4em]">{post.platform} Channels</span>
              <h4 className="text-2xl font-black text-[#4A3728] leading-none mt-2">社群文案規劃</h4>
            </div>
          </div>
          <button onClick={onComplete} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${post.isCompleted ? 'bg-[#D69A73] text-white shadow-xl shadow-[#D69A73]/20' : 'bg-[#F2E7D5]/40 text-[#4A3728]/20 hover:bg-[#D69A73]/10 hover:text-[#D69A73]'}`}>
            <CheckCircle size={32} />
          </button>
        </div>

        <div className="bg-[#F2E7D5]/20 rounded-[40px] p-10 text-left space-y-8 border border-[#F2E7D5]/30">
          <p className="text-[#4A3728] font-bold leading-relaxed text-xl whitespace-pre-wrap">{post.content}</p>
          <div className="flex flex-wrap gap-3">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-[11px] text-[#D69A73] font-black bg-white px-5 py-3 rounded-full shadow-sm border border-[#F2E7D5]/50 tracking-wider">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-[#4A3728]/40">
               <Sparkles size={16} className="text-[#D69A73]" />
               <span className="text-[11px] font-black uppercase tracking-[0.3em]">AI 視覺生成導引</span>
            </div>
            {!imageUrl && (
              <button 
                onClick={handleGenerateImage} 
                disabled={isGenerating} 
                className="btn-primary-coffee px-8 py-4 text-[11px] font-black tracking-[0.3em] uppercase shadow-2xl flex items-center gap-3"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {isGenerating ? 'BREWING...' : '生成視覺'}
              </button>
            )}
          </div>

          {imageUrl ? (
            <div className="relative group rounded-[40px] overflow-hidden shadow-2xl aspect-square bg-white border-8 border-white">
              <img src={imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#4A3728]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print backdrop-blur-sm">
                 <button onClick={handleGenerateImage} className="bg-white text-[#4A3728] px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl">重新生成</button>
              </div>
            </div>
          ) : (
            <div className="bg-[#4A3728] rounded-[40px] p-10 text-left border-l-8 border-[#D69A73]">
              <p className="text-sm text-[#F2E7D5] italic font-semibold leading-relaxed tracking-wide">
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
    <div className="space-y-24 animate-in fade-in duration-1000">
      <header className="glass-card p-14 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-2 h-full bg-[#D69A73]"></div>
        <div className="text-left space-y-6 flex-1">
          <div className="inline-flex items-center px-5 py-3 bg-[#F2E7D5]/50 text-[#D69A73] rounded-full text-[10px] font-black tracking-[0.5em] uppercase border border-white">
            <Sparkles size={16} className="mr-3" />
            Strategic Marketing Plan
          </div>
          <div>
            <h2 className="text-5xl font-black text-[#4A3728] leading-tight">
              {username} 的 <span className="text-[#D69A73]">12 週策略</span>
            </h2>
            <p className="text-[#4A3728]/30 font-black uppercase tracking-[0.4em] text-[10px] mt-4">
              產業：{plan.input.industry} • 目標：{plan.input.marketingGoal}
            </p>
          </div>
        </div>
        <button onClick={handlePrint} className="no-print btn-primary-coffee px-14 py-6 text-sm font-black tracking-[0.3em] uppercase shadow-2xl">
          匯出計畫手冊
        </button>
      </header>

      <div className="space-y-40">
        {plan.weeks.map((week, wIdx) => (
          <section key={wIdx} className="space-y-16">
            <div className="flex items-end justify-between border-b-4 border-[#F2E7D5]/40 pb-10">
              <div className="text-left space-y-3">
                <span className="text-[#D69A73] font-black text-[11px] tracking-[0.6em] uppercase">Phase Roadmap</span>
                <h3 className="text-5xl font-black text-[#4A3728]">第 {week.weekNumber} 週</h3>
                <div className="flex items-center gap-3 text-[#4A3728]/40 text-sm font-bold tracking-widest uppercase">
                  <Clock size={16} /> START DATE: {week.startDate}
                </div>
              </div>
              <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-2xl border border-[#F2E7D5]/30">
                <ChevronRight size={40} className="text-[#F2E7D5]" />
              </div>
            </div>

            {week.prepPhase ? (
              <div className="grid grid-cols-1 gap-14">
                <div className="glass-card p-14 text-left relative overflow-hidden group">
                  <div className="absolute top-[-20px] right-[-20px] p-16 opacity-05 group-hover:scale-125 group-hover:opacity-10 transition-all duration-1000 pointer-events-none">
                    <Sparkles size={200} />
                  </div>
                  <h4 className="text-[11px] font-black tracking-[0.5em] uppercase text-[#D69A73] mb-12 border-b-2 border-[#F2E7D5]/30 pb-8">深度人物誌分析 (Persona Analysis)</h4>
                  <div className="prose prose-slate max-w-none">
                    <div className="text-xl leading-relaxed text-[#4A3728] font-bold whitespace-pre-wrap">{week.prepPhase.persona}</div>
                  </div>
                </div>
                <div className="glass-card p-14 text-left">
                  <h4 className="text-[11px] font-black tracking-[0.5em] uppercase text-[#D69A73] mb-12 border-b-2 border-[#F2E7D5]/30 pb-8">品牌價值定位 (Positioning Strategy)</h4>
                  <div className="text-xl leading-relaxed text-[#4A3728] font-bold whitespace-pre-wrap">{week.prepPhase.brandPositioning}</div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-16">
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
