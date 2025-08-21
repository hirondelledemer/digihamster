import React from "react";
import {
  BridgeFlowers1,
  BridgeFlowers2,
  BridgeFlowers3,
} from "./BridgeFlowers";
import { Bridge } from "./Bridge";
import { BridgeLamps } from "./BridgeLamps";
import { BridgeRuins } from "./BridgeRuins";

export const BridgeComposition = () => (
  <g style={{}} transform="matrix(1.029316, 0, 0, 1, 1.45105, 51.132309)">
    <title>{"Bridge"}</title>
    <BridgeFlowers3 />
    <Bridge />
    <BridgeLamps />
    <BridgeFlowers2 />
    <BridgeFlowers1 />
    <BridgeRuins />
  </g>
);
