(()=>{var De=Object.defineProperty;var be=(t,e)=>{for(var r in e)De(t,r,{get:e[r],enumerable:!0})};var _e={};be(_e,{apply:()=>ee,batch:()=>ne,construct:()=>he,defineProperties:()=>Xe,defineProperty:()=>K,deleteProperties:()=>Ye,deleteProperty:()=>H,get:()=>R,getOwnPropertyDescriptor:()=>te,getOwnPropertyDescriptors:()=>Je,getPrototypeOf:()=>me,has:()=>re,intercept:()=>Ge,isExtensible:()=>pe,observe:()=>xe,ownKeys:()=>k,path:()=>He,preventExtensions:()=>ye,read:()=>Qe,reduce:()=>ge,set:()=>F,setPrototypeOf:()=>de});function x(t){return!Array.isArray(t)&&typeof t=="object"&&t}function z(t){return typeof t}function A(t){return Array.isArray(t)}function ie(t,e,r=null){return A(e)?t.filter(n=>r?e.filter(o=>r(n,o)).length:e.indexOf(n)!==-1):[]}function Q(t,...e){if(globalThis.webqit||(globalThis.webqit={}),globalThis.webqit.refs||Object.defineProperty(globalThis.webqit,"refs",{value:new B}),!arguments.length)return globalThis.webqit.refs;let r=globalThis.webqit.refs.get(t);r||(r=new B,globalThis.webqit.refs.set(t,r));let n,o;for(;n=e.shift();)(o=r)&&!(r=r.get(n))&&(r=new B,o.set(n,r));return r}var B=class extends Map{constructor(...e){super(...e),this.observers=new Set}set(e,r){let n=super.set(e,r);return this.fire("set",e,r,e),n}delete(e){let r=super.delete(e);return this.fire("delete",e),r}has(e){return this.fire("has",e),super.has(e)}get(e){return this.fire("get",e),super.get(e)}keyNames(){return Array.from(super.keys())}observe(e,r,n){let o={type:e,key:r,callback:n};return this.observers.add(o),()=>this.observers.delete(o)}unobserve(e,r,n){if(Array.isArray(e)||Array.isArray(r))throw new Error('The "type" and "key" arguments can only be strings.');for(let o of this.observers)J([e,"*"],o.type)&&J([r,"*"],o.key)&&o.callback===n&&this.observers.delete(o)}fire(e,r,...n){for(let o of this.observers)J([e,"*"],o.type)&&J([r,"*"],o.key)&&o.callback(...n)}},J=(t,e)=>Array.isArray(e)?ie(t,e).length:t.includes(e);function L(t){return typeof t=="function"}function se(t){return t===null||t===""}function q(t){return arguments.length&&(t===void 0||typeof t>"u")}function _(t){return Array.isArray(t)||typeof t=="object"&&t||L(t)}function fe(t){return se(t)||q(t)||t===!1||t===0||_(t)&&!Object.keys(t).length}function I(t){return L(t)||t&&{}.toString.call(t)==="[object function]"}function X(t){return t instanceof String||typeof t=="string"&&t!==null}function ue(t){return!X(t)&&!q(t.length)}function N(t,e=!0){return A(t)?t:!e&&x(t)?[t]:t!==!1&&t!==0&&fe(t)?[]:ue(t)?Array.prototype.slice.call(t):x(t)?Object.values(t):[t]}var h=(...t)=>Q("observer-api",...t),$=(t,e)=>t instanceof Promise?t.then(e):e(t),Y={};var C=class{constructor(e,r){this.registry=e,Object.assign(this,{...r,target:e.target}),this.params.signal&&this.params.signal.addEventListener("abort",()=>this.remove())}remove(){return this.removed=!0,this.registry.removeRegistration(this)}};var M=class extends C{constructor(){super(...arguments),this.emit.currentRegistration=this,Object.defineProperty(this,"abortController",{value:new AbortController}),Object.defineProperty(this,"signal",{value:this.abortController.signal}),Y.setMaxListeners?.(0,this.signal)}remove(){this.abortController.abort(),super.remove()}fire(e){if(this.emit.recursionTarget&&!["inject","force-async","force-sync"].includes(this.params.recursions))return;let r=e,n=this.filter;if(n!==1/0&&(n=N(n,!1))&&(r=e.filter(o=>n.includes(o.key))),this.params.diff&&(r=r.filter(o=>o.type!=="set"||o.value!==o.oldValue)),r.length){if(this.emit.recursionTarget&&this.params.recursions!=="force-sync"){this.emit.recursionTarget.push(...r);return}this.emit.recursionTarget=this.params.recursions==="inject"?r:[];let o=this.filter===1/0||Array.isArray(this.filter)?this.emit(r,this):this.emit(r[0],this);return $(o,u=>{let l=this.emit.recursionTarget;return delete this.emit.recursionTarget,this.params.recursions==="force-async"&&l.length?this.emit.currentRegistration.fire(l):u})}}};var V=class{constructor(e){this.target=e,this.entries=[]}addRegistration(e){return this.entries.push(e),e}removeRegistration(e){this.entries=this.entries.filter(r=>r!==e)}static _getInstance(e,r,n=!0,o=this.__namespace){if(!_(r))throw new Error(`Subject must be of type object; "${z(r)}" given!`);let u=this;return o&&h("namespaces").has(e+"-"+o)&&(u=h("namespaces").get(e+"-"+o),e+="-"+o),!h(r,"registry").has(e)&&n&&h(r,"registry").set(e,new u(r)),h(r,"registry").get(e)}static _namespace(e,r,n=null){if(e+="-"+r,arguments.length===2)return h("namespaces").get(e);if(!(n.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${r} must be a subclass of ${this.name}.`);h("namespaces").set(e,n),n.__namespace=r}};var b=class{constructor(e,r){if(this.target=e,!r.operation)throw new Error("Descriptor operation must be given in definition!");Object.assign(this,r)}};var S=class extends V{static getInstance(e,r=!0,n=null){return super._getInstance("listeners",...arguments)}static namespace(e,r=null){return super._namespace("listeners",...arguments)}constructor(e){super(e),this.batches=[]}addRegistration(e,r,n){return super.addRegistration(new M(this,{filter:e,emit:r,params:n}))}emit(e,r=!1){if(this.batches.length){this.batches[0].snapshots.push({events:[...e],isPropertyDescriptors:r});return}this.$emit(this.entries,[{events:e,isPropertyDescriptors:r}])}$emit(e,r){let n=e.filter(i=>i.params.withPropertyDescriptors).length,o=r.some(i=>i.isPropertyDescriptors),u=[],l=[],f=e.length;r.forEach(i=>{(n||!o)&&u.push(...i.events),n!==f&&o&&(i.isPropertyDescriptors?l.push(...i.events.map(s=>{let{target:c,type:a,...m}=s,d=new b(c,{type:"set",...m});return Object.defineProperty(d,"value","get"in m.value?{get:()=>m.value.get()}:{value:m.value.value}),m.oldValue&&Object.defineProperty(d,"oldValue","get"in m.oldValue?{get:()=>m.oldValue.get()}:{value:m.oldValue.value}),d})):l.push(...i.events))}),e.forEach(i=>{i.params.withPropertyDescriptors?i.fire(u.length?u:l):i.fire(l.length?l:u)})}batch(e){this.batches.unshift({entries:[...this.entries],snapshots:[]});let r=e();return $(r,n=>{let o=this.batches.shift();return o.snapshots.length&&this.$emit(o.entries,o.snapshots),n})}};var U=class extends C{exec(e,r,n){return this.running||!this.traps[e.operation]?r(...Array.prototype.slice.call(arguments,2)):(this.running=!0,this.traps[e.operation](e,n,(...o)=>(this.running=!1,r(...o))))}};var D=class extends V{static getInstance(e,r=!0,n=null){return super._getInstance("traps",...arguments)}static namespace(e,r=null){return super._namespace("traps",...arguments)}addRegistration(e){return super.addRegistration(new U(this,e))}emit(e,r=null){let n=this;return function o(u,...l){let f=n.entries[u];return f?f.exec(e,(...i)=>o(u+1,...i),...l):r?r(e,...l):l[0]}(0)}};var ae={};be(ae,{accessorize:()=>ke,proxy:()=>Te,unaccessorize:()=>Ke,unproxy:()=>W});function ke(t,e,r={}){t=Z(t);let n=h(t,"accessorizedProps");function o(i){let s,c=t;do s=Object.getOwnPropertyDescriptor(c,i);while(!s&&(c=Object.getPrototypeOf(c)));return s?{proto:c,descriptor:s}:{descriptor:{value:void 0,configurable:!0,enumerable:!0,writable:!0}}}function u(i){if(n.has(i+""))return!0;let s=o(i);s.getValue=function(m=!1){return m?this.descriptor:this.descriptor.get?this.descriptor.get():this.descriptor.value},s.setValue=function(m,d=!1){if(this.dirty=!0,d){this.descriptor=m;return}return this.descriptor.set?this.descriptor.set(m)!==!1:(this.descriptor.value=m,!0)},s.intact=function(){let m=Object.getOwnPropertyDescriptor(t,i);return m?.get===a.get&&m?.set===a.set&&n.get(i+"")===this},s.restore=function(){return this.intact()?(this.proto&&this.proto!==t||!this.proto&&!this.dirty?delete t[i]:Object.defineProperty(t,i,this.descriptor),n.delete(i+""),!0):!1},n.set(isNaN(i)?i:parseInt(i),s);let{enumerable:c=!0}=s.descriptor,a={enumerable:c,configurable:!0};("value"in s.descriptor||s.descriptor.set)&&(a.set=function(m){return F(this,i,m,r)}),("value"in s.descriptor||s.descriptor.get)&&(a.get=function(){return R(this,i,r)});try{return Object.defineProperty(t,i,a),!0}catch{return n.delete(i+""),!1}}let f=(Array.isArray(e)?e:e===void 0?Object.keys(t):[e]).map(u);return e===void 0||Array.isArray(e)?f:f[0]}function Ke(t,e,r={}){t=Z(t);let n=h(t,"accessorizedProps");function o(f){return n.has(f+"")?n.get(f+"").restore():!0}let l=(Array.isArray(e)?e:e===void 0?Object.keys(t):[e]).map(o);return e===void 0||Array.isArray(e)?l:l[0]}function Te(t,e={},r=void 0){let n=Z(t);if(typeof e.membrane=="boolean")throw new Error("The params.membrane parameter cannot be of type boolean.");if(e.membrane&&h(n,"membraneRef").has(e.membrane))return h(n,"membraneRef").get(e.membrane);let o={apply(f,i,s){if(Array.isArray(i)){let c=Z(i);return h(c).set("$length",c.length),ne(c,()=>ee(f,i,s))}return ee(f,W(i),s)},construct:(f,i,s=null)=>he(f,i,s,e),defineProperty:(f,i,s)=>K(f,i,s,e),deleteProperty:(f,i)=>H(f,i,e),get:(f,i,s=null)=>{let c={...e,receiver:s};Array.isArray(f)&&i==="length"&&h(f).has("$length")&&(c.forceValue=h(f).get("$length"));let a=R(f,i,c);return Array.isArray(f)&&typeof a=="function"?Te(a,{...e,membrane:s}):a},getOwnPropertyDescriptor:(f,i)=>te(f,i,e),getPrototypeOf:f=>me(f,e),has:(f,i)=>re(f,i,e),isExtensible:f=>pe(f,e),ownKeys:f=>k(f,e),preventExtensions:f=>ye(f,e),set:(f,i,s,c=null)=>{let a={...e,receiver:c};return Array.isArray(f)&&i==="length"&&(a.forceOldValue=h(f).get("$length"),h(f).set("$length",s)),F(f,i,s,a)},setPrototypeOf:(f,i)=>de(f,i,e)},u=r?.(o)||o,l=new Proxy(n,u);return e.membrane&&h(n,"membraneRef").set(e.membrane,l),h(l).set(l,n),l}function W(t){return h(t).get(t)||t}function Z(t){if(!t||!_(t))throw new Error("Target must be of type object!");return W(t)}var G=class extends Array{};function He(...t){return new G(...t)}function ge(t,e,r,n=u=>u,o={}){if(e.length)return function u(l,f,i){let s=f[i.level],c=i.level===f.length-1;return l instanceof b&&l.operation!=="get"?i={...i,probe:"always"}:i.probe!=="always"&&(i={...i,probe:!c}),r(l,s,(a,...m)=>{let d=p=>{p instanceof b&&(p.path=[p.key],l instanceof b&&(p.path=l.path.concat(p.key),Object.defineProperty(p,"context",{get:()=>l,configurable:!0})))},O=p=>{let v=T(p,!1);return $(v,y=>{p instanceof b?p.value=y:p=y;let g=m[0]||{};return u(p,f,{...i,...g,level:i.level+1})})};return oe(s)&&Array.isArray(a)?(a.forEach(d),c?n(a,...m):a.map(O)):(d(a),c?n(a,...m):O(a))},i)}(t,e.slice(0),{...o,level:0})}function xe(t,e,r,n={}){if(t=T(t,!n.level),I(arguments[1])&&([,r,n={}]=arguments,e=1/0),!I(r))throw new Error(`Handler must be a function; "${z(r)}" given!`);if(e instanceof G)return ge(t,e,xe,r,n);if(n={...n,descripted:!0},delete n.live,!_(t))return n.probe&&R(t,e,r,n);let o=Ee(t,e,r,n);return n.probe?R(t,e,o,n):o()}function Ge(t,e,r={}){return t=T(t),x(e)||([,,,r={}]=arguments,e={[arguments[1]]:arguments[2]}),D.getInstance(t,!0,r.namespace).addRegistration({traps:e,params:r})}function te(t,e,r=o=>o,n={}){return E(t,"getOwnPropertyDescriptor",{key:e},r,n)}function Je(t,e,r=o=>o,n={}){return E(t,"getOwnPropertyDescriptors",{key:e},r,n)}function me(t,e=n=>n,r={}){return E(t,"getPrototypeOf",{},e,r)}function pe(t,e=n=>n,r={}){return E(t,"isExtensible",{},e,r)}function k(t,e=n=>n,r={}){return E(t,"ownKeys",{},e,r)}function re(t,e,r=o=>o,n={}){return E(t,"has",{key:e},r,n)}function R(t,e,r=o=>o,n={}){let o,u=T(t,!n.level);return x(r)?[n,r]=[r,l=>l]:n.live&&(o=!0),e instanceof G?ge(u,e,R,r,n):Ze(u,e,l=>{let f=[...l];return function i(s,c,a){if(!c.length)return a(s);let m=c.shift();if(!["string","number","symbol"].includes(typeof m))throw new Error(`Property name/key ${m} invalid.`);function d(v,y=void 0){let g=P=>(v.value=P,i([...s,n.live||n.descripted?v:P],c,a));if(arguments.length>1)return g(y);if(!_(u))return g(u?.[v.key]);let w=h(u,"accessorizedProps",!1),j=w&&w.get(v.key);if(j&&j.intact())return g(j.getValue(n.withPropertyDescriptors));if(n.withPropertyDescriptors){let P=Object.getOwnPropertyDescriptor(u,v.key);return"forceValue"in n&&"value"in P&&(P.value=n.forceValue),g(P)}return"forceValue"in n?g(n.forceValue):g(Reflect.get(u,v.key))}let O=new b(u,{type:"get",key:m,value:void 0,operation:"get",related:f});if(!_(u))return d(O);let p=D.getInstance(u,!1,n.namespace);return p?p.emit(O,d):d(O)}([],l.slice(0),i=>{let s=oe(e)?i:i[0];return o&&_(u)?Ee(u,e,r,n)(s):r(s)})},n)}function ne(t,e,r={}){return t=T(t),S.getInstance(t,!0,r.namespace).batch(e)}function Qe(t,e,r={}){e=T(e),t=T(t);let n=(r.only||[]).slice(0),o=(r.except||[]).slice(0),u=k(r.spread?[...t]:t).map(s=>isNaN(s)?s:parseInt(s)),l=n.length?n.filter(s=>u.includes(s)):u.filter(s=>!o.includes(s)),f=s=>!Array.isArray(e)||isNaN(s)?s:s-o.filter(c=>c<s).length,i=s=>{let c=te(t,s,r);"value"in c&&c.writable&&c.enumerable&&c.configurable?F(e,f(s),c.value,r):(c.enumerable||r.onlyEnumerable===!1)&&K(e,s,{...c,configurable:!0},r)};return ne(e,()=>{l.forEach(i)}),xe(t,s=>{s.filter(c=>n.length?n.includes(c.key):!o.includes(c.key)).forEach(c=>{if(c.operation==="deleteProperty")return H(e,f(c.key),r);if(c.operation==="defineProperty"){(c.value.enumerable||r.onlyEnumerable===!1)&&K(e,f(c.key),{...c.value,configurable:!0},r);return}i(c.key)})},{...r,withPropertyDescriptors:!0})}function F(t,e,r,n=l=>l,o={},u=!1){let l=T(t),f=[[e,r]];x(e)&&([,,n=s=>s,o={},u=!1]=arguments,f=Object.entries(e)),x(n)&&([u,o,n]=[typeof o=="boolean"?o:u,n,s=>s]);let i=f.map(([s])=>s);return function s(c,a,m){if(!a.length)return m(c);let[d,O]=a.shift();function p(y,g=void 0){let w=Ie=>(y.status=Ie,s(c.concat(y),a,m));if(arguments.length>1)return w(y,g);let j=h(l,"accessorizedProps",!1),P=j&&j.get(y.key);return y.operation==="defineProperty"?(P&&!P.restore()&&w(!1),Object.defineProperty(l,y.key,y.value),w(!0)):P&&P.intact()?w(P.setValue(y.value)):w(Reflect.set(l,y.key,y.value))}function v(y,g){if(o.diff&&O===g)return s(c,a,m);let w=new b(l,{type:u?"def":"set",key:d,value:O,isUpdate:y,oldValue:g,related:[...i],operation:u?"defineProperty":"set",detail:o.detail}),j=D.getInstance(l,!1,o.namespace);return j?j.emit(w,p):p(w)}return re(l,d,y=>{if(!y)return v(y);let g={...o,withPropertyDescriptors:u};return"forceOldValue"in o&&(g.forceValue=o.forceOldValue),R(l,d,w=>v(y,w),g)},o)}([],f.slice(0),s=>{let c=S.getInstance(l,!1,o.namespace);return c&&c.emit(s,u),n(oe(e)?s.map(a=>a.status):s[0]?.status)})}function K(t,e,r,n=u=>u,o={}){return F(t,e,r,n,o,!0)}function Xe(t,e,r=o=>o,n={}){return F(t,e,r,n,!0)}function H(t,e,r=o=>o,n={}){t=T(t),x(r)&&([n,r]=[r,l=>l]);let o=N(e,!1),u=[...o];return function l(f,i,s){if(!i.length)return s(f);let c=i.shift();function a(d,O=void 0){let p=g=>(d.status=g,l(f.concat(d),i,s));if(arguments.length>1)return p(d,O);let v=h(t,"accessorizedProps",!1),y=v&&v.get(d.key);return y&&!y.restore()&&p(!1),p(Reflect.deleteProperty(t,d.key))}function m(d){let O=new b(t,{type:"delete",key:c,oldValue:d,related:[...u],operation:"deleteProperty",detail:n.detail}),p=D.getInstance(t,!1,n.namespace);return p?p.emit(O,a):a(O)}return R(t,c,m,n)}([],o.slice(0),l=>{let f=S.getInstance(t,!1,n.namespace);return f&&f.emit(l),r(oe(e)?l.map(i=>i.status):l[0].status)})}function Ye(t,e,r=o=>o,n={}){return H(...arguments)}function he(t,e,r=null,n=u=>u,o={}){return E(t,"construct",arguments.length>2?{argumentsList:e,newTarget:r}:{argumentsList:e},n,o)}function ee(t,e,r,n=u=>u,o={}){return E(t,"apply",{thisArgument:e,argumentsList:r},n,o)}function de(t,e,r=o=>o,n={}){return E(t,"setPrototypeOf",{proto:e},r,n)}function ye(t,e=n=>n,r={}){return E(t,"preventExtensions",{},e,r)}function Ee(t,e,r,n={}){let o;n.signal||(o=new AbortController,n={...n,signal:o.signal},Y.setMaxListeners?.(0,o.signal));let u=S.getInstance(t,!0,n.namespace);return function l(f,i=null){i?.remove();let c={signal:u.addRegistration(e,l,n).signal};if(arguments.length){let a=r(f,c);if(arguments.length>1)return a}return o}}function E(t,e,r={},n=u=>u,o={}){t=T(t),x(n)&&([o,n]=[n,i=>i]);function u(i,s){return arguments.length>1?n(s):n((Reflect[e]||Object[e])(t,...Object.values(r)))}let l=new b(t,{operation:e,...r}),f=D.getInstance(t,!1,o.namespace);return f?f.emit(l,u):u(l)}function oe(t){return t===1/0||Array.isArray(t)}function T(t,e=!0){if((!t||!_(t))&&e)throw new Error(`Object must be of type object or array! "${z(t)}" given.`);return t instanceof b&&(t=t.value),t&&W(t)}function Ze(t,e,r,n={}){return e===1/0?n.level&&!_(t)?r([]):k(t,r,n):r(N(e,!1))}var et={..._e,...ae},je=et;self.webqit||(self.webqit={});self.webqit.Observer=je;})();
//# sourceMappingURL=main.js.map
