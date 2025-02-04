import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Box, Button, Typography, Link } from "@mui/material";
import { ReactComponent as WhiteLogo } from "../../../static/imgs/logo_white.svg";

const TopBox = styled(Box)({
  background: "#073113",
  width: "100vw",
  height: "100vh",
  color: "white",
  position: "relative",
});

export default function LandingPage() {
  return (
    <div>
      <TopBox>
        <Box
          sx={{
            display: "flex",
            pt: "1rem",
            pl: "1rem",
            mb: "25vh",
          }}
        >
          <WhiteLogo width="3rem" height="2rem" />
          <Box sx={{ pt: 0.2, ml: 2 }}>
            <Typography
              variant="h5"
              style={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              위드 밀리터리
            </Typography>
          </Box>
        </Box>
        <Container component="main">
          <Box>
            <Typography
              variant="h2"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "bold",
                color: "white",
              }}
            >
              모든 장병이 함께 하는 자기개발,
            </Typography>
          </Box>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ mr: 2 }}>
              <Typography
                variant="h1"
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                위드 밀리터리
              </Typography>
            </Box>
            <WhiteLogo width="19rem" height="7rem" />
          </Box>
          <br />
          <Link href="/login" underline="none" sx={{ py: 1 }}>
            <Button
              variant="contained"
              sx={{ mr: 1 }}
              style={{
                borderRadius: "2rem",
                backgroundColor: "white",
                width: "11.5rem",
                height: "4rem",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#073113",
                }}
              >
                시작하기
              </Typography>
            </Button>
          </Link>
        </Container>
        <Box
          sx={{
            position: "absolute",
            bottom: "0px",
            left: "0px",
          }}
        ></Box>
      </TopBox>
    </div>
  );
}
