"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.renderHeadFromRouteItem = exports.routeItemToUrl = exports.buildNav = exports.getAdditionalRoutes = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _Section = _interopRequireDefault(require("./Section"));

var _SectionsList = _interopRequireDefault(require("./SectionsList"));

var _SectionHead = _interopRequireDefault(require("./SectionHead"));

var _ProductionHead = _interopRequireDefault(require("./ProductionHead"));

var _Layout = _interopRequireDefault(require("./Layout"));

var _PreviewLink = _interopRequireDefault(require("./PreviewLink"));

var _RouterLink = _interopRequireDefault(require("./RouterLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
/* eslint no-new-func : 0 */

const inBrowser = isBrowser();

const getAdditionalRoutes = () => {
  return [];
};

exports.getAdditionalRoutes = getAdditionalRoutes;

const buildNav = ({
  /*production,*/
  edition = {},
  locale = {},
  translate
}) => {
  const {
    data = {}
  } = edition;
  const {
    plan = {}
  } = data;
  const {
    summary = []
  } = plan;
  return summary.reduce((result, element) => {
    switch (element.type) {
      case 'resourceSections':
        return [...result, {
          routeClass: 'sectionsList',
          level: 0,
          title: element.data.customTitle || translate('Selection'),
          options: element.data,
          viewId: element.id
        }];

      default:
        const {
          data: elementData = {}
        } = element;
        return [...result, {
          routeClass: element.type,
          level: 0,
          title: elementData.customTitle || locale[element.type] || element.type,
          options: element.data,
          viewId: element.id,
          routeParams: {}
        }];
    }
  }, []);
};

exports.buildNav = buildNav;

const routeItemToUrl = (item, index) => {
  /*
   * if nav index specified
   * and nav index is 0 then this is the landing page
   */
  if (index !== undefined && index === 0) {
    return '/';
  }

  switch (item.routeClass) {
    case 'landing':
      return '/';

    case 'sectionsList':
      return `/list/${item.routeParams.elementId}`;

    case 'resourcePage':
      const additional = [
      /*'previousResourceId', 'nextResourceId',*/
      'notesPosition', 'displayHeader', 'viewId'].reduce((res, key) => `${res}${item.routeParams[key] ? `&${key}=${item.routeParams[key]}` : ''}`, '');
      return `/resource?resourceId=${item.routeParams.resourceId}&mode=screen${additional}`;

    default:
      return `/${item.routeClass}/${item.viewId}`;
  }
};

exports.routeItemToUrl = routeItemToUrl;

const renderHeadFromRouteItem = ({
  item,
  production,
  edition
}) => {
  switch (item.routeClass) {
    case 'resourcePage':
      return _react.default.createElement(_SectionHead.default, {
        production: production,
        edition: edition,
        section: production.resources[item.routeParams.resourceId]
      });

    default:
      return _react.default.createElement(_ProductionHead.default, {
        production: production,
        edition: edition,
        pageName: `${production.metadata.title} - ${item.title}`
      });
  }
};

exports.renderHeadFromRouteItem = renderHeadFromRouteItem;

class Wrapper extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getChildContext", () => ({
      LinkComponent: this.props.previewMode ? _PreviewLink.default : _RouterLink.default,
      activeViewId: this.state.viewId,
      activeViewParams: this.state.viewParams,
      contextualizers: this.props.contextualizers,
      edition: this.props.edition,
      translate: this.translate,
      navigateTo: this.navigateTo,
      routeItemToUrl,
      production: this.props.production,
      productionAssets: this.props.production.assets,
      usedDocument: this.props.usedDocument,
      getViewIdForSectionId: this.getViewIdForSectionId
    }));

    _defineProperty(this, "translate", key => {
      const {
        locale = {}
      } = this.props;
      return locale[key] || key;
    });

    _defineProperty(this, "identifyView", (viewType, params1, params2) => {
      switch (viewType) {
        case 'sections':
          return params1.resourceId === params2.resourceId;

        default:
          return true;
      }
    });

    _defineProperty(this, "getSummaryIndex", ({
      viewId,
      routeClass,
      routeParams
    }) => {
      let index;
      this.state.navSummary.find((item, thatIndex) => {
        if (item.viewId === viewId
        /* ||  item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
        */
        ) {
            index = thatIndex;
            return true;
          }
      });

      if (!index) {
        this.state.navSummary.find((item, thatIndex) => {
          if (item.routeClass === routeClass && this.identifyView(routeClass, routeParams, item.routeParams)) {
            index = thatIndex;
            return true;
          }
        });
      }

      return index;
    });

    _defineProperty(this, "navigateTo", ({
      routeClass,
      routeParams,
      viewNavSummaryIndex,
      viewId
    }) => {
      let index = viewNavSummaryIndex;
      let finalViewId = viewId;

      if (!index) {
        index = this.getSummaryIndex({
          routeClass,
          routeParams,
          viewId
        });

        if (!finalViewId && index) {
          finalViewId = this.state.navSummary[index].viewId;
        }
      }

      if (!index) {
        this.state.navSummary.some((item, thatIndex) => {
          if (item.routeClass === routeClass) {
            index = thatIndex;
            finalViewId = item.viewId;
            return true;
          }
        });
      }

      this.setState({
        viewClass: routeClass,
        viewParams: routeParams,
        viewNavSummaryIndex: index,
        viewId: finalViewId
      });

      if (typeof this.props.onActiveViewChange === 'function') {
        this.props.onActiveViewChange({
          viewClass: routeClass,
          viewId: finalViewId,
          viewParams: routeParams
        });
      }
    });

    _defineProperty(this, "getViewIdForSectionId", sectionId => {
      /*
       * gets the first section nav item that matches a specific section
       * (explanations: there can be several times the same section)
       */
      const {
        navSummary
      } = this.state;
      const firstMatch = navSummary.find(item => item.routeClass === 'sections' && item.routeParams.resourceId === sectionId);

      if (firstMatch) {
        return firstMatch.viewId;
      }
    });

    _defineProperty(this, "renderView", ({
      viewClass,
      viewParams,
      navSummary,
      viewNavSummaryIndex
    }) => {
      switch (viewClass) {
        case 'resourcePage':
          return _react.default.createElement(_Section.default, {
            production: this.props.production,
            edition: this.props.edition,
            activeViewClass: viewClass,
            activeViewParams: viewParams
          });

        case 'sectionsList':
          return _react.default.createElement(_SectionsList.default, {
            production: this.props.production,
            edition: this.props.edition,
            activeViewClass: viewClass,
            activeViewParams: viewParams,
            parentBlockId: navSummary[viewNavSummaryIndex].viewId,
            options: navSummary[viewNavSummaryIndex].options
          });

        default:
          return _react.default.createElement("div", null, _react.default.createElement("p", null, "view id: ", viewClass), _react.default.createElement("pre", null, "route params: ", JSON.stringify(viewParams, null, 2)));
      }
    });

    const {
      production,
      edition,
      locale: _locale
    } = props;
    const summary = buildNav({
      production,
      edition,
      locale: _locale,
      translate: this.translate
    });
    const firstEl = summary.length && summary[0];
    this.state = {
      viewClass: props.viewClass || firstEl && firstEl.routeClass || 'landing',
      viewId: props.viewId || firstEl && firstEl.viewId,
      viewParams: props.viewParams || firstEl && firstEl.routeParams || {},
      viewNavSummaryIndex: 0,
      navSummary: summary
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.production !== nextProps.production || this.props.contextualizers !== nextProps.contextualizers || this.props.edition !== nextProps.edition) {
      const {
        production,
        edition,
        locale
      } = nextProps;
      const summary = buildNav({
        production,
        edition,
        locale,
        translate: this.translate
      });
      const firstEl = summary.length && summary[0];
      const viewClass = nextProps.viewClass || firstEl && firstEl.routeClass || 'landing';
      const viewId = nextProps.viewId || firstEl && firstEl.viewId;
      const viewParams = nextProps.viewParams || firstEl && firstEl.routeParams || {};
      this.setState({
        viewClass,
        viewParams,
        viewId,
        viewNavSummaryIndex: 0,
        navSummary: summary
      });
    }
  }

  render() {
    const {
      props: {
        production,
        edition,
        previewMode,
        useBrowserRouter = false,
        preprocessedData,
        excludeCss
      },
      state: {
        viewId,
        viewClass,
        viewParams,
        navSummary,
        viewNavSummaryIndex
      },
      renderView
    } = this;
    const Router = useBrowserRouter ? _reactRouterDom.BrowserRouter : _reactRouterDom.HashRouter;

    if (previewMode || !inBrowser) {
      return _react.default.createElement(_Layout.default, {
        summary: navSummary,
        production: production,
        edition: edition,
        viewId: viewId,
        viewClass: viewClass,
        viewParams: viewParams,
        preprocessedData: preprocessedData,
        excludeCss: excludeCss
      }, renderView({
        viewId,
        viewClass,
        viewParams,
        navSummary,
        viewNavSummaryIndex
      }));
    }

    let routerSummary = navSummary;
    /**
     * If first view is not landing
     * then we double it to allow internal links
     */

    if (routerSummary.length && routerSummary[0].routeClass !== 'landing') {
      routerSummary = [routerSummary[0], ...routerSummary];
    }

    return _react.default.createElement(Router, {
      basename: window.__urlBaseName
    }, _react.default.createElement(_Layout.default, {
      summary: navSummary,
      production: production,
      edition: edition,
      viewParams: viewParams,
      excludeCss: excludeCss
    }, _react.default.createElement(_reactRouterDom.Switch, null, routerSummary.map((element, index) => {
      const url = routeItemToUrl(element, index);
      const summaryIndex = this.getSummaryIndex({
        routeClass: element.routeClass,
        routeParams: element.routeParams,
        viewId: element.viewId
      });
      return _react.default.createElement(_reactRouterDom.Route, {
        exact: true,
        path: url,
        key: index,
        component: props => {
          let additionalRouteParams = {};

          if (props.location.search) {
            additionalRouteParams = props.location.search.slice(1).split('&').map(item => item.split('=')).map(tuple => ({
              [tuple[0]]: tuple[1]
            })).reduce((result, mini) => _objectSpread({}, result, mini), {});
          }

          return renderView({
            viewClass: element.routeClass,
            viewParams: _objectSpread({}, element.routeParams, additionalRouteParams),
            navSummary,
            viewNavSummaryIndex: summaryIndex
          });
        }
      });
    }), _react.default.createElement(_reactRouterDom.Route, {
      path: '/resource',
      component: props => {
        const search = props.history.location.search || '';

        const normalizeVal = val => {
          if (!isNaN(+val)) {
            return +val;
          } else if (val === 'true') {
            return true;
          } else if (val === 'false') {
            return false;
          }

          return val;
        };

        const searchParams = search.slice(1).split('&').map(str => str.split('=')).reduce((result, tuple) => _objectSpread({}, result, {
          [tuple[0]]: normalizeVal(tuple[1])
        }), {});
        const {
          resourceId,

          /*previousResourceId, nextResourceId,*/
          notesPosition,
          displayHeader
        } = searchParams;
        return renderView({
          viewClass: 'resourcePage',
          viewParams: {
            resourceId,

            /*
             * previousResourceId,
             * nextResourceId,
             */
            notesPosition,
            displayHeader
          },
          navSummary,
          viewNavSummaryIndex
        });
      }
    }), _react.default.createElement(_reactRouterDom.Route, {
      component: () => {
        return _react.default.createElement("div", {
          className: 'main-contents-container'
        }, _react.default.createElement("div", {
          className: 'main-column'
        }, _react.default.createElement("h1", null, this.translate('Nothing to see here!')), _react.default.createElement("h2", null, this.translate('There is not content to display for this URL.'))));
      }
    }))));
  }

}

exports.default = Wrapper;

_defineProperty(Wrapper, "childContextTypes", {
  activeViewId: _propTypes.default.string,
  activeViewParams: _propTypes.default.object,
  navigateTo: _propTypes.default.func,
  LinkComponent: _propTypes.default.func,
  production: _propTypes.default.object,
  edition: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  productionAssets: _propTypes.default.object,
  routeItemToUrl: _propTypes.default.func,
  usedDocument: _propTypes.default.object,
  translate: _propTypes.default.func,
  getViewIdForSectionId: _propTypes.default.func
});

_defineProperty(Wrapper, "propTypes", {
  contextualizers: _propTypes.default.object,
  locale: _propTypes.default.object,
  onActiveViewIdChange: _propTypes.default.object,
  production: _propTypes.default.object
});