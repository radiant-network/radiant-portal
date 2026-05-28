import{j as t}from"./iframe-CnZJoeJJ.js";import{h as o}from"./index-s4igxNLI.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-DK2ptu2R.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-Cuyfj1Dg.js";import{C,A as a}from"./applications-config-CA5Ya-5E.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-C-1hKQC5.js";import{B as R}from"./chunk-UVKPFVEO-sCGE3aLV.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DyXFduvr.js";import"./index-nnISLG97.js";import"./filter-button-BDoxYmeo.js";import"./badge-Mu2gJBHC.js";import"./separator-CsnJdABl.js";import"./index-CCfIwpUx.js";import"./x-DdTkrJzs.js";import"./button-Cm-qWUZj.js";import"./action-button-DwChNtIi.js";import"./dropdown-menu-DeZ0tcSb.js";import"./index-Cgb4Wh9n.js";import"./index-IcRN2maX.js";import"./check-CzTwhE4v.js";import"./circle-DchfHJD1.js";import"./i18n-GxkGN4Zu.js";import"./checkbox-Bjtsgzyf.js";import"./index-BhvWJFy5.js";import"./command-DYQ7K8z9.js";import"./dialog-DxNurTZQ.js";import"./popover-BwK63eY7.js";import"./search-DW7q5HvB.js";import"./skeleton-DPeozCI6.js";import"./test-tube-diagonal-Dgul7yBJ.js";import"./user-B-GkaGtT.js";import"./priority-indicator-CAlhZpJ7.js";import"./indicator-DsXoMlvD.js";import"./shape-triangle-up-icon-DZ8wkZLb.js";import"./refresh-ccw-D9N0LcfO.js";import"./pen-DiMp69lP.js";import"./empty-cell-C2U256hQ.js";import"./number-format-Co6cj9DE.js";import"./settings-s-gY0y5a.js";import"./card-C6e68lsn.js";import"./pagination-D0uasdz4.js";import"./select-qnaH2r7_.js";import"./chevron-down-CyTKzv6K.js";import"./chevron-up-AgnI3WOk.js";import"./ellipsis-CL55Xnyc.js";import"./empty-DifCIcLo.js";import"./chevron-right-A77fAWz2.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const ve=["Loading","Default"];export{i as Default,s as Loading,ve as __namedExportsOrder,_e as default};
