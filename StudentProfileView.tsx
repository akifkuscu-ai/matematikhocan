import React from 'react';
import { 
  User, 
  Crown, 
  Award, 
  FileText, 
  Video, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Zap, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileViewProps {
  studentProfile: StudentProfile;
  totalQuestionsCount: number;
  solvedQuestionsCount: number;
  onOpenSubscribe: () => void;
  onResetLimitsDemo: () => void;
  onNavigateToHistory: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  studentProfile,
  totalQuestionsCount,
  solvedQuestionsCount,
  onOpenSubscribe,
  onResetLimitsDemo,
  onNavigateToHistory
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="relative">
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-indigo-100 shadow-md"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Crown className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{studentProfile.name}</h1>
              <p className="text-xs text-slate-500">{studentProfile.email} • {studentProfile.grade}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold self-center sm:self-auto">
              <span>Haftalık 3 Ücretsiz Soru Kotası</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            YKS ve okul sınavlarına hazırlıkta yapamadığı matematik ve geometri sorularını uzman eğitmenlerden çözen aktif öğrenci profili.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={onResetLimitsDemo}
              className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              title="Test amaçlı haftalık ücretsiz hakları yenile"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
              Haftalık Hakları Sıfırla (Demo)
            </button>
          </div>
        </div>
      </div>

      {/* Quota & Limits Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Standard Questions Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {studentProfile.activePlan === 'free' ? 'Haftalık Ücretsiz Hak' : 'Günlük Standart Hak'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">
              {studentProfile.activePlan === 'free'
                ? (studentProfile.weeklyStandardRemaining ?? studentProfile.dailyStandardRemaining)
                : studentProfile.dailyStandardRemaining}
            </span>
            <span className="text-xs text-slate-400 font-bold">
              / {studentProfile.activePlan === 'free' ? 3 : studentProfile.dailyStandardTotal} kalan
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {studentProfile.activePlan === 'free' ? 'Haftada 3 adet ücretsiz standart soru' : `${studentProfile.planName} aktif`}
          </p>
        </div>

        {/* HD Video Questions Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Günlük 1080p Video Hak
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">
              {studentProfile.dailyVideoRemaining}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {studentProfile.dailyVideoTotal} kalan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {studentProfile.dailyVideoTotal > 0 ? 'Öğretmen sesli ve videolu anlatım hakkı' : 'Video için paket yükseltin'}
          </p>
        </div>

        {/* Solved Stats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Toplam Çözülen Soru
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600">
              {solvedQuestionsCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {totalQuestionsCount} toplam</span>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
          >
            Geçmişi İncele <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Kazanılan Rozetler ve Başarılar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg">
              🎯
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Azimli Soru Avcısı</h4>
              <p className="text-[11px] text-slate-500">İlk 5 soruyu başarıyla çözdürdü</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
              🎬
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">HD Video Kaşifi</h4>
              <p className="text-[11px] text-slate-500">1080p videolu çözümleri izledi</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
              ⭐
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Eğitmen Dostu</h4>
              <p className="text-[11px] text-slate-500">Çözümlere düzenli puan verdi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Same-Server Single-User Security Lock Notice */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-900">Sunucu ve Çoklu Hesap Güvenlik Koruması</h4>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded-full">
                AKTİF KORUMA
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              matematikhocan.com güvenlik kuralı gereğince <strong>aynı sunucudan / IP adresinden farklı kullanıcılara izin verilmemektedir</strong>. Mükerrer hak kullanımını ve suistimalleri önlemek için bu sunucu yalnızca <strong>{studentProfile.name}</strong> ({studentProfile.email}) hesabına kilitlenmiştir.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold shadow-xs">
            🔒 Tek Kullanıcı / IP Kilidi
          </span>
        </div>
      </div>
    </div>
  );
};
