import React, { useRef } from 'react';
import SectionWrapper from './SectionWrapper';
import { UpdatesContent, UpdatePost } from '../types';

interface UpdatesProps {
  content: UpdatesContent;
  isEditMode: boolean;
  onUpdate: (newContent: UpdatesContent) => void;
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

const Updates: React.FC<UpdatesProps> = ({ content, isEditMode, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePostIndexRef = useRef<number | null>(null);

  const handlePostChange = (index: number, field: keyof UpdatePost, value: string | number) => {
    const newPosts = [...content.posts];
    (newPosts[index] as any)[field] = value;
    onUpdate({ ...content, posts: newPosts });
  };
  
  const handleAddPost = () => {
    const newPost: UpdatePost = {
      id: Date.now(),
      image: "https://images.unsplash.com/photo-1545299438-16202a5c8689?q=80&w=600&auto=format&fit=crop",
      title: "Nuevo Título de Noticia",
      description: "Describe aquí la nueva actividad o noticia de la campaña.",
      date: new Date().toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric'}),
    };
    onUpdate({ ...content, posts: [newPost, ...content.posts]});
  }

  const handleRemovePost = (id: number) => {
    const newPosts = content.posts.filter(post => post.id !== id);
    onUpdate({ ...content, posts: newPosts });
  };

  const triggerFileSelect = (index: number) => {
    activePostIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const currentIndex = activePostIndexRef.current;

    if (file && currentIndex !== null) {
      try {
        const optimizedImage = await optimizeImage(file, 800); // Max width 800px for post images
        handlePostChange(currentIndex, 'image', optimizedImage);
      } catch (error) {
        console.error("Image optimization failed:", error);
        // Fallback
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (typeof loadEvent.target?.result === 'string') {
            handlePostChange(currentIndex, 'image', loadEvent.target.result);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        activePostIndexRef.current = null;
        if (event.target) event.target.value = '';
      }
    }
  };


  return (
    <SectionWrapper
      id="noticias"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-white"
      isEditMode={isEditMode}
      onUpdate={(updates) => onUpdate({ ...content, ...updates })}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      {isEditMode && (
          <div className="text-center mb-8">
              <button onClick={handleAddPost} className="bg-christmas-green text-white font-bold py-2 px-6 rounded-full hover:bg-green-800 transition-colors">
                  <i className="fas fa-plus mr-2"></i>Añadir Noticia
              </button>
          </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.posts.map((post, index) => {
          const pageUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href.split('#')[0] + '#noticias') : '';
          const shareText = encodeURIComponent(`¡Qué emoción! ✨ Mira la última actualización de "${post.title}" en la campaña "Mi Deseo de Navidad". ¡Cada granito de arena nos acerca a la meta de llevar alegría a 300 familias! 🎄❤️ Apoya esta hermosa causa aquí:`);
          
          const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
          const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
          const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}%20${pageUrl}`;

          return (
            <div key={post.id} className="relative bg-slate-50 rounded-lg shadow-lg overflow-hidden flex flex-col group">
              {isEditMode && (
                <div className="absolute top-2 right-2 z-10 space-x-2">
                  <button onClick={() => triggerFileSelect(index)} className="bg-blue-500 text-white w-8 h-8 rounded-full text-xs"><i className="fas fa-image"></i></button>
                  <button onClick={() => handleRemovePost(post.id)} className="bg-red-500 text-white w-8 h-8 rounded-full text-xs"><i className="fas fa-trash"></i></button>
                </div>
              )}
              <div className="overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                {isEditMode ? (
                  <input type="text" value={post.date} onChange={(e) => handlePostChange(index, 'date', e.target.value)} className="text-sm text-gray-500 mb-2 w-full border border-dashed rounded bg-slate-100 p-1" />
                ) : (
                  <p className="text-sm text-gray-500 mb-2"><i className="fas fa-calendar-alt mr-2"></i>{post.date}</p>
                )}
                {isEditMode ? (
                  <textarea value={post.title} onChange={(e) => handlePostChange(index, 'title', e.target.value)} className="text-xl font-bold text-gray-800 mb-3 flex-grow w-full border border-dashed rounded resize-none bg-slate-100 p-1" rows={2}/>
                ) : (
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex-grow">{post.title}</h3>
                )}
                {isEditMode ? (
                  <textarea value={post.description} onChange={(e) => handlePostChange(index, 'description', e.target.value)} className="text-gray-600 w-full border border-dashed rounded resize-none bg-slate-100 p-1" rows={3}/>
                ) : (
                  <p className="text-gray-600">{post.description}</p>
                )}

                {!isEditMode && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-600">Compartir:</span>
                      <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors text-2xl" title="Compartir en Facebook">
                        <i className="fab fa-facebook-square"></i>
                      </a>
                      <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors text-2xl" title="Compartir en Twitter">
                        <i className="fab fa-twitter-square"></i>
                      </a>
                      <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors text-2xl" title="Compartir en WhatsApp">
                        <i className="fab fa-whatsapp-square"></i>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  );
};

export default Updates;