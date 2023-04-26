import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { deleteCartItem, checkoutCashCollection } from "../store/api/cart";
import TextError from "../shared/TextError";
import { loadMyCourses } from "../store/api/courses";
import Loader from "../components/Loader";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import freeButton from "../assets/img/free.png";
import CourseCard from "../components/CourseCard";
import { getHomeFreeVidSec } from "../store/api/allCoursePageCms";

const MyCourses = (props) => {
  const dispatch = useDispatch();
  const [selectedCategory, setStelectedCategory] = useState("");
  const categories = useSelector((state) => state.entities.categories);
  const courses = useSelector((state) => state.entities.courses);
  const [showLoader, setShowLoader] = useState(false);

  const [freeVidSec, setFreeVidSec] = useState({
    heading: "",
    heading2: "",
    image: "",
    buttonText: "",
    buttonLink: "",

    heading3: "",
    heading4: "",
    buttonText2: "",
    buttonLink2: "",
  });

  useEffect(() => {
    dispatch(
      getHomeFreeVidSec({
        onSuccess: (res) => {
          setFreeVidSec(res.data.data);
        },
      })
    );
  }, []);

  const { category } = props.match.params;
  useEffect(() => {
    if (category) setStelectedCategory(category);
  }, [category]);

  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <>
        <li className="nav-item" role="presentation">
          <a
            className={selectedCategory ? "nav-link" : "nav-link active"}
            onClick={(e) => {
              e.preventDefault();
              setStelectedCategory("");
            }}
            id="marketing-tab"
            data-toggle="tab"
            href="#marketing"
            role="tab"
            aria-controls="marketing"
            aria-selected="false"
          >
            All Courses
          </a>
        </li>
        {(categories.list || []).map((cat) => {
          const categoryCourses = courses.list.filter((course) => {
            return cat._id === course.category._id;
          });

          if (categoryCourses.length <= 0) return null;
          return (
            <li
              className="nav-item"
              role="presentation"
              key={cat._id + "home course"}
            >
              {" "}
              <div style={{ position: "relative" }}>
                <a
                  className={
                    selectedCategory === cat._id
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setStelectedCategory(cat._id);
                  }}
                  id="marketing-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="marketing"
                  aria-selected="false"
                  style={{ position: "relative" }}
                >
                  {cat.free && (
                    <span
                      className="label"
                      style={{
                        position: "absolute",
                        top: "-12px",
                        right: "0",
                        color: "black",
                        fontWeight: "600",
                        margin: "2px",
                        color: "#c0e404",
                      }}
                    >
                      {cat.freeText}
                    </span>
                  )}
                  {cat.name}
                </a>
              </div>{" "}
            </li>
          );
        })}
      </>
    );
  };

  const renderCourses = () => {
    const filteredCourses = selectedCategory
      ? courses.list.filter((c) => c.category._id === selectedCategory)
      : courses.list;

    return filteredCourses.map((course) => {
      return (
        <div className="col-sm-6 col-md-3" key={course._id}>
          <CourseCard course={course} />
        </div>
      );
    });
  };

  return (
    <div className="courses_page">
      <section className="other_banner pb-2">
        <div className="container">
          <h1>Courses</h1>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Courses</li>
            </ol>
          </nav>

          {/* <ul className="nav nav-tabs" id="courseTab" role="tablist">
            {renderCategories()}
          </ul> */}
        </div>
      </section>

      <section className="popular">
        <div className="bg_cover">
          <div className="container">
            <ul className="nav nav-tabs" id="courseTab" role="tablist">
              {renderCategories()}
            </ul>
          </div>
        </div>

        {!selectedCategory && (
          <div className="detailed_menu">
            <div className="container">
              <div className="row">
                {categories.list.map((cat, catIndex) => {
                  const categoryCourses = courses.list.filter((course) => {
                    return cat._id === course.category._id;
                  });

                  if (categoryCourses.length <= 0) return null;
                  return (
                    <div
                      className="col-6 col-md col-lg"
                      key={`${cat._id}${catIndex}`}
                    >
                      <h5>{cat.name}</h5>
                      <ul className="nav flex-column">
                        <li className="nav-item">
                          {categoryCourses.map((co) => (
                            <Link to={"/course/" + co._id} className="nav-link">
                              {co.name}
                            </Link>
                          ))}
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
      <div className="position-relative" style={{ minHeight: "200px" }}>
        {showLoader ? (
          renderLoader()
        ) : (
          <div className="container py-5">
            <div className="courses">
              <div className="row">{renderCourses()}</div>
            </div>
          </div>
        )}
      </div>

      <div className="container">
        <div className="py-5">
          <div className="row">
            <div className="col-md-9">
              <h1 className="text-center">{freeVidSec.heading}</h1>
              <h1 className="text-center font-weight-bold text-main">
                {freeVidSec.heading2}
              </h1>
              <Link to={freeVidSec.buttonLink} className="btn more">
                {freeVidSec.buttonText}
              </Link>
            </div>
            <div className="col-md-3">
              <Link to={freeVidSec.buttonLink}>
                <img className="w-100" src={freeVidSec.image} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="choose-course-banner">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h1 className="text-center text-white text-md-left">
                {freeVidSec.heading3}
              </h1>
            </div>

            <div className="col-md-8">
              <h1 className="text-center text-white text-md-left font-weight-bold ">
                {freeVidSec.heading4}
              </h1>
            </div>
            <div className="col-md-4">
              <div className="monthly-plan-banner-btn-container">
                <Link to={freeVidSec.buttonLink2} className="monthly-plan-btn">
                  {freeVidSec.buttonText2}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
