import React, { useState, useEffect, useRef, useMemo } from "react";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { getAllFreeVideos } from "../store/api/freeVideos";
import { loadFreeVideosPageCMS } from "../store/api/freeVidosPageCMS";
import { getFreeVideosImageSec } from "../store/api/freeVideoImageSec";
import renderHTML from "react-render-html";
import { Helmet } from "react-helmet";
import { setLoginModalVisibility } from "../store/ui/loginModal";
import storage from "../services/storage";
const FreeVideos = (props) => {
  const dispatch = useDispatch();
  const [selectedCategory, setStelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const categories = useSelector((state) => state.entities.categories);
  const freeVideos = useSelector((state) => state.entities.freeVideos);
  const authToken = useSelector((state) => state.auth.token);
  const freeVideosPageCMS = useSelector(
    (state) => state.ui.freeVideosPage.data
  );

  const mainVideoRef = useRef(null);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentPlayingVideoId, setCurrentPlayingVideoId] = useState("");

  const [imageSec, setImageSec] = useState({
    headng: "",
    text: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });

  const filteredCategoriesList = useMemo(() => {
    return categories.list.filter((cat) => {
      const freeVideosInCategory = freeVideos.list.filter((fv) => {
        return cat._id === fv.category._id;
      });
      return freeVideosInCategory.length > 0;
    });
  }, [categories.list, freeVideos.list]);

  useEffect(() => {
    if (filteredCategoriesList.length > 0 && !selectedCategory) {
      setStelectedCategory(filteredCategoriesList[0]._id);
      setCategoryName(filteredCategoriesList[0].name);
    }
  }, [filteredCategoriesList.length])
  useEffect(() => {
    
    dispatch(loadFreeVideosPageCMS({}));
    dispatch(getAllFreeVideos({}));

    dispatch(
      getFreeVideosImageSec({
        onSuccess: (res) => {
          setImageSec(res.data.data);
        },
      })
    );
  }, []);

  useEffect(() => {
    const videoToPlay = storage.get("FREE_VIDEO_TO_PLAY");
    if (videoToPlay) {
      storage.remove("FREE_VIDEO_TO_PLAY");
      setCurrentPlayingVideoId(videoToPlay);
      setShowVideoModal(true);
    }
  }, [authToken]);

  const renderCategories = () => {
    return (
      <>
        {(filteredCategoriesList || []).map((cat) => {
          return (
            <li
              className="nav-item"
              role="presentation"
              key={cat._id + "home course"}
            >
              <a
                className={
                  selectedCategory === cat._id ? "nav-link active" : "nav-link"
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

  const renderVideos = () => {
    let list = freeVideos.list;
    if (selectedCategory) {
      list = freeVideos.list.filter((fv) => {
        return fv.category._id === selectedCategory;
      });
    } else {
      return null;
    }
    return (
      <div className="row">
        {list.map((fv) => {
          return (
            <div key={fv._id} className="col-lg-3 col-md-4 col-sm-6 col-12">
              <a
                href="#"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();

                  if (mainVideoRef.current) {
                    mainVideoRef.current.target.pauseVideo();
                  }

                  if (!authToken) {
                    //this storage flag will be used to play video after login..
                    //useEffect will be called as authToken changes
                    storage.store("FREE_VIDEO_TO_PLAY", fv.videoId);
                    dispatch(setLoginModalVisibility(true));
                    return;
                  }

                  setCurrentPlayingVideoId(fv.videoId);
                  setShowVideoModal(true);
                }}
              >
                <div className="free-video-list-item">
                  <div
                    className="image-container"
                    style={{ backgroundImage: `url("${fv.thumbnail}")` }}
                  ></div>
                  <h5 className="video-name">{fv.videoTitle}</h5>
                  <h5 className="video-desc">{fv.description}</h5>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <meta property="og:title" content={freeVideosPageCMS.metaTitle} />
        <meta name="description" content={freeVideosPageCMS.metaDescription} />
        <meta name="keywords" content={freeVideosPageCMS.metaKeyWords} />
      </Helmet>

      <div style={{ paddingTop: "200px" }}>
        <div className="container">
          <h2 className="text-center">{freeVideosPageCMS.heading1}</h2>
          <h1
            className="text-center font-weight-bold"
            style={{ color: "rgb(0, 172, 240)" }}
          >
            {freeVideosPageCMS.heading2}
          </h1>
        </div>
      </div>

      <div className="container">
        <div className="youtube-video-iframe">
          <YouTube
            videoId={freeVideosPageCMS.text1}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            onReady={(e) => {
              mainVideoRef.current = e;
            }}
            opts={{
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
              },
            }}
          />
        </div>
      </div>

      <section className="why_data">
        <div className={"bg_2"}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12 align-self-center order-md-2">
                <h2>{imageSec.heading}</h2>
                <div>{imageSec.text && renderHTML(imageSec.text)}</div>
              </div>
              <div className="col-lg-6 col-md-6 col-12  order-md-1 ">
                <img src={imageSec.image} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <section className="popular">
          <div className="bg_cover">
            <div className="container">
              <h2>{categoryName}</h2>
              <ul className="nav nav-tabs" id="courseTab" role="tablist">
                {renderCategories()}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div
        className="container"
        style={{
          marginTop: "50px",
          marginBottom: "20px",
        }}
      >
        {renderVideos()}
      </div>

      <div className="choose-course-banner">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h1 className="text-center text-white text-md-left">
                {freeVideosPageCMS.heading3}
              </h1>
            </div>

            <div className="col-md-8">
              <h1 className="text-center text-white text-md-left font-weight-bold">
                {freeVideosPageCMS.heading4}
              </h1>
            </div>
            <div className="col-md-4">
              <div className="monthly-plan-banner-btn-container">
                <Link
                  to={freeVideosPageCMS.buttonLink1}
                  className="monthly-plan-btn"
                >
                  {freeVideosPageCMS.buttonText1}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div style={{ backgroundColor: "#000000" }}>
          <YouTube
            videoId={currentPlayingVideoId}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
          />
        </div>
      </Modal>
    </>
  );
};

FreeVideos.loadData = ({ store, matchedRoute }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];
  // if (token) {

  // }
  promiseArray.push(dispatch(loadFreeVideosPageCMS));
  promiseArray.push(dispatch(getAllFreeVideos({})));
  return Promise.all(promiseArray);
};

export default FreeVideos;
