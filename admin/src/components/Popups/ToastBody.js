import React from "react";

export default props => {
  const { title, image, time, message, closeToast } = props;
  return (
    <>
      <div className="toast-header">
        {image && <img src={image} className="rounded mr-2" alt="image" />}
        {title && <strong className="mr-auto">{title}</strong>}
        {time && <small>{time}</small>}
        <button
          type="button"
          className="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close"
          onClick={closeToast}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">{message}</div>
    </>
  );
};
