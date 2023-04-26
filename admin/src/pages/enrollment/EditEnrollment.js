import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";
import { ListGroup, ListGroupItem } from "reactstrap";
import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import SearchSelect from "../../components/Inputs/SearchSelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import {
  getCoursesForDropdown,
  editEnrollment,
  geEnrollment,
} from "../../store/api/courses";
import { getChapters } from "../../store/api/chapters";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const schema = {
  email: Joi.string().email().min(1).trim().required(),
  course: Joi.string().max(30).trim().required(),
  chapters: Joi.array().items().min(0).required(),
  completeCourse: Joi.boolean().required(),
  startDate: Joi.number().min(0).required(),
  endDate: Joi.number().min(0).required(),
  chapterEnrollments: Joi.array().min(0).required(),
};

class EditEnrollmentPage extends Component {
  state = {
    id: "",
    chapters: [],
    courses: [],
    form: {
      email: "",
      course: "",
      chapters: [],
      chapterEnrollments: [],
      completeCourse: false,
      startDate: new Date(),
      endDate: new Date(),
    },
    errors: {},
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadCourses();
    this.loadEnrollment(id);
  };

  loadEnrollment = (id) => {
    this.setState({ showLoader: true });
    this.props.geEnrollment({
      id,
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];
        form.email = res.data.data.user.email;
        form.endDate = moment(form.endDate, "X").toDate();
        form.startDate = moment(form.startDate, "X").toDate();
        this.setState({ form });
        this.loadChapters(form.course);
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

  loadChapters = (courseId) => {
    this.props.getChapters({
      courseId,
      onSuccess: (res) => {
        this.setState({ chapters: res.data.data });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id } = this.state;
    const data = {
      ...form,
      startDate: moment(form.startDate).format("X"),
      endDate: moment(form.endDate).format("X"),
    };

    let lastEndDate = 0;

    form.chapterEnrollments.forEach((ch) => {
      if (!lastEndDate) {
        lastEndDate = ch.endDate;
      }

      if (lastEndDate && parseInt(ch.endDate) > parseInt(lastEndDate)) {
        lastEndDate = ch.endDate;
      }
    });

    data.endDate = lastEndDate;
    data.chapters = form.chapterEnrollments.map((c) => c.chapter);
    const errors = validateSchema(data, schema);
    if (errors) {
      console.log("ERRORS => ", errors);
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });

    this.props.editEnrollment({
      id,
      body: data,
      onSuccess: () => {},
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderChapters = () => {
    const { chapters, form } = this.state;
    const { chapterEnrollments } = form;
    const currentTimeStamp = moment().format("X");
    return (
      <ListGroup className="w-100">
        {chapters.map((chap) => {
          const enrolled = chapterEnrollments.find(
            (chapEnr) =>
              chapEnr.chapter === chap._id &&
              parseInt(chapEnr.endDate) >= currentTimeStamp
          );

          const checked = enrolled ? true : false;

          return (
            <ListGroupItem key={chap._id}>
              <div className="row">
                <div className="col-4">{chap.name}</div>
                {checked && (
                  <div className="col-6">
                    <label class="form-control-label">End Date</label>
                    <br />
                    <DatePicker
                      selected={moment(enrolled.endDate, "X").toDate()}
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="time"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      showTimeSelect
                      onChange={(date) => {
                        const newEndDate = moment(date).format("X");

                        const index = chapterEnrollments.findIndex(
                          (chapEnr) =>
                            chapEnr.chapter === chap._id &&
                            parseInt(chapEnr.endDate) >= currentTimeStamp
                        );

                        if (index !== -1) {
                          chapterEnrollments[index].endDate = newEndDate;
                          form.chapterEnrollments = chapterEnrollments;
                          this.setState({ form });
                        }
                      }}
                      customInput={<input className="form-control w-100" />}
                    />
                  </div>
                )}
                <div className="col-2">
                  <Toggle
                    checked={checked}
                    onChange={(checked) => {
                      if (checked) {
                        const chapEnrollment = {
                          chapter: chap._id,
                          startDate: moment().format("X"),
                          endDate: moment().add("years", 1).format("X"),
                        };
                        chapterEnrollments.push(chapEnrollment);
                        form.chapterEnrollments = chapterEnrollments;
                        this.setState({ form });
                      } else {
                        const index = chapterEnrollments.findIndex(
                          (chapEnr) =>
                            chapEnr.chapter === chap._id &&
                            parseInt(chapEnr.endDate) >= currentTimeStamp
                        );

                        if (index !== -1) {
                          chapterEnrollments.splice(index, 1);
                          form.chapterEnrollments = chapterEnrollments;
                          this.setState({ form });
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  renderForm = () => {
    const { form, errors, chapters, courses } = this.state;

    const coursesDropdownList = courses.map((course) => ({
      value: course._id,
      label: course.name,
    }));

    const chaptersDropdownList = chapters.map((ch) => ({
      value: ch._id,
      label: ch.name,
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

          <div className="col-10">
            <MySelect
              label="Course"
              placeholder="Course"
              options={coursesDropdownList}
              name="course"
              onChange={(e) => {
                const course = e.target.value;
                form.course = course;
                form.chapters = [];
                errors.course = "";
                this.setState({ form, errors });
                this.loadChapters(course);
              }}
              value={form.course}
              error={errors.course}
            />
          </div>
          <div className="col-2">
            <label class="form-control-label">Complete Course</label>
            <Toggle
              checked={form.completeCourse}
              onChange={(completeCourse) => {
                form.completeCourse = completeCourse;
                this.setState({ form });
              }}
            />
          </div>
          {this.renderChapters()}

          {/* <div className="col-6">
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
          </div> */}

          {/* <div className="col-6">
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
          </div> */}

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
                <h2 className="mb-0 float-left">Edit Enrollment</h2>
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
  getChapters: (params) => dispatch(getChapters(params)),
  getCoursesForDropdown: (params) => dispatch(getCoursesForDropdown(params)),
  editEnrollment: (params) => dispatch(editEnrollment(params)),
  geEnrollment: (params) => dispatch(geEnrollment(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditEnrollmentPage);
