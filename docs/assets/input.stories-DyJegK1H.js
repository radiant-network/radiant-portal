import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-CGj_12n1.js";import{f as x}from"./index-DtL3pAzF.js";import{a as h}from"./index-B-lxVbXh.js";import{I as s}from"./input-CUZJ9Qyj.js";import{c as g}from"./createLucideIcon-8Lr1oLzj.js";import{L as v}from"./list-filter-DyVHreeM.js";import"./v4-CtRu48qb.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],C=g("Car",I),L={title:"Inputs/Input",component:s,args:{value:"Input value",onChange:x(),placeholder:"Placeholder"}},a={render:()=>{const[r,o]=d.useState("");return i.jsx(s,{value:r,onChange:e=>{o(e.target.value),h("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})}},t={render:()=>{const[r,o]=d.useState("");return i.jsx(s,{value:r,startIcon:v,endIcon:C,onChange:e=>{o(e.target.value),h("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})}};var c,n,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <Input value={value} onChange={e => {
      setValue(e.target.value);
      action('onChange')(e);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus />;
  }
}`,...(u=(n=a.parameters)==null?void 0:n.docs)==null?void 0:u.source}}};var l,p,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <Input value={value} startIcon={ListFilter} endIcon={Car} onChange={e => {
      setValue(e.target.value);
      action('onChange')(e);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus />;
  }
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const _=["Default","WithIcon"];export{a as Default,t as WithIcon,_ as __namedExportsOrder,L as default};
