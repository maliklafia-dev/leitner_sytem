import React, { useState } from "react";
import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { champs } from "../../utils/inputsCreateCard";

export default function PopupAddCard({ closePopupCreation }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [inputs, setInputs] = useState(
    champs.map((input) => ({
      ...input,
      value: input.value || "",
    })),
  );

  const handleInputChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value: value } : input,
      ),
    );
  };

  const handleRegister = async () => {
    const cardData = Object.fromEntries(
      inputs.map((input) => [input.id, input.value]),
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        },
      );

      if (!response.ok) throw new Error("Error occurred add card");

      setSuccessMessage("Card added successfully !");
      setTimeout(() => {
        closePopupCreation();
      }, 1500);
    } catch (error) {
      setSuccessMessage("Error");
    }
  };

  const isDisable = () =>
    inputs.some((input) => input.required && !input.value);

  return (
    <Box>
      <Typography sx={{ color: "red", fontWeight: 500, mb: 2 }}>
        * Required fields
      </Typography>

      {inputs.map((input) => (
        <Grid2
          key={input.id}
          container
          spacing={1}
          alignItems="center"
          sx={{ mb: 2, marginLeft: 5 }}
        >
          <Grid2 size={3}>
            <Typography sx={{ fontWeight: 510 }}>
              {input.name} {input.required && " *"}
            </Typography>
          </Grid2>
          <Grid2 size={8}>
            <TextField
              fullWidth
              onChange={(e) => handleInputChange(input.id, e)}
              value={input.value}
              variant="outlined"
              disabled={!input.changable}
              sx={{ background: input.changable ? "white" : "#f5f5f5" }}
            />
          </Grid2>
        </Grid2>
      ))}

      <Box sx={{ textAlign: "center", mt: 3, mb: 1 }}>
        <Button
          onClick={handleRegister}
          disabled={isDisable()}
          variant="contained"
          color="success"
          sx={{
            borderRadius: "14px",
            fontSize: "1rem",
            fontWeight: "bold",
            p: 1.5,
            width: "30%",
            height: "40px",
          }}
        >
          Add
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert
          severity={successMessage.includes("Error") ? "error" : "success"}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
