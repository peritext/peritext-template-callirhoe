import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { StructuredCOinS, abbrevString, getResourceTitle } from 'peritext-utils';

import { convertSectionToCslRecord } from '../utils';

import NotesContainer from './NotesContainer';
import Renderer from './Renderer';
import SectionHead from './SectionHead';
import InternalLink from './LinkProvider';
import ResourcePreview from './ResourcePreview';

class Section extends Component {

  static contextTypes = {
    scrollToTop: PropTypes.func,
    dimensions: PropTypes.object,
  }
  constructor ( props ) {
    super( props );
    this.state = {
      gui: {
        openedContextualizationId: undefined
      }
    };
  }

  getChildContext = () => {
    const {
      production = {},
      activeViewParams = {}
    } = this.props;
    return {
      notes: production.resources[activeViewParams.resourceId].data.contents.notes,
      onNoteContentPointerClick: this.onNoteContentPointerClick,
    };
  }

  componentWillUpdate = ( nextProps, nextState, nextContext ) => {

    /*
     * edge case of navigating mentions
     * within the same section
     */
    if (
      this.props.activeViewParams.resourceId === nextProps.activeViewParams.resourceId
      && this.state.gui.openedContextualizationId
      && !nextState.gui.openedContextualizationId
      && nextContext.asideVisible
    ) {
      nextContext.toggleAsideVisible();
    }
  }

  onNoteContentPointerClick = ( noteId ) => {
    this.context.scrollToElementId( noteId );
  }

  onNotePointerClick = ( noteId ) => {
    this.context.scrollToElementId( `note-content-pointer-${noteId}` );
  }

  render = () => {
    const {
      props: {
        production,
        edition = {},
        activeViewClass,
        activeViewParams = {},
      },
      context: {
        // dimensions,
        translate = {},
      },
      onNotePointerClick,
    } = this;

    if ( ![ 'sections', 'resourcePage' ].includes( activeViewClass ) ) {
      return null;
    }

    const {
      previousResourceId,
      nextResourceId,
      notesPosition = 'footnotes',
      displayHeader = false
    } = activeViewParams;

    const {
      data: editionData = {}
    } = edition;

    const {
      publicationTitle = '',
    } = editionData;

    const displayedTitle = publicationTitle.length ?
      publicationTitle
      :
      production.metadata.title;

    const section = production.resources[activeViewParams.resourceId];
    if ( !section ) {
      return;
    }
    const previousResource = previousResourceId && production.resources[previousResourceId];
    const nextResource = nextResourceId && production.resources[nextResourceId];

    const contents = ( section.data && section.data.contents ) ?
     section.data.contents.contents : {
       contents: {},
       notes: {},
       notesOrder: []
     };
    const sectionAuthors = section.metadata.authors || [];

    const sectionAsCSLRecord = convertSectionToCslRecord( section, production, edition );

    return (
      <section className={ `main-contents-container section-player has-notes-position-${notesPosition}` }>
        {
          <SectionHead
            production={ production }
            section={ section }
            edition={ edition }
            withHelmet
          />
        }
        <StructuredCOinS cslRecord={ sectionAsCSLRecord } />
        <div className={ 'main-column' }>
          <h1 className={ 'view-title section-title' }>
            {getResourceTitle( section ) || ( translate( 'untitled section' ) || 'Section sans titre' )}
          </h1>
          {
            displayHeader &&
            <ResourcePreview resource={ section } />
          }
          {section.metadata.subtitle && <h2 className={ 'subtitle' }>{section.metadata.subtitle}</h2>}
          {sectionAuthors.length > 0 &&
          <h2 className={ 'authors' }>
            {
                  sectionAuthors &&
                  sectionAuthors.length > 0 &&
                  sectionAuthors
                  .map( ( author, index ) => <span key={ index }>{author.given} {author.family}</span> )
                  .reduce( ( prev, curr ) => [ prev, ', ', curr ] )
                }
          </h2>
            }
          <div className={ 'main-contents-wrapper' }>
            {/* <ResourcePreview resource={section} /> */}
            <Renderer raw={ contents } />
          </div>

        </div>
        {Object.keys( section.data.contents.notes ).length > 0 ?
          <NotesContainer
            pointers={ this.noteContentPointers }
            notes={ section.data.contents.notes }
            notesOrder={ section.data.contents.notesOrder }
            notesPosition={ notesPosition }
            title={ translate( 'Notes' ) }
            id={ 'notes-container' }
            onNotePointerClick={ onNotePointerClick }
          />
           : null}
        <footer className={ 'navigation-footer' }>
          <ul>
            {previousResource &&
            <li className={ 'prev' }>
              <InternalLink
                to={ { routeClass: 'resourcePage', viewId: 'nope', routeParams: {
                  resourceId: previousResource.id,
                  notesPosition,
                  displayHeader,
                } } }
              >
                <span className={ 'navigation-item' }>
                  <span className={ 'navigation-item-arrow' }>←</span>
                  <span className={ 'navigation-item-text' }>
                    {abbrevString( getResourceTitle( previousResource ), 40 ) }
                  </span>
                </span>

              </InternalLink>
            </li>
                }
            <li>
              <i>{abbrevString( displayedTitle, 30 )} - {abbrevString( getResourceTitle( section ), 40 )}</i>
            </li>
            {nextResource &&
            <li className={ 'next' }>
              <InternalLink
                to={ { routeClass: 'resourcePage', viewId: 'nope', routeParams: {
                  resourceId: nextResource.id,
                  notesPosition,
                  displayHeader,
                } } }
              >
                <span className={ 'navigation-item' }>
                  <span className={ 'navigation-item-text' }>{abbrevString( getResourceTitle( nextResource ), 40 ) }</span>
                  <span className={ 'navigation-item-arrow' }>→</span>
                </span>

              </InternalLink>
            </li>
                }
          </ul>
        </footer>
      </section>
    );
  }
}

Section.childContextTypes = {
  notes: PropTypes.object,
  onNoteContentPointerClick: PropTypes.func,
};

Section.contextTypes = {
  dimensions: PropTypes.object,
  production: PropTypes.object,
  scrollTopRatio: PropTypes.number,
  scrollTopAbs: PropTypes.number,
  scrollRatio: PropTypes.number,
  scrollHeight: PropTypes.number,
  scrollToTop: PropTypes.func,
  scrollToElementId: PropTypes.func,
  contextualizers: PropTypes.object,
  translate: PropTypes.func,
  citations: PropTypes.object,
  usedDocument: PropTypes.object,
  rawCitations: PropTypes.object,

  scrollToContextualization: PropTypes.func,
  scrollToElement: PropTypes.func,
  toggleAsideVisible: PropTypes.func,
  asideVisible: PropTypes.bool,
};

export default Section;
