import * as React from "react";
import { labelDto } from "@/containers/ProductCommentNew/service/interance";

import "./style.scss";

interface ILineTag {
  _labelList: labelDto[];
}
const NewManageInventory: React.FunctionComponent<ILineTag> = ({ _labelList }) => {
  //   const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  return (
    <>
      {_labelList.map((it) => {
        return (
          <div className={`line-tag line-tag${_labelList.length}`}>
            <div className="line-name">{it.name?.slice(0, 2)}</div>
            <div className="line-box">
              <div className="bg-bar" />

              <div className="process" />
            </div>
            {it.count}.0
          </div>
        );
      })}
    </>
  );
};

export default NewManageInventory;
