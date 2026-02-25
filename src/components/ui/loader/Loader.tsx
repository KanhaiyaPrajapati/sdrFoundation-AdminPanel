import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[36px] h-[36px] grid">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-blue-600 animate-spin-fast"></div>

        <div className="absolute inset-[2px] rounded-full border-4 border-transparent border-r-blue-600 animate-spin-medium"></div>

        <div className="absolute inset-[8px] rounded-full border-4 border-transparent border-r-blue-600 animate-spin-slow"></div>
      </div>

      <style>
        {`
          @keyframes spinFast { 100% { transform: rotate(360deg); } }
          @keyframes spinMedium { 100% { transform: rotate(360deg); } }
          @keyframes spinSlow { 100% { transform: rotate(360deg); } }

          .animate-spin-fast {
            animation: spinFast 1s linear infinite;
          }

          .animate-spin-medium {
            animation: spinMedium 2s linear infinite;
          }

          .animate-spin-slow {
            animation: spinSlow 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
