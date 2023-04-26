import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";
import Loader from "../components/Loader";
import PhoneInput from "../components/PhoneInput";
import DatePicker from "react-datepicker";

import moment from "moment";
import loadable from "@loadable/component";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/api/auth";
const RichTextEditor = loadable(() => import("../components/RichTextEditor"), {
  ssr: false,
});
//validation schema
const validationSchema = Yup.object({
  firstName: Yup.string().required("Required*"),
  lastName: Yup.string().required("Required*"),
  dateOfBirth: Yup.string().required("Required*"),
  school: Yup.string().required("Required*"),
  phoneNumber: Yup.string()
    .min(13, "Phone Number in invalid*")
    .max(13, "Phone Number in invalid*")
    .required("Phone Number in invalid*"),
  email: Yup.string()
    .required("Required*")
    .email("Enter a valid Email*")
    .typeError("A number is required"),
  password: Yup.string()
    .optional("Enter a password*")
    .min(6, "minimum 6 chars*"),
  confirmPassword: Yup.string()
    .optional("Required*")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),

  //teacher
  introduction: Yup.string().optional("Introduction"),
  facebookLink: Yup.string().optional("facebookLink"),
  twitterLink: Yup.string().optional("twitterLink"),
  linkedInLink: Yup.string().optional("linkedInLink"),
  googleLink: Yup.string().optional("googleLink"),
  youtubeLink: Yup.string().optional("youtubeLink"),
});

const ProfileSettings = (props) => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);

  const [imageSource, setImageSource] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "", //moment().format("DD/MM/YYYY"),
    phoneNumber: "",
    school: "",
    email: "",
    password: "",
    confirmPassword: "",

    introduction: "",
    facebookLink: "",
    twitterLink: "",
    linkedInLink: "",
    googleLink: "",
    youtubeLink: "",
  });
  const [userRole, setUserRole] = useState("STUDENT");
  useEffect(() => {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "", //moment().format("DD/MM/YYYY"),
      phoneNumber = "",
      image = "",
      school = "",
      email = "",
      password = "",
      confirmPassword = "",

      introduction = "",
      facebookLink = "",
      twitterLink = "",
      linkedInLink = "",
      googleLink = "",
      youtubeLink = "",
    } = user;
    const data = {
      firstName,
      lastName,
      dateOfBirth, //moment().format("DD/MM/YYYY"),
      phoneNumber,
      school,
      email,
      password,
      confirmPassword,

      introduction,
      facebookLink,
      twitterLink,
      linkedInLink,
      googleLink,
      youtubeLink,
    };
    data.dateOfBirth = user.dateOfBirth
      ? moment(user.dateOfBirth).format("DD/MM/YYYY")
      : new Date();

    setUserRole(user.role || "STUDENT");
    setInitialValues(data);
    setImagePreview(image);
  }, [user]);

  const onFormSubmit = (body) => {
    if (imageSource) body.image = imageSource;

    const formData = new FormData();
    for (let key in body) formData.append(key, body[key]);
    dispatch(
      updateProfile({
        body: formData,
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

  const renderForm = () => {
    return (
      <div className="checkout-form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onFormSubmit}
        >
          {({ values, setFieldValue, submitForm, errors, touched }) => {
            return (
              <Form>
                <div className="pb-3">
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "100px",
                      backgroundColor: "#ccc",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundImage: `url("${imagePreview}")`,
                    }}
                  ></div>
                  <label>
                    <span className="btn btn-success mt-2">Change Image</span>
                    <input
                      type="file"
                      multiple={false}
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageSource(file);
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onloadend = function () {
                            const imagePreview = reader.result;
                            setImagePreview(imagePreview);
                          };
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="d-flex">
                  <div
                    className="form-group"
                    style={{ flexGrow: 1, height: "58px" }}
                  >
                    <div className="covering">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                      />
                      <ErrorMessage name="firstName" component={TextError} />
                    </div>
                  </div>
                  <div
                    className="form-group ml-1"
                    style={{ flexGrow: 1, height: "58px" }}
                  >
                    <div className="covering">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        name="lastName"
                      />

                      <ErrorMessage name="lastName" component={TextError} />
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
                      {errors.phoneNumber && touched.phoneNumber && (
                        <TextError>{errors.phoneNumber}</TextError>
                      )}
                    </div>
                  </div>
                  <div
                    className="form-group ml-1"
                    style={{ flexGrow: 1, height: "58px" }}
                  >
                    <div className="covering">
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Date Of Birth"
                        selected={
                          values.dateOfBirth
                            ? moment(values.dateOfBirth, "DD/MM/YYYY").toDate()
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue(
                            "dateOfBirth",
                            moment(date || new Date()).format("DD/MM/YYYY")
                          );
                        }}
                        wrapperClassName="w-100"
                        customInput={<Field className="form-control w-100" />}
                      />

                      <ErrorMessage name="dateOfBirth" component={TextError} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="covering">
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="School"
                      name="school"
                    />
                    <ErrorMessage name="school" component={TextError} />
                  </div>
                </div>

                <div className="d-flex">
                  <div
                    className="form-group"
                    style={{ flexGrow: 1, height: "58px" }}
                  >
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
                  <div
                    className="form-group ml-1"
                    style={{ flexGrow: 1, height: "58px" }}
                  >
                    <div className="covering">
                      <Field
                        type="password"
                        className="form-control"
                        placeholder="Confirm password"
                        name="confirmPassword"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component={TextError}
                      />
                    </div>
                  </div>
                </div>

                {userRole === "TEACHER" && (
                  <div>
                    <RichTextEditor
                      value={values.introduction}
                      onChange={(introduction) => {
                        setFieldValue("introduction", introduction);
                      }}
                    />

                    <h3 className="mt-3 ">Social Links</h3>
                    <div
                      className="form-group"
                      style={{ flexGrow: 1, height: "58px" }}
                    >
                      <div className="covering">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Facebook Link"
                          name="facebookLink"
                        />
                        <ErrorMessage
                          name="facebookLink"
                          component={TextError}
                        />
                      </div>
                    </div>
                    <div
                      className="form-group"
                      style={{ flexGrow: 1, height: "58px" }}
                    >
                      <div className="covering">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Twitter Link"
                          name="twitterLink"
                        />
                        <ErrorMessage
                          name="twitterLink"
                          component={TextError}
                        />
                      </div>
                    </div>
                    <div
                      className="form-group"
                      style={{ flexGrow: 1, height: "58px" }}
                    >
                      <div className="covering">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="LinkedIn Link"
                          name="linkedInLink"
                        />
                        <ErrorMessage
                          name="linkedInLink"
                          component={TextError}
                        />
                      </div>
                    </div>
                    <div
                      className="form-group"
                      style={{ flexGrow: 1, height: "58px" }}
                    >
                      <div className="covering">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Google Link"
                          name="googleLink"
                        />
                        <ErrorMessage name="googleLink" component={TextError} />
                      </div>
                    </div>
                    <div
                      className="form-group"
                      style={{ flexGrow: 1, height: "58px" }}
                    >
                      <div className="covering">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Youtube Link"
                          name="youtubeLink"
                        />
                        <ErrorMessage
                          name="youtubeLink"
                          component={TextError}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    oClick={submitForm}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  };
  return (
    <div style={{}}>
      <div className="container">
        <Card
          className="shadow my-3 p-4 position-relative"
          style={{
            background: "rgba(0,0,0,0.03)",
            maxWidth: "700px",
            margin: "auto",
          }}
        >
          {showLoader && renderLoader()}
          {renderForm()}
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
