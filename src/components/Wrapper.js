import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );/* eslint no-new-func : 0 */
const inBrowser = isBrowser();

import Section from './Section';
import SectionsList from './SectionsList';
import SectionHead from './SectionHead';
import ProductionHead from './ProductionHead';
import Layout from './Layout';
import PreviewLink from './PreviewLink';
import RouterLink from './RouterLink';

export const getAdditionalRoutes = () => {
  return [ ];
};

export const buildNav = ( { /*production,*/ edition = {}, locale = {}, translate } ) => {
    const { data = {} } = edition;
    const { plan = {} } = data;
    const { summary = [] } = plan;
    return summary.reduce( ( result, element ) => {
      switch ( element.type ) {
          case 'resourceSections':
            return [
                ...result,
                {
                  routeClass: 'sectionsList',
                  level: 0,
                  title: element.data.customTitle || translate( 'Selection' ),
                  options: element.data,
                  viewId: element.id
                }
              ];
        default:
          const { data: elementData = {} } = element;
          return [
            ...result,
            {
              routeClass: element.type,
              level: 0,
              title: elementData.customTitle || locale[element.type] || element.type,
              options: element.data,
              viewId: element.id,
              routeParams: {}
            }
          ];
      }

    }, [] );
  };
export const routeItemToUrl = ( item, index ) => {

  /*
   * if nav index specified
   * and nav index is 0 then this is the landing page
   */
  if ( index !== undefined && index === 0 ) {
    return '/';
  }
  switch ( item.routeClass ) {
    case 'landing':
      return '/';
    case 'sectionsList':
      return `/list/${item.routeParams.elementId}`;
    case 'resourcePage':
      const additional = [ /*'previousResourceId', 'nextResourceId',*/ 'notesPosition', 'displayHeader', 'viewId' ]
      .reduce( ( res, key ) => `${res}${item.routeParams[key] ? `&${key}=${item.routeParams[key]}` : ''}`, '' );
      return `/resource?resourceId=${item.routeParams.resourceId}&mode=screen${additional}`;
    default:
      return `/${item.routeClass}/${item.viewId}`;
  }
};

export const renderHeadFromRouteItem = ( { item, production, edition } ) => {
    switch ( item.routeClass ) {
      case 'resourcePage':
        return (
          <SectionHead
            production={ production }
            edition={ edition }
            section={ production.resources[item.routeParams.resourceId] }
          />
        );
      default:
        return (
          <ProductionHead
            production={ production }
            edition={ edition }
            pageName={ `${production.metadata.title} - ${item.title}` }
          />
        );
    }
  };

export default class Wrapper extends Component {
  static childContextTypes = {
    activeViewId: PropTypes.string,
    activeViewParams: PropTypes.object,
    navigateTo: PropTypes.func,
    LinkComponent: PropTypes.func,
    production: PropTypes.object,
    edition: PropTypes.object,
    contextualizers: PropTypes.object,
    productionAssets: PropTypes.object,
    routeItemToUrl: PropTypes.func,
    usedDocument: PropTypes.object,
    translate: PropTypes.func,
    getViewIdForSectionId: PropTypes.func,
  }

  static propTypes = {
    contextualizers: PropTypes.object,
    locale: PropTypes.object,
    onActiveViewIdChange: PropTypes.object,
    production: PropTypes.object
  }

  constructor( props ) {
    super( props );
    const { production, edition, locale } = props;
    const summary = buildNav( { production, edition, locale, translate: this.translate } );
    const firstEl = summary.length && summary[0];
    this.state = {
      viewClass: props.viewClass || ( firstEl && firstEl.routeClass ) || 'landing',
      viewId: props.viewId || ( firstEl && firstEl.viewId ),
      viewParams: props.viewParams || ( firstEl && firstEl.routeParams ) || {},
      viewNavSummaryIndex: 0,
      navSummary: summary,
    };
  }

