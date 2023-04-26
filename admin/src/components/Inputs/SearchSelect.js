import React from "react";
import Select from "react-select";

export default (props) => {
  const { error, label, value } = props;
  let classes = "my-select";
  if (error) {
    classes = classes + " my-input-error";
  }

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <Select
        // styles={customStyles}
        {...props}
        className={classes}
      />
      {error && (
        <p className="my-input-error-text" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "none",
    outline: "none",
    boxShadow: "none",
  }),
};
