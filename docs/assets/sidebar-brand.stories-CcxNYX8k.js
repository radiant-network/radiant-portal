import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{S as p}from"./sidebar-La93nGjM.js";import{S as o}from"./sidebar-groups-CesCsFXJ.js";import{R as e}from"./sqon-DNOccLjA.js";import"./index-CGj_12n1.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CGrAONsN.js";import"./utils-D-KgF5mV.js";import"./button-BtD5i2Af.js";import"./action-button-DglMD9AQ.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-BBcDSVvC.js";import"./iframe-DBX4PrWm.js";import"./i18next-DOi7g2fS.js";import"./input-Dm5winle.js";import"./index-CosFuvvC.js";import"./x-CubKniSv.js";import"./skeleton-Shk8p_SP.js";import"./panel-left-open-CxMRizKu.js";import"./api-Dm3M0Tve.js";const U={title:"Sidebar/Sidebar Brand",component:o,args:{},decorators:[a=>t.jsx(p,{className:"m-[-16px] w-50",children:t.jsx("div",{className:"w-50",children:t.jsx(a,{})})})]},n={args:{aggregationGroups:{variant:{items:[{key:"type",translation_key:"variant_type",type:"multiple"},{key:"cn",translation_key:"cn",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}},{key:"length",translation_key:"cnv_length",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}},{key:"chromosome",translation_key:"chromosome",type:"multiple"},{key:"start",translation_key:"cnv_start",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.Between}},{key:"end",translation_key:"cnv_end",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan}},{key:"nb_snv",translation_key:"nb_snv",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}}]},gene:{items:[{key:"cytoband",translation_key:"cytoband",type:"multiple"},{key:"gene_divider",translation_key:"gene_divider",type:"divider"},{key:"hpo_gene_panel",translation_key:"hpo_gene_panel",type:"multiple"},{key:"orphanet_gene_panel",translation_key:"orphanet_gene_panel",type:"multiple"},{key:"omim_gene_panel",translation_key:"omim_gene_panel",type:"multiple"},{key:"ddd_gene_panel",translation_key:"ddd_gene_panel",type:"multiple"},{key:"cosmic_gene_panel",translation_key:"cosmic_gene_panel",type:"multiple"}]},frequency:{items:[{key:"frequency_divider_pulic_cohorts",translation_key:"frequency_divider_pulic_cohorts",type:"divider"},{key:"gnomad_sf",translation_key:"gnomad_sf",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}},{key:"gnomad_sc",translation_key:"gnomad_sc",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}}]},metric_qc:{items:[{key:"filter",translation_key:"filter",type:"multiple"},{key:"quality",translation_key:"cnv_quality",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan,defaultMin:0,defaultMax:100}},{key:"pe",translation_key:"pe",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}},{key:"sm",translation_key:"sm",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}}]}}},render:a=>t.jsx(o,{...a})};var r,i,l;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    aggregationGroups: {
      variant: {
        items: [{
          key: 'type',
          translation_key: 'variant_type',
          type: 'multiple'
        }, {
          key: 'cn',
          translation_key: 'cn',
          type: 'numerical',
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan
          }
        }, {
          key: 'length',
          translation_key: 'cnv_length',
          type: 'numerical',
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.GreaterThan
          }
        }, {
          key: 'chromosome',
          translation_key: 'chromosome',
          type: 'multiple'
        }, {
          key: 'start',
          translation_key: 'cnv_start',
          type: 'numerical',
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.Between
          }
        }, {
          key: 'end',
          translation_key: 'cnv_end',
          type: 'numerical',
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan
          }
        }, {
          key: 'nb_snv',
          translation_key: 'nb_snv',
          type: 'numerical',
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
          type: 'multiple'
        }, {
          key: 'gene_divider',
          translation_key: 'gene_divider',
          type: 'divider'
        }, {
          key: 'hpo_gene_panel',
          translation_key: 'hpo_gene_panel',
          type: 'multiple'
        }, {
          key: 'orphanet_gene_panel',
          translation_key: 'orphanet_gene_panel',
          type: 'multiple'
        }, {
          key: 'omim_gene_panel',
          translation_key: 'omim_gene_panel',
          type: 'multiple'
        }, {
          key: 'ddd_gene_panel',
          translation_key: 'ddd_gene_panel',
          type: 'multiple'
        }, {
          key: 'cosmic_gene_panel',
          translation_key: 'cosmic_gene_panel',
          type: 'multiple'
        }]
      },
      frequency: {
        items: [{
          key: 'frequency_divider_pulic_cohorts',
          translation_key: 'frequency_divider_pulic_cohorts',
          type: 'divider'
        }, {
          key: 'gnomad_sf',
          translation_key: 'gnomad_sf',
          type: 'numerical',
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
          type: 'numerical',
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
          type: 'multiple'
        }, {
          key: 'quality',
          translation_key: 'cnv_quality',
          type: 'numerical',
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
          type: 'numerical',
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
          type: 'numerical',
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
}`,...(l=(i=n.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const V=["Default"];export{n as Default,V as __namedExportsOrder,U as default};
