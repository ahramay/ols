import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default (props) => {
  const { color = "#00acf0" } = props;
  return <BounceLoader color={color} />;
};
