export interface CookieOption {
  path?: string;
  sameSite?: string;
  domain?: string;
  expires?: number;
}

export type CookieArgs = [] | [string] | [string, CookieOption];

export const getCookie = (): Promise<
  (key: string, ...arg: CookieArgs) => string | undefined
> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined") {
      import("js-cookie").then(({ default: Cookies }) => {
        const cookie = (key: string, ...arg: CookieArgs) => {
          if (arg && arg.length > 0) {
            const [v1, v2] = arg;
            if (typeof v1 === "string") {
              Cookies.set(key, v1, v2);
            }
          }

          return Cookies.get(key);
        };
        resolve(cookie);
      });
      return;
    }
    resolve(() => "");
  });
};
