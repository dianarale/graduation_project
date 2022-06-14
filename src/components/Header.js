import React from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Container,
  makeStyles,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { CryptoState } from "../context/Context";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();

  const { currency, setCurrency } = CryptoState();

  return (
    <AppBar color="transparent" position="static">
      <Container>
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            onClick={() => history.push("/")}
          >
            Crypto Tracker
          </Typography>
          <Select
            variant="outlined"
            style={{ width: 100, height: 40, marginRight: 15 }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
            <MenuItem value={"CNY"}>CNY</MenuItem>
            <MenuItem value={"RUB"}>RUB</MenuItem>
            <MenuItem value={"INR"}>INR</MenuItem>
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
