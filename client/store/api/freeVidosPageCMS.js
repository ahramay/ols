import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import {
  setFreeVideosPageLoader,
  setFreeVideosPageData,
} from "../ui/freeVideosPage";

const path = "/cms/free_videos_cms_data";

export const loadFreeVideosPageCMS = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(setFreeVideosPageLoader(true));
      const res = await http.get({ url: path });
      const { data } = res.data;
      dispatch(setFreeVideosPageData(data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setFreeVideosPageLoader(false));
      if (onEnd) onEnd();
    }
  };
};
