import { Download } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 512, showText = true }: LogoProps) {
  const iconSize = size;
  const fontSize = size * 0.15;
  const smallFontSize = size * 0.08;
  
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
    >
      {/* Background Circle */}
      <circle cx="256" cy="256" r="256" fill="url(#gradient)" />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
        </linearGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Bus Icon */}
      <g transform="translate(256, 200)" filter="url(#shadow)">
        {/* Bus Body */}
        <rect
          x="-90"
          y="-50"
          width="180"
          height="100"
          rx="15"
          fill="white"
          stroke="none"
        />
        
        {/* Bus Windshield */}
        <rect
          x="-75"
          y="-35"
          width="150"
          height="45"
          rx="8"
          fill="#0f172a"
          opacity="0.15"
        />
        
        {/* Bus Windows */}
        <rect x="-65" y="-25" width="35" height="25" rx="4" fill="#0f172a" opacity="0.2" />
        <rect x="-20" y="-25" width="35" height="25" rx="4" fill="#0f172a" opacity="0.2" />
        <rect x="25" y="-25" width="35" height="25" rx="4" fill="#0f172a" opacity="0.2" />
        
        {/* Bus Door */}
        <rect x="-70" y="15" width="25" height="35" rx="3" fill="#0f172a" opacity="0.2" />
        
        {/* Bus Bottom Windows */}
        <rect x="-30" y="15" width="30" height="20" rx="3" fill="#0f172a" opacity="0.15" />
        <rect x="10" y="15" width="30" height="20" rx="3" fill="#0f172a" opacity="0.15" />
        
        {/* Wheels */}
        <circle cx="-55" cy="55" r="18" fill="#0f172a" />
        <circle cx="-55" cy="55" r="12" fill="#64748b" />
        <circle cx="55" cy="55" r="18" fill="#0f172a" />
        <circle cx="55" cy="55" r="12" fill="#64748b" />
        
        {/* Headlights */}
        <circle cx="-80" cy="35" r="6" fill="#fbbf24" opacity="0.8" />
        <circle cx="80" cy="35" r="6" fill="#fbbf24" opacity="0.8" />
        
        {/* Front Grill Lines */}
        <line x1="-90" y1="20" x2="90" y2="20" stroke="white" strokeWidth="2" opacity="0.3" />
        <line x1="-90" y1="28" x2="90" y2="28" stroke="white" strokeWidth="2" opacity="0.3" />
      </g>
      
      {/* Text */}
      {showText && (
        <>
          <text
            x="256"
            y="340"
            fontSize={fontSize}
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ letterSpacing: '2px' }}
          >
            SAFAR e GIKI
          </text>
          
          <text
            x="256"
            y="370"
            fontSize={smallFontSize}
            fill="white"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            opacity="0.9"
          >
            Student Bus Service
          </text>
        </>
      )}
      
      {/* Decorative Road Lines */}
      <g opacity="0.15">
        <rect x="100" y="450" width="60" height="8" rx="4" fill="white" />
        <rect x="180" y="450" width="60" height="8" rx="4" fill="white" />
        <rect x="260" y="450" width="60" height="8" rx="4" fill="white" />
        <rect x="340" y="450" width="60" height="8" rx="4" fill="white" />
      </g>
    </svg>
  );
}

