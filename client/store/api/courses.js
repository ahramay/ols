import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//entities
import { loadingCourses, setCourses } from "../entities/courses";
import {
  loadingActivities,
  setActivities,
  updateActivity,
} from "../entities/activities";

import { setCoursePageLoader, setCoursePageData } from "../ui/coursePage";
//UI

//http path
const path = "/courses";

//courses_assigned_to_teacher
export const loadCourses = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      dispatch(loadingCourses(true));

      const res = await http.get({
        url: path + "/all_courses",
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setCourses(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingCourses(false));
    }
  };
};

export const loadLastActivities = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      dispatch(loadingActivities(true));

      const res = await http.get({
        url: path + "/my_course_activities",
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setActivities(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
      dispatch(loadingActivities(false));
    }
  };
};

export const saveActivity = ({ body, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      if (!auth.token) return;
      const res = await http.post({
        url: path + "/record_last_activity",
        body,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(updateActivity(res.data.data));

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      // else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};

//reviews
export const loadReviews = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.get({
        url: path + "/reviews/" + id,
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

export const loadMyCourses = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      const res = await http.get({
        url: path + "/my_courses",
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

export const loadFullCourse = ({ id = "", onSuccess, onError } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.courses;
      if (loading) return;

      dispatch(setCoursePageLoader(true));
      const res = await http.get({
        url: path + "/full_course_detail/" + id,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setCoursePageData(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setCoursePageLoader(false));
    }
  };
};

export const addCourseReview = ({
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
        url: path + "/add_review/" + id,
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

//
export const loadCoursesAssignedToTeacher = ({
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

      dispatch(loadingCourses(true));

      const res = await http.get({
        url: path + "/courses_assigned_to_teacher",
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setCourses(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingCourses(false));
    }
  };
};

export const deleteReview = ({ id = "", onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { auth } = store;

      const res = await http.delete({
        url: path + "/delete_review/" + id,
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

export const setFeedbackAsked = ({
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

      const res = await http.put({
        url: path + "/feedback_asked/" + id,
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
      // else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
