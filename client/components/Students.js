import React, { useState, useEffect } from "react";

import { Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import SwiperCore, { Autoplay, EffectFade } from "swiper";
import { loadStudents } from "../store/api/students";

SwiperCore.use([Autoplay, EffectFade]);

function Students(props) {
  const dispatch = useDispatch();
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    dispatch(
      loadStudents({
        onSuccess: (res) => {
          setStudentsData(res.data.data);
        },
      })
    );
  }, []);
  return (
    <section className="testimonial">
      <div className="container">
        <h2>{props.heading}</h2>
        <Swiper
          autoplay={true}
          slidesPerView={4}
          spaceBetween={15}
          className="owl-carousel testimonial_carousel"
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
        >
          {studentsData.map((studentItemData, index) => (
            <SwiperSlide
              className="item"
              key={`studentItemData-${studentItemData._id}-${index}`}
            >
              <Card>
                <Card.Body>
                  <p className="quote">
                    <i className="fas fa-quote-left"></i>
                  </p>
                  <p>{studentItemData.review}</p>
                  <img
                    src={studentItemData.image}
                    alt=""
                    className="img-fluid"
                  />
                  <h5 className="name">{studentItemData.name}</h5>
                  <p className="authority">{studentItemData.designation}</p>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Students;
