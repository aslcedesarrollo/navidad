import React, { useRef, useState, useEffect } from 'react';
import { HeroContent } from '../types';
import CountdownTimer from './CountdownTimer';

interface HeroProps {
  content: HeroContent;
  donationUrl: string;
  isEditMode: boolean;
  onUpdate: (newContent: HeroContent) => void;
}

const optimizeImage = (file: File, maxWidth: number, quality: number = 0.7): Promise<string> => {
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

const Hero: React.FC<HeroProps> = ({ content, donationUrl, isEditMode, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleChange = (field: keyof HeroContent, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const optimizedImage = await optimizeImage(file, 1920); // Resize to max 1920px width
        handleChange('backgroundImage', optimizedImage);
      } catch (error) {
        console.error("Image optimization failed:", error);
        // Fallback to original file if optimization fails
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (typeof loadEvent.target?.result === 'string') {
            handleChange('backgroundImage', loadEvent.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const commonInputClass = "bg-black/30 backdrop-blur-sm border border-dashed border-white/50 text-center text-white rounded-md p-2 placeholder-white/80 focus:ring-2 focus:ring-gold focus:outline-none";

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
            backgroundImage: `url('${content.backgroundImage}')`,
            transform: `translateY(${offsetY * 0.5}px)`
        }}
      ></div>
      <div className="absolute inset-0 bg-christmas-red opacity-60"></div>
      <div className="relative z-10 p-6">
        {isEditMode ? (
          <input
            type="text"
            value={content.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`${commonInputClass} w-full text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight mb-4`}
          />
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight mb-4">
            {content.title}
          </h1>
        )}

        {isEditMode ? (
          <textarea
            value={content.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className={`${commonInputClass} w-full max-w-3xl text-lg md:text-2xl mb-2 resize-none`}
            rows={2}
          />
        ) : (
          <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-2 text-center">
            {content.subtitle}
          </p>
        )}

        <CountdownTimer
          targetDate={content.countdownTargetDate}
          isEditMode={isEditMode}
          onUpdate={(newDate) => handleChange('countdownTargetDate', newDate)}
        />

        <div className="inline-block">
          {isEditMode ? (
            <input
              type="text"
              value={content.cta}
              onChange={(e) => handleChange('cta', e.target.value)}
              className={`${commonInputClass} text-lg font-bold py-4 px-10`}
            />
          ) : (
            <a href={donationUrl} target="_blank" rel="noopener noreferrer" className="bg-gold hover:bg-yellow-500 text-white font-bold text-lg py-4 px-10 rounded-full transition-transform duration-300 hover:scale-105 inline-block">
              <i className="fas fa-heart mr-2"></i>{content.cta}
            </a>
          )}
        </div>
      </div>
      {isEditMode && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={triggerFileSelect}
            className="absolute top-24 right-5 bg-white text-gray-800 font-semibold text-sm py-2 px-4 rounded-lg shadow-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            aria-label="Cambiar imagen de fondo"
          >
            <i className="fas fa-camera mr-2"></i>Cambiar Fondo
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;