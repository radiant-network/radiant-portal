import{j as t}from"./iframe-tpddIcOV.js";import{h as o}from"./index-Bm8vWmdW.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-9EgawgGl.js";import{i as n,j as f,c as S}from"./data-table-C4ytEe2c.js";import{C,A as a}from"./applications-config-Cghen5SL.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DYF29Wne.js";import{e as h}from"./table-mock-f-agOmZW.js";import{B as R}from"./chunk-UVKPFVEO-DLud2mbz.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B8_iprca.js";import"./index-C4FCj2KW.js";import"./filter-button-DdLtJAxa.js";import"./badge-CnbyAUSW.js";import"./separator-Ck5a1_p-.js";import"./index-CtxkAMG7.js";import"./x-DnG8TjvN.js";import"./button-C5MUp-SO.js";import"./action-button-lpn-Hr8d.js";import"./dropdown-menu-B_ObeRyq.js";import"./index-JJYwph0u.js";import"./circle-DYirQWUt.js";import"./check-DZrg3vKX.js";import"./i18n-DZ_oysxw.js";import"./checkbox-CboFC8Ea.js";import"./index-DZNo2fm7.js";import"./command-CsvGCtEj.js";import"./dialog-CvF5NISP.js";import"./popover-FfPWz1gv.js";import"./search-DRI3M9X-.js";import"./skeleton-AlrsFwSo.js";import"./test-tube-diagonal-eeUF_93S.js";import"./user-B4Zf1Wny.js";import"./priority-indicator-Dj2cb-XZ.js";import"./indicator-B1YMtUjw.js";import"./shape-triangle-up-icon-bJHCWXzR.js";import"./refresh-ccw-BSj4gTNE.js";import"./pen-DLhJ5XZI.js";import"./isEqual-BpKmb-jc.js";import"./settings-ERbfneOn.js";import"./number-format-DkJitisM.js";import"./card-D4tKWUEn.js";import"./pagination-FXPLrNqO.js";import"./select-C-UiT23v.js";import"./chevron-down-DAXj9fNP.js";import"./chevron-up-pN5o94Oy.js";import"./ellipsis-DsI8ULdN.js";import"./empty-CRz3qt00.js";import"./chevron-right-H4ZT1yco.js";import"./toString-Dg6VryXQ.js";import"./empty-cell-CwIkyp26.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
