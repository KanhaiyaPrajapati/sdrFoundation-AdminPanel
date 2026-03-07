
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import AdminTable from "./pages/Tables/admin/AdminTable";
import VolunteersTables from "./pages/Tables/Volunteers/Volunteers"; // Import Volunteers page
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DonationsTableOne from "./pages/Tables/donations/DonationsTable";
import Users from "./pages/Users/UsersTable";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/Admin-Tables" element={<AdminTable />} />
            <Route path="/Donations-Tables" element={<DonationsTableOne />} />
            <Route path="/users" element={<Users />} />

            {/* Tables Routes */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/volunteers" element={<VolunteersTables />} /> {/* Add Volunteers route */}
            
            {/* You can add more table routes here */}
            {/* <Route path="/contact-leads" element={<ContactLeadsTables />} /> */}
          </Route>
          {/* Public route */}
          <Route path="/signin" element={<SignIn />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/Admin-Tables" element={<AdminTable />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
