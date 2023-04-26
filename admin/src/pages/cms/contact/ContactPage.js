import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import {
  getContactPageCMS,
  editContactPageCMS,
} from "../../../store/api/contactPageCms";
import MySelect from "../../../components/Inputs/MySelect";

import { getPages } from "../../../store/api/dynamicPages";
const schema = {
  mainHeading: Joi.string(),
  heading1: Joi.string(),
  heading2: Joi.string(),
  metaTitle: Joi.string(),
  metaDescription: Joi.string(),
  metaKeyWords: Joi.string(),
};

class HomePageCMS extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      mainHeading: "",
      heading1: "",
      heading2: "",
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
    this.getContactPageCMS();
    // this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({ pages: res.data.data });
      },
    });
  };
  getContactPageCMS = () => {
    this.setState({ showLoader: true });
    this.props.getContactPageCMS({
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
    this.props.editContactPageCMS({
      id,
      body: form,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors } = this.state;

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
              label="Social Links Heading"
              placeholder="Social Links Heading"
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

          <div className="col-12">
            <Input
              label="Contact Form Heading"
              placeholder="Contact Form Heading"
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
                <h2 className="mb-0 float-left">Edit Contact Page</h2>
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
  editContactPageCMS: (params) => dispatch(editContactPageCMS(params)),
  getContactPageCMS: (params) => dispatch(getContactPageCMS(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(HomePageCMS);
