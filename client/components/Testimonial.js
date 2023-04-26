import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactStars from "react-rating-stars-component";
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

import { loadTestimonials } from "../store/api/testimonials";

const MultiCarouselPage = (props) => {
  const dispatch = useDispatch();

  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    if (!props.courseId) return;
    dispatch(
      loadTestimonials({
        id: props.courseId,
        onSuccess: (res) => {
          setTestimonials(res.data.data);
        },
      })
    );
  }, [props.courseId]);

  return testimonials.length > 0 ? (
    <Swiper
      autoplay={true}
      loop={true}
      slidesPerView={2}
      spaceBetween={15}
      navigation={{
        nextEl: "#courseTestimonialNext",
        prevEl: "#courseTestimonialPrev",
      }}
    >
      {testimonials.map((data) => {
        return (
          <SwiperSlide key={data._id}>
            <div className="course-testimonial-wrapper">
              <div className="row">
                <div className="col-3">
                  <img src={data.image} alt="" className="w-100" />
                </div>

                <div className="col-9">
                  <ReactStars
                    count={5}
                    value={data.rating || 0}
                    edit={false}
                    size={16}
                    isHalf={true}
                    emptySymbol="fa fa-star-o"
                    fullSymbol="fa fa-star"
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    filledIcon={<i className="fa fa-star"></i>}
                    activeColor="#00acf0"
                    fractions={2}
                  />

                  <div className="mt-2">{data.review}</div>

                  <h4>{data.name}</h4>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}

      <div className="mt-2 clearfix">
        <div
          id="courseTestimonialPrev"
          className="float-left"
          style={{
            width: "40px",
            height: "40px",
            float: "right",
            backgroundColor: "#012237",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            cursor: "pointer",
          }}
        >
          <i className="far fa-long-arrow-alt-left text-white"></i>
        </div>
        <div
          id="courseTestimonialNext"
          className="float-right"
          style={{
            width: "40px",
            height: "40px",
            float: "right",
            backgroundColor: "#012237",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            cursor: "pointer",
          }}
        >
          <i className="far fa-long-arrow-alt-right text-white"></i>
        </div>
      </div>
    </Swiper>
  ) : null;
};

export default MultiCarouselPage;
