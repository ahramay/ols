import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import { setLink } from "../cms/links";
const path = "/cms/generic_pages";

export const getPages = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": token,
        },
      });
      const selectList = res.data.data.map((p) => {
        return { label: p.title, value: "/page/" + p.slug };
      });
      dispatch(
        setLink([
          { label: "Home", value: "/" },
          { label: "About Us", value: "/about-us" },
          { label: "Contact Us", value: "/contact-us" },
          { label: "How To Pay", value: "/how-to-pay" },
          { label: "Events & Webinars", value: "/events" },
          { label: "Why Outclass", value: "/why-out-class" },
          { label: "Our Teachers", value: "/our-teachers" },
          { label: "FAQ's", value: "/faqs" },
          { label: "All Courses", value: "/all-courses" },
          { label: "Blogs", value: "/blogs" },
          { label: "Login", value: "/login" },
          { label: "Free Videos", value: "/free-videos" },
          { label: "Subscription", value: "/subscription" },
          { label: "Register", value: "/register" },
          ...selectList,
        ])
      );
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

export const getPage = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      if (!id) throw new Error("Id is required");

      const res = await http.get({
        url: path + `/${id}`,
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

export const createDPage = ({ body = {}, onSuccess, onError, onEnd } = {}) => {
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

export const editPage = ({
  id = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
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
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const deletePage = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      if (!id) throw new Error("Id is required");
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.delete({
        url: path + `/${id}`,

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
