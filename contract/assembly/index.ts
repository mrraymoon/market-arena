import { context, ContractPromiseBatch, logging, u128 } from "near-sdk-as";
import { Trader, Item, items, traders } from "./model";

/**
 * create a new item object
 * @param itemLoad object containing item properties
 *
 */
export function createItem(itemLoad: Item): void {
  assert(itemLoad.name.length > 0, "Empty name");
  assert(itemLoad.description.length > 0, "Empty description");
  assert(itemLoad.imageUrl.length > 0, "Empty imageUrl");
  assert(itemLoad.price > u128.Zero, "price needs to be  greater than zero");
  let _key = items.length;
  // Add new item to storage
  items.set(_key, Item.initializeValues(itemLoad));
  const senderIsTrader = traders.contains(context.sender);
  // Register sender if they are not yet registered as a trader
  if (!senderIsTrader) {
    // initialize trader default properties
    let newTrader = new Trader();
    traders.set(context.sender, newTrader.initializeValues());
  }
}

/*
 * @param traderId trader unique identifier
 * @param rating value to add to trader rating (1-5)
 */
export function rateTrader(traderId: string, rating: u32): void {
  // accountIds on testnet ends with ".testnet"
  assert(traderId.length > 8, "Invalid trader Id");
  const trader = traders.get(traderId);
  if (trader) {
    // proceed to rate trader
    const hasRate = trader.raters.includes(context.sender);
    if (!hasRate) {
      assert(rating > u32.MIN_VALUE && rating <= u32(5), "Rating has to be between 1-5");
      trader.addRating(rating);
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
    assert(item.owner.toString() != context.sender.toString(), "You can't buy your own item");
    assert(item.price == context.attachedDeposit, "Please send the right amount");
    const previousOwner = item.owner;
    item.buyItem();
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
 */
 export function reSellItem(itemKey: u32, newPrice: u128): void {
  const item = items.get(itemKey);
  if (item) {
    assert(newPrice > u128.Zero, "New price needs to be  greater than zero");
    assert(item.owner.toString() == context.sender.toString(), "Only item's owner can resell this item");
    item.reSellItem(newPrice);
    items.set(itemKey, item);
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
