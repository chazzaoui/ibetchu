import React, { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
      // Target date has passed
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <div className="text-2xl font-bold grid grid-cols-4 gap-4">
      <div className="bg-gray-300 p-2 rounded-md text-center">
        {timeLeft.days}
        <div className="text-sm">Days</div>
      </div>
      <div className="bg-gray-300 p-2 rounded-md text-center">
        {timeLeft.hours}
        <div className="text-sm">Hours</div>
      </div>
      <div className="bg-gray-300 p-2 rounded-md text-center">
        {timeLeft.minutes}
        <div className="text-sm">Minutes</div>
      </div>
      <div className="bg-gray-300 p-2 rounded-md text-center">
        {timeLeft.seconds}
        <div className="text-sm">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
