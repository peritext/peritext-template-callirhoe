module.exports = {
  id: 'callirhoe',
  type: 'peritext-template',
  name: 'Deucalion template',
  renderingTypes: [ 'screened' ],
  generatorsTypes: [ 'multi-page-html', 'single-page-html' ],
  summaryType: 'linear',
  options: {
    referencesScope: {
      type: 'string',
      enum: [ 'sections', 'edition' ],
      default: 'edition'
    },
    allowAnnotation: {
      type: 'boolean',
      default: false
    }
  },
  defaultBibType: 'misc',
  defaultAdditionalHTML: '<link href="<link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet">" rel="stylesheet">',
  defaultPlan: {
      type: 'linear',
      summary: [
          {
              type: 'resourceSections',
              data: {
                customSummary: {
                  active: false,
                  summary: []
                },
                resourceTypes: [ 'section' ],
                notesPosition: 'sidenotes'
              },
          },

      ]
  },
  summaryBlockDataTypes: {
    resourceSections: {
      type: 'object',
      default: {
        resourceTypes: [ 'glossary' ],
        customSummary: {
          active: false,
          summary: []
        },
        notesPosition: 'footnotes'
      },
      properties: {
        customTitle: {
          type: 'string'
        },
        resourceTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: [ 'section', 'bib', 'image', 'table', 'video', 'embed', 'webpage', 'glossary' ]
          },
          uiType: 'select',
          description: 'which types of resources to show'
        },
        customSummary: {
          type: 'object',
          uiType: 'customResourcesSummary',
          properties: {
            active: {
              type: 'boolean'
            },
            summary: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  resourceId: {
                    type: 'string',
                  },
                  level: {
                    type: 'number'
                  }
                }
              }
            }
          }
        },
        notesPosition: {
          type: 'string',
          enum: [ 'footnotes', 'sideNotes' ]
        },
      }
    },
  },
};
