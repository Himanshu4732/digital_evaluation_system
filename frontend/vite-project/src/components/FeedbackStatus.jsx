import { Pie } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const FeedbackStatus = ({ data }) => {
  const chartData = {
    labels: ['Pending', 'Resolved'],
    datasets: [
      {
        label: 'Feedback Messages Status',
        data: [data.Pending, data.Resolved],
        backgroundColor: ['#f97316', '#10b981'],
        borderColor: ['#f97316', '#10b981'],
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
        text: 'Feedback Messages Status',
        color: '#fff', // Title text color
      },
    },
  };

  return (
    <Paper elevation={20} className="p-6 bg-zinc-800 w-96 h-96" style={{ backgroundColor:"rgb(50 50 50)" } }>
      <Typography variant="h5" className="mb-4 text-blue-400">
        Feedback Messages Status
      </Typography>
      <Pie data={chartData} options={chartOptions} />
    </Paper>
  );
};

export default FeedbackStatus;