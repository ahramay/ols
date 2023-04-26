import http from "../../services/http";
import storage from "../../services/storage";

import { handleErrors } from "../../helpers/error";
import { setToken, setUser, resetAuth } from "../auth/authReducer";
import { basePath } from "../../configs";

const path = "/auth";

export const signinUser = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const res = await http.post({ url: path + "/signin?admin=1", body });
      const { data: user } = res.data;
      const { headers } = res;

      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));

      storage.store("adminAuthToken", xAuthToken);
      storage.store("adminUser", user);
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const signoutUser = ({ body = {}, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.delete({
        url: path + "/signout",
        headers: {
          "x-auth-token": token,
        },
      });
      storage.remove("adminUser");
      storage.remove("adminAuthToken");
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
      window.location.href = basePath;
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

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

      const { data: user } = res.data;
      const { headers } = res;

      const xAuthToken = headers["x-auth-token"];

      dispatch(setToken(xAuthToken));
      dispatch(setUser(user));

      storage.store("adminAuthToken", xAuthToken);
      storage.store("adminUser", user);

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

export const createSession = ({ id, onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.post({
        url: path + "/create_user_session/" + id,
        headers: {
          "x-auth-token": token,
        },
      });
      const { data: user } = res.data;

      const xAuthToken = res.headers["x-auth-token"];
      setCookie("xAuthToken", xAuthToken, 365);
      storage.store("xAuthToken", xAuthToken);
      storage.store("user", user);

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
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
