import{j as u}from"./jsx-runtime-Cf8x2fCZ.js";import{f as n}from"./index-BZkcKs8Z.js";import{a}from"./index-B-lxVbXh.js";import{I as t}from"./input-search-C0X2pnXE.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./utils-CytzSlOG.js";import"./button-68tiabAR.js";import"./index-tvICUrOf.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-B7qNdG6r.js";import"./dropdown-menu-It6xAzeJ.js";import"./index-CJn4dinJ.js";import"./Combination-e2pxAl-M.js";import"./index-D-y1Urua.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./check-CfPT3E_d.js";import"./createLucideIcon-DKFpjrVJ.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-NIzCCAdy.js";import"./spinner-Bn71UZIB.js";import"./input-OUxWDfFO.js";const G={title:"Data Entry/Inputs/Input Search",component:t,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},e={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>{a("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},o={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>(a("onSearch")(r),new Promise(h=>setTimeout(()=>h(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var c,s,p;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const H=["Default","Async"];export{o as Async,e as Default,H as __namedExportsOrder,G as default};
