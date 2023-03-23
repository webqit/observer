(()=>{var we=Object.defineProperty;var de=(e,t)=>{for(var n in t)we(e,n,{get:t[n],enumerable:!0})};var pe={};de(pe,{apply:()=>ce,batch:()=>We,construct:()=>le,deep:()=>Me,defineProperties:()=>Ke,defineProperty:()=>se,deleteProperty:()=>ue,get:()=>N,getOwnPropertyDescriptor:()=>oe,getOwnPropertyDescriptors:()=>ke,getPrototypeOf:()=>ie,has:()=>H,intercept:()=>Ve,isExtensible:()=>fe,observe:()=>$e,ownKeys:()=>K,preventExtensions:()=>ae,set:()=>B,setPrototypeOf:()=>me});function y(e){return!Array.isArray(e)&&typeof e=="object"&&e}function D(e){return typeof e}function b(e){return Array.isArray(e)}function J(e,t,n=null){return b(t)?e.filter(r=>n?t.filter(o=>n(r,o)).length:t.indexOf(r)!==-1):[]}function V(e,...t){if(globalThis.webqit||(globalThis.webqit={}),globalThis.webqit.refs||Object.defineProperty(globalThis.webqit,"refs",{value:new L}),!arguments.length)return globalThis.webqit.refs;let n=globalThis.webqit.refs.get(e);n||(n=new L,globalThis.webqit.refs.set(e,n));let r,o;for(;r=t.shift();)(o=n)&&!(n=n.get(r))&&(n=new L,o.set(r,n));return n}var L=class extends Map{constructor(...t){super(...t),this.observers=new Set}set(t,n){let r=super.set(t,n);return this.fire("set",t,n,t),r}delete(t){let n=super.delete(t);return this.fire("delete",t),n}has(t){return this.fire("has",t),super.has(t)}get(t){return this.fire("get",t),super.get(t)}keyNames(){return Array.from(super.keys())}observe(t,n,r){let o={type:t,key:n,callback:r};return this.observers.add(o),()=>this.observers.delete(o)}unobserve(t,n,r){if(Array.isArray(t)||Array.isArray(n))throw new Error('The "type" and "key" arguments can only be strings.');for(let o of this.observers)$([t,"*"],o.type)&&$([n,"*"],o.key)&&o.callback===r&&this.observers.delete(o)}fire(t,n,...r){for(let o of this.observers)$([t,"*"],o.type)&&$([n,"*"],o.key)&&o.callback(...r)}},$=(e,t)=>Array.isArray(t)?J(e,t).length:e.includes(t);function C(e){return typeof e=="function"}function Q(e){return C(e)&&/^class\s?/.test(Function.prototype.toString.call(e))}function X(e){return e===null||e===""}function S(e){return arguments.length&&(e===void 0||typeof e>"u")}function v(e){return Array.isArray(e)||typeof e=="object"&&e||C(e)}function Y(e){return X(e)||S(e)||e===!1||e===0||v(e)&&!Object.keys(e).length}function w(e){return C(e)||e&&{}.toString.call(e)==="[object function]"}function k(e){return e instanceof String||typeof e=="string"&&e!==null}function Z(e){return!k(e)&&!S(e.length)}function I(e,t=!0){return b(e)?e:!t&&y(e)?[e]:e!==!1&&e!==0&&Y(e)?[]:Z(e)?Array.prototype.slice.call(e):y(e)?Object.values(e):[e]}var R=class{constructor(t,n){this.registry=t,Object.assign(this,{...n,target:t.target}),this.params.signal&&this.params.signal.addEventListener("abort",()=>this.remove())}remove(){return this.removed=!0,this.registry.removeRegistration(this)}};var U=class extends R{constructor(){super(...arguments),Object.defineProperty(this,"abortController",{value:new AbortController}),Object.defineProperty(this,"signal",{value:this.abortController.signal})}remove(){this.abortController.abort(),super.remove()}fire(t){let n=t,r=this.filter;if(r!==1/0&&(r=I(r))&&(n=t.filter(o=>r.includes(o.key))),this.params.diff&&(n=n.filter(o=>o.type!=="set"||o.value!==o.oldValue)),n.length)return this.filter===1/0||Array.isArray(this.filter)?this.handler(n,this):this.handler(n[0],this)}};var h=(...e)=>V("observer-api",...e);var F=class{constructor(t){this.target=t,this.entries=[]}addRegistration(t){return this.entries.push(t),t}removeRegistration(t){this.entries=this.entries.filter(n=>n!==t)}static _getInstance(t,n,r=!0,o=this.__namespace){if(!v(n))throw new Error(`Subject must be of type object; "${D(n)}" given!`);let f=this;return o&&h("namespaces").has(t+"-"+o)&&(f=h("namespaces").get(t+"-"+o),t+="-"+o),!h(n,"registry").has(t)&&r&&h(n,"registry").set(t,new f(n)),h(n,"registry").get(t)}static _namespace(t,n,r=null){if(t+="-"+n,arguments.length===2)return h("namespaces").get(t);if(!(r.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${n} must be a subclass of ${this.name}.`);h("namespaces").set(t,r),r.__namespace=n}};var q=class extends F{static getInstance(t,n=!0,r=null){return super._getInstance("listeners",...arguments)}static namespace(t,n=null){return super._namespace("listeners",...arguments)}constructor(t){super(t),this.batches=[]}addRegistration(t,n,r){return super.addRegistration(new U(this,{filter:t,handler:n,params:r}))}emit(t){if(this.batches.length){this.batches[0].events.push(...t);return}this.entries.forEach(n=>n.fire(t))}batch(t){this.batches.unshift({entries:[...this.entries],events:[]});let n=t(),r=this.batches.shift();return r.events.length&&r.entries.forEach(o=>o.fire(r.events)),n}};var M=class extends R{exec(t,n,r){return this.running||!this.traps[t.type]?n(...Array.prototype.slice.call(arguments,2)):(this.running=!0,this.traps[t.type](t,r,(...o)=>(this.running=!1,n(...o))))}};var T=class extends F{static getInstance(t,n=!0,r=null){return super._getInstance("traps",...arguments)}static namespace(t,n=null){return super._namespace("traps",...arguments)}addRegistration(t){return super.addRegistration(new M(this,t))}emit(t,n=null){let r=this;return function o(f,...s){let l=r.entries[f];return l?l.exec(t,(...i)=>o(f+1,...i),...s):n?n(t,...s):s[0]}(0)}};var P=class{constructor(t,n){if(this.target=t,!n.type)throw new Error("Descriptor type must be given in definition!");Object.assign(this,n)}};var ne={};de(ne,{accessorize:()=>Be,proxy:()=>Ue,unaccessorize:()=>Le,unproxy:()=>W});function Be(e,t,n={}){e=re(e);let r=h(e,"accessorizedProps");function o(i){let u,c=e;for(;!u&&(c=Object.getPrototypeOf(c));)u=Object.getOwnPropertyDescriptor(c,i);return u?{proto:c,descriptor:u}:{descriptor:{value:void 0}}}function f(i){if(r.has(i))return!0;let u=o(i);u.getValue=function(){return"get"in this.descriptor?this.descriptor.get():this.descriptor.value},u.setValue=function(m){return"set"in this.descriptor?this.descriptor.set(m):this.descriptor.value=m},u.intact=function(){let m=Object.getOwnPropertyDescriptor(e,i);return m.get===d.get&&m.set===d.set&&r.get(i)===this},u.restore=function(){return this.intact()?(this.proto!==e?delete e[i]:Object.defineProperty(e,i,this.descriptor),r.delete(i),!0):!1},r.set(i,u);let{enumerable:c=!0,configurable:x=!0}=u.descriptor,d={enumerable:c,configurable:x};["value","set"].some(m=>m in u.descriptor)&&(d.set=function(m){return B(this,i,m,n)}),["value","get"].some(m=>m in u.descriptor)&&(d.get=function(){return N(this,i,n)});try{return Object.defineProperty(e,i,d),!0}catch{return r.delete(i),!1}}let l=(Array.isArray(t)?t:t===void 0?Object.keys(e):[t]).map(f);return t===void 0||Array.isArray(t)?l:l[0]}function Le(e,t,n={}){e=re(e);let r=h(e,"accessorizedProps");function o(l){return r.has(l)?r.get(l).restore():!0}let s=(Array.isArray(t)?t:t===void 0?Object.keys(e):[t]).map(o);return t===void 0||Array.isArray(t)?s:s[0]}function Ue(e,t={}){e=re(e);let n=new Proxy(e,{apply:(r,o,f)=>ce(r,o,f,t),construct:(r,o,f=null)=>le(r,o,f,t),defineProperty:(r,o,f)=>se(r,o,f,t),deleteProperty:(r,o)=>ue(r,o,t),get:(r,o,f=null)=>{let s=N(r,o,{...t,receiver:f});return t.proxyAutoBinding!==!1&&w(s)&&!Q(s)?s.bind(n):s},getOwnPropertyDescriptor:(r,o)=>oe(r,o,t),getPrototypeOf:r=>ie(r,t),has:(r,o)=>H(r,o,t),isExtensible:r=>fe(r,t),ownKeys:r=>K(r,t),preventExtensions:r=>ae(r,t),set:(r,o,f,s=null)=>B(r,o,f,{...t,receiver:s}),setPrototypeOf:(r,o)=>me(r,o,t)});return h(n).set(n,e),n}function W(e){return h(e).get(e)||e}function re(e){if(!e||!v(e))throw new Error("Target must be of type object!");return W(e)}function Me(e,t,n,r=f=>f,o={}){return function f(s,l,i){let u=l[i.level];return i.level<l.length-1?i={...i,preflight:!0}:i={...i,preflight:o.preflight},n(s,u,(c,...x)=>{let d=(a={})=>({...i,...a,level:i.level+1}),m=a=>{a instanceof P&&(a.path=[a.key],s instanceof P&&(a.path=s.path.concat(a.key),a.context=s))};if(G(u)&&Array.isArray(c))return c.forEach(m),i.level===l.length-1||!c.length&&i.midwayResults?r(c,...x):c.map(a=>f(a,l,d(...x)));m(c);let g=v(z(c,!1));return i.level===l.length-1||!g&&i.midwayResults?r(c,...x):g&&f(c,l,d(...x))},i)}(e,t.slice(0),{...o,level:0})}function $e(e,t,n,r={}){if(e=z(e),w(arguments[1])&&([,n,r={}]=arguments,t=1/0),!w(n))throw new Error(`Handler must be a function; "${D(n)}" given!`);let o=Oe(e,t,n,r);return r.preflight?(r={...r,descripted:!0},delete r.live,N(e,t,o,r)):o()}function Ve(e,t,n={}){return e=z(e),y(t)||([,,,n={}]=arguments,t={[arguments[1]]:arguments[2]}),T.getInstance(e,!0,n.namespace).addRegistration({traps:t,params:n})}function oe(e,t,n=o=>o,r={}){return A(e,"getOwnPropertyDescriptor",{key:t},n,r)}function ke(e,t,n=o=>o,r={}){return A(e,"getOwnPropertyDescriptors",{key:t},n,r)}function ie(e,t=r=>r,n={}){return A(e,"getPrototypeOf",{},t,n)}function fe(e,t=r=>r,n={}){return A(e,"isExtensible",{},t,n)}function K(e,t=r=>r,n={}){return A(e,"ownKeys",{},t,n)}function H(e,t,n=o=>o,r={}){return A(e,"has",{key:t},n,r)}function N(e,t,n=o=>o,r={}){let o;return e=z(e),y(n)?[r,n]=[n,f=>f]:r.live&&(o=!0),He(e,t,f=>{let s=[...f];return function l(i,u,c){if(!u.length)return c(i);let x=u.shift();function d(a,p=void 0){let _=j=>(a.value=j,l(i.concat(r.live||r.descripted?a:j),u,c));if(arguments.length>1)return _(p);let O=h(e,"accessorizedProps",!1),E=O&&O.get(a.key);return E&&E.intact()?_(E.getValue()):_(Reflect.get(e,a.key,...r.receiver?[r.receiver]:[]))}let m=new P(e,{type:"get",key:x,value:void 0,related:s}),g=T.getInstance(e,!1,r.namespace);return g?g.emit(m,d):d(m)}([],f.slice(0),l=>{let i=G(t)?l:l[0];return o?Oe(e,t,n,r)(i):n(i)})})}function We(e,t,n={}){return q.getInstance(e,!0,n.namespace).batch(t)}function B(e,t,n,r=s=>s,o={},f=!1){e=z(e);let s=[[t,n]];y(t)&&([,,r=i=>i,o={},f=!1]=arguments,s=Object.entries(t)),y(r)&&([f,o,r]=[typeof o=="boolean"?o:!1,r,i=>i]);let l=s.map(([i])=>i);return function i(u,c,x){if(!c.length)return x(u);let[d,m]=c.shift();function g(p,_=void 0){let O=ve=>(p.status=ve,i(u.concat(p),c,x));if(arguments.length>1)return O(p,_);let E=h(e,"accessorizedProps",!1),j=E&&E.get(p.key);return p.type==="defineProperty"?(j&&!j.restore()&&O(!1),Object.defineProperty(e,p.key,p.value),O(!0)):j&&j.intact()?O(j.setValue(p.value)):O(Reflect.set(e,p.key,p.value))}function a(p,_){if(o.diff&&m===_)return i(u,c,x);let O=new P(e,{type:f?"defineProperty":"set",key:d,value:m,isUpdate:p,oldValue:_,related:[...l],detail:o.detail}),E=T.getInstance(e,!1,o.namespace);return E?E.emit(O,g):g(O)}return H(e,d,p=>p?N(e,d,_=>a(p,_),o):a(p),o)}([],s.slice(0),i=>{let u=q.getInstance(e,!1,o.namespace);return u&&u.emit(i),r(G(t)?i.map(c=>c.status):i[0]?.status)})}function se(e,t,n,r=f=>f,o={}){return B(e,t,n,r,o,!0)}function Ke(e,t,n=o=>o,r={}){return B(e,t,n,r,!0)}function ue(e,t,n=o=>o,r={}){e=z(e),y(n)&&([r,n]=[n,s=>s]);let o=I(t),f=[...o];return function s(l,i,u){if(!i.length)return u(l);let c=i.shift();function x(m,g=void 0){let a=O=>(m.status=O,s(l.concat(m),i,u));if(arguments.length>1)return a(m,g);let p=h(e,"accessorizedProps",!1),_=p&&p.get(m.key);return _&&!_.restore()&&a(!1),a(Reflect.deleteProperty(e,m.key))}function d(m){let g=new P(e,{type:"deleteProperty",key:c,oldValue:m,related:[...f],detail:r.detail}),a=T.getInstance(e,!1,r.namespace);return a?a.emit(g,x):x(g)}return N(e,c,d,r)}([],o.slice(0),s=>{let l=q.getInstance(e,!1,r.namespace);return l&&l.emit(s),n(G(t)?s.map(i=>i.status):s[0].status)})}function le(e,t,n=null,r=f=>f,o={}){return A(e,"construct",arguments.length>2?{argumentsList:t,newTarget:n}:{argumentsList:t},r,o)}function ce(e,t,n,r=f=>f,o={}){return A(e,"apply",{thisArgument:t,argumentsList:n},r,o)}function me(e,t,n=o=>o,r={}){return A(e,"setPrototypeOf",{proto:t},n,r)}function ae(e,t=r=>r,n={}){return A(e,"preventExtensions",{},t,n)}function Oe(e,t,n,r={}){let o;r.signal||(o=new AbortController,r={...r,signal:o.signal});let f=q.getInstance(e,!0,r.namespace);return function s(l,i=null){i?.remove();let c={signal:f.addRegistration(t,s,r).signal};return arguments.length&&n(l,c),o}}function A(e,t,n={},r=f=>f,o={}){e=z(e),y(r)&&([o,r]=[r,i=>i]);function f(i,u){return arguments.length>1?r(u):r(Reflect[t](e,...Object.values(n)))}let s=new P(e,{type:t,...n}),l=T.getInstance(e,!1,o.namespace);return l?l.emit(s,f):f(s)}function G(e){return e===1/0||Array.isArray(e)}function z(e,t=!0){if((!e||!v(e))&&t)throw new Error(`Object must be of type object or array! "${D(e)}" given.`);return e instanceof P&&(e=e.value),e&&W(e)}function He(e,t,n){return t===1/0?K(e,n):n(I(t))}var Ge={...pe,...ne},be=Ge;self.webqit||(self.webqit={});self.webqit.Observer=be;})();
//# sourceMappingURL=main.js.map
