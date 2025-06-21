// /home/usermate/clones/defense-line/src/app/types.ts

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  // ... другие поля, если нужны
}

export interface WpComment {
  id: number;
  author_name: string;
  date: string;
  content: {
    rendered: string;
  };
  author_avatar_urls: {
    [size: string]: string;
  };
}

export interface WpPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  categories: number[];
  _embedded: any; // Это поле слишком сложное, можно оставить any или типизировать дальше
  // Для обработанных данных
  categoryName?: string;
}
