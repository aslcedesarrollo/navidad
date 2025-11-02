import React from 'react';

interface StickyDonateButtonProps {
  donationUrl: string;
}

const StickyDonateButton: React.FC<StickyDonateButtonProps> = ({ donationUrl }) => {
  return (
    <a
      href={donationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-24 z-[100] bg-gold text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
      title="Donar Ahora"
    >
      <i className="fas fa-heart mr-2"></i>
      Donar Ahora
    </a>
  );
};

export default StickyDonateButton;