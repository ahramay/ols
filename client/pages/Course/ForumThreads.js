import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../shared/TextError";
import { Dropdown } from "react-bootstrap";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createForumThread,
  getForumThreads,
  deleteForumThread,
} from "../../store/api/forum";
import moment from "moment";
let fourmTypeDropdownToggle, createThreadForm;
export default (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showLoader, setShowLoader] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({
    name: "",
    type: "question",
  });
  const onCreateThread = (values, { resetForm }) => {
    if (showLoader) return;
    const { courseId } = props;
    const body = {
      course: courseId,
      ...values,
    };

    setShowLoader(true);

    dispatch(
      createForumThread({
        body,
        onSuccess: (res) => {
          setForumThreads([{ ...res.data.data, user }, ...forumThreads]);
          setFormInitialValues({ name: "", type: "question" });
          resetForm();
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  };

  const renderCreateThread = () => {
    return (
      <Formik
        validationSchema={Yup.object({
          name: Yup.string().required("Question/Discussion is required."),
          type: Yup.string(),
        })}
        initialValues={formInitialValues}
        enableReinitialize={true}
        onSubmit={onCreateThread}
        ref={(ref) => {
          createThreadForm = ref;
        }}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form>
              <div
                className="row position-relative"
                className="create_thread mt-2"
              >
                <div className="covering m-0">
                  <Field
                    className="form-control border-none"
                    placeholder={
                      values.type === "question"
                        ? "Ask for help..."
                        : "Start a discussion..."
                    }
                    id="threadNameField"
                    name="name"
                    as="textarea"
                  />
                  <ErrorMessage name="name" component={TextError} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "3px",
                  }}
                >
                  <Dropdown>
                    <Dropdown.Toggle
                      as="button"
                      className="hover_button"
                      id="dropdown-basic"
                      ref={(ref) => {
                        fourmTypeDropdownToggle = ref;
                      }}
                    >
                      <i
                        className={
                          values.type === "question"
                            ? "far fa-question-circle"
                            : "fas fa-users"
                        }
                      ></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={(e) => {
                          e.preventDefault();
                          if (fourmTypeDropdownToggle)
                            fourmTypeDropdownToggle.click();
                          setFieldValue("type", "question");
                        }}
                      >
                        <i className="far fa-question-circle"></i> Question
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => {
                          e.preventDefault();
                          if (fourmTypeDropdownToggle)
                            fourmTypeDropdownToggle.click();
                          setFieldValue("type", "discussion");
                        }}
                      >
                        <i className="fas fa-users"></i> Discussion
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <button type="submit" className="hover_button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [forumThreads, setForumThreads] = useState([]);

  useEffect(() => {
    const { courseId } = props;
    setShowLoader(true);
    dispatch(
      getForumThreads({
        courseId,
        onSuccess: (res) => {
          setForumThreads(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, []);

  const deleteThread = (id, index) => {
    const conf = window.confirm("Are you sure yu want to delete?");
    if (!conf) return;

    dispatch(
      deleteForumThread({
        id,
        onSuccess: (res) => {
          const newThreads = [...forumThreads];
          newThreads.splice(index, 1);
          setForumThreads(newThreads);
        },
      })
    );
  };

  const renderThreadsList = () => {
    const filteredList = searchQuery
      ? forumThreads.filter((th) => {
          return th.name
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase());
        })
      : forumThreads;
    return filteredList.map((thread, threadIndex) => {
      if (!thread.user) return null;
      return (
        <div
          className="quiz_list"
          key={`${thread._id} - thread- ${threadIndex}`}
        >
          {user && user.role === "ADMIN" && (
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread._id, threadIndex);
              }}
            >
              Delete
            </button>
          )}
          <Link
            to={"/forum/" + thread._id}
            className="text-dark text-decoration-none"
          >
            <div className="row">
              <div className="col-lg-2 col-md-2 col-12 align-self-center text-center">
                <h6>
                  <span>{thread.answers}</span>
                  {thread.type === "question" ? "Answers" : "Replies"}
                </h6>
              </div>
              <div className="col-lg-8 col-md-8 col-12">
                <h5>{thread.name}</h5>
                {thread.lastAnswer && <p>{thread.lastAnswer.message}</p>}
              </div>
              <div className="col-lg-2 col-md-2 col-12">
                <img
                  src={thread.user.image}
                  alt=""
                  className="img-fluid"
                  style={{
                    objectFit: "cover",
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#ccc",
                  }}
                />
                <p className="posted">
                  <span className="name">{`${thread.user.firstName} ${thread.user.lastName}`}</span>
                  {thread.type === "question"
                    ? `Asked ${moment(thread.createdAt).fromNow()}`
                    : `Started Discussion ${moment(
                        thread.createdAt
                      ).fromNow()}`}
                </p>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };
  return (
    <div className="forum">
      {renderCreateThread()}
      <div className="search_box">
        <div className="input-group input-group-lg">
          <input
            type="search"
            className="form-control"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value.trim());
            }}
            placeholder="Search"
          />
          <div className="input-group-append">
            <button className="btn">
              <i className="fal fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {renderThreadsList()}
    </div>
  );
};
