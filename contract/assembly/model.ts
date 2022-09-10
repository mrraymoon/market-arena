import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";

/**
 * class contains properties each item exibit
 * {@link nearBindgen} - a decorator that makes this class serializable so it can be persisted on the blockchain
 */
@nearBindgen
export class Item {
  owner: string;
  name: string;
  imageUrl: string;
  description: string;
  price: u128;
  sold: bool;

  /**
   *
   * @param data values to initialize item properties
   * @returns an Item object
   */
  public static initializeValues(data: Item): Item {
    const item = new Item();
    item.owner = context.sender;
    item.name = data.name;
    item.imageUrl = data.imageUrl;
    item.description = data.description;
    item.price = data.price;
    item.sold = false;
    return item;
  }

  /**
   * @dev update item state to sold and transfer ownership to new owner
   */
  public buyItem(): void {
    this.sold = true;
    this.owner = context.sender;
  }

  /**
   * @dev puts an item back on sale
   * @param newPrice new price of item
   */
  public reSellItem(newPrice:u128): void {
    this.price = newPrice;
    this.sold = false;
  }

}

/**
 * class contains properties each trader exibits
 * {@link nearBindgen} - a decorator that makes this class serializable so it can be persisted on the blockchain
 */
@nearBindgen
export class Trader {
  traderId: string;
  soldCount: u32;
  rating: u32;
  rateCount: u32;
  raters: Array<string>;

  public initializeValues(): Trader {
    const trader = new Trader();
    trader.traderId = context.sender;
    trader.raters = [];
    return trader;
  }

  public addRating(rating: u32): void {
    this.rating = this.rating + rating;
    this.rateCount = this.rateCount + 1;
    this.raters.push(context.sender);
  }

  public increaseSoldCount(): void {
    this.soldCount = this.soldCount + 1;
  }
}

export const items = new PersistentUnorderedMap<u32, Item>("items");

export const traders = new PersistentUnorderedMap<string, Trader>("traders");

