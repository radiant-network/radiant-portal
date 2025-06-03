import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as r}from"./button-DOcMwHed.js";import{a as o}from"./alert-dialog-store-CZoSfA8g.js";import"./index-DSqg7KUl.js";import"./index-CTzypqlY.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./ActionButton-DzNjlVbA.js";import"./dropdown-menu-DBzaXDUq.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BFdFQidM.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./utils-CytzSlOG.js";import"./check-BwCYBAs1.js";import"./createLucideIcon-j2ULFFRy.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-ClICah0q.js";import"./spinner-gjpK1L3h.js";const N={title:"Feedback/Alert",component:r},t={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},s={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:P=>(P.preventDefault(),new Promise(T=>{setTimeout(()=>T(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var p,a,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(y=(g=n.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var k,O,h;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(h=(O=c.parameters)==null?void 0:O.docs)==null?void 0:h.source}}};var A,B,C;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(C=(B=s.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const Q=["Info","Warning","Error","Success","Async"];export{s as Async,n as Error,t as Info,c as Success,i as Warning,Q as __namedExportsOrder,N as default};
