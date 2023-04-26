import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../shared/TextError";
import PhoneInput from "../PhoneInput";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader";
//redux actions
import { setTrialModalVisibility } from "../../store/ui/trialModal";
import { requestTrialApi } from "../../store/api/trialRequests";

function RegisterModal(props) {
  //accessing state from redux
  const trialModal = useSelector((state) => state.ui.trialModal);
  const commonData = useSelector((state) => state.ui.commonData);

  const dispatch = useDispatch();
  //loader
  const [showLoader, setShowLoader] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const closeModal = () => {
    dispatch(setTrialModalVisibility(false));
    setShowCompletion(false);
  };

  const onSubmit = (body) => {
    setShowLoader(true);

    dispatch(
      requestTrialApi({
        body,
        onSuccess: () => {
          setShowCompletion(true);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderTrialForm = () => {
    return (
      <Formik
        initialValues={{
          name: "",
          phoneNumber: "",
          email: "",
        }}
        onSubmit={onSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required."),
          phoneNumber: Yup.string().required("Phone number is required."),
          email: Yup.string()
            .required("Email is required.")
            .email("Enter a valid email.")
            .typeError("Email is required."),
        })}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className="d-flex">
                <div
                  className="form-group"
                  style={{ flexGrow: 1, height: "58px" }}
                >
                  <div className="covering">
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      name="name"
                    />
                    <ErrorMessage name="name" component={TextError} />
                  </div>
                </div>
              </div>

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

              <div className="d-flex">
                <div
                  className="form-group"
                  style={{ flexGrow: 1, height: "58px" }}
                >
                  <div className="covering">
                    <PhoneInput
                      value={values.phoneNumber}
                      placeholder="Phone"
                      onChange={(phoneNumber) => {
                        setFieldValue("phoneNumber", phoneNumber);
                      }}
                    />
                    <ErrorMessage name="phoneNumber" component={TextError} />
                  </div>
                </div>
              </div>

              <div className="form-group margin">
                <button type="submit" className="btn btn-default">
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  return (
    <Modal show={trialModal.visible} onHide={closeModal}>
      <section className=" login-container">
        <Row className="bg no-gutters">
          <Col md="6" className="img">
            <div
              className="w-100 h-100 img-fill"
              style={{
                backgroundImage: `url("${commonData.registerModalImage}")`,
              }}
            ></div>
          </Col>

          <Col md="6" className="align-self-center position-relative">
            <a
              onClick={closeModal}
              className="position-absolute"
              style={{ top: 10, right: 15 }}
            >
              <i className="fas fa-times"></i>
            </a>
            {showLoader && renderLoader()}

            <div className="popup-form-wrapper" style={{ minHeight: "400px" }}>
              {!showCompletion ? (
                <>
                  <h3 className="text-center">Request Your Free Trial Now</h3>
                  {renderTrialForm()}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "360px",
                  }}
                >
                  <h2 className="text-center">
                    Your request has been submitted.
                  </h2>
                  <p className="text-center">
                    Our support team will contact you soon.
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </section>
    </Modal>
  );
}

export default RegisterModal;
