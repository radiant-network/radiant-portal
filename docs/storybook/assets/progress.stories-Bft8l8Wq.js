import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{r as i,t as a}from"./dist-4-mRo2Q-.js";import{n as o,t as s}from"./dist-DMBFjJPW.js";import{n as c,t as l}from"./utils-hYbUpBR2.js";import{i as u,n as d,r as f,t as p}from"./story-section-DVTm6cGm.js";function m(e,t){return`${Math.round(e/t*100)}%`}function h(e,t){return e==null?`indeterminate`:e===t?`complete`:`loading`}function g(e){return typeof e==`number`}function _(e){return g(e)&&!isNaN(e)&&e>0}function v(e,t){return g(e)&&!isNaN(e)&&e<=t&&e>=0}function y(e,t){return`Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${w}\`.`}function b(e,t){return`Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${w} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`}var x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{x=t(n(),1),o(),i(),S=r(),C=`Progress`,w=100,[T,E]=s(C),[D,O]=T(C),k=x.forwardRef((e,t)=>{let{__scopeProgress:n,value:r=null,max:i,getValueLabel:o=m,...s}=e;(i||i===0)&&!_(i)&&console.error(y(`${i}`,`Progress`));let c=_(i)?i:w;r!==null&&!v(r,c)&&console.error(b(`${r}`,`Progress`));let l=v(r,c)?r:null,u=g(l)?o(l,c):void 0;return(0,S.jsx)(D,{scope:n,value:l,max:c,children:(0,S.jsx)(a.div,{"aria-valuemax":c,"aria-valuemin":0,"aria-valuenow":g(l)?l:void 0,"aria-valuetext":u,role:`progressbar`,"data-state":h(l,c),"data-value":l??void 0,"data-max":c,...s,ref:t})})}),k.displayName=C,A=`ProgressIndicator`,j=x.forwardRef((e,t)=>{let{__scopeProgress:n,...r}=e,i=O(A,n);return(0,S.jsx)(a.div,{"data-state":h(i.value,i.max),"data-value":i.value??void 0,"data-max":i.max,...r,ref:t})}),j.displayName=A,M=k,N=j})))()}function F({className:e,value:t,...n}){return(0,I.jsx)(M,{"data-slot":`progress`,value:t,className:l(`relative h-1 w-full overflow-hidden rounded-full bg-primary/20`,e),...n,children:(0,I.jsx)(N,{"data-slot":`progress-indicator`,className:`h-full w-full flex-1 bg-primary transition-all`,style:{transform:`translateX(-${100-(t||0)}%)`}})})}var I;function L(){return(L=e((()=>{n(),P(),c(),I=r(),F.__docgenInfo={description:``,methods:[],displayName:`Progress`}})))()}var R,z,B,V,H,U,W,G,K,q;function J(){return(J=e((()=>{R=n(),L(),u(),z=r(),B={title:`Components/Progress`,component:F,args:{value:50}},V=320,H=[100,75,50,25,0],U=500,W={render:e=>(0,z.jsx)(`div`,{style:{width:V},children:(0,z.jsx)(F,{...e,"aria-label":`Progress`})})},G={render:()=>(0,z.jsx)(d,{title:`Values`,children:(0,z.jsx)(`div`,{className:`flex flex-col gap-6`,style:{width:V},children:H.map(e=>(0,z.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,z.jsxs)(p,{children:[e,`%`]}),(0,z.jsx)(F,{value:e,"aria-label":`Progress ${e}%`})]},e))})})},K={render:()=>{let[e,t]=(0,R.useState)(0);return(0,R.useEffect)(()=>{let e=setInterval(()=>t(e=>e>=100?0:e+25),U);return()=>clearInterval(e)},[]),(0,z.jsx)(f,{children:(0,z.jsx)(d,{title:`Animated`,description:`The bar loops from 0 to 100% to show the transition.`,children:(0,z.jsx)(`div`,{style:{width:V},children:(0,z.jsx)(F,{value:e,"aria-label":`Loading`})})})})}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: WIDTH
  }}>
      <Progress {...args} aria-label="Progress" />
    </div>
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Values">
      <div className="flex flex-col gap-6" style={{
      width: WIDTH
    }}>
        {VALUES.map(value => <div key={value} className="flex flex-col gap-2">
            <StoryLabel>{value}%</StoryLabel>
            <Progress value={value} aria-label={\`Progress \${value}%\`} />
          </div>)}
      </div>
    </StorySection>
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const timer = setInterval(() => setValue(current => current >= 100 ? 0 : current + 25), STEP_DELAY);
      return () => clearInterval(timer);
    }, []);
    return <StoryShowcase>
        <StorySection title="Animated" description="The bar loops from 0 to 100% to show the transition.">
          <div style={{
          width: WIDTH
        }}>
            <Progress value={value} aria-label="Loading" />
          </div>
        </StorySection>
      </StoryShowcase>;
  }
}`,...K.parameters?.docs?.source}}},q=[`Default`,`Values`,`Animated`]})))()}J();export{K as Animated,W as Default,G as Values,q as __namedExportsOrder,B as default};