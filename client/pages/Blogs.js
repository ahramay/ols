import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBlogs } from "../store/api/dynamicPages";
import { Link } from "react-router-dom";

import moment from "moment";
import loadable from "@loadable/component";
const Tooltip = loadable(() => import("../components/Tooltip"), { ssr: false });

const BlogsPage = (props) => {
  const { categoryId } = props.match.params;
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    dispatch(
      getBlogs({
        onSuccess: (res) => {
          setBlogs(res.data.data);
        },
      })
    );
  }, []);

  const renderBlogsList = () => {
    const filtered = categoryId
      ? blogs.filter((b) => b.category === categoryId)
      : blogs;
    return filtered.map((blog) => {
      return (
        <div className="col-12 col-md-6 col-lg-3" key={blog._id}>
          <Link to={"/page/" + blog.slug}>
            <div className="card">
              <div className="card-header">
                <img
                  src={blog.image}
                  alt=""
                  className="img-fluid"
                  style={{ height: "140px", width: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body">
                <div className="row social">
                  <div className="col-6">
                    <Tooltip
                      // options
                      title={
                        "Published on: " +
                        moment(blog.createdAt).format("DD/MM/YYYY")
                      }
                      position="bottom"
                      trigger="mouseenter"
                    >
                      <p>
                        <i className="fas fa-calendar-alt"></i>
                      </p>
                    </Tooltip>
                  </div>
                  {/* <div className="col-4">
                    <a>
                      <i className="fas fa-comments"></i>
                    </a>
                  </div> */}
                  <div className="col-6">
                    <Tooltip
                      // options
                      title={
                        blog.createdBy.firstName + " " + blog.createdBy.lastName
                      }
                      position="bottom"
                      trigger="mouseenter"
                    >
                      <p>
                        <i className="fas fa-user"></i>
                      </p>
                    </Tooltip>
                    {/* <a>
                      <i className="fas fa-user"></i>
                    </a> */}
                  </div>
                </div>
                <h5>
                  <a>{blog.title}</a>
                </h5>
                <p>{blog.metaDescription}</p>
                <a className="link">Read More</a>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <div>
      <section className="other_banner">
        <div className="container">
          <h1>Blogs</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Blogs</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="blog">
        <div className="container">
          <div className="row">{renderBlogsList()}</div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
