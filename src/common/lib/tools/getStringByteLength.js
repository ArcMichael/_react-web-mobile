/**
 * 获取字符串字节长度
 * @param {string} str
 * @return {number} - description
 */
const getStringByteLength = (str) => {
  let len = str.length;
  if (typeof str === "string") {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        len++;
      }
    }
  }
  return len;
};

export default getStringByteLength;
