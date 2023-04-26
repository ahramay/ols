import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { outTeam } from "./ourTeamData";
import { useDispatch, useSelector } from "react-redux";
import { loadTeamMembers } from "../store/api/teamMembers";
import Background from "../assets/img/bg.png";
import renderHTML from "react-render-html";

function OurTeam(props) {
  const { pageType = "about" } = props;
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.entities.categories.list);

  const [selectedCategory, setStelectedCategory] = useState("all");
  const [categoryName, setCategoryName] = useState("");

  const [teamMembers, setTeamMembers] = useState([]);
  const [currentTab, setCurrentTab] = useState("managementBoard");
  const [currentTeacher, setCurrentTeacher] = useState({});
  const [filteredTeam, setFilteredTeam] = useState([]);

  const filterTeamMembers = (tab = "", members = []) => {
    const filterred = members.filter((team) => {
      if (pageType === "teacher") return true;
      if (team[tab]) return true;
      return false;
    });
    setCurrentTab(tab);

    setFilteredTeam(filterred);

    if (filterred[0]) setCurrentTeacher(filterred[0]);
  };

  const filteredCategoriesList = categories.filter((cat) => {
    const membersInCategory = filteredTeam.filter((tMem) => {
      return tMem.category && cat._id === tMem.category._id;
    });
    return membersInCategory.length > 0;
  });
  useEffect(() => {
    dispatch(
      loadTeamMembers({
        onSuccess: (res) => {
          const fltr = res.data.data.filter((tm) => {
            if (pageType === "about") return tm.showOnAbout;
            if (pageType === "teacher") return tm.showOnTeacher;

            return true;
          });

          setTeamMembers(fltr);
          if (pageType === "about") filterTeamMembers("managementBoard", fltr);

          if (pageType === "teacher") filterTeamMembers("", fltr);
        },
      })
    );
  }, []);

  const renderCategories = () => {
    return (
      <>
        {/* <li className="nav-item" role="presentation">
          <a
            className={
              selectedCategory === "all"
                ? "nav-link text-main"
                : "text-white nav-link"
            }
            onClick={(e) => {
              e.preventDefault();
              setStelectedCategory("all");
              setCategoryName("All");
            }}
            id="marketing-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="marketing"
            aria-selected="false"
          >
            All Teachers
          </a>
        </li> */}
        {(filteredCategoriesList || []).map((cat) => {
          return (
            <li
              className="nav-item"
              role="presentation"
              key={cat._id + "home course"}
            >
              <a
                className={
                  selectedCategory === cat._id
                    ? "nav-link text-main"
                    : "text-white nav-link"
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

  return (
    <section
      className="teacher"
      style={{
        backgroundImage: `url(${Background})`,
        marginTop: "50px",
        padding: "50px 0",
        backgrounRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <h2 style={{ color: "white", padding: "20px 0 20px" }}>
          {props.heading}
        </h2>

        {pageType !== "teacher" ? (
          <ul className="nav nav-tabs" id="level" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link text-white"
                id="home-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="home"
                aria-selected="true"
                style={{ background: "none", textDecoration: "underline" }}
                onClick={() => {
                  filterTeamMembers("managementBoard", teamMembers);
                }}
              >
                Management Board
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link text-white"
                id="profile-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
                style={{ background: "none", textDecoration: "underline" }}
                onClick={() => {
                  // setCurrentTab("leadership");
                  filterTeamMembers("leadership", teamMembers);
                }}
              >
                Leadership
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link text-white"
                id="contact-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="contact"
                aria-selected="false"
                style={{ background: "none", textDecoration: "underline" }}
                onClick={() => {
                  filterTeamMembers("coreTeam", teamMembers);
                }}
              >
                Core Team
              </a>
            </li>
          </ul>
        ) : (
          <ul className="nav nav-tabs" id="level" role="tablist">
            {renderCategories()}
          </ul>
        )}
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12 align-self-center">
                <div className="nav nav-pills" id="teacher" role="tablist">
                  {filteredTeam
                    .filter((tm) => {
                      if (selectedCategory === "all") return true;
                      return tm.category && tm.category._id == selectedCategory;
                    })
                    .map((teacherItem, teacherIndex) => {
                      return (
                        <a
                          key={teacherItem._id}
                          className={
                            currentTeacher._id === teacherItem._id
                              ? "nav-link active"
                              : "nav-link"
                          }
                          id="v-pills-home-tab"
                          data-toggle="pill"
                          role="tab"
                          aria-controls="v-pills-home"
                          aria-selected="true"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentTeacher(teacherItem);
                          }}
                        >
                          {teacherItem.name}
                          <span>{teacherItem.designation}</span>
                        </a>
                      );
                    })}
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="tab-content" id="teacherContent">
                  <div
                    className="tab-pane fade show active"
                    id="v-pills-home"
                    role="tabpanel"
                    aria-labelledby="v-pills-home-tab"
                  >
                    <div className="card">
                      <img
                        src={currentTeacher.image}
                        className="card-img-top"
                        alt="..."
                      />
                      <div className="card-body w-100">
                        <h5 className="card-title">{currentTeacher.name}</h5>
                        <span>{currentTeacher.designation}</span>
                        <div>
                          {currentTeacher.introduction &&
                            renderHTML(currentTeacher.introduction)}
                        </div>
                        <div className="links">
                          {currentTeacher.twitterLink && (
                            <a
                              href={currentTeacher.twitterLink}
                              target="_blank"
                            >
                              <i className="fab fa-twitter"></i>
                            </a>
                          )}
                          {currentTeacher.facebookLink && (
                            <a
                              href={currentTeacher.facebookLink}
                              target="_blank"
                            >
                              <i className="fab fa-facebook"></i>
                            </a>
                          )}
                          {currentTeacher.linkedInLink && (
                            <a
                              href={currentTeacher.linkedInLink}
                              target="_blank"
                            >
                              <i className="fab fa-linkedin"></i>
                            </a>
                          )}
                          {currentTeacher.instagramLink && (
                            <a
                              href={currentTeacher.instagramLink}
                              target="_blank"
                            >
                              <i className="fab fa-instagram"></i>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurTeam;
