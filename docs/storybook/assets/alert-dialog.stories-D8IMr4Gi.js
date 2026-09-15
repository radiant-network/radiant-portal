import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./button-Cn480Lud.js";import{n as i,t as a}from"./alert-dialog-store-BIWgGgjE.js";import{i as o,n as s}from"./story-section-DVTm6cGm.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{i(),n(),o(),c=t(),l={title:`Components/Alerts/Alert Dialog`,component:r},u={render:()=>(0,c.jsx)(s,{title:`Info`,children:(0,c.jsx)(r,{onClick:()=>{a.open({type:`info`,title:`Title`,description:`Description`,actionProps:{children:`Ok`}})},color:`primary`,children:`Open Alert Dialog`})})},d={render:()=>(0,c.jsx)(s,{title:`Warning`,children:(0,c.jsx)(r,{onClick:()=>{a.open({type:`warning`,title:`Title`,description:`Description`,actionProps:{children:`Ok`}})},color:`primary`,children:`Open Alert Dialog`})})},f={render:()=>(0,c.jsx)(s,{title:`Error`,children:(0,c.jsx)(r,{onClick:()=>{a.open({type:`error`,title:`Title`,description:`Description`,actionProps:{children:`Ok`}})},color:`primary`,children:`Open Alert Dialog`})})},p={render:()=>(0,c.jsx)(s,{title:`Success`,children:(0,c.jsx)(r,{onClick:()=>{a.open({type:`success`,title:`Title`,description:`Description`,actionProps:{children:`Ok`}})},color:`primary`,children:`Open Alert Dialog`})})},m={render:()=>(0,c.jsx)(s,{title:`Async (pending action)`,children:(0,c.jsx)(r,{onClick:()=>{a.open({type:`success`,title:`Title`,description:`Description`,actionProps:{children:`Save`,onClick:e=>(e.preventDefault(),new Promise(e=>{setTimeout(()=>e(!0),3e3)}))}})},color:`primary`,children:`Open Alert Dialog`})})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h=[`Info`,`Warning`,`Error`,`Success`,`Async`]})))()}g();export{m as Async,f as Error,u as Info,p as Success,d as Warning,h as __namedExportsOrder,l as default};