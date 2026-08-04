module.exports = [
  {
    context: ['/dynamic-proxy'],
    target: 'https://placeholder.com',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug', // Выведет в консоль терминала информацию о проксировании
    router: (req) => {
      const targetUrl = req.query.proxy_target;
      if (targetUrl) {
        try {
          const parsed = new URL(targetUrl);
          return parsed.origin; // Например, https://defence-line.org
        } catch (e) {
          console.error('Proxy URL parse error:', e);
        }
      }
      return 'https://placeholder.com';
    },
    pathRewrite: (path, req) => {
      const targetUrl = req.query.proxy_target;
      if (targetUrl) {
        try {
          const parsed = new URL(targetUrl);
          // Собираем изначальный путь и добавляем ВСЕ параметры (за исключением proxy_target)
          const params = new URLSearchParams(req.query);
          params.delete('proxy_target');

          const queryString = params.toString();
          return parsed.pathname + (queryString ? `?${queryString}` : '');
        } catch (e) {
          console.error('Proxy rewrite error:', e);
        }
      }
      return path;
    },
    onProxyReq: (proxyReq, req) => {
      // Подменяем заголовок Host, чтобы WordPress не сбрасывал соединение
      const targetUrl = req.query.proxy_target;
      if (targetUrl) {
        try {
          const parsed = new URL(targetUrl);
          proxyReq.setHeader('Host', parsed.host);
          proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        } catch (e) {}
      }
    }
  }
];