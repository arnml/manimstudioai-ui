import { io, Socket } from 'socket.io-client';
import { GenerateAnimationResponse, GenerateCodeResponse, HealthStatus } from './types';

const API_URL = 'https://manim-studio-ai-backend-952720044146.us-central1.run.app';

class ManimStudioClient {
    private readonly socket: Socket;

    constructor() {
        this.socket = io(API_URL);
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to Manim Studio AI');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    public on<T>(event: string, listener: (data: T) => void) {
        this.socket.on(event, listener);
    }

    public off(event: string) {
        this.socket.off(event);
    }

    public async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/health`);
            if (response.ok) {
                const data: HealthStatus = await response.json();
                return data.status === 'healthy';
            }
            return false;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    public async generateCode(prompt: string): Promise<GenerateCodeResponse> {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        return response.json();
    }

    public async generateAnimation(code: string): Promise<GenerateAnimationResponse> {
        const response = await fetch(`${API_URL}/render-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        return response.json();
    }

    public getVideoUrl(videoPath: string): string {
        return `${API_URL}/${videoPath}`;
    }
}

export const manimStudioClient = new ManimStudioClient();
