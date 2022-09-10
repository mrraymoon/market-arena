import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export async function createItem(itemObj) {
  const formatted = parseNearAmount(itemObj.price + "");
  itemObj = { ...itemObj, price: formatted };
  return await window.contract.createItem({ itemLoad: itemObj });
}

export function rateTrader(traderId, rating) {
  return window.contract.rateTrader({ traderId, rating: Number(rating) });
}

export async function buyItem(itemKey, cost) {
  await window.contract.buyItem({ itemKey }, GAS, cost);
}

export async function getItem(itemKey) {
  return await window.contract.getItem({ itemKey });
}

export async function getTrader(traderId) {
  return await window.contract.getTrader({ traderId });
}

export async function getAllTraders() {
  return await window.contract.getAllTraders();
}

export async function getAllItems() {
  return await window.contract.getAllItems();
}
