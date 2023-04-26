import React from "react";

function Button({ href, title, btnClass }) {
  return (
    <a href={href} className={`btn more ${btnClass}`}>
      {title}
    </a>
  );
}

export default Button;
