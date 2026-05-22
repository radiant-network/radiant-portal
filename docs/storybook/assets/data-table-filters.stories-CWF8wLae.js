import{j as t}from"./iframe-DiSFfoD4.js";import{h as o}from"./index-DzagocFe.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-CVO9kNQB.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-B0MvkpdU.js";import{C,A as a}from"./applications-config-XePMBFpQ.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CBoa9pHn.js";import{B as R}from"./chunk-UVKPFVEO-Dk2k7YJq.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CinLHSl0.js";import"./index-SNNKgtnK.js";import"./filter-button-BS1wyfzj.js";import"./badge-9LkSFUDl.js";import"./separator-KK1C3d3J.js";import"./index-BL8oEubm.js";import"./x-CnTOoAws.js";import"./button-BV9rrKND.js";import"./action-button-BLEZ4s-Z.js";import"./dropdown-menu-Co-ilK63.js";import"./index-Cg7zLYUJ.js";import"./index-BRwQSXJv.js";import"./check-jCtI0cKB.js";import"./circle-CvzX10sS.js";import"./i18n-0aycJ8bv.js";import"./checkbox-Cnhc8gpZ.js";import"./index-DuIvccuy.js";import"./command-X_ouc8VR.js";import"./dialog-D38P9krb.js";import"./popover-Btvtjdcu.js";import"./search-CEbPofDD.js";import"./skeleton-D5mkhX1K.js";import"./test-tube-diagonal-B0mzsKqJ.js";import"./user-RG9So0DF.js";import"./priority-indicator-BKVJ3h0t.js";import"./indicator-D0GrT8CV.js";import"./shape-triangle-up-icon-D22o9IgB.js";import"./refresh-ccw-CqkbmYjJ.js";import"./pen-cWnV8T43.js";import"./empty-cell-BUfUqTFO.js";import"./number-format-Dj5rwqum.js";import"./settings-hrKZa3h4.js";import"./card-zVaAvG8M.js";import"./pagination-CIDmEk9l.js";import"./select-DF4JWhFM.js";import"./chevron-down-x64dIu7M.js";import"./chevron-up-P1jXDj5L.js";import"./ellipsis-WtBMhqiS.js";import"./empty-C8jxh1u8.js";import"./chevron-right-DV7dXXWq.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
