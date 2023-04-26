import React, { useState } from "react";

import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";

import LogoImage from "../assets/temp/logo.png";
import Loader from "../components/Loader";

import { useDispatch } from "react-redux";
import { verifyEmailAddress, resendVerificationEmail } from "../store/api/auth";
import { toast } from "react-toastify";
import ToastBody from "../components/ToastBody";

const VerifyEmail = (props) => {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);

  const submitHandler = (value) => {
    setShowLoader(true);
    dispatch(
      verifyEmailAddress({
        body: value,
        onSuccess: (res) => {
          toast.success(
            <ToastBody
              title="Email Verified"
              message="Your email address has been verified."
            />
          );
          props.history.replace("/");
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  const resendEmail = () => {
    alert("anc");
    setShowLoader(true);
    dispatch(
      resendVerificationEmail({
        onSuccess: () => {
          toast.success(
            <ToastBody
              title="Email Sent"
              message="We have sent you another verification email"
            />
          );
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
        initialValues={{ verificationCode: "" }}
        onSubmit={submitHandler}
        validationSchema={Yup.object({
          verificationCode: Yup.string()
            .min(6, "Verification Code must be 6 characters long")
            .max(6, "Verification Code must be 6 characters long")
            .required("Enter Verification Code"),
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
                    placeholder="Enter 6 Digit Verification Code"
                    name="verificationCode"
                  />
                  <ErrorMessage name="verificationCode" component={TextError} />
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
                Verify
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
            <h3 className="text-center mb-3">Verify Your Account</h3>
            {renderVerifyForm()}

            <p className="mt-3 mb-0 resend-text text-muted">
              We have sent you a verification code to your email address, Please
              check your junk/spam folder as well. If you haven't recieved any
              email click
              <a onClick={resendEmail}>
                <strong>Resend</strong>
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
