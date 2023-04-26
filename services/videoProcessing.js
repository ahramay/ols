const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
// const os = require("os");

const mediaPath = config.get("mediaPath");

var fs = require("fs");

const convertVideoToHLS = async (
  videoDirectory,
  videoFileName,
  onComplete,
  onError
) => {
  let proc;
  try {
    const sourceDirectory = videoDirectory;
    const sourcePath = path.join(sourceDirectory, videoFileName);

    const videoDimensions = await getVideoDimensions(sourcePath);

    const originalAspectRatio = videoDimensions.width / videoDimensions.height;

    const presets = [
      { width: 640, height: 360, bitrate: 400, audioBitrate: "96k" },
      { width: 842, height: 480, bitrate: 700, audioBitrate: "128k" },
      { width: 1280, height: 720, bitrate: 1400, audioBitrate: "128k" },
      { width: 1920, height: 1080, bitrate: 2500, audioBitrate: "192k" },
    ];

    let renditions = presets.map((ren) => {
      ren.width = Math.ceil(ren.height * originalAspectRatio);
      return ren;
    });

    // console.log("ALL RENDITIONS => ", renditions);
    const max_bitrate_ratio = 1.07;
    const segment_target_duration = 4;
    const rate_monitor_buffer_ratio = 1.5;

    const filteredRenditions = renditions.filter((ren) => {
      // console.log("TYPE OF => ", typeof videoDimensions.height);
      // console.log(videoDimensions.height + " >= " + ren.height);
      return videoDimensions.height >= ren.height;
    });
    // console.log("Filtered RENDITIONS => ", renditions);
    let master_playlist = "#EXTM3U\n#EXT-X-VERSION:3";

    proc = ffmpeg({
      source: sourcePath,
    });
    proc.addOption("-hide_banner -y");
    filteredRenditions.forEach((rendition) => {
      let { width, height, bitrate, audioBitrate } = rendition;
      const maxBitrate = bitrate * max_bitrate_ratio;

      const bufsize = bitrate * rate_monitor_buffer_ratio;

      proc
        .output(sourceDirectory + `/${height}p.m3u8`)
        .addOption("-c:a aac")
        .addOption("-ar 48000")
        .addOption("-c:v h264")
        .addOption("-profile:v main")
        .addOption("-crf 20")
        .addOption("-sc_threshold 0")
        .addOption("-g 30")
        .addOption("-keyint_min 30")
        .addOption(`-hls_time ${segment_target_duration}`)
        .addOption("-hls_playlist_type vod")
        .addOption(`-vf scale=h=${height}:force_original_aspect_ratio=increase`)
        .addOption(`-b:v ${bitrate}k`)
        .addOption(`-maxrate ${maxBitrate}k`)
        .addOption(`-bufsize ${bufsize}k`)
        .addOption(`-b:a ${audioBitrate}`)
        .addOption(
          "-hls_segment_filename " + sourceDirectory + `/${height}p_%03d.ts`
        );

      const bandwidth = bitrate + "000";
      const resolution = `${width}x${height}`;
      const videoId = videoFileName.split(".")[0];
      const endpoint = path.join(
        mediaPath,
        "uploads/videos",
        videoId,
        height + "p.m3u8"
      );
      master_playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${endpoint}\n`;
    });
    proc.on("start", function (commandLine) {
      console.log("progress", "Spawned Ffmpeg with command: " + commandLine);
    });

    proc
      .on("progress", function (info) {
        // console.log("progress", info);
      })
      .on("end", function () {
        // console.log("complete");
        // const finalPlaylist = fs.createWriteStream(
        //   sourceDirectory + "/playlist.m3u8"
        // );
        // finalPlaylist.write(master_playlist);
        // finalPlaylist.end();
        fs.writeFileSync(sourceDirectory + "/playlist.m3u8", master_playlist);
        onComplete({
          videoQualities: filteredRenditions.map((r) => r.height),
        });
      })
      .on("error", function (err) {
        // console.log("error", err);
        if (onError) onError(err);
      });

    proc.run();
  } catch (err) {
    if (proc) if (onError) onError(err);
  }
};

getVideoDimensions = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, function (err, data) {
      data.streams.forEach((st, index) => {
        const { width, height } = st;
        if (width && height) {
          resolve({ width, height });
        }
      });
      reject("failed to get dimensions");
    });
  });
};

exports.convertVideoToHLS = convertVideoToHLS;
