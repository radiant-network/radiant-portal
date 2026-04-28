import{j as t}from"./iframe-CeZhEt-M.js";import{h as o}from"./index-G-7YDFFC.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-DmNlFE4G.js";import{i as n,j as f,c as S}from"./data-table-Cy-P6lJ0.js";import{C,A as a}from"./applications-config-C8_840XO.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DRotrgOq.js";import{e as h}from"./table-mock-DSssN93t.js";import{B as R}from"./chunk-UVKPFVEO-D1Baaagb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Qwp9S0vo.js";import"./index-Dl99OMGT.js";import"./filter-button-CgWDcszK.js";import"./badge-Crb15YkT.js";import"./separator-DLJ7YcP5.js";import"./index-CgPaK-RE.js";import"./x-C4Hbu964.js";import"./button-CrCrdqal.js";import"./action-button-Bt8SAbca.js";import"./dropdown-menu-CDeBtpHu.js";import"./index-BR-PrORl.js";import"./circle-Cm0Ztkdm.js";import"./check-DW427_c7.js";import"./i18n-ysDo9x1e.js";import"./checkbox-DNpat4AY.js";import"./index-gZLwUSsv.js";import"./command-DuGDv6v6.js";import"./dialog-BBfl8p6H.js";import"./popover-DMo0x0GH.js";import"./search-DbpeNbpu.js";import"./skeleton-e_OHSOfg.js";import"./test-tube-diagonal-Dk-rUTtm.js";import"./user-Ci_r3tPR.js";import"./priority-indicator-BZNKDM9U.js";import"./indicator-B1yEG5ui.js";import"./shape-triangle-up-icon-DBKb8Wh9.js";import"./refresh-ccw-BfBhPEvi.js";import"./pen-Up40ReXC.js";import"./isEqual-kmI7ogSG.js";import"./settings-Bp6T7dde.js";import"./number-format-DaYJkhht.js";import"./card-BoTO1Ucs.js";import"./pagination-BE6ARmxq.js";import"./select-HO9iyTNJ.js";import"./chevron-down-BV-4rrNc.js";import"./chevron-up-D4CNTBOY.js";import"./ellipsis-Di4R9Mzc.js";import"./empty-BjsBnZRP.js";import"./chevron-right-AKu0lZzS.js";import"./toString-DsmpPxme.js";import"./empty-cell-JBz3yvO3.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
