import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as z}from"./index-CGj_12n1.js";import{C as cn}from"./applications-config-q4OA8PiL.js";import{P as c,a as m,b as i,c as a,d as v,e as C,f as S,g as f,h as r,i as L}from"./pagination-CbTMTDBA.js";import{B as mn}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./utils-D-KgF5mV.js";import"./button-C9LBm9DC.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DDdwU0ca.js";import"./dropdown-menu-CFPCuvYI.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-eZCTYbea.js";import"./i18n-Dl9M4sbZ.js";import"./iframe-zFhGFCun.js";import"./context-DkqwYzW-.js";import"./select-CvMCtLHe.js";import"./index-qxuqJ0RB.js";import"./chevron-down-BLzVWgYU.js";import"./chevron-up-BzG59QGX.js";import"./ellipsis-BM4jpslE.js";const Pn={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},Hn={title:"Paginations/Pagination",component:c,decorators:[e=>n.jsx(mn,{children:n.jsx(cn,{config:Pn,children:n.jsx(e,{className:"w-full"})})})],parameters:{layout:"centered"}},l={render:()=>n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(a,{children:"2"})}),n.jsx(i,{children:n.jsx(a,{children:"3"})})]})})},d={render:()=>n.jsx(v,{})},p={render:()=>n.jsx(C,{})},x={render:()=>n.jsx(S,{})},h={render:()=>n.jsx(f,{})},u={render:()=>n.jsx(r,{})},j={render:()=>n.jsx(L,{pageSize:20,onPageSizeChange:e=>console.log("Page size changed to:",e)})},I={render:()=>n.jsxs("div",{className:"space-y-8",children:[n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Basic Pagination"}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"2"})}),n.jsx(i,{children:n.jsx(a,{children:"3"})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{children:"5"})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Pagination with Navigation"}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(v,{})}),n.jsx(i,{children:n.jsx(S,{})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(a,{children:"6"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(C,{})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Complete Pagination Example"}),n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("span",{className:"text-sm text-muted-foreground",children:"Showing 21-40"}),n.jsx("span",{className:"text-sm text-muted-foreground",children:"of 1,234 results"})]}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(L,{pageSize:20,onPageSizeChange:e=>console.log("Page size changed to:",e)})}),n.jsx(i,{children:n.jsx(v,{})}),n.jsx(i,{children:n.jsx(S,{})}),n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(a,{children:"6"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"62"})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(C,{})})]})})]})]})]})},k={render:()=>{const[e,an]=z.useState(5),[P,en]=z.useState(20),t=62,N=1234,tn=(e-1)*P+1,sn=Math.min(e*P,N),o=s=>{an(Math.max(1,Math.min(s,t)))},on=()=>{const s=[];{s.push(n.jsx(i,{children:n.jsx(a,{isActive:e===1,onClick:()=>o(1),children:"1"})},1)),e>3&&s.push(n.jsx(i,{children:n.jsx(r,{})},"ellipsis1"));const rn=Math.max(2,e-1),gn=Math.min(t-1,e+1);for(let g=rn;g<=gn;g++)s.push(n.jsx(i,{children:n.jsx(a,{isActive:g===e,onClick:()=>o(g),children:g})},g));e<t-2&&s.push(n.jsx(i,{children:n.jsx(r,{})},"ellipsis2")),s.push(n.jsx(i,{children:n.jsx(a,{isActive:t===e,onClick:()=>o(t),children:t})},t))}return s};return n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"text-center",children:[n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Current Page: ",e," | Page Size: ",P," | Total Pages: ",t]}),n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Showing ",tn,"-",sn," of ",N," results"]})]}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(v,{onClick:()=>o(1)})}),n.jsx(i,{children:n.jsx(S,{onClick:()=>o(e-1)})}),on(),n.jsx(i,{children:n.jsx(f,{onClick:()=>o(e+1)})}),n.jsx(i,{children:n.jsx(C,{onClick:()=>o(t)})})]})}),n.jsx("div",{className:"flex justify-center",children:n.jsx(L,{pageSize:P,onPageSizeChange:en,pageSizeOptions:[10,20,50,100]})})]})}};var b,w,y;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
}`,...(y=(w=l.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var E,A,_;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <PaginationFirst />
}`,...(_=(A=d.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var M,R,F;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <PaginationLast />
}`,...(F=(R=p.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};var B,O,T;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <PaginationPrevious />
}`,...(T=(O=x.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};var V,W,q;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <PaginationNext />
}`,...(q=(W=h.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var D,G,H;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <PaginationEllipsis />
}`,...(H=(G=u.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,Q;j.parameters={...j.parameters,docs:{...(J=j.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <PaginationPageSize pageSize={20} onPageSizeChange={size => console.log('Page size changed to:', size)} />
}`,...(Q=(K=j.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Y;I.parameters={...I.parameters,docs:{...(U=I.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      {/* Basic pagination with numbers */}
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination with navigation buttons */}
      <div>
        <h3 className="text-sm font-medium mb-2">Pagination with Navigation</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Complete Pagination Example</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing 21-40</span>
            <span className="text-sm text-muted-foreground">of 1,234 results</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPageSize pageSize={20} onPageSizeChange={size => console.log('Page size changed to:', size)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationFirst />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>62</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
}`,...(Y=(X=I.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,nn;k.parameters={...k.parameters,docs:{...(Z=k.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(5);
    const [pageSize, setPageSize] = React.useState(20);
    const totalPages = 62;
    const totalResults = 1234;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalResults);
    const handlePageChange = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }
      } else {
        // Show first page
        pages.push(<PaginationItem key={1}>
            <PaginationLink isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>);

        // Show ellipsis if needed
        if (currentPage > 3) {
          pages.push(<PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          pages.push(<PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show last page
        pages.push(<PaginationItem key={totalPages}>
            <PaginationLink isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>);
      }
      return pages;
    };
    return <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Current Page: {currentPage} | Page Size: {pageSize} | Total Pages: {totalPages}
          </p>
          <p className="text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {totalResults} results
          </p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst onClick={() => handlePageChange(1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast onClick={() => handlePageChange(totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex justify-center">
          <PaginationPageSize pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={[10, 20, 50, 100]} />
        </div>
      </div>;
  }
}`,...(nn=($=k.parameters)==null?void 0:$.docs)==null?void 0:nn.source}}};const Jn=["ContainerWithNumbers","First","Last","Previous","Next","Ellipsis","PageSize","CompletePagination","InteractivePagination"];export{I as CompletePagination,l as ContainerWithNumbers,u as Ellipsis,d as First,k as InteractivePagination,p as Last,h as Next,j as PageSize,x as Previous,Jn as __namedExportsOrder,Hn as default};
