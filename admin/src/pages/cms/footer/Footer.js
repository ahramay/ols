import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";

import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import RichEditor from "../../../components/Inputs/RichEditor";

import { loadFooter, editFooter } from "../../../store/api/footer";

const schema = {
  paragraph: Joi.string().required(),
  copyrightText: Joi.string().required(),
};
class EditFooter extends Component {
  state = {
    pages: [],
    id: "",
    form: {
      paragraph: "",
      copyrightText: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.getFooter();
  };

  getFooter = () => {
    this.setState({ showLoader: true });
    this.props.loadFooter({
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];
        this.setState({ form });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form } = this.state;

    const errors = validateSchema(form, schema);
    if (errors) {
      console.log("Error =. ", errors);
      return this.setState({ errors });
    }
    this.setState({ showLoader: true });
    this.props.editFooter({
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
            <RichEditor
              label="Paragraph"
              type="textarea"
              rows={5}
              placeholder="Paragraph"
              name="paragraph"
              onChange={(paragraph) => {
                form.paragraph = paragraph;
                errors.paragraph = "";
                this.setState({ form, errors });
              }}
              value={form.paragraph}
              error={errors.paragraph}
            />
          </div>

          <div className="col-12">
            <Input
              label="Copyright"
              placeholder="Copyright"
              name="copyrightText"
              onChange={(copyrightText) => {
                form.copyrightText = copyrightText;
                errors.copyrightText = "";
                this.setState({ form, errors });
              }}
              value={form.copyrightText}
              error={errors.copyrightText}
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
                <h2 className="mb-0 float-left">Edit Footer</h2>
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
  loadFooter: (params) => dispatch(loadFooter(params)),
  editFooter: (params) => dispatch(editFooter(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditFooter);
