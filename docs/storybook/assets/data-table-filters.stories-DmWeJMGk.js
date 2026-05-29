import{j as t}from"./iframe-lz8W3HP1.js";import{h as o}from"./index-CdSBbxbD.js";import{i as b}from"./api-Bvp-Hr8F.js";import{F as u}from"./case-exploration-table-filters-DXixV0nn.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-TCoQIA1A.js";import{C,A as a}from"./applications-config-D0Y99LuP.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DYSR5-gS.js";import{B as R}from"./chunk-UVKPFVEO-DreyoCxj.js";import"./preload-helper-Dp1pzeXC.js";import"./api-D5u9K7wE.js";import"./index-DIZH78Av.js";import"./filter-button-Db8HcxnY.js";import"./checkbox-filter-sJ-8dZuE.js";import"./checkbox-j_JeNu6y.js";import"./index-BUc-FhET.js";import"./check-DF7K64e9.js";import"./label-mIKKzIbi.js";import"./index-CokpfI9w.js";import"./number-format-CoUFnL-Q.js";import"./i18n-DdinPWLE.js";import"./badge-B73pLF09.js";import"./separator-s6L2pRJs.js";import"./x-Bwby1g_0.js";import"./button-DjTwqMkt.js";import"./action-button-YFtksSs0.js";import"./dropdown-menu-HxnCj7CD.js";import"./index-CAjwSRCs.js";import"./index-itM-h3-X.js";import"./circle-DNFGAa7l.js";import"./command-Dw7hWO5w.js";import"./dialog-B9xASFHT.js";import"./popover-XNsxAyQj.js";import"./search-CTGbprDS.js";import"./skeleton-RD6RzMSN.js";import"./test-tube-diagonal-z2XvfFHk.js";import"./user-Dy8JqSEp.js";import"./priority-indicator-BlTMe3Ty.js";import"./indicator-CFFLP0nh.js";import"./shape-triangle-up-icon-CKFMZgQ-.js";import"./refresh-ccw-CcLTS1Kw.js";import"./pen-0moJpXBx.js";import"./empty-cell-C0_j2Eza.js";import"./settings-BKxyNS4d.js";import"./card-w6SBy4C6.js";import"./pagination-DAio1Cmf.js";import"./select-BpOyAM9L.js";import"./chevron-down-B3EMMtHp.js";import"./chevron-up-yGIiDR8T.js";import"./ellipsis-CCTpnyb3.js";import"./empty-CAZiZqgy.js";import"./chevron-right-BO0O9yp_.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
