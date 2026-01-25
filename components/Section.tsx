
import React from 'react';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  dark?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, children, className = "", title, dark = false }) => {
  return (
    <section 
      id={id} 
      className={`relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden ${dark ? 'bg-[#193441]' : ''} ${className}`}
    >
      {title && (
        <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter text-white">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;
