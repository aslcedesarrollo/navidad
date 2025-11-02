import React from 'react';
import { FooterContent } from '../types';

interface FooterProps {
  content: FooterContent & { campaignName: string };
  isEditMode: boolean;
  onUpdate: (newContent: FooterContent) => void;
}

const Footer: React.FC<FooterProps> = ({ content, isEditMode, onUpdate }) => {
  const handleChange = (field: keyof FooterContent, value: string) => {
    const { campaignName, ...footerContent } = content;
    onUpdate({ ...footerContent, [field]: value });
  };
  
  const commonInputClass = "w-full bg-gray-700 text-gray-300 border border-dashed border-gray-500 rounded-md p-1";

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold mb-4"><i className="fas fa-gift mr-2 text-gold"></i>{content.campaignName}</h3>
            {isEditMode ? (
              <textarea 
                value={content.about}
                onChange={(e) => handleChange('about', e.target.value)}
                className={`${commonInputClass} text-sm`}
                rows={3}
              />
            ) : (
              <p className="text-gray-400">{content.about}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><a href="#mision" className="text-gray-400 hover:text-gold transition-colors">Nuestra Misión</a></li>
              <li><a href="#transparencia" className="text-gray-400 hover:text-gold transition-colors">Progreso</a></li>
              <li><a href="#noticias" className="text-gray-400 hover:text-gold transition-colors">Noticias</a></li>
              <li><a href="#galeria" className="text-gray-400 hover:text-gold transition-colors">Galería</a></li>
              <li><a href="#donar" className="text-gray-400 hover:text-gold transition-colors">Cómo Donar</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Síguenos y Contacto</h3>
            {isEditMode ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <i className="fab fa-facebook-square w-6 text-center text-gray-400"></i>
                  <input type="text" value={content.facebookUrl} onChange={e => handleChange('facebookUrl', e.target.value)} className={commonInputClass} placeholder="URL Facebook" />
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fab fa-instagram-square w-6 text-center text-gray-400"></i>
                  <input type="text" value={content.instagramUrl} onChange={e => handleChange('instagramUrl', e.target.value)} className={commonInputClass} placeholder="URL Instagram" />
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fab fa-whatsapp-square w-6 text-center text-gray-400"></i>
                  <input type="text" value={content.whatsappUrl} onChange={e => handleChange('whatsappUrl', e.target.value)} className={commonInputClass} placeholder="URL WhatsApp" />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <i className="fas fa-envelope w-6 text-center text-gray-400"></i>
                  <input type="email" value={content.email} onChange={e => handleChange('email', e.target.value)} className={commonInputClass} placeholder="Email de contacto" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center md:justify-start space-x-4 text-2xl">
                  <a href={content.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><i className="fab fa-facebook-square"></i></a>
                  <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><i className="fab fa-instagram-square"></i></a>
                  <a href={content.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><i className="fab fa-whatsapp-square"></i></a>
                </div>
                <div className="mt-4">
                  <a href={`mailto:${content.email}`} className="text-gray-400 hover:text-gold transition-colors">{content.email}</a>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {content.campaignName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;