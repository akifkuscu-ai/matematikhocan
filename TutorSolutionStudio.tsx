import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  FileText, 
  Scissors, 
  BookmarkPlus, 
  Trash2, 
  Play, 
  Pause, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Plus, 
  Camera, 
  Mic, 
  MicOff, 
  Volume2, 
  Sliders, 
  Layers, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Question, SolutionType, SolutionStep, VideoBookmark, Tutor } from '../types';
import { WhiteboardCanvas } from './WhiteboardCanvas';

interface TutorSolutionStudioProps {
  question: Question;
  currentTutor: Tutor;
  onClose: () => void;
  onSolveSubmit: (solutionPayload: any) => Promise<boolean>;
}

export const TutorSolutionStudio: React.FC<TutorSolutionStudioProps> = ({
  question,
  currentTutor,
  onClose,
  onSolveSubmit
}) => {
  const [solutionType, setSolutionType] = useState<SolutionType>(
    question.requestedSolutionType || 'video'
  );
  
  // Written / Standard Solution States
  const [textExplanation, setTextExplanation] = useState<string>(
    'Değerli öğrencim, sorunun çözümü için gerekli teorem ve adımları aşağıda detaylandırdım:'
  );
  const [steps, setSteps] = useState<SolutionStep[]>([
    {
      stepNumber: 1,
      title: 'Kural / Teorem Hatırlatması',
      content: 'Soruda verilen geometrik / matematiksel bağıntının temel kuralı uygulanır.',
      formula: 'f(x) = ax² + bx + c ⟹ x_tepe = -b/(2a)'
    },
    {
      stepNumber: 2,
      title: 'Denklem Çözümü ve Değerlerin Yerine Konması',
      content: 'Verilen sayısal değerler ana formüle yerleştirildiğinde istenen sonuca ulaşılır.',
      formula: 'Sonuç = ...'
    }
  ]);
  const [annotatedImageData, setAnnotatedImageData] = useState<string>('');
  const [tutorNotes, setTutorNotes] = useState<string>(
    'Bu soru tarzı ÖSYM sınavlarında sıklıkla çıkmaktadır. Adımları formül defterine not etmelisin!'
  );

  // Video Solution & Editing Suite States
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [videoQuality, setVideoQuality] = useState<string>('1080p 60fps HD');
  const [videoDuration, setVideoDuration] = useState<number>(118);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(118);
  
  // Video Chapters & Bookmarks
  const [videoBookmarks, setVideoBookmarks] = useState<VideoBookmark[]>([
    { id: 'bm-1', time: 0, timeLabel: '00:00', title: 'Giriş & Şekil Analizi', description: 'Sorunun incelenmesi' },
    { id: 'bm-2', time: 15, timeLabel: '00:15', title: 'Temel Formül', description: 'Kullanılacak teoremin yazılması' },
    { id: 'bm-3', time: 55, timeLabel: '00:55', title: 'Çözüm Adımı', description: 'İşlemlerin yapılması' },
    { id: 'bm-4', time: 95, timeLabel: '01:35', title: 'Sonuç & Sağlama', description: 'Doğru şıkkın teyidi' }
  ]);
  
  const [newBookmarkTitle, setNewBookmarkTitle] = useState<string>('');
  const [newBookmarkDesc, setNewBookmarkDesc] = useState<string>('');

  // Live Screen / Cam Recording Simulation
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const recordIntervalRef = useRef<any>(null);

  // Question Image Zoom & UI state
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'video-editor' | 'drawing'>('content');

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Step helper
  const addStep = () => {
    setSteps(prev => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: `${prev.length + 1}. Adım`,
        content: '',
        formula: ''
      }
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const updateStep = (index: number, field: keyof SolutionStep, value: any) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Video Time formatting helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Add Chapter Bookmark at Current Timestamp
  const addBookmarkAtCurrentTime = () => {
    if (!newBookmarkTitle.trim()) return;
    const timeVal = Math.floor(currentTime);
    const newBm: VideoBookmark = {
      id: `bm-${Date.now()}`,
      time: timeVal,
      timeLabel: formatTime(timeVal),
      title: newBookmarkTitle.trim(),
      description: newBookmarkDesc.trim() || 'Çözüm adımı'
    };
    setVideoBookmarks(prev => [...prev, newBm].sort((a, b) => a.time - b.time));
    setNewBookmarkTitle('');
    setNewBookmarkDesc('');
  };

  const removeBookmark = (id: string) => {
    setVideoBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Handle Video File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoQuality('1080p 60fps HD (Özel Yüklendi)');
    }
  };

  // Live In-Browser Screen/Whiteboard Recording Simulator
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      clearInterval(recordIntervalRef.current);
      setIsRecording(false);
      setVideoDuration(recordSeconds);
      setTrimEnd(recordSeconds);
      // Auto-add sample bookmarks if needed
      if (videoBookmarks.length === 0) {
        setVideoBookmarks([
          { id: 'bm-r1', time: 0, timeLabel: '00:00', title: 'Giriş', description: 'Soru analizi' },
          { id: 'bm-r2', time: Math.floor(recordSeconds / 2), timeLabel: formatTime(Math.floor(recordSeconds / 2)), title: 'Çözüm Adımı', description: 'Tahtada çözüm' }
        ]);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, []);

  // Handle Video Play / Pause
  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    } else {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoPlayerRef.current) return;
    setCurrentTime(videoPlayerRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoPlayerRef.current) return;
    const dur = Math.floor(videoPlayerRef.current.duration) || 118;
    setVideoDuration(dur);
    setTrimEnd(dur);
  };

  const seekTo = (seconds: number) => {
    if (!videoPlayerRef.current) return;
    videoPlayerRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  // Submit Solution to Backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: solutionType,
        textExplanation,
        steps,
        solutionImageUrl: annotatedImageData || undefined,
        videoUrl: solutionType === 'video' ? videoUrl : undefined,
        videoDuration: solutionType === 'video' ? (trimEnd - trimStart) : undefined,
        videoQuality: solutionType === 'video' ? videoQuality : undefined,
        videoBookmarks: solutionType === 'video' ? videoBookmarks : [],
        tutorNotes,
        tutorId: currentTutor.id
      };

      const success = await onSolveSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error('Submit solution error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              {currentTutor.name.split(' ')[0][0]}{currentTutor.name.split(' ')[1]?.[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base">{currentTutor.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {currentTutor.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Soru: <strong className="text-slate-200">{question.title}</strong> ({question.subject} - {question.gradeLevel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Öğrenci Çözüm Bekliyor: <strong className="text-white">{question.studentName}</strong></span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body (Two-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-y-auto">
          
          {/* Left Column: Student Question Reference & Interactive Whiteboard Canvas */}
          <div className="lg:col-span-5 bg-slate-50 border-r border-slate-200 p-4 flex flex-col space-y-3 overflow-y-auto max-h-[500px] lg:max-h-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Öğrencinin Sorusu
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setImageZoom(prev => Math.min(prev + 0.25, 2))}
                  className="p-1 text-slate-600 hover:bg-slate-200 rounded"
                  title="Yakınlaştır"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageZoom(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1 text-slate-600 hover:bg-slate-200 rounded"
                  title="Uzaklaştır"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageZoom(1)}
                  className="text-[11px] font-bold text-indigo-600 px-1.5 py-0.5 hover:bg-indigo-50 rounded"
                >
                  Sıfırla
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                  {question.subject}
                </span>
                <span className="text-slate-400 font-medium">{question.gradeLevel}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{question.title}</h4>
              {question.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                  "{question.description}"
                </p>
              )}

              {/* Student Question Image Container with Zoom */}
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-950 flex items-center justify-center min-h-[200px]">
                <img
                  src={question.imageUrl}
                  alt="Öğrenci Sorusu"
                  style={{ transform: `scale(${imageZoom})`, transition: 'transform 0.15s ease-out' }}
                  className="max-h-[300px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Interactive Drawing Canvas on Question Option */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  🎨 Soru Üzerine Çizim & Tahta (Opsiyonel)
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">Öğrenciye görsel olarak iletilir</span>
              </div>
              <WhiteboardCanvas
                backgroundImageUrl={question.imageUrl}
                onSave={data => setAnnotatedImageData(data)}
              />
            </div>
          </div>

          {/* Right Column: Solution Creator & HD Video Editing Studio */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col space-y-4 overflow-y-auto">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSolutionType('video')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  solutionType === 'video'
                    ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4 text-rose-500" />
                1080p HD Video Çözüm & Düzenleyici
              </button>
              <button
                type="button"
                onClick={() => setSolutionType('standard')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  solutionType === 'standard'
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                Standart Yazılı & Adım Adım Çözüm
              </button>
            </div>

            {/* VIDEO STUDIO MODE */}
            {solutionType === 'video' && (
              <div className="space-y-4">
                
                {/* Video Recording & Upload Control Bar */}
                <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          isRecording 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'bg-rose-600/90 hover:bg-rose-600 text-white'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {isRecording ? `Kayıt Yapılıyor (${formatTime(recordSeconds)})` : 'Canlı Ekran / Tahta Kaydı Başlat'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`p-1.5 rounded-lg text-xs transition ${micEnabled ? 'bg-slate-800 text-emerald-400' : 'bg-rose-900/80 text-rose-300'}`}
                        title={micEnabled ? 'Mikrofon Açık' : 'Mikrofon Kapalı'}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="h-4 w-px bg-slate-700 hidden sm:block" />

                    {/* Upload Custom HD Video */}
                    <div>
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-400" />
                        HD Video Dosyası Yükle
                      </button>
                    </div>
                  </div>

                  {/* Quality Badge Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Kalite:</span>
                    <select
                      value={videoQuality}
                      onChange={e => setVideoQuality(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded border border-slate-700 focus:outline-hidden"
                    >
                      <option value="1080p 60fps HD">1080p 60fps (Full HD)</option>
                      <option value="720p HD">720p HD</option>
                      <option value="4K Ultra HD">4K Ultra HD</option>
                    </select>
                  </div>
                </div>

                {/* Video Preview & Timeline Player */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
                  <div className="relative aspect-video max-h-[260px] bg-slate-950 flex items-center justify-center">
                    <video
                      ref={videoPlayerRef}
                      src={videoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      className="w-full h-full object-contain"
                      playsInline
                    />

                    {/* Center Overlay Play Button */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-rose-600/90 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg group-hover:scale-110"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    {/* Top Quality Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold rounded-md flex items-center gap-1 border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      {videoQuality}
                    </div>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="p-2.5 bg-slate-900 text-white space-y-1.5">
                    
                    {/* Scrub bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-300 w-10 text-right">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration || 100}
                        value={currentTime}
                        onChange={e => seekTo(Number(e.target.value))}
                        className="flex-1 accent-rose-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-[11px] font-mono text-slate-400 w-10">{formatTime(videoDuration)}</span>
                    </div>

                    {/* Bookmark Marks along timeline */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                      <span>✂️ Kırpma Aralığı: {formatTime(trimStart)} - {formatTime(trimEnd)}</span>
                      <span>{videoBookmarks.length} Adet Zaman Damgası</span>
                    </div>
                  </div>
                </div>

                {/* Video Editing Tools Accordion / Panel */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-600" /> Video Düzenleme & Zaman Damgaları
                    </span>
                    <span className="text-[11px] text-slate-500">Öğrenciler adımları tıklayarak videoda atlayabilir</span>
                  </div>

                  {/* Trim Tool (Kırpma) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Scissors className="w-3.5 h-3.5 text-slate-500" /> Başlangıç & Bitiş Kırpma (Trim):
                      </span>
                      <span className="font-mono text-indigo-600 font-bold">
                        {formatTime(trimStart)} ⟶ {formatTime(trimEnd)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500">Başlangıç: {formatTime(trimStart)}</span>
                        <input
                          type="range"
                          min="0"
                          max={Math.max(0, trimEnd - 5)}
                          value={trimStart}
                          onChange={e => setTrimStart(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Bitiş: {formatTime(trimEnd)}</span>
                        <input
                          type="range"
                          min={trimStart + 5}
                          max={videoDuration}
                          value={trimEnd}
                          onChange={e => setTrimEnd(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Bookmark / Chapter at current playhead */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Adım / Konu Yer İmi Ekle ({formatTime(currentTime)})</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newBookmarkTitle}
                        onChange={e => setNewBookmarkTitle(e.target.value)}
                        placeholder="Örn: 2. Dereceden Denklem Çözümü"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={addBookmarkAtCurrentTime}
                        disabled={!newBookmarkTitle.trim()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        Damga Ekle
                      </button>
                    </div>

                    {/* Bookmarks List */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {videoBookmarks.map(bm => (
                        <div
                          key={bm.id}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs hover:border-indigo-300 transition"
                        >
                          <button
                            type="button"
                            onClick={() => seekTo(bm.time)}
                            className="flex items-center gap-2 text-left group"
                          >
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold rounded text-[11px] group-hover:bg-indigo-600 group-hover:text-white transition">
                              {bm.timeLabel}
                            </span>
                            <span className="font-semibold text-slate-800 group-hover:text-indigo-600">{bm.title}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBookmark(bm.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                            title="Kaldır"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Written Explanation & Step-by-Step Editor */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Öğretmen Açıklaması & Çözüm Özeti
                </label>
                <textarea
                  value={textExplanation}
                  onChange={e => setTextExplanation(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Step by Step Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Adım Adım Çözüm Basamakları
                  </span>
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Yeni Adım Ekle
                  </button>
                </div>

                <div className="space-y-2.5">
                  {steps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                          Adım {step.stepNumber}
                        </span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(idx)}
                            className="text-slate-400 hover:text-rose-600 text-xs"
                          >
                            Sil
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={step.title}
                        onChange={e => updateStep(idx, 'title', e.target.value)}
                        placeholder="Adım Başlığı (Örn: Teğet-Kiriş Açı Bağıntısı)"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <textarea
                        value={step.content}
                        onChange={e => updateStep(idx, 'content', e.target.value)}
                        rows={2}
                        placeholder="Açıklama ve mantık..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        value={step.formula || ''}
                        onChange={e => updateStep(idx, 'formula', e.target.value)}
                        placeholder="Matematiksel Formül / Denklem (Örn: m(BOC) = 2 × 40° = 80°)"
                        className="w-full px-3 py-1 bg-white border border-indigo-200 font-mono text-[11px] text-indigo-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes / Sınav Tüyosu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Öğrenciye Özel Not & Sınav Tüyosu
                </label>
                <input
                  type="text"
                  value={tutorNotes}
                  onChange={e => setTutorNotes(e.target.value)}
                  placeholder="Örn: Bu kural çember sorularında sıkça unutulur, formül defterine ekle!"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Kaydediliyor ve Gönderiliyor...' : 'Çözümü Tamamla ve Öğrenciye Gönder'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
