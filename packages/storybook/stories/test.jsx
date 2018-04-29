import React from "react";
import { storiesOf } from "@storybook/react";
import Masonry from "@slim/masonry";

const gibberish = `Lorem ipsum dolor sit amet, mel ei purto qualisque posidonium. Cu vis dolorem dolores definiebas, ad cum sint ludus forensibus, pro tantas putent eu. Ius ne sumo essent admodum, pro et postulant euripidis comprehensam, cum te justo principes voluptatibus. Zril propriae vim ea. Verterem mediocrem posidonium at sea. Ut nihil volutpat suscipiantur quo. Sea ea omnis maiorum suavitate, diam legere convenire no mel.

Quando veniam dolorem sed no, vix quod dolorem et, ubique salutandi eloquentiam no eum. Qui mucius sensibus instructior eu, ex oportere complectitur his. Ex tota aliquip dolorum duo, tritani mnesarchum honestatis sed ne. Ea cum tollit intellegat. At qui option patrioque appellantur, vim an summo abhorreant complectitur. Per ei alii probatus instructior.

Est platonem perpetua ne. Justo eligendi persecuti et usu, cu dolor deserunt pro, quando deseruisse nec in. Vim summo sensibus sapientem ei. Dolor constituto duo ei.

Ne esse populo eos. Pro modus vulputate no. Sea modo ipsum ne, nihil iriure adversarium ut pro. Cu indoctum necessitatibus quo. Duo efficiantur theophrastus in, partem adipisci sea et. Vix eu epicuri platonem, te ipsum consectetuer mel, quem homero reprehendunt nec ad.

Usu rebum sensibus ne. Dolores consetetur vim te, vix modo libris no. Ea vim quot postea legimus, mei te tale lorem necessitatibus, ea vim velit pericula. No sea percipit dissentiet. Te essent feugait nominavi per.`;

const len = gibberish.length;

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
  items.push(gibberish.substring(0, getRandomInt(0, len)));
}

console.log(heights);

function renderBricks({ style, index, item }) {
  return (
    <div style={style} key={index}>
      <div style={{ padding: 5 }}>
        <div style={{ border: "1px solid red", padding: 5 }}>{item}</div>
      </div>
    </div>
  );
}

storiesOf("Test", module).add("standard", () => (
  <div style={{ boxSizing: "border-box" }}>
    <Masonry
      brickRenderer={renderBricks}
      bricks={items}
      columnWidth={250}
      height={600}
    />
  </div>
));
