
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MarketingForm from './components/MarketingForm';
import PlanDisplay from './components/PlanDisplay';
import { MarketingInput, MarketingPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import { Rocket, ChevronRight, Sparkles, UserCheck } from 'lucide-react';

const STORAGE_KEYS = {
  HISTORY: 'marketing_history_v3',
  USER: 'marketing_user_v3',
  FORM: 'marketing_form_v3'
};

const DEFAULT_FORM: MarketingInput = {
  industry: '果乾批發',
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
      alert(`生成失敗：${error.message}`);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FF8A8A] relative overflow-hidden px-6">
        {/* SVG Background Wave from Image 1 style */}
        <div className="wave-container">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L60,208C120,224,240,256,360,245.3C480,235,600,181,720,176C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-md w-full relative z-10 text-center space-y-8 mb-20">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-2xl border border-white/30">
             <Sparkles className="text-white" size={40} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">Welcome</h1>
            <p className="text-white/80 font-medium max-w-[280px] mx-auto text-sm leading-relaxed">
              您的專屬 AI 行銷策略引擎，打造專業且具影響力的社群計畫。
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (nicknameInput.trim()) { setUser({ username: nicknameInput }); localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username: nicknameInput })); } }} className="space-y-6 pt-4">
            <div className="space-y-2 text-left">
              <label className="text-white text-xs font-bold uppercase tracking-widest ml-4">暱稱</label>
              <input 
                type="text" 
                required
                className="w-full !bg-white/10 !border-white/20 !text-white !placeholder-white/50 backdrop-blur-md rounded-[24px] px-8 py-5 text-lg font-semibold outline-none focus:!bg-white/20 transition-all"
                placeholder="輸入您的稱呼"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-white text-[#FF8A8A] hover:bg-white/90 py-6 rounded-[24px] font-black text-sm tracking-[0.2em] uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
              進入系統 <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => { setUser(null); localStorage.removeItem(STORAGE_KEYS.USER); }}>
      {activeTab === 'generator' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-emerald-500 font-black text-[10px] tracking-[0.4em] uppercase">
                 <Rocket size={16} />
                 <span>Strategic Configuration</span>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">設定我的貼文計畫</h2>
            </div>
          </div>
          <MarketingForm formData={formData} setFormData={setFormData} onSubmit={handleGeneratePlan} loading={loading} />
        </div>
      )}
      {activeTab === 'dashboard' && (
        currentPlan ? (
          <PlanDisplay plan={currentPlan} username={user.username} onUpdatePostStatus={updatePostStatus} />
        ) : (
          <div className="text-center py-40 glass-card bg-white/40 border-dashed border-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">目前無載入的行銷計畫</p>
            <button onClick={() => setActiveTab('generator')} className="mt-6 btn-emerald px-8 py-3 text-sm font-bold shadow-lg">去生成一個計畫 →</button>
          </div>
        )
      )}
      {activeTab === 'history' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">存檔紀錄</h2>
          <div className="grid gap-6">
            {history.map((p) => (
              <div key={p.id} className="glass-card p-10 flex items-center justify-between cursor-pointer hover:bg-white/80 transition-all hover:scale-[1.01]" onClick={() => { setCurrentPlan(p); setActiveTab('dashboard'); }}>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                    {p.input.industry.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-slate-800">{p.input.brandName || p.input.industry}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {new Date(p.timestamp).toLocaleDateString()} • {p.input.marketingGoal}
                    </p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-slate-300" />
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-20 text-slate-400 font-bold italic">暫無歷史記錄</div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
