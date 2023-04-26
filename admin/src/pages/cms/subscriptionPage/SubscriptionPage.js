import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "../../../components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import { getPages } from "../../../store/api/dynamicPages";
import {
  editAboutStory,
  getAboutStory,
} from "../../../store/api/subscriptionPageCms";
import RichEditor from "../../../components/Inputs/RichEditor";

const schema = {
  heading: Joi.string().optional().allow(""),
  text: Joi.string().optional().allow(""),
  text2: Joi.string().optional().allow(""),
  buttonText: Joi.string().optional().allow(""),
  buttonLink: Joi.string().optional().allow(""),
  metaTitle: Joi.string(),
  metaDescription: Joi.string(),
  metaKeyWords: Joi.string(),

  //subscription modal

  topHeading: Joi.string().required(),
  coursesSelectedHeading: Joi.string().required(),
  priceLabel: Joi.string().required(),
  confirmation: Joi.string().required(),
  subPer: Joi.string().required(),
  bottomHeading: Joi.string().required(),
};

class AboutStoryPage extends Component {
  state = {
    id: "",
    pages: [],
    form: {
      heading: "",
      text: "",
      text2: "",
      buttonText: "",
      buttonLink: "",
      metaTitle: "",
      metaDescription: "",
      metaKeyWords: "",
      //modal
      topHeading: "",
      coursesSelectedHeading: "",
      priceLabel: "",
      confirmation: "",
      subPer: "",
      bottomHeading: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadSlider(id);
    this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({ pages: res.data.data });
      },
    });
  };

  loadSlider = (id) => {
    this.setState({ showLoader: true });
    this.props.getAboutStory({
      id,
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];

        const imagePreview = res.data.data.image || "";
        this.setState({ form, imagePreview });
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
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    if (imageSource) {
      form.image = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.editAboutStory({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview, pages = [] } = this.state;
    const selectList = pages.map((p) => {
      return { label: p.title, value: "/page/" + p.slug };
    });
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
              label="Heading"
              placeholder="Heading"
              name="heading"
              onChange={(heading) => {
                form.heading = heading;
                errors.heading = "";
                this.setState({ form, errors });
              }}
              value={form.heading}
              error={errors.heading}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Text"
              rows={3}
              placeholder="Text"
              name="text"
              onChange={(text) => {
                form.text = text;
                errors.text = "";
                this.setState({ form, errors });
              }}
              value={form.text}
              error={errors.text}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Text 2"
              rows={3}
              placeholder="Text 2"
              name="text2"
              onChange={(text2) => {
                form.text2 = text2;
                errors.text2 = "";
                this.setState({ form, errors });
              }}
              value={form.text2}
              error={errors.text2}
            />
          </div>

          {/* <div className="col-12">
            <Input
              label="Button Text"
              placeholder="Button Text"
              name="buttonText"
              onChange={(buttonText) => {
                form.buttonText = buttonText;
                errors.buttonText = "";
                this.setState({ form, errors });
              }}
              value={form.buttonText}
              error={errors.buttonText}
            />
          </div>
          <div className="col-12">
            <MySelect
              label="Link"
              placeholder="Link"
              name="Link"
              options={this.props.links}
              onChange={(e) => {
                const buttonLink = e.target.value;
                form.buttonLink = buttonLink;
                errors.buttonLink = "";
                this.setState({ form, errors });
              }}
              value={form.buttonLink}
              error={errors.buttonLink}
            />
          </div> */}

          <div className="col-12">
            <h1>Subscription Modal</h1>
          </div>

          <div className="col-12">
            <Input
              label="Top Heading"
              placeholder="Top Heading"
              name="topHeading"
              onChange={(topHeading) => {
                form.topHeading = topHeading;
                errors.topHeading = "";
                this.setState({ form, errors });
              }}
              value={form.topHeading}
              error={errors.topHeading}
            />
          </div>

          <div className="col-12">
            <Input
              label="Course Selected Heading"
              placeholder="Course Selected Heading"
              name="coursesSelectedHeading"
              onChange={(coursesSelectedHeading) => {
                form.coursesSelectedHeading = coursesSelectedHeading;
                errors.coursesSelectedHeading = "";
                this.setState({ form, errors });
              }}
              value={form.coursesSelectedHeading}
              error={errors.coursesSelectedHeading}
            />
          </div>

          <div className="col-12">
            <Input
              label="Price Label"
              placeholder="Price Label"
              name="priceLabel"
              onChange={(priceLabel) => {
                form.priceLabel = priceLabel;
                errors.priceLabel = "";
                this.setState({ form, errors });
              }}
              value={form.priceLabel}
              error={errors.priceLabel}
            />
          </div>

          <div className="col-12">
            <Input
              label="Confirmation"
              placeholder="Confirmation"
              name="confirmation"
              onChange={(confirmation) => {
                form.confirmation = confirmation;
                errors.confirmation = "";
                this.setState({ form, errors });
              }}
              value={form.confirmation}
              error={errors.confirmation}
            />
          </div>
          <div className="col-12">
            <Input
              label="Subscription Period"
              placeholder="Subscription Period"
              name="subPer"
              onChange={(subPer) => {
                form.subPer = subPer;
                errors.subPer = "";
                this.setState({ form, errors });
              }}
              value={form.subPer}
              error={errors.subPer}
            />
          </div>
          <div className="col-12">
            <Input
              label="Bottom Heading"
              placeholder="Bottom Heading"
              name="bottomHeading"
              onChange={(bottomHeading) => {
                form.bottomHeading = bottomHeading;
                errors.bottomHeading = "";
                this.setState({ form, errors });
              }}
              value={form.bottomHeading}
              error={errors.bottomHeading}
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
                <h2 className="mb-0 float-left">Edit Subscription Page</h2>
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

const mapStateToProps = (state) => ({
  links: state.cms.links.list,
});
const mapDispatchToprops = (dispatch) => ({
  editAboutStory: (params) => dispatch(editAboutStory(params)),
  getAboutStory: (params) => dispatch(getAboutStory(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(AboutStoryPage);
