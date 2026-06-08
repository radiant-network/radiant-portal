import{j as t}from"./iframe-Dt4dd9_L.js";import{h as o}from"./index-DSw4xTCz.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-aCpTTDAN.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DwTmrz-G.js";import{C as u,A as a}from"./applications-config-BQIHy1i7.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DCWgwMq2.js";import{a as m}from"./story-section-Ba8l4DMz.js";import{B as F}from"./chunk-QUQL4437-BTVBKelx.js";import"./preload-helper-PPVm8Dsz.js";import"./api-C7m0mtH6.js";import"./index-t9s_g_zt.js";import"./filter-button-aYjpWm1z.js";import"./checkbox-filter-B8-iNVvA.js";import"./checkbox-BwoKYgS4.js";import"./index-D3WMzQ8D.js";import"./check-BkrZypcC.js";import"./label-DK9k00Nb.js";import"./index--YEVJleu.js";import"./number-format-D0qrkhTD.js";import"./i18n-Buhp04UG.js";import"./badge-DflLetBh.js";import"./separator-CHrX4g91.js";import"./x-CPSnwLTF.js";import"./button-BHpOt1n5.js";import"./action-button-CUVXthKf.js";import"./dropdown-menu-Db1zsnSb.js";import"./index-B3Y_IRPe.js";import"./index-DydgcOJb.js";import"./circle-CQ2dwaF5.js";import"./command-DDGfZRh0.js";import"./dialog-DAC96_W1.js";import"./popover-DCNuZ3RF.js";import"./search-D_XRA3OL.js";import"./skeleton-DumOnALl.js";import"./test-tube-diagonal-lTl3uIed.js";import"./user-BEmFT4Ps.js";import"./priority-indicator-Dc1pZ3Xp.js";import"./indicator-DpYj_lFY.js";import"./shape-triangle-up-icon-Gnn0bh2Z.js";import"./refresh-ccw-Bu2u3kn5.js";import"./pen-CRX7xI5b.js";import"./empty-cell-fw1PLppm.js";import"./settings-lhoyGB1G.js";import"./card-CUtY5pe2.js";import"./pagination-kBpmjz-0.js";import"./select-BfMcBL-k.js";import"./chevron-down-BZVDl3gb.js";import"./chevron-up-q1g5Izx6.js";import"./ellipsis-BlyO33yJ.js";import"./empty-B1zRnVsH.js";import"./chevron-right-D-NSGr3H.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
