/* eslint-disable @typescript-eslint/no-explicit-any */
export const isFunction = <T>(value: T): boolean => {
  return typeof value === "function";
};

export const noop = (): void => {};

export const hookObjectProperty = <
  F extends (...args: any[]) => any,
  K extends string | number | symbol,
  O extends Record<K, F>,
>(
  obj: O,
  key: K,
  hookFunc: (origin: O[K], ...params: any[]) => O[K],
) => {
  return (...params: any[]) => {
    const origin = obj[key];
    const hookedUnsafe = hookFunc(origin, ...params);
    let hooked = hookedUnsafe;
    if (isFunction(hooked)) {
      hooked = function (this: ThisType<F>, ...args: Parameters<F>): ReturnType<F> {
        try {
          return hookedUnsafe.apply(this, args);
        } catch {
          return isFunction(origin) && origin.apply(this, args);
        }
      } as O[K];
    }
    obj[key] = hooked;

    return (strict?: boolean) => {
      if (!strict || hooked === origin) {
        obj[key] = origin;
      }
    };
  };
};
