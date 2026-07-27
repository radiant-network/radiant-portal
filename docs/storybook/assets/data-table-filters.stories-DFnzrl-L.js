import{j as t}from"./iframe-DzVRG0r9.js";import{h as o}from"./index-BKJD7rXb.js";import{a as c}from"./api-DuoS2o1G.js";import{F as n}from"./case-exploration-table-filters-_xcAbq1E.js";import{k as l,X as d,c as g}from"./data-table-hAltcfpL.js";import{C as u,A as a}from"./applications-config-Di_8WoK7.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-o4_Ee0gt.js";import{a as p}from"./story-section-BRJcsgp1.js";import{i as m}from"./table-mock-COs49OfE.js";import{B as F}from"./chunk-QUQL4437-DWPaAJsn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DjZ7HRKs.js";import"./i18n-Bn2K8w1P.js";import"./index-C6QLw8t0.js";import"./filter-button-CJIJwi7i.js";import"./checkbox-filter-BLwsL3Aa.js";import"./checkbox-DGftdyXk.js";import"./index-CDwus7Rh.js";import"./check-qyzdVwIr.js";import"./label-CKhmEl4b.js";import"./number-format-CXLQB-Ee.js";import"./badge-rYJpnog3.js";import"./separator-ZGlyiOtt.js";import"./x-B8zK8r-M.js";import"./button-CC3aT9NM.js";import"./action-button-iayBLEBs.js";import"./dropdown-menu-pNKsTklX.js";import"./index-BJp1TG9L.js";import"./index-OG0Rd7xy.js";import"./circle-DNcTvxaO.js";import"./command-DMcA6PBs.js";import"./dialog-JzT9b40Y.js";import"./popover-tbQLJwdT.js";import"./search-BpGk4Du8.js";import"./skeleton-Byofp1JD.js";import"./test-tube-diagonal-DnmW4VyB.js";import"./user-Ck5_tULR.js";import"./priority-indicator-C1aFNPBd.js";import"./indicator-deQiKxue.js";import"./shape-triangle-up-icon-D0oInfrs.js";import"./refresh-ccw-ebUgQIhq.js";import"./pen-CsIgtx0x.js";import"./use-tenant-HmfS7JDg.js";import"./api-DxuPvJi3.js";import"./403-mlWohY-o.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CPa5pX_c.js";import"./main-navbar-lang-switcher-CLnfX60N.js";import"./grip-vertical-DHGjdl93.js";import"./settings-DLIGtJ3o.js";import"./arrow-down-By1xF-bv.js";import"./card-B-RYfBtb.js";import"./pagination-_LXiPunK.js";import"./select-CyETnAb-.js";import"./chevron-down-CKHABaFZ.js";import"./chevron-up-b_JWQVHf.js";import"./ellipsis-C49m7x3u.js";import"./empty-BdIU6T82.js";import"./chevron-right-vEDmtbtj.js";import"./empty-cell-CwUgi-WM.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Te=["Loading","Default"];export{s as Default,i as Loading,Te as __namedExportsOrder,Pe as default};
