import{j as t}from"./iframe-CKiE6Nsl.js";import{h as o}from"./index-DysA4fPc.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-CkghDah6.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DCkNC6BF.js";import{C as u,A as a}from"./applications-config-Bv1-2iPl.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CmYljlbZ.js";import{a as m}from"./story-section-CH_OnjTD.js";import{B as F}from"./chunk-QUQL4437-D4CS2_l7.js";import"./preload-helper-PPVm8Dsz.js";import"./api-8ZXOsH5S.js";import"./index-CAH79BqJ.js";import"./filter-button-D2abdFOt.js";import"./checkbox-filter-CWmCLIUB.js";import"./checkbox-BECDCYcI.js";import"./index-BA5_-27C.js";import"./check-CQNASh0O.js";import"./label-DNWBVb5X.js";import"./index-9FrZzKeW.js";import"./number-format-DG9gGimj.js";import"./i18n-ZTG9nugd.js";import"./badge-B6R-odmA.js";import"./separator-D0Yo1ak_.js";import"./x-j4ecrtl6.js";import"./button-Cy6cW3zr.js";import"./action-button-skYf-9FP.js";import"./dropdown-menu-DVEsqO9M.js";import"./index-CpQDBSVi.js";import"./index-CZWpuSYx.js";import"./circle-B0UttFdb.js";import"./command-Bl89qmHg.js";import"./dialog-B-Xrddj-.js";import"./popover-B5qWksmY.js";import"./search-DE8MvPT1.js";import"./skeleton-CfrEoLZT.js";import"./test-tube-diagonal-CtuxWVdn.js";import"./user-D4lxp_t6.js";import"./priority-indicator-DOmuADCY.js";import"./indicator-CVZhIsMe.js";import"./shape-triangle-up-icon-BaskWG3G.js";import"./refresh-ccw-Yp369L_n.js";import"./pen-BN0IUvfi.js";import"./empty-cell-BWwGdlvQ.js";import"./settings-XuksA7Fa.js";import"./card-D56DbzLO.js";import"./pagination-BZd9DunE.js";import"./select-DAG4KO_C.js";import"./chevron-down-OO4M0hjG.js";import"./chevron-up-DNZQhiHi.js";import"./ellipsis-CFjhKB4b.js";import"./empty-BjyvB3-W.js";import"./chevron-right-2pmUp1lO.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
