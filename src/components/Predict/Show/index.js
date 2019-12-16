import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

@inject("deepdetectStore")
@inject("imaginateStore")
@inject("configStore")
@withRouter
@observer
export default class PredictShow extends React.Component {
  constructor(props) {
    super(props);

    this.setDeepdetectServer = this.setDeepdetectServer.bind(this);
  }

  async setDeepdetectServer(params) {
    const { deepdetectStore, imaginateStore } = this.props;

    if (!deepdetectStore.isReady) {
      this.props.history.push("/predict");
    } else if (!deepdetectStore.init(params)) {
      this.props.history.push("/404");
    } else {
      imaginateStore.connectToDdStore(deepdetectStore);
      imaginateStore.chain = {};
      imaginateStore.predict();
    }

    deepdetectStore.setTrainRefreshMode(null);
  }

  componentWillMount() {
    this.setDeepdetectServer(this.props.match.params);
  }

  componentWillReceiveProps(nextProps) {
    this.setDeepdetectServer(nextProps.match.params);
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Predict") ||
      this.props.configStore.isComponentBlacklisted("PredictShow")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar service-component predict-show-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
}
