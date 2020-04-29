export const scaleRange = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

export const rgbToHex = (rgb: number | string) => { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};