export function LogoGenerator() {
  const downloadLogo = (size: number) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#14b8a6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Bus scaling factor
    const scale = size / 512;

    // Draw bus body
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect((256 - 90) * scale, (200 - 50) * scale, 180 * scale, 100 * scale, 15 * scale);
    ctx.fill();

    // Draw windshield
    ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.beginPath();
    ctx.roundRect((256 - 75) * scale, (200 - 35) * scale, 150 * scale, 45 * scale, 8 * scale);
    ctx.fill();

    // Draw windows
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    const windows = [
      { x: 256 - 65, y: 200 - 25, w: 35, h: 25 },
      { x: 256 - 20, y: 200 - 25, w: 35, h: 25 },
      { x: 256 + 25, y: 200 - 25, w: 35, h: 25 },
    ];
    windows.forEach(win => {
      ctx.beginPath();
      ctx.roundRect(win.x * scale, win.y * scale, win.w * scale, win.h * scale, 4 * scale);
      ctx.fill();
    });

    // Draw door
    ctx.beginPath();
    ctx.roundRect((256 - 70) * scale, (200 + 15) * scale, 25 * scale, 35 * scale, 3 * scale);
    ctx.fill();

    // Draw bottom windows
    ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.beginPath();
    ctx.roundRect((256 - 30) * scale, (200 + 15) * scale, 30 * scale, 20 * scale, 3 * scale);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect((256 + 10) * scale, (200 + 15) * scale, 30 * scale, 20 * scale, 3 * scale);
    ctx.fill();

    // Draw wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc((256 - 55) * scale, (200 + 55) * scale, 18 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((256 + 55) * scale, (200 + 55) * scale, 18 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc((256 - 55) * scale, (200 + 55) * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((256 + 55) * scale, (200 + 55) * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw headlights
    ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.beginPath();
    ctx.arc((256 - 80) * scale, (200 + 35) * scale, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((256 + 80) * scale, (200 + 35) * scale, 6 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.15}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('SAFAR e GIKI', size / 2, 340 * scale);

    ctx.font = `${size * 0.08}px system-ui, -apple-system, sans-serif`;
    ctx.globalAlpha = 0.9;
    ctx.fillText('Student Bus Service', size / 2, 370 * scale);
    ctx.globalAlpha = 1;

    // Draw road lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const roadLines = [100, 180, 260, 340];
    roadLines.forEach(x => {
      ctx.beginPath();
      ctx.roundRect(x * scale, 450 * scale, 60 * scale, 8 * scale, 4 * scale);
      ctx.fill();
    });

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a');
        link.download = `icon-${size}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white mb-2">Safar e GIKI Logo Generator</h1>
          <p className="text-slate-300">Download your PWA app icons below</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 512x512 Logo */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">512x512 (Large Icon)</h2>
              <button
                onClick={() => downloadLogo(512)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="flex justify-center">
              <div id="logo-512" className="rounded-2xl overflow-hidden shadow-lg">
                <Logo size={512} showText={true} />
              </div>
            </div>
          </div>

          {/* 192x192 Logo */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">192x192 (Small Icon)</h2>
              <button
                onClick={() => downloadLogo(192)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="flex justify-center">
              <div id="logo-192" className="rounded-2xl overflow-hidden shadow-lg">
                <Logo size={192} showText={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Icon Only Versions */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-xl mb-6">Icon Only (No Text) - Alternative Versions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div id="logo-512-notext" className="rounded-xl overflow-hidden shadow-lg mb-2">
                <Logo size={256} showText={false} />
              </div>
              <button
                onClick={() => {
                  const svg = document.getElementById('logo-512-notext');
                  if (!svg) return;
                  const canvas = document.createElement('canvas');
                  canvas.width = 512;
                  canvas.height = 512;
                  const ctx = canvas.getContext('2d');
                  const data = new XMLSerializer().serializeToString(svg);
                  const img = new Image();
                  const blob = new Blob([data], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  img.onload = () => {
                    ctx?.drawImage(img, 0, 0, 512, 512);
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const link = document.createElement('a');
                        link.download = 'icon-512-notext.png';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                      }
                    }, 'image/png');
                    URL.revokeObjectURL(url);
                  };
                  img.src = url;
                }}
                className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors"
              >
                512x512
              </button>
            </div>
            <div className="text-center">
              <div id="logo-192-notext" className="rounded-xl overflow-hidden shadow-lg mb-2">
                <Logo size={128} showText={false} />
              </div>
              <button
                onClick={() => {
                  const svg = document.getElementById('logo-192-notext');
                  if (!svg) return;
                  const canvas = document.createElement('canvas');
                  canvas.width = 192;
                  canvas.height = 192;
                  const ctx = canvas.getContext('2d');
                  const data = new XMLSerializer().serializeToString(svg);
                  const img = new Image();
                  const blob = new Blob([data], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  img.onload = () => {
                    ctx?.drawImage(img, 0, 0, 192, 192);
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const link = document.createElement('a');
                        link.download = 'icon-192-notext.png';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                      }
                    }, 'image/png');
                    URL.revokeObjectURL(url);
                  };
                  img.src = url;
                }}
                className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors"
              >
                192x192
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
          <h3 className="text-lg mb-3 text-emerald-900">📥 How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-emerald-800">
            <li>Click "Download" on each logo to save them</li>
            <li>Place the downloaded PNG files in your <code className="bg-white px-2 py-1 rounded">/public/</code> folder</li>
            <li>Rename them to:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li><code className="bg-white px-2 py-1 rounded">icon-512.png</code></li>
                <li><code className="bg-white px-2 py-1 rounded">icon-192.png</code></li>
              </ul>
            </li>
            <li>Deploy your app and the icons will appear when users install!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
