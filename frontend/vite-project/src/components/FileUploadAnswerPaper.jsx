import React, { useState } from "react";
import { Button } from "@mui/material";
import AnswerPaperForm from "./AnswerPaperForm";

const FileUploadAnswerPaper = () => {
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenForm}>
        Upload Answer Paper
      </Button>
      <AnswerPaperForm
        open={openForm}
        handleClose={handleCloseForm}
        
      />
    </div>
  );
};

export default FileUploadAnswerPaper;