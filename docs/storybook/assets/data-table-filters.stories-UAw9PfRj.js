import{j as t}from"./iframe-x0eT-xyE.js";import{h as o}from"./index-MDABB6Dl.js";import{i as c}from"./api-EcWoeBNP.js";import{F as n}from"./case-exploration-table-filters-B2rjEejJ.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-GNRetIjF.js";import{C as u,A as a}from"./applications-config-C4TDF07c.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-BdQOr-Sy.js";import{a as m}from"./story-section-B-UwUZjU.js";import{B as F}from"./chunk-QUQL4437-BkwlIvAv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BUGZ6WPd.js";import"./i18n-ETpqMXvg.js";import"./index-DFPPf6dC.js";import"./filter-button-s-elcjrx.js";import"./checkbox-filter-BY1FTXbJ.js";import"./checkbox-CFHin2dP.js";import"./index-0XNOcOrX.js";import"./check-C2XjndMj.js";import"./label-UxOfftzp.js";import"./number-format-ut2-EK5Y.js";import"./badge-BZsklmtK.js";import"./separator-Da2YlRWj.js";import"./x-DVu1g7Yb.js";import"./button-DKCq0MjW.js";import"./action-button-BSoyb7Vm.js";import"./dropdown-menu-B_gNLwrH.js";import"./index-dE50l6Wk.js";import"./index-Ol_TykaS.js";import"./circle-B80l30cz.js";import"./command-jQsT42z6.js";import"./dialog-BeEJwNSC.js";import"./popover-CVbvMQOt.js";import"./search-DzPbOZZk.js";import"./skeleton-kTUcZWj-.js";import"./test-tube-diagonal-J_lYaCqY.js";import"./user-Djre0RzD.js";import"./priority-indicator-DAv5-nw1.js";import"./indicator-B0fKFZjL.js";import"./shape-triangle-up-icon-BmI0N9Uu.js";import"./refresh-ccw-BpUuUKmM.js";import"./pen-BTDNxieO.js";import"./use-tenant-Do1Cm8JO.js";import"./api-LbIRQM0U.js";import"./empty-cell-CNpxthIR.js";import"./settings-CgmRvaTI.js";import"./card-BV7uphbI.js";import"./pagination-5KRO04Sj.js";import"./select-SD_CJF2m.js";import"./chevron-down-Bhk1z7Q1.js";import"./chevron-up-D-TRwSDu.js";import"./ellipsis-CkguapoJ.js";import"./empty-DquMLGyS.js";import"./chevron-right-jd7LLkmb.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
