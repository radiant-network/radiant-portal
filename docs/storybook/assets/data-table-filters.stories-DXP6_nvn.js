import{j as t}from"./iframe-B_jnDYRw.js";import{h as o}from"./index-B9AgPsik.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-BAEEne4J.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-DMD9ANy3.js";import{C as u,A as a}from"./applications-config-CKqGnMom.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DHgTjuEx.js";import{a as m}from"./story-section-4RqDghQR.js";import{B as F}from"./chunk-QUQL4437-vQztLMpV.js";import"./preload-helper-PPVm8Dsz.js";import"./api-7mgpSi2y.js";import"./index-BnQ-eqKb.js";import"./index-BLQqHNw6.js";import"./filter-button-BtuKKl-7.js";import"./checkbox-filter-D-JeTPow.js";import"./checkbox-Dfk9EJSy.js";import"./index-CyybKVzP.js";import"./check-DnHgWdHC.js";import"./label-93OlOPYV.js";import"./index-DfeYIiAg.js";import"./number-format-BDCtFYri.js";import"./i18n-Dc-D14XP.js";import"./badge-CrVePRVQ.js";import"./separator-C2WPDGRO.js";import"./x-Cv5nq-WI.js";import"./button-CspqOU_f.js";import"./action-button-sxXzUOnj.js";import"./dropdown-menu-DdhXS6nr.js";import"./index-3VdlNnLx.js";import"./index-J2Zi4jnN.js";import"./circle-DM65GupB.js";import"./command-CUSjpYhs.js";import"./dialog-BrafRdLg.js";import"./popover-BBN0rCPQ.js";import"./search-BxDf4MKB.js";import"./skeleton-B-qS3b8Q.js";import"./test-tube-diagonal-YpBYSGVp.js";import"./user-BCFeSdj8.js";import"./priority-indicator-D0NdBN1g.js";import"./indicator--zmVZHfp.js";import"./shape-triangle-up-icon-DTYYxanl.js";import"./refresh-ccw-BufLmB8a.js";import"./pen-Ehza42GC.js";import"./empty-cell-B6uSCMCD.js";import"./settings-BvfHU7Kf.js";import"./card-D8DmygJj.js";import"./pagination-CfpZpfJA.js";import"./select-DCRJKIcC.js";import"./chevron-down-BZpqP0_y.js";import"./chevron-up-B1Ma4yw3.js";import"./ellipsis-Dcq_vmAD.js";import"./empty-BfmWLrk0.js";import"./chevron-right-CXhS60Hk.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
