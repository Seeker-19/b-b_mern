import React, { useContext, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Context, server } from "../main.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getToken } from "../api.js";

const Booking = ({ place }) => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const history = useNavigate();

  const { user } = useContext(Context);

  //console.log(checkIn, checkOut);

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(checkOut, checkIn);
  }

  //console.log(numberOfDays);

  const bookThisPlace = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/bookings/booking`,
        {
          place: place?._id,
          checkIn,
          checkOut,
          numberOfGuests,
          name,
          email: user.email,
          phone,
          price: numberOfNights * place?.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // const bookingId=data.doc._id;
      // console.log(bookingId);

      const bookingId = data.restplace._id;
      console.log(bookingId);

      toast.success(data.message);
      history(`/account/bookings/${bookingId}`);
    } catch (error) {
      toast.error(error.response.data.message);

      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 10 digits
    const limitedDigits = digitsOnly.substring(0, 10);

    setPhone(limitedDigits);
  };

  // useEffect(() => {
  //   const checkToken = async () => {
  //     let isToken = await getToken();
  //     if (!isToken) {
  //       history("/");
  //     }
  //   };

  //   checkToken();
  // }, [history]);

  return (
    <>
      <form onSubmit={bookThisPlace}>
        <div className="bg-white rounded-2xl p-4">
          <div className="text-2xl text-center">
            Price: ${place?.price} / per night
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="flex">
              <div className="px-4 py-3">
                <label>Check in:</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="px-4 py-3 border-l">
                <label>Check out:</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <div className="px-4 py-3 border-t">
              <label>Number of guests:</label>
              <input
                type="number"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
              />
            </div>

            {numberOfNights > 0 && (
              <div className="px-4 py-3 border-t">
                <label>Your Full Name:</label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={phone}
                  required
                  placeholder="Enter 10 digit phone number"
                  onChange={handlePhoneChange}
                />
              </div>
            )}
          </div>

          <button className="prim mt-4" type="submit">
            Book this place
            {numberOfNights > 0 && (
              <span>&nbsp;${numberOfNights * place?.price}</span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Booking;
