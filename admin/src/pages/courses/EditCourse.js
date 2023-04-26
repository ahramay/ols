import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Label,
} from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import RichEditor from "../../components/Inputs/RichEditor";
import InstructorSearch from "../../components/Course/InstructorSearch";
import ChapterCard from "../../components/Course/ChapterCard";
import { connect } from "react-redux";
import {
  getCourse,
  addCourseImage,
  getCourseImages,
  rearrangeCourseImages,
  deleteCourseImage,
  editCourse,
  getCourseInstructors,
} from "../../store/api/courses";
import { getCategories } from "../../store/api/categories";
import { getLanguages } from "../../store/api/languages";
import { getLevels } from "../../store/api/levels";
import { getChapters, rearrangeChapters } from "../../store/api/chapters";
import SortableList from "../../components/sortable/SortableList";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { basePath } from "../../configs";

class EditCourse extends Component {
  state = {
    id: "", //course Id
    categories: [],
    languages: [],
    levels: [],

    imageUploadLoader: false,
    imageUploadProgress: 0,
    courseImages: [],

    course: {
      name: "",
      price: "",
      category: {
        _id: "",
      },
      traits: "",
      language: {
        _id: "",
      },
      skillLevel: {
        _id: "",
      },
    },

    //instructors
    instructors: [],

    showLoader: true,

    //chapters
    chapterLoader: false,
    chapters: [],
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadCourse(id);
    this.loadCourseImages(id);
    this.loadChapters(id);
    this.loadInstructors(id);
    this.loadCategories();
    this.loadLanguages();
    this.loadLevels();
  };

  loadCourse = (id) => {
    this.setState({ showLoader: true });
    this.props.getCourse({
      id,
      onSuccess: (res) => {
        const { data: course } = res.data;
        this.setState({ course });

        console.log("NETWORK COURSE =>", course);
      },
      onEnd: () => {
        setTimeout(() => {
          this.setState({ showLoader: false });
        }, 200);
      },
    });
  };

