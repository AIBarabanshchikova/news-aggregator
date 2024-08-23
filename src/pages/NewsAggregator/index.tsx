import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  getNewsFromNewsAPI,
  getNewsFromGuardian,
  getNewsFromNYTimes,
  getNewsByCategoryFromNYTimes,
} from "../../api";
import { News } from "../../api/types";
import { ALL_CATEGORIES, ALL_SOURCES, INTERVALS } from "./types";
import styles from "./index.module.scss";
import { Navigation } from "../Navigation";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { useAppContext } from "../../appContextHooks";
import { SOURCES } from "../Settings/types";

export function NewsAggregator() {
  const { value } = useAppContext();
  const [news, setNews] = useState<News[] | null>(null);
  const [sources, setSources] = useState<string[] | null>(null);
  const [categories, setCategories] = useState<string[] | null>(null);
  const [searchString, setSearchString] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [selectedSource, setSelectedSource] = useState<string>(ALL_SOURCES);
  const [selectedDate, setSelectedDate] =
    useState<keyof typeof INTERVALS>("any_time");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debouncedSearchString = useDebouncedValue(searchString);

  const filteredNews = useMemo(() => {
    return news?.filter((i) => {
      const filteredByCategory =
        selectedCategory === ALL_CATEGORIES || i.category === selectedCategory;
      const filteredBySource =
        selectedSource === ALL_SOURCES || i.source === selectedSource;
      const filteredByDate = INTERVALS[selectedDate].helper(i.publicationDate);

      return filteredByCategory && filteredBySource && filteredByDate;
    });
  }, [news, selectedCategory, selectedDate, selectedSource]);

  const getNews = useCallback(async () => {
    const isAllSources = value.settings.source === ALL_SOURCES;
    const isAllCategories = value.settings.category === ALL_CATEGORIES;
    const callNewsFromGuardian =
      isAllSources || value.settings.source === SOURCES.theGuardian;
    const callNewsFromNewsAPI =
      isAllSources || value.settings.source === SOURCES.newsAPI;
    const callNewsFromNYTimes =
      isAllSources || value.settings.source === SOURCES.nyTimes;
    const searchByKeywordsAndCategory =
      !isAllCategories && !!debouncedSearchString;

    Promise.allSettled([
      callNewsFromGuardian
        ? getNewsFromGuardian(
            debouncedSearchString ?? undefined,
            !isAllCategories ? value.settings.category : undefined
          )
        : [],
      callNewsFromNewsAPI
        ? getNewsFromNewsAPI(
            debouncedSearchString ?? undefined,
            !isAllCategories ? value.settings.category : undefined
          )
        : [],
      !callNewsFromNYTimes || searchByKeywordsAndCategory
        ? []
        : !isAllCategories
        ? getNewsByCategoryFromNYTimes(value.settings.category)
        : getNewsFromNYTimes(debouncedSearchString ?? undefined),
    ]).then((results) => {
      let allNews: News[] = [];
      let errorsCount = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allNews = [...allNews, ...result.value];
        } else {
          errorsCount = errorsCount + 1;
        }
      });

      if (errorsCount === results.length) {
        setErrorMessage("Too many requests. Please try again later.");
        return;
      }

      const sortedNews = allNews
        .filter((i) => !!i.title)
        .sort(
          (a, b) =>
            new Date(b.publicationDate).getTime() -
            new Date(a.publicationDate).getTime()
        );
      const allSourcesSet = new Set(allNews.map((i) => i.source));
      const allCategoriesSet = new Set(
        allNews.map((i) => i.category).filter(Boolean)
      );

      setNews(sortedNews);
      setSources(
        Array.from(allSourcesSet).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
      );
      setCategories(
        Array.from(allCategoriesSet).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
      );
    });
  }, [debouncedSearchString, value.settings.category, value.settings.source]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    getNews();
  };

  useEffect(() => {
    getNews();
  }, [getNews]);

  return (
    <>
      <Navigation />
      <div className={styles.page}>
        <div className={styles.search}>
          <form className={styles.searchField} onSubmit={submit}>
            <input
              type="text"
              value={searchString ?? ""}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className={styles.filters}>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={!categories}
            >
              <option value={ALL_CATEGORIES}>All categories</option>
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              onChange={(e) =>
                setSelectedDate(e.target.value as keyof typeof INTERVALS)
              }
              disabled={!news}
            >
              {Object.entries(INTERVALS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.value}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setSelectedSource(e.target.value)}
              disabled={!news}
            >
              <option value={ALL_SOURCES}>All sources</option>
              {sources?.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.content}>
          {errorMessage ? (
            <div className={styles.error}>{errorMessage}</div>
          ) : filteredNews ? (
            filteredNews.length ? (
              filteredNews?.map((i) => (
                <div key={i.id} className={styles.news}>
                  <a href={i.url} target="_blank" className={styles.newsTitle}>
                    {i.title}
                  </a>
                  <div>
                    <div
                      className={styles.details}
                    >{`Category: ${i.category}`}</div>
                    <div className={styles.details}>{`Published at: ${new Date(
                      i.publicationDate
                    ).toLocaleDateString()}`}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.nothingFound}>
                Oops... nothing found!
                <br />
                Try other keywords or categories
              </div>
            )
          ) : (
            <span className={styles.loader}></span>
          )}
        </div>
      </div>
    </>
  );
}
