import React, { useState, useEffect, useCallback } from "react";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { getAllItems, buyItem as _buyItem } from "../../utils/funcs";
import "./Main.css";
import Loader from "../Loader";

const _items = [
  {
    owner: "mrray.testnet",
    name: "Product 1",
    description:
      "product 1 item to ever be created let me add some lorem ipsum generated text to fill up this place to make the text longer than it seems",
    image:
      "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    price: 13,
    soldCount: 5,
  },
  {
    owner: "mrray.testnet",
    name: "product 2",
    description: "second item to ever be created",
    image:
      "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    price: 13,
    soldCount: 5,
  },
  {
    owner: "mrray.testnet",
    name: "product 3",
    description: "Third item to ever be created",
    image:
      "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    price: 13,
    soldCount: 5,
  },
];

const Main = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const account = window.walletConnection.account();

  const getItems = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await getAllItems());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const buyItem = async (itemKey, cost) => {
    try {
      await _buyItem(itemKey, cost).then(() => getItems());
    } catch (e) {
      console.log({ e });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="main">
          {items.map((item, index) => {
            if (!item.sold)
              return (
                <div className="item">
                  <img src={item.imageUrl} />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-description">{item.description}</div>
                  </div>
                  <hr />
                  <div className="item-action">
                    <div className="item-owner">{item.owner}</div>
                    <button
                      className="item-button"
                      onClick={() => buyItem(index, item.price)}
                    >
                      {account.accountId != item.owner && "Buy"}
                    </button>
                    <div className="item-price">
                      {formatNearAmount(item.price)} NEAR
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default Main;
