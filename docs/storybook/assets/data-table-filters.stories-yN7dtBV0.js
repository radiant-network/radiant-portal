import{j as t}from"./iframe-D1HxDOtg.js";import{h as o}from"./index-CjHdHNT0.js";import{h as b}from"./api-Bs_y-PxM.js";import{F as u}from"./case-exploration-table-filters-DPfvsQKq.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-Dwbip8FI.js";import{C,A as a}from"./applications-config-BHeY-GuV.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DAV-XF_z.js";import{B as R}from"./chunk-UVKPFVEO-DeMivE1Y.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DgbNOvbA.js";import"./index-DFrM8NTl.js";import"./filter-button-BOsqsAyh.js";import"./badge-BJ7FoBtB.js";import"./separator-0KX02B4l.js";import"./index-3ABOodQS.js";import"./x-kiNtMAqJ.js";import"./button-Dv4Luc3V.js";import"./action-button-CFsRxLLs.js";import"./dropdown-menu-q8iecXKm.js";import"./index-B0uVmmYF.js";import"./circle-DZ4SjU33.js";import"./check-BnNqbnp6.js";import"./i18n-DkKv1E8x.js";import"./checkbox-DCvuMr_M.js";import"./index-C9EfS3oc.js";import"./command-Bquusx6B.js";import"./dialog-DvK7XWxT.js";import"./popover-B3THI18Y.js";import"./search-C0HF0hk0.js";import"./skeleton-JWuQfupA.js";import"./test-tube-diagonal-en9T63uA.js";import"./user-Ck55i7S1.js";import"./priority-indicator-CuZZ5Uvp.js";import"./indicator-gvFwoZEz.js";import"./shape-triangle-up-icon-C47NiYVe.js";import"./refresh-ccw-oZeDTSHk.js";import"./pen-DD-bs8KJ.js";import"./empty-cell-rHGccJaa.js";import"./number-format-ZScdHomj.js";import"./settings-CRJIk-N9.js";import"./card-BFbRmgVg.js";import"./pagination-C9h5NpLf.js";import"./select-lDtpqGTX.js";import"./chevron-down-BfVJFDLE.js";import"./chevron-up-DLKvmPfs.js";import"./ellipsis-LuOpGhpJ.js";import"./empty-DZSSpj_0.js";import"./chevron-right-BuketlaG.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const _e=["Loading","Default"];export{i as Default,s as Loading,_e as __namedExportsOrder,Ae as default};
