import{j as r,a as o}from"./iframe-DPCX_vyO.js";import{B as e}from"./button-DGbd45qr.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DBmHguou.js";import"./action-button-B2f6sewW.js";import"./dropdown-menu-Do2hewv7.js";import"./index-Bz-Twzm4.js";import"./index-4f4sMJQ-.js";import"./check-Cva_u8Wi.js";import"./circle-_vVbOuMs.js";import"./separator-DG3bXgVX.js";import"./i18n-B5rlBJwG.js";const q={title:"Alerts/Alert Dialog",component:e},t={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},s={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:P=>(P.preventDefault(),new Promise(T=>{setTimeout(()=>T(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};var p,a,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};var d,m,u;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(u=(m=i.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var D,g,y;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(y=(g=n.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var k,O,h;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(h=(O=c.parameters)==null?void 0:O.docs)==null?void 0:h.source}}};var A,B,C;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(C=(B=s.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const z=["Info","Warning","Error","Success","Async"];export{s as Async,n as Error,t as Info,c as Success,i as Warning,z as __namedExportsOrder,q as default};
