type CapacitorConfig = {
  appId: string;
  appName: string;
  webDir: string;
  plugins?: Record<string, unknown>;
};

const config: CapacitorConfig = {
  appId: 'info.defenceline.app',
  appName: 'Defence Line',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true // Автоматически перехватывает HttpClient Angular
    }
  }
};

export default config;
