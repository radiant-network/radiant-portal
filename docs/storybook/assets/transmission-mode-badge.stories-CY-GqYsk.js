import{j as e}from"./iframe-D5nbMH0Z.js";import{T as o,g as a}from"./transmission-mode-badge-Cy0W5OLG.js";import{u as i}from"./i18n-Bdg0oCKu.js";import{a as m}from"./story-section-DfWRQdTn.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-Dy7MQtY_.js";import"./separator-DOf7FV04.js";import"./index-Cc9ovpm8.js";import"./x-CmBLWl3D.js";import"./index-inuiUwi3.js";import"./index-CJ_W4xqL.js";const j={title:"Components/Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:r}=i(),n=a(r);return e.jsx(m,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:n.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
