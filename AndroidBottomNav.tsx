import React from 'react';
import { 
  Home, 
  BookOpen, 
  Plus, 
  Users, 
  User, 
  Inbox, 
  Clock, 
  CheckCircle, 
  Star,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface AndroidBottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAskQuestion: () => void;
  pendingCount?: number;
  unreadCount?: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onOpenAskQuestion,
  pendingCount = 0,
  unreadCount = 0
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(12);
      } catch (e) {}
    }
  };

  const handleTabClick = (tabKey: string) => {
    triggerHaptic();
    onTabChange(tabKey);
  };

  const handleFabClick = () => {
    triggerHaptic();
    onOpenAskQuestion();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 sm:hidden pb-[env(safe-area-inset-bottom,8px)] transition-all shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        
        {currentRole === 'student' ? (
          <>
            {/* 1. Ana Sayfa */}
            <button
              type="button"
              onClick={() => handleTabClick('ask')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'ask'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'ask' ? 'bg-indigo-500/20' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Ana Sayfa</span>
            </button>

            {/* 2. Sorularım */}
            <button
              type="button"
              onClick={() => handleTabClick('history')}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
                activeTab === 'history'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'history' ? 'bg-indigo-500/20' : ''}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Sorularım</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-amber-500 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-slate-900">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* 3. Floating Action Button (FAB) - Soru Sor */}
            <div className="flex flex-col items-center justify-center px-1 -mt-5">
              <button
                type="button"
                onClick={handleFabClick}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 border-2 border-slate-900 transform active:scale-95 transition-all"
                title="Yeni Soru Sor"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
              <span className="text-[9px] font-extrabold text-indigo-400 mt-1">Soru Sor</span>
            </div>

            {/* 4. Eğitmenler */}
            <button
              type="button"
              onClick={() => handleTabClick('tutors')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'tutors'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'tutors' ? 'bg-indigo-500/20' : ''}`}>
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Eğitmenler</span>
            </button>

            {/* 5. Profil & Paket */}
            <button
              type="button"
              onClick={() => handleTabClick('profile')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'profile'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'profile' ? 'bg-indigo-500/20' : ''}`}>
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Profil</span>
            </button>
          </>
        ) : (
          <>
            {/* TUTOR ROLE BOTTOM TABS */}
            {/* 1. Soru Havuzu */}
            <button
              type="button"
              onClick={() => handleTabClick('pool')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'pool'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'pool' ? 'bg-indigo-500/20' : ''}`}>
                <Inbox className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Havuz</span>
            </button>

            {/* 2. Bekleyenler */}
            <button
              type="button"
              onClick={() => handleTabClick('pending')}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
                activeTab === 'pending'
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'pending' ? 'bg-indigo-500/20' : ''}`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Bekleyen</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-amber-500 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-slate-900">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* 3. Çözdüklerim */}
            <button
              type="button"
              onClick={() => handleTabClick('solved')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'solved'
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'solved' ? 'bg-emerald-500/20' : ''}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Çözülen</span>
            </button>

            {/* 4. Değerlendirmeler */}
            <button
              type="button"
              onClick={() => handleTabClick('reviews')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === 'reviews'
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${activeTab === 'reviews' ? 'bg-amber-500/20' : ''}`}>
                <Star className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Yorumlar</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};
