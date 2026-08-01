import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import HomePage from "@/features/home/HomePage";
import PeoplePage from "@/features/people/PeoplePage";
import PersonDetailPage from "@/features/people/PersonDetailPage";
import AddPersonPage from "@/features/people/AddPersonPage";
import EditPersonPage from "@/features/people/EditPersonPage";
import DiscoverPage from "@/features/discover/DiscoverPage";
import JourneyPage from "@/features/journey/JourneyPage";
import NewMemoryPage from "@/features/journey/NewMemoryPage";
import MorePage from "@/features/more/MorePage";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/new" element={<AddPersonPage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />
        <Route path="/people/:id/edit" element={<EditPersonPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/journey" element={<JourneyPage />} />
<Route path="/journey/new" element={<NewMemoryPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}