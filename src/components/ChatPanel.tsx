import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Message } from '../App';

interface ChatPanelProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    isConnected: boolean;
    formatTime: (date: Date) => string;
}

export function ChatPanel({
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    handleSendMessage,
    isConnected,
    formatTime
}: ChatPanelProps) {
    return (
        <div className="w-2/5 border-r border-gray-800 flex flex-col bg-[#0a0a0a]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                        <div className={`max-w-[80%] ${message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-100 border border-gray-700'
                            } rounded-lg px-3 py-2`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.sender === 'user'
                                ? 'text-blue-100'
                                : 'text-gray-400'
                                }`}>
                                {formatTime(message.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Processing...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-red-900/50 text-red-100 border border-red-700 rounded-lg px-3 py-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.targe.value)}
                        placeholder="Describe your animation..."
                        disabled={isLoading || !isConnected}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim() || !isConnected}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
