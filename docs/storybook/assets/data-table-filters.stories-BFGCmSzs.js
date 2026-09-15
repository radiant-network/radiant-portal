import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./http-BQTtTyo4.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,n as a,r as o,t as s}from"./data-table-D-Vr7GoI.js";import{n as c,t as l}from"./case-exploration-table-filters-4Os35HdR.js";import{_ as u,w as d}from"./api-DXv3C38A.js";import{i as f,n as p}from"./story-section-DVTm6cGm.js";import{o as m,t as h}from"./chunk-BV7QT456-CSdDc4Ui.js";import{i as g,n as _,t as v}from"./applications-config-D877dlRU.js";import{n as y,o as b}from"./table-mock-DQCzMmQ_.js";import{a as x,c as S,i as C,o as w,r as T,t as E,u as D}from"./api-case-QJEM_wDb.js";var O,k,A,j,M,N,P;function F(){return(F=e((()=>{m(),i(),t(),d(),c(),g(),D(),f(),b(),O=r(),k=a(),A={variant_entity:{app_id:v.variant_entity},germline_snv_occurrence:{app_id:v.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:v.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:`admin`,app_id:v.admin},portal:{name:``,navigation:{}}},j={title:`Features/Data Table/Filters`,component:s,args:{id:`storybook`,columns:[k.accessor(`firstName`,{cell:e=>e.getValue(),header:()=>(0,O.jsx)(`span`,{children:`First Name`})}),k.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,O.jsx)(`i`,{children:e.getValue()}),header:()=>(0,O.jsx)(`span`,{children:`Last Name`})}),k.accessor(`age`,{header:()=>`Age`,cell:e=>e.renderValue()}),k.accessor(`visits`,{header:()=>(0,O.jsx)(`span`,{children:`Visits`})}),k.accessor(`status`,{header:`Status`}),k.accessor(`progress`,{header:`Profile Progress`})],data:y,serverOptions:{defaultSorting:[{field:`germline_pf_wgs`,order:u.Asc}],onSortingChange:e=>{}},defaultColumnSettings:o([{id:`firstName`,visible:!0,label:`First Name`},{id:`lastName`,visible:!0,label:`Last Name`},{id:`age`,visible:!0,label:`Age`},{id:`visits`,visible:!0,label:`firstName`},{id:`status`,visible:!0,label:`Status`},{id:`progress`,visible:!0,label:`Profile Progress`}]),loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>(0,O.jsx)(h,{children:(0,O.jsx)(_,{config:A,children:(0,O.jsx)(e,{})})})]},M={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:`hidden`,TableFilters:(0,O.jsx)(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>(0,O.jsx)(p,{title:`Loading`,children:(0,O.jsx)(s,{...e})})},N={parameters:{msw:{handlers:[n.post(C,S),n.post(T,w),n.get(E,x)]}},args:{loadingStates:{list:!1,total:!1},data:y,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:`hidden`,TableFilters:(0,O.jsx)(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>(0,O.jsx)(p,{title:`Default`,children:(0,O.jsx)(s,{...e})})},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P=[`Loading`,`Default`]})))()}F();export{N as Default,M as Loading,P as __namedExportsOrder,j as default};