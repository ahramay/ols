import React, { Component } from "react";
import { ListGroupItem, Button, Badge } from "reactstrap";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import Toggle from "../../components/Inputs/Toggle";
import Loader from "../../components/Loader";
import { connect } from "react-redux";
import { createQuiz, editQuiz, deleteQuiz } from "../../store/api/quizes";
import { Formik, Form } from "formik";
import { basePath } from "../../configs";
import * as Yup from "yup";
import { handleErrors } from "../../helpers/error";
import { Link } from "react-router-dom";

class QuestionModal extends Component {
  state = {
    showLoader: false,
    editMode: false,
  };

  componentDidMount = () => {
    const { quiz } = this.props;
    if (!quiz._id) this.setState({ editMode: true });
  };

  deleteItem = () => {
    const { quiz, onDelete = () => {} } = this.props;
    const confirmation = window.confirm("Are you sure you want to delete ?");
    if (!confirmation) return;

    this.setState({ showLoader: true });
    this.props.deleteQuiz({
      id: quiz._id,
      onSuccess: onDelete,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (values) => {
    const { quiz, onUpdate = () => {} } = this.props;

    const payload = {
      body: { ...values, lesson: quiz.lesson },
      onSuccess: (res) => {
        onUpdate(res.data.data);
        this.setState({ editMode: false });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    };

    if (quiz._id) {
      payload.id = quiz._id;
      this.props.editQuiz(payload);
    } else {
      this.props.createQuiz(payload);
    }
  };

  renderData = () => {
    const { editMode } = this.state;
    const { quiz, onUpdate = () => {} } = this.props;
    const { name, type } = quiz;

    return (
      <Formik
        initialValues={{
          name: quiz.name || "",
          type: quiz.type || "video",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(1).required(),
          type: Yup.string().min(1).required(),
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
                      to={`${basePath}/courses/chapters/lessons/quiz/${quiz._id}`}
                    >
                      <h2 className="mb-0">{name}</h2>
                    </Link>
                  )}
                </div>
                <div className="col-2">
                  <p className="mb-1">Type</p>
                  {editMode ? (
                    <MySelect
                      placeholder="Select Type"
                      options={[
                        { label: "Video", value: "video" },
                        { label: "Standalone", value: "standalone" },
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
    createQuiz: (params) => dispatch(createQuiz(params)),
    editQuiz: (params) => dispatch(editQuiz(params)),
    deleteQuiz: (params) => dispatch(deleteQuiz(params)),
  };
};

export default connect(null, mapDispatchToProps)(QuestionModal);
