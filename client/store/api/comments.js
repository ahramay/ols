import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/comments";

export const commentBlog = ({ body, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.post({
        url: path + "/comment",
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

export const replyComment = ({ body, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.post({
        url: path + "/reply_comment",
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

export const loadComments = ({
  content = "",
  queryParams = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.get({
        url: path + "/comments/" + content,
        headers: { "x-auth-token": token },
        queryParams,
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

//delete_comment
export const deleteComment = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;
      const res = await http.delete({
        url: path + "/delete_comment/" + id,
        headers: { "x-auth-token": token },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
