import React, { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PlaceForm from "./PlaceForm.jsx";
import AccountNav from "./AccountNav.jsx";
import { Context } from "../main.jsx";
import axios from "axios";
import { server } from "../main.jsx";
import toast from "react-hot-toast";
import PlaceImg from "./PlaceImg.jsx";
import { getToken } from "../api.js";
import { MdDelete } from "react-icons/md";

const PlacesPage = () => {
  // const { action } = useParams();
  // console.log(action);

  const history = useNavigate();

  const { setUser } = useContext(Context);

  const [places, setPlaces] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getPlaces = async () => {
    try {
      const { data } = await axios.get(`${server}/places/plac`, {
        withCredentials: true,
      });

      console.log(data.places);
      setRefresh(true);
      setPlaces(data.places);
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  //stretch grow shrink

  useEffect(() => {
    getPlaces();
  }, [refresh]);

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

  console.log(places);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          to={"/account/places/new"}
          className="inline-flex bg-primary gap-2 text-white py-2 px-6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add New Places
        </Link>
      </div>
      <div>
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              key={place._id}
              className="bg-gray-200 mt-3 cursor-pointer flex gap-4 p-4 rounded-2xl"
            >
              <div className="cursor-pointer flex gap-3 rounded-2xl items-center w-full">
                <div className="bg-gray-300 w-32 h-32 flex shrink-0">
                  <PlaceImg place={place} />
                </div>

                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PlacesPage;
