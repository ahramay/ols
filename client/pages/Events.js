import React, { useState, useEffect } from "react";

import renderHTML from "react-render-html";
import moment from "moment";

import { useDispatch } from "react-redux";
import { getAllEvents } from "../store/api/events";

function Events(props) {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("upcoming");

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    dispatch(
      getAllEvents({
        onSuccess: (res) => {
          setEventList(res.data.data);
        },
      })
    );
  }, []);
  const renderList = () => {
    let filtered = [];

    if (currentTab === "upcoming") {
      filtered = eventList.filter((event) => {
        const current = moment();
        const start = moment(event.startDate, "X");

        if (current.toDate() < start.toDate()) return true;
        else return false;
      });
    } else if (currentTab === "happening") {
      filtered = eventList.filter((event) => {
        const current = moment();
        const start = moment(event.startDate, "X");
        const end = moment(event.endDate, "X");

        if (
          current.toDate() > start.toDate() &&
          current.toDate() < end.toDate()
        )
          return true;
        else return false;
      });
    } else if (currentTab === "expired") {
      filtered = eventList.filter((event) => {
        const current = moment();
        const end = moment(event.endDate, "X");

        if (current.toDate() > end.toDate()) return true;
        else return false;
      });
    }

    ////
    return (
      <div className="container">
        <div className="tab-content" id="cuorses_list">
          <div
            className="tab-pane fade show active"
            id="all"
            role="tabpanel"
            aria-labelledby="all-tab"
          >
            <div className="row events">
              <div className="col-12">
                {filtered.map((event, eventIndex) => {
                  return (
                    <div className="card mt-2" key={event._id}>
                      <div className="card-body">
                        <div className="row">
                          <div className="ocl-lg-2 col-md-2 col-12 align-self-center">
                            <p className="posted_on">
                              {moment(event.startDate, "X").format(
                                "MMMM D, YYYY"
                              )}
                            </p>
                          </div>
                          <div className="ocl-lg-6 col-md-6 col-12 align-self-center">
                            <h5>{event.name}</h5>
                            <p className="posted_at">
                              <i className="fal fa-clock"></i>{" "}
                              {moment(event.startDate, "X").format("h:mm a")} -{" "}
                              {moment(event.endDate, "X").format("h:mm a")}
                            </p>
                            {event.venue && (
                              <p className="posted_in">
                                <i className="fas fa-map-marker-alt"></i>{" "}
                                {event.venue}
                              </p>
                            )}
                            <div>
                              {event.description &&
                                renderHTML(event.description)}
                            </div>
                          </div>
                          <div className="ocl-lg-4 col-md-4 col-12 align-self-center">
                            <a href="event-detail.html">
                              <img
                                src={event.image}
                                alt=""
                                className="img-fluid"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length <= 0 && (
                  <div>
                    <h3 className="text-center pt-5">No events to show</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>Events & Webinars</h1>
        </div>
      </section>
      <section className="popular">
        <div className="bg_cover">
          <div className="container">
            <ul className="nav nav-tabs" id="courseTab" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={
                    currentTab === "happening" ? "nav-link active" : "nav-link"
                  }
                  id="all-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="all"
                  aria-selected={currentTab === "happening" ? "true" : "false"}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTab("happening");
                  }}
                >
                  Live
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={
                    currentTab === "upcoming" ? "nav-link active" : "nav-link"
                  }
                  id="marketing-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="marketing"
                  aria-selected={currentTab === "upcoming" ? "true" : "false"}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTab("upcoming");
                  }}
                >
                  Upcoming
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={
                    currentTab === "expired" ? "nav-link active" : "nav-link"
                  }
                  id="alevel-tab"
                  data-toggle="tab"
                  href="#alevel"
                  role="tab"
                  aria-controls="alevel"
                  aria-selected={currentTab === "expired" ? "true" : "false"}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTab("expired");
                  }}
                >
                  Archive
                </a>
              </li>
            </ul>
          </div>
        </div>
        {renderList()}
      </section>
    </>
  );
}

export default Events;
