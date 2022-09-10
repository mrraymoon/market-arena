import { context, ContractPromiseBatch, logging } from "near-sdk-as";
import { Trader, Item, items, traders, isTrader } from "./model";

/**
 * create a new item object
 * @param itemLoad object containing item properties
 *
 */
export function createItem(itemLoad: Item): void {
  let _key = items.length;
  // Add new item to storage
  items.set(_key, Item.initializeValues(itemLoad));
  const senderIsTrader = traders.contains(context.sender);
  // Register sender if they are not yet registered as a trader
  if (!senderIsTrader) {
    // initialize trader default properties
    let newTrader = new Trader();
    traders.set(context.sender, newTrader.initializeValues());
    // complete traders registration
    isTrader.set(context.sender, true); // TODO: Remove this line as it will later become redundant
  }
}

/*
 * @param traderId trader unique identifier
 * @param rating value to add to trader rating (1-5)
 */
export function rateTrader(traderId: string, rating: u32): void {
  const trader = traders.get(traderId);
  if (trader) {
    // proceed to rate trader
    const hasRate = trader.raters.includes(context.sender);
    if (!hasRate) {
      logging.log("Proceeding to rate trader");
      trader.addToRating(rating);
      logging.log("After 'addToRating'");
      trader.increaseRateCount();
      logging.log("After 'increaseRateCount'");
      trader.addRater();
      logging.log("After 'addRater'");
      // save changes to state
      traders.set(traderId, trader);
    } else {
      logging.log("Trader already rated");
    }
  } else {
    throw new Error("Trader does not exist");
  }
}

/**
 *
 * @param itemKey used to get item from mapping
 */
export function buyItem(itemKey: u32): void {
  const item = items.get(itemKey);
  if (item) {
    if (item.price == context.attachedDeposit) {
      ContractPromiseBatch.create(item.owner).transfer(context.attachedDeposit);
    } else {
      throw new Error("Please send the right amount");
    }
    const previousOwner = item.owner;
    item.updateOwner();
    item.toggleSold();
    items.set(itemKey, item);
    const trader = traders.get(previousOwner);
    if (trader) {
      trader.increaseSoldCount();
      traders.set(previousOwner, trader);
    }
  } else {
    throw new Error("Item does not exist");
  }
}

/**
 *
 * @param itemKey used to get item from mapping
 * @returns an item object
 */
export function getItem(itemKey: u32): Item | null {
  const item = items.get(itemKey);
  return item;
}

/**
 *
 * @param traderId unique id of trader to query for
 * @returns details about a trader
 */
export function getTrader(traderId: string): Trader | null {
  const trader = traders.get(traderId);
  return trader;
}

/**
 *
 * @returns ids of all traders in market
 */
export function getAllTraders(): String[] {
  return traders.keys();
}

export function getAllItems(): Item[] {
  return items.values();
}
