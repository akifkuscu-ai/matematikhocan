import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Play, 
  Camera, 
  Bell, 
  Download,
  Share2,
  ChevronLeft,
  Circle,
  Square
} from 'lucide-react';

interface AndroidSimulatorFrameProps {
  children: React.ReactNode;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
  onOpenAskQuestion: () => void;
  onOpenPlayStoreModal: () => void;
}

export const AndroidSimulatorFrame: React.FC<AndroidSimulatorFrameProps> = ({
  children,
  isSimulatorActive,
  onToggleSimulator,
  onOpenAskQuestion,
  onOpenPlayStoreModal
}) => {
  const [currentTime, setCurrentTime] = useState<string>('12:45');
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy'>('pixel');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isSimulatorActive) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-6 px-4">
      {/* Simulator Control Toolbar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-xl text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold text-white">Android Cihaz Simülatörü</span>
            <div className="text-[10px] text-slate-400">
              {deviceModel === 'pixel' ? 'Google Pixel 8 Pro (Android 14)' : 'Samsung Galaxy S24 (One UI 6)'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceModel(d => d === 'pixel' ? 'galaxy' : 'pixel')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition text-[11px]"
            title="Cihaz Modelini Değiştir"
          >
            {deviceModel === 'pixel' ? 'Galaxy S24' : 'Pixel 8'}
          </button>

          <button
            onClick={onOpenPlayStoreModal}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition text-[11px] flex items-center gap-1"
            title="Play Store APK & Dosyaları"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>APK / .AAB</span>
          </button>

          <button
            onClick={onToggleSimulator}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Tam Ekran Web Görünümüne Dön"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Realistic Android Smartphone Shell */}
      <div className={`relative w-full max-w-[412px] h-[860px] bg-slate-900 rounded-[48px] p-3.5 border-[6px] shadow-[0_0_60px_rgba(79,70,229,0.25)] flex flex-col overflow-hidden transition-all ${
        deviceModel === 'pixel' ? 'border-slate-700 ring-4 ring-slate-800' : 'border-slate-800 ring-2 ring-slate-700'
      }`}>
        
        {/* Inner Phone Bezel & Screen Screen */}
        <div className="relative flex-1 bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-800">
          
          {/* Android Native Status Bar */}
          <div className="h-9 bg-slate-950 px-5 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight shrink-0 select-none z-30">
            {/* Clock & Notification icons */}
            <div className="flex items-center gap-2">
              <span className="font-bold">{currentTime}</span>
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-600/60 flex items-center justify-center text-[8px] font-serif font-black text-white">
                π
              </div>
            </div>

            {/* Front Camera Punch-hole Notch */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
            </div>

            {/* System Status: Signal, 5G, Wi-Fi, Battery */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[9px] font-bold text-indigo-400">5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px] font-mono">98%</span>
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Android App Content Viewport (Scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 relative pb-16 flex flex-col">
            {children}
          </div>

          {/* Android 3-Button / Gesture Pill Navigation Bar */}
          <div className="h-8 bg-slate-950/95 backdrop-blur-md flex items-center justify-around px-8 shrink-0 z-30 border-t border-slate-800 select-none">
            <button className="text-slate-500 hover:text-slate-300 transition active:scale-90">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="text-slate-500 hover:text-slate-300 transition active:scale-90">
              <Circle className="w-3.5 h-3.5" />
            </button>
            <button className="text-slate-500 hover:text-slate-300 transition active:scale-90">
              <Square className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
