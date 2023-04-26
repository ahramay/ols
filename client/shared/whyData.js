import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loadInfoCards } from "../store/api/infoCards";
import { Link } from "react-router-dom";

function WhyData(props) {
  const dispatch = useDispatch();

  const [infoCards, setInfoCards] = useState([]);

  useEffect(() => {
    dispatch(
      loadInfoCards({
        onSuccess: (res) => {
          setInfoCards(res.data.data);
        },
      })
    );
  }, []);
  return (
    <>
      <div className="sats">
        <div className="container">
          <div className="row">
            {infoCards.map((cardItem, index) => (
              <div
                className="col-lg-3 col-md-6 col-12"
                key={`cardItems-${cardItem._id}-${index}`}
              >
                <a href={cardItem.link || "#"}>
                  <Card>
                    <Card.Body>
                      <img src={cardItem.image} className="img-fluid" alt="" />
                      <h6> {cardItem.heading} </h6> <p> {cardItem.text} </p>
                    </Card.Body>
                  </Card>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default WhyData;
