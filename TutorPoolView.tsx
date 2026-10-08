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
  RefreshCw,
  Users,
  UserPlus
} from 'lucide-react';
import { Question, Tutor, Subject, SolutionType } from '../types';

interface TutorPoolViewProps {
  questions: Question[];
  tutors: Tutor[];
  activeSubTab: 'tutor-pool' | 'tutor-solved' | 'tutor-reviews';
  onSubTabChange: (tab: string) => void;
  onClaimAndSolve: (question: Question, tutor: Tutor) => void;
  onViewSolution: (question: Question) => void;
  onOpenManageTutors?: () => void;
}

export const TutorPoolView: React.FC<TutorPoolViewProps> = ({
  questions = [],
  tutors = [],
  activeSubTab,
  onSubTabChange,
  onClaimAndSolve,
  onViewSolution,
  onOpenManageTutors
}) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeTutors = Array.isArray(tutors) ? tutors : [];

  const [selectedTutorId, setSelectedTutorId] = useState<string>(safeTutors[0]?.id || '');
  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SolutionType>('all');

  const currentTutor = safeTutors.find(t => t.id === selectedTutorId) || safeTutors[0];

  // Pool questions (pending or in progress)
  const poolQuestions = safeQuestions.filter(q => {
    if (q.status === 'solved') return false;
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
    if (typeFilter !== 'all' && q.requestedSolutionType !== typeFilter) return false;
    return true;
  });

  // Questions solved by this tutor
  const solvedQuestions = safeQuestions.filter(q => q.status === 'solved' && currentTutor && q.tutorId === currentTutor.id);

  // Reviews from questions
  const reviews = safeQuestions
    .filter(q => currentTutor && q.tutorId === currentTutor.id && q.rating)
    .map(q => ({
      questionTitle: q.title,
      studentName: q.studentName,
      rating: q.rating!,
      date: q.rating?.createdAt || q.createdAt
    }));

  // IF NO TUTORS ARE REGISTERED YET
  if (!currentTutor || safeTutors.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-200">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-slate-900">Sistemde Yetkili Eğitmen Bulunmuyor</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            Sitede önceden ekli olan öğretmenler ve sorular temizlenmiştir. Eğitmen havuzunu kullanmak ve soruları çözmek için yönetici panelinden yeni öğretmen tanımlayabilirsiniz.
          </p>
        </div>
        {onOpenManageTutors && (
          <button
            type="button"
            onClick={onOpenManageTutors}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/25 transition inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Öğretmen Tanımla</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Tutor Identity & Statistics Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          {/* Tutor Info */}
          <div className="flex items-center gap-4">
            <img
              src={currentTutor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentTutor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{currentTutor.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Aktif Yetkili
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
              <strong className="text-lg font-black text-white">{(currentTutor.solvedQuestionsCount || 0) + solvedQuestions.length}</strong>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div className="px-3">
              <span className="text-[11px] text-slate-400 block font-medium">Ortalama Puan</span>
              <strong className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                ⭐ {currentTutor.rating?.toFixed(2) || '5.00'}
              </strong>
            </div>
          </div>
        </div>

        {/* Switch demo tutor dropdown if multiple */}
        {safeTutors.length > 1 && (
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
          </div>
        )}
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSubTabChange('tutor-pool')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'tutor-pool'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Soru Havuzu ({poolQuestions.length})</span>
          </button>

          <button
            onClick={() => onSubTabChange('tutor-solved')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'tutor-solved'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Çözdüklerim ({solvedQuestions.length})</span>
          </button>

          <button
            onClick={() => onSubTabChange('tutor-reviews')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'tutor-reviews'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Puanlar & Yorumlar ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: QUESTION POOL */}
      {activeSubTab === 'tutor-pool' && (
        <div className="space-y-4">
          {poolQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Havuzda Bekleyen Soru Yok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Öğrenciler yeni soru sorduğunda bu havuzda listelenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {poolQuestions.map(q => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    <div className="relative aspect-16/10 bg-slate-950 rounded-2xl overflow-hidden">
                      <img
                        src={q.imageUrl}
                        alt={q.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md bg-white text-slate-900 text-[10px] font-black shadow-xs">
                          {q.subject}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        {q.requestedSolutionType === 'video' ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                            <Video className="w-3 h-3" /> Video Çözüm
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                            <FileText className="w-3 h-3" /> Standart
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{q.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.description || 'Açıklama belirtilmedi.'}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">Öğrenci: {q.studentName} ({q.gradeLevel})</span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => onClaimAndSolve(q, currentTutor)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Soruyu Üstlen & Çöz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SOLVED */}
      {activeSubTab === 'tutor-solved' && (
        <div className="space-y-4">
          {solvedQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs text-xs text-slate-500">
              Henüz çözülmüş sorunuz bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {solvedQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onViewSolution(q)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-4 transition cursor-pointer flex flex-col justify-between shadow-xs space-y-3"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {q.subject}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{q.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Öğrenci: {q.studentName}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                      Çözümü Gör <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: REVIEWS */}
      {activeSubTab === 'tutor-reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Henüz değerlendirme bulunmuyor</h3>
              <p className="text-xs text-slate-500">Soruları çözdükçe öğrencilerin puanları burada listelenir.</p>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
