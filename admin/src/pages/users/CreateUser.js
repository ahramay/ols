import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Label,
  Button,
} from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { createUser } from "../../store/api/users";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import PhoneInput from "../../components/Inputs/PhoneInput";

const schema = {
  firstName: Joi.string().min(1).required().lowercase(),
  lastName: Joi.string().min(1).required().lowercase(),
  phoneNumber: Joi.string().min(13).max(13).required().lowercase(),
  email: Joi.string().min(1).required().email().lowercase(),
  dateOfBirth: Joi.string().min(1).required().lowercase(),
  school: Joi.string().min(1).required().lowercase(),
  password: Joi.string().min(5).optional().allow(""),
  confirmPassword: Joi.string().optional().valid(Joi.ref("password")),
  role: Joi.string()
    .valid("TEACHER", "ADMIN", "STUDENT", "TEACHER_ASSISTANT")
    .required(),
  category: Joi.string()
    .valid("OLevel", "Inter", "STUDENT", "TEACHER_ASSISTANT")
    .required(),
};

const userRoles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Teacher Assistant", value: "TEACHER_ASSISTANT" },
  { label: "Student", value: "STUDENT" },
];
const userCategories = [
  { label: "OLevel", value: "OLevel" },
  { label: "Inter", value: "Inter" },
  { label: "Teacher Assistant", value: "TEACHER_ASSISTANT" },
  { label: "Student", value: "STUDENT" },
];
class CreateUser extends Component {
  state = {
    imageSource: null,
    imagePreview: "",
    form: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: moment().format("DD/MM/YYYY"),
      school: "",
      category: "",
      phoneNumber: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
    errors: {},
    showLoader: false,
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, imageSource } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) {
      console.log("Errors ", errors);
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });

    if (imageSource) form.image = imageSource;

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.createUser({
      body: formData,
      onSuccess: () => {
        this.props.history.goBack();
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview } = this.state;
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            {imagePreview && (
              <>
                <img
                  src={imagePreview}
                  style={{ maxWidth: "130px", borderRadius: "5px" }}
                  className="mb-2"
                />
                <br />
              </>
            )}
            <label className="btn btn-primary">
              Choose Image
              <input
                type="file"
                multiple={true}
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  const file = e.target.files["0"];
                  if (!file) return;
                  this.setState({ imageSource: file });

                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = function (e) {
                    this.setState({ imagePreview: reader.result });
                  }.bind(this);
                }}
              />
            </label>
          </div>
          <div className="col-6">
            <Input
              label="First Name"
              placeholder="First Name"
              name="firstName"
              onChange={(firstName) => {
                form.firstName = firstName;
                errors.firstName = "";
                this.setState({ form, errors });
              }}
              value={form.firstName}
              error={errors.firstName}
            />
          </div>

          <div className="col-6">
            <Input
              label="Last Name"
              placeholder="Last Name"
              name="lastName"
              onChange={(lastName) => {
                form.lastName = lastName;
                errors.lastName = "";
                this.setState({ form, errors });
              }}
              value={form.lastName}
              error={errors.lastName}
            />
          </div>
          <div className="col-6">
            <Input
              label="Email"
              placeholder="Email"
              name="email"
              onChange={(email) => {
                form.email = email;
                errors.email = "";
                this.setState({ form, errors });
              }}
              value={form.email}
              error={errors.email}
            />
          </div>

          <div className="col-6">
            {/* <Input
              label="Date of Birth"
              placeholder="Date of Birth"
              name="dateOfBirth"
              onChange={(dateOfBirth) => {
                form.dateOfBirth = dateOfBirth;
                errors.dateOfBirth = "";
                this.setState({ form, errors });
              }}
              value={form.dateOfBirth}
              error={errors.dateOfBirth}
            /> */}

            <Label>
              <b>Date of Birth</b>
            </Label>
            <br />
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={moment(form.dateOfBirth, "DD/MM/YYYY").toDate()}
              onChange={(date) => {
                form.dateOfBirth = moment(date).format("DD/MM/YYYY");
                errors.dateOfBirth = "";
                this.setState({ form, errors });
              }}
            />
          </div>
          <div className="col-6">
            <PhoneInput
              label="Phone"
              country={"pk"}
              value={form.phoneNumber}
              onChange={(phoneNumber) => {
                form.phoneNumber = phoneNumber;
                errors.phoneNumber = "";
                this.setState({ form, errors });
              }}
              error={errors.phoneNumber}
            />
          </div>
          <div className="col-6">
            <MySelect
              label="Role"
              placeholder="Select Role"
              options={userRoles}
              name="role"
              onChange={(e) => {
                const role = e.target.value;
                form.role = role;
                errors.role = "";
                this.setState({ form, errors });
              }}
              value={form.role}
              error={errors.role}
            />
          </div>

          <div className="col-md-12">
            <Input
              label="School"
              placeholder="School"
              name="school"
              onChange={(school) => {
                form.school = school;
                errors.school = "";
                this.setState({ form, errors });
              }}
              value={form.school}
              error={errors.school}
            />
          </div>
          <div className="col-6">
            <MySelect
              label="Category"
              placeholder="Select Category"
              options={userCategories}
              name="Category"
              onChange={(e) => {
                const category = e.target.value;
                form.category = category;
                errors.category = "";
                this.setState({ form, errors });
              }}
              value={form.category}
              error={errors.category}
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              onChange={(password) => {
                form.password = password;
                errors.password = "";
                this.setState({ form, errors });
              }}
              value={form.password}
              error={errors.password}
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(confirmPassword) => {
                form.confirmPassword = confirmPassword;
                errors.confirmPassword = "";
                this.setState({ form, errors });
              }}
              value={form.confirmPassword}
              error={errors.confirmPassword}
            />
          </div>

          <div className="col-12 text-center">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    );
  };
  render() {
    const { showLoader } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Create User</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {this.renderForm()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  createUser: (params) => dispatch(createUser(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateUser);
