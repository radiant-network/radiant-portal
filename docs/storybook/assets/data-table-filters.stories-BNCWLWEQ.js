import{j as t}from"./iframe-BwgnBgbs.js";import{h as o}from"./index-BUC84PE7.js";import{a as c}from"./api-CbXfKFEH.js";import{F as n}from"./case-exploration-table-filters-Vi7_714l.js";import{k as l,X as d,c as g}from"./data-table-BjjZy79s.js";import{C as u,A as a}from"./applications-config-82us2Psj.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DY2Ep31U.js";import{a as p}from"./story-section-CUmPhl8T.js";import{i as m}from"./table-mock-CHPBe7i6.js";import{B as F}from"./chunk-QUQL4437-BhUmmbyj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-XsBXfm3q.js";import"./i18n-q3nsv9wg.js";import"./index-9G14H1gK.js";import"./filter-button-B025c764.js";import"./checkbox-filter-TNmz0wN8.js";import"./checkbox-CtmgtvPd.js";import"./index-CHxf_95e.js";import"./check-BmfiAxZ2.js";import"./label-BMzq2NJa.js";import"./number-format-Cz4nVEIV.js";import"./badge-BRUmHD8A.js";import"./separator-B4ksv8En.js";import"./x-CRkQviaL.js";import"./button-CVRshTFc.js";import"./action-button-DfTzlCGI.js";import"./dropdown-menu-CUFPYByL.js";import"./index-E0yEPtnq.js";import"./index-BbLf2bTU.js";import"./circle-C8kpohc-.js";import"./command-B9IiFIb_.js";import"./dialog-fjUmbJAq.js";import"./popover-CHTBBHtG.js";import"./search-D5aCVLdd.js";import"./skeleton-Bla1fROo.js";import"./test-tube-diagonal-DzZ_T4R8.js";import"./user-DT_yvsnI.js";import"./priority-indicator-BG4hzS3W.js";import"./indicator-C5ZMCXSl.js";import"./shape-triangle-up-icon-hSjl-yZp.js";import"./refresh-ccw-hQKKg8GB.js";import"./pen-DUpREdX4.js";import"./use-tenant-BmU-1imR.js";import"./api-J3_QhqET.js";import"./403-DTdwoXGJ.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Cz1IxsL7.js";import"./main-navbar-lang-switcher-CfCiSgPt.js";import"./grip-vertical-BET5q44K.js";import"./settings-Bg33V425.js";import"./arrow-down-BjZhZEcq.js";import"./card-DIfqeshF.js";import"./pagination-jvvE6-Sd.js";import"./select-DeYhDa5M.js";import"./chevron-down-lCBDOm8X.js";import"./chevron-up-DYtU6bDA.js";import"./ellipsis-DWG2j8no.js";import"./empty-Jr-y3xnP.js";import"./chevron-right-Cdw5UlWd.js";import"./empty-cell-De6TZTaX.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
