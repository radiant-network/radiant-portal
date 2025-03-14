import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as g}from"./index-DhvbgntC.js";import{a as s}from"./index-B-lxVbXh.js";import{c as x}from"./utils-BNf5BS2b.js";import{B as D}from"./button-CI-NKj0M.js";import{I as P}from"./input-BvXtte4q.js";import{r as c}from"./index-DUAV1Q2A.js";import{c as T}from"./createLucideIcon-DirO1-NP.js";import"./v4-CtRu48qb.js";import"./index-aKoabQ1X.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./ActionButton-Nvid13he.js";import"./dropdown-menu-DWVSay5_.js";import"./Combination-BCojpehm.js";import"./index-BXOWtdLR.js";import"./index-5epIGEb9.js";import"./check-D0WsHlur.js";import"./button.variants-8qSqwKCP.js";import"./index-C66Dxnp2.js";import"./IconButton-BLHdRjzm.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=T("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);function m({ref:a,className:u,type:k,onSearch:N,searchButtonProps:n,...o}){const d=c.useRef(null),[p,h]=c.useState(!1),[f,E]=c.useState(o.value),v=c.useCallback(async e=>{h(!0),await N(e),h(!1)},[]),R=c.useCallback(e=>{const r=d.current;r&&(e.key==="Enter"&&(e.preventDefault(),r.value!==""&&v(f)),e.key==="Escape"&&r.blur())},[d.current]);return t.jsxs("div",{className:"flex items-center",children:[t.jsx(P,{type:k,className:x(u,"rounded-r-none focus:z-[2]"),...o,onKeyDown:e=>{var r;R(e),(r=o.onKeyDown)==null||r.call(o,e)},onChange:e=>{var r;E(e.target.value),(r=o.onChange)==null||r.call(o,e)},ref:e=>{d.current=e,typeof a=="function"?a(e):a&&(a.current=e)}}),t.jsx(D,{color:"default",variant:"outlined",...n,loading:p||(n==null?void 0:n.loading),className:x("h-10 px-3 rounded-l-none ml-[-1px] hover:z-[2]",n==null?void 0:n.className),onClick:()=>v(f),children:!(n!=null&&n.loading)&&!p&&t.jsx(q,{})})]})}m.__docgenInfo={description:"",methods:[],displayName:"InputSearch",props:{onSearch:{required:!0,tsType:{name:"signature",type:"function",raw:'(value: InputProps["value"]) => void | Promise<void>',signature:{arguments:[{type:{name:'ReactComponentProps["value"]',raw:'InputProps["value"]'},name:"value"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:""},searchButtonProps:{required:!1,tsType:{name:"Omit",elements:[{name:"ButtonProps"},{name:"literal",value:'"onClick"'}],raw:'Omit<ButtonProps, "onClick">'},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""}}};const ee={title:"Base/Data Entry/Inputs/Input Search",component:m,args:{value:"Search value",onSearch:g(),onChange:g(),placeholder:"Placeholder",searchButtonProps:{}}},l={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>{s("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},i={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>(s("onSearch")(a),new Promise(u=>setTimeout(()=>u(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var y,S,C;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action("onChange")(e)} onSearch={value => {
      action("onSearch")(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: "primary",
      variant: "filled"
    }} />;
  }
}`,...(C=(S=l.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var w,I,j;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action("onChange")(e)} onSearch={value => {
      action("onSearch")(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: "primary",
      variant: "filled"
    }} />;
  }
}`,...(j=(I=i.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};const ae=["Default","Async"];export{i as Async,l as Default,ae as __namedExportsOrder,ee as default};
