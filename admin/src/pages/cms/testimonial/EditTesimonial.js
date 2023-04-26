import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "../../../components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import { getCoursesForDropdown } from "../../../store/api/courses";

import {
  editTestimonial,
  getTestimonial,
} from "../../../store/api/Testimonials";
const schema = {
  review: Joi.string().required(),
  name: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  course: Joi.string().required(),
};

class EditTestimonial extends Component {
  state = {
    id: "",
    courses: [],
    form: {
      course: "",
      name: "",
      review: "",
      rating: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadSlider(id);
    this.loadCourses();
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

  loadSlider = (id) => {
    this.setState({ showLoader: true });
    this.props.getTestimonial({
      id,
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];

        const imagePreview = res.data.data.image || "";
        this.setState({ form, imagePreview });
      },

      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };
  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id, imageSource } = this.state;

    const errors = validateSchema(form, schema);
    console.log("form ye ha ", form);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    if (imageSource) {
      form.image = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.editTestimonial({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview, courses } = this.state;
    const coursesDropdownList = courses.map((c) => ({
      value: c._id,
      label: c.name,
    }));
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            {imagePreview && (
              <img
                src={imagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
              />
            )}
            <br />
            <label>
              <span className="btn btn-info">Choose Image</span>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                className="d-none"
                onChange={(e) => {
                  const imageSource = e.target.files[0];
                  if (imageSource) {
                    this.setState({ imageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(imageSource);
                    reader.onloadend = function () {
                      this.setState({ imagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <MySelect
              label="Course"
              placeholder="Course"
              options={coursesDropdownList}
              name="course"
              onChange={(e) => {
                const course = e.target.value;
                form.course = course;
                errors.course = "";
                this.setState({ form, errors });
              }}
              value={form.course}
              error={errors.course}
            />
          </div>

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
            <Input
              label="rating"
              placeholder="rating"
              name="rating"
              onChange={(rating) => {
                form.rating = rating;
                errors.rating = "";
                this.setState({ form, errors });
              }}
              value={form.rating}
              error={errors.rating}
            />
          </div>
          <div className="col-12">
            <Input
              label="Review"
              type="textarea"
              rows={3}
              placeholder="Review"
              name="review"
              onChange={(review) => {
                form.review = review;
                errors.review = "";
                this.setState({ form, errors });
              }}
              value={form.review}
              error={errors.review}
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
                <h2 className="mb-0 float-left">Edit Testimonial</h2>
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
  editTestimonial: (params) => dispatch(editTestimonial(params)),
  getTestimonial: (params) => dispatch(getTestimonial(params)),
  getCoursesForDropdown: (params) => dispatch(getCoursesForDropdown(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditTestimonial);
