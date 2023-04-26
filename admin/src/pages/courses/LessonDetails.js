import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
} from "reactstrap";
import ReactPlayer from "react-player";
import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import LessonCard from "../../components/Course/LessonCard";
import { connect } from "react-redux";
import SortableList from "../../components/sortable/SortableList";
import {
  getLesson,
  updateLessonVideo,
  updateLessonVideoCaptions,
  useAnotherVideo,
  editLessonMetaTags,
} from "../../store/api/lessons";
import { getQuizes, rearrangeQuizes } from "../../store/api/quizes";
import QuizCard from "../../components/Course/QuizCard";
import Input from "../../components/Inputs/Input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
class LessonDetails extends Component {
  state = {
    id: "", //chapter Id
    lesson: {
      name: "",
      chapter: {
        _id: "",
        name: "",
      },
      metaTitle: "",
      metaDescription: "",
      metaKeyWords: "",
    },

    quizes: [],
    showLoader: false,

    videoUrl: "",
    uploadingVideo: false,
    uploadProgress: 50,

    uploadingCaptions: false,
    captionUploadProgress: 50,
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadLesson(id);
    this.loadQuizes(id);
  };

  loadQuizes = (lessonId) => {
    this.props.getQuizes({
      lessonId,
      onSuccess: (res) => {
        this.setState({ quizes: res.data.data });
      },
    });
  };

  createQuiz = () => {
    const { id } = this.props.match.params;
    const quiz = {
      name: "",
      lesson: id,
      type: "multi-choice",
    };
    const { quizes } = this.state;
    quizes.push(quiz);
    this.setState({ quizes });
    window.scrollTo(0, document.body.scrollHeight);
  };

  loadLesson = (id) => {
    this.props.getLesson({
      id,
      onSuccess: (res) => {
        this.setState({ lesson: res.data.data });
        console.log(res.data.data);
      },
    });
  };

