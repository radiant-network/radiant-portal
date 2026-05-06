import{j as t}from"./iframe-PdtJhSXY.js";import{h as o}from"./index-BpaX1r0f.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-C6te_N-3.js";import{i as n,j as f,c as S}from"./data-table-X9DTzoe0.js";import{C,A as a}from"./applications-config-CJ1DK-wz.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-C0Fw4H3t.js";import{e as h}from"./table-mock-Db_LAKKr.js";import{B as R}from"./chunk-UVKPFVEO-DN79eKzK.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CmYLI9eS.js";import"./index-I36YDAnJ.js";import"./filter-button-D5FT964D.js";import"./badge-0uamsIEp.js";import"./separator-C4sHZkfj.js";import"./index-D1R2TbJu.js";import"./x-9VAtjxyk.js";import"./button-mzy4JvA7.js";import"./action-button-HY7J-v7x.js";import"./dropdown-menu-DVYpbnhw.js";import"./index-ButXuduN.js";import"./circle-DKUFOuM1.js";import"./check-i2EeU5-5.js";import"./i18n-1P2ubQ09.js";import"./checkbox-UaJTbSTF.js";import"./index-B0rgona2.js";import"./command-DerSdr3U.js";import"./dialog-B0pJrtUq.js";import"./popover-D566FlXc.js";import"./search-DrltmfoI.js";import"./skeleton-BQv8XS9j.js";import"./test-tube-diagonal-CgB2YJhV.js";import"./user-DRbexjan.js";import"./priority-indicator-BdMdfdql.js";import"./indicator-DNqFjc2r.js";import"./shape-triangle-up-icon-CL6EliTY.js";import"./refresh-ccw-CoIs9SFn.js";import"./pen-CBC6zhut.js";import"./isEqual-C8swkUYZ.js";import"./settings-Ba8f3jVA.js";import"./number-format-Dk1AAcKf.js";import"./card-1k2fw3Nz.js";import"./pagination-CTvcirmG.js";import"./select-BjSSH1c9.js";import"./chevron-down-DOJ-3plI.js";import"./chevron-up-BSw-tMxl.js";import"./ellipsis-CPFYNO1N.js";import"./empty-Cdd1Ry0d.js";import"./chevron-right-jA3r4Vx6.js";import"./toString-y4AQKRcK.js";import"./empty-cell-w5zUDFDg.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
