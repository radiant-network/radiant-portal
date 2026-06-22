import{j as t}from"./iframe-CdF5EYmg.js";import{h as o}from"./index-DlbNcuff.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-BkDhfHkz.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-CHcB09tN.js";import{C as u,A as a}from"./applications-config-2QMXSYav.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CGGEywMz.js";import{a as m}from"./story-section-D4XYOw5I.js";import{B as F}from"./chunk-QUQL4437-CEaj0cJF.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BRruqAbc.js";import"./i18n-DK-5BTci.js";import"./index-Cp-tXBSJ.js";import"./filter-button-C19nPgk0.js";import"./checkbox-filter-DmQMY4MA.js";import"./checkbox-BviUR5mO.js";import"./index-CLRHU15o.js";import"./check-DTlfPsbg.js";import"./label-BpIFLQV1.js";import"./number-format-KkT7sorl.js";import"./badge-B7TJrOU1.js";import"./separator-DtNz95I0.js";import"./x-Ka5G_vgD.js";import"./button-DAc04O7O.js";import"./action-button-B-isfSdX.js";import"./dropdown-menu-C0WhWNZB.js";import"./index-BBuEL3vt.js";import"./index-BViuv1GS.js";import"./circle-DBjNND0v.js";import"./command-CHQ6aFTB.js";import"./dialog-KnAoCl-m.js";import"./popover-B076zbmv.js";import"./search-DfpYB9sL.js";import"./skeleton-BdSchkuJ.js";import"./test-tube-diagonal-CpGiPb8d.js";import"./user-Mbxbh1mX.js";import"./priority-indicator-C2srO4ue.js";import"./indicator-B0Y8693g.js";import"./shape-triangle-up-icon-Cj3_kozR.js";import"./refresh-ccw-Bs7T9c3W.js";import"./pen-DzxhNakC.js";import"./empty-cell-BVBs0gl8.js";import"./settings-B-hjadWn.js";import"./card-CEdZlC56.js";import"./pagination-B_vMQ9eB.js";import"./select-Dz6omk-5.js";import"./chevron-down-Dl7DQs9e.js";import"./chevron-up-BuqyGBOe.js";import"./ellipsis-B97kt93t.js";import"./empty-Cik6_nr1.js";import"./chevron-right-Dgs4y2U4.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
