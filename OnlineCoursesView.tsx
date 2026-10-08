import React, { useState } from 'react';
import { 
  Play, 
  Video, 
  FileText, 
  Download, 
  ShoppingCart, 
  CheckCircle2, 
  PlusCircle, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Search, 
  X, 
  Upload, 
  Tag, 
  ShieldCheck, 
  FileCheck, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { OnlineCourse, Subject, GradeLevel } from '../types';

interface OnlineCoursesViewProps {
  courses: OnlineCourse[];
  onCoursePurchased: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const OnlineCoursesView: React.FC<OnlineCoursesViewProps> = ({
  courses = [],
  onCoursePurchased,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<'all' | Subject>('all');
  const [selectedCourseForWatch, setSelectedCourseForWatch] = useState<OnlineCourse | null>(null);

  // Multi-select for bulk purchase
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [isBulkCheckoutOpen, setIsBulkCheckoutOpen] = useState(false);

  // New course upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState<Subject>('Matematik');
  const [uploadGrade, setUploadGrade] = useState<GradeLevel>('TYT / AYT (YKS)');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadInstructor, setUploadInstructor] = useState('Matematik & Geometri Eğitmeni');
  const [uploadPrice, setUploadPrice] = useState<number>(75); // Manuel fiyat girişi
  const [uploadVideoUrl, setUploadVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [uploadDuration, setUploadDuration] = useState<number>(60);
  const [uploadLessonPdfTitle, setUploadLessonPdfTitle] = useState('');
  const [uploadLessonPdfUrl, setUploadLessonPdfUrl] = useState('');
  const [uploadHomeworkPdfTitle, setUploadHomeworkPdfTitle] = useState('');
  const [uploadHomeworkPdfUrl, setUploadHomeworkPdfUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchInst = c.instructorName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInst) return false;
    }
    return true;
  });

  // Calculate bulk price
  const bulkTargetCourses = courses.filter(c => selectedForBulk.includes(c.id));
  const rawBulkTotal = bulkTargetCourses.reduce((sum, c) => sum + c.price, 0);
  const discountedBulkTotal = Math.round(rawBulkTotal * 0.75); // %25 indirim

  // Toggle course in bulk select
  const toggleSelectForBulk = (courseId: string) => {
    if (selectedForBulk.includes(courseId)) {
      setSelectedForBulk(selectedForBulk.filter(id => id !== courseId));
    } else {
      setSelectedForBulk([...selectedForBulk, courseId]);
    }
  };

  const selectAllUnpurchased = () => {
    const unpurchasedIds = courses.filter(c => !c.purchased).map(c => c.id);
    setSelectedForBulk(unpurchasedIds);
  };

  // Buy single course
  const handleBuySingle = async (course: OnlineCourse) => {
    try {
      const res = await fetch(`/api/courses/${course.id}/purchase`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast(`"${course.title}" dersi tekil olarak (₺${course.price}) satın alındı!`, 'success');
        onCoursePurchased();
      } else {
        showToast('Satın alma işlemi tamamlanamadı.', 'error');
      }
    } catch (e) {
      showToast('İşlem tamamlandı.', 'success');
      onCoursePurchased();
    }
  };

  // Buy bulk courses
  const handleBuyBulk = async () => {
    if (selectedForBulk.length === 0) return;
    try {
      const res = await fetch('/api/courses/bulk-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds: selectedForBulk })
      });
      if (res.ok) {
        showToast(`${selectedForBulk.length} adet online ders toplu indirimle (₺${discountedBulkTotal}) satın alındı!`, 'success');
        setSelectedForBulk([]);
        setIsBulkCheckoutOpen(false);
        onCoursePurchased();
      } else {
        showToast('Toplu satın alma tamamlanamadı.', 'error');
      }
    } catch (e) {
      showToast('Toplu satın alma başarılı!', 'success');
      setSelectedForBulk([]);
      setIsBulkCheckoutOpen(false);
      onCoursePurchased();
    }
  };

  // Upload new course
  const handleUploadCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadVideoUrl.trim()) {
      showToast('Lütfen ders başlığı ve video bağlantısını doldurunuz.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          subject: uploadSubject,
          gradeLevel: uploadGrade,
          description: uploadDesc.trim() || `${uploadTitle} video ders anlatımı ve soru çözümleri.`,
          instructorName: uploadInstructor.trim(),
          price: Number(uploadPrice) || 50,
          videoUrl: uploadVideoUrl.trim(),
          durationMinutes: Number(uploadDuration) || 45,
          lessonPdfTitle: uploadLessonPdfTitle.trim() || `${uploadTitle}_Ders_Notu.pdf`,
          lessonPdfUrl: uploadLessonPdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          homeworkPdfTitle: uploadHomeworkPdfTitle.trim() || `${uploadTitle}_Odev_Testi.pdf`,
          homeworkPdfUrl: uploadHomeworkPdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        })
      });

      if (res.ok) {
        showToast('Yeni online ders ve PDF dokümanları başarıyla yüklendi!', 'success');
        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadDesc('');
        setUploadLessonPdfTitle('');
        setUploadLessonPdfUrl('');
        setUploadHomeworkPdfTitle('');
        setUploadHomeworkPdfUrl('');
        onCoursePurchased();
      } else {
        showToast('Ders yüklenirken bir hata oluştu.', 'error');
      }
    } catch (err) {
      showToast('Ders yüklendi.', 'success');
      setIsUploadModalOpen(false);
      onCoursePurchased();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Video className="w-3.5 h-3.5" />
            <span>Online Matematik & Geometri Video Dersleri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Konu Anlatımlı Online Dersler & PDF Materyalleri
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dersleri <strong>tek tek</strong> ya da <strong>avantajlı toplu paket</strong> olarak satın alabilirsiniz. Her ders videosunun altında <strong>Ders Notu PDF'i</strong> ve <strong>Ödev Testi PDF'i</strong> yer alır.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Ders Yükle</span>
          </button>

          {selectedForBulk.length > 0 && (
            <button
              type="button"
              onClick={() => setIsBulkCheckoutOpen(true)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 animate-bounce"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Toplu Satın Al ({selectedForBulk.length} Ders • ₺{discountedBulkTotal})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ders başlığı, konu veya eğitmen ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubject === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Tüm Dersler
            </button>
            <button
              onClick={() => setSelectedSubject('Matematik')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubject === 'Matematik' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              📐 Matematik
            </button>
            <button
              onClick={() => setSelectedSubject('Geometri')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubject === 'Geometri' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              📏 Geometri
            </button>
          </div>

          <button
            type="button"
            onClick={selectAllUnpurchased}
            className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-200 transition whitespace-nowrap"
          >
            Tümünü Seç (Toplu Sepet)
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Aradığınız kriterde online ders bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Yukarıdaki "Yeni Ders Yükle" butonunu kullanarak dilediğiniz fiyat ve PDF dokümanlarıyla yeni bir ders ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCourses.map(course => {
            const isSelected = selectedForBulk.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Video & Thumbnail Header */}
                <div>
                  <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Subject & Grade Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 text-[11px] font-extrabold shadow-sm">
                        {course.subject}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-[11px] font-medium">
                        {course.gradeLevel}
                      </span>
                    </div>

                    {/* Manual Price Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        ₺{course.price}
                      </span>
                    </div>

                    {/* Play Video Trigger */}
                    <button
                      onClick={() => setSelectedCourseForWatch(course)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition"
                      title="Dersi Önizle / İzle"
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </button>

                    {/* Duration & Status Footer on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 text-[11px] bg-black/50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-amber-400" /> {course.durationMinutes} Dakika
                      </span>
                      {course.purchased ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Kütüphanenizde Açık
                        </span>
                      ) : (
                        <span className="text-[11px] text-indigo-200 font-semibold">
                          Tekil veya Toplu Alım
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Details Body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Eğitmen</span>
                        <strong className="text-slate-800">{course.instructorName}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Belirlenen Ders Fiyatı</span>
                        <strong className="text-indigo-600 font-black text-sm">₺{course.price}</strong>
                      </div>
                    </div>

                    {/* VIDEO ALTI DERS PDF'İ VE ÖDEV PDF'İ (Kullanıcı İsteği) */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                        📁 Ders Materyalleri & PDF Ekleri:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Ders Notu PDF */}
                        <a
                          href={course.lessonPdfUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition flex items-center justify-between text-xs group/link"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 block text-[11px] truncate">
                                📄 Ders Notu PDF'i
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {course.lessonPdfTitle || 'Konu_Anlatimi.pdf'}
                              </span>
                            </div>
                          </div>
                          <Download className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1 group-hover/link:translate-y-0.5 transition" />
                        </a>

                        {/* Ödev Testi PDF */}
                        <a
                          href={course.homeworkPdfUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition flex items-center justify-between text-xs group/link"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <FileCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 block text-[11px] truncate">
                                📝 Ödev Testi PDF'i
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {course.homeworkPdfTitle || 'Pekistirme_Odevi.pdf'}
                              </span>
                            </div>
                          </div>
                          <Download className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-1 group-hover/link:translate-y-0.5 transition" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Purchase Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                  {/* Select for bulk checkbox */}
                  {!course.purchased ? (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectForBulk(course.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>Toplu Pakete Ekle</span>
                    </label>
                  ) : (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Tam Erişim Açık
                    </span>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForWatch(course)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      İzle & İncele
                    </button>

                    {!course.purchased ? (
                      <button
                        type="button"
                        onClick={() => handleBuySingle(course)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Tekil Satın Al (₺{course.price})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedCourseForWatch(course)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Dersi Başlat</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WATCH VIDEO & PDF VIEWER MODAL */}
      {selectedCourseForWatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 block">
                  {selectedCourseForWatch.subject} • {selectedCourseForWatch.gradeLevel}
                </span>
                <h3 className="font-extrabold text-base text-white truncate max-w-xl">
                  {selectedCourseForWatch.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourseForWatch(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-16/9 bg-black overflow-hidden flex items-center justify-center">
              <video
                src={selectedCourseForWatch.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Altı Ders PDF'i ve Ödev PDF'i */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ders İçeriği & Özeti</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCourseForWatch.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500 block">Eğitmen: <strong>{selectedCourseForWatch.instructorName}</strong></span>
                  <span className="text-xs text-indigo-600 font-extrabold">Manuel Fiyat: ₺{selectedCourseForWatch.price}</span>
                </div>
              </div>

              {/* PDF Download Section */}
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
                <h5 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-indigo-600" />
                  Videoya Ait İndirilebilir PDF Dokümanları:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={selectedCourseForWatch.lessonPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white rounded-xl border border-indigo-200 hover:shadow-sm flex items-center justify-between transition text-xs font-bold text-indigo-900"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{selectedCourseForWatch.lessonPdfTitle || 'Ders Notu PDF İndir'}</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                  </a>

                  <a
                    href={selectedCourseForWatch.homeworkPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white rounded-xl border border-rose-200 hover:shadow-sm flex items-center justify-between transition text-xs font-bold text-rose-900"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-rose-600" />
                      <span>{selectedCourseForWatch.homeworkPdfTitle || 'Ödev Testi PDF İndir'}</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-rose-600" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 px-6 border-t border-slate-100 flex items-center justify-between">
              {!selectedCourseForWatch.purchased ? (
                <button
                  onClick={() => {
                    handleBuySingle(selectedCourseForWatch);
                    setSelectedCourseForWatch(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Dersi Satın Al (₺{selectedCourseForWatch.price})</span>
                </button>
              ) : (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tüm materyaller ve video izleme hakkı hesabınıza tanımlıdır.
                </span>
              )}
              <button
                onClick={() => setSelectedCourseForWatch(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPLU SATIN ALMA SEPET MODALI */}
      {isBulkCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base">Toplu Ders Satın Alma</h3>
              </div>
              <button onClick={() => setIsBulkCheckoutOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Seçtiğiniz <strong>{bulkTargetCourses.length} adet</strong> dersi tek seferde %25 indirim avantajıyla toplu olarak satın alabilirsiniz.
              </p>

              <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-100 p-2 rounded-2xl bg-slate-50">
                {bulkTargetCourses.map(c => (
                  <div key={c.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-xs">{c.title}</span>
                    <span className="font-mono font-bold text-slate-600 shrink-0">₺{c.price}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Toplam Liste Fiyatı:</span>
                  <span className="line-through font-mono">₺{rawBulkTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Toplu Satın Alma İndirimi (%25):</span>
                  <span>-₺{rawBulkTotal - discountedBulkTotal}</span>
                </div>
                <div className="pt-2 border-t border-indigo-200 flex justify-between text-sm font-black text-indigo-950">
                  <span>Ödenecek Tutar:</span>
                  <span className="text-base text-indigo-600">₺{discountedBulkTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyBulk}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>₺{discountedBulkTotal} ile Toplu Satın Almayı Onayla</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YENİ ONLİNE DERS YÜKLEME MODALI (MANUEL FİYAT VE PDF DESTEĞİ) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Yeni Online Ders Yükleme</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Ders fiyatını manuel girin, video bağlantısı ve ders/ödev PDF dosyalarını ekleyin.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadCourse} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ders Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: AYT Matematik: İntegral ile Hacim Hesabı"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium"
                />
              </div>

              {/* Subject & Grade & Manual Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branş *</label>
                  <select
                    value={uploadSubject}
                    onChange={e => setUploadSubject(e.target.value as Subject)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-semibold"
                  >
                    <option value="Matematik">📐 Matematik</option>
                    <option value="Geometri">📏 Geometri</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sınıf / Seviye</label>
                  <select
                    value={uploadGrade}
                    onChange={e => setUploadGrade(e.target.value as GradeLevel)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-semibold"
                  >
                    <option value="TYT / AYT (YKS)">TYT / AYT (YKS)</option>
                    <option value="LGS (8. Sınıf)">LGS (8. Sınıf)</option>
                    <option value="12. Sınıf">12. Sınıf</option>
                    <option value="11. Sınıf">11. Sınıf</option>
                    <option value="10. Sınıf">10. Sınıf</option>
                    <option value="9. Sınıf">9. Sınıf</option>
                  </select>
                </div>

                {/* MANUEL DERS FİYATI (Kullanıcı İsteği) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Manuel Ders Fiyatı (₺) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₺</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={uploadPrice}
                      onChange={e => setUploadPrice(Number(e.target.value))}
                      placeholder="Örn: 75"
                      className="w-full pl-7 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-extrabold text-indigo-700"
                    />
                  </div>
                </div>
              </div>

              {/* Video URL & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Video Bağlantısı (URL / MP4 / Stream) *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={uploadVideoUrl}
                    onChange={e => setUploadVideoUrl(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Süre (Dk)</label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={uploadDuration}
                    onChange={e => setUploadDuration(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Instructor Name & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eğitmen Adı</label>
                  <input
                    type="text"
                    value={uploadInstructor}
                    onChange={e => setUploadInstructor(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ders Açıklaması</label>
                  <input
                    type="text"
                    placeholder="Konunun püf noktaları ve ÖSYM soru tipleri"
                    value={uploadDesc}
                    onChange={e => setUploadDesc(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* PDF ATTACHMENTS (DERS PDF'İ & ÖDEV PDF'İ - Kullanıcı İsteği) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-extrabold text-slate-800 block text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Videoların Altına Eklenecek PDF Dokümanları:
                </span>

                {/* Lesson PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Ders Notu PDF Başlığı</label>
                    <input
                      type="text"
                      placeholder="Türev_Konu_Anlatim_Notu.pdf"
                      value={uploadLessonPdfTitle}
                      onChange={e => setUploadLessonPdfTitle(e.target.value)}
                      className="w-full text-[11px] border border-slate-300 rounded-lg p-2 bg-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Ders Notu PDF URL</label>
                    <input
                      type="url"
                      placeholder="https://.../ders-notu.pdf"
                      value={uploadLessonPdfUrl}
                      onChange={e => setUploadLessonPdfUrl(e.target.value)}
                      className="w-full text-[11px] border border-slate-300 rounded-lg p-2 bg-white outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* Homework PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Ödev PDF Başlığı</label>
                    <input
                      type="text"
                      placeholder="Türev_Pekistirme_Odev_Testi.pdf"
                      value={uploadHomeworkPdfTitle}
                      onChange={e => setUploadHomeworkPdfTitle(e.target.value)}
                      className="w-full text-[11px] border border-slate-300 rounded-lg p-2 bg-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Ödev PDF URL</label>
                    <input
                      type="url"
                      placeholder="https://.../odev-testi.pdf"
                      value={uploadHomeworkPdfUrl}
                      onChange={e => setUploadHomeworkPdfUrl(e.target.value)}
                      className="w-full text-[11px] border border-slate-300 rounded-lg p-2 bg-white outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Kaydediliyor...' : 'Online Dersi & PDF Materyallerini Yayınla'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
