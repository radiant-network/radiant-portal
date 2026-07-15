import{j as t}from"./iframe-CuWpm1qa.js";import{h as o}from"./index-C6lwpPZ2.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-C6vhv-Tf.js";import{k as l,X as d,c as g}from"./data-table-BwkoD08z.js";import{C as u,A as a}from"./applications-config-bsVpSCPZ.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Dh_M2Ngh.js";import{a as p}from"./story-section-w3-NF7Xp.js";import{i as m}from"./table-mock-u1nRL7AE.js";import{B as F}from"./chunk-QUQL4437-CXAMCr7o.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DSNW0WvP.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";import"./filter-button-DIXxfeDu.js";import"./checkbox-filter-DCqBUExR.js";import"./checkbox-D1IGK36Y.js";import"./index-BO3dUORY.js";import"./check-j36eKSHy.js";import"./label-BBpbnW0o.js";import"./number-format-CPaf5g4o.js";import"./badge-Dco37cMT.js";import"./separator-BEF1T6M0.js";import"./x-BvFgF3db.js";import"./button-CSz6EV4E.js";import"./action-button-lN5zPVbm.js";import"./dropdown-menu-BOERjw4c.js";import"./index-Dmb4mQ0b.js";import"./index-CJQJWHRc.js";import"./circle-Dfldtqa6.js";import"./command-BK2w7Wgv.js";import"./dialog-C2zHoQsb.js";import"./popover-BajqPyEk.js";import"./search-DJbsJVWb.js";import"./skeleton-BQ5jhFqg.js";import"./test-tube-diagonal-D3CGkDYF.js";import"./user-W-7HqoSb.js";import"./priority-indicator-D6qYFaAN.js";import"./indicator-YwH_O1Sc.js";import"./shape-triangle-up-icon-B5Sr1EM6.js";import"./refresh-ccw-DedF4Znx.js";import"./pen-B0RRo4Ye.js";import"./use-tenant-DPtKG6c-.js";import"./api-BjHhlcVm.js";import"./grip-vertical-CAdv7Q8c.js";import"./settings-DBIlpOVO.js";import"./card-DjuS4vUs.js";import"./pagination-uTr5Y2hx.js";import"./select-CxLEk9oM.js";import"./chevron-down-CDh4_9lO.js";import"./chevron-up-V9reyzVa.js";import"./ellipsis-BpQDtzBQ.js";import"./empty-DecxtquU.js";import"./chevron-right-U83oTN6o.js";import"./empty-cell-C8CmKkxm.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
