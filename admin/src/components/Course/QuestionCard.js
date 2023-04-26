import React, { Component } from "react";
import { ListGroupItem, ListGroup, Button, Badge } from "reactstrap";
import Input from "../../components/Inputs/Input";
import RichEditor from "../../components/Inputs/RichEditor";
import MySelect from "../../components/Inputs/MySelect";
import Toggle from "../../components/Inputs/Toggle";
import Loader from "../../components/Loader";
import { connect } from "react-redux";
import {
  createQuestion,
  editQuestion,
  deleteQuestion,
  setQimage,
} from "../../store/api/questions";
import SortableList from "../sortable/SortableList";
import { Formik, Form } from "formik";
import { basePath } from "../../configs";
import * as Yup from "yup";
import { handleErrors } from "../../helpers/error";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import OptionForm from "./OptionForm";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import renderHTML from "react-render-html";

class QuestionCard extends Component {
  state = {
    showLoader: false,
    editMode: false,
    localOptions: [],

    timePickerOpen: false,
  };

  componentDidMount = () => {
    const { question } = this.props;
    if (!question._id) this.setState({ editMode: true });

    this.setState({
      localOptions: question.options || [],
      imagePreview: question.image || "",
    });
  };

  createOption = () => {
    const { localOptions } = this.state;
    const id = uuidv4();
    const opt = {
      id,
      name: "",
      isCorrect: false,
      sortOrder: 0,
    };
    localOptions.push(opt);
    this.setState({ localOptions });
  };

