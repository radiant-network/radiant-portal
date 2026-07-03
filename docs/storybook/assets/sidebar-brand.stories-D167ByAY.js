import{j as a}from"./iframe-Clj-cmbv.js";import{R as t,S as s}from"./sqon-DFCTO9EB.js";import{S as i}from"./sidebar-BqpY8EAe.js";import{F as e}from"./applications-config-DNIbusgh.js";import{a as o}from"./story-section-DCzIVbFj.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CpjCmLUP.js";import"./action-button-B-B5BuJQ.js";import"./dropdown-menu-D1F9T0ri.js";import"./index-LQNM7kie.js";import"./index-DujBfDZp.js";import"./check-DR5_QgnI.js";import"./circle-RCbrrEpe.js";import"./separator-BkoI8fxB.js";import"./i18n-CteUV2dW.js";import"./index-BRQotc69.js";import"./api-EcWoeBNP.js";import"./index-DCRZ6HlD.js";import"./input-BLVDsk37.js";import"./sheet-Dcv2L3b1.js";import"./x-BOxx-XgJ.js";import"./skeleton-Bc6-r1_Z.js";const F={title:"Layout/Sidebar Brand",component:s,args:{},decorators:[r=>a.jsx(i,{className:"m-[-16px] w-50",children:a.jsx("div",{className:"w-50",children:a.jsx(r,{})})})]},n={args:{aggregationGroups:{variant:{items:[{key:"type",translation_key:"variant_type",type:e.MULTIPLE},{key:"cn",translation_key:"cn",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.GreaterThan}},{key:"length",translation_key:"cnv_length",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.GreaterThan}},{key:"chromosome",translation_key:"chromosome",type:e.MULTIPLE},{key:"start",translation_key:"cnv_start",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.Between}},{key:"end",translation_key:"cnv_end",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.LessThan}},{key:"nb_snv",translation_key:"nb_snv",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.GreaterThan}}]},gene:{items:[{key:"cytoband",translation_key:"cytoband",type:e.MULTIPLE},{key:"gene_divider",translation_key:"gene_divider",type:e.DIVIDER},{key:"hpo_gene_panel",translation_key:"hpo_gene_panel",type:e.MULTIPLE},{key:"orphanet_gene_panel",translation_key:"orphanet_gene_panel",type:e.MULTIPLE},{key:"omim_gene_panel",translation_key:"omim_gene_panel",type:e.MULTIPLE},{key:"ddd_gene_panel",translation_key:"ddd_gene_panel",type:e.MULTIPLE},{key:"cosmic_gene_panel",translation_key:"cosmic_gene_panel",type:e.MULTIPLE}]},frequency:{items:[{key:"frequency_divider_pulic_cohorts",translation_key:"frequency_divider_pulic_cohorts",type:e.DIVIDER},{key:"gnomad_sf",translation_key:"gnomad_sf",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.LessThan,defaultMin:0,defaultMax:100}},{key:"gnomad_sc",translation_key:"gnomad_sc",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.LessThan,defaultMin:0,defaultMax:100}}]},metric_qc:{items:[{key:"filter",translation_key:"filter",type:e.MULTIPLE},{key:"quality",translation_key:"cnv_quality",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.GreaterThan,defaultMin:0,defaultMax:100}},{key:"pe",translation_key:"pe",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.LessThan,defaultMin:0,defaultMax:100}},{key:"sm",translation_key:"sm",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:t.LessThan,defaultMin:0,defaultMax:100}}]}}},render:r=>a.jsx(o,{title:"Sidebar brand",children:a.jsx(s,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    aggregationGroups: {
      variant: {
        items: [{
          key: 'type',
          translation_key: 'variant_type',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'cn',
          translation_key: 'cn',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan
          }
        }, {
          key: 'length',
          translation_key: 'cnv_length',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan
          }
        }, {
          key: 'chromosome',
          translation_key: 'chromosome',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'start',
          translation_key: 'cnv_start',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.Between
          }
        }, {
          key: 'end',
          translation_key: 'cnv_end',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan
          }
        }, {
          key: 'nb_snv',
          translation_key: 'nb_snv',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan
          }
        }]
      },
      gene: {
        items: [{
          key: 'cytoband',
          translation_key: 'cytoband',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'gene_divider',
          translation_key: 'gene_divider',
          type: FilterTypes.DIVIDER
        }, {
          key: 'hpo_gene_panel',
          translation_key: 'hpo_gene_panel',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'orphanet_gene_panel',
          translation_key: 'orphanet_gene_panel',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'omim_gene_panel',
          translation_key: 'omim_gene_panel',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'ddd_gene_panel',
          translation_key: 'ddd_gene_panel',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'cosmic_gene_panel',
          translation_key: 'cosmic_gene_panel',
          type: FilterTypes.MULTIPLE
        }]
      },
      frequency: {
        items: [{
          key: 'frequency_divider_pulic_cohorts',
          translation_key: 'frequency_divider_pulic_cohorts',
          type: FilterTypes.DIVIDER
        }, {
          key: 'gnomad_sf',
          translation_key: 'gnomad_sf',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'gnomad_sc',
          translation_key: 'gnomad_sc',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }]
      },
      metric_qc: {
        items: [{
          key: 'filter',
          translation_key: 'filter',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'quality',
          translation_key: 'cnv_quality',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'pe',
          translation_key: 'pe',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'sm',
          translation_key: 'sm',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }]
      }
    }
  },
  render: args => <StorySection title="Sidebar brand">
      <SidebarGroups {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};const N=["Default"];export{n as Default,N as __namedExportsOrder,F as default};
