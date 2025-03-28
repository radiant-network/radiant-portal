import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{B as r}from"./button-8ZB15y1Y.js";import{A as I,a as e}from"./alert-dialog-provider-BK0zxUu5.js";import{u as n}from"./i18n-Ber6Uh7x.js";import"./index-yBjzXJbu.js";import"./index-tvICUrOf.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-BJjHF_QO.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-DL58Pmf8.js";import"./index-BYARNSco.js";import"./iframe-DkzBV2aV.js";const V={title:"Base/Overlays/Alert",component:r,decorators:[o=>t.jsx(I,{children:t.jsx(o,{})})]},c={render:()=>{const{t:o}=n();return t.jsx(r,{onClick:()=>{e.open({type:"info",title:o("common.alert.title"),description:o("common.alert.description"),actionProps:{children:o("common.actions.ok")}})},color:"primary",children:o("common.actions.openAlertDialog")})}},i={render:()=>{const{t:o}=n();return t.jsx(r,{onClick:()=>{e.open({type:"warning",title:o("common.alert.title"),description:o("common.alert.description"),actionProps:{children:o("common.actions.ok")}})},color:"primary",children:o("common.actions.openAlertDialog")})}},s={render:()=>{const{t:o}=n();return t.jsx(r,{onClick:()=>{e.open({type:"error",title:o("common.alert.title"),description:o("common.alert.description"),actionProps:{children:o("common.actions.ok")}})},color:"primary",children:o("common.actions.openAlertDialog")})}},a={render:()=>{const{t:o}=n();return t.jsx(r,{onClick:()=>{e.open({type:"success",title:o("common.alert.title"),description:o("common.alert.description"),actionProps:{children:o("common.actions.ok")}})},color:"primary",children:o("common.actions.openAlertDialog")})}},m={render:()=>{const{t:o}=n();return t.jsx(r,{onClick:()=>{e.open({type:"success",title:o("common.alert.async.title"),description:o("common.alert.async.description"),actionProps:{children:o("common.actions.save"),onClick:j=>(j.preventDefault(),new Promise(v=>{setTimeout(()=>v(!0),3e3)}))}})},color:"primary",children:o("common.actions.openAlertDialog")})}};var l,p,d;c.parameters={...c.parameters,docs:{...(l=c.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <Button onClick={() => {
      alertDialog.open({
        type: "info",
        title: t('common.alert.title'),
        description: t('common.alert.description'),
        actionProps: {
          children: t('common.actions.ok')
        }
      });
    }} color="primary">
        {t('common.actions.openAlertDialog')}
      </Button>;
  }
}`,...(d=(p=c.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,y,g;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <Button onClick={() => {
      alertDialog.open({
        type: "warning",
        title: t('common.alert.title'),
        description: t('common.alert.description'),
        actionProps: {
          children: t('common.actions.ok')
        }
      });
    }} color="primary">
        {t('common.actions.openAlertDialog')}
      </Button>;
  }
}`,...(g=(y=i.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var k,D,h;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <Button onClick={() => {
      alertDialog.open({
        type: "error",
        title: t('common.alert.title'),
        description: t('common.alert.description'),
        actionProps: {
          children: t('common.actions.ok')
        }
      });
    }} color="primary">
        {t('common.actions.openAlertDialog')}
      </Button>;
  }
}`,...(h=(D=s.parameters)==null?void 0:D.docs)==null?void 0:h.source}}};var A,B,P;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <Button onClick={() => {
      alertDialog.open({
        type: "success",
        title: t('common.alert.title'),
        description: t('common.alert.description'),
        actionProps: {
          children: t('common.actions.ok')
        }
      });
    }} color="primary">
        {t('common.actions.openAlertDialog')}
      </Button>;
  }
}`,...(P=(B=a.parameters)==null?void 0:B.docs)==null?void 0:P.source}}};var C,f,x;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <Button onClick={() => {
      alertDialog.open({
        type: "success",
        title: t('common.alert.async.title'),
        description: t('common.alert.async.description'),
        actionProps: {
          children: t('common.actions.save'),
          onClick: e => {
            e.preventDefault();
            return new Promise(resolve => {
              setTimeout(() => resolve(true), 3000);
            });
          }
        }
      });
    }} color="primary">
        {t('common.actions.openAlertDialog')}
      </Button>;
  }
}`,...(x=(f=m.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const X=["Info","Warning","Error","Success","Async"];export{m as Async,s as Error,c as Info,a as Success,i as Warning,X as __namedExportsOrder,V as default};
