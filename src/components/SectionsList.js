import React from 'react';
import Link from './LinkProvider';
import {
  getResourceTitle,
  buildResourceSectionsSummary
} from 'peritext-utils';

import {
  ellipse,
} from '../utils';

import ResourcePreview from './ResourcePreview';

const SectionsList = ( {
  production,
  options,
} ) => {
  const { notesPosition, displayThumbnail = false, displayHeader = false } = options;
  const summary = buildResourceSectionsSummary( { production, options } );
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
                    displayHeader,
                  }
                } }
                >
                  {
                    displayThumbnail &&
                    <ResourcePreview resource={ thatResource } />
                  }
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
