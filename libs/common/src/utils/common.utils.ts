export class CommonUtils {
  /**
   * @deprecated Since version 0.1.10. Please use {@link lodash.groupBy()}
   * @param array a list of objects need to be grouped.
   * @param key a string.
   * @returns a Map<string, any> with string key and a list of objects as value.
   * @use this one for one to many grouping.
   */
  public static groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      const keyValue = currentValue[key].toString();
      (result[keyValue] = result[keyValue] || []).push(currentValue);
      return result;
    }, {});
  }

  /**
   * @deprecated Since version 0.1.10. Please use {@link lodash.groupBy()}
   * @param list a list of objects need to be mapped.
   * @param key a string.
   * @returns a Map<string, any> with string key and a single object as value.
   * @use this one for one to one mapping.
   */
  public static getMapped(list: any[], key: string): Map<string, any> {
    return list.reduce((map: Map<string, any>, currentValue: any) => {
      const idKey = currentValue[key].toString();
      map[idKey] = currentValue;
      return map;
    }, {});
  }

  public static round(number: number) {
    const rounded = Number((Math.abs(number) * 100).toPrecision(15));
    return (Math.round(rounded) / 100) * Math.sign(number);
  }
}
