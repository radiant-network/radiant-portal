import{j as t}from"./iframe-DVxP0arQ.js";import{h as o}from"./index-C2abPeK_.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-2mLddqqb.js";import{k as l,X as d,c as g}from"./data-table-DV9GjwmY.js";import{C as u,A as a}from"./applications-config-BIjrHPLj.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Lt7JpfRw.js";import{a as p}from"./story-section-BtKKXoKS.js";import{i as m}from"./table-mock-D3hhKkhj.js";import{B as F}from"./chunk-QUQL4437-CKxXuzYq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CsTUvzcu.js";import"./i18n-U8mL1TZy.js";import"./index-DXeCl3bV.js";import"./filter-button-B2NgXN70.js";import"./checkbox-filter-DQXo70tv.js";import"./checkbox-BtOAal71.js";import"./index-DFPjoQi7.js";import"./check-DnDcPfKb.js";import"./label-BxVuC17B.js";import"./number-format-SnpqMBx9.js";import"./badge-CfYKYKkH.js";import"./separator-Bx5E3IZe.js";import"./x-Bp479bDP.js";import"./button-HLKZGIIG.js";import"./action-button-BE9ZLPWr.js";import"./dropdown-menu-Bdlhi6VJ.js";import"./index-U50s1qQV.js";import"./index-CrmWKYFO.js";import"./circle-hliijJXo.js";import"./command-KgaeQsKZ.js";import"./dialog-CUnJTsC-.js";import"./popover-CphWAqxn.js";import"./search-D4xgd-ki.js";import"./skeleton-BGl1Di7-.js";import"./test-tube-diagonal-Dm-J3qoX.js";import"./user-B1S6cguS.js";import"./priority-indicator-BuH_HDJq.js";import"./indicator-Bn9zbLSX.js";import"./shape-triangle-up-icon-BrwEyc-t.js";import"./refresh-ccw-V0aIGefP.js";import"./pen-C9CvribN.js";import"./use-tenant-mahC1-sF.js";import"./api-BKer6Fgf.js";import"./grip-vertical-aVi35YzQ.js";import"./settings-B-OJUVwf.js";import"./card-OpmLZy7X.js";import"./pagination-Da7bsaBU.js";import"./select-BmKDDbhL.js";import"./chevron-down-U1uApuDk.js";import"./chevron-up-BMlJxAd_.js";import"./ellipsis-asLQnZVI.js";import"./empty-_IFiheBr.js";import"./chevron-right-CFC1XrZz.js";import"./empty-cell-KCN4pSiy.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
