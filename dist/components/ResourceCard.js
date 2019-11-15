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

const ResourceCard = ({
  resource,
  previousResourceId,
  nextResourceId,
  displayHeader,
  parentBlockId,
  notesPosition,
  displayThumbnail
}) => {
  const {
    id: resourceId
  } = resource;
  return _react.default.createElement("li", {
    className: 'resource-card'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeClass: 'resourcePage',
      routeParams: {
        resourceId,
        previousResourceId,
        nextResourceId,
        notesPosition,
        displayHeader,
        parentBlockId
      }
    }
  }, displayThumbnail && _react.default.createElement(_ResourcePreview.default, {
    resource: resource
  }), _react.default.createElement("h2", {
    className: 'resource-card-title'
  }, (0, _utils.ellipse)((0, _peritextUtils.getResourceTitle)(resource), 100)), resource.metadata.authors && _react.default.createElement("p", null, resource.metadata.authors.map(({
    family,
    given
  }, thatIndex) => _react.default.createElement("span", {
    key: thatIndex
  }, given, " ", family)).reduce((cur, el) => [...cur, ', ', el], []))));
};

var _default = ResourceCard;
exports.default = _default;