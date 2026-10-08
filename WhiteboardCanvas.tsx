import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  RotateCcw, 
  Download, 
  Square, 
  Circle as CircleIcon, 
  ArrowUpRight,
  Type,
  Palette
} from 'lucide-react';

interface WhiteboardCanvasProps {
  backgroundImageUrl?: string;
  onSave?: (dataUrl: string) => void;
  readOnly?: boolean;
}

type ToolType = 'pen' | 'highlighter' | 'eraser' | 'arrow' | 'rect' | 'circle' | 'text';

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  backgroundImageUrl,
  onSave,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#ef4444'); // Red default for teacher correction
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  const colors = [
    { name: 'Kırmızı (Düzeltme)', value: '#ef4444' },
    { name: 'Mavi (Formül)', value: '#3b82f6' },
    { name: 'Yeşil (Doğru Cevap)', value: '#10b981' },
    { name: 'Sarı (Vurgulayıcı)', value: '#eab308' },
    { name: 'Mor (Teorem)', value: '#8b5cf6' },
    { name: 'Siyah (Yazı)', value: '#1e293b' }
  ];

  // Initialize canvas with background image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width > 800 ? 800 : img.width;
        canvas.height = (img.height * canvas.width) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Save initial state
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      };
      img.src = backgroundImageUrl;
    } else {
      canvas.width = 700;
      canvas.height = 450;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    }
  }, [backgroundImageUrl]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-15), snapshot]);
    if (onSave) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
    if (onSave) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setStartPos({ x, y });

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === 'highlighter' ? lineWidth * 4 : tool === 'eraser' ? lineWidth * 6 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1.0;
    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas || !startPos) return;
    const rect = canvas.getBoundingClientRect();
    const endX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const endY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'arrow') {
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const headLength = 15;
      const angle = Math.atan2(endY - startPos.y, endX - startPos.x);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (tool === 'rect') {
      ctx.beginPath();
      ctx.strokeRect(startPos.x, startPos.y, endX - startPos.x, endY - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.closePath();
    ctx.globalAlpha = 1.0;
    saveCanvasState();
    setStartPos(null);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `soru-cozum-cizim-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-800 border-b border-slate-700 text-xs text-slate-200">
          {/* Tools */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded transition ${tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Kalem"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('highlighter')}
              className={`p-1.5 rounded transition ${tool === 'highlighter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Vurgulayıcı Marker"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('arrow')}
              className={`p-1.5 rounded transition ${tool === 'arrow' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Yön Oku"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('rect')}
              className={`p-1.5 rounded transition ${tool === 'rect' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Kutu Çiz"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('circle')}
              className={`p-1.5 rounded transition ${tool === 'circle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Daire Çiz"
            >
              <CircleIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`p-1.5 rounded transition ${tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Silgi"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1.5">
            {colors.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition ${color === c.value ? 'border-white scale-110' : 'border-transparent opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>

          {/* Line Width */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Kalınlık:</span>
            <input
              type="range"
              min="1"
              max="8"
              value={lineWidth}
              onChange={e => setLineWidth(Number(e.target.value))}
              className="w-16 accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={history.length <= 1}
              className="p-1.5 rounded text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Geri Al"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={downloadCanvas}
              className="p-1.5 rounded text-slate-300 hover:bg-slate-700"
              title="Görseli İndir"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative overflow-auto flex items-center justify-center p-2 bg-slate-950/60 max-h-[500px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          className={`max-w-full h-auto rounded shadow-md touch-none ${readOnly ? 'cursor-default' : 'cursor-crosshair'}`}
        />
      </div>

      {!readOnly && (
        <div className="px-3 py-1.5 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
          <span>💡 İpucu: Sorunun üzerine önemli noktaları kırmızı kalem veya sarı marker ile çizerek vurgulayabilirsiniz.</span>
          <span className="text-indigo-400 font-medium">Değişiklikler otomatik kaydedilir</span>
        </div>
      )}
    </div>
  );
};
