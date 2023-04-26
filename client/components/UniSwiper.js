import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import SwiperCore, { Autoplay, EffectFade } from "swiper";
import { useDispatch } from "react-redux";
import { loadUniversities } from "../store/api/unis";

SwiperCore.use([Autoplay, EffectFade]);

function UniSwiper(props) {
  const dispatch = useDispatch();

  const [unis, setUnis] = useState([]);

  useEffect(() => {
    dispatch(
      loadUniversities({
        onSuccess: (res) => {
          setUnis(res.data.data);
        },
      })
    );
  }, []);

  const options = {
    autoplay: true,
    responsive: {
      0: {
        items: 3,
      },
      576: {
        items: 4,
      },
      992: {
        items: 6,
      },
      1200: {
        items: 9,
      },
    },
  };

  return (
    <section className="partner">
      <div className="container">
        <p>{props.text}</p>

        <Swiper
          id="partner_carousel"
          slidesPerView={9}
          autoplay={true}
          spaceBetween={20}
          navigation={{
            nextEl: "#uniSwiperNext",
            prevEl: "#uniSwiperPrev",
          }}
          breakpoints={{
            0: {
              slidesPerView: 3,
            },
            576: {
              slidesPerView: 4,
            },
            992: {
              slidesPerView: 6,
            },
            1200: {
              slidesPerView: 9,
            },
          }}
        >
          {unis.map((data, index) => (
            <SwiperSlide key={`data-${data._id}-${index}`} className="item">
              <img src={data.image} className="img-fluid" />
            </SwiperSlide>
          ))}

          <div className="mt-1">
            <div
              id="uniSwiperPrev"
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
              id="uniSwiperNext"
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
    </section>
  );
}

export default UniSwiper;
