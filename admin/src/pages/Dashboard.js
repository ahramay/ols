import React from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "components/Headers/Header.jsx";
import ReactPlayer from "react-player";
import Hls from "hls.js";

class Index extends React.Component {
  videoPlayer = null;

  componentDidMount = () => {
    // setInterval(() => {
    //   if (this.videoPlayer) {
    //     const ct = this.videoPlayer.getCurrentTime();
    //     console.log("Current Time", Math.ceil(ct));
    //   }
    // }, 1000);

    if (Hls.isSupported()) {
      var video = this.videoPlayer;
      var hls = new Hls();
      // bind them together
      hls.attachMedia(video);
      // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        // const qs = hls.levels;
        // console.log(qs);
      });
      hls.loadSource(
        "https://outclasslms.s3.ap-south-1.amazonaws.com/uploads/videos/08657854-106a-4fb0-8150-c6d8e688e301/playlist.m3u8"
      );
    }
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Dashboard</h2>
              </div>
            </CardHeader>
            <CardBody className="bg-secondary">
              <h1>Content Here</h1>
              <video
                ref={(node) => {
                  this.videoPlayer = node;
                }}
                controls={true}
                style={{ width: "50%" }}
              ></video>
              {/* 
              <ReactPlayer
                ref={(r) => (this.videoPlayer = r)}
                onSeek={(d) => {
                  console.log(d);
                }}
                onReady={() => {
                  const internal = this.videoPlayer.getInternalPlayer();
                  console.log("INTERNAL PLAYER", internal);
                }}
                controls={true}
                playing={false}
                url="https://outclasslms.s3.ap-south-1.amazonaws.com/uploads/videos/08657854-106a-4fb0-8150-c6d8e688e301/playlist.m3u8"
              /> */}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default Index;
