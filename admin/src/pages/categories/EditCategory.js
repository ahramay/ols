import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import { Label } from "reactstrap";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import {
  editCategory,
  getCategories,
  getCategory,
} from "../../store/api/categories";

const schema = {
  name: Joi.string().min(2).max(50).required(),
  parent: Joi.string().min(5).max(30).optional().allow(null).allow(""),
  freeText: Joi.string().optional().allow(""),
};

class EditCategory extends Component {
  state = {
    id: "",
    categories: [],
    form: {
      name: "",
      parent: "",
      free: false,
      freeText: "",
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadCategory(id);
    this.loadCategories();
  };

  loadCategory = (id) => {
    this.setState({ showLoader: true });

    this.props.getCategory({
      id,
      onSuccess: (res) => {
        const { name, parent, free, freeText } = res.data.data;
        this.setState({ form: { name, parent, free, freeText } });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  loadCategories = () => {
    this.props.getCategories({
      onSuccess: (res) => {
        const { data: categories } = res.data;
        this.setState({ categories });
      },
    });
  };
  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    const body = {
      name: form.name,
      parent: form.parent,
      free: form.free,
      freeText: form.freeText,
    };

    if (!form.parent) body.parent = "";

    this.props.editCategory({
      id,
      body,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, categories, id } = this.state;

    const parentDropdownList = categories
      .map((cat) => ({
        value: cat._id,
        label: cat.name,
      }))
      .filter((c) => c.value !== id);
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
          </div>

          <div className="col-2 pt-2">
            <Label className="form-control-label">Free</Label>
            <br />
            <Toggle
              checked={form.free}
              onChange={(free) => {
                form.free = free;
                errors.free = "";
                this.setState({ form, errors });
              }}
            />
          </div>

          <div className="col-10">
            <Input
              label="Free Text"
              placeholder="Free Text"
              name="freeText"
              onChange={(freeText) => {
                form.freeText = freeText;
                errors.freeText = "";
                this.setState({ form, errors });
              }}
              value={form.freeText}
              error={errors.freeText}
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
                <h2 className="mb-0 float-left">Edit Category</h2>
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
  editCategory: (params) => dispatch(editCategory(params)),
  getCategories: (params) => dispatch(getCategories(params)),
  getCategory: (params) => dispatch(getCategory(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditCategory);
