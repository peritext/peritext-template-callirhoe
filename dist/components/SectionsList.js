"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _peritextUtils = require("peritext-utils");

var _ResourceCard = _interopRequireDefault(require("./ResourceCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SectionsList = ({
  production,
  parentBlockId,
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
    return _react.default.createElement(_ResourceCard.default, _extends({
      key: index
    }, {
      resource: thatResource,
      previousResourceId,
      nextResourceId,
      displayHeader,
      parentBlockId,
      notesPosition,
      displayThumbnail
    }));
  })));
};

var _default = SectionsList;
exports.default = _default;