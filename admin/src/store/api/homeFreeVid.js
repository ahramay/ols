import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/home_page_free_sec";

export const getHomeJoin = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.get({ url: path });

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

export const editHomeJoin = ({ body = {}, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.put({
        url: path,
        body,
        headers: {
          "x-auth-token": token,
        },
      });

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
