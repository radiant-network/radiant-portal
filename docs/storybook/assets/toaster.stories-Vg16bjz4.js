import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./button-22dvIMlN.js";import{n as i,t as a}from"./flask-conical-BYREMSRM.js";import{i as o,n as s,r as c}from"./story-section-DVTm6cGm.js";import{n as l,r as u}from"./dist-BTVu5ZQv.js";import{n as d,t as f}from"./sonner-BroOpTOb.js";var p,m,h,g;function _(){return(_=e((()=>{i(),l(),n(),d(),o(),p=t(),m={title:`Components/Toasters/Toaster`,component:r},h={render:()=>(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(c,{children:[(0,p.jsx)(s,{title:`Default`,children:(0,p.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,p.jsx)(r,{onClick:()=>{u(`Title`)},color:`primary`,children:`Title only`}),(0,p.jsx)(r,{onClick:()=>{u(`Title`,{description:`A description`})},color:`primary`,children:`Title Desc`}),(0,p.jsx)(r,{onClick:()=>{u(`Title`,{description:`A description`,icon:(0,p.jsx)(a,{className:`size-5 text-foreground mt-1`})})},color:`primary`,children:`Custom icon`}),(0,p.jsx)(r,{onClick:()=>{u(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)}})},color:`primary`,children:`Title Desc Action`}),(0,p.jsx)(r,{onClick:()=>{u(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Title Desc Action Close`}),(0,p.jsx)(r,{onClick:()=>{u(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0,icon:(0,p.jsx)(a,{className:`size-5 text-foreground mt-1`})})},color:`primary`,children:`Full options`})]})}),(0,p.jsx)(s,{title:`Feedback`,children:(0,p.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,p.jsx)(r,{onClick:()=>{u.info(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Info Toaster`}),(0,p.jsx)(r,{onClick:()=>{u.success(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Success Toaster`}),(0,p.jsx)(r,{onClick:()=>{u.warning(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Warning Toaster`}),(0,p.jsx)(r,{onClick:()=>{u.error(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Error Toaster`})]})}),(0,p.jsx)(s,{title:`Promise`,children:(0,p.jsx)(`div`,{className:`flex gap-4 items-center`,children:(0,p.jsx)(r,{onClick:()=>{u.promise(()=>new Promise(e=>setTimeout(()=>e({name:`Event`}),2e3)),{loading:`Loading...`,success:e=>`${e.name} has been created`,error:`Error`})},color:`primary`,children:`Promise Toaster`})})})]}),(0,p.jsx)(f,{position:`top-right`})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <StoryShowcase>
        <StorySection title="Default">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast('Title');
          }} color="primary">
              Title only
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description'
            });
          }} color="primary">
              Title Desc
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />
            });
          }} color="primary">
              Custom icon
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              }
            });
          }} color="primary">
              Title Desc Action
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Title Desc Action Close
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true,
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />
            });
          }} color="primary">
              Full options
            </Button>
          </div>
        </StorySection>

        <StorySection title="Feedback">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast.info('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Info Toaster
            </Button>
            <Button onClick={() => {
            toast.success('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Success Toaster
            </Button>
            <Button onClick={() => {
            toast.warning('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Warning Toaster
            </Button>
            <Button onClick={() => {
            toast.error('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Error Toaster
            </Button>
          </div>
        </StorySection>

        <StorySection title="Promise">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast.promise<{
              name: string;
            }>(() => new Promise(resolve => setTimeout(() => resolve({
              name: 'Event'
            }), 2000)), {
              loading: 'Loading...',
              success: data => \`\${data.name} has been created\`,
              error: 'Error'
            });
          }} color="primary">
              Promise Toaster
            </Button>
          </div>
        </StorySection>
      </StoryShowcase>

      <Toaster position="top-right" />
    </>
}`,...h.parameters?.docs?.source}}},g=[`Default`]})))()}_();export{h as Default,g as __namedExportsOrder,m as default};