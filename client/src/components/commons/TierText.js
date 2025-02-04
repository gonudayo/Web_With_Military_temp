import React from "react";
import { Box, Typography } from "@mui/material";
import TierColor from "./TierColor";

export default function TierText({ point, tier, rank, variant }) {
  return (
    <Typography
      component={Box}
      variant={variant}
      sx={{
        display: "flex",
        fontWeight: "bold",
        color: TierColor(point, rank),
      }}
    >
      {tier}
    </Typography>
  );
}
