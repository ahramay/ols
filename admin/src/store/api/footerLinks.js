import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import {
  setFooterLinks,
  loadingFooterLinks,
  deleteFooterLink,
} from "../../store/cms/footerLinks";

const path = "/cms/footer_links";

export const loadFooterLinks = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingFooterLinks(true));
    try {
      //showing loader on ui
      const res = await http.get({ url: path });
      const { data } = res.data;

      dispatch(setFooterLinks(data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingFooterLinks(false));
    }
  };
};

export const getFooterLink = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingFooterLinks(true));
    try {
      //showing loader on ui
      if (!id) throw new Error("Id is required");
      const res = await http.get({ url: path + `/${id}` });

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingFooterLinks(false));
    }
  };
};

export const createFooterLink = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    const storeState = getState();
    const { token } = storeState.auth;
    try {
      //showing loader on ui
      const res = await http.post({
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
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const editFooterLink = ({
  id = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingFooterLinks(true));
    try {
      //showing loader on ui
      if (!id) throw new Error("Id is required");
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.put({
        url: path + `/${id}`,
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
      dispatch(loadingFooterLinks(false));
    }
  };
};

export const rearrangeFooterLinks = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    const storeState = getState();
    const { token } = storeState.auth;
    try {
      //showing loader on ui
      dispatch(loadingFooterLinks(true));
      const res = await http.put({
        url: path + "/rearrange",
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
      dispatch(loadingFooterLinks(false));
    }
  };
};

export const removeFooterLink = ({
  id = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingFooterLinks(true));
    const storeState = getState();
    const { token } = storeState.auth;
    try {
      //showing loader on ui
      if (!id) throw new Error("Id is required");
      const res = await http.delete({
        url: path + `/${id}`,
        headers: {
          "x-auth-token": token,
        },
      });
      dispatch(deleteFooterLink(id));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingFooterLinks(false));
    }
  };
};
