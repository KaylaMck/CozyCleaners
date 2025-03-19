// Update your ApplicationViews.jsx
import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import BookingForm from "./BookingForm";
import AddressForm from "./AddressForm";
import Dashboard from "./Dashboard";
import RequestDetails from "./RequestDetails";
import ServicesList from "./ServiceList";
import CompletedCleanings from "./CompletedCleanings";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Dashboard />
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
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <BookingForm />
            </AuthorizedRoute>
          }
        />
        <Route
          path="addresses/new"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
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
