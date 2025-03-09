import { useState } from "react";
import { Typography, Box, Grid2, Card, CardContent } from "@mui/material";
import styles from "../styles/card.module.css";

export default function FlipCard({ question, answer, tag, category }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Grid2 size={{ xs: 10, sm: 6, md: 4 }}>
      <Box className={styles.styleBoxOne} onClick={() => setFlipped(!flipped)}>
        <Box
          className={styles.styleBoxCard}
          sx={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Card className={styles.styleCardBefore}>
            <CardContent>
              <Typography variant="h6">{question}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Tag: {tag}
              </Typography>
              <Typography variant="body2">Category: {category}</Typography>
            </CardContent>
          </Card>

          <Card className={styles.styleCardAfter}>
            <CardContent>
              <Typography variant="h6">{answer}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Grid2>
  );
}
