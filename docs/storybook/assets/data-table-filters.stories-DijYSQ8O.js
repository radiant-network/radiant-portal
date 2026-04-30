import{j as t}from"./iframe-sBkayYGM.js";import{h as o}from"./index-Cq3UQ71Q.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-fFQX30Oo.js";import{i as n,j as f,c as S}from"./data-table-2mx92TcS.js";import{C,A as a}from"./applications-config-DT3MKkk5.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-JKTa-PJB.js";import{e as h}from"./table-mock-B69JduJ3.js";import{B as R}from"./chunk-UVKPFVEO-DgXeyoWa.js";import"./preload-helper-Dp1pzeXC.js";import"./index--BF3iqwP.js";import"./index-CE3ioURP.js";import"./filter-button-Z9GDct__.js";import"./badge-WXYadUlc.js";import"./separator-DPuhkk5a.js";import"./index-9C8pxyL6.js";import"./x-B00zDNqQ.js";import"./button-jkxlOLkL.js";import"./action-button-DcUSZY_y.js";import"./dropdown-menu-CSHOugmB.js";import"./index-d5oLFdxm.js";import"./circle-Chbat-Us.js";import"./check-sYlosT3b.js";import"./i18n-BriNheOb.js";import"./checkbox-DyeaqaSH.js";import"./index-CnuAHuwg.js";import"./command-CDDPlWja.js";import"./dialog-DRh2TZwM.js";import"./popover-jg2Q9f9I.js";import"./search-BjUP0lBA.js";import"./skeleton-BkUB82Jy.js";import"./test-tube-diagonal-0KOpIy9j.js";import"./user-CQg0aQyV.js";import"./priority-indicator-BgkxCwza.js";import"./indicator-BUEwviXJ.js";import"./shape-triangle-up-icon-pbH-73At.js";import"./refresh-ccw-B9WA9y1v.js";import"./pen-DI6HRL5O.js";import"./isEqual-C_f_KJeu.js";import"./settings-BPuRYoiu.js";import"./number-format-0hfwV5xm.js";import"./card-g65fuptJ.js";import"./pagination-Dirg4Vy0.js";import"./select-Bx50GOTY.js";import"./chevron-down-CQpgl9uC.js";import"./chevron-up-DDjI2-g0.js";import"./ellipsis-Bvms5frs.js";import"./empty-B-HXkwrt.js";import"./chevron-right-D2wntZrx.js";import"./toString-Bcql519Z.js";import"./empty-cell-1l-4gnEu.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
