import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";

import { getStat, editStat } from "../../../store/api/stats";

const schema = {
  stats: Joi.string().required(),
  text: Joi.string().required(),
};
class EditNavbarMenu extends Component {
  state = {
    id: "",
    form: {
      stats: "",
      text: "",
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
    this.props.getStat({
      id,
      onSuccess: (res) => {
        const { stats, text } = res.data.data;
        const form = {
          stats,
          text,
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
    this.props.editStat({
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
  editStat: (params) => dispatch(editStat(params)),
  getStat: (params) => dispatch(getStat(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditNavbarMenu);
