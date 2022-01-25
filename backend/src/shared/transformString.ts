export default function transformString(string, type = 'snake') {
  const splitStr = string.toLowerCase().split(' ');
  if (type === 'snake' || type === 'snakeLowerFirst') {
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      if (type === 'snakeLowerFirst' && i === 0) {
        //do nothing. Keep a lowercase.
      } else {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
    }
    return splitStr.join('');
  }

  return string;
}
