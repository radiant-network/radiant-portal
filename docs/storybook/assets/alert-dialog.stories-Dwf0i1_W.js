import{j as e,a as o}from"./iframe-CfiqPze7.js";import{B as r}from"./button-BoXZHvQI.js";import{a as t}from"./story-section-DuGdZxO-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BZH6fmNO.js";import"./action-button-CCiT5Wq2.js";import"./dropdown-menu-DNmiLd3x.js";import"./index-B4wmxKez.js";import"./index-DPFDfypm.js";import"./check-Dmg2ouYX.js";import"./circle-BQIUCCgT.js";import"./separator-BFc4bAvf.js";import"./i18n-reUsGHBL.js";import"./index-iRVpXJFQ.js";const j={title:"Components/Alerts/Alert Dialog",component:r},i={render:()=>e.jsx(t,{title:"Info",children:e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},n={render:()=>e.jsx(t,{title:"Warning",children:e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},c={render:()=>e.jsx(t,{title:"Error",children:e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},s={render:()=>e.jsx(t,{title:"Success",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},l={render:()=>e.jsx(t,{title:"Async (pending action)",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:p=>(p.preventDefault(),new Promise(a=>{setTimeout(()=>a(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Info">
      <Button onClick={() => {
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
    </StorySection>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Warning">
      <Button onClick={() => {
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
    </StorySection>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error">
      <Button onClick={() => {
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
    </StorySection>
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Success">
      <Button onClick={() => {
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
    </StorySection>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Async (pending action)">
      <Button onClick={() => {
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
    </StorySection>
}`,...l.parameters?.docs?.source}}};const B=["Info","Warning","Error","Success","Async"];export{l as Async,c as Error,i as Info,s as Success,n as Warning,B as __namedExportsOrder,j as default};
