import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as o}from"./alert-dialog-store-CZoSfA8g.js";import{B as r}from"./button-BDzUyvby.js";import"./index-B7CJuYpG.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-9lkLPkgi.js";import"./iframe-CxA8_9go.js";import"./i18next-DOi7g2fS.js";const rr={title:"Alerts/Alert Dialog",component:r},t={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},p={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:P=>(P.preventDefault(),new Promise(T=>{setTimeout(()=>T(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var s,a,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <Button onClick={() => {
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
    </Button>
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};var m,d,u;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Button onClick={() => {
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
    </Button>
}`,...(u=(d=i.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var D,g,y;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <Button onClick={() => {
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
    </Button>
}`,...(y=(g=n.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var k,O,h;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <Button onClick={() => {
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
    </Button>
}`,...(h=(O=p.parameters)==null?void 0:O.docs)==null?void 0:h.source}}};var A,B,C;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <Button onClick={() => {
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
    </Button>
}`,...(C=(B=c.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const er=["Info","Warning","Error","Success","Async"];export{c as Async,n as Error,t as Info,p as Success,i as Warning,er as __namedExportsOrder,rr as default};
