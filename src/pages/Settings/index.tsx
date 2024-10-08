import { useAppContext } from "../../appContextHooks";
import styles from "./index.module.scss";
import { ALL_CATEGORIES, ALL_SOURCES, SOURCES } from "./constants";
import { Navigation } from "../Navigation";

export function Settings() {
  const { value, setSettings } = useAppContext();

  return (
    <>
      <Navigation />
      <div className={styles.settings}>
        <select
          onChange={(e) => setSettings("source", e.target.value)}
          value={value.settings["source"]}
        >
          <option value={ALL_SOURCES}>All sources</option>
          {Object.values(SOURCES).map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSettings("category", e.target.value)}
          value={value.settings["category"]}
          disabled={!value.categories.length}
        >
          <option value={ALL_CATEGORIES}>All categories</option>
          {value.categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
