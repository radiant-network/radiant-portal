import{j as t}from"./iframe-BAsE-9nr.js";import{h as o}from"./index-BpuB7F1K.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-2yAzW639.js";import{i as n,j as f,c as S}from"./data-table-DLzTLXsZ.js";import{C,A as a}from"./applications-config-x16GkZlu.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BhwK6LV7.js";import{e as h}from"./table-mock-DKx63VDz.js";import{B as R}from"./chunk-UVKPFVEO-KBLIJ-6Y.js";import"./preload-helper-Dp1pzeXC.js";import"./index-VM6ahCNw.js";import"./index-DCbbjWCX.js";import"./filter-button-FfZUu5l3.js";import"./badge-Dj_NjqYV.js";import"./separator-BSnX8uKr.js";import"./index-3Iyzi_TQ.js";import"./x-CcIjkE15.js";import"./button-BVOJ1Rjq.js";import"./action-button-CuRBRVrF.js";import"./dropdown-menu-COzY37Ex.js";import"./index-yd7gcPIb.js";import"./circle-Dq3Wd8Xs.js";import"./check-CU1Tlpvl.js";import"./i18n-R0qdnaoo.js";import"./checkbox-47ETRLqU.js";import"./index-DivVvw1b.js";import"./command-Dn9r8uVb.js";import"./dialog-dH-JVgjU.js";import"./popover-roERILNr.js";import"./search-BezQpLCD.js";import"./skeleton-Jtggg08Y.js";import"./test-tube-diagonal-DqG-qUsG.js";import"./user-BWy5Lr-z.js";import"./priority-indicator-2baWvCsg.js";import"./indicator-EBqwuBUd.js";import"./shape-triangle-up-icon-DDoKDV_S.js";import"./refresh-ccw-BVOqPj6c.js";import"./pen-VqGbQwF6.js";import"./isEqual-DHot85bd.js";import"./settings-BTgXu3L3.js";import"./number-format-RoD-IC9M.js";import"./card-Cb1vrSkD.js";import"./pagination-B9Fnup17.js";import"./select-B6Fbqkqa.js";import"./chevron-down-rs18DxWW.js";import"./chevron-up-DJBH6rnn.js";import"./ellipsis-CNZESiO2.js";import"./empty-CE22UWI8.js";import"./chevron-right-JM3EhkmB.js";import"./toString-DrE73sIm.js";import"./empty-cell-CJVW3pkJ.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
  render: args => <DataTable {...args} />
}`,...(m=(p=s.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var c,d,g;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
  render: args => <DataTable {...args} />
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const Re=["Loading","Default"];export{i as Default,s as Loading,Re as __namedExportsOrder,je as default};
