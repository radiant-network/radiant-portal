import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as e}from"./button-DZIcAY0X.js";import{A as f,a as n}from"./alert-dialog-provider-CMwSBHsI.js";import"./index-DUAV1Q2A.js";import"./index-U3FPUE7W.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./ActionButton-DJ-zvHxB.js";import"./check-BNLNP-zw.js";import"./createLucideIcon-DirO1-NP.js";import"./utils-BNf5BS2b.js";import"./button.variants-Dx1t5vGh.js";import"./index-C66Dxnp2.js";import"./IconButton-CAjj3x4x.js";const G={title:"Base/Overlays/Alert Dialog Provider",decorators:[s=>r.jsx(f,{children:r.jsx(s,{})})]},t={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"info",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},variant:"primary",children:"Open Alert Dialog"})},o={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"warning",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},variant:"primary",children:"Open Alert Dialog"})},i={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"error",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},variant:"primary",children:"Open Alert Dialog"})},a={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"success",title:"Alert dialog title",description:"Alert dialog description",actionProps:{children:"Ok"}})},variant:"primary",children:"Open Alert Dialog"})},l={render:()=>r.jsx(e,{onClick:()=>{n.open({type:"success",title:"Async alert dialog title",description:"Click save to close and dialog will close after 3 seconds.",actionProps:{children:"Save",onClick:s=>(s.preventDefault(),new Promise(B=>{setTimeout(()=>B(!0),3e3)}))}})},variant:"primary",children:"Open Alert Dialog"})};var c,p,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
    }} variant="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,g;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
    }} variant="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var A,y,k;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
    }} variant="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(k=(y=i.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var v,D,O;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
    }} variant="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(O=(D=a.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var h,C,P;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
    }} variant="primary">
        Open Alert Dialog
      </Button>;
  }
}`,...(P=(C=l.parameters)==null?void 0:C.docs)==null?void 0:P.source}}};const H=["Info","Warning","Error","Success","Async"];export{l as Async,i as Error,t as Info,a as Success,o as Warning,H as __namedExportsOrder,G as default};
