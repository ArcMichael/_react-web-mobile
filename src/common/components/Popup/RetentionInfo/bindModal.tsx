import * as React from "react";
import BindPhone from "@/containers/LoginStatePages/components/BindPhone";
import PopupUI from "../PopupUI";
interface IBindModal {}
const BindModal: React.FunctionComponent<IBindModal> = () => {
  // const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  return (
    <PopupUI _className="bind-modal" _zIndex={1000} _showCloseIcon={false}>
      <BindPhone />
    </PopupUI>
  );
};

export default BindModal;
