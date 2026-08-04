import{j as t}from"./iframe-BXBRzL1c.js";import{h as o}from"./index-NpwqAfcT.js";import{a as c}from"./api-IE258HGD.js";import{F as n}from"./case-exploration-table-filters-B3_8CT_W.js";import{j as l,k as d,c as g}from"./data-table-Bi8pCVP_.js";import{C as u,A as a}from"./applications-config-CmUEdNAO.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DHIRrlHw.js";import{a as p}from"./story-section-G0DD0yKl.js";import{h as m}from"./table-mock-B_xweJHl.js";import{B as F}from"./chunk-QUQL4437-DGUZn1R2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DkrYVHRy.js";import"./i18n-DUK-WuJ6.js";import"./index-DYAaY2Yf.js";import"./filter-button-Bcy4R-zH.js";import"./checkbox-filter-BnuHARhh.js";import"./checkbox-HEb-Wb1J.js";import"./index-ChzukvM0.js";import"./check-BOVnNvmn.js";import"./label-FkSBQTJT.js";import"./number-format-DV0GfiRa.js";import"./badge-DNbRLMhx.js";import"./separator-D6E9NYhF.js";import"./x-Ccdq7o_U.js";import"./button-CnDkH2FJ.js";import"./action-button-CiX5XSNN.js";import"./dropdown-menu-Dj2Zjq4n.js";import"./index-Buei5AJu.js";import"./index-C0UyXbDn.js";import"./circle-ZGZFIAr_.js";import"./command-rgDrBBYC.js";import"./dialog-BVPEEUYs.js";import"./popover-Df1FE77O.js";import"./search-gCbpG9f6.js";import"./skeleton-L9n2tz6Q.js";import"./test-tube-diagonal-DY28y4x4.js";import"./user-BtcI4lZH.js";import"./priority-indicator-CQHCpJrt.js";import"./indicator-BqlokVrY.js";import"./shape-triangle-up-icon-CeUTHpdw.js";import"./refresh-ccw-BmK4OG8W.js";import"./pen-B7WH9tGl.js";import"./use-tenant-BT7VDdFK.js";import"./api-CRj7GcIN.js";import"./403-BrxSxOJS.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-8PmMV6BK.js";import"./main-navbar-lang-switcher-C-18y_9g.js";import"./isEqual-BBRRvwdU.js";import"./grip-vertical-BV5xekP0.js";import"./settings-DUBx0e6I.js";import"./arrow-down-o8nxA9L0.js";import"./card-Bc_90yu4.js";import"./pagination-BJIak5OX.js";import"./select-BHB1WtC1.js";import"./chevron-down-CD3dAkbA.js";import"./chevron-up-krr3_aDU.js";import"./ellipsis-B9ghaZcz.js";import"./empty-B56OsfWm.js";import"./chevron-right-Dsr2JqKi.js";import"./_baseUniq-D-Db-n5w.js";import"./empty-cell-D7ri16-A.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
