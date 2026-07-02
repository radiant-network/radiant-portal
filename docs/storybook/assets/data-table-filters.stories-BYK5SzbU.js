import{j as t}from"./iframe-GYMnz-7x.js";import{h as o}from"./index-B2PsYcUF.js";import{i as c}from"./api-EcWoeBNP.js";import{F as n}from"./case-exploration-table-filters-DKnd_5y4.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-6GD28B5r.js";import{C as u,A as a}from"./applications-config-DO7CSrqT.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CL8rEv1j.js";import{a as m}from"./story-section-B8hLDL9V.js";import{B as F}from"./chunk-QUQL4437-CI2-bQxg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWwVjCJn.js";import"./i18n-LMd9zC7u.js";import"./index-CtN1RmEe.js";import"./filter-button-CWlFIxyC.js";import"./checkbox-filter-DzYnHQd8.js";import"./checkbox-xTIFsH62.js";import"./index-C8P70boH.js";import"./check-BxNDYKk2.js";import"./label-C7sSkWa7.js";import"./number-format-DVWKH0VC.js";import"./badge-DtSAfr-_.js";import"./separator-CxIJlsta.js";import"./x-B0j_u5GZ.js";import"./button-BW7uYpsZ.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./circle-q-mOcdtX.js";import"./command-Ba43RnyO.js";import"./dialog-C_fhUZtP.js";import"./popover-B8xXFIbE.js";import"./search-CYtZcpyb.js";import"./skeleton-B2fVud72.js";import"./test-tube-diagonal-DV9w8g24.js";import"./user-Ysbzq8aZ.js";import"./priority-indicator-BumKoMAA.js";import"./indicator-BRzBnpXJ.js";import"./shape-triangle-up-icon-Bq1TXa0t.js";import"./refresh-ccw-BZtPBrBR.js";import"./pen-kYRAvPLU.js";import"./use-tenant-Dwdxak71.js";import"./api-LbIRQM0U.js";import"./empty-cell-DKBixC8-.js";import"./settings-Dd6JTkSL.js";import"./card-BeBc4Fcj.js";import"./pagination-CUAsXqyO.js";import"./select-B5rtyE9c.js";import"./chevron-down-DpG1yQhf.js";import"./chevron-up-Cg_ICu4M.js";import"./ellipsis-CmN7Qftj.js";import"./empty-DzCgXafp.js";import"./chevron-right-cLiIiYVx.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    },
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={true} setSearchCriteria={() => {}} />
  },
  render: args => <StorySection title="Loading">
      <DataTable {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(caseSearchApi, httpCaseSearchApiResponse), http.post(caseFiltersApi, httpCaseFiltersApiResponse), http.get(caseAutocompleteApi, httpCaseAutocompleteResponse)]
    }
  },
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={false} setSearchCriteria={() => {}} />
  },
  render: args => <StorySection title="Default">
      <DataTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};const Ae=["Loading","Default"];export{i as Default,s as Loading,Ae as __namedExportsOrder,_e as default};
