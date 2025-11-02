import React, { useState, useEffect } from 'react';

interface HeaderProps {
  content: { campaignName: string };
  donationUrl: string;
  isEditMode: boolean;
  onUpdate: (newName: string) => void;
  onUpdateUrl: (newUrl: string) => void;
}


const Header: React.FC<HeaderProps> = ({ content, donationUrl, isEditMode, onUpdate, onUpdateUrl }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { href: '#mision', label: 'Misión' },
    { href: '#transparencia', label: 'Progreso' },
    { href: '#noticias', label: 'Noticias' },
    { href: '#galeria', label: 'Galería' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = navLinks.map(link => document.querySelector(link.href));
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
        const headerElement = document.querySelector('header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 80; // Fallback to 80px (h-20)
        
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }
  };
  
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const getLinkClassName = (href: string) => {
    const isActive = activeSection === href;
    const baseClass = 'font-semibold transition-colors duration-300';
    if (scrolled) {
      return `${baseClass} ${isActive ? 'text-christmas-red' : 'text-gray-700 hover:text-christmas-red'}`;
    }
    return `${baseClass} ${isActive ? 'text-gold' : 'text-white hover:text-gold'}`;
  };

  const getMobileLinkClassName = (href: string) => {
    const isActive = activeSection === href;
    return `block py-2 text-gray-700 hover:text-christmas-red font-semibold w-full text-center ${isActive ? 'text-christmas-red font-bold' : ''}`;
  };


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className={`font-bold text-xl transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-christmas-red' : 'text-white'}`}>
            <a href="#" onClick={handleLogoClick} className="flex items-center">
              <i className="fas fa-gift mr-2"></i>
              {isEditMode ? (
                <input 
                  type="text"
                  value={content.campaignName}
                  onChange={(e) => onUpdate(e.target.value)}
                  className="bg-gray-500/20 border border-dashed border-gray-500/50 w-48 rounded px-1"
                  onClick={(e) => e.stopPropagation()} // Prevent nav click on input
                />
              ) : (
                <span>{content.campaignName}</span>
              )}
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className={getLinkClassName(link.href)}
                aria-current={activeSection === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center">
             {isEditMode ? (
                <div className="hidden md:flex flex-col items-end text-xs">
                     <a href={donationUrl} target="_blank" rel="noopener noreferrer" className="bg-gold hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-300 hover:scale-105">
                        Donar Ahora
                    </a>
                    <input
                        type="text"
                        value={donationUrl}
                        onChange={(e) => onUpdateUrl(e.target.value)}
                        className="bg-gray-500/20 border border-dashed border-gray-500/50 w-64 rounded px-1 mt-1 text-white text-right"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                 <a href={donationUrl} target="_blank" rel="noopener noreferrer" className="hidden md:inline-block bg-gold hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-300 hover:scale-105">
                  Donar Ahora
                </a>
            )}
            <button className="md:hidden ml-4 text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} transition-colors duration-300 ${scrolled ? 'text-gray-800' : 'text-white'}`}></i>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col items-center p-4">
             {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className={getMobileLinkClassName(link.href)}
                aria-current={activeSection === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
             {isEditMode ? (
                 <div className="mt-4 w-full">
                    <a href={donationUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gold hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 hover:scale-105">
                      Donar Ahora
                    </a>
                     <input
                        type="text"
                        value={donationUrl}
                        onChange={(e) => onUpdateUrl(e.target.value)}
                        className="bg-gray-100 border border-dashed border-gray-400 w-full rounded px-2 mt-2 text-xs py-1"
                        onClick={(e) => e.stopPropagation()}
                    />
                 </div>
             ) : (
                 <a href={donationUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="mt-4 w-full text-center bg-gold hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 hover:scale-105">
                  Donar Ahora
                </a>
             )}
          </div>
      </div>
    </header>
  );
};

export default Header;