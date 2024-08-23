import ky from "ky";

import {
  GuardianNewsResponse,
  GuardianSectionsResponse,
  NYTimesCategoriesResponse,
  NYTimesNewsByCategoryResponse,
  NYTimesNewsResponse,
  NewsApiResponse,
} from "./types";

const GUARDIAN_URL = "https://content.guardianapis.com";
const NY_TIMES_SEARCH_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const NY_TIMES_CONTENT_URL = "https://api.nytimes.com/svc/news/v3/content";
const NEWS_API_URL = "https://newsapi.org/v2";

const guardian = ky.create({ prefixUrl: GUARDIAN_URL });
const newsAPI = ky.create({ prefixUrl: NEWS_API_URL });
const nyTimesSearch = ky.create({ prefixUrl: NY_TIMES_SEARCH_URL });
const nyTimesContent = ky.create({ prefixUrl: NY_TIMES_CONTENT_URL });

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

  return response.articles.map((i) => ({
    id: i.url,
    title: i.title,
    url: i.url,
    publicationDate: i.publishedAt,
    source: i.source.name ?? i.url,
    category: "Unclassified",
  }));
}

export async function getNewsFromGuardian(
  keywords?: string,
  category?: string
) {
  const { response }: { response: GuardianNewsResponse } = await guardian
    .get("search", {
      searchParams: {
        "api-key": import.meta.env.VITE_GUARDIAN_KEY,
        ...(keywords && { q: keywords }),
        ...(category && { section: category.toLowerCase() }),
      },
    })
    .then((response) => response.json());

  return response.results.map((i) => ({
    id: i.id,
    title: i.webTitle,
    url: i.webUrl,
    publicationDate: i.webPublicationDate,
    source: "The Guardian",
    category: i.sectionName,
  }));
}

export async function getCategoriesFromGuardian() {
  const { response }: { response: GuardianSectionsResponse } = await guardian
    .get("sections", {
      searchParams: {
        "api-key": import.meta.env.VITE_GUARDIAN_KEY,
      },
    })
    .then((response) => response.json());

  return response.results.map((i) => i.webTitle);
}

export async function getNewsFromNYTimes(keywords?: string) {
  const response: NYTimesNewsResponse = await nyTimesSearch
    .get("", {
      searchParams: {
        "api-key": import.meta.env.VITE_NY_TIMES_KEY,
        ...(keywords && { q: keywords }),
      },
    })
    .then((response) => response.json());

  return response.response.docs.map((i) => ({
    id: i._id,
    title: i.headline.print_headline || i.headline.main || i.snippet,
    url: i.web_url,
    publicationDate: i.pub_date,
    source: i.source,
    category: i.section_name,
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

  return response.results.map((i) => ({
    id: i.url,
    title: i.title,
    url: i.url,
    publicationDate: i.published_date,
    source: i.source,
    category: i.section,
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

  return response.results.map((i) => i.displayName);
}
