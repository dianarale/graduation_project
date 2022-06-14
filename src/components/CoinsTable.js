import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Container,
  makeStyles,
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { fetchCoinList } from "../config/api";
import { CryptoState } from "../context/Context";
import { numberWithCommas } from "../config/utils";

const useStyles = makeStyles(() => ({
  coin: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
}));

export default function CoinsTable() {
  const classes = useStyles();
  const { currency, symbol } = CryptoState();
  const history = useHistory();

  const [coinsList, setCoinsList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const theme = createTheme({
    palette: {
      main: "#fff",
      type: "dark",
    },
  });

  const handleSearch = () =>
    coinsList.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );

  useEffect(() => {
    fetchCoinList(currency)
      .then((data) => setCoinsList(data))
      .catch((error) => console.log(error));
  }, [currency]);

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 30, fontFamily: "Montserrat" }}
        >
          Cryptocurreny Prices by Market Cap
        </Typography>
        <TextField
          label="Search for Cryptocurrency"
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer>
          <Table className={classes.table}>
            <TableHead style={{ backgroundColor: "#eebc1d" }}>
              <TableRow>
                {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                  <TableCell
                    key={head}
                    style={{
                      color: "#000",
                      fontWeight: 700,
                      fontFamily: "Montserrat",
                    }}
                    align={head === "Coin" ? "left" : "right"}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((coin) => {
                  const profit = coin.price_change_percentage_24h > 0;

                  return (
                    <TableRow
                      className={classes.coin}
                      key={coin.name}
                      onClick={() => history.push(`/coins/${coin.id}`)}
                    >
                      <TableCell component="th" align="left">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            marginBottom: 10,
                            marginTop: 10,
                          }}
                        >
                          <img src={coin.image} alt={coin.name} height="50" />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {coin.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {coin.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{
                          color: profit ? "rgba(14, 203, 129)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(coin.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(
                          coin.market_cap.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          count={Number(handleSearch()?.length / 10)}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}
