import{j as t}from"./iframe-AvqL8SKE.js";import{h as o}from"./index-CX0dfJkw.js";import{i as c}from"./api-5e3Wi7_0.js";import{F as n}from"./case-exploration-table-filters-BmmZi1G5.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-CDG_Tzh9.js";import{C as u,A as a}from"./applications-config-DZiFBhTt.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case--iwv7J27.js";import{a as m}from"./story-section-SMd-_iOc.js";import{B as F}from"./chunk-QUQL4437-ChXxCCdB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CO_E9RYG.js";import"./i18n-DBGkWSYQ.js";import"./index-R0HakiSX.js";import"./filter-button-_PpRcaWS.js";import"./checkbox-filter-B7gmc1eW.js";import"./checkbox-5kkRRs5v.js";import"./index-CMK5tMBM.js";import"./check-YjMj3Oh7.js";import"./label-CCwuG9YO.js";import"./number-format-B9sFLo3q.js";import"./badge-B06Zx7NZ.js";import"./separator-DDqetdKm.js";import"./x-BW3PQCY8.js";import"./button-ovvqhFmn.js";import"./action-button-ChVSKd_a.js";import"./dropdown-menu-D00C_V5S.js";import"./index-Bu3D54Rz.js";import"./index-pBdHyUKt.js";import"./circle-BTQqcZGT.js";import"./command-CdZQNfXt.js";import"./dialog-7ii1inUe.js";import"./popover-BcfLvNB9.js";import"./search-DKRPlkQU.js";import"./skeleton-BYVsD9zf.js";import"./test-tube-diagonal-BbizMhfW.js";import"./user-C6QmbQJ6.js";import"./priority-indicator-C3F4E5nr.js";import"./indicator-BIyDLa5A.js";import"./shape-triangle-up-icon-CStTbZAR.js";import"./refresh-ccw-B5lbvU9E.js";import"./pen-BEggiLfD.js";import"./use-tenant-CRygO0Wf.js";import"./api-CRUcq8iX.js";import"./empty-cell-Bfafeluk.js";import"./grip-vertical-BduDmYEP.js";import"./settings-BMTt-5o9.js";import"./card-DwO56bFM.js";import"./pagination-DqXepwCJ.js";import"./select-B9JfQFJv.js";import"./chevron-down-CoHM6X36.js";import"./chevron-up-0dj-bmwZ.js";import"./ellipsis-CFntq0Mp.js";import"./empty-2911-OcP.js";import"./chevron-right-Bs6RLtby.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ve=["Loading","Default"];export{i as Default,s as Loading,ve as __namedExportsOrder,Ae as default};
