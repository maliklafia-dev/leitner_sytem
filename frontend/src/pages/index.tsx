import { Box, Button, Grid2, Typography, Stack } from "@mui/material";
import { useState } from "react";
import CustomDialog from "./components/CustomDialog";
import PopupAddCard from "./components/PopupAddCard";
import { useRouter } from "next/router";
import styles from "./styles/home.module.css";
import Quizz from "./Quizz";

export default function HomePage() {
  const router = useRouter();
  const [openQuiz, setOpenQuiz] = useState(false);
  const [addCard, setAddCard] = useState(false);

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      height="100vh"
      className={styles.styleBackground}
    >
      <Box className={styles.styleBox} sx={{ p: 8 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Leitner System
        </Typography>
        <Typography variant="h6" color="black" gutterBottom>
          Learn effectively with flashcards
        </Typography>

        <Stack
          spacing={2}
          direction="column"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Button
            className={styles.styleButton}
            variant="contained"
            sx={{ background: "#367917cc" }}
            onClick={() => setOpenQuiz(true)}
          >
            🎯 Start Quizz
          </Button>

          <Button
            className={styles.styleButton}
            variant="contained"
            sx={{ background: "#265a91c4" }}
            onClick={() => setAddCard(true)}
          >
            ➕ Add New Card
          </Button>

          <Button
            className={styles.styleButton}
            variant="outlined"
            sx={{ background: "#8bbbc6" }}
            onClick={() => router.push("/Cards")}
          >
            📖 See All Cards
          </Button>
        </Stack>
      </Box>

      <CustomDialog
        title="🎯 Quiz of the day"
        open={openQuiz}
        onClose={() => setOpenQuiz(false)}
      >
        <Quizz />
      </CustomDialog>

      <CustomDialog
        title="Add New Card"
        open={addCard}
        onClose={() => setAddCard(false)}
      >
        <PopupAddCard closePopupCreation={() => setAddCard(false)} />
      </CustomDialog>
    </Grid2>
  );
}
