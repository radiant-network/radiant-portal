import{j as r,r as m}from"./iframe-CsmmCDil.js";import{I as c}from"./input-search-CphwtOBn.js";import{a as p,b as S}from"./story-section-BruI3BJC.js";import{S as h}from"./story-error-field-DN_yjPg4.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CLdXJbIO.js";import"./action-button-BXvWHX1M.js";import"./dropdown-menu-CMD-kT8U.js";import"./index-okOsg7fW.js";import"./index-DHlLYSd4.js";import"./check-Bvaswsz_.js";import"./circle-Bw4VVGH9.js";import"./separator-Blqqu4Ag.js";import"./i18n-CivhJ0zv.js";import"./index-BiNs9BjM.js";import"./input-BXiYb8rI.js";import"./search-B-52pNhg.js";import"./index-Cz814i2K.js";import"./label-8wYWr6_s.js";const{action:n}=__STORYBOOK_MODULE_ACTIONS__,{fn:l}=__STORYBOOK_MODULE_TEST__,R={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:l(),onChange:l(),placeholder:"Placeholder",searchButtonProps:{}}},t={render:()=>r.jsx(p,{title:"Sizes",children:d.map(e=>r.jsxs("div",{className:"flex flex-col gap-2",children:[r.jsx(S,{children:e}),r.jsx(c,{size:e,onChange:o=>n("onChange")(o),onSearch:o=>{n("onSearch")(o)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})};function u(){const[e,o]=m.useState(""),i=e.trim()==="";return r.jsx(h,{label:"Search term",invalid:i,children:r.jsx(c,{size:"sm","aria-invalid":i,placeholder:"Placeholder",value:e,onChange:a=>{o(a.target.value),n("onChange")(a)},onSearch:a=>n("onSearch")(a)})})}const s={render:()=>r.jsx(p,{title:"Error",children:r.jsx(u,{})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes">
      {sizes.map(size => <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <InputSearch size={size} onChange={e => action('onChange')(e)} onSearch={value => {
        action('onSearch')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
        color: 'primary',
        variant: 'default'
      }} />
        </div>)}
    </StorySection>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error">
      <InputSearchErrorDemo />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const w=["Sizes","ErrorState"];export{s as ErrorState,t as Sizes,w as __namedExportsOrder,R as default};
