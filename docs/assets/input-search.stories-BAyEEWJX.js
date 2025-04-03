import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{f as g}from"./index-BZkcKs8Z.js";import{a as s}from"./index-B-lxVbXh.js";import{c as p}from"./utils-BNf5BS2b.js";import{B as R}from"./button-CrKCvLOn.js";import{I as q}from"./input-aUNQvU1u.js";import{r as c}from"./index-tvICUrOf.js";import{c as _}from"./createLucideIcon-DKFpjrVJ.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-DRj5dfdv.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./index-C66Dxnp2.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],L=_("Search",F);function m({ref:a,className:u,wrapperClassName:N,type:j,onSearch:k,searchButtonProps:r,...o}){const d=c.useRef(null),[h,f]=c.useState(!1),[E,T]=c.useState(o.value),v=c.useCallback(async e=>{f(!0),await k(e),f(!1)},[]),D=c.useCallback(e=>{const n=d.current;n&&(e.key==="Enter"&&(e.preventDefault(),n.value!==""&&v(n.value)),e.key==="Escape"&&n.blur())},[d.current]);return t.jsxs("div",{className:p("flex items-center w-full",N),children:[t.jsx(q,{type:j,className:p("rounded-r-none focus:z-[2]",u),...o,onKeyDown:e=>{var n;D(e),(n=o.onKeyDown)==null||n.call(o,e)},onChange:e=>{var n;T(e.target.value),(n=o.onChange)==null||n.call(o,e)},ref:e=>{d.current=e,typeof a=="function"?a(e):a&&"current"in a&&(a.current=e)}}),t.jsx(R,{color:"default",...r,loading:h||(r==null?void 0:r.loading),className:p("h-9 px-3 shadow-sm rounded-l-none ml-[-1px] hover:z-[2]",r==null?void 0:r.className),onClick:()=>v(E),children:!(r!=null&&r.loading)&&!h&&t.jsx(L,{})})]})}m.__docgenInfo={description:"",methods:[],displayName:"InputSearch",props:{onSearch:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void | Promise<void>",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:""},searchButtonProps:{required:!1,tsType:{name:"Omit",elements:[{name:"ButtonProps"},{name:"literal",value:"'onClick'"}],raw:"Omit<ButtonProps, 'onClick'>"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""},wrapperClassName:{required:!1,tsType:{name:"string"},description:""}}};const ee={title:"Base/Data Entry/Inputs/Input Search",component:m,args:{value:"Search value",onSearch:g(),onChange:g(),placeholder:"Placeholder",searchButtonProps:{}}},i={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>{s("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},l={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>(s("onSearch")(a),new Promise(u=>setTimeout(()=>u(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var y,x,S;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(S=(x=i.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var w,C,I;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(I=(C=l.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const ae=["Default","Async"];export{l as Async,i as Default,ae as __namedExportsOrder,ee as default};
