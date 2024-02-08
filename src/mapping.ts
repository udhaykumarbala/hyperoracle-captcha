//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";
import { esig_verify } from "./constants/function-sig";
import { addr, destinationFunction } from "./constants/contract";
import { TwoString } from "./events/twostring";
import { SHA256 } from "@chainsafe/as-sha256";
import { Buffer } from "buffer";



export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  let state: Bytes;

  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].events;

  // #2 also can access (matched) events of a given account address (should present in yaml first).
  // a subset of 'events'
  let eventsByAcct: Event[] = blocks[0].account(addr).events;

  // #3 also can access (matched) events of a given account address & a given esig  (should present in yaml first).
  // a subset of 'eventsByAcct'
  let eventsByAcctEsig: Event[] = blocks[0].account(addr).eventsByEsig(esig_verify)

  // require match event count > 0
  require(eventsByAcctEsig.length > 0)

  // this 2 way to access event are equal effects, alway true when there's only 1 event matched in the block (e.g. block# 2279547 on sepolia).
  require(
    events[0].data == eventsByAcct[0].data 
    && events[0].data == eventsByAcctEsig[0].data
  );


  const verifyEvent = TwoString.fromEvent(events[0]);

  const sha256 = new SHA256();
  
  const hash = sha256.init().update(Buffer.from(verifyEvent.slice1)).final().toString();

  require(hash == verifyEvent.slice2);
  
  // set state to the address of the 1st (matched) event, demo purpose only.
  const calculatedWithFunctionHash = Bytes.fromHexString(
    destinationFunction + verifyEvent.addr.toHexString().padStart(64, "0")
  );

  return calculatedWithFunctionHash
}
