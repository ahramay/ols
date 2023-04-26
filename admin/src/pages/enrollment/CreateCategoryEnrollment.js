import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { createCategoryEnrollment } from "../../store/api/courses";
import { getCategories } from "../../store/api/categories";
import { ListGroup, ListGroupItem } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const schema = {
  email: Joi.string().email().min(1).trim().required(),
  category: Joi.string().max(30).trim().required(),
  startDate: Joi.number().min(0).required(),
  endDate: Joi.number().min(0).required(),
};

class CreateEnrollmentPage extends Component {
  state = {
    categories: [],
    form: {
      email: "",
      category: "",
      startDate: new Date(),
      endDate: new Date(),
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
    const data = {
      ...form,
      startDate: moment(form.startDate).format("X"),
      endDate: moment(form.endDate).format("X"),
    };
    console.log("data => ", data);
    const errors = validateSchema(data, schema);
    if (errors) {
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });

    this.props.createCategoryEnrollment({
      body: data,
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

    const categoriesDropdownList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="User Email"
              placeholder="User Email"
              name="email"
              onChange={(email) => {
                form.email = email;
                errors.email = "";
                this.setState({ form, errors });
              }}
              value={form.email}
              error={errors.email}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Category"
              placeholder="Category"
              options={categoriesDropdownList}
              name="category"
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

          <div className="col-6">
            <label class="form-control-label">Start Date</label>
            <br />
            <DatePicker
              selected={form.startDate}
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                form.startDate = date;
                errors.startDate = "";
                this.setState({ form, errors });
              }}
              customInput={<input className="form-control w-100" />}
            />
          </div>

          <div className="col-6">
            <label class="form-control-label">End Date</label>
            <br />
            <DatePicker
              selected={form.endDate}
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                form.endDate = date;
                errors.endDate = "";
                this.setState({ form, errors });
              }}
              customInput={<input className="form-control w-100" />}
            />
          </div>

          <div className="col-12 text-center mt-4">
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
                <h2 className="mb-0 float-left">Create Category Enrollment</h2>
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
  getCategories: (params) => dispatch(getCategories(params)),
  createCategoryEnrollment: (params) =>
    dispatch(createCategoryEnrollment(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToprops
)(CreateEnrollmentPage);
