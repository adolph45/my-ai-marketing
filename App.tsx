
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MarketingForm from './components/MarketingForm';
import PlanDisplay from './components/PlanDisplay';
import { MarketingInput, MarketingPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import { Calendar as CalendarIcon, TrendingUp, AlertTriangle, Rocket, ChevronRight, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  HISTORY: 'marketing_history_v2',
  USER: 'marketing_user_v2',
  FORM: 'marketing_form_memo'
};

const DEFAULT_FORM: MarketingInput = {
  industry: '',
  brandName: '',
  style: '簡約風',
  audience: 'C端消費者',
  marketingGoal: '吸引客戶詢問下單',
  strategyFocus: '讓有興趣的人來詢問',
  targetBrandName: '',
  targetBrandUrl: '',
  favoriteCreatorName: '',
  favoriteCreatorUrl: '',
  contactInfo: '您好，我們致力於提供最優質的服務與產品。\n如有任何需求或合作意願，歡迎隨時聯繫！\n官方LINE：@your_brand\n官方網站：https://example.com\n連絡電話：0900-000-000',
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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedForm = localStorage.getItem(STORAGE_KEYS.FORM);
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (parsedForm) setFormData(parsedForm);
      } catch (e) {
        setFormData(DEFAULT_FORM);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(formData));
  }, [formData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    const username = nicknameInput.trim();
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const handleGeneratePlan = async (input: MarketingInput) => {
    setLoading(true);
    try {
      // 如果環境變數中找不到 Key，且在特殊環境下，嘗試觸發選取對話框
      // 但在標準 Vercel 部署中，我們主要依賴 process.env.API_KEY
      if (!process.env.API_KEY && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }

      const plan = await generateMarketingPlan(input);
      setCurrentPlan(plan);
      const newHistory = [plan, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      setActiveTab('dashboard');
    } catch (error: any) {
      console.error(error);
      // 顯示具體的錯誤原因，方便調試
      alert(`計畫生成失敗：\n${error.message || "請檢查您的 API Key 是否正確設定於 Vercel 的 Environment Variables 中。"}`);
      
      // 如果是 404 錯誤，可能是型號不支援，提示用戶
      if (error.message?.includes("Requested entity was not found")) {
        alert("提示：所選的模型可能在您的區域不支援，系統已嘗試切換模型，請重試一次。");
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI 行銷隨身顧問</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Copywriting Assistant</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              required
              className="w-full bg-white/60 rounded-2xl px-6 py-5 text-center text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="請輸入您的暱稱"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full btn-primary py-5 font-bold text-[11px] tracking-[0.2em] uppercase shadow-lg shadow-emerald-500/20"
            >
              開始建立我的貼文
            </button>
          </form>
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest pt-4 border-t border-black/5">SYSTEM READY</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {activeTab === 'generator' && (
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-500">
               <Rocket size={16} />
               <span className="text-[10px] font-bold tracking-widest uppercase text-left">Configuration</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight leading-tight text-left">設定我的貼文</h2>
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
