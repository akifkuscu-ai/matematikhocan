import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Video, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Crown, 
  Zap, 
  Image as ImageIcon,
  RotateCw,
  RefreshCw,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Subject, GradeLevel, SolutionType, StudentProfile } from '../types';
import { SAMPLE_QUESTIONS_FOR_TESTING } from '../data/mockData';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questionData: {
    title: string;
    description: string;
    subject: Subject;
    gradeLevel: GradeLevel;
    imageUrl: string;
    requestedSolutionType: SolutionType;
    aiAssistRequested: boolean;
  }) => Promise<boolean>;
  studentProfile: StudentProfile;
  onOpenSubscribe: () => void;
}

const SUBJECTS: { label: Subject; icon: string; color: string; desc: string }[] = [
  { label: 'Matematik', icon: '📐', color: 'from-blue-600 to-indigo-600', desc: 'Cebir, Fonksiyonlar, Türev, İntegral, Problemler, Trigonometri' },
  { label: 'Geometri', icon: '📏', color: 'from-purple-600 to-pink-600', desc: 'Üçgenler, Çember & Daire, Analitik, Katı Cisimler, Çokgenler' },
];

const MATH_TOPIC_SUGGESTIONS = {
  Matematik: [
    'Türev & Teğet Eğimleri',
    'İntegral ile Alan',
    'Trigonometri & Yarım Açı',
    'Fonksiyonlar & Polinomlar',
    'Logaritma & Diziler',
    'Problemler (Yaş/Hız/Yüzde)',
    'EBOB-EKOK & Çarpanlar',
    'Olasılık & Kombinasyon'
  ],
  Geometri: [
    'Çemberde Açı & Teğet',
    'Üçgende Benzerlik & Alan',
    'Analitik Düzlemde Doğru',
    'Katı Cisimler & Hacim',
    'Özel Dörtgenler (Eşkenar/Yamuk)',
    'Çemberde Uzunluk & Daire Alanı',
    'Trigonometrik Geometri',
    'Pisagor & Öklid Bağıntıları'
  ]
};

