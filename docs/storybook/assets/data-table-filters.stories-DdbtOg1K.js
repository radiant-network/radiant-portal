import{j as t}from"./iframe-Bl6A8JHh.js";import{h as o}from"./index-DnucU2v0.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-71ic_1kl.js";import{k as l,X as d,c as g}from"./data-table-VMvp602V.js";import{C as u,A as a}from"./applications-config-IUrzjtem.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-YV0jpN_Q.js";import{a as p}from"./story-section-Buu6OzgL.js";import{i as m}from"./table-mock-BraPtQBc.js";import{B as F}from"./chunk-QUQL4437-BWpyoHQN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CUWZ69Sp.js";import"./i18n-CU5lE6mY.js";import"./index-EbWQjguD.js";import"./filter-button-uo6lAM_U.js";import"./checkbox-filter-DnSztu0w.js";import"./checkbox-D0r2BuSG.js";import"./index-DJ30ILYg.js";import"./check-unQJhoTi.js";import"./label-DA7PVQJW.js";import"./number-format-OxjuhIEW.js";import"./badge-Da4tqUkC.js";import"./separator-C0nFDG4e.js";import"./x-CPOpEMiU.js";import"./button-CtPLaqJS.js";import"./action-button-YErJw3iJ.js";import"./dropdown-menu-B_s2SHH-.js";import"./index-LoDBT14K.js";import"./index-D7r_obL0.js";import"./circle-BRirejCk.js";import"./command-BFFstbgf.js";import"./dialog-BuxJAudh.js";import"./popover-HC32ocFi.js";import"./search-BKhulqyv.js";import"./skeleton-tXG1-Wzm.js";import"./test-tube-diagonal-DPxIiqNI.js";import"./user-BsasmAHW.js";import"./priority-indicator-DdNRdQqM.js";import"./indicator-dP_qNzmU.js";import"./shape-triangle-up-icon-CskaiaWT.js";import"./refresh-ccw-CH4v8YdY.js";import"./pen-BLvhqR86.js";import"./use-tenant-D4d-d1lx.js";import"./api-BjHhlcVm.js";import"./grip-vertical-Df7ZWXHZ.js";import"./settings-ulKJzJBU.js";import"./card-DCdExfeh.js";import"./pagination-lvbk16S-.js";import"./select-F2ggjDKn.js";import"./chevron-down-BFz9PjCZ.js";import"./chevron-up-bqvYKDt_.js";import"./ellipsis-CKET5ZXK.js";import"./empty-0gPqykEM.js";import"./chevron-right-BvsIacnX.js";import"./empty-cell-Dxk9KK8X.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
