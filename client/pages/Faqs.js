import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import loadable from "@loadable/component";
import { loadFaqs } from "../store/api/faqs";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import renderHTML from "react-render-html";

const MyOrdersTable = loadable(
  () => import("../components/Tables/MyOrderTable"),
  {
    ssr: false,
  }
);

const MyOrders = (props) => {
  const dispatch = useDispatch();
  //   const cart = useSelector((state) => state.entities.cart);

  const [showLoader, setShowLoader] = useState(false);
  const [currentTab, setCurrentTab] = useState("student");
  const [activeFaq, setActiveFaq] = useState("");
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    setShowLoader(true);
    dispatch(
      loadFaqs({
        onSuccess: (res) => {
          setFaqs(res.data.data);
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

  const renderList = () => {
    let tabName = "Students";

    if (currentTab === "student") {
      tabName = "Students";
    } else if (currentTab === "parent") {
      tabName = "Parents";
    } else if (currentTab === "teacher") {
      tabName = "Teachers";
    }

    return (
      <div className="container">
        <div className="tab-content" id="cuorses_list">
          <div
            className="tab-pane fade show active"
            id="students"
            role="tabpanel"
            aria-labelledby="students-tab"
          >
            <section className="faqs_detail">
              <div className="student_faqs">
                <div className="container">
                  <h2>{tabName}</h2>
                  <div className="accordion" id="accordionExample">
                    {faqs
                      .filter((f) => f[currentTab])
                      .map((faq, faqIndex) => {
                        return (
                          <div
                            className={
                              activeFaq === faq._id ? "card active" : "card"
                            }
                            key={faq._id}
                          >
                            <div className="card-header" id="headingOne">
                              <h2 className="mb-0">
                                <button
                                  className="btn btn-block text-left collapsed"
                                  type="button"
                                  data-toggle="collapse"
                                  data-target="#collapseOne"
                                  aria-expanded={
                                    activeFaq === faq._id ? "true" : "false"
                                  }
                                  aria-controls="collapseOne"
                                  onClick={() => {
                                    if (activeFaq !== faq._id)
                                      setActiveFaq(faq._id);
                                    else setActiveFaq("");
                                  }}
                                >
                                  {faq.question}
                                </button>
                              </h2>
                            </div>

                            <div
                              id="collapseOne"
                              className={
                                activeFaq === faq._id
                                  ? "collapse show"
                                  : "collapse"
                              }
                              aria-labelledby="headingOne"
                              data-parent="#accordionExample"
                            >
                              <div className="card-body">
                                {faq.answer && renderHTML(faq.answer)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>FAQ’s</h1>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">FAQ’s</li>
            </ol>
          </nav>
        </div>
      </section>
      <div className="position-relative" style={{ minHeight: "200px" }}>
        {showLoader ? (
          renderLoader()
        ) : (
          <section className="popular p-0">
            <div className="bg_cover  p-0">
              <div className="container">
                <ul className="nav nav-tabs" id="courseTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={
                        currentTab === "student"
                          ? "nav-link active"
                          : "nav-link"
                      }
                      onClick={() => {
                        setCurrentTab("student");
                      }}
                      id="students-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="students"
                      aria-selected="true"
                    >
                      Students
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={
                        currentTab === "teacher"
                          ? "nav-link active"
                          : "nav-link"
                      }
                      onClick={() => {
                        setCurrentTab("teacher");
                      }}
                      id="teachers-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="teachers"
                      aria-selected="true"
                    >
                      Teachers
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={
                        currentTab === "parent" ? "nav-link active" : "nav-link"
                      }
                      onClick={() => {
                        setCurrentTab("parent");
                      }}
                      id="parents-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="parents"
                      aria-selected="true"
                    >
                      Parents
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {renderList()}
          </section>
        )}
      </div>
    </>
  );
};

export default MyOrders;
