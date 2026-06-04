import{j as t}from"./iframe-C_PWKKnV.js";import{h as o}from"./index-BQR_gsab.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-DQr0I9eE.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DZUg_wKJ.js";import{C as u,A as a}from"./applications-config-CFmbQdDr.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-QwnkM_rp.js";import{a as m}from"./story-section-CfmadKEP.js";import{B as F}from"./chunk-QUQL4437-Br79iyOx.js";import"./preload-helper-PPVm8Dsz.js";import"./api-8h-D-eJL.js";import"./index-pWOEJb2O.js";import"./filter-button-DNecE3rQ.js";import"./checkbox-filter-GvWjidDL.js";import"./checkbox-JltLvucL.js";import"./index-CshBJO-E.js";import"./check-clqCtUO9.js";import"./label-D0gQMbwZ.js";import"./index-uHTs5ds7.js";import"./number-format-BsHS_7Y9.js";import"./i18n-4DRFLHh0.js";import"./badge-C32Elr7i.js";import"./separator-C7JFg-YV.js";import"./x-BsW-yT5v.js";import"./button-4T5xrZWi.js";import"./action-button-BwT2quuH.js";import"./dropdown-menu-CrzQycMh.js";import"./index-DYLnjilj.js";import"./index-DRcjtbHr.js";import"./circle-D7Nufxf-.js";import"./command-Ovbj7Hd0.js";import"./dialog-BEqPVi92.js";import"./popover-BdDUETSa.js";import"./search-BVTXV178.js";import"./skeleton-UNB62nCV.js";import"./test-tube-diagonal-D6W-j_UR.js";import"./user-D4_TJ7m3.js";import"./priority-indicator-DonW41eI.js";import"./indicator-BpsTHnn3.js";import"./shape-triangle-up-icon-CS1h-3Gf.js";import"./refresh-ccw-CJAddvnN.js";import"./pen-DFevG5A5.js";import"./empty-cell-DdFkj0H3.js";import"./settings-cGFisFnG.js";import"./card-BwGMQhgr.js";import"./pagination-Bzvt9nRC.js";import"./select-B2Rm4JGN.js";import"./chevron-down-B-WVu4yj.js";import"./chevron-up-DI9BGSa5.js";import"./ellipsis-CugijGDa.js";import"./empty-ohl9x1rc.js";import"./chevron-right-XjgurhlS.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
