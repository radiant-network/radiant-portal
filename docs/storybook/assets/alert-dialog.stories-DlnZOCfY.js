import{j as e,a as o}from"./iframe-KxDQxQDs.js";import{B as r}from"./button-DcEb2QoR.js";import{a as t}from"./story-section-B6HdLg4-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DL5skkIA.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./check-OcLjUnTR.js";import"./circle-YicaXG0V.js";import"./separator-RpiEdedA.js";import"./i18n-BnCxB2cP.js";import"./index-CPmIy41W.js";const j={title:"Components/Alerts/Alert Dialog",component:r},i={render:()=>e.jsx(t,{title:"Info",children:e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},n={render:()=>e.jsx(t,{title:"Warning",children:e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},c={render:()=>e.jsx(t,{title:"Error",children:e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},s={render:()=>e.jsx(t,{title:"Success",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},l={render:()=>e.jsx(t,{title:"Async (pending action)",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:p=>(p.preventDefault(),new Promise(a=>{setTimeout(()=>a(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
