import React from 'react';
import Link from './LinkProvider';
import {
  defaultSortResourceSections,
  getResourceTitle,
} from 'peritext-utils';

const ellipse = ( str, max = 50 ) => {
  if ( str.length > max )
    return `${str.substr( 0, max - 3 ) }...`;
  return str;
};

const SectionsList = ( {
  production,
  // edition,
  options,
} ) => {
  const { customSummary, resourceTypes, notesPosition } = options;

  let summary = [];
  if ( customSummary && customSummary.active ) {
    summary = customSummary.summary;
  }
 else {
    summary = Object.keys( production.resources )
    .filter( ( resourceId ) => {
      const resource = production.resources[resourceId];
      return resourceTypes.includes( resource.metadata.type );
    } )
    .map( ( resourceId ) => ( {
      resourceId,
      level: 0
    } ) )
    .sort( defaultSortResourceSections );
  }
  return (
    <section className={ 'main-contents-container sections-list' }>
      <ul>
        {
          summary.map( ( { resourceId }, index ) => {
            const nextResourceId = index < summary.length - 1 ? summary[index + 1].resourceId : undefined;
            const previousResourceId = index > 1 ? summary[index - 1].resourceId : undefined;
            const thatResource = production.resources[resourceId];
            return (
              <li
                className={ 'resource-card' }
                key={ index }
              >
                <Link to={ {
                  routeClass: 'resourcePage',
                  routeParams: {
                    resourceId,
                    previousResourceId,
                    nextResourceId,
                    notesPosition,
                  }
                } }
                >
                  <h2>{ellipse( getResourceTitle( thatResource ) )}</h2>
                  {
                    thatResource.metadata.authors &&
                    <p>
                      {
                        thatResource.metadata.authors.map( ( { family, given }, thatIndex ) =>
                          <span key={ thatIndex }>{given} {family}</span> )
                      }
                    </p>
                  }
                </Link>
              </li>
            );
          } )
        }
      </ul>
    </section>
  );
};

export default SectionsList;
