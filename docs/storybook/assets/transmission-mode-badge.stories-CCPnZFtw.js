import{j as s}from"./iframe-DZxGQyD0.js";import{T as n,g as m}from"./transmission-mode-badge-D3ZmVcba.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-9kw-3hki.js";import"./separator-DW3ZXT-L.js";import"./index-Busr1vTm.js";import"./x-BOWcXDh5.js";import"./i18n-C2h1o0aw.js";const f={title:"Badges/Transmission Mode Badge",component:n,args:{value:"other",variant:"neutral"}},e={render:()=>{const o=m(()=>{});return s.jsx("div",{className:"flex flex-col gap-2 items-start",children:o.map(r=>s.jsx("div",{children:s.jsx(n,{value:r.value})},r.value))})}};var t,a,i;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line prettier/prettier
    const list = getTransmissionModeList(() => {});
    return <div className="flex flex-col gap-2 items-start">
        {list.map(transmission => <div key={transmission.value}>
            <TransmissionModeBadge value={transmission.value} />
          </div>)}
      </div>;
  }
}`,...(i=(a=e.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};const T=["Default"];export{e as Default,T as __namedExportsOrder,f as default};
