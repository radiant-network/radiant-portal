import{j as e}from"./iframe-jcf7vZ_R.js";import{T as o,g as a}from"./transmission-mode-badge-DURqgJQM.js";import{u as i}from"./i18n-TdHrRC51.js";import{a as m}from"./story-section-Cpqu6Cmt.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-B8wLsB78.js";import"./separator-etdbqUam.js";import"./index-z6U6JLum.js";import"./x-CsZYw6Ul.js";import"./index-B7ISGQ50.js";import"./index-CMj8FLxF.js";const j={title:"Components/Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:r}=i(),n=a(r);return e.jsx(m,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:n.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
