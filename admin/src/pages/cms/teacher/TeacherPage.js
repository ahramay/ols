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
  loadTeacherPageCMS,
  editTeacherPageCMS,
} from "../../../store/api/teacherPage";
import MySelect from "../../../components/Inputs/MySelect";

import { getPages } from "../../../store/api/dynamicPages";
const schema = {
  mainHeading: Joi.string().allow(""),
  text1: Joi.string().allow(""),
  heading1: Joi.string().allow(""),
  metaTitle: Joi.string().allow(""),
  metaDescription: Joi.string().allow(""),
  metaKeyWords: Joi.string().allow(""),
};

class HomePageCMS extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      mainHeading: "",
      text1: "",
      heading1: "",
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
    this.loadTeacherPageCMS();
    // this.loadPages();
  };

  loadTeacherPageCMS = () => {
    this.setState({ showLoader: true });
    this.props.loadTeacherPageCMS({
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
    this.props.editTeacherPageCMS({
      id,
      body: form,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, pages } = this.state;

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

          <div className="col-12">
            <Input
              label="Teacher Heading"
              placeholder="Teacher Heading"
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
                <h2 className="mb-0 float-left">Edit Teacher Page</h2>
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
  editTeacherPageCMS: (params) => dispatch(editTeacherPageCMS(params)),
  loadTeacherPageCMS: (params) => dispatch(loadTeacherPageCMS(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(HomePageCMS);
