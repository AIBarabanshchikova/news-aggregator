import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getNewsFromGuardian } from "../../api/guardian";
import { getNewsFromNewsAPI } from "../../api/newsAPI";
import {
  getNewsByCategoryFromNYTimes,
  getNewsFromNYTimes,
} from "../../api/nyTimes";
import { News } from "./types";
import styles from "./index.module.scss";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { useAppContext } from "../../appContextHooks";
import { ALL_CATEGORIES, ALL_SOURCES, SOURCES } from "../Settings/constants";
import { DATE_INTERVALS } from "./dateIntervals";
import { Navigation } from "../Navigation";

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
    useState<keyof typeof DATE_INTERVALS>("any_time");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debouncedSearchString = useDebouncedValue(searchString);

  const filteredNews = useMemo(() => {
    return news?.filter((article) => {
      const filteredByCategory =
        selectedCategory === ALL_CATEGORIES ||
        article.category === selectedCategory;
      const filteredBySource =
        selectedSource === ALL_SOURCES || article.source === selectedSource;
      const filteredByDate = DATE_INTERVALS[selectedDate].helper(
        article.publicationDate
      );

      return filteredByCategory && filteredBySource && filteredByDate;
    });
  }, [news, selectedCategory, selectedDate, selectedSource]);

  const getNews = useCallback(async () => {
    const allSourcesSelected = value.settings.source === ALL_SOURCES;
    const allCategoriesSelected = value.settings.category === ALL_CATEGORIES;
    const newsFromGuardianSelected =
      allSourcesSelected || value.settings.source === SOURCES.theGuardian;
    const newsFromNewsAPISelected =
      allSourcesSelected || value.settings.source === SOURCES.newsAPI;
    const newsFromNYTimesSelected =
      allSourcesSelected || value.settings.source === SOURCES.nyTimes;

    Promise.allSettled([
      newsFromGuardianSelected
        ? getNewsFromGuardian(
            debouncedSearchString ?? undefined,
            !allCategoriesSelected ? value.settings.category : undefined
          )
        : [],
      newsFromNewsAPISelected
        ? getNewsFromNewsAPI(
            debouncedSearchString ?? undefined,
            !allCategoriesSelected ? value.settings.category : undefined
          )
        : [],
      // NYTimes API doesn't support search by category and keywords at the same time.
      newsFromNYTimesSelected &&
      !allCategoriesSelected &&
      !debouncedSearchString
        ? getNewsByCategoryFromNYTimes(value.settings.category)
        : [],
      newsFromNYTimesSelected && allCategoriesSelected
        ? getNewsFromNYTimes(debouncedSearchString ?? undefined)
        : [],
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
        setErrorMessage("Unable to load any news. Please try again later.");
        return;
      }

      const sortedNews = allNews
        .filter((article) => !!article.title)
        .sort(
          (a, b) =>
            new Date(b.publicationDate).getTime() -
            new Date(a.publicationDate).getTime()
        );
      const allSourcesSet = new Set(allNews.map((article) => article.source));
      const allCategoriesSet = new Set(
        allNews.map((article) => article.category).filter(Boolean)
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
                setSelectedDate(e.target.value as keyof typeof DATE_INTERVALS)
              }
              disabled={!news}
            >
              {Object.entries(DATE_INTERVALS).map(([key, value]) => (
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
              filteredNews?.map((article) => (
                <div key={article.id} className={styles.news}>
                  <a
                    href={article.url}
                    target="_blank"
                    className={styles.newsTitle}
                  >
                    {article.title}
                  </a>
                  <div>
                    <div
                      className={styles.details}
                    >{`Category: ${article.category}`}</div>
                    <div className={styles.details}>{`Published at: ${new Date(
                      article.publicationDate
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
