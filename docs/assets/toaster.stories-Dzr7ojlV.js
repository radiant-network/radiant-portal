import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as p}from"./button-dSQT_SKC.js";import{T as n,t as c}from"./index-D_2zGIzb.js";import{u as d}from"./theme-context-BqDe20H9.js";import"./index-b4Krvw3J.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-DuC4fis2.js";import"./dropdown-menu-DGmzL58B.js";import"./index-DZeBqZZX.js";import"./index-CKWZTibS.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./i18n-Byo_kBxC.js";import"./iframe-DLISDnMG.js";const s=({...m})=>{const{theme:a}=d();return r.jsx(n,{theme:a,className:"toaster group",style:{"--normal-bg":"var(--popover)","--normal-text":"var(--popover-foreground)","--normal-border":"var(--border)"},...m})};s.__docgenInfo={description:"",methods:[],displayName:"Toaster"};const $={title:"Feedback/Toaster",component:p},o={render:()=>r.jsxs(r.Fragment,{children:[r.jsx(p,{onClick:()=>{c("Title",{description:"A description"})},color:"primary",children:"Open Toaster"}),r.jsx(s,{position:"top-right"})]})};var t,e,i;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`{
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
}`,...(i=(e=o.parameters)==null?void 0:e.docs)==null?void 0:i.source}}};const q=["Default"];export{o as Default,q as __namedExportsOrder,$ as default};
