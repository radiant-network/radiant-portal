import{u as r,j as e}from"./iframe-CgZaKe5d.js";import{T as n,g as i}from"./transmission-mode-badge-CjtiMvWc.js";import{a as l}from"./story-section-Cd-IQlgl.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-Dyg9dEFi.js";import"./x-C9LJTscZ.js";const f={title:"Components/Badges/Transmission Mode Badge",component:n,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:a}=r(),o=i(a);return e.jsx(l,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:o.map(t=>e.jsx("div",{children:e.jsx(n,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const x=["Default"];export{s as Default,x as __namedExportsOrder,f as default};
