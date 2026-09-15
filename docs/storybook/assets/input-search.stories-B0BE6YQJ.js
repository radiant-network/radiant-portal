import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,t as a}from"./story-section-DVTm6cGm.js";import{n as o,t as s}from"./story-error-field-DeLRAi8K.js";import{n as c,t as l}from"./input-search-BO6F1Iz4.js";import{r as u,t as d}from"./utils-DY5BCjP1.js";function f(){let[e,t]=(0,p.useState)(``),n=e.trim()===``;return(0,m.jsx)(s,{label:`Search term`,invalid:n,children:(0,m.jsx)(l,{size:`sm`,"aria-invalid":n,placeholder:`Placeholder`,value:e,onChange:e=>{t(e.target.value),h(`onChange`)(e)},onSearch:e=>h(`onSearch`)(e)})})}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{p=t(),c(),r(),o(),d(),m=n(),{action:h}=__STORYBOOK_MODULE_ACTIONS__,{fn:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Inputs/Input Search`,component:l,args:{value:`Search value`,onSearch:g(),onChange:g(),placeholder:`Placeholder`,searchButtonProps:{}}},v={render:()=>(0,m.jsx)(i,{title:`Sizes`,children:u.map(e=>(0,m.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,m.jsx)(a,{children:e}),(0,m.jsx)(l,{size:e,onChange:e=>h(`onChange`)(e),onSearch:e=>{h(`onSearch`)(e)},className:`max-w-[300px]`,placeholder:`Placeholder`,autoFocus:!0,searchButtonProps:{color:`primary`,variant:`default`}})]},e))})},y={render:()=>(0,m.jsx)(i,{title:`Error`,children:(0,m.jsx)(f,{})})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error">
      <InputSearchErrorDemo />
    </StorySection>
}`,...y.parameters?.docs?.source}}},b=[`Sizes`,`ErrorState`]})))()}x();export{y as ErrorState,v as Sizes,b as __namedExportsOrder,_ as default};