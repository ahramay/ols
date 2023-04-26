import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { getHomeJoin } from "../store/api/homeJoin";
import { Link } from "react-router-dom";

function PreFooter(props) {
  const dispatch = useDispatch();
  const [homeJoin, setHomeJoin] = useState({
    heading: "",
    image: "",
    text: "",
    buttonText: "",
    buttonLink: "",
    buttonText2: "",
    buttonLink2: "",
  });

  useEffect(() => {
    dispatch(
      getHomeJoin({
        onSuccess: (res) => {
          setHomeJoin(res.data.data);
        },
      })
    );
  }, []);
  return (
    <section className="join">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-7 col-12 align-self-center">
            <h2>{homeJoin.heading}</h2>
            <p>{homeJoin.text}</p>

            <Link to={homeJoin.buttonLink} className="btn more">
              {homeJoin.buttonText}
            </Link>

            <Link
              to={homeJoin.buttonLink2}
              className="btn more ml-1 ml-md-4 yellow-btn"
            >
              {homeJoin.buttonText2}
            </Link>
          </div>
          <div className="col-lg-5 col-md-5 col-12">
            <img src={homeJoin.image} alt="" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreFooter;
