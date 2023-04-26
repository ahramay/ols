import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";
import renderHTML from "react-render-html";
import ReactStars from "react-rating-stars-component";
import tickboxImage from "../assets/img/tick.png";
import {
  loadFullCourse,
  addCourseReview,
  loadReviews,
  deleteReview,
  setFeedbackAsked,
} from "../store/api/courses";
import { addItemToCartApi } from "../store/api/cart";
import { addCourseFeedback } from "../store/api/courseFeedbacks";

import LessonCard from "./Course/LessonCard";
import { Accordion, Card, Modal, Button } from "react-bootstrap";
import {
  setLoginModalClosable,
  setLoginModalVisibility,
} from "../store/ui/loginModal";
import { setRegisterModalClosable } from "../store/ui/registerModal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";
import moment from "moment";
import { formatPrice } from "../helpers/priceFormater";
import ForumThreads from "./Course/ForumThreads";
import ShareLink from "../components/ShareLink";
import http from "../services/http";
import { setCoursePageData } from "../store/ui/coursePage";
import { Helmet } from "react-helmet";
import storage from "../services/storage";

// import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView, MDBContainer } from
// "mdbreact";

const Testimonials = loadable(() => import("../components/Testimonial"), {
  ssr: false,
});
const CourseImagesSlider = loadable(
  () => import("../components/CourseImagesSlider"),
  {
    ssr: false,
  }
);

