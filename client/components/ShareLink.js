import React from "react";

import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";

export default (props) => {
  const { shareLink = "" } = props;
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <FacebookShareButton
        url={shareLink}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#4267B2",
          width: "30px",
          height: "30px",
          padding: "0px",
          margin: "5px",
          borderRadius: "30px",
        }}
      >
        <i className="fab fa-facebook m-0"></i>
      </FacebookShareButton>

      <WhatsappShareButton
        url={shareLink}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#25D366",
          width: "30px",
          height: "30px",
          padding: "0px",
          margin: "5px",
          borderRadius: "30px",
        }}
      >
        <i className="fab fa-whatsapp m-0"></i>
      </WhatsappShareButton>
      <TwitterShareButton
        url={shareLink}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#1DA1F2",
          width: "30px",
          height: "30px",
          padding: "0px",
          margin: "5px",
          borderRadius: "30px",
        }}
      >
        <i className="fab fa-twitter m-0"></i>
      </TwitterShareButton>

      <LinkedinShareButton
        url={shareLink}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#0072b1",
          width: "30px",
          height: "30px",
          padding: "0px",
          margin: "5px",
          borderRadius: "30px",
        }}
      >
        <i className="fab fa-linkedin m-0"></i>
      </LinkedinShareButton>
    </div>
  );
};
