import{j as t}from"./iframe-C_dP7gnO.js";import{h as o}from"./index-mfVtaXpC.js";import{a as c}from"./api-CBLDrJEx.js";import{F as n}from"./case-exploration-table-filters-BT8Fsun4.js";import{k as l,X as d,c as g}from"./data-table-DFw7koXh.js";import{C as u,A as a}from"./applications-config-BL-gJrO0.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-D7H_Yzc4.js";import{a as p}from"./story-section-J70NlQOA.js";import{i as m}from"./table-mock-C_5trx_9.js";import{B as F}from"./chunk-QUQL4437-D01hVGK2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DTYlbHpz.js";import"./i18n-3IdnC225.js";import"./index-BeB-c5z7.js";import"./filter-button-DBTPRuaj.js";import"./checkbox-filter-C9ooP7hs.js";import"./checkbox-Ba8lrrrZ.js";import"./index-BVx3zF6O.js";import"./check-CtmdECFN.js";import"./label-CT5jJSHz.js";import"./number-format-CLMvUGrT.js";import"./badge-CB01_SYr.js";import"./separator-D3keCDl2.js";import"./x-CaTxMj_B.js";import"./button-BlI6yvoB.js";import"./action-button-DmaA9Ug6.js";import"./dropdown-menu-CkkqqYnf.js";import"./index-BiuKl8gy.js";import"./index-B6yDnkAE.js";import"./circle-Cag81XI_.js";import"./command-HgCiaVtq.js";import"./dialog-x8DC9efX.js";import"./popover-Cifa0nlP.js";import"./search-DutK3ffB.js";import"./skeleton-BiReTMOi.js";import"./test-tube-diagonal-Bp0EZVLl.js";import"./user-BKJyUoC5.js";import"./priority-indicator-RP_LJSUs.js";import"./indicator-CR2G4CZK.js";import"./shape-triangle-up-icon-85vEDQcr.js";import"./refresh-ccw-BaapgDY1.js";import"./pen-Cy8n4ZJm.js";import"./use-tenant-BSWFgFxB.js";import"./api-CW_xkoj1.js";import"./403-C0H6pQo-.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-f8Hia41T.js";import"./main-navbar-lang-switcher-Br2HJpPu.js";import"./grip-vertical-CCZVpF6z.js";import"./settings-D7FLdft1.js";import"./arrow-down-BW_whicL.js";import"./card-rjboDO1e.js";import"./pagination-B1h1bCyM.js";import"./select-CWVO10Kw.js";import"./chevron-down-sS1T7qMn.js";import"./chevron-up-DAshY918.js";import"./ellipsis-BRJJLv0Q.js";import"./empty-DIs8O81e.js";import"./chevron-right-CeeN0jat.js";import"./empty-cell-0_vvp3ns.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
