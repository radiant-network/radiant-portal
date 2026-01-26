import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{S as o}from"./sidebar-groups-PCSopD0o.js";import{S as p}from"./sidebar-MQrXJIWR.js";import{R as e}from"./sqon-DDFmFWEM.js";import"./index-CBYaBgW8.js";import"./index-C66Dxnp2.js";import"./button-CIrXJRcZ.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-qyRaDA85.js";import"./iframe-CUgsy8kS.js";import"./i18next-CYn7LYXT.js";import"./panel-left-open-BsQqi0Jz.js";import"./index-C2vczdB5.js";import"./input-Bj-MPxry.js";import"./index-Cq0TEE3l.js";import"./x-4HkHZ1eq.js";import"./skeleton-_T1otFf0.js";import"./api-DPRnJls5.js";const X={title:"Sidebar/Sidebar Brand",component:o,args:{},decorators:[a=>t.jsx(p,{className:"m-[-16px] w-50",children:t.jsx("div",{className:"w-50",children:t.jsx(a,{})})})]},n={args:{aggregationGroups:{variant:{items:[{key:"type",translation_key:"variant_type",type:"multiple"},{key:"cn",translation_key:"cn",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}},{key:"length",translation_key:"cnv_length",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}},{key:"chromosome",translation_key:"chromosome",type:"multiple"},{key:"start",translation_key:"cnv_start",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.Between}},{key:"end",translation_key:"cnv_end",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan}},{key:"nb_snv",translation_key:"nb_snv",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan}}]},gene:{items:[{key:"cytoband",translation_key:"cytoband",type:"multiple"},{key:"gene_divider",translation_key:"gene_divider",type:"divider"},{key:"hpo_gene_panel",translation_key:"hpo_gene_panel",type:"multiple"},{key:"orphanet_gene_panel",translation_key:"orphanet_gene_panel",type:"multiple"},{key:"omim_gene_panel",translation_key:"omim_gene_panel",type:"multiple"},{key:"ddd_gene_panel",translation_key:"ddd_gene_panel",type:"multiple"},{key:"cosmic_gene_panel",translation_key:"cosmic_gene_panel",type:"multiple"}]},frequency:{items:[{key:"frequency_divider_pulic_cohorts",translation_key:"frequency_divider_pulic_cohorts",type:"divider"},{key:"gnomad_sf",translation_key:"gnomad_sf",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}},{key:"gnomad_sc",translation_key:"gnomad_sc",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}}]},metric_qc:{items:[{key:"filter",translation_key:"filter",type:"multiple"},{key:"quality",translation_key:"cnv_quality",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.GreaterThan,defaultMin:0,defaultMax:100}},{key:"pe",translation_key:"pe",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}},{key:"sm",translation_key:"sm",type:"numerical",defaults:{min:0,max:100,defaultOperator:e.LessThan,defaultMin:0,defaultMax:100}}]}}},render:a=>t.jsx(o,{...a})};var r,i,l;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(l=(i=n.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const Y=["Default"];export{n as Default,Y as __namedExportsOrder,X as default};
