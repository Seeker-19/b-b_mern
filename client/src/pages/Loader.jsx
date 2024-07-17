import React from "react";
import loading from "./load.gif";


const Loader = () => {
  return (
    <div className="mt-5 flex items-center justify-center">
      <img src={loading} />
    </div>
  );
};

export default Loader;
