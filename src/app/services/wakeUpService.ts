
class WakeUpService {
  private backendUrl: string;
  private isWakingUp: boolean = false;
  private wakeUpInterval: NodeJS.Timeout | null = null;
  private readonly WAKE_UP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://npn-kh8l.onrender.com';
  }

  async wakeUpBackend(): Promise<boolean> {
    if (this.isWakingUp) {
      return false; // Already waking up
    }

    this.isWakingUp = true;

    try {
      const endpoints = ['/docs', '/health', '/'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.backendUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/json',
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          if (response.ok) {
            console.log(`✅ Backend woken up via ${endpoint}`);
            this.isWakingUp = false;
            return true;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to wake up backend via ${endpoint}:`, error);
        }
      }

      console.error('❌ Failed to wake up backend via any endpoint');
      this.isWakingUp = false;
      return false;

    } catch (error) {
      console.error('❌ Error waking up backend:', error);
      this.isWakingUp = false;
      return false;
    }
  }

  startPeriodicWakeUp(): void {
    if (this.wakeUpInterval) {
      return; // Already started
    }

    console.log('🔄 Starting periodic backend wake-up service...');
    
    this.wakeUpInterval = setInterval(async () => {
      await this.wakeUpBackend();
    }, this.WAKE_UP_INTERVAL);

    this.wakeUpBackend();
  }

  stopPeriodicWakeUp(): void {
    if (this.wakeUpInterval) {
      clearInterval(this.wakeUpInterval);
      this.wakeUpInterval = null;
      console.log('⏹️ Stopped periodic backend wake-up service');
    }
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing backend wake-up service...');
    
    await this.wakeUpBackend();
    
    this.startPeriodicWakeUp();
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      return response.ok;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }

  getBackendUrl(): string {
    return this.backendUrl;
  }
}

export const wakeUpService = new WakeUpService();
export default wakeUpService;
