const getUniqId = () => {
  return `k-${+new Date()}-${Math.random()}`;
};

export default getUniqId;
