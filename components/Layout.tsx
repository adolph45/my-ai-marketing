
import React, { useState } from 'react';
import { LayoutDashboard, Rocket, Calendar, History, LogOut, Menu, ChevronRight, ChevronLeft } from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#FDF8F1]">
      <aside 
        className={`no-print transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hidden md:flex flex-col py-10 fixed inset-y-0 z-50 ${
          isExpanded ? 'w-80 px-8' : 'w-24 px-4'
        }`}
      >
        <div className="glass-card h-full flex flex-col items-center py-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D69A73]"></div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-14 w-12 h-12 bg-white rounded-[18px] flex items-center justify-center shadow-lg border border-[#F2E7D5] hover:border-[#D69A73] transition-all"
          >
            {isExpanded ? <ChevronLeft className="text-[#D69A73]" size={20} /> : <Menu className="text-[#D69A73]" size={20} />}
          </button>
          
          <nav className="flex-1 w-full space-y-4 px-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center rounded-[24px] transition-all duration-500 group relative ${
                  isExpanded ? 'w-full px-6 py-5' : 'w-12 h-12 justify-center mx-auto'
                } ${
                  activeTab === item.id 
                    ? 'bg-[#4A3728] text-white shadow-2xl shadow-[#4A3728]/30' 
                    : 'text-[#4A3728]/40 hover:text-[#4A3728] hover:bg-[#F2E7D5]/50'
                }`}
              >
                <item.icon size={22} className="shrink-0" />
                {isExpanded && (
                  <span className="ml-5 font-black text-[13px] tracking-widest opacity-100 whitespace-nowrap uppercase">
                    {item.label}
                  </span>
                )}
                {!isExpanded && (
                  <span className="absolute left-full ml-10 px-5 py-3 bg-[#4A3728] text-white text-[10px] font-black rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-2xl tracking-[0.3em] uppercase">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto w-full px-6 space-y-8">
             <div className={`flex items-center transition-all ${
               isExpanded ? 'bg-[#F2E7D5]/30 p-5 rounded-[32px] space-x-4 border border-white' : 'w-14 h-14 justify-center bg-white rounded-full border border-[#F2E7D5] mx-auto shadow-sm'
             }`}>
               <div className="shrink-0 w-10 h-10 bg-[#D69A73] rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-lg">
                 {user.username.charAt(0).toUpperCase()}
               </div>
               {isExpanded && (
                 <div className="flex-1 min-w-0 text-left">
                   <p className="text-sm font-black text-[#4A3728] truncate uppercase tracking-wider">{user.username}</p>
                   <p className="text-[9px] text-[#D69A73] font-black uppercase tracking-[0.4em] mt-1">PRO Strategist</p>
                 </div>
               )}
             </div>

             <button 
               onClick={onLogout} 
               className={`flex items-center transition-all group relative ${
                 isExpanded ? 'w-full px-8 py-5 rounded-[24px] hover:bg-red-50 text-[#4A3728]/40 hover:text-red-500' : 'w-12 h-12 justify-center rounded-full text-[#4A3728]/40 hover:text-red-500 hover:bg-red-50 mx-auto'
               }`}
             >
               <LogOut size={22} className="shrink-0" />
               {isExpanded && <span className="ml-5 font-black text-[13px] tracking-widest uppercase">登出</span>}
             </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-700 p-8 md:p-16 ${isExpanded ? 'md:ml-80' : 'md:ml-24'}`}>
        <div className="max-w-6xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
