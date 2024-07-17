import React, { useContext, useEffect, useState } from "react";
import AccountNav from "./AccountNav.jsx";
import { Context, server } from "../main.jsx";
import axios from "axios";
import Loader from "./Loader.jsx";
import { useNavigate } from "react-router-dom";
import PlaceImg from "./PlaceImg.jsx";
import { format } from "date-fns";
import { differenceInCalendarDays } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "./BookingDates.jsx";
import _ from "lodash";
import { useCallback } from "react";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { getToken } from "../api.js";
import { FaXmark } from "react-icons/fa6";

import { TiTick } from "react-icons/ti";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(Context);

  const history = useNavigate();

  const getBookings = async (query = "") => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${server}/bookings/getBookingPlaces`,

        {
          params: { query },
          withCredentials: true,
        }
      );

      setBookings(data.bookedPlaces);
      //console.log(bookings);

      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  // useEffect(() => {
  //   getBookings();
  //   //console.log(bookings);
  // }, []);

  //   useEffect(()=>{

  //     console.log(bookings);
  //   },[bookings]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     history("/");
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

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedGetBookings = useCallback(
    _.debounce((query) => getBookings(query), 1000),
    []
  );

  console.log(bookings);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedGetBookings(searchQuery);
    } else {
      getBookings();
    }
  }, [searchQuery]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const { data } = await axios.delete(
        `${server}/bookings/deletebooking/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      getBookings();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  return (
    <div>
      <AccountNav />

      {loading ? (
        <Loader />
      ) : (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="border p-2 rounded mb-10"
          />
          <div className="grid grid-cols-1 gap-4">
            {bookings.length > 0 &&
              bookings?.map((booking) => (
                <Link
                  to={`/account/bookings/${booking._id}`}
                  className="flex flex-grow gap-4 bg-gray-200 rounded-2xl overflow-hidden"
                  key={booking._id}
                >
                  <div className="flex w-48">
                    <PlaceImg place={booking?.place} />
                  </div>

                  <div className="py-3 w-full">
                    <h2 className="text-xl">{booking?.place?.title}</h2>

                    <div className="text-xl">
                      <BookingDates
                        booking={booking}
                        className="mt-4 mb-4 text-gray-600"
                      />

                      <div className="flex justify-between gap-1 mt-1">
                        <div className="flex gap-5">
                          <div className="flex gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-8 h-8"
                            >
                              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                              <path
                                fillRule="evenodd"
                                d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-lg">
                              Total Price: ${booking?.price}
                            </span>
                          </div>
                          <div>
                            {booking?.booked ? (
                              <main className="flex gap-1">
                                <TiTick size={26} className="text-green-600" />
                                <span>Payment Done</span>
                              </main>
                            ) : (
                              <main className="flex gap-1">
                                <FaXmark size={26} className="text-red-600" />
                                <span>Payment Not Done</span>
                              </main>
                            )}
                          </div>
                        </div>
                        <div className="p-2 items-center ">
                          <MdDelete
                            size={26}
                            onClick={(e) => handleDelete(booking._id, e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsPage;
