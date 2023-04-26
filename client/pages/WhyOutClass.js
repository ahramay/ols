import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import renderHTML from "react-render-html";
import { loadWhyPageBoards } from "../store/api/whyPageBoards";
import { loadWhyPageCMS } from "../store/api/whyPage";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function WhyOutClass(props) {
  const dispatch = useDispatch();
  const cmsData = useSelector((state) => state.ui.whyPage.data);
  const [pageBoards, setPageBoards] = useState([]);

  useEffect(() => {
    // loading cms
    dispatch(loadWhyPageCMS());
    //loading boards
    dispatch(
      loadWhyPageBoards({
        onSuccess: (res) => {
          setPageBoards(res.data.data);
        },
      })
    );
  }, []);
  return (
    <>
      <Helmet>
        <meta property="og:title" content={cmsData.metaTitle} />
        <meta name="description" content={cmsData.metaDescription} />
        <meta name="keywords" content={cmsData.metaKeyWords} />
      </Helmet>
      <section className="other_banner">
        <div className="container">
          <h1>{cmsData.mainHeading}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{cmsData.mainHeading}</li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="content">
        <div className="why_page_content">
          <div className="container">
            <p className="text-center">
              {cmsData.text1 && renderHTML(cmsData.text1)}
            </p>
          </div>
        </div>
      </section>
      {/* <section className="banner_home" style={{ paddingTop: "80px" }}>
        <WhyData />
      </section> */}

      <section className="why_data">
        {pageBoards.map((pBoard, pIndex) => {
          const isOdd = pIndex % 2 == 1;
          return (
            <div className={isOdd ? "bg_1" : "bg_2"} key={pBoard._id}>
              <div className="container">
                <div className="row">
                  <div
                    className={
                      isOdd
                        ? "col-lg-6 col-md-6 col-12 align-self-center order-md-2"
                        : "col-lg-6 col-md-6 col-12 align-self-center order-md-1"
                    }
                  >
                    <h2>{pBoard.heading}</h2>
                    <div>{pBoard.text && renderHTML(pBoard.text)}</div>
                  </div>
                  <div
                    className={
                      isOdd
                        ? "col-lg-6 col-md-6 col-12  order-md-1 "
                        : "col-lg-6 col-md-6 col-12  order-md-2 "
                    }
                  >
                    <img src={pBoard.image} alt="" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

WhyOutClass.loadData = ({ store, matchedRoute }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];

  // if (token) {
  promiseArray.push(dispatch(loadWhyPageCMS({})));
  // }
  return Promise.all(promiseArray);
};

export default WhyOutClass;
