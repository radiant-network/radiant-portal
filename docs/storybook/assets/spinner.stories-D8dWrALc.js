import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{B as n}from"./button-BCi5xmsu.js";import{c}from"./utils-CDN07tui.js";import{L as p}from"./spinner-DMuui_2m.js";import{c as v}from"./createLucideIcon-B119WVF5.js";import"./index-C-d7IIsQ.js";import"./index-CBYaBgW8.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-BDh9_oPQ.js";import"./iframe-C4P00CmD.js";import"./i18next-CYn7LYXT.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]],u=v("Loader",x);function e({className:o,variant:l="loader2",...d}){const m=l==="loader2"?p:u;return a.jsx(m,{role:"status","aria-label":"Loading",className:c("size-4 animate-spin",o),...d})}e.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{variant:{required:!1,tsType:{name:"union",raw:"'loader' | 'loader2'",elements:[{name:"literal",value:"'loader'"},{name:"literal",value:"'loader2'"}]},description:"",defaultValue:{value:"'loader2'",computed:!1}}}};const Q={title:"Spinner/Spinner",component:e},r={render:()=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx("h4",{children:"Sizes"}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsx(e,{variant:"loader2",className:"size-3"}),a.jsx(e,{variant:"loader2"}),a.jsx(e,{variant:"loader2",className:"size-5"}),a.jsx(e,{variant:"loader2",className:"size-6"}),a.jsx(e,{variant:"loader2",className:"size-8"})]}),a.jsx("h4",{children:"Spinner inside Buttons"}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsx(n,{variant:"default",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})}),a.jsx(n,{variant:"secondary",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})}),a.jsx(n,{variant:"ghost",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})})]}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsxs(n,{variant:"default",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Primary"]}),a.jsxs(n,{variant:"secondary",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Secondary"]}),a.jsxs(n,{variant:"ghost",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Ghost"]})]}),a.jsx("h4",{children:"Spinner custom"}),a.jsx("div",{className:"flex gap-4 items-center",children:a.jsx(e,{variant:"loader"})})]})};var i,s,t;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h4>Sizes</h4>
      <div className="flex gap-4 items-center">
        <Spinner variant="loader2" className="size-3" />
        <Spinner variant="loader2" />
        <Spinner variant="loader2" className="size-5" />
        <Spinner variant="loader2" className="size-6" />
        <Spinner variant="loader2" className="size-8" />
      </div>
      <h4>Spinner inside Buttons</h4>
      <div className="flex gap-4 items-center">
        <Button variant="default" iconOnly>
          <Spinner variant="loader2" className="size-6" />
        </Button>
        <Button variant="secondary" iconOnly>
          <Spinner variant="loader2" className="size-6" />
        </Button>
        <Button variant="ghost" iconOnly>
          <Spinner variant="loader2" className="size-6" />
        </Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="default">
          <Spinner variant="loader2" className="size-6" />
          Primary
        </Button>
        <Button variant="secondary">
          <Spinner variant="loader2" className="size-6" />
          Secondary
        </Button>
        <Button variant="ghost">
          <Spinner variant="loader2" className="size-6" />
          Ghost
        </Button>
      </div>
      <h4>Spinner custom</h4>
      <div className="flex gap-4 items-center">
        <Spinner variant="loader" />
      </div>
    </div>
}`,...(t=(s=r.parameters)==null?void 0:s.docs)==null?void 0:t.source}}};const U=["SpinnerVariants"];export{r as SpinnerVariants,U as __namedExportsOrder,Q as default};
