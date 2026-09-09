import{aq as c,j as t}from"./iframe-CEIjD8md.js";import{h as o}from"./index-wCXzeHxf.js";import{F as n}from"./case-exploration-table-filters-DELasPxi.js";import{D as l,j as d,c as g}from"./data-table-C4XDA48K.js";import{C as u,A as a}from"./applications-config-CNrpF8an.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-DfMyF-DA.js";import{a as p}from"./story-section-akNb6BHm.js";import{d as m}from"./table-mock-OVO-byjn.js";import{B as F}from"./chunk-QUQL4437-CMT0E8nl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CznPFmdJ.js";import"./filter-button-DKs73iJT.js";import"./checkbox-filter-f_NrGxxU.js";import"./checkbox--tjMQgO-.js";import"./index-CarIRmcY.js";import"./label-B7YzvmnB.js";import"./number-format-CJScPz54.js";import"./badge-DvpfCyw2.js";import"./x-BF0Xdm60.js";import"./command-DqCoANkt.js";import"./dialog-D5Lpc5EW.js";import"./popover-B4minZ3i.js";import"./search-D9gbuUYD.js";import"./skeleton-txNlXTbo.js";import"./test-tube-diagonal-DlGfFzYN.js";import"./user-BLi1-fkV.js";import"./priority-indicator-bcnnvfPB.js";import"./indicator-C48Hqdn0.js";import"./shape-triangle-up-icon-B-BFcX49.js";import"./status-badge-C7bGvbcf.js";import"./rotate-ccw-B0joQBgf.js";import"./isEqual-xrxPUUlG.js";import"./grip-vertical-DS3lQMTI.js";import"./settings-Dw90vACv.js";import"./arrow-down-BHqjmLOx.js";import"./card-CNapmLtt.js";import"./pagination-B1zGPfa2.js";import"./select-DN2j-4cl.js";import"./chevron-down-5uSI5hu_.js";import"./chevron-up-C3ynASbf.js";import"./ellipsis-DjNZLTDg.js";import"./empty-CuHeaMvl.js";import"./chevron-right-DIff2KeZ.js";import"./_baseUniq-BP2x7U2Z.js";import"./empty-cell-CKCnXNvb.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ue={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Loading","Default"];export{i as Default,s as Loading,he as __namedExportsOrder,ue as default};
