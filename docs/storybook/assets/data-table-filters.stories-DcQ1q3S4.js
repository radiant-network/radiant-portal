import{j as t}from"./iframe-D5nbMH0Z.js";import{h as o}from"./index-CI127spG.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-TAIHH8rI.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-Cd91Yh4a.js";import{C as u,A as a}from"./applications-config-Dcz3osLJ.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-aEnHMPFy.js";import{a as m}from"./story-section-DfWRQdTn.js";import{B as F}from"./chunk-QUQL4437-BYuO-HFN.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Dx_IKiyr.js";import"./index-inuiUwi3.js";import"./index-CJ_W4xqL.js";import"./filter-button--thYbfug.js";import"./checkbox-filter-CIpbJyWb.js";import"./checkbox-C5QrBdbS.js";import"./index-BjE8bgGA.js";import"./check-DI_qTPcP.js";import"./label-DAYBDqXe.js";import"./index-Cc9ovpm8.js";import"./number-format-C34Lb5fS.js";import"./i18n-Bdg0oCKu.js";import"./badge-Dy7MQtY_.js";import"./separator-DOf7FV04.js";import"./x-CmBLWl3D.js";import"./button-CivLk_fn.js";import"./action-button-CRlVI-Q0.js";import"./dropdown-menu-DXt4HdYg.js";import"./index-Coy-0tiE.js";import"./index-C8YmK8nx.js";import"./circle-C9-1AW9v.js";import"./command-CbaDUmyb.js";import"./dialog-CZo2YrzI.js";import"./popover-DMlYzQoR.js";import"./search-CEYrUhrQ.js";import"./skeleton-h3nIrjte.js";import"./test-tube-diagonal-Dwz-FkU8.js";import"./user-CNjk9muP.js";import"./priority-indicator-CRSyI7XP.js";import"./indicator-BBCMcWsH.js";import"./shape-triangle-up-icon-DLF73kG-.js";import"./refresh-ccw-DRzr5LXb.js";import"./pen-C0Ff2Jb_.js";import"./empty-cell-CoZM7KO-.js";import"./settings-Bra4GCrY.js";import"./card-CIkGWAo4.js";import"./pagination-Dww3rbrT.js";import"./select-Des3ZHYN.js";import"./chevron-down-CuefHHFR.js";import"./chevron-up-RkPOjbTk.js";import"./ellipsis-DicQpIFY.js";import"./empty-BFUqMATu.js";import"./chevron-right-P3DuuAF_.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
