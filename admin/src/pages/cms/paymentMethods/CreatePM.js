import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";

import { connect } from "react-redux";
import { createPaymentMethod } from "../../../store/api/paymentMethods";
import validateSchema from "../../../helpers/validation";

const schema = {
  paymentType: Joi.string().required(),
  description: Joi.string().required(),
};
class CreateNavbarMenu extends Component {
  state = {
    form: {
      paymentType: "",
      description: "",
    },
    errors: {},
    showLoader: false,
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    this.props.createPaymentMethod({
      body: form,
      onSuccess: () => {
        this.props.history.goBack();
      },
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
              label="Name"
              placeholder="Name"
              name="paymentType"
              onChange={(paymentType) => {
                form.paymentType = paymentType;
                errors.paymentType = "";
                this.setState({ form, errors });
              }}
              value={form.paymentType}
              error={errors.paymentType}
            />
          </div>

          <div className="col-12">
            <Input
              label="Text"
              placeholder="Text"
              name="text"
              onChange={(description) => {
                form.description = description;
                errors.description = "";
                this.setState({ form, errors });
              }}
              value={form.description}
              error={errors.description}
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
                <h2 className="mb-0 float-left">Create Payment Method</h2>
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
  createPaymentMethod: (params) => dispatch(createPaymentMethod(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateNavbarMenu);
