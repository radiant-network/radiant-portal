import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{f as n}from"./index-60NixA5P.js";import{a}from"./index-B-lxVbXh.js";import{I as t}from"./input-search-C8A9BqxD.js";import"./v4-CtRu48qb.js";import"./utils-CytzSlOG.js";import"./button-DOcMwHed.js";import"./index-DSqg7KUl.js";import"./index-CTzypqlY.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./ActionButton-DzNjlVbA.js";import"./dropdown-menu-DBzaXDUq.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BFdFQidM.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./check-BwCYBAs1.js";import"./createLucideIcon-j2ULFFRy.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-ClICah0q.js";import"./spinner-gjpK1L3h.js";import"./input-bSPY9lgm.js";const z={title:"Data Entry/Inputs/Input Search",component:t,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},e={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>{a("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},o={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>(a("onSearch")(r),new Promise(h=>setTimeout(()=>h(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var c,s,p;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(p=(s=e.parameters)==null?void 0:s.docs)==null?void 0:p.source}}};var m,i,l;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const G=["Default","Async"];export{o as Async,e as Default,G as __namedExportsOrder,z as default};
