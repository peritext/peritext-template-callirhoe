import React from 'react';
import PropTypes from 'prop-types';

const PreviewLink = ( {
  to = {},
  children,
  onButtonClick,
  onClick,
}, {
  navigateTo,
  activeViewId,
} ) => {
  const active = to.viewId === activeViewId;

  return (
    <span
      onClick={ ( ) => {
        if ( typeof onButtonClick === 'function' ) {
          onButtonClick();
        }
        if ( typeof onClick === 'function' ) {
          onClick();
        }
        navigateTo( to );
      } }
      className={ `link ${active ? 'active' : ''}` }
    >
      {children}
    </span>
  );
};

PreviewLink.contextTypes = {
  navigateTo: PropTypes.func,
  activeViewId: PropTypes.string,
};

export default PreviewLink;
