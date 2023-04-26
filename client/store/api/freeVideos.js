import http from "../../services/http";
import { setFreeVideos } from "../../store/entities/freeVideos";
import { handleErrors } from "../../helpers/error";
const path = "/cms/free_videos";

export const getAllFreeVideos = ({ onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path + "/all_free_videos",
        headers: {
          "x-auth-token": token,
        },
      });

      dispatch(setFreeVideos(res.data.data));
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
