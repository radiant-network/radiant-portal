import{j as t}from"./iframe-CfiqPze7.js";import{h as o}from"./index-DVf-fEyH.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-CwLL7BP1.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-CTXQEB8f.js";import{C as u,A as a}from"./applications-config-Bx7MPM2S.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CcYWYhDz.js";import{a as m}from"./story-section-DuGdZxO-.js";import{B as F}from"./chunk-QUQL4437-Yjnghqnv.js";import"./preload-helper-PPVm8Dsz.js";import"./api-D38bPMZm.js";import"./index-iRVpXJFQ.js";import"./filter-button-DW6Yimnn.js";import"./checkbox-filter-B-MEVpw4.js";import"./checkbox-CT7uF9fh.js";import"./index-DKoyCSRK.js";import"./check-Dmg2ouYX.js";import"./label-CBt7DksO.js";import"./index-BZH6fmNO.js";import"./number-format-DX3fNYLr.js";import"./i18n-reUsGHBL.js";import"./badge-wvl-xvPg.js";import"./separator-BFc4bAvf.js";import"./x-GrAZnGbc.js";import"./button-BoXZHvQI.js";import"./action-button-CCiT5Wq2.js";import"./dropdown-menu-DNmiLd3x.js";import"./index-B4wmxKez.js";import"./index-DPFDfypm.js";import"./circle-BQIUCCgT.js";import"./command-TwBurZ0E.js";import"./dialog-P09oXsSD.js";import"./popover-BYAZrS1b.js";import"./search-QkENTqpl.js";import"./skeleton-BuR14rB-.js";import"./test-tube-diagonal-CiO7TsaC.js";import"./user-C5x9aOtw.js";import"./priority-indicator-BTVdyEBL.js";import"./indicator-B9wqiCg6.js";import"./shape-triangle-up-icon-B-mb_gXt.js";import"./refresh-ccw-xqPjVPnd.js";import"./pen-CiTSTYfv.js";import"./empty-cell-DwOhPz73.js";import"./settings-71EeQZBU.js";import"./card-C0gTtj6y.js";import"./pagination-DcuwnP76.js";import"./select-BZ8TWqMm.js";import"./chevron-down-CMInQ2Ju.js";import"./chevron-up-E4JaajWk.js";import"./ellipsis--rCYpjyK.js";import"./empty-C3rK9E7Y.js";import"./chevron-right-BJjd_zCk.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const _e=["Loading","Default"];export{i as Default,s as Loading,_e as __namedExportsOrder,Fe as default};
