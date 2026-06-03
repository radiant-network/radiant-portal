import{j as t}from"./iframe-KxDQxQDs.js";import{h as o}from"./index-CmOdadIk.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-BYliEdD3.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-Berst8i_.js";import{C as u,A as a}from"./applications-config-CEk3Qm2l.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DwzzS4Zc.js";import{a as m}from"./story-section-B6HdLg4-.js";import{B as F}from"./chunk-QUQL4437-8rS0-6jZ.js";import"./preload-helper-PPVm8Dsz.js";import"./api-D41u6Dnf.js";import"./index-CPmIy41W.js";import"./filter-button-8TO2QMDu.js";import"./checkbox-filter-CzqueMH8.js";import"./checkbox-CevW5JLm.js";import"./index-C-iMpffm.js";import"./check-OcLjUnTR.js";import"./label-CC-sdX0i.js";import"./index-DL5skkIA.js";import"./number-format-BNUEZRVO.js";import"./i18n-BnCxB2cP.js";import"./badge-C0o81Ql6.js";import"./separator-RpiEdedA.js";import"./x-8Vd-H5Q8.js";import"./button-DcEb2QoR.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./circle-YicaXG0V.js";import"./command-CT0u8Dqv.js";import"./dialog--60lc3us.js";import"./popover-OtDG5t1c.js";import"./search-DZXdKyod.js";import"./skeleton-BDS1U2kz.js";import"./test-tube-diagonal-NOBuzqZs.js";import"./user-4UUwVZXs.js";import"./priority-indicator-Bj_rdo3C.js";import"./indicator-BavIqBKA.js";import"./shape-triangle-up-icon-D4hLCjGT.js";import"./refresh-ccw-B1Kv5JTl.js";import"./pen-DUmSjtsh.js";import"./empty-cell-NOKWxEQx.js";import"./settings-C0E3LpPe.js";import"./card-DOGx-K30.js";import"./pagination-OcUXXvl3.js";import"./select-BvQe5RBr.js";import"./chevron-down-CedcGUxF.js";import"./chevron-up-uAqi-rT4.js";import"./ellipsis-D_BdUt-k.js";import"./empty-CvNnnIIZ.js";import"./chevron-right-Bc1sQmc3.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
