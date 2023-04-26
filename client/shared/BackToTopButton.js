import React from "react";
import BackToTop from "react-back-to-top-button";
import { allSetting } from "../shared/data";
import ReactWhatsapp from "react-whatsapp";
import MessengerCustomerChat from "react-messenger-customer-chat";
import { useSelector } from "react-redux";
function BackToTopButton(props) {
  const commonData = useSelector((state) => state.ui.commonData);

  return (
    <section className="side">
      <MessengerCustomerChat pageId="110608604014266" appId="404150057463766" />

      <ReactWhatsapp number={commonData.contactNumber}>
        <a style={{ textDecoration: "none" }} className="btn-1" target="_blank">
          <i className="fab fa-whatsapp"></i>
        </a>
      </ReactWhatsapp>
      <a style={{ textDecoration: "none" }} id="button"></a>
      <BackToTop
        showOnScrollUp
        showAt={100}
        speed={1500}
        easing="easeInOutQuint"
      >
        <span>
          <a
            style={{ textDecoration: "none" }}
            id="button"
            className="show"
          ></a>
        </span>
      </BackToTop>
    </section>
  );
}

export default BackToTopButton;
