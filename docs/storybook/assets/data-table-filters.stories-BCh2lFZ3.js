import{j as t}from"./iframe-BDYK6UvR.js";import{h as o}from"./index-bjEbbphn.js";import{i as c}from"./api-EcWoeBNP.js";import{F as n}from"./case-exploration-table-filters-_KgiYPLe.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-B9clGldC.js";import{C as u,A as a}from"./applications-config-E939f-Wl.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DdQ0dhxz.js";import{a as m}from"./story-section-FMAs1sHp.js";import{B as F}from"./chunk-QUQL4437-FnWNOlwB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cl0I9PGk.js";import"./i18n-DvEGfvD-.js";import"./index-C16L_Bj1.js";import"./filter-button-K_zcBcHw.js";import"./checkbox-filter-CmtaURKy.js";import"./checkbox-C48eBJ2q.js";import"./index-BnZFZz7A.js";import"./check-mee2v7ix.js";import"./label-CoZ0mBx7.js";import"./number-format-EKqSbjLk.js";import"./badge-CXb43PLs.js";import"./separator-3qJkDnyN.js";import"./x-tHk7glPu.js";import"./button-B-L79fbv.js";import"./action-button-CdQlTKhi.js";import"./dropdown-menu-HkrpKjvg.js";import"./index-C87n2e9o.js";import"./index-B2uTVnY7.js";import"./circle-CThf3Dtg.js";import"./command-CxnR-xqr.js";import"./dialog-6sSxIGYK.js";import"./popover-8Po6Wjis.js";import"./search-UTE1YsPd.js";import"./skeleton-BKvEb3aE.js";import"./test-tube-diagonal-DXh_mda7.js";import"./user-BQ2cazRN.js";import"./priority-indicator-Cnt6Cv4h.js";import"./indicator-DzGzyVzt.js";import"./shape-triangle-up-icon-BHOd0zra.js";import"./refresh-ccw-CFQXTJxH.js";import"./pen-DPuJcEcd.js";import"./use-tenant-DjqJ7XG8.js";import"./api-LbIRQM0U.js";import"./empty-cell-CQS6slJg.js";import"./settings-CYj65BMs.js";import"./card-BGXjvmYX.js";import"./pagination-CPihACZF.js";import"./select-BaSSL4HF.js";import"./chevron-down-DoyZ4_xh.js";import"./chevron-up-CERSsSGc.js";import"./ellipsis-1A14lnI6.js";import"./empty-CsdHUSEq.js";import"./chevron-right-5X7ErElE.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Ae=["Loading","Default"];export{i as Default,s as Loading,Ae as __namedExportsOrder,_e as default};
