import React, { Component } from "react";
import PropTypes from "prop-types";
import { every, forEach, forEachRight, map } from "lodash";

const Stringer = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export default class Masonry extends Component {
  static propTypes = {
    width: Stringer,
    height: Stringer,
    columnWidth: PropTypes.number,
    getBrickHeight: PropTypes.func,
    brickRenderer: PropTypes.func,
    bricks: PropTypes.array,
    virtualBuffer: PropTypes.number,
    virtualTrigger: PropTypes.number
  };

  static defaultProps = {
    width: "auto",
    height: "100%",
    columnWidth: 200,
    virtualBuffer: 500,
    virtualTrigger: 200
  };

  masonryRef;
  scrollTop = 0;
  height = 0;
  minBottom = 0;
  minTop = 0;
  resizeTimer;
  cachedBricks = [];

  onResize() {
    clearTimeout(this.resizeTimer);
    const self = this;
    this.resizeTimer = setTimeout(() => {
      self.forceUpdate();
    }, 250);
  }

  componentDidMount() {
    this.height = this.masonryRef.offsetHeight;
    window.addEventListener("resize", this.onResize.bind(this));
    this.masonryRef.addEventListener("scroll", this.onScroll.bind(this));
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize.bind(this));
  }

  onScroll(event) {
    const element = event.currentTarget || event.target;
    if (element.scrollTop > this.scrollTop) {
      this.scrollTop = element.scrollTop;
      if (
        this.scrollTop + this.height >
        this.minBottom - this.props.virtualTrigger
      ) {
        this.forceUpdate();
        console.log(
          "SCROLL DOWN: ",
          this.minBottom - this.props.virtualTrigger
        );
      }
    } else if (element.scrollTop < this.scrollTop) {
      this.scrollTop = element.scrollTop;
      if (this.minTop + this.props.virtualTrigger < this.scrollTop) {
        this.forceUpdate();
        console.log("SCROLL UP: ", this.minBottom - this.props.virtualTrigger);
      }
    }
  }

  addToPositionArray(newPosition, positionArray) {
    forEachRight(positionArray, (position, index) => {
      if (newPosition.top >= position.top) {
        positionArray.splice(index + 1, 0, newPosition);
        return false;
      } else if (index === 0) {
        positionArray.unshift(newPosition);
      }
    });
  }

  positionArray = [];

  getVirtualBottom() {
    return this.scrollTop + this.height + this.props.virtualBuffer;
  }

  computeLayout() {
    if (!this.masonryRef) {
      return [];
    }

    const { offsetWidth, offsetHeight } = this.masonryRef;
    const {
      bricks,
      brickRenderer,
      columnWidth,
      getBrickHeight,
      virtualBuffer
    } = this.props;

    const columns = Math.floor(offsetWidth / columnWidth);
    const verticalMargins = (offsetWidth % columnWidth) * 0.5;

    this.positionArray = map(new Array(columns).fill(0), (value, index) => ({
      left: index * columnWidth + verticalMargins,
      top: 0
    }));

    const renderedBricks = [];

    for (let index = 0; index < bricks.length; index++) {
      const brick = bricks[index];
      const { top, left } = this.positionArray[0];
      const height = getBrickHeight(index);
      const style = {
        top,
        left,
        height,
        width: columnWidth,
        position: "absolute"
      };

      this.addToPositionArray({ top: height + top, left }, this.positionArray);
      this.positionArray.shift();

      if (height + top <= this.scrollTop - virtualBuffer) {
        continue;
      } else if (renderedBricks.length === 0) {
        this.minTop = top;
      }

      if (every(this.positionArray, pos => pos.top > this.getVirtualBottom())) {
        this.minBottom = this.positionArray[0].top;
        return renderedBricks;
      }
      const props = { style, index, item: brick };
      if (!this.cachedBricks[index]) {
        this.cachedBricks[index] = { top, height, left };
      }
      renderedBricks.push(brickRenderer(props));
    }
    return renderedBricks;
  }

  render() {
    const { height, width } = this.props;
    console.log("RENDER");
    return (
      <div
        ref={instance => {
          this.masonryRef = instance;
        }}
        style={{ height, width, overflow: "scroll", position: "relative" }}
      >
        {this.computeLayout()}
      </div>
    );
  }
}
