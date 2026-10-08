import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Video, 
  FileText, 
  Star, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Sparkles,
  ChevronRight,
  User,
  ArrowUpDown
} from 'lucide-react';
import { Question, Subject, QuestionStatus, SolutionType } from '../types';

interface QuestionHistoryProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  onOpenAskQuestion: () => void;
}

export const QuestionHistory: React.FC<QuestionHistoryProps> = ({
  questions = [],
  onSelectQuestion,
  onOpenAskQuestion
}) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | QuestionStatus>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SolutionType>('all');

  const subjectsList: Subject[] = [
    'Matematik', 'Geometri'
  ];

  const filteredQuestions = safeQuestions.filter(q => {
    // Search query match
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(qLower);
      const matchSubject = q.subject.toLowerCase().includes(qLower);
      const matchDesc = q.description?.toLowerCase().includes(qLower);
      if (!matchTitle && !matchSubject && !matchDesc) return false;
    }
    // Status filter
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    // Subject filter
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
    // Type filter
    if (typeFilter !== 'all' && q.requestedSolutionType !== typeFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Geçmiş Soru & Çözümlerim</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sorduğunuz tüm soruları, eğitmen video anlatımlarını ve aldığınız puanları buradan inceleyin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAskQuestion}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Yeni Soru Gönder
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        {/* Search & Status Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Soru başlığı, konu veya ders ara..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({questions.length})
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'solved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Çözüldü ({questions.filter(q => q.status === 'solved').length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'in_progress' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Çözülüyor ({questions.filter(q => q.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'pending' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Beklemede ({questions.filter(q => q.status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Subject and Solution Type Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                subjectFilter === 'all' 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              Tüm Dersler
            </button>
            {subjectsList.map(sub => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  subjectFilter === sub 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Solution Type Toggle */}
          <div className="flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter(typeFilter === 'video' ? 'all' : 'video')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 border ${
                typeFilter === 'video' 
                  ? 'bg-rose-50 text-rose-700 border-rose-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              HD Videolu
            </button>
            <button
              onClick={() => setTypeFilter(typeFilter === 'standard' ? 'all' : 'standard')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 border ${
                typeFilter === 'standard' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Standart
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Aradığınız kriterde soru bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Filtreleri sıfırlayabilir veya aklınıza takılan yeni bir sorunun fotoğrafını çekip sorabilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAskQuestion}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700 transition inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Hemen Soru Sor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map(question => {
            const isSolved = question.status === 'solved';
            const isInProgress = question.status === 'in_progress';
            const isVideo = question.requestedSolutionType === 'video';

            return (
              <div
                key={question.id}
                onClick={() => onSelectQuestion(question)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden group"
              >
                
                {/* Image Thumbnail & Top Badges */}
                <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                  <img
                    src={question.imageUrl}
                    alt={question.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Left Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold shadow-xs">
                      {question.subject}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                      {question.gradeLevel}
                    </span>
                  </div>

                  {/* Top Right Solution Type Badge */}
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

                  {/* Bottom Status Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    {isSolved ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Çözüldü
                      </span>
                    ) : isInProgress ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> Öğretmen Çözüyor
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                        <Clock className="w-3.5 h-3.5" /> Eğitmen Bekleniyor
                      </span>
                    )}

                    {question.rating && (
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-amber-400 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{question.rating.score}.0</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition">
                      {question.title}
                    </h3>
                    {question.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        "{question.description}"
                      </p>
                    )}
                  </div>

                  {/* Tutor info if available */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    {question.tutorName ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={question.tutorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                          alt={question.tutorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-700 text-[11px]">{question.tutorName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Eğitmen Atanıyor...</span>
                    )}

                    <span className="text-indigo-600 font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                      {isSolved ? 'Çözümü İncele' : 'Detaylar'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
