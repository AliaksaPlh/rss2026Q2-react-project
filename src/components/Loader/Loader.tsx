import React from 'react';

const Loader: React.FC = () => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex flex-col items-center justify-center
        bg-black/30 backdrop-blur-sm
      "
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className="
            absolute h-32 w-32
            rounded-full
            border border-rose-500/20
            animate-ping
          "
        />

        {/* Rotating ring */}
        <div
          className="
            h-24 w-24
            animate-spin
            rounded-full
            border-4
            border-slate-700
            border-t-rose-500
            border-r-orange-400/70
          "
        />
      </div>

      <p
        className="
          mt-8
          text-sm
          font-medium
          tracking-[0.25em]
          uppercase
          text-slate-300
          animate-pulse
        "
      >
        Loading ...
      </p>
    </div>
  );
};

export default Loader;