  getChildContext = () => ( {
    LinkComponent: this.props.previewMode ? PreviewLink : RouterLink,
    activeViewId: this.state.viewId,
    activeViewParams: this.state.viewParams,
    contextualizers: this.props.contextualizers,
    edition: this.props.edition,
    translate: this.translate,
    navigateTo: this.navigateTo,
    routeItemToUrl,
    production: this.props.production,
    productionAssets: this.props.production.assets,
    usedDocument: this.props.usedDocument,
    getViewIdForSectionId: this.getViewIdForSectionId,
  } )

  componentWillReceiveProps( nextProps ) {
    if (
      this.props.production !== nextProps.production
      || this.props.contextualizers !== nextProps.contextualizers
      || this.props.edition !== nextProps.edition
    ) {
      const { production, edition, locale } = nextProps;
      const summary = buildNav( { production, edition, locale, translate: this.translate } );
      const firstEl = summary.length && summary[0];
      const viewClass = nextProps.viewClass || ( firstEl && firstEl.routeClass ) || 'landing';
      const viewId = nextProps.viewId || ( firstEl && firstEl.viewId );
      const viewParams = nextProps.viewParams || ( firstEl && firstEl.routeParams ) || {};
      this.setState( {
        viewClass,
        viewParams,
        viewId,
        viewNavSummaryIndex: 0,
        navSummary: summary

      } );
    }
  }

  translate = ( key ) => {
    const { locale = {} } = this.props;
    return locale[key] || key;
  }

  identifyView = ( viewType, params1, params2 ) => {
    switch ( viewType ) {
      case 'sections':
        return params1.resourceId === params2.resourceId;
      default:
        return true;
    }
  }

  getSummaryIndex = ( { viewId, routeClass, routeParams } ) => {
    let index;
    this.state.navSummary.find( ( item, thatIndex ) => {
      if ( item.viewId === viewId/* ||  item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
        */ ) {
        index = thatIndex;
        return true;
      }
    } );
    if ( !index ) {
      this.state.navSummary.find( ( item, thatIndex ) => {
        if ( item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
           ) {
          index = thatIndex;
          return true;
        }
      } );

    }
    return index;
  }

  navigateTo = ( { routeClass, routeParams, viewNavSummaryIndex, viewId } ) => {
    let index = viewNavSummaryIndex;
    let finalViewId = viewId;
    if ( !index ) {
      index = this.getSummaryIndex( { routeClass, routeParams, viewId } );
      if ( !finalViewId && index ) {
        finalViewId = this.state.navSummary[index].viewId;
      }
    }
    if ( !index ) {
      this.state.navSummary.some( ( item, thatIndex ) => {
        if ( item.routeClass === routeClass ) {
          index = thatIndex;
          finalViewId = item.viewId;
          return true;
        }
      } );
    }
    this.setState( {
      viewClass: routeClass,
      viewParams: routeParams,
      viewNavSummaryIndex: index,
      viewId: finalViewId
    } );
    if ( typeof this.props.onActiveViewChange === 'function' ) {
      this.props.onActiveViewChange( { viewClass: routeClass, viewId: finalViewId, viewParams: routeParams } );
    }
  }

  getViewIdForSectionId = ( sectionId ) => {

    /*
     * gets the first section nav item that matches a specific section
     * (explanations: there can be several times the same section)
     */
    const { navSummary } = this.state;
    const firstMatch = navSummary.find( ( item ) => item.routeClass === 'sections' && item.routeParams.resourceId === sectionId );
    if ( firstMatch ) {
      return firstMatch.viewId;
    }
  }

  renderView = ( { viewClass, viewParams, navSummary, viewNavSummaryIndex } ) => {
    switch ( viewClass ) {
      case 'resourcePage':
        return (
          <Section
            production={ this.props.production }
            edition={ this.props.edition }
            activeViewClass={ viewClass }
            activeViewParams={ viewParams }
          />
          );
        case 'sectionsList':
            return (
              <SectionsList
                production={ this.props.production }
                edition={ this.props.edition }
                activeViewClass={ viewClass }
                activeViewParams={ viewParams }
                parentBlockId={ navSummary[viewNavSummaryIndex].viewId }
                options={ navSummary[viewNavSummaryIndex].options }
              />
              );
      default:
        return (
          <div>
            <p>view id: {viewClass}</p>
            <pre>
            route params: {JSON.stringify( viewParams, null, 2 )}
            </pre>
          </div>
          );
    }
  }

