import{j as t}from"./iframe-BmQaEKqD.js";import{h as o}from"./index-B9hhcIm2.js";import{i as c}from"./api-5e3Wi7_0.js";import{F as n}from"./case-exploration-table-filters-DmM4i3lV.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-C24STsTu.js";import{C as u,A as a}from"./applications-config-C53CzKOB.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CgE4Ey_B.js";import{a as m}from"./story-section-DmKrQ7pL.js";import{B as F}from"./chunk-QUQL4437-B9eNMz9d.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CF26VfEE.js";import"./i18n-DASwuS_h.js";import"./index-DPphhh4w.js";import"./filter-button-BbNcIKZU.js";import"./checkbox-filter-DVPciLqC.js";import"./checkbox-C8Vc3L9N.js";import"./index-Bbf4jtZY.js";import"./check-ZuEG5tzj.js";import"./label-C7V_v3zb.js";import"./number-format-DqIvUXWF.js";import"./badge--SA6aVcv.js";import"./separator-lVIRd7xC.js";import"./x-DzXSs4iU.js";import"./button-Cwn9pdSz.js";import"./action-button-NcZ7v7jd.js";import"./dropdown-menu-D8OFOKsF.js";import"./index-0v-EdXCc.js";import"./index-DQAP5Woc.js";import"./circle-BTNlC0Y1.js";import"./command-DPEax5Yv.js";import"./dialog-BTq3_9ga.js";import"./popover-DQnibpe4.js";import"./search-CM7h0a_W.js";import"./skeleton-BFvQNEDz.js";import"./test-tube-diagonal-DxtWlczU.js";import"./user-BTDu2n9p.js";import"./priority-indicator-CUMA8_VQ.js";import"./indicator-D4bnKHDg.js";import"./shape-triangle-up-icon-DSYb91dA.js";import"./refresh-ccw-B2h1WBSr.js";import"./pen-OJjyapNc.js";import"./use-tenant-UnVKd7jj.js";import"./api-CRUcq8iX.js";import"./empty-cell-Dlymd-iS.js";import"./grip-vertical-ec0n5JJN.js";import"./settings-Cl-p_k82.js";import"./card-avuAW3-U.js";import"./pagination-B5c-vHfZ.js";import"./select-DLZ1Sv2a.js";import"./chevron-down-NDT5Ii8g.js";import"./chevron-up-BjRyBtL4.js";import"./ellipsis-BrY7vD_v.js";import"./empty-q2s5NkmM.js";import"./chevron-right-1PyhWTuz.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ve=["Loading","Default"];export{i as Default,s as Loading,ve as __namedExportsOrder,Ae as default};
