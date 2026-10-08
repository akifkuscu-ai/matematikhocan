import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Award, 
  CheckCircle2, 
  Clock, 
  Video, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  UserPlus, 
  Users 
} from 'lucide-react';
import { Tutor, Subject } from '../types';

interface TutorsListProps {
  tutors: Tutor[];
  onSelectTutorToAsk?: (tutor: Tutor) => void;
  onOpenManageTutors?: () => void;
}

export const TutorsList: React.FC<TutorsListProps> = ({ 
  tutors = [], 
  onSelectTutorToAsk,
  onOpenManageTutors 
}) => {
  const safeTutors = Array.isArray(tutors) ? tutors : [];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredTutors = safeTutors.filter(tutor => {
    const tutorSubs = tutor.subjects || tutor.specialties || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tutor.name.toLowerCase().includes(q);
      const matchTitle = tutor.title.toLowerCase().includes(q);
      const matchUniv = tutor.university.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchUniv) return false;
    }
    if (selectedSubject !== 'all' && !tutorSubs.includes(selectedSubject as Subject)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Uzman Matematik & Geometri Öğretmenlerimiz</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sisteme yetkilendirilen matematik ve geometri branş öğretmenlerimiz sorularınızı çözmek için hazır.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenManageTutors && (
            <button
              onClick={onOpenManageTutors}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yeni Öğretmen Tanımla</span>
            </button>
          )}
          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Doğrulanmış Eğitmen Kadrosu
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Eğitmen adı, branş veya üniversite ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
        >
          <option value="all">Tüm Branşlar (Matematik & Geometri)</option>
          <option value="Matematik">📐 Sadece Matematik</option>
          <option value="Geometri">📏 Sadece Geometri</option>
        </select>
      </div>

      {/* Empty State when no tutors are added */}
      {filteredTutors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">Henüz Sisteme Kayıtlı Öğretmen Bulunmuyor</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mevcut öğretmen listesi temizlenmiştir. Yönetici portalından yeni branş öğretmenleri tanımlayabilir ve sisteme yetkilendirebilirsiniz.
            </p>
          </div>
          {onOpenManageTutors && (
            <button
              type="button"
              onClick={onOpenManageTutors}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sisteme İlk Öğretmeni Ekle</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTutors.map(tutor => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md p-5 transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Tutor Avatar & Main Info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" title="Şu an çevrimiçi" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{tutor.name}</h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    </div>
                    <p className="text-xs text-indigo-700 font-semibold truncate">{tutor.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{tutor.university}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                  {tutor.bio}
                </p>

                {/* Subjects Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(tutor.subjects || tutor.specialties || []).map(sub => (
                    <span
                      key={sub}
                      className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics & Badges Footer */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {tutor.rating?.toFixed(2) || '5.00'} / 5.0
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {tutor.solvedQuestionsCount || 0} Çözüm
                  </span>
                </div>

                {tutor.badges && tutor.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tutor.badges.map((b, bi) => (
                      <span key={bi} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        🏅 {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
