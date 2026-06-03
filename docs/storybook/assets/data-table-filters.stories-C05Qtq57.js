import{j as t}from"./iframe-ELwkN4WH.js";import{h as o}from"./index-C_1ReyYL.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-BlCwYIkZ.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DIEA6DFI.js";import{C as u,A as a}from"./applications-config-DpY0c-HV.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Bmm2Nka1.js";import{a as m}from"./story-section-BW9mZuMq.js";import{B as F}from"./chunk-QUQL4437-Bw3QsHpJ.js";import"./preload-helper-PPVm8Dsz.js";import"./api-1Xb3GPSC.js";import"./index-BIP8QzMY.js";import"./filter-button-CdJr1Pav.js";import"./checkbox-filter-CCbtXio3.js";import"./checkbox-DnJj7PCl.js";import"./index-B9Ci0RJj.js";import"./check-BwKrSwsD.js";import"./label-DyZuULkd.js";import"./index-Ct7crFnJ.js";import"./number-format-D2MWw9Rk.js";import"./i18n-DRl3AD0J.js";import"./badge-CITMBpjG.js";import"./separator-DOzexuXx.js";import"./x-DqX6VLl3.js";import"./button-DVxJRXa8.js";import"./action-button-B8RD553Y.js";import"./dropdown-menu-B5W2V41I.js";import"./index-DrATjyRU.js";import"./index-Ts0_7Z4Q.js";import"./circle-BM1LvZdU.js";import"./command-CWiNutaF.js";import"./dialog-C5TPr1FY.js";import"./popover-BKZ5uJ45.js";import"./search-D-Rq146W.js";import"./skeleton-BIHzEaix.js";import"./test-tube-diagonal-CaPYOc7n.js";import"./user-BdQ5QAja.js";import"./priority-indicator-CuFxdp22.js";import"./indicator-CL3khLLq.js";import"./shape-triangle-up-icon-DSdiMzDH.js";import"./refresh-ccw-BYtAPv2P.js";import"./pen-C6c0Pzbd.js";import"./empty-cell-dVEaomqI.js";import"./settings-2_pDsX2q.js";import"./card-8IRv93Pp.js";import"./pagination-CddB70Bu.js";import"./select-CYYaHTyX.js";import"./chevron-down-DdHLcJkA.js";import"./chevron-up-BJ4hpMsP.js";import"./ellipsis-CqwrubDk.js";import"./empty-C0TuY7bW.js";import"./chevron-right-DF32hfny.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
