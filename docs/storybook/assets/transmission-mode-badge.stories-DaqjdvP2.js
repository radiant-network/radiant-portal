import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./i18n-87HgNCfy.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{n as o,r as s,t as c}from"./transmission-mode-badge-CiD42gDl.js";var l,u,d,f;function p(){return(p=e((()=>{s(),r(),i(),l=t(),u={title:`Components/Badges/Transmission Mode Badge`,component:c,args:{value:`other`,variant:`neutral`}},d={render:()=>{let{t:e}=n(),t=o(e);return(0,l.jsx)(a,{title:`Default`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-2 items-start`,children:t.map(e=>(0,l.jsx)(`div`,{children:(0,l.jsx)(c,{value:e.value})},e.value))})})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      t
    } = useI18n();
    const list = getTransmissionModeList(t);
    return <StorySection title="Default">
        <div className="flex flex-col gap-2 items-start">
          {list.map(transmission => <div key={transmission.value}>
              <TransmissionModeBadge value={transmission.value} />
            </div>)}
        </div>
      </StorySection>;
  }
}`,...d.parameters?.docs?.source}}},f=[`Default`]})))()}p();export{d as Default,f as __namedExportsOrder,u as default};