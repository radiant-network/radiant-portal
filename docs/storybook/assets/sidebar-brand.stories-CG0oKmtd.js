import{j as a}from"./iframe-D1HxDOtg.js";import{S as l}from"./sidebar-groups-CAM4Zrn8.js";import{n as p}from"./sidebar-Bgb6iTX4.js";import{F as e}from"./applications-config-BHeY-GuV.js";import{R as n}from"./sqon-D4edgf80.js";import"./preload-helper-Dp1pzeXC.js";import"./button-Dv4Luc3V.js";import"./index-3ABOodQS.js";import"./action-button-CFsRxLLs.js";import"./dropdown-menu-q8iecXKm.js";import"./index-B0uVmmYF.js";import"./circle-DZ4SjU33.js";import"./check-BnNqbnp6.js";import"./separator-0KX02B4l.js";import"./i18n-DkKv1E8x.js";import"./index-7q4muiSl.js";import"./input-BCnC1Di6.js";import"./sheet-BBWQkUSb.js";import"./x-kiNtMAqJ.js";import"./skeleton-JWuQfupA.js";import"./api-Bs_y-PxM.js";const N={title:"Sidebar/Sidebar Brand",component:l,args:{},decorators:[r=>a.jsx(p,{className:"m-[-16px] w-50",children:a.jsx("div",{className:"w-50",children:a.jsx(r,{})})})]},t={args:{aggregationGroups:{variant:{items:[{key:"type",translation_key:"variant_type",type:e.MULTIPLE},{key:"cn",translation_key:"cn",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.GreaterThan}},{key:"length",translation_key:"cnv_length",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.GreaterThan}},{key:"chromosome",translation_key:"chromosome",type:e.MULTIPLE},{key:"start",translation_key:"cnv_start",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.Between}},{key:"end",translation_key:"cnv_end",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.LessThan}},{key:"nb_snv",translation_key:"nb_snv",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.GreaterThan}}]},gene:{items:[{key:"cytoband",translation_key:"cytoband",type:e.MULTIPLE},{key:"gene_divider",translation_key:"gene_divider",type:e.DIVIDER},{key:"hpo_gene_panel",translation_key:"hpo_gene_panel",type:e.MULTIPLE},{key:"orphanet_gene_panel",translation_key:"orphanet_gene_panel",type:e.MULTIPLE},{key:"omim_gene_panel",translation_key:"omim_gene_panel",type:e.MULTIPLE},{key:"ddd_gene_panel",translation_key:"ddd_gene_panel",type:e.MULTIPLE},{key:"cosmic_gene_panel",translation_key:"cosmic_gene_panel",type:e.MULTIPLE}]},frequency:{items:[{key:"frequency_divider_pulic_cohorts",translation_key:"frequency_divider_pulic_cohorts",type:e.DIVIDER},{key:"gnomad_sf",translation_key:"gnomad_sf",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.LessThan,defaultMin:0,defaultMax:100}},{key:"gnomad_sc",translation_key:"gnomad_sc",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.LessThan,defaultMin:0,defaultMax:100}}]},metric_qc:{items:[{key:"filter",translation_key:"filter",type:e.MULTIPLE},{key:"quality",translation_key:"cnv_quality",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.GreaterThan,defaultMin:0,defaultMax:100}},{key:"pe",translation_key:"pe",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.LessThan,defaultMin:0,defaultMax:100}},{key:"sm",translation_key:"sm",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:n.LessThan,defaultMin:0,defaultMax:100}}]}}},render:r=>a.jsx(l,{...r})};var s,i,o;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
  render: args => <SidebarGroups {...args} />
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};const A=["Default"];export{t as Default,A as __namedExportsOrder,N as default};
