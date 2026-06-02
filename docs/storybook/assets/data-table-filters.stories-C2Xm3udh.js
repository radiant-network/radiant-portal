import{j as t}from"./iframe-Cmiex3IG.js";import{h as o}from"./index-DsgVPzw1.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-DaETafXg.js";import{Z as p,d as n,X as c,c as d}from"./table-mock-gug1-nA8.js";import{C as g,A as a}from"./applications-config-BEWoMBeD.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-D_xtv2Ip.js";import{B as x}from"./chunk-QUQL4437-s57FPwL9.js";import"./preload-helper-PPVm8Dsz.js";import"./api-qKCDbmki.js";import"./index-QN_ZCD1V.js";import"./filter-button-Cju2CqZa.js";import"./checkbox-filter-DOsuEyIY.js";import"./checkbox-BCT0M0VO.js";import"./index-CdS5h6eN.js";import"./check-BHUZAyPW.js";import"./label-UpUCEQSt.js";import"./index-bnaEmcFS.js";import"./number-format-B1B8AklD.js";import"./i18n-BtP9BP9x.js";import"./badge-4IPyydYP.js";import"./separator-VLxmM7Q3.js";import"./x-COuduTWL.js";import"./button-DRstk-W3.js";import"./action-button-bPFBQAma.js";import"./dropdown-menu-BUNcBeqG.js";import"./index-OjUxLgF4.js";import"./index-nnPp2JKR.js";import"./circle-CZF_B4Vk.js";import"./command-CBr_m6O5.js";import"./dialog-CkDel-m8.js";import"./popover-D0fTgJi_.js";import"./search-Cy2ave-H.js";import"./skeleton-BpbtEim3.js";import"./test-tube-diagonal-CSbL_1V0.js";import"./user-B568iV1i.js";import"./priority-indicator-CBULYU2T.js";import"./indicator-4zldxxKP.js";import"./shape-triangle-up-icon-lQj4Oujb.js";import"./refresh-ccw-UAvbwK0q.js";import"./pen-DUeFlLdz.js";import"./empty-cell-WVRPW14g.js";import"./settings-h2-yeRso.js";import"./card-uMhTgez5.js";import"./pagination-QF8CYZ1R.js";import"./select-BmyIdouT.js";import"./chevron-down-DP0b3L58.js";import"./chevron-up-VYYoQ-QT.js";import"./ellipsis-s_sItVM3.js";import"./empty-BA0oamuj.js";import"./chevron-right-DfRuNjM_.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const xe=["Loading","Default"];export{i as Default,s as Loading,xe as __namedExportsOrder,Ce as default};
