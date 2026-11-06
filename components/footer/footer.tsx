import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-stone-900 text-stone-50 w-full">
      <p className="text-center text-xs" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} NewsPulse. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;