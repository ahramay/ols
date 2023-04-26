import React from "react";
import { allSetting } from "../shared/footerData";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import renderHTML from "react-render-html";

function Footer(props) {
  const commonData = useSelector((state) => state.ui.commonData);
  const footerLinks = useSelector((state) => state.ui.footerLinks);
  const footer = useSelector((state) => state.ui.footer);
  return (
    <footer id="footer">
      <div className="widgets">
        <div className="container">
          <div
            className="nav "
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {footerLinks.list.map((fl) => {
              return (
                <div className="nav-item footerlink-item" key={fl._id}>
                  <NavLink to={fl.link} className="nav-link">
                    {fl.name}
                  </NavLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="widgets_end">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12">
              <img src={commonData.logo} alt="" className="img-fluid" />
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div>{renderHTML(footer.paragraph)}</div>
              <a href={"tel:" + commonData.contactNumber}>
                <i className="fal fa-phone"></i>
                {commonData.contactNumber}
              </a>
            </div>
            <div className="col-lg-4 col-md-4 col-12 align-self-center">
              <div className="row social">
                {commonData.twitterLink && (
                  <div className="col-lg-3 col-md-3 col-3">
                    <a target="_blank" href={commonData.twitterLink}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                )}
                {commonData.facebookLink && (
                  <div className="col-lg-3 col-md-3 col-3">
                    <a target="_blank" href={commonData.facebookLink}>
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                )}
                {commonData.linkedInLink && (
                  <div className="col-lg-3 col-md-3 col-3">
                    <a target="_blank" href={commonData.linkedInLink}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </div>
                )}
                {commonData.instagramLink && (
                  <div className="col-lg-3 col-md-3 col-3">
                    <a target="_blank" href={commonData.instagramLink}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <p className="text-center">© {footer.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
