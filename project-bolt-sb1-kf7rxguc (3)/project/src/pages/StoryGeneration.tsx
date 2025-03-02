import React, { useState } from 'react';
import { Upload, Sparkles, Play, Pause, Save, Share2, MessageSquareText, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Story, recentStories } from '../data/stories';

export function StoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-purple-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="/"
              className="flex items-center text-purple-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span>Back to Home</span>
            </a>
          </div>
          <h1 className="text-4xl font-bold mb-4">Story Generation</h1>
          <p className="text-purple-200 text-lg max-w-2xl">
            Transform your cherished photos into vivid, detailed stories using our advanced AI technology.
            Upload images, add context, and let us bring your memories back to life.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="animate-pulse-slow w-full h-full bg-gradient-radial from-purple-400 to-transparent" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload and Generation Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input type="file" className="hidden" id="image-upload" multiple accept="image/*" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
                  <p className="text-gray-500">
                    Drag and drop your photos here, or click to select files
                  </p>
                </label>
              </div>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="aspect-square bg-purple-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-purple-300" />
                </div>
                {/* Add more preview boxes as needed */}
              </div>
            </div>

            {/* Context Input Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Memory Context</h3>
              <textarea
                className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Describe your memory... (e.g., 'Mom's birthday party in 1995, everyone gathered around the homemade chocolate cake...')"
              />
              
              {/* AI-Suggested Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Family Gathering
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Birthday
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Summer
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition
                ${isGenerating
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
                }`}
              onClick={() => setIsGenerating(true)}
              disabled={isGenerating}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Generating Story...' : 'Generate Story'}</span>
              </div>
            </button>

            {/* Generated Story Display */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Generated Story</h3>
                <div className="flex space-x-3">
                  <button
                    className="p-2 rounded-full hover:bg-purple-100 transition"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Play className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  <button className="p-2 rounded-full hover:bg-purple-100 transition">
                    <Save className="w-5 h-5 text-purple-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-purple-100 transition">
                    <Share2 className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  It was a warm summer afternoon in 1995 when we all gathered to celebrate Mom's birthday.
                  The kitchen was filled with the sweet aroma of chocolate cake, and sunlight streamed
                  through the windows, casting a golden glow on everyone's smiling faces...
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquareText className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Suggestions</h3>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-900">
                <p>
                  Try adding specific details about the memory in your description.
                  What emotions were you feeling? Who was there? What sounds or smells do you remember?
                </p>
              </div>
            </div>

            {/* Recent Stories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Stories</h3>
              <div className="space-y-4">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition cursor-pointer"
                  >
                    <h4 className="font-medium text-purple-900">{story.title}</h4>
                    <p className="text-sm text-purple-700 mt-1">{story.date}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {story.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}