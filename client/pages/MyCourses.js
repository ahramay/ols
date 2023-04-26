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

  const [showLoader, setShowLoader] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  useEffect(() => {
    setShowLoader(true);
    dispatch(
      loadMyCourses({
        onSuccess: (res) => {
          setMyCourses(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, []);
  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderCourses = () => {
    return myCourses.map((course) => {
      return (
        <div key={course._id} className="m-1" style={{ maxWidth: "300px" }}>
          <CourseCard course={course} />
        </div>
      );
    });
  };

  return (
    <>
      {/* <section className="other_banner">
        <div className="container">
          <h1>My Courses</h1>
        </div>
      </section> */}
      <div className="position-relative" style={{ minHeight: "200px" }}>
        {showLoader ? (
          renderLoader()
        ) : (
          <div className="container py-5">
            {myCourses.length > 0 ? (
              <div
                className="courses"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {renderCourses()}
              </div>
            ) : (
              <h1 className="text-center pt-4">
                You are not enrolled in any courses.
              </h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCourses;
