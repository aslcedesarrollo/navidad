import React from 'react';

interface CmsControlsProps {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}

const CmsControls: React.FC<CmsControlsProps> = ({ isEditMode, setIsEditMode }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <button 
        onClick={() => setIsEditMode(!isEditMode)} 
        className="bg-christmas-red text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-red-800 transition-all duration-300 transform hover:scale-110"
        aria-label={isEditMode ? "Guardar cambios" : "Activar modo edición"}
        title={isEditMode ? "Guardar y Salir del Modo Edición" : "Activar Modo Edición"}
      >
        <i className={`fas ${isEditMode ? 'fa-check' : 'fa-pencil-alt'}`}></i>
      </button>
      {isEditMode && <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-48 text-center animate-pulse">Modo Edición Activado</div>}
    </div>
  );
};

export default CmsControls;