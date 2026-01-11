
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MarketingForm from './components/MarketingForm';
import PlanDisplay from './components/PlanDisplay';
import { MarketingInput, MarketingPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import { Rocket, ChevronRight, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  HISTORY: 'marketing_history_v4',
  USER: 'marketing_user_v4',
  FORM: 'marketing_form_v4',
  USAGE: 'marketing_usage_count_v4'
};

const MAX_USAGE = 35;

const DEFAULT_FORM: MarketingInput = {
  industry: '', // 預設為空白
  brandName: '',
  style: '簡約風 (主色調數種，低彩度，中間明度與亮度，線條乾淨俐落)',
  audience: 'C端消費者',
  marketingGoal: '行業專業權威性',
  strategyFocus: '讓有興趣的人來詢問',
  targetBrandName: '',
  targetBrandUrl: '',
  favoriteCreatorName: '',
  favoriteCreatorUrl: '',
  contactInfo: '我們是ooooo\n如有任何需求或合作意願，歡迎隨時聯繫！\n官方LINE：@UUUU\n官方網站：https://example.com\n連絡電話：0900-000-000',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MarketingPlan | null>(null);
  const [history, setHistory] = useState<MarketingPlan[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [formData, setFormData] = useState<MarketingInput>(DEFAULT_FORM);
  const [usageCount, setUsageCount] = useState(0);

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

    const savedUsage = localStorage.getItem(STORAGE_KEYS.USAGE);
    if (savedUsage) setUsageCount(parseInt(savedUsage, 10));
  }, []);

  const handleGeneratePlan = async (input: MarketingInput) => {
    if (usageCount >= MAX_USAGE) {
      alert('今日額度已滿');
      return;
    }

    setLoading(true);
    try {
      const plan = await generateMarketingPlan(input);
      setCurrentPlan(plan);
      const newHistory = [plan, ...history].slice(0, 15);
      setHistory(newHistory);
      
      const newUsage = usageCount + 1;
      setUsageCount(newUsage);
      
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(input));
      localStorage.setItem(STORAGE_KEYS.USAGE, newUsage.toString());
      
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    setUser({ username: nicknameInput });
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username: nicknameInput }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2E7D5] relative overflow-hidden px-6">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D69A73]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#D69A73]/05 rounded-full blur-3xl"></div>

        <div className="wave-container">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FDF8F1" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-md w-full relative z-10 text-center space-y-12 mb-20">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-xl rounded-[40px] flex items-center justify-center mx-auto shadow-2xl border border-white/80">
             <Sparkles className="text-[#D69A73]" size={48} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight text-[#4A3728]">Welcome</h1>
            <p className="text-[#4A3728]/70 font-semibold max-w-[280px] mx-auto text-sm leading-relaxed tracking-wide">
              AI 行銷顧問引擎V2.0，為您調配最具溫度的品牌社群藍圖。
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 pt-4">
            <div className="space-y-3 text-left">
              <label className="text-[#4A3728] text-[10px] font-black uppercase tracking-[0.3em] ml-6">Your Nickname</label>
              <input 
                type="text" 
                required
                className="w-full !bg-white/70 !border-white/90 !text-[#4A3728] !placeholder-[#4A3728]/30 backdrop-blur-lg rounded-[32px] px-10 py-6 text-lg font-bold outline-none focus:!bg-white transition-all shadow-sm"
                placeholder="輸入您的稱呼..."
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full btn-primary-coffee py-7 font-black text-sm tracking-[0.3em] uppercase shadow-2xl shadow-[#D69A73]/20 flex items-center justify-center gap-3 active:scale-[0.97]">
              進入系統 <ChevronRight size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => { setUser(null); localStorage.removeItem(STORAGE_KEYS.USER); }}>
      {activeTab === 'generator' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3 text-[#D69A73] font-black text-[10px] tracking-[0.5em] uppercase">
               <Rocket size={18} />
               <span>Strategy Brewing</span>
            </div>
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-black tracking-tight text-[#4A3728]">設定我的貼文計畫</h2>
              <span className="text-[10px] font-black text-[#D69A73] uppercase tracking-widest">
                裝置剩餘次數: {MAX_USAGE - usageCount}
              </span>
            </div>
          </div>
          <MarketingForm formData={formData} setFormData={setFormData} onSubmit={handleGeneratePlan} loading={loading} />
        </div>
      )}
      {activeTab === 'dashboard' && (
        currentPlan ? (
          <PlanDisplay plan={currentPlan} username={user.username} onUpdatePostStatus={updatePostStatus} />
        ) : (
          <div className="text-center py-48 glass-card bg-white/30 border-dashed border-2 border-[#D69A73]/20">
            <p className="text-[#4A3728]/40 text-xs font-bold uppercase tracking-[0.3em]">目前無載入的行銷計畫</p>
            <button onClick={() => setActiveTab('generator')} className="mt-8 btn-primary-coffee px-10 py-4 text-xs font-black uppercase tracking-widest shadow-xl">開始調配方案 →</button>
          </div>
        )
      )}
      {activeTab === 'history' && (
        <div className="space-y-12 animate-in fade-in duration-1000">
          <h2 className="text-xl font-black tracking-tight text-[#4A3728]">存檔紀錄</h2>
          <div className="grid gap-8">
            {history.map((p) => (
              <div key={p.id} className="glass-card p-12 flex items-center justify-between cursor-pointer hover:bg-white transition-all hover:scale-[1.01] group" onClick={() => { setCurrentPlan(p); setActiveTab('dashboard'); }}>
                <div className="flex items-center space-x-8">
                  <div className="w-16 h-16 bg-[#F2E7D5] rounded-[24px] flex items-center justify-center text-[#D69A73] font-black text-xl shadow-inner group-hover:bg-[#D69A73] group-hover:text-white transition-colors">
                    {p.input.industry ? p.input.industry.charAt(0) : 'P'}
                  </div>
                  <div className="text-left">
                    <h4 className="text-2xl font-black text-[#4A3728]">{p.input.brandName || p.input.industry || '未命名計畫'}</h4>
                    <p className="text-[10px] text-[#4A3728]/50 font-black uppercase tracking-[0.3em] mt-2">
                      {new Date(p.timestamp).toLocaleDateString()} • {p.input.marketingGoal}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-[#F2E7D5] flex items-center justify-center text-[#F2E7D5] group-hover:border-[#D69A73] group-hover:text-[#D69A73] transition-all">
                  <ChevronRight size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
