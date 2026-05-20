import{j as t}from"./iframe-DwBDIzNo.js";import{h as o}from"./index-BzeeVl9i.js";import{h as b}from"./api-CyFX6UkQ.js";import{F as u}from"./case-exploration-table-filters-BZK8N88q.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-bBMs6J3d.js";import{C,A as a}from"./applications-config-c33McvLf.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Dflv3Z4d.js";import{B as R}from"./chunk-UVKPFVEO-BQiUtWgB.js";import"./preload-helper-Dp1pzeXC.js";import"./api-C0caDa3U.js";import"./index-DdT76R05.js";import"./filter-button-DMEUDlBD.js";import"./badge-B2cL7xLE.js";import"./separator-CYssvToX.js";import"./index--JuLG_uA.js";import"./x-BsZp4wzX.js";import"./button-D8_cBhjA.js";import"./action-button-p5oF4E2x.js";import"./dropdown-menu-Qvqm4pBL.js";import"./index-By-2qDH7.js";import"./index-BsWtmlzq.js";import"./check-vpPvOghz.js";import"./circle-DO0wv0WI.js";import"./i18n-AhKDWTeX.js";import"./checkbox-CGcW-Q72.js";import"./index-BKKj0RbE.js";import"./command-BdRHsLvf.js";import"./dialog-BgGY_fml.js";import"./popover-Djjnf_F7.js";import"./search-BwGU4pDt.js";import"./skeleton-C-sfkqjl.js";import"./test-tube-diagonal-TyVNxCtB.js";import"./user-_YfsYhBa.js";import"./priority-indicator-l3OMT9JS.js";import"./indicator-dNDiSOdG.js";import"./shape-triangle-up-icon-Cn21Tri1.js";import"./refresh-ccw-2NbMfydK.js";import"./pen-CD4I8lGb.js";import"./empty-cell-CdEBzngK.js";import"./number-format-CMeARC6T.js";import"./settings-DViriZkp.js";import"./card-DWk7v_0w.js";import"./pagination-BTYkbCQb.js";import"./select-xTDUAIos.js";import"./chevron-down-CvP1Z2dh.js";import"./chevron-up-CBZgGEw2.js";import"./ellipsis-DzsUCMkJ.js";import"./empty-1r9g5i8K.js";import"./chevron-right-DRuuYjSd.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
