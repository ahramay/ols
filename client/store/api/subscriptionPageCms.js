import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import {
  setSubscriptionData,
  setSubscriptionLoader,
} from "../ui/subscriptionPage";

const path = "/cms/subscription_page_cms";

export const getFreeVideosImageSec = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSubscriptionLoader(true));
      const res = await http.get({ url: path });
      dispatch(setSubscriptionData(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(setSubscriptionLoader(false));
    }
  };
};
