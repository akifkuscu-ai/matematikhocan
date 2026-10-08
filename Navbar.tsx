import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Bell, 
  PlusCircle, 
  Award, 
  Zap, 
  Video, 
  FileText, 
  UserCheck, 
  Crown,
  HelpCircle,
  Users,
  Layers,
  User,
  ShieldCheck,
  LogIn,
  UserPlus,
  Smartphone,
  Play
} from 'lucide-react';
import { UserRole, StudentProfile, AppNotification, CurrentUser } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  studentProfile: StudentProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenAskQuestion: () => void;
  onOpenSubscribe: () => void;
  onResetLimitsDemo: () => void;
  currentUser: CurrentUser | null;
  onOpenAuthModal: () => void;
  onOpenManageTutors: () => void;
  onOpenPlayStoreModal: () => void;
  isSimulatorActive?: boolean;
  onToggleSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  studentProfile,
  notifications,
  onOpenNotifications,
  onOpenAskQuestion,
  onOpenSubscribe,
  onResetLimitsDemo,
  currentUser,
  onOpenAuthModal,
  onOpenManageTutors,
  onOpenPlayStoreModal,
  isSimulatorActive = false,
  onToggleSimulator
}) => {
  const unreadCount = notifications.filter(n => !n.read && (n.recipientRole === currentRole || n.recipientRole === 'all')).length;
  const hasUrgentNotification = notifications.some(n => !n.read && n.urgent && (n.recipientRole === currentRole || n.recipientRole === 'all'));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button 
              onClick={() => onTabChange(currentRole === 'student' ? 'ask' : 'tutor-pool')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition font-serif font-black text-xl">
                <span>π</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    matematik<span className="text-indigo-600">hocan</span><span className="text-amber-500 font-extrabold text-xs ml-0.5">.com</span>
                  </span>
                  <span className="hidden xl:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CANLI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Matematik & Geometri Portalı</span>
                </p>
              </div>
            </button>

            {/* Navigation Links for Student */}
            {currentRole === 'student' && (
              <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
                <button
                  onClick={() => onTabChange('ask')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition ${
                    activeTab === 'ask' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Soru Çöz
                </button>
                <button
                  onClick={() => onTabChange('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition ${
                    activeTab === 'history' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Çözümlerim
                </button>
                <button
                  onClick={() => onTabChange('courses')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1 ${
                    activeTab === 'courses' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Online Dersler</span>
                </button>
                <button
                  onClick={() => onTabChange('whiteboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1 ${
                    activeTab === 'whiteboard' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Beyaz Tahta</span>
                </button>
                <button
                  onClick={() => onTabChange('tutors')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition ${
                    activeTab === 'tutors' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Öğretmenlerimiz
                </button>
                <button
                  onClick={() => onTabChange('guide')}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1 ${
                    activeTab === 'guide' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Rehber & SSS
                </button>
              </nav>
            )}

            {/* Navigation Links for Tutor */}
            {currentRole === 'tutor' && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onTabChange('tutor-pool')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'tutor-pool' 
                      ? 'bg-amber-50 text-amber-800 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-600" />
                  Gelen Sorular Havuzu
                </button>
                <button
                  onClick={() => onTabChange('tutor-solved')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === 'tutor-solved' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Çözdüklerim
                </button>
                <button
                  onClick={() => onTabChange('courses')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                    activeTab === 'courses' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>Online Dersler</span>
                </button>
                <button
                  onClick={() => onTabChange('whiteboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                    activeTab === 'whiteboard' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Beyaz Tahta</span>
                </button>
                <button
                  onClick={() => onTabChange('tutor-reviews')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'tutor-reviews' 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  Puanlarım & Yorumlar
                </button>
              </nav>
            )}
          </div>

          {/* Right Section: Role Switcher, Question Limits & Notifications */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* ANDROID SIMULATOR TOGGLE */}
            {onToggleSimulator && (
              <button
                type="button"
                onClick={onToggleSimulator}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                  isSimulatorActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isSimulatorActive ? 'Tam Ekran Web Görünümüne Dön' : 'Android Telefon Simülatöründe Önizle'}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{isSimulatorActive ? 'Web Modu' : 'Android Telefon'}</span>
              </button>
            )}

            {/* GOOGLE PLAY STORE & ANDROID APP BUTTON */}
            <button
              type="button"
              onClick={onOpenPlayStoreModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black rounded-xl shadow-xs shadow-emerald-600/30 transition transform active:scale-95"
              title="Google Play Store Dönüştürme & Android Yükleme Merkezi"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Play Store & İndir</span>
              <span className="sm:hidden">Yükle</span>
            </button>

            {/* DEFINE TUTOR ADMIN BUTTON */}
            <button
              type="button"
              onClick={onOpenManageTutors}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm transition-all"
              title="Sisteme yeni yetkili eğitmen tanımla veya mevcutları yönet"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Eğitmen Tanımla</span>
            </button>

            {/* Student Limits Badge */}
            {currentRole === 'student' && (
              <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-xl text-xs">
                <div 
                  className="flex items-center gap-1 text-slate-700" 
                  title={studentProfile.activePlan === 'free' ? 'Bu haftaki Kalan Ücretsiz Standart Soru Hakkınız (Haftalık 3 Soru)' : 'Bugünkü Kalan Standart Soru Hakkınız'}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold">
                    {studentProfile.activePlan === 'free' 
                      ? `${studentProfile.weeklyStandardRemaining ?? studentProfile.dailyStandardRemaining}/3` 
                      : `${studentProfile.dailyStandardRemaining}/${studentProfile.dailyStandardTotal}`}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {studentProfile.activePlan === 'free' ? 'Haftalık' : 'Standart'}
                  </span>
                </div>
                <div className="h-3 w-px bg-slate-300" />
                <div className="flex items-center gap-1 text-slate-700" title="Bugünkü Kalan 1080p HD Video Çözüm Hakkınız">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-semibold">{studentProfile.dailyVideoRemaining}/{studentProfile.dailyVideoTotal}</span>
                  <span className="text-slate-400 text-[10px]">HD Video</span>
                </div>

                {/* Free quota badge */}
                <span className="ml-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg text-[10px]">
                  Haftalık 3 Ücretsiz Soru
                </span>
              </div>
            )}

            {/* Same-Server Single User Security Protection Badge */}
            <div 
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-bold"
              title="Güvenlik Koruması Aktif: Aynı sunucudan / IP adresinden farklı kullanıcılara izin verilmez (Tek Kullanıcı Kilidi)."
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sunucu Korumalı</span>
            </div>

            {/* SEPARATE LOGIN & PROFILE SWITCH BUTTON */}
            <button
              type="button"
              onClick={onOpenAuthModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                currentRole === 'tutor'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100'
              }`}
              title="Kullanıcı Girişi Yap veya Profil Değiştir"
            >
              <img
                src={currentUser?.avatar || (currentRole === 'student' ? studentProfile.avatar : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150')}
                alt="user avatar"
                className="w-5 h-5 rounded-full object-cover border border-indigo-300"
              />
              <div className="text-left hidden sm:block">
                <span className="block leading-none truncate max-w-[110px]">
                  {currentUser?.name || (currentRole === 'student' ? studentProfile.name : 'Dr. Selim Kurtuluş')}
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${
                  currentRole === 'tutor' ? 'text-amber-700' : 'text-indigo-600'
                }`}>
                  {currentRole === 'tutor' ? '👨‍🏫 Yetkili Eğitmen' : '🎓 Öğrenci'}
                </span>
              </div>
              <LogIn className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className={`relative p-2 rounded-xl transition ${
                hasUrgentNotification 
                  ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-500/30' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Bildirim Merkezi"
              aria-label="Bildirimler"
            >
              <Bell className={`w-5 h-5 ${hasUrgentNotification ? 'animate-bounce text-rose-600' : ''}`} />
              {unreadCount > 0 && (
                <span className={`absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ${
                  hasUrgentNotification ? 'bg-rose-600 animate-pulse ring-2 ring-rose-300' : 'bg-rose-500'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            {currentRole === 'student' ? (
              <button
                type="button"
                onClick={onOpenAskQuestion}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Soru Gönder</span>
                <span className="sm:hidden">Sor</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('tutor-pool')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 transition transform active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Havuz ({notifications.filter(n => n.type === 'new_question_available').length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold overflow-x-auto gap-1">
          {currentRole === 'student' ? (
            <>
              <button 
                onClick={() => onTabChange('ask')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'ask' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                Soru Sor
              </button>
              <button 
                onClick={() => onTabChange('history')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'history' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                Geçmişim
              </button>
              <button 
                onClick={() => onTabChange('courses')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'courses' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600'}`}
              >
                Dersler
              </button>
              <button 
                onClick={() => onTabChange('whiteboard')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'whiteboard' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600'}`}
              >
                Tahta
              </button>
              <button 
                onClick={() => onTabChange('tutors')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'tutors' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                Eğitmenler
              </button>
              <button 
                onClick={() => onTabChange('guide')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'guide' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600'}`}
              >
                Rehber & SSS
              </button>
              <button
                onClick={onOpenManageTutors}
                className="px-2 py-1 rounded-lg text-amber-700 bg-amber-50 font-bold flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                Tanımla
              </button>
              <button
                onClick={onOpenPlayStoreModal}
                className="px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50 font-bold flex items-center gap-1 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                Play Store
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onTabChange('tutor-pool')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'tutor-pool' ? 'text-amber-700 bg-amber-50 font-bold' : 'text-slate-600'}`}
              >
                Soru Havuzu
              </button>
              <button 
                onClick={() => onTabChange('tutor-solved')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'tutor-solved' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                Çözdüklerim
              </button>
              <button 
                onClick={() => onTabChange('tutor-reviews')}
                className={`px-2 py-1 rounded-lg ${activeTab === 'tutor-reviews' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                Puanlarım
              </button>
              <button
                onClick={onOpenManageTutors}
                className="px-2 py-1 rounded-lg text-amber-700 bg-amber-50 font-bold flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                Tanımla
              </button>
              <button
                onClick={onOpenPlayStoreModal}
                className="px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50 font-bold flex items-center gap-1 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                Play Store
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

