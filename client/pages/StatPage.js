import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { useDispatch } from "react-redux";
import { getCourseQuizAnswers } from "../store/api/quizes";
const MyChart = loadable(() => import("../components/MyChart"), {
  ssr: false,
});

const StatPage = (props) => {
  const { courseId } = props.match.params;
  const dispatch = useDispatch();

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    dispatch(
      getCourseQuizAnswers({
        id: courseId,
        onSuccess: (res) => {
          const dummyData = [];
          res.data.data.forEach((element) => {
            const percentage =
              (element.obtainedMarks / element.totalQuizMarks) * 100;

            dummyData.push({
              label: element.quiz.name,
              value: percentage,
            });
          });

          setChartData(dummyData);
        },
      })
    );
  });
  return (
    <div style={{ paddingTop: "220px" }}>
      <div className="container">
        <MyChart
          style={{ width: "100%" }}
          type="column2d"
          dataFormat="json"
          width="100%"
          dataSource={{
            chart: {
              caption: "",
              subCaption: "",
              xAxisName: "",
              yAxisName: "",
              numberSuffix: "%",
              theme: "fusion",
            },
            data: chartData,
          }}
        />
      </div>
    </div>
  );
};

export default StatPage;
