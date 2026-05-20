import{j as t}from"./iframe-DwZVKEmc.js";import{h as o}from"./index-CVkGrJR6.js";import{h as b}from"./api-CyFX6UkQ.js";import{F as u}from"./case-exploration-table-filters-CBh0_qxn.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-ColoBaQM.js";import{C,A as a}from"./applications-config-D7OfQjOC.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Ct2w_Iyl.js";import{B as R}from"./chunk-UVKPFVEO-BG30emQZ.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DeOY0ycF.js";import"./index-CrH-HhPR.js";import"./filter-button-0M1DNoq9.js";import"./badge-D9QDvd6_.js";import"./separator-CxLyQWCL.js";import"./index-C1UQ77wj.js";import"./x-BVdfCrdy.js";import"./button-B4bE3_Fh.js";import"./action-button-uSHsiLgL.js";import"./dropdown-menu-DCNbL4UQ.js";import"./index-Chf9uvwf.js";import"./index-D_qo1p9J.js";import"./check-adWPXh5W.js";import"./circle-BC_dxGpQ.js";import"./i18n-P_eepega.js";import"./checkbox-dlLOt49v.js";import"./index-CybvUMbi.js";import"./command-D1Z0wQew.js";import"./dialog-Coq1BNr6.js";import"./popover-W-zBtUo0.js";import"./search-CuQKvYxe.js";import"./skeleton-DiSpo7lv.js";import"./test-tube-diagonal-B1hMg0Yk.js";import"./user-CNn6BLnq.js";import"./priority-indicator-DAh6y-zA.js";import"./indicator-BUDhzGg_.js";import"./shape-triangle-up-icon-CDrZzfxl.js";import"./refresh-ccw-DZMmu42S.js";import"./pen-CJ7kiu2P.js";import"./empty-cell-DeEnuZ2O.js";import"./number-format-fxsjQzJX.js";import"./settings-DhhpnArD.js";import"./card-DrAyxFw0.js";import"./pagination-WraImbIp.js";import"./select-qGx_TWgO.js";import"./chevron-down-DAbT6eY9.js";import"./chevron-up-Cn2jdn-G.js";import"./ellipsis-Do0wpO03.js";import"./empty-BdvvvZfC.js";import"./chevron-right-X7xQw5zH.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
