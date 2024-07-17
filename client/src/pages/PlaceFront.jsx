import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context, server } from "../main.jsx";
import Booking from "./Booking.jsx";
import toast from "react-hot-toast";
import PlaceGallery from "./PlaceGallery.jsx";
import AddressLink from "./AddressLink.jsx";
import { getToken } from "../api.js";
const PlaceFront = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);

  const { setUser } = useContext(Context);

  const history = useNavigate();

  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .get(`${server}/places/place/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPlace(response.data.place);
        //setisausetIsAuthenticated(true);
      })
      .catch((error) => {
        console.log(error);
        // toast.error(error.response.data.message);
        //setIsAuthenticated(false);
        if (error.response.data.message === "First Login") {
          history("/");
        }
      });
  }, [id]);

  //overflow hidden
  //flex object-cover
  //relative absolute

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     history("/");
  //   } else {
  //     return;
  //   }
  // }, [isAuthenticated]);
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

  //grid overflow-hidden rounded-2xl
  //-mx-6 min-h-full

  const getComp = () => {
    return (
      <div className="bg-black text-white absolute inset-0 min-h-screen ">
        <div className="p-8 grid gap-8 bg-black">
          <div className="p-4">
            <h2 className="text-3xl">Photos of {place?.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-12 flex gap-1 py-2 px-4 rounded-2xl text-black bg-white shadow shadow-black"
            >
              Close Photos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {place?.photos.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index} className="w-full">
                <img src={photo} className=" min-w-full" alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {!showAllPhotos && (
        <div className="mt-4 -mx-8 px-8 pt-8 bg-gray-100">
          <h1 className="text-3xl">{place?.title}</h1>
          <AddressLink>{place?.address}</AddressLink>

          <PlaceGallery
            place={place}
            showAllPhotos={showAllPhotos}
            setShowAllPhotos={setShowAllPhotos}
          />

          <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] ">
            <div>
              <div className="my-4">
                <h2 className="font-bold text-2xl">Description</h2>
                {place?.description}
              </div>
              Check-in:{place?.checkIn}
              <br />
              Check-out:{place?.checkOut}
              <br />
              Max number of guests: {place?.maxGuests}
            </div>
            <div>
              <Booking place={place} />
            </div>
          </div>

          <div className="bg-white -mx-8 px-8 py-8 border-t">
            <div>
              <h2 className="font-semibold text-2xl">Extra Info</h2>
            </div>
            <div
              className="mt-2
              onClick={()=>setShowAllPhotos(true)} text-sm text-gray-700 leading-6 "
            >
              {place?.extraInfo}
            </div>
          </div>
        </div>
      )}
      {showAllPhotos && getComp()}
    </>
  );
};

export default PlaceFront;
