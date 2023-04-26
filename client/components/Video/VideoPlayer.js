import React from "react";
import videojs from "video.js";

import "video.js/dist/video-js.min.css";
import "@silvermine/videojs-quality-selector/dist/css/quality-selector.css";
import watermark from "videojs-watermark-with-text";
import seekButtons from "videojs-seek-buttons";
import "videojs-seek-buttons/dist/videojs-seek-buttons.css";

import storage from "../../services/storage";

videojs.options.hls.overrideNative = true;
videojs.options.html5.nativeAudioTracks = false;
videojs.options.html5.nativeVideoTracks = false;

window.videojs = videojs;
require("videojs-contrib-hls");
// import "videojs-watermark-with-text/dist/videojs-watermark.css";
require("@silvermine/videojs-quality-selector")(videojs);

class VideoPlayer extends React.Component {
  componentDidMount() {
    const {
      waterMarkText = "",
      onVideoEnd,
      onNext,
      onPrev,
      videoSource = "",
      playbackRates,
      sources,
    } = this.props;

    videojs.registerPlugin("watermark", watermark);

    this.player = videojs(
      this.videoNode,
      {
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          hls: {
            overrideNative: true,
            debug: true,
          },
        },
        playbackRates,
      },
      function onPlayerReady() {
        this.src(sources);
        this.controlBar.addChild("QualitySelector");

        this.watermark({
          type: "text",
          text: waterMarkText,
        });

        const continueVideo = storage.get("continue_video");

        if (continueVideo) {
          const parsedInt = parseInt(continueVideo) || 0;

          this.currentTime(parsedInt);

          storage.remove("continue_video");
        }

        this.on("ended", () => {
          if (onVideoEnd) onVideoEnd();
        });
      }
    );

    console.log("PLAYER -=> ", this.player);

    //////// backward and forward buttons
    /* ADD PREVIOUS */
    var Button = videojs.getComponent("Button");

    var PrevButton = videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments);

        this.addClass("vjs-icon-previous-item");
        this.controlText("Previous");
      },

      handleClick: function () {
        if (onPrev) onPrev();
      },
    });

    /* ADD PREVIOUS */
    var NextButton = videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments);

        this.addClass("vjs-icon-next-item");
        this.controlText("Next");
      },

      handleClick: function () {
        if (onNext) onNext();
      },
    });

    // Register the new component
    videojs.registerComponent("NextButton", NextButton);
    videojs.registerComponent("PrevButton", PrevButton);
    //player.getChild('controlBar').addChild('SharingButton', {});
    this.player.getChild("controlBar").addChild("PrevButton", {}, 0);
    this.player.getChild("controlBar").addChild("NextButton", {}, 2);

    ///seek buttons
    this.player.seekButtons({
      forward: 5,
      back: 5,
      forwardIndex: 3,
      backIndex: 3,
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  getCurrentDuration = () => {
    if (!this.player) return 0;
    return Math.floor(this.player.currentTime());
  };

  exitFullScreen = () => {
    if (!this.player) return;
    if (!this.player.isFullscreen_) return;
    const document = window.document;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
  paused = () => this.player.paused();
  pause = () => {
    if (!this.player) return;
    this.player.pause();
  };
  play = () => {
    if (!this.player) return;
    this.player.play();
  };

  render() {
    const { captions } = this.props;
    return (
      <div className="course-video-wrapper">
        <div data-vjs-player>
          <video
            id="my-vide-player"
            width="720"
            height="420"
            style={{ width: "100%" }}
            controls={true}
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-big-play-centered"
            controlsList="nodownload"
          >
            {captions && (
              <track
                kind="captions"
                src={captions}
                srclang="en"
                label="English"
                default
              ></track>
            )}
          </video>
        </div>
      </div>
    );
  }
}
export default VideoPlayer;
