import React, { useState, useEffect, useCallback } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  StudentHomeView 
} from './components/StudentHomeView';
import { 
  QuestionHistory 
} from './components/QuestionHistory';
import { 
  TutorsList 
} from './components/TutorsList';
import { 
  SubscriptionPlans 
} from './components/SubscriptionPlans';
import { 
  StudentProfileView 
} from './components/StudentProfileView';
import { 
  TutorPoolView 
} from './components/TutorPoolView';
import { 
  AskQuestionModal 
} from './components/AskQuestionModal';
import { 
  SolutionDetailModal 
} from './components/SolutionDetailModal';
import { 
  TutorSolutionStudio 
} from './components/TutorSolutionStudio';
import { 
  NotificationCenter 
} from './components/NotificationCenter';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  ManageTutorsModal 
} from './components/ManageTutorsModal';
import { 
  PendingAlertBanner 
} from './components/PendingAlertBanner';
import { 
  PlayStoreModal 
} from './components/PlayStoreModal';
import { 
  AndroidBottomNav 
} from './components/AndroidBottomNav';
import { 
  AndroidSimulatorFrame 
} from './components/AndroidSimulatorFrame';
import { 
  WebsiteInfoView 
} from './components/WebsiteInfoView';
import { 
  UserRole, 
  Question, 
  Tutor, 
  StudentProfile, 
  AppNotification, 
  SubscriptionPlanId,
  CurrentUser,
  PendingAlertSettings
} from './types';
import { 
  INITIAL_QUESTIONS, 
  INITIAL_TUTORS, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_NOTIFICATIONS,
  DEFAULT_PENDING_ALERT_SETTINGS,
  DEMO_STUDENTS
} from './data/mockData';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Crown, 
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Smartphone,
  Play,
  Download,
  Camera
} from 'lucide-react';

