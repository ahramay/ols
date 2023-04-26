import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//http path
const path = "/forums";

export const createForumThread = ({
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
        url: path + "/create_thread",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

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

export const getForumThread = ({
  threadId = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path + "/get_thread/" + threadId,
        headers: {
          "x-auth-token": auth.token,
        },
      });

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
//
export const getForumThreads = ({
  courseId = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path + "/get_threads/" + courseId,
        headers: {
          "x-auth-token": auth.token,
        },
      });

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

export const getForumMessages = ({
  threadId = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path + "/thread_messages/" + threadId,
        headers: {
          "x-auth-token": auth.token,
        },
      });

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

export const answerForumThread = ({
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
        url: path + "/answer_thread",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

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

export const deleteForumThread = ({
  id = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.delete({
        url: path + "/delete_thread/" + id,
        headers: {
          "x-auth-token": auth.token,
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

export const deleteForumMessage = ({
  id = "",
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.delete({
        url: path + "/delete_message/" + id,
        headers: {
          "x-auth-token": auth.token,
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
