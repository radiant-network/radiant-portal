import{aq as c,j as t}from"./iframe-CgZaKe5d.js";import{h as o}from"./index-Co9-r5az.js";import{F as n}from"./case-exploration-table-filters-Fxd5J4AX.js";import{D as l,j as d,c as g}from"./data-table-BK2zokkK.js";import{C as u,A as a}from"./applications-config-Ci4Z5Tuj.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-Cnd5sUyU.js";import{a as p}from"./story-section-Cd-IQlgl.js";import{d as m}from"./table-mock-PdJ-PrIm.js";import{B as F}from"./chunk-QUQL4437-kktIQY6E.js";import"./preload-helper-PPVm8Dsz.js";import"./index-UdOaDqtK.js";import"./filter-button-DcGd-3gK.js";import"./checkbox-filter-DAe_Avh7.js";import"./checkbox-DcjH3Pt0.js";import"./index-BTySKr1x.js";import"./label-C-mLdX7m.js";import"./number-format-gi98STWl.js";import"./badge-Dyg9dEFi.js";import"./x-C9LJTscZ.js";import"./command-BaJw4-51.js";import"./dialog-P8uD31mQ.js";import"./popover-DDZSXOOd.js";import"./search-omVJqrmb.js";import"./skeleton-Y9K1ks3z.js";import"./test-tube-diagonal-DLV3R9uX.js";import"./user-9xVxgcUq.js";import"./priority-indicator-__j1Fy_b.js";import"./indicator-DXAhJ-Oz.js";import"./shape-triangle-up-icon-BccBKwJ5.js";import"./status-badge-cRBtCRiv.js";import"./rotate-ccw-DaFeRErV.js";import"./isEqual-Dr7Tlwk4.js";import"./grip-vertical-BFflvjvL.js";import"./settings-CJ6rgyvL.js";import"./arrow-down-CaJyK_9-.js";import"./card-CtUiCFoJ.js";import"./pagination-B_M8Qeek.js";import"./select-K8-oRLYm.js";import"./chevron-down-Dw7IURaJ.js";import"./chevron-up-Bi1LZccM.js";import"./ellipsis-ByFW0juB.js";import"./empty-CAyHV_CU.js";import"./chevron-right-HkdTfvnM.js";import"./_baseUniq-BGP5q6bI.js";import"./empty-cell-2Qf7_VxR.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ue={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
