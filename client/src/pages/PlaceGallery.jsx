import React from "react";
import { getToken } from "../api";
import { useEffect } from "react";

const PlaceGallery = ({ place, setShowAllPhotos, showAllPhotos }) => {
  return (
    <>
      <div className="relative mt-4">
        <div className="grid gap-2 rounded-2xl overflow-hidden grid-cols-[2fr_1fr]">
          <div className="flex">
            {place?.photos && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="cursor-pointer object-cover aspect-square"
                src={place?.photos[0]}
                alt=""
              />
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex">
              {place?.photos && place?.photos[1] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="cursor-pointer aspect-square object-cover"
                  src={place?.photos[1]}
                  alt=""
                />
              )}
            </div>

            <div className="flex">
              {place?.photos && place?.photos[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="cursor-pointer aspect-square object-cover"
                  src={place?.photos[2]}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 font-semibold absolute shadow-md shadow-gray-500 bottom-2 right-2 py-2 bg-white border rounded-2xl px-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
          Show Photos
        </button>
      </div>
    </>
  );
};

export default PlaceGallery;
