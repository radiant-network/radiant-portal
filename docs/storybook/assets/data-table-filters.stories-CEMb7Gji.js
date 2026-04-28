import{j as t}from"./iframe-xGkqtlg9.js";import{h as o}from"./index-DrrsxIVV.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-CYyZtAd8.js";import{i as n,j as f,c as S}from"./data-table-Ba_hm4Cw.js";import{C,A as a}from"./applications-config-BTzzOLmm.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DbxhNuGc.js";import{e as h}from"./table-mock-D0-4ynUA.js";import{B as R}from"./chunk-UVKPFVEO-DdI5112M.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C7B--a44.js";import"./index-BfOXvTVD.js";import"./filter-button-Bgyf0fOR.js";import"./badge-CpqbcCAl.js";import"./separator-BM5cwLPt.js";import"./index-DXx_HuLb.js";import"./x-GooFnSwI.js";import"./button-BzI5Txcv.js";import"./action-button-IkQ9gKje.js";import"./dropdown-menu-B9HBkG3M.js";import"./index-BN2l1LOC.js";import"./circle-Dd8Am3-R.js";import"./check-8HsZpsjV.js";import"./i18n-DS245Ekr.js";import"./checkbox-B4V4dh_y.js";import"./index-DQjtG6Oj.js";import"./command-DU0MCyG4.js";import"./dialog-9I7-2f1p.js";import"./popover-BPngZgdQ.js";import"./search-DYLyULCH.js";import"./skeleton-uYceCD8w.js";import"./test-tube-diagonal-CwcjOu-U.js";import"./user-6CoV92-g.js";import"./priority-indicator-6Gfjqvw1.js";import"./indicator-DEFcwRpX.js";import"./shape-triangle-up-icon-DsQTC44o.js";import"./refresh-ccw-D6rQS3RL.js";import"./pen-BGFltkkc.js";import"./isEqual-BR83ykGJ.js";import"./settings-Dv35E7_E.js";import"./number-format-DQsBk7At.js";import"./card-CDg0T_Mu.js";import"./pagination-WKYoYeyz.js";import"./select-DZ4hZrpW.js";import"./chevron-down-Cz73fnoL.js";import"./chevron-up-BFIErMgO.js";import"./ellipsis-DToswKja.js";import"./empty-C-Owgt-4.js";import"./chevron-right-BuWzH7-m.js";import"./toString-CYj8G7iA.js";import"./empty-cell-CL5RdnLB.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
