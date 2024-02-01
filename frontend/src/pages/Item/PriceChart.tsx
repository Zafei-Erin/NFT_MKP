import { Sale } from "@/types/types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

type PriceChartProps = {
  salesHistory: Sale[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: "Price",
      },
    },
  },
};

export const PriceChart: React.FC<PriceChartProps> = ({ salesHistory }) => {
  const sortedData = salesHistory.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  const labels = sortedData.map((sale) => {
    const dateObj = new Date(sale.date);
    const formatted = new Intl.DateTimeFormat(undefined).format(dateObj);
    return formatted;
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: sortedData.map((sale) => sale.price),
        borderColor: "rgb(59 130 246)",
        backgroundColor: "rgb(255 255 255)",
      },
    ],
  };
  return (
    <div className="w-full h-60 flex items-center justify-center py-1">
      <Line options={options} data={data} />
    </div>
  );
};
