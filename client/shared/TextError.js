import React from "react";

function TextError(props) {
  return (
    <>{props.children && <div className="error mr-3">{props.children}</div>}</>
  );
}

export default TextError;
