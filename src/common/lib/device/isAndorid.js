const isAndorid = () => {
  if (/android/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export default isAndorid;
