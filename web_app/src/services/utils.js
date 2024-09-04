const convertGweiToEth = (valueGwei) => {
  return Math.round(parseFloat(valueGwei) * 1e-18);
};

const convertEthToGwei = (valueEth) => {
  return valueEth * 1e18;
};

function numberRange(start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}

export { convertGweiToEth, convertEthToGwei, numberRange };
