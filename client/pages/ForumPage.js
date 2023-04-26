import React, { useState, useEffect } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";

import { useDispatch, useSelector } from "react-redux";

import {
  getForumThread,
  answerForumThread,
  getForumMessages,
  deleteForumMessage,
} from "../store/api/forum";

import moment from "moment";

const ForumPage = (props) => {
  const { threadId } = props.match.params;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [showLoader, setShowLoader] = useState(false);
  const [forumThread, setForumThread] = useState({
    name: "",
    type: "",
    answers: 0,
    createdAt: new Date(),
    user: {
      firstName: "",
      lastName: "",
      image: "",
    },
  });
  const [forumMessages, setForumMessages] = useState([]);

  const deleteMessage = (id, index) => {
    const conf = window.confirm("Are you sure you want to delete?");

    if (!conf) return;
    dispatch(
      deleteForumMessage({
        id,
        onSuccess: (res) => {
          const newMessages = [...forumMessages];
          newMessages.splice(index, 1);
          setForumMessages(newMessages);
        },
      })
    );
  };
  useEffect(() => {
    setShowLoader(true);
    dispatch(
      getForumThread({
        threadId,
        onSuccess: (res) => {
          setForumMessages([{ ...res.data.data, user }, ...forumMessages]);
          setForumThread(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );

    dispatch(
      getForumMessages({
        threadId,
        onSuccess: (res) => {
          setForumMessages(res.data.data);
        },
      })
    );
  }, []);

  const renderMessages = () => {
    return forumMessages.map((message, messageIndex) => {
      return (
        <div className="form_cover" key={`${message._id} + ${messageIndex}`}>
          <div className="row">
            <div className="col-12 align-self-center">
              {user && user.role === "ADMIN" && (
                <button
                  className="btn btn-danger float-right"
                  onClick={() => {
                    deleteMessage(message._id, messageIndex);
                  }}
                >
                  Delete
                </button>
              )}
              <h3>{messageIndex + 1}</h3>
              <p>{message.message}</p>
            </div>
            <div className="col-lg-4 col-md-5 offset-md-7 offset-lg-8 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="left_block">
                    <p>
                      <span>{`${message.user.firstName} ${message.user.lastName}`}</span>
                      {`${
                        forumThread.type === "question" ? "Answered" : "Replied"
                      } ${moment(message.createdAt).fromNow()}`}
                    </p>
                  </div>
                  <div className="right_block">
                    <img
                      src={message.user.image}
                      alt=""
                      className="img-fluid"
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                        backgroundColor: "#ccc",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const [sendingMessage, setSendingMessage] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    message: "",
  });
  const onSendMessage = (values, { resetForm }) => {
    if (sendingMessage) return;
    const body = { ...values, thread: threadId };

    setSendingMessage(true);
    dispatch(
      answerForumThread({
        body,
        onSuccess: (res) => {
          setForumMessages([
            ...forumMessages,
            { ...res.data.data, user: user },
          ]);
          resetForm();
        },
        onEnd: () => {
          setSendingMessage(false);
        },
      })
    );
  };

  const renderReplyForm = () => {
    return (
      <Formik
        validationSchema={Yup.object({
          message: Yup.string().required("Message is required."),
        })}
        enableReinitialize={true}
        initialValues={initialFormValues}
        onSubmit={onSendMessage}
      >
        {() => {
          return (
            <Form>
              <div
                style={{
                  backgroundColor: "#ccc",
                  padding: "3px",
                  borderRadius: "3px",
                }}
              >
                <div className="covering m-0">
                  <Field
                    className="form-control border-none"
                    placeholder="Write your opinion..."
                    name="message"
                    as="textarea"
                  />
                  <ErrorMessage name="message" component={TextError} />
                </div>
                <div
                  className="text-right"
                  style={{ marginTop: "3px", marginBottom: "1px" }}
                >
                  <button type="submit" className="btn btn-primary">
                    Send <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };
  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>Forum</h1>
        </div>
      </section>
      <section className="form_sec">
        <div className="container">
          <div className="form_cover">
            <div className="row">
              <div className="col-lg-10 col-md-10 col-12 align-self-center">
                <h2>{forumThread.name}</h2>
                <p>
                  <span>
                    {forumThread.answers}{" "}
                    {forumThread.type === "question" ? "Answers" : "Replies"}
                  </span>
                  <span className="spaced">
                    {forumThread.type === "question"
                      ? `Asked ${moment(forumThread.createdAt).fromNow()}`
                      : `Started Discussion ${moment(
                          forumThread.createdAt
                        ).fromNow()}`}
                  </span>
                </p>
              </div>
              <div className="col-lg-2 col-md-2 col-12">
                <img
                  src={forumThread.user.image}
                  alt=""
                  className="img-fluid"
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    backgroundColor: "#ccc",
                  }}
                />
                <p className="name">
                  {forumThread.user.firstName + " " + forumThread.user.lastName}
                </p>
              </div>
            </div>
          </div>
          {renderMessages()}
          {renderReplyForm()}
        </div>
      </section>
    </>
  );
};

export default ForumPage;
