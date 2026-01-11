
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
  industry: '', // 保持為空
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
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }

    const savedForm = localStorage.getItem(STORAGE_KEYS.FORM);
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (parsedForm) {
          setFormData(parsedForm);
        }
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
      const plan = await generateMarketingPlan(input);
      setCurrentPlan(plan);
      const newHistory = [plan, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      setActiveTab('dashboard');
    } catch (error) {
      console.error(error);
      alert("計畫生成失敗。請檢查您的 API Key 設定。");
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
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest pt-4 border-t border-black/5">The System IS READY.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentPlan ? (
          <PlanDisplay plan={currentPlan} username={user.username} onUpdatePostStatus={updatePostStatus} />
        ) : (
          <div className="text-center py-40 dashboard-card space-y-8 bg-white/40">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">目前無載入的行銷計畫</p>
              <button onClick={() => setActiveTab('generator')} className="text-emerald-600 text-sm font-bold hover:underline flex items-center justify-center mx-auto">
                去生成一個計畫 <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        );
      case 'generator':
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-500">
                 <Rocket size={16} />
                 <span className="text-[10px] font-bold tracking-widest uppercase text-left">Configuration</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight leading-tight text-left">設定我的貼文</h2>
            </div>
            <MarketingForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGeneratePlan} 
              loading={loading} 
            />
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-12">
            <h2 className="text-5xl font-bold tracking-tight text-left">執行時間軸</h2>
            <div className="dashboard-card p-24 flex flex-col items-center justify-center text-slate-400 bg-white/40">
              <CalendarIcon size={64} className="mb-6 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">排程管理模組開發中</p>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <h2 className="text-5xl font-bold tracking-tight">存檔紀錄</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database History</p>
            </div>
            <div className="grid gap-6">
              {history.length === 0 ? (
                <div className="dashboard-card p-24 text-center text-slate-400 text-sm font-medium bg-white/40">
                  目前尚未生成過任何方案
                </div>
              ) : (
                history.map((p) => (
                  <div 
                    key={p.id} 
                    className="dashboard-card p-8 flex items-center justify-between cursor-pointer hover:bg-white/80 transition-all border-none"
                    onClick={() => { setCurrentPlan(p); setActiveTab('dashboard'); }}
                  >
                    <div className="flex items-center space-x-8">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <TrendingUp size={24} className="text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-bold leading-tight">{p.input.brandName || p.input.industry}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{new Date(p.timestamp).toLocaleDateString()}</span>
                          <span className="status-dot"></span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{p.input.marketingGoal}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                      <ChevronRight size={18} className="text-black/40" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
