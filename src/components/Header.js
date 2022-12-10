import React from "react";
import {
  Tabs,
  Tab,
  Toolbar,
  AppBar,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Outlet, Link, matchPath, useLocation } from "react-router-dom";
import AccountPopover from "./AccountPopover";

export default function Header(props) {
  const location = useLocation();

  let currentPath = "/";
  if (!!matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (!!matchPath("/invoices/*", location.pathname)) {
    currentPath = "/invoices";
  }

  return (
    <div>
      <Box component="nav" sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar variant="dense">
            <Box flex={1} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  sx={{ marginRight: "1em", height: 30 }}
                  src={
                    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                  }
                  alt="Bosch Logo"
                />
                <Typography component="span" variant="h5">
                  Split My Bill
                </Typography>
              </Box>
              <Box>
                <Tabs
                  value={currentPath}
                  aria-label="Navigation Tabs"
                  indicatorColor="secondary"
                  textColor="inherit"
                >
                  <Tab label={"Homepage"} component={Link} to="/" value="/" />
                  <Tab
                    label={"Contacts"}
                    component={Link}
                    to="/contacts"
                    value="/contacts"
                  />
                  <Tab
                    label={"Invoices"}
                    component={Link}
                    to="/invoices"
                    value="/invoices"
                  />
                </Tabs>
              </Box>
              <Box display="flex">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{
                    xs: 0.5,
                    sm: 1,
                  }}
                >
                  <AccountPopover
                    displayName={props.currentUser.displayName}
                    email={props.currentUser.email}
                    pfp={
                      props.currentUser.profilePicture
                        ? props.currentUser.profilePicture
                        : ""
                    }
                  />
                </Stack>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Outlet />
    </div>
  );
}
