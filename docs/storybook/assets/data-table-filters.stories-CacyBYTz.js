import{j as t}from"./iframe-CUHTCraV.js";import{h as o}from"./index-COOt3gV6.js";import{i as c}from"./api-EcWoeBNP.js";import{F as n}from"./case-exploration-table-filters-BLdvw6nX.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DRQDSKtT.js";import{C as u,A as a}from"./applications-config-hZ36acRU.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-y5gKm_Cw.js";import{a as m}from"./story-section-B5jupzCR.js";import{B as F}from"./chunk-QUQL4437-CXCbdMIU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CwGeJV9O.js";import"./i18n-CvIos0gf.js";import"./index-DpmgubW-.js";import"./filter-button-DbC8Kz_A.js";import"./checkbox-filter-QPmr1sMw.js";import"./checkbox-lXilrK-s.js";import"./index-ArbR8u7G.js";import"./check-DnkkXyPO.js";import"./label-DzikIB7o.js";import"./number-format-BfW3DUY3.js";import"./badge-DC4SJPRX.js";import"./separator-Cfebd5mI.js";import"./x-CGOJ5MUH.js";import"./button-CZjHTKQy.js";import"./action-button-CdHWYpUk.js";import"./dropdown-menu-IpbMOAkX.js";import"./index-Cvvrdsfd.js";import"./index-Dd0IXZ1B.js";import"./circle-CpDNkknX.js";import"./command-DZhbKr4d.js";import"./dialog-D3qCFlYR.js";import"./popover-C_TEclPO.js";import"./search-XAKgsXAv.js";import"./skeleton-D_hJKoMU.js";import"./test-tube-diagonal-Cx2h4WU_.js";import"./user-Cr8LujXJ.js";import"./priority-indicator-E7YwnZB_.js";import"./indicator-AJIDXMD7.js";import"./shape-triangle-up-icon-Bp3HZcjl.js";import"./refresh-ccw-C3xc8_h-.js";import"./pen-C9NqaEsZ.js";import"./use-tenant-CSTecYKl.js";import"./api-LbIRQM0U.js";import"./empty-cell-D4yNNltc.js";import"./settings-D6FYMXty.js";import"./card-BwvmyX8o.js";import"./pagination-DWteSFg2.js";import"./select-CWJZWBZH.js";import"./chevron-down-DM-5xFmE.js";import"./chevron-up-IK9k29LV.js";import"./ellipsis-D99zKK8b.js";import"./empty-DM4phNjL.js";import"./chevron-right-FgePvFLX.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Ae=["Loading","Default"];export{i as Default,s as Loading,Ae as __namedExportsOrder,_e as default};
