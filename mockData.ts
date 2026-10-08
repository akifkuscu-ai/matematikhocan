import { 
  Question, 
  Tutor, 
  SubscriptionPlan, 
  StudentProfile, 
  AppNotification,
  OnlineCourse
} from '../types';

// Fiyat paketleri kullanıcı isteği üzerine tamamen kaldırılmıştır.
export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-101',
  name: 'Elif Yılmaz',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'elif.yilmaz@ogrenci.edu.tr',
  activePlan: 'free',
  planName: 'Ücretsiz Standart',
  dailyStandardRemaining: 3,
  dailyStandardTotal: 3,
  dailyVideoRemaining: 0,
  dailyVideoTotal: 0,
  weeklyStandardRemaining: 3,
  weeklyStandardTotal: 3,
  weeklyResetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  totalQuestionsAsked: 0,
  totalSolvedQuestions: 0,
  favoriteSubjects: ['Matematik', 'Geometri'],
  targetExam: 'YKS 2026 (Sayısal Hedef 5.000)'
};

export const DEMO_STUDENTS = [
  {
    id: 'std-101',
    name: 'Elif Yılmaz',
    email: 'elif.yilmaz@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: '12. Sınıf (YKS Sayısal)',
    targetExam: 'YKS 2026 (Sayısal Hedef 5.000)'
  },
  {
    id: 'std-102',
    name: 'Ahmet Can',
    email: 'ahmet.can@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    grade: '8. Sınıf (LGS Hazırlık)',
    targetExam: 'LGS 2026 Fen Lisesi'
  },
  {
    id: 'std-103',
    name: 'Sena Aydın',
    email: 'sena.aydin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    grade: '10. Sınıf',
    targetExam: 'Okul Yazılıları & TYT Temel'
  }
];

// Sitede ekli olan öğretmenler kullanıcı talebiyle temizlenmiştir.
// Yeni öğretmenler yönetici panelinden ("Eğitmen Tanımla") eklenebilir.
export const INITIAL_TUTORS: Tutor[] = [];

export const DEFAULT_PENDING_ALERT_SETTINGS: {
  thresholdMinutes: number;
  autoReminderEnabled: boolean;
  soundAlertEnabled: boolean;
} = {
  thresholdMinutes: 5,
  autoReminderEnabled: true,
  soundAlertEnabled: true
};

// Sitede ekli olan tüm sorular kullanıcı talebiyle temizlenmiştir.
export const INITIAL_QUESTIONS: Question[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

// Online Dersler: Tek tek veya toplu satın alınabilir, manuel ders fiyatı belirlenebilir, ders pdf ve ödev pdf eklenir
export const INITIAL_ONLINE_COURSES: OnlineCourse[] = [
  {
    id: 'crs-1',
    title: 'AYT Matematik: Türev & Geometrik Yorumu Kapsamlı Kampı',
    subject: 'Matematik',
    gradeLevel: 'TYT / AYT (YKS)',
    description: 'Türevin tanımı, teğet eğimi, artan-azalan fonksiyonlar, yerel ekstremum noktaları ve maksimum-minimum problemleri ÖSYM soru kalıplarıyla sıfırdan zirveye anlatılıyor.',
    instructorName: 'Matematik Zümre Başkanı',
    instructorTitle: 'Kıdemli YKS Matematik Eğitmeni',
    price: 85, // Manuel girilmiş ders fiyatı ₺
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationMinutes: 75,
    lessonPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    lessonPdfTitle: 'Türev_Konu_Anlatimi_ve_Formul_Kitapcigi.pdf',
    homeworkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    homeworkPdfTitle: 'Turev_Pekistirme_Odev_Testi_40_Soru.pdf',
    createdAt: '2026-08-01T10:00:00Z',
    purchased: false
  },
  {
    id: 'crs-2',
    title: 'Geometri: Çember & Dairede Açılar ve Alan Formülleri',
    subject: 'Geometri',
    gradeLevel: 'TYT / AYT (YKS)',
    description: 'Merkez açı, çevre açı, teğet-kiriş bağıntıları ve dairede alan hesaplama teknikleri dijital tahta üzerinde şekil çizimleriyle adım adım aktarılıyor.',
    instructorName: 'Geometri Bölüm Sorumlusu',
    instructorTitle: 'ODTÜ Matematik Eğitimi',
    price: 70, // Manuel girilmiş ders fiyatı ₺
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationMinutes: 60,
    lessonPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    lessonPdfTitle: 'Cember_ve_Daire_Ders_Notlari.pdf',
    homeworkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    homeworkPdfTitle: 'Cemberde_Acilar_Odev_Testi.pdf',
    createdAt: '2026-08-02T11:00:00Z',
    purchased: false
  },
  {
    id: 'crs-3',
    title: 'TYT Matematik: Yeni Nesil Problemler & Pratik Çözüm Taktikleri',
    subject: 'Matematik',
    gradeLevel: 'TYT / AYT (YKS)',
    description: 'Denklem kurma, kesir, yaş, hareket ve grafik problemleri. Uzun metinli paragraf problemlerini hızla çözme ve denklem basitleştirme yöntemleri.',
    instructorName: 'YKS Derece Koçu',
    instructorTitle: 'İTÜ Matematik Mühendisliği',
    price: 95, // Manuel girilmiş ders fiyatı ₺
    thumbnailUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationMinutes: 90,
    lessonPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    lessonPdfTitle: 'Yeni_Nesil_Problemler_Strateji_Notlari.pdf',
    homeworkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    homeworkPdfTitle: 'TYT_Problemler_Gelisim_Odevi.pdf',
    createdAt: '2026-08-03T12:00:00Z',
    purchased: false
  },
  {
    id: 'crs-4',
    title: 'Analitik Geometri: Doğrunun Analitiği & Dönüşümler',
    subject: 'Geometri',
    gradeLevel: '11. Sınıf',
    description: 'Eğim hesabı, iki doğru arasındaki açı, noktanın doğruya uzaklığı ve öteleme-dönme dönüşümleri ayrıntılı grafikler ve analitik çizimlerle sunuluyor.',
    instructorName: 'Kıdemli Geometri Eğitmeni',
    instructorTitle: 'Boğaziçi Matematik',
    price: 65, // Manuel girilmiş ders fiyatı ₺
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    durationMinutes: 50,
    lessonPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    lessonPdfTitle: 'Dogrunun_Analitigi_Ders_PDF.pdf',
    homeworkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    homeworkPdfTitle: 'Analitik_Geometri_Haftalik_Odev.pdf',
    createdAt: '2026-08-04T14:00:00Z',
    purchased: false
  }
];

export const SAMPLE_QUESTIONS_FOR_TESTING = [
  {
    title: 'Türevde Maksimum & Minimum Problemleri (AYT Matematik)',
    subject: 'Matematik' as const,
    gradeLevel: 'TYT / AYT (YKS)' as const,
    description: 'Yarıçapı 6 cm olan bir kürenin içine yerleştirilebilecek en büyük hacimli silindirin yüksekliği kaç cm dir?',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video' as const
  }
];
