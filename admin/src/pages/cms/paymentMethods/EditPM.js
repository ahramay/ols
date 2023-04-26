import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import {
  getPaymentMethod,
  editPaymentMethod,
} from "../../../store/api/paymentMethods";

const schema = {
  paymentType: Joi.string().required(),
  description: Joi.string().required(),
};
class EditNavbarMenu extends Component {
  state = {
    id: "",
    form: {
      paymentType: "",
      description: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadStat(id);
  };

  loadStat = (id) => {
    this.setState({ showLoader: true });
    this.props.getPaymentMethod({
      id,
      onSuccess: (res) => {
        const { paymentType, description } = res.data.data;
        const form = {
          paymentType,
          description,
        };
        this.setState({ form });
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
    if (errors) return this.setState({ errors });
    this.setState({ showLoader: true });
    this.props.editPaymentMethod({
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
                <h2 className="mb-0 float-left">Edit Statistic Slide</h2>
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
  editPaymentMethod: (params) => dispatch(editPaymentMethod(params)),
  getPaymentMethod: (params) => dispatch(getPaymentMethod(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditNavbarMenu);
