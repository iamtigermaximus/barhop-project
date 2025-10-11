// components/LogoIcon.jsx
export const Logo1 = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {/* Concept 1: Hopping Location Pin */}
    <path
      d="M16 2C10.48 2 6 6.48 6 12C6 20 16 30 16 30S26 20 26 12C26 6.48 21.52 2 16 2Z"
      fill="url(#pinGradient)"
    />
    <path
      d="M8 8L4 4M24 8L28 4M8 20L2 14M24 20L30 14"
      stroke="url(#motionGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
    <circle cx="16" cy="12" r="3" fill="white" />
    <defs>
      <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="motionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

export const Logo2 = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {/* Concept 2: Abstract Hop Motion */}
    <circle
      cx="16"
      cy="16"
      r="12"
      stroke="url(#pathGradient)"
      strokeWidth="2"
      strokeDasharray="2 3"
      fill="none"
    />
    <circle cx="8" cy="16" r="3" fill="url(#hop1)" />
    <circle cx="16" cy="8" r="3" fill="url(#hop2)" />
    <circle cx="24" cy="16" r="3" fill="url(#hop3)" />
    <path
      d="M20 12L24 16L20 20"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="hop1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="hop2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="hop3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
  </svg>
);
