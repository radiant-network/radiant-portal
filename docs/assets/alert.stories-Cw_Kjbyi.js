import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{B as e}from"./button-jDSDczSi.js";import{A as x,a as o}from"./alert-dialog-provider-FaMoQFbU.js";import"./index-yBjzXJbu.js";import"./index-tvICUrOf.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-Ck2ONir5.js";import"./dropdown-menu-CerXlXcA.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./ellipsis-NIzCCAdy.js";import"./index-BYARNSco.js";const L={title:"Feedback/Alert",component:e,decorators:[p=>r.jsx(x,{children:r.jsx(p,{})})]},t={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},s={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:p=>(p.preventDefault(),new Promise(T=>{setTimeout(()=>T(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var a,l,m;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(m=(l=t.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var d,u,D;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(D=(u=i.parameters)==null?void 0:u.docs)==null?void 0:D.source}}};var g,y,k;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(k=(y=n.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var O,h,A;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(A=(h=c.parameters)==null?void 0:h.docs)==null?void 0:A.source}}};var P,B,C;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(C=(B=s.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const M=["Info","Warning","Error","Success","Async"];export{s as Async,n as Error,t as Info,c as Success,i as Warning,M as __namedExportsOrder,L as default};
