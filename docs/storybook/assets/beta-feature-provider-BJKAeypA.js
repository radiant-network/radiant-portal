import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{r=t(),i=n(),a={orientation:{type:`select`,defaultValue:`top`,options:[{value:`top`,label:`Top (Default)`},{value:`left`,label:`Left`},{value:`right`,label:`Right`}],label:`Main Menu Orientation`,description:`Change the position of the main navigation menu`},analysis:{type:`link`,link:`/analysis`,label:`Analysis`,description:`Access analysis page`},landingInclude:{type:`link`,link:`/landing/include`,label:`Landing (Include)`,description:`Access the Include landing page`},landingKidsfirst:{type:`link`,link:`/landing/kidsfirst`,label:`Landing (Kids First)`,description:`Access the Kids First landing page`},study:{type:`link`,link:`/study`,label:`Studies`,description:`Access the new Studies page`},community:{type:`link`,link:`/community`,label:`Community`,description:`Access the new Community exploration page`},onboarding:{type:`boolean`,defaultValue:!1,label:`Onboarding Wizard`,description:`Enable onboarding wizard on case's variant tab page`},patient:{type:`boolean`,defaultValue:!1,label:`Patient View`,description:`Show the Patients entry in the main navigation menu`}},o=(0,r.createContext)(void 0),s=e=>Object.entries(e).reduce((e,[t,n])=>n.type===`link`?e:{...e,[t]:n.defaultValue},{}),c=({children:e,definitions:t=a,storageKey:n=`betaFeatures`})=>{let[c,l]=(0,r.useState)(()=>{if(typeof window>`u`)return s(t);let e=localStorage.getItem(n);if(e)try{return JSON.parse(e)}catch{return s(t)}return s(t)});return(0,r.useEffect)(()=>{localStorage.setItem(n,JSON.stringify(c))},[c,n]),(0,i.jsx)(o.Provider,{value:{features:c,setFeature:(e,t)=>{l(n=>({...n,[e]:t}))},featureDefinitions:t},children:e})},l=()=>{let e=(0,r.useContext)(o);if(e===void 0)throw Error(`useBetaFeatures must be used within a BetaFeatureProvider`);return e},c.__docgenInfo={description:``,methods:[],displayName:`BetaFeatureProvider`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},definitions:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  [key: string]: FeatureBooleanDefinition | FeatureSelectDefinition | FeatureLinkDefinition;
}`,signature:{properties:[{key:{name:`string`},value:{name:`union`,raw:`FeatureBooleanDefinition | FeatureSelectDefinition | FeatureLinkDefinition`,elements:[{name:`signature`,type:`object`,raw:`{
  type: 'boolean';
  defaultValue: boolean;
  label: string;
  description?: string;
}`,signature:{properties:[{key:`type`,value:{name:`literal`,value:`'boolean'`,required:!0}},{key:`defaultValue`,value:{name:`boolean`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`string`,required:!1}}]}},{name:`signature`,type:`object`,raw:`{
  type: 'select';
  defaultValue: string;
  options: { value: string; label: string }[];
  label: string;
  description?: string;
}`,signature:{properties:[{key:`type`,value:{name:`literal`,value:`'select'`,required:!0}},{key:`defaultValue`,value:{name:`string`,required:!0}},{key:`options`,value:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; label: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}}]}}],raw:`{ value: string; label: string }[]`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`string`,required:!1}}]}},{name:`signature`,type:`object`,raw:`{
  type: 'link';
  link: string;
  label: string;
  description?: string;
}`,signature:{properties:[{key:`type`,value:{name:`literal`,value:`'link'`,required:!0}},{key:`link`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`string`,required:!1}}]}}],required:!0}}]}},description:``,defaultValue:{value:`{
  orientation: {
    type: 'select',
    defaultValue: 'top',
    options: [
      { value: 'top', label: 'Top (Default)' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],
    label: 'Main Menu Orientation',
    description: 'Change the position of the main navigation menu',
  },
  // Add more feature definitions here
  // QA preview only: two links to view both landing variants in a single build.
  // In prod the variant should be driven by the build THEME on a single \`/landing\`
  // route, so these links and the \`/landing/*\` preview routes should be removed.
  analysis: {
    type: 'link',
    link: '/analysis',
    label: 'Analysis',
    description: 'Access analysis page',
  },
  landingInclude: {
    type: 'link',
    link: '/landing/include',
    label: 'Landing (Include)',
    description: 'Access the Include landing page',
  },
  landingKidsfirst: {
    type: 'link',
    link: '/landing/kidsfirst',
    label: 'Landing (Kids First)',
    description: 'Access the Kids First landing page',
  },
  study: {
    type: 'link',
    link: '/study',
    label: 'Studies',
    description: 'Access the new Studies page',
  },
  community: {
    type: 'link',
    link: '/community',
    label: 'Community',
    description: 'Access the new Community exploration page',
  },
  onboarding: {
    type: 'boolean',
    defaultValue: false,
    label: 'Onboarding Wizard',
    description: "Enable onboarding wizard on case's variant tab page",
  },
  patient: {
    type: 'boolean',
    defaultValue: false,
    label: 'Patient View',
    description: 'Show the Patients entry in the main navigation menu',
  },
}`,computed:!1}},storageKey:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'betaFeatures'`,computed:!1}}}}})))()}export{u as n,l as r,c as t};