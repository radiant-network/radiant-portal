import{j as e,r as m}from"./iframe-CEIjD8md.js";import{I as c}from"./input-search-DdP0wDJa.js";import{a as p,b as S}from"./story-section-akNb6BHm.js";import{S as h}from"./story-error-field-ilQIUul_.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./input-D5oIp6d4.js";import"./search-D9gbuUYD.js";import"./index-DrHHB82D.js";import"./label-B7YzvmnB.js";const{action:n}=__STORYBOOK_MODULE_ACTIONS__,{fn:l}=__STORYBOOK_MODULE_TEST__,C={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:l(),onChange:l(),placeholder:"Placeholder",searchButtonProps:{}}},t={render:()=>e.jsx(p,{title:"Sizes",children:d.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(S,{children:r}),e.jsx(c,{size:r,onChange:a=>n("onChange")(a),onSearch:a=>{n("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};function u(){const[r,a]=m.useState(""),i=r.trim()==="";return e.jsx(h,{label:"Search term",invalid:i,children:e.jsx(c,{size:"sm","aria-invalid":i,placeholder:"Placeholder",value:r,onChange:o=>{a(o.target.value),n("onChange")(o)},onSearch:o=>n("onSearch")(o)})})}const s={render:()=>e.jsx(p,{title:"Error",children:e.jsx(u,{})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const I=["Sizes","ErrorState"];export{s as ErrorState,t as Sizes,I as __namedExportsOrder,C as default};
