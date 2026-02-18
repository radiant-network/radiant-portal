import{g as m,j as a,ak as p,c as v}from"./iframe-DiydeeGO.js";import{B as n}from"./button-BpQoX9AX.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B7hOF3du.js";import"./action-button-CfmhRu5e.js";import"./dropdown-menu-CdVAlv0x.js";import"./index-D3WEPLb5.js";import"./circle-BhlZk34l.js";import"./check-Dn9AvtKh.js";import"./separator-DR0R7ySQ.js";import"./i18n-3c6sQS03.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]],u=m("Loader",x);function e({className:l,variant:o="loader2",...d}){const c=o==="loader2"?p:u;return a.jsx(c,{role:"status","aria-label":"Loading",className:v("size-4 animate-spin",l),...d})}e.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{variant:{required:!1,tsType:{name:"union",raw:"'loader' | 'loader2'",elements:[{name:"literal",value:"'loader'"},{name:"literal",value:"'loader2'"}]},description:"",defaultValue:{value:"'loader2'",computed:!1}}}};const _={title:"Spinner/Spinner",component:e},s={render:()=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx("h4",{children:"Sizes"}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsx(e,{variant:"loader2",className:"size-3"}),a.jsx(e,{variant:"loader2"}),a.jsx(e,{variant:"loader2",className:"size-5"}),a.jsx(e,{variant:"loader2",className:"size-6"}),a.jsx(e,{variant:"loader2",className:"size-8"})]}),a.jsx("h4",{children:"Spinner inside Buttons"}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsx(n,{variant:"default",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})}),a.jsx(n,{variant:"secondary",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})}),a.jsx(n,{variant:"ghost",iconOnly:!0,children:a.jsx(e,{variant:"loader2",className:"size-6"})})]}),a.jsxs("div",{className:"flex gap-4 items-center",children:[a.jsxs(n,{variant:"default",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Primary"]}),a.jsxs(n,{variant:"secondary",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Secondary"]}),a.jsxs(n,{variant:"ghost",children:[a.jsx(e,{variant:"loader2",className:"size-6"}),"Ghost"]})]}),a.jsx("h4",{children:"Spinner custom"}),a.jsx("div",{className:"flex gap-4 items-center",children:a.jsx(e,{variant:"loader"})})]})};var r,i,t;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(t=(i=s.parameters)==null?void 0:i.docs)==null?void 0:t.source}}};const L=["SpinnerVariants"];export{s as SpinnerVariants,L as __namedExportsOrder,_ as default};
