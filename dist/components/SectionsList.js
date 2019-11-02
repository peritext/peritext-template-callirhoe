"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _peritextUtils = require("peritext-utils");

var _utils = require("../utils");

var _ResourcePreview = _interopRequireDefault(require("./ResourcePreview"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SectionsList = ({
  production,
  options
}) => {
  const {
    notesPosition,
    displayThumbnail = false,
    displayHeader = false
  } = options;
  const summary = (0, _peritextUtils.buildResourceSectionsSummary)({
    production,
    options
  });
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
          notesPosition,
          displayHeader
        }
      }
    }, displayThumbnail && _react.default.createElement(_ResourcePreview.default, {
      resource: thatResource
    }), _react.default.createElement("h2", {
      className: 'resource-card-title'
    }, (0, _utils.ellipse)((0, _peritextUtils.getResourceTitle)(thatResource), 100)), thatResource.metadata.authors && _react.default.createElement("p", null, thatResource.metadata.authors.map(({
      family,
      given
    }, thatIndex) => _react.default.createElement("span", {
      key: thatIndex
    }, given, " ", family)))));
  })));
};

var _default = SectionsList;
exports.default = _default;