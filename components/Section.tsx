import React from 'react';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  dark?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, children, className = '', title, dark = false }) => {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${dark ? 'bg-navy' : ''} ${className}`}
    >
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-12 md:mb-16 tracking-tight text-white max-w-6xl mx-auto px-5 md:px-8">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;
