import React from 'react';

interface LogoBmtProps {
  variant?: 'light' | 'dark' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
}

export const LogoBmt: React.FC<LogoBmtProps> = ({ variant = 'light', size = 'md' }) => {
  // Size classes
  const emblemSize = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';

  if (variant === 'stacked') {
    return (
      <div className="flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#054434] border-2 border-[#10b981]/20 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-white fill-current">
              {/* Outer circle accent */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="4" />
              {/* Stylized UG Logo */}
              <path d="M 32 30 L 32 58 C 32 68 40 74 50 74 C 60 74 68 68 68 58 L 68 30 L 58 30 L 58 58 C 58 62 54 65 50 65 C 46 65 42 62 42 58 L 42 30 Z" fill="white" />
              <path d="M 46 26 L 54 26 L 54 50 L 46 50 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="leading-tight">
          <h1 className="text-2xl font-extrabold text-[#054434] tracking-tight">
            BMT UGT Nusantara
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-[2px] w-8 bg-[#c5912f]/80"></span>
            <span className="text-base font-bold text-[#c5912f] tracking-wide">
              Cab. Pasirian
            </span>
            <span className="h-[2px] w-8 bg-[#c5912f]/80"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Circle Emblem */}
      <div className={`${emblemSize} shrink-0 rounded-full bg-[#054434] border-2 border-emerald-400/30 flex items-center justify-center shadow-lg`}>
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white fill-current">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
          <path d="M 32 30 L 32 58 C 32 68 40 74 50 74 C 60 74 68 68 68 58 L 68 30 L 58 30 L 58 58 C 58 62 54 65 50 65 C 46 65 42 62 42 58 L 42 30 Z" fill="white" />
          <path d="M 46 26 L 54 26 L 54 50 L 46 50 Z" fill="white" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 flex-wrap leading-none">
          <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#eab308]">
            BMT UGT
          </span>
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-widest ${variant === 'dark' ? 'text-white' : 'text-[#054434]'}`}>
            NUSANTARA
          </span>
        </div>
        <div className="mt-1.5 inline-block">
          <span className="bg-[#d97706] text-[#033c2e] text-xs sm:text-sm font-black px-3 py-1 rounded-md tracking-widest uppercase shadow-inner">
            CAB. PASIRIAN
          </span>
        </div>
      </div>
    </div>
  );
};
