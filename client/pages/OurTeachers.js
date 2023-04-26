import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import loadable from "@loadable/component";
import { loadFaqs } from "../store/api/faqs";
import Loader from "../components/Loader";
import renderHTML from "react-render-html";
import OurTeam from "../shared/OurTeamAbout";
import { loadTeacherPageCMS } from "../store/api/teacherPage";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const OurTeachers = (props) => {
  const dispatch = useDispatch();

  const pageData = useSelector((state) => state.ui.ourTeachersPage.data);

  useEffect(() => {
    dispatch(loadTeacherPageCMS({}));
  }, []);
  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <meta property="og:title" content={pageData.metaTitle} />
        <meta name="description" content={pageData.metaDescription} />
        <meta name="keywords" content={pageData.metaKeyWords} />
      </Helmet>

      <section className="other_banner">
        <div className="container">
          <h1>{pageData.mainHeading}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{pageData.mainHeading}</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="teacher">
        <div className="container">
          <div>{pageData.text1 && renderHTML(pageData.text1)}</div>
          <OurTeam heading={pageData.heading1} pageType="teacher" />
        </div>
      </section>
    </>
  );
};

OurTeachers.loadData = ({ store, matchedRoute }) => {
  console.log("Teacher Page data");
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];

  // if (token) {
  promiseArray.push(dispatch(loadTeacherPageCMS({})));
  // }
  return Promise.all(promiseArray);
};

export default OurTeachers;
