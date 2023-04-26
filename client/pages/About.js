import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import renderHTML from "react-render-html";
import { studentData } from "../shared/aboutData";
import OurTeam from "../shared/OurTeamAbout";

import { useSelector, useDispatch } from "react-redux";
import { getAboutStory } from "../store/api/aboutStory";
import { loadAboutInfoCards } from "../store/api/aboutInfoCards";
import { loadAbouPageCMS } from "../store/api/aboutPage";
import { Helmet } from "react-helmet";

const About = (props) => {
  const aboutCms = useSelector((state) => state.ui.aboutPage.data);
  const dispatch = useDispatch();

  const [storySection, setStorySection] = useState({
    headng: "",
    text: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });

  const [aboutInfoCards, setAboutInfoCards] = useState([]);

  useEffect(() => {
    //loading CMS
    dispatch(loadAbouPageCMS({}));
    //loading story section
    dispatch(
      getAboutStory({
        onSuccess: (res) => {
          setStorySection(res.data.data);
        },
      })
    );

    //loading about info cards
    dispatch(
      loadAboutInfoCards({
        onSuccess: (res) => {
          setAboutInfoCards(res.data.data);
        },
      })
    );
  }, []);
  return (
    <>
      <Helmet>
        <meta property="og:title" content={aboutCms.metaTitle} />
        <meta name="description" content={aboutCms.metaDescription} />
        <meta name="keywords" content={aboutCms.metaKeyWords} />
      </Helmet>
      <section className="other_banner">
        <div className="container">
          <h1>{aboutCms.mainHeading}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{aboutCms.mainHeading}</li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="join">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6 align-self-center">
              <h2>{storySection.heading}</h2>
              <p>{storySection.text && renderHTML(storySection.text)}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-6 align-self-center">
              <img src={storySection.image} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
      <section
        className="value"
        style={{
          background: `url(${aboutCms.image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-8 offset-lg-4">
              <h2>{aboutCms.heading2}</h2>

              <div className="sats">
                <div className="row">
                  {aboutInfoCards.map((data, index) => (
                    <div key={data._id} className="col-lg-4 col-md-6 col-12">
                      <div className="card" key={`data-${data._id}-${index}`}>
                        <div className="card-body">
                          <img src={data.image} alt="" className="img-fluid" />
                          <h6>{data.heading}</h6>
                          <p>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OurTeam heading={aboutCms.heading3} />
    </>
  );
};

About.loadData = ({ store }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];

  // if (token) {
  promiseArray.push(dispatch(loadAbouPageCMS({})));
  // }
  return Promise.all(promiseArray);
};

export default About;
