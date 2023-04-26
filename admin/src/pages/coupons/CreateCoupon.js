import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import SearchSelect from "../../components/Inputs/SearchSelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { getCoursesForDropdown } from "../../store/api/courses";
import { getCategories } from "../../store/api/categories";
import { createCoupon } from "../../store/api/coupons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const schema = {
  code: Joi.string().min(1).trim().required(),
  discountType: Joi.string().max(30).trim().required(),
  discount: Joi.number().min(0).required(),
  applicableTo: Joi.string().max(30).trim().required(),
  courses: Joi.array().items(Joi.string()).min(0).required(),
  categories: Joi.array().items(Joi.string()).min(0).required(),
  referalEmails: Joi.string().optional().allow(""),
  reusability: Joi.string().min(5).max(30).optional(),
  reusabilityCount: Joi.number().min(0).optional().allow(""),
  validTill: Joi.number().min(0).required(),
  isActive: Joi.boolean().required(),
};

class CreateCoupon extends Component {
  state = {
    categories: [],
    courses: [],
    form: {
      code: "",
      discountType: "flat",
      discount: 0,
      applicableTo: "categories",
      categories: [],
      courses: [],
      referalEmails: "",
      reusability: "overall",
      reusabilityCount: 0,
      validTill: new Date(),
      isActive: false,
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    this.loadCategories();
    this.loadCourses();
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

  loadCourses = () => {
    this.setState({ showLoader: true });
    this.props.getCoursesForDropdown({
      onSuccess: (res) => {
        const { data: courses } = res.data;
        this.setState({ courses });
      },

      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form } = this.state;
    const data = { ...form, validTill: moment(form.validTill).format("X") };

    const errors = validateSchema(data, schema);
    if (errors) {
      console.log("COUPON FORM Errors  => ", errors);
      return this.setState({ errors });
    }

    if (
      data.discountType === "percentage" &&
      (data.discount < 1 || data.discount > 100)
    ) {
      return this.setState({
        errors: {
          discount: "Percentage must be 1 - 100",
        },
      });
    }

    if (data.applicableTo === "categories" && data.categories.length === 0) {
      return this.setState({
        errors: {
          categories: "Select a category",
        },
      });
    }

    if (data.applicableTo === "courses" && data.courses.length === 0) {
      return this.setState({
        errors: {
          courses: "Select a Course",
        },
      });
    }

    console.log("data => ", data);
    this.setState({ showLoader: true });

    this.props.createCoupon({
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
    const { form, errors, categories, courses } = this.state;

    const categoriesDropdownList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

    const coursesDropdownList = courses.map((course) => ({
      value: course._id,
      label: course.name,
    }));
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="Code"
              placeholder="Code"
              name="Code"
              onChange={(code) => {
                form.code = code;
                errors.code = "";
                this.setState({ form, errors });
              }}
              value={form.code}
              error={errors.code}
            />
          </div>
          <div className="col-6">
            <MySelect
              label="Discount Type"
              placeholder="Discount Type"
              options={[
                { label: "Flat", value: "flat" },
                { label: "Percentage", value: "percentage" },
              ]}
              name="discountType"
              onChange={(e) => {
                const discountType = e.target.value;
                form.discountType = discountType || "flat";
                errors.discountType = "";
                this.setState({ form, errors });
              }}
              value={form.discountType}
              error={errors.discountType}
            />
          </div>

          <div className="col-6">
            <Input
              label="Discount"
              placeholder="Discount"
              name="discount"
              onChange={(discount) => {
                form.discount = discount;
                errors.discount = "";
                this.setState({ form, errors });
              }}
              value={form.discount}
              error={errors.discount}
            />
          </div>

          <div className="col-6">
            <MySelect
              label="Applicable To"
              placeholder="Applicable To"
              options={[
                { label: "Categories", value: "categories" },
                { label: "Courses", value: "courses" },
              ]}
              name="applicableTo"
              onChange={(e) => {
                const applicableTo = e.target.value;
                form.applicableTo = applicableTo || "categories";
                form.categories = [];
                form.courses = [];
                errors.applicableTo = "";
                this.setState({ form, errors });
              }}
              value={form.applicableTo}
              error={errors.applicableTo}
            />
          </div>

          {form.applicableTo === "categories" && (
            <div className="col-6">
              <SearchSelect
                label="Choose Categories"
                placeholder="Choose Categories"
                options={categoriesDropdownList}
                name="categories"
                isMulti={true}
                onChange={(e) => {
                  form.categories = e.map((i) => i.value);

                  errors.categories = "";
                  this.setState({ form, errors });
                }}
                value={categoriesDropdownList.filter((i) => {
                  return form.categories.includes(i.value);
                })}
                error={errors.categories}
              />
            </div>
          )}

          {form.applicableTo === "courses" && (
            <div className="col-6">
              <SearchSelect
                label="Courses"
                placeholder="Choose Courses"
                options={coursesDropdownList}
                name="courses"
                isMulti={true}
                onChange={(e) => {
                  form.courses = e.map((i) => i.value);
                  errors.courses = "";
                  this.setState({ form, errors });
                }}
                value={coursesDropdownList.filter((i) =>
                  form.courses.includes(i.value)
                )}
                error={errors.courses}
              />
            </div>
          )}

          <div className="col-12">
            <Input
              label="Referral Emails (optional)"
              placeholder="Referral Emails (optional) separated with ,"
              name="referalEmails"
              onChange={(referalEmails) => {
                form.referalEmails = referalEmails;
                errors.referalEmails = "";
                this.setState({ form, errors });
              }}
              value={form.referalEmails}
              error={errors.referalEmails}
            />
          </div>

          <div
            className={form.reusability === "unlimited" ? "col-12" : "col-6"}
          >
            <MySelect
              label="reusability"
              placeholder="reusability"
              options={[
                { label: "Overall", value: "overall" },
                { label: "Per User", value: "per_user" },
                { label: "Unlimited", value: "unlimited" },
              ]}
              name="reusability"
              onChange={(e) => {
                const reusability = e.target.value;
                form.reusability = reusability || "overall";
                errors.reusability = "";
                if (reusability === "unlimited") form.reusabilityCount = 0;
                this.setState({ form, errors });
              }}
              value={form.reusability}
              error={errors.reusability}
            />
          </div>

          {form.reusability !== "unlimited" && (
            <div className="col-6">
              <Input
                label="reusability Count"
                placeholder="reusability Count"
                name="reusabilityCount"
                onChange={(reusabilityCount) => {
                  // if (
                  //   form.discountType === "percentage" &&
                  //   (discount < 1 || discount > 100)
                  // ) {
                  //   errors.discount = "Percentage should be 1 - 100";

                  //   this.setState({ errors });
                  //   return;
                  // }
                  form.reusabilityCount = reusabilityCount;
                  errors.reusabilityCount = "";
                  this.setState({ form, errors });
                }}
                value={form.reusabilityCount}
                error={errors.reusabilityCount}
              />
            </div>
          )}

          <div className="col-6">
            <label class="form-control-label">Valid Till</label>
            <br />
            <DatePicker
              selected={form.validTill}
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                form.validTill = date;
                errors.validTill = "";
                this.setState({ form, errors });
              }}
              customInput={<input className="form-control w-100" />}
            />
          </div>

          <div className="col-6">
            <label class="form-control-label">Is Active</label>
            <br />
            <Toggle
              checked={form.isActive}
              onChange={(checked) => {
                form.isActive = checked;
                this.setState({ form });
              }}
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
                <h2 className="mb-0 float-left">Create Coupon</h2>
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
  getCoursesForDropdown: (params) => dispatch(getCoursesForDropdown(params)),
  createCoupon: (params) => dispatch(createCoupon(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateCoupon);
