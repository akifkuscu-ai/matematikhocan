import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  BellRing, 
  CheckCircle, 
  Sparkles,
  RefreshCw,
  Settings2
} from 'lucide-react';
import { Question } from '../types';

interface PendingAlertBannerProps {
  pendingQuestions: Question[];
  thresholdMinutes: number;
  onSelectQuestion: (question: Question) => void;
  onTriggerUrgentReminder: () => void;
  isTriggering?: boolean;
  onOpenSettings?: () => void;
}

export const PendingAlertBanner: React.FC<PendingAlertBannerProps> = ({
  pendingQuestions = [],
  thresholdMinutes,
  onSelectQuestion,
  onTriggerUrgentReminder,
  isTriggering = false,
  onOpenSettings
}) => {
  // Filter questions waiting longer than threshold
  const safeList = Array.isArray(pendingQuestions) ? pendingQuestions : [];
  const now = Date.now();
  const overdueQuestions = safeList.filter(q => {
    const elapsedMinutes = Math.floor((now - new Date(q.createdAt).getTime()) / (60 * 1000));
    return elapsedMinutes >= thresholdMinutes;
  });

  if (overdueQuestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white rounded-2xl p-4 sm:p-5 shadow-xl shadow-rose-900/20 border border-rose-400/30 mb-6 animate-pulse">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Side Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/25 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                ACİL BEKLEYEN SORU UYARISI
              </span>
              <span className="text-xs bg-rose-900/40 text-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {thresholdMinutes}+ Dakikadır Yanıtsız
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              Havuzda {overdueQuestions.length} soru belirlenen süreyi aştı ve çözüm bekliyor!
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              Öğrenciler hızlı yanıt alabilmek için eğitmenlerimizin çözüme başlamasını bekliyor.
            </p>
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={onTriggerUrgentReminder}
            disabled={isTriggering}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md border border-white/20 disabled:opacity-50"
            title="Eğitmenlere anlık acil durum bildirimi gönder"
          >
            {isTriggering ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <BellRing className="w-3.5 h-3.5" />
            )}
            <span>{isTriggering ? 'Gönderiliyor...' : '🔔 Hatırlatma Bildirimi Gönder'}</span>
          </button>

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Uyarı Süresini Ayarla"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List of overdue question cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-white/20">
        {overdueQuestions.map(q => {
          const elapsedMinutes = Math.max(1, Math.floor((now - new Date(q.createdAt).getTime()) / (60 * 1000)));
          return (
            <div
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md p-3 rounded-xl border border-white/20 cursor-pointer transition-all flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-200 font-bold">
                  <span>{q.subject === 'Matematik' ? '📐' : '📏'} {q.subject}</span>
                  <span>•</span>
                  <span className="truncate">{q.gradeLevel}</span>
                </div>
                <div className="text-xs font-semibold text-white truncate mt-0.5">
                  {q.title}
                </div>
                <div className="text-[10px] text-rose-200 flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{elapsedMinutes} dakikadır bekliyor</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white text-rose-900 group-hover:text-rose-600 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
