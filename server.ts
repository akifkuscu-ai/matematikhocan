import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  INITIAL_QUESTIONS, 
  INITIAL_TUTORS, 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_NOTIFICATIONS,
  INITIAL_ONLINE_COURSES
} from './src/data/mockData';
import { 
  Question, 
  Tutor, 
  StudentProfile, 
  AppNotification, 
  SubscriptionPlanId, 
  QuestionSolution, 
  QuestionRating,
  OnlineCourse
} from './src/types';

// In-Memory Database State
let questionsDB: Question[] = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
let tutorsDB: Tutor[] = JSON.parse(JSON.stringify(INITIAL_TUTORS));
let studentProfileDB: StudentProfile = JSON.parse(JSON.stringify(INITIAL_STUDENT_PROFILE));
let notificationsDB: AppNotification[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
let coursesDB: OnlineCourse[] = JSON.parse(JSON.stringify(INITIAL_ONLINE_COURSES));
let pendingAlertSettingsDB = {
  thresholdMinutes: 5,
  autoReminderEnabled: true,
  soundAlertEnabled: true,
  lastCheckedAt: new Date().toISOString()
};

// ==========================================
// SECURITY & SERVER-BINDING STATE
// Rule: "Aynı sunucudan farklı kullanıcılara izin verme"
// ==========================================
interface ServerUserBinding {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  boundAt: string;
  ip: string;
  lastActiveAt: string;
}

// Maps client server / IP address to single authorized user
const serverUserBindings = new Map<string, ServerUserBinding>();

function getClientServerIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || req.ip || '127.0.0.1';
}

function checkSameServerUserPermission(
  req: express.Request,
  candidate: { id?: string; email?: string; name?: string; role?: string }
): { allowed: boolean; error?: string; boundUser?: ServerUserBinding } {
  const ip = getClientServerIp(req);
  const bound = serverUserBindings.get(ip);

  // If no user is bound to this server IP yet, allow and will bind
  if (!bound) {
    return { allowed: true };
  }

  // Check if same user by ID or Email
  const isSameId = !!(candidate.id && bound.userId === candidate.id);
  const isSameEmail = !!(
    candidate.email &&
    bound.email &&
    candidate.email.trim().toLowerCase() === bound.email.trim().toLowerCase()
  );

  if (isSameId || isSameEmail) {
    bound.lastActiveAt = new Date().toISOString();
    return { allowed: true, boundUser: bound };
  }

  // REJECT: Different user attempted from the same server / IP!
  return {
    allowed: false,
    boundUser: bound,
    error: `Güvenlik Engeli: Aynı sunucudan / IP adresinden (${ip}) farklı kullanıcılara izin verilmemektedir! Bu sunucu zaten "${bound.name}" (${bound.email || bound.userId}) hesabına kilitlenmiştir. Sistemde mükerrer hesap ve suistimal engellenmiştir.`
  };
}

function bindUserToServer(
  req: express.Request,
  user: { id: string; name: string; email?: string; role: 'student' | 'tutor' }
) {
  const ip = getClientServerIp(req);
  serverUserBindings.set(ip, {
    userId: user.id,
    name: user.name,
    email: user.email || '',
    role: user.role,
    boundAt: new Date().toISOString(),
    ip,
    lastActiveAt: new Date().toISOString()
  });
}

// Background Pending Questions Inactivity Watcher
function checkAndEscalatePendingQuestions() {
  if (!pendingAlertSettingsDB.autoReminderEnabled) return;
  const now = Date.now();
  const thresholdMs = pendingAlertSettingsDB.thresholdMinutes * 60 * 1000;

  const pendingQuestions = questionsDB.filter(q => q.status === 'pending');
  for (const q of pendingQuestions) {
    const createdTime = new Date(q.createdAt).getTime();
    const elapsedMs = now - createdTime;

    if (elapsedMs >= thresholdMs) {
      // Check cooldown: don't spam if sent within the threshold
      const lastSent = q.lastReminderSentAt ? new Date(q.lastReminderSentAt).getTime() : 0;
      if (now - lastSent >= thresholdMs) {
        const elapsedMinutes = Math.floor(elapsedMs / (60 * 1000));
        q.lastReminderSentAt = new Date().toISOString();
        q.reminderCount = (q.reminderCount || 0) + 1;

        // Push urgent notification to tutors
        const urgentNotif: AppNotification = {
          id: `notif-urgent-${Date.now()}-${q.id}`,
          recipientRole: 'tutor',
          title: `⚠️ ACİL: ${elapsedMinutes} Dk'dır Bekleyen ${q.subject} Sorusu!`,
          message: `"${q.title}" (${q.gradeLevel}) sorusu ${elapsedMinutes} dakikadır yanıtsız bekliyor. Öğrenci ${q.studentName} acil çözüm bekliyor!`,
          type: 'pending_question_reminder',
          questionId: q.id,
          read: false,
          urgent: true,
          createdAt: new Date().toISOString()
        };
        notificationsDB.unshift(urgentNotif);
      }
    }
  }
}

// Start periodic background check
setInterval(checkAndEscalatePendingQuestions, 15000);

