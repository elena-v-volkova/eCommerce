import React from 'react';

const Footer: React.FC = () => (
  <footer className="mt-12 w-full border-t border-gray-200 bg-white py-4 dark:bg-black">
    <div className="container mx-auto flex justify-center px-4">
      <span className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()}
      </span>
    </div>
  </footer>
);

export default Footer;