  loadCourseImages = (id) => {
    this.props.getCourseImages({
      id,
      onSuccess: (res) => {
        this.setState({ courseImages: res.data.data });
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

  loadLanguages = () => {
    this.props.getLanguages({
      onSuccess: (res) => {
        this.setState({ languages: res.data.data });
      },
    });
  };

  loadLevels = () => {
    this.props.getLevels({
      onSuccess: (res) => {
        this.setState({ levels: res.data.data });
      },
    });
  };

  loadInstructors = (id) => {
    this.props.getCourseInstructors({
      id,
      onSuccess: (res) => {
        console.log("INSTRUCTORS", res.data.data);
        this.setState({ instructors: res.data.data });
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

  createNewChapter = () => {
    const { id } = this.props.match.params;
    const chap = {
      name: "",
      price: "",
      course: id,
      published: false,
    };
    const { chapters } = this.state;
    chapters.push(chap);
    this.setState({ chapters });
    window.scrollTo(0, document.body.scrollHeight);
  };

  courseForm = null;

  renderCourseImages = () => {
    const { courseImages, imageUploadLoader, imageUploadProgress } = this.state;

    return (
      <div>
        <h2>Images</h2>
        <div className="d-flex w-100" style={{ flexWrap: "wrap" }}>
          <SortableList
            className="d-flex"
            style={{ flexWrap: "wrap" }}
            data={courseImages}
            keyExtractor={(item, index) => `${index} + course Image`}
            axis="x"
            onListSort={(sorted) => {
              this.setState({ courseImages: sorted });
              const { id } = this.state;
              this.props.rearrangeCourseImages({
                id,
                body: { orderIds: sorted.map((image) => image._id) },
              });
            }}
            renderItem={(item, index) => {
              return (
                <div className="m-1 rounded overflow-hidden">
                  <div
                    style={{
                      width: "150px",
                      height: "120px",
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <Button
                      color="danger"
                      size="sm"
                      style={{ position: "absolute", top: 5, right: 5 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const conf = window.confirm(
                          "Are you sure you want to remove?"
                        );
                        if (!conf) return;

                        this.props.deleteCourseImage({
                          id: item._id,
                          onSuccess: () => {
                            courseImages.splice(index, 1);
                            this.setState(courseImages);
                          },
                        });
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              );
            }}
          />
          {/* {courseImages.map((image) => (
            
          ))} */}
          {imageUploadLoader ? (
            <div
              className="rounded float-left m-1 "
              style={{
                width: "120px",
                height: "120px",
                background: "rgba(0,0,0,0.03)",
                border: "5px dashed rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexDirection: "column",
              }}
            >
              <p
                className="text-center w-100 mb-0"
                style={{ fontSize: "30px" }}
              >
                {imageUploadProgress}%
              </p>

              <p className="mb-0">uploading...</p>
            </div>
          ) : (
            <label
              className="rounded float-left m-1 "
              style={{
                width: "120px",
                height: "120px",
                background: "rgba(0,0,0,0.03)",
                border: "5px dashed rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              Pick Image
              <input
                type="file"
                multiple={true}
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  const file = e.target.files["0"];
                  if (!file) return;
                  const { id } = this.state;
                  this.setState({
                    imageUploadLoader: true,
                    imageUploadProgress: 0,
                  });
                  this.props.addCourseImage({
                    id,
                    body: { image: file },
                    onProgress: (imageUploadProgress) => {
                      console.log(imageUploadProgress);
                      this.setState({ imageUploadProgress });
                    },
                    onSuccess: (res) => {
                      courseImages.push(res.data.data);
                    },
                    onEnd: () => {
                      this.setState({ imageUploadLoader: false });
                    },
                  });
                }}
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  renderInstructors = () => {
    const { instructors } = this.state;

    return (
      <div
        className="mb-3"
        style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
      >
        {instructors.map((ins, index) => {
          return (
            <div
              key={`${ins._id}`}
              className="m-1 p-2 position-relative rounded"
              style={{
                background: "rgba(0,0,0,0.07)",
                display: "flex",
                paddingRight: "15px",
              }}
            >
              <a
                href="#"
                style={{ position: "absolute", top: 1, right: 6 }}
                onClick={(e) => {
                  e.preventDefault();
                  instructors.splice(index, 1);
                  this.setState({ instructors });
                }}
              >
                <i className="fa fa-times"></i>
              </a>
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  background: "#ccc",
                  borderRadius: "45px",
                }}
              ></div>
              <div className="ml-2">
                <h3 className="mb-0">{`${ins.firstName} ${ins.lastName}`}</h3>
                <p className="mb-0" style={{ fontSize: "12px" }}>
                  {ins.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  renderForm = () => {
    const { course, categories, languages, levels } = this.state;

    const categoriesList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

    const languagesList = languages.map((lang) => ({
      value: lang._id,
      label: lang.name,
    }));

    const levelsList = levels.map((level) => ({
      value: level._id,
      label: level.name,
    }));

    const {
      name = "",
      traits = "",
      slug = "",
      description = "",
      price = 0,
      category = { _id: "" },
      lectures,
      duration = "",
      videoDuration = "",
      skillLevel = { _id: "" },
      language = { _id: "" },
      published = false,
      showReviews = false,
      metaTitle = "",
      metaDescription = "",
      metaKeyWords = "",
    } = course;

    return (
      <Formik
        onSubmit={(values) => {
          this.setState({ showLoader: true });
          const { instructors } = this.state;
          const { id } = this.state;

          const instructorIds = instructors.map((i) => i._id);
          this.props.editCourse({
            id,
            body: { ...values, instructors: instructorIds },
            onSuccess: (res) => {
              const course = res.data.data;
              this.setState({ course });
            },
            onEnd: () => {
              this.setState({ showLoader: false });
            },
          });
        }}
        initialValues={{
          name,
          slug,
          price,
          description,
          category: category._id,
          traits,
          lectures,
          duration,
          videoDuration,
          skillLevel: skillLevel._id,
          language: language._id,
          published,
          showReviews,
          metaTitle,
          metaDescription,
          metaKeyWords,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(1).required(),
          slug: Yup.string().min(1).required(),
          metaTitle: Yup.string().min(1).required(),
          metaDescription: Yup.string().min(1).required(),
          metaKeyWords: Yup.string().min(1).required(),
          description: Yup.string().min(1).required(),
          price: Yup.number().min(0).required(),
          category: Yup.string().min(1).required(),
          traits: Yup.string().min(3).required(),
          duration: Yup.string().min(1).required(),
          lectures: Yup.string().min(1).required(),
          videoDuration: Yup.string().min(1).required(),
          skillLevel: Yup.string().min(1).required(),
          language: Yup.string().min(1).required(),
          showReviews: Yup.boolean().required(),
          published: Yup.boolean().required(),
        })}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          submitForm,
          setFieldValue,
        }) => {
          return (
            <Form>
              <h2>Course Details</h2>
              <div className="row">
                <div className="col-8">
                  <Input
                    label="Name"
                    value={values.name}
                    error={errors.name}
                    autoFocus={true}
                    placeholder="Name"
                    name="name"
                    onChangeFormik={handleChange}
                    error={touched.name && errors.name && errors.name}
                  />
                </div>
                <div className="col-2 pt-2">
                  <Label className="form-control-label">Show Reviews</Label>
                  <br />
                  <Toggle
                    checked={values.showReviews}
                    onChange={(checked) => {
                      setFieldValue("showReviews", checked);
                    }}
                  />
                </div>
                <div className="col-2 pt-2">
                  <Label className="form-control-label">Published</Label>
                  <br />
                  <Toggle
                    checked={values.published}
                    onChange={(checked) => {
                      console.log("Toggle => ", checked);
                      setFieldValue("published", checked);
                    }}
                  />
                </div>

                <div className="col-12">
                  <Input
                    label="URL Slug"
                    value={values.slug}
                    error={errors.slug}
                    placeholder="Slug"
                    name="slug"
                    onChangeFormik={handleChange}
                    error={touched.slug && errors.slug}
                  />
                </div>
                <div className="col-12">
                  <RichEditor
                    value={values.description}
                    onChange={(desc) => {
                      setFieldValue("description", desc);
                    }}
                    error={
                      touched.description &&
                      errors.description &&
                      errors.description
                    }
                  />
                </div>

                <div className="col-12">
                  <Input
                    label="Meta Title"
                    value={values.metaTitle}
                    error={errors.metaTitle}
                    placeholder="metaTitle"
                    name="metaTitle"
                    onChangeFormik={handleChange}
                    error={touched.metaTitle && errors.metaTitle}
                  />
                </div>

                <div className="col-12">
                  <Input
                    type="textarea"
                    label="Meta Description"
                    value={values.metaDescription}
                    error={errors.metaDescription}
                    placeholder="metaDescription"
                    name="metaDescription"
                    onChangeFormik={handleChange}
                    error={touched.metaDescription && errors.metaDescription}
                  />
                </div>

                <div className="col-12">
                  <Input
                    type="textarea"
                    label="Meta Keywords"
                    value={values.metaKeyWords}
                    error={errors.metaKeyWords}
                    placeholder="metaKeyWords"
                    name="metaKeyWords"
                    onChangeFormik={handleChange}
                    error={touched.metaKeyWords && errors.metaKeyWords}
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Price"
                    value={values.price}
                    placeholder="Price"
                    name="price"
                    onChangeFormik={handleChange}
                    error={touched.price && errors.price && errors.price}
                  />
                </div>

                <div className="col-md-6">
                  <MySelect
                    label="Category"
                    placeholder="Choose a category"
                    options={categoriesList}
                    name="category"
                    onChange={handleChange}
                    value={values.category}
                    error={
                      touched.category && errors.category && errors.category
                    }
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="Duration (Hours)"
                    value={values.duration}
                    placeholder="Duration"
                    name="duration"
                    onChangeFormik={handleChange}
                    error={
                      touched.duration && errors.duration && errors.duration
                    }
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="Video Duration (Hours)"
                    value={values.videoDuration}
                    placeholder="Video Duration"
                    name="videoDuration"
                    onChangeFormik={handleChange}
                    error={
                      touched.videoDuration &&
                      errors.videoDuration &&
                      errors.videoDuration
                    }
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Lectures"
                    value={values.lectures}
                    placeholder="Lectures"
                    name="lectures"
                    onChangeFormik={handleChange}
                    error={
                      touched.lectures && errors.lectures && errors.lectures
                    }
                  />
                </div>

                <div className="col-md-6">
                  <MySelect
                    label="Skill Level"
                    value={values.skillLevel}
                    placeholder="Skill Level"
                    options={levelsList}
                    name="skillLevel"
                    onChange={handleChange}
                    error={
                      touched.skillLevel &&
                      errors.skillLevel &&
                      errors.skillLevel
                    }
                  />
                </div>
                {/* levelsList */}

                <div className="col-md-6">
                  <MySelect
                    label="Language"
                    placeholder="Choose a language"
                    options={languagesList}
                    name="language"
                    onChange={handleChange}
                    value={values.language}
                    error={
                      touched.language && errors.language && errors.language
                    }
                  />
                </div>
                <div className="col-12">
                  <Input
                    label="Course Features"
                    type="textarea"
                    value={values.traits}
                    placeholder="write comma saperated list of features."
                    name="traits"
                    onChangeFormik={handleChange}
                    error={touched.traits && errors.traits && errors.traits}
                  />

                  {values.traits && (
                    <ul>
                      {values.traits.split(",").map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="col-12 text-center">
                  <Button type="submit" color="primary" onClick={submitForm}>
                    Save
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  renderChapters = () => {
    const { chapters } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={chapters}
          keyExtractor={(item, index) => {
            return item._id + "chapters" + index;
          }}
          onListSort={(list) => {
            this.setState({ chapters: list });
            this.props.rearrangeChapters({
              body: { orderIds: list.map((chapter) => chapter._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <div className="rounded mb-1 bg-white">
                <ChapterCard
                  chapter={item}
                  onUpdate={(newChap) => {
                    chapters[index] = newChap;
                    this.setState(newChap);
                  }}
                  onDelete={() => {
                    chapters.splice(index, 1);
                    this.setState({ chapters });
                  }}
                />
              </div>
            );
          }}
        />
      </ListGroup>
    );
  };
  render() {
    const { showLoader, course, id, showChapterModal } = this.state;
    return (
      <>
        <Header>
          <div>
            <h1 className="text-center course-title text-secondary">
              {course.name}
            </h1>
          </div>
        </Header>
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {this.renderCourseImages()}

              <div className="row mt-4">
                <div className="col-md-2">
                  <h2 className="float-left mt-1">Instructors</h2>
                </div>
                <div className="col-12">{this.renderInstructors()}</div>

                <div className="col-md-12">
                  <InstructorSearch
                    onChoose={(ins) => {
                      const { instructors } = this.state;

                      const index = instructors.findIndex((item) => {
                        return item._id === ins._id;
                      });

                      if (index !== -1) return;

                      instructors.push(ins);
                      this.setState({ instructors });
                    }}
                  />
                </div>
              </div>

              {!showLoader && this.renderForm()}
              {/* Chapters */}

              <div className="clearfix my-2">
                <h2 className="float-left">Chapters</h2>
                <Button
                  className="float-right"
                  color="dark"
                  size="sm"
                  onClick={this.createNewChapter}
                >
                  Create Chapter
                </Button>
              </div>
              <div>{this.renderChapters()}</div>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  getCourse: (params) => dispatch(getCourse(params)),
  addCourseImage: (params) => dispatch(addCourseImage(params)),
  getCategories: (params) => dispatch(getCategories(params)),
  getChapters: (params) => dispatch(getChapters(params)),
  rearrangeChapters: (params) => dispatch(rearrangeChapters(params)),
  getCourseImages: (params) => dispatch(getCourseImages(params)),
  rearrangeCourseImages: (params) => dispatch(rearrangeCourseImages(params)),
  deleteCourseImage: (params) => dispatch(deleteCourseImage(params)),
  editCourse: (params) => dispatch(editCourse(params)),
  getCourseInstructors: (params) => dispatch(getCourseInstructors(params)),
  getLanguages: (params) => dispatch(getLanguages(params)),
  getLevels: (params) => dispatch(getLevels(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditCourse);
