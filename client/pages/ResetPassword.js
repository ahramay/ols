import React, { useState, useEffect } from "react";

import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";

import LogoImage from "../assets/temp/logo.png";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import ToastBody from "../components/ToastBody";
import storage from "../services/storage";
import { handleErrors } from "../helpers/error";
import { useDispatch } from "react-redux";
import { setLoginModalVisibility } from "../store/ui/loginModal";
import {
  checkPasswordResetCode,
  resetMyPassword,
  resendPasswordResetEmail,
} from "../store/api/auth";

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [passResetCode, sePassResetCode] = useState("");

  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    const email = storage.get("password_reset_email");
    if (!email) this.props.history.replace("/");

    setResetEmail(email);
  }, []);

  const verifySubmitHandler = (value) => {
    setShowLoader(true);
    sePassResetCode(value.resetCode);
    const body = {
      email: resetEmail,
      resetCode: value.resetCode,
    };
    dispatch(
      checkPasswordResetCode({
        body,
        onSuccess: () => {
          setCodeVerified(true);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };
  const resendResetEmail = () => {
    setShowLoader(true);
    dispatch(
      resendPasswordResetEmail({
        body: {
          email: resetEmail,
        },
        onSuccess: () => {
          toast.success(
            <ToastBody
              title="Email Sent"
              message="We have sent you another password reset email"
            />
          );
        },
        onError: (err) => {
          console.log("Error  skfjsdfhsdjhf", err);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };
  const renderVerifyForm = () => {
    return (
      <Formik
        initialValues={{ resetCode: "" }}
        onSubmit={verifySubmitHandler}
        validationSchema={Yup.object({
          resetCode: Yup.string()
            .min(6, "Reset Code must be 6 characters long")
            .max(6, "Reset Code must be 6 characters long")
            .required("Enter Reset Code"),
        })}
      >
        {({}) => {
          return (
            <Form>
              <div className="form-group">
                <div className="covering">
                  <Field
                    type="text"
                    className="form-control border"
                    placeholder="Enter 6 Digit Reset Code"
                    name="resetCode"
                  />
                  <ErrorMessage name="resetCode" component={TextError} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block "
                style={{
                  backgroundColor: "#00acf0",
                  borderColor: "#00acf0",
                  padding: "10px 10px",
                }}
              >
                Next
              </button>
            </Form>
          );
        }}
      </Formik>
    );
  };

  const resetPasswordHandler = (values) => {
    setShowLoader(true);
    const body = {
      email: resetEmail,
      verificationCode: passResetCode,
      ...values,
    };

    dispatch(
      resetMyPassword({
        body,
        onSuccess: (res) => {
          toast.success(
            <ToastBody
              title="Password Changed"
              message="your password has been changed."
            />
          );
          props.history.replace("/");
          dispatch(setLoginModalVisibility(true));
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };
  const renderResetForm = () => {
    return (
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        onSubmit={resetPasswordHandler}
        validationSchema={Yup.object({
          password: Yup.string()
            .required("Enter a password*")
            .min(6, "minimum 6 chars*"),
          confirmPassword: Yup.string()
            .required("Required*")
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
        })}
      >
        {({}) => {
          return (
            <Form>
              <div className="form-group">
                <div className="covering">
                  <Field
                    type="password"
                    className="form-control border"
                    placeholder="New Password"
                    name="password"
                  />
                  <ErrorMessage name="password" component={TextError} />
                </div>
              </div>

              <div className="form-group">
                <div className="covering">
                  <Field
                    type="password"
                    className="form-control border"
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                  />
                  <ErrorMessage name="confirmPassword" component={TextError} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block "
                style={{
                  backgroundColor: "#00acf0",
                  borderColor: "#00acf0",
                  padding: "10px 10px",
                }}
              >
                Reset
              </button>
            </Form>
          );
        }}
      </Formik>
    );
  };

  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };
  return (
    <div style={{ marginTop: "10px", paddingTop: "228px" }}>
      <div className="container">
        <div className="py-5 verify-email-form-wrapper">
          <Card className="verify-email-form shadow p-4 position-relative">
            {showLoader && renderLoader()}
            <h3 className="text-center mb-3">Reset Password</h3>
            {!codeVerified && renderVerifyForm()}
            {codeVerified && renderResetForm()}
            {!codeVerified && (
              <p className="mt-3 mb-0 resend-text text-muted">
                We have sent you a password reset code to your email address,
                Please check your junk/spam folder as well. If you haven't
                recieved any email click{" "}
                <a onClick={resendResetEmail} style={{ cursor: "pointer" }}>
                  <strong>Resend</strong>
                </a>
                .
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
