import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Clock, 
  Video, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Star, 
  Zap,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';

interface WebsiteInfoViewProps {
  onOpenAskQuestion: () => void;
  onOpenSubscribe: () => void;
  onNavigateToTutors: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const WebsiteInfoView: React.FC<WebsiteInfoViewProps> = ({
  onOpenAskQuestion,
  onOpenSubscribe,
  onNavigateToTutors,
  onShowToast
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Soru / Görüş');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      q: 'matematikhocan.com nedir ve nasıl çalışır?',
      a: 'matematikhocan.com; ilkokul, ortaokul (LGS), lise ve üniversiteye hazırlık (YKS TYT-AYT, KPSS, DGS) öğrencilerinin çözemediği matematik ve geometri sorularını uzman branş öğretmenlerine gönderip formüllü yazılı veya HD videolu çözüm alabildiği bağımsız bir web eğitim portalıdır.'
    },
    {
      q: 'Haftalık 3 soru gerçekten tamamen ücretsiz mi?',
      a: 'Evet! matematikhocan.com olarak her öğrencinin eğitimde fırsat eşitliğine erişebilmesi adına, her kayıtlı öğrenciye haftalık 3 adet standart soru hakkı tamamen ücretsiz olarak sunulur. Haklar her hafta başında otomatik olarak yenilenir.'
    },
    {
      q: 'Aynı sunucudan veya IP adresinden birden fazla kullanıcı giriş yapabilir mi?',
      a: 'Hayır. Adil kullanım ve güvenlik politikamız gereği, aynı sunucu veya IP adresinden farklı kullanıcıların oturum açmasına veya soru sormasına izin verilmemektedir. Sistem, mükerrer hesap ve suistimalleri önlemek için her sunucuyu tek bir kullanıcıya tahsis eder.'
    },
    {
      q: 'Soruları kimler çözüyor, öğretmen kadronuz nasıl belirleniyor?',
      a: 'Tüm sorular; Boğaziçi, ODTÜ, İTÜ, Hacettepe gibi seçkin üniversitelerden mezun, MEB ve ÖSYM yeni nesil sınav soru kalıplarına hakim, en az 5 yıl tecrübeli ve deneme çözümlerinden %95+ başarı skoru almış yetkili matematik & geometri öğretmenlerimiz tarafından çözülmektedir.'
    },
    {
      q: 'HD Videolu Çözüm nedir ve bana ne kazandırır?',
      a: 'Videolu çözüm seçtiğinizde öğretmeniniz sorunuzu dijital çizim tahtasında sesli ve grafikli olarak adım adım anlatır. Önemli formülleri, püf noktaları ve alternatif pratik yolları video üzerinde işaretler. Çözümü istediğiniz zaman durdurup baştan izleyebilirsiniz.'
    },
    {
      q: 'Çözümü anlamazsam ne yapabilirim?',
      a: 'Çözüm ekranında çözümü yapan öğretmene doğrudan değerlendirme puanı (1-5 yıldız) verebilir, sistem içi soru-cevap kanalından aklınıza takılan ara adımlarla ilgili ek açıklamalar talep edebilirsiniz.'
    },
    {
      q: 'matematikhocan.com mobil cihazlarda ve telefonlarda çalışır mı?',
      a: 'Evet! Sitemiz tüm telefon, tablet ve bilgisayarlarla %100 uyumludur. Ayrıca sitemiz üzerinden tek tıkla Android uygulaması olarak telefonunuza kurabilir (PWA/Play Store) veya mobil web tarayıcınızdan doğrudan kameranızı açıp soru yükleyebilirsiniz.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onShowToast('Lütfen tüm formu eksiksiz doldurunuz.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(`Teşekkürler Sayın ${contactName}, mesajınız matematikhocan.com destek ekibine iletildi! En geç 2 saat içinde yanıtlanacaktır.`, 'success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 800);
  };

  return (
    <div className="space-y-12">
      
      {/* Hero Banner for Website */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-200">
            <Globe className="w-3.5 h-3.5 text-indigo-300" />
            <span>www.matematikhocan.com • Resmi Web Portalı</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Matematiği Anlamak Artık Çok Kolay: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200">matematikhocan.com</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Türkiye'nin dört bir yanındaki öğrenciler için geliştirilmiş bağımsız matematik ve geometri çözüm platformu. 
            YKS (TYT-AYT), LGS ve okul derslerinde takıldığın her soruyu alanında uzman öğretmenlere sor, çözümü eksiksiz kavra.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAskQuestion}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-white text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Hemen Soru Çözdür</span>
            </button>
            <button
              onClick={onOpenSubscribe}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-white text-sm transition flex items-center gap-2"
            >
              <span>Abonelik Paketleri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Value Propositions Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Neden matematikhocan.com?</h2>
          <p className="text-xs sm:text-sm text-slate-500">Öğrencilerin en çok tercih ettiği matematik çözüm platformunun avantajları</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Detaylı & Titiz Çözüm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sorularınız branş öğretmenlerimiz tarafından formülleri, geometrik çizimleri ve püf noktalarıyla özenle çözülür.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">1080p HD Video Çözüm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sadece şıkkı değil; mantığı, formül ispatlarını ve püf noktalarını dijital tahtada sesli anlatımla izleyin.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Seçkin Öğretmen Kadrosu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MEB ve ÖSYM soru kalıplarını çok iyi bilen, üniversite dereceli, tecrübeli ve onaylı öğretmenler.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Her Gün 1 Soru Ücretsiz</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tüm kayıtlı öğrencilerimiz her gün 1 standart soruyu sıfır ücretle çözdürebilir. Haklar her gece sıfırlanır.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-amber-300">120.000+</div>
            <div className="text-xs text-indigo-200">Çözülen Soru Sayısı</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white">4.9 / 5.0</div>
            <div className="text-xs text-indigo-200">Öğrenci Memnuniyeti</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-emerald-300">8.4 Dk.</div>
            <div className="text-xs text-indigo-200">Ortalama Çözüm Süresi</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-rose-300">%100</div>
            <div className="text-xs text-indigo-200">MEB & ÖSYM Uyumu</div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Merak Edilenler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Sıkça Sorulan Sorular</h2>
          <p className="text-xs text-slate-500">matematikhocan.com hakkında aklınıza takılabilecek tüm detaylar</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact & Support Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>İletişim & Destek</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Öğrencilerimiz, velilerimiz ve eğitmen adaylarımız için haftanın 7 günü aktifiz. Sorularınız, önerileriniz veya kurumsal iş birlikleri için bize yazabilirsiniz.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">E-Posta Desteği</div>
                  <div className="text-slate-500 font-mono">destek@matematikhocan.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">WhatsApp Danışma Hattı</div>
                  <div className="text-slate-500 font-mono">+90 850 305 62 81 (09:00 - 23:00)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Güvenlik & Gizlilik</div>
                  <div className="text-slate-500">256-Bit SSL Sertifikalı ve KVKK Uyumlu Altyapı</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Hızlı İletişim Formu</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Örn: Eren Yıldırım"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="Örn: eren@gmail.com"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Konu</label>
              <select
                value={contactSubject}
                onChange={e => setContactSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Soru / Görüş">Soru & Genel Görüş</option>
                <option value="Abonelik ve Ödeme">Abonelik ve Ödeme Desteği</option>
                <option value="Eğitmen Başvurusu">Öğretmen Kadrosuna Katılma</option>
                <option value="Teknik Destek">Teknik Destek / Hata Bildirimi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mesajınız</label>
              <textarea
                rows={3}
                required
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="İletmek istediğiniz soru, öneri veya talebinizi buraya yazabilirsiniz..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Gönderiliyor...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Mesajı Gönder</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
