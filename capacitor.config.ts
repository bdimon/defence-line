type CapacitorConfig = {
  appId: string;
  appName: string;
  webDir: string;
  plugins?: Record<string, unknown>;
};

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'defense-line',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true // Автоматически перехватывает HttpClient Angular
    }
  }
};

export default config;
