import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default (props) => {
  return (
    <>
      <DatePicker {...props} />
    </>
  );
};
