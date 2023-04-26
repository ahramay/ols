import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import { loadWhyPageCMS, editWhyPageCMS } from "../../../store/api/whyPage";
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
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadWhyPageCMS();
    // this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({ pages: res.data.data });
      },
    });
  };
  loadWhyPageCMS = () => {
    this.setState({ showLoader: true });
    this.props.loadWhyPageCMS({
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
      console.log("HOME PAGE CMS ERR =>", errors);
      return this.setState({ errors });
    }
    this.setState({ showLoader: true });
    this.props.editWhyPageCMS({
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
            <RichEditor
              label="Text"
              placeholder="Text"
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
                <h2 className="mb-0 float-left">Edit Why Page</h2>
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
  editWhyPageCMS: (params) => dispatch(editWhyPageCMS(params)),
  loadWhyPageCMS: (params) => dispatch(loadWhyPageCMS(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(WhyPageCMS);
