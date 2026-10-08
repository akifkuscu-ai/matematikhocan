import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  Video, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Clock, 
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionPlan, SubscriptionPlanId, StudentProfile } from '../types';
import { INITIAL_SUBSCRIPTION_PLANS } from '../data/mockData';

interface SubscriptionPlansProps {
  studentProfile: StudentProfile;
  onSubscribe: (planId: SubscriptionPlanId) => Promise<boolean>;
  onClose?: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  studentProfile,
  onSubscribe,
  onClose
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Checkout Form Mock State
  const [cardNumber, setCardNumber] = useState<string>('5421 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState<string>('Elif Yılmaz');
  const [expiry, setExpiry] = useState<string>('12/28');
  const [cvv, setCvv] = useState<string>('742');

  const plans = INITIAL_SUBSCRIPTION_PLANS;

  const handleOpenCheckout = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      const success = await onSubscribe(selectedPlan.id);
      if (success) {
        setIsCheckoutOpen(false);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" /> Soru Sorma Limitlerini Artır
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hedefine Ulaş, Yapamadığın Tek Bir Soru Bile Kalmasın!
          </h1>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Her hafta <strong>3 adet ücretsiz standart soru</strong> hakkınız bulunmaktadır. Haftalık, aylık veya 3 aylık avantajlı paketlerle soru limitlerinizi artırabilir ve uzmanlardan <strong>1080p HD Videolu Anlatımlar</strong> alabilirsiniz.
          </p>

          {/* Current Active Plan Status Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs flex items-center gap-2">
              <span className="text-indigo-200">Mevcut Paketiniz:</span>
              <strong className="text-white font-extrabold text-sm">{studentProfile.planName}</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs flex items-center gap-2">
              <span className="text-indigo-200">Kalan Haklar:</span>
              <strong className="text-amber-300 font-extrabold">
                {studentProfile.activePlan === 'free'
                  ? `${studentProfile.weeklyStandardRemaining ?? studentProfile.dailyStandardRemaining} / 3 Haftalık`
                  : `${studentProfile.dailyStandardRemaining} Standart`} / {studentProfile.dailyVideoRemaining} Video
              </strong>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map(plan => {
          const isCurrentActive = studentProfile.activePlan === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-5 flex flex-col justify-between transition-all duration-200 border-2 ${
                isPopular
                  ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-500/20'
                  : isCurrentActive
                  ? 'border-emerald-500 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                  isPopular ? 'bg-gradient-to-r from-indigo-600 to-rose-600' : 'bg-amber-500'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="space-y-1 mb-4">
                  <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      {plan.price === 0 ? 'Ücretsiz' : `₺${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-slate-500 font-semibold">/ {plan.durationLabel}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-slate-700">
                    <span className="flex items-center gap-1 text-indigo-700">
                      <FileText className="w-3 h-3" /> {plan.id === 'free' ? 'Haftalık' : 'Günlük'} <strong>{plan.id === 'free' ? '3 Soru' : `${plan.dailyStandardLimit} Soru`}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-rose-600">
                      <Video className="w-3 h-3" /> <strong>{plan.dailyVideoLimit} Video</strong>
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Paket Özellikleri
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aktif Paketiniz
                  </button>
                ) : plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold"
                  >
                    Standart Başlangıç
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5 transform active:scale-95 ${
                      isPopular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Hemen Satın Al
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Free Solution Policy Card */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Haftalık 3 Ücretsiz Soru Sorma Politikası</h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              matematikhocan.com'da her öğrenci her hafta <strong>3 adet standart sorusunu tamamen ücretsiz</strong> olarak alanında uzman öğretmenlere sorabilir. Her hafta Pazartesi 00:00'da ücretsiz haklar otomatik yenilenir. Sınavlara daha yoğun hazırlanan öğrenciler için ek haklar abonelik paketlerimiz üzerinden sağlanmaktadır.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-900">
            ✅ Gizli Ücret Yok
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-900">
            🔒 Güvenli Ödeme
          </span>
        </div>
      </div>

      {/* Simulated Fast Checkout Modal */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Paket Satın Alımı</h3>
                  <p className="text-[11px] text-indigo-200">{selectedPlan.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPayment} className="p-5 space-y-4">
              
              {/* Order Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{selectedPlan.name} ({selectedPlan.durationLabel})</span>
                  <span className="text-indigo-600 font-extrabold text-sm">₺{selectedPlan.price}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Günde {selectedPlan.dailyStandardLimit} soru & {selectedPlan.dailyVideoLimit} HD video çözüm hakkı
                </div>
              </div>

              {/* Credit Card Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kart Numarası
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      SKT
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-center focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-center focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Uçtan Uca Güvenli Simülasyonlu Ödeme</span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isProcessing ? 'Ödeme Alınıyor...' : `₺${selectedPlan.price} Öde & Paketi Başlat`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
