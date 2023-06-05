import "chartjs-adapter-date-fns";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  TimeScale, //Register timescale instead of category for X axis
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,

  Title,
  Tooltip,
  Legend
);

export const options: ChartOptions<"line"> = {
  scales: {
    y: {
      title: { display: true, text: "Percentage" },
    },
    x: {
      type: "time",
      time: {
        unit: "month",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
  },
};

interface Props {
  devaluationData?: { x: Date; y: number }[];
}

function LineChart(props: Props): React.ReactElement {
  const { devaluationData } = props;
  let data = {
    datasets: [
      {
        label: "name",
        data: devaluationData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <Line options={options} data={data} />;
    </div>
  );
}

export default LineChart;
