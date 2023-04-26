import React, { Component } from "react";
import { ListGroupItem, Button, Badge } from "reactstrap";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import Loader from "../../components/Loader";
import { connect } from "react-redux";
import {
  createChapter,
  editChapter,
  publishChapter,
  deleteChapter,
} from "../../store/api/chapters";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { basePath } from "../../configs";
import * as Yup from "yup";
import { handleErrors } from "../../helpers/error";
import { Link } from "react-router-dom";

class ChapterCard extends Component {
  state = {
    showLoader: false,
    editMode: false,
  };

  componentDidMount = () => {
    const { chapter } = this.props;
    if (!chapter._id) this.setState({ editMode: true });
  };

  onFormSubmit = (values) => {
    const { chapter, onUpdate = () => {} } = this.props;

    const payload = {
      body: { ...values, course: chapter.course },
      onSuccess: (res) => {
        onUpdate(res.data.data);
        this.setState({ editMode: false });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    };

    if (chapter._id) {
      payload.id = chapter._id;
      this.props.editChapter(payload);
    } else {
      this.props.createChapter(payload);
    }
  };

  deleteItem = (id) => {
    const conf = window.confirm("are you sure you want to delete?");
    if (!conf) return;
    const { onDelete = () => {} } = this.props;
    this.props.deleteChapter({
      id,
      onSuccess: () => {
        onDelete();
      },
    });
  };

  renderData = () => {
    const { editMode } = this.state;
    const { chapter, onUpdate = () => {} } = this.props;
    const { name, price } = chapter;

    return (
      <Formik
        initialValues={{ name: chapter.name || "", price: chapter.price || 0 }}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(1).required(),
          price: Yup.number().min(0).required(),
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
                    <Link to={`${basePath}/courses/chapters/${chapter._id}`}>
                      <h2 className="mb-0">{name}</h2>
                    </Link>
                  )}
                </div>
                <div className="col-2">
                  <p className="mb-1">Price</p>
                  {editMode ? (
                    <Input
                      value={values.price}
                      error={errors.price}
                      placeholder="Price"
                      name="price"
                      onChangeFormik={handleChange}
                      error={touched.price && errors.price && errors.price}
                    />
                  ) : (
                    <h2 className="mb-0">Rs.{price}</h2>
                  )}
                </div>
                <div className="col-2">
                  <p className="mb-1">Publish</p>
                  <Toggle
                    checked={chapter.published}
                    onChange={(checked) => {
                      if (!chapter._id)
                        return alert("Please Save a chapter before publishing");
                      this.setState({ showLoader: true });
                      this.props.publishChapter({
                        id: chapter._id,
                        body: { published: checked },
                        onSuccess: () => {
                          chapter.published = checked;
                          onUpdate(chapter);
                        },
                        onError: (err) => {
                          chapter.published = !checked;
                          onUpdate(chapter);
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
                        this.deleteItem(chapter._id);
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
    createChapter: (params) => dispatch(createChapter(params)),
    editChapter: (params) => dispatch(editChapter(params)),
    publishChapter: (params) => dispatch(publishChapter(params)),
    deleteChapter: (params) => dispatch(deleteChapter(params)),
  };
};

export default connect(null, mapDispatchToProps)(ChapterCard);
