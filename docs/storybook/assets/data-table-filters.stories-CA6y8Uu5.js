import{j as t}from"./iframe-CsmmCDil.js";import{h as o}from"./index-C0zb2qvr.js";import{a as c}from"./api-Dg2ayPVZ.js";import{F as n}from"./case-exploration-table-filters-B5XVXQI3.js";import{D as l,j as d,c as g}from"./data-table-B08VrbC8.js";import{C as u,A as a}from"./applications-config-hzvsWAMN.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-6-1u0R0c.js";import{a as p}from"./story-section-BruI3BJC.js";import{d as m}from"./table-mock-CBlAwPi4.js";import{B as F}from"./chunk-QUQL4437-Bk5fkFNP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DKAlTEAc.js";import"./i18n-CivhJ0zv.js";import"./index-BiNs9BjM.js";import"./filter-button-DcG4p2qm.js";import"./checkbox-filter-Hu66HQ0w.js";import"./checkbox-DwfY2O47.js";import"./index-B3EmbMI0.js";import"./check-Bvaswsz_.js";import"./label-8wYWr6_s.js";import"./number-format-D20ylwfQ.js";import"./badge-CuqrEnJU.js";import"./separator-Blqqu4Ag.js";import"./x-CdDvdrZW.js";import"./button-CLdXJbIO.js";import"./action-button-BXvWHX1M.js";import"./dropdown-menu-CMD-kT8U.js";import"./index-okOsg7fW.js";import"./index-DHlLYSd4.js";import"./circle-Bw4VVGH9.js";import"./command-DHRGf1iS.js";import"./dialog-BiSXNrkW.js";import"./popover-CFdfykkf.js";import"./search-B-52pNhg.js";import"./skeleton-DeKWitoV.js";import"./test-tube-diagonal-9QjWgUIo.js";import"./user-ywdYc6OS.js";import"./priority-indicator-BhnyGYXV.js";import"./indicator-DjdmpRM-.js";import"./shape-triangle-up-icon-CO7z_Ald.js";import"./refresh-ccw-D6euhKiu.js";import"./pen-BNLTprBF.js";import"./use-tenant-Cq-YZt5w.js";import"./api-BpqDmW87.js";import"./403-D7pTzzlT.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Bw8S1Ypq.js";import"./main-navbar-lang-switcher-CBFMNA_f.js";import"./isEqual-DWSx-o_j.js";import"./grip-vertical-BHq0HNbW.js";import"./settings-DM5eCBUw.js";import"./arrow-down-CtI0FY9_.js";import"./card-CBWOB264.js";import"./pagination-B6xt09Y4.js";import"./select-8mOdR0xp.js";import"./chevron-down-VxDw1YeZ.js";import"./chevron-up-Bbyu1-hW.js";import"./ellipsis-BR3UrxLT.js";import"./empty-DRKBz8i6.js";import"./chevron-right-uIAWFFfL.js";import"./_baseUniq-DfyqmZTu.js";import"./empty-cell-boVNgJ0J.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Oe=["Loading","Default"];export{s as Default,i as Loading,Oe as __namedExportsOrder,De as default};
