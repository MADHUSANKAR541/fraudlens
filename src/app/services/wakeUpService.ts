// Wake-up service to prevent backend from sleeping on Render.com
// This service automatically pings the backend when the frontend loads

class WakeUpService {
  private backendUrl: string;
  private isWakingUp: boolean = false;
  private wakeUpInterval: NodeJS.Timeout | null = null;
  private readonly WAKE_UP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  }

  // Wake up the backend by calling the /docs endpoint
  async wakeUpBackend(): Promise<boolean> {
    if (this.isWakingUp) {
      return false; // Already waking up
    }

    this.isWakingUp = true;

    try {
      // Try multiple endpoints to ensure the backend wakes up
      const endpoints = ['/docs', '/health', '/'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.backendUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/json',
            },
            // Add a timeout to prevent hanging
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          if (response.ok) {
            console.log(`✅ Backend woken up via ${endpoint}`);
            this.isWakingUp = false;
            return true;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to wake up backend via ${endpoint}:`, error);
          // Continue to next endpoint
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

  // Start periodic wake-up calls to keep backend alive
  startPeriodicWakeUp(): void {
    if (this.wakeUpInterval) {
      return; // Already started
    }

    console.log('🔄 Starting periodic backend wake-up service...');
    
    this.wakeUpInterval = setInterval(async () => {
      await this.wakeUpBackend();
    }, this.WAKE_UP_INTERVAL);

    // Also wake up immediately
    this.wakeUpBackend();
  }

  // Stop periodic wake-up calls
  stopPeriodicWakeUp(): void {
    if (this.wakeUpInterval) {
      clearInterval(this.wakeUpInterval);
      this.wakeUpInterval = null;
      console.log('⏹️ Stopped periodic backend wake-up service');
    }
  }

  // Wake up backend and start periodic calls
  async initialize(): Promise<void> {
    console.log('🚀 Initializing backend wake-up service...');
    
    // Wake up immediately
    await this.wakeUpBackend();
    
    // Start periodic wake-up
    this.startPeriodicWakeUp();
  }

  // Check if backend is responsive
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

  // Get backend URL
  getBackendUrl(): string {
    return this.backendUrl;
  }
}

// Export singleton instance
export const wakeUpService = new WakeUpService();
export default wakeUpService;