  deleteItem = () => {
    const { question, onDelete = () => {} } = this.props;
    const confirmation = window.confirm("Are you sure you want to delete ?");
    if (!confirmation) return;

    this.setState({ showLoader: true });
    this.props.deleteQuestion({
      id: question._id,
      onSuccess: onDelete,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  onFormSubmit = (values) => {
    const { question, onUpdate = () => {} } = this.props;
    const { localOptions } = this.state;
    const payload = {
      body: { ...values, quiz: question.quiz, options: localOptions },

      onSuccess: (res) => {
        onUpdate(res.data.data);
        this.setState({ editMode: false });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    };

    if (question.options) {
      payload.body.options = question.options;
    }

    if (question._id) {
      payload.id = question._id;
      this.props.editQuestion(payload);
    } else {
      this.props.createQuestion(payload);
    }
  };

  renderData = () => {
    let { editMode, localOptions, timePickerOpen } = this.state;
    const { question, onUpdate = () => {} } = this.props;
    const {
      name,
      type,
      marks = 1,
      allowedTime = "",
      reference = "",
    } = question;

    localOptions.sort((a, b) => {
      if (a.sortOrder > b.sortOrder) return 1;
      if (b.sortOrder > a.sortOrder) return -1;
      return 0;
    });

    return (
      <Formik
        initialValues={{
          name: question.name || "",
          type: question.type || "multi-choice",
          marks: question.marks || 1,
          allowedTime,
          reference,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().optional(),
          type: Yup.string().min(1).required(),
          marks: Yup.number().min(1).optional(),
          allowedTime: Yup.string().min(0).optional(),
          reference: Yup.string().min(0).optional(),
        })}
        onSubmit={this.onFormSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          submitForm,
          setFieldValue,
        }) => {
          console.log(errors);
          return (
            <Form>
              <div className="row">
                <div className="col-6">
                  <p className="mb-1">Title</p>
                  {editMode ? (
                    <>
                      <RichEditor
                        placeholder="Name"
                        autoFocus={true}
                        value={values.name}
                        name="name"
                        onChange={(name) => {
                          setFieldValue("name", name);
                        }}
                        error={touched.name && errors.name && errors.name}
                      />
                    </>
                  ) : (
                    <Link
                      to={`${basePath}/courses/chapters/lessons/quiz/${question._id}`}
                    >
                      {name && renderHTML(name)}
                    </Link>
                  )}
                </div>
                <div className="col-2">
                  <p className="mb-1">Marks</p>
                  {editMode ? (
                    <Input
                      placeholder="Marks"
                      name="marks"
                      onChangeFormik={handleChange}
                      value={values.marks}
                      error={touched.marks && errors.marks && errors.marks}
                    />
                  ) : (
                    marks
                  )}
                </div>

                <div className="col-2">
                  <p className="mb-1">Type</p>
                  {editMode ? (
                    <MySelect
                      placeholder="Select Type"
                      options={[
                        { label: "Multi Choice ", value: "multi-choice" },
                        { label: "Writable", value: "writable" },
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
                <div className="col-12">
                  <p className="mb-1">Reference</p>
                  {editMode && question._id ? (
                    <>
                      <RichEditor
                        placeholder="Reference"
                        value={values.reference}
                        name="reference"
                        onChange={(reference) => {
                          setFieldValue("reference", reference);
                        }}
                        error={
                          touched.reference &&
                          errors.reference &&
                          errors.reference
                        }
                      />
                    </>
                  ) : (
                    <p className="mb-0 text-sm">
                      {renderHTML(reference || "No reference defined.")}
                    </p>
                  )}
                </div>
                {this.props.question && this.props.question._id ? (
                  <div className="col-9">
                    {this.state.imagePreview && (
                      <>
                        <img
                          src={this.state.imagePreview}
                          style={{ maxWidth: "150px" }}
                        />
                        <br />
                      </>
                    )}

                    {editMode && (
                      <>
                        <a
                          className="btn btn-danger btn-sm"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            const { question } = this.props;
                            if (!question._id)
                              return alert(
                                "Please save question before removing the image"
                              );
                            this.props.setQimage({
                              id: question._id,
                              onSuccess: () => {
                                this.setState({ imagePreview: null });
                              },
                            });
                          }}
                        >
                          Delete Image
                        </a>
                        <label>
                          <span className="btn btn-dark btn-sm">
                            Choose Image
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            multiple={false}
                            className="d-none"
                            onChange={(e) => {
                              const image = e.target.files[0];
                              const { question } = this.props;
                              if (!question._id)
                                return alert(
                                  "Please save question before adding the image"
                                );

                              if (image) {
                                const reader = new FileReader();
                                reader.readAsDataURL(image);
                                reader.onloadend = function (e) {
                                  this.setState({
                                    imagePreview: reader.result,
                                  });
                                }.bind(this);
                              }

                              this.props.setQimage({
                                id: question._id,
                                body: { image },
                              });
                            }}
                          />
                        </label>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="m-2 font-weight-bold">
                    Save the question before adding image.
                  </p>
                )}
                <div className="col-3">
                  {editMode ? (
                    <>
                      <p className="mb-1">Allowed Time</p>
                      <TimePicker
                        style={{
                          position: "relative",
                        }}
                        defaultValue={
                          values.allowedTime
                            ? moment(values.allowedTime, "HH:mm:ss")
                            : null
                        }
                        open={timePickerOpen}
                        onOpen={() => {
                          this.setState({ timePickerOpen: true });
                        }}
                        onClose={() => {
                          this.setState({ timePickerOpen: false });
                        }}
                        onChange={(time) => {
                          if (!time) {
                            setFieldValue("allowedTime", "");
                            return;
                          }
                          setFieldValue("allowedTime", time.format("HH:mm:ss"));
                        }}
                        // inputIcon={(useIcon && inputIcon) || undefined}
                        // clearIcon={(useIcon && clearIcon) || undefined}
                        // focusOnOpen
                      />
                    </>
                  ) : (
                    <>
                      {values.allowedTime && (
                        <>
                          <p className="mb-1">Allowed Time</p>
                          <Badge color="primary">{values.allowedTime}</Badge>
                        </>
                      )}
                    </>
                  )}
                </div>

                {type === "multi-choice" && (
                  <div className="col-12">
                    <div className="clearfix my-2">
                      <Button
                        color="dark"
                        size="sm"
                        className="float-right"
                        onClick={this.createOption}
                      >
                        Create Option
                      </Button>
                    </div>

                    <ol>
                      <SortableList
                        data={localOptions}
                        keyExtractor={(item, index) => {
                          return item.id;
                        }}
                        onListSort={(list) => {
                          const sortedOptions = list.map((opt, index) => {
                            opt.sortOrder = index;
                            return opt;
                          });
                          this.setState({ localOptions: sortedOptions });
                          submitForm();
                        }}
                        renderItem={(opt, ind) => {
                          return (
                            <li>
                              <OptionForm
                                option={opt}
                                onUpdate={(updatedOpt) => {
                                  localOptions[ind] = updatedOpt;
                                  this.setState({
                                    localOptions,
                                    editMode: true,
                                  });
                                  // submitForm();
                                }}
                                onDelete={() => {
                                  const conf = window.confirm(
                                    "Are you sure you want to delete?"
                                  );
                                  if (!conf) return;
                                  localOptions.splice(ind, 1);
                                  this.setState({ localOptions });
                                  submitForm();
                                }}
                              />
                            </li>
                          );
                        }}
                      />
                    </ol>
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
    createQuestion: (params) => dispatch(createQuestion(params)),
    editQuestion: (params) => dispatch(editQuestion(params)),
    deleteQuestion: (params) => dispatch(deleteQuestion(params)),
    setQimage: (params) => dispatch(setQimage(params)),
  };
};

export default connect(null, mapDispatchToProps)(QuestionCard);
