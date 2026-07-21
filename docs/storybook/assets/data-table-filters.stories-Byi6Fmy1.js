import{j as t}from"./iframe-BOkj70l8.js";import{h as o}from"./index-BJMbDJFV.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-B_nyyQhg.js";import{k as l,X as d,c as g}from"./data-table-BnwkHRzi.js";import{C as u,A as a}from"./applications-config-JBnwvOX3.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DDdoJh9Q.js";import{a as p}from"./story-section-DQYgi0mB.js";import{i as m}from"./table-mock-BymtsLdZ.js";import{B as F}from"./chunk-QUQL4437-G0f9rGug.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3LHxnuQ.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./filter-button-Cw4EHxqp.js";import"./checkbox-filter-1TL1cs92.js";import"./checkbox-Dlb-3fxY.js";import"./index-A2SqbsTG.js";import"./check-DI71rXD4.js";import"./label-0Y6SZoH6.js";import"./number-format-DQPoWrNo.js";import"./badge-DYJwqogr.js";import"./separator-MMk7clR0.js";import"./x-BN09ysZY.js";import"./button-tn5oIYKb.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./circle-BIlPbk8H.js";import"./command-DCJBLat9.js";import"./dialog-BNVSz0vP.js";import"./popover-Bs2KN7gB.js";import"./search-BIVXZrsJ.js";import"./skeleton-yvCFhn6H.js";import"./test-tube-diagonal-BPuUkYGu.js";import"./user-DERqMDHR.js";import"./priority-indicator-B7EOQUB6.js";import"./indicator-4G3DDwEw.js";import"./shape-triangle-up-icon-CrP92zm8.js";import"./refresh-ccw-DPq2B7n7.js";import"./pen-F9NWY9vr.js";import"./use-tenant-0ss66-Wz.js";import"./api-BKer6Fgf.js";import"./403-DkKXtwq_.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-KTxQKqZ0.js";import"./main-navbar-lang-switcher-U0BgklKh.js";import"./grip-vertical-CIN-HpYe.js";import"./settings-CRw8k7BS.js";import"./card-DT4VhHcK.js";import"./pagination-CI16zh1J.js";import"./select-CQpSPxiC.js";import"./chevron-down-DWw7bU01.js";import"./chevron-up-BsEiHGO1.js";import"./ellipsis-DQXAhDIW.js";import"./empty-B8BKmsqh.js";import"./chevron-right-BxM75QZv.js";import"./empty-cell-DjMYG2MG.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Loading","Default"];export{i as Default,s as Loading,Pe as __namedExportsOrder,Ne as default};
