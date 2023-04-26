import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
class CommentBar extends Component {
  state = {
    showModal: false,
    commentId: "",
  };

  componentDidMount = () => {
    const commentData = this.props.comment;
    this.setState({ commentId: commentData._id });
  };

  renderComment = (commentData) => {
    const { onReply } = this.props;
    return (
      <div
        className="w-100 d-flex ml-2"
        style={{
          position: "relative",
        }}
      >
        {/* reply link */}
        <a
          href="#"
          style={{
            position: "absolute",
            right: "20px",
            top: "3px",
            zIndex: 1,
          }}
          onClick={(e) => {
            e.preventDefault();
            if (onReply) {
              onReply({
                commentId: this.state.commentId,
                comment:
                  "#" +
                  commentData.createdBy.firstName +
                  " " +
                  commentData.createdBy.lastName +
                  " ",
                replyingTo: commentData.createdBy._id,
              });
            }
          }}
        >
          reply
        </a>

        <div className="mr-2 mt-2">
          <div>
            <img
              style={{
                backgroundColor: "#ccc",
                width: "40px",
                height: "40px",
                borderRadius: "40px",
              }}
              src={commentData.createdBy.image}
            />
          </div>
        </div>

        <div
        // style={{ marginTop: "15px", marginLeft: "20px" }}
        >
          <h4 style={{ marginTop: "8px", marginBottom: "0px" }}>
            {commentData.createdBy.firstName +
              " " +
              commentData.createdBy.lastName}
          </h4>
          <p
            style={{
              paddingRight: "50px",
              display: "flex",
              flex: 1,
              marginBottom: "5px",
            }}
          >
            {commentData.comment || ""}
          </p>
        </div>
      </div>
    );
  };

  renderReplies = (replies) => {
    return replies.map((reply, index) => {
      return (
        <div
          key={reply._id + index + reply.comment}
          style={{
            marginLeft: "25px",
          }}
        >
          {this.renderComment(reply)}
        </div>
      );
    });
  };

  render() {
    const { user, onDelete } = this.props;
    const commentData = this.props.comment;
    return (
      <div
        className="mt-2"
        style={{
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: "5px",
          margin: "5px",
          position: "relative",
        }}
      >
        {user.role === "ADMIN" && (
          <button
            className="btn btn-danger btn-sm"
            style={{
              position: "absolute",
              top: "5px",
              right: "65px",
              zIndex: 2,
            }}
            onClick={onDelete}
          >
            <i className="fa fa-trash-alt"></i>
          </button>
        )}
        <div>{this.renderComment(commentData)}</div>
        {this.renderReplies(commentData.replies)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(CommentBar);
