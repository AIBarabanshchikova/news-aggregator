import ky from "ky";
import { GuardianNewsResponse, GuardianSectionsResponse } from "./types";

const GUARDIAN_URL = "https://content.guardianapis.com";

const guardian = ky.create({ prefixUrl: GUARDIAN_URL });

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

  return response.results.map((news) => ({
    id: news.id,
    title: news.webTitle,
    url: news.webUrl,
    publicationDate: news.webPublicationDate,
    source: "The Guardian",
    category: news.sectionName,
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

  return response.results.map((category) => category.webTitle);
}
