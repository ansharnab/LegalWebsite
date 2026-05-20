import { Routes, Route } from "react-router-dom";
import { SiteDataProvider } from "./context/SiteDataContext";
import Layout from "./site/Layout";
import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import PublicationsPage from "./pages/PublicationsPage";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <SiteDataProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="publications" element={<PublicationsPage />} />
        </Route>
      </Routes>
    </SiteDataProvider>
  );
}
