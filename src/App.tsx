import { useState, useEffect } from 'react';
import { manimStudioClient } from './services/manim-studio-api';
import { GenerateAnimationResponse, GenerateCodeResponse } from './services/types';
import { ChatPanel } from './components/ChatPanel';
import { CodePanel } from './components/CodePanel';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface CodeExample {
  content: string;
  language: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Manim Studio. I\'m your AI animation assistant, ready to help you create stunning mathematical visualizations. What would you like to animate today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [activeView, setActiveView] = useState<'code' | 'video'>('code');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [currentCode, setCurrentCode] = useState<CodeExample>({
    content: `from manim import *

class CreateCircle(Scene):
    def construct(self):
        circle = Circle()
        circle.set_fill(PINK, opacity=0.5)
        circle.set_stroke(BLUE, width=4)
        
        self.play(Create(circle))
        self.play(circle.animate.shift(RIGHT * 2))
        self.wait()`,
    language: 'python'
  });

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await manimStudioClient.checkHealth();
      setIsConnected(healthy);
    };

    checkHealth();

    manimStudioClient.on('connect', () => setIsConnected(true));
    manimStudioClient.on('disconnect', () => setIsConnected(false));

    manimStudioClient.on('code_generated', (data: GenerateCodeResponse) => {
      setCurrentCode({ content: data.code, language: 'python' });
      setActiveView('code');
      setIsLoading(false);
      const successMessage: Message = {
        id: Date.now().toString(),
        content: 'Perfect! I\'ve generated the Manim code for your animation. You can see it in the code panel. Click "Generate Animation" to render the video.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
    });

    manimStudioClient.on('video_rendered', (data: GenerateAnimationResponse) => {
      setVideoUrl(manimStudioClient.getVideoUrl(data.video_path));
      setActiveView('video');
      setIsLoading(false);
      const completionMessage: Message = {
        id: Date.now().toString(),
        content: 'Your animation has been successfully rendered! You can now view it in the preview panel.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);
    });

    manimStudioClient.on('render_error', (data: { error: string }) => {
      setError(data.error);
      setIsLoading(false);
      const errorChatMessage: Message = {
        id: Date.now().toString(),
        content: `I apologize, but I encountered an error: ${data.error}. Please try again.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorChatMessage]);
    });

    return () => {
      manimStudioClient.off('connect');
      manimStudioClient.off('disconnect');
      manimStudioClient.off('code_generated');
      manimStudioClient.off('video_rendered');
      manimStudioClient.off('render_error');
    };
  }, []);

  const handleGenerateCode = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Generating Manim code based on your vision... This may take a moment.',
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    await manimStudioClient.generateCode(prompt);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const prompt = inputValue;
    setInputValue('');
    
    await handleGenerateCode(prompt);
  };

  const handleGenerateAnimation = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    
    const videoMessage: Message = {
      id: Date.now().toString(),
      content: 'Rendering your animation... This process may take a few minutes depending on the complexity of your animation.',
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, videoMessage]);

    await manimStudioClient.generateAnimation(currentCode.content);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const connectionStatus = () => {
    if (isLoading) {
      return { text: 'Processing', color: 'bg-green-500', pulse: true };
    }
    if (isConnected) {
      return { text: 'Connected', color: 'bg-green-500', pulse: false };
    }
    return { text: 'Disconnected', color: 'bg-red-500', pulse: false };
  };

  const { text, color, pulse } = connectionStatus();

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-black rounded-2xl border border-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bitcount font-bold text-white tracking-wider">MANIM STUDIO</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs text-gray-300">{text}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden pt-24">
        <div className="w-[95%] max-w-6xl mx-auto h-full flex">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            isConnected={isConnected}
            formatTime={formatTime}
          />
          <CodePanel
            activeView={activeView}
            setActiveView={setActiveView}
            currentCode={currentCode}
            videoUrl={videoUrl}
            isLoading={isLoading}
            handleGenerateAnimation={handleGenerateAnimation}
            isConnected={isConnected}
          />
        </div>
      </div>
      <img
        src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg"
        alt="Bolt Hackathon Badge"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '100px',
          height: '100px',
          zIndex: 1000,
        }}
      />
    </div>
  );
}

export default App;
