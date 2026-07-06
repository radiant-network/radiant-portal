import{j as t}from"./iframe-jfSntGFs.js";import{h as o}from"./index-B1bgWAFU.js";import{i as c}from"./api-5e3Wi7_0.js";import{F as n}from"./case-exploration-table-filters-B00DCQMZ.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-BN5BPZ-I.js";import{C as u,A as a}from"./applications-config-MZKwyF-l.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DkKBGE0_.js";import{a as m}from"./story-section-r6zyD_Yn.js";import{B as F}from"./chunk-QUQL4437-BJ_q9AOa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BX1QaFoP.js";import"./i18n-DbzI5Go-.js";import"./index-BY4vqhHc.js";import"./filter-button-Gz9zaRin.js";import"./checkbox-filter-DA6xQ4Ih.js";import"./checkbox-Cbw8d62y.js";import"./index-CR3ShZdK.js";import"./check-2HNr6tyJ.js";import"./label-BNd_VEZG.js";import"./number-format-DpW0ogee.js";import"./badge-Dltaja8g.js";import"./separator-D0D5PPNv.js";import"./x-BPVOKH4R.js";import"./button-CAlT18JI.js";import"./action-button-DZrA5QIj.js";import"./dropdown-menu-BpGYzQEF.js";import"./index-CBbYNmYq.js";import"./index-DkhoqGQW.js";import"./circle-DNNkSORW.js";import"./command-CzOD1kII.js";import"./dialog-SP-3bDKq.js";import"./popover-CpAJw3Kd.js";import"./search-BM2xIRyf.js";import"./skeleton-DyY0-JG0.js";import"./test-tube-diagonal-DGnHf9rW.js";import"./user-DSEatZx0.js";import"./priority-indicator-NIMXqFoS.js";import"./indicator-DW-Hyr6q.js";import"./shape-triangle-up-icon-BpbryOqc.js";import"./refresh-ccw-C4dKTWEc.js";import"./pen-CxeK26e5.js";import"./use-tenant-Dhby9B6w.js";import"./api-CRUcq8iX.js";import"./empty-cell-BwYLXZke.js";import"./grip-vertical-wZGP6Okm.js";import"./settings-YTb4WAK2.js";import"./card-CA_RANMN.js";import"./pagination-Bp77wGKt.js";import"./select-BDUKB6z8.js";import"./chevron-down-DMxzHxgk.js";import"./chevron-up-BFl4QShq.js";import"./ellipsis-BgA7CLjR.js";import"./empty-DYCX7064.js";import"./chevron-right-BdJuRBSq.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
