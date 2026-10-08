import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  Mail, 
  Lock, 
  Sparkles,
  AlertCircle,
  PlusCircle,
  User
} from 'lucide-react';
import { Tutor, CurrentUser, StudentProfile } from '../types';
import { DEMO_STUDENTS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser | null;
  onLoginSuccess: (user: CurrentUser, profileOrTutor?: any) => void;
  onOpenManageTutors: () => void;
  availableTutors: Tutor[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onOpenManageTutors,
  availableTutors
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'tutor'>(
    currentUser?.role === 'tutor' ? 'tutor' : 'student'
  );

  // Student Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-101');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [customStudentEmail, setCustomStudentEmail] = useState<string>('');
  const [customStudentGrade, setCustomStudentGrade] = useState<string>('12. Sınıf (YKS Sayısal)');

  // Tutor Form State
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorPassword, setTutorPassword] = useState<string>('');
  const [selectedQuickTutorId, setSelectedQuickTutorId] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverBinding, setServerBinding] = useState<{
    serverIp?: string;
    boundUser?: { name: string; email: string; userId: string; role: string } | null;
  } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/system/server-binding')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setServerBinding(data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStudentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      let studentData;
      if (selectedStudentId === 'custom') {
        if (!customStudentName.trim() || !customStudentEmail.trim()) {
          setAuthError('Lütfen ad soyad ve e-posta adresinizi giriniz.');
          setIsLoading(false);
          return;
        }
        studentData = {
          name: customStudentName.trim(),
          email: customStudentEmail.trim(),
          grade: customStudentGrade,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          targetExam: 'YKS 2026'
        };
      } else {
        const found = DEMO_STUDENTS.find(s => s.id === selectedStudentId) || DEMO_STUDENTS[0];
        studentData = found;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'student',
          studentData
        })
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user, data.profile);
        onClose();
      } else {
        setAuthError(data.error || 'Öğrenci girişi yapılamadı.');
      }
    } catch (err: any) {
      setAuthError('Sunucu bağlantı hatası.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    setIsLoading(true);

    const query = (tutorQuery || '').trim();
    if (!query) {
      setAuthError('Lütfen sisteme tanımlı e-posta adresinizi veya eğitmen kodunuzu giriniz.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'tutor',
          email: query,
          password: tutorPassword || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthSuccessMsg(`Hoş geldiniz Sayın ${data.user.name}! Eğitmen paneline yönlendiriliyorsunuz.`);
        setTimeout(() => {
          onLoginSuccess(data.user, data.tutor);
          onClose();
        }, 800);
      } else {
        setAuthError(data.error || 'Bu hesap sistemde yetkili eğitmen olarak kayıtlı değil.');
      }
    } catch (err: any) {
      setAuthError('Sunucu ile iletişim kurulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTutorSelect = (tutor: Tutor) => {
    setSelectedQuickTutorId(tutor.id);
    setTutorQuery(tutor.email || tutor.name);
    setTutorPassword(tutor.password || '123456');
    setAuthError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Sisteme Giriş & Rol Portalı</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Öğrenci veya Yetkili Eğitmen hesabınızla sisteme bağlanın
              </p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-6 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setActiveTab('student');
                setAuthError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Öğrenci Girişi</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tutor');
                setAuthError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Yetkili Eğitmen Girişi</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Server Binding Security Policy Banner */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-xl text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1 text-emerald-950">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[12px]">Sunucu Güvenlik Kuralı</span>
                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded">Aktif</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Aynı sunucudan / IP adresinden farklı kullanıcılara izin verilmemektedir. {serverBinding?.boundUser ? (
                  <>Bu sunucu şu anda <strong>{serverBinding.boundUser.name}</strong> ({serverBinding.boundUser.email}) kullanıcısına kilitlenmiştir.</>
                ) : (
                  <>Giriş yapan ilk kullanıcı bu sunucuya tahsis edilecektir.</>
                )}
              </p>
            </div>
          </div>

          {/* Error & Success Messages */}
          {authError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-900">Giriş Başarısız</p>
                <p className="text-xs text-rose-700 mt-0.5">{authError}</p>
                {activeTab === 'tutor' && (
                  <div className="mt-3 pt-2 border-t border-rose-200 flex items-center justify-between">
                    <span className="text-xs text-rose-800 font-medium">Bu eğitmeni hemen sisteme eklemek ister misiniz?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenManageTutors();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 bg-rose-200/80 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Eğitmen Tanımla
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="font-medium text-xs">{authSuccessMsg}</p>
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN */}
          {activeTab === 'student' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-indigo-950">Hazır Öğrenci Profili Seçin</h3>
                  </div>
                  <span className="text-xs bg-indigo-200/60 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                    Hızlı Test
                  </span>
                </div>
                <p className="text-xs text-indigo-700 mt-1">
                  Matematik ve Geometri soruları sormak, geçmiş çözümleri incelemek ve eğitmenleri puanlamak için bir öğrenci seçin:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {DEMO_STUDENTS.map((std) => {
                    const isSelected = selectedStudentId === std.id;
                    return (
                      <div
                        key={std.id}
                        onClick={() => setSelectedStudentId(std.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all text-left flex flex-col items-center text-center ${
                          isSelected
                            ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                            : 'bg-white/80 border-indigo-100 hover:border-indigo-300'
                        }`}
                      >
                        <img 
                          src={std.avatar} 
                          alt={std.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 mb-2 shadow-sm"
                        />
                        <div className="font-bold text-xs text-slate-900">{std.name}</div>
                        <div className="text-[11px] text-indigo-600 font-medium">{std.grade}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{std.targetExam}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Student Input Option */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div 
                  onClick={() => setSelectedStudentId(selectedStudentId === 'custom' ? 'std-101' : 'custom')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-800">Farklı / Özel Öğrenci Bilgisiyle Giriş</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStudentId === 'custom'}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                </div>

                {selectedStudentId === 'custom' && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Ad Soyad</label>
                      <input
                        type="text"
                        placeholder="Örn: Canan Tekin"
                        value={customStudentName}
                        onChange={(e) => setCustomStudentName(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">E-posta Adresi</label>
                      <input
                        type="email"
                        placeholder="canan.tekin@gmail.com"
                        value={customStudentEmail}
                        onChange={(e) => setCustomStudentEmail(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Sınıf / Hedef Sınav</label>
                      <select
                        value={customStudentGrade}
                        onChange={(e) => setCustomStudentGrade(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                      >
                        <option value="LGS (8. Sınıf)">LGS (8. Sınıf)</option>
                        <option value="9. Sınıf">9. Sınıf</option>
                        <option value="10. Sınıf">10. Sınıf</option>
                        <option value="11. Sınıf">11. Sınıf</option>
                        <option value="12. Sınıf (YKS Sayısal)">12. Sınıf (YKS Sayısal)</option>
                        <option value="TYT / AYT Mezun">TYT / AYT Mezun</option>
                        <option value="KPSS / DGS / ALES">KPSS / DGS / ALES</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Student Button */}
              <button
                type="button"
                onClick={() => handleStudentSubmit()}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{isLoading ? 'Giriş yapılıyor...' : 'Öğrenci Olarak Giriş Yap'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {/* TAB 2: TUTOR LOGIN (RESTRICTED) */}
          {activeTab === 'tutor' && (
            <div className="space-y-5">
              {/* Security Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold block text-amber-950 mb-0.5">Yalnızca Tanımlı Eğitmenler Giriş Yapabilir</span>
                  Bu sisteme sadece platform yöneticisi tarafından sisteme tanımlanmış Matematik ve Geometri öğretmenleri erişebilir. Yetkisiz girişler sistem tarafından otomatik engellenir.
                </div>
              </div>

              {/* Quick Select One of the Authorized Tutors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    Sistemde Kayıtlı Yetkili Eğitmenler (Hızlı Seçim)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManageTutors();
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Yeni Eğitmen Tanımla
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {availableTutors.map((tutor) => {
                    const isSelected = selectedQuickTutorId === tutor.id;
                    return (
                      <div
                        key={tutor.id}
                        onClick={() => handleQuickTutorSelect(tutor)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20 shadow-sm'
                            : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-white'
                        }`}
                      >
                        <img 
                          src={tutor.avatar} 
                          alt={tutor.name} 
                          className="w-10 h-10 rounded-full object-cover border border-amber-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">{tutor.name}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium shrink-0">
                              Onaylı
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-700 font-medium truncate">
                            {tutor.specialties?.join(' & ') || tutor.subjects?.join(' & ')}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate font-mono">
                            {tutor.email}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleTutorSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eğitmen E-postası veya Erişim Kodu
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Örn: selim.kurtulus@matematikhocan.com veya MATH-101"
                      value={tutorQuery}
                      onChange={(e) => {
                        setTutorQuery(e.target.value);
                        setAuthError(null);
                      }}
                      className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sistemde tanımlı e-posta adresinizi veya yöneticinin verdiği erişim kodunu giriniz.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eğitmen Şifresi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={tutorPassword}
                      onChange={(e) => setTutorPassword(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>{isLoading ? 'Doğrulanıyor...' : 'Yetkili Eğitmen Olarak Giriş Yap'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Admin Define Tutor Callout */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Yeni bir öğretmen mi eklemek istiyorsunuz?</p>
                  <p className="text-[11px] text-slate-500">Sisteme sadece yönetici onayıyla yeni eğitmen tanımlanabilir.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManageTutors();
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Eğitmen Tanımla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Matematik & Geometri Soru Çözüm Platformu
          </span>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
