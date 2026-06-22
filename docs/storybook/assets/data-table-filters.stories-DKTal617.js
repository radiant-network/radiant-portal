import{j as t}from"./iframe-CXwxzQgG.js";import{h as o}from"./index-DT4SZJfw.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-DlrtlBrS.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-CtGh4ARH.js";import{C as u,A as a}from"./applications-config-DR9nMiIG.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Bek-YykT.js";import{a as m}from"./story-section-puWRqKt8.js";import{B as F}from"./chunk-QUQL4437-umhhK5tm.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Cu6r-uCJ.js";import"./i18n-gHAOwTiM.js";import"./index-DCs8_3sr.js";import"./filter-button-Dm1DYChs.js";import"./checkbox-filter-DDf6Tn14.js";import"./checkbox-Zy3c-qxy.js";import"./index-DnY96hiv.js";import"./check-j-xk93RG.js";import"./label-BpKmJ4D-.js";import"./number-format-j3F05apG.js";import"./badge-gLJ5M8f2.js";import"./separator-pzXO6oVw.js";import"./x-Bto3vMF3.js";import"./button-Cxobtibg.js";import"./action-button-DPj_xv_y.js";import"./dropdown-menu-D5pHqyQ1.js";import"./index-Taq0aAWj.js";import"./index-DScWjfT-.js";import"./circle-Dnell8nw.js";import"./command-iSlElfVb.js";import"./dialog-Cv1Q6S7N.js";import"./popover-DLbcTx_m.js";import"./search-DAMGNUwL.js";import"./skeleton-t8m5eO8i.js";import"./test-tube-diagonal-B3SmVoD5.js";import"./user-B60Jwx-5.js";import"./priority-indicator-G6bqsL-T.js";import"./indicator-OG0vefRs.js";import"./shape-triangle-up-icon-CmQCTmE5.js";import"./refresh-ccw-pH8_ISss.js";import"./pen-CavC572P.js";import"./empty-cell-KZyfUbGO.js";import"./settings-Br9U-QyG.js";import"./card-GlfzFHpU.js";import"./pagination-DPvkbgm6.js";import"./select-RumOUmww.js";import"./chevron-down-BkmRPrqG.js";import"./chevron-up-54ZOoOdO.js";import"./ellipsis-xJKh3FzZ.js";import"./empty-C_vVlUHL.js";import"./chevron-right-BYAA1PgD.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Fe=["Loading","Default"];export{i as Default,s as Loading,Fe as __namedExportsOrder,Ce as default};
