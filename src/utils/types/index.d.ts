declare namespace Intl {
  type ListFormatOptions = {
    localeMatcher: string;
    type: string;
    style: string;
  };

  class ListFormat {
    constructor(locales?: Locale | string | undefined, options?: Partial<ListFormatOptions>);
    public format(list?: Iterable<string>): string;
  }

  class RelativeTimeFormat {
    constructor(locale: string);
    format(n: number, unit: string);
  }
}
