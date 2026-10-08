import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./button-22dvIMlN.js";import{_ as a,v as o}from"./date-BFawbKUP.js";import{i as s,n as c,r as l}from"./story-section-DVTm6cGm.js";import{i as u,o as d,t as f}from"./field-GP5kKCeP.js";import{a as p,i as m,n as h,r as g,t as _}from"./calendar-BTYADoOL.js";var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{v=t(),o(),p(),r(),g(),d(),s(),y=n(),b={title:`Components/Inputs/Calendar`,component:_},x=new Date(2025,0,24),S=new Date(2025,0,10),C={from:new Date(2025,0,12),to:new Date(2025,1,8)},w=`rounded-md border`,T=[{label:`Today`,days:0},{label:`Tomorrow`,days:1},{label:`In 3 days`,days:3},{label:`In a week`,days:7},{label:`In 2 weeks`,days:14}],E=[`9:00`,`9:30`,`10:00`,`10:30`,`11:00`,`11:30`,`12:00`],D={render:()=>{let[e,t]=(0,v.useState)(S);return(0,y.jsx)(l,{direction:`row`,children:[`default`,`md`].map(n=>(0,y.jsx)(c,{title:n==="default"?`Default (28px)`:`md (38px)`,children:(0,y.jsx)(_,{size:n,mode:`single`,selected:e,onSelect:t,defaultMonth:S,today:x,className:w})},n))})}},O={render:()=>(0,y.jsx)(l,{direction:`row`,children:[{title:`Label`,layout:`label`},{title:`Month and year`,layout:`dropdown`},{title:`Year only`,layout:`dropdown-years`},{title:`Month only`,layout:`dropdown-months`}].map(({title:e,layout:t})=>(0,y.jsx)(c,{title:e,children:(0,y.jsx)(_,{mode:`single`,captionLayout:t,defaultMonth:S,today:x,startMonth:new Date(2015,0),endMonth:new Date(2035,11),className:w})},t))})},k={render:()=>{let[e,t]=(0,v.useState)(C);return(0,y.jsxs)(l,{children:[(0,y.jsx)(c,{title:`2 months`,description:`Months stack vertically below the md breakpoint.`,children:(0,y.jsx)(_,{mode:`range`,numberOfMonths:2,selected:e,onSelect:t,defaultMonth:C.from,today:x,className:w})}),(0,y.jsx)(c,{title:`3 months`,children:(0,y.jsx)(_,{mode:`range`,numberOfMonths:3,selected:e,onSelect:t,defaultMonth:C.from,today:x,className:w})})]})}},A={render:()=>(0,y.jsxs)(l,{direction:`row`,children:[(0,y.jsx)(c,{title:`Week numbers`,children:(0,y.jsx)(_,{mode:`single`,showWeekNumber:!0,defaultMonth:S,today:x,selected:S,className:w})}),(0,y.jsx)(c,{title:`Booked`,description:`Booked days are disabled and struck through.`,children:(0,y.jsx)(_,{mode:`single`,defaultMonth:S,today:x,selected:S,disabled:{from:new Date(2025,0,12),to:new Date(2025,0,20)},modifiers:{booked:{from:new Date(2025,0,12),to:new Date(2025,0,20)}},modifiersStyles:{booked:{textDecoration:`line-through`}},className:w})}),(0,y.jsx)(c,{title:`Custom cell`,children:(0,y.jsx)(_,{mode:`single`,captionLayout:`dropdown`,defaultMonth:S,today:x,selected:S,className:w,style:{"--cell-size":`3rem`},components:{DayButton:({children:e,...t})=>(0,y.jsxs)(h,{...t,children:[e,(0,y.jsx)(`span`,{children:`$100`})]})}})})]})},j={render:()=>{let[e,t]=(0,v.useState)(new Date(2025,8,10)),[n,r]=(0,v.useState)(new Date(2025,8,10)),[o,s]=(0,v.useState)(new Date(2025,8,10)),[d,p]=(0,v.useState)(S),[h,g]=(0,v.useState)(`10:00`);return(0,y.jsxs)(l,{direction:`row`,children:[(0,y.jsx)(c,{title:`Presets`,children:(0,y.jsxs)(`div`,{className:w,children:[(0,y.jsx)(_,{mode:`single`,selected:e,onSelect:t,month:n,onMonthChange:r,today:x}),(0,y.jsx)(`div`,{className:`flex flex-col gap-2 border-t p-3`,children:[T.slice(0,3),T.slice(3)].map(e=>(0,y.jsx)(`div`,{className:e.length===3?`grid grid-cols-3 gap-2`:`grid grid-cols-2 gap-2`,children:e.map(({label:e,days:n})=>(0,y.jsx)(i,{variant:`outline`,size:`xs`,onClick:()=>{let e=a(x,n);t(e),r(e)},children:e},e))},e[0].label))})]})}),(0,y.jsx)(c,{title:`Start and end time`,children:(0,y.jsxs)(`div`,{className:w,children:[(0,y.jsx)(_,{mode:`single`,selected:o,onSelect:s,defaultMonth:o,today:x}),(0,y.jsxs)(`div`,{className:`flex flex-col gap-4 border-t p-3`,children:[(0,y.jsxs)(f,{children:[(0,y.jsx)(u,{htmlFor:`calendar-start-time`,children:`Start Time`}),(0,y.jsx)(m,{id:`calendar-start-time`,defaultValue:`10:30:00`,size:`sm`})]}),(0,y.jsxs)(f,{children:[(0,y.jsx)(u,{htmlFor:`calendar-end-time`,children:`End Time`}),(0,y.jsx)(m,{id:`calendar-end-time`,defaultValue:`12:30:00`,size:`sm`})]})]})]})}),(0,y.jsx)(c,{title:`Time slots`,children:(0,y.jsxs)(`div`,{className:`flex ${w}`,children:[(0,y.jsx)(_,{mode:`single`,selected:d,onSelect:p,defaultMonth:S,today:x}),(0,y.jsx)(`div`,{className:`flex flex-col gap-2 border-l p-3`,children:E.map(e=>(0,y.jsx)(i,{variant:h===e?`default`:`outline`,size:`sm`,onClick:()=>g(e),children:e},e))})]})})]})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date | undefined>(SELECTED);
    return <StoryShowcase direction="row">
        {(['default', 'md'] as const).map(size => <StorySection key={size} title={size === 'default' ? 'Default (28px)' : 'md (38px)'}>
            <Calendar size={size} mode="single" selected={date} onSelect={setDate} defaultMonth={SELECTED} today={TODAY} className={BOX_CLASS} />
          </StorySection>)}
      </StoryShowcase>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      {([{
      title: 'Label',
      layout: 'label'
    }, {
      title: 'Month and year',
      layout: 'dropdown'
    }, {
      title: 'Year only',
      layout: 'dropdown-years'
    }, {
      title: 'Month only',
      layout: 'dropdown-months'
    }] as const).map(({
      title,
      layout
    }) => <StorySection key={layout} title={title}>
          <Calendar mode="single" captionLayout={layout} defaultMonth={SELECTED} today={TODAY} startMonth={new Date(2015, 0)} endMonth={new Date(2035, 11)} className={BOX_CLASS} />
        </StorySection>)}
    </StoryShowcase>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(RANGE);
    return <StoryShowcase>
        <StorySection title="2 months" description="Months stack vertically below the md breakpoint.">
          <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={RANGE.from} today={TODAY} className={BOX_CLASS} />
        </StorySection>
        <StorySection title="3 months">
          <Calendar mode="range" numberOfMonths={3} selected={range} onSelect={setRange} defaultMonth={RANGE.from} today={TODAY} className={BOX_CLASS} />
        </StorySection>
      </StoryShowcase>;
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="Week numbers">
        <Calendar mode="single" showWeekNumber defaultMonth={SELECTED} today={TODAY} selected={SELECTED} className={BOX_CLASS} />
      </StorySection>
      <StorySection title="Booked" description="Booked days are disabled and struck through.">
        <Calendar mode="single" defaultMonth={SELECTED} today={TODAY} selected={SELECTED} disabled={{
        from: new Date(2025, 0, 12),
        to: new Date(2025, 0, 20)
      }} modifiers={{
        booked: {
          from: new Date(2025, 0, 12),
          to: new Date(2025, 0, 20)
        }
      }} modifiersStyles={{
        booked: {
          textDecoration: 'line-through'
        }
      }} className={BOX_CLASS} />
      </StorySection>
      <StorySection title="Custom cell">
        <Calendar mode="single" captionLayout="dropdown" defaultMonth={SELECTED} today={TODAY} selected={SELECTED} className={BOX_CLASS} style={{
        '--cell-size': '3rem'
      } as CSSProperties} components={{
        DayButton: ({
          children,
          ...props
        }) => <CalendarDayButton {...props}>
                {children}
                <span>$100</span>
              </CalendarDayButton>
      }} />
      </StorySection>
    </StoryShowcase>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [presetDate, setPresetDate] = useState<Date | undefined>(new Date(2025, 8, 10));
    const [presetMonth, setPresetMonth] = useState<Date>(new Date(2025, 8, 10));
    const [timeDate, setTimeDate] = useState<Date | undefined>(new Date(2025, 8, 10));
    const [slotDate, setSlotDate] = useState<Date | undefined>(SELECTED);
    const [slot, setSlot] = useState<string>('10:00');
    return <StoryShowcase direction="row">
        <StorySection title="Presets">
          <div className={BOX_CLASS}>
            <Calendar mode="single" selected={presetDate} onSelect={setPresetDate} month={presetMonth} onMonthChange={setPresetMonth} today={TODAY} />
            <div className="flex flex-col gap-2 border-t p-3">
              {[PRESETS.slice(0, 3), PRESETS.slice(3)].map(row => <div key={row[0].label} className={row.length === 3 ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
                  {row.map(({
                label,
                days
              }) => <Button key={label} variant="outline" size="xs" onClick={() => {
                const date = addDays(TODAY, days);
                setPresetDate(date);
                setPresetMonth(date);
              }}>
                      {label}
                    </Button>)}
                </div>)}
            </div>
          </div>
        </StorySection>

        <StorySection title="Start and end time">
          <div className={BOX_CLASS}>
            <Calendar mode="single" selected={timeDate} onSelect={setTimeDate} defaultMonth={timeDate} today={TODAY} />
            <div className="flex flex-col gap-4 border-t p-3">
              <Field>
                <FieldLabel htmlFor="calendar-start-time">Start Time</FieldLabel>
                <TimeInput id="calendar-start-time" defaultValue="10:30:00" size="sm" />
              </Field>
              <Field>
                <FieldLabel htmlFor="calendar-end-time">End Time</FieldLabel>
                <TimeInput id="calendar-end-time" defaultValue="12:30:00" size="sm" />
              </Field>
            </div>
          </div>
        </StorySection>

        <StorySection title="Time slots">
          <div className={\`flex \${BOX_CLASS}\`}>
            <Calendar mode="single" selected={slotDate} onSelect={setSlotDate} defaultMonth={SELECTED} today={TODAY} />
            <div className="flex flex-col gap-2 border-l p-3">
              {TIME_SLOTS.map(time => <Button key={time} variant={slot === time ? 'default' : 'outline'} size="sm" onClick={() => setSlot(time)}>
                  {time}
                </Button>)}
            </div>
          </div>
        </StorySection>
      </StoryShowcase>;
  }
}`,...j.parameters?.docs?.source}}},M=[`Sizes`,`CaptionLayout`,`Range`,`DayStates`,`WithFooter`]})))()}N();export{O as CaptionLayout,A as DayStates,k as Range,D as Sizes,j as WithFooter,M as __namedExportsOrder,b as default};