const GRADE_LEVELS: GradeLevel[] = [
  'TYT / AYT (YKS)',
  'LGS (8. Sınıf)',
  '12. Sınıf',
  '11. Sınıf',
  '10. Sınıf',
  '9. Sınıf',
  'KPSS / DGS / ALES'
];

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentProfile,
  onOpenSubscribe
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [subject, setSubject] = useState<Subject>('Matematik');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('TYT / AYT (YKS)');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [requestedSolutionType, setRequestedSolutionType] = useState<SolutionType>('standard');
  const [aiAssistRequested, setAiAssistRequested] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  if (!isOpen) return null;

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Görsel boyutu 10MB tan küçük olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        setErrorMsg('');
        if (cameraActive) stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Kameraya erişilemedi. Lütfen izin verdiğinizden emin olun veya dosya yükleyin.');
    }
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImageUrl(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Load Preset Sample Question for Quick Demo Testing
  const loadSampleQuestion = (sample: typeof SAMPLE_QUESTIONS_FOR_TESTING[0]) => {
    setTitle(sample.title);
    setSubject(sample.subject);
    setGradeLevel(sample.gradeLevel);
    setDescription(sample.description);
    setImageUrl(sample.imageUrl);
    setRequestedSolutionType(sample.requestedSolutionType);
    setErrorMsg('');
  };

  // Check limits
  const isVideoLimitReached = requestedSolutionType === 'video' && studentProfile.dailyVideoRemaining <= 0;
  const isStandardLimitReached = requestedSolutionType === 'standard' && studentProfile.dailyStandardRemaining <= 0;
  const hasLimitIssue = isVideoLimitReached || isStandardLimitReached;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setErrorMsg('Lütfen çözülmesini istediğiniz sorunun fotoğrafını çekin veya yükleyin.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Lütfen soru için kısa bir başlık veya konu adı girin.');
      return;
    }

    if (hasLimitIssue) {
      setErrorMsg(
        'Bu haftaki 3 adet ücretsiz soru sorma limitiniz doldu (3/3 kullanıldı). Haklarınız haftalık olarak yenilenmektedir.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const success = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        subject,
        gradeLevel,
        imageUrl,
        requestedSolutionType,
        aiAssistRequested
      });

      if (success) {
        stopCamera();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Soru gönderilirken bir sorun oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Yeni Soru Gönder</h2>
              <p className="text-xs text-slate-500">Fotoğrafını yükle, uzman eğitmenlerden adım adım çözüm al</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Demo Pre-load Bar */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Hızlı Test İçin Örnek Soru Seçin:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUESTIONS_FOR_TESTING.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleQuestion(sample)}
                  className="text-xs px-2.5 py-1 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 rounded-lg font-medium transition hover:shadow-xs"
                >
                  ⚡ {sample.subject} - {sample.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Photo Upload / Live Camera */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Soru Fotoğrafı <span className="text-rose-500">*</span>
            </label>

            {!imageUrl && !cameraActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/80 rounded-xl transition group text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center mb-2 transition">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Kamera ile Çek</span>
                  <span className="text-xs text-slate-500 mt-0.5">Anında sorunun net fotoğrafını çek</span>
                </button>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/50 rounded-xl transition group text-center cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center mb-2 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Galeriden Yükle</span>
                  <span className="text-xs text-slate-500 mt-0.5">JPG, PNG veya Ekran Görüntüsü</span>
                </div>
              </div>
            )}

            {/* Live Camera View */}
            {cameraActive && (
              <div className="relative bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800 flex flex-col items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[300px] object-cover"
                />
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-lg flex items-center gap-2 transform active:scale-95 transition text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Fotoğrafı Çek
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-white rounded-full text-xs font-semibold backdrop-blur-xs transition"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={imageUrl}
                  alt="Soru Görseli"
                  className="w-full max-h-[260px] object-contain mx-auto"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Değiştir
                  </button>
                </div>
                <div className="p-2 bg-slate-900/90 text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fotoğraf Yüklendi
                  </span>
                  <span className="text-slate-400">Eğitmen bu görsel üzerinde çözüm yapacaktır</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Subject & Grade Selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ders Branşı Seçin <span className="text-rose-500">*</span>
              </label>
              
              {/* Specialized 2-Card Subject Selector */}
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map(s => {
                  const isSelected = subject === s.label;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSubject(s.label)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{s.icon}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                            Seçildi
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{s.label}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                Popüler {subject} Konuları (Başlığa Hızlı Ekle):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MATH_TOPIC_SUGGESTIONS[subject].map((top, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(prev => prev ? `${prev} - ${top}` : top);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 font-medium transition"
                  >
                    + {top}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sınav / Sınıf Seviyesi
              </label>
              <select
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value as GradeLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {GRADE_LEVELS.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Question Title & Doubt Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Soru Başlığı / Konu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Örn: Türevde teğet denklemi ve maksimum nokta"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Anlamadığınız Nokta veya Notunuz (İsteğe Bağlı)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Örn: 2. basamaktaki formülün nereden geldiğini ve C şıkkının neden elendiğini açıklar mısınız?"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Step 4: Solution Type Preference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                İstediğiniz Çözüm Türü <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                {studentProfile.activePlan === 'free'
                  ? `Haftalık Kalan: ${studentProfile.weeklyStandardRemaining ?? studentProfile.dailyStandardRemaining}/3`
                  : `Standart Kalan: ${studentProfile.dailyStandardRemaining}`} | Video Kalan: {studentProfile.dailyVideoRemaining}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Standard Solution Option */}
              <div
                onClick={() => setRequestedSolutionType('standard')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  requestedSolutionType === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Standart Çözüm</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">
                        {studentProfile.activePlan === 'free' ? 'Haftalık 3 Soru Ücretsiz' : 'Standart Çözüm'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Adım adım formüller, detaylı yazılı açıklama ve soru üzeri çizim.
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Adım Adım Formüllü Çözüm
                  </span>
                  <span className={`font-bold ${studentProfile.dailyStandardRemaining > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {studentProfile.dailyStandardRemaining > 0 ? `${studentProfile.dailyStandardRemaining} ${studentProfile.activePlan === 'free' ? 'haftalık hak hazır' : 'hak hazır'}` : 'Hak bitti'}
                  </span>
                </div>
              </div>

              {/* HD Video Solution Option */}
              <div
                onClick={() => setRequestedSolutionType('video')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  requestedSolutionType === 'video'
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">1080p HD Videolu Anlatım</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white font-extrabold rounded flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> PRO
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Öğretmenin sesli ve görüntülü anlatımı, video hızlandırma & adım yer imleri.
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Öncelikli Eğitmen
                  </span>
                  <span className={`font-bold ${studentProfile.dailyVideoRemaining > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {studentProfile.dailyVideoRemaining > 0 ? `${studentProfile.dailyVideoRemaining} video hakkı` : 'Paket Gerekir'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Quick Insight Toggle (Gemini AI) */}
          <div className="p-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                  Yapay Zeka Hızlı Ön İnceleme (Gemini AI)
                  <span className="px-1.5 py-0.2 bg-violet-200 text-violet-800 text-[10px] rounded font-bold">Anında</span>
                </span>
                <p className="text-[11px] text-violet-700">
                  Öğretmeniniz çözene kadar yapay zekadan anında kural hatırlatması ve formül ipuçları alın.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiAssistRequested}
                onChange={e => setAiAssistRequested(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>

          {/* Limit Warning & Upgrade CTA */}
          {hasLimitIssue && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">
                    {requestedSolutionType === 'video' 
                      ? 'Videolu Çözüm Hakkınız Doldu' 
                      : (studentProfile.activePlan === 'free' ? 'Haftalık 3 Ücretsiz Soru Limitiniz Doldu' : 'Soru Limitiniz Doldu')}
                  </span>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Haftalık veya Aylık paket alarak soru limitinizi artırabilir ve HD video çözümlere erişebilirsiniz.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSubscribe}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg shadow-xs shrink-0 flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                Paketleri Gör
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasLimitIssue}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Eğitmene İletiliyor...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Soruyu Gönder & Çözüm İste
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
