import{aq as c,j as t}from"./iframe-DY5-UQdi.js";import{h as o}from"./index-CLsCKOiP.js";import{F as n}from"./case-exploration-table-filters-BwADZiSZ.js";import{D as l,j as d,c as g}from"./data-table-BTeERgPP.js";import{C as u,A as a}from"./applications-config-JXvOJz-U.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-VwML2LkI.js";import{a as p}from"./story-section-BfGxLv6g.js";import{d as m}from"./table-mock-gj6UzIq3.js";import{B as F}from"./chunk-BV7QT456-BXYyrak3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DaT1HPA4.js";import"./filter-button-CrxHod--.js";import"./checkbox-filter-CODCyoWD.js";import"./checkbox-DcfXN5QA.js";import"./index-CsUfQK--.js";import"./label-CvVqBD9q.js";import"./number-format-Cew6Hgcx.js";import"./badge-ihkBqefc.js";import"./x-CLuQ0dgg.js";import"./command-Y0jIbzC5.js";import"./dialog-Y8Mq6ZKJ.js";import"./popover-B2llYNmG.js";import"./search-BkllAiPf.js";import"./skeleton-Prw77uM6.js";import"./test-tube-diagonal-BtBXOqwG.js";import"./user-DicrVcQZ.js";import"./priority-indicator-BefmIZpl.js";import"./indicator-D7eI3wSo.js";import"./shape-triangle-up-icon-Do9FBk7o.js";import"./status-badge-DgC2xIDN.js";import"./rotate-ccw-CMwqgyB7.js";import"./isEqual-BxkJ7E08.js";import"./grip-vertical-BVd6dyer.js";import"./settings-DDgyJ1dC.js";import"./arrow-down-BUNEbmlQ.js";import"./card-TIdkib2d.js";import"./pagination-B2WE93KB.js";import"./select-BINj5e7k.js";import"./chevron-down-CuFVitgA.js";import"./chevron-up-BdGu8OZl.js";import"./ellipsis-CT0GyftL.js";import"./empty-BduV2HPi.js";import"./chevron-right-CX53cA8I.js";import"./_baseUniq-B-T3ui6C.js";import"./empty-cell-v9ZSJON_.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ue={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Loading","Default"];export{i as Default,s as Loading,he as __namedExportsOrder,ue as default};
