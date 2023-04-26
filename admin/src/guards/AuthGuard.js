import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { basePath } from "../configs";

const AuthGuard = ({ component: Component, user, token, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        token && user && user.role === "ADMIN" ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: basePath + "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(AuthGuard);
