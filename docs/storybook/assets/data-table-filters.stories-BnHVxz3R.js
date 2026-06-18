import{j as t}from"./iframe-C3tvUR1J.js";import{h as o}from"./index-DNxbsL1M.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-BTc29cTT.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-BkMN8jgx.js";import{C as u,A as a}from"./applications-config-CES-ACJK.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-BmjBlCIy.js";import{a as m}from"./story-section-Cml820jU.js";import{B as F}from"./chunk-QUQL4437-CRphbiH_.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BzF852Vm.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";import"./filter-button-BPGpGFbu.js";import"./checkbox-filter-DaT8dkJE.js";import"./checkbox-Zxibie3O.js";import"./index-BnzHzloH.js";import"./check-Cewv9fI2.js";import"./label-BAA81ssV.js";import"./index-wNbfclQ1.js";import"./number-format-DBZQhhow.js";import"./i18n-sXy_IXHd.js";import"./badge-D4PZM7uY.js";import"./separator-DYKEDePW.js";import"./x-QdJ2UURP.js";import"./button-DBxIrY1M.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./circle-B5BEDuQC.js";import"./command-EAo0lm30.js";import"./dialog-DPdch0D3.js";import"./popover-BUglsqDq.js";import"./search-rOHXVfJt.js";import"./skeleton-B0doAO5A.js";import"./test-tube-diagonal-CLgxsr7r.js";import"./user-Der1ILSA.js";import"./priority-indicator-BJklmCTb.js";import"./indicator-juu0DFZL.js";import"./shape-triangle-up-icon-DovjgO5w.js";import"./refresh-ccw-D_XN_Ymd.js";import"./pen-DaDzczXz.js";import"./empty-cell-Be5Gg78Y.js";import"./settings-Deq55io9.js";import"./card-COsSMpki.js";import"./pagination-DNdJcIek.js";import"./select-CexQazZ-.js";import"./chevron-down-D-F92SRE.js";import"./chevron-up-8kpNgi0N.js";import"./ellipsis-BomfqWnr.js";import"./empty-qeSGvgeB.js";import"./chevron-right-IdYogoK_.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
