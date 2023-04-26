import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { formatPrice } from "../helpers/priceFormater";
import storage from "../services/storage";
import { useSelector } from "react-redux";

export default (props) => {
  const activities = useSelector((state) => {
    return state.entities.activities.list;
  });

  const { course } = props;
  const thisActivity = activities.find((ac) => {
    return course._id == ac.course;
  });

  let activityLink = null;
  let courseLink = null;
  return (
    <div className="card" style={{ width: "280px", margin: "auto" }}>
      <Link
        to={`/course/${course.slug}`}
        ref={(ref) => {
          courseLink = ref;
        }}
      ></Link>
      {thisActivity && (
        <Link
          to={`/course/${course.slug}/${thisActivity.lesson.slug}`}
          ref={(ref) => {
            activityLink = ref;
          }}
        ></Link>
      )}
      <div
        style={{
          width: "100%",
          height: "160px",
          backgroundImage: `url("${course.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="card-body">
        <div className="tag">
          <p>{course.category.name} </p>
        </div>
        <div className="info">
          {/* <div className="author">
          <img src="img/person.png" alt="" />
          <p>
            By <a href="#">Jessica Brown</a>
          </p>
        </div> */}
          <h5 className="course_name">{course.name}</h5>

          {/* <div className="rating clearfix">
            <span className="star float-left">
              <ReactStars
                count={5}
                value={course.rating || 0}
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
            <p className="float-right">
              {course.rating || 0}
              <span className="rating-count">
                {course.totalRatingCount || 0}
              </span>
            </p>
          </div> */}

          <div className="clearfix spec mx-2">
            <div className="float-left ">
              <p>
                <i className="fal fa-clock"></i> {course.duration}
              </p>
            </div>

            <div className="float-left ml-2">
              <p>
                <i className="fal fa-folder-open"></i>
                {course.lectures}
              </p>
            </div>
            {/* <div className="float-right">
              <p className="price" style={{ marginTop: "-2px" }}>
                {` Rs. ${formatPrice(course.price)}`}
              </p>
            </div> */}
          </div>
        </div>

        <a
          className="btn btn-preview"
          onClick={() => {
            console.log("THIS => activity => ", thisActivity);
            if (thisActivity && activityLink) {
              if (thisActivity.lesson.type === "video") {
                storage.store("continue_video", thisActivity.duration);
              }
              activityLink.click();
            } else {
              courseLink.click();
            }
          }}
        >
          See Course
        </a>
      </div>
    </div>
  );
};