// Gemini SDK Lazy Initializer
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Questions API
  app.get('/api/questions', (req, res) => {
    const { status, subject, studentId, tutorId } = req.query;
    let filtered = [...questionsDB];

    if (status) {
      filtered = filtered.filter(q => q.status === status);
    }
    if (subject) {
      filtered = filtered.filter(q => q.subject === subject);
    }
    if (studentId) {
      filtered = filtered.filter(q => q.studentId === studentId);
    }
    if (tutorId) {
      filtered = filtered.filter(q => q.tutorId === tutorId);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, data: filtered });
  });

  app.get('/api/questions/:id', (req, res) => {
    const question = questionsDB.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }
    res.json({ success: true, data: question });
  });

  // Submit new question
  app.post('/api/questions', async (req, res) => {
    try {
      const {
        title,
        description,
        subject,
        gradeLevel,
        imageUrl,
        requestedSolutionType,
        aiAssistRequested,
        studentId,
        studentEmail,
        studentName
      } = req.body;

      if (!title || !imageUrl || !subject) {
        return res.status(400).json({ success: false, error: 'Lütfen gerekli alanları ve soru görselini doldurun.' });
      }

      // 1. Same-Server Security Check: "Aynı sunucudan farklı kullanıcılara izin verme"
      const candidateStudent = {
        id: studentId || studentProfileDB.id || 'std-101',
        email: studentEmail || studentProfileDB.email,
        name: studentName || studentProfileDB.name,
        role: 'student' as const
      };

      const serverPerm = checkSameServerUserPermission(req, candidateStudent);
      if (!serverPerm.allowed) {
        return res.status(403).json({
          success: false,
          error: serverPerm.error,
          code: 'SAME_SERVER_MULTI_USER_FORBIDDEN',
          boundUser: serverPerm.boundUser
        });
      }

      // Bind current student to this server IP if not bound yet
      bindUserToServer(req, {
        id: candidateStudent.id,
        name: candidateStudent.name,
        email: candidateStudent.email,
        role: 'student'
      });

      // 2. Check limits (Weekly 3 Free Questions for Free Tier)
      if (requestedSolutionType === 'video') {
        if (studentProfileDB.dailyVideoRemaining <= 0) {
          return res.status(403).json({
            success: false,
            error: 'Bugünkü videolu soru sorma limitiniz doldu. Lütfen abonelik paketinizi yükseltin veya standart çözüm seçin.',
            code: 'VIDEO_LIMIT_REACHED'
          });
        }
        studentProfileDB.dailyVideoRemaining -= 1;
      } else {
        // Standard question
        if (studentProfileDB.activePlan === 'free') {
          const currentWeeklyRemaining = studentProfileDB.weeklyStandardRemaining ?? studentProfileDB.dailyStandardRemaining ?? 3;
          if (currentWeeklyRemaining <= 0) {
            return res.status(403).json({
              success: false,
              error: 'Bu haftaki 3 adet ücretsiz standart soru sorma limitiniz doldu (Haftalık 3/3 kullanıldı). Ücretsiz haklarınız gelecek hafta otomatik yenilenecektir veya avantajlı paketlerimize geçebilirsiniz.',
              code: 'WEEKLY_FREE_LIMIT_REACHED'
            });
          }
          studentProfileDB.weeklyStandardRemaining = Math.max(0, currentWeeklyRemaining - 1);
          studentProfileDB.dailyStandardRemaining = studentProfileDB.weeklyStandardRemaining;
        } else {
          if (studentProfileDB.dailyStandardRemaining <= 0) {
            return res.status(403).json({
              success: false,
              error: 'Bugünkü standart soru sorma limitiniz doldu. Soru sormaya devam etmek için haftalık veya aylık paket alabilirsiniz.',
              code: 'STANDARD_LIMIT_REACHED'
            });
          }
          studentProfileDB.dailyStandardRemaining -= 1;
        }
      }

      studentProfileDB.totalQuestionsAsked += 1;

      const newQuestionId = `q-${Date.now()}`;
      let aiAnalysisData = undefined;

      // Server-side Gemini AI quick analysis if requested or key present
      if (aiAssistRequested && process.env.GEMINI_API_KEY) {
        try {
          const ai = getGemini();
          const prompt = `Sen Türkiye'deki sınav sistemine (LGS, YKS, TYT, AYT, KPSS) hakim uzman bir yapay zeka ders koçusun.
Öğrencinin sorduğu soru:
Ders: ${subject}
Seviye: ${gradeLevel}
Soru Başlığı: ${title}
Açıklama/Detay: ${description || 'Yok'}

Lütfen bu soru için JSON formatında aşağıdaki yapıyı döndür:
{
  "detectedSubject": "${subject}",
  "detectedTopic": "Sorunun ait olduğu spesifik alt konu",
  "keyFormulas": ["Sorunun çözümünde kullanılacak 1-2 temel formül veya kural"],
  "hints": ["Öğrenciye soruyu çözebilmesi için 2 adet yönlendirici ipucu"],
  "instantSolutionOutline": "Sorunun kısa ve öz çözüm adımı özeti",
  "confidenceScore": 0.95
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          if (response.text) {
            aiAnalysisData = JSON.parse(response.text);
          }
        } catch (aiErr) {
          console.error('Gemini AI analysis error:', aiErr);
          // Fallback static intelligent analysis
          aiAnalysisData = {
            detectedSubject: subject,
            detectedTopic: `${subject} Konu Analizi`,
            keyFormulas: [`Temel ${subject} Teoremi`, 'Adım Adım Sadeleştirme'],
            hints: ['Soruda verilen öncülleri tek tek listeleyin.', 'İstenen niceliği temel eşitlikten çekin.'],
            instantSolutionOutline: 'Soruda verilen değerler doğrudan temel formüle yerleştirildiğinde doğru sonuca ulaşılır.',
            confidenceScore: 0.92
          };
        }
      } else if (aiAssistRequested) {
        // Fallback if no API key
        aiAnalysisData = {
          detectedSubject: subject,
          detectedTopic: `${subject} Soru Analizi`,
          keyFormulas: [`Temel ${subject} Bağıntısı`, 'Mantıksal Çıkarım'],
          hints: ['Sorudaki anahtar kelimeleri ve verileri alt alta yazın.', 'Şıklardaki benzerlikleri kontrol edin.'],
          instantSolutionOutline: 'Sorudaki matematiksel/mantıksal bağıntı uygulandığında sonuca hızla ulaşılır.',
          confidenceScore: 0.90
        };
      }

      const newQuestion: Question = {
        id: newQuestionId,
        studentId: studentProfileDB.id,
        studentName: studentProfileDB.name,
        studentAvatar: studentProfileDB.avatar,
        subject,
        gradeLevel,
        title,
        description: description || '',
        imageUrl,
        requestedSolutionType,
        status: 'pending',
        createdAt: new Date().toISOString(),
        aiAnalysis: aiAnalysisData,
        priority: studentProfileDB.activePlan !== 'free'
      };

      questionsDB.unshift(newQuestion);

      // Create notification for tutors
      const tutorNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'tutor',
        title: `📥 Yeni ${subject} Sorusu!`,
        message: `${studentProfileDB.name} "${title}" başlıklı yeni bir ${requestedSolutionType === 'video' ? '🎬 Videolu' : '📝 Standart'} soru sordu.`,
        type: 'new_question_available',
        questionId: newQuestionId,
        read: false,
        createdAt: new Date().toISOString()
      };
      notificationsDB.unshift(tutorNotif);

      res.status(201).json({
        success: true,
        data: newQuestion,
        studentProfile: studentProfileDB
      });
    } catch (err: any) {
      console.error('Error submitting question:', err);
      res.status(500).json({ success: false, error: 'Soru oluşturulurken bir hata oluştu.' });
    }
  });

  // Tutor claims question (support PUT & POST)
  const handleClaimQuestion = (req: express.Request, res: express.Response) => {
    const { tutorId, tutorName, tutorAvatar, tutorTitle } = req.body;
    const question = questionsDB.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }

    const tutor = tutorsDB.find(t => t.id === tutorId) || tutorsDB[0];
    question.status = 'in_progress';
    question.tutorId = tutor.id;
    question.tutorName = tutorName || tutor.name;
    question.tutorAvatar = tutorAvatar || tutor.avatar;
    question.tutorTitle = tutorTitle || tutor.title;

    // Send notification to student
    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: 'student',
      title: '🚀 Eğitmen Sorunuzu İnceliyor',
      message: `${question.tutorName} "${question.title}" sorunuzu çözmek üzere aldı. Çözümünüz çok yakında hazır olacak!`,
      type: 'question_claimed',
      questionId: question.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    notificationsDB.unshift(studentNotif);

    res.json({ success: true, data: question });
  };
  app.put('/api/questions/:id/claim', handleClaimQuestion);
  app.post('/api/questions/:id/claim', handleClaimQuestion);

  // Tutor submits solution (support PUT & POST)
  const handleSolveQuestion = (req: express.Request, res: express.Response) => {
    const {
      type,
      textExplanation,
      steps,
      solutionImageUrl,
      videoUrl,
      videoThumbnailUrl,
      videoDuration,
      videoQuality,
      videoBookmarks,
      tutorNotes,
      tutorId
    } = req.body;

    const question = questionsDB.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }

    const tutor = tutorsDB.find(t => t.id === (tutorId || question.tutorId)) || tutorsDB[0];

    const solutionData: QuestionSolution = {
      type: type || question.requestedSolutionType || 'standard',
      textExplanation: textExplanation || '',
      steps: steps || [],
      solutionImageUrl: solutionImageUrl || undefined,
      videoUrl: videoUrl || undefined,
      videoThumbnailUrl: videoThumbnailUrl || undefined,
      videoDuration: videoDuration || (type === 'video' ? 120 : undefined),
      videoQuality: videoQuality || (type === 'video' ? '1080p 60fps HD' : undefined),
      videoBookmarks: videoBookmarks || [],
      tutorNotes: tutorNotes || '',
      submittedAt: new Date().toISOString()
    };

    question.solution = solutionData;
    question.status = 'solved';
    question.solvedAt = new Date().toISOString();
    question.tutorId = tutor.id;
    question.tutorName = tutor.name;
    question.tutorAvatar = tutor.avatar;
    question.tutorTitle = tutor.title;

    // Update tutor stats
    tutor.solvedQuestionsCount += 1;
    if (solutionData.type === 'video') {
      tutor.videoSolutionsCount += 1;
    }

    // Send notification to student
    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: 'student',
      title: solutionData.type === 'video' ? '🎉 1080p HD Video Çözümünüz Hazır!' : '📝 Sorunuz Çözüldü!',
      message: `${tutor.name} "${question.title}" sorunuzu başarıyla çözdü. Şimdi inceleyebilir ve eğitmeninize puan verebilirsiniz.`,
      type: 'solution_ready',
      questionId: question.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    notificationsDB.unshift(studentNotif);

    res.json({ success: true, data: question });
  };
  app.put('/api/questions/:id/solve', handleSolveQuestion);
  app.post('/api/questions/:id/solve', handleSolveQuestion);

  // Student rates tutor & solution
  app.post('/api/questions/:id/rate', (req, res) => {
    const { score, comment, tags } = req.body;
    const question = questionsDB.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Soru bulunamadı' });
    }

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ success: false, error: 'Puan 1 ile 5 arasında olmalıdır.' });
    }

    const ratingData: QuestionRating = {
      score: Number(score),
      comment: comment || '',
      tags: Array.isArray(tags) ? tags : [],
      ratedAt: new Date().toISOString()
    };

    question.rating = ratingData;

    // Update tutor reviews & score
    const tutor = tutorsDB.find(t => t.id === question.tutorId);
    if (tutor) {
      const newReview = {
        id: `rev-${Date.now()}`,
        studentName: question.studentName || 'Öğrenci',
        studentAvatar: question.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        score: ratingData.score,
        comment: ratingData.comment,
        date: new Date().toISOString().split('T')[0],
        tags: ratingData.tags,
        subject: question.subject
      };

      tutor.reviews.unshift(newReview);
      tutor.totalReviews += 1;
      
      // Recalculate average rating
      const totalScores = tutor.reviews.reduce((acc, r) => acc + r.score, 0);
      tutor.rating = Number((totalScores / tutor.reviews.length).toFixed(2));

      // Notify tutor
      const tutorNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'tutor',
        title: `⭐ Yeni ${ratingData.score} Yıldızlı Değerlendirme!`,
        message: `${question.studentName} çözdüğünüz "${question.title}" sorusuna ${ratingData.score} yıldız verdi: "${ratingData.comment || 'Tebrikler!'}"`,
        type: 'rating_received',
        questionId: question.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      notificationsDB.unshift(tutorNotif);
    }

    res.json({ success: true, data: question, tutor });
  });

  // 2. Tutors API
  app.get('/api/tutors', (req, res) => {
    res.json({ success: true, data: tutorsDB });
  });

  app.get('/api/tutors/:id', (req, res) => {
    const tutor = tutorsDB.find(t => t.id === req.params.id);
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Eğitmen bulunamadı' });
    }
    res.json({ success: true, data: tutor });
  });

  // 3. Online Courses API (Tek tek veya toplu satın alma, manuel fiyat, ders & ödev PDF)
  app.get('/api/courses', (req, res) => {
    res.json({ success: true, data: coursesDB });
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = coursesDB.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Ders bulunamadı' });
    }
    res.json({ success: true, data: course });
  });

  // Upload / Create new online course with manual price, lesson PDF, homework PDF
  app.post('/api/courses', (req, res) => {
    try {
      const {
        title,
        subject,
        gradeLevel,
        description,
        instructorName,
        instructorTitle,
        price,
        thumbnailUrl,
        videoUrl,
        durationMinutes,
        lessonPdfUrl,
        lessonPdfTitle,
        homeworkPdfUrl,
        homeworkPdfTitle
      } = req.body;

      if (!title || !subject || !videoUrl) {
        return res.status(400).json({ success: false, error: 'Lütfen ders başlığı, branş ve video URL alanlarını doldurunuz.' });
      }

      const manualPrice = Number(price) >= 0 ? Number(price) : 50;

      const newCourse: OnlineCourse = {
        id: `crs-${Date.now()}`,
        title: title.trim(),
        subject: subject || 'Matematik',
        gradeLevel: gradeLevel || 'TYT / AYT (YKS)',
        description: description || 'Ders içeriği ve kazanım anlatımı.',
        instructorName: instructorName || 'Matematik & Geometri Eğitmeni',
        instructorTitle: instructorTitle || 'Uzman Eğitmen',
        price: manualPrice, // Manuel belirlenen ders fiyatı
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
        videoUrl: videoUrl.trim(),
        durationMinutes: Number(durationMinutes) || 45,
        lessonPdfUrl: lessonPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        lessonPdfTitle: lessonPdfTitle || `${title.replace(/\s+/g, '_')}_Ders_Notu.pdf`,
        homeworkPdfUrl: homeworkPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        homeworkPdfTitle: homeworkPdfTitle || `${title.replace(/\s+/g, '_')}_Odev_Testi.pdf`,
        createdAt: new Date().toISOString(),
        purchased: false
      };

      coursesDB.unshift(newCourse);

      // Notification
      const courseNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'all',
        title: '🎬 Yeni Online Ders Eklendi!',
        message: `"${newCourse.title}" dersi yüklendi. Ders PDF'i ve Ödev PDF'i indirilebilir durumda.`,
        type: 'course_purchased',
        read: false,
        createdAt: new Date().toISOString()
      };
      notificationsDB.unshift(courseNotif);

      res.status(201).json({ success: true, message: 'Online ders başarıyla yüklendi.', data: newCourse });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Ders yüklenirken hata oluştu.' });
    }
  });

  // Individual course purchase (Tek tek satın al)
  app.post('/api/courses/:id/purchase', (req, res) => {
    const course = coursesDB.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Ders bulunamadı' });
    }

    course.purchased = true;

    // Send confirmation notification
    const purchaseNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: 'student',
      title: '🎉 Ders Satın Alındı!',
      message: `"${course.title}" online dersini tekil olarak (₺${course.price}) satın aldınız. Artık videoyu izleyebilir, ders ve ödev PDF'lerini sınırsız indirebilirsiniz!`,
      type: 'course_purchased',
      read: false,
      createdAt: new Date().toISOString()
    };
    notificationsDB.unshift(purchaseNotif);

    res.json({
      success: true,
      message: `"${course.title}" başarıyla satın alındı!`,
      data: course
    });
  });

  // Bulk course purchase (Toplu satın al)
  app.post('/api/courses/bulk-purchase', (req, res) => {
    const { courseIds } = req.body;
    let targetCourses = coursesDB;
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      targetCourses = coursesDB.filter(c => courseIds.includes(c.id));
    }

    targetCourses.forEach(c => {
      c.purchased = true;
    });

    const totalCalculated = targetCourses.reduce((sum, c) => sum + c.price, 0);
    const discountedTotal = Math.round(totalCalculated * 0.75); // %25 toplu indirim

    // Send confirmation notification
    const purchaseNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: 'student',
      title: '🌟 Toplu Ders Paketi Satın Alındı!',
      message: `${targetCourses.length} adet online ders avantajlı toplu fiyatla (₺${discountedTotal}) kütüphanenize eklendi. Tüm ders videoları, ders notu PDF'leri ve ödev testleri erişiminize açıldı.`,
      type: 'course_purchased',
      read: false,
      createdAt: new Date().toISOString()
    };
    notificationsDB.unshift(purchaseNotif);

    res.json({
      success: true,
      message: `${targetCourses.length} adet ders toplu olarak satın alındı!`,
      totalPaid: discountedTotal,
      data: coursesDB
    });
  });

  // Student Profile API
  app.get('/api/student/profile', (req, res) => {
    res.json({ success: true, data: studentProfileDB });
  });

  // Reset daily/weekly limits demo endpoint
  app.post('/api/student/profile/reset-limits', (req, res) => {
    studentProfileDB.activePlan = 'free';
    studentProfileDB.planName = 'Ücretsiz Standart';
    studentProfileDB.planExpiresAt = undefined;
    studentProfileDB.dailyStandardTotal = 3;
    studentProfileDB.dailyStandardRemaining = 3;
    studentProfileDB.weeklyStandardTotal = 3;
    studentProfileDB.weeklyStandardRemaining = 3;
    studentProfileDB.dailyVideoTotal = 0;
    studentProfileDB.dailyVideoRemaining = 0;
    res.json({ success: true, data: studentProfileDB, profile: studentProfileDB });
  });

  // 4. Notifications API
  app.get('/api/notifications', (req, res) => {
    const { role } = req.query;
    let list = [...notificationsDB];
    if (role && role !== 'all') {
      list = list.filter(n => n.recipientRole === role || n.recipientRole === 'all');
    }
    res.json({ success: true, data: list });
  });

  const handleReadNotification = (req: express.Request, res: express.Response) => {
    const notif = notificationsDB.find(n => n.id === req.params.id);
    if (notif) {
      notif.read = true;
    }
    res.json({ success: true, data: notif });
  };
  app.put('/api/notifications/:id/read', handleReadNotification);
  app.patch('/api/notifications/:id/read', handleReadNotification);

  const handleReadAllNotifications = (req: express.Request, res: express.Response) => {
    const { role } = req.body;
    notificationsDB.forEach(n => {
      if (!role || n.recipientRole === role || n.recipientRole === 'all') {
        n.read = true;
      }
    });
    res.json({ success: true });
  };
  app.put('/api/notifications/read-all', handleReadAllNotifications);
  app.post('/api/notifications/mark-all-read', handleReadAllNotifications);

  // 5. Authentication API (Enforcing Single User per Server: "Aynı sunucudan farklı kullanıcılara izin verme")
  app.post('/api/auth/login', (req, res) => {
    const { role, email, password, accessCode, studentData } = req.body;

    if (role === 'student') {
      const candidateId = studentData?.id || (studentData?.email ? `std-${studentData.email.split('@')[0]}` : (studentProfileDB.id || 'std-101'));
      const candidateEmail = studentData?.email || studentProfileDB.email;
      const candidateName = studentData?.name || studentProfileDB.name;

      // Check same-server restriction
      const perm = checkSameServerUserPermission(req, {
        id: candidateId,
        email: candidateEmail,
        name: candidateName,
        role: 'student'
      });

      if (!perm.allowed) {
        return res.status(403).json({
          success: false,
          error: perm.error,
          code: 'SAME_SERVER_MULTI_USER_FORBIDDEN',
          boundUser: perm.boundUser
        });
      }

      // Student login / switch
      if (studentData) {
        studentProfileDB = {
          ...studentProfileDB,
          id: candidateId,
          name: studentData.name || studentProfileDB.name,
          email: studentData.email || studentProfileDB.email,
          avatar: studentData.avatar || studentProfileDB.avatar,
          grade: studentData.grade || studentProfileDB.grade,
          targetExam: studentData.targetExam || studentProfileDB.targetExam
        };
      }

      // Bind authorized user to this server IP
      bindUserToServer(req, {
        id: studentProfileDB.id || 'std-101',
        name: studentProfileDB.name,
        email: studentProfileDB.email,
        role: 'student'
      });

      return res.json({
        success: true,
        user: {
          id: studentProfileDB.id || 'std-101',
          name: studentProfileDB.name,
          email: studentProfileDB.email,
          role: 'student',
          avatar: studentProfileDB.avatar,
          grade: studentProfileDB.grade
        },
        profile: studentProfileDB
      });
    }

    if (role === 'tutor') {
      // STRICT TUTOR AUTHENTICATION: Only authorized tutors defined in the system
      const inputQuery = (email || accessCode || '').trim().toLowerCase();
      
      const foundTutor = tutorsDB.find(t => {
        const emailMatch = t.email && t.email.toLowerCase() === inputQuery;
        const codeMatch = t.accessCode && t.accessCode.toLowerCase() === inputQuery;
        const phoneMatch = t.phone && t.phone.replace(/\s+/g, '') === inputQuery.replace(/\s+/g, '');
        const idMatch = t.id.toLowerCase() === inputQuery;
        return (emailMatch || codeMatch || phoneMatch || idMatch) && t.isAuthorized !== false;
      });

      if (!foundTutor) {
        return res.status(403).json({
          success: false,
          error: 'Yetkisiz Giriş: Bu e-posta veya erişim kodu sistemde yetkili eğitmen olarak tanımlanmamıştır. Yalnızca platform yöneticisinin sisteme tanımladığı öğretmenler giriş yapabilir.',
          code: 'UNAUTHORIZED_TUTOR'
        });
      }

      // Check same-server restriction
      const perm = checkSameServerUserPermission(req, {
        id: foundTutor.id,
        email: foundTutor.email,
        name: foundTutor.name,
        role: 'tutor'
      });

      if (!perm.allowed) {
        return res.status(403).json({
          success: false,
          error: perm.error,
          code: 'SAME_SERVER_MULTI_USER_FORBIDDEN',
          boundUser: perm.boundUser
        });
      }

      if (foundTutor.status === 'inactive') {
        return res.status(403).json({
          success: false,
          error: 'Eğitmen hesabınız şu anda pasif durumdadır. Lütfen platform yöneticisi ile iletişime geçiniz.',
          code: 'INACTIVE_TUTOR'
        });
      }

      // Password check if provided
      if (password && foundTutor.password && foundTutor.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Girdiğiniz şifre hatalıdır. Lütfen kontrol edip tekrar deneyiniz.',
          code: 'INVALID_PASSWORD'
        });
      }

      // Bind tutor to this server IP
      bindUserToServer(req, {
        id: foundTutor.id,
        name: foundTutor.name,
        email: foundTutor.email,
        role: 'tutor'
      });

      return res.json({
        success: true,
        user: {
          id: foundTutor.id,
          name: foundTutor.name,
          email: foundTutor.email,
          role: 'tutor',
          avatar: foundTutor.avatar,
          title: foundTutor.title,
          subjects: foundTutor.subjects || foundTutor.specialties,
          isAuthorized: true
        },
        tutor: foundTutor
      });
    }

    return res.status(400).json({ success: false, error: 'Geçersiz giriş rolü.' });
  });

  // Server-Binding & Security Enforcement API ("Aynı sunucudan farklı kullanıcılara izin verme")
  app.get('/api/system/server-binding', (req, res) => {
    const ip = getClientServerIp(req);
    let bound = serverUserBindings.get(ip);
    if (!bound) {
      // Auto-bind active initial user
      bindUserToServer(req, {
        id: studentProfileDB.id || 'std-101',
        name: studentProfileDB.name,
        email: studentProfileDB.email,
        role: 'student'
      });
      bound = serverUserBindings.get(ip);
    }
    res.json({
      success: true,
      serverIp: ip,
      boundUser: bound || null,
      isLocked: true,
      policy: 'Aynı sunucudan / IP adresinden yalnızca tek bir kullanıcıya izin verilmektedir. Farklı kullanıcıların bu sunucudan oturum açması veya işlem yapması güvenlik kuralı gereği engellenmiştir.'
    });
  });

  app.post('/api/system/server-binding/reset', (req, res) => {
    const ip = getClientServerIp(req);
    serverUserBindings.delete(ip);
    res.json({
      success: true,
      message: `${ip} sunucu kullanıcı eşleşmesi sıfırlandı. Artık yeni bir kullanıcı bağlanabilir.`
    });
  });

  // 6. Admin / Defined Tutors Management API
  app.get('/api/admin/tutors', (req, res) => {
    res.json({
      success: true,
      data: tutorsDB,
      totalCount: tutorsDB.length,
      activeCount: tutorsDB.filter(t => t.status !== 'inactive').length
    });
  });

  // Define new tutor into system
  app.post('/api/admin/tutors', (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        title,
        university,
        subjects,
        password,
        accessCode,
        avatar,
        bio,
        dailyCapacity
      } = req.body;

      if (!name || !email || !subjects || !subjects.length) {
        return res.status(400).json({
          success: false,
          error: 'Lütfen Eğitmen Adı, E-posta ve Branş (Matematik / Geometri) alanlarını eksiksiz doldurun.'
        });
      }

      // Check for duplicate email
      const existing = tutorsDB.find(t => t.email && t.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          error: `"${email}" e-posta adresine sahip bir eğitmen zaten sisteme tanımlıdır.`
        });
      }

      const newTutorId = `tut-${Date.now()}`;
      const defaultAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      ];
      const selectedAvatar = avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

      const newTutor: Tutor = {
        id: newTutorId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '0555 000 0000',
        password: password ? password.trim() : '123456',
        accessCode: accessCode ? accessCode.trim().toUpperCase() : `KOD-${Math.floor(100 + Math.random() * 900)}`,
        title: title ? title.trim() : `${subjects.join(' & ')} Eğitmeni`,
        university: university ? university.trim() : 'Eğitim Fakültesi Mezunu',
        avatar: selectedAvatar,
        bio: bio ? bio.trim() : `${subjects.join(' & ')} alanında öğrencilere yazılı ve videolu soru çözüm desteği sunmaktadır.`,
        rating: 5.0,
        totalReviews: 0,
        solvedQuestionsCount: 0,
        videoSolutionsCount: 0,
        specialties: subjects,
        subjects,
        badges: ['Yeni Onaylı Eğitmen ⭐', 'Doğrulanmış Branş 📐'],
        averageResponseMinutes: 4.0,
        online: true,
        isAuthorized: true,
        status: 'active',
        dailyCapacity: dailyCapacity ? Number(dailyCapacity) : 25,
        definedAt: new Date().toISOString(),
        definedBy: 'Platform Yöneticisi',
        reviews: []
      };

      tutorsDB.unshift(newTutor);

      // System notification
      const adminNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'all',
        title: '👨‍🏫 Yeni Yetkili Eğitmen Tanımlandı!',
        message: `${newTutor.name} (${subjects.join(' & ')}) sisteme başarıyla eğitmen olarak eklendi.`,
        type: 'tutor_authorized',
        read: false,
        createdAt: new Date().toISOString()
      };
      notificationsDB.unshift(adminNotif);

      res.status(201).json({
        success: true,
        message: 'Eğitmen başarıyla tanımlandı ve sisteme kaydedildi.',
        data: newTutor
      });
    } catch (err: any) {
      console.error('Error defining tutor:', err);
      res.status(500).json({ success: false, error: 'Eğitmen tanımlanırken bir hata oluştu.' });
    }
  });

  // Update tutor status / details
  app.put('/api/admin/tutors/:id', (req, res) => {
    const tutor = tutorsDB.find(t => t.id === req.params.id);
    if (!tutor) {
      return res.status(404).json({ success: false, error: 'Eğitmen bulunamadı.' });
    }

    const { status, subjects, title, university, dailyCapacity, accessCode, phone } = req.body;
    if (status !== undefined) tutor.status = status;
    if (subjects) {
      tutor.subjects = subjects;
      tutor.specialties = subjects;
    }
    if (title) tutor.title = title;
    if (university) tutor.university = university;
    if (dailyCapacity) tutor.dailyCapacity = Number(dailyCapacity);
    if (accessCode) tutor.accessCode = accessCode;
    if (phone) tutor.phone = phone;

    res.json({ success: true, message: 'Eğitmen bilgileri güncellendi.', data: tutor });
  });

  // Remove / Revoke tutor authorization
  app.delete('/api/admin/tutors/:id', (req, res) => {
    const index = tutorsDB.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Eğitmen bulunamadı.' });
    }

    const removedTutor = tutorsDB.splice(index, 1)[0];
    res.json({ success: true, message: `${removedTutor.name} sistemden kaldırıldı.` });
  });

  // 7. Inactivity & Pending Question Alert Settings API
  app.get('/api/system/alert-settings', (req, res) => {
    res.json({ success: true, data: pendingAlertSettingsDB });
  });

  app.put('/api/system/alert-settings', (req, res) => {
    const { thresholdMinutes, autoReminderEnabled, soundAlertEnabled } = req.body;
    if (thresholdMinutes !== undefined) {
      pendingAlertSettingsDB.thresholdMinutes = Math.max(1, Number(thresholdMinutes));
    }
    if (autoReminderEnabled !== undefined) {
      pendingAlertSettingsDB.autoReminderEnabled = Boolean(autoReminderEnabled);
    }
    if (soundAlertEnabled !== undefined) {
      pendingAlertSettingsDB.soundAlertEnabled = Boolean(soundAlertEnabled);
    }
    pendingAlertSettingsDB.lastCheckedAt = new Date().toISOString();

    res.json({ success: true, data: pendingAlertSettingsDB, message: 'Bildirim ayarları güncellendi.' });
  });

  // Trigger instant reminder test for pending questions
  app.post('/api/system/trigger-urgent-reminder', (req, res) => {
    const { questionId } = req.body;
    let targetQuestions = questionsDB.filter(q => q.status === 'pending');
    if (questionId) {
      targetQuestions = targetQuestions.filter(q => q.id === questionId);
    }

    if (targetQuestions.length === 0) {
      return res.json({
        success: true,
        message: 'Havuzda bekleyen soru bulunamadı.',
        triggeredCount: 0
      });
    }

    let count = 0;
    const now = Date.now();
    for (const q of targetQuestions) {
      const createdTime = new Date(q.createdAt).getTime();
      const elapsedMinutes = Math.max(1, Math.floor((now - createdTime) / (60 * 1000)));
      q.lastReminderSentAt = new Date().toISOString();
      q.reminderCount = (q.reminderCount || 0) + 1;

      const urgentNotif: AppNotification = {
        id: `notif-urgent-${Date.now()}-${q.id}`,
        recipientRole: 'tutor',
        title: `⚠️ ACİL: ${elapsedMinutes} Dk'dır Bekleyen ${q.subject} Sorusu!`,
        message: `"${q.title}" (${q.gradeLevel}) sorusu ${elapsedMinutes} dakikadır yanıtsız bekliyor. Öğrenci ${q.studentName} acil çözüm bekliyor!`,
        type: 'pending_question_reminder',
        questionId: q.id,
        read: false,
        urgent: true,
        createdAt: new Date().toISOString()
      };
      notificationsDB.unshift(urgentNotif);
      count++;
    }

    res.json({
      success: true,
      message: `${count} adet bekleyen soru için eğitmenlere acil hatırlatma bildirimi gönderildi!`,
      triggeredCount: count,
      notifications: notificationsDB.slice(0, count)
    });
  });

  // 8. Server-Side Gemini Question Solver / Hint Assist
  app.post('/api/gemini/solve', async (req, res) => {
    try {
      const { title, subject, description, imageUrl } = req.body;
      const ai = getGemini();

      const prompt = `Sen Türkiye'nin en deneyimli YKS ve LGS öğretmenisin.
Ders: ${subject || 'Matematik'}
Soru Başlığı: ${title || 'Bilinmeyen Soru'}
Açıklama: ${description || 'Soru görseli incelenecektir.'}

Lütfen soru için pedagojik, detaylı ve anlaşılır bir çözüm hazırla.
Çıktıyı tam olarak aşağıdaki JSON formatında ver:
{
  "summary": "Sorunun ana fikri ve hangi kazanıma ait olduğu",
  "steps": [
    { "stepNumber": 1, "title": "1. Adım: Teorem veya Kural", "content": "Açıklama", "formula": "Gerekiyorsa formül" },
    { "stepNumber": 2, "title": "2. Adım: Denklem Çözümü", "content": "Açıklama", "formula": "Gerekiyorsa formül" },
    { "stepNumber": 3, "title": "3. Adım: Sonuç", "content": "Açıklama", "formula": "Sonuç" }
  ],
  "tutorNote": "Öğrenciye bu tarz sorular için altın değerinde bir sınav tüyosu"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed });
      }

      res.status(500).json({ success: false, error: 'Gemini yanıtı boş döndü.' });
    } catch (err: any) {
      console.error('Gemini solver error:', err);
      res.status(500).json({
        success: false,
        error: 'Yapay zeka çözümü üretilirken hata oluştu: ' + (err.message || 'Bilinmeyen hata')
      });
    }
  });

  // Reset free questions limit (for testing demo purpose)
  app.post('/api/student/reset-daily-limit', (req, res) => {
    studentProfileDB.activePlan = 'free';
    studentProfileDB.planName = 'Ücretsiz Standart';
    studentProfileDB.dailyStandardRemaining = 3;
    studentProfileDB.dailyStandardTotal = 3;
    studentProfileDB.weeklyStandardRemaining = 3;
    studentProfileDB.weeklyStandardTotal = 3;
    studentProfileDB.dailyVideoRemaining = 0;
    studentProfileDB.dailyVideoTotal = 0;
    res.json({ success: true, data: studentProfileDB });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SoruÇöz Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
