import{r as M,j as n,b as x,d as b,e as E,f as U}from"./iframe-w_-n8Mse.js";import{B as R,U as v,O,F as C,P as N,G as F,V as P,D as j}from"./variant-icon-BIwdd_jT.js";import{B as q}from"./button-BwQvD6u9.js";import{a as A,S,c as G,d as D,e as w,f as B,g as V,m as z}from"./sidebar-BL0YGtJ3.js";import{u as $}from"./i18n-BQVoti6G.js";import{P as H,a as J}from"./panel-left-open-D-0v4bMr.js";import{F as e}from"./applications-config-Beijd3sM.js";import{R as a}from"./sqon-DZh0uHPs.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CgRbIQdG.js";import"./action-button-lST57tav.js";import"./dropdown-menu-9y_mbS5r.js";import"./index-O5sh9deS.js";import"./circle-BFupXhCr.js";import"./check-C9r4UgAI.js";import"./separator-_t-sRdkq.js";import"./index-CUrcjQX7.js";import"./input-CoVJ8Wft.js";import"./sheet-DTPFxUvW.js";import"./x-hyDMfLN2.js";import"./skeleton-CKmewt_d.js";import"./api-By65wdtu.js";const K={organization:j,variant:P,gene:F,pathogenicity:N,frequency:C,occurrence:O,parental_analysis:v,metric_qc:R},c=U({base:"text-secondary dark:text-foreground",variants:{selected:{true:"bg-sidebar-brand-accent text-sidebar-brand-accent-foreground"}},defaultVariants:{selected:!1}});function l({onItemSelect:r,aggregationGroups:g,selectedItemId:p}){const{t:o}=$(),{open:d,toggleSidebar:k}=A(),[L,I]=M.useState(null),y=p!==void 0?p:L,T=t=>{const s=y===t?null:t;I(s),r&&r(s)};return n.jsx(S,{variant:"sidebar",collapsible:"icon",className:"static! flex flex-col w-full bg-primary dark:bg-secondary ",children:n.jsx(G,{children:n.jsxs(D,{children:[n.jsxs(x,{children:[n.jsx(b,{asChild:!0,children:n.jsx(q,{iconOnly:!0,onClick:()=>k(),className:c({className:"mb-1 hover:bg-sidebar-brand-accent hover:text-sidebar-brand-accent-foreground"}),size:"sm",variant:"ghost",children:d?n.jsx(H,{}):n.jsx(J,{})})}),n.jsx(E,{side:"right",align:"center",children:o(d?"query_filters.sidebar_panel.collapse":"query_filters.sidebar_panel.expand")})]}),n.jsx(w,{children:Object.entries(g).map(([t])=>{const s=K[t],m=o(`query_filters.sidebar_panel.filters.${t}`);return n.jsx(B,{children:n.jsx(V,{asChild:!0,className:c({selected:y===t}),onClick:h=>{h.preventDefault(),T(t)},tooltip:m,children:n.jsxs("div",{children:[n.jsx(s,{}),n.jsx("span",{children:m})]})})},t)})})]})})})}l.__docgenInfo={description:"",methods:[],displayName:"SidebarGroups",props:{onItemSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(itemId: string | null) => void",signature:{arguments:[{type:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},name:"itemId"}],return:{name:"void"}}},description:""},selectedItemId:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},aggregationGroups:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const ge={title:"Sidebar/Sidebar Brand",component:l,args:{},decorators:[r=>n.jsx(z,{className:"m-[-16px] w-50",children:n.jsx("div",{className:"w-50",children:n.jsx(r,{})})})]},i={args:{aggregationGroups:{variant:{items:[{key:"type",translation_key:"variant_type",type:e.MULTIPLE},{key:"cn",translation_key:"cn",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.GreaterThan}},{key:"length",translation_key:"cnv_length",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.GreaterThan}},{key:"chromosome",translation_key:"chromosome",type:e.MULTIPLE},{key:"start",translation_key:"cnv_start",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.Between}},{key:"end",translation_key:"cnv_end",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.LessThan}},{key:"nb_snv",translation_key:"nb_snv",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.GreaterThan}}]},gene:{items:[{key:"cytoband",translation_key:"cytoband",type:e.MULTIPLE},{key:"gene_divider",translation_key:"gene_divider",type:e.DIVIDER},{key:"hpo_gene_panel",translation_key:"hpo_gene_panel",type:e.MULTIPLE},{key:"orphanet_gene_panel",translation_key:"orphanet_gene_panel",type:e.MULTIPLE},{key:"omim_gene_panel",translation_key:"omim_gene_panel",type:e.MULTIPLE},{key:"ddd_gene_panel",translation_key:"ddd_gene_panel",type:e.MULTIPLE},{key:"cosmic_gene_panel",translation_key:"cosmic_gene_panel",type:e.MULTIPLE}]},frequency:{items:[{key:"frequency_divider_pulic_cohorts",translation_key:"frequency_divider_pulic_cohorts",type:e.DIVIDER},{key:"gnomad_sf",translation_key:"gnomad_sf",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.LessThan,defaultMin:0,defaultMax:100}},{key:"gnomad_sc",translation_key:"gnomad_sc",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.LessThan,defaultMin:0,defaultMax:100}}]},metric_qc:{items:[{key:"filter",translation_key:"filter",type:e.MULTIPLE},{key:"quality",translation_key:"cnv_quality",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.GreaterThan,defaultMin:0,defaultMax:100}},{key:"pe",translation_key:"pe",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.LessThan,defaultMin:0,defaultMax:100}},{key:"sm",translation_key:"sm",type:e.NUMERICAL,defaults:{min:0,max:100,defaultOperator:a.LessThan,defaultMin:0,defaultMax:100}}]}}},render:r=>n.jsx(l,{...r})};var u,_,f;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(f=(_=i.parameters)==null?void 0:_.docs)==null?void 0:f.source}}};const ke=["Default"];export{i as Default,ke as __namedExportsOrder,ge as default};
