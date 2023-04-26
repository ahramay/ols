import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import { setTestimonial, loadingTestimonials } from "../ui/testimonials";

const path = "/cms/testimonial_slider";

export const loadTestimonials = ({
  id = "",
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    dispatch(loadingTestimonials(true));
    try {
      //showing loader on ui
      const res = await http.get({ url: `${path}/course/${id}` });
      const { data } = res.data;

      dispatch(setTestimonial(data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingTestimonials(false));
    }
  };
};
