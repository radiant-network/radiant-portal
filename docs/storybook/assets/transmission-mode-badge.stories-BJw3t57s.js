import{j as e}from"./iframe-C3tvUR1J.js";import{T as o,g as a}from"./transmission-mode-badge-BIiwN7Kp.js";import{u as i}from"./i18n-sXy_IXHd.js";import{a as m}from"./story-section-Cml820jU.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-D4PZM7uY.js";import"./separator-DYKEDePW.js";import"./index-wNbfclQ1.js";import"./x-QdJ2UURP.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";const j={title:"Components/Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:r}=i(),n=a(r);return e.jsx(m,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:n.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
