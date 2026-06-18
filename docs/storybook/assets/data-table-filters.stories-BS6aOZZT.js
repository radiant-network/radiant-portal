import{j as t}from"./iframe-pCkdMSW4.js";import{h as o}from"./index-mKWxU678.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-DnKZacXB.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-Bg_6TlSg.js";import{C as u,A as a}from"./applications-config-zQZqX64T.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CF-YA8sB.js";import{a as m}from"./story-section-BWCYvdHs.js";import{B as F}from"./chunk-QUQL4437-dDoHRhre.js";import"./preload-helper-PPVm8Dsz.js";import"./api-yJ76xPbE.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";import"./filter-button-B9WRZtXK.js";import"./checkbox-filter-Bd3rj3D7.js";import"./checkbox-BHPQySjK.js";import"./index-BMaXgdur.js";import"./check-CHUKpJ0A.js";import"./label-LYcp7-DU.js";import"./index-C-yKeQSQ.js";import"./number-format-ByAZAFGD.js";import"./i18n-Cv0t7e2j.js";import"./badge-DEvnTpaP.js";import"./separator-BG0cX3CB.js";import"./x-C4OEjPPf.js";import"./button-CvjWkbHj.js";import"./action-button-CgBxcC7H.js";import"./dropdown-menu-pFkWlMk4.js";import"./index-BCDqYVKf.js";import"./index-B5hhSGrZ.js";import"./circle-DE6Uhsos.js";import"./command-BiKK0VWC.js";import"./dialog-CeyfMy14.js";import"./popover-Dy1XtoDC.js";import"./search-C7jbxdpk.js";import"./skeleton-B9jB0vAE.js";import"./test-tube-diagonal-CGr9VOcr.js";import"./user-CDeebjpB.js";import"./priority-indicator-Ooan2Jv7.js";import"./indicator-Dl0zMFce.js";import"./shape-triangle-up-icon-BSMLm6Al.js";import"./refresh-ccw-nYXOJ5C7.js";import"./pen-sW1sX1nL.js";import"./empty-cell-FBdgUn_w.js";import"./settings-o34SHYIm.js";import"./card-C0u50Ygi.js";import"./pagination-BkeHvY3v.js";import"./select-BYcP05Cm.js";import"./chevron-down-De4egrTS.js";import"./chevron-up-BcZtlsxd.js";import"./ellipsis-DfmFBGmV.js";import"./empty-BGry0-Ov.js";import"./chevron-right-C7lvZZkE.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
