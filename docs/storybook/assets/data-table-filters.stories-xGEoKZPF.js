import{j as t}from"./iframe-iTti_pyP.js";import{h as o}from"./index-D34OhmGL.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-wEQMB12E.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-Jiz-cEDY.js";import{C as u,A as a}from"./applications-config-BBqjq0IL.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-bVi4Tfuy.js";import{a as m}from"./story-section-j7yPxqOK.js";import{B as F}from"./chunk-QUQL4437-B96YQiWD.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DuAKrHCm.js";import"./index-DDx7eZJ9.js";import"./filter-button-ChA2Qcrt.js";import"./checkbox-filter-BFO-DKFh.js";import"./checkbox-18c2Zthj.js";import"./index-BkDmPPzg.js";import"./check-6NEOXGRc.js";import"./label-DWNTdL0Z.js";import"./index-Da66sVI7.js";import"./number-format-CWowT-wl.js";import"./i18n-D7u3QZ6s.js";import"./badge-BVLQD79v.js";import"./separator-C80gP3l5.js";import"./x-CnmNbzCA.js";import"./button-cGiv4dYx.js";import"./action-button-DqTAdIxg.js";import"./dropdown-menu-DjOLwECI.js";import"./index-DWvOSxA9.js";import"./index-gWb2WLOK.js";import"./circle-S0Ha6SNG.js";import"./command-BI11jVcb.js";import"./dialog-DPzKqq5H.js";import"./popover-DiblySSi.js";import"./search-D0c-W1hF.js";import"./skeleton-jP3ldIdQ.js";import"./test-tube-diagonal-BfUiM8Hz.js";import"./user-CRrOrZBO.js";import"./priority-indicator-C0EuZrI9.js";import"./indicator-DBdHD4fP.js";import"./shape-triangle-up-icon-ojAu7MvL.js";import"./refresh-ccw-DxYPa-T1.js";import"./pen-CszZN3C8.js";import"./empty-cell-DdIXBgLo.js";import"./settings-By_EuqJv.js";import"./card-B0SNbqfY.js";import"./pagination-BQnhME3s.js";import"./select-BxW2dOwj.js";import"./chevron-down-D-qbVmgo.js";import"./chevron-up-Bg3y9tqj.js";import"./ellipsis-HOhACFoB.js";import"./empty-BQPDZ8Cc.js";import"./chevron-right-Ml8Z0kgq.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