const CoursePage = (props) => {
  const { courseId, lessonId } = props.match.params;

  const dispatch = useDispatch();
  //tabs
  const [detailTab, setDetailTab] = useState("Videos");

  const cart = useSelector((state) => state.entities.cart);
  const authToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [list, setList] = useState([]);

  const [feedbackModalVisibility, setFeedbackModalVisibility] = useState(false);

  const [traits, setTraits] = useState("");
  const courseData = useSelector((state) => state.ui.coursePage.data);
  // const lessId = useSelector(
  //   (state) => state.entities.courses[0].list[].lesson[0].slug
  // );

  // console.log("lesson list", list);

  //currentCourse
  const [currentCourse, setCurrentCourse] = useState({
    _id: "",
    name: "",
    price: 0,
    description: "",
    rating: 0,
    totalRatingCount: "",
    duration: "",
    videoDuration: "",
    lectures: "",
    teachers: [],
    chapters: [],
    category: {
      name: "",
    },
    traits: [],
    language: {
      name: "",
    },
    skillLevel: {
      name: "",
    },
    feedbackAsked: false,
    startingVideoId: "",
    isEnrolled: false,
    enrolledChapters: [],
    watchedVideos: [],
  });

  useEffect(() => {
    dispatch(
      loadFullCourse({
        id: courseId,
        onSuccess: (res) => {
          if (res.data.data.chapters[0].lessons) {
            setList(res.data.data.chapters[0].lessons);
          }

          if (lessonId) {
            if (
              !authToken &&
              res.data.data.chapters &&
              res.data.data.chapters[0] &&
              res.data.data.chapters[0].lessons &&
              res.data.data.chapters[0].lessons[0] &&
              !(
                res.data.data.chapters[0].lessons[0]._id === lessonId ||
                res.data.data.chapters[0].lessons[0].slug === lessonId
              )
            ) {
              dispatch(setLoginModalVisibility(true));
              dispatch(setLoginModalClosable(false));
              dispatch(setRegisterModalClosable(false));
            }
            let currentChapterId = "";
            res.data.data.chapters;
            for (let i = 0; i < res.data.data.chapters.length; ++i) {
              const ch = res.data.data.chapters[i];
              if (ch) {
                for (let j = 0; j < ch.lessons.length; ++j) {
                  const le = ch.lessons[j];

                  if (le._id === lessonId) {
                    currentChapterId = ch._id;
                    break;
                  }
                }
              }
            }
            setSelectedAccordian(currentChapterId);
          }

          setCurrentCourse(res.data.data);

          //loading reviews
          dispatch(
            loadReviews({
              id: res.data.data._id,
              onSuccess: (res) => {
                setReviews(res.data.data);
              },
            })
          );
        },
      })
    );
  }, [props]);

  useEffect(() => {
    if (currentCourse.feedbackAsked) return;
    if (!currentCourse.watchedVideos) return;
    if (currentCourse.watchedVideos.length < 5) return;
    setFeedbackModalVisibility(true);
    dispatch(setFeedbackAsked({ id: currentCourse._id }));
  }, [currentCourse.watchedVideos]);

  const moveToPrevLesson = () => {
    const tkn = storage.get("xAuthToken");
    if (!tkn) {
      dispatch(setLoginModalVisibility(true));
      dispatch(setLoginModalClosable(false));
      dispatch(setRegisterModalClosable(false));
    }
    let currentLessonIndex = -1;
    let prevLessonIndex = -1;

    let currentChapterIndex = -1;
    let prevChapterIndex = -1;

    const { chapters } = currentCourse;

    chapters.forEach((chap, chapIndex) => {
      if (!chap.lessons) chap.lessons = [];
      for (let i = 0; i < chap.lessons.length; ++i) {
        if (chap.lessons[i]) {
          //

          if (chap.lessons[i]._id === lessonId) {
            ///chap
            currentChapterIndex = chapIndex;
            prevChapterIndex = chapIndex - 1;
            ////// lesson
            currentLessonIndex = i;
            prevLessonIndex = i - 1;
          }
        }
      }
    });

    if (
      currentLessonIndex < 0 ||
      // prevLessonIndex < 0 ||
      currentChapterIndex < 0
      // prevChapterIndex < 0
    ) {
      return;
    }

    const currentChap = chapters[currentChapterIndex];
    const prevChap = chapters[prevChapterIndex];

    let prevLesson = currentChap.lessons[prevLessonIndex];

    if (!prevLesson) {
      if (prevChap) prevLesson = prevChap.lessons[0];
    }

    if (!prevLesson) return;

    props.history.push(`/course/${courseId}/${prevLesson._id}`);
  };

  const moveToNextLesson = () => {
    const tkn = storage.get("xAuthToken");
    if (!tkn) {
      dispatch(setLoginModalVisibility(true));
      dispatch(setLoginModalClosable(false));
      dispatch(setRegisterModalClosable(false));
    }
    let currentLessonIndex = -1;
    let nextLessonIndex = -1;

    let currentChapterIndex = -1;
    let nextChapterIndex = -1;

    const { chapters } = currentCourse;

    chapters.forEach((chap, chapIndex) => {
      if (!chap.lessons) chap.lessons = [];

      for (let i = 0; i < chap.lessons.length; ++i) {
        if (chap.lessons[i]) {
          if (
            chap.lessons[i]._id === lessonId ||
            chap.lessons[i].slug === lessonId
          ) {
            ///chap
            currentChapterIndex = chapIndex;
            nextChapterIndex = chapIndex + 1;
            ////// lesson
            currentLessonIndex = i;
            nextLessonIndex = i + 1;
            break;
          }
        }
      }
    });
    if (
      currentLessonIndex < 0 ||
      nextLessonIndex < 0 ||
      currentChapterIndex < 0 ||
      nextChapterIndex < 0
    ) {
      return;
    }
    const currentChap = chapters[currentChapterIndex];
    const nextChap = chapters[nextChapterIndex];

    let nextLesson = currentChap.lessons[nextLessonIndex];

    if (!nextLesson) {
      if (nextChap) nextLesson = nextChap.lessons[0];
    }

    if (!nextLesson) return;

    console.log("NEXT LEsson => ", nextLesson);

    props.history.push(`/course/${courseId}/${nextLesson._id}`);
  };

  const renderHeaders = () => {
    return (
      <section className="other_banner">
        <div className="container">
          <h1>{currentCourse.name}</h1>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/all-courses/">Courses</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={"/all-courses/" + currentCourse.category._id}>
                  {currentCourse.category.name}
                </Link>
              </li>
              <li className="breadcrumb-item active">{currentCourse.name}</li>
            </ol>
          </nav>
          {/* <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="courses.html">Courses</a>
              </li>
              <li className="breadcrumb-item">
                <a href="courses-detail.html">Marketing</a>
              </li>
              <li className="breadcrumb-item active">Improve editing skills</li>
            </ol>
          </nav> */}
        </div>
      </section>
    );
  };

  const renderCourseImageSlider = () => {
    return (
      <div>
        {list.length > 0 && (
          <Link to={`/course/${currentCourse.slug}/${list[0].slug}`}>
            <CourseImagesSlider
              // firstLesson={}
              images={currentCourse.images || [{ image: currentCourse.image }]}
            />
          </Link>
        )}

        <ShareLink
          shareLink={"https://www.out-class.org/course/" + currentCourse.slug}
        />
      </div>
    );
  };
  const renderDetailTabs = () => {
    const tabs = [
      "Videos",
      "Overview",
      "Instructor",
      //  "Reviews",
      //  "Forum"
    ];

    if (currentCourse.showReviews) {
      tabs.push("Reviews");
    }
    if (currentCourse.isEnrolled) {
      tabs[tabs.length] = "Forum";
    }
    return (
      <ul className="nav nav-tabs" id="CoursesTab" role="tablist">
        {tabs.map((tab) => {
          return (
            <li className="nav-item" role="presentation">
              <a
                className={detailTab === tab ? "nav-link active" : "nav-link"}
                id="Overview-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="Overview"
                aria-selected="true"
                onClick={(e) => {
                  e.preventDefault();
                  setDetailTab(tab);
                }}
              >
                {tab}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderOverViewTabContent = () => {
    return <div className="p-3">{renderHTML(currentCourse.description)}</div>;
  };

  const [selectedAccordian, setSelectedAccordian] = useState("");
  const renderVideos = () => {
    const cartCourse = cart.items.find((itm) => {
      return itm.course && itm.course._id === currentCourse._id;
    });

    let cartChapterIds = [];
    if (cartCourse) {
      cartChapterIds = cartCourse.chapters.map((c) => c._id);
    }
    return (
      <div
        className="tab-pane active show"
        id="Videos"
        role="tabpanel"
        aria-labelledby="Curriculum-tab"
      >
        {currentCourse.chapters.length > 0 && (
          <div className="Videos">
            <Accordion defaultActiveKey={"0"} id="ChapterOfCourses">
              {currentCourse.chapters.map((chap, chapterIndex) => {
                const isInCart = cartChapterIds.includes(chap._id);
                return (
                  <Card
                    key={`${chap._id}`}
                    className={
                      selectedAccordian === chapterIndex
                        ? "active mb-2"
                        : "mb-2"
                    }
                  >
                    <Accordion.Toggle
                      className="card-header"
                      id="headingOne"
                      eventKey={`${chapterIndex}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // window.scrollTo(20.2, 0);
                        setSelectedAccordian(`${chapterIndex}`);
                      }}
                    >
                      <h2 className="mb-0">
                        <button
                          className="btn btn-block text-left collapsed"
                          type="button"
                        >
                          {/* Chapter {chapterIndex + 1} */}
                          <span className="py-2">{chap.name}</span>
                        </button>

                        {!(currentCourse.enrolledChapters || []).includes(
                          chap._id
                        ) ? (
                          <a
                            onClick={(e) => {
                              if (!chap.price) return;
                              e.stopPropagation(); //prevents click event to propagate to accordian.

                              const tkn = storage.get("xAuthToken");
                              if (!tkn) {
                                dispatch(setLoginModalVisibility(true));
                                dispatch(setLoginModalClosable(false));
                                dispatch(setRegisterModalClosable(false));
                                return;
                              }

                              dispatch(
                                addItemToCartApi({
                                  body: {
                                    course: currentCourse._id,
                                    chapters: [chap._id],
                                    completeCourse: false,
                                  },
                                })
                              );
                            }}
                            className={isInCart ? "price bg-success" : "price"}
                          >
                            {chap.price
                              ? "Rs. " + formatPrice(chap.price)
                              : "Free"}{" "}
                            {chap.price ? (
                              <span className="ml-2">
                                <i className="fal fa-shopping-cart"></i>
                              </span>
                            ) : null}
                          </a>
                        ) : (
                          <a className="price bg-warning">Enrolled</a>
                        )}
                        {/* watchedVideos */}
                      </h2>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${chapterIndex}`}>
                      <Card.Body>
                        <div>
                          {chap.description && renderHTML(chap.description)}
                        </div>
                        <table className="table course_detail">
                          <tbody>
                            {chap.lessons.map((lesson, lessonIndex) => {
                              let watched = currentCourse.watchedVideos.find(
                                (w) => {
                                  return w.lesson === lesson._id;
                                }
                              );

                              if (
                                lessonId === lesson._id &&
                                selectedAccordian != chapterIndex
                              ) {
                                setSelectedAccordian(`${chapterIndex}`);
                              }
                              let lessonIcon = watched
                                ? "fas fa-play"
                                : "far fa-play";
                              switch (lesson.type) {
                                case "quiz":
                                  lessonIcon = "far fa-comment";
                              }

                              return (
                                <tr
                                  key={
                                    lesson._id +
                                    "course page lesson" +
                                    lessonIndex
                                  }
                                >
                                  <div className="position-relative">
                                    <Link
                                      to={`/course/${currentCourse.slug}/${lesson.slug}`}
                                    >
                                      <th style={{ width: "40px" }}>
                                        <i className={lessonIcon}></i>
                                      </th>
                                      <th className="text-dark text-decoration-none">
                                        {lesson.name}
                                      </th>

                                      <th>
                                        {watched && (
                                          <span
                                            className="badge badge-dark mr-2"
                                            style={{
                                              position: "absolute",
                                              top: "15px",
                                              right:
                                                lesson.accessibility !== "paid"
                                                  ? "45px"
                                                  : "15px",
                                            }}
                                          >
                                            watched
                                          </span>
                                        )}
                                        {lesson.accessibility !== "paid" && (
                                          <span
                                            className="badge badge-info mr-2"
                                            style={{
                                              position: "absolute",
                                              top: "15px",
                                              right: "5px",
                                            }}
                                          >
                                            Free
                                          </span>
                                        )}
                                      </th>
                                    </Link>
                                  </div>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    );
  };

  const renderInstructors = () => {
    return (
      <div className="instructor">
        <div className="card">
          {currentCourse.teachers.map((teacher, teacherIndex) => {
            return (
              <div className="card-body">
                <div className="left_block">
                  <img src={teacher.image} alt="" className="img-fluid" />
                </div>
                <div className="right_block">
                  <h5>{`${teacher.firstName} ${teacher.lastName}`}</h5>

                  <div className="py-3">
                    {renderHTML(teacher.introduction || "")}
                  </div>
                  <div className="row social">
                    {teacher.twitterLink && (
                      <a href={teacher.twitterLink} target="_blank">
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {teacher.facebookLink && (
                      <a href={teacher.facebookLink} target="_blank">
                        <i className="fab fa-facebook"></i>
                      </a>
                    )}

                    {teacher.linkedInLink && (
                      <a href={teacher.linkedInLink} target="_blank">
                        <i className="fab fa-linkedin"></i>
                      </a>
                    )}
                    {teacher.googleLink && (
                      <a href={teacher.googleLink} target="_blank">
                        <i className="fab fa-google"></i>
                      </a>
                    )}

                    {teacher.youtubeLink && (
                      <a href={teacher.youtubeLink} target="_blank">
                        <i className="fab fa-youtube"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const [reviews, setReviews] = useState([]);

  const deleteCourseReview = (id, index) => {
    const conf = window.confirm("Are you sure you want to delete?");
    if (!conf) return;
    dispatch(
      deleteReview({
        id,
        onSuccess: () => {
          const newReviews = [...reviews];
          newReviews.splice(index, 1);
          setReviews(newReviews);
        },
      })
    );
  };
  const renderReviews = () => {
    return (
      <div className="review">
        <div className="review_score">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-12 align-self-center">
              <div className="prgress_cover">
                <p className="progress-label">Excellent</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${
                        currentCourse.fiveStar !== 0
                          ? (currentCourse.fiveStar /
                              currentCourse.totalRatingCount) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span></span>
                  </div>
                </div>
                <p className="progress-percentage">
                  {currentCourse.fiveStar || 0}
                </p>
                <div className="clearfix"></div>
              </div>
              <div className="prgress_cover">
                <p className="progress-label">Very Good</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${
                        currentCourse.fourStar !== 0
                          ? (currentCourse.fourStar /
                              currentCourse.totalRatingCount) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span></span>
                  </div>
                </div>
                <p className="progress-percentage">
                  {currentCourse.fourStar || 0}
                </p>
                <div className="clearfix"></div>
              </div>
              <div className="prgress_cover">
                <p className="progress-label">Average</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${
                        currentCourse.threeStar !== 0
                          ? (currentCourse.threeStar /
                              currentCourse.totalRatingCount) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span></span>
                  </div>
                </div>
                <p className="progress-percentage">
                  {currentCourse.threeStar || 0}
                </p>
                <div className="clearfix"></div>
              </div>
              <div className="prgress_cover">
                <p className="progress-label">Poor</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${
                        currentCourse.twoStar !== 0
                          ? (currentCourse.twoStar /
                              currentCourse.totalRatingCount) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span></span>
                  </div>
                </div>
                <p className="progress-percentage">
                  {currentCourse.twoStar || 0}
                </p>
                <div className="clearfix"></div>
              </div>
              <div className="prgress_cover">
                <p className="progress-label">Terrible</p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${
                        currentCourse.oneStar !== 0
                          ? (currentCourse.oneStar /
                              currentCourse.totalRatingCount) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span></span>
                  </div>
                </div>
                <p className="progress-percentage">
                  {currentCourse.oneStar || 0}
                </p>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="square">
                <div className="content">
                  <div className="circle w-100 h-100">
                    <div className="circle-body">
                      <h3>{currentCourse.rating}</h3>
                      <p>
                        <ReactStars
                          count={5}
                          value={currentCourse.rating || 0}
                          edit={false}
                          size={16}
                          isHalf={true}
                          emptySymbol="fa fa-star-o"
                          fullSymbol="fa fa-star"
                          emptyIcon={<i className="far fa-star"></i>}
                          halfIcon={<i className="fa fa-star-half-alt"></i>}
                          filledIcon={<i className="fa fa-star"></i>}
                          activeColor="#f16101"
                          fractions={2}
                        />
                        {currentCourse.totalRatingCount} reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {reviews.map((rev, revIndex) => {
          return (
            <div className="posted_reviews" key={`${rev._id}-${revIndex}`}>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body position-relative">
                      {user && user.role === "ADMIN" && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            deleteCourseReview(rev._id, revIndex);
                          }}
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "5px",
                          }}
                        >
                          delete
                        </button>
                      )}
                      <div className="left_block">
                        <img
                          src={rev.user.image}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="right_block">
                        <h5>{rev.user.firstName + " " + rev.user.lastName}</h5>
                        <p>
                          {moment(rev.createdAt).format("D MMMM, YYYY")}
                          <span className="star">
                            <ReactStars
                              count={5}
                              value={rev.rating || 0}
                              edit={false}
                              size={16}
                              isHalf={true}
                              emptySymbol="fa fa-star-o"
                              fullSymbol="fa fa-star"
                              emptyIcon={<i className="far fa-star"></i>}
                              halfIcon={<i className="fa fa-star-half-alt"></i>}
                              filledIcon={<i className="fa fa-star"></i>}
                              activeColor="#f16101"
                              fractions={2}
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p>{rev.message}</p>
            </div>
          );
        })}

        <div className="add_review">
          <Formik
            initialValues={{ rating: 0, name: "", email: "", message: "" }}
            validationSchema={Yup.object({
              name: Yup.string().required("First Name is required"),
              email: Yup.string()
                .email("Email is not valid.")
                .required("Email is required."),
              message: Yup.string().required("Message is required."),
              rating: Yup.number()
                .min(1, "Give a rating.")
                .required("Rating is required."),
            })}
            onSubmit={(values) => {
              dispatch(
                addCourseReview({
                  id: currentCourse._id,
                  body: values,
                  onSuccess: (res) => {
                    for (let key in res.data.data.course)
                      currentCourse[key] = res.data.data.course[key];

                    const { courseReview } = res.data.data;
                    setReviews([
                      courseReview,
                      ...reviews.filter((r) => {
                        return r.user._id !== courseReview.user._id;
                      }),
                    ]);
                    setCurrentCourse({ ...currentCourse });
                    alert("Review Added");
                  },
                })
              );
            }}
          >
            {({ values, errors, touched, setFieldValue }) => {
              return (
                <Form>
                  <h2>Leave a Comment</h2>
                  Add a review
                  <ReactStars
                    count={5}
                    value={values.rating}
                    size={16}
                    emptySymbol="fa fa-star-o"
                    fullSymbol="fa fa-star"
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    filledIcon={<i className="fa fa-star"></i>}
                    activeColor="#f16101"
                    fractions={1}
                    onChange={(r) => {
                      setFieldValue("rating", r);
                    }}
                  />
                  {values.rating && touched.rating ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "13px",
                      }}
                    >
                      {errors.rating}
                    </p>
                  ) : null}
                  <section className="content">
                    <div className="contact_form text-left">
                      <div className="form_contact  text-left">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-12">
                            <div className="form-group">
                              <Field
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Name *"
                              />
                              <ErrorMessage name="name" component={TextError} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-12">
                            <div className="form-group">
                              <Field
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email *"
                              />
                              <ErrorMessage
                                name="email"
                                component={TextError}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group mb-3">
                              <textarea
                                className="form-control"
                                rows="7"
                                placeholder="Write Message"
                                name="message"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setFieldValue("message", value);
                                }}
                              ></textarea>

                              <ErrorMessage
                                name="message"
                                component={TextError}
                              />
                            </div>
                          </div>
                        </div>
                        <input
                          type="submit"
                          className="btn more"
                          value="Leave a Review"
                        />
                      </div>
                    </div>
                  </section>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
  };

  const renderForum = () => {
    return currentCourse.slug && <ForumThreads courseId={currentCourse._id} />;
  };

  const renderCourseDetails = () => {
    return (
      <div className="col-lg-3 col-12">
        <div className="course_price_table">
          {!currentCourse.isEnrolled && (
            <div className="card">
              <div className="card-body">
                <span>Course price</span>
                <h4>Rs. {formatPrice(currentCourse.price)}</h4>
                <a
                  className="btn more"
                  onClick={(e) => {
                    e.stopPropagation(); //prevents click event to propagate to accordian.

                    const tkn = storage.get("xAuthToken");
                    if (!tkn) {
                      dispatch(setLoginModalVisibility(true));
                      dispatch(setLoginModalClosable(false));
                      dispatch(setRegisterModalClosable(false));
                      return;
                    }
                    dispatch(
                      addItemToCartApi({
                        body: {
                          course: currentCourse._id,
                          chapters: currentCourse.chapters.map(
                            (chap) => chap._id
                          ),
                          completeCourse: true,
                        },
                      })
                    );
                    props.history.push("/cart");
                  }}
                >
                  Buy 1 Year Access
                </a>
              </div>
            </div>
          )}
          <ul className="list-group">
            <li className="list-group-item">
              <i className="fas fa-clock"></i> Duration:
              <span>{currentCourse.duration}</span>
            </li>
            <li className="list-group-item">
              <i className="fas fa-folder"></i> Units:
              <span>{currentCourse.lectures}</span>
            </li>
            {/* <li className="list-group-item">
              <i className="fas fa-user-circle"></i> Students:
              <span>Max 4</span>
            </li> */}
            <li className="list-group-item">
              <i className="fas fa-play"></i> Videos:
              <span>{currentCourse.videoDuration}</span>
            </li>
            {/* <li className="list-group-item">
              <i className="fas fa-flag"></i> Skill Level:
              <span>{currentCourse.skillLevel.name}</span>
            </li> */}
            <li className="list-group-item">
              <i className="fas fa-globe-americas"></i> Language:
              <span> {currentCourse.language.name}</span>
            </li>
          </ul>
          {/* <div className="courses_new">
            <div className="card">
              <div className="card-body">
                <h5>Recent Posts</h5>
                <div className="post_cover">
                  <div className="row">
                    <div className="col-3 align-self-center">
                      <a href="#">
                        <img
                          src="img/course_1.png"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </div>
                    <div className="col-9 align-self-center">
                      <p>
                        by
                        <a href="#">Jessica Brown</a>
                        Marketing strategies
                        <span className="star">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </span>
                        <span>4.8</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="post_cover">
                  <div className="row">
                    <div className="col-3 align-self-center">
                      <a href="#">
                        <img
                          src="img/course_2.png"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </div>
                    <div className="col-9 align-self-center">
                      <p>
                        by
                        <a href="#">Jessica Brown</a>
                        Marketing strategies
                        <span className="star">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </span>
                        <span>4.8</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="post_cover">
                  <div className="row">
                    <div className="col-3 align-self-center">
                      <a href="#">
                        <img
                          src="img/course_3.png"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </div>
                    <div className="col-9 align-self-center">
                      <p>
                        by
                        <a href="#">Jessica Brown</a>
                        Marketing strategies
                        <span className="star">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </span>
                        <span>4.8</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  const renderFeedbackModal = () => {
    return (
      <Modal
        show={feedbackModalVisibility}
        onHide={() => setFeedbackModalVisibility(false)}
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="add_review p-4">
            <a
              onClick={() => setFeedbackModalVisibility(false)}
              className="position-absolute"
              style={{ top: 10, right: 15 }}
            >
              <i className="fas fa-times"></i>
            </a>
            <Formik
              initialValues={{ rating: 0, name: "", email: "", message: "" }}
              validationSchema={Yup.object({
                name: Yup.string().required("First Name is required"),
                email: Yup.string()
                  .email("Email is not valid.")
                  .required("Email is required."),
                message: Yup.string().required("Message is required."),
                rating: Yup.number()
                  .min(1, "Give a rating.")
                  .required("Rating is required."),
              })}
              onSubmit={(values) => {
                dispatch(
                  addCourseFeedback({
                    id: currentCourse._id,
                    body: values,
                    onSuccess: () => {
                      setFeedbackModalVisibility(false);
                    },
                  })
                );
              }}
            >
              {({ values, errors, touched, setFieldValue }) => {
                return (
                  <Form>
                    <h3 className="mb-4">
                      Hey, how is your experience so far? Please take a few
                      seconds to rate this course!
                    </h3>
                    <section className="content">
                      <div className="contact_form text-left py-0">
                        <div className="form_contact  text-left">
                          <div className="row">
                            <div className="col-12 mb-2">
                              Rating
                              <ReactStars
                                count={5}
                                value={values.rating}
                                size={16}
                                emptySymbol="fa fa-star-o"
                                fullSymbol="fa fa-star"
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={
                                  <i className="fa fa-star-half-alt"></i>
                                }
                                filledIcon={<i className="fa fa-star"></i>}
                                activeColor="#f16101"
                                fractions={1}
                                onChange={(r) => {
                                  setFieldValue("rating", r);
                                }}
                              />
                              {errors.rating && touched.rating ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "13px",
                                  }}
                                >
                                  {errors.rating}
                                </p>
                              ) : null}
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                              <div className="form-group">
                                <Field
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Name *"
                                />
                                <ErrorMessage
                                  name="name"
                                  component={TextError}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                              <div className="form-group">
                                <Field
                                  type="email"
                                  name="email"
                                  className="form-control"
                                  placeholder="Email *"
                                />
                                <ErrorMessage
                                  name="email"
                                  component={TextError}
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group mb-3">
                                <textarea
                                  className="form-control"
                                  rows="7"
                                  placeholder="Write Message"
                                  name="message"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setFieldValue("message", value);
                                  }}
                                ></textarea>

                                <ErrorMessage
                                  name="message"
                                  component={TextError}
                                />
                              </div>
                            </div>
                          </div>
                          <input
                            type="submit"
                            className="btn more"
                            value="Submit"
                          />
                        </div>
                      </div>
                    </section>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  var str = currentCourse.traits + "";
  var courseTraits = new Array();
  courseTraits = str.split(",").filter((t) => t.trim());
  courseTraits = courseTraits;

  return (
    <div>
      <Helmet>
        <meta property="og:title" content={courseData.metaTitle} />
        <meta
          name="description"
          property="og:description"
          content={courseData.metaDescription}
        />
        <meta name="keywords" content={courseData.metaKeyWords} />

        <meta property="og:image" content={courseData.image} />
      </Helmet>
      {renderHeaders()}

      <section className="courses_detail">
        <div className="container">
          <div className="sources">
            <div className="row">
              <div className="col-lg-12 col-12">
                <div className="course_info">
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-12">
                      {currentCourse.teachers[0] && (
                        <div className="author">
                          <div
                            className="img"
                            style={{
                              backgroundImage: `url("${currentCourse.teachers[0].image}")`,
                            }}
                          ></div>
                          <p className="m-0">
                            By{" "}
                            <span>
                              {`${currentCourse.teachers[0].firstName} ${currentCourse.teachers[0].lastName}`}
                            </span>
                          </p>
                        </div>
                      )}
                      <h5 className="course_name">{currentCourse.name}</h5>
                      <div className="rating clearfix">
                        {/* <span className="star float-left">
                          <ReactStars
                            count={5}
                            value={currentCourse.rating || 0}
                            edit={false}
                            size={16}
                            isHalf={true}
                            emptySymbol="fa fa-star-o"
                            fullSymbol="fa fa-star"
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            filledIcon={<i className="fa fa-star"></i>}
                            activeColor="#f16101"
                            fractions={2}
                          />
                        </span> */}
                        {/* <p className="float-left">
                          {currentCourse.rating || 0}
                          <span className="rating-count">
                            {currentCourse.totalRatingCount || 0}
                          </span>
                        </p> */}
                        <div className="tag float-left">
                          <p>
                            <a href="#">{currentCourse.category.name}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!lessonId && renderCourseImageSlider()}
                {lessonId && currentCourse._id && (
                  <LessonCard
                    lessonId={lessonId}
                    courseId={currentCourse._id}
                    moveToPrevLesson={moveToPrevLesson}
                    moveToNextLesson={moveToNextLesson}
                    setWatched={(watcheObj) => {
                      const { courseId, lessonId } = watcheObj;
                      currentCourse.watchedVideos = [
                        {
                          course: courseId,
                          lesson: lessonId,
                        },
                        ...currentCourse.watchedVideos,
                      ];
                      setCurrentCourse({ ...currentCourse });
                    }}
                  />
                )}
                {/* 
                <div className="video_sec">
           
                  <img
                    src="img/courses_video.png"
                    alt=""
                    className="img-fluid"
                  />
                  <a className="wish_list" href="#">
                    <i className="fas fa-heart"></i>
                  </a>
                </div> */}

                <div style={{ marginTop: "20px", marginBottom: "40px" }}>
                  <div className="row">
                    <div className="col-md-8">
                      <h2>This Course Includes</h2>
                    </div>

                    <div className="col-md-4">
                      <Link
                        to="/subscription"
                        className="btn more ml-1 ml-md-4 yellow-btn"
                        style={{ width: "auto", maxWidth: "186px" }}
                      >
                        How To Buy
                      </Link>
                    </div>
                  </div>

                  <div className="row" style={{ maxWidth: "600px" }}>
                    {courseTraits.length > 0 &&
                      courseTraits.map((data, key) => {
                        return (
                          <div className="col-sm-6">
                            <img
                              src={tickboxImage}
                              style={{
                                height: "22px",
                                width: "21px",
                                marginRight: "1rem",
                              }}
                            />
                            <label>{data}</label>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {renderDetailTabs()}
                <div className="tab-content" id="CoursesTabContent">
                  {detailTab === "Overview" && renderOverViewTabContent()}
                  {detailTab === "Videos" && renderVideos()}
                  {detailTab === "Instructor" && renderInstructors()}
                  {detailTab === "Reviews" && renderReviews()}
                  {detailTab === "Forum" && renderForum()}
                </div>
                <br />
              </div>
              {/* {renderCourseDetails()} */}
            </div>
          </div>
        </div>
      </section>

      <div style={{ backgroundColor: "#fffcf4" }}>
        <div className="container p-5">
          <h1 className="text-center font-weight-bold mb-5">
            What Our Students Have To Say
          </h1>
          <Testimonials courseId={currentCourse._id} />
        </div>
      </div>
      {renderFeedbackModal()}
    </div>
  );
};

CoursePage.loadData = ({ store, matchedRoute }) => {
  const { dispatch } = store;

  return new Promise(async (resolve, reject) => {
    try {
      const { params } = matchedRoute.match;
      const { courseId, lessonId } = params;

      let res;
      if (lessonId) {
        res = await http.get({
          url: "/lessons/full_lesson_detail/" + lessonId,
        });
      } else {
        res = await http.get({
          url: "/courses/full_course_detail/" + courseId,
        });
      }

      dispatch(setCoursePageData(res.data.data));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export default CoursePage;
