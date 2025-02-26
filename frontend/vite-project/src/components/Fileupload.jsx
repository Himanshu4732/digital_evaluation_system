import React, { useState } from "react";
import { Button } from "@mui/material";
import QuestionPaperForm from "./QuestionPaperForm";

const Fileupload = ({ fetchQuestionPapers }) => {
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="flex flex-col items-center bg-zinc-700">
      <Button variant="contained" color="primary" onClick={handleOpenForm}>
        Upload Files
      </Button>
      <QuestionPaperForm
        open={openForm}
        handleClose={handleCloseForm}
        fetchQuestionPapers={fetchQuestionPapers}
      />
    </div>
  );
};

export default Fileupload;