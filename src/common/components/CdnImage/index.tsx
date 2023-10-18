import getConfigs from "isomorphisms/getConfigs";
import * as React from "react";

interface ICdnImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {}

const configs = getConfigs();

export const getCdnImageUrl = (src: string) => {
  return `${configs.static}${src}`;
};

const CdnImage: React.FunctionComponent<ICdnImageProps> = (props) => {
  const { src, ...restProps } = props;

  return <img src={getCdnImageUrl(src || "")} {...restProps} />;
};

export default CdnImage;
