
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MarketingForm from './components/MarketingForm';
import PlanDisplay from './components/PlanDisplay';
import { MarketingInput, MarketingPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import { Rocket, ChevronRight, Sparkles, Key } from 'lucide-react';

const STORAGE_KEYS = {
  HISTORY: 'marketing_history_v3',
  USER: 'marketing_user_v3',
  FORM: 'marketing_form_v3'
};

const DEFAULT_FORM: MarketingInput = {
  industry: '....',
  brandName: '',
  style: '簡約風',
  audience: 'C端消費者',
  marketingGoal: '吸引客戶詢問下單',
  strategyFocus: '讓有興趣的人來詢問',
  targetBrandName: '',
  targetBrandUrl: '',
  favoriteCreatorName: '',
  favoriteCreatorUrl: '',
  contactInfo: '官方LINE：@your_brand\n官方網站：https://example.com\n連絡電話：0900-000-000',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MarketingPlan | null>(null);
  const [history, setHistory] = useState<MarketingPlan[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [formData, setFormData] = useState<MarketingInput>(DEFAULT_FORM);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedForm = localStorage.getItem(STORAGE_KEYS.FORM);
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        if (parsed) setFormData(parsed);
      } catch (e) {}
    }
  }, []);

  const handleOpenKeyDialog = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
    } else {
      alert("此環境不支援金鑰選取對話框，請確保在正確的預覽環境下運行。");
    }
  };

  const handleGeneratePlan = async (input: MarketingInput) => {
    setLoading(true);
    try {
      const plan = await generateMarketingPlan(input);
      setCurrentPlan(plan);
      const newHistory = [plan, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(input));
      setActiveTab('dashboard');
    } catch (error: any) {
      console.error("Generate Error:", error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("429")) {
        alert("API 配額異常，請重新選取具備付費專案的 API 金鑰。");
        handleOpenKeyDialog();
      } else {
        alert(`生成失敗：${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = (weekIdx: number, postIdx: number) => {
    if (!currentPlan) return;
    const updatedPlan = { ...currentPlan };
    updatedPlan.weeks[weekIdx].posts[postIdx].isCompleted = !updatedPlan.weeks[weekIdx].posts[postIdx].isCompleted;
    setCurrentPlan(updatedPlan);
    const updatedHistory = history.map(h => h.id === updatedPlan.id ? updatedPlan : h);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#bfc3c6]">
        <div className="max-w-md w-full dashboard-card p-12 text-center space-y-10">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <Sparkles className="text-emerald-500" size={32} />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-black tracking-tight">AI 行銷隨身顧問</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Advanced Strategy Engine</p>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={handleOpenKeyDialog}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-white/50 border border-white/80 rounded-2xl hover:bg-white/80 transition-all group"
            >
              <Key size={18} className="text-emerald-600 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">選取付費專案金鑰</span>
            </button>
            <p className="text-[9px] text-slate-400 font-medium">圖片生成需使用付費專案 API Key，<a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-emerald-600">查看說明文件</a></p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (nicknameInput.trim()) { setUser({ username: nicknameInput }); localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username: nicknameInput })); } }} className="space-y-4">
            <input 
              type="text" 
              required
              className="w-full bg-white/60 rounded-2xl px-6 py-5 text-center text-sm font-bold outline-none border border-white/40"
              placeholder="請輸入您的暱稱"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
            />
            <button type="submit" className="w-full btn-primary py-5 font-bold text-[11px] tracking-[0.2em] uppercase">進入系統</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => { setUser(null); localStorage.removeItem(STORAGE_KEYS.USER); }}>
      {activeTab === 'generator' && (
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-500">
               <Rocket size={16} />
               <span className="text-[10px] font-bold tracking-widest uppercase text-left">Configuration</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-left">設定我的貼文計畫</h2>
          </div>
          <MarketingForm formData={formData} setFormData={setFormData} onSubmit={handleGeneratePlan} loading={loading} />
        </div>
      )}
      {activeTab === 'dashboard' && (
        currentPlan ? (
          <PlanDisplay plan={currentPlan} username={user.username} onUpdatePostStatus={updatePostStatus} />
        ) : (
          <div className="text-center py-40 dashboard-card bg-white/40">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">目前無載入的行銷計畫</p>
            <button onClick={() => setActiveTab('generator')} className="mt-4 text-emerald-600 font-bold">去生成一個計畫 →</button>
          </div>
        )
      )}
      {activeTab === 'history' && (
        <div className="space-y-12">
          <h2 className="text-5xl font-bold tracking-tight text-left">存檔紀錄</h2>
          <div className="grid gap-6">
            {history.map((p) => (
              <div key={p.id} className="dashboard-card p-8 flex items-center justify-between cursor-pointer hover:bg-white/80" onClick={() => { setCurrentPlan(p); setActiveTab('dashboard'); }}>
                <div className="text-left">
                  <h4 className="text-lg font-bold">{p.input.brandName || p.input.industry}</h4>
                  <p className="text-xs text-slate-400">{new Date(p.timestamp).toLocaleDateString()}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