export default function App() {
  // Core Roles and Navigation
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>({
    id: DEMO_STUDENTS[0].id,
    name: DEMO_STUDENTS[0].name,
    email: DEMO_STUDENTS[0].email,
    role: 'student',
    avatar: DEMO_STUDENTS[0].avatar,
    grade: DEMO_STUDENTS[0].grade,
    targetExam: DEMO_STUDENTS[0].targetExam
  });
  const [activeTab, setActiveTab] = useState<string>('ask');

  // Application Data States
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [alertSettings, setAlertSettings] = useState<PendingAlertSettings>(DEFAULT_PENDING_ALERT_SETTINGS);
  const [isTriggeringReminder, setIsTriggeringReminder] = useState<boolean>(false);

  // Modal and Drawer States
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isManageTutorsOpen, setIsManageTutorsOpen] = useState<boolean>(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState<boolean>(false);
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);
  const [selectedQuestionForDetail, setSelectedQuestionForDetail] = useState<Question | null>(null);
  const [selectedQuestionForStudio, setSelectedQuestionForStudio] = useState<Question | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-dismiss toast
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Listen for PWA Install Prompt (beforeinstallprompt event)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('matematikhocan.com başarıyla cihazınıza yükleniyor!', 'success');
        setDeferredPrompt(null);
      }
    } else {
      setIsPlayStoreModalOpen(true);
    }
  };

  // Fetch initial data from Express backend
  const fetchData = useCallback(async () => {
    try {
      const [qRes, tRes, pRes, nRes, aRes] = await Promise.all([
        fetch('/api/questions').catch(() => null),
        fetch('/api/tutors').catch(() => null),
        fetch('/api/student/profile').catch(() => null),
        fetch('/api/notifications').catch(() => null),
        fetch('/api/system/alert-settings').catch(() => null)
      ]);

      if (qRes && qRes.ok) {
        const qData = await qRes.json();
        const list = Array.isArray(qData) ? qData : (Array.isArray(qData?.data) ? qData.data : []);
        setQuestions(list);
      }
      if (tRes && tRes.ok) {
        const tData = await tRes.json();
        const list = Array.isArray(tData) ? tData : (Array.isArray(tData?.data) ? tData.data : []);
        setTutors(list);
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setStudentProfile(pData?.data || pData?.profile || pData);
      }
      if (nRes && nRes.ok) {
        const nData = await nRes.json();
        const list = Array.isArray(nData) ? nData : (Array.isArray(nData?.data) ? nData.data : []);
        setNotifications(list);
      }
      if (aRes && aRes.ok) {
        const aData = await aRes.json();
        setAlertSettings(aData?.data || aData);
      }
    } catch (err) {
      console.warn('Backend API connection in fallback mode:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Periodic simulated sync for lively feel & pending question watcher updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle Login Event from AuthModal
  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'student') {
      setActiveTab('ask');
      setStudentProfile(prev => ({
        ...prev,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || prev.avatar,
        grade: user.grade || prev.grade,
        targetExam: user.targetExam || prev.targetExam
      }));
      showToast(`Hoş geldin, ${user.name}! Öğrenci oturumu açıldı.`, 'success');
    } else {
      setActiveTab('tutor-pool');
      showToast(`Hoş geldiniz, ${user.name}! Yetkili Eğitmen oturumu aktif.`, 'success');
    }
  };

  // Quick switch to tutor from ManageTutorsModal
  const handleLoginAsSpecificTutor = (user: CurrentUser, tutor: Tutor) => {
    setCurrentUser(user);
    setCurrentRole('tutor');
    setActiveTab('tutor-pool');
    showToast(`"${tutor.name}" olarak giriş yapıldı.`, 'success');
  };

  // Trigger Instant Pending Question Reminder Dispatch
  const handleTriggerUrgentReminder = async () => {
    setIsTriggeringReminder(true);
    try {
      const res = await fetch('/api/system/trigger-urgent-reminder', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Eğitmenlere acil bekleyen soru bildirimi gönderildi!', 'success');
        fetchData();
      } else {
        showToast(data.error || 'Bildirim tetiklenemedi.', 'error');
      }
    } catch (err) {
      showToast('Bildirim sistemi çalıştırıldı.', 'info');
    } finally {
      setIsTriggeringReminder(false);
    }
  };

  // Handle Question Submission (Student)
  const handleAskQuestionSubmit = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          studentId: currentUser?.id || studentProfile.id || 'std-101',
          studentEmail: currentUser?.email || studentProfile.email,
          studentName: currentUser?.name || studentProfile.name,
          studentAvatar: currentUser?.avatar || studentProfile.avatar
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        showToast(errData.error || 'Soru gönderilemedi.', 'error');
        return false;
      }

      const resJson = await res.json();
      const newQuestion: Question = resJson.data || resJson;
      setQuestions(prev => [newQuestion, ...(Array.isArray(prev) ? prev : [])]);

      // Deduct quota
      if (payload.requestedSolutionType === 'video') {
        setStudentProfile(prev => ({
          ...prev,
          dailyVideoRemaining: Math.max(0, prev.dailyVideoRemaining - 1)
        }));
      } else {
        setStudentProfile(prev => {
          const newRemaining = Math.max(0, prev.dailyStandardRemaining - 1);
          return {
            ...prev,
            dailyStandardRemaining: newRemaining,
            weeklyStandardRemaining: prev.activePlan === 'free' ? newRemaining : prev.weeklyStandardRemaining
          };
        });
      }

      // Add local notification
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Soru Havuza İletildi 🚀',
        message: `"${payload.title}" sorunuz eğitmenlerimize iletildi. Çözüm başladığında bildirim alacaksınız.`,
        type: 'new_question_available',
        recipientRole: 'all',
        read: false,
        createdAt: 'Az önce',
        questionId: newQuestion.id
      };
      setNotifications(prev => [newNotif, ...(Array.isArray(prev) ? prev : [])]);

      showToast('Sorunuz başarıyla gönderildi! Uzman öğretmenimiz çözmeye başlıyor.', 'success');
      return true;
    } catch (err: any) {
      // Fallback local insertion if backend error
      const fallbackQ: Question = {
        id: `q-${Date.now()}`,
        studentId: currentUser?.id || studentProfile.id || 'std-101',
        title: payload.title,
        description: payload.description,
        subject: payload.subject,
        gradeLevel: payload.gradeLevel,
        imageUrl: payload.imageUrl,
        studentName: currentUser?.name || studentProfile.name,
        studentAvatar: currentUser?.avatar || studentProfile.avatar,
        status: 'pending',
        requestedSolutionType: payload.requestedSolutionType,
        createdAt: 'Az önce'
      };
      setQuestions(prev => [fallbackQ, ...(Array.isArray(prev) ? prev : [])]);
      if (payload.requestedSolutionType === 'video') {
        setStudentProfile(prev => ({ ...prev, dailyVideoRemaining: Math.max(0, prev.dailyVideoRemaining - 1) }));
      } else {
        setStudentProfile(prev => ({ ...prev, dailyStandardRemaining: Math.max(0, prev.dailyStandardRemaining - 1) }));
      }
      showToast('Sorunuz oluşturuldu! Eğitmen havuzuna eklendi.', 'success');
      return true;
    }
  };

  // Handle Tutor Claim & Open Solution Studio
  const handleTutorClaimAndSolve = async (question: Question, tutor: Tutor) => {
    try {
      await fetch(`/api/questions/${question.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: tutor.id,
          tutorName: tutor.name,
          tutorAvatar: tutor.avatar,
          tutorTitle: tutor.title
        })
      });

      // Update question state
      const updatedQ: Question = {
        ...question,
        status: 'in_progress',
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatar: tutor.avatar,
        tutorTitle: tutor.title
      };
      setQuestions(prev => (Array.isArray(prev) ? prev : []).map(q => q.id === question.id ? updatedQ : q));
      setSelectedQuestionForStudio(updatedQ);
    } catch (err) {
      setSelectedQuestionForStudio({
        ...question,
        status: 'in_progress',
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatar: tutor.avatar,
        tutorTitle: tutor.title
      });
    }
  };

  // Handle Tutor Solution Submission
  const handleTutorSolveSubmit = async (solutionPayload: any): Promise<boolean> => {
    if (!selectedQuestionForStudio) return false;
    const qId = selectedQuestionForStudio.id;

    try {
      const res = await fetch(`/api/questions/${qId}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solutionPayload)
      });

      let updatedQuestion: Question;
      if (res.ok) {
        const resJson = await res.json();
        updatedQuestion = resJson.data || resJson;
      } else {
        updatedQuestion = {
          ...selectedQuestionForStudio,
          status: 'solved',
          solution: solutionPayload
        };
      }

      setQuestions(prev => (Array.isArray(prev) ? prev : []).map(q => q.id === qId ? updatedQuestion : q));

      // Push notification for student
      const solveNotif: AppNotification = {
        id: `notif-sol-${Date.now()}`,
        title: 'Çözümünüz Hazır! 🎉',
        message: `${selectedQuestionForStudio.tutorName || 'Eğitmeniniz'} "${selectedQuestionForStudio.title}" sorunuzun ${solutionPayload.type === 'video' ? '1080p HD videolu' : 'yazılı'} çözümünü tamamladı.`,
        type: 'question_solved',
        recipientRole: 'student',
        read: false,
        createdAt: 'Az önce',
        questionId: qId
      };
      setNotifications(prev => [solveNotif, ...(Array.isArray(prev) ? prev : [])]);

      showToast('Çözüm başarıyla yüklendi ve öğrenciye iletildi!', 'success');
      return true;
    } catch (err) {
      showToast('Çözüm kaydedildi.', 'success');
      return true;
    }
  };

  // Handle Student Rating & Review Submit
  const handleRateSubmit = async (questionId: string, rating: { score: number; comment: string; tags: string[] }): Promise<boolean> => {
    try {
      const res = await fetch(`/api/questions/${questionId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rating)
      });

      if (res.ok) {
        const resJson = await res.json();
        const updated: Question = resJson.data || resJson;
        setQuestions(prev => (Array.isArray(prev) ? prev : []).map(q => q.id === questionId ? updated : q));
        if (selectedQuestionForDetail?.id === questionId) {
          setSelectedQuestionForDetail(updated);
        }
      } else {
        setQuestions(prev => (Array.isArray(prev) ? prev : []).map(q => q.id === questionId ? { ...q, rating: { ...rating, createdAt: 'Az önce' } } : q));
      }

      // Add notification for tutor
      const rateNotif: AppNotification = {
        id: `notif-rate-${Date.now()}`,
        title: 'Yeni Değerlendirme Alındı ⭐',
        message: `Öğrenci çözümünüze ${rating.score} yıldız verdi: "${rating.comment || 'Harika çözüm!'}"`,
        type: 'rating_received',
        recipientRole: 'tutor',
        read: false,
        createdAt: 'Az önce',
        questionId
      };
      setNotifications(prev => [rateNotif, ...(Array.isArray(prev) ? prev : [])]);

      showToast('Değerlendirmeniz kaydedildi! Geri bildiriminiz için teşekkürler.', 'success');
      return true;
    } catch (err) {
      showToast('Puan kaydedildi.', 'success');
      return true;
    }
  };

  // Handle Subscription Plan Purchase
  const handleSubscribe = async (planId: SubscriptionPlanId): Promise<boolean> => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data.profile || data.data || data);
      } else {
        // Local state update
        const limits: Record<SubscriptionPlanId, { standard: number; video: number; name: string }> = {
          free: { standard: 3, video: 0, name: 'Ücretsiz Başlangıç' },
          weekly: { standard: 10, video: 3, name: 'Haftalık Yoğun Paket' },
          monthly: { standard: 25, video: 10, name: 'Aylık Süper Sınav Paketi' },
          three_months: { standard: 100, video: 50, name: '3 Aylık VIP Dönemlik Paket' }
        };
        const pInfo = limits[planId];
        setStudentProfile(prev => ({
          ...prev,
          activePlan: planId,
          planName: pInfo.name,
          dailyStandardRemaining: pInfo.standard,
          dailyStandardTotal: pInfo.standard,
          weeklyStandardRemaining: planId === 'free' ? 3 : undefined,
          weeklyStandardTotal: planId === 'free' ? 3 : undefined,
          dailyVideoRemaining: pInfo.video,
          dailyVideoTotal: pInfo.video
        }));
      }

      // Notification
      const subNotif: AppNotification = {
        id: `notif-sub-${Date.now()}`,
        title: 'Abonelik Paketi Aktifleşti 👑',
        message: `Yeni paketiniz başarıyla tanımlandı. Soru limitleriniz artırıldı!`,
        type: 'subscription_updated',
        recipientRole: 'student',
        read: false,
        createdAt: 'Az önce'
      };
      setNotifications(prev => [subNotif, ...(Array.isArray(prev) ? prev : [])]);

      showToast('Paketiniz başarıyla aktif edildi! Soru limitleriniz güncellendi.', 'success');
      return true;
    } catch (err) {
      showToast('Paket aktif edildi.', 'success');
      return true;
    }
  };

  // Reset Limits Demo Shortcut (Weekly 3 free questions policy testing)
  const handleResetLimitsDemo = async () => {
    try {
      const res = await fetch('/api/student/profile/reset-limits', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data.profile);
      } else {
        setStudentProfile(prev => ({
          ...prev,
          activePlan: 'free',
          planName: 'Ücretsiz Başlangıç',
          dailyStandardRemaining: 3,
          dailyStandardTotal: 3,
          weeklyStandardRemaining: 3,
          weeklyStandardTotal: 3,
          dailyVideoRemaining: 0,
          dailyVideoTotal: 0
        }));
      }
      showToast('Haftalık haklar sıfırlandı: Haftada 3 adet ücretsiz standart soru tanımlandı.', 'info');
    } catch (err) {
      setStudentProfile(prev => ({
        ...prev,
        activePlan: 'free',
        planName: 'Ücretsiz Başlangıç',
        dailyStandardRemaining: 3,
        dailyStandardTotal: 3,
        weeklyStandardRemaining: 3,
        weeklyStandardTotal: 3,
        dailyVideoRemaining: 0,
        dailyVideoTotal: 0
      }));
      showToast('Haftalık haklar sıfırlandı.', 'info');
    }
  };

  // Notification mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    try {
      fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (e) {}
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Notification click routing
  const handleNotificationClick = (notification: AppNotification) => {
    if (notification.questionId) {
      const targetQ = questions.find(q => q.id === notification.questionId);
      if (targetQ) {
        if (targetQ.status === 'solved') {
          setSelectedQuestionForDetail(targetQ);
        } else if (currentRole === 'tutor') {
          setSelectedQuestionForStudio(targetQ);
        } else {
          setActiveTab('history');
        }
      }
    }
    setIsNotificationCenterOpen(false);
  };

  // Active tutor object for studio (matching current logged-in tutor or default)
  const currentActiveTutor = tutors.find(t => t.id === currentUser?.id) || tutors[0];

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold text-white ${
            toastMessage.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
            toastMessage.type === 'error' ? 'bg-rose-600 border-rose-500' :
            'bg-slate-900 border-slate-800'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-md">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={role => setCurrentRole(role)}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        studentProfile={studentProfile}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenAskQuestion={() => setIsAskModalOpen(true)}
        onOpenSubscribe={() => setActiveTab('subscription')}
        onResetLimitsDemo={handleResetLimitsDemo}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenManageTutors={() => setIsManageTutorsOpen(true)}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
        isSimulatorActive={isSimulatorActive}
        onToggleSimulator={() => setIsSimulatorActive(prev => !prev)}
      />

      {/* ANDROID SIMULATOR FRAME WRAPPER */}
      <AndroidSimulatorFrame
        isSimulatorActive={isSimulatorActive}
        onToggleSimulator={() => setIsSimulatorActive(false)}
        onOpenAskQuestion={() => setIsAskModalOpen(true)}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
      >
        {/* FLOATING ANNOUNCEMENT BANNER */}
        {showInstallBanner && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 text-white px-4 py-2.5 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md font-serif font-black text-sm">
                  π
                </div>
                <p className="text-slate-200">
                  <strong className="text-white">matematikhocan.com:</strong> Türkiye'nin Matematik & Geometri Soru Çözüm Web Sitesi. Takıldığın her soruya 10 dakikada HD videolu çözüm al!
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-[11px] flex items-center gap-1.5 transition shadow-sm"
                >
                  <Camera className="w-3 h-3" />
                  <span>Soru Sor (Ücretsiz)</span>
                </button>
                <button
                  onClick={() => setIsPlayStoreModalOpen(true)}
                  className="hidden sm:flex px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[11px] items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3 h-3" />
                  <span>Mobil Uygulama</span>
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-md transition"
                  title="Kapat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-8">
          
          {/* PENDING QUESTION ALERT BANNER FOR TUTORS */}
          {currentRole === 'tutor' && (
            <PendingAlertBanner
              pendingQuestions={questions.filter(q => q.status === 'pending')}
              thresholdMinutes={alertSettings.thresholdMinutes || 5}
              onSelectQuestion={q => handleTutorClaimAndSolve(q, currentActiveTutor)}
              onTriggerUrgentReminder={handleTriggerUrgentReminder}
              isTriggering={isTriggeringReminder}
              onOpenSettings={() => setIsManageTutorsOpen(true)}
            />
          )}

          {/* STUDENT VIEWS */}
          {currentRole === 'student' && (
            <>
              {activeTab === 'ask' && (
                <StudentHomeView
                  questions={questions}
                  studentProfile={studentProfile}
                  tutors={tutors}
                  onOpenAskQuestion={() => setIsAskModalOpen(true)}
                  onOpenSubscribe={() => setActiveTab('subscription')}
                  onSelectQuestion={q => setSelectedQuestionForDetail(q)}
                  onNavigateToHistory={() => setActiveTab('history')}
                  onNavigateToTutors={() => setActiveTab('tutors')}
                />
              )}

              {activeTab === 'history' && (
                <QuestionHistory
                  questions={questions}
                  onSelectQuestion={q => setSelectedQuestionForDetail(q)}
                  onOpenAskQuestion={() => setIsAskModalOpen(true)}
                />
              )}

              {activeTab === 'tutors' && (
                <TutorsList
                  tutors={tutors}
                  onSelectTutorToAsk={() => setIsAskModalOpen(true)}
                />
              )}

              {activeTab === 'subscription' && (
                <SubscriptionPlans
                  studentProfile={studentProfile}
                  onSubscribe={handleSubscribe}
                />
              )}

              {activeTab === 'guide' && (
                <WebsiteInfoView
                  onOpenAskQuestion={() => setIsAskModalOpen(true)}
                  onOpenSubscribe={() => setActiveTab('subscription')}
                  onNavigateToTutors={() => setActiveTab('tutors')}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'profile' && (
                <StudentProfileView
                  studentProfile={studentProfile}
                  totalQuestionsCount={questions.length}
                  solvedQuestionsCount={questions.filter(q => q.status === 'solved').length}
                  onOpenSubscribe={() => setActiveTab('subscription')}
                  onResetLimitsDemo={handleResetLimitsDemo}
                  onNavigateToHistory={() => setActiveTab('history')}
                />
              )}
            </>
          )}

          {/* TUTOR VIEWS */}
          {currentRole === 'tutor' && (
            <TutorPoolView
              questions={questions}
              tutors={tutors}
              activeSubTab={activeTab as any}
              onSubTabChange={tab => setActiveTab(tab)}
              onClaimAndSolve={(q, t) => handleTutorClaimAndSolve(q, t)}
              onViewSolution={q => setSelectedQuestionForDetail(q)}
            />
          )}
        </main>

        {/* ANDROID NATIVE MOBILE BOTTOM NAVIGATION */}
        <AndroidBottomNav
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          onOpenAskQuestion={() => setIsAskModalOpen(true)}
          pendingCount={questions.filter(q => q.status === 'pending').length}
          unreadCount={notifications.filter(n => !n.read).length}
        />

        {/* COMPREHENSIVE WEB PORTAL FOOTER */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-16 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
              
              {/* Brand Column */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-serif font-black text-lg shadow-md">
                    π
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    matematik<span className="text-indigo-400">hocan</span><span className="text-amber-400 text-sm">.com</span>
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                  Türkiye'nin en seçkin matematik ve geometri öğretmenlerini öğrencilerle buluşturan bağımsız soru çözüm web sitesi. Yapamadığın her soruya 10 dakikada formüllü yazılı ve HD videolu çözüm.
                </p>
                <div className="flex items-center gap-2 pt-1 text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    https://matematikhocan.com
                  </span>
                </div>
              </div>

              {/* Navigation Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Hızlı Erişim</h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button onClick={() => { setActiveTab('ask'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">
                      Soru Sor & Çözdür
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('tutors'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">
                      Matematik Hocalarımız
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('subscription'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">
                      Fiyatlandırma & Paketler
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">
                      Çözüm Arşivi & Videolar
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">
                      Rehberlik & SSS
                    </button>
                  </li>
                </ul>
              </div>

              {/* Exam Categories Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Soru Kategorileri</h4>
                <ul className="space-y-2 text-xs">
                  <li className="text-slate-400">YKS TYT Matematik</li>
                  <li className="text-slate-400">YKS AYT Matematik</li>
                  <li className="text-slate-400">Geometri & Analitik</li>
                  <li className="text-slate-400">LGS 8. Sınıf Yeni Nesil</li>
                  <li className="text-slate-400">KPSS & DGS Sayısal</li>
                  <li className="text-slate-400">9-12. Sınıf Okul Yazılıları</li>
                </ul>
              </div>

              {/* Support & Admin Tools Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Destek & Mobil</h4>
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">
                    E-Posta: <span className="text-indigo-400 font-mono">destek@matematikhocan.com</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    WhatsApp: <span className="text-emerald-400 font-mono">+90 850 305 62 81</span>
                  </div>
                  <button
                    onClick={() => setIsPlayStoreModalOpen(true)}
                    className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                    <span>Android / Mobil Uygulama</span>
                  </button>
                  <button
                    onClick={() => setIsManageTutorsOpen(true)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Eğitmen Portalı</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>© 2026 <strong>matematikhocan.com</strong>. Tüm hakları saklıdır.</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">256-Bit SSL Şifreli Güvenli Web Altyapısı</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Her hafta 3 soru ücretsiz</span>
                <button
                  onClick={handleResetLimitsDemo}
                  className="text-indigo-400 hover:underline font-bold"
                  title="Demo amaçlı haftalık 3 ücretsiz soru hakkını yeniler"
                >
                  Limitleri Yenile (Demo)
                </button>
              </div>
            </div>
          </div>
        </footer>
      </AndroidSimulatorFrame>

      {/* MODALS */}
      {/* 1. Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={handleAskQuestionSubmit}
        studentProfile={studentProfile}
        onOpenSubscribe={() => {
          setIsAskModalOpen(false);
          setActiveTab('subscription');
        }}
      />

      {/* 2. Solution Detail & Video Player / Rating Modal */}
      {selectedQuestionForDetail && (
        <SolutionDetailModal
          question={selectedQuestionForDetail}
          isOpen={true}
          onClose={() => setSelectedQuestionForDetail(null)}
          onRateSubmit={handleRateSubmit}
        />
      )}

      {/* 3. Tutor Solution Studio (HD Video & Whiteboard Editor) */}
      {selectedQuestionForStudio && (
        <TutorSolutionStudio
          question={selectedQuestionForStudio}
          currentTutor={currentActiveTutor}
          onClose={() => setSelectedQuestionForStudio(null)}
          onSolveSubmit={handleTutorSolveSubmit}
        />
      )}

      {/* 4. Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        currentRole={currentRole}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* 5. Separate Auth Modal (Student & Authorized Tutor Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenManageTutors={() => {
          setIsAuthModalOpen(false);
          setIsManageTutorsOpen(true);
        }}
      />

      {/* 6. Admin Manage Tutors Modal (Sisteme Eğitmen Tanımla) */}
      <ManageTutorsModal
        isOpen={isManageTutorsOpen}
        onClose={() => setIsManageTutorsOpen(false)}
        tutors={tutors}
        onTutorsUpdated={fetchData}
        onLoginAsTutor={handleLoginAsSpecificTutor}
      />

      {/* 7. Google Play Store & Android PWA/TWA Modal */}
      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
      />
    </div>
  );
}
