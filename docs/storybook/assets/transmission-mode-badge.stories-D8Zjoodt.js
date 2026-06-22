import{j as e}from"./iframe-CXwxzQgG.js";import{T as n,g as a}from"./transmission-mode-badge-DAsqeQtV.js";import{u as i}from"./i18n-gHAOwTiM.js";import{a as l}from"./story-section-puWRqKt8.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-gLJ5M8f2.js";import"./separator-pzXO6oVw.js";import"./x-Bto3vMF3.js";import"./index-DCs8_3sr.js";const S={title:"Components/Badges/Transmission Mode Badge",component:n,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:o}=i(),r=a(o);return e.jsx(l,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:r.map(t=>e.jsx("div",{children:e.jsx(n,{value:t.value})},t.value))})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const h=["Default"];export{s as Default,h as __namedExportsOrder,S as default};
