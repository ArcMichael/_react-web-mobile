import * as React from "react";
import "./style.scss";

interface IStar {}
const Star: React.FunctionComponent<IStar> = () => {
  //   const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  return (
    <div className="star">
      <span className="star_five" />
      {/* <div className="star-img" /> */}
    </div>
  );
};

export default Star;
