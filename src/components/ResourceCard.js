import React from 'react';
import Link from './LinkProvider';

import {
  getResourceTitle,
} from 'peritext-utils';

import {
  ellipse,
} from '../utils';

import ResourcePreview from './ResourcePreview';

const ResourceCard = ( {
  resource,
  previousResourceId,
  nextResourceId,
  displayHeader,
  parentBlockId,
  notesPosition,
  displayThumbnail,
} ) => {
  const { id: resourceId } = resource;
  return (
    <li
      className={ 'resource-card' }
    >
      <Link to={ {
      routeClass: 'resourcePage',
      routeParams: {
        resourceId,
        previousResourceId,
        nextResourceId,
        notesPosition,
        displayHeader,
        parentBlockId,
      }
    } }
      >
        {
        displayThumbnail &&
        <ResourcePreview resource={ resource } />
      }
        <h2 className={ 'resource-card-title' }>{ellipse( getResourceTitle( resource ), 100 )}</h2>
        {
        resource.metadata.authors &&
        <p>
          {
            resource.metadata.authors.map(
              ( { family, given }, thatIndex ) =>
                ( <span key={ thatIndex }>{given} {family}</span> )
            )
            .reduce( ( cur, el ) => [ ...cur, ', ', el ], [] )

          }
        </p>
      }
      </Link>
    </li>
  );
};

export default ResourceCard;
