import{p as at}from"./chunk-JWPE2WC7-BJCa-W6h.js";import{ae as b,a6 as B,b6 as nt,g as rt,s as it,a as st,b as ot,o as lt,n as ct,_ as g,l as G,c as ut,A as dt,D as gt,P as pt,b7 as ht,d as ft,p as mt,B as vt}from"./index-PRenu2UN.js";import{p as xt}from"./cynefin-OW5HDTMX-Ci5_IpOw.js";import{d as q}from"./arc-DI-2kafB.js";function St(t,r){return r<t?-1:r>t?1:r>=t?0:NaN}function yt(t){return t}function wt(){var t=yt,r=St,y=null,T=b(0),l=b(B),p=b(0);function i(e){var n,o=(e=nt(e)).length,h,w,$=0,f=new Array(o),s=new Array(o),D=+T.apply(this,arguments),E=Math.min(B,Math.max(-B,l.apply(this,arguments)-D)),k,L=Math.min(Math.abs(E)/o,p.apply(this,arguments)),u=L*(E<0?-1:1),A;for(n=0;n<o;++n)(A=s[f[n]=n]=+t(e[n],n,e))>0&&($+=A);for(r!=null?f.sort(function(M,m){return r(s[M],s[m])}):y!=null&&f.sort(function(M,m){return y(e[M],e[m])}),n=0,w=$?(E-o*u)/$:0;n<o;++n,D=k)h=f[n],A=s[h],k=D+(A>0?A*w:0)+u,s[h]={data:e[h],index:n,value:A,startAngle:D,endAngle:k,padAngle:L};return s}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:b(+e),i):t},i.sortValues=function(e){return arguments.length?(r=e,y=null,i):r},i.sort=function(e){return arguments.length?(y=e,r=null,i):y},i.startAngle=function(e){return arguments.length?(T=typeof e=="function"?e:b(+e),i):T},i.endAngle=function(e){return arguments.length?(l=typeof e=="function"?e:b(+e),i):l},i.padAngle=function(e){return arguments.length?(p=typeof e=="function"?e:b(+e),i):p},i}var At=vt.pie,I={sections:new Map,showData:!1},_=I.sections,V=I.showData,Ct=structuredClone(At),$t=g(()=>structuredClone(Ct),"getConfig"),Dt=g(()=>{_=new Map,V=I.showData,mt()},"clear"),bt=g(({label:t,value:r})=>{if(r<0)throw new Error(`"${t}" has invalid value: ${r}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);_.has(t)||(_.set(t,r),G.debug(`added new section: ${t}, with value: ${r}`))},"addSection"),Tt=g(()=>_,"getSections"),kt=g(t=>{V=t},"setShowData"),zt=g(()=>V,"getShowData"),J={getConfig:$t,clear:Dt,setDiagramTitle:ct,getDiagramTitle:lt,setAccTitle:ot,getAccTitle:st,setAccDescription:it,getAccDescription:rt,addSection:bt,getSections:Tt,setShowData:kt,getShowData:zt},Et=g((t,r)=>{at(t,r),r.setShowData(t.showData),t.sections.map(r.addSection)},"populateDb"),Mt={parse:g(async t=>{const r=await xt("pie",t);G.debug(r),Et(r,J)},"parse")},Rt=g(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),Lt=Rt,Pt=g(t=>{const r=[...t.values()].reduce((l,p)=>l+p,0),y=[...t.entries()].map(([l,p])=>({label:l,value:p})).filter(l=>l.value/r*100>=1);return wt().value(l=>l.value).sort(null)(y)},"createPieArcs"),Wt=g((t,r,y,T)=>{G.debug(`rendering pie chart
`+t);const l=T.db,p=ut(),i=dt(l.getConfig(),p.pie),e=40,n=18,o=4,h=450,w=h,$=gt(r),f=$.append("g");f.attr("transform","translate("+w/2+","+h/2+")");const{themeVariables:s}=p;let[D]=pt(s.pieOuterStrokeWidth);D??=2;const E=i.legendPosition,k=i.textPosition,L=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,u=Math.min(w,h)/2-e,A=q().innerRadius(L*u).outerRadius(u),M=q().innerRadius(u*k).outerRadius(u*k),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",u+D/2).attr("class","pieOuterCircle");const P=l.getSections(),K=Pt(P),Q=[s.pie1,s.pie2,s.pie3,s.pie4,s.pie5,s.pie6,s.pie7,s.pie8,s.pie9,s.pie10,s.pie11,s.pie12];let F=0;P.forEach(a=>{F+=a});const U=K.filter(a=>(a.data.value/F*100).toFixed(0)!=="0"),H=ht(Q).domain([...P.keys()]);m.selectAll("mySlices").data(U).enter().append("path").attr("d",A).attr("fill",a=>H(a.data.label)).attr("class",a=>{let c="pieCircle";return i.highlightSlice==="hover"?c+=" highlightedOnHover":i.highlightSlice===a.data.label&&(c+=" highlighted"),c}),m.selectAll("mySlices").data(U).enter().append("text").text(a=>(a.data.value/F*100).toFixed(0)+"%").attr("transform",a=>"translate("+M.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const Y=f.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),R=[...P.entries()].map(([a,c])=>({label:a,value:c})),C=f.selectAll(".legend").data(R).enter().append("g").attr("class","legend");C.append("rect").attr("width",n).attr("height",n).style("fill",a=>H(a.label)).style("stroke",a=>H(a.label)),C.append("text").attr("x",n+o).attr("y",n-o).text(a=>l.getShowData()?`${a.label} [${a.value}]`:a.label);const z=Math.max(...C.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0));let W=h,N=w+e;const d=n+o,O=R.length*d;switch(E){case"center":C.attr("transform",(a,c)=>{const v=d*R.length/2,x=-z/2-(n+o),S=c*d-v;return"translate("+x+","+S+")"});break;case"top":W+=O,C.attr("transform",(a,c)=>{const v=u,x=-z/2-(n+o),S=c*d-v;return`translate(${x}, ${S})`}),m.attr("transform",()=>`translate(0, ${O+d})`);break;case"bottom":W+=O,C.attr("transform",(a,c)=>{const v=-u-d,x=-z/2-(n+o),S=c*d-v;return"translate("+x+","+S+")"});break;case"left":N+=n+o+z,C.attr("transform",(a,c)=>{const v=d*R.length/2,x=-u-(n+o),S=c*d-v;return"translate("+x+","+S+")"}),m.attr("transform",()=>`translate(${z+n+o}, 0)`);break;default:N+=n+o+z,C.attr("transform",(a,c)=>{const v=d*R.length/2,x=12*n,S=c*d-v;return"translate("+x+","+S+")"});break}const j=Y.node()?.getBoundingClientRect().width??0,tt=w/2-j/2,et=w/2+j/2,X=Math.min(0,tt),Z=Math.max(N,et)-X;$.attr("viewBox",`${X} 0 ${Z} ${W}`),ft($,W,Z,i.useMaxWidth)},"draw"),_t={draw:Wt},Gt={parser:Mt,db:J,renderer:_t,styles:Lt};export{Gt as diagram};
