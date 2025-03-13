import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as e}from"./button-CZ2wj3T7.js";import{A as v,a as n}from"./alert-dialog-provider-D91W8Qcu.js";import"./index-DUAV1Q2A.js";import"./index-aKoabQ1X.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./ActionButton-CAeW9hLt.js";import"./dropdown-menu-Dx2bnrNe.js";import"./Combination-BCojpehm.js";import"./index-BXOWtdLR.js";import"./index-5epIGEb9.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DirO1-NP.js";import"./check-D0WsHlur.js";import"./button.variants-8qSqwKCP.js";import"./index-C66Dxnp2.js";import"./IconButton-BLHdRjzm.js";import"./index-BiAv9jRD.js";const M={title:"Base/Overlays/Alert Dialog Provider",decorators:[s=>r.jsx(v,{children:r.jsx(s,{})})]},o={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"info",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},t={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"warning",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"error",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},l={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"success",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},a={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"success",title:"Async alert dialog title",description:"Click save to close and dialog will close after 3 seconds.",actionProps:{children:"Save",onClick:s=>(s.preventDefault(),new Promise(f=>{setTimeout(()=>f(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var c,p,d;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: "info",
        title: "Alert dialog title",
        description: "Alert dialog description",
        actionProps: {
          children: "Ok"
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(d=(p=o.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: "warning",
        title: "Alert dialog title",
        description: "Alert dialog description",
        actionProps: {
          children: "Ok"
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var A,y,k;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: "error",
        title: "Alert dialog title",
        description: "Alert dialog description",
        actionProps: {
          children: "Ok"
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(k=(y=i.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var D,O,h;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: "success",
        title: "Alert dialog title",
        description: "Alert dialog description",
        actionProps: {
          children: "Ok"
        }
      });
    }} color="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(h=(O=l.parameters)==null?void 0:O.docs)==null?void 0:h.source}}};var C,P,B;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return <Button onClick={() => {
      alertDialog.open({
        type: "success",
        title: "Async alert dialog title",
        description: "Click save to close and dialog will close after 3 seconds.",
        actionProps: {
          children: "Save",
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
}`,...(B=(P=a.parameters)==null?void 0:P.docs)==null?void 0:B.source}}};const N=["Info","Warning","Error","Success","Async"];export{a as Async,i as Error,o as Info,l as Success,t as Warning,N as __namedExportsOrder,M as default};
