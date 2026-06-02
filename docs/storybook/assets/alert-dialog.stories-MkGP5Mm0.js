import{j as r,a as o}from"./iframe-BH3MSqWK.js";import{B as e}from"./button-BxP9PPaa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CfauPKxk.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./check-Bk5l44Qw.js";import"./circle-Cyir8aSn.js";import"./separator-DyfWTagX.js";import"./i18n-MpjanH8G.js";import"./index-BSwCZ4xH.js";const P={title:"Alerts/Alert Dialog",component:e},t={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},i={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},n={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},c={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})},s={render:()=>r.jsx(e,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:p=>(p.preventDefault(),new Promise(a=>{setTimeout(()=>a(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const T=["Info","Warning","Error","Success","Async"];export{s as Async,n as Error,t as Info,c as Success,i as Warning,T as __namedExportsOrder,P as default};
