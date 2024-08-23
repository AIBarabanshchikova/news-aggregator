export interface NewsAPINews {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: { id: string | null; name: string };
  title: string;
  url: string;
  urlToImage: string;
}

export interface NewsApiResponse {
  articles: NewsAPINews[];
  totalResults: number;
  status: string;
}
