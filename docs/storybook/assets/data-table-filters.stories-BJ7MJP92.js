import{j as t}from"./iframe-D1O0fIzs.js";import{h as o}from"./index-M7ftm4_B.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-zUXzWTBr.js";import{i as n,j as f,c as S}from"./data-table-DCAF3epa.js";import{C,A as a}from"./applications-config-ScoXP_h_.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BbBsRQE2.js";import{e as h}from"./table-mock-CuKPGwo8.js";import{B as R}from"./chunk-UVKPFVEO-D9hcuDmi.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CmN4WOxI.js";import"./index-DIBzS8-U.js";import"./filter-button-CsFv9Bpc.js";import"./badge-C66LOKPp.js";import"./separator-B0csA_HG.js";import"./index-BzfNWmCa.js";import"./x-Bgdi1EK3.js";import"./button-CTx6P0Ya.js";import"./action-button-BDzRqary.js";import"./dropdown-menu-C5h0Lq7a.js";import"./index-CjdM_bb1.js";import"./circle-DyYcun8N.js";import"./check-DvH0iXvQ.js";import"./i18n-CaxRaoGq.js";import"./checkbox-BUd2aeiN.js";import"./index--r5ykH8Q.js";import"./command-CBwdCSyD.js";import"./dialog-DyK0kQ0b.js";import"./popover-BG0-vxyC.js";import"./search-B3MNSHtM.js";import"./skeleton-CHW9FDTn.js";import"./test-tube-diagonal-BFAwbVdS.js";import"./user-Dh_B-_FB.js";import"./priority-indicator-fPzxbPFm.js";import"./indicator-ao3nQu-6.js";import"./shape-triangle-up-icon-Zkkqdocr.js";import"./refresh-ccw-noC00T17.js";import"./pen-BExtODi9.js";import"./isEqual-B4fd5xJl.js";import"./settings-B9ZDLOXf.js";import"./number-format-DDNACka7.js";import"./card-DhqLZzdH.js";import"./pagination-Dahssv7Z.js";import"./select-B5FEhSod.js";import"./chevron-down-DjBZdD0k.js";import"./chevron-up-CbujDXg9.js";import"./ellipsis-p5mDJcvP.js";import"./empty-qkoqdwg7.js";import"./chevron-right-BvdwP8v5.js";import"./toString-DOfP8S0D.js";import"./empty-cell-Bp3SpEl5.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
