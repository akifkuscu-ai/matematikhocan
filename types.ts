export type UserRole = 'student' | 'tutor' | 'admin';

export type Subject = 
  | 'Matematik'
  | 'Geometri';

export type MathTopic = 
  | 'Temel Kavramlar & Sayılar'
  | 'Denklemler & Eşitsizlikler'
  | 'Fonksiyonlar & Polinomlar'
  | 'Trigonometri'
  | 'Limit & Süreklilik'
  | 'Türev & Uygulamaları'
  | 'İntegral'
  | 'Olasılık, Permütasyon & Kombinasyon'
  | 'Problemler (Yaş, İşçi, Hız, Yüzde, Kar-Zarar)'
  | 'Logaritma & Diziler'
  | 'Üçgenler & Benzerlik'
  | 'Özel Dörtgenler & Çokgenler'
  | 'Çember & Daire'
  | 'Analitik Geometri'
  | 'Katı Cisimler (Prizma, Piramit, Koni, Küre)'
  | 'Dönüşüm Geometrisi & Vektörler';

export type GradeLevel = 
  | 'LGS (8. Sınıf)'
  | '9. Sınıf'
  | '10. Sınıf'
  | '11. Sınıf'
  | '12. Sınıf'
  | 'TYT / AYT (YKS)'
  | 'KPSS / DGS / ALES';

export type SolutionType = 'standard' | 'video';

export type QuestionStatus = 'pending' | 'in_progress' | 'solved';

export interface VideoBookmark {
  id: string;
  time: number; // in seconds
  timeLabel: string; // "00:45"
  title: string;
  description: string;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  content: string;
  formula?: string;
  timestamp?: string;
}

export interface QuestionSolution {
  type: SolutionType;
  textExplanation: string;
  steps: SolutionStep[];
  solutionImageUrl?: string;
  videoUrl?: string;
  videoThumbnailUrl?: string;
  videoDuration?: number; // in seconds
  videoQuality?: string; // e.g. "1080p 60fps HD"
  videoBookmarks?: VideoBookmark[];
  tutorNotes?: string;
  submittedAt: string;
}

export interface QuestionRating {
  score: number; // 1 to 5
  comment: string;
  tags: string[];
  ratedAt: string;
}

export interface AIAnalysis {
  detectedSubject: string;
  detectedTopic: string;
  extractedQuestionText?: string;
  keyFormulas: string[];
  hints: string[];
  instantSolutionOutline: string;
  confidenceScore: number;
}

export interface Question {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  title: string;
  description: string;
  imageUrl: string;
  requestedSolutionType: SolutionType;
  status: QuestionStatus;
  createdAt: string;
  solvedAt?: string;
  tutorId?: string;
  tutorName?: string;
  tutorAvatar?: string;
  tutorTitle?: string;
  solution?: QuestionSolution;
  rating?: QuestionRating;
  aiAnalysis?: AIAnalysis;
  priority?: boolean;
  lastReminderSentAt?: string;
  reminderCount?: number;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  score: number;
  comment: string;
  date: string;
  tags: string[];
  subject: string;
}

export interface Tutor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  university: string;
  rating: number;
  totalReviews: number;
  solvedQuestionsCount: number;
  videoSolutionsCount?: number;
  specialties?: Subject[];
  subjects?: Subject[];
  badges: string[];
  averageResponseMinutes?: number;
  averageResponseTimeMinutes?: number;
  reviews?: TutorReview[];
  online?: boolean;
  // Auth & Admin management fields
  email?: string;
  phone?: string;
  password?: string;
  accessCode?: string;
  status?: 'active' | 'inactive';
  isAuthorized?: boolean;
  dailyCapacity?: number;
  definedAt?: string;
  definedBy?: string;
}

export interface AuthorizedTutorDefinition {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  university: string;
  subjects: Subject[];
  avatar: string;
  bio: string;
  accessCode: string;
  status: 'active' | 'inactive';
  dailyCapacity: number;
  definedAt: string;
  definedBy: string;
  solvedCount?: number;
  rating?: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  avatar: string;
  title?: string;
  grade?: string;
  targetExam?: string;
  subject?: Subject[];
  isAuthorized?: boolean;
}

export interface PendingAlertSettings {
  thresholdMinutes: number; // e.g. 5, 10, 15
  autoReminderEnabled: boolean;
  soundAlertEnabled: boolean;
  lastCheckedAt?: string;
}

export type SubscriptionPlanId = 'free' | 'weekly' | 'monthly' | 'three_months';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  durationLabel: string;
  price: number;
  periodText: string;
  dailyStandardLimit: number;
  dailyVideoLimit: number;
  weeklyStandardLimit?: number; // Weekly 3 free questions for free tier
  priorityQueue: boolean;
  hdVideoAllowed: boolean;
  oneOnOneCoaching: boolean;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export interface StudentProfile {
  id?: string;
  name: string;
  avatar: string;
  email: string;
  grade?: string;
  activePlan: SubscriptionPlanId;
  planName: string;
  planExpiresAt?: string;
  dailyStandardRemaining: number;
  dailyStandardTotal: number;
  dailyVideoRemaining: number;
  dailyVideoTotal: number;
  weeklyStandardRemaining?: number; // Weekly 3 questions for free plan
  weeklyStandardTotal?: number; // 3 for free plan
  weeklyResetDate?: string;
  totalQuestionsAsked?: number;
  totalSolvedQuestions?: number;
  favoriteSubjects?: Subject[];
  targetExam?: string;
}

export interface ServerBindingInfo {
  serverIp: string;
  boundUser: {
    userId: string;
    name: string;
    email: string;
    role: 'student' | 'tutor';
    boundAt: string;
    lastActiveAt?: string;
  } | null;
  isLocked: boolean;
  policy: string;
}

export interface OnlineCourse {
  id: string;
  title: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  description: string;
  instructorName: string;
  instructorTitle?: string;
  price: number; // Manually entered price in TL
  thumbnailUrl: string;
  videoUrl: string;
  durationMinutes: number;
  lessonPdfUrl?: string;
  lessonPdfTitle?: string;
  homeworkPdfUrl?: string;
  homeworkPdfTitle?: string;
  createdAt: string;
  purchased?: boolean;
}

export type NotificationType = 
  | 'solution_ready'
  | 'question_solved'
  | 'question_claimed'
  | 'question_in_progress'
  | 'rating_received'
  | 'new_question_available'
  | 'pending_question_reminder'
  | 'tutor_authorized'
  | 'subscription_active'
  | 'subscription_updated'
  | 'course_purchased'
  | 'system';

export interface AppNotification {
  id: string;
  recipientRole: 'student' | 'tutor' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: NotificationType;
  questionId?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  urgent?: boolean;
}
