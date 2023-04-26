import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { createCourse } from "../../store/api/courses";
import { getCategories } from "../../store/api/categories";

import { basePath } from "../../configs";
const schema = {
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(),
  traits: Joi.string().required()
};

class CreateCourse extends Component {
  state = {
    categories: [],
    form: {
      name: "",
      category: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    this.loadCategories();
  };

  loadCategories = () => {
    this.setState({ showLoader: true });
    this.props.getCategories({
      onSuccess: (res) => {
        const { data: categories } = res.data;
        this.setState({ categories });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, image } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });
    console.log("ye form ha ", form);
    this.props.createCourse({
      body: form,
      onSuccess: (res) => {
        const courseId = res.data.data._id;
        this.props.history.replace(basePath + "/courses/" + courseId);
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, categories } = this.state;

    const parentDropdownList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="Name"
              placeholder="Name"
              name="name"
              onChange={(name) => {
                form.name = name;
                errors.name = "";
                this.setState({ form, errors });
              }}
              value={form.name}
              error={errors.name}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Category"
              placeholder="Category"
              options={parentDropdownList}
              name="Category"
              onChange={(e) => {
                const category = e.target.value;
                form.category = category;
                errors.category = "";
                this.setState({ form, errors });
              }}
              value={form.category}
              error={errors.category}
            />
          </div>
          <div className="col-12">
            <Input
              label="Video traits"
              placeholder="trait 1, trait 2, trait 3.."
              name="traits"
              onChange={(traits) => {
                form.traits = traits;
                errors.traits = "";
                this.setState({ form, errors });
              }}
              value={form.traits}
              error={errors.traits}
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
                <h2 className="mb-0 float-left">Create Course</h2>
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
  createCourse: (params) => dispatch(createCourse(params)),
  getCategories: (params) => dispatch(getCategories(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateCourse);
