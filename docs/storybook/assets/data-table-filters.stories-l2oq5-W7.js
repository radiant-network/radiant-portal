import{j as t}from"./iframe--Wr8akaj.js";import{h as o}from"./index-BNvLVGFb.js";import{i as c}from"./api-5e3Wi7_0.js";import{F as n}from"./case-exploration-table-filters-CHWaH7It.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-BzAkxg5H.js";import{C as u,A as a}from"./applications-config-Bam6cSsz.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-XrA51M-Q.js";import{a as m}from"./story-section-mf2KVIsr.js";import{B as F}from"./chunk-QUQL4437-csEiRURN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CKFT6Hhx.js";import"./i18n-Bg6Ec5jw.js";import"./index-C36_LE4b.js";import"./filter-button-1tIWb4on.js";import"./checkbox-filter-C03BHojh.js";import"./checkbox-0TbOjt2k.js";import"./index-BbAU48IZ.js";import"./check-DN_rAFtv.js";import"./label-BV5ASGe5.js";import"./number-format-DCAWNaQq.js";import"./badge-BFlBkB0h.js";import"./separator-DW3W07XT.js";import"./x-D_rtmg3q.js";import"./button-AGQ9gLKF.js";import"./action-button-B8HAWUkq.js";import"./dropdown-menu-D__ES2m4.js";import"./index-D5QIG_v-.js";import"./index-CHj75zQJ.js";import"./circle-kD5s09G8.js";import"./command-DzaYp63o.js";import"./dialog-Du84_yDG.js";import"./popover-7gu0n4w5.js";import"./search-Ce1cbsgH.js";import"./skeleton-BMw6N2bI.js";import"./test-tube-diagonal-DZGM069n.js";import"./user-BK1SoJKo.js";import"./priority-indicator-xjSoBEKB.js";import"./indicator-DS6vNTyC.js";import"./shape-triangle-up-icon-B70qI_9a.js";import"./refresh-ccw-z3mLN8Ii.js";import"./pen-KwmJ0oXq.js";import"./use-tenant-CrIXgj1f.js";import"./api-CRUcq8iX.js";import"./empty-cell-DoBGr32L.js";import"./grip-vertical-Btz0fMlK.js";import"./settings-BfSrJSYN.js";import"./card-D1L_a8Ku.js";import"./pagination-BD816UGq.js";import"./select-C4YeHwvI.js";import"./chevron-down-DuUsgp_1.js";import"./chevron-up-DPnOSZh7.js";import"./ellipsis-DuI-Gu5X.js";import"./empty-vIPglIxh.js";import"./chevron-right-BQ29uH9H.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
