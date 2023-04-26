import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import { useSelector, useDispatch } from "react-redux";
import renderHTML from "react-render-html";
import { getPage, getBlogs, getRecentBlogs } from "../store/api/dynamicPages";
import Loader from "../components/Loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ShareLink from "../components/ShareLink";
import moment from "moment";
import CommentBar from "../components/CommentBar";
import {
  commentBlog,
  loadComments,
  replyComment,
  deleteComment,
} from "../store/api/comments";
import { loadBlogCategories } from "../store/api/blogCategories";
import { Helmet } from "react-helmet";
const Tooltip = loadable(() => import("../components/Tooltip"), { ssr: false });
import { Link } from "react-router-dom";

let commentInput = React.createRef();
const DynamicPage = (props) => {
  const { slugIdentifier } = props.match.params;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const blogCategories = useSelector((state) => state.entities.blogCategories);
  const [showLoader, setShowLoader] = useState(false);

  const [page, setPage] = useState({
    _id: "",
    title: "",
    image: "",
    content: "",
    type: "",
    createdAt: new Date(),
    createdBy: {
      firstName: "",
      lastName: "",
    },
  });

  const [recentBlogs, setRecentBlogs] = useState([]);
  useEffect(() => {
    setShowLoader(true);
    dispatch(
      getPage({
        slug: slugIdentifier,
        onSuccess: (res) => {
          setPage(res.data.data);
          loadCommentsList(res.data.data._id);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );

    dispatch(loadBlogCategories({}));

    dispatch(
      getRecentBlogs({
        slug: slugIdentifier,
        onSuccess: (res) => {
          setRecentBlogs(res.data.data);
        },
      })
    );
  }, [slugIdentifier]);

  const [initalCommentValues, setInitialCommentValues] = useState({
    isReplying: false,
    replyId: "",
    comment: "",
    replyingTo: "",
  });

  const commentSubmit = () => {
    const { comment, replyId, replyingTo, isReplying } = initalCommentValues;

    if (!comment) {
      return alert("Comment is required!");
    }
    if (isReplying && replyId)
      dispatch(
        replyComment({
          body: {
            comment,
            commentId: replyId,
            replyingTo,
          },
          onSuccess: (res) => {
            const newCommentsList = [...comments];
            const commentIndex = newCommentsList.findIndex(
              (c) => c._id === res.data.data._id
            );

            if (commentIndex >= 0) {
              newCommentsList[commentIndex] = res.data.data;
              setComments(newCommentsList);
            }
            setInitialCommentValues({
              comment: "",
              isReplying: false,
              replyId: "",
              replyingTo: "",
            });
          },
        })
      );
    else {
      const body = {
        comment,
        content: page._id,
      };

      dispatch(
        commentBlog({
          body,
          onSuccess: (res) => {
            const newCommentsList = [res.data.data, ...comments];
            setComments(newCommentsList);
            //resetting comment form
            setInitialCommentValues({
              isReplying: false,
              replyId: "",
              comment: "",
              replyingTo: "",
            });
          },
        })
      );
    }
  };

  const renderCommentForm = () => {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commentSubmit();
          }}
        >
          <h4 className="mt-5">Comment :</h4>

          <div
            style={{
              display: "flex",
            }}
          >
            <input
              ref={commentInput}
              placeholder="comment"
              className="form-control mb-0"
              value={initalCommentValues.comment}
              onChange={(e) => {
                const comment = e.target.value;

                const payload = { ...initalCommentValues };
                payload.comment = comment;

                if (!comment.trim()) {
                  payload.isReplying = false;
                  payload.replyId = "";
                  payload.replyingTo = "";
                }
                setInitialCommentValues(payload);
              }}
            />

            <button
              style={{ width: "118px" }}
              className="btn btn-primary mt-0 mb-3"
              type="submit"
            >
              Submit <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    );
  };

  const [comments, setComments] = useState([]);

  const loadCommentsList = (id) => {
    dispatch(
      loadComments({
        content: id,
        onSuccess: (res) => {
          setComments(res.data.data.list);
        },
      })
    );
  };

  const renderComments = () => {
    return (
      <div className="pb-5">
        {comments.map((item, itemIndex) => {
          return (
            <CommentBar
              key={item._id}
              comment={item}
              onReply={(data) => {
                setInitialCommentValues({
                  isReplying: true,
                  replyId: data.commentId,
                  comment: data.comment,
                  replyingTo: data.replyingTo,
                });

                setTimeout(() => {
                  if (
                    commentInput &&
                    commentInput.current &&
                    commentInput.current.focus
                  ) {
                    commentInput.current.focus();
                  }
                }, 200);
              }}
              onDelete={(e) => {
                const conf = window.confirm("Are you sure you want to delete?");
                if (!conf) return;

                dispatch(
                  deleteComment({
                    id: item._id,
                    onSuccess: (res) => {
                      const newCommentsList = [...comments];
                      newCommentsList.splice(itemIndex, 1);
                      setComments(newCommentsList);
                    },
                  })
                );
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Helmet>
        <meta property="og:title" content={page.metaTitle} />
        <meta name="description" content={page.metaDescription} />
        <meta name="keywords" content={page.metaKeyWords} />
      </Helmet>
      <section className="other_banner">
        <div className="container">
          <h1>{page.title}</h1>

          {page.type === "blog" && (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/blogs">Blogs</Link>
                </li>
                <li className="breadcrumb-item active">{page.title}</li>
              </ol>
            </nav>
          )}
        </div>
      </section>
      <section className={page.type === "blog" ? "blog_details" : ""}>
        <div className="container">
          <div className="row">
            <div className={page.type === "blog" ? "col-lg-9" : "col-12"}>
              {page.image && (
                <div>
                  <img src={page.image} className="img-fluid" />
                </div>
              )}

              {page.type === "blog" && (
                <>
                  <div className="left_block">
                    <h3>{page.title}</h3>
                  </div>
                  <div className="right_block">
                    <div className="row social">
                      <div className="col-6">
                        <Tooltip
                          // options
                          title={
                            "Published on: " +
                            moment(page.createdAt).format("DD/MM/YYYY")
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
                            page.createdBy.firstName +
                            " " +
                            page.createdBy.lastName
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
                  </div>
                </>
              )}
              <div className="pt-5">{renderHTML(page.content)}</div>
            </div>

            {page.type === "blog" && (
              <div className="col-lg-3 col-12">
                {recentBlogs.length > 0 && (
                  <div className="card">
                    <div className="card-body">
                      <h5>Recent Posts</h5>

                      {recentBlogs.map((blog) => {
                        return (
                          <Link to={"/page/" + blog.slug}>
                            <div className="post_cover" key={blog._id}>
                              <div className="row">
                                <div className="col-12 col-md-3 align-self-center">
                                  <a href="#">
                                    <img
                                      src={blog.image}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </a>
                                </div>
                                <div className="col-12 col-md-9 align-self-center">
                                  <p>
                                    <a>{blog.title}</a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                {blogCategories.list.length > 0 && (
                  <div className="card spaced">
                    <div className="card-body">
                      <h5>Categories</h5>
                      {blogCategories.list.map((cat) => {
                        return (
                          <Link key={cat._id} to={"/blogs/" + cat._id}>
                            <p>{cat.name}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {page.type === "blog" && (
        <div className="container">
          <ShareLink
            shareLink={"https://www.out-class.org/page/" + page.slug}
          />

          {renderCommentForm()}
          {renderComments()}
        </div>
      )}
    </div>
  );
};

export default DynamicPage;
