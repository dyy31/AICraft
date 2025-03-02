import React, { useState } from 'react';
import { Upload, Sparkles, Save, Share2, MessageSquareText, Image as ImageIcon, Sliders, ArrowLeft } from 'lucide-react';

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Warm, nostalgic tones with a classic film aesthetic'
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'True-to-life enhancement with natural lighting'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dramatic lighting and movie-like composition'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative interpretation with artistic flair'
  }
];

export function ImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [sliderPosition, setSliderPosition] = useState(50);

  const handlePromptChange = (value: string) => {
    setOriginalPrompt(value);
    // Simulate AI enhancing the prompt
    if (value) {
      const enhanced = value + ', detailed, professional photography, high resolution, natural lighting, nostalgic atmosphere';
      setEnhancedPrompt(enhanced);
    } else {
      setEnhancedPrompt('');
    }
  };

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
          <h1 className="text-4xl font-bold mb-4">Image Generation</h1>
          <p className="text-purple-200 text-lg max-w-2xl">
            Transform your memories into stunning visuals using our advanced AI technology.
            Upload reference images, describe your memory, and let our AI bring it to life.
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
                <input type="file" className="hidden" id="image-upload" accept="image/*" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload Reference Photo</h3>
                  <p className="text-gray-500">
                    Drag and drop your reference photo here, or click to select a file
                  </p>
                </label>
              </div>
              
              {/* Image Preview */}
              <div className="mt-6 aspect-video bg-purple-50 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-purple-300" />
              </div>
            </div>

            {/* Context Input Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Memory Description</h3>
              <textarea
                className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Describe the memory you want to generate... (e.g., 'Family picnic in the 1980s, golden sunset, children playing on checkered blanket')"
                value={originalPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
              />
              
              {/* AI-Enhanced Prompt */}
              {enhancedPrompt && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Enhanced Prompt:</h4>
                  <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-900">
                    {enhancedPrompt}
                  </div>
                </div>
              )}
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Choose Style</h3>
              <div className="grid grid-cols-2 gap-4">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    className={`p-4 rounded-xl border-2 text-left transition
                      ${selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                      }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <h4 className="font-medium text-gray-900">{style.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                  </button>
                ))}
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
                <span>{isGenerating ? 'Generating Image...' : 'Generate Image'}</span>
              </div>
            </button>

            {/* Generated Image Display */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Generated Image</h3>
                <div className="flex space-x-3">
                  <button className="p-2 rounded-full hover:bg-purple-100 transition">
                    <Save className="w-5 h-5 text-purple-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-purple-100 transition">
                    <Share2 className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
              </div>
              
              {/* Image Comparison Slider */}
              <div className="relative aspect-video bg-purple-50 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-purple-300" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-purple-600 rounded-full outline-none"
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Sliders className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
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
                <div>
                  Include specific details in your description like:
                </div>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Time period and season</li>
                  <li>Lighting conditions</li>
                  <li>People and their activities</li>
                  <li>Important objects or landmarks</li>
                </ul>
              </div>
            </div>

            {/* Recently Generated */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recently Generated</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-purple-50 rounded-lg hover:opacity-90 transition cursor-pointer"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-purple-300" />
                    </div>
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