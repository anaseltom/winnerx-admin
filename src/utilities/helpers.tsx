import { format, parseISO } from "date-fns";

import dayjs from "dayjs";
import preciseDiff from "dayjs-precise-range";
import { trim } from "lodash";

export const pathFix = (path: string) => {
  return path + (path.endsWith("/") ? "" : "/");
};

export const properCase = (str: any = "") => {
  return str?.charAt(0).toUpperCase() + str.slice(1);
};

export const titleCase = (str: any = "") => {
  str = str?.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (date instanceof Date && !isNaN(date.valueOf())) {
    return format(parseISO(value), "MMMM dd, yyyy");
  } else {
    return "";
  }
};

export const numberOnlyValidation = (event: any) => {
  const pattern = /[0-9.,]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
    // invalid character, prevent input
    event.preventDefault();
  }
};

//deprecated - use CurrencyFormat => "react-currency-format" instead
/*
export const currencyFormat = (
  num: any,
  currency: string = "$",
  decimals: number = 2
) => {
  if (!num) {
    num = 0;
  }
  return (
    currency +
    parseFloat("0" + num)
      .toFixed(decimals)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, `1,`)
  );
};
*/

// ignores case-sensitive
const getValue = (value: any) =>
  typeof value === "string" ? value.toUpperCase() : value;

/**
 * Filters an array of objects (one level-depth) with multiple criteria.
 * https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria
 * @return {Array}
 */
export const filterPlainArray = (array: any, filters: any) => {
  const filterKeys = Object.keys(filters);
  return array.filter((item: any) => {
    // validates all filter criteria
    return filterKeys.every((key) => {
      // ignores an empty filter
      if (!filters[key].length) return true;
      return filters[key].find(
        ////// (filter: any) => getValue(item[key]) === getValue(filter)
        (filter: any) => getValue(item[key])?.includes(getValue(filter))
      );
    });
  });
};
/*** filterPlainArray example:
 const products = [
      { name: 'A', color: 'Blue', size: 50 },
      { name: 'B', color: 'Blue', size: 60 },
      { name: 'C', color: 'Black', size: 70 },
      { name: 'D', color: 'Green', size: 50 },
    ];

    const filters = {
      color: ['BLUE', 'black'],
      size: [70, 50],
    };

    const filtered = filterPlainArray(products, filters);
    const expected = [
      { name: 'A', color: 'Blue', size: 50 },
      { name: 'C', color: 'Black', size: 70 },
    ];
 */

/**
 * Filters an array of objects using custom predicates.
 *
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria
 * @return {Array}
 */
export const filterArray = (array: any, filters: any) => {
  const filterKeys = Object.keys(filters);
  return array.filter((item: any) => {
    // validates all filter criteria
    return filterKeys.every((key: any) => {
      // ignores non-function predicates
      if (typeof filters[key] !== "function") return true;
      return filters[key](item[key]);
    });
  });
};

export const calculateDate = (today: any = new Date(), startDate: any) => {
  dayjs.extend(preciseDiff);
  const m1 = dayjs(startDate);
  const m2 = dayjs(today);
  const result = dayjs.preciseDiff(m1, m2, true);
  console.log("result >>>", result);
  // example: { "years": 2, "months": 7, "days": 0, "hours": 6, "minutes": 29, "seconds": 17, "firstDateWasLater":  false }

  let message = "";
  if (result.years) {
    message +=
      " " + result.years + " " + (result.years === 1 ? "year" : "years");
  }
  if (result.months) {
    message +=
      " " + result.months + " " + (result.months === 1 ? "month" : "months");
  }
  if (result.days) {
    message += " " + result.days + " " + (result.days === 1 ? "day" : "days");
  }
  return message;
};

export const combineArray = (arr: any) => {
  if (arr.length === 1) {
    return arr[0];
  } else {
    var ans = [];

    // recur with the rest of the array.
    let otherCases: any = combineArray(arr.slice(1));
    for (var i = 0; i < otherCases.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        const item =
          arr[0][j] +
          (!otherCases[i] || !arr[0][j] ? "" : " / ") +
          otherCases[i];
        if (trim(item)) {
          ans.push(item);
        }
      }
    }
    return ans;
  }
};
// export const groupBy = (key: any, arr: any) =>
//   arr?.reduce((cache: any, item: any) => {
//     const property = item[key];
//     if (property in cache) {
//       return { ...cache, [property]: cache[property].concat(item) };
//     }
//     return { ...cache, [property]: [item] };
//   });
