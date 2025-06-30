export interface HealthStatus {
    status: 'healthy' | 'unhealthy';
}

export interface GenerateCodeResponse {
    code: string;
}

export interface GenerateAnimationResponse {
    video_path: string;
}
