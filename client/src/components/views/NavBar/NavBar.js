import React, { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  Drawer,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ReactComponent as WhiteLogo } from "../../../static/imgs/logo_white.svg";
import RightMenu from "./Sections/RightMenu";
import DrawerList from "./Sections/DrawerList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

export default function NavBar(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      color="secondary"
      open={open}
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        position: "relative",
      }}
    >
      <Toolbar sx={{ my: "auto" }}>
        <Link to="/main">
          <WhiteLogo width="3rem" height="2rem" style={{ color: "#e6e1e0" }} />
        </Link>
        <Box sx={{ mt: "-1px", ml: "12px" }}>
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
        <Box sx={{ flexGrow: 1 }} />

        <RightMenu />

        <IconButton
          color="inherit"
          component={Link}
          to={"/search"}
          sx={{ ml: 2 }}
        >
          <SearchIcon />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerOpen}
          sx={{ ml: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <DrawerList handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
