import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
} from "reactstrap";
import ReactPlayer from "react-player";
import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import LessonCard from "../../components/Course/LessonCard";
import { connect } from "react-redux";
import SortableList from "../../components/sortable/SortableList";

import { getQuiz } from "../../store/api/quizes";
import { getQuestions, rearrangeQuestions } from "../../store/api/questions";
import QuestionCard from "../../components/Course/QuestionCard";

class QuizDetails extends Component {
  state = {
    id: "", //chapter Id
    quiz: {
      name: "",
      type: "",

      lesson: {
        _id: "",
        name: "",
      },
    },

    quizes: [],
    showLoader: false,

    uploadingVideo: false,
    uploadProgress: 50,
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadQuiz(id);
    this.loadQuestions(id);
  };

  loadQuestions = (quizId) => {
    this.props.getQuestions({
      quizId,
      onSuccess: (res) => {
        this.setState({ quizes: res.data.data });
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };
  createQuestion = () => {
    const { id } = this.props.match.params;
    const quiz = {
      name: "",
      type: "multi-choice",
      quiz: id,
      options: [],
    };
    const { quizes } = this.state;
    quizes.push(quiz);
    this.setState({ quizes });
    window.scrollTo(0, document.body.scrollHeight);
  };

  loadQuiz = (id) => {
    this.props.getQuiz({
      id,
      onSuccess: (res) => {
        this.setState({ quiz: res.data.data });
        console.log(res.data.data);
      },
    });
  };

  renderQuizes = () => {
    const { quizes } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={quizes}
          keyExtractor={(item, index) => {
            return item._id + "quiz" + index;
          }}
          onListSort={(list) => {
            this.setState({ quizes: list });
            this.props.rearrangeQuestions({
              body: { orderIds: list.map((quiz) => quiz._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <div className="rounded mb-1 bg-white">
                <QuestionCard
                  question={item}
                  onUpdate={(newQuiz) => {
                    quizes[index] = newQuiz;
                    this.setState({ quizes });
                  }}
                  onDelete={() => {
                    quizes.splice(index, 1);
                    this.setState({ quizes });
                  }}
                />
              </div>
            );
          }}
        />
      </ListGroup>
    );
  };

  render() {
    const { showLoader, quiz } = this.state;
    const { lesson } = quiz;
    return (
      <>
        <Header>
          <div>
            <h1 className="text-center course-title text-secondary">
              {lesson.name}
            </h1>
          </div>
        </Header>
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">{quiz.name}</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}

              <div className="clearfix my-2">
                <h2 className="float-left">Questions</h2>
                <Button
                  className="float-right"
                  color="dark"
                  size="sm"
                  onClick={this.createQuestion}
                >
                  Create Question
                </Button>
              </div>

              {this.renderQuizes()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  getQuiz: (params) => dispatch(getQuiz(params)),

  getQuestions: (params) => dispatch(getQuestions(params)),
  rearrangeQuestions: (params) => dispatch(rearrangeQuestions(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(QuizDetails);
