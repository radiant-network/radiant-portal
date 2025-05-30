import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{c as G}from"./index-C66Dxnp2.js";import{c as C}from"./utils-CytzSlOG.js";import{C as k,a as v,b as z,c as E}from"./chart-scatter-CBOtGyB9.js";import{c as q}from"./createLucideIcon-BOZfVBeY.js";import"./index-yBjzXJbu.js";import"./index-t5q4d8OJ.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m17 6-2.891-2.891",key:"xu6p2f"}],["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"m20 9 .891.891",key:"3xwk7g"}],["path",{d:"M3.109 14.109 4 15",key:"q76aoh"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m7 18 2.891 2.891",key:"1sisit"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}]],I=q("Dna",S),D=G({slots:{base:"flex flex-col",iconsContainer:"text-slate",textContainer:"",title:"text-center font-semibold",description:"text-center text-muted-foreground font-normal",customIcon:"flex items-center justify-center border rounded-md"},variants:{bordered:{true:{base:"border border-dashed rounded-lg"}},size:{mini:{base:"py-10 gap-3",iconsContainer:"[&_svg]:size-4",textContainer:"space-y-1",title:"text-base",description:"text-xs"},default:{base:"py-12 gap-6",iconsContainer:"[&_svg]:size-6",textContainer:"space-y-2",title:"text-lg",description:"text-sm",customIcon:"size-12"}}},defaultVariants:{size:"default"}});function r({title:t,description:a,showIcon:T=!0,bordered:w=!1,iconType:d,icon:O,size:H,className:R,..._}){const s=D({size:H,bordered:w});return e.jsxs("div",{className:s.base({className:R}),..._,children:[T?d==="chartRow"?e.jsx(M,{className:s.iconsContainer()}):d==="chartGrid"?e.jsx(V,{className:s.iconsContainer()}):d==="custom"?e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:s.customIcon(),children:e.jsx(O,{})})}):null:null,e.jsxs("div",{className:s.textContainer(),children:[t&&e.jsx("h1",{className:s.title(),children:t}),e.jsx("div",{className:s.description(),children:a})]})]})}function M({className:t,...a}){return e.jsxs("div",{className:C("flex gap-1 justify-center items-center",t),...a,children:[e.jsx(k,{}),e.jsx(v,{}),e.jsx(z,{}),e.jsx(E,{})]})}function V({className:t,...a}){return e.jsxs("div",{className:C("flex flex-col gap-1 justify-center items-center",t),...a,children:[e.jsxs("div",{className:"flex gap-0.5 ml-3",children:[e.jsx(v,{className:"mb-2"}),e.jsx(E,{className:"mt-2"})]}),e.jsxs("div",{className:"flex gap-0.5 mr-3 -mt-4",children:[e.jsx(k,{className:"mb-2"}),e.jsx(z,{className:"mt-2"})]})]})}r.__docgenInfo={description:"",methods:[],displayName:"Empty",props:{showIcon:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},bordered:{defaultValue:{value:"false",computed:!1},required:!1}}};const K={title:"Feedback/Empty",component:r,args:{showIcon:!0,bordered:!1},argTypes:{size:{control:{type:"select"},options:["mini","default"]},iconType:{control:{type:"select"},options:["chartRow","chartGrid","custom"]}}},n={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartRow"},render:t=>e.jsx(r,{...t})},o={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartGrid"},render:t=>e.jsx(r,{...t})},i={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:I},render:t=>e.jsx(r,{...t})},c={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:I,bordered:!0},render:t=>e.jsx(r,{...t})};var l,m,p;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartRow'
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...(p=(m=n.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,x,f;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid'
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...(f=(x=o.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var h,y,g;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...(g=(y=i.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var j,N,b;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
    bordered: true
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...(b=(N=c.parameters)==null?void 0:N.docs)==null?void 0:b.source}}};const Q=["ChartRow","ChartGrid","CustomIcon","WithBorder"];export{o as ChartGrid,n as ChartRow,i as CustomIcon,c as WithBorder,Q as __namedExportsOrder,K as default};
