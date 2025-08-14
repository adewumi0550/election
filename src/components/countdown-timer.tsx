'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: Date;
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(calculateTimeLeft());
  }, [endTime])


  useEffect(() => {
    if(!isMounted) return;
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!isMounted) {
    return <span>Loading...</span>
  }

  const timerComponents = [
      {value: timeLeft.days, label: 'd'},
      {value: timeLeft.hours, label: 'h'},
      {value: timeLeft.minutes, label: 'm'},
      {value: timeLeft.seconds, label: 's'},
  ];

  return (
    <div className='flex space-x-2'>
        {timerComponents.map(c => (
             <div key={c.label} className="flex items-baseline">
                <span>{String(c.value).padStart(2, '0')}</span>
                <span className='text-sm text-muted-foreground'>{c.label}</span>
             </div>
        ))}
    </div>
  );
}
