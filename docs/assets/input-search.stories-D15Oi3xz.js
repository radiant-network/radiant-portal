import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as y}from"./index-DZ0MIZXx.js";import{a as s}from"./index-B-lxVbXh.js";import{c as p}from"./utils-BNf5BS2b.js";import{B as R}from"./button-CxxI4gy-.js";import{I as q}from"./input-BBoUXjlS.js";import{r as i}from"./index-DUAV1Q2A.js";import{c as _}from"./createLucideIcon-BJ1WAg3L.js";import"./v4-CtRu48qb.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./ActionButton-DnR3bAYu.js";import"./dropdown-menu-B4A7Rs1f.js";import"./Combination-GE29BHtn.js";import"./index-D74gQ3ji.js";import"./check-CSglOr1T.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-C7j2XGxo.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],L=_("Search",F);function m({ref:a,className:u,wrapperClassName:j,type:k,onSearch:E,searchButtonProps:r,...o}){const d=i.useRef(null),[f,h]=i.useState(!1),[v,T]=i.useState(o.value),g=i.useCallback(async e=>{h(!0),await E(e),h(!1)},[]),D=i.useCallback(e=>{const n=d.current;n&&(e.key==="Enter"&&(e.preventDefault(),n.value!==""&&g(v)),e.key==="Escape"&&n.blur())},[d.current]);return t.jsxs("div",{className:p("flex items-center w-full",j),children:[t.jsx(q,{type:k,className:p("rounded-r-none focus:z-[2]",u),...o,onKeyDown:e=>{var n;D(e),(n=o.onKeyDown)==null||n.call(o,e)},onChange:e=>{var n;T(e.target.value),(n=o.onChange)==null||n.call(o,e)},ref:e=>{d.current=e,typeof a=="function"?a(e):a&&(a.current=e)}}),t.jsx(R,{color:"default",variant:"outlined",...r,loading:f||(r==null?void 0:r.loading),className:p("h-10 px-3 rounded-l-none ml-[-1px] hover:z-[2]",r==null?void 0:r.className),onClick:()=>g(v),children:!(r!=null&&r.loading)&&!f&&t.jsx(L,{})})]})}m.__docgenInfo={description:"",methods:[],displayName:"InputSearch",props:{onSearch:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void | Promise<void>",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:""},searchButtonProps:{required:!1,tsType:{name:"Omit",elements:[{name:"ButtonProps"},{name:"literal",value:"'onClick'"}],raw:"Omit<ButtonProps, 'onClick'>"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""},wrapperClassName:{required:!1,tsType:{name:"string"},description:""}}};const ae={title:"Base/Data Entry/Inputs/Input Search",component:m,args:{value:"Search value",onSearch:y(),onChange:y(),placeholder:"Placeholder",searchButtonProps:{}}},c={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>{s("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},l={render:()=>t.jsx(m,{onChange:a=>s("onChange")(a),onSearch:a=>(s("onSearch")(a),new Promise(u=>setTimeout(()=>u(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var x,S,w;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(w=(S=c.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var C,I,N;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(N=(I=l.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};const re=["Default","Async"];export{l as Async,c as Default,re as __namedExportsOrder,ae as default};
