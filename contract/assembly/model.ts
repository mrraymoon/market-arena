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
   * Set the owner variable
   */
  public updateOwner(): void {
    this.owner = context.sender;
  }
  
  /**
   * update item state to sold
   */
  public toggleSold(): void {
    this.sold = true;
  }
}

/**
 * class contains properties each trader exibit
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

  public addToRating(rating: u32): void {
    this.rating = this.rating + rating;
  }

  public increaseRateCount(): void {
    this.rateCount = this.rateCount + 1;
  }

  public increaseSoldCount(): void {
    this.soldCount = this.soldCount + 1;
  }

  public addRater(): void {
    this.raters.push(context.sender);
  }
}

export const items = new PersistentUnorderedMap<u32, Item>("items");

export const traders = new PersistentUnorderedMap<string, Trader>("traders");

export const isTrader = new PersistentUnorderedMap<string, bool>("istrader");
