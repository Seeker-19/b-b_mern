import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context, server } from "../main.jsx";
import AddressLink from "./AddressLink.jsx";
import PlaceGallery from "./PlaceGallery.jsx";
import BookingDates from "./BookingDates.jsx";
import toast from "react-hot-toast";
import { getToken } from "../api.js";

const BookingPage = () => {
  const { id } = useParams();

  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const { user } = useContext(Context);
  const history = useNavigate();

  const [booking, setBooking] = useState(null);

  const getBook = async () => {
    try {
      const { data } = await axios.get(`${server}/bookings/getBookingPlaces`, {
        withCredentials: true,
      });

      const foundBooking = data.bookedPlaces.find(({ _id }) => _id === id);
      if (foundBooking) {
        setBooking(foundBooking);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "First Login") {
        history("/");
      }
    }
  };

  const getComp = () => {
    return (
      <div className="bg-black text-white absolute inset-0 min-h-screen ">
        <div className="p-8 grid gap-8 bg-black">
          <div className="p-4">
            <h2 className="text-3xl">Photos of {booking?.place?.title}</h2>
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
          {booking?.place?.photos.length > 0 &&
            booking?.place.photos.map((photo, index) => (
              <div key={index} className="w-full">
                <img src={photo} className=" min-w-full" alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    getBook();
  }, [id]);

  useEffect(() => {
    if (!getToken()) {
      history("/");
    }
  }, []);

  const checkoutHandler = async (amount) => {
    try {
      const {
        data: { key },
      } = await axios.get(`${server}/getkey`);

      const {
        data: { order },
      } = await axios.post(
        `${server}/bookings/checkout`,
        {
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(order);

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "AirBnb",
        description: "Book your Bnb",
        order_id: order.id,
        callback_url: `${server}/bookings/paymentverification`,
        prefill: {
          name: booking?.name,
          contact: booking?.phone,
          email: booking?.email,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#121212",
        },
        handler: async function (response) {
          // Handle the response after payment is successful
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;

          // Send the payment details to your backend for verification
          try {
            const { data } = await axios.post(
              `${server}/bookings/paymentverification`,
              {
                paymentId,
                orderId,
                signature,
              },
              {
                headers: {
                  booking_id: booking._id,
                  "Content-Type": "application/json",
                },
                params: {
                  place_id: booking?.place._id,
                },
                withCredentials: true,
              }
            );

            // Print the response from the backend (request ID, payment ID, etc.)

            toast.success(data.message);
            console.log(data);

            history("/account/bookings");
          } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);

            if (error.response.data.message === "First Login") {
              history("/");
            }
          }
        },
      };
      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);

      if (error.response.data.message === "First Login") {
        history("/");
      }
    }

    // console.log(data);

    // console.log(window);
  };

  console.log(booking);

  return (
    <>
      {!showAllPhotos && (
        <div className="my-8">
          {/* single booking page {id} */}

          <h1 className="text-3xl">{booking?.place.title}</h1>

          <AddressLink className="my-2 block">
            {booking?.place.address}
          </AddressLink>

          <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
            <div>
              {" "}
              <h2 className="text-2xl mb-4">Your Booking Information:</h2>
              <BookingDates booking={booking} />
            </div>

            <div
              className="bg-primary px-6 py-4 text-white rounded-2xl hover:bg-red-500 cursor-pointer"
              onClick={() => checkoutHandler(booking?.price)}
            >
              <div>Total price</div>
              <div className="text-3xl">{booking?.price}</div>
            </div>
          </div>

          <PlaceGallery
            place={booking?.place}
            showAllPhotos={showAllPhotos}
            setShowAllPhotos={setShowAllPhotos}
          />
        </div>
      )}

      {showAllPhotos && getComp()}
    </>
  );
};

export default BookingPage;
