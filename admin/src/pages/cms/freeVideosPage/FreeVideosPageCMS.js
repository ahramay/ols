import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import RichEditor from "../../../components/Inputs/RichEditor";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import {
  loadHomePageCMS,
  editHomePageCMS,
} from "../../../store/api/freeVideosCMS";
import MySelect from "../../../components/Inputs/MySelect";

import { getPages } from "../../../store/api/dynamicPages";
const schema = {
  heading1: Joi.string().allow(""),
  heading2: Joi.string().allow(""),
  heading3: Joi.string().allow(""),
  heading4: Joi.string().allow(""),
  heading5: Joi.string().allow(""),
  text1: Joi.string().allow(""),
  text2: Joi.string().allow(""),
  text3: Joi.string().allow(""),
  buttonText1: Joi.string().allow(""),
  buttonLink1: Joi.string().allow(""),
  buttonText2: Joi.string().allow(""),
  buttonLink2: Joi.string().allow(""),
  buttonText3: Joi.string().allow(""),
  buttonLink3: Joi.string().allow(""),
  coursesBtnText: Joi.string().allow(""),
  coursesBtnLink: Joi.string().allow(""),
  metaTitle: Joi.string().allow(""),
  metaDescription: Joi.string().allow(""),
  metaKeyWords: Joi.string().allow(""),
};

class FreeVideosPageCMS extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      heading1: "",
      heading2: "",
      heading3: "",
      heading4: "",
      heading5: "",
      text1: "",
      text2: "",
      text3: "",
      buttonText1: "",
      buttonLink1: "",
      buttonText2: "",
      buttonLink2: "",
      buttonText3: "",
      buttonLink3: "",
      coursesBtnText: "",
      coursesBtnLink: "",
      metaTitle: "",
      metaDescription: "",
      metaKeyWords: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadHomePageCMS();
    // this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({ pages: res.data.data });
      },
    });
  };
  loadHomePageCMS = () => {
    this.setState({ showLoader: true });
    this.props.loadHomePageCMS({
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];
        this.setState({ form });
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
    const { form, id } = this.state;

    const errors = validateSchema(form, schema);
    if (errors) {
      return this.setState({ errors });
    }
    this.setState({ showLoader: true });
    this.props.editHomePageCMS({
      id,
      body: form,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, pages } = this.state;
    const selectList = pages.map((p) => {
      return { label: p.title, value: "/page/" + p.slug };
    });
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
              label="Heading 1"
              placeholder="Heading 1"
              name="heading1"
              onChange={(heading1) => {
                form.heading1 = heading1;
                errors.heading1 = "";
                this.setState({ form, errors });
              }}
              value={form.heading1}
              error={errors.heading1}
            />
          </div>

          {/* <div className="col-12">
            <Input
              label="Below Courses Slider Button"
              placeholder="Below Courses Slider Button"
              name="coursesBtnText"
              onChange={(coursesBtnText) => {
                form.coursesBtnText = coursesBtnText;
                errors.coursesBtnText = "";
                this.setState({ form, errors });
              }}
              value={form.coursesBtnText}
              error={errors.coursesBtnText}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Below Courses Slider Link"
              placeholder="Below Courses Slider Link"
              name="coursesBtnLink"
              options={this.props.links}
              onChange={(e) => {
                const coursesBtnLink = e.target.value;
                form.coursesBtnLink = coursesBtnLink;
                errors.coursesBtnLink = "";
                this.setState({ form, errors });
              }}
              value={form.coursesBtnLink}
              error={errors.coursesBtnLink}
            />
          </div> */}

          <div className="col-12">
            <Input
              label="Heading 2"
              placeholder="Heading 2"
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
            <Input
              label="Video Id"
              placeholder="Video Id"
              name="text1"
              onChange={(text1) => {
                form.text1 = text1;
                errors.text1 = "";
                this.setState({ form, errors });
              }}
              value={form.text1}
              error={errors.text1}
            />
          </div>

          {/* ////Teacher Button */}

          {/* {Grow with us Heading } */}

          <div className="col-12">
            <Input
              label="Banner Heading 1"
              placeholder="Banner Heading 1"
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

          <div className="col-12">
            <Input
              label="Banner Heading 2"
              placeholder="Banner Heading 2"
              name="heading4"
              onChange={(heading4) => {
                form.heading4 = heading4;
                errors.heading4 = "";
                this.setState({ form, errors });
              }}
              value={form.heading4}
              error={errors.heading4}
            />
          </div>

          <div className="col-12">
            <Input
              label="Banner Button Text"
              placeholder="Banner Button Text"
              name="buttonText1"
              onChange={(buttonText1) => {
                form.buttonText1 = buttonText1;
                errors.buttonText1 = "";
                this.setState({ form, errors });
              }}
              value={form.buttonText1}
              error={errors.buttonText1}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Banner Button Link"
              placeholder="Banner Button Link"
              name="buttonLink1"
              options={this.props.links}
              onChange={(e) => {
                const buttonLink1 = e.target.value;
                form.buttonLink1 = buttonLink1;
                errors.buttonLink1 = "";
                this.setState({ form, errors });
              }}
              value={form.buttonLink1}
              error={errors.buttonLink1}
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
                <h2 className="mb-0 float-left">Edit Free Videos Page</h2>
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
  editHomePageCMS: (params) => dispatch(editHomePageCMS(params)),
  loadHomePageCMS: (params) => dispatch(loadHomePageCMS(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(FreeVideosPageCMS);
