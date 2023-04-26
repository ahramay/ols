import React from "react";
import GoogleLogin from "react-google-login";

export default (props) => {
  const { onGoogleResponse = () => {} } = props;
  return (
    <GoogleLogin
      clientId="937232182872-bpaepcabl7qvvuonp0bvvr22n9k533th.apps.googleusercontent.com"
      onSuccess={onGoogleResponse}
      // onFailure={onGoogleResponse}
      render={(renderProps) => (
        <a href="#" onClick={renderProps.onClick}>
          <i className="fab fa-google-plus-g"></i>
        </a>
      )}
      //   cookiePolicy={"single_host_origin"}
    />
  );
};
