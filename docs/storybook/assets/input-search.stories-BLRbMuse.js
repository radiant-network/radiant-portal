import{j as r,r as m}from"./iframe-DiGfbfp3.js";import{I as c}from"./input-search-KlSPioJn.js";import{a as p,b as S}from"./story-section-DME95Whn.js";import{S as h}from"./story-error-field-CuTHW0yV.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Bo0DQutg.js";import"./action-button-De4ur-7I.js";import"./dropdown-menu-CNdkncgA.js";import"./index-D8Osr2Vx.js";import"./index-BZGt5Ho_.js";import"./check-IkDt6mIM.js";import"./circle-BTr0m0BF.js";import"./separator-Dj9939qF.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./input-CuiOqIFL.js";import"./search-D5fh8e5-.js";import"./index-DI_ycpoJ.js";import"./label-CtMxYPGJ.js";const{action:n}=__STORYBOOK_MODULE_ACTIONS__,{fn:l}=__STORYBOOK_MODULE_TEST__,R={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:l(),onChange:l(),placeholder:"Placeholder",searchButtonProps:{}}},t={render:()=>r.jsx(p,{title:"Sizes",children:d.map(e=>r.jsxs("div",{className:"flex flex-col gap-2",children:[r.jsx(S,{children:e}),r.jsx(c,{size:e,onChange:o=>n("onChange")(o),onSearch:o=>{n("onSearch")(o)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})};function u(){const[e,o]=m.useState(""),i=e.trim()==="";return r.jsx(h,{label:"Search term",invalid:i,children:r.jsx(c,{size:"sm","aria-invalid":i,placeholder:"Placeholder",value:e,onChange:a=>{o(a.target.value),n("onChange")(a)},onSearch:a=>n("onSearch")(a)})})}const s={render:()=>r.jsx(p,{title:"Error",children:r.jsx(u,{})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
