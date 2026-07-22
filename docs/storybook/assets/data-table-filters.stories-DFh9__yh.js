import{j as t}from"./iframe-BZB1EZgz.js";import{h as o}from"./index-CTvBQX0k.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-Cy9whGI6.js";import{k as l,X as d,c as g}from"./data-table-DbsnRsMU.js";import{C as u,A as a}from"./applications-config-Dhcm9CTZ.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-aTHier_8.js";import{a as p}from"./story-section-BDrkXYOE.js";import{i as m}from"./table-mock-62R3RhZ9.js";import{B as F}from"./chunk-QUQL4437-J1g7m8io.js";import"./preload-helper-PPVm8Dsz.js";import"./index-dDTSyc7s.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./filter-button-DCeo5uz1.js";import"./checkbox-filter-LIoHqSmh.js";import"./checkbox-pa3Ab340.js";import"./index-G1LsBEqa.js";import"./check-HFbzKaow.js";import"./label-Fj5P-8Ic.js";import"./number-format-BKWDmZlL.js";import"./badge-CA8jRcSR.js";import"./separator-CcqX_m5t.js";import"./x-LwuAy0Kk.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./circle-Dh8DU7_a.js";import"./command-BqssCaSe.js";import"./dialog-Nj6sToRj.js";import"./popover-MiFNknac.js";import"./search-D_3yD3tJ.js";import"./skeleton-DHJgqS_q.js";import"./test-tube-diagonal-CR7YiSrI.js";import"./user-CMG3vbSg.js";import"./priority-indicator-BK6Iq4EH.js";import"./indicator-9vNsyUFZ.js";import"./shape-triangle-up-icon-Bc8WugWd.js";import"./refresh-ccw-T8CT6T8d.js";import"./pen-81etmRyZ.js";import"./use-tenant-v6jBTy8h.js";import"./api-BKer6Fgf.js";import"./403-DSnqBtKP.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CxU2bW_8.js";import"./main-navbar-lang-switcher-BG69NrFp.js";import"./grip-vertical-BJEcIVCL.js";import"./settings-BNy77xgD.js";import"./card-Jp7Ep4kc.js";import"./pagination-CNT0KR1W.js";import"./select-C39wRMRX.js";import"./chevron-down-Ck5_M-zO.js";import"./chevron-up-Clj0RsFp.js";import"./ellipsis-Bl-OUMF0.js";import"./empty-CihgtWp7.js";import"./chevron-right-BUpYXYPL.js";import"./empty-cell-CrwxlRge.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Loading","Default"];export{i as Default,s as Loading,Pe as __namedExportsOrder,Ne as default};
