!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);var n=function(e){return!Array.isArray(e)&&"object"==typeof e&&e},i=function(e){return typeof e};function s(e,...t){globalThis.WebQitInternalsRegistry||(globalThis.WebQitInternalsRegistry=new Map);var r,n,i=globalThis.WebQitInternalsRegistry.get(e);if(!i){if(i=new Map,!1===t[0])return i;globalThis.WebQitInternalsRegistry.set(e,i)}for(;r=t.shift();)if((n=i)&&!(i=i.get(r))){if(i=new Map,!1===t[0])return i;n.set(r,i)}return i}var a=function(e){return Array.isArray(e)},o=function(e){return"function"==typeof e},l=function(e){return null===e||""===e},u=function(e){return arguments.length&&(void 0===e||void 0===e)},c=function(e){return Array.isArray(e)||"object"==typeof e&&e||o(e)},f=function(e){return o(e)||e&&"[object function]"==={}.toString.call(e)},p=function(e){return e instanceof Number||"number"==typeof e},h=function(e){return p(e)||!0!==e&&!1!==e&&null!==e&&""!==e&&!isNaN(1*e)},g=function(e){return e instanceof String||"string"==typeof e&&null!==e},d=function(e,t=1){var r=0;e.forEach(e=>{r++});var n=e.slice(e.length-r,t);return arguments.length>1?n:n[0]},b=function(e,t=1){return arguments.length>1?d(e.slice().reverse(),t).reverse():d(e.slice().reverse())},v=function(e,...t){return t.forEach(t=>{e.indexOf(t)<0&&e.push(t)}),e},m=function(e,t){var r=[];return function(e,t){t=(t=t||Object.prototype)&&!a(t)?[t]:t;var r=[];for(e=e;e&&(!t||t.indexOf(e)<0)&&"default"!==e.name;)r.push(e),e=e?Object.getPrototypeOf(e):null;return r}(e,t).forEach(e=>{v(r,...Object.getOwnPropertyNames(e))}),r};function y(e,t,r=!1,i=!1,s=!1){var o=0,l=e.shift();if((h(l)||!0===l||!1===l)&&(o=l,l=e.shift()),!e.length)throw new Error("_merge() requires two or more array/objects.");return e.forEach((e,u)=>{(c(e)||f(e))&&(r?m(e):Object.getOwnPropertyNames(e)).forEach(c=>{if(t(c,l,e,u)){var f=l[c],p=e[c];if((a(f)&&a(p)||n(f)&&n(p))&&(!0===o||o>0))l[c]=a(f)&&a(p)?[]:{},y([h(o)?o-1:o,l[c],f,p],t,r,i,s);else if(a(l)&&a(e))i?l[c]=p:l.push(p);else try{s?Object.defineProperty(l,c,Object.getOwnPropertyDescriptor(e,c)):l[c]=e[c]}catch(e){}}})}),l}var w=function(e,t){var r=void 0;return c(e)&&Object.keys(e).forEach((n,i)=>{!1!==r&&(r=t(h(n)?parseFloat(n):n,e[n],i))}),r};new Map;var O=function(...e){return y(e,(e,t,r)=>!0,!1,!1,!1)};function j(e,t,r=null,n=!1){return t.length>e.length?-1:("number"==typeof r?n?e.slice(0,r+1+(r<0?e.length:0)):e.slice(r):e).reduce((e,r,i)=>{var[s,a,o]=e;if(!n&&s>-1)return[s,a,o];var l=o+1,u=r===t[l]?0===l?[i,0]:[a,l]:[-1,-1];return u[1]===t.length-1&&(u[1]=-1,u[0]>-1)?[u[0]].concat(u):[s].concat(u)},[-1,-1,-1])[0]+(n||"number"!=typeof r?0:r>-1?r:e.length-r)}function P(e,t,r=null,n=!1){var i=j(e,t,r,n);return-1===i?[]:e.slice(i+t.length)}var E=function(e,t=!0){return a(e)?e:!t&&n(e)?[e]:!1!==e&&0!==e&&function(e){return l(e)||u(e)||!1===e||0===e||c(e)&&!Object.keys(e).length}(e)?[]:function(e){return!g(e)&&!u(e.length)}(e)?Array.prototype.slice.call(e):n(e)?Object.values(e):[e]};function _(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?e.join(".")===t.join("."):e.length===t.length&&e.reduce((e,r,n)=>e&&r===t[n],!0)}var S=function(e,t,r=null){return a(t)?e.filter(e=>r?t.filter(t=>r(e,t)).length:-1!==t.indexOf(e)):[]};function F(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?(e.join(".")+".").startsWith(t.join(".")+"."):t.reduce((t,r,n)=>t&&r===e[n],!0)}function x(e){return(T(e)?e:E(e).length?[e]:[]).reduce((e,t)=>e.concat([E(t)]),[]).map(e=>D.resolve(e))}class D extends Array{static resolve(e){return e.every(e=>!(e+"").includes("."))?(new D).concat(e):e}get dotSafe(){return!0}}function T(e){return E(e).reduce((e,t)=>e||a(t),!1)}function k(e){return e.filter(e=>e||0===e).length!==e.length}class z{constructor(e){this.target=e,this.fireables=[],this.currentlyFiring=[]}add(e){return this.fireables.push(e),e}remove(e){this.fireables=this.fireables.filter(t=>t!==e)}removeMatches(e){this.match(e).forEach(e=>{this.fireables=this.fireables.filter(t=>t!==e)})}match(e){return this.fireables.filter(t=>{var r=x(t.filter),n=E((t.params||{}).tags),i=x(e.filter),s=E((e.params||{}).tags);return(!e.originalHandler||t.handler===e.originalHandler)&&(!i.length||_(i,r))&&(!s.length||s.length===n.length&&S(n,s).length===s.length)})}static getFirebase(e,t=!0,r=null){var n=this;if(r&&this._namespaces&&this._namespaces.has(r)&&(n=this._namespaces.get(r)),!c(e))throw new Error('Subject must be of type object; "'+i(e)+'" given!');return!s(e,"firebases").has(n)&&t&&s(e,"firebases").set(n,new n(e)),s(e,"firebases").get(n)}static namespace(e,t=null){if(this._namespaces||(this._namespaces=new Map),1===arguments.length)return this._namespaces.get(e);if(!(t.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${e} must be a subclass of ${this.name}.`);this._namespaces.set(e,t)}}class I{constructor(e,t){this.target=e,this.handler=t.handler,this.filter=t.filter,this.params=t.params}disconnect(){this.disconnected=!0}}class V extends I{fire(e,t,r){return this.disconnected||this.filter&&!S(E(this.filter),[e.type]).length?t(...Array.prototype.slice.call(arguments,2)):this.handler(e,r,t)}}var A=function(e,t=[],r=!0){var n=0;return h(arguments[0])&&c(arguments[1])&&(n=arguments[0],e=arguments[1],t=arguments[2]||[]),y([n,{},e],(e,r,n)=>f(t)?t(e):!a(t)||!t.length||t.indexOf(e)>-1,!1,!1,r)};class M{constructor(e,t){if(this.target=e,!t.type)throw new Error("Action type must be given in definition!");w(t,(e,t)=>{Object.defineProperty(this,e,{value:t,enumerable:!0})}),Object.seal(this)}}class W extends z{add(e){return super.add(new V(this.target,e))}fire(e,t=null){if(e instanceof M||(e=new M(this.target,e)),this.currentlyFiring.filter(t=>t.type===e.type&&t.name===e.name).length)return t?t():void 0;this.currentlyFiring.push(e);const r=(n,...i)=>{var s=this.fireables[n];return s?s.fire(e,(...e)=>r(n+1,...e),...i):t?t(...i):i[0]};var n=r(0);return this.currentlyFiring.pop(),n}}var R=function(e){return s(e,!1).get(e)||e},C=function(e,t,r={},n={}){if(!t||!c(t))throw new Error("Target must be of type object!");t=R(t);var i,s=function(n){return arguments.length?n:Reflect[e](t,...Object.values(r))};return(i=W.getFirebase(t,!1,n.namespace))?i.fire({type:e,...r},s)||[]:s()},Q=function(e,t,r,n={}){return C("apply",e,{thisArgument:t,argumentsList:r},n)},q=function(e,t,r=null,n={}){return C("construct",e,arguments.length>2?{argumentsList:t,newTarget:r}:{argumentsList:t},n)};class B{constructor(e,t=!1){this._={},this._.target=e,this._.cancellable=t,this._.propagationStopped=!1,this._.defaultPrevented=!1,this._.promisesInstance=null,this._.promises=[]}get target(){return this._.target}get cancellable(){return this._.cancellable}stopPropagation(){this._.propagationStopped=!0}get propagationStopped(){return this._.propagationStopped}preventDefault(){this._.defaultPrevented=!0}get defaultPrevented(){return this._.defaultPrevented}waitUntil(e){e instanceof Promise&&(this._.promises.push(e),this._.promisesInstance=null)}get promises(){return!this._.promisesInstance&&this._.promises.length&&(this._.promisesInstance=Promise.all(this._.promises)),this._.promisesInstance}respondWith(e){var t,r=n(e)&&!u(e.propagationStopped)&&!u(e.defaultPrevented);!1===e||r&&e.propagationStopped?this.stopPropagation():!1===e||r&&e.defaultPrevented?this.preventDefault():(e instanceof Promise&&(t=e)||r&&(t=e.promises))&&this.waitUntil(t)}}class H extends I{constructor(e,t){if(super(e,t),this.filters2D=x(this.filter),this.filtersIsOriginally2D=T(this.filter),this.filtersIsDynamic=this.filters2D.filter(e=>k(E(e))).length>0,this.filtersIsDynamic&&this.filters2D.length>1)throw new Error('Only one "Dynamic Filter" must be observed at a time! "'+this.filters2D.map(e=>"["+e.join(", ")+"]").join(", ")+'" have been bound together.')}fire(e){if(this.disconnected||this.params.type&&(t=e=>this.params.type===e.type,!e.reduce((e,r,n)=>e||t(r,n),!1)))return;var t;const r=e=>!["set","def"].includes(e.type)||!this.params.diff||(f(this.params.diff)?this.params.diff(e.value,e.oldValue):e.value!==e.oldValue);var i=new B(this.target);if(this.filters2D.length){var s=e.filter(e=>this.filters2D.filter((t,n)=>{var i=t.slice();return this.filtersIsDynamic&&e.path.forEach((e,t)=>{i[t]=i[t]||0===i[t]?i[t]:e}),(!this.filtersIsDynamic||!k(i))&&r(e)&&(!this.params.subtree&&_(i,e.path)||this.params.suptree&&F(i,e.path)&&(!h(this.params.suptree)||P(i,e.path).length<=this.params.suptree)||this.params.subtree&&e.path.length>=i.length&&F(e.path,i)&&(!h(this.params.subtree)||P(e.path,i).length<=this.params.subtree))}).length);if(s.length)if(this.filtersIsOriginally2D||this.params.subtree){var a=s;n(this.filter)&&(a={...this.filter},s.forEach((e,t)=>{a[e.name]=e})),i.respondWith(this.handler(a,i))}else s.forEach((e,t)=>{i.respondWith(this.handler(e,i))})}else(this.params.subtree||e.filter(e=>_(e.path,[e.name])).length===e.length)&&e.filter(e=>r(e)).length&&i.respondWith(this.handler(e,i));return i}}class U{constructor(e,t){if(this.target=e,t.originalSubject||(this.originalSubject=e),!("type"in t))throw new Error("Mutation type must be given in definition!");if(!("name"in t))throw new Error("Property name must be given in definition!");w(t,(e,t)=>{"path"===e&&(t=D.resolve(t)),Object.defineProperty(this,e,{value:t,enumerable:!0})}),this.path||Object.defineProperty(this,"path",{value:D.resolve([t.name]),enumerable:!0}),Object.seal(this)}}class N extends z{constructor(e){super(e),this.buffers=[]}add(e){return super.add(new H(this.target,e))}fire(e,t){var r=new B(this.target,t);return e=E(e,!1).map(e=>e instanceof U?e:new U(this.target,e)),this.buffers.length?(b(this.buffers)(e),r):(this.currentlyFiring.filter(t=>e.filter(e=>t.type===e.type&&t.name===e.name).length).length,this.fireables.forEach(n=>{if(r.propagationStopped&&t)return r;r.respondWith(n.fire(e))}),r)}}var G=function(e,t,r=null,n={}){if(!(e=r||e)||!c(e))throw new Error("Target must be of type object!");e=R(e);var i=E(t),o=i.map(t=>{var a,o=function(n){return arguments.length?n:s(e,"accessorizedProps").has(t)&&s(e,"accessorizedProps").get(t).touch(!0)?s(e,"accessorizedProps").get(t).get():r?Reflect.get(e,t,r):Reflect.get(e,t)};return(a=W.getFirebase(e,!0,n.namespace))?a.fire({type:"get",name:t,related:i,receiver:r},o):o()});return a(t)?o:o[0]},K=function(e,t,r=null,n={}){if(!(e=R(e))||!c(e))throw new Error('Observable subjects must be of type object; "'+i(e)+'" given!');if(f(t)&&(n=arguments.length>2?r:{},r=t,t=null),!f(r))throw new Error('Handler must be a function; "'+i(r)+'" given!');var s,a=N.getFirebase(e,!0,n.namespace),o={filter:t,handler:r,params:n};if((o.filter||"*"===o.params.subtree||o.params.subtree&&X(e))&&J(e,o.filter,o.params.subtree,n.namespace),o.params.unique&&(s=a.match({filter:t,params:n})).length){if("replace"!==o.params.unique)return s[0];a.remove(s[0])}return a.add(o)},L=function(e,t,r,i=null,s={}){var a;if(e!==r&&(K(r,(r,n)=>{if(a=N.getFirebase(e,!1,s.namespace)){var i=r.map(r=>{var n=r;do{if(n.target===e)return}while(n=n.src);var i={};return w(r,(e,t)=>{"target"!==e&&"name"!==e&&"path"!==e&&"src"!==e&&(i[e]=t)}),i.name=t,i.path=[t].concat(r.path),i.originalSubject=r.originalSubject,i.src=r,new U(e,i)}).filter(e=>e);if(i.length)return a.fire(i,n.cancellable)}},{subtree:!0,...s,unique:!0,tags:[$,t,e]}),n(i)&&(a=N.getFirebase(e,!1,s.namespace)))){var o=O({name:t,type:"set",value:r,related:[t]},i);let e=a.fire(o,s.cancellable);if(s.eventTypeReturn)return e}};const $={};function J(e,t=null,r=!1,n=null){if(!e||!c(e))throw new Error("Target must be of type object!");var i=N.getFirebase(e,!0,n);if(i&&!i.build){i.build=r;var s=x(t),a=!s.length||s.filter(e=>!e[0]&&0!==e[0]).length?Object.keys(e):s.map(e=>e[0]),o=s.length?s.map(e=>e.slice(1)).filter(e=>e.length):null;i.subBuild=o&&o.length?o:null,a.forEach(t=>{var s=G(e,t,null,{namespace:n});try{c(s)&&(L(e,t,s,null,params),(i.subBuild&&X(s)||(_isFunction(r)?r(s):r&&X(s)))&&J(s,i.subBuild,r,n))}catch(e){}})}}const X=e=>(e instanceof Object||e instanceof Array||e instanceof Function)&&("undefined"==typeof window||e!==window);var Y=function(e,t,r=null,n={}){if(!(e=R(e))||!c(e))throw new Error('Observable subjects must be of type object; "'+i(e)+'" given!');if(f(t)&&(n=arguments.length>2?r:{},r=t,t=null),r&&!f(r))throw new Error('Handler must be a function; "'+i(r)+'" given!');var s;if(s=N.getFirebase(e,!1,n.namespace))return s.removeMatches({filter:t,originalHandler:r,params:n})},Z=function(e,t,r,i=null,s={}){var a;if(Y(r,null,null,{...s,tags:[$,t,e]}),n(i)&&(a=N.getFirebase(e,!1,s.namespace))){var o=O({name:t,type:"del",oldValue:r,related:[t]},i);a.fire(o,s.cancellable)}},ee=function(e,t,r={}){return C("has",e,{name:t},r)},te=function(e,t,r,i={}){t=r.receiver||t;var o=r.keysOrPayload,l=r.value;if(!t||!c(t))throw new Error("Target must be of type object!");n(o)&&(i=l||{},l=null),t=R(t);var u=W.getFirebase(t,!1,i.namespace),f=N.getFirebase(t,!1,i.namespace);const h=(n,a,o,l)=>{var p,h="set";e&&(h="defineProperty",a=(p=a||{}).value);var g,d=!1;ee(t,n,i)&&(d=!0,g=G(t,n,r.receiver,i));var b={name:n,type:h,value:a,receiver:r.receiver,related:o,detail:l,isUpdate:d,oldValue:g},v=function(e){if(arguments.length&&(p?p=e:a=e),p){if(s(t,"accessorizedProps",!1).has(n)&&!s(t,"accessorizedProps").get(n).restore())return!1;Object.defineProperty(t,n,p)}else if(s(t,"accessorizedProps",!1).has(n))return s(t,"accessorizedProps").get(n).set(a);return t[n]=a,!0};if(u){var m=p?{type:"defineProperty",name:n,descriptor:p,receiver:r.receiver,related:o,detail:l,isUpdate:d,oldValue:g}:{type:"set",name:n,value:a,receiver:r.receiver,related:o,detail:l,isUpdate:d,oldValue:g};b.success=u.fire(m,v)}else b.success=v();return b.success&&b.value!==b.oldValue&&(c(b.oldValue)&&Z(t,n,b.oldValue,null,i),c(b.value)&&(L(t,n,b.value,null,i),f&&(f.subBuild||f.build&&X(b.value))&&J(b.value,f.subBuild,f.build,i.namespace))),b};var d,b=[];a(o)||(g(o)||p(o))&&(d=E(o))?b=d.map(e=>h(e,l,d,i.detail)):n(o)&&(d=Object.keys(o))&&(b=d.map(e=>h(e,o[e],d,i.detail)));var v,m=b.filter(e=>!1!==e.success);return f?(v=f.fire(m,i.cancellable)).successCount=m.length:i.eventTypeReturn&&(v=new B(t)),i.eventTypeReturn?v:m.length>0},re=function(e,t,r=null,n={}){return te(!0,e,{keysOrPayload:t,value:r},n)},ne=function(e,t,r={}){if(!e||!c(e))throw new Error("Target must be of type object!");e=R(e);var n,i,a=E(t),o=a.map(t=>{var n;ee(e,t,r)&&(n=G(e,t,null,r));var i,o={name:t,type:"deleteProperty",related:a,detail:r.detail,oldValue:n},l=function(r){return arguments.length?r:!(s(e,"accessorizedProps",!1).has(t)&&!s(e,"accessorizedProps").get(t).restore())&&(delete e[t],!0)};return(i=W.getFirebase(e,!1,r.namespace))?o.success=i.fire({type:"deleteProperty",name:t,oldValue:n,related:a},l):o.success=l(),o.success&&c(o.oldValue)&&Z(e,t,o.oldValue,null,r),o}).filter(e=>!1!==e.success);return(n=N.getFirebase(e,!1,r.namespace))?(i=n.fire(o,r.cancellable)).successCount=o.length:r.eventTypeReturn&&(i=new B(e)),r.eventTypeReturn?i:o.length>0},ie=function(e,t,r={}){return C("getOwnPropertyDescriptor",e,{name:t},r)},se=function(e,t={}){return C("getPrototypeOf",e,{},t)},ae=function(e,t={}){return C("isExtensible",e,{},t)},oe=function(e,t={}){return C("ownKeys",e,{},t)},le=function(e,t={}){return C("preventExtensions",e,{},t)},ue=function(e,t,r=null,n=null,i={}){return te(!1,e,arguments.length>3?{keysOrPayload:t,value:r,receiver:n}:{keysOrPayload:t,value:r},i)},ce=function(e,t,r={}){return C("setPrototypeOf",e,{prototype:t},r)},fe={apply:Q,construct:q,defineProperty:re,deleteProperty:ne,get:G,getOwnPropertyDescriptor:ie,getPrototypeOf:se,has:ee,isExtensible:ae,ownKeys:oe,preventExtensions:le,set:ue,setPrototypeOf:ce,accessorize:function(e,t=[],r={}){r=n(t)?t:r;var i=(1===arguments.length?Object.keys(e):E(t)).map(t=>{if(s(e,"accessorizedProps").has(t)&&s(e,"accessorizedProps").get(t).touch(!0))return!1;const n=()=>{for(var r,n=e;!r&&(n=Object.getPrototypeOf(n));)r=Object.getOwnPropertyDescriptor(n,t);return r};var i,a,o=Object.getOwnPropertyDescriptor(e,t);o||(i={writable:!0,enumerable:!(t in e),configurable:!1!==r.configurable});var l={...o||i};"value"in l&&delete l.value,"writable"in l&&delete l.writable,l.get=()=>{if(u.ongoingGets.length)return u.get();u.ongoingGets.push(1);var n=G(e,t,null,r);return u.ongoingGets.pop(),n},l.set=n=>{if(u.ongoingSets.length)return u.set(n);u.ongoingSets.push(1);var i=ue(e,t,n,null,r);return u.ongoingSets.pop(),i};var u={ongoingGets:[],ongoingSets:[],get:function(){var t=o;return t||(t=a?i:n()||i),t.get?t.get.call(e):t.value},set:function(t){var r=o;return r||(a?r=i:(r=n())?"value"in r&&(r=i,a=!0):(r=i,a=!0)),r.set||r.get?!!r.set&&r.set.call(e,t):(r.value=t,!0)},restore:function(){try{return this.intact()&&(o||a?Object.defineProperty(e,t,o||i):delete e[t],s(e,"accessorizedProps").delete(t)),!0}catch(e){}return!1},intact:function(){return(Object.getOwnPropertyDescriptor(e,t)||{}).get===l.get},touch:function(e=!1){return this.intact()||!!e&&!this.restore()}};try{return Object.defineProperty(e,t,l),s(e,"accessorizedProps").set(t,u),!0}catch(e){}return!1});return a(t)?i:i[0]},unaccessorize:function(e,t=[],r={}){r=n(t)?t:r;var i=(1===arguments.length?Object.keys(e):E(t)).map(t=>!s(e,"accessorizedProps",!1).has(t)||s(e,"accessorizedProps").get(t).restore());return a(t)?i:i[0]},proxy:function(e,t={}){if(!c(e))throw new Error('Object must be of type target; "'+i(e)+'" given!');var r=new Proxy(e,{apply:(e,r,n)=>Q(e,r,n,t),construct:(e,r,n=null)=>q(e,r,n,t),defineProperty:(e,r,n)=>re(e,r,n,t),deleteProperty:(e,r)=>ne(e,r,t),get:(e,n,i=null)=>{var s=G(e,n,i,t);return!1!==t.proxyAutoBinding&&f(s)&&!function(e){return o(e)&&/^class\s?/.test(Function.prototype.toString.call(e))}(s)?s.bind(r):s},getOwnPropertyDescriptor:(e,r)=>ie(e,r,t),getPrototypeOf:e=>se(e,t),has:(e,r)=>ee(e,r,t),isExtensible:e=>ae(e,t),ownKeys:e=>oe(e,t),preventExtensions:e=>le(e,t),set:(e,r,n,i=null)=>ue(e,r,n,i,t),setPrototypeOf:(e,r)=>ce(e,r,t)});return s(r).set(r,e),r},unproxy:R,observe:K,unobserve:Y,intercept:function(e,t,r={}){if(e=R(e),!c(e))throw new Error('Object must be of type target; "'+i(handler)+'" given!');var s={},a=!0;n(t)||(f(t)?t={[null]:t}:f(r)&&(t={[t]:r},r=arguments.length>3?arguments[3]:{}),a=!1);var o=W.getFirebase(e,!0,r.namespace);return Object.keys(t).forEach(e=>{if(!f(t[e]))throw new Error("Callback"+(null===e?"":" for "+e)+' must be a function; "'+i(t[e])+'" given!');var n,l={filter:e,handler:t[e],params:r};if(l.params.unique&&(n=o.match(l)).length){if("replace"!==l.params.unique)return n[0];o.remove(n[0])}a?s[e]=o.add(l):s=o.add(l)}),s},unintercept:function(e,t=null,r={}){if(!(e=R(e))||!c(e))throw new Error('Object must be of type target; "'+i(e)+'" given!');var n=W.getFirebase(e,!1,r.namespace);_isObject(t)||(f(t)?t={[null]:t}:f(r)&&(t={[t]:r},r=arguments.length>3?arguments[3]:{}),isOriginallyObj=!1),(n=W.getFirebase(e,!1,r.namespace))&&Object.keys(t).forEach(e=>{if(!f(t[e]))throw new Error("Callback"+(null===e?"":" for "+e)+' must be a function; "'+i(t[e])+'" given!');var s={filter:e,originalHandler:t[e],params:r};return n.removeMatches(s)})},closure:function(e,...t){var r=t.map(e=>{if(e=R(e),!c(e))throw new Error("Target must be of type object!");return{target:e,subjectCopy:a(e)?e.slice(0):A(e)}}),n=e(...t);const i=()=>{r.map(e=>{var t,r,n=Object.keys(e.subjectCopy),i=Object.keys(e.target),s=[],a=(t=n.concat(i),t.filter((e,t,r)=>r.indexOf(e)===t)).map(t=>{if(e.subjectCopy[t]!==e.target[t]){s.push(t);var r={name:t,related:s,buffered:!0};return i.includes(t)?(r.type="set",r.value=e.target[t],n.includes(t)&&(r.isUpdate=!0)):r.type="del",n.includes(t)&&(r.oldValue=e.subjectCopy[t]),c(e.subjectCopy[t])&&Z(e.target,t,e.subjectCopy[t]),c(e.target[t])&&L(e.target,t,e.target[t]),r}}).filter(e=>e);if(a.length&&(r=N.getFirebase(e.target,!1)))return r.fire(a)})};return n instanceof Promise?n.then(i):i(),n},build:J,link:L,unlink:Z,Observers:N,Interceptors:W};window.WebQit||(window.WebQit={}),window.WebQit.Observer=fe}]);
//# sourceMappingURL=main.js.map