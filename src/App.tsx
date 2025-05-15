import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AppointmentsPage from "./pages/AppointmentsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
// import { Dashboard } from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/new" element={<AppointmentsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="participants/new" element={<ParticipantsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Sonner />
  </QueryClientProvider>
);

export default App;
