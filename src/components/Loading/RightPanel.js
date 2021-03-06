import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import GpuInfo from "../widgets/GpuInfo";

@inject("configStore")
@inject("gpuStore")
@withRouter
@observer
class RightPanel extends React.Component {
  render() {

    if (
      typeof this.props.configStore.gpuInfo === "undefined" ||
        this.props.gpuStore.servers.length === 0
    ) {
      return null;
    }

    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <GpuInfo />
        </div>
      </aside>
    );
  }
}
export default RightPanel;
