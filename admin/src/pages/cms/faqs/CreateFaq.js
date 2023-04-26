import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import RichEditor from "../../../components/Inputs/RichEditor";
import MySelect from "../../../components/Inputs/MySelect";
import Toggle from "../../../components/Inputs/Toggle";

import { getPages } from "../../../store/api/dynamicPages";

import { connect } from "react-redux";
import { createFaq } from "../../../store/api/faqs";
import validateSchema from "../../../helpers/validation";

const schema = {
  question: Joi.string(),
  answer: Joi.string(),
  student: Joi.boolean(),
  teacher: Joi.boolean(),
  parent: Joi.boolean(),
};
class CreateFaq extends Component {
  state = {
    pages: [],
    form: {
      question: "",
      answer: "",
      student: true,
      teacher: true,
      parent: true,
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

    this.props.createFaq({
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
    const { form, errors, pages } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="Question"
              placeholder="Question"
              name="question"
              onChange={(question) => {
                form.question = question;
                errors.question = "";
                this.setState({ form, errors });
              }}
              value={form.question}
              error={errors.question}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Answer"
              placeholder="Answer"
              name="answer"
              onChange={(answer) => {
                form.answer = answer;
                errors.answer = "";
                this.setState({ form, errors });
              }}
              value={form.answer}
              error={errors.answer}
            />
          </div>

          <div className="col-4">
            <label>Students</label>
            <br />
            <Toggle
              onChange={(student) => {
                form.student = student;
                errors.student = "";
                this.setState({ form, errors });
              }}
              checked={form.student}
            />
          </div>
          <div className="col-4">
            <label>Parents</label>
            <br />
            <Toggle
              onChange={(parent) => {
                form.parent = parent;
                errors.parent = "";
                this.setState({ form, errors });
              }}
              checked={form.parent}
            />
          </div>
          <div className="col-4">
            <label>Teachers</label>
            <br />
            <Toggle
              onChange={(teacher) => {
                form.teacher = teacher;
                errors.teacher = "";
                this.setState({ form, errors });
              }}
              checked={form.teacher}
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
                <h2 className="mb-0 float-left">Create Faq</h2>
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
  createFaq: (params) => dispatch(createFaq(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateFaq);
