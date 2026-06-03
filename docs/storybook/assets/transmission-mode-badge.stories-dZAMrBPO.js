import{j as e}from"./iframe-KxDQxQDs.js";import{T as o,g as a}from"./transmission-mode-badge-o26ZWI2g.js";import{u as i}from"./i18n-BnCxB2cP.js";import{a as m}from"./story-section-B6HdLg4-.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-C0o81Ql6.js";import"./separator-RpiEdedA.js";import"./index-DL5skkIA.js";import"./x-8Vd-H5Q8.js";import"./index-CPmIy41W.js";const h={title:"Components/Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:n}=i(),r=a(n);return e.jsx(m,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:r.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const j=["Default"];export{s as Default,j as __namedExportsOrder,h as default};