  renderOtherVideoForm = () => {
    return (
      <div className="row">
        <div className="col-10">
          <Input
            label="Video URL"
            value={this.state.videoUrl}
            onChange={(videoUrl) => {
              this.setState({ videoUrl });
            }}
          />
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary"
            style={{ marginTop: "33px" }}
            onClick={() => {
              let { videoUrl, id } = this.state;
              videoUrl = videoUrl.trim();
              if (!videoUrl) return alert("Video URL is required");

              this.setState({ showLoader: true });
              this.props.useAnotherVideo({
                id,
                body: { videoUrl },

                onSuccess: (res) => {
                  const { lesson } = this.state;
                  lesson.video = res.data.data.video;
                  this.setState({ lesson: { ...lesson }, videoUrl: "" });
                },
                onEnd: () => {
                  this.setState({ showLoader: false });
                },
              });
            }}
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  renderMetaForm = () => {
    const {
      lesson: { metaTitle, metaDescription, metaKeyWords },
    } = this.state;

    return (
      <Formik
        enableReinitialize={true}
        onSubmit={(values) => {
          this.setState({ showLoader: true });

          const { id } = this.state;

          this.props.editLessonMetaTags({
            id,
            body: { ...values },
            onSuccess: (res) => {
              const lesson = res.data.data;
              this.setState({ lesson });
            },
            onEnd: () => {
              this.setState({ showLoader: false });
            },
          });
        }}
        initialValues={{
          metaTitle,
          metaDescription,
          metaKeyWords,
        }}
        validationSchema={Yup.object().shape({
          metaTitle: Yup.string().min(1).required(),
          metaDescription: Yup.string().min(1).required(),
          metaKeyWords: Yup.string().min(1).required(),
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
              <div className="row">
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
  renderQuizes = () => {
    const { quizes } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={quizes}
          keyExtractor={(item, index) => {
            return item._id + "quiz" + index;
          }}
          onListSort={(list) => {
            this.setState({ quizes: list });
            this.props.rearrangeQuizes({
              body: { orderIds: list.map((quiz) => quiz._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <div className="rounded mb-1 bg-white">
                <QuizCard
                  quiz={item}
                  onUpdate={(newQuiz) => {
                    quizes[index] = newQuiz;
                    this.setState({ quizes });
                  }}
                  onDelete={() => {
                    quizes.splice(index, 1);
                    this.setState({ quizes });
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
    const {
      showLoader,
      lesson,
      uploadProgress,
      uploadingVideo,
      uploadingCaptions,
      captionUploadProgress,
    } = this.state;
    const { chapter, videoProcessingStatus } = lesson;
    return (
      <>
        <Header>
          <div>
            <h1 className="text-center course-title text-secondary">
              {chapter.name}
            </h1>
          </div>
        </Header>
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">{lesson.name}</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}

              {!uploadingVideo && (
                <>
                  {lesson.video ? (
                    <>
                      <ReactPlayer
                        controls={true}
                        playing={false}
                        url={lesson.video.replace("playlist", "360p")}
                        style={{ maxHeight: "250px" }}
                      />
                      <p>VIDEO URL: {lesson.video}</p>
                    </>
                  ) : (
                    <div>
                      <p>No Video Available</p>
                    </div>
                  )}
                </>
              )}

              {uploadingVideo ? (
                <>
                  <p className="mb-0">Uploading video {uploadProgress}%...</p>
                  <Progress value={`${uploadProgress}`} />
                </>
              ) : (
                <div className="clearfix my-1">
                  <label className="float-left">
                    <span className="btn btn-primary">Upload Video</span>
                    <input
                      type="file"
                      multiple={false}
                      accept="video/*"
                      className="d-none"
                      onChange={(e) => {
                        const video = e.target.files[0];
                        if (!video) return;
                        this.setState({
                          uploadProgress: 0,
                          uploadingVideo: true,
                        });
                        const { id } = this.state;
                        this.props.updateLessonVideo({
                          id,
                          body: { video },
                          onSuccess: () => {
                            lesson.videoProcessingStatus = "processing";
                            this.setState({ lesson });
                          },
                          onProgress: (prog) => {
                            this.setState({ uploadProgress: prog });
                          },
                          onEnd: () => {
                            this.setState({
                              uploadingVideo: false,
                              uploadProgress: 0,
                            });
                          },
                        });
                      }}
                    />
                  </label>
                  {videoProcessingStatus && (
                    <h2 className="float-left mt-1">
                      Processing Status: {videoProcessingStatus}
                    </h2>
                  )}
                </div>
              )}
              <br />

              {this.renderOtherVideoForm()}

              {lesson.videoCaptions && (
                <a href={lesson.videoCaptions}>{lesson.videoCaptions}</a>
              )}

              {uploadingCaptions ? (
                <>
                  <p className="mb-0">
                    Uploading Captions {captionUploadProgress}%...
                  </p>
                  <Progress value={`${captionUploadProgress}`} />
                </>
              ) : (
                <div className="clearfix my-1">
                  <label className="float-left">
                    <span className="btn btn-primary">Upload Captions</span>
                    <input
                      type="file"
                      multiple={false}
                      accept="*/*"
                      className="d-none"
                      onChange={(e) => {
                        const captions = e.target.files[0];
                        if (!captions) return;
                        this.setState({
                          uploadProgress: 0,
                          uploadingCaptions: true,
                        });
                        const { id } = this.state;
                        this.props.updateLessonVideoCaptions({
                          id,
                          body: { captions },
                          onSuccess: (res) => {
                            this.setState({ lesson: res.data.data });
                          },
                          onProgress: (prog) => {
                            this.setState({ captionUploadProgress: prog });
                          },
                          onEnd: () => {
                            this.setState({
                              uploadingCaptions: false,
                              captionUploadProgress: 0,
                            });
                          },
                        });
                      }}
                    />
                  </label>
                </div>
              )}

              {this.renderMetaForm()}
              <div className="clearfix my-2">
                <h2 className="float-left">Quizes</h2>
                <Button
                  className="float-right"
                  color="dark"
                  size="sm"
                  onClick={this.createQuiz}
                >
                  Create Quiz
                </Button>
              </div>

              {this.renderQuizes()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  getLesson: (params) => dispatch(getLesson(params)),
  updateLessonVideo: (params) => dispatch(updateLessonVideo(params)),
  getQuizes: (params) => dispatch(getQuizes(params)),
  rearrangeQuizes: (params) => dispatch(rearrangeQuizes(params)),
  updateLessonVideoCaptions: (params) =>
    dispatch(updateLessonVideoCaptions(params)),
  useAnotherVideo: (params) => dispatch(useAnotherVideo(params)),
  editLessonMetaTags: (params) => dispatch(editLessonMetaTags(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(LessonDetails);
