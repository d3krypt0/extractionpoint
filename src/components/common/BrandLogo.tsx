import React from 'react';

interface BrandLogoProps {
  variant?: 'icon' | 'horizontal' | 'stacked';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  showTagline = false,
  size = 'sm',
}) => {
  // Height classes that precisely span the total height of the 2-line text lockup
  const iconHeights = {
    sm: 'h-10 w-auto sm:h-11',
    md: 'h-13 w-auto sm:h-14',
    lg: 'h-18 w-auto sm:h-20',
  };

  const titleSizes = {
    sm: 'text-xs sm:text-sm tracking-[0.24em]',
    md: 'text-base sm:text-lg tracking-[0.26em]',
    lg: 'text-xl sm:text-2xl tracking-[0.28em]',
  };

  const taglineSizes = {
    sm: 'text-[9.5px] sm:text-[10px] tracking-[0.18em]',
    md: 'text-xs sm:text-sm tracking-[0.2em]',
    lg: 'text-sm sm:text-base tracking-[0.22em]',
  };

  const logoMark = (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${iconHeights[size]}`}>
      {/* Light Mode Logo (Deep charcoal #111111 on light background) */}
      <img
        src="/brand/logo_cropped_black.png"
        alt="Extraction Point Logo"
        className="h-full w-auto object-contain block dark:hidden select-none"
        draggable={false}
      />
      {/* Dark Mode Logo (Crisp white #FFFFFF on dark background) */}
      <img
        src="/brand/logo_cropped_white.png"
        alt="Extraction Point Logo"
        className="h-full w-auto object-contain hidden dark:block select-none"
        draggable={false}
      />
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center select-none ${className}`}>{logoMark}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
        {logoMark}
        <div className="mt-2.5">
          <h1 className={`font-brand font-bold uppercase text-[#111111] dark:text-[#f8f7f4] leading-tight whitespace-nowrap ${titleSizes[size]}`}>
            EXTRACTION POINT
          </h1>
          {showTagline && (
            <p className={`font-brand uppercase text-[#666666] dark:text-[#a0a0a8] font-semibold mt-1 whitespace-nowrap ${taglineSizes[size]}`}>
              Your Day Deserves Better Caffeine.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default): Full-bleed logo mark height matches the top and bottom bounds of the text block
  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {logoMark}
      <div className="flex flex-col justify-center text-left">
        <h1 className={`font-brand font-bold uppercase text-[#111111] dark:text-[#f8f7f4] leading-tight whitespace-nowrap ${titleSizes[size]}`}>
          EXTRACTION POINT
        </h1>
        {showTagline ? (
          <p className={`font-brand uppercase text-[#777777] dark:text-[#9999a2] font-semibold leading-tight mt-0.5 whitespace-nowrap ${taglineSizes[size]}`}>
            Your Day Deserves Better Caffeine.
          </p>
        ) : (
          <p className={`font-brand uppercase text-[#888888] dark:text-[#888892] font-semibold leading-tight mt-0.5 whitespace-nowrap ${taglineSizes[size]}`}>
            Specialty Coffee
          </p>
        )}
      </div>
    </div>
  );
};
