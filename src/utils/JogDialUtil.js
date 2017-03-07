/*
 JogDialUtil
 */

// Return the current quadrant.
// Note: JogDial's Cartesian plane is flipped, hence it's returning reversed value.
const getQuadrant = (x, y) => {
  if (x > 0 && y > 0) return 4;
  else if (x < 0 && y > 0) return 3;
  else if (x < 0 && y < 0) return 2;
  else if (x >= 0 && y < 0) return 1;
}

//Checking collision
const checkBoxCollision = (bound, point) => {
  return bound.x1 < point.x
    && bound.x2 > point.x
    && bound.y1 < point.y
    && bound.y2 > point.y;
}


const convertClockToUnit = (n) => {
  return n % 360 - 90;
}

const convertUnitToClock = (n) => {
  return (n >= -180 && n < -90 ) ? 450 + n : 90 + n;
}

const JogDialUtil = {
  getQuadrant,
  checkBoxCollision,
  convertClockToUnit,
  convertUnitToClock
}

export default JogDialUtil
