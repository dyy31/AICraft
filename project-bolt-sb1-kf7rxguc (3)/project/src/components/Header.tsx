import React from 'react';
import { Brain, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-semibold text-gray-900">Life Rewind</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/stories" className="text-gray-600 hover:text-purple-600 transition">Stories</a>
          <a href="/images" className="text-gray-600 hover:text-purple-600 transition">Images</a>
          <a href="/voice" className="text-gray-600 hover:text-purple-600 transition">Voice</a>
          <a href="/videos" className="text-gray-600 hover:text-purple-600 transition">Videos</a>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
            Sign In
          </button>
        </div>
        
        <button className="md:hidden">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </nav>
    </header>
  );
}