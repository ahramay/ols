import React from "react";

export default (props) => {
  const { images = [] } = props;

  return (
    <>{images.length > 0 && <img src={images[0].image} className="w-100" />}</>
  );
};
