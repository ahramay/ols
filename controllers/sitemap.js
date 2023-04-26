const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");

const { GenreicPages } = require("../models/GenericPages");

const { Course } = require("../models/Course");
const { Chapter } = require("../models/Chapter");
const { Lesson } = require("../models/Lesson");

const router = express.Router();
let sitemap;
router.get("/sitemap.xml", async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");

  try {
    const smStream = new SitemapStream({
      hostname: "https://www.out-class.org/",
    });
    const pipeline = smStream.pipe(createGzip());

    const mainPages = [
      "/",
      "/about-us",
      "/contact-us",
      "/how-to-pay",
      "/events",
      "/why-out-class",
      "/our-teachers",
      "/faqs",
      "/all-courses",
      "/blogs",
      "/login",
      "/free-videos",
      "/subscription",
      "/register",
    ];

    mainPages.forEach((url) => smStream.write({ url }));

    //generic pages
    const genericPages = await GenreicPages.find({ isDeleted: false });

    genericPages.forEach((genericPage) =>
      smStream.write({ url: `/page/${genericPage.slug || genericPage._id}` })
    );

    const courses = await Course.find({ published: true, isDeleted: false });

    for (let i = 0; i < courses.length; ++i) {
      const course = courses[i];
      const chapters = await Chapter.find({
        course: course._id,
        published: true,
        isDeleted: false,
      });

      for (let j = 0; j < chapters.length; ++j) {
        const chapter = chapters[j];

        const lessons = await Lesson.find({
          chapter: chapter._id,
          published: true,
          isDeleted: false,
        });

        lessons.forEach((lesson) => {
          smStream.write({
            url: `/course/${course.slug || course._id}/${
              lesson.slug || lesson._id
            }`,
          });
        });
      }
    }
    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm));
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end();
    // stream write the response
    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});
module.exports = router;
