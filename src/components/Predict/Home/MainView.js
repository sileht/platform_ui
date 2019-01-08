import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

import RightPanel from "../commons/RightPanel";

import ServiceCardList from "../../widgets/ServiceCardList";
import PredictServiceList from "../../widgets/PredictServiceList";

@inject("modelRepositoriesStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterServiceName: "",
      predictLayout: "cards"
    };

    this.handleServiceFilter = this.handleServiceFilter.bind(this);
    this.cleanServiceFilter = this.cleanServiceFilter.bind(this);

    this.handleClickLayoutCards = this.handleClickLayoutCards.bind(this);
    this.handleClickLayoutList = this.handleClickLayoutList.bind(this);

    this.handleClickRefreshServices = this.handleClickRefreshServices.bind(
      this
    );
  }

  componentWillMount() {
    const { modelRepositoriesStore } = this.props;
    if (!modelRepositoriesStore.isReadyPredict) {
      modelRepositoriesStore.refreshPredict();
    }
  }

  handleClickRefreshServices() {
    this.props.modelRepositoriesStore.refreshPredict();
  }

  handleServiceFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanServiceFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  handleClickLayoutCards() {
    this.setState({ predictLayout: "cards" });
  }

  handleClickLayoutList() {
    this.setState({ predictLayout: "list" });
  }

  render() {
    const { deepdetectStore, modelRepositoriesStore } = this.props;
    const { predictServices } = deepdetectStore;
    const { filterServiceName } = this.state;

    let { publicRepositories, privateRepositories } = modelRepositoriesStore;
    const availableServicesLength =
      publicRepositories.length + privateRepositories.length;

    if (filterServiceName && filterServiceName.length > 0) {
      publicRepositories = publicRepositories.filter(r => {
        return (
          r.name.includes(filterServiceName) ||
          r.trainingTags.join(" ").includes(filterServiceName)
        );
      });

      privateRepositories = privateRepositories.filter(r => {
        return (
          r.name.includes(filterServiceName) ||
          r.trainingTags.join(" ").includes(filterServiceName)
        );
      });
    }

    publicRepositories = publicRepositories.slice().sort((a, b) => {
      return moment
        .utc(b.metricsDate ? b.metricsDate : 1)
        .diff(moment.utc(a.metricsDate ? a.metricsDate : 1));
    });

    privateRepositories = privateRepositories.slice().sort((a, b) => {
      return moment
        .utc(b.metricsDate ? b.metricsDate : 1)
        .diff(moment.utc(a.metricsDate ? a.metricsDate : 1));
    });

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-3 col-md-6">
              <h3>{predictServices.length}</h3>
              <h4>
                <i className="fas fa-braille" /> Predict Services
              </h4>
            </div>

            <div className="col-lg-3 col-md-6">
              <h3>
                {modelRepositoriesStore.isRefreshing ? (
                  <span>
                    <i className="fas fa-sync fa-spin fa-xs" />{" "}
                  </span>
                ) : (
                  availableServicesLength
                )}
              </h3>

              <h4>
                <i className="fas fa-archive" /> Available Services
              </h4>
            </div>

            <div className="col-lg-6 col-md-12 pb-2">
              <form className="form-inline">
                <Link to="/predict/new" className="btn btn-primary">
                  <i className="fas fa-plus" /> New Service
                </Link>
                &nbsp;
                <button
                  id="refreshServices"
                  onClick={this.handleClickRefreshServices}
                  type="button"
                  className="btn btn-primary"
                >
                  <i
                    className={
                      modelRepositoriesStore.isRefreshing
                        ? "fas fa-sync fa-spin"
                        : "fas fa-sync"
                    }
                  />
                </button>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fas fa-search" />
                    </div>
                  </div>
                  <input
                    type="text"
                    onChange={this.handleServiceFilter}
                    placeholder="Filter service name..."
                    value={this.state.filterServiceName}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={this.cleanServiceFilter}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="content">
            <div className="serviceList">
              <ServiceCardList services={predictServices} />
            </div>

            <hr />

            <div className="predictServiceList">
              <h4>Available Services</h4>

              <PredictServiceList
                services={publicRepositories}
                layout={this.state.predictLayout}
              />

              <hr />

              <PredictServiceList
                services={privateRepositories}
                layout={this.state.predictLayout}
              />
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
