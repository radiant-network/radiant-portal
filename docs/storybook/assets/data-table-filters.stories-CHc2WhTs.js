import{j as t}from"./iframe-CMnhLHOf.js";import{h as o}from"./index-GGZSliky.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-D99W1StJ.js";import{i as n,j as f,c as S}from"./data-table-DPvocSc1.js";import{C,A as a}from"./applications-config-D8LWqBnP.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BHxmU7md.js";import{e as h}from"./table-mock-CHfI5Kw2.js";import{B as R}from"./chunk-UVKPFVEO-Bv7X8MbW.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Bi6HgjE_.js";import"./index-BuHXHBX3.js";import"./filter-button-CJWPXYBf.js";import"./badge-DoJyv5fI.js";import"./separator-DKyTZOMp.js";import"./index-BUtUgFZQ.js";import"./x-BbwuhHOu.js";import"./button-CwgxGnP_.js";import"./action-button-C6O-ZiMa.js";import"./dropdown-menu-DuT_GNFJ.js";import"./index-EMqEdC3c.js";import"./circle-BEBmorTE.js";import"./check-DMtyfd-6.js";import"./i18n-D_gPNxag.js";import"./checkbox-UK0hyOKb.js";import"./index-OiVWrOUU.js";import"./command-ZwbEGwoT.js";import"./dialog-DrXI5HlO.js";import"./popover-DZMFk-tG.js";import"./search-DKlY15b7.js";import"./skeleton-CvsYF9Sc.js";import"./test-tube-diagonal-C-gpxZx6.js";import"./user-DaHqVPMK.js";import"./priority-indicator-B_p7AKU6.js";import"./indicator-M-tYXBBH.js";import"./shape-triangle-up-icon-C1AdzvQB.js";import"./refresh-ccw-5sJCy7-0.js";import"./pen-CnoPP2yN.js";import"./isEqual-De8nW9H0.js";import"./settings-BSN-bqRY.js";import"./number-format-C8-vANGT.js";import"./card-DRpGDRh4.js";import"./pagination-ckl8aucx.js";import"./select-DUqvSzuW.js";import"./chevron-down-DnPCjDa0.js";import"./chevron-up-Wadpi5v_.js";import"./ellipsis-BvZfms2H.js";import"./empty-Cjl1nEvm.js";import"./chevron-right-Db2wO1fY.js";import"./toString-t-2Ho6SD.js";import"./empty-cell-CSe5E90q.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
