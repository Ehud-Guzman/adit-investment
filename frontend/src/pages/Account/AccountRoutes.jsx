// src/pages/Account/AccountRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MyOrders from "./MyOrders";
import Profile from "./Profile";

const AccountRoutes = () => {
  return (
    <Routes>
      <Route path="/account" element={<Profile />} />
      <Route path="/account/orders" element={<MyOrders />} />
    </Routes>
  );
};

export default AccountRoutes;
