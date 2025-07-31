import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as r}from"./button-C26fIeO9.js";import{a as o}from"./alert-dialog-store-CZoSfA8g.js";import"./index-Dw-eQTPP.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-DqULcOY_.js";import"./iframe-DfTFzHoN.js";import"./context-DNAkM4o1.js";const X={title:"Feedback/Alert",component:r},t={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},p={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:P=>(P.preventDefault(),new Promise(T=>{setTimeout(()=>T(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var s,a,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: 'info',
        title: 'Title',
        description: 'Description',
        actionProps: {
          children: 'Ok'
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};var m,d,u;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: 'warning',
        title: 'Title',
        description: 'Description',
        actionProps: {
          children: 'Ok'
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(u=(d=i.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var D,g,y;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: 'error',
        title: 'Title',
        description: 'Description',
        actionProps: {
          children: 'Ok'
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(y=(g=n.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var k,O,h;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: 'success',
        title: 'Title',
        description: 'Description',
        actionProps: {
          children: 'Ok'
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(h=(O=p.parameters)==null?void 0:O.docs)==null?void 0:h.source}}};var A,B,C;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: 'success',
        title: 'Title',
        description: 'Description',
        actionProps: {
          children: 'Save',
          onClick: e => {
            e.preventDefault();
            return new Promise(resolve => {
              setTimeout(() => resolve(true), 3000);
            });
          }
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(C=(B=c.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const Y=["Info","Warning","Error","Success","Async"];export{c as Async,n as Error,t as Info,p as Success,i as Warning,Y as __namedExportsOrder,X as default};
