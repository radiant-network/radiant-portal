import{aq as c,j as t}from"./iframe-iq8cIiFW.js";import{D as l,i as d,c as g}from"./data-table-DLQxWh_Z.js";import{h as o}from"./index-C-crkF--.js";import{F as n}from"./case-exploration-table-filters-tv9nePSc.js";import{C as u,A as a}from"./applications-config-ic1eUZQg.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-DxWRyXPr.js";import{a as p}from"./story-section-B8E7zijV.js";import{d as m}from"./table-mock-DIrZtAVD.js";import{B as F}from"./chunk-BV7QT456-DVWa4Q_8.js";import"./preload-helper-PPVm8Dsz.js";import"./with-selector-C0JoEFUh.js";import"./isEqual-BvpxiEAB.js";import"./checkbox-C8_xnVe3.js";import"./index-DZSl8OPB.js";import"./grip-vertical-CxZCOS-n.js";import"./settings-Cydlg7_h.js";import"./arrow-down-WlWHxK9q.js";import"./skeleton-BgxuYm9_.js";import"./number-format-DD-As31c.js";import"./card-APirdkki.js";import"./pagination-CpdTrf8U.js";import"./select-CEGjxQi2.js";import"./chevron-down-Pq5xxRUk.js";import"./chevron-up-CMDKiQsk.js";import"./ellipsis-DLqYNs2Q.js";import"./empty-DJHEJkkF.js";import"./index-CU5Gs7U5.js";import"./badge-CAgd1iWD.js";import"./x--JQCAyyF.js";import"./search-CNxiQ9EZ.js";import"./chevron-right-DCOX7BaA.js";import"./filter-button-Flkr36_T.js";import"./checkbox-filter-yyvey57_.js";import"./label-eV0NUaQV.js";import"./command-FBEOwVoq.js";import"./dialog-Brmi57Rw.js";import"./popover-CJCPa7zp.js";import"./test-tube-diagonal-B5bHzZWm.js";import"./user-C4IQS-nm.js";import"./priority-indicator-CyAO9V04.js";import"./indicator-Uv9CU7Ns.js";import"./shape-triangle-up-icon-B8PAb7GJ.js";import"./status-badge-DAP-svYR.js";import"./rotate-ccw-DwrjkCu9.js";import"./_baseUniq-D-CaPd3K.js";import"./empty-cell-cott4mgG.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},he={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const fe=["Loading","Default"];export{i as Default,s as Loading,fe as __namedExportsOrder,he as default};
