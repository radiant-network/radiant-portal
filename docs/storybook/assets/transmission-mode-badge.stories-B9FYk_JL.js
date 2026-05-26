import{j as e}from"./iframe-Bgs5NfMc.js";import{T as o,g as l}from"./transmission-mode-badge-2gOfzbe_.js";import{u as d}from"./i18n-CYz5bEHL.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-OBtVNDMZ.js";import"./separator-BUulNCgX.js";import"./index-s_Ex46g1.js";import"./x-Pr3BRuzX.js";const h={title:"Badges/Transmission Mode Badge",component:o,args:{value:"other",variant:"neutral"}},s={render:()=>{const{t:i}=d(),m=l(i);return e.jsx("div",{className:"flex flex-col gap-2 items-start",children:m.map(t=>e.jsx("div",{children:e.jsx(o,{value:t.value})},t.value))})}};var a,r,n;s.parameters={...s.parameters,docs:{...(a=s.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(n=(r=s.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const j=["Default"];export{s as Default,j as __namedExportsOrder,h as default};
