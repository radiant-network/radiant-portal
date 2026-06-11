import{j as t}from"./iframe-5hjCxaQ_.js";import{h as o}from"./index-fGIUz_G7.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-DSdg_Ft7.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-mwJTxOjl.js";import{C as u,A as a}from"./applications-config-CzXWmwjy.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DXcdX-_O.js";import{a as m}from"./story-section-Dz-VNK5b.js";import{B as F}from"./chunk-QUQL4437-PW0-xcxl.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DR0nX1-y.js";import"./index-DwABPnsI.js";import"./filter-button-DC9RXOwX.js";import"./checkbox-filter-CcVR0dWg.js";import"./checkbox-BI73tEf_.js";import"./index-C7AD1Ku5.js";import"./check-DQDqWsNZ.js";import"./label-nLVE3ES4.js";import"./index-526z61a1.js";import"./number-format-OAkSuufK.js";import"./i18n-BCVPTX9O.js";import"./badge-ZFN1mivz.js";import"./separator-CdreFVRa.js";import"./x-cqQ7vGF6.js";import"./button-BFdsQ3Kp.js";import"./action-button-Cl-iR9-B.js";import"./dropdown-menu-BxaMWWIo.js";import"./index-NgiKxE6c.js";import"./index-DJkBUnxK.js";import"./circle-D6MwNdjA.js";import"./command-CS_yGDBx.js";import"./dialog-JaF7igOL.js";import"./popover-BSWOOXE3.js";import"./search-C96zcjqv.js";import"./skeleton-Dv3AkMtm.js";import"./test-tube-diagonal-DTeUotQ9.js";import"./user-DUF7tVM4.js";import"./priority-indicator-CeNWYK5R.js";import"./indicator-DDyvzVYt.js";import"./shape-triangle-up-icon-CMpkG-1r.js";import"./refresh-ccw-Dw-Z6DAV.js";import"./pen-Cif18fOV.js";import"./empty-cell-DjNNCKNe.js";import"./settings-BTwGYpnD.js";import"./card-DLykDPYP.js";import"./pagination-C_WbhP6h.js";import"./select-DZpfFxF7.js";import"./chevron-down-hJBTG5sI.js";import"./chevron-up-rDBTqo08.js";import"./ellipsis-C6V_EbaF.js";import"./empty-Bo1HrOqm.js";import"./chevron-right-BSq8BjvU.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
