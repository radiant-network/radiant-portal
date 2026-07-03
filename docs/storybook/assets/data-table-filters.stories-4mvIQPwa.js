import{j as t}from"./iframe-Clj-cmbv.js";import{h as o}from"./index-CTjUq99K.js";import{i as c}from"./api-EcWoeBNP.js";import{F as n}from"./case-exploration-table-filters-CDY52sLe.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock--lVa3ah1.js";import{C as u,A as a}from"./applications-config-DNIbusgh.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-BETCRmU0.js";import{a as m}from"./story-section-DCzIVbFj.js";import{B as F}from"./chunk-QUQL4437-CuPL5rLy.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bu2xSwIs.js";import"./i18n-CteUV2dW.js";import"./index-BRQotc69.js";import"./filter-button-DBzD7d1k.js";import"./checkbox-filter-BhYjIV5h.js";import"./checkbox-BGdOEcDe.js";import"./index-DOHSHEWr.js";import"./check-DR5_QgnI.js";import"./label-QaK_1ghx.js";import"./number-format-BqdioBhs.js";import"./badge-BjNtobNr.js";import"./separator-BkoI8fxB.js";import"./x-BOxx-XgJ.js";import"./button-CpjCmLUP.js";import"./action-button-B-B5BuJQ.js";import"./dropdown-menu-D1F9T0ri.js";import"./index-LQNM7kie.js";import"./index-DujBfDZp.js";import"./circle-RCbrrEpe.js";import"./command-B3Uomy9p.js";import"./dialog-DU2_QskT.js";import"./popover-mYB4IRDq.js";import"./search-BTiTc34-.js";import"./skeleton-Bc6-r1_Z.js";import"./test-tube-diagonal-DxwiSqJe.js";import"./user-BGN8j9f9.js";import"./priority-indicator-8eRwK9Xv.js";import"./indicator-Bf4aubvh.js";import"./shape-triangle-up-icon-BCP3bL4w.js";import"./refresh-ccw-Ap6_w_pt.js";import"./pen-b3GUHbfv.js";import"./use-tenant-CqYcL_t5.js";import"./api-LbIRQM0U.js";import"./empty-cell-Bgmyf9Zy.js";import"./settings-MP7IkaqB.js";import"./card-CyqgEc0j.js";import"./pagination-DNe34NU9.js";import"./select-D8GXTFGD.js";import"./chevron-down-BrYByTpJ.js";import"./chevron-up-COxUJX1W.js";import"./ellipsis-BDEKk8Z0.js";import"./empty-A_QL2cpe.js";import"./chevron-right-CZn9crAm.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Loading">
      <DataTable {...args} />
    </StorySection>
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
  render: args => <StorySection title="Default">
      <DataTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};const Ae=["Loading","Default"];export{i as Default,s as Loading,Ae as __namedExportsOrder,_e as default};
