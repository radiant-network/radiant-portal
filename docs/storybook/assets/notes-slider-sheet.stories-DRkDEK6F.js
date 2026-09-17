import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{a as t,o as n}from"./cookieStore-DFp5m_DY.js";import{n as r,t as i}from"./http-BQTtTyo4.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{a as o,o as s}from"./notes-container-BJ6cl2p8.js";import{m as c,w as l}from"./api-DXv3C38A.js";import{i as u,n as d}from"./story-section-DVTm6cGm.js";import{r as f,t as p}from"./lib-CZRp1gG1.js";import{i as m,n as h,t as g}from"./applications-config-D877dlRU.js";import{n as _,t as v}from"./delay-BUO-phQa.js";import{n as y,r as b,t as x}from"./api-notes-D7YH1BHL.js";import{n as S,t as C}from"./notes-slider-sheet-CvGpaJsR.js";var w,T,E,D,O,k,A;function j(){return(j=e((()=>{f(),_(),r(),n(),l(),S(),m(),s(),y(),u(),w=a(),T={variant_entity:{app_id:g.variant_entity},germline_snv_occurrence:{app_id:g.germline_snv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:g.germline_cnv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:g.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:g.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:g.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:g.admin},portal:{name:``,navigation:{}}},E={title:`Features/Notes/Notes Slider Sheet`,component:C,args:{caseId:1,seqId:1,taskId:1,occurrenceId:`1`},decorators:[e=>(0,w.jsx)(p,{children:(0,w.jsx)(h,{config:T,children:(0,w.jsx)(o,{value:{sub:`1`,email:`johndoe@email.com`,name:`John Doe`},children:(0,w.jsx)(e,{})})})})]},D={parameters:{msw:{handlers:[i.get(b,async()=>(await v(1e3),x()))]}},render:e=>(0,w.jsx)(d,{title:`Default`,children:(0,w.jsx)(C,{...e})})},O={parameters:{msw:{handlers:[i.get(b,async()=>(await v(1e4),x()))]}},args:{seqId:3},render:e=>(0,w.jsx)(d,{title:`Loading`,children:(0,w.jsx)(C,{...e})})},k={parameters:{msw:{handlers:[i.get(b,async()=>(await v(1e3),t.json([])))]}},args:{seqId:4},render:e=>(0,w.jsx)(d,{title:`Empty`,children:(0,w.jsx)(C,{...e})})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <StorySection title="Default">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: 3
  },
  render: args => <StorySection title="Loading">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    seqId: 4
  },
  render: args => <StorySection title="Empty">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...k.parameters?.docs?.source}}},A=[`Default`,`Loading`,`Empty`]})))()}j();export{D as Default,k as Empty,O as Loading,A as __namedExportsOrder,E as default};