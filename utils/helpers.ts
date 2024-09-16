export function upperCaseFirst(input: string): string {
  if (input.length === 0) {
    return input;
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function timeAgo(dateString: string | undefined): string {
  if(!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return "just now";
}


export function numberFormat(data: string) {
  return (Number(data)).toLocaleString("en-US");
}

export function spreadArrToString(data: string[]): string {
  let s = "";
  data.forEach((e, i) => {
      if (i !== data.length - 1) {
          s += e + ", "
      } else {
          s += e
      }
  });
  return s;
}

export function formatDate(dateString: string, includeTime = true) {
  let dateObject = new Date(dateString);
  let date = dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1) + '-' + dateObject.getDate();
  let time = dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
  let dateTime = date + ( includeTime ? ' ' + time : '');
  return dateTime;
}

export function shortenWord(word: string, maxLength: number) {
  if (word.length <= maxLength) {
    return word;
  }

  const shortenedWord = word.substring(0, maxLength - 3) + '...';
  return shortenedWord;
}

export function truncate(str: string, length = 25) {
  if (str.length < 1) return
  let truncatedString = str
  if (length > 10 && str.length > length) {
    truncatedString = str.substring(0, length - 3) + ' ...'
  }
  return truncatedString
}

export function formatDateNoTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  
  const d = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  console.log(d)
  return d;
}

export function removeUnderscore(str: string): string {
  return str.replace(/_/g, ' ');
}

export function currencyFormat(data: string, currency = "NGN") {
  if (data.length === 0) {
    return "NGN 0.00"
  }
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return formatter.format(parseFloat(data))
}