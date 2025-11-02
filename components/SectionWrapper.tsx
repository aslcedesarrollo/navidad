import React from 'react';

interface EditableTextProps {
  isEditMode: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: 'h2' | 'p';
  inputClassName?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ isEditMode, value, onChange, className, as: Component = 'p', inputClassName }) => {
  if (isEditMode) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} ${inputClassName || ''} bg-slate-100 border border-dashed border-blue-400 p-1 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      />
    );
  }
  return <Component className={className}>{value}</Component>;
};


interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
  isEditMode: boolean;
  onUpdate: (updates: { title: string, subtitle: string }) => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, subtitle, children, className = 'bg-white', isEditMode, onUpdate }) => {
  return (
    <section id={id} className={`py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
            <EditableText
              isEditMode={isEditMode}
              value={title}
              onChange={(newTitle) => onUpdate({ title: newTitle, subtitle })}
              as="h2"
              className="text-3xl md:text-4xl font-bold font-serif text-christmas-red"
              inputClassName="text-center"
            />
          <div className="max-w-2xl mx-auto">
            <EditableText
              isEditMode={isEditMode}
              value={subtitle}
              onChange={(newSubtitle) => onUpdate({ title, subtitle: newSubtitle })}
              as="p"
              className="mt-4 text-lg text-gray-600"
              inputClassName="text-center"
            />
          </div>
          <div className="mt-4 w-24 h-1 bg-gold mx-auto rounded"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;