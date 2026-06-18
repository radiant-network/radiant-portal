import{j as e}from"./iframe-pCkdMSW4.js";import{T as o,g as a}from"./transmission-mode-badge-CVB9QZPl.js";import{u as i}from"./i18n-Cv0t7e2j.js";import{a as m}from"./story-section-BWCYvdHs.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-DEvnTpaP.js";import"./separator-BG0cX3CB.js";import"./index-C-yKeQSQ.js";import"./x-C4OEjPPf.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";const j={title:"Components/Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:r}=i(),n=a(r);return e.jsx(m,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:n.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const T=["Default"];export{s as Default,T as __namedExportsOrder,j as default};
