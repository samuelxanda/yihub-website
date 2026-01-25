
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StickerProps {
  text: string;
  Icon?: LucideIcon;
  className?: string;
  rotate?: string;
  delay?: string;
}

const Sticker: React.FC<StickerProps> = ({ text, Icon, className = "", rotate = "rotate-3", delay = "0s" }) => {
  return (
    <div 
      className={`absolute flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2.5 sm:px-4 md:px-6 lg:px-7 py-1.5 sm:py-2 md:py-3 lg:py-3.5 bg-white text-[#193441] font-black text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-tighter rounded-full shadow-[2px_2px_0px_0px_#438CAF] font-mono text-xs md:text-sm text-black/90 tracking-widesm:shadow-[4px_4px_0px_0px_#438CAF] md:shadow-[6px_6px_0px_0px_#438CAF] ${rotate} border-[1.5px] sm:border-2 md:border-3 border-[#193441] pointer-events-none select-none ${className} transition-all animate-float`}
      style={{ 
        zIndex: 10, 
        animationDelay: delay,
        '--tw-rotate': rotate.replace('rotate-', '').replace('-', '-').includes('rotate') ? '0deg' : rotate.split('-').pop() + 'deg'
      } as any}
    >
      {Icon && <Icon size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#438CAF]" strokeWidth={3} />}
      {text}
    </div>
  );
};

export default Sticker;
