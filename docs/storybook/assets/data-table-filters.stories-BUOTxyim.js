import{aq as c,j as t}from"./iframe-CaCkF73x.js";import{h as o}from"./index-BjnU0SdH.js";import{F as n}from"./case-exploration-table-filters-DABbyQqM.js";import{D as l,j as d,c as g}from"./data-table-BH0QLYD7.js";import{C as u,A as a}from"./applications-config-CO4Kr_GC.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-D2Y8usgy.js";import{a as p}from"./story-section-BzjNo_xI.js";import{d as m}from"./table-mock-lgNSdGyH.js";import{B as F}from"./chunk-BV7QT456-CnLZDjif.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CY5PYx5o.js";import"./filter-button-BdqZHaM5.js";import"./checkbox-filter-Barx3Uoj.js";import"./checkbox-7U0T_Qkr.js";import"./index-DLp2_g2a.js";import"./label-DBt1t2N1.js";import"./number-format-CKzbCZ2o.js";import"./badge-BLlr3_0o.js";import"./x-M9Dp6o6f.js";import"./command-Cu6yKoSg.js";import"./dialog-BX1mnstR.js";import"./popover-C9836Iqo.js";import"./search-BPxPI3NQ.js";import"./skeleton-il9ODNWx.js";import"./test-tube-diagonal-CJQowK5D.js";import"./user-BIkcVbgu.js";import"./priority-indicator-B157Cl7w.js";import"./indicator-m9kauIul.js";import"./shape-triangle-up-icon-kYFnMwfv.js";import"./status-badge-DcWofvZv.js";import"./rotate-ccw-nCh_LBr7.js";import"./isEqual-DE4mvTMe.js";import"./grip-vertical-DBjI9hXG.js";import"./settings-B90guOJo.js";import"./arrow-down-CXze5mj2.js";import"./card-CmGn_Clv.js";import"./pagination-DN_HRb93.js";import"./select-DgndmoGe.js";import"./chevron-down-BRag637f.js";import"./chevron-up-DrAwDhXK.js";import"./ellipsis-DzQWJR-C.js";import"./empty-C0F8igm0.js";import"./chevron-right-CYms1mZd.js";import"./_baseUniq-BMCYQAfD.js";import"./empty-cell-CVM4jjQh.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ue={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
