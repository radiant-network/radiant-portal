import{j as t}from"./iframe-_3pDU_m1.js";import{h as o}from"./index-C4xy9ce3.js";import{a as c}from"./api-BIpRWWq8.js";import{F as n}from"./case-exploration-table-filters-CTx7ePbO.js";import{k as l,X as d,c as g}from"./data-table-DGW-wyHT.js";import{C as u,A as a}from"./applications-config-DizvBihq.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CLygdLNU.js";import{a as p}from"./story-section-9tet9DgD.js";import{i as m}from"./table-mock-DTPohCAU.js";import{B as F}from"./chunk-QUQL4437-d4PiYMsh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B4sJkqS6.js";import"./i18n-DIfamP6U.js";import"./index-D93W_M_b.js";import"./filter-button-BDpmmlj7.js";import"./checkbox-filter-D8QC8wFn.js";import"./checkbox-CCZlNr5m.js";import"./index-C0F2G25o.js";import"./check-DZQ1hz2N.js";import"./label-C7drXKr7.js";import"./number-format-CfXB8_Zp.js";import"./badge-DR8BLU8a.js";import"./separator-CIL6Up82.js";import"./x-5OkV8dD4.js";import"./button-B7AkeCKU.js";import"./action-button-BLggGiKX.js";import"./dropdown-menu-DkZCJalM.js";import"./index-BKRaFSoB.js";import"./index-7oRQ5vhD.js";import"./circle-B6SE5RnA.js";import"./command-Cgfwth51.js";import"./dialog-CdcezJmm.js";import"./popover-DKYSjZY8.js";import"./search-BX4qImaI.js";import"./skeleton-BgQ_oooK.js";import"./test-tube-diagonal-xxlhE9iw.js";import"./user-DEtEsFBx.js";import"./priority-indicator-CJzIqAWg.js";import"./indicator-BC8F6rdf.js";import"./shape-triangle-up-icon-CDvYp-DP.js";import"./refresh-ccw-vXT6-0lq.js";import"./pen-DOtf78I4.js";import"./use-tenant-BOr68fwC.js";import"./api-BkktyXdT.js";import"./403-u67hT6it.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BTbLxMxW.js";import"./main-navbar-lang-switcher-DcrTIoCT.js";import"./grip-vertical-BR3hQdBt.js";import"./settings-DQpT4KgH.js";import"./arrow-down-D9Fhnov-.js";import"./card-CWYM6FRL.js";import"./pagination-BZ9seVdT.js";import"./select-Dlu0rXiD.js";import"./chevron-down-CQet8TlG.js";import"./chevron-up-CgNBslTL.js";import"./ellipsis-DXwIM7hp.js";import"./empty-CATtkPrY.js";import"./chevron-right-DLnF-4UK.js";import"./empty-cell-C-uBwMbq.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Te=["Loading","Default"];export{s as Default,i as Loading,Te as __namedExportsOrder,Pe as default};
