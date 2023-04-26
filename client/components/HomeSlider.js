import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import newImage from "../assets/temp/si.png";
import FirstImage from "../assets/temp/Icon_1.png";
import SecondImage from "../assets/temp/Icon_2.png";
import ThirdImage from "../assets/temp/Icon_3.png";
import ForthImage from "../assets/temp/Icon_4.png";
import Button from "../components/HomeButton";
import WhyData from "../shared/whyData";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/components/navigation/navigation.scss";

SwiperCore.use([Navigation, Autoplay, EffectFade, Pagination]);

import { loadHomeSliders } from "../store/api/homeSliders";

function HomeSlider(props) {
  const dispatch = useDispatch();
  // loadHomeSliders
  const [index, setIndex] = useState(0);
  const userCount = useSelector((state) => state.ui.homePage.data.userCount);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    dispatch(
      loadHomeSliders({
        onSuccess: (res) => {
          setSliders(res.data.data);
        },
      })
    );
  }, []);

  return (
    <section className="banner_home">
      <div style={{ position: "relative" }}>
        <div className="flip-count">
          <div>
            <div className="flip-counter-wrapper">
              {`${userCount}`.split("").map((number) => (
                <span
                  className="number"
                  key={number + "flip-coint-number"}
                  data-number={"" + number}
                >
                  <span className="primary"></span>
                  <span className="secondary"></span>
                </span>
              ))}
            </div>
            <p className="text-white text-center">REGISTERED USERS</p>
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <Swiper
          autoplay={true}
          loop={true}
          slidesPerView={1}
          spaceBetween={15}
          navigation={{
            nextEl: "#homeSliderNext",
            prevEl: "#homeSliderPrev",
          }}
        >
          {sliders.map((coursalItem, index) => (
            <SwiperSlide key={`coursalItem-${coursalItem._id}-${index}`}>
              <div>
                <img
                  className="d-none d-md-block w-100"
                  src={coursalItem.image}
                  alt="First slide"
                  style={{ objectFit: "cover" }}
                />

                <img
                  className="d-block d-md-none w-100"
                  src={coursalItem.mobileImage || coursalItem.image}
                  alt="First slide"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </SwiperSlide>
          ))}

          <div
            id="homeSliderPrev"
            className="float-left"
            style={{
              position: "absolute",
              top: "50%",
              left: "20px",
              width: "40px",
              height: "40px",
              backgroundColor: "#012237",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              cursor: "pointer",
              zIndex: 4,
              transform: "translateY(-20px)",
            }}
          >
            <i className="far fa-long-arrow-alt-left text-white"></i>
          </div>
          <div
            id="homeSliderNext"
            className="float-right"
            style={{
              width: "40px",
              height: "40px",
              position: "absolute",
              top: "50%",
              right: "20px",
              backgroundColor: "#012237",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              cursor: "pointer",
              zIndex: 4,
              transform: "translateY(-20px)",
            }}
          >
            <i className="far fa-long-arrow-alt-right text-white"></i>
          </div>
        </Swiper>
      </div>
      {/* <Carousel
        indicators={false}
        prevIcon={
          <span className="carousel-control-next-icon" aria-hidden="true">
            <i className="far fa-long-arrow-alt-left"></i>
          </span>
        }
        nextIcon={
          <span className="carousel-control-next-icon" aria-hidden="true">
            <i className="far fa-long-arrow-alt-right"></i>
          </span>
        }
        // activeIndex={index}
        // onSelect={handleSelect}
      >
        {sliders.map((coursalItem, index) => (
          <Carousel.Item
            key={`coursalItem-${coursalItem._id}-${index}`}
            className="carousel-item"
          >
            <img
              className="d-none d-md-block w-100"
              src={coursalItem.image}
              alt="First slide"
              style={{ objectFit: "cover" }}
            />

            <img
              className="d-block d-md-none w-100"
              src={coursalItem.mobileImage || coursalItem.image}
              alt="First slide"
              style={{ objectFit: "cover" }}
            />
            <Carousel.Caption>
              {coursalItem.title && <h1>{coursalItem.title}</h1>}
              {coursalItem.text && <p>{coursalItem.text}</p>}
              {coursalItem.buttonText && (
                <Link className="btn btn_styled" to={coursalItem.buttonLink}>
                  {coursalItem.buttonText}
                </Link>
              )}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel> */}
      {/* <div className="d-sm-block">
        <WhyData />
      </div> */}

      {/* <Link to={props.buttonLink}>
        <Button title={props.buttonText} btnClass="" />
      </Link> */}
    </section>
  );
}

export default HomeSlider;
