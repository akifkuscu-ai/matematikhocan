import React, { useState, useRef } from 'react';
import { 
  X, 
  Video, 
  FileText, 
  Star, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Crown, 
  Zap, 
  MessageSquare, 
  ThumbsUp, 
  Layers, 
  HelpCircle,
  Clock,
  Send,
  ExternalLink,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, QuestionRating } from '../types';

interface SolutionDetailModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onRateSubmit: (questionId: string, rating: { score: number; comment: string; tags: string[] }) => Promise<boolean>;
}

const RATING_TAG_OPTIONS = [
  'Çok Anlaşılır 👏',
  'Hızlı Yanıt ⚡',
  'Detaylı Anlatım 📚',
  'Mükemmel Çizim 🎨',
  'Soru Tarzına Uygun 🎯',
  'Püf Noktalar Harika 💡'
];

export const SolutionDetailModal: React.FC<SolutionDetailModalProps> = ({
  question,
  isOpen,
  onClose,
  onRateSubmit
}) => {
  if (!isOpen) return null;

  const solution = question.solution;
  const isVideoSolution = solution?.type === 'video' && solution.videoUrl;

  // Video Player States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(solution?.videoDuration || 118);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeBookmarkId, setActiveBookmarkId] = useState<string | null>(null);

  // Rating & Review States
  const [score, setScore] = useState<number>(question.rating?.score || 5);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(question.rating?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(question.rating?.tags || ['Çok Anlaşılır 👏', 'Detaylı Anlatım 📚']);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState<boolean>(false);
  const [hasRatedSuccess, setHasRatedSuccess] = useState<boolean>(!!question.rating);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Time formatter
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Video Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Highlight current active bookmark
    if (solution?.videoBookmarks) {
      const active = [...solution.videoBookmarks]
        .reverse()
        .find(bm => cur >= bm.time);
      setActiveBookmarkId(active?.id || null);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || solution?.videoDuration || 118);
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const changeSpeed = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Rating Tag Toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Handle Rating Submit
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRatingSubmitting(true);
    try {
      const success = await onRateSubmit(question.id, {
        score,
        comment: comment.trim(),
        tags: selectedTags
      });
      if (success) {
        setHasRatedSuccess(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {
          // ignore confetti if blocked
        }
      }
    } catch (err) {
      console.error('Rate tutor error:', err);
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center text-white shadow-md">
              {isVideoSolution ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base">{question.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {solution ? 'Çözüldü ✅' : 'İnceleniyor ⏳'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {question.subject} • {question.gradeLevel} • Çözüm Türü: <strong className="text-slate-200">{isVideoSolution ? '1080p HD Videolu Anlatım' : 'Standart Yazılı & Çizimli'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Tutor Info Card */}
          {question.tutorName && (
            <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={question.tutorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                  alt={question.tutorName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-300 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{question.tutorName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                      Uzman Eğitmen
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{question.tutorTitle || 'Kıdemli Branş Öğretmeni'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1">
                  ⭐ <strong className="text-amber-600">4.96</strong> (480+ Değerlendirme)
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  ⚡ Ort. 4 dk Çözüm Süresi
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Video Player & Step Bookmarks (If Video Solution) */}
          {isVideoSolution && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Video className="w-4 h-4 text-rose-500" /> 1080p Full HD Video Çözüm
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {solution.videoQuality || '1080p 60fps HD'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                
                {/* Video Player Canvas */}
                <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
                  <div className="relative aspect-video flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={solution.videoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={togglePlay}
                      playsInline
                    />

                    {/* Big Overlay Play button */}
                    {!isPlaying && (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition backdrop-blur-xs"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </button>
                    )}

                    {/* Top Quality & Speed Watermark */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold rounded-md border border-white/20">
                        {solution.videoQuality || '1080p HD'}
                      </span>
                      {playbackRate !== 1 && (
                        <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded">
                          {playbackRate}x
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Custom Controls Bar */}
                  <div className="p-3 bg-slate-900/95 text-white space-y-2 border-t border-slate-800">
                    {/* Scrub Timeline */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-300 w-10 text-right">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={e => seekTo(Number(e.target.value))}
                        className="flex-1 accent-rose-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-[11px] font-mono text-slate-400 w-10">{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Speed Buttons */}
                      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                        {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => changeSpeed(speed)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                              playbackRate === speed 
                                ? 'bg-rose-600 text-white' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => seekTo(0)}
                          className="p-1.5 text-slate-400 hover:text-white rounded"
                          title="Başa Sar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="p-1.5 text-slate-400 hover:text-white rounded"
                          title="Tam Ekran"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Step Chapters / Bookmarks Sidebar */}
                <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                        ⏱️ Adım Yer İmleri
                      </span>
                      <span className="text-[10px] text-slate-500">Tıklayıp doğrudan atlayın</span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {solution.videoBookmarks && solution.videoBookmarks.length > 0 ? (
                        solution.videoBookmarks.map((bm, index) => {
                          const isActive = activeBookmarkId === bm.id;
                          return (
                            <button
                              key={bm.id}
                              type="button"
                              onClick={() => seekTo(bm.time)}
                              className={`w-full p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 ${
                                isActive
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                              }`}
                            >
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-700'
                              }`}>
                                {bm.timeLabel}
                              </span>
                              <div>
                                <h5 className="font-bold text-xs leading-tight">{bm.title}</h5>
                                <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                  {bm.description}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-xs text-slate-400 italic py-4 text-center">
                          Bu video için özel yer imi eklenmemiş.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                    💡 <strong>İpucu:</strong> Video hızını 1.5x yaparak zaman kazanabilir veya yer imlerine tıklayarak sadece takıldığınız adımı izleyebilirsiniz.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Question Reference & Step-by-Step Written Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Original Question Image */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Orijinal Soru Fotoğrafı
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                <img
                  src={question.imageUrl}
                  alt="Soru Görseli"
                  className="w-full max-h-[320px] object-contain mx-auto"
                />
              </div>

              {/* Tutor Canvas Drawing (if available) */}
              {solution?.solutionImageUrl && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                    🎨 Eğitmenin Soru Üzerindeki Çizimi & Notları
                  </span>
                  <div className="rounded-xl overflow-hidden border border-indigo-200 shadow-xs bg-slate-900">
                    <img
                      src={solution.solutionImageUrl}
                      alt="Eğitmen Çizimi"
                      className="w-full max-h-[260px] object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Step by Step Written Content */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Teacher Explanation Text */}
              {solution && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" /> Eğitmen Çözüm Açıklaması
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {solution.textExplanation}
                  </p>
                </div>
              )}

              {/* Steps List */}
              {solution?.steps && solution.steps.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Çözüm Adımları & Formüller
                  </span>
                  {solution.steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-slate-200 hover:border-indigo-200 rounded-xl shadow-2xs space-y-1.5 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-700 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            {step.stepNumber}
                          </span>
                          {step.title}
                        </span>
                        {step.timestamp && (
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            ⏱️ {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700">{step.content}</p>
                      {step.formula && (
                        <div className="p-2 bg-indigo-50/70 border border-indigo-100 rounded-lg font-mono text-xs font-bold text-indigo-950">
                          {step.formula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Teacher Notes / Exam Tip */}
              {solution?.tutorNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Öğretmenin Sınav Tüyosu:</span>
                    <p className="text-amber-800 text-[11px] mt-0.5">{solution.tutorNotes}</p>
                  </div>
                </div>
              )}

              {/* Instant AI Gemini Pre-Analysis Card */}
              {question.aiAnalysis && (
                <div className="p-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      Yapay Zeka (Gemini) Ön Analizi
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-200/80 text-violet-900 font-bold">
                      %{Math.round(question.aiAnalysis.confidenceScore * 100)} Güven
                    </span>
                  </div>
                  <div className="text-[11px] text-violet-900 space-y-1">
                    <p><strong>Tespit Edilen Konu:</strong> {question.aiAnalysis.detectedTopic}</p>
                    <p><strong>Önemli Formüller:</strong> {question.aiAnalysis.keyFormulas.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Student Rating & Review Form (Eğitmen Puanlama) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="p-5 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-amber-50/20 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Eğitmeni ve Çözümü Değerlendir
                  </h4>
                  <p className="text-xs text-slate-500">
                    Geri bildiriminiz hem eğitmenin puanını belirler hem de diğer öğrencilere yol gösterir.
                  </p>
                </div>

                {hasRatedSuccess && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Değerlendirmeniz Kaydedildi
                  </span>
                )}
              </div>

              <form onSubmit={handleRatingSubmit} className="space-y-4">
                
                {/* 1-5 Star Picker */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Puanınız:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(starValue => {
                      const displayScore = hoveredScore !== null ? hoveredScore : score;
                      const isFilled = starValue <= displayScore;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          disabled={hasRatedSuccess}
                          onMouseEnter={() => !hasRatedSuccess && setHoveredScore(starValue)}
                          onMouseLeave={() => !hasRatedSuccess && setHoveredScore(null)}
                          onClick={() => setScore(starValue)}
                          className="p-1 text-slate-300 hover:scale-125 transition transform focus:outline-hidden disabled:cursor-default"
                        >
                          <Star
                            className={`w-7 h-7 transition ${
                              isFilled ? 'text-amber-400 fill-amber-400 drop-shadow-xs' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-lg">
                    {score} / 5 Yıldız
                  </span>
                </div>

                {/* Quick Tags Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700">Değerlendirme Etiketleri:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {RATING_TAG_OPTIONS.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={hasRatedSuccess}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <textarea
                    value={comment}
                    disabled={hasRatedSuccess}
                    onChange={e => setComment(e.target.value)}
                    rows={2}
                    placeholder="Öğretmeninize çözüm için teşekkür edebilir veya anlatım tarzını yorumlayabilirsiniz..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100"
                  />
                </div>

                {!hasRatedSuccess && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isRatingSubmitting}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isRatingSubmitting ? 'Kaydediliyor...' : 'Değerlendirmeyi Gönder'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Soru ID: <strong className="text-slate-700">{question.id}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
