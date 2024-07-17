import React, { useContext } from "react";
import { Context } from "../main";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader.jsx";
import PlacesPage from "./PlacesPage.jsx";
import { useEffect } from "react";
import AccountNav from "./AccountNav.jsx";
import { getToken } from "../api.js";

const Account = () => {
  const { user, loading, setUser } = useContext(Context);

  const history = useNavigate();

  const location = useLocation();
  console.log(location);

  useEffect(() => {
    const checkToken = async () => {
      let isToken = await getToken();
      if (!isToken) {
        history("/");
        setUser(null);
      }
    };

    checkToken();
  }, [history]);

  // let { subpage } = useParams();

  // if (subpage === undefined) {
  //   subpage = "profile";
  // }
  // console.log(subpage);

  return loading ? (
    <Loader />
  ) : (
    <div>
      {/* account {user?.name}  */}
      <AccountNav />

      <div className=" text-center text-2xl text-gray-500 max-w-lg mx-auto">
        Logged in as {user?.name} ({user?.email})<br />
      </div>
    </div>
  );
};

export default Account;
