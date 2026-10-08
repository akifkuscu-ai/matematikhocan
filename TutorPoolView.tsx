import React, { useState } from 'react';
import { 
  Layers, 
  Video, 
  FileText, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Filter, 
  Award, 
  Star, 
  TrendingUp, 
  User, 
  Check, 
  ChevronRight,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Question, Tutor, Subject, SolutionType } from '../types';
import { INITIAL_TUTORS } from '../data/mockData';

interface TutorPoolViewProps {
  questions: Question[];
  tutors: Tutor[];
  activeSubTab: 'tutor-pool' | 'tutor-solved' | 'tutor-reviews';
  onSubTabChange: (tab: string) => void;
  onClaimAndSolve: (question: Question, tutor: Tutor) => void;
  onViewSolution: (question: Question) => void;
}

export const TutorPoolView: React.FC<TutorPoolViewProps> = ({
  questions = [],
  tutors = [],
  activeSubTab,
  onSubTabChange,
  onClaimAndSolve,
  onViewSolution
}) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeTutors = Array.isArray(tutors) ? tutors : (INITIAL_TUTORS || []);

  const [selectedTutorId, setSelectedTutorId] = useState<string>(safeTutors[0]?.id || 'tutor-1');
  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SolutionType>('all');

  const currentTutor = safeTutors.find(t => t.id === selectedTutorId) || safeTutors[0] || INITIAL_TUTORS[0];

  // Pool questions (pending or in progress)
  const poolQuestions = safeQuestions.filter(q => {
    if (q.status === 'solved') return false;
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
    if (typeFilter !== 'all' && q.requestedSolutionType !== typeFilter) return false;
    return true;
  });

  // Questions solved by this tutor
  const solvedQuestions = safeQuestions.filter(q => q.status === 'solved' && q.tutorId === currentTutor?.id);

  // Reviews from questions
  const reviews = safeQuestions
    .filter(q => currentTutor && q.tutorId === currentTutor.id && q.rating)
    .map(q => ({
      questionTitle: q.title,
      studentName: q.studentName,
      rating: q.rating!,
      date: q.rating?.createdAt || q.createdAt
    }));

  return (
    <div className="space-y-6">
      
      {/* Top Tutor Identity & Statistics Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          {/* Tutor Info */}
          <div className="flex items-center gap-4">
            <img
              src={currentTutor.avatar}
              alt={currentTutor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{currentTutor.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Aktif Eğitmen
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">{currentTutor.title} • {currentTutor.university}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {(currentTutor.subjects || currentTutor.specialties || []).map(sub => (
                  <span key={sub} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 font-semibold rounded-md">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tutor Stats Metrics */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-around bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
            <div className="px-3">
              <span className="text-[11px] text-slate-400 block font-medium">Toplam Çözüm</span>
              <strong className="text-lg font-black text-white">{currentTutor.solvedQuestionsCount + solvedQuestions.length}</strong>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div className="px-3">
              <span className="text-[11px] text-slate-400 block font-medium">Ortalama Puan</span>
              <strong className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                ⭐ {currentTutor.rating.toFixed(2)}
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div className="px-3">
              <span className="text-[11px] text-slate-400 block font-medium">Yanıt Hızı</span>
              <strong className="text-lg font-black text-emerald-400">
                {currentTutor.averageResponseTimeMinutes || currentTutor.averageResponseMinutes || 4} dk
              </strong>
            </div>
          </div>
        </div>

        {/* Switch demo tutor dropdown */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Eğitmen Görünümü Değiştir:</span>
            <select
              value={selectedTutorId}
              onChange={e => setSelectedTutorId(e.target.value)}
              className="bg-slate-800 text-white font-semibold px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-hidden"
            >
              {safeTutors.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.title})
                </option>
              ))}
            </select>
          </div>
          <span className="hidden sm:inline text-indigo-300">
            🎬 1080p HD Video & Whiteboard Düzenleme Araçları Aktif
          </span>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSubTabChange('tutor-pool')}
            className={`pb-3 px-4 text-xs sm:text-sm font-extrabold transition border-b-2 flex items-center gap-2 ${
              activeSubTab === 'tutor-pool'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Gelen Sorular Havuzu ({poolQuestions.length})
          </button>
          <button
            onClick={() => onSubTabChange('tutor-solved')}
            className={`pb-3 px-4 text-xs sm:text-sm font-extrabold transition border-b-2 flex items-center gap-2 ${
              activeSubTab === 'tutor-solved'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Çözdüğüm Sorular ({solvedQuestions.length})
          </button>
          <button
            onClick={() => onSubTabChange('tutor-reviews')}
            className={`pb-3 px-4 text-xs sm:text-sm font-extrabold transition border-b-2 flex items-center gap-2 ${
              activeSubTab === 'tutor-reviews'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            Öğrenci Puanları & Yorumları ({reviews.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INCOMING QUESTION POOL */}
      {activeSubTab === 'tutor-pool' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Ders Filtresi:</span>
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value as any)}
                className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="all">Tüm Dersler (Matematik & Geometri)</option>
                <option value="Matematik">📐 Matematik</option>
                <option value="Geometri">📏 Geometri</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setTypeFilter(typeFilter === 'video' ? 'all' : 'video')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                  typeFilter === 'video' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-500" /> Sadece HD Video Talepleri
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'standard' ? 'all' : 'standard')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                  typeFilter === 'standard' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Sadece Standart Çözümler
              </button>
            </div>
          </div>

          {/* Question Pool Grid */}
          {poolQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Havuzda bekleyen soru kalmadı</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Öğrenciler yeni soru gönderdiğinde anında burada görüntülenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {poolQuestions.map(q => {
                const isVideo = q.requestedSolutionType === 'video';
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                        <img
                          src={q.imageUrl}
                          alt={q.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[10px] font-extrabold">
                            {q.subject}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
                            {q.gradeLevel}
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

                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                          <span className="text-[11px] text-slate-300 font-medium">Öğrenci: <strong>{q.studentName}</strong></span>
                          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold">Yeni Talep</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                        {q.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 italic">
                            "{q.description}"
                          </p>
                        )}

                        {/* AI Quick Topic Tag */}
                        {q.aiAnalysis && (
                          <div className="p-2 bg-violet-50 rounded-lg text-[11px] text-violet-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                            <span className="font-semibold">Konu: {q.aiAnalysis.detectedTopic}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Solve Action Button */}
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => onClaimAndSolve(q, currentTutor)}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 transform active:scale-95"
                      >
                        <Zap className="w-4 h-4" />
                        Soruyu Üstlen & Çözüm Stüdyosunu Aç
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SOLVED QUESTIONS HISTORY */}
      {activeSubTab === 'tutor-solved' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solvedQuestions.map(q => (
              <div
                key={q.id}
                onClick={() => onViewSolution(q)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-4 transition cursor-pointer flex flex-col justify-between shadow-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                      {q.subject}
                    </span>
                    <span className="text-slate-400 text-[11px]">{q.gradeLevel}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Öğrenci: {q.studentName}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {q.rating ? (
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{q.rating.score}.0 Puan Alındı</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Puan bekleniyor...</span>
                  )}
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    İncele <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: REVIEWS & RATINGS */}
      {activeSubTab === 'tutor-reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Henüz değerlendirme bulunmuyor</h3>
              <p className="text-xs text-slate-500">Soruları çözdükçe öğrencilerin verdiği puanlar ve teşekkür yorumları burada listelenir.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{rev.studentName}</h4>
                      <p className="text-[11px] text-slate-400">Soru: {rev.questionTitle}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating.score)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.rating.comment && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      "{rev.rating.comment}"
                    </p>
                  )}

                  {rev.rating.tags && rev.rating.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rev.rating.tags.map((t, ti) => (
                        <span key={ti} className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
