import React from "react";
import { useSelector } from "react-redux";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import dashImage from "../assets/img/dash.png";
import coursesImage from "../assets/img/courses.png";
import commentsImage from "../assets/img/comments.png";
import blogsImage from "../assets/img/blog.png";
import userImage from "../assets/img/usr.png";

export default (props) => {
  const user = useSelector((state) => state.auth.user);

  // console.log("USER => ", user);

  let isTeacher = false;
  if (user.role === "TEACHER" || user.role === "TEACHER_ASSISTANT") {
    isTeacher = true;
  }
  const { activeTab = "user" } = props;
  return (
    <div className="col-lg-1  col-12 p-0 ">
      <div id="sidebar_cover">
        <Navbar bg="dark" expand="lg">
          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent1"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="navbarSupportedContent1">
            <ul className="nav flex-column nav-tabs mx-auto">
              <li className="nav-item" role="presentation">
                <Link
                  to="/dashboard"
                  className={
                    activeTab === "user" ? "nav-link active" : "nav-link"
                  }
                  id="User-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="User"
                  aria-selected="true"
                >
                  <img src={userImage} alt="" className="img-fluid" />
                  User
                </Link>
              </li>
              {/* ///dashboard/courses */}

              <li className="nav-item" role="presentation">
                <Link
                  to="/dashboard/courses"
                  className={
                    activeTab === "courses" ? "nav-link active" : "nav-link"
                  }
                  id="Courses-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Courses"
                  aria-selected="true"
                >
                  <img src={coursesImage} alt="" className="img-fluid" />
                  Enrolled Courses
                </Link>
              </li>

              {isTeacher && (
                <li className="nav-item" role="presentation">
                  <Link
                    to="/dashboard/assigned_courses"
                    className={
                      activeTab === "assigned_courses"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    id="Courses-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="Courses"
                    aria-selected="true"
                  >
                    <img src={coursesImage} alt="" className="img-fluid" />
                    Assigned Courses
                  </Link>
                </li>
              )}
              {/* ///dashboard/my_courses */}

              <li className="nav-item" role="presentation">
                <Link
                  to="/dashboard/my_courses"
                  className={
                    activeTab === "quizzes" ? "nav-link active" : "nav-link"
                  }
                  id="Courses-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Courses"
                  aria-selected="true"
                >
                  <img src={commentsImage} alt="" className="img-fluid" />
                  Quizzes
                </Link>
              </li>

              {/* <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="Dashboard-tab"
                  data-toggle="tab"
                  href="#Dashboard"
                  role="tab"
                  aria-controls="Dashboard"
                  aria-selected="true"
                >
                  <img src={dashImage} alt="" className="img-fluid" />
                  Dashboard
                </a>
              </li>

              <li className="nav-item" role="presentation">
                <a
                  className="nav-link "
                  id="Tutorials-tab"
                  data-toggle="tab"
                  href="#Tutorials"
                  role="tab"
                  aria-controls="Tutorials"
                  aria-selected="true"
                >
                  <img src={commentsImage} alt="" className="img-fluid" />
                  Tutorials
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="Blogs-tab"
                  data-toggle="tab"
                  href="#Blogs"
                  role="tab"
                  aria-controls="Blogs"
                  aria-selected="true"
                >
                  <img src={blogsImage} alt="" className="img-fluid" />
                  Blogs
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="Testimonials-tab"
                  data-toggle="tab"
                  href="#Testimonials"
                  role="tab"
                  aria-controls="Testimonials"
                  aria-selected="true"
                >
                  <img src="img/comments.png" alt="" className="img-fluid" />
                  Testimonials
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="Comments-tab"
                  data-toggle="tab"
                  href="#Comments"
                  role="tab"
                  aria-controls="Comments"
                  aria-selected="true"
                >
                  <img src={commentsImage} alt="" className="img-fluid" />
                  Comments
                </a>
              </li> */}
            </ul>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
};
