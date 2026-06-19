import{j as t}from"./iframe-jcf7vZ_R.js";import{h as o}from"./index-BiD-JOhD.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-B72kqv4V.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DJTDp9pm.js";import{C as u,A as a}from"./applications-config-CrN8ifR1.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CAj3KM1P.js";import{a as m}from"./story-section-Cpqu6Cmt.js";import{B as F}from"./chunk-QUQL4437-NFsSyaH3.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BN29XHyi.js";import"./index-B7ISGQ50.js";import"./index-CMj8FLxF.js";import"./filter-button-A8GBcjpk.js";import"./checkbox-filter-ACg13tE3.js";import"./checkbox-DqoFEh4o.js";import"./index-CiCOYGE9.js";import"./check-DnaYg78d.js";import"./label-C3r2BlYL.js";import"./index-z6U6JLum.js";import"./number-format-D-2vFrC_.js";import"./i18n-TdHrRC51.js";import"./badge-B8wLsB78.js";import"./separator-etdbqUam.js";import"./x-CsZYw6Ul.js";import"./button-Bifjei_v.js";import"./action-button-i99sGQY1.js";import"./dropdown-menu-HcH6XyTZ.js";import"./index-mGHp8w0J.js";import"./index-DCUZMTcN.js";import"./circle-CbUZSSHN.js";import"./command-sbJGh4Qm.js";import"./dialog-DUCKpv1W.js";import"./popover-B17-J3b5.js";import"./search-CfYAx2OR.js";import"./skeleton-Dh6-RIZO.js";import"./test-tube-diagonal-C_pyL-lt.js";import"./user-DV0nmNYs.js";import"./priority-indicator-BZ-yak4x.js";import"./indicator-DRRs_jFM.js";import"./shape-triangle-up-icon-BDO8SaW7.js";import"./refresh-ccw-BmGfR14Y.js";import"./pen-Qlbv-cJI.js";import"./empty-cell-CPjTexzF.js";import"./settings-BnPD5RAU.js";import"./card-BB9gTXSo.js";import"./pagination-rsux0PHc.js";import"./select-C4DAmtax.js";import"./chevron-down-BsOjEoAv.js";import"./chevron-up-DxyCK08X.js";import"./ellipsis-BQmN5NpN.js";import"./empty-8oUN21AK.js";import"./chevron-right-CzeDdmNq.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
