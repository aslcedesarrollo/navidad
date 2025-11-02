import React from 'react';
import SectionWrapper from './SectionWrapper';
import { DonateContent } from '../types';

interface DonateProps {
  content: DonateContent;
  donationUrl: string;
  isEditMode: boolean;
  onUpdate: (newContent: DonateContent) => void;
}

const EditableField: React.FC<{isEditMode: boolean; value: string; onChange: (val: string) => void; className?: string; as?: 'p'|'h3'}> = ({ isEditMode, value, onChange, className, as: Component = 'p' }) => {
    if (isEditMode) {
        return <input type="text" value={value} onChange={e => onChange(e.target.value)} className={`${className} bg-white/20 border border-dashed border-white/50 w-full p-1 rounded-md placeholder-white/70 focus:ring-2 focus:ring-gold focus:outline-none`} />;
    }
    return <Component className={className}>{value}</Component>;
}

const Donate: React.FC<DonateProps> = ({ content, donationUrl, isEditMode, onUpdate }) => {
  const handleChange = (field: keyof DonateContent, value: string) => {
    onUpdate({ ...content, [field]: value });
  };
  
  // Construct the embed URL from the main donation URL
  const embedUrl = donationUrl ? donationUrl.replace('.org/', '.org/embed/') : '';

  return (
    <SectionWrapper
      id="donar"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-christmas-green text-white"
      isEditMode={isEditMode}
      onUpdate={(updates) => onUpdate({ ...content, ...updates })}
    >
      <div className="max-w-4xl mx-auto text-center">
        <EditableField 
            isEditMode={isEditMode} 
            value={content.heading} 
            onChange={(val) => handleChange('heading', val)} 
            className="text-2xl font-bold mb-6 text-center" 
            as="h3" 
        />
        {embedUrl ? (
            <iframe
                src={embedUrl}
                title="Formulario de Donación"
                className="w-full rounded-lg shadow-2xl"
                style={{ minHeight: '700px', border: 'none' }}
                loading="lazy"
            ></iframe>
        ) : (
            <div className="bg-white/10 p-8 rounded-lg">
                <p>La URL de donación no está configurada correctamente.</p>
            </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Donate;