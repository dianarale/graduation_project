import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { fetchMarketData } from "../config/api";
import { CryptoState } from "../context/Context";
import SelectButton from "./SelectButton";

const useStyles = makeStyles(() => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
  },
}));

export default function CoinDetails({ coin }) {
  const [marketData, setMarketData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const classes = useStyles();

  const chartDays = [
    {
      label: "24 Hours",
      value: 1,
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "3 Months",
      value: 90,
    },
    {
      label: "1 Year",
      value: 365,
    },
  ];

  useEffect(() => {
    fetchMarketData(coin.id, days, currency)
      .then((data) => setMarketData(data.prices))
      .catch((error) => console.log(error));
  }, [coin.id, days, currency]);

  return (
    <div className={classes.container}>
      {!marketData ? (
        <CircularProgress style={{ color: "gold" }} size={35} thickness={2} />
      ) : (
        <>
          <Line
            data={{
              labels: marketData.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: marketData.map((history) => history[1]),
                  label: ` Price ( Past ${days} Day(s) ) in ${currency}`,
                  borderColor: "gold",
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                },
              },
            }}
          />

          <div
            style={{
              display: "flex",
              marginTop: 60,
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => setDays(day.value)}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
