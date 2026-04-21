import{j as t}from"./iframe-Ck6slD91.js";import{h as o}from"./index-tHW2loHm.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-CYjx-x1t.js";import{i as n,j as f,c as S}from"./data-table-fnMlTacR.js";import{C,A as a}from"./applications-config-foyZjTKK.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DyfVzkGM.js";import{e as h}from"./table-mock-BLzPVHol.js";import{B as R}from"./chunk-UVKPFVEO-DsqrwL61.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DEu99CoD.js";import"./index-BMmq9B1q.js";import"./filter-button-1ms4ov6Q.js";import"./badge-CHq-dDVs.js";import"./separator-CzEnouGI.js";import"./index-xNFf6qRu.js";import"./x-Bx_RIZgS.js";import"./button-DE-z7oR5.js";import"./action-button-CoXmm-sb.js";import"./dropdown-menu-s1ofcID1.js";import"./index-C7PgMmUJ.js";import"./circle-Bx-s0cQS.js";import"./check-DO_t-9Co.js";import"./i18n-Detk4ebv.js";import"./checkbox-CvzXD_QP.js";import"./index-BCthw-tv.js";import"./command-CML6c8l0.js";import"./dialog-DRXe4wx-.js";import"./popover-zV9O1FSC.js";import"./search-CXkPAWVZ.js";import"./skeleton-B1Wucanj.js";import"./test-tube-diagonal-BoYsVYMN.js";import"./user-FS3t42Hq.js";import"./priority-indicator-BwZRXBMH.js";import"./indicator-BNK9drRM.js";import"./shape-triangle-up-icon-_QGE55YK.js";import"./refresh-ccw-yOCurE76.js";import"./pen-BFgEg5vY.js";import"./isEqual-Bk-JZdiw.js";import"./settings-UdIfwoi9.js";import"./number-format-BUAyfhsw.js";import"./card-yeQ3di0T.js";import"./pagination-C8bpFaj3.js";import"./select-8jiM3No6.js";import"./chevron-down-C4hibPcx.js";import"./chevron-up-VzglnDlk.js";import"./ellipsis-ehsIuQUG.js";import"./empty-gsZ4FU5d.js";import"./chevron-right-DAOJwK5F.js";import"./toString-BqzvH8Hv.js";import"./empty-cell-CTTUR6um.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
