import { getCustomLogger, CategoriesEnum } from "@sephora/log";

export const loggers = {
  req: getCustomLogger(CategoriesEnum.request),
  default: getCustomLogger(CategoriesEnum.default),
  app: getCustomLogger(CategoriesEnum.app),
};
