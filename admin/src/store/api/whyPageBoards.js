import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import {
  setWhyPageBoard,
  loadingWhyPageBoards,
  deleteWhyPageBoard,
} from "../../store/cms/whyPageBoards";

const path = "/cms/why_out_class_list";

export const loadWhyPageBoards = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingWhyPageBoards(true));
    try {
      //showing loader on ui
      const res = await http.get({ url: path });
      const { data } = res.data;

      dispatch(setWhyPageBoard(data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingWhyPageBoards(false));
    }
  };
};

export const getWhyPageBoard = ({
  id = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingWhyPageBoards(true));
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
      dispatch(loadingWhyPageBoards(false));
    }
  };
};

export const createWhyPageBoard = ({
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

      const { data } = res.data;
      console.log("NAVBAR", data);
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

export const editWhyPageBoard = ({
  id = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingWhyPageBoards(true));
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
      dispatch(loadingWhyPageBoards(false));
    }
  };
};

export const rearrangeWhyPageBoard = ({
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
      dispatch(loadingWhyPageBoards(true));
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
      dispatch(loadingWhyPageBoards(false));
    }
  };
};

export const removeWhyPageBoard = ({
  id = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingWhyPageBoards(true));
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
      dispatch(deleteWhyPageBoard(id));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingWhyPageBoards(false));
    }
  };
};
