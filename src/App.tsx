import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Paths } from "./pages/paths";
import { NewsAggregator } from "./pages/NewsAggregator";
import { Settings } from "./pages/Settings";
import { AppContextProvider } from "./appContext";

const router = createBrowserRouter([
  {
    path: Paths.NEWS_AGGREGATOR,
    element: <NewsAggregator />,
  },
  {
    path: Paths.SETTINGS,
    element: <Settings />,
  },
]);

export function App() {
  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
}
