import React from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Video, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Star, 
  Crown, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  Play,
  Award
} from 'lucide-react';
import { Question, StudentProfile, Tutor } from '../types';

interface StudentHomeViewProps {
  questions: Question[];
  studentProfile: StudentProfile;
  tutors: Tutor[];
  onOpenAskQuestion: () => void;
  onOpenSubscribe: () => void;
  onSelectQuestion: (question: Question) => void;
  onNavigateToHistory: () => void;
  onNavigateToTutors: () => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  questions = [],
  studentProfile,
  tutors = [],
  onOpenAskQuestion,
  onOpenSubscribe,
  onSelectQuestion,
  onNavigateToHistory,
  onNavigateToTutors
}) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeTutors = Array.isArray(tutors) ? tutors : [];

  const solvedQuestions = safeQuestions.filter(q => q.status === 'solved');
  const inProgressQuestions = safeQuestions.filter(q => q.status === 'in_progress' || q.status === 'pending');

  return (
    <div className="space-y-8">
      
      {/* Hero Section: Photo Upload & Question Ask Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-indigo-700/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>matematikhocan.com • Haftalık 3 Ücretsiz Soru • YKS, LGS ve Okul Sınavları</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Yapamadığın Sorunun <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200">Fotoğrafını Çek</span>, Anında Uzmanından Çözüm Al!
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Takıldığın soruyu kameranla çek veya galeriden yükle. Türkiye'nin en iyi öğretmenleri sorunu <strong>1080p HD Videolu</strong> ya da <strong>yazılı & formüllü</strong> olarak adım adım özenle çözsün.
          </p>

          {/* Daily Limit Status & Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAskQuestion}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-500/25 transition transform active:scale-95 flex items-center gap-2.5"
            >
              <Camera className="w-5 h-5" />
              <span>Hemen Soru Sor</span>
            </button>

            {/* Free/Daily limit badge */}
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-indigo-100">
                <FileText className="w-4 h-4 text-indigo-300" />
                <span>
                  Haftalık Kalan: <strong>{studentProfile.weeklyStandardRemaining ?? studentProfile.dailyStandardRemaining ?? 3}/3 Soru</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active In-Progress Questions Banner (If any) */}
      {inProgressQuestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Şu An İncelenen & Çözülen Sorularınız ({inProgressQuestions.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inProgressQuestions.map(q => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q)}
                className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3.5 hover:bg-amber-50 transition cursor-pointer shadow-2xs"
              >
                <img
                  src={q.imageUrl}
                  alt={q.title}
                  className="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold">
                      {q.subject}
                    </span>
                    <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" /> Eğitmen Çözüyor
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate mt-1">{q.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {q.requestedSolutionType === 'video' ? '🎬 1080p HD Video Talebi' : '📝 Standart Çözüm'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Solved Solutions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Son Çözülen Sorularınız</h2>
            <p className="text-xs text-slate-500">Uzman eğitmenlerin hazırladığı çözümleri ve video kayıtlarını izleyin</p>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Tümünü Gör ({safeQuestions.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {solvedQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Henüz çözülmüş sorunuz bulunmuyor</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hemen ilk sorunuzun fotoğrafını yükleyin, alanında uzman öğretmenlerimiz adım adım çözsün.
            </p>
            <button
              onClick={onOpenAskQuestion}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition inline-flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              İlk Sorunu Sor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solvedQuestions.slice(0, 3).map(question => {
              const isVideo = question.requestedSolutionType === 'video';
              return (
                <div
                  key={question.id}
                  onClick={() => onSelectQuestion(question)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden group"
                >
                  <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                    <img
                      src={question.imageUrl}
                      alt={question.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[10px] font-extrabold shadow-xs">
                        {question.subject}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {isVideo ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                          <Video className="w-3 h-3" /> 1080p HD Video
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                          <FileText className="w-3 h-3" /> Standart
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-5 h-5 ml-0.5 text-indigo-600" />
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Çözüm Hazır
                      </span>
                      {question.rating && (
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{question.rating.score}.0</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition">
                        {question.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        Eğitmen: <strong>{question.tutorName}</strong> ({question.tutorTitle})
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">{question.gradeLevel}</span>
                      <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                        İncele & Puan Ver <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3-Step How It Works Section */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-lg font-black text-slate-900">matematikhocan.com Nasıl Çalışır?</h3>
          <p className="text-xs text-slate-500">3 Kolay Adımda Yapamadığınız Tüm Soruları Çözdürün</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-base">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Fotoğrafını Çek</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sorunun net fotoğrafını kameranla çek veya galeriden yükle. Çözüm türünü (Standart veya 1080p Video) seç.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-base">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Uzman Eğitmen Çözsün</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alanında uzman branş öğretmeni sorunu dijital tahtada adım adım çizerek ve videolu olarak anlatsın.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">İzle & Eğitmeni Puanla</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Video yer imleriyle istediğin adıma atla, formülleri kaydet ve eğitmenine 5 yıldız verip yorum yaz.
            </p>
          </div>
        </div>
      </div>

      {/* Online Tutors Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Aktif Uzman Eğitmenler</h3>
            <p className="text-xs text-slate-500">Sorularınızı anında çözmek için çevrimiçi olan öğretmenlerimiz</p>
          </div>
          <button
            onClick={onNavigateToTutors}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Tüm Eğitmenler <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {safeTutors.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-xs text-slate-500 text-xs">
            Henüz sisteme tanımlanmış öğretmen bulunmuyor. Yeni eğitmenler yönetici portalından eklenebilir.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeTutors.slice(0, 4).map(tutor => (
              <div
                key={tutor.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{tutor.name}</h4>
                    <p className="text-[11px] text-indigo-700 font-semibold truncate">{tutor.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{tutor.university}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {tutor.rating?.toFixed(2) || '5.00'}
                  </span>
                  <span className="text-indigo-600 text-[11px] font-bold">
                    Doğrulanmış Branş
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
