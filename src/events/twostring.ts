// @ts-ignore
import { Event, BigInt, Address } from "@hyperoracle/zkgraph-lib"

export class TwoString {
  public slice1: string
  public slice1len: BigInt
  public slice2: string
  public slice2len: BigInt
  public addr: Address

  constructor(
    slice1: string,
    slice1len: BigInt,
    slice2: string,
    slice2len: BigInt,
    addr: Address
  ) {
    this.slice1 = slice1
    this.slice1len = slice1len
    this.slice2 = slice2
    this.slice2len = slice2len
    this.addr = addr
  }

  /**
   * Creates a Transfer object from an Event.
   *
   * @param {Event} event - The Event object to convert. - TwoString (slice1, slice2)
   * @return {TwoString} The created TwoString object.
   */
  static fromEvent(event: Event): TwoString {
    const addr = event.topic1;
    let start = BigInt.fromBytes(event.data.slice(0, 32));

    let lenOfSlice1 = BigInt.fromBytes(event.data.slice(start.toU32(), start.add(32).toU32()));
    start = start.add(32);

    let extraBytes = (lenOfSlice1.mod(32).eq(0)) ? 0 : 1;
    let lenInBytes = ((lenOfSlice1.div(32)).add(extraBytes)).mul(32);
    let slice = event.data.slice(start.toU32(), start.add(lenOfSlice1).toU32());

    start = start.add(lenInBytes);

    let lenOfSlice2:BigInt = BigInt.fromBytes(event.data.slice(start.toU32(), start.add(32).toU32()));
    start = start.add(32);
    
    extraBytes = (lenOfSlice2.mod(32).eq(0)) ? 0 : 1;
    lenInBytes = ((lenOfSlice2.div(32)).add(extraBytes)).mul(32);
    let slice2 = event.data.slice(start.toU32(), start.add(lenOfSlice2).toU32());

    return new TwoString(
      slice.toString(),
      lenOfSlice1,
      slice2.toString(),
      lenOfSlice2,
      addr
    )
  }
}