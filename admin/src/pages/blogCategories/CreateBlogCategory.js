import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";

import { createCategory, getCategories } from "../../store/api/blogCategories";

const schema = {
  name: Joi.string().min(2).max(50).required(),
  parent: Joi.string().min(5).max(30).optional().allow(""),
};

class CreateCategory extends Component {
  state = {
    categories: [],
    form: {
      name: "",
      parent: "",
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
    const { form } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });
    this.props.createCategory({
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

          {/* <div className="col-12">
            <MySelect
              label="Parent"
              placeholder="Choose a Parent"
              options={parentDropdownList}
              name="parent"
              onChange={(e) => {
                const parent = e.target.value;
                form.parent = parent;
                errors.parent = "";
                this.setState({ form, errors });
              }}
              value={form.parent}
              error={errors.parent}
            />
          </div> */}

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
                <h2 className="mb-0 float-left">Create Blog Category</h2>
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
  createCategory: (params) => dispatch(createCategory(params)),
  getCategories: (params) => dispatch(getCategories(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateCategory);
