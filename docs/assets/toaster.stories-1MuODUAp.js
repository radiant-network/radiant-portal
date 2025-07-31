import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as p}from"./button-C26fIeO9.js";import{T as n,t as c}from"./index-D_2zGIzb.js";import{u as d}from"./theme-context-BqDe20H9.js";import"./index-Dw-eQTPP.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-DqULcOY_.js";import"./iframe-DfTFzHoN.js";import"./context-DNAkM4o1.js";const s=({...m})=>{const{theme:a}=d();return r.jsx(n,{theme:a,className:"toaster group",style:{"--normal-bg":"var(--popover)","--normal-text":"var(--popover-foreground)","--normal-border":"var(--border)"},...m})};s.__docgenInfo={description:"",methods:[],displayName:"Toaster"};const w={title:"Feedback/Toaster",component:p},o={render:()=>r.jsxs(r.Fragment,{children:[r.jsx(p,{onClick:()=>{c("Title",{description:"A description"})},color:"primary",children:"Open Toaster"}),r.jsx(s,{position:"top-right"})]})};var t,e,i;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    return <>
        <Button onClick={() => {
        toast("Title", {
          description: "A description"
        });
      }} color="primary">
          Open Toaster
        </Button>
        <Toaster position='top-right' />
      </>;
  }
}`,...(i=(e=o.parameters)==null?void 0:e.docs)==null?void 0:i.source}}};const z=["Default"];export{o as Default,z as __namedExportsOrder,w as default};
