import{j as e}from"./iframe-X1FdiBKE.js";import{T as r,g as o}from"./transmission-mode-badge-DYLHhtjL.js";import{u as i}from"./i18n-DsLlobA0.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-B50hIUkw.js";import"./separator-BcF0hBxw.js";import"./index-BerhZw8G.js";import"./x-CT6RiXhO.js";import"./index-BoMd93ow.js";const g={title:"Badges/Transmission Mode Badge",component:r,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:a}=i(),n=o(a);return e.jsx("div",{className:"flex flex-col gap-2 items-start",children:n.map(t=>e.jsx("div",{children:e.jsx(r,{value:t.value})},t.value))})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      t
    } = useI18n();
    const list = getTransmissionModeList(t);
    return <div className="flex flex-col gap-2 items-start">
        {list.map(transmission => <div key={transmission.value}>
            <TransmissionModeBadge value={transmission.value} />
          </div>)}
      </div>;
  }
}`,...s.parameters?.docs?.source}}};const T=["Default"];export{s as Default,T as __namedExportsOrder,g as default};
