import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Trash2, 
  Square, 
  Circle as CircleIcon, 
  Minus, 
  ArrowUpRight, 
  Triangle, 
  Grid, 
  Image as ImageIcon, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Palette, 
  Sliders, 
  Check, 
  Compass,
  FileDown
} from 'lucide-react';

type ToolType = 'pen' | 'calligraphy' | 'highlighter' | 'brush' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle' | 'triangle' | 'coords';
type BoardBackground = 'white' | 'grid' | 'lined' | 'blackboard' | 'dark';

export const WhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#3b82f6'); // Blue default
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [backgroundType, setBackgroundType] = useState<BoardBackground>('grid'); // Kareli defter by default for math
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Color Palette
  const colorPalette = [
    { name: 'Mavi (Matematik)', hex: '#2563eb' },
    { name: 'Kırmızı (Çözüm)', hex: '#dc2626' },
    { name: 'Yeşil (Doğru Cevap)', hex: '#16a34a' },
    { name: 'Sarı (Vurgulayıcı)', hex: '#eab308' },
    { name: 'Mor (Formül)', hex: '#7c3aed' },
    { name: 'Turuncu (Açılar)', hex: '#ea580c' },
    { name: 'Pembe', hex: '#db2777' },
    { name: 'Koyu Gri / Siyah', hex: '#1e293b' },
    { name: 'Beyaz (Kara Tahta)', hex: '#ffffff' }
  ];

  // Draw background patterns
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, type: BoardBackground) => {
    ctx.save();
    if (type === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    } else if (type === 'grid') {
      // Kareli Defter
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 28;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Sol kenar kırmızı dikey çizgi (defter payı)
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(56, 0);
      ctx.lineTo(56, height);
      ctx.stroke();
    } else if (type === 'lined') {
      // Çizgili Defter
      ctx.fillStyle = '#fffdfa';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const lineSpacing = 32;
      ctx.beginPath();
      for (let y = 32; y <= height; y += lineSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Kırmızı kenar çizgisi
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    } else if (type === 'blackboard') {
      // Yeşil Okul Tahtası
      ctx.fillStyle = '#1e3a2f';
      ctx.fillRect(0, 0, width, height);
      // Subtle chalk grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gs = 35;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gs) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gs) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else if (type === 'dark') {
      // Koyu Mod
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gs = 30;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gs) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gs) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  // Save state to undo history
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, imgData];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Canvas size adjustment
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.max(800, Math.floor(rect.width));
    const h = Math.max(650, window.innerHeight - 240);

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawBackground(ctx, w, h, backgroundType);
      const initialData = ctx.getImageData(0, 0, w, h);
      setHistory([initialData]);
      setHistoryIndex(0);
    }
  }, [backgroundType, drawBackground]);

  // Get pointer coordinates relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 1 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 1
    };
  };

  // Pointer Down (Tablet & Mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getCoordinates(e);
    setIsDrawing(true);
    setStartPos({ x: coords.x, y: coords.y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      // Silgi: Arka plan rengiyle çizer
      if (backgroundType === 'blackboard') ctx.strokeStyle = '#1e3a2f';
      else if (backgroundType === 'dark') ctx.strokeStyle = '#0f172a';
      else if (backgroundType === 'lined') ctx.strokeStyle = '#fffdfa';
      else ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = lineWidth * 3.5;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color + '55'; // 33% opacity
      ctx.lineWidth = lineWidth * 3.5;
      ctx.lineCap = 'square';
    } else if (tool === 'brush') {
      ctx.strokeStyle = color + 'cc';
      ctx.lineWidth = lineWidth * 2;
    } else if (tool === 'calligraphy') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * 1.5;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    if (['pen', 'calligraphy', 'highlighter', 'brush', 'eraser'].includes(tool)) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (['pen', 'calligraphy', 'highlighter', 'brush', 'eraser'].includes(tool)) {
      // Dynamic pressure line width for tablet pencil
      if (e.pointerType === 'pen' && coords.pressure > 0) {
        ctx.lineWidth = lineWidth * (0.6 + coords.pressure * 0.8);
      }
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (startPos && history[historyIndex]) {
      // Shapes: Preview by restoring snapshot before drawing current shape preview
      ctx.putImageData(history[historyIndex], 0, 0);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sx = startPos.x;
      const sy = startPos.y;
      const ex = coords.x;
      const ey = coords.y;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      } else if (tool === 'arrow') {
        // Arrow vector
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        const headlen = 16;
        const dx = ex - sx;
        const dy = ey - sy;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headlen * Math.cos(angle - Math.PI / 6), ey - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headlen * Math.cos(angle + Math.PI / 6), ey - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(sx, sy, ex - sx, ey - sy);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(sx + (ex - sx) / 2, sy);
        ctx.lineTo(sx, ey);
        ctx.lineTo(ex, ey);
        ctx.closePath();
        ctx.stroke();
      } else if (tool === 'coords') {
        // X-Y Cartesian Coordinate Plane
        ctx.beginPath();
        // X Axis
        ctx.moveTo(sx, (sy + ey) / 2);
        ctx.lineTo(ex, (sy + ey) / 2);
        // Y Axis
        ctx.moveTo((sx + ex) / 2, sy);
        ctx.lineTo((sx + ex) / 2, ey);
        ctx.stroke();

        // Arrow heads
        const midY = (sy + ey) / 2;
        const midX = (sx + ex) / 2;
        ctx.beginPath();
        // X arrow
        ctx.moveTo(ex, midY);
        ctx.lineTo(ex - 8, midY - 6);
        ctx.moveTo(ex, midY);
        ctx.lineTo(ex - 8, midY + 6);
        // Y arrow
        ctx.moveTo(midX, sy);
        ctx.lineTo(midX - 6, sy + 8);
        ctx.moveTo(midX, sy);
        ctx.lineTo(midX + 6, sy + 8);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPos(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
    saveState();
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  // Clear Board
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.confirm('Beyaz tahtadaki tüm çizimleri temizlemek istediğinize emin misiniz?')) {
      drawBackground(ctx, canvas.width, canvas.height, backgroundType);
      saveState();
    }
  };

  // Download Board as Image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `matematikhocan_tahta_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Upload Question Image to Board
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale image to fit inside canvas nicely
        const maxW = canvas.width * 0.7;
        const scale = Math.min(maxW / img.width, 1);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const posX = (canvas.width - drawW) / 2;
        const posY = 50;

        ctx.drawImage(img, posX, posY, drawW, drawH);
        saveState();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">İnteraktif Dijital Beyaz Tahta</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Tablet & Kalem Uyumlu ✍️
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bilgisayardan veya tabletinizden (Apple Pencil, S-Pen vb.) serbest çizim yapın, formül yazın ve geometri şekilleri çizin.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Background selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setBackgroundType('grid')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                backgroundType === 'grid' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'hover:text-slate-900'
              }`}
              title="Kareli Matematik Defteri"
            >
              📐 Kareli
            </button>
            <button
              onClick={() => setBackgroundType('white')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                backgroundType === 'white' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'hover:text-slate-900'
              }`}
              title="Düz Beyaz Tahta"
            >
              ⚪ Beyaz
            </button>
            <button
              onClick={() => setBackgroundType('blackboard')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                backgroundType === 'blackboard' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'hover:text-slate-900'
              }`}
              title="Okul Yeşil Tahtası"
            >
              🟢 Kara Tahta
            </button>
            <button
              onClick={() => setBackgroundType('dark')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                backgroundType === 'dark' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
              }`}
              title="Koyu Gece Modu"
            >
              ⚫ Koyu
            </button>
          </div>

          {/* Download image */}
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Tahtayı PNG olarak kaydet"
          >
            <Download className="w-4 h-4" />
            <span>Tahtayı Kaydet</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Studio Frame */}
      <div 
        ref={containerRef}
        className={`bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col overflow-hidden transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'
        }`}
      >
        {/* Floating / Top Toolbar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          
          {/* TOOL SELECTORS */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Kalemler:</span>
            
            {/* Standard Pen */}
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                tool === 'pen' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="Standart Kalem (Tükenmez/Kurşun)"
            >
              <Pen className="w-4 h-4" />
              <span className="hidden md:inline">Kalem</span>
            </button>

            {/* Calligraphy / Brush */}
            <button
              onClick={() => setTool('calligraphy')}
              className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                tool === 'calligraphy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="Dolma Kalem / Hat"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Dolma Kalem</span>
            </button>

            {/* Highlighter */}
            <button
              onClick={() => setTool('highlighter')}
              className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                tool === 'highlighter' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="Fosforlu Kalem / Vurgulayıcı"
            >
              <Highlighter className="w-4 h-4" />
              <span className="hidden md:inline">Fosforlu</span>
            </button>

            {/* Eraser */}
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                tool === 'eraser' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="Silgi"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden md:inline">Silgi</span>
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* SHAPES */}
            <span className="text-[11px] font-bold text-slate-400 mr-1 hidden lg:inline">Şekiller:</span>

            <button
              onClick={() => setTool('line')}
              className={`p-2 rounded-xl transition ${
                tool === 'line' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Düz Çizgi"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTool('arrow')}
              className={`p-2 rounded-xl transition ${
                tool === 'arrow' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Ok / Vektör"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTool('rect')}
              className={`p-2 rounded-xl transition ${
                tool === 'rect' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Dikdörtgen / Kare"
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded-xl transition ${
                tool === 'circle' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Çember / Daire"
            >
              <CircleIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTool('triangle')}
              className={`p-2 rounded-xl transition ${
                tool === 'triangle' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Geometri Üçgeni"
            >
              <Triangle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTool('coords')}
              className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                tool === 'coords' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="X-Y Koordinat Düzlemi"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden xl:inline">X-Y Ekseni</span>
            </button>
          </div>

          {/* COLOR PALETTE & STROKE WIDTH */}
          <div className="flex items-center gap-2">
            
            {/* Color Swatches */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl">
              {colorPalette.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 rounded-full transition-transform border ${
                    color === c.hex ? 'scale-125 border-white ring-2 ring-indigo-400' : 'border-slate-600 hover:scale-110'
                  }`}
                  title={c.name}
                />
              ))}

              {/* Custom Color Input */}
              <label className="w-5 h-5 rounded-full overflow-hidden cursor-pointer relative border border-slate-600 hover:scale-110 ml-0.5" title="Özel Renk Seç">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                />
                <span className="w-full h-full bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-500 block" />
              </label>
            </div>

            {/* Stroke Width Slider */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-[10px] text-slate-400">Kalınlık:</span>
              {[2, 4, 8, 14].map(w => (
                <button
                  key={w}
                  onClick={() => setLineWidth(w)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition font-bold text-[10px] ${
                    lineWidth === w ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Action Buttons: Undo, Redo, Clear */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition"
                title="Geri Al (Undo)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition"
                title="İleri Al (Redo)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-300 transition"
                title="Tahtayı Temizle"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Upload image to draw over */}
              <label 
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 cursor-pointer transition"
                title="Tahtaya Soru Görseli Ekle"
              >
                <ImageIcon className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>

              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen(prev => !prev)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Touch / Stylus Canvas Area */}
        <div className="relative flex-1 overflow-hidden select-none bg-slate-50 cursor-crosshair">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full block touch-none"
            style={{ touchAction: 'none' }}
          />

          {/* Quick Tablet Tips in corner */}
          <div className="absolute bottom-3 right-3 pointer-events-none bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-medium hidden sm:flex items-center gap-2">
            <span>✍️ Stylus & Dokunmatik Duyarlı</span>
            <span>•</span>
            <span>Tek parmak/kalemle yaz, çift tıkla şekil çiz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
