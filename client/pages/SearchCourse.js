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
import CourseCard from "../components/CourseCard";
const MyCourses = (props) => {
  const dispatch = useDispatch();
  //   const cart = useSelector((state) => state.entities.cart);
  const courses = useSelector((state) => state.entities.courses);
  const [showLoader, setShowLoader] = useState(false);

  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderCourses = () => {
    const { search } = props.match.params;
    const filteredCourses = courses.list.filter((c) => {
      return c.name.toLowerCase().includes(search.trim().toLowerCase());
    });
    return filteredCourses.length > 0 ? (
      filteredCourses.map((course) => {
        return (
          <div className="col-lg-4 col-md-3 col-sm-6" key={course._id}>
            <CourseCard course={course} />
          </div>
        );
      })
    ) : (
      <div className="col-12 py-5">
        <h1 className="text-center">No Courses Found</h1>
      </div>
    );
  };

  return (
    <>
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
    </>
  );
};

export default MyCourses;
