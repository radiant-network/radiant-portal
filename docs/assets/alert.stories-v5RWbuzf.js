import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as r,a as s,b as t,c as n,d as l,e as h,f as a}from"./alert-B2hm-Q6Z.js";import{B as i}from"./button-T5_y8yxh.js";import{C as c}from"./circle-alert-DsWOU-5F.js";import"./index-CGj_12n1.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-8qLlHUMx.js";import"./iframe-6hHsX4yG.js";import"./i18next-DOi7g2fS.js";const le={title:"Alerts/Alert",component:i},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(r,{variant:"info",bordered:!0,children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsxs(t,{children:[e.jsx(n,{children:"Info Alert"}),e.jsx(l,{children:"This is an informational alert message."}),e.jsxs(h,{children:[e.jsx(i,{variant:"default",size:"sm",onClick:()=>alert("Main action clicked"),children:"Main Action"}),e.jsx(i,{variant:"ghost",size:"sm",onClick:()=>alert("Other action clicked"),children:"Action"})]})]}),e.jsx(a,{onClick:()=>alert("Alert closed")})]}),e.jsx(r,{variant:"info",children:e.jsxs(t,{children:[e.jsx(n,{children:"Info Alert"}),e.jsx(l,{children:"This is an informational alert message."})]})}),e.jsxs(r,{variant:"info",children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsx(t,{children:e.jsx(l,{children:"This is an informational alert message."})}),e.jsx(a,{onClick:()=>alert("Alert closed")})]})]})},A={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(r,{variant:"warning",bordered:!0,children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsxs(t,{children:[e.jsx(n,{children:"Warning Alert"}),e.jsx(l,{children:"This is a warning alert message."}),e.jsxs(h,{children:[e.jsx(i,{variant:"default",size:"sm",onClick:()=>alert("Main action clicked"),children:"Main Action"}),e.jsx(i,{variant:"ghost",size:"sm",onClick:()=>alert("Other action clicked"),children:"Action"})]})]}),e.jsx(a,{onClick:()=>alert("Alert closed")})]}),e.jsx(r,{variant:"warning",children:e.jsxs(t,{children:[e.jsx(n,{children:"Warning Alert"}),e.jsx(l,{children:"This is a warning alert message."})]})}),e.jsxs(r,{variant:"warning",children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsx(t,{children:e.jsx(l,{children:"This is a warning alert message."})}),e.jsx(a,{onClick:()=>alert("Alert closed")})]})]})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(r,{variant:"error",bordered:!0,children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsxs(t,{children:[e.jsx(n,{children:"Error Alert"}),e.jsx(l,{children:"This is an error alert message."}),e.jsxs(h,{children:[e.jsx(i,{variant:"default",size:"sm",onClick:()=>alert("Main action clicked"),children:"Main Action"}),e.jsx(i,{variant:"ghost",size:"sm",onClick:()=>alert("Other action clicked"),children:"Action"})]})]}),e.jsx(a,{onClick:()=>alert("Alert closed")})]}),e.jsx(r,{variant:"error",children:e.jsxs(t,{children:[e.jsx(n,{children:"Error Alert"}),e.jsx(l,{children:"This is an error alert message."})]})}),e.jsxs(r,{variant:"error",children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsx(t,{children:e.jsx(l,{children:"This is an error alert message."})}),e.jsx(a,{onClick:()=>alert("Alert closed")})]})]})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(r,{variant:"success",bordered:!0,children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsxs(t,{children:[e.jsx(n,{children:"Success Alert"}),e.jsx(l,{children:"This is a success alert message."}),e.jsxs(h,{children:[e.jsx(i,{variant:"default",size:"sm",onClick:()=>alert("Main action clicked"),children:"Main Action"}),e.jsx(i,{variant:"ghost",size:"sm",onClick:()=>alert("Other action clicked"),children:"Action"})]})]}),e.jsx(a,{onClick:()=>alert("Alert closed")})]}),e.jsx(r,{variant:"success",children:e.jsxs(t,{children:[e.jsx(n,{children:"Success Alert"}),e.jsx(l,{children:"This is a success alert message."})]})}),e.jsxs(r,{variant:"success",children:[e.jsx(s,{children:e.jsx(c,{})}),e.jsx(t,{children:e.jsx(l,{children:"This is a success alert message."})}),e.jsx(a,{onClick:()=>alert("Alert closed")})]})]})};var x,j,p;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      <Alert variant="info" bordered>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Info Alert</AlertTitle>
          <AlertDescription>This is an informational alert message.</AlertDescription>
          <AlertActions>
            <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
              Main Action
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
              Action
            </Button>
          </AlertActions>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
      <Alert variant="info">
        <AlertContent>
          <AlertTitle>Info Alert</AlertTitle>
          <AlertDescription>This is an informational alert message.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is an informational alert message.</AlertDescription>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
    </div>
}`,...(p=(j=o.parameters)==null?void 0:j.docs)==null?void 0:p.source}}};var C,g,u;A.parameters={...A.parameters,docs:{...(C=A.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      <Alert variant="warning" bordered>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Warning Alert</AlertTitle>
          <AlertDescription>This is a warning alert message.</AlertDescription>
          <AlertActions>
            <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
              Main Action
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
              Action
            </Button>
          </AlertActions>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
      <Alert variant="warning">
        <AlertContent>
          <AlertTitle>Warning Alert</AlertTitle>
          <AlertDescription>This is a warning alert message.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="warning">
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is a warning alert message.</AlertDescription>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
    </div>
}`,...(u=(g=A.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var v,f,k;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      <Alert variant="error" bordered>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Error Alert</AlertTitle>
          <AlertDescription>This is an error alert message.</AlertDescription>
          <AlertActions>
            <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
              Main Action
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
              Action
            </Button>
          </AlertActions>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
      <Alert variant="error">
        <AlertContent>
          <AlertTitle>Error Alert</AlertTitle>
          <AlertDescription>This is an error alert message.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="error">
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is an error alert message.</AlertDescription>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
    </div>
}`,...(k=(f=d.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var T,I,D;m.parameters={...m.parameters,docs:{...(T=m.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      <Alert variant="success" bordered>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Success Alert</AlertTitle>
          <AlertDescription>This is a success alert message.</AlertDescription>
          <AlertActions>
            <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
              Main Action
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
              Action
            </Button>
          </AlertActions>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
      <Alert variant="success">
        <AlertContent>
          <AlertTitle>Success Alert</AlertTitle>
          <AlertDescription>This is a success alert message.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="success">
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is a success alert message.</AlertDescription>
        </AlertContent>
        <AlertClosableIcon onClick={() => alert('Alert closed')} />
      </Alert>
    </div>
}`,...(D=(I=m.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};const ie=["Info","Warning","Error","Success"];export{d as Error,o as Info,m as Success,A as Warning,ie as __namedExportsOrder,le as default};
