import React from 'react';

const GoogleLoader = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-stone-200 dark:border-stone-800 rounded-full animate-pulse`} />
      <div 
        className={`absolute inset-0 ${sizes[size]} border-red-600 border-t-transparent rounded-full animate-spin`} 
        style={{ animationDuration: '0.8s' }}
      />
    </div>
  );
};

export default GoogleLoader;
