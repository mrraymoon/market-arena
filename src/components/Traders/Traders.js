import React, { useEffect, useState, useCallback } from "react";
import {
  getAllTraders,
  getTrader,
  rateTrader as _rateTrader,
} from "../../utils/funcs";
import Loader from "../Loader";
import "./Traders.css";

const Traders = () => {
  const [allRates, setAllRates] = useState();
  const [tradersId, setTradersId] = useState([]);
  const [traders, setTraders] = useState([]);

  const account = window.walletConnection.account();

  const rateTrader = async (trader, rate) => {
    console.log(`You just gave ${trader} ${rate} star`);
    try {
      await _rateTrader(trader, rate).then(() => {
        window.location.reload();
      });
    } catch (e) {
      console.log({ e });
    }
  };

  const init = () => {
    tradersId.forEach((trader) => {
      setAllRates((prev) => {
        return { ...prev, [trader]: 1 };
      });
    });
  };

  const getTraders = useCallback(async () => {
    try {
      const _allTraders = await getAllTraders();
      setTradersId(_allTraders);
      _allTraders.forEach(async (id) => {
        const _trader = await getTrader(id);
        setTraders((prev) => {
          return [...prev, _trader];
        });
      });
    } catch (error) {
      console.log({ error });
    }
  });

  useEffect(() => {
    getTraders();
  }, []);

  useEffect(() => {
    init();
  }, [tradersId]);

  const handleRatesChange = (value, trader) => {
    setAllRates((prev) => {
      return { ...prev, [trader]: value };
    });
  };

  const handleRate = (id) => {
    const val = allRates[id];
    rateTrader(id, val);
  };

  return (
    <>
      {traders.length > 0 ? (
        <div className="traders">
          <div className="traders-heading">
            All traders who have added goods to this market
          </div>
          <div className="traders-subheading">
            <span>Trader ID</span>
            <span>Rating</span>
          </div>
          {traders.map((trader, index) => (
            <div className="trader-row">
              <div className="trader">
                <div className="trader-id">{trader.traderId}</div>
                <div className="trader-rating">
                  {Number(trader.rating / trader.rateCount || 0).toFixed(2)}
                </div>
              </div>
              {!trader.raters.includes(account.accountId) && (
                <button
                  className="rate-button"
                  onClick={() => handleRate(trader.traderId)}
                >
                  Rate
                </button>
              )}
              {!trader.raters.includes(account.accountId) && (
                <input
                  className="rate-input"
                  name={`rate-${index}`}
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={1}
                  onChange={(e) =>
                    handleRatesChange(e.target.value, trader.traderId)
                  }
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default Traders;
