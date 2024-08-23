import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { Paths } from "../../pages/paths";
import classNames from "classnames";

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.navContainer}>
      <Link
        to={Paths.NEWS_AGGREGATOR}
        className={classNames(styles.link, {
          [styles.isActive]: pathname === Paths.NEWS_AGGREGATOR,
        })}
      >
        News
      </Link>
      <Link
        to={Paths.SETTINGS}
        className={classNames(styles.link, {
          [styles.isActive]: pathname === Paths.SETTINGS,
        })}
      >
        Settings
      </Link>
    </nav>
  );
}
