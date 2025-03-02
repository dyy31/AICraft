import React from 'react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Reconnect with Your Precious Memories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Life Rewind uses advanced AI to help Alzheimer's patients and their families preserve, enhance, and relive their most treasured moments.
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition shadow-lg hover:shadow-xl">
            Start Your Journey
          </button>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <img
          src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=2000"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}