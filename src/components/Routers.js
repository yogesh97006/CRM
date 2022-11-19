import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Engineer from "../pages/Engineer";
import Customer from "../pages/Customer";
import NotFound from "../pages/NotFound";
import RequiredAuth from "./RequiredAuth";
import Unauthorized from "../pages/Unauthorized";

function Routers() {
  const ROLES = {
    ADMIN: "ADMIN",
    ENGINEER: "ENGINEER",
    CUSTOMER: "CUSTOMER",
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequiredAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={[ROLES.ENGINEER]} />}>
          <Route path="/engineer" element={<Engineer />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={[ROLES.CUSTOMER]} />}>
          <Route path="/customer" element={<Customer />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default Routers;
