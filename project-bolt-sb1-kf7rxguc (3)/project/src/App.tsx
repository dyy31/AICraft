import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureCard } from './components/FeatureCard';
import { BookOpen, Image, Mic, Video } from 'lucide-react';
import { StoryGeneration } from './pages/StoryGeneration';
import { ImageGeneration } from './pages/ImageGeneration';
import { VoiceCloning } from './pages/VoiceCloning';

function App() {
  // For demo purposes, we'll show different pages based on the path
  // In a real app, this would be handled by a router
  const path = window.location.pathname;
  const showStoryGeneration = path === '/stories';
  const showImageGeneration = path === '/images';
  const showVoiceCloning = path === '/voice';

  if (showStoryGeneration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <StoryGeneration />
      </div>
    );
  }

  if (showImageGeneration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ImageGeneration />
      </div>
    );
  }

  if (showVoiceCloning) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <VoiceCloning />
      </div>
    );
  }

  const features = [
    {
      title: 'Story Generation',
      description: 'Upload images and context to generate detailed memory-based stories that capture precious moments.',
      icon: BookOpen,
      href: '/stories'
    },
    {
      title: 'Image Generation',
      description: 'Generate new images or enhance existing ones using AI to visualize and recreate cherished memories.',
      icon: Image,
      href: '/images'
    },
    {
      title: 'Voice Cloning',
      description: 'Create natural-sounding narrations using voice samples to preserve familiar voices.',
      icon: Mic,
      href: '/voice'
    },
    {
      title: 'Video Creation',
      description: 'Transform your enhanced images and narrations into beautiful memory videos.',
      icon: Video,
      href: '/videos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Features</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover how Life Rewind can help you preserve and enhance your precious memories using cutting-edge AI technology.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>© 2025 Life Rewind. All rights reserved.</p>
            <p className="mt-2">Helping families reconnect with memories, one story at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;