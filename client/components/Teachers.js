import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadTeamMembers } from "../store/api/teamMembers";
import { Row, Col, Card } from "react-bootstrap";
import renderHTML from "react-render-html";
import HomeButton from "./HomeButton";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";

import SwiperCore, { Autoplay } from "swiper";

SwiperCore.use([Autoplay]);

function Teachers(props) {
  const dispatch = useDispatch();

  const [teachersList, setTeachersList] = useState([]);

  useEffect(() => {
    dispatch(
      loadTeamMembers({
        onSuccess: (res) => {
          const filtered = res.data.data.filter((t) => t.showOnHome);
          if (screen.width < 650) {
            setTeachersList(filtered.slice(0, 3));
          } else {
            setTeachersList(filtered);
          }
        },
      })
    );
  }, []);
  const options = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-3 mt-5">
          <div className="teacher-home-first-block">
            <h1 className="font-weight-bold">{props.heading}</h1>
            {props.teacherText && renderHTML(props.teacherText)}
          </div>
        </div>

        {teachersList.map((t) => {
          return (
            <div className="col-md-3 mt-5" key={t._id}>
              <div className="mx-5 mx-md-0">
                <div className="square">
                  <div className="content">
                    <div
                      className="home-teacher-card"
                      style={{ backgroundImage: `url("${t.image}")` }}
                    >
                      <div className="home-teacher-info p-3">
                        <h4 className="text-center text-white font-weight-bold mt-2">
                          {t.name}
                        </h4>
                        {renderHTML(t.introduction)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to={props.buttonLink} className={`btn more`}>
        {props.buttonText}
      </Link>
    </div>
  );
  // return (
  //   <section className="teachers">
  //     <div className="container">
  //       <h2>{props.heading}</h2>

  //       <Swiper
  //         autoplay={true}
  //         slidesPerView={4}
  //         spaceBetween={15}
  //         navigation={{
  //           nextEl: "#homeSwiperNext",
  //           prevEl: "#homeSwiperPrev",
  //         }}
  //         className="teacher_carousel"
  //         breakpoints={{
  //           0: {
  //             slidesPerView: 1,
  //           },
  //           576: {
  //             slidesPerView: 2,
  //           },
  //           992: {
  //             slidesPerView: 3,
  //           },
  //           1200: {
  //             slidesPerView: 4,
  //           },
  //         }}
  //       >
  //         {teachersList.map((teacherItemData, index) => (
  //           <SwiperSlide
  //             className="item"
  //             key={`teacherItemData-${teacherItemData._id}-${index}`}
  //           >
  //             <Card>
  //               <img
  //                 src={teacherItemData.image}
  //                 alt=""
  //                 className="card-img-top"
  //               />

  //               <Card.Body>
  //                 <h5>{teacherItemData.name}</h5>
  //                 <p className="authority">{teacherItemData.designation}</p>
  //                 <div>
  //                   {teacherItemData.introduction &&
  //                     renderHTML(teacherItemData.introduction)}
  //                 </div>
  //               </Card.Body>
  //               {/* <Card.Footer>
  //                 <Row>
  //                   {teacherItemData.twitterLink && (
  //                     <Col xs={3}>
  //                       <a href={teacherItemData.twitterLink} target="_blank">
  //                         <i className="fab fa-twitter"></i>
  //                       </a>
  //                     </Col>
  //                   )}
  //                   {teacherItemData.facebookLink && (
  //                     <Col xs={3}>
  //                       <a href={teacherItemData.facebookLink} target="_blank">
  //                         <i className="fab fa-facebook"></i>
  //                       </a>
  //                     </Col>
  //                   )}
  //                   {teacherItemData.linkedInLink && (
  //                     <Col xs={3}>
  //                       <a href={teacherItemData.linkedInLink} target="_blank">
  //                         <i className="fab fa-linkedin"></i>
  //                       </a>
  //                     </Col>
  //                   )}
  //                   {teacherItemData.instagramLink && (
  //                     <Col xs={3}>
  //                       <a href={teacherItemData.instagramLink} target="_blank">
  //                         <i className="fab fa-instagram"></i>
  //                       </a>
  //                     </Col>
  //                   )}
  //                 </Row>
  //               </Card.Footer> */}
  //             </Card>
  //           </SwiperSlide>
  //         ))}

  //         <div className="mt-1">
  //           <div
  //             id="homeSwiperPrev"
  //             style={{ width: "50px", height: "50px", float: "left" }}
  //           >
  //             <i
  //               className="far fa-long-arrow-alt-left"
  //               style={{
  //                 backgroundColor: "#012237",
  //                 borderRadius: "50%",
  //                 textalign: "center",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 verticalAlign: "middle",
  //                 padding: "10px 12px",
  //                 transition: "0.3s all",
  //                 color: "#fff",
  //               }}
  //             ></i>
  //           </div>
  //           <div
  //             id="homeSwiperNext"
  //             style={{ width: "50px", height: "50px", float: "right" }}
  //           >
  //             <i
  //               className="far fa-long-arrow-alt-right"
  //               style={{
  //                 backgroundColor: "#012237",
  //                 borderRadius: "50%",
  //                 textalign: "center",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 verticalAlign: "middle",
  //                 padding: "10px 12px",
  //                 transition: "0.3s all",
  //                 color: "#fff",
  //               }}
  //             ></i>
  //           </div>
  //         </div>
  //       </Swiper>
  //     </div>
  //     {/* <Link to={props.buttonLink} className={`btn more`}>
  //       {props.buttonText}
  //     </Link> */}
  //   </section>
  // );
}

export default Teachers;
