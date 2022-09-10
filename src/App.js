import React, { useState, useEffect, useCallback } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Main, New, Traders } from "./components";
import Cover from "./components/Cover";
import { login, logout as destroy, accountBalance } from "./utils/near";
import "./App.css";

const App = () => {
  const [balance, setBalance] = useState("0");

  const account = window.walletConnection.account();

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div>
      {account.accountId ? (
        <Router>
          <Header
            address={account.accountId}
            amount={balance}
            destroy={destroy}
          />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/new" element={<New />} />
            <Route path="/traders" element={<Traders />} />
          </Routes>
        </Router>
      ) : (
        <Cover name="Market Arena" login={login} />
      )}
    </div>
  );
};

export default App;
