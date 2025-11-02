import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Updates from './components/Updates';
import Transparency from './components/Transparency';
import Donate from './components/Donate';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import Snowfall from './components/Snowfall';
import CmsControls from './components/CmsControls';
import StickyDonateButton from './components/StickyDonateButton';
import { initialContent } from './constants';
import { AppContent } from './types';

// This function safely merges the default content with saved data from the server,
// preventing crashes if the data structure has changed.
const safeMerge = (defaults: any, saved: any): any => {
    if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) return defaults;
    const merged = { ...defaults };
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        if (!Object.prototype.hasOwnProperty.call(saved, key)) continue;
        const defaultValue = defaults[key];
        const savedValue = saved[key];
        const defaultType = Array.isArray(defaultValue) ? 'array' : typeof defaultValue;
        const savedType = Array.isArray(savedValue) ? 'array' : typeof savedValue;
        if (savedValue === null || typeof savedValue === 'undefined') continue;
        if (defaultType === 'object' && savedType === 'object' && !Array.isArray(defaultValue)) {
          merged[key] = safeMerge(defaultValue, savedValue);
        } else if (defaultType === savedType) {
          merged[key] = savedValue;
        }
      }
    }
    return merged;
};

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<AppContent | null>(null); // Start with null to show a loading state

  // Fetch content from the server when the app loads
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // If the server has no content file yet, use the initial default content.
        if (data && data.status === 'no_content') {
          setContent(initialContent);
        } else {
          // Otherwise, merge the server data with the defaults to prevent errors.
          setContent(safeMerge(initialContent, data));
        }
      } catch (error) {
        console.error("Failed to fetch content from server. Using default content.", error);
        setContent(initialContent);
      }
    };
    fetchContent();
  }, []);

  // Function to save content to the server
  const saveContentToServer = async (newContent: AppContent) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      if (!response.ok) {
        throw new Error('Failed to save content.');
      }
      console.log("Content saved successfully!");
    } catch (error) {
      console.error("Failed to save content to server.", error);
      alert("Error: No se pudieron guardar los cambios. Revisa la consola para más detalles.");
    }
  };

  const updateContent = <K extends keyof AppContent>(key: K, value: AppContent[K]) => {
    setContent(prev => prev ? { ...prev, [key]: value } : null);
  };
  
  // Save content when toggling edit mode off
  const handleToggleEditMode = () => {
    if (isEditMode && content) {
      saveContentToServer(content);
    }
    setIsEditMode(!isEditMode);
  };

  // Show a loading message while content is being fetched
  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-800">
        <div className="text-xl font-semibold animate-pulse">Cargando Mi Deseo de Navidad...</div>
      </div>
    );
  }

  // Render the full application once content is loaded
  return (
    <div className="bg-slate-50 text-gray-800 font-sans">
      <Snowfall />
      <CmsControls isEditMode={isEditMode} setIsEditMode={handleToggleEditMode} />
      <StickyDonateButton donationUrl={content.donationUrl} />
      <Header 
        content={{ campaignName: content.campaignName }}
        donationUrl={content.donationUrl}
        isEditMode={isEditMode} 
        onUpdate={(newName) => updateContent('campaignName', newName)}
        onUpdateUrl={(newUrl) => updateContent('donationUrl', newUrl)} 
      />
      <main>
        <Hero 
          content={content.hero}
          donationUrl={content.donationUrl}
          isEditMode={isEditMode} 
          onUpdate={(newHero) => updateContent('hero', newHero)}
        />
        <Mission 
          content={content.mission}
          isEditMode={isEditMode} 
          onUpdate={(newMission) => updateContent('mission', newMission)}
        />
        <Transparency 
          content={content.transparency}
          isEditMode={isEditMode} 
          onUpdate={(newTransparency) => updateContent('transparency', newTransparency)}
        />
        <Updates 
          content={content.updates}
          isEditMode={isEditMode} 
          onUpdate={(newUpdates) => updateContent('updates', newUpdates)}
        />
        <Gallery 
          content={content.gallery}
          isEditMode={isEditMode} 
          onUpdate={(newGallery) => updateContent('gallery', newGallery)}
        />
        <Donate 
          content={content.donate}
          donationUrl={content.donationUrl}
          isEditMode={isEditMode} 
          onUpdate={(newDonate) => updateContent('donate', newDonate)}
        />
      </main>
      <Footer 
        content={{ ...content.footer, campaignName: content.campaignName }}
        isEditMode={isEditMode} 
        onUpdate={(newFooter) => updateContent('footer', newFooter)}
      />
    </div>
  );
}

export default App;
