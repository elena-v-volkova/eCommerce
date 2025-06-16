import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full mt-12 border-t border-gray-200 bg-white dark:bg-black py-4">
    <div className="container mx-auto flex justify-center px-4">
      <span className="text-gray-400 text-sm">
        &copy; {new Date().getFullYear()}
      </span>
    </div>
  </footer>
);

export default Footer;
