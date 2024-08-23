import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { ALL_CATEGORIES, ALL_SOURCES } from "./pages/NewsAggregator/types";
import { getCategoriesFromGuardian, getCategoriesFromNYTimes } from "./api";
import { NEWS_API_CATEGORIES } from "./pages/Settings/types";

type ContextValue = {
  categories: string[];
  settings: {
    source: string;
    category: string;
  };
};

export const AppContext = createContext<{
  value: ContextValue;
  setSettings: (property: "source" | "category", value: string) => void;
} | null>(null);

export function AppContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [value, setValue] = useState<ContextValue>({
    categories: [],
    settings: {
      source: ALL_SOURCES,
      category: ALL_CATEGORIES,
    },
  });

  const setSettings = (property: "source" | "category", value: string) => {
    setValue((currentValue) => ({
      ...currentValue,
      settings: {
        ...currentValue.settings,
        [property]: value,
      },
    }));
  };

  const contextValue = useMemo(() => ({ value, setSettings }), [value]);

  const getCategories = async () => {
    const [guardianCategories, nyCategories] = await Promise.all([
      getCategoriesFromGuardian(),
      getCategoriesFromNYTimes(),
    ]);

    const allCategoriesSet = new Set([
      ...guardianCategories,
      ...nyCategories,
      ...Object.values(NEWS_API_CATEGORIES),
    ]);

    setValue((currentValue) => ({
      ...currentValue,
      categories: Array.from(allCategoriesSet)
        .filter(Boolean)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    }));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
