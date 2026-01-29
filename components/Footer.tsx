import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 text-center border-t border-slate-200 text-slate-400 text-sm">
      <p>&copy; {new Date().getFullYear()} solvepao research. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
