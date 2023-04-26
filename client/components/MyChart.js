import React from "react";

import Charts from "fusioncharts/fusioncharts.charts";

import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

export default (props) => {
  return (
    <div className="my-chart">
      <div className="trial-hider"></div>
      <ReactFC {...props} />
    </div>
  );
};

{
  /* <MyChart
          style={{ width: "100%" }}
          type="column2d"
          dataFormat="json"
          width="100%"
          dataSource={
            state !== "all-states"
              ? this.getGraphData()
              : this.getGraphDataAllStates()
          }
        /> */
}

// const dataSource = {
//   chart: {
//     caption: "Countries With Most Oil Reserves [2017-18]",
//     subCaption: "In MMbbl = One Million barrels",
//     xAxisName: "Country",
//     yAxisName: "Reserves (MMbbl)",
//     numberSuffix: "K",
//     theme: "fusion",
//   },
//   data: [
//     { label: "Venezuela", value: "290" },
//     { label: "Saudi", value: "260" },
//     { label: "Canada", value: "180" },
//     { label: "Iran", value: "140" },
//     { label: "Russia", value: "115" },
//     { label: "UAE", value: "100" },
//     { label: "US", value: "30" },
//     { label: "China", value: "30" },
//   ],
// };
