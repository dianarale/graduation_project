import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ReactHtmlParser from "react-html-parser";
import { makeStyles, Typography } from "@material-ui/core";
import CoinDetails from "../components/CoinDetails";
import { fetchSingleCoin } from "../config/api";
import { CryptoState } from "../context/Context";
import { numberWithCommas } from "../config/utils";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    marginTop: 40,
  },
  sidebar: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Montserrat",
  },
  subHeading: {
    textTransform: "uppercase",
    marginBottom: 30,
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 50,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 50,
    paddingTop: 15,
    width: "100%",
  },
}));

export default function Coinpage() {
  const classes = useStyles();
  const { id } = useParams();
  const { currency, symbol } = CryptoState();

  const [coin, setCoin] = useState();

  useEffect(() => {
    fetchSingleCoin(id)
      .then((data) => setCoin(data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!coin) return "";

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin.image.large}
          alt={coin.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin.name}
        </Typography>
        <Typography variant="h4" className={classes.subHeading}>
          ({coin.symbol})
        </Typography>
        <Typography variant="p" className={classes.description}>
          {ReactHtmlParser(coin.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
        </div>
      </div>

      <CoinDetails coin={coin} />
    </div>
  );
}
