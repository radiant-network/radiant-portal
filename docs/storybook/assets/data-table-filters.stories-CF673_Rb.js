import{j as t}from"./iframe-CJwTE_QO.js";import{h as o}from"./index-CHmrhrxQ.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-BSEaEYHs.js";import{k as l,X as d,c as g}from"./data-table-BUMhHdeU.js";import{C as u,A as a}from"./applications-config-BVUWtLly.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-tAxWjN0B.js";import{a as p}from"./story-section-CeCnabVr.js";import{i as m}from"./table-mock-BGk-qLzT.js";import{B as F}from"./chunk-QUQL4437-Bp5L4Ct6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cd1dGipA.js";import"./i18n-CUSdW0Rx.js";import"./index-BKOy4Uli.js";import"./filter-button-CrF8T2Mn.js";import"./checkbox-filter-VGbGjHxC.js";import"./checkbox-B8P3gkXE.js";import"./index-VR3O8Uog.js";import"./check-yhgl2byu.js";import"./label-3yuFg4y2.js";import"./number-format-BsZhiVrX.js";import"./badge-BflcfINl.js";import"./separator-Bp1EgoNF.js";import"./x-BC3WFTOT.js";import"./button-ByIr39LF.js";import"./action-button-CQ4pQYUu.js";import"./dropdown-menu-B8L4Z_RM.js";import"./index-B21IwPkO.js";import"./index-BwqD7REl.js";import"./circle-Do5ahLCh.js";import"./command-uAo_sp84.js";import"./dialog-DO0gHgcL.js";import"./popover-D_rHXz6y.js";import"./search-_HSVy0fH.js";import"./skeleton-Bvbpfc6L.js";import"./test-tube-diagonal-H460fp7u.js";import"./user-CjzW27yp.js";import"./priority-indicator-BhxW6VuE.js";import"./indicator-Cra0ynA5.js";import"./shape-triangle-up-icon-B8-JDDhH.js";import"./refresh-ccw-BNnK4ulp.js";import"./pen-DtvyXF36.js";import"./use-tenant-Y8KtkJ5P.js";import"./api-BjHhlcVm.js";import"./grip-vertical-9O0Rpx2m.js";import"./settings-9QcnlNy0.js";import"./card-Bc7PFK1b.js";import"./pagination-DYhP7Cxh.js";import"./select-CPKIfSqh.js";import"./chevron-down-Cum-E7yz.js";import"./chevron-up-BAHOor8U.js";import"./ellipsis-BsFtE-VN.js";import"./empty-OFpgbtA5.js";import"./chevron-right-CIKzNYX6.js";import"./empty-cell-CJRYfXQQ.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const je=["Loading","Default"];export{i as Default,s as Loading,je as __namedExportsOrder,ve as default};
