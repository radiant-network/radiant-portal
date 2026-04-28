import{j as t}from"./iframe-C7m9FALj.js";import{h as o}from"./index-OMp-yhBJ.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-CppOKZLs.js";import{i as n,j as f,c as S}from"./data-table-BiMIV7ie.js";import{C,A as a}from"./applications-config-Ca17-4U4.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-wcriaMkc.js";import{e as h}from"./table-mock-CB6bl-pm.js";import{B as R}from"./chunk-UVKPFVEO-4G5nDoTu.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BFN4FIOF.js";import"./index-4Grb2BEh.js";import"./filter-button-WR669VEd.js";import"./badge-7pW-mFbI.js";import"./separator-BX9a_Pn9.js";import"./index-D6-EMVHO.js";import"./x-COkob3Py.js";import"./button-Bpqmwvt6.js";import"./action-button-Ct3rsJfW.js";import"./dropdown-menu-qKMd4mlg.js";import"./index-B4o9B4_n.js";import"./circle-Bk-w7dXK.js";import"./check-CljsLVET.js";import"./i18n-BEVU7gS4.js";import"./checkbox-DBtlzVt_.js";import"./index-9FvLAPic.js";import"./command-DPZuIR2A.js";import"./dialog-CUvCeQ8g.js";import"./popover-DpS1RNDz.js";import"./search-S-qIDe2D.js";import"./skeleton-CgHwS9px.js";import"./test-tube-diagonal-DpMyfMDG.js";import"./user-BYKwbG8D.js";import"./priority-indicator-DVM3FDiD.js";import"./indicator-BZRCE_-5.js";import"./shape-triangle-up-icon-XEuIIqUH.js";import"./refresh-ccw-DHqCJE84.js";import"./pen-B6GV8CvO.js";import"./isEqual-pza9dZwd.js";import"./settings-gy_GC4uR.js";import"./number-format-Dfmdd2hZ.js";import"./card-B4vFvBq0.js";import"./pagination-DY3yh5L1.js";import"./select-Dl0zlMy7.js";import"./chevron-down-DaNFNi5d.js";import"./chevron-up-BSDRqeJo.js";import"./ellipsis-BpBarPzk.js";import"./empty-D7YJ-zAQ.js";import"./chevron-right-GzPUQWYW.js";import"./toString-HSRGFNtn.js";import"./empty-cell-D4ZsdxTP.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
