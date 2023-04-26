import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import renderHTML from "react-render-html";
import { paymentData } from "../Shared/HowData";
import { Helmet } from "react-helmet";
import { getHowToPay } from "../store/api/howToPay";
import { loadPaymentMethod } from "../store/api/paymentMethods";
import { Link } from "react-router-dom";

function HowToPay(props) {
  const dispatch = useDispatch();

  const howToPaySec = useSelector((state) => state.ui.howToPayPage.data);

  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    dispatch(getHowToPay({}));

    //load payment methods
    dispatch(
      loadPaymentMethod({
        onSuccess: (res) => {
          setPaymentMethods(res.data.data);
        },
      })
    );
  }, []);

  return (
    <>
      <Helmet>
        <meta property="og:title" content={howToPaySec.metaTitle} />
        <meta name="description" content={howToPaySec.metaDescription} />
        <meta name="keywords" content={howToPaySec.metaKeyWords} />
      </Helmet>

      <section className="other_banner">
        <div className="container">
          <h1>{howToPaySec.buttonText}</h1>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                {howToPaySec.buttonText}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="content">
        <div className="how_to">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-6 col-12">
                <h2>{howToPaySec.heading}</h2>
                <div>{howToPaySec.text && renderHTML(howToPaySec.text)}</div>
              </div>
              <div className="col-md-6 col-lg-6 col-12">
                <img src={howToPaySec.image} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>

        <div className="process_pay">
          <div className="container">
            <div className="row">
              {paymentMethods.map((data, index) => (
                <div className="col-6 col-md-4 col-lg col-sm-6 col-12">
                  <div className="count" key={`data-${data._id}-${index}`}>
                    <h2>{index + 1}</h2>
                  </div>
                  <h6>{data.paymentType}</h6>
                  <p>{data.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

HowToPay.loadData = ({ store, matchedRoute }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];

  // if (token) {
  promiseArray.push(dispatch(getHowToPay({})));
  // }
  return Promise.all(promiseArray);
};

export default HowToPay;
