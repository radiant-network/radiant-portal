import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./data-table-filter-search-Bx49yvcn.js";import{n as i,t as a}from"./index-C0irWvHc.js";import{i as o,n as s}from"./story-section-DVTm6cGm.js";var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{i(),n(),o(),c=t(),l=[{type:`case_id`,value:`1`},{type:`case_id`,value:`10`},{type:`patient_id`,value:`10`}],u=async()=>({data:l}),d=()=>new Promise(()=>{}),f=async()=>({data:[]}),p={title:`Features/Data Table/Filter Search`,component:r,args:{placeholder:`Case, sequencing, patient, or MRN`,minSearchLength:1,api:u,onSelect:()=>{}},decorators:[e=>(0,c.jsx)(a,{value:{provider:()=>new Map},children:(0,c.jsx)(e,{})})]},m={render:e=>(0,c.jsx)(s,{title:`Default`,description:`Type a character to see the results.`,children:(0,c.jsx)(r,{...e})})},h={args:{api:d},render:e=>(0,c.jsx)(s,{title:`Loading`,description:`Type a character: the request never resolves, so the spinner stays.`,children:(0,c.jsx)(r,{...e})})},g={args:{minSearchLength:3},render:e=>(0,c.jsx)(s,{title:`Minimum length`,description:`Type 1 or 2 characters to see the minimum length message.`,children:(0,c.jsx)(r,{...e})})},_={args:{api:f},render:e=>(0,c.jsx)(s,{title:`No result`,description:`Type a character: the request returns no result.`,children:(0,c.jsx)(r,{...e})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <StorySection title="Default" description="Type a character to see the results.">
      <TableFiltersSearch {...args} />
    </StorySection>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    api: pendingApi
  },
  render: args => <StorySection title="Loading" description="Type a character: the request never resolves, so the spinner stays.">
      <TableFiltersSearch {...args} />
    </StorySection>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    minSearchLength: 3
  },
  render: args => <StorySection title="Minimum length" description="Type 1 or 2 characters to see the minimum length message.">
      <TableFiltersSearch {...args} />
    </StorySection>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    api: emptyApi
  },
  render: args => <StorySection title="No result" description="Type a character: the request returns no result.">
      <TableFiltersSearch {...args} />
    </StorySection>
}`,..._.parameters?.docs?.source}}},v=[`Default`,`Loading`,`MinimumLength`,`NoResult`]})))()}y();export{m as Default,h as Loading,g as MinimumLength,_ as NoResult,v as __namedExportsOrder,p as default};