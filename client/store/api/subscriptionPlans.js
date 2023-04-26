import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import { setSubscriptionPlans } from "../entities/subscriptionPlans";

const path = "/subscription_plans";

export const loadSubscriptionPlans = ({
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
      dispatch(setSubscriptionPlans(data));
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
