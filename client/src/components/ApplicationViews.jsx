// ApplicationViews.jsx
import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import BookingForm from "./BookingForm";
import AddressForm from "./AddressForm";
import Dashboard from "./Dashboard";
import RequestDetails from "./RequestDetails";
import CompletedCleanings from "./CompletedCleanings";
import CleanerDashboard from "./CleanerDashboard";
import ServicesList from "./ServiceList";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              {loggedInUser?.roles?.includes("Cleaner") ? (
                <CleanerDashboard />
              ) : (
                <Dashboard />
              )}
            </AuthorizedRoute>
          }
        />
        <Route
          path="cleaner"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Cleaner"]}>
              <CleanerDashboard />
            </AuthorizedRoute>
          }
        />
        <Route
          path="services"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ServicesList />
            </AuthorizedRoute>
          }
        />
        <Route
          path="book"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Client"]}>
              <BookingForm />
            </AuthorizedRoute>
          }
        />
        <Route
          path="addresses/new"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Client"]}>
              <AddressForm />
            </AuthorizedRoute>
          }
        />
        <Route
          path="requests/:id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <RequestDetails />
            </AuthorizedRoute>
          }
        />
        <Route
          path="completed"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <CompletedCleanings />
            </AuthorizedRoute>
          }
        />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}