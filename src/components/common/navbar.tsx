import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="text-white shadow-md bg-[#100820] container">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-semibold">
          <a href="#" className="text-white">
            <img className="w-[70px]" src="/Union.png" />
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            Home
          </a>
          <a href="#" className="hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            Features
          </a>
          <a href="#" className="hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            Pricing
          </a>
          <div className="flex items-center py-2 relative">
            <img className="w-[30px] absolute left-4" src="/input.png" />

            <input
              className="appearance-none bg-transparent border w-[120px] text-white-700 ml-2 py-2 px-10 rounded-full leading-tight focus:outline-none"
              type="text"
              placeholder="$52412"
            />
          </div>
          <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded">
            <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">LOGIN/JOIN</Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-800`}>
        <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">
          Home
        </a>
        <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">
          About
        </a>
        <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">
          Services
        </a>
        <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
