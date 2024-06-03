import React from "react";
import Slider from "react-slick";

const CommonBanner = ({ children, settings }) => {
  return <Slider {...settings}>{children}</Slider>;
};
export default CommonBanner;
