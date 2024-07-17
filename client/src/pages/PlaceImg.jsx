import React from "react";

const PlaceImg = ({ place, index = 0, className = null }) => {
  if (!className) {
    className = "object-cover";
  }
  return (
    <>
      {place?.photos.length > 0 && (
        <img className={className} src={place?.photos[index]} />
      )}
    </>
  );
};

export default PlaceImg;
