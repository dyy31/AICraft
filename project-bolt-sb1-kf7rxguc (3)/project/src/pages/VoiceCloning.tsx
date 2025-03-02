import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Play, Pause, Save, Share2, MessageSquareText, Mic, ArrowLeft, Volume2, Settings2, Clock, Wand2, Loader2 } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  emotion: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: 'warm',
    name: 'Warm & Gentle',
    description: 'Soft, comforting tone perfect for storytelling',
    emotion: 'Nostalgic'
  },
  {
    id: 'energetic',
    name: 'Energetic & Lively',
    description: 'Upbeat and enthusiastic delivery',
    emotion: 'Excited'
  },
  {
    id: 'calm',
    name: 'Calm & Wise',
    description: 'Measured, thoughtful speaking style',
    emotion: 'Peaceful'
  },
  {
    id: 'natural',
    name: 'Natural Conversation',
    description: 'Everyday speaking style with natural pauses',
    emotion: 'Casual'
  }
];

interface ProcessStep {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function VoiceCloning() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('warm');
  const [voiceText, setVoiceText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [speakerId, setSpeakerId] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Progress tracking
  const [cloningSteps, setCloningSteps] = useState<ProcessStep[]>([
    { label: 'Uploading audio file', status: 'pending' },
    { label: 'Processing voice characteristics', status: 'pending' },
    { label: 'Finalizing voice model', status: 'pending' }
  ]);

  const [generationSteps, setGenerationSteps] = useState<ProcessStep[]>([
    { label: 'Analyzing text', status: 'pending' },
    { label: 'Generating speech', status: 'pending' },
    { label: 'Applying voice characteristics', status: 'pending' }
  ]);

  // Effect to handle audio playback state changes
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]);

  // Effect to handle audio URL changes
  useEffect(() => {
    if (generatedAudioUrl && audioRef.current) {
      audioRef.current.src = generatedAudioUrl;
      audioRef.current.load();
    }
  }, [generatedAudioUrl]);

  const updateStepStatus = (
    steps: ProcessStep[],
    setSteps: React.Dispatch<React.SetStateAction<ProcessStep[]>>,
    index: number,
    status: ProcessStep['status']
  ) => {
    setSteps(steps.map((step, i) => ({
      ...step,
      status: i === index ? status : step.status
    })));
  };

  const resetSteps = () => {
    setCloningSteps(cloningSteps.map(step => ({ ...step, status: 'pending' })));
    setGenerationSteps(generationSteps.map(step => ({ ...step, status: 'pending' })));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setAudioFile(file);
    setIsCloning(true);
    setSpeakerId(null);
    setGeneratedAudioUrl(null);
    resetSteps();

    try {
      // Update progress for file upload
      updateStepStatus(cloningSteps, setCloningSteps, 0, 'processing');
      
      // Call the voice cloning service with the file
      updateStepStatus(cloningSteps, setCloningSteps, 1, 'processing');
      const id = await voiceService.cloneVoice(file);
      updateStepStatus(cloningSteps, setCloningSteps, 0, 'completed');
      updateStepStatus(cloningSteps, setCloningSteps, 1, 'completed');

      // Update progress for finalizing
      updateStepStatus(cloningSteps, setCloningSteps, 2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate finalizing time
      updateStepStatus(cloningSteps, setCloningSteps, 2, 'completed');

      setSpeakerId(id);
    } catch (error) {
      console.error('Error cloning voice:', error);
      setError('Failed to clone voice. Please try again with a different audio file.');
      setAudioFile(null);
      cloningSteps.forEach((_, index) => {
        updateStepStatus(cloningSteps, setCloningSteps, index, 'error');
      });
    } finally {
      setIsCloning(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!speakerId || !voiceText) {
      setError('Please upload a voice sample and enter text first.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    resetSteps();

    try {
      // Update progress for text analysis
      updateStepStatus(generationSteps, setGenerationSteps, 0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate analysis time
      updateStepStatus(generationSteps, setGenerationSteps, 0, 'completed');

      // Update progress for speech generation
      updateStepStatus(generationSteps, setGenerationSteps, 1, 'processing');
      const audioUrl = await voiceService.generateVoice(voiceText, speed, pitch);
      updateStepStatus(generationSteps, setGenerationSteps, 1, 'completed');

      // Update progress for voice characteristics
      updateStepStatus(generationSteps, setGenerationSteps, 2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate processing time
      updateStepStatus(generationSteps, setGenerationSteps, 2, 'completed');

      setGeneratedAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating voice:', error);
      setError('Failed to generate voice. Please try again.');
      generationSteps.forEach((_, index) => {
        updateStepStatus(generationSteps, setGenerationSteps, index, 'error');
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !generatedAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Failed to play audio. Please try again.");
      });
      setIsPlaying(true);
    }
  };

  const renderProgressSteps = (steps: ProcessStep[]) => (
    <div className="space-y-4 mt-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="relative flex items-center justify-center w-8 h-8 mr-4">
            {step.status === 'processing' ? (
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            ) : step.status === 'completed' ? (
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : step.status === 'error' ? (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
            )}
            {index < steps.length - 1 && (
              <div className={`absolute top-8 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                step.status === 'completed' ? 'bg-purple-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
          <div>
            <p className={`font-medium ${
              step.status === 'processing' ? 'text-purple-600' :
              step.status === 'completed' ? 'text-gray-900' :
              step.status === 'error' ? 'text-red-500' :
              'text-gray-500'
            }`}>
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

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
          <h1 className="text-4xl font-bold mb-4">Voice Cloning</h1>
          <p className="text-purple-200 text-lg max-w-2xl">
            Transform written memories into spoken words using our AI voice cloning technology.
            Upload a voice sample or choose from our pre-trained voices to bring your stories to life.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="animate-pulse-slow w-full h-full bg-gradient-radial from-purple-400 to-transparent" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload and Generation Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  id="voice-upload"
                  accept="audio/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="voice-upload" className="cursor-pointer">
                  {isCloning ? (
                    <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                  ) : (
                    <Mic className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">Upload Voice Sample</h3>
                  <p className="text-gray-500">
                    Upload a clear voice recording (minimum 30 seconds recommended)
                  </p>
                </label>
              </div>
              
              {/* Audio Preview and Progress */}
              {(audioFile || isCloning) && (
                <div className="mt-6 bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {audioFile?.name || 'Processing voice sample...'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {speakerId ? 'Voice cloned successfully!' : 'Processing...'}
                    </span>
                  </div>
                  {renderProgressSteps(cloningSteps)}
                </div>
              )}
            </div>

            {/* Text Input Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Text to Voice</h3>
              <textarea
                className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Enter the text you want to convert to speech... (e.g., 'Remember when we used to spend summer evenings on the porch, telling stories and watching the sunset?')"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
              />
            </div>

            {/* Voice Controls */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Fine-tune Voice</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Speaking Speed
                    </label>
                    <span className="text-sm text-gray-500">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-full appearance-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Voice Pitch
                    </label>
                    <span className="text-sm text-gray-500">{pitch > 0 ? `+${pitch}` : pitch}</span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-full appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition
                ${isGenerating || !speakerId
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
                }`}
              onClick={handleGenerateVoice}
              disabled={isGenerating || !speakerId}
            >
              <div className="flex items-center justify-center space-x-2">
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>{isGenerating ? 'Generating Voice...' : 'Generate Voice'}</span>
              </div>
            </button>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Generating Voice</h3>
                {renderProgressSteps(generationSteps)}
              </div>
            )}

            {/* Generated Voice Preview */}
            {generatedAudioUrl && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Generated Voice</h3>
                  <div className="flex space-x-3">
                    <a
                      href={generatedAudioUrl}
                      download="generated-voice.mp3"
                      className="p-2 rounded-full hover:bg-purple-100 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Save className="w-5 h-5 text-purple-600" />
                    </a>
                    <button className="p-2 rounded-full hover:bg-purple-100 transition">
                      <Share2 className="w-5 h-5 text-purple-600" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button
                          className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-900">AI Generated Voice</h4>
                          <p className="text-sm text-gray-600">Click to play</p>
                        </div>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src={generatedAudioUrl}
                      className="w-full mt-4"
                      controls
                    />
                  </div>
                </div>
              </div>
            )}
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
                <div>Tips for best results:</div>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Use clear voice recordings with minimal background noise</li>
                  <li>Record at least 30 seconds of natural speech</li>
                  <li>Include varied emotional expressions in the sample</li>
                  <li>Write text that matches the speaker's natural style</li>
                </ul>
              </div>
            </div>

            {/* API Status */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">API Status</h3>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <p>
                  This feature uses the DupDub API for voice cloning and generation.
                  If you encounter any issues, please try again later as the API may
                  have rate limits or temporary outages.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings2 className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">Advanced Settings</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                </button>
                <button className="w-full p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition flex items-center justify-between">
                  <div className="flex items-center">
                    <Wand2 className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">AI Enhancement</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}