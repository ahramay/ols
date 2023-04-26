import React, { Component } from "react";
import { ListGroupItem, Button, Badge } from "reactstrap";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import Toggle from "../../components/Inputs/Toggle";
import Loader from "../../components/Loader";
import { connect } from "react-redux";
import {
  createLesson,
  editLesson,
  publishLesson,
  deleteLesson,
} from "../../store/api/lessons";
import { Formik, Form } from "formik";
import { basePath } from "../../configs";
import * as Yup from "yup";
import { handleErrors } from "../../helpers/error";
import { Link } from "react-router-dom";

class LessonCard extends Component {
  state = {
    showLoader: false,
    editMode: false,
  };

  componentDidMount = () => {
    const { lesson } = this.props;
    if (!lesson._id) this.setState({ editMode: true });
  };

  deleteItem = () => {
    const { lesson, onDelete = () => {} } = this.props;
    const confirmation = window.confirm("Are you sure you want to delete ?");
    if (!confirmation) return;

    this.setState({ showLoader: true });
    this.props.deleteLesson({
      id: lesson._id,
      onSuccess: onDelete,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (values) => {
    const { lesson, onUpdate = () => {} } = this.props;

    const payload = {
      body: { ...values, chapter: lesson.chapter },
      onSuccess: (res) => {
        onUpdate(res.data.data);
        this.setState({ editMode: false });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    };

    if (lesson._id) {
      payload.id = lesson._id;
      this.props.editLesson(payload);
    } else {
      this.props.createLesson(payload);
    }
  };

  renderData = () => {
    const { editMode } = this.state;
    const { lesson, onUpdate = () => {} } = this.props;
    const { name, type, accessibility, slug } = lesson;

    return (
      <Formik
        initialValues={{
          name: lesson.name || "",
          slug: lesson.slug || "",
          type: lesson.type || "video",
          accessibility: lesson.accessibility || "paid",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(1).required(),
          type: Yup.string().min(1).required(),
          accessibility: Yup.string().min(1).required(),
        })}
        onSubmit={this.onFormSubmit}
      >
        {({ values, touched, errors, handleChange, submitForm }) => {
          return (
            <Form>
              <div className="row">
                <div className="col">
                  <p className="mb-1">Title</p>
                  {editMode ? (
                    <Input
                      value={values.name}
                      error={errors.name}
                      autoFocus={true}
                      placeholder="Name"
                      name="name"
                      onChangeFormik={handleChange}
                      error={touched.name && errors.name && errors.name}
                    />
                  ) : (
                    <Link
                      to={`${basePath}/courses/chapters/lessons/${lesson._id}`}
                    >
                      <h2 className="mb-0">{name}</h2>
                    </Link>
                  )}
                </div>

                <div className="col-2">
                  <p className="mb-1">Accessibility</p>
                  {editMode ? (
                    <MySelect
                      placeholder="accessibility"
                      options={[
                        { label: "Paid", value: "paid" },
                        { label: "Free", value: "free" },
                      ]}
                      name="accessibility"
                      onChange={handleChange}
                      value={values.accessibility}
                      error={
                        touched.accessibility &&
                        errors.accessibility &&
                        errors.accessibility
                      }
                    />
                  ) : (
                    accessibility
                  )}
                </div>

                <div className="col-2">
                  <p className="mb-1">Type</p>
                  {editMode ? (
                    <MySelect
                      placeholder="Select Type"
                      options={[
                        { label: "Video", value: "video" },
                        { label: "Quiz", value: "quiz" },
                      ]}
                      name="type"
                      onChange={handleChange}
                      value={values.type}
                      error={touched.type && errors.type && errors.type}
                    />
                  ) : (
                    type
                  )}
                </div>

                <div className="col-2">
                  <p className="mb-1">Publish</p>
                  <Toggle
                    checked={lesson.published}
                    onChange={(checked) => {
                      if (!lesson._id)
                        return alert("Please Save Lesson before publishing");
                      this.setState({ showLoader: true });
                      this.props.publishLesson({
                        id: lesson._id,
                        body: { published: checked },
                        onSuccess: () => {
                          lesson.published = checked;
                          onUpdate(lesson);
                        },
                        onError: (err) => {
                          lesson.published = !checked;
                          onUpdate(lesson);
                          handleErrors(err);
                        },
                        onEnd: () => {
                          this.setState({ showLoader: false });
                        },
                      });
                    }}
                  />
                </div>
                <div className="col-2">
                  <div className="clearfix">
                    <Button
                      color="danger"
                      size="sm"
                      className="float-right"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.deleteItem();
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>

                    {editMode ? (
                      <Button
                        color="success"
                        size="sm"
                        className="float-right mr-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          submitForm();
                        }}
                      >
                        <i className="fas fa-save"></i>
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        size="sm"
                        className="float-right mr-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.setState({ editMode: true });
                        }}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Button>
                    )}
                  </div>
                </div>

                {editMode ? (
                  <div className="col-12">
                    <Input
                      value={values.slug}
                      error={errors.slug}
                      autoFocus={true}
                      placeholder="slug"
                      name="slug"
                      onChangeFormik={handleChange}
                      error={touched.slug && errors.slug && errors.slug}
                    />
                  </div>
                ) : (
                  <div className="col-12">
                    <p>{slug}</p>
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };
  render() {
    const { showLoader } = this.state;
    return (
      <ListGroupItem className="course-card-body pb-2 position-relative">
        {showLoader && (
          <div className="overlapping-loader">
            <Loader />
          </div>
        )}
        {this.renderData()}
      </ListGroupItem>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createLesson: (params) => dispatch(createLesson(params)),
    editLesson: (params) => dispatch(editLesson(params)),
    publishLesson: (params) => dispatch(publishLesson(params)),
    deleteLesson: (params) => dispatch(deleteLesson(params)),
  };
};

export default connect(null, mapDispatchToProps)(LessonCard);
