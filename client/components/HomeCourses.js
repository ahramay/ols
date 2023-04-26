import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import CourseCard from "./CourseCard";
// import "swiper/swiper.scss";
import SwiperCore, { Autoplay, EffectFade, Navigation } from "swiper";
import "swiper/components/navigation/navigation.scss";
SwiperCore.use([Navigation, Autoplay, EffectFade]);
export default (props) => {
  const [selectedCategory, setStelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const categories = useSelector((state) => state.entities.categories);
  const courses = useSelector((state) => state.entities.courses);
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
          return (
            <li
              className="nav-item"
              role="presentation"
              key={cat._id + "home course"}
            >
              <a
                className={
                  selectedCategory === cat._id ? "nav-link active" : "nav-link"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setStelectedCategory(cat._id);
                  setCategoryName(cat.name);
                }}
                id="marketing-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="marketing"
                aria-selected="false"
              >
                {cat.name}
              </a>
            </li>
          );
        })}
      </>
    );
  };

  const renderCourseSwiper = () => {
    const filteredCourses = selectedCategory
      ? courses.list.filter((c) => c.category._id === selectedCategory)
      : courses.list;
    return (
      <div className="courses">
        <Swiper
          autoplay={true}
          slidesPerView={4}
          spaceBetween={15}
          className="owl-carousel courses courses_carousel"
          navigation={{
            nextEl: "#homeSwiperNext",
            prevEl: "#homeSwiperPrev",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            576: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
          nextButton={"#homeSwiperPrev"}
          prevButton={"homeSwiperNext"}
        >
          {filteredCourses.map((course) => {
            return (
              <SwiperSlide
                className="item"
                key={"home course => " + course._id}
              >
                <CourseCard course={course} />
              </SwiperSlide>
            );
          })}
          <div className="mt-1">
            <div
              id="homeSwiperPrev"
              style={{ width: "50px", height: "50px", float: "left" }}
            >
              <i
                className="far fa-long-arrow-alt-left"
                style={{
                  backgroundColor: "#012237",
                  borderRadius: "50%",
                  textalign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  verticalAlign: "middle",
                  padding: "10px 12px",
                  transition: "0.3s all",
                  color: "#fff",
                }}
              ></i>
            </div>
            <div
              id="homeSwiperNext"
              style={{ width: "50px", height: "50px", float: "right" }}
            >
              <i
                className="far fa-long-arrow-alt-right"
                style={{
                  backgroundColor: "#012237",
                  borderRadius: "50%",
                  textalign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  verticalAlign: "middle",
                  padding: "10px 12px",
                  transition: "0.3s all",
                  color: "#fff",
                }}
              ></i>
            </div>
          </div>
        </Swiper>
      </div>
    );
  };

  return (
    <section className="popular">
      <div className="bg_cover">
        <div className="container">
          <h2>{props.heading}</h2>
          <ul className="nav nav-tabs" id="courseTab" role="tablist">
            {renderCategories()}
          </ul>
        </div>
      </div>

      {/* //crousal */}

      <div className="container">
        <div className="tab-content" id="cuorses_list">
          <div
            className="tab-pane fade show active"
            id="all"
            role="tabpanel"
            aria-labelledby="all-tab"
          >
            {renderCourseSwiper()}

            {selectedCategory ? (
              <Link
                className="btn more"
                to={"/all-courses/" + selectedCategory}
              >
                {`All ${categoryName} Courses`}
              </Link>
            ) : (
              <Link className="btn more" to={"/all-courses"}>
                {`All  Courses`}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
