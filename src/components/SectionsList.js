import React from 'react';
import {
  buildResourceSectionsSummary
} from 'peritext-utils';

import ResourceCard from './ResourceCard';

const SectionsList = ( {
  production,
  parentBlockId,
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
              <ResourceCard
                key={ index }
                { ...{
                  resource: thatResource,
                  previousResourceId,
                  nextResourceId,
                  displayHeader,
                  parentBlockId,
                  notesPosition,
                  displayThumbnail,
                } }
              />
            );
          } )
        }
      </ul>
    </section>
  );
};

export default SectionsList;
