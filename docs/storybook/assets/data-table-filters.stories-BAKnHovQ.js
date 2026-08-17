import{j as t}from"./iframe-D7ER49TR.js";import{h as o}from"./index-MdIc24GS.js";import{a as c}from"./api-V3_aiIEN.js";import{F as n}from"./case-exploration-table-filters-DrV4C02P.js";import{D as l,j as d,c as g}from"./data-table-WDgiZPpD.js";import{C as u,A as a}from"./applications-config-ChR6cj1x.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-1-iuNCPS.js";import{a as p}from"./story-section-T7092GL1.js";import{d as m}from"./table-mock-DFWqgBvL.js";import{B as F}from"./chunk-QUQL4437-XgJlaJMU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BCwoMdXb.js";import"./i18n-D0rznIQh.js";import"./index-oucxxOkI.js";import"./filter-button-CqLr_C1S.js";import"./checkbox-filter-DiLTFTrW.js";import"./checkbox-DagekB4j.js";import"./index-BXytAHNb.js";import"./check-Dm7HKO46.js";import"./label-COAHrHCp.js";import"./number-format-C7DceE5t.js";import"./badge-BqWCrYwl.js";import"./separator-BkZFpBO0.js";import"./x-DaMWe1QI.js";import"./button-P2tNjpVJ.js";import"./action-button-D6y5Szv8.js";import"./dropdown-menu-DgcnzvDN.js";import"./index-B6dqpAEy.js";import"./index-Dud_FKwN.js";import"./circle-CgC-JePX.js";import"./command-DRMBUfZj.js";import"./dialog-DIUfN6-u.js";import"./popover-DJVuQtpP.js";import"./search-0TUbM7DQ.js";import"./skeleton-D1YXgtsx.js";import"./test-tube-diagonal-BYK4KBXH.js";import"./user-C5cJjrLy.js";import"./priority-indicator-D1wy7GsX.js";import"./indicator-mB5jO8fY.js";import"./shape-triangle-up-icon-BxlAb2GW.js";import"./refresh-ccw-BcgRjjKa.js";import"./pen-DJulMZSK.js";import"./use-tenant-rYDy-wfc.js";import"./api-D846dPTc.js";import"./403-CG26SCdL.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-DLZizhCh.js";import"./main-navbar-lang-switcher-DOeBKQKA.js";import"./isEqual-BJa4-MHG.js";import"./grip-vertical-CD2vzkrJ.js";import"./settings-CE5U0AOq.js";import"./arrow-down-CmxZvWoH.js";import"./card-Cew61GTv.js";import"./pagination-DsF_Lqf6.js";import"./select-JRUfPy_D.js";import"./chevron-down-BWqUtUCR.js";import"./chevron-up-Cu0qxLOQ.js";import"./ellipsis-l8HX8mgV.js";import"./empty-CnCUTl-Q.js";import"./chevron-right-BqeK5SHb.js";import"./_baseUniq-oBAXqYAD.js";import"./empty-cell-Ctp0FlqL.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
