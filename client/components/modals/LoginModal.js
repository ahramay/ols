import React, { useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoginImage from "../../assets/temp/login.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../shared/TextError";
import Loader from "../Loader";
import { Link, useHistory } from "react-router-dom";

import FacebookLogin from "../FacebookLogin";
import GoogleLogin from "../GoogleLogin";

import storage from "../../services/storage";
//redux actions
import loginModal, {
  setLoginModalVisibility,
  setLoginModalClosable,
} from "../../store/ui/loginModal";
import { setRegisterModalVisibility } from "../../store/ui/registerModal";
import {
  signinUser,
  requestPasswordReset,
  signinWithGoogle,
  signinWithFacebook,
} from "../../store/api/auth";

//global data for module
const loginSchema = Yup.object({
  email: Yup.string().email("Email is not valid.").required("Enter your email"),
  password: Yup.string()
    .required("Enter your password.")
    .min(5, "Password is too short - should be 5 chars minimum"),
});

const forgotSchema = Yup.object({
  email: Yup.string().email("Email is not valid.").required("Enter your email"),
});

const loginFormInitialValues = {
  email: "",
  password: "",
};

const forgotFormInitialValues = {
  email: "",
};

let verifyLink, resetLink, profileSettings;

function LoginModal(props) {
  //accesing redux state

  const logniModal = useSelector((state) => state.ui.loginModal);
  const commonData = useSelector((state) => state.ui.commonData);
  const dispatch = useDispatch();

  const history = useHistory();
  //loader
  const [showLoader, setShowLoader] = useState(false);
  //Alert Message
  const [errorMessage, setErrorMessage] = useState({
    type: "success",
    message: "",
  });

  //form values
  const [formType, setFormType] = useState("login");

  const closeModal = (force = false) => {
    if (!logniModal.closable && !force) return;
    dispatch(setLoginModalVisibility(false));
    dispatch(setLoginModalClosable(true));
    setErrorMessage({ type: "danger", message: "" });
    setFormType("login");
    storage.remove("GO_TO_SUBSCRIPTION");
  };

  const showRegisterModal = () => {
    dispatch(setRegisterModalVisibility(true));
  };

  //login from submit handler.
  const onSubmitHandler = (values, onSubmitProps) => {
    setErrorMessage({ type: "danger", message: "" });
    setShowLoader(true);
    dispatch(
      signinUser({
        body: values,
        onSuccess: (res) => {
          const { emailVerified } = res.data.data;
          // if (!emailVerified) {
          //   if (verifyLink) {
          //     return verifyLink.click();
          //   }
          // }
          navigateToSubscription();
          closeModal(true);
          setErrorMessage({ type: "danger", message: "" });
        },
        onError: (err) => {
          if (err.response && err.response.data && err.response.data.message) {
            setErrorMessage({
              type: "danger",
              message: err.response.data.message,
            });
          }
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  const onPasswordReset = (values) => {
    setShowLoader(true);
    dispatch(
      requestPasswordReset({
        body: values,
        onSuccess: (res) => {
          storage.store("password_reset_email", values.email);
          closeModal(true);
          if (resetLink) resetLink.click();
        },
        onError: (err) => {
          if (err.response && err.response.data && err.response.data.message) {
            setErrorMessage({
              type: "danger",
              message: err.response.data.message,
            });
          }
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };
  //signin with facebook handler
  const signinWithFacebookHandler = (facebookRes) => {
    setShowLoader(true);
    const { accessToken, userID } = facebookRes;

    dispatch(
      signinWithFacebook({
        body: { accessToken, userID },
        onSuccess: (res) => {
          closeModal(true);
          setErrorMessage({ type: "danger", message: "" });
          const user = res.data.data;
          if (!user.phoneNumber) {
            if (profileSettings) return profileSettings.click();
          }
          navigateToSubscription();
        },
        onError: (err) => {
          console.error(err.response.data.message);
          if (err.response && err.response.data && err.response.data.message) {
            setErrorMessage(err.response.data.message);
          }
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  //signinWithGoogle
  const signinWithGoogleHandler = (googleRes) => {
    setShowLoader(true);
    const { accessToken, googleId } = googleRes;
    dispatch(
      signinWithGoogle({
        body: { accessToken, googleId },
        onSuccess: (res) => {
          closeModal(true);
          setErrorMessage({ type: "danger", message: "" });
          const user = res.data.data;

          if (!user.phoneNumber) {
            if (profileSettings) return profileSettings.click();
          }
          navigateToSubscription();
        },
        onError: (err) => {
          console.error(err.response.data.message);
          if (err.response && err.response.data && err.response.data.message) {
            setErrorMessage(err.response.data.message);
          }
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  const navigateToSubscription = () => {
    const goToSubscription = storage.get("GO_TO_SUBSCRIPTION");
    if (goToSubscription) {
      storage.remove("GO_TO_SUBSCRIPTION");
      history.push("/subscription/" + goToSubscription.category);
    }
  };
  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };
  //Login Form
  const renderLoginForm = () => {
    return (
      <Formik
        initialValues={loginFormInitialValues}
        onSubmit={onSubmitHandler}
        validationSchema={loginSchema}
      >
        <Form>
          <div className="form-group ">
            <div className="covering">
              <Field
                type="text"
                className="form-control"
                placeholder="Email"
                name="email"
              />
              <ErrorMessage name="email" component={TextError} />
            </div>
            <div className="covering">
              <Field
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
              />
              <ErrorMessage name="password" component={TextError} />
            </div>
          </div>

          {/* <div className="form-group">
            <label className="round">
              {" "}
              Keep me signed in
              <input type="checkbox" checked="checked" />
              <span className="checkmark"></span>
            </label>
          </div> */}
          <button type="submit" className="btn btn-default">
            Login
          </button>
        </Form>
      </Formik>
    );
  };

  const renderForgotPassForm = () => {
    return (
      <Formik
        initialValues={forgotFormInitialValues}
        validationSchema={forgotSchema}
        onSubmit={onPasswordReset}
      >
        <Form>
          <div className="form-group">
            <div className="covering">
              <Field
                type="text"
                className="form-control"
                placeholder="Email"
                name="email"
              />
              <ErrorMessage name="email" component={TextError} />
            </div>
          </div>

          <button type="submit" className="btn btn-default">
            Next
          </button>
        </Form>
      </Formik>
    );
  };

  return (
    <Modal show={logniModal.visible} onHide={closeModal}>
      <Link
        to="/verify-email"
        className="d-none"
        ref={(ref) => (verifyLink = ref)}
      ></Link>
      <Link
        to="/reset-password"
        className="d-none"
        ref={(ref) => (resetLink = ref)}
      ></Link>
      <Link
        to="/dashboard"
        className="d-none"
        ref={(ref) => (profileSettings = ref)}
      ></Link>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <section className="login-container">
        <Row className="bg no-gutters">
          <Col md="6" className="img">
            <div
              className="w-100 h-100 img-fill"
              style={{
                backgroundImage: `url("${commonData.loginModalImage}")`,
              }}
            ></div>
          </Col>
          <Col md="6" className="align-self-center position-relative ">
            {logniModal.closable && (
              <a
                onClick={closeModal}
                className="position-absolute"
                style={{ top: 10, right: 15 }}
              >
                <i className="fas fa-times"></i>
              </a>
            )}

            {showLoader && renderLoader()}
            <div className="popup-form-wrapper">
              {errorMessage.message && (
                <div className={`alert alert-${errorMessage.type}`}>
                  {errorMessage.message}
                </div>
              )}
              {formType === "login" && renderLoginForm()}
              {formType === "forgot" && (
                <>
                  <h3 className="text-center pb-3">Reset Password</h3>
                  {renderForgotPassForm()}
                  <p className="text-muted resend-text py-3">
                    We'll send you a 6 - Digit code to your email address, which
                    you can use to reset your password.
                  </p>
                </>
              )}
              <div className="register-link">
                {formType === "login" && (
                  <>
                    <a
                      onClick={() => {
                        setErrorMessage({ type: "danger", message: "" });
                        setFormType("forgot");
                      }}
                    >
                      Forgot Password or Username?
                    </a>
                    <span className="or my-3">or</span>
                    <div className="row  mb-4 social-login-wrapper">
                      <div className="col-6 col-md-6 col-lg-6">
                        <FacebookLogin
                          onFBResponse={signinWithFacebookHandler}
                        />
                      </div>
                      <div className="col-6 col-md-6 col-lg-6">
                        <GoogleLogin
                          onGoogleResponse={signinWithGoogleHandler}
                        />
                      </div>
                    </div>
                  </>
                )}
                <span>Not Registered ?</span>
                <a
                  className="bold"
                  onClick={() => {
                    showRegisterModal();
                    closeModal(true);
                  }}
                >
                  Join for Free
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </Modal>
  );
}

export default LoginModal;
