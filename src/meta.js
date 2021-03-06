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
  defaultAdditionalHTML: '<link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet">',
  defaultPlan: {
      type: 'linear',
      summary: [
          {
              type: 'resourceSections',
              id: 'first',
              data: {
                customSummary: {
                  active: false,
                  summary: []
                },
                resourceTypes: [ 'section' ],
                notesPosition: 'footnotes'
              },
          },

      ]
  },
  summaryBlockDataTypes: {
    resourceSections: {
      type: 'object',
      default: {
        resourceTypes: [ 'glossary' ],
        tags: [],
        customSummary: {
          active: false,
          summary: [],
        },
        notesPosition: 'footnotes',
        displayHeader: true,
        displayThumbnail: false
      },
      properties: {
        customTitle: {
          type: 'string'
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          uiType: 'select',
          description: 'which tags to include for displaying the contents',
          enumTargetMap: 'tags',
          enumId: 'id',
          enumLabel: 'name'
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
        hideEmptyResources: {
          type: 'boolean',
          description: 'whether to hide resources with no contents'
        },
        displayHeader: {
          type: 'boolean',
          description: 'whether to display resources headers in their views'
        },
        displayThumbnail: {
          type: 'boolean',
          description: 'whether to display resources previews in lists'
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
