import React from "react";
import { toast } from "react-toastify";
import ToastBody from "../components/ToastBody";
import storage from "../services/storage";

export const handleErrors = (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;

  console.log(error);

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
    if (typeof window !== "undefined") window.location.href = "/";
    setCookie("xAuthToken", "", -1);
  } else if (error.response.status === 403) {
    toast.warn(
      <ToastBody title="Warning" message={error.response.data.message} />
    );
  } else if (error.response.status === 500) {
    toast.error(
      <ToastBody title="Error" message={error.response.data.message} />
    );
  } else {
    toast.error(<ToastBody title="Error" message={"Something went wrong."} />);
  }
  return;
};

function setCookie(cname, cvalue, exdays) {
  if (typeof window !== "undefined") {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}
