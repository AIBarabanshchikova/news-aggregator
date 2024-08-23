import { useContext } from "react";
import { AppContext } from "./appContext";

export function useAppContext() {
  const value = useContext(AppContext);

  if (value === null) {
    throw new Error("App must be wrapped in AppContext");
  }

  return value;
}
