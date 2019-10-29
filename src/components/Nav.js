import React from 'react';
import PropTypes from 'prop-types';
import { abbrevString } from 'peritext-utils';
const Nav = ( {
  summary = [],
  toggleIndex,
  locationTitle,
  title,
  subtitle,
  description,
  authors,
}, { LinkComponent } ) => {
  const realSummary = summary.filter( ( v ) => v.routeClass !== 'landing' );
  const landingView = summary.find( ( v ) => v.routeClass === 'landing' );
  let firstLink = landingView;
  if ( !firstLink && summary.length ) {
    firstLink = summary[0];
  }
  return (
    <nav className={ 'nav' }>
      <div className={ 'nav-header' }>
        <button
          className={ 'nav-toggle' }
          onClick={ toggleIndex }
        >
          <span className={ 'nav-toggle-symbol' }>✚</span>
        </button>
        <h1 className={ 'title' }>
          {
            firstLink ?
              <LinkComponent to={ firstLink }>
                <strong className={ 'hero-title' }>
                  {abbrevString( title )}
                </strong>
              </LinkComponent>
            : title
          } {
            locationTitle &&
            <em
              onClick={ toggleIndex }
              className={ 'location-title' }
            >
              {abbrevString( locationTitle, 60 )}
            </em>
          }
        </h1>

      </div>
      <div className={ 'additional-header' }>
        {
            subtitle &&
            <h2 className={ 'subtitle' }>
              {subtitle}
            </h2>
          }
        {
            authors && authors.length ?
              <h3 className={ 'authors' }>
                {
                authors.map( ( { given, family }, index ) => <span key={ index }>{given} {family}</span> )
              }
              </h3>
            : null
          }
        {
            description &&
            <p className={ 'description' }>
              {description}
            </p>
          }
      </div>
      <div className={ 'nav-content-container' }>
        <ul>
          {
            realSummary.map( ( item, index ) => {
              return (
                <li
                  key={ index }
                  className={ `nav-item level-${item.level}` }
                >
                  <LinkComponent to={ item }>
                    {item.title}
                  </LinkComponent>
                </li>
              );

            } )
          }
        </ul>
      </div>
    </nav>
  );
};
Nav.contextTypes = {
  LinkComponent: PropTypes.func,
};

export default Nav;
