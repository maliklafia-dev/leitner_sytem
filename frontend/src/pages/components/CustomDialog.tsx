import GridCloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const StyledDialogTitle = styled(DialogTitle)(() => ({
  color: "black",
  fontSize: "28px",
  fontStyle: "normal",
  fontWeight: "400",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
}));

function CustomDialog({ open, onClose, title, children }: CustomDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            maxHeight: "auto",
          },
        },
      }}
    >
      <StyledDialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <GridCloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
