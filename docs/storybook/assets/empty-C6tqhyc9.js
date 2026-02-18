import{g as r,f as y,j as e,c as n}from"./iframe-DiydeeGO.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],i=r("ChartColumn",j);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]],o=r("ChartLine",C);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],l=r("ChartPie",v);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}],["circle",{cx:"18.5",cy:"5.5",r:".5",fill:"currentColor",key:"lysivs"}],["circle",{cx:"11.5",cy:"11.5",r:".5",fill:"currentColor",key:"byv1b8"}],["circle",{cx:"7.5",cy:"16.5",r:".5",fill:"currentColor",key:"nkw3mc"}],["circle",{cx:"17.5",cy:"14.5",r:".5",fill:"currentColor",key:"1gjh6j"}],["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}]],d=r("ChartScatter",N),k=y({slots:{base:"flex flex-col justify-center",iconsContainer:"text-neutral",textContainer:"",title:"text-center font-semibold",description:"text-center text-muted-foreground font-normal",customIcon:"flex items-center justify-center border rounded-md"},variants:{bordered:{true:{base:"border border-dashed rounded-lg"}},size:{mini:{base:"py-6 gap-3",iconsContainer:"[&_svg]:size-4",textContainer:"space-y-2",title:"text-base",description:"text-xs",customIcon:"size-9 [&_svg]:size-6"},default:{base:"py-8 gap-6",iconsContainer:"[&_svg]:size-6",textContainer:"space-y-2",title:"text-lg",description:"text-sm",customIcon:"size-12"}}},defaultVariants:{size:"default"}});function b({title:s,description:c,showIcon:m=!0,bordered:u=!1,iconType:a,icon:x,size:f,className:p,...h}){const t=k({size:f,bordered:u});return e.jsxs("div",{className:t.base({className:p}),...h,children:[m?a==="chartRow"?e.jsx(g,{className:t.iconsContainer()}):a==="chartGrid"?e.jsx(_,{className:t.iconsContainer()}):a==="custom"?e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:t.customIcon(),children:e.jsx(x,{})})}):null:null,e.jsxs("div",{className:t.textContainer(),children:[s&&e.jsx("h1",{className:t.title(),children:s}),c&&e.jsx("div",{className:t.description(),children:c})]})]})}function g({className:s,...c}){return e.jsxs("div",{className:n("flex gap-1 justify-center items-center",s),...c,children:[e.jsx(i,{}),e.jsx(l,{}),e.jsx(o,{}),e.jsx(d,{})]})}function _({className:s,...c}){return e.jsxs("div",{className:n("flex flex-col gap-1 justify-center items-center",s),...c,children:[e.jsxs("div",{className:"flex gap-0.5 ml-3",children:[e.jsx(l,{className:"mb-2"}),e.jsx(d,{className:"mt-2"})]}),e.jsxs("div",{className:"flex gap-0.5 mr-3 -mt-4",children:[e.jsx(i,{className:"mb-2"}),e.jsx(o,{className:"mt-2"})]})]})}b.__docgenInfo={description:"",methods:[],displayName:"Empty",props:{showIcon:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},bordered:{defaultValue:{value:"false",computed:!1},required:!1}}};export{b as E};
