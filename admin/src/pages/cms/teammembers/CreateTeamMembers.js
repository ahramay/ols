import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "../../../components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from '../../../components/Inputs/MySelect';
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import { createTeamMember } from "../../../store/api/teamMembers";
import RichEditor from "../../../components/Inputs/RichEditor";
import Toggle from "../../../components/Inputs/Toggle";
import {getCategories} from '../../../store/api/categories'
const schema = {
  name: Joi.string().min(1).max(50).required().trim(),
  designation: Joi.string().min(1).max(50).required().trim(),
  introduction: Joi.string().min(1).required().trim(),
  facebookLink: Joi.string().min(1).required().trim(),
  twitterLink: Joi.string().min(1).required().trim(),
  linkedInLink: Joi.string().min(1).required().trim(),
  instagramLink: Joi.string().min(1).required().trim(),
  showOnHome: Joi.boolean().required(),
  showOnAbout: Joi.boolean().required(),
  showOnTeacher: Joi.boolean().required(),
  managementBoard: Joi.boolean().required(),
  coreTeam: Joi.boolean().required(),
  leadership: Joi.boolean().required(),
  category: Joi.string().min(1).max(50).required().trim(),
};

class CreateInfoCard extends Component {
  state = {
    form: {
      name: "",
      designation: "",
      introduction: "",
      facebookLink: "",
      twitterLink: "",
      linkedInLink: "",
      instagramLink: "",
      showOnHome: false,
      showOnAbout: false,
      showOnTeacher: false,
      managementBoard: false,
      coreTeam: false,
      leadership: false,
      category: ''
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
    categories: []
  };

  componentDidMount = () => {
    this.loadCategories();
  };

  loadCategories = () => {
    this.setState({ showLoader: true });
    this.props.getCategories({
      onSuccess: (res) => {
        const { data: categories } = res.data;
        this.setState({ categories });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, imageSource } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) {
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });

    if (imageSource) {
      form.image = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.createTeamMember({
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
    const { form, errors, categories, imagePreview } = this.state;

    const categoryDropdownList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
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
          <div className="col-12">
            <Input
              label="Name"
              placeholder="Name"
              name="name"
              onChange={(name) => {
                form.name = name;
                errors.name = "";
                this.setState({ form, errors });
              }}
              value={form.name}
              error={errors.name}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Category"
              placeholder="Choose a Category"
              options={categoryDropdownList}
              name="category"
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

          <div className="col-12">
            <Input
              label="Designation"
              placeholder="Designation"
              name="designation"
              onChange={(designation) => {
                form.designation = designation;
                errors.designation = "";
                this.setState({ form, errors });
              }}
              value={form.designation}
              error={errors.designation}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Introduction"
              name="introduction"
              onChange={(introduction) => {
                form.introduction = introduction;
                errors.introduction = "";
                this.setState({ form, errors });
              }}
              value={form.introduction}
              error={errors.introduction}
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
          <div className="col-4">
            <label>Show On Home Page</label>
            <br />
            <Toggle
              onChange={(showOnHome) => {
                form.showOnHome = showOnHome;
                errors.showOnHome = "";
                this.setState({ form, errors });
              }}
              checked={form.showOnHome}
            />
          </div>

          <div className="col-4">
            <label>Show On About Page</label>
            <br />
            <Toggle
              onChange={(showOnAbout) => {
                form.showOnAbout = showOnAbout;
                errors.showOnAbout = "";
                this.setState({ form, errors });
              }}
              checked={form.showOnAbout}
            />
          </div>

          <div className="col-4">
            <label>Show On Teachers Page</label>
            <br />
            <Toggle
              onChange={(showOnTeacher) => {
                form.showOnTeacher = showOnTeacher;
                errors.showOnTeacher = "";
                this.setState({ form, errors });
              }}
              checked={form.showOnTeacher}
            />
          </div>

          <div className="col-4">
            <label>Core Team</label>
            <br />
            <Toggle
              onChange={(coreTeam) => {
                form.coreTeam = coreTeam;
                errors.coreTeam = "";
                this.setState({ form, errors });
              }}
              checked={form.coreTeam}
            />
          </div>

          <div className="col-4">
            <label>Management Board</label>
            <br />
            <Toggle
              onChange={(managementBoard) => {
                form.managementBoard = managementBoard;
                errors.managementBoard = "";
                this.setState({ form, errors });
              }}
              checked={form.managementBoard}
            />
          </div>

          <div className="col-4">
            <label>Leadership</label>
            <br />
            <Toggle
              onChange={(leadership) => {
                form.leadership = leadership;
                errors.leadership = "";
                this.setState({ form, errors });
              }}
              checked={form.leadership}
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
                <h2 className="mb-0 float-left">Create Team Member</h2>
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
  getCategories: params => dispatch(getCategories(params)),
  createTeamMember: (params) => dispatch(createTeamMember(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateInfoCard);
