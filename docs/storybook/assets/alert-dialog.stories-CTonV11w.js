import{j as e,a as o}from"./iframe-ikmO-G8w.js";import{B as r}from"./button-f2BnibuH.js";import{a as t}from"./story-section-Do19LCYz.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./check-DFIBGLZn.js";import"./circle-HHVicZ3t.js";import"./separator-DvGIa4AD.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";const f={title:"Components/Alerts/Alert Dialog",component:r},i={render:()=>e.jsx(t,{title:"Info",children:e.jsx(r,{onClick:()=>{o.open({type:"info",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},n={render:()=>e.jsx(t,{title:"Warning",children:e.jsx(r,{onClick:()=>{o.open({type:"warning",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},c={render:()=>e.jsx(t,{title:"Error",children:e.jsx(r,{onClick:()=>{o.open({type:"error",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},s={render:()=>e.jsx(t,{title:"Success",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Ok"}})},color:"primary",children:"Open Alert Dialog"})})},l={render:()=>e.jsx(t,{title:"Async (pending action)",children:e.jsx(r,{onClick:()=>{o.open({type:"success",title:"Title",description:"Description",actionProps:{children:"Save",onClick:p=>(p.preventDefault(),new Promise(a=>{setTimeout(()=>a(!0),3e3)}))}})},color:"primary",children:"Open Alert Dialog"})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const j=["Info","Warning","Error","Success","Async"];export{l as Async,c as Error,i as Info,s as Success,n as Warning,j as __namedExportsOrder,f as default};
