import React from 'react';

const LogoSVG = ({ name }: { name: string }) => {
  // Generate a distinct color based on name
  const colors = [
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];
  
  // Hash function to get consistent color for same name
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = getHash(name);
  const color = colors[hash % colors.length];
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="relative group">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.1" />
        <rect x="4" y="4" width="40" height="40" rx="10" stroke={color} strokeWidth="2" strokeDasharray="2 4" className="group-hover:stroke-dashoffset-10 transition-all duration-1000" />
        <path 
          d="M12 12C12 10.8954 12.8954 10 14 10H34C35.1046 10 36 10.8954 36 12V36C36 37.1046 35.1046 38 34 38H14C12.8954 38 12 37.1046 12 36V12Z" 
          fill="white" 
          className="dark:fill-stone-900"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        />
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fill={color} 
          fontSize="14" 
          fontWeight="900" 
          fontFamily="ui-serif, Georgia, serif"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
};

export default LogoSVG;
