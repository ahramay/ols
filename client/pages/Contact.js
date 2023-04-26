import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactInfo from "../shared/ContactInfo";
import { loadInfoCards } from "../store/api/contactInfoCards";
import { getContactPageCMS } from "../store/api/contactPageCms";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";
function Contact(props) {
  const dispatch = useDispatch();
  const commonData = useSelector((state) => state.ui.commonData);
  const [contactCMS, setContactCMS] = useState({
    mainHeading: "",
    heading1: "",
    heading2: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  });
  const [contactCards, setContactCards] = useState([]);

  useEffect(() => {
    dispatch(
      getContactPageCMS({
        onSuccess: (res) => {
          setContactCMS(res.data.data);
        },
      })
    );

    dispatch(
      loadInfoCards({
        onSuccess: (res) => {
          setContactCards(res.data.data);
        },
      })
    );
  }, []);

  return (
    <>
      <Helmet>
        <meta property="og:title" content={contactCMS.metaTitle} />
        <meta name="description" content={contactCMS.metaDescription} />
        <meta name="keywords" content={contactCMS.metaKeyWords} />
      </Helmet>
      <section className="other_banner">
        <div className="container">
          <h1>{contactCMS.mainHeading}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                {contactCMS.mainHeading}
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="content">
        <div className="contact_info">
          <div className="container">
            <div className="row">
              {contactCards.map((data, index) => (
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="card">
                    <div
                      className="card-body"
                      key={`data-${data._id}-${index}`}
                    >
                      <img src={data.image} alt="" className="img-fluid" />
                      <h5>{data.heading}</h5>
                      <p>{data.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="contact_links">
          <div className="container">
            <h2>{contactCMS.heading1}</h2>
            <div className="width_ini">
              <div className="row">
                {commonData.twitterLink && (
                  <div className="col-3">
                    <a href={commonData.twitterLink} target="_blank">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                )}

                {commonData.facebookLink && (
                  <div className="col-3">
                    <a href={commonData.facebookLink} target="_blank">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                )}
                {commonData.linkedInLink && (
                  <div className="col-3">
                    <a href={commonData.linkedInLink} target="_blank">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </div>
                )}
                {commonData.instagramLink && (
                  <div className="col-3">
                    <a href={commonData.instagramLink} target="_blank">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ContactInfo heading={contactCMS.heading2} />
      </section>
    </>
  );
}

export default Contact;
