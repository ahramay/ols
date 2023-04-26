import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "../components/PhoneInput";
import TextError from "./TextError";
import Loader from "../components/Loader";

import { useDispatch } from "react-redux";
import { sendContactMail } from "../store/api/contact";

import { toast } from "react-toastify";
import ToastBody from "../components/ToastBody";

function ContactInfo(props) {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  return (
    <div className="position-relative">
      {showLoader && renderLoader()}
      <Formik
        initialValues={{
          name: "",
          profession: "",
          phoneNumber: "",
          email: "",
          message: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Enter your name"),
          profession: Yup.string().required("Enter your profession"),
          phoneNumber: Yup.string().required("Phone Number in invalid"),
          email: Yup.string()
            .email("Email is not valid.")
            .required("Enter your email"),
          message: Yup.string().required("Enter your message"),
        })}
        onSubmit={(values) => {
          setShowLoader(true);

          dispatch(
            sendContactMail({
              body: values,
              onSuccess: () => {
                toast.success(
                  <ToastBody
                    title="Message sent successfully"
                    message="We have received your message successfully."
                  />
                );
              },
              onEnd: () => {
                setShowLoader(false);
              },
            })
          );
        }}
      >
        {({ values, errors, setFieldValue }) => {
          console.log("Errors => ", errors);
          return (
            <Form>
              <div className="contact_form">
                <div className="container">
                  <h2>{props.heading}</h2>
                  <div className="form_contact">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <div className="covering">
                            <Field
                              type="text"
                              className="form-control"
                              placeholder="Your Name"
                              name="name"
                            />
                            <ErrorMessage name="name" component={TextError} />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <div className="covering">
                            <Field
                              type="text"
                              className="form-control"
                              placeholder="Profession"
                              name="profession"
                            />
                            <ErrorMessage
                              name="profession"
                              component={TextError}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="covering">
                          <PhoneInput
                            value={values.phoneNumber}
                            placeholder="Phone"
                            onChange={(phoneNumber) => {
                              setFieldValue("phoneNumber", phoneNumber);
                            }}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component={TextError}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
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
                      </div>
                      <div className="col-12">
                        <div className="form-group mb-3">
                          <div className="covering">
                            <textarea
                              className="form-control"
                              rows="7"
                              placeholder="Write Message"
                              onChange={(e) => {
                                setFieldValue("message", e.target.value);
                              }}
                            >
                              {values.message}
                            </textarea>
                            <ErrorMessage
                              name="message"
                              component={TextError}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn more"
                      value="Submit Comment"
                    />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default ContactInfo;
