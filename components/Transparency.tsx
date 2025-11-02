import React from 'react';
import SectionWrapper from './SectionWrapper';
import { TransparencyContent } from '../types';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden border-2 border-gold/50">
      <div
        className="bg-gold h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      >
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm" style={{ textShadow: '0 0 3px rgba(0,0,0,0.6)' }}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

interface TransparencyProps {
  content: TransparencyContent;
  isEditMode: boolean;
  onUpdate: (newContent: TransparencyContent) => void;
}

const EditableNumber: React.FC<{isEditMode: boolean; value: number; onChange: (val: number) => void; className?: string}> = ({ isEditMode, value, onChange, className }) => {
  if (isEditMode) {
    return <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className={`${className} bg-slate-100 border border-dashed border-blue-400 rounded-md p-1 w-full max-w-[200px] text-center focus:ring-2 focus:ring-blue-500 focus:outline-none`} />;
  }
  const formatter = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 2 });
  return <p className={className}>{formatter.format(value)}</p>
}

const Transparency: React.FC<TransparencyProps> = ({ content, isEditMode, onUpdate }) => {
  const progressPercentage = content.goal > 0 ? (content.raised / content.goal) * 100 : 0;

  return (
    <SectionWrapper
      id="transparencia"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-slate-50"
      isEditMode={isEditMode}
      onUpdate={(updates) => onUpdate({ ...content, ...updates })}
    >
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-6">
          <ProgressBar percentage={progressPercentage} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-4 sm:mb-0 flex flex-col items-center sm:items-start">
            <p className="text-lg text-gray-600">Recaudado</p>
            <EditableNumber
              isEditMode={isEditMode}
              value={content.raised}
              onChange={(val) => onUpdate({ ...content, raised: val })}
              className="text-3xl font-bold text-christmas-green"
            />
          </div>
          <div className="text-right flex flex-col items-center sm:items-end">
            <p className="text-lg text-gray-600">Meta</p>
            <EditableNumber
              isEditMode={isEditMode}
              value={content.goal}
              onChange={(val) => onUpdate({ ...content, goal: val })}
              className="text-3xl font-bold text-gray-800"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Transparency;