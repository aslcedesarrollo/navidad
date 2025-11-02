import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  isEditMode: boolean;
  onUpdate: (newDate: string) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, isEditMode, onUpdate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds }
  ];
  
  const formattedTargetDate = targetDate ? targetDate.substring(0, 16) : '';

  if (isEditMode) {
    return (
      <div className="my-8">
        <label className="text-white text-sm block mb-2 text-center">Fecha Límite (YYYY-MM-DDTHH:MM):</label>
        <input
          type="datetime-local"
          value={formattedTargetDate}
          onChange={(e) => onUpdate(e.target.value)}
          className="bg-black/30 backdrop-blur-sm border border-dashed border-white/50 text-center text-white rounded-md p-2 placeholder-white/80 focus:ring-2 focus:ring-gold focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="my-8 flex justify-center space-x-2 sm:space-x-4 md:space-x-6">
      {timerComponents.map(({ label, value }) => (
        <div key={label} className="text-center bg-white/10 backdrop-blur-sm p-2 sm:p-4 rounded-lg w-20 sm:w-24 border border-white/20">
          <div className="text-2xl sm:text-4xl font-bold text-gold">{String(value).padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;