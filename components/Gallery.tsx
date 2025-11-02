import React, { useRef } from 'react';
import SectionWrapper from './SectionWrapper';
import { GalleryContent, GalleryImage } from '../types';

interface GalleryProps {
  content: GalleryContent;
  isEditMode: boolean;
  onUpdate: (newContent: GalleryContent) => void;
}

const optimizeImage = (file: File, maxWidth: number, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') {
        return reject(new Error("Failed to read file."));
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error("Could not get canvas context."));
        }
        let { width, height } = img;
        if (width > maxWidth) {
          const scaleFactor = maxWidth / width;
          height = height * scaleFactor;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type, quality));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Gallery: React.FC<GalleryProps> = ({ content, isEditMode, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputActionRef = useRef<'add' | 'edit' | null>(null);
  const activeImageIdRef = useRef<number | null>(null);

  const handleImageChange = (id: number, field: keyof GalleryImage, value: string) => {
    const newImages = content.images.map(img => img.id === id ? { ...img, [field]: value } : img);
    onUpdate({ ...content, images: newImages });
  };
  
  const handleRemoveImage = (id: number) => {
    onUpdate({ ...content, images: content.images.filter(img => img.id !== id) });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const optimizedSrc = await optimizeImage(file, 1200); // Max width 1200px for gallery

        if (fileInputActionRef.current === 'edit' && activeImageIdRef.current !== null) {
            handleImageChange(activeImageIdRef.current, 'src', optimizedSrc);
        } else if (fileInputActionRef.current === 'add') {
            const alt = prompt("Ingresa el texto alternativo para la imagen:", file.name || "Nueva imagen de la campaña");
            const newImage: GalleryImage = {
                id: Date.now(),
                src: optimizedSrc,
                alt: alt || "Imagen de la campaña"
            };
            onUpdate({ ...content, images: [...content.images, newImage] });
        }
    } catch (error) {
        console.error("Image optimization failed:", error);
    } finally {
        if(event.target) event.target.value = '';
        fileInputActionRef.current = null;
        activeImageIdRef.current = null;
    }
  };

  const triggerFileSelect = (action: 'add' | 'edit', imageId?: number) => {
    fileInputActionRef.current = action;
    if (action === 'edit' && imageId) {
        activeImageIdRef.current = imageId;
    }
    fileInputRef.current?.click();
  };


  return (
    <SectionWrapper
      id="galeria"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-white"
      isEditMode={isEditMode}
      onUpdate={(updates) => onUpdate({ ...content, ...updates })}
    >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        {isEditMode && (
            <div className="text-center mb-8">
                <button onClick={() => triggerFileSelect('add')} className="bg-christmas-green text-white font-bold py-2 px-6 rounded-full hover:bg-green-800 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Añadir Imagen
                </button>
            </div>
        )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {content.images.map((image, index) => (
          <div key={image.id} className={`relative overflow-hidden rounded-lg shadow-md group ${index === 0 ? 'col-span-2 md:col-span-2' : ''}`}>
            <img 
              src={image.src} 
              alt={image.alt} 
              className="h-full w-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
            />
            {isEditMode && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <input type="text" value={image.alt} onChange={e => handleImageChange(image.id, 'alt', e.target.value)} className="w-full text-xs bg-black/50 text-white border-b border-dashed text-center mb-2 rounded p-1" />
                    <div className="flex space-x-2">
                      <button onClick={() => triggerFileSelect('edit', image.id)} className="bg-blue-500 text-white w-8 h-8 rounded-full text-xs"><i className="fas fa-image"></i></button>
                      <button onClick={() => handleRemoveImage(image.id)} className="bg-red-500 text-white w-8 h-8 rounded-full text-xs"><i className="fas fa-trash"></i></button>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Gallery;