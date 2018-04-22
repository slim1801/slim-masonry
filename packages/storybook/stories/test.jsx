import React from "react";
import { storiesOf } from "@storybook/react";
import Masonry from "@slim/masonry";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN = 100;
const MAX = 500;
const NUM = 100;
const heights = [];
let items = [];

for (let i = 0; i < NUM; i++) {
  heights.push(getRandomInt(MIN, MAX));
  items.push("ITEM" + i);
}

console.log(heights);

function renderBricks({ style, index, item }) {
  const bStyle = { border: "1px solid red", ...style };
  return (
    <div style={bStyle} key={index}>
      {item}
    </div>
  );
}

storiesOf("Test", module).add("standard", () => (
  <Masonry
    brickRenderer={renderBricks}
    bricks={items}
    height={600}
    getBrickHeight={index => heights[index]}
  />
));
