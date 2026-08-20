import{j as t}from"./iframe-c2IPk3oe.js";import{h as o}from"./index-Be4Sy7Es.js";import{a as c}from"./api-Dm71OR6H.js";import{F as n}from"./case-exploration-table-filters-7kZcJf48.js";import{D as l,j as d,c as g}from"./data-table-DQ9yMcsh.js";import{C as u,A as a}from"./applications-config-CDi0XW_r.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-BZtyAwS4.js";import{a as p}from"./story-section-CAEPkWC7.js";import{d as m}from"./table-mock-BD6PpTmV.js";import{B as F}from"./chunk-QUQL4437-EUh0k2Sg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B39quYzB.js";import"./i18n-CfOqn4nZ.js";import"./index-Bk_1Mjxr.js";import"./filter-button-BUzyFqco.js";import"./checkbox-filter-NppLuGut.js";import"./checkbox-kgNs3td8.js";import"./index-Cv-qAHrj.js";import"./check-DUGuR0C1.js";import"./label-DO7cBuUl.js";import"./number-format-cNph7tHl.js";import"./badge-BZB0Hphq.js";import"./separator-CC9AvFe8.js";import"./x-DSPDcSor.js";import"./button-Bjl3P42F.js";import"./action-button-C7Rwv-R7.js";import"./dropdown-menu-abCbWXC_.js";import"./index-BxFSGfgl.js";import"./index-AnShAb8S.js";import"./circle-RRa7pUsB.js";import"./command-C5_Dx5-4.js";import"./dialog-C6NuQbgX.js";import"./popover-DMX6qJch.js";import"./search-DpQ8ogXL.js";import"./skeleton-ZCtiSdbX.js";import"./test-tube-diagonal-DtMBqKA8.js";import"./user-CUm-OZSf.js";import"./priority-indicator-DtboDTc2.js";import"./indicator-DvVRArMP.js";import"./shape-triangle-up-icon-BuNblGpF.js";import"./refresh-ccw-Rf5PV7Gm.js";import"./pen-BplUyOAY.js";import"./use-tenant-Cfm7aHlC.js";import"./api-D4WrX2Ug.js";import"./403-CR-QzuB-.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BW-ZcWxC.js";import"./main-navbar-lang-switcher--5ICBnep.js";import"./isEqual-NEHDhy_1.js";import"./grip-vertical-Bb0DZawK.js";import"./settings-BR7EtF0o.js";import"./arrow-down-TaE1nCCJ.js";import"./card-C6gXMcNZ.js";import"./pagination-BANng6nf.js";import"./select-DqjeUoJT.js";import"./chevron-down-g2DBveUu.js";import"./chevron-up-DeV7PzPO.js";import"./ellipsis-BsDd_t1U.js";import"./empty-CWFS8me9.js";import"./chevron-right-BLB89RYQ.js";import"./_baseUniq-Bnm1mgG0.js";import"./empty-cell-DgZPqnhy.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
