import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";

import { connect } from "react-redux";
import { createStat } from "../../../store/api/stats";
import validateSchema from "../../../helpers/validation";

const schema = {
  stats: Joi.string().required(),
  text: Joi.string().required(),
};
class CreateNavbarMenu extends Component {
  state = {
    form: {
      stats: "",
      text: "",
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

    this.props.createStat({
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
              label="Figure"
              placeholder="Figure"
              name="stats"
              onChange={(stats) => {
                form.stats = stats;
                errors.stats = "";
                this.setState({ form, errors });
              }}
              value={form.stats}
              error={errors.stats}
            />
          </div>

          <div className="col-12">
            <Input
              label="Text"
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
                <h2 className="mb-0 float-left">Create Statistic Slide</h2>
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
  createStat: (params) => dispatch(createStat(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateNavbarMenu);
