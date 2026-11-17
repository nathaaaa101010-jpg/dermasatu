import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo DERMA-SATU: Perisai dengan lingkaran rantai keputusan tertutup dan siluet jejak dermatologi"
    >
      <defs>
        <linearGradient id="dermaShieldGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="58%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="dermaInnerLoop" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#F5D0FE" />
        </linearGradient>
      </defs>
      {/* Shield outline */}
      <path
        d="M24 4L8 10.5V22.5C8 32.8 14.8 41.2 24 44C33.2 41.2 40 32.8 40 22.5V10.5L24 4Z"
        fill="url(#dermaShieldGrad)"
        fillOpacity="0.16"
        stroke="url(#dermaShieldGrad)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Closed loop ring */}
      <circle
        cx="24"
        cy="23"
        r="10.5"
        stroke="url(#dermaInnerLoop)"
        strokeWidth="1.8"
        strokeDasharray="48 10"
        strokeLinecap="round"
      />
      {/* Paw / dermal droplet motif inside loop */}
      <path
        d="M24 18.5C21.8 21.3 20.5 23.1 20.5 25C20.5 26.9 22.07 28.5 24 28.5C25.93 28.5 27.5 26.9 27.5 25C27.5 23.1 26.2 21.3 24 18.5Z"
        fill="url(#dermaShieldGrad)"
      />
      <circle cx="19" cy="18.2" r="1.6" fill="#5EEAD4" />
      <circle cx="29" cy="18.2" r="1.6" fill="#F0ABFC" />
      <circle cx="24" cy="15.2" r="1.5" fill="#99F6E4" />
    </svg>
  );
};
