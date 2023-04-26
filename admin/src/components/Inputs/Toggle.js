import React from "react";

export default (props) => {
  const { checked, onChange, disabled = false } = props;
  return (
    <>
      <label className="custom-toggle">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
        <span className="custom-toggle-slider rounded-circle"></span>
      </label>
    </>
  );
};
