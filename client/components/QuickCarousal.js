import React, { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import SwiperCore, { Autoplay } from "swiper";
import { useDispatch } from "react-redux";
import { loadStats } from "../store/api/stats";
// import * as $ from "jquery/dist/jquery";

SwiperCore.use([Autoplay]);

function Milestone(props) {
  const dispatch = useDispatch();

  const [stats, setStats] = useState([]);
  useEffect(() => {
    dispatch(
      loadStats({
        onSuccess: (res) => {
          setStats(res.data.data);

          //this funciton is initialized in render js file.
          if (window.initializeQuickCarousal) {
            window.initializeQuickCarousal();
          }
        },
      })
    );
  }, []);
  return (
    <section className="milestone">
      <div className="container">
        <h2 className="mb-2 text-white">{props.heading}</h2>

        <Swiper slidesPerView={6} className="quick-carousel">
          <div className="view-content slides">
            {stats.map((data, index) => (
              <SwiperSlide key={data._id}>
                <div className="styleo align-self-center">
                  <div className="cover">
                    <h5>{data.stats}</h5>
                    <p> {data.text}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </section>
  );
}

export default Milestone;
