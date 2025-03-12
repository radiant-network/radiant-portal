import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{r as g}from"./index-DUAV1Q2A.js";import{f as u}from"./index-DhvbgntC.js";import{a as p}from"./index-B-lxVbXh.js";import{c as d}from"./utils-BNf5BS2b.js";import{B as S}from"./button-C4hRftkF.js";import{I as y}from"./input-BvXtte4q.js";import{c as C}from"./createLucideIcon-DirO1-NP.js";import"./v4-CtRu48qb.js";import"./index-aKoabQ1X.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./ActionButton-BJyb2P8g.js";import"./dropdown-menu-BQyRnyXE.js";import"./Combination-BCojpehm.js";import"./index-BXOWtdLR.js";import"./index-5epIGEb9.js";import"./check-D0WsHlur.js";import"./button.variants-BeBGLAvg.js";import"./index-C66Dxnp2.js";import"./IconButton-BwvlZF0D.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=C("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);function i({ref:o,className:l,type:a,onSearch:m,searchButtonProps:e,...t}){const[x,I]=g.useState(t.value);return r.jsxs("div",{className:"flex items-center",children:[r.jsx(y,{type:a,className:d(l,"rounded-r-none focus:z-[2]"),...t,onChange:s=>{var c;I(s.target.value),(c=t.onChange)==null||c.call(t,s)},ref:o}),r.jsx(S,{color:"default",variant:"outlined",...e,className:d("h-10 rounded-l-none ml-[-1px] hover:z-[2]",e==null?void 0:e.className),onClick:()=>m==null?void 0:m(x),children:!(e!=null&&e.loading)&&r.jsx(j,{})})]})}i.__docgenInfo={description:"",methods:[],displayName:"InputSearch",props:{onSearch:{required:!1,tsType:{name:"signature",type:"function",raw:'(value: InputProps["value"]) => void',signature:{arguments:[{type:{name:'ReactComponentProps["value"]',raw:'InputProps["value"]'},name:"value"}],return:{name:"void"}}},description:""},searchButtonProps:{required:!1,tsType:{name:"Omit",elements:[{name:"ButtonProps"},{name:"literal",value:'"onClick"'}],raw:'Omit<ButtonProps, "onClick">'},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""}}};const K={title:"Base/Data Entry/Inputs/Input Search",component:i,args:{value:"Search value",onSearch:u(),onChange:u(),placeholder:"Placeholder",searchButtonProps:{}}},n={render:()=>{const[o,l]=g.useState("");return r.jsx(i,{value:o,onChange:a=>{l(a.target.value),p("onChange")(a)},onSearch:a=>{p("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})}};var f,v,h;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <InputSearch value={value} onChange={e => {
      setValue(e.target.value);
      action("onChange")(e);
    }} onSearch={value => {
      action("onSearch")(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: "primary",
      variant: "filled"
    }} />;
  }
}`,...(h=(v=n.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const Q=["Default"];export{n as Default,Q as __namedExportsOrder,K as default};
