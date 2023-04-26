import http from "../../services/http";
import storage from "../../services/storage";

import { handleErrors } from "../../helpers/error";

import { setToken, setUser, resetAuth } from "../auth/authReducer";

const path = "/auth";

export const getMe = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path + "/me",
        headers: {
          "x-auth-token": auth.token,
        },
      });

      const {
        data: { data: user },
      } = res;

      dispatch(setUser(user));
      storage.store("user", user);

      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signinUser = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch) => {
    try {
      //showing loader on ui
      const res = await http.post({ url: path + "/signin", body });

      const {
        data: { data: user },
        headers,
      } = res;
      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));
      setCookie("xAuthToken", xAuthToken, 365);
      storage.store("xAuthToken", xAuthToken);
      storage.store("user", user);
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signupUser = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch) => {
    try {
      const res = await http.post({ url: path + "/signup", body });

      const {
        data: { data: user },
        headers,
      } = res;
      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));
      setCookie("xAuthToken", xAuthToken, 365);
      storage.store("xAuthToken", xAuthToken);
      storage.store("user", user);
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const resendVerificationEmail = ({ onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const { token } = getState().auth;

      const res = await http.post({
        url: path + "/resend_verification_email",
        headers: {
          "x-auth-token": token,
        },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const resendPasswordResetEmail = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const { token } = getState().auth;

      const res = await http.post({
        url: path + "/resend_password_reset_email",
        body,
        headers: {
          "x-auth-token": token,
        },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signinWithFacebook = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
}) => {
  return async (dispatch) => {
    try {
      //showing loader on ui
      const res = await http.post({
        url: path + "/signin_with_facebook",
        body,
      });

      const {
        data: { data: user },
        headers,
      } = res;
      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));

      storage.store("xAuthToken", xAuthToken);
      storage.store("user", user);
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signinWithGoogle = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch) => {
    try {
      //showing loader on ui
      const res = await http.post({
        url: path + "/signin_with_google",
        body,
      });

      const {
        data: { data: user },
        headers,
      } = res;

      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));

      storage.store("xAuthToken", xAuthToken);
      storage.store("user", user);
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signoutUser = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth;

      const res = await http.delete({
        url: path + "/signout",
        headers: {
          "x-auth-token": token,
        },
      });

      storage.remove("user");
      storage.remove("xAuthToken");
      setCookie("xAuthToken", "", -1);
      dispatch(resetAuth());

      if (typeof window !== "undefined") window.location.href = "/";
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const verifyEmailAddress = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const { token } = getState().auth;

      const res = await http.put({
        url: path + "/verify_email",
        body,
        headers: {
          "x-auth-token": token,
        },
      });

      // const xAuthToken = headers["x-auth-token"];

      // dispatch(setToken(xAuthToken));
      // dispatch(setUser(user));
      // setCookie("xAuthToken", xAuthToken, 365);
      // storage.store("xAuthToken", xAuthToken);
      // storage.store("user", user);
      // //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const requestPasswordReset = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
}) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.post({
        url: path + "/request_password_reset",
        body,
      });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const checkPasswordResetCode = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
}) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.post({
        url: path + "/password_reset_code_verification",
        body,
      });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("err", err);
      //onError event firing
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
//reset_password
export const resetMyPassword = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.put({
        url: path + "/reset_password",
        body,
      });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const updateProfile = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.put({
        url: path + "/update_profile",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      const {
        data: { data: user },
      } = res;
      dispatch(setUser(user));
      storage.store("user", user);

      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  if (typeof window !== "undefined")
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
