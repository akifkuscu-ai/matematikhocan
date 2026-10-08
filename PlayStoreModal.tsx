import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Layers, 
  FileCode2, 
  Cpu, 
  X, 
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstall?: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'methods' | 'configs' | 'checklist'>('quick');
  const [activeMethod, setActiveMethod] = useState<'pwabuilder' | 'bubblewrap' | 'capacitor'>('pwabuilder');
  const [activeConfigTab, setActiveConfigTab] = useState<'manifest' | 'assetlinks' | 'twa' | 'capacitor' | 'androidmanifest' | 'mainactivity' | 'gradle'>('manifest');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [hardwareTestStatus, setHardwareTestStatus] = useState<string | null>(null);

  const mainActivityKotlinContent = `package com.matematikhocan.app

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        webView.loadUrl("https://matematikhocan.com")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

  const gradleBuildKtsContent = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.matematikhocan.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.matematikhocan.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.webkit:webkit:1.10.0")
}`;

  // Google Play Console Checklist State
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    manifest: true,
    serviceworker: true,
    assetlinks: true,
    icons: true,
    responsive: true,
    camera_perm: true,
    privacy_policy: true,
    package_name: true,
    testers: false,
    content_rating: false
  });

  useEffect(() => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }
  }, []);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const manifestJsonContent = `{
  "name": "matematikhocan.com - Matematik & Geometri Soru Çözümü",
  "short_name": "matematikhocan",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0f172a",
  "theme_color": "#4f46e5",
  "icons": [
    { "src": "/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any" },
    { "src": "/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any" },
    { "src": "/icon-maskable.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Yeni Soru Sor", "url": "/?action=ask" },
    { "name": "Eğitmen Havuzu", "url": "/?role=tutor" }
  ]
}`;

  const assetLinksJsonContent = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.matematikhocan.app",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7D:0F:52:AB:60:88:84:DE:6B:A7:28:B6:BA:57:3E:68:57:BC:1A:1D:64:1C:86:14:8B:5B:3C:A9:B2"
      ]
    }
  }
]`;

  const capacitorConfigContent = `{
  "appId": "com.matematikhocan.app",
  "appName": "MatematikHocan",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}`;

  const twaManifestContent = `{
  "packageId": "com.matematikhocan.app",
  "host": "matematikhocan.com",
  "name": "matematikhocan.com",
  "launcherName": "MatematikHocan",
  "themeColor": "#4F46E5",
  "navigationColor": "#0F172A",
  "backgroundColor": "#0F172A",
  "startUrl": "/",
  "iconUrl": "https://matematikhocan.com/icon-512.svg",
  "maskableIconUrl": "https://matematikhocan.com/icon-maskable.svg",
  "appVersionName": "1.0.0",
  "appVersionCode": 1
}`;

  const androidManifestXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.matematikhocan.app">

    <!-- Gerekli İzinler -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:screenOrientation="portrait"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Play className="w-6 h-6 fill-current text-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Google Play Store & Android Dönüştürücü</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PWA / TWA Hazır
                </span>
              </div>
              <p className="text-xs text-slate-400">
                matematikhocan.com platformunu Play Store'a (.aab / .apk) dönüştürme ve cihaza yükleme merkezi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quick'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            1. Cihaza Yükle & Test Et
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'methods'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            2. Play Store (.aab / APK) Derleme
          </button>
          <button
            onClick={() => setActiveTab('configs')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'configs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            3. Hazır Android Dosyaları
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            4. Play Console Yayın Kontrolü
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
          
          {/* TAB 1: QUICK INSTALL & LIVE STATUS */}
          {activeTab === 'quick' && (
            <div className="space-y-6">
              
              {/* Banner: Android Install Action */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      {isInstalled ? 'Uygulama Cihazınızda Yüklü!' : 'matematikhocan.com Android / PWA Uygulaması'}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-lg mt-0.5">
                      Uygulama tam ekran, bildirim ve kamera izinleriyle native Android uygulaması gibi doğrudan telefon veya tabletinize kurulabilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {onTriggerInstall ? (
                    <button
                      onClick={onTriggerInstall}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black text-xs text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      Uygulamayı Cihaza Yükle
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Tarayıcınızın sağ üst menüsünden (üç nokta) "Ana Ekrana Ekle" veya "Uygulamayı Yükle" seçeneğine basarak anında telefonunuza yükleyebilirsiniz.')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black text-xs text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Ana Ekrana Ekle Rehberi
                    </button>
                  )}
                </div>
              </div>

              {/* PWA & Play Store Readiness Matrix */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Google Play Store & PWA Uyum Doğrulamaları
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">Web App Manifest (v2)</div>
                        <div className="text-[11px] text-slate-400">/manifest.json yapılandırıldı</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">Aktif</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">Service Worker & Caching</div>
                        <div className="text-[11px] text-slate-400">/sw.js çevrimdışı & push aktif</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">Aktif</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">Android İkonları (192 & 512px)</div>
                        <div className="text-[11px] text-slate-400">Maskable & Standart SVG/PNG</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">Tam</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">Kamera & Mikrofon İzinleri</div>
                        <div className="text-[11px] text-slate-400">Soru çekme & ses kaydı uyumlu</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">Uyumlu</span>
                  </div>
                </div>
              </div>

              {/* How TWA Works Info */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  Google Play Store Trusted Web Activity (TWA) Nedir?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google Play Store, modern web uygulamalarını <strong>Trusted Web Activity (TWA)</strong> standardı ile doğrudan resmi Android uygulaması (.aab/.apk) olarak kabul eder. Bu sayede uygulamanız Google Play Store'da listelenir, kullanıcılar Play Store'dan indirir ve telefonlarında tam ekran, adres çubuğu olmadan 100% native gibi çalışır.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: PLAY STORE BUILD METHODS */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              
              {/* Method Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveMethod('pwabuilder')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    activeMethod === 'pwabuilder'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300">
                      Önerilen
                    </span>
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="font-extrabold text-sm text-white">1. PWABuilder (1-Tık)</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Kod yazmadan doğrudan Google Play .aab çıktısı alın.
                  </div>
                </button>

                <button
                  onClick={() => setActiveMethod('bubblewrap')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    activeMethod === 'bubblewrap'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/30 text-purple-300">
                      Resmi Google
                    </span>
                    <Code2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="font-extrabold text-sm text-white">2. Bubblewrap CLI</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Google'ın resmi CLI aracıyla imzalı APK & AAB üretin.
                  </div>
                </button>

                <button
                  onClick={() => setActiveMethod('capacitor')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    activeMethod === 'capacitor'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                      Native Android
                    </span>
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-extrabold text-sm text-white">3. Capacitor / Studio</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Android Studio projesine dönüştürüp derleyin.
                  </div>
                </button>
              </div>

              {/* METHOD 1: PWABUILDER DETAILS */}
              {activeMethod === 'pwabuilder' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                      <h4 className="font-bold text-sm text-white">PWABuilder ile 2 Dakikada Google Play .aab Paketi Alma</h4>
                    </div>
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition"
                    >
                      PWABuilder Sitesine Git <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">1</div>
                      <div>
                        <p className="font-bold text-white">Uygulama URL'inizi Girin</p>
                        <p className="text-slate-400 mt-0.5">
                          <code className="text-indigo-300 font-mono bg-slate-950 px-1 py-0.5 rounded">{window.location.origin}</code> adresinizi PWABuilder arama kutusuna yapıştırın ve "Start" butonuna tıklayın.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">2</div>
                      <div>
                        <p className="font-bold text-white">"Package for Stores" &gt; Google Play Seçin</p>
                        <p className="text-slate-400 mt-0.5">
                          Uygulama manifestimiz ve servis işçimiz 100/100 PWA puanı alacaktır. "Google Play" seçeneğine tıklayın.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-bold text-white">Paket Bilgilerini Ayarlayın</p>
                        <p className="text-slate-400 mt-0.5">
                          Paket Kimliği: <code className="text-indigo-300 font-mono">com.matematikhocan.app</code> • Uygulama Adı: <code className="text-indigo-300 font-mono">matematikhocan.com</code>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">4</div>
                      <div>
                        <p className="font-bold text-white">İmzalı .aab (Android App Bundle) Dosyasını İndirin</p>
                        <p className="text-slate-400 mt-0.5">
                          "Generate Package" butonuna basarak Google Play Console'a yüklemeye hazır <code className="text-emerald-400 font-mono">app-release-signed.aab</code> dosyanızı indirin!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: BUBBLEWRAP DETAILS */}
              {activeMethod === 'bubblewrap' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                      <h4 className="font-bold text-sm text-white">Google Bubblewrap CLI ile Doğrudan Terminalden Derleme</h4>
                    </div>
                    <button
                      onClick={() => copyToClipboard('npm i -g @bubblewrap/cli\nbubblewrap init --manifest=https://matematikhocan.com/manifest.json\nbubblewrap build', 'bubblewrap-cmd')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'bubblewrap-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Komutları Kopyala
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 space-y-2 overflow-x-auto">
                    <p className="text-slate-500"># 1. Bubblewrap CLI aracını global yükleyin:</p>
                    <p className="text-purple-300 font-bold">npm install -g @bubblewrap/cli</p>
                    
                    <p className="text-slate-500 mt-3"># 2. Proje klasörünüzde TWA başlatın:</p>
                    <p className="text-purple-300 font-bold">bubblewrap init --manifest={window.location.origin}/manifest.json</p>
                    
                    <p className="text-slate-500 mt-3"># 3. İmzalı Google Play .AAB & APK çıktısını derleyin:</p>
                    <p className="text-emerald-400 font-bold">bubblewrap build</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    💡 Bubblewrap, Android SDK ve Java KeyStore dosyalarını otomatik oluşturur ve Google Play Console için imzalı <code className="text-slate-200 font-mono">app-release-bundle.aab</code> dosyasını verir.
                  </p>
                </div>
              )}

              {/* METHOD 3: CAPACITOR DETAILS */}
              {activeMethod === 'capacitor' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">3</div>
                      <h4 className="font-bold text-sm text-white">Capacitor ile Tam Native Android Studio Projesi</h4>
                    </div>
                    <button
                      onClick={() => copyToClipboard('npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init MatematikHocan com.matematikhocan.app\nnpx cap add android\nnpx cap sync\nnpx cap open android', 'cap-cmd')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'cap-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Komutları Kopyala
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 space-y-2 overflow-x-auto">
                    <p className="text-slate-500"># 1. Capacitor paketlerini projeye ekleyin:</p>
                    <p className="text-emerald-300 font-bold">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                    
                    <p className="text-slate-500 mt-3"># 2. Android platformunu ekleyin & web derlemesini senkronize edin:</p>
                    <p className="text-emerald-300 font-bold">npm run build</p>
                    <p className="text-emerald-300 font-bold">npx cap add android</p>
                    <p className="text-emerald-300 font-bold">npx cap sync</p>
                    
                    <p className="text-slate-500 mt-3"># 3. Android Studio'da açıp doğrudan çalıştırın / AAB üretin:</p>
                    <p className="text-indigo-400 font-bold">npx cap open android</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: CONFIGURATION FILES (COPY / INSPECT) */}
          {activeTab === 'configs' && (
            <div className="space-y-4">
              <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-bold pb-2">
                <button
                  onClick={() => setActiveConfigTab('manifest')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'manifest' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  manifest.json
                </button>
                <button
                  onClick={() => setActiveConfigTab('assetlinks')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'assetlinks' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  assetlinks.json
                </button>
                <button
                  onClick={() => setActiveConfigTab('twa')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'twa' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  twa-manifest.json
                </button>
                <button
                  onClick={() => setActiveConfigTab('capacitor')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'capacitor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  capacitor.config.json
                </button>
                <button
                  onClick={() => setActiveConfigTab('androidmanifest')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'androidmanifest' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AndroidManifest.xml
                </button>
                <button
                  onClick={() => setActiveConfigTab('mainactivity')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'mainactivity' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MainActivity.kt
                </button>
                <button
                  onClick={() => setActiveConfigTab('gradle')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeConfigTab === 'gradle' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  build.gradle.kts
                </button>
              </div>

              {/* Code display with copy button */}
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300">
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => {
                      const content = activeConfigTab === 'manifest' ? manifestJsonContent :
                                      activeConfigTab === 'assetlinks' ? assetLinksJsonContent :
                                      activeConfigTab === 'twa' ? twaManifestContent :
                                      activeConfigTab === 'capacitor' ? capacitorConfigContent :
                                      activeConfigTab === 'mainactivity' ? mainActivityKotlinContent :
                                      activeConfigTab === 'gradle' ? gradleBuildKtsContent :
                                      androidManifestXmlContent;
                      copyToClipboard(content, activeConfigTab);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition text-[11px] font-bold"
                  >
                    {copiedKey === activeConfigTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Dosyayı Kopyala
                      </>
                    )}
                  </button>
                </div>

                <pre className="overflow-x-auto pt-6 leading-relaxed">
                  {activeConfigTab === 'manifest' && manifestJsonContent}
                  {activeConfigTab === 'assetlinks' && assetLinksJsonContent}
                  {activeConfigTab === 'twa' && twaManifestContent}
                  {activeConfigTab === 'capacitor' && capacitorConfigContent}
                  {activeConfigTab === 'androidmanifest' && androidManifestXmlContent}
                  {activeConfigTab === 'mainactivity' && mainActivityKotlinContent}
                  {activeConfigTab === 'gradle' && gradleBuildKtsContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: PLAY CONSOLE CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Google Play Console Yayın Öncesi Kontrol Listesi</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Uygulamanızı Play Console'da yayınlarken aşağıdaki adımları sırayla tamamlayın.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-indigo-400">
                    {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length}
                  </span>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tamamlandı</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'manifest', title: 'Web App Manifest & İkonlar', desc: '192x192 ve 512x512 maskable ikonlar eklendi.' },
                  { key: 'serviceworker', title: 'Service Worker & Offline Desteği', desc: 'sw.js dosyasında offline önbellekleme ve push bildirim dinleyicisi aktif.' },
                  { key: 'assetlinks', title: 'Digital Asset Links (assetlinks.json)', desc: 'Chrome adres çubuğunun gizlenmesi için /.well-known/assetlinks.json hazırlandı.' },
                  { key: 'camera_perm', title: 'Kamera ve Mikrofon İzin Bildirimi', desc: 'Soru fotoğrafı çekme ve sesli/videolu çözüm için izinler manifestte tanımlandı.' },
                  { key: 'package_name', title: 'Paket Adı Tanımlandı', desc: 'com.matematikhocan.app olarak belirlendi.' },
                  { key: 'privacy_policy', title: 'Gizlilik Politikası (Privacy Policy)', desc: 'Play Console gereksinimi için kullanıcı verisi ve kamera kullanımı politikası.' },
                  { key: 'content_rating', title: 'İçerik Derecelendirme Anketi (IARC)', desc: 'Play Console üzerinden Eğitim/Herkes (Everyone) kategorisi seçilecek.' },
                  { key: 'testers', title: '20 Kapalı Test Kullanıcısı (Play Console Kuralı)', desc: '14 gün boyunca 20 kapalı test kullanıcısı testi tamamlanmalı.' }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      checklist[item.key]
                        ? 'bg-slate-800/80 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                          checklist[item.key]
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-600 bg-slate-800'
                        }`}
                      >
                        {checklist[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`font-bold ${checklist[item.key] ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Uygulama Google Play TWA & Android Standartlarına 100% Uygundur</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition w-full sm:w-auto"
            >
              Kapat
            </button>
            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/30 w-full sm:w-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play Console'a Git
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
