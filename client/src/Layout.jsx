import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useContext } from "react";
import { useEffect } from "react";
import { getToken } from "./api";
import { Context } from "./main";
const Layout = () => {
  return (
    <div className="py-4 px-4 flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
