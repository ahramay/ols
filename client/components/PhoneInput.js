import React from "react";

import PhoneInput from "react-phone-input-2";

const MyInput = (props) => {
  const { error, label, className, onChange, onChangeFormik } = props;
  let classes = className + " form-control form-control-alternative text-black";
  if (error) {
    classes = classes + " border border-danger";
  }
  return (
    <>
      {label && <Label className="form-control-label">{label}</Label>}
      <PhoneInput
        country={"pk"}
        prefix="+"
        inputClass={classes}
        {...props}
        specialLabel=""
        onChange={(phoneNumber) => {
          if (phoneNumber.charAt(0) !== "+") phoneNumber = `+${phoneNumber}`;
          onChange(phoneNumber);
        }}
      />

      {error && <div className="alert alert-danger">{error}</div>}
    </>
  );
};

export default MyInput;