  render() {
    const {

       props: {
         production,
         edition,
         previewMode,
         useBrowserRouter = false,
         preprocessedData,
         excludeCss,
       },
       state: {
        viewId,
        viewClass,
        viewParams,
        navSummary,
        viewNavSummaryIndex
       },
       renderView,
    } = this;

    const Router = useBrowserRouter ? BrowserRouter : HashRouter;

    if ( previewMode || !inBrowser ) {
      return (
        <Layout
          summary={ navSummary }
          production={ production }
          edition={ edition }
          viewId={ viewId }
          viewClass={ viewClass }
          viewParams={ viewParams }
          preprocessedData={ preprocessedData }
          excludeCss={ excludeCss }
        >
          {renderView( { viewId, viewClass, viewParams, navSummary, viewNavSummaryIndex } )}
        </Layout>
      );
    }

    let routerSummary = navSummary;

    /**
     * If first view is not landing
     * then we double it to allow internal links
     */
    if ( routerSummary.length && routerSummary[0].routeClass !== 'landing' ) {
      routerSummary = [ routerSummary[0], ...routerSummary ];
    }

    return (
      <Router basename={ window.__urlBaseName }>
        <Layout
          summary={ navSummary }
          production={ production }
          edition={ edition }
          viewParams={ viewParams }
          excludeCss={ excludeCss }
        >
          <Switch>
            {
            routerSummary.map( ( element, index ) => {
              const url = routeItemToUrl( element, index );

              const summaryIndex = this.getSummaryIndex( { routeClass: element.routeClass, routeParams: element.routeParams, viewId: element.viewId } );
              return (
                <Route
                  exact
                  path={ url }
                  key={ index }
                  component={ ( props ) => {
                    let additionalRouteParams = {};
                    if ( props.location.search ) {
                      additionalRouteParams = props.location.search.slice( 1 )
                        .split( '&' )
                        .map( ( item ) => item.split( '=' ) )
                        .map( ( tuple ) => ( {
                          [tuple[0]]: tuple[1]
                        } ) )
                        .reduce( ( result, mini ) => ( {
                          ...result,
                          ...mini
                        } ), {} );
                    }
                    return renderView( {
                          viewClass: element.routeClass,
                          viewParams: {
                            ...element.routeParams,
                            ...additionalRouteParams,
                          },
                          navSummary,
                          viewNavSummaryIndex: summaryIndex
                        } );
                  } }
                />
              );
            } )
          }
            {/* render specific route */}
            <Route
              path={ '/resource' }
              component={ ( props ) => {
                  const search = props.history.location.search || '';
                  const normalizeVal = ( val ) => {
                    if ( !isNaN( +val ) ) {
                      return +val;
                    }
                     else if ( val === 'true' ) {
                      return true;
                    }
                    else if ( val === 'false' ) {
                      return false;
                    }
                    return val;
                  };
                  const searchParams = search.slice( 1 ).split( '&' ).map( ( str ) => str.split( '=' ) ).reduce( ( result, tuple ) => ( {
                    ...result,
                    [tuple[0]]: normalizeVal( tuple[1] ),
                  } ), {} );
                  const { resourceId, /*previousResourceId, nextResourceId,*/ notesPosition, displayHeader } = searchParams;
                  return renderView( {
                    viewClass: 'resourcePage',
                    viewParams: {
                      resourceId,

                      /*
                       * previousResourceId,
                       * nextResourceId,
                       */
                      notesPosition,
                      displayHeader,
                    }, navSummary, viewNavSummaryIndex } );
                }
              }
            />
            {/* 404 */}
            <Route
              component={ () => {
              return (
                <div className={ 'main-contents-container' }>
                  <div className={ 'main-column' }>
                    <h1>{this.translate( 'Nothing to see here!' )}</h1>
                    <h2>{this.translate( 'There is not content to display for this URL.' )}</h2>
                  </div>
                </div>

              );
            } }
            />
          </Switch>
        </Layout>
      </Router>
    );

  }
}
