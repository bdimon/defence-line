export interface SiteInfo {
  name: string;
  url: string;
  useRestRoute?: boolean;
  /**
   * true — для сайтов, у которых отключены "красивые" постоянные ссылки
   * и wp-json недоступен по обычному пути /wp-json/wp/v2/....
   * В этом случае API доступен только через:
   *   {origin}/index.php?rest_route=/wp/v2/{endpoint}
   * url при этом всё равно указывается в привычном виде
   * 'https://origin/wp-json/wp/v2'.
   */
  
}

export const WP_SITES: SiteInfo[] = [
  { name: 'Лінія Оборони', url: 'https://defence-line.info/wp-json/wp/v2', useRestRoute: true },
  { name: 'Defence News', url: 'https://dl-news.defence-line.org/wp-json/wp/v2', useRestRoute: true },
  { name: 'Олег Пономарь', url: 'https://ponomaroleg.com/wp-json/wp/v2' },
  { name: 'Тверезо', url: 'https://tverezo.info/wp-json/wp/v2' },
  { name: 'Факты', url: 'https://fakty.com.ua/wp-json/wp/v2' },
  { name: 'Український Тиждень', url: 'https://tyzhden.ua/wp-json/wp/v2' },
  { name: 'НБН', url: 'https://nbnews.com.ua/wp-json/wp/v2' },
  { name: 'МИГ', url: 'https://mig.com.ua/wp-json/wp/v2' },
  { name: 'Днепр Час', url: 'https://dpchas.com.ua/wp-json/wp/v2' },
  { name: 'MediaPort', url: 'https://mediaport.ua/wp-json/wp/v2' },
  { name: 'Главное', url: 'https://glavnoe.in.ua/wp-json/wp/v2' },
];
