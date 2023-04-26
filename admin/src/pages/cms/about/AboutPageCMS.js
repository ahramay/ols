import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import { loadAbouPageCMS, editAbouPageCMS } from "../../../store/api/aboutPage";
import MySelect from "../../../components/Inputs/MySelect";
import RichEditor from "../../../components/Inputs/RichEditor";

import { getPages } from "../../../store/api/dynamicPages";
const schema = {
  mainHeading: Joi.string(),
  subText1: Joi.string(),
  subText1Link: Joi.string(),
  subText2: Joi.string(),
  heading1: Joi.string(),
  text1: Joi.string(),
  heading2: Joi.string(),
  heading3: Joi.string(),
  metaTitle: Joi.string(),
  metaDescription: Joi.string(),
  metaKeyWords: Joi.string(),
};

class WhyPageCMS extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      mainHeading: "",
      subText1: "",
      subText1Link: "",
      subText2: "",
      heading1: "",
      text1: "",
      heading2: "",
      heading3: "",
      metaTitle: "",
      metaDescription: "",
      metaKeyWords: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadAbouPageCMS();
    // this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({
          pages: res.data.data,
        });
      },
    });
  };
  loadAbouPageCMS = () => {
    this.setState({ showLoader: true });
    this.props.loadAbouPageCMS({
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];
        this.setState({ form, imagePreview: res.data.data.image1 });
      },
      onError: (err) => {
        // this.props.history.goBack();
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id, imageSource } = this.state;

    const errors = validateSchema(form, schema);
    if (errors) {
      return this.setState({ errors });
    }

    if (imageSource) {
      form.image = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.setState({ showLoader: true });
    this.props.editAbouPageCMS({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, pages, imagePreview } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="Meta Title"
              placeholder="Meta Title"
              name="mainHeading"
              onChange={(metaTitle) => {
                form.metaTitle = metaTitle;
                errors.metaTitle = "";
                this.setState({ form, errors });
              }}
              value={form.metaTitle}
              error={errors.metaTitle}
            />
          </div>

          <div className="col-12">
            <Input
              label="Meta Description"
              placeholder="Meta Description"
              name="metaDescription"
              type="textarea"
              onChange={(metaDescription) => {
                form.metaDescription = metaDescription;
                errors.metaDescription = "";
                this.setState({ form, errors });
              }}
              value={form.metaDescription}
              error={errors.metaDescription}
            />
          </div>

          <div className="col-12">
            <Input
              label="Meta Keywords"
              placeholder="Meta Keywords"
              name="metaKeyWords"
              type="textarea"
              onChange={(metaKeyWords) => {
                form.metaKeyWords = metaKeyWords;
                errors.metaKeyWords = "";
                this.setState({ form, errors });
              }}
              value={form.metaKeyWords}
              error={errors.metaKeyWords}
            />
          </div>

          <div className="col-12">
            <Input
              label="Main Heading"
              placeholder="Main Heading"
              name="mainHeading"
              onChange={(mainHeading) => {
                form.mainHeading = mainHeading;
                errors.mainHeading = "";
                this.setState({ form, errors });
              }}
              value={form.mainHeading}
              error={errors.mainHeading}
            />
          </div>

          <div className="col-12">
            <Input
              label="Cards Headnig"
              placeholder="Cards Headnig"
              name="heading2"
              onChange={(heading2) => {
                form.heading2 = heading2;
                errors.heading2 = "";
                this.setState({ form, errors });
              }}
              value={form.heading2}
              error={errors.heading2}
            />
          </div>

          <div className="col-12">
            <label class="form-control-label">Cards Background Image</label>

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
              label="Team Heading"
              placeholder="Team Heading"
              name="heading3"
              onChange={(heading3) => {
                form.heading3 = heading3;
                errors.heading3 = "";
                this.setState({ form, errors });
              }}
              value={form.heading3}
              error={errors.heading3}
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
                <h2 className="mb-0 float-left">Edit About Page</h2>
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
  editAbouPageCMS: (params) => dispatch(editAbouPageCMS(params)),
  loadAbouPageCMS: (params) => dispatch(loadAbouPageCMS(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(WhyPageCMS);
