import React from "react";
import { toast } from "react-toastify";
import ToastBody from "../components/Popups/ToastBody";
import storage from "../services/storage";
import { basePath } from "../configs";
export const handleErrors = (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;

  if (typeof error === "string") {
    return toast.error(<ToastBody title="Error" message={error} />);
  }
  if (!expectedError) {
    toast.error(
      <ToastBody title="Error" message="An unexpected error occurrred." />
    );
  } else if (error.response.status === 400) {
    toast.error(
      <ToastBody title="Error" message={error.response.data.message} />
    );
  } else if (error.response.status === 401) {
    toast.warn(
      <ToastBody title="Warning" message={error.response.data.message} />
    );
    storage.remove("xAuthToken");
    storage.remove("user");
    window.location.href = basePath + "/signin";
  } else if (error.response.status === 403) {
    toast.warn(
      <ToastBody title="Warning" message={error.response.data.message} />
    );
    storage.remove("xAuthToken");
    storage.remove("user");
    window.location.href = basePath + "/signin";
  } else if (error.response.status === 500) {
    toast.error(
      <ToastBody title="Error" message={error.response.data.message} />
    );
  } else {
    toast.error(<ToastBody title="Error" message={"Something went wrong."} />);
  }
  return;
};
