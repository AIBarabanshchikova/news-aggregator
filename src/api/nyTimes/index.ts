import ky from "ky";
import {
  NYTimesCategoriesResponse,
  NYTimesNewsByCategoryResponse,
  NYTimesNewsResponse,
} from "./types";

const NY_TIMES_SEARCH_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const NY_TIMES_CONTENT_URL = "https://api.nytimes.com/svc/news/v3/content";

const nyTimesSearch = ky.create({ prefixUrl: NY_TIMES_SEARCH_URL });
const nyTimesContent = ky.create({ prefixUrl: NY_TIMES_CONTENT_URL });

export async function getNewsFromNYTimes(keywords?: string) {
  const response: NYTimesNewsResponse = await nyTimesSearch
    .get("", {
      searchParams: {
        "api-key": import.meta.env.VITE_NY_TIMES_KEY,
        ...(keywords && { q: keywords }),
      },
    })
    .then((response) => response.json());

  return response.response.docs.map((news) => ({
    id: news._id,
    title: news.headline.print_headline || news.headline.main || news.snippet,
    url: news.web_url,
    publicationDate: news.pub_date,
    source: news.source,
    category: news.section_name,
  }));
}

export async function getNewsByCategoryFromNYTimes(category: string) {
  const response: NYTimesNewsByCategoryResponse = await nyTimesContent
    .get(`all/${category.toLowerCase()}.json`, {
      searchParams: {
        "api-key": import.meta.env.VITE_NY_TIMES_KEY,
      },
    })
    .then((response) => response.json());

  return response.results.map((news) => ({
    id: news.url,
    title: news.title,
    url: news.url,
    publicationDate: news.published_date,
    source: news.source,
    category: news.section,
  }));
}

export async function getCategoriesFromNYTimes() {
  const response: NYTimesCategoriesResponse = await nyTimesContent
    .get("section-list.json", {
      searchParams: {
        "api-key": import.meta.env.VITE_NY_TIMES_KEY,
      },
    })
    .then((response) => response.json());

  return response.results.map((category) => category.displayName);
}
