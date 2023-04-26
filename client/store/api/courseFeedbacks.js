import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//http path
const path = "/course_feedbacks";

export const addCourseFeedback = ({
  id = "",
  body,
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      const res = await http.post({
        url: path + "/give_feedback/" + id,
        body,
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
