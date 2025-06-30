import { Code, Video, Play, Loader2 } from 'lucide-react';
import { CodeExample } from '../App';

interface CodePanelProps {
    activeView: 'code' | 'video';
    setActiveView: (view: 'code' | 'video') => void;
    currentCode: CodeExample;
    videoUrl: string | null;
    isLoading: boolean;
    handleGenerateAnimation: () => void;
    isConnected: boolean;
}

export function CodePanel({
    activeView,
    setActiveView,
    currentCode,
    videoUrl,
    isLoading,
    handleGenerateAnimation,
    isConnected
}: CodePanelProps) {
    const renderVideoPreview = () => {
        if (videoUrl) {
            return (
                <div className="w-full h-full p-4">
                    <video
                        controls
                        autoPlay
                        className="w-full h-full rounded-lg"
                        src={videoUrl}
                    >
                        <track kind="captions" />
                    </video>
                </div>
            );
        }

        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {isLoading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                        <Video className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                    {isLoading ? 'Rendering Animation...' : 'Animation Preview'}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                    {isLoading
                        ? 'Please wait while your animation is being rendered'
                        : 'Your Manim animation will appear here once generated'
                    }
                </p>
            </div>
        );
    };

    return (
        <div className="w-3/5 flex flex-col bg-[#0a0a0a]">
            {/* Toggle Header */}
            <div className="p-4">
                <div className="inline-flex bg-gray-800 rounded-md p-1">
                    <button
                        onClick={() => setActiveView('code')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${activeView === 'code'
                            ? 'bg-gray-700 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Code className="w-3 h-3" />
                        Code
                    </button>
                    <button
                        onClick={() => setActiveView('video')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${activeView === 'video'
                            ? 'bg-gray-700 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Video className="w-3 h-3" />
                        Preview
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-4 pb-4">
                {activeView === 'code' ? (
                    <div className="h-full bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">main.py</span>
                                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
                                    Python
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto min-h-0 max-h-[calc(100vh-20rem)]">
                            <pre className="text-sm font-mono text-gray-100 leading-relaxed">
                                <code className="language-python">{currentCode.content}</code>
                            </pre>
                        </div>
                        <div className="p-4 border-t border-gray-800">
                            <button
                                onClick={handleGenerateAnimation}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !isConnected}
                            >
                                <Play className="w-4 h-4" />
                                Generate Animation
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        {renderVideoPreview()}
                    </div>
                )}
            </div>
        </div>
    );
}
