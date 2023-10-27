(()=>{var De=Object.defineProperty;var be=(t,e)=>{for(var r in e)De(t,r,{get:e[r],enumerable:!0})};var _e={};be(_e,{apply:()=>Z,batch:()=>ne,construct:()=>he,defineProperties:()=>Xe,defineProperty:()=>W,deleteProperties:()=>Ye,deleteProperty:()=>K,get:()=>R,getOwnPropertyDescriptor:()=>te,getOwnPropertyDescriptors:()=>Je,getPrototypeOf:()=>me,has:()=>re,intercept:()=>Ge,isExtensible:()=>pe,observe:()=>xe,ownKeys:()=>M,path:()=>He,preventExtensions:()=>ye,read:()=>Qe,reduce:()=>ge,set:()=>S,setPrototypeOf:()=>de});function _(t){return!Array.isArray(t)&&typeof t=="object"&&t}function V(t){return typeof t}function A(t){return Array.isArray(t)}function ie(t,e,r=null){return A(e)?t.filter(n=>r?e.filter(o=>r(n,o)).length:e.indexOf(n)!==-1):[]}function J(t,...e){if(globalThis.webqit||(globalThis.webqit={}),globalThis.webqit.refs||Object.defineProperty(globalThis.webqit,"refs",{value:new B}),!arguments.length)return globalThis.webqit.refs;let r=globalThis.webqit.refs.get(t);r||(r=new B,globalThis.webqit.refs.set(t,r));let n,o;for(;n=e.shift();)(o=r)&&!(r=r.get(n))&&(r=new B,o.set(n,r));return r}var B=class extends Map{constructor(...e){super(...e),this.observers=new Set}set(e,r){let n=super.set(e,r);return this.fire("set",e,r,e),n}delete(e){let r=super.delete(e);return this.fire("delete",e),r}has(e){return this.fire("has",e),super.has(e)}get(e){return this.fire("get",e),super.get(e)}keyNames(){return Array.from(super.keys())}observe(e,r,n){let o={type:e,key:r,callback:n};return this.observers.add(o),()=>this.observers.delete(o)}unobserve(e,r,n){if(Array.isArray(e)||Array.isArray(r))throw new Error('The "type" and "key" arguments can only be strings.');for(let o of this.observers)G([e,"*"],o.type)&&G([r,"*"],o.key)&&o.callback===n&&this.observers.delete(o)}fire(e,r,...n){for(let o of this.observers)G([e,"*"],o.type)&&G([r,"*"],o.key)&&o.callback(...n)}},G=(t,e)=>Array.isArray(e)?ie(t,e).length:t.includes(e);function L(t){return typeof t=="function"}function fe(t){return t===null||t===""}function F(t){return arguments.length&&(t===void 0||typeof t>"u")}function b(t){return Array.isArray(t)||typeof t=="object"&&t||L(t)}function se(t){return fe(t)||F(t)||t===!1||t===0||b(t)&&!Object.keys(t).length}function I(t){return L(t)||t&&{}.toString.call(t)==="[object function]"}function Q(t){return t instanceof String||typeof t=="string"&&t!==null}function ue(t){return!Q(t)&&!F(t.length)}function q(t,e=!0){return A(t)?t:!e&&_(t)?[t]:t!==!1&&t!==0&&se(t)?[]:ue(t)?Array.prototype.slice.call(t):_(t)?Object.values(t):[t]}var h=(...t)=>J("observer-api",...t),$=(t,e)=>t instanceof Promise?t.then(e):e(t),X={};var N=class{constructor(e,r){this.registry=e,Object.assign(this,{...r,target:e.target}),this.params.signal&&this.params.signal.addEventListener("abort",()=>this.remove())}remove(){return this.removed=!0,this.registry.removeRegistration(this)}};var k=class extends N{constructor(){super(...arguments),this.emit.currentRegistration=this,Object.defineProperty(this,"abortController",{value:new AbortController}),Object.defineProperty(this,"signal",{value:this.abortController.signal}),X.setMaxListeners?.(0,this.signal)}remove(){this.abortController.abort(),super.remove()}fire(e){if(this.emit.recursionTarget&&!["inject","force-async","force-sync"].includes(this.params.recursions))return;let r=e,n=this.filter;if(n!==1/0&&(n=q(n,!1))&&(r=e.filter(o=>n.includes(o.key))),this.params.diff&&(r=r.filter(o=>o.type!=="set"||o.value!==o.oldValue)),r.length){if(this.emit.recursionTarget&&this.params.recursions!=="force-sync"){this.emit.recursionTarget.push(...r);return}this.emit.recursionTarget=this.params.recursions==="inject"?r:[];let o=this.filter===1/0||Array.isArray(this.filter)?this.emit(r,this):this.emit(r[0],this);return $(o,s=>{let f=this.emit.recursionTarget;return delete this.emit.recursionTarget,this.params.recursions==="force-async"&&f.length?this.emit.currentRegistration.fire(f):s})}}};var z=class{constructor(e){this.target=e,this.entries=[]}addRegistration(e){return this.entries.push(e),e}removeRegistration(e){this.entries=this.entries.filter(r=>r!==e)}static _getInstance(e,r,n=!0,o=this.__namespace){if(!b(r))throw new Error(`Subject must be of type object; "${V(r)}" given!`);let s=this;return o&&h("namespaces").has(e+"-"+o)&&(s=h("namespaces").get(e+"-"+o),e+="-"+o),!h(r,"registry").has(e)&&n&&h(r,"registry").set(e,new s(r)),h(r,"registry").get(e)}static _namespace(e,r,n=null){if(e+="-"+r,arguments.length===2)return h("namespaces").get(e);if(!(n.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${r} must be a subclass of ${this.name}.`);h("namespaces").set(e,n),n.__namespace=r}};var O=class{constructor(e,r){if(this.target=e,!r.operation)throw new Error("Descriptor operation must be given in definition!");Object.assign(this,r)}};var C=class extends z{static getInstance(e,r=!0,n=null){return super._getInstance("listeners",...arguments)}static namespace(e,r=null){return super._namespace("listeners",...arguments)}constructor(e){super(e),this.batches=[]}addRegistration(e,r,n){return super.addRegistration(new k(this,{filter:e,emit:r,params:n}))}emit(e,r=!1){if(this.batches.length){this.batches[0].snapshots.push({events:[...e],isPropertyDescriptors:r});return}this.$emit(this.entries,[{events:e,isPropertyDescriptors:r}])}$emit(e,r){let n=e.filter(i=>i.params.withPropertyDescriptors).length,o=r.some(i=>i.isPropertyDescriptors),s=[],f=[],u=e.length;r.forEach(i=>{(n||!o)&&s.push(...i.events),n!==u&&o&&(i.isPropertyDescriptors?f.push(...i.events.map(l=>{let{target:a,value:c,oldValue:m,type:y,...x}=l;return c=c.get?c.get():c.value,m=m?.get?m.get():m?.value,new O(a,{type:"set",value:c,oldValue:m,...x})})):f.push(...i.events))}),e.forEach(i=>{i.params.withPropertyDescriptors?i.fire(s.length?s:f):i.fire(f.length?f:s)})}batch(e){this.batches.unshift({entries:[...this.entries],snapshots:[]});let r=e();return $(r,n=>{let o=this.batches.shift();return o.snapshots.length&&this.$emit(o.entries,o.snapshots),n})}};var U=class extends N{exec(e,r,n){return this.running||!this.traps[e.operation]?r(...Array.prototype.slice.call(arguments,2)):(this.running=!0,this.traps[e.operation](e,n,(...o)=>(this.running=!1,r(...o))))}};var D=class extends z{static getInstance(e,r=!0,n=null){return super._getInstance("traps",...arguments)}static namespace(e,r=null){return super._namespace("traps",...arguments)}addRegistration(e){return super.addRegistration(new U(this,e))}emit(e,r=null){let n=this;return function o(s,...f){let u=n.entries[s];return u?u.exec(e,(...i)=>o(s+1,...i),...f):r?r(e,...f):f[0]}(0)}};var ae={};be(ae,{accessorize:()=>We,proxy:()=>Te,unaccessorize:()=>Ke,unproxy:()=>ee});function We(t,e,r={}){t=Y(t);let n=h(t,"accessorizedProps");function o(i){let l,a=t;do l=Object.getOwnPropertyDescriptor(a,i);while(!l&&(a=Object.getPrototypeOf(a)));return l?{proto:a,descriptor:l}:{descriptor:{value:void 0,configurable:!0,enumerable:!0,writable:!0}}}function s(i){if(n.has(i+""))return!0;let l=o(i);l.getValue=function(m=!1){return m?this.descriptor:this.descriptor.get?this.descriptor.get():this.descriptor.value},l.setValue=function(m,y=!1){if(this.dirty=!0,y){this.descriptor=m;return}return this.descriptor.set?this.descriptor.set(m)!==!1:(this.descriptor.value=m,!0)},l.intact=function(){let m=Object.getOwnPropertyDescriptor(t,i);return m?.get===c.get&&m?.set===c.set&&n.get(i+"")===this},l.restore=function(){return this.intact()?(this.proto&&this.proto!==t||!this.proto&&!this.dirty?delete t[i]:Object.defineProperty(t,i,this.descriptor),n.delete(i+""),!0):!1},n.set(i+"",l);let{enumerable:a=!0}=l.descriptor,c={enumerable:a,configurable:!0};("value"in l.descriptor||l.descriptor.set)&&(c.set=function(m){return S(this,i,m,r)}),("value"in l.descriptor||l.descriptor.get)&&(c.get=function(){return R(this,i,r)});try{return Object.defineProperty(t,i,c),!0}catch{return n.delete(i+""),!1}}let u=(Array.isArray(e)?e:e===void 0?Object.keys(t):[e]).map(s);return e===void 0||Array.isArray(e)?u:u[0]}function Ke(t,e,r={}){t=Y(t);let n=h(t,"accessorizedProps");function o(u){return n.has(u+"")?n.get(u+"").restore():!0}let f=(Array.isArray(e)?e:e===void 0?Object.keys(t):[e]).map(o);return e===void 0||Array.isArray(e)?f:f[0]}function Te(t,e={},r=void 0){let n=Y(t);if(typeof e.membrane=="boolean")throw new Error("The params.membrane parameter cannot be of type boolean.");if(e.membrane&&h(n,"membraneRef").has(e.membrane))return h(n,"membraneRef").get(e.membrane);let o={apply(u,i,l){if(Array.isArray(i)){let a=Y(i);return h(a).set("$length",a.length),ne(a,()=>Z(u,i,l))}return Z(u,i,l)},construct:(u,i,l=null)=>he(u,i,l,e),defineProperty:(u,i,l)=>W(u,i,l,e),deleteProperty:(u,i)=>K(u,i,e),get:(u,i,l=null)=>{let a={...e,receiver:l};Array.isArray(u)&&i==="length"&&h(u).has("$length")&&(a.forceValue=h(u).get("$length"));let c=R(u,i,a);return Array.isArray(u)&&typeof c=="function"?Te(c,{...e,membrane:l}):c},getOwnPropertyDescriptor:(u,i)=>te(u,i,e),getPrototypeOf:u=>me(u,e),has:(u,i)=>re(u,i,e),isExtensible:u=>pe(u,e),ownKeys:u=>M(u,e),preventExtensions:u=>ye(u,e),set:(u,i,l,a=null)=>{let c={...e,receiver:a};return Array.isArray(u)&&i==="length"&&(c.forceOldValue=h(u).get("$length"),h(u).set("$length",l)),S(u,i,l,c)},setPrototypeOf:(u,i)=>de(u,i,e)},s=r?.(o)||o,f=new Proxy(n,s);return e.membrane&&h(n,"membraneRef").set(e.membrane,f),h(f).set(f,n),f}function ee(t){return h(t).get(t)||t}function Y(t){if(!t||!b(t))throw new Error("Target must be of type object!");return ee(t)}var H=class extends Array{};function He(...t){return new H(...t)}function ge(t,e,r,n=s=>s,o={}){if(e.length)return function s(f,u,i){let l=u[i.level],a=i.level===u.length-1;return f instanceof O&&f.operation!=="get"?i={...i,probe:"always"}:i.probe!=="always"&&(i={...i,probe:!a}),r(f,l,(c,...m)=>{let y=p=>{p instanceof O&&(p.path=[p.key],f instanceof O&&(p.path=f.path.concat(p.key),Object.defineProperty(p,"context",{get:()=>f,configurable:!0})))},x=p=>{let v=T(p,!1);return $(v,d=>{p instanceof O?p.value=d:p=d;let g=m[0]||{};return s(p,u,{...i,...g,level:i.level+1})})};return oe(l)&&Array.isArray(c)?(c.forEach(y),a?n(c,...m):c.map(x)):(y(c),a?n(c,...m):x(c))},i)}(t,e.slice(0),{...o,level:0})}function xe(t,e,r,n={}){if(t=T(t,!n.level),I(arguments[1])&&([,r,n={}]=arguments,e=1/0),!I(r))throw new Error(`Handler must be a function; "${V(r)}" given!`);if(e instanceof H)return ge(t,e,xe,r,n);if(n={...n,descripted:!0},delete n.live,!b(t))return n.probe&&R(t,e,r,n);let o=Ee(t,e,r,n);return n.probe?R(t,e,o,n):o()}function Ge(t,e,r={}){return t=T(t),_(e)||([,,,r={}]=arguments,e={[arguments[1]]:arguments[2]}),D.getInstance(t,!0,r.namespace).addRegistration({traps:e,params:r})}function te(t,e,r=o=>o,n={}){return E(t,"getOwnPropertyDescriptor",{key:e},r,n)}function Je(t,e,r=o=>o,n={}){return E(t,"getOwnPropertyDescriptors",{key:e},r,n)}function me(t,e=n=>n,r={}){return E(t,"getPrototypeOf",{},e,r)}function pe(t,e=n=>n,r={}){return E(t,"isExtensible",{},e,r)}function M(t,e=n=>n,r={}){return E(t,"ownKeys",{},e,r)}function re(t,e,r=o=>o,n={}){return E(t,"has",{key:e},r,n)}function R(t,e,r=o=>o,n={}){let o,s=T(t,!n.level);return _(r)?[n,r]=[r,f=>f]:n.live&&(o=!0),e instanceof H?ge(s,e,R,r,n):Ze(s,e,f=>{let u=[...f];return function i(l,a,c){if(!a.length)return c(l);let m=a.shift();if(!["string","number","symbol"].includes(typeof m))throw new Error(`Property name/key ${m} invalid.`);function y(v,d=void 0){let g=P=>(v.value=P,i([...l,n.live||n.descripted?v:P],a,c));if(arguments.length>1)return g(d);if(!b(s))return g(s?.[v.key]);let w=h(s,"accessorizedProps",!1),j=w&&w.get(v.key+"");if(j&&j.intact())return g(j.getValue(n.withPropertyDescriptors));if(n.withPropertyDescriptors){let P=Object.getOwnPropertyDescriptor(s,v.key);return"forceValue"in n&&"value"in P&&(P.value=n.forceValue),g(P)}return"forceValue"in n?g(n.forceValue):g(Reflect.get(s,v.key,...n.receiver?[n.receiver]:[]))}let x=new O(s,{type:"get",key:m,value:void 0,operation:"get",related:u});if(!b(s))return y(x);let p=D.getInstance(s,!1,n.namespace);return p?p.emit(x,y):y(x)}([],f.slice(0),i=>{let l=oe(e)?i:i[0];return o&&b(s)?Ee(s,e,r,n)(l):r(l)})},n)}function ne(t,e,r={}){return t=T(t),C.getInstance(t,!0,r.namespace).batch(e)}function Qe(t,e,r={}){e=T(e),t=T(t);let n=M(t),o=r.only?.length?r.only.filter(s=>n.includes(s)):n.filter(s=>!r.except?.includes(s));return ne(e,()=>{o.forEach(s=>{let f=te(t,s,r);"value"in f&&f.writable&&f.enumerable&&f.configurable?S(e,s,f.value,r):(r.onlyEnumerable!==!1||f.enumerable)&&W(e,s,{...f,configurable:!0},r)})}),xe(t,s=>{s.filter(f=>r.only?.length?r.only.includes(f.key):!r.except?.includes(f.key)).forEach(f=>{if(f.operation==="deleteProperty")return K(e,f.key,r);if(f.operation==="defineProperty"){(r.onlyEnumerable!==!1||f.value.enumerable)&&W(e,f.key,{...f.value,configurable:!0},r);return}S(e,f.key,f.value,r)})},{...r,withPropertyDescriptors:!0})}function S(t,e,r,n=f=>f,o={},s=!1){let f=T(t),u=[[e,r]];_(e)&&([,,n=l=>l,o={},s=!1]=arguments,u=Object.entries(e)),_(n)&&([s,o,n]=[typeof o=="boolean"?o:s,n,l=>l]);let i=u.map(([l])=>l);return function l(a,c,m){if(!c.length)return m(a);let[y,x]=c.shift();function p(d,g=void 0){let w=Ie=>(d.status=Ie,l(a.concat(d),c,m));if(arguments.length>1)return w(d,g);let j=h(f,"accessorizedProps",!1),P=j&&j.get(d.key+"");return d.operation==="defineProperty"?(P&&!P.restore()&&w(!1),Object.defineProperty(f,d.key,d.value),w(!0)):P&&P.intact()?w(P.setValue(d.value)):w(Reflect.set(f,d.key,d.value))}function v(d,g){if(o.diff&&x===g)return l(a,c,m);let w=new O(f,{type:s?"def":"set",key:y,value:x,isUpdate:d,oldValue:g,related:[...i],operation:s?"defineProperty":"set",detail:o.detail}),j=D.getInstance(f,!1,o.namespace);return j?j.emit(w,p):p(w)}return re(f,y,d=>{if(!d)return v(d);let g={...o,withPropertyDescriptors:s};return"forceOldValue"in o&&(g.forceValue=o.forceOldValue),R(f,y,w=>v(d,w),g)},o)}([],u.slice(0),l=>{let a=C.getInstance(f,!1,o.namespace);return a&&a.emit(l,s),n(oe(e)?l.map(c=>c.status):l[0]?.status)})}function W(t,e,r,n=s=>s,o={}){return S(t,e,r,n,o,!0)}function Xe(t,e,r=o=>o,n={}){return S(t,e,r,n,!0)}function K(t,e,r=o=>o,n={}){t=T(t),_(r)&&([n,r]=[r,f=>f]);let o=q(e,!1),s=[...o];return function f(u,i,l){if(!i.length)return l(u);let a=i.shift();function c(y,x=void 0){let p=g=>(y.status=g,f(u.concat(y),i,l));if(arguments.length>1)return p(y,x);let v=h(t,"accessorizedProps",!1),d=v&&v.get(y.key+"");return d&&!d.restore()&&p(!1),p(Reflect.deleteProperty(t,y.key))}function m(y){let x=new O(t,{type:"delete",key:a,oldValue:y,related:[...s],operation:"deleteProperty",detail:n.detail}),p=D.getInstance(t,!1,n.namespace);return p?p.emit(x,c):c(x)}return R(t,a,m,n)}([],o.slice(0),f=>{let u=C.getInstance(t,!1,n.namespace);return u&&u.emit(f),r(oe(e)?f.map(i=>i.status):f[0].status)})}function Ye(t,e,r=o=>o,n={}){return K(...arguments)}function he(t,e,r=null,n=s=>s,o={}){return E(t,"construct",arguments.length>2?{argumentsList:e,newTarget:r}:{argumentsList:e},n,o)}function Z(t,e,r,n=s=>s,o={}){return E(t,"apply",{thisArgument:e,argumentsList:r},n,o)}function de(t,e,r=o=>o,n={}){return E(t,"setPrototypeOf",{proto:e},r,n)}function ye(t,e=n=>n,r={}){return E(t,"preventExtensions",{},e,r)}function Ee(t,e,r,n={}){let o;n.signal||(o=new AbortController,n={...n,signal:o.signal},X.setMaxListeners?.(0,o.signal));let s=C.getInstance(t,!0,n.namespace);return function f(u,i=null){i?.remove();let a={signal:s.addRegistration(e,f,n).signal};if(arguments.length){let c=r(u,a);if(arguments.length>1)return c}return o}}function E(t,e,r={},n=s=>s,o={}){t=T(t),_(n)&&([o,n]=[n,i=>i]);function s(i,l){return arguments.length>1?n(l):n((Reflect[e]||Object[e])(t,...Object.values(r)))}let f=new O(t,{operation:e,...r}),u=D.getInstance(t,!1,o.namespace);return u?u.emit(f,s):s(f)}function oe(t){return t===1/0||Array.isArray(t)}function T(t,e=!0){if((!t||!b(t))&&e)throw new Error(`Object must be of type object or array! "${V(t)}" given.`);return t instanceof O&&(t=t.value),t&&ee(t)}function Ze(t,e,r,n={}){return e===1/0?n.level&&!b(t)?r([]):M(t,r,n):r(q(e,!1))}var et={..._e,...ae},je=et;self.webqit||(self.webqit={});self.webqit.Observer=je;})();
//# sourceMappingURL=main.js.map
