import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Perks from "./Perks.jsx";

import axios from "axios";
import { Context, server } from "../main.jsx";
import toast from "react-hot-toast";
import PhotosUploader from "./PhotosUploader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import AccountNav from "./AccountNav.jsx";
import { getToken } from "../api.js";
const PlaceForm = () => {
  const { setUser } = useContext(Context);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");

  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);

  const history = useNavigate();

  const { id } = useParams();

  const inputHeader = (text) => {
    return <h2 className="inline-block mt-5 text-2xl font-bold ">{text}</h2>;
  };

  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };

  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    try {
      setLoading(true);

      if (id) {
        var { data } = await axios.put(
          `${server}/places/place/${id}`,

          placeData,

          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      } else {
        var { data } = await axios.post(
          `${server}/places/newplace`,

          placeData,

          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      toast.success(data.message);
      setLoading(false);
      history("/account/places");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     history("/");
  //   }
  //   else{
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

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`${server}/places/place/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);

        const {
          title,
          address,
          description,
          photos,
          checkIn,
          perks,
          extraInfo,
          checkOut,
          maxGuests,
          price,
        } = response.data.place;

        setTitle(title || "");
        setAddress(address || "");
        setAddedPhotos(photos || []);
        setDescription(description || "");
        setExtraInfo(extraInfo || "");
        setCheckIn(checkIn || "");
        setCheckOut(checkOut || "");
        setPerks(perks || []);
        setMaxGuests(maxGuests || 1);
        setPrice(price || 100);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "First Login") {
          history("/");
        }
      });
  }, [id]);

  return (
    <>
      <AccountNav />
      <form onSubmit={handleSubmit}>
        {preInput("Title", "Title for your place should be short and catchy")}
        <input
          required
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title: for example:My lovely apt"
        />

        {preInput("Address", "Address in this place")}

        <input
          required
          type="text"
          id="address"
          name="address"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {preInput("Photos", "more=better")}

        <PhotosUploader
          loading={loading}
          setLoading={setLoading}
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
          photoLink={photoLink}
          setPhotoLink={setPhotoLink}
        />

        {preInput("Description", "description of a place")}

        <textarea
          required
          name="description"
          id="description"
          cols="25"
          rows="8"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {preInput("Perks", "select all the perks")}

        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-3">
          <Perks perks={perks} setPerks={setPerks} />
        </div>

        <h2 className="inline-block text-2xl font-bold mt-4 ">Extra Info</h2>
        <p className="text-gray-500 text-sm">house,rules,etc.</p>
        <textarea
          name="extrainfo"
          id="extrainfo"
          cols="30"
          rows="8"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        ></textarea>

        <h2 className="inline-block text-2xl font-bold mt-4 ">
          Check in& out times
        </h2>
        <p className="text-gray-500 text-sm">
          add check in and out times remember to have some time window between
          guets.{" "}
        </p>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 mb-1">Check in time</h3>
            <input
              type="text"
              name="cehckin"
              id="checkin"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Check out time</h3>
            <input
              type="text"
              name="checkout"
              id="checkout"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Max number of guests</h3>
            <input
              type="number"
              name="maxguests"
              id="maxguests"
              placeholder="100"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Price per night</h3>
            <input
              type="number"
              name="maxguests"
              id="maxguests"
              placeholder="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="prim mt-2">
          Save
        </button>
      </form>
    </>
  );
};

export default PlaceForm;
