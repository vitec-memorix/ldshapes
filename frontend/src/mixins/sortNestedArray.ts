export default function sortNestedArray (prop:string, arr:Array<any>):Array<any>  {
  const propArray = prop.split('.');
  const len = propArray.length;

  arr.sort(function (a, b):number {
    let i = 0;
    let valA = '';
    let valB = '';
    a = Object.assign({}, a);
    b = Object.assign({}, b);
    while( i < len ) {
      valA = a[propArray[i]]; valB = b[propArray[i]]; i++;
    }
    if (valA < valB) {
      return -1;
    } else if (valA > valA) {
      return 1;
    } else {
      return 0;
    }
    return -1;
  });

  return arr;
}
