import{j as t}from"./iframe-DwMH2dBW.js";import{h as o}from"./index-BqCNfRNP.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-BDXNK9Ey.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-BqkZddUK.js";import{C,A as a}from"./applications-config-DXE5ztiN.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-C7iaDsIf.js";import{B as R}from"./chunk-UVKPFVEO-Cd7z_Nhh.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DL6-wyT5.js";import"./index-CegZ8DV4.js";import"./filter-button-DxqrfPal.js";import"./badge-C2V39wxB.js";import"./separator-Cnq8OFvq.js";import"./index-BbiblE0o.js";import"./x-6aua8ShS.js";import"./button-BsRPaght.js";import"./action-button-tnoOk29P.js";import"./dropdown-menu-Bw4U7-Nx.js";import"./index-DA6RFYoh.js";import"./index-Btc-yfq6.js";import"./check-B1gfskih.js";import"./circle-HRTk5Xw0.js";import"./i18n-ziG4I6eV.js";import"./checkbox-D8UCmAfF.js";import"./index-0WCYYc0R.js";import"./command-BOQrcSqU.js";import"./dialog-KtrCKCKc.js";import"./popover-BfxONDVp.js";import"./search-Cr9gy5WT.js";import"./skeleton-C0wf1kFt.js";import"./test-tube-diagonal-BIIVUeGk.js";import"./user-CWV-qpdd.js";import"./priority-indicator-ecKF4c-b.js";import"./indicator-DScYhNL0.js";import"./shape-triangle-up-icon-C2IED-x3.js";import"./refresh-ccw-IxdKXQyq.js";import"./pen-BNVzpF12.js";import"./empty-cell-B_Acito6.js";import"./number-format-CRCoifE2.js";import"./settings-C7QEJlkA.js";import"./card-CGuIhlMF.js";import"./pagination-CgsuPXOS.js";import"./select-BBekSMML.js";import"./chevron-down-iZoV5io0.js";import"./chevron-up-DRLcC0QF.js";import"./ellipsis-BEiHnqT_.js";import"./empty-CtfyZH_a.js";import"./chevron-right-B-TDkjIK.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
