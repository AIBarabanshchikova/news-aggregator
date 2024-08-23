import ky from "ky";
import { NewsApiResponse } from "./types";

const NEWS_API_URL = "https://newsapi.org/v2";

const newsAPI = ky.create({ prefixUrl: NEWS_API_URL });

export async function getNewsFromNewsAPI(keywords?: string, category?: string) {
  const response: NewsApiResponse = await newsAPI
    .get("top-headlines", {
      searchParams: {
        apiKey: import.meta.env.VITE_NEWS_API_KEY,
        language: "en",
        ...(keywords && { q: keywords }),
        ...(category && { category: category.toLowerCase() }),
      },
    })
    .then((response) => response.json());

  return response.articles.map((article) => ({
    id: article.url,
    title: article.title,
    url: article.url,
    publicationDate: article.publishedAt,
    source: article.source.name ?? article.url,
    category: "Unclassified",
  }));
}
