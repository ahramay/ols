import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import RichEditor from "../../../components/Inputs/RichEditor";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import { loadCartPageCMS, editCartPageCMS } from "../../../store/api/cartCms";
const schema = {
  heading1: Joi.string(),
  text1: Joi.string(),
  heading2: Joi.string(),
  text2: Joi.string(),
  heading3: Joi.string(),
  text3: Joi.string(),
};

class CartPageCMS extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      heading1: "",
      text1: "",
      heading2: "",
      text2: "",
      heading3: "",
      text3: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.getCartPageCMS();
  };

  getCartPageCMS = () => {
    this.setState({ showLoader: true });
    this.props.loadCartPageCMS({
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
    this.props.editCartPageCMS({
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
          <div className="col-12">
            <RichEditor
              label="Text 1"
              placeholder="Text 1"
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
              label="Heading 3"
              placeholder="Heading 3"
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
            <RichEditor
              label="Text 2"
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

          <div className="col-12">
            <Input
              label="Heading 3"
              placeholder="Heading 3"
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
            <RichEditor
              label="Text 3"
              placeholder="Text 3"
              name="text3"
              onChange={(text3) => {
                form.text3 = text3;
                errors.text3 = "";
                this.setState({ form, errors });
              }}
              value={form.text3}
              error={errors.text3}
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
                <h2 className="mb-0 float-left">Edit Cart Page</h2>
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
  editCartPageCMS: (params) => dispatch(editCartPageCMS(params)),
  loadCartPageCMS: (params) => dispatch(loadCartPageCMS(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CartPageCMS);
