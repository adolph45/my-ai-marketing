
import React, { useState } from 'react';
import { LayoutDashboard, Rocket, Calendar, History, LogOut, Menu, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { username: string } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'generator', label: '方案生成', icon: Rocket },
    { id: 'dashboard', label: '執行計畫', icon: LayoutDashboard },
    { id: 'history', label: '存檔紀錄', icon: History },
    { id: 'calendar', label: '行事曆', icon: Calendar },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <aside 
        className={`no-print transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hidden md:flex flex-col py-10 fixed inset-y-0 z-50 ${
          isExpanded ? 'w-72 px-6' : 'w-24 px-4'
        }`}
      >
        <div className="glass-card h-full flex flex-col items-center py-8 relative">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-10 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm hover:bg-white border border-slate-100 transition-all active:scale-95"
          >
            {isExpanded ? <ChevronLeft className="text-slate-600" size={20} /> : <Menu className="text-slate-600" size={20} />}
          </button>
          
          <nav className="flex-1 w-full space-y-3 px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center rounded-[24px] transition-all duration-300 group relative ${
                  isExpanded ? 'w-full px-5 py-4' : 'w-12 h-12 justify-center mx-auto'
                } ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {isExpanded && (
                  <span className="ml-4 font-bold text-sm tracking-wide opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!isExpanded && (
                  <span className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl tracking-[0.2em] uppercase">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto w-full px-4 space-y-6">
             <div className={`flex items-center transition-all ${
               isExpanded ? 'bg-slate-50 p-4 rounded-3xl space-x-3' : 'w-12 h-12 justify-center bg-slate-50 rounded-full border border-slate-100 mx-auto'
             }`}>
               <div className="shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-sm">
                 {user.username.charAt(0).toUpperCase()}
               </div>
               {isExpanded && (
                 <div className="flex-1 min-w-0 text-left">
                   <p className="text-xs font-black text-slate-800 truncate uppercase">{user.username}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Strategist</p>
                 </div>
               )}
             </div>

             <button 
               onClick={onLogout} 
               className={`flex items-center transition-all group relative ${
                 isExpanded ? 'w-full px-6 py-4 rounded-3xl hover:bg-red-50 text-slate-400 hover:text-red-500' : 'w-12 h-12 justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 mx-auto'
               }`}
             >
               <LogOut size={20} className="shrink-0" />
               {isExpanded && <span className="ml-4 font-bold text-sm tracking-wide">登出</span>}
             </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-500 p-6 md:p-12 ${isExpanded ? 'md:ml-72' : 'md:ml-24'}`}>
        <div className="max-w-6xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
