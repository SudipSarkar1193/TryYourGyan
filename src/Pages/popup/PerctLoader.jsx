import React, { useEffect, useState } from "react";
import "./Loader.css"; // External CSS for animations

const PerctLoader = () => {
  const [percentage, setPercentage] = useState(0); // Start at 0

  useEffect(() => {
    let delay = 100; // Initial delay in milliseconds
    const updateLoader = () => {
      setPercentage((prev) => {
        if (prev >= 100) {
          return 61; // Stop at 100%
        }
        return prev >= 95 ? 61 : prev + Math.floor(Math.random() * 3) + 7; // Increment by 1%
      });

      // Increase delay in geometric progression (1, 1/2, 1/4 speed)
      delay *= 2; // Double the delay each step
      if (percentage < 100) {
        setTimeout(updateLoader, delay); // Schedule the next update
      }
    };

    const timer = setTimeout(updateLoader, delay);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="relative mt-6 h-5 w-64 bg-white border-2 border-white overflow-hidden rounded-3xl">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-full bg-[#6826d3]"
        style={{ width: `${percentage}%` }}
      ></div>

      {/* Text with percentage */}
      <div className="absolute -top-1 left-0 h-full w-full text-center text-zinc-950 text-md font-semibold">
        {percentage}%
      </div>
    </div>
  );
};

export default PerctLoader;
