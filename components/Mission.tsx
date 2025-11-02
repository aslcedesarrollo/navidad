import React from 'react';
import SectionWrapper from './SectionWrapper';
import { MissionContent, BasketItem } from '../types';

interface MissionProps {
  content: MissionContent;
  isEditMode: boolean;
  onUpdate: (newContent: MissionContent) => void;
}

const Mission: React.FC<MissionProps> = ({ content, isEditMode, onUpdate }) => {
  const handleItemChange = (index: number, field: keyof BasketItem, value: string) => {
    const newItems = [...content.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...content, items: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...content.items, { name: "Nuevo Item", icon: "fa-solid fa-star" }];
    onUpdate({ ...content, items: newItems });
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = content.items.filter((_, i) => i !== index);
    onUpdate({ ...content, items: newItems });
  };

  return (
    <SectionWrapper
      id="mision"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-slate-50"
      isEditMode={isEditMode}
      onUpdate={(updates) => onUpdate({ ...content, ...updates })}
    >
      <div className="max-w-4xl mx-auto text-center mb-12">
        {isEditMode ? (
          <textarea
            value={content.description.replace(/<[^>]*>?/gm, '')} // Basic strip tags for editing
            onChange={(e) => onUpdate({ ...content, description: e.target.value })}
            className="w-full p-2 border border-dashed rounded-md bg-slate-100"
            rows={4}
          />
        ) : (
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: content.description }}></p>
        )}
      </div>
      {isEditMode ? (
        <input
            type="text"
            value={content.basketTitle}
            onChange={(e) => onUpdate({ ...content, basketTitle: e.target.value })}
            className="text-2xl font-bold text-center text-christmas-green mb-8 w-full bg-slate-100 border border-dashed border-blue-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      ) : (
        <h3 className="text-2xl font-bold text-center text-christmas-green mb-8">{content.basketTitle}</h3>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
        {content.items.map((item, index) => (
          <div key={index} className="relative flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            {isEditMode && (
              <button onClick={() => handleRemoveItem(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs z-10">&times;</button>
            )}
            <div className="text-4xl text-christmas-green mb-3">
              <i className={item.icon}></i>
            </div>
            {isEditMode ? (
              <>
                <input type="text" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="font-semibold text-gray-700 w-full text-center border border-dashed bg-slate-100 rounded px-1" />
                <input type="text" value={item.icon} onChange={(e) => handleItemChange(index, 'icon', e.target.value)} className="text-xs text-gray-500 w-full text-center border border-dashed bg-slate-100 rounded mt-1 px-1" />
              </>
            ) : (
              <span className="font-semibold text-gray-700">{item.name}</span>
            )}
          </div>
        ))}
        {isEditMode && (
          <button onClick={handleAddItem} className="flex flex-col items-center justify-center text-center p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-dashed">
            <div className="text-4xl text-gray-400 mb-3">
              <i className="fas fa-plus"></i>
            </div>
            <span className="font-semibold text-gray-500">Añadir</span>
          </button>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Mission;