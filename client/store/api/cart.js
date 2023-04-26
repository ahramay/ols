import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//entities
import {
  setCart,
  addCartItem,
  removeCartItem,
  resetCart,
} from "../entities/cart";
//UI

//http path
const path = "/cart";

export const addItemToCartApi = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.post({
        url: path + "/add_item",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(addCartItem(res.data.data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Err => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const addBundleToCartApi = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.post({
        url: path + "/add_subscription_bundle",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(addCartItem(res.data.data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Err => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const getMyCart = ({
  couponCode = "",
  removeCoupon = "0",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": auth.token,
        },
        queryParams: {
          couponCode,
          removeCoupon,
        },
      });

      dispatch(setCart(res.data.data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const deleteCartItem = ({ id = "", onSuccess, onError } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.delete({
        url: path + "/" + id,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(removeCartItem(res.data.data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("CART Err =>", err);
      //onError event firing
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
    }
  };
};

export const checkoutCashCollection = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.post({
        url: path + "/checkout/cash_collection",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      //onSuccess event firing
      dispatch(resetCart());
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Err => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const checkoutPayPro = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.post({
        url: path + "/checkout/pay_pro",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      //onSuccess event firing
      dispatch(resetCart());
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Err => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const createBankAlfalahSession = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.post({
        url: path + "/create_bank_alfalah_session",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Err => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
