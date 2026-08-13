import{j as t}from"./iframe-BIXXYuBI.js";import{h as o}from"./index-DUCXLjYZ.js";import{a as c}from"./api-BPXQdJnN.js";import{F as n}from"./case-exploration-table-filters-6-fxcs27.js";import{D as l,j as d,c as g}from"./data-table-LjkD_CIz.js";import{C as u,A as a}from"./applications-config-DEK4SPXH.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-hvEONlv6.js";import{a as p}from"./story-section-DE5REqsE.js";import{d as m}from"./table-mock-Del7BXOe.js";import{B as F}from"./chunk-QUQL4437-9LXkS8Da.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DrtFoJ_2.js";import"./i18n-DzF9286q.js";import"./index-CFXxicox.js";import"./filter-button-B0Tv5l43.js";import"./checkbox-filter-rFREmlxY.js";import"./checkbox-CkLL30MI.js";import"./index-CTfBaCRO.js";import"./check-BfX4x5II.js";import"./label-BVlxjPWm.js";import"./number-format-dbXC-dva.js";import"./badge-CEocXOGT.js";import"./separator-B6mOwfzL.js";import"./x-P8l5shew.js";import"./button-xPG5O6R2.js";import"./action-button-BSswwT5c.js";import"./dropdown-menu-DBlI4iuc.js";import"./index-BqZtMSNs.js";import"./index-D0c3HBoV.js";import"./circle-CKfwywNe.js";import"./command-BjLTOYIx.js";import"./dialog-BV6L7dTa.js";import"./popover-DqgG4Blr.js";import"./search-Y8Ft911q.js";import"./skeleton-BDass7SO.js";import"./test-tube-diagonal-CsdWPFSb.js";import"./user-BCF-I2u-.js";import"./priority-indicator-B-a3jMwg.js";import"./indicator-BcCRhJK_.js";import"./shape-triangle-up-icon-NSFiLx8G.js";import"./refresh-ccw-BReoFn-W.js";import"./pen-D85PawvN.js";import"./use-tenant-DGG2Zd_8.js";import"./api-CzLmFqDN.js";import"./403-DH0l6nrE.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CtJnZkCg.js";import"./main-navbar-lang-switcher-C4h_uOJ6.js";import"./isEqual-CLME6tF9.js";import"./grip-vertical-DDYb_TwK.js";import"./settings-CbTlv8GV.js";import"./arrow-down-XhHMOOXM.js";import"./card-eJ_eJSwh.js";import"./pagination-DB4hWGdS.js";import"./select-BLaLCw1J.js";import"./chevron-down-C2TDrqsY.js";import"./chevron-up-By7-6aXL.js";import"./ellipsis-BeUi8Q10.js";import"./empty-DyLuS6Yx.js";import"./chevron-right-BBsGHZ56.js";import"./_baseUniq-B3xT9PLd.js";import"./empty-cell-DpHZq0Xd.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Oe=["Loading","Default"];export{s as Default,i as Loading,Oe as __namedExportsOrder,De as default};
