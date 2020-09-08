import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Container } from "react-bootstrap";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [netWorthArray, setNetWorthArray] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://shakepay.github.io/programming-exercise/web/transaction_history.json"
      )
      .then(function (response) {
        setTransactions(response.data.reverse());

        console.log(response.data.reverse());

        let cad_balance = 0;
        let btc_balance = 0;
        let eth_balance = 0;
        let net_worth = 0;
        let allNetWorth = [];

        response.data.reverse().map((element) => {
          if (element.direction === "debit") {
            if (element.currency === "CAD") {
              cad_balance -= element.amount;
            }

            if (element.currency === "BTC") {
              btc_balance -= element.amount;
            }

            if (element.currency === "ETH") {
              eth_balance -= element.amount;
            }
          }

          if (element.direction === "credit") {
            if (element.currency === "CAD") {
              cad_balance += element.amount;
            }

            if (element.currency === "BTC") {
              btc_balance += element.amount;
            }

            if (element.currency === "ETH") {
              eth_balance += element.amount;
            }
          }

          net_worth =
            cad_balance + btc_balance * 13117.37 + eth_balance * 439.02;

          allNetWorth.push({
            net_worth: net_worth,
            time: element.createdAt.substr(0, 10),
          });
        });

        setNetWorthArray(allNetWorth);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <div
        style={{
          paddingBottom: "56.25%" /* 16:9 */,
          position: "relative",
          height: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "90%",
            height: "80%",
            alignItems: "center",
            paddingLeft: "50px",
          }}
        >
          <h1>Your net Worth on Shakepay</h1>
          <ResponsiveContainer>
            <LineChart
              width={100}
              height={200}
              data={netWorthArray}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis tick={{ fontSize: 10 }} dataKey="time" />
              <YAxis
                tick={{ fontSize: 10 }}
                scale="log"
                domain={["0.001", "dataMax"]}
              >
                <Label value="CAD $" offset={0} position="insideTopLeft" />
              </YAxis>
              <Tooltip />
              <Legend content="Net Worth in CAD Dollars" />
              <Line
                type="monotone"
                dataKey="net_worth"
                label="Net Worth"
                stroke="#009FFF"
                unit="$"
                dot={false}
              />
              <Brush dataKey="time" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
