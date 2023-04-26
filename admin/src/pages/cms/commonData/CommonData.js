import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "../../../components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";
import Toggle from "../../../components/Inputs/Toggle";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import {
  editRobotTxt,
  editCommonData,
  loadCommonData,
} from "../../../store/api/commonData";

const schema = {
  facebookLink: Joi.string().required().allow(""),
  linkedInLink: Joi.string().required().allow(""),
  twitterLink: Joi.string().required().allow(""),
  instagramLink: Joi.string().required().allow(""),
  contactNumber: Joi.string().required().allow(""),
};

class EditCommonData extends Component {
  state = {
    form: {
      facebookLink: "",
      linkedInLink: "",
      twitterLink: "",
      instagramLink: "",
      contactNumber: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",

    robotTxtSource: undefined,
  };
  componentDidMount = () => {
    this.loadCData();
  };

  loadCData = () => {
    this.setState({ showLoader: true });
    this.props.loadCommonData({
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];

        const imagePreview = res.data.data.logo || "";
        this.setState({ form, imagePreview });
      },

      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id, imageSource, robotTxtSource } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    if (imageSource) {
      form.logo = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.editCommonData({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });

    this.props.editRobotTxt({ body: { robot: robotTxtSource } });
  };

  renderForm = () => {
    const { form, errors, imagePreview } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <label className="form-control-label">Site Logo</label>
            <br />
            {imagePreview && (
              <img
                src={imagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
              />
            )}
            <br />
            <label>
              <span className="btn btn-info">Choose Image</span>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                className="d-none"
                onChange={(e) => {
                  const imageSource = e.target.files[0];
                  if (imageSource) {
                    this.setState({ imageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(imageSource);
                    reader.onloadend = function () {
                      this.setState({ imagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12 mt-4">
            <label>
              <span className="btn btn-info">robot.txt</span>
              <input
                type="file"
                accept=".txt"
                multiple={false}
                onChange={(e) => {
                  const robotTxtSource = e.target.files[0];
                  if (robotTxtSource) {
                    this.setState({ robotTxtSource });
                  }
                }}
              />
            </label>
          </div>
          <div className="col-12">
            <Input
              label="Contact Number"
              placeholder="Contact Number"
              name="contactNumber"
              onChange={(contactNumber) => {
                form.contactNumber = contactNumber;
                errors.contactNumber = "";
                this.setState({ form, errors });
              }}
              value={form.contactNumber}
              error={errors.contactNumber}
            />
          </div>

          <div className="col-12">
            <Input
              label="Facebook Link"
              placeholder="Facebook Link"
              name="facebookLink"
              onChange={(facebookLink) => {
                form.facebookLink = facebookLink;
                errors.facebookLink = "";
                this.setState({ form, errors });
              }}
              value={form.facebookLink}
              error={errors.facebookLink}
            />
          </div>

          <div className="col-12">
            <Input
              label="LinkedIn Link"
              placeholder="LinkedIn Link"
              name="linkedInLink"
              onChange={(linkedInLink) => {
                form.linkedInLink = linkedInLink;
                errors.linkedInLink = "";
                this.setState({ form, errors });
              }}
              value={form.linkedInLink}
              error={errors.linkedInLink}
            />
          </div>

          <div className="col-12">
            <Input
              label="Twitter Link"
              placeholder="Twitter Link"
              name="twitterLink"
              onChange={(twitterLink) => {
                form.twitterLink = twitterLink;
                errors.twitterLink = "";
                this.setState({ form, errors });
              }}
              value={form.twitterLink}
              error={errors.twitterLink}
            />
          </div>

          <div className="col-12">
            <Input
              label="Instagram Link"
              placeholder="Instagram Link"
              name="instagramLink"
              onChange={(instagramLink) => {
                form.instagramLink = instagramLink;
                errors.instagramLink = "";
                this.setState({ form, errors });
              }}
              value={form.instagramLink}
              error={errors.instagramLink}
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
                <h2 className="mb-0 float-left">Edit Common Data</h2>
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
  editRobotTxt: (params) => dispatch(editRobotTxt(params)),
  editCommonData: (params) => dispatch(editCommonData(params)),
  loadCommonData: (params) => dispatch(loadCommonData(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditCommonData);
