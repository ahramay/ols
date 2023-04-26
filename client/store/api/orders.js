import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/orders";

export const getMyOrders = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path + "/my_orders",
        headers: {
          "x-auth-token": token,
        },
      });

      //onSuccess event firing
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

export const getMyOrder = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path + "/" + id,
        headers: {
          "x-auth-token": token,
        },
      });

      //onSuccess event firing
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

export const addPaymentRecipt = ({
  id = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.put({
        url: path + "/add_payment_recipt/" + id,
        body,
        headers: {
          "x-auth-token": token,
        },
      });

      //onSuccess event firing
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
