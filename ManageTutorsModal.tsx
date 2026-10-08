import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ShieldCheck, 
  BookOpen, 
  Key, 
  Mail, 
  Phone, 
  GraduationCap, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  LogIn
} from 'lucide-react';
import { Tutor, Subject, CurrentUser } from '../types';

interface ManageTutorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutors: Tutor[];
  onTutorsUpdated: () => void;
  onLoginAsTutor: (user: CurrentUser, tutor: Tutor) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
];

export const ManageTutorsModal: React.FC<ManageTutorsModalProps> = ({
  isOpen,
  onClose,
  tutors = [],
  onTutorsUpdated,
  onLoginAsTutor
}) => {
  const safeTutors = Array.isArray(tutors) ? tutors : [];
  const [activeView, setActiveView] = useState<'create' | 'list'>('create');
  
  // New Tutor Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [university, setUniversity] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(['Matematik']);
  const [password, setPassword] = useState('123456');
  const [accessCode, setAccessCode] = useState(`KOD-${Math.floor(100 + Math.random() * 900)}`);
  const [dailyCapacity, setDailyCapacity] = useState<number>(25);
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // UI status
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSubject = (subj: Subject) => {
    if (selectedSubjects.includes(subj)) {
      if (selectedSubjects.length === 1) return; // Must keep at least one
      setSelectedSubjects(selectedSubjects.filter(s => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleCreateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim() || !email.trim()) {
      setStatusMsg({ type: 'error', text: 'Lütfen Ad Soyad ve E-posta alanlarını doldurunuz.' });
      return;
    }

    if (selectedSubjects.length === 0) {
      setStatusMsg({ type: 'error', text: 'Lütfen en az bir branş (Matematik veya Geometri) seçiniz.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const avatarToUse = customAvatarUrl.trim() || selectedAvatar;
      const res = await fetch('/api/admin/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || '0555 123 4567',
          title: title.trim() || `${selectedSubjects.join(' & ')} Uzmanı`,
          university: university.trim() || 'Boğaziçi / ODTÜ / İTÜ Mezunu',
          subjects: selectedSubjects,
          password: password.trim() || '123456',
          accessCode: accessCode.trim().toUpperCase(),
          dailyCapacity,
          bio: bio.trim() || `${selectedSubjects.join(' & ')} alanında öğrencilere yazılı ve videolu çözüm desteği sunar.`,
          avatar: avatarToUse
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: `"${name}" başarıyla yetkili eğitmen olarak sisteme tanımlandı!` });
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setTitle('');
        setUniversity('');
        setBio('');
        setAccessCode(`KOD-${Math.floor(100 + Math.random() * 900)}`);
        onTutorsUpdated();
        setTimeout(() => {
          setActiveView('list');
        }, 1200);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Eğitmen tanımlanamadı.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Sunucuya bağlanırken bir hata meydana geldi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (tutor: Tutor) => {
    const newStatus = tutor.status === 'inactive' ? 'active' : 'inactive';
    try {
      const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onTutorsUpdated();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteTutor = async (tutorId: string, tutorName: string) => {
    if (!window.confirm(`"${tutorName}" isimli eğitmeni sistemden silmek ve yetkisini kaldırmak istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/tutors/${tutorId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onTutorsUpdated();
        setStatusMsg({ type: 'success', text: `${tutorName} sistemden kaldırıldı.` });
      }
    } catch (err) {
      console.error('Failed to delete tutor:', err);
    }
  };

  const handleQuickLoginAsTutor = (tutor: Tutor) => {
    const user: CurrentUser = {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email || '',
      role: 'tutor',
      avatar: tutor.avatar,
      title: tutor.title,
      subject: tutor.subjects || tutor.specialties,
      isAuthorized: true
    };
    onLoginAsTutor(user, tutor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Sisteme Eğitmen Tanımlama & Yönetim</h2>
                <span className="text-[11px] bg-amber-500/30 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Yönetici Yetkisi
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Yalnızca burada tanımlanan öğretmenler sisteme giriş yapabilir ve soru çözebilir
              </p>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 mt-5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 w-fit">
            <button
              onClick={() => {
                setActiveView('create');
                setStatusMsg(null);
              }}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                activeView === 'create'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Yeni Eğitmen Tanımla</span>
            </button>

            <button
              onClick={() => {
                setActiveView('list');
                setStatusMsg(null);
              }}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                activeView === 'list'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tanımlı Eğitmenler ({tutors.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Status Message */}
          {statusMsg && (
            <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* VIEW 1: CREATE NEW TUTOR FORM */}
          {activeView === 'create' && (
            <form onSubmit={handleCreateTutor} className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Yetkilendirme Kuralı:</span> Sisteme tanımladığınız her eğitmen için belirlediğiniz e-posta ve erişim kodu ile eğitmen girişi sağlanır. Tanımlanmayan kişiler sisteme öğretmen olarak giriş yapamaz.
                </div>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eğitmen Adı ve Soyadı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Dr. Ahmet Yılmaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Giriş E-postası <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ahmet.yilmaz@matematikhocan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    placeholder="0555 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    Yetkili Olduğu Branşlar <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedSubjects.includes('Matematik')
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes('Matematik')}
                        onChange={() => toggleSubject('Matematik')}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>📐 Matematik</span>
                    </label>

                    <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedSubjects.includes('Geometri')
                        ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes('Geometri')}
                        onChange={() => toggleSubject('Geometri')}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>📏 Geometri</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Title & University */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    Ünvan / Uzmanlık Açıklaması
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: AYT İleri Matematik & Analiz Eğitmeni"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mezun Olduğu Üniversite
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Boğaziçi Üniversitesi (Matematik)"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Password & Access Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    Giriş Şifresi
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hızlı Erişim Kodu
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none font-mono font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Günlük Soru Kapasitesi
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={dailyCapacity}
                    onChange={(e) => setDailyCapacity(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Eğitmen Profil Fotoğrafı
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="avatar option"
                      onClick={() => {
                        setSelectedAvatar(av);
                        setCustomAvatarUrl('');
                      }}
                      className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        selectedAvatar === av && !customAvatarUrl
                          ? 'border-amber-600 ring-2 ring-amber-500/30 scale-105'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Özgeçmiş & Öğrenciye Not
                </label>
                <textarea
                  rows={2}
                  placeholder="YKS ve LGS hazırlıkta soru çözüm yöntemleri, video çözüm kalitesi ve tecrübeleri..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isSubmitting ? 'Kaydediliyor...' : '✅ Eğitmeni Sisteme Kaydet ve Yetkilendir'}</span>
              </button>
            </form>
          )}

          {/* VIEW 2: LIST OF DEFINED TUTORS */}
          {activeView === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium">
                  Sistemde kayıtlı toplam <span className="font-bold text-slate-900">{safeTutors.length}</span> yetkili eğitmen bulunmaktadır.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('create')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  + Yeni Eğitmen Ekle
                </button>
              </div>

              <div className="space-y-3">
                {safeTutors.map((tutor) => {
                  const isActive = tutor.status !== 'inactive';
                  return (
                    <div 
                      key={tutor.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={tutor.avatar} 
                            alt={tutor.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-200 shrink-0" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{tutor.name}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isActive 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isActive ? '🟢 Aktif Yetkili' : '🔴 Pasif'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{tutor.title}</p>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                ✉️ {tutor.email || 'tanimsiz'}
                              </span>
                              <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                                🔑 Kod: {tutor.accessCode || 'MATH-101'}
                              </span>
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                                📐 {tutor.specialties?.join(' & ') || tutor.subjects?.join(' & ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleQuickLoginAsTutor(tutor)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                            title="Bu eğitmen olarak oturum aç"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            Giriş Yap
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(tutor)}
                            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                              isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Pasife Al' : 'Aktif Et'}
                          >
                            {isActive ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTutor(tutor.id, tutor.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            title="Eğitmeni Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Eğitmen Tanımlama & Güvenlik Portalı
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
