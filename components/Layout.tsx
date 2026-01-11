
import React, { useState } from 'react';
import { LayoutDashboard, Rocket, Calendar, History, LogOut, User, Menu, Settings, Share2, ChevronRight, ChevronLeft } from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#bfc3c6]">
      <aside 
        className={`no-print transition-all duration-300 ease-in-out hidden md:flex flex-col items-center py-10 fixed inset-y-0 z-50 bg-transparent ${
          isExpanded ? 'w-64 px-6' : 'w-24 px-0'
        }`}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          {isExpanded ? <ChevronLeft className="text-black" size={20} /> : <Menu className="text-black" size={20} />}
        </button>
        
        <nav className="flex-1 w-full space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center rounded-2xl transition-all duration-200 group relative ${
                isExpanded ? 'w-full px-5 py-4' : 'w-12 h-12 justify-center mx-auto'
              } ${
                activeTab === item.id 
                  ? 'bg-white shadow-md text-black' 
                  : 'text-black/40 hover:text-black hover:bg-white/40'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              {isExpanded && (
                <span className="ml-4 font-bold text-sm tracking-widest opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {!isExpanded && (
                <span className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl tracking-widest">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto w-full space-y-6 flex flex-col items-center">
           <div className={`flex items-center bg-white shadow-sm transition-all ${
             isExpanded ? 'w-full p-3 rounded-2xl space-x-3' : 'w-12 h-12 justify-center rounded-full border-2 border-white overflow-hidden'
           }`}>
             <div className="shrink-0 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">
               {user.username.charAt(0)}
             </div>
             {isExpanded && (
               <div className="flex-1 min-w-0 text-left">
                 <p className="text-[10px] font-black text-black truncate uppercase tracking-tighter">{user.username}</p>
                 <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">在線操作員</p>
               </div>
             )}
           </div>

           <button 
             onClick={onLogout} 
             className={`flex items-center transition-all group relative border-t border-black/5 pt-4 ${
               isExpanded ? 'w-full px-5 py-4 rounded-2xl hover:bg-red-50 text-black/40 hover:text-red-500' : 'w-12 h-12 justify-center rounded-2xl text-black/40 hover:text-red-500 hover:bg-white/40'
             }`}
           >
             <LogOut size={20} className="shrink-0" />
             {isExpanded && (
               <span className="ml-4 font-bold text-sm tracking-widest">登出系統</span>
             )}
             {!isExpanded && (
                <span className="absolute left-full ml-4 px-3 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl tracking-widest">
                  登出
                </span>
             )}
           </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 p-4 md:p-8 lg:p-12 ${isExpanded ? 'md:ml-64' : 'md:ml-24'}`}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
