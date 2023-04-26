import React from "react";
import { Card } from "react-bootstrap";

import FirstImage from "../assets/temp/Icon_1.png";
import SecondImage from "../assets/temp/Icon_2.png";
import ThirdImage from "../assets/temp/Icon_3.png";
import ForthImage from "../assets/temp/Icon_4.png";

import NewImage1 from "../assets/temp/why_1.png";
import NewImage2 from "../assets/temp/why_1.png";
import NewImage3 from "../assets/temp/why_3.png";
import NewImage4 from "../assets/temp/why_4.png";

export const outClassData = [
  {
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export const studentData = [
  {
    _id: 1,
    text:
      "Lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    paragraph:
      " Ut enim ad minim veniam, quis nostrud exercitation ullamco  laboris nisi ut aliquip ex ea commodo consequat.",
    image: NewImage1,
  },
  {
    _id: 2,
    text:
      "Lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    paragraph:
      " Ut enim ad minim veniam, quis nostrud exercitation ullamco  laboris nisi ut aliquip ex ea commodo consequat.",
    image: NewImage2,
  },
  {
    _id: 3,
    text:
      "Lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    paragraph:
      " Ut enim ad minim veniam, quis nostrud exercitation ullamco  laboris nisi ut aliquip ex ea commodo consequat.",
    image: NewImage3,
  },
  {
    _id: 4,
    text:
      "Lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    paragraph:
      " Ut enim ad minim veniam, quis nostrud exercitation ullamco  laboris nisi ut aliquip ex ea commodo consequat.",
    image: NewImage4,
  },
];

const cardsArray = [
  {
    _id: 1,
    name: "Learn Anything",
    title: "1600+ Topics",
    image: FirstImage,
  },
  {
    _id: 2,
    name: "Future Genius",
    title: "1900+ Students",
    image: SecondImage,
  },
  {
    _id: 3,
    name: "That's a lot",
    title: "15900 Tests Taken",
    image: ThirdImage,
  },
  {
    _id: 4,
    name: "All trained professionals",
    title: "250+ instructors",
    image: ForthImage,
  },
];

function WhyData(props) {
  return (
    <>
      <div className="sats">
        <div className="container">
          <div className="row">
            {cardsArray.map((cardItem, index) => (
              <div
                className="col-lg-3 col-md-6 col-12"
                key={`cardItems-${cardItem._id}-${index}`}
              >
                <Card>
                  <Card.Body>
                    <img src={cardItem.image} className="img-fluid" alt="" />
                    <h6> {cardItem.title} </h6> <p> {cardItem.name} </p>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default WhyData;
