"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ellipse = (str, max = 50) => {
  if (str.length > max) return `${str.substr(0, max - 3)}...`;
  return str;
};

const SectionsList = ({
  production,
  // edition,
  options
}) => {
  const {
    customSummary,
    resourceTypes,
    notesPosition,
    hideEmptyResources = false
  } = options;
  let summary = [];

  if (customSummary && customSummary.active) {
    summary = customSummary.summary;
  } else {
    summary = Object.keys(production.resources).filter(resourceId => {
      const resource = production.resources[resourceId];
      return resourceTypes.includes(resource.metadata.type);
    }).filter(resourceId => {
      if (hideEmptyResources) {
        return (0, _peritextUtils.resourceHasContents)(production.resources[resourceId]);
      }

      return true;
    }).map(resourceId => ({
      resourceId,
      level: 0
    })).sort(_peritextUtils.defaultSortResourceSections);
  }

  return _react.default.createElement("section", {
    className: 'main-contents-container sections-list'
  }, _react.default.createElement("ul", null, summary.map(({
    resourceId
  }, index) => {
    const nextResourceId = index < summary.length - 1 ? summary[index + 1].resourceId : undefined;
    const previousResourceId = index > 1 ? summary[index - 1].resourceId : undefined;
    const thatResource = production.resources[resourceId];
    return _react.default.createElement("li", {
      className: 'resource-card',
      key: index
    }, _react.default.createElement(_LinkProvider.default, {
      to: {
        routeClass: 'resourcePage',
        routeParams: {
          resourceId,
          previousResourceId,
          nextResourceId,
          notesPosition
        }
      }
    }, _react.default.createElement("h2", null, ellipse((0, _peritextUtils.getResourceTitle)(thatResource))), thatResource.metadata.authors && _react.default.createElement("p", null, thatResource.metadata.authors.map(({
      family,
      given
    }, thatIndex) => _react.default.createElement("span", {
      key: thatIndex
    }, given, " ", family)))));
  })));
};

var _default = SectionsList;
exports.default = _default;