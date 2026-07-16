import{j as t}from"./iframe-CZw1qZGW.js";import{h as o}from"./index-B1DCnIQ_.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-IKXeDsk8.js";import{k as l,X as d,c as g}from"./data-table-DXIgsC1O.js";import{C as u,A as a}from"./applications-config-efffUDMI.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-UY00_Xcu.js";import{a as p}from"./story-section-YSzHW9zx.js";import{i as m}from"./table-mock-C7ApMAgS.js";import{B as F}from"./chunk-QUQL4437-6K-0RhBk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CH0McT4R.js";import"./i18n-D6woSMGU.js";import"./index-MRM-u4eM.js";import"./filter-button-DngKfPh5.js";import"./checkbox-filter-DzR3Mc-a.js";import"./checkbox-OC_lot_L.js";import"./index-RUed55LQ.js";import"./check-CFQ8FQQb.js";import"./label-__kq4pkx.js";import"./number-format-CqBB71vI.js";import"./badge-B_C94BCV.js";import"./separator-imWwe0EG.js";import"./x-B7FhkScA.js";import"./button-CGR4UfFv.js";import"./action-button-kKLU-hab.js";import"./dropdown-menu-Dzzvo9yA.js";import"./index-BLv7cGbS.js";import"./index-22t25koy.js";import"./circle-DcsoVGej.js";import"./command-CDCqwkyp.js";import"./dialog-CA0ieW7K.js";import"./popover-DcYTjvAO.js";import"./search-DINXrjUU.js";import"./skeleton-CvbM1CrZ.js";import"./test-tube-diagonal-Cm2KUrVy.js";import"./user-CLS0pshj.js";import"./priority-indicator-UJKT3Gnh.js";import"./indicator-BimQvM70.js";import"./shape-triangle-up-icon-CpWz32Ff.js";import"./refresh-ccw-CsmIEa3W.js";import"./pen-5wcRCViW.js";import"./use-tenant-CqPEL-IC.js";import"./api-BjHhlcVm.js";import"./grip-vertical-CE4Fj-1N.js";import"./settings-B_X3jzrV.js";import"./card--uXvYTfc.js";import"./pagination-C1DEhcod.js";import"./select-Dz4W44O9.js";import"./chevron-down-BxRW0TBQ.js";import"./chevron-up-C1cAM-lL.js";import"./ellipsis-87A-odZw.js";import"./empty-BqBC0YCa.js";import"./chevron-right-Dhm9jF0W.js";import"./empty-cell-BzokIO98.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const je=["Loading","Default"];export{i as Default,s as Loading,je as __namedExportsOrder,ve as default};
