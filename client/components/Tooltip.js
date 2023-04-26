import React from "react";

import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

export default (props) => {
  return <Tooltip {...props}>{props.children}</Tooltip>;
};
