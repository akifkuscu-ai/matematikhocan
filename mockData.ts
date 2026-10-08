import { 
  Question, 
  Tutor, 
  SubscriptionPlan, 
  StudentProfile, 
  AppNotification 
} from '../types';

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Ücretsiz Başlangıç',
    tagline: 'Haftalık 3 soru hakkı ile platformu deneyin',
    durationLabel: 'Süresiz',
    price: 0,
    periodText: 'Ücretsiz',
    dailyStandardLimit: 3,
    weeklyStandardLimit: 3,
    dailyVideoLimit: 0,
    priorityQueue: false,
    hdVideoAllowed: false,
    oneOnOneCoaching: false,
    features: [
      'Haftalık 3 adet standart (videosuz) soru sorma hakkı',
      'Alanında uzman eğitmenlerden adım adım formüllü yazılı çözüm',
      'Haftalık otomatik yenilenen soru kotası',
      'Geçmiş çözümleri inceleme ve eğitmen puanlama'
    ]
  },
  {
    id: 'weekly',
    name: 'Haftalık Yoğun Paket',
    tagline: 'Sınav öncesi son tekrarlar ve soru kampları için ideal',
    durationLabel: '7 Gün',
    price: 129,
    periodText: '₺129 / Hafta',
    dailyStandardLimit: 10,
    dailyVideoLimit: 3,
    priorityQueue: true,
    hdVideoAllowed: true,
    oneOnOneCoaching: false,
    badge: 'Hızlı Tekrar',
    features: [
      'Günde 10 adet standart soru sorma hakkı',
      'Günde 3 adet 1080p HD videolu soru çözümü',
      'Öncelikli çözüm havuzu (ortalama 8 dk)',
      'Video hızlandırma ve adım yer imleri',
      'Soru havuzunu PDF olarak kaydetme'
    ]
  },
  {
    id: 'monthly',
    name: 'Aylık Süper Sınav Paketi',
    tagline: 'En popüler paket! Düzenli çalışma ve başarı hedefleyenler için',
    durationLabel: '30 Gün',
    price: 349,
    periodText: '₺349 / Ay',
    dailyStandardLimit: 25,
    dailyVideoLimit: 10,
    priorityQueue: true,
    hdVideoAllowed: true,
    oneOnOneCoaching: true,
    popular: true,
    badge: 'En Popüler 🔥',
    features: [
      'Günde 25 adet soru sorma hakkı',
      'Günde 10 adet Full HD 1080p 60fps videolu anlatım',
      'VIP Eğitmen Önceliği (ortalama 4 dk içinde çözüm)',
      'Adım adım interaktif video yer imleri',
      'Yapay Zeka Anlık Ön İnceleme desteği',
      'Tüm çözümleri sınırsız arşivleme'
    ]
  },
  {
    id: 'three_months',
    name: '3 Aylık VIP Dönemlik Paket',
    tagline: 'LGS ve YKS maratonunda tam kapsamlı derece paketi',
    durationLabel: '90 Gün',
    price: 799,
    periodText: '₺799 / 3 Ay',
    dailyStandardLimit: 99,
    dailyVideoLimit: 99,
    priorityQueue: true,
    hdVideoAllowed: true,
    oneOnOneCoaching: true,
    badge: '%30 İndirimli 🏆',
    features: [
      'Sınırsız Günlük Soru Sorma Hakkı',
      'Sınırsız 1080p HD Videolu Anlatım',
      'En Üst Düzey Derece Eğitmenleri ile Öncelikli Eşleşme',
      'Eğitmene Takip Sorusu Sorma (Soru Altı Soru-Cevap)',
      'Haftalık Kişiselleştirilmiş İlerleme ve Konu Analiz Raporu',
      '7/24 Anlık Bildirim & Canlı Destek Hattı'
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-101',
  name: 'Elif Yılmaz',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'elif.yilmaz@ogrenci.edu.tr',
  activePlan: 'free',
  planName: 'Ücretsiz Başlangıç',
  dailyStandardRemaining: 3,
  dailyStandardTotal: 3,
  dailyVideoRemaining: 0,
  dailyVideoTotal: 0,
  weeklyStandardRemaining: 3,
  weeklyStandardTotal: 3,
  weeklyResetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  totalQuestionsAsked: 14,
  totalSolvedQuestions: 14,
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

export const INITIAL_TUTORS: Tutor[] = [
  {
    id: 'tut-1',
    name: 'Dr. Selim Kurtuluş',
    email: 'selim.kurtulus@matematikhocan.com',
    phone: '0555 123 4567',
    password: 'selim123',
    accessCode: 'MATH-101',
    isAuthorized: true,
    status: 'active',
    dailyCapacity: 30,
    definedAt: '2026-08-01T10:00:00Z',
    definedBy: 'Platform Yöneticisi',
    title: 'Kıdemli Matematik & Geometri Öğretmeni',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    bio: 'Boğaziçi Üniversitesi Matematik Öğretmenliği mezunu & Matematik Eğitimi Doktoru. 12 yıldır YKS (TYT-AYT) ve LGS hazırlıkta binlerce öğrenciyi dereceye taşıdı. Özel formül ispatları ve pratik video çözümleriyle tanınır.',
    university: 'Boğaziçi Üniversitesi (Matematik)',
    rating: 4.96,
    totalReviews: 482,
    solvedQuestionsCount: 1420,
    videoSolutionsCount: 930,
    specialties: ['Matematik', 'Geometri'],
    subjects: ['Matematik', 'Geometri'],
    badges: ['Yılın Matematikçisi 🥇', 'Video Çözüm Lideri 🎥', 'Hızlı Yanıt ⚡'],
    averageResponseMinutes: 4.2,
    online: true,
    reviews: [
      {
        id: 'rev-1',
        studentName: 'Elif Yılmaz',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        score: 5,
        comment: 'Hocam çemberde teğet kiriş açı sorusunu öyle güzel anlattı ki videoda çizdiği ek yarıçap çizgileri sayesinde mantığını kavradım. Emeğinize sağlık!',
        date: '2026-08-04',
        tags: ['Çok Anlaşılır 👏', 'Detaylı Anlatım 📚', 'Mükemmel Çizim 🎨'],
        subject: 'Geometri'
      },
      {
        id: 'rev-2',
        studentName: 'Burak Demir',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        score: 5,
        comment: 'Türevde maksimum hacim problemini 3 dakikalık videoda tüm türev ve teğet püf noktalarıyla özetledi, harika!',
        date: '2026-08-02',
        tags: ['Hızlı Yanıt ⚡', 'Soru Tarzına Uygun 🎯'],
        subject: 'Matematik'
      }
    ]
  },
  {
    id: 'tut-2',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@matematikhocan.com',
    phone: '0555 234 5678',
    password: 'zeynep123',
    accessCode: 'GEO-202',
    isAuthorized: true,
    status: 'active',
    dailyCapacity: 25,
    definedAt: '2026-08-01T10:30:00Z',
    definedBy: 'Platform Yöneticisi',
    title: 'Geometri & Analitik Geometri Uzmanı',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'ODTÜ Matematik Öğretmenliği mezunu. Üçgende benzerlik, çember, analitik geometri ve katı cisimler sorularında dijital çizimli ve adım adım görsel anlatımlarla öğrencilerin geometri korkusunu yener.',
    university: 'ODTÜ (Matematik Eğitimi)',
    rating: 4.94,
    totalReviews: 356,
    solvedQuestionsCount: 980,
    videoSolutionsCount: 620,
    specialties: ['Geometri', 'Matematik'],
    subjects: ['Geometri', 'Matematik'],
    badges: ['Geometri Çizim Ustası 📐', 'Derece Koçu 🏆'],
    averageResponseMinutes: 4.8,
    online: true,
    reviews: [
      {
        id: 'rev-3',
        studentName: 'Kaan Aksoy',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        score: 5,
        comment: 'Analitik düzlemde doğru demeti ve nokta uzaklığı sorusunda formülü şematik olarak gösterdi.',
        date: '2026-08-03',
        tags: ['Çok Anlaşılır 👏', 'Mükemmel Çizim 🎨'],
        subject: 'Geometri'
      }
    ]
  },
  {
    id: 'tut-3',
    name: 'Murat Arslan',
    email: 'murat.arslan@matematikhocan.com',
    phone: '0555 345 6789',
    password: 'murat123',
    accessCode: 'MATH-303',
    isAuthorized: true,
    status: 'active',
    dailyCapacity: 20,
    definedAt: '2026-08-02T11:00:00Z',
    definedBy: 'Platform Yöneticisi',
    title: 'TYT & LGS Matematik Mantık Koçu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'İTÜ Matematik Mühendisliği mezunu & Pedagojik Formasyon sahibi. Yeni nesil hikayeli matematik problemleri, EBOB-EKOK, olasılık ve mantık muhakeme sorularını pratik yöntemlerle çözer.',
    university: 'İTÜ (Matematik Mühendisliği)',
    rating: 4.91,
    totalReviews: 290,
    solvedQuestionsCount: 840,
    videoSolutionsCount: 460,
    specialties: ['Matematik'],
    subjects: ['Matematik'],
    badges: ['Yeni Nesil Problem Ustası 🧠', 'Hızlı Yanıt ⚡'],
    averageResponseMinutes: 5.1,
    online: true,
    reviews: [
      {
        id: 'rev-4',
        studentName: 'Selin Yıldız',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        score: 5,
        comment: 'Yaş ve yüzde problemini denklem kurmadan oran-orantı ile çözmeyi öğretti. Çok teşekkür ederim!',
        date: '2026-08-01',
        tags: ['Soru Tarzına Uygun 🎯', 'Çok Anlaşılır 👏'],
        subject: 'Matematik'
      }
    ]
  },
  {
    id: 'tut-4',
    name: 'Doç. Dr. Ayşe Yılmaz',
    email: 'ayse.yilmaz@matematikhocan.com',
    phone: '0555 456 7890',
    password: 'ayse123',
    accessCode: 'MATH-404',
    isAuthorized: true,
    status: 'active',
    dailyCapacity: 25,
    definedAt: '2026-08-03T14:20:00Z',
    definedBy: 'Platform Yöneticisi',
    title: 'AYT İleri Matematik & Analiz Eğitmeni',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Bilkent Üniversitesi Matematik Bölümü Doktoralı. AYT Trigonometri, Limit, Türev, Belirli İntegral ve Parabol alanında ÖSYM tarzı derece sorularında uzman.',
    university: 'Bilkent Üniversitesi (Matematik)',
    rating: 4.98,
    totalReviews: 215,
    solvedQuestionsCount: 780,
    videoSolutionsCount: 510,
    specialties: ['Matematik', 'Geometri'],
    subjects: ['Matematik', 'Geometri'],
    badges: ['Türev & İntegral Dehası ♾️', 'Hızlı Yanıt ⚡'],
    averageResponseMinutes: 3.5,
    online: true,
    reviews: []
  }
];

export const DEFAULT_PENDING_ALERT_SETTINGS: {
  thresholdMinutes: number;
  autoReminderEnabled: boolean;
  soundAlertEnabled: boolean;
} = {
  thresholdMinutes: 5, // 5 minutes inactivity alert
  autoReminderEnabled: true,
  soundAlertEnabled: true
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    studentId: 'std-101',
    studentName: 'Elif Yılmaz',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Geometri',
    gradeLevel: 'TYT / AYT (YKS)',
    title: 'Çemberde Teğet Kiriş Açı ve Merkez Açı Bağıntısı',
    description: 'Şekildeki O merkezli çemberde AB kirişi ile AC teğeti arasındaki açı 40 derecedir. BOC merkez açısının ölçüsü kaç derecedir?',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video',
    status: 'solved',
    createdAt: '2026-08-05T07:15:00Z',
    solvedAt: '2026-08-05T07:22:30Z',
    tutorId: 'tut-1',
    tutorName: 'Dr. Selim Kurtuluş',
    tutorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    tutorTitle: 'Kıdemli Matematik & Geometri Öğretmeni',
    priority: true,
    solution: {
      type: 'video',
      textExplanation: 'Değerli öğrencim, çemberde teğet-kiriş açı kuralına göre; teğet ile kirişin oluşturduğu açı gördüğü yayın ölçüsünün yarısına eşittir. AB kirişi ile AC teğeti arasındaki açı 40° ise gördüğü AB yayı 80° olur. Merkez açı gördüğü yaya doğrudan eşit olduğundan m(BOC) = 80° bulunur.',
      steps: [
        {
          stepNumber: 1,
          title: 'Teğet-Kiriş Açı Teoremi',
          content: 'AC doğrusu A noktasında teğet ve AB kiriş olduğundan: m(CAB) = 40° ise gördüğü AB yayının ölçüsü 2 × 40° = 80° dir.',
          formula: 'm(Teğet-Kiriş Açı) = Yay / 2  ⟹  m(AB Yayı) = 2 × 40° = 80°',
          timestamp: '00:12'
        },
        {
          stepNumber: 2,
          title: 'Merkez Açı Eşitliği',
          content: 'O merkezli çemberde BOC açısı merkez açıdır. Merkez açı gördüğü yayın ölçüsüne doğrudan eşittir.',
          formula: 'm(BOC) = m(AB Yayı) = 80°',
          timestamp: '00:54'
        },
        {
          stepNumber: 3,
          title: 'Sonuç ve Geometrik Püf Nokta',
          content: 'Doğru cevap 80° olup soru C seçeneğidir. Teğet-kiriş açıyı çevre açı gibi 2 katı yay görür mantığıyla düşünebilirsin.',
          formula: 'Cevap: 80°',
          timestamp: '01:35'
        }
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      videoDuration: 118,
      videoQuality: '1080p 60fps HD',
      videoBookmarks: [
        { id: 'bm-1', time: 0, timeLabel: '00:00', title: 'Giriş & Şekil İncelemesi', description: 'Çember, teğet ve kirişin analizi' },
        { id: 'bm-2', time: 12, timeLabel: '00:12', title: 'Teğet-Kiriş Açı Formülü', description: 'Yay ölçüsünün 80° olarak bulunması' },
        { id: 'bm-3', time: 54, timeLabel: '00:54', title: 'Merkez Açı İlişkisi', description: 'Merkez açı = Gördüğü yay kuralı' },
        { id: 'bm-4', time: 95, timeLabel: '01:35', title: 'ÖSYM Tüyoları & Çözüm Özeti', description: 'Benzer çember sorularında tuzaklar' }
      ],
      tutorNotes: 'ÖSYM benzer çember sorularını teğet-kiriş açı ile merkez açı ilişkisi üzerinden sormayı çok sever. Bu kuralı formül defterine not etmelisin!',
      submittedAt: '2026-08-05T07:22:30Z'
    },
    rating: {
      score: 5,
      comment: 'Hocam çemberde açı sorusunu öyle güzel anlattı ki videoda çizdiği ek çizgiler sayesinde mantığını kavradım. Emeğinize sağlık!',
      tags: ['Çok Anlaşılır 👏', 'Detaylı Anlatım 📚', 'Mükemmel Çizim 🎨'],
      ratedAt: '2026-08-05T07:45:00Z'
    },
    aiAnalysis: {
      detectedSubject: 'Geometri',
      detectedTopic: 'Çemberde Açılar & Teğet Özellikleri',
      extractedQuestionText: 'Şekildeki O merkezli çemberde AB kirişi ile AC teğeti arasındaki açı 40 derecedir. m(BOC) kaç derecedir?',
      keyFormulas: ['Teğet-Kiriş Açı = Yay / 2', 'Merkez Açı = Gördüğü Yay'],
      hints: ['AC teğetine değme noktasında yarıçap diktir.', 'Teğet kiriş açının gördüğü yay açının 2 katıdır.'],
      instantSolutionOutline: 'Teğet-kiriş açı 40° ⟹ Yay 80° ⟹ Merkez Açı 80°',
      confidenceScore: 0.98
    }
  },
  {
    id: 'q-102',
    studentId: 'std-101',
    studentName: 'Elif Yılmaz',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Geometri',
    gradeLevel: 'TYT / AYT (YKS)',
    title: 'Analitik Geometride Doğrunun Eğimi & Noktanın Doğruya Uzaklığı',
    description: 'A(2, -3) noktasının 3x - 4y + 7 = 0 doğrusuna olan dik uzaklığı kaç birimdir?',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'standard',
    status: 'solved',
    createdAt: '2026-08-05T06:10:00Z',
    solvedAt: '2026-08-05T06:18:40Z',
    tutorId: 'tut-2',
    tutorName: 'Zeynep Kaya',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tutorTitle: 'Geometri & Analitik Geometri Uzmanı',
    solution: {
      type: 'standard',
      textExplanation: 'Noktanın doğruya uzaklık formülü: d = |a.x₀ + b.y₀ + c| / √(a² + b²) dir. Verilen A(2, -3) noktası ve 3x - 4y + 7 = 0 doğrusu için x₀ = 2, y₀ = -3, a = 3, b = -4, c = 7 değerleri yerine yazıldığında pay = |3(2) - 4(-3) + 7| = |6 + 12 + 7| = 25; payda = √(3² + (-4)²) = √25 = 5 olur. Buradan uzaklık d = 25 / 5 = 5 birim bulunur.',
      steps: [
        {
          stepNumber: 1,
          title: 'Noktanın Doğruya Uzaklık Formülü',
          content: 'A(x₀, y₀) noktasının ax + by + c = 0 doğrusuna uzaklığı mutlak değer ve Pisagor kareköküyle bulunur.',
          formula: 'd = |a.x₀ + b.y₀ + c| / √(a² + b²)'
        },
        {
          stepNumber: 2,
          title: 'Değerlerin Yerine Konması',
          content: 'x₀=2 ve y₀=-3 koyarak payı hesaplayalım: |3.(2) - 4.(-3) + 7| = |6 + 12 + 7| = 25',
          formula: 'Pay = |25| = 25'
        },
        {
          stepNumber: 3,
          title: 'Paydanın Hesaplanması & Sonuç',
          content: 'Payda katsayıların kareleri toplamının kareköküdür: √(3² + (-4)²) = √(9 + 16) = √25 = 5.',
          formula: 'd = 25 / 5 = 5 birim'
        }
      ],
      solutionImageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      tutorNotes: 'Analitik geometride (3-4-5) ve (5-12-13) dik üçgen kalıpları paydada çok sık gelir. Bu formülü her denemede karşına çıkacak temel formüller arasına al.',
      submittedAt: '2026-08-05T06:18:40Z'
    },
    rating: {
      score: 5,
      comment: 'Hocam formülün yerine koyma adımlarını çok net yazmış. Teşekkürler!',
      tags: ['Çok Anlaşılır 👏', 'Hızlı Yanıt ⚡'],
      ratedAt: '2026-08-05T06:30:00Z'
    }
  },
  {
    id: 'q-103',
    studentId: 'std-101',
    studentName: 'Elif Yılmaz',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Matematik',
    gradeLevel: 'TYT / AYT (YKS)',
    title: 'Trigonometri - Yarım Açı ve Sadeleştirme Özdeşlikleri',
    description: '(sin 2x) / (1 + cos 2x) ifadesinin en sade hali nedir?',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video',
    status: 'solved',
    createdAt: '2026-08-05T05:30:00Z',
    solvedAt: '2026-08-05T05:38:15Z',
    tutorId: 'tut-4',
    tutorName: 'Doç. Dr. Ayşe Yılmaz',
    tutorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tutorTitle: 'AYT İleri Matematik & Analiz Eğitmeni',
    solution: {
      type: 'video',
      textExplanation: 'sin 2x = 2.sin x.cos x yarım açı formülüdür. Paydadaki 1 sayısını yok etmek için cos 2x = 2.cos² x - 1 açılımı kullanılır. Böylece payda 1 + (2.cos² x - 1) = 2.cos² x olur. İfade (2.sin x.cos x) / (2.cos² x) haline gelir. 2 ler ve birer cos x sadeleştiğinde sin x / cos x = tan x elde edilir.',
      steps: [
        {
          stepNumber: 1,
          title: 'sin 2x ve cos 2x Yarım Açı Açılımları',
          content: 'sin 2x = 2.sin x.cos x ve cos 2x = 2.cos² x - 1 formüllerini yazıyoruz.',
          formula: 'sin 2x = 2.sin x.cos x , cos 2x = 2.cos² x - 1',
          timestamp: '00:10'
        },
        {
          stepNumber: 2,
          title: 'Paydadaki 1 Sabitini Sadeleştirme',
          content: '1 + cos 2x = 1 + (2.cos² x - 1) = 2.cos² x olur.',
          formula: '1 + cos 2x = 2.cos² x',
          timestamp: '00:45'
        },
        {
          stepNumber: 3,
          title: 'Oranlama ve Sonuç',
          content: '(2.sin x.cos x) / (2.cos² x) = sin x / cos x = tan x',
          formula: 'Sonuç: tan x',
          timestamp: '01:20'
        }
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
      videoDuration: 95,
      videoQuality: '1080p 60fps HD',
      videoBookmarks: [
        { id: 'bm-k1', time: 0, timeLabel: '00:00', title: 'Soru Tanımı & Hedef', description: 'Trigonometrik sadeleştirme kuralları' },
        { id: 'bm-k2', time: 10, timeLabel: '00:10', title: 'Yarım Açı Formülleri', description: 'sin 2x ve cos 2x açılımları' },
        { id: 'bm-k3', time: 45, timeLabel: '00:45', title: '1 Yok Etme Taktiği', description: 'cos 2x te doğru açılım seçimi' },
        { id: 'bm-k4', time: 80, timeLabel: '01:20', title: 'Sadeleştirme & tan x', description: 'Doğru cevaba ulaşma' }
      ],
      tutorNotes: 'Trigonometride yanında +1 veya -1 olan cos 2x ifadelerinde o 1 sayısını götürecek uygun açılımı seçmek altın anahtardır.',
      submittedAt: '2026-08-05T05:38:15Z'
    }
  },
  {
    id: 'q-104',
    studentId: 'std-101',
    studentName: 'Elif Yılmaz',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Matematik',
    gradeLevel: 'TYT / AYT (YKS)',
    title: 'İkinci Dereceden Denklemler & Kökler Toplamı / Çarpımı Bağıntısı',
    description: 'x² - (m + 2)x + 3m - 1 = 0 denkleminin kökleri x₁ ve x₂ dir. 1/x₁ + 1/x₂ = 2 olduğuna göre m kaçtır?',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video',
    status: 'in_progress',
    createdAt: '2026-08-05T08:15:00Z',
    tutorId: 'tut-1',
    tutorName: 'Dr. Selim Kurtuluş',
    tutorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    tutorTitle: 'Kıdemli Matematik & Geometri Öğretmeni',
    priority: true,
    aiAnalysis: {
      detectedSubject: 'Matematik',
      detectedTopic: 'İkinci Dereceden Denklemler & Vieta Teoremi',
      keyFormulas: ['x₁ + x₂ = -b/a = m + 2', 'x₁ . x₂ = c/a = 3m - 1', '1/x₁ + 1/x₂ = (x₁+x₂)/(x₁.x₂)'],
      hints: ['Paydaları eşitleyerek (x₁ + x₂) / (x₁ . x₂) ifadesini elde et.', 'Bulduğun kökler toplamı ve çarpımını yerine yazarak m denklemini çöz.'],
      instantSolutionOutline: '(m + 2) / (3m - 1) = 2 ⟹ m + 2 = 6m - 2 ⟹ 5m = 4 ⟹ m = 4/5',
      confidenceScore: 0.99
    }
  },
  {
    id: 'q-105',
    studentId: 'std-102',
    studentName: 'Ahmet Can',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    subject: 'Matematik',
    gradeLevel: 'LGS (8. Sınıf)',
    title: 'Çarpanlar ve Katlar - EBOB & EKOK Yeni Nesil Mantık Sorusu',
    description: 'Kenar uzunlukları 120 metre ve 180 metre olan dikdörtgen biçimindeki bir tarlanın etrafına ve köşelerine eşit aralıklarla fidan dikilecektir. En az kaç fidan gerekir?',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video',
    status: 'pending',
    createdAt: '2026-08-05T08:28:00Z',
    priority: false
  },
  {
    id: 'q-106',
    studentId: 'std-103',
    studentName: 'Sena Aydın',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    subject: 'Geometri',
    gradeLevel: '10. Sınıf',
    title: 'Özel Dörtgenler - Eşkenar Dörtgende Köşegenler & Alan Hesabı',
    description: 'Köşegen uzunlukları 16 cm ve 12 cm olan bir eşkenar dörtgenin bir kenar uzunluğu ve alanı kaç cm² dir?',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'standard',
    status: 'pending',
    createdAt: '2026-08-05T08:32:00Z',
    priority: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'student',
    title: '🎉 Sorunuz Çözüldü!',
    message: 'Dr. Selim Kurtuluş "Çemberde Teğet Kiriş Açı" Geometri sorunuz için 1080p HD Video Çözüm yükledi.',
    type: 'solution_ready',
    questionId: 'q-101',
    read: false,
    createdAt: '2026-08-05T07:22:30Z'
  },
  {
    id: 'notif-2',
    recipientRole: 'student',
    title: '📝 Yeni Geometri Çözümü Hazır',
    message: 'Zeynep Kaya "Analitik Geometride Doğrunun Eğimi" sorunuzu detaylı adımlarla çözdü.',
    type: 'solution_ready',
    questionId: 'q-102',
    read: false,
    createdAt: '2026-08-05T06:18:40Z'
  },
  {
    id: 'notif-3',
    recipientRole: 'student',
    title: '🚀 Eğitmen Matematik Sorunuzu Aldı',
    message: 'Dr. Selim Kurtuluş "İkinci Dereceden Denklemler" sorunuzun çözümüne başladı.',
    type: 'question_claimed',
    questionId: 'q-104',
    read: true,
    createdAt: '2026-08-05T08:16:00Z'
  },
  {
    id: 'notif-4',
    recipientRole: 'tutor',
    title: '⭐ Yeni 5 Yıldızlı Değerlendirme!',
    message: 'Elif Yılmaz çözdüğünüz Geometri sorusuna 5 yıldız ve harika bir teşekkür yorumu bıraktı.',
    type: 'rating_received',
    questionId: 'q-101',
    read: false,
    createdAt: '2026-08-05T07:45:00Z'
  },
  {
    id: 'notif-5',
    recipientRole: 'tutor',
    title: '📥 Havuzda Yeni Matematik Sorusu!',
    message: 'LGS Matematik (Çarpanlar ve Katlar) alanında 1 yeni soru çözülmeyi bekliyor.',
    type: 'new_question_available',
    questionId: 'q-105',
    read: false,
    createdAt: '2026-08-05T08:28:00Z'
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
  },
  {
    title: 'Üçgende Benzerlik ve Thales Teoremi (9. Sınıf Geometri)',
    subject: 'Geometri' as const,
    gradeLevel: '9. Sınıf' as const,
    description: 'ABC üçgeninde DE // BC, |AD|=4 cm, |DB|=6 cm ve |DE|=8 cm olduğuna göre |BC| kaç cm dir?',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'video' as const
  },
  {
    title: 'Belirli İntegral ile Alan Hesabı (12. Sınıf AYT Matematik)',
    subject: 'Matematik' as const,
    gradeLevel: 'TYT / AYT (YKS)' as const,
    description: 'y = 4 - x² parabolü ile y = 0 doğrusu arasında kalan kapalı bölgenin alanı kaç birimkaredir?',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    requestedSolutionType: 'standard' as const
  }
];
