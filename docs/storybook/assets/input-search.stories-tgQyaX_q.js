import{j as r,r as m}from"./iframe-CeWulF4T.js";import{I as c}from"./input-search-LDyF7UDc.js";import{a as p,b as S}from"./story-section-H6_Fle6z.js";import{S as h}from"./story-error-field-DSPWHYPt.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C683gQgD.js";import"./action-button-fSpfUlMg.js";import"./dropdown-menu-KIY2RxO3.js";import"./index-Derf9KHZ.js";import"./index-R0RQN4yR.js";import"./check-HHIYmnL4.js";import"./circle-DXv1Vmv4.js";import"./separator-CfpQj-nU.js";import"./i18n-Cey8cEyU.js";import"./index-Dqf5nBEg.js";import"./input-DRoC1zNI.js";import"./search-D14NulpE.js";import"./index-C0gnKytj.js";import"./label-D1HwKpbR.js";const{action:n}=__STORYBOOK_MODULE_ACTIONS__,{fn:l}=__STORYBOOK_MODULE_TEST__,R={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:l(),onChange:l(),placeholder:"Placeholder",searchButtonProps:{}}},t={render:()=>r.jsx(p,{title:"Sizes",children:d.map(e=>r.jsxs("div",{className:"flex flex-col gap-2",children:[r.jsx(S,{children:e}),r.jsx(c,{size:e,onChange:o=>n("onChange")(o),onSearch:o=>{n("onSearch")(o)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})};function u(){const[e,o]=m.useState(""),i=e.trim()==="";return r.jsx(h,{label:"Search term",invalid:i,children:r.jsx(c,{size:"sm","aria-invalid":i,placeholder:"Placeholder",value:e,onChange:a=>{o(a.target.value),n("onChange")(a)},onSearch:a=>n("onSearch")(a)})})}const s={render:()=>r.jsx(p,{title:"Error",children:r.jsx(u,{})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
