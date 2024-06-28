import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const startTimer = () => {
    setTimeLeft(45);
    setIsActive(true);
  };

  const resetTimer = () => {
    setTimeLeft(0);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    // Clean up interval on component unmount or timer reset
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div>
      <h1>Countdown Timer: {timeLeft} seconds</h1>
      <button onClick={isActive ? resetTimer : startTimer}>
        {isActive ? 'Reset Timer' : 'Start Timer'}
      </button>
    </div>
  );
};

export default CountdownTimer;
