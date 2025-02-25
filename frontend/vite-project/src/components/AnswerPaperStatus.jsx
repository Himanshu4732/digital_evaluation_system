import { Doughnut } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AnswerPapersStatus = ({ data }) => {
  const chartData = {
    labels: ['Assigned', 'Pending', 'Evaluated'],
    datasets: [
      {
        label: 'Answer Papers Status',
        data: [data.Assigned, data.Pending, data.Evaluated],
        backgroundColor: ['#3b82f6', '#f97316', '#10b981'],
        borderColor: ['#3b82f6', '#f97316', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // Legend text color
        },
      },
      title: {
        display: true,
        text: 'Answer Papers Status',
        color: '#fff', // Title text color
      },
    },
  };

  return (
    <Paper elevation={20} style={{ backgroundColor:"rgb(50 50 50)" } }className="p-6 w-96 h-120 rounded-3xl">
      <Typography variant="h5" className="mb-4 text-blue-400">
        Answer Papers Status
      </Typography>
      <Doughnut data={chartData} options={chartOptions} />
    </Paper>
  );
};

export default AnswerPapersStatus;