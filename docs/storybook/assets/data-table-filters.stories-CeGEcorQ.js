import{j as t}from"./iframe-Bgs5NfMc.js";import{h as o}from"./index-Dcr7ZxvS.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-CRzWxB_K.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-nQfkosNi.js";import{C,A as a}from"./applications-config-DpNkC7dN.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CDF5HmBa.js";import{B as R}from"./chunk-UVKPFVEO-CRbJO2wE.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BW9qMtCP.js";import"./index-Dn6zDDU-.js";import"./filter-button-Ccr1k8gf.js";import"./badge-OBtVNDMZ.js";import"./separator-BUulNCgX.js";import"./index-s_Ex46g1.js";import"./x-Pr3BRuzX.js";import"./button-CrOv1Hyb.js";import"./action-button-BfUGb17Q.js";import"./dropdown-menu-BcUk9WuL.js";import"./index-DMNztzep.js";import"./index-CaPft0NF.js";import"./check-Dg4oD1eq.js";import"./circle-DsTHFdGH.js";import"./i18n-CYz5bEHL.js";import"./checkbox-C8jCqYoV.js";import"./index-BlK8YWlK.js";import"./command-RgRn8FT-.js";import"./dialog-wFd_Ww_E.js";import"./popover-DiqU69uk.js";import"./search-x5aIn1Ed.js";import"./skeleton-DoETWnAN.js";import"./test-tube-diagonal-BCV2RSq4.js";import"./user-DwDxf9if.js";import"./priority-indicator-CmBV_Y2d.js";import"./indicator-DMxinZ-n.js";import"./shape-triangle-up-icon-D_OgzZMz.js";import"./refresh-ccw-B4b7KPAw.js";import"./pen-DW8I672L.js";import"./empty-cell-CZHlRLnT.js";import"./number-format-BYYIKC4O.js";import"./settings-t4wq6qOp.js";import"./card-DXJFc0mS.js";import"./pagination-CtRAqTc5.js";import"./select-BhMhQdz2.js";import"./chevron-down-zAojj8Fm.js";import"./chevron-up-DgRlx8Zq.js";import"./ellipsis-BYpZTxiw.js";import"./empty-DEaVhnFo.js";import"./chevron-right-Cj61SBNo.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
