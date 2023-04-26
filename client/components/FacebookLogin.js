import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

export default (props) => {
  const { onFBResponse = () => {} } = props;

  return (
    <FacebookLogin
      appId="404150057463766"
      fields="name,email,picture"
      callback={onFBResponse}
      render={(renderProps) => (
        <a onClick={renderProps.onClick}>
          <i className="fab fa-facebook-f"></i>
        </a>
      )}
    />
  );
};

// appId="806610436211447"
//         autoLoad={true}
//         fields="name,email,picture"
//         onClick={componentClicked}
//         callback={responseFacebook}
