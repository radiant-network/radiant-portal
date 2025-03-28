import{j as c}from"./jsx-runtime-Cf8x2fCZ.js";import{f as g}from"./index-BZkcKs8Z.js";import{a as m}from"./index-B-lxVbXh.js";import{u as R}from"./i18n-Ber6Uh7x.js";import{c as p}from"./utils-BNf5BS2b.js";import{B as q}from"./button-8ZB15y1Y.js";import{I as _}from"./input-BZ84EvCs.js";import{r as i}from"./index-tvICUrOf.js";import{c as F}from"./createLucideIcon-DKFpjrVJ.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./iframe-DkzBV2aV.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-BJjHF_QO.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-DL58Pmf8.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],b=F("Search",L);function u({ref:a,className:t,wrapperClassName:N,type:j,onSearch:k,searchButtonProps:r,...o}){const d=i.useRef(null),[h,f]=i.useState(!1),[E,T]=i.useState(o.value),v=i.useCallback(async e=>{f(!0),await k(e),f(!1)},[]),D=i.useCallback(e=>{const n=d.current;n&&(e.key==="Enter"&&(e.preventDefault(),n.value!==""&&v(n.value)),e.key==="Escape"&&n.blur())},[d.current]);return c.jsxs("div",{className:p("flex items-center w-full",N),children:[c.jsx(_,{type:j,className:p("rounded-r-none focus:z-[2]",t),...o,onKeyDown:e=>{var n;D(e),(n=o.onKeyDown)==null||n.call(o,e)},onChange:e=>{var n;T(e.target.value),(n=o.onChange)==null||n.call(o,e)},ref:e=>{d.current=e,typeof a=="function"?a(e):a&&(a.current=e)}}),c.jsx(q,{color:"default",variant:"outlined",...r,loading:h||(r==null?void 0:r.loading),className:p("h-10 px-3 rounded-l-none ml-[-1px] hover:z-[2]",r==null?void 0:r.className),onClick:()=>v(E),children:!(r!=null&&r.loading)&&!h&&c.jsx(b,{})})]})}u.__docgenInfo={description:"",methods:[],displayName:"InputSearch",props:{onSearch:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void | Promise<void>",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:""},searchButtonProps:{required:!1,tsType:{name:"Omit",elements:[{name:"ButtonProps"},{name:"literal",value:"'onClick'"}],raw:"Omit<ButtonProps, 'onClick'>"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""},wrapperClassName:{required:!1,tsType:{name:"string"},description:""}}};const te={title:"Base/Data Entry/Inputs/Input Search",component:u,args:{value:"Search value",onSearch:g(),onChange:g(),placeholder:"Placeholder",searchButtonProps:{}}},l={render:()=>{const{t:a}=R();return c.jsx(u,{onChange:t=>m("onChange")(t),onSearch:t=>{m("onSearch")(t)},className:"max-w-[300px]",placeholder:a("common.search.placeholder"),autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})}},s={render:()=>c.jsx(u,{onChange:a=>m("onChange")(a),onSearch:a=>(m("onSearch")(a),new Promise(t=>setTimeout(()=>t(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var y,x,S;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder={t('common.search.placeholder')} autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(S=(x=l.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var w,C,I;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(I=(C=s.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const ce=["Default","Async"];export{s as Async,l as Default,ce as __namedExportsOrder,te as default};
