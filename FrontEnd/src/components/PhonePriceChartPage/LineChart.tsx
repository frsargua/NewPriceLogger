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
      ticks: {
        color: "#6c757d",
      },
      grid: {
        color: "rgba(108, 117, 125, 0.1)",
      },
    },
    x: {
      type: "time",
      time: {
        unit: "month",
      },
      title: {
        display: true,
        text: "Date",
        font: { size: 14, weight: "bold" },
      },
      grid: {
        color: "rgba(108, 117, 125, 0.1)",
      },
      ticks: {
        color: "#6c757d",
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
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  return (
    <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <Line options={options} data={data} />
    </div>
  );
}

export default LineChart;
