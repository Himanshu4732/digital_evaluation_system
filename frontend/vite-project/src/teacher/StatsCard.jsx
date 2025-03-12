import { Grid2, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ data }) => {
    const assignedPapers = data.length;
    const evaluatedPapers = data.filter((element) => element.status === 'Evaluated').length;
    const pendingPapers = data.filter((element) => element.status === 'Pending').length;

  const stats = [
    { title: 'Total Assigned Papers', value: assignedPapers, color: '#3b82f6' },
    { title: 'Evaluated papers', value: evaluatedPapers, color: '#10b981' },
    { title: 'Pending Papers', value: pendingPapers, color: '#f97316' },
    { title: 'Total Feedbacks', value: data.totalFeedbacks, color: '#ef4444' },
  ];

  return (
    <Grid2 container spacing={2} className="mb-6" columns={13}>
      {stats.map((stat, index) => (
        <Grid2 item xs={12} md={4} key={index} size={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Paper elevation={3} className="p-6 text-center" style={{ backgroundColor: stat.color }}>
              <Typography variant="h8" className="text-white">
                {stat.title}
              </Typography>
              <Typography variant="h5" className="mt-2 text-white">
                {stat.value}
              </Typography>
            </Paper>
          </motion.div>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default StatsCard;