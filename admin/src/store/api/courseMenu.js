import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/course_menu";

export const editMenuImage = ({
  key = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
    console.log("Image redux");
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const formData = new FormData();
      for (let objectItem in body)
        formData.append(objectItem, body[objectItem]);

      const res = await http.put({
        url: `${path}/${key}`,
        body: formData,
        headers: {
          "x-auth-token": token,
        },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

export const loadCourseMenu = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const res = await http.get({ url: path });
      const { data } = res.data;

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

export const editCourseMenu = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
    console.log("in course menu redux");
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

      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
