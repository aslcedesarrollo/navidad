import React from 'react';

const Snowfall: React.FC = () => {
  const snowFlakes = Array.from({ length: 150 }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}vw`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 8 + 7}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return <div key={i} className="snow" style={style}></div>;
  });

  return <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]" aria-hidden="true">{snowFlakes}</div>;
};

export default Snowfall;