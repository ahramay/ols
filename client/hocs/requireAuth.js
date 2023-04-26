import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
export default (ChildComponent) => (props) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) return <Redirect to="/login" />;

  return <ChildComponent {...props} />;
};
