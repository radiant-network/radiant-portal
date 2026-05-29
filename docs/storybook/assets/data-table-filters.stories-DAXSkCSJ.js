import{j as t}from"./iframe-cY3pXf19.js";import{h as o}from"./index-eSsGO8Be.js";import{i as b}from"./api-Bvp-Hr8F.js";import{F as u}from"./case-exploration-table-filters-BWZGf2fO.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-DLI6lSwJ.js";import{C,A as a}from"./applications-config-CP6Ccwmp.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-mk5IJDvM.js";import{B as R}from"./chunk-UVKPFVEO-BmPkzAz6.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BEB0gx6C.js";import"./index-CAIH9J8z.js";import"./filter-button-CkEw7jyV.js";import"./checkbox-filter-CWcoGvlY.js";import"./checkbox-AVJtsB7C.js";import"./index-DfMcT7Ob.js";import"./check-DA24y2Ls.js";import"./label-DrlcwK10.js";import"./index-l2hVhD8x.js";import"./number-format-BoUgBdWa.js";import"./i18n-CBBeQjuA.js";import"./badge-CMW5C8xp.js";import"./separator-CVW8e8v-.js";import"./x-o5D23MWi.js";import"./button--Wtedmo9.js";import"./action-button-Dnm389NF.js";import"./dropdown-menu-C90hvEAS.js";import"./index-CzsD47ag.js";import"./index-lW8L5n2K.js";import"./circle-Cm-azYNc.js";import"./command-CrWGRuk2.js";import"./dialog-CuRx8jIX.js";import"./popover-D6-J2GbD.js";import"./search-CDEtOH7F.js";import"./skeleton-B96lg7Gc.js";import"./test-tube-diagonal-CyxRjTZX.js";import"./user-BJSOR0L5.js";import"./priority-indicator-DykYCHmq.js";import"./indicator-DIAo5eEK.js";import"./shape-triangle-up-icon-L0brsdHe.js";import"./refresh-ccw-Bk_RimvC.js";import"./pen-DRCPK0XG.js";import"./empty-cell-BipoDI-l.js";import"./settings-C19JRZVK.js";import"./card-BG-_P2N7.js";import"./pagination-BezG8MQX.js";import"./select-CKS42Upn.js";import"./chevron-down-BSf_DV3R.js";import"./chevron-up-Dr11Kk-v.js";import"./ellipsis-z3K093X1.js";import"./empty-BH3eC1vo.js";import"./chevron-right-DPnMUtzw.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
