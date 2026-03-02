import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Services from "./pages/Tables/Services/Services";
import Appointments from "./pages/Tables/Appointment/Appointments"; // Add this import

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appointments" element={<Appointments />} /> {/* Add this route */}
          </Route>

          <Route path="/signin" element={<SignIn />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}