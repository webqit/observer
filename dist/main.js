<<<<<<< HEAD
!function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);var n=function(e){return!Array.isArray(e)&&"object"==typeof e&&e},s=function(e){return typeof e};const i=new Map;function a(e,...t){var r,n,s=i.get(e);if(!s){if(s=new Map,!1===t[0])return s;i.set(e,s)}for(;r=t.shift();)if((n=s)&&!(s=s.get(r))){if(s=new Map,!1===t[0])return s;n.set(r,s)}return s}var u=function(e){return Array.isArray(e)},o=function(e){return"function"==typeof e},l=function(e){return null===e||""===e},c=function(e){return arguments.length&&(void 0===e||void 0===e)},f=function(e){return Array.isArray(e)||"object"==typeof e&&e||o(e)},h=function(e){return o(e)||e&&"[object function]"==={}.toString.call(e)},p=function(e){return e instanceof Number||"number"==typeof e},d=function(e){return p(e)||!0!==e&&!1!==e&&null!==e&&""!==e&&!isNaN(1*e)},b=function(e){return e instanceof String||"string"==typeof e&&null!==e},g=function(e,t=1){var r=0;e.forEach(e=>{r++});var n=e.slice(e.length-r,t);return arguments.length>1?n:n[0]},m=function(e,t=1){return arguments.length>1?g(e.slice().reverse(),t).reverse():g(e.slice().reverse())},v=function(e,...t){return t.forEach(t=>{e.indexOf(t)<0&&e.push(t)}),e},y=function(e,t){var r=[];return function(e,t){t=(t=t||Object.prototype)&&!u(t)?[t]:t;var r=[];for(e=e;e&&(!t||t.indexOf(e)<0)&&"default"!==e.name;)r.push(e),e=e?Object.getPrototypeOf(e):null;return r}(e,t).forEach(e=>{v(r,...Object.getOwnPropertyNames(e))}),r};function j(e,t,r=!1,s=!1,i=!1){var a=0,o=e.shift();if((d(o)||!0===o||!1===o)&&(a=o,o=e.shift()),!e.length)throw new Error("_merge() requires two or more array/objects.");return e.forEach((e,l)=>{(f(e)||h(e))&&(r?y(e):Object.getOwnPropertyNames(e)).forEach(c=>{if(t(c,o,e,l)){var f=o[c],h=e[c];if((u(f)&&u(h)||n(f)&&n(h))&&(!0===a||a>0))o[c]=u(f)&&u(h)?[]:{},j([d(a)?a-1:a,o[c],f,h],t,r,s,i);else if(u(o)&&u(e))s?o[c]=h:o.push(h);else try{i?Object.defineProperty(o,c,Object.getOwnPropertyDescriptor(e,c)):o[c]=e[c]}catch(e){}}})}),o}var w=function(e,t){var r=void 0;return f(e)&&Object.keys(e).forEach((n,s)=>{!1!==r&&(r=t(d(n)?parseFloat(n):n,e[n],s))}),r};new Map;var O=function(...e){return j(e,(e,t,r)=>!0,!1,!1,!1)};function P(e,t,r=null,n=!1){return t.length>e.length?-1:("number"==typeof r?n?e.slice(0,r+1+(r<0?e.length:0)):e.slice(r):e).reduce((e,r,s)=>{var[i,a,u]=e;if(!n&&i>-1)return[i,a,u];var o=u+1,l=r===t[o]?0===o?[s,0]:[a,o]:[-1,-1];return l[1]===t.length-1&&(l[1]=-1,l[0]>-1)?[l[0]].concat(l):[i].concat(l)},[-1,-1,-1])[0]+(n||"number"!=typeof r?0:r>-1?r:e.length-r)}function E(e,t,r=null,n=!1){var s=P(e,t,r,n);return-1===s?[]:e.slice(s+t.length)}var _=function(e,t=!0){return u(e)?e:!t&&n(e)?[e]:!1!==e&&0!==e&&function(e){return l(e)||c(e)||!1===e||0===e||f(e)&&!Object.keys(e).length}(e)?[]:function(e){return!b(e)&&!c(e.length)}(e)?Array.prototype.slice.call(e):n(e)?Object.values(e):[e]};function F(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?e.join(".")===t.join("."):e.length===t.length&&e.reduce((e,r,n)=>e&&r===t[n],!0)}var S=function(e,t,r=null){return u(t)?e.filter(e=>r?t.filter(t=>r(e,t)).length:-1!==t.indexOf(e)):[]};function x(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?(e.join(".")+".").startsWith(t.join(".")+"."):t.reduce((t,r,n)=>t&&r===e[n],!0)}function D(e){return(T(e)?e:_(e).length?[e]:[]).reduce((e,t)=>e.concat([_(t)]),[]).map(e=>z.resolve(e))}class z extends Array{static resolve(e){return e.every(e=>!(e+"").includes("."))?(new z).concat(e):e}get dotSafe(){return!0}}function T(e){return _(e).reduce((e,t)=>e||u(t),!1)}function V(e){return e.filter(e=>e||0===e).length!==e.length}class k{constructor(e){this.subject=e,this.fireables=[],this.currentlyFiring=[]}add(e){return this.fireables.push(e),e}remove(e){this.fireables=this.fireables.filter(t=>t!==e)}removeMatches(e){this.match(e).forEach(e=>{this.fireables=this.fireables.filter(t=>t!==e)})}match(e){return this.fireables.filter(t=>{var r=D(t.filter),n=_((t.params||{}).tags),s=D(e.filter),i=_((e.params||{}).tags);return(!e.originalHandler||t.handler===e.originalHandler)&&(!s.length||F(s,r))&&(!i.length||i.length===n.length&&S(n,i).length===i.length)})}static getFirebase(e,t=!0,r=null){var n=this;if(r&&this._namespaces&&this._namespaces.has(r)&&(n=this._namespaces.get(r)),!f(e))throw new Error('Subject must be of type object; "'+s(e)+'" given!');return!a(e,"firebases").has(n)&&t&&a(e,"firebases").set(n,new n(e)),a(e,"firebases").get(n)}static namespace(e,t=null){if(this._namespaces||(this._namespaces=new Map),1===arguments.length)return this._namespaces.get(e);if(!(t.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${e} must be a subclass of ${this.name}.`);this._namespaces.set(e,t)}}class M{constructor(e,t){this.subject=e,this.handler=t.handler,this.filter=t.filter,this.params=t.params}disconnect(){this.disconnected=!0}}var A=function(e,t=[],r=!0){var n=0;return d(arguments[0])&&f(arguments[1])&&(n=arguments[0],e=arguments[1],t=arguments[2]||[]),j([n,{},e],(e,r,n)=>h(t)?t(e):!u(t)||!t.length||t.indexOf(e)>-1,!1,!1,r)};class I{constructor(e,t=!1){this._={},this._.target=e,this._.cancellable=t,this._.propagationStopped=!1,this._.defaultPrevented=!1,this._.promisesInstance=null,this._.promises=[]}get target(){return this._.target}get cancellable(){return this._.cancellable}stopPropagation(){this._.propagationStopped=!0}get propagationStopped(){return this._.propagationStopped}preventDefault(){this._.defaultPrevented=!0}get defaultPrevented(){return this._.defaultPrevented}waitUntil(e){e instanceof Promise&&(this._.promises.push(e),this._.promisesInstance=null)}get promises(){return!this._.promisesInstance&&this._.promises.length&&(this._.promisesInstance=Promise.all(this._.promises)),this._.promisesInstance}respondWith(e){var t,r=n(e)&&!c(e.propagationStopped)&&!c(e.defaultPrevented);!1===e||r&&e.propagationStopped?this.stopPropagation():!1===e||r&&e.defaultPrevented?this.preventDefault():(e instanceof Promise&&(t=e)||r&&(t=e.promises))&&this.waitUntil(t)}}class C extends M{constructor(e,t){if(super(e,t),this.filters2D=D(this.filter),this.filtersIsOriginally2D=T(this.filter),this.filtersIsDynamic=this.filters2D.filter(e=>V(_(e))).length>0,this.filtersIsDynamic&&this.filters2D.length>1)throw new Error('Only one "Dynamic Filter" must be observed at a time! "'+this.filters2D.map(e=>"["+e.join(", ")+"]").join(", ")+'" have been bound together.')}fire(e){if(this.disconnected||this.params.type&&(t=e=>this.params.type===e.type,!e.reduce((e,r,n)=>e||t(r,n),!1)))return;var t;const r=e=>!["set","def"].includes(e.type)||!this.params.diff||(h(this.params.diff)?this.params.diff(e.value,e.oldValue):e.value!==e.oldValue);var s=new I(this.subject);if(this.filters2D.length){var i=e.filter(e=>this.filters2D.filter((t,n)=>{var s=t.slice();return this.filtersIsDynamic&&e.path.forEach((e,t)=>{s[t]=s[t]||0===s[t]?s[t]:e}),(!this.filtersIsDynamic||!V(s))&&r(e)&&(!this.params.subtree&&F(s,e.path)||this.params.suptree&&x(s,e.path)&&(!d(this.params.suptree)||E(s,e.path).length<=this.params.suptree)||this.params.subtree&&e.path.length>=s.length&&x(e.path,s)&&(!d(this.params.subtree)||E(e.path,s).length<=this.params.subtree))}).length);if(i.length)if(this.filtersIsOriginally2D||this.params.subtree){var a=i;n(this.filter)&&(a={...this.filter},i.forEach((e,t)=>{a[e.name]=e})),s.respondWith(this.handler(a,s))}else i.forEach((e,t)=>{s.respondWith(this.handler(e,s))})}else(this.params.subtree||e.filter(e=>F(e.path,[e.name])).length===e.length)&&e.filter(e=>r(e)).length&&s.respondWith(this.handler(e,s));return s}}class W{constructor(e,t){if(this.subject=e,t.originalSubject||(this.originalSubject=e),!("type"in t))throw new Error("Mutation type must be given in definition!");if(!("name"in t))throw new Error("Property name must be given in definition!");w(t,(e,t)=>{"path"===e&&(t=z.resolve(t)),Object.defineProperty(this,e,{value:t,enumerable:!0})}),this.path||Object.defineProperty(this,"path",{value:z.resolve([t.name]),enumerable:!0}),Object.seal(this)}}class H extends k{constructor(e){super(e),this.buffers=[]}add(e){return super.add(new C(this.subject,e))}fire(e,t){var r=new I(this.subject,t);return e=_(e,!1).map(e=>e instanceof W?e:new W(this.subject,e)),this.buffers.length?(m(this.buffers)(e),r):(this.currentlyFiring.filter(t=>e.filter(e=>t.type===e.type&&t.name===e.name).length).length,this.fireables.forEach(n=>{if(r.propagationStopped&&t)return r;r.respondWith(n.fire(e))}),r)}}class q extends M{fire(e,t,r){return this.disconnected||this.filter&&!S(_(this.filter),[e.type]).length?t(...Array.prototype.slice.call(arguments,2)):this.handler(e,r,t)}}class B{constructor(e,t){if(this.subject=e,!t.type)throw new Error("Action type must be given in definition!");w(t,(e,t)=>{Object.defineProperty(this,e,{value:t,enumerable:!0})}),Object.seal(this)}}class R extends k{add(e){return super.add(new q(this.subject,e))}fire(e,t=null){if(e instanceof B||(e=new B(this.subject,e)),this.currentlyFiring.filter(t=>t.type===e.type&&t.name===e.name).length)return t?t():void 0;this.currentlyFiring.push(e);const r=(n,...s)=>{var i=this.fireables[n];return i?i.fire(e,(...e)=>r(n+1,...e),...s):t?t(...s):s[0]};var n=r(0);return this.currentlyFiring.pop(),n}}var U=function(e){return a(e,!1).get(e)||e},N=function(e,t,r={}){if(!t||!f(t))throw new Error("Target must be of type object!");t=U(t);var n,s=function(r){return arguments.length?r:e?Reflect.ownKeys(t):Object.keys(t)};return(n=R.getFirebase(t,!1,r.namespace))?n.fire({type:e?"ownKeys":"keys"},s)||[]:s()},K=function(e,t={}){return N(!1,...arguments)},Q=function(e,t,r={}){if(!e||!f(e))throw new Error("Target must be of type object!");e=U(e);var n=_(t),s=n.map(t=>{var s,i=function(r){return arguments.length?r:a(e,"accessorizedProps").has(t)&&a(e,"accessorizedProps").get(t).touch(!0)?a(e,"accessorizedProps").get(t).read():e[t]};return(s=R.getFirebase(e,!0,r.namespace))?s.fire({type:"get",name:t,related:n},i):i()});return u()?s:s[0]},$=function(e,t,r=null,n={}){if(!e||!f(e))throw new Error('Observable subjects must be of type object; "'+s(e)+'" given!');if(h(t)&&(n=arguments.length>2?r:{},r=t,t=null),!h(r))throw new Error('Handler must be a function; "'+s(r)+'" given!');var i,a=H.getFirebase(e,!0,n.namespace),u={filter:t,handler:r,params:n};if((u.filter||"*"===u.params.subtree||u.params.subtree&&X(e))&&L(e,u.filter,u.params.subtree,n.namespace),u.params.unique&&(i=a.match({filter:t,params:n})).length){if("replace"!==u.params.unique)return i[0];a.remove(i[0])}return a.add(u)},G=function(e,t,r,s=null,i={}){var a;if(e!==r&&($(r,(r,n)=>{if(a=H.getFirebase(e,!1,i.namespace)){var s=r.map(r=>{var n=r;do{if(n.subject===e)return}while(n=n.src);var s={};return w(r,(e,t)=>{"subject"!==e&&"name"!==e&&"path"!==e&&"src"!==e&&(s[e]=t)}),s.name=t,s.path=[t].concat(r.path),s.originalSubject=r.originalSubject,s.src=r,new W(e,s)}).filter(e=>e);if(s.length)return a.fire(s,n.cancellable)}},{subtree:!0,...i,unique:!0,tags:[J,t,e]}),n(s)&&(a=H.getFirebase(e,!1,i.namespace)))){var u=O({name:t,type:"set",value:r,related:[t]},s);let e=a.fire(u,i.cancellable);if(i.eventReturnType)return e}};const J={};function L(e,t=null,r=!1,n=null){if(!e||!f(e))throw new Error("Target must be of type object!");var s=H.getFirebase(e,!0,n);if(s&&!s.build){s.build=r;var i=D(t),a=!i.length||i.filter(e=>!e[0]&&0!==e[0]).length?K(e):i.map(e=>e[0]),u=i.length?i.map(e=>e.slice(1)).filter(e=>e.length):null;s.subBuild=u&&u.length?u:null,a.forEach(t=>{var i=Q(e,t);try{f(i)&&(G(e,t,i,null,params),(s.subBuild&&X(i)||(_isFunction(r)?r(i):r&&X(i)))&&L(i,s.subBuild,r,n))}catch(e){}})}}const X=e=>(e instanceof Object||e instanceof Array||e instanceof Function)&&("undefined"==typeof window||e!==window);var Y=function(e,t,r=null,n={}){if(!e||!f(e))throw new Error('Observable subjects must be of type object; "'+s(e)+'" given!');if(h(t)&&(n=arguments.length>2?r:{},r=t,t=null),r&&!h(r))throw new Error('Handler must be a function; "'+s(r)+'" given!');var i;if(i=H.getFirebase(e,!1,n.namespace))return i.removeMatches({filter:t,originalHandler:r,params:n})},Z=function(e,t,r,s=null,i={}){var a;if(Y(r,null,null,{...i,tags:[J,t,e]}),n(s)&&(a=H.getFirebase(e,!1,i.namespace))){var u=O({name:t,type:"del",oldValue:r,related:[t]},s);a.fire(u,i.cancellable)}},ee=function(e,t,r={}){if(!e||!f(e))throw new Error("Target must be of type object!");e=U(e);var n,s=function(r){return arguments.length?r:t in e};return(n=R.getFirebase(e,!1,r.namespace))?n.fire({type:"has",name:t},s):s()},te=function(e,t,r,s=null,i={}){if(!t||!f(t))throw new Error("Target must be of type object!");n(r)&&(i=s||{},s=null),t=U(t);var o=R.getFirebase(t,!1,i.namespace),l=H.getFirebase(t,!1,i.namespace);const c=(r,n,s,u)=>{var c,h="set";e&&(h="definition",n=(c=n||{}).value);var p,d=!1;ee(t,r,i)&&(d=!0,p=Q(t,r,i));var b={name:r,type:h,value:n,related:s,detail:u,isUpdate:d,oldValue:p},g=function(e){if(arguments.length&&(c?c=e:n=e),c){if(a(t,"accessorizedProps",!1).has(r)&&!a(t,"accessorizedProps").get(r).restore())return!1;Object.defineProperty(t,r,c)}else if(a(t,"accessorizedProps",!1).has(r))return a(t,"accessorizedProps").get(r).write(n);return t[r]=n,!0};if(o){var m=c?{type:"defineProperty",name:r,descriptor:c,related:s,detail:u,isUpdate:d,oldValue:p}:{type:"set",name:r,value:n,related:s,detail:u,isUpdate:d,oldValue:p};b.success=o.fire(m,g)}else b.success=g();return b.success&&b.value!==b.oldValue&&(f(b.oldValue)&&Z(t,r,b.oldValue,null,i),f(b.value)&&(G(t,r,b.value,null,i),l&&(l.subBuild||l.build&&X(b.value))&&L(b.value,l.subBuild,l.build,i.namespace))),b};var h,d=[];u(r)||(b(r)||p(r))&&(h=_(r))?d=h.map(e=>c(e,s,h,i.detail)):n(r)&&(h=Object.keys(r))&&(d=h.map(e=>c(e,r[e],h,i.detail)));var g,m=d.filter(e=>e.success);return l?(g=l.fire(m,i.cancellable)).successCount=m.length:i.eventReturnType&&(g=new I(t)),i.eventReturnType?g:m.length>0},re=function(e,t,r=null,n={}){return te(!1,...arguments)},ne=function(e,t,r={}){if(!e||!f(e))throw new Error("Target must be of type object!");e=U(e);var n,s,i=_(t),u=i.map(t=>{var n;ee(e,t,r)&&(n=Q(e,t,r));var s,u={name:t,type:"deletion",related:i,detail:r.detail,oldValue:n},o=function(r){return arguments.length?r:!(a(e,"accessorizedProps",!1).has(t)&&!a(e,"accessorizedProps").get(t).restore())&&(delete e[t],!0)};return(s=R.getFirebase(e,!1,r.namespace))?u.success=s.fire({type:"deleteProperty",name:t,oldValue:n,related:i},o):u.success=o(),u.success&&f(u.oldValue)&&Z(e,t,u.oldValue,null,r),u}).filter(e=>e.success);return(n=H.getFirebase(e,!1,r.namespace))?(s=n.fire(u,r.cancellable)).successCount=u.length:r.eventReturnType&&(s=new I(e)),r.eventReturnType?s:u.length>0},se=function(e,t,r=null,n={}){return te(!0,...arguments)},ie=function(e,t={}){return N(!0,...arguments)};var ae={set:re,get:Q,has:ee,deleteProperty:ne,del:ne,defineProperty:se,def:se,ownKeys:ie,keys:K,accessorize:function(e,t=[],r={}){r=n(t)?t:r;var s=(1===arguments.length?Object.keys(e):_(t)).map(t=>{if(a(e,"accessorizedProps").has(t)&&a(e,"accessorizedProps").get(t).touch(!0))return!1;var n=Object.getOwnPropertyDescriptor(e,t)||{enumerable:!(t in e),configurable:!1!==r.configurable};"value"in n&&delete n.value,"writable"in n&&delete n.writable,n.get=()=>Q(e,t,r),n.set=n=>re(e,t,n,r);try{const r=e[t];return Object.defineProperty(e,t,n),a(e,"accessorizedProps").set(t,{value:r,read:function(){return this.value},write:function(e){return this.value=e,!0},restore:function(){try{return this.intact()&&(delete e[t],e[t]=this.value,a(e,"accessorizedProps").delete(t)),!0}catch(e){}return!1},intact:function(){return(Object.getOwnPropertyDescriptor(e,t)||{}).get===n.get},touch:function(e=!1){return this.intact()||!!e&&!this.restore()}}),!0}catch(e){}return!1});return u(t)?s:s[0]},unaccessorize:function(e,t=[],r={}){r=n(t)?t:r;var s=(1===arguments.length?Object.keys(e):_(t)).map(t=>!a(e,"accessorizedProps",!1).has(t)||a(e,"accessorizedProps").get(t).restore());return u(t)?s:s[0]},proxy:function(e,t={}){if(!f(e))throw new Error('Object must be of type subject; "'+s(e)+'" given!');var r=new Proxy(e,{get:(e,n)=>{var s=Q(e,n,t);return!1!==t.proxyAutoBinding&&h(s)&&!function(e){return o(e)&&/^class\s?/.test(Function.prototype.toString.call(e))}(s)?s.bind(r):s},set:(...e)=>(re(...e.concat(t)),!0),has:(...e)=>ee(...e.concat(t)),deleteProperty:(...e)=>(ne(...e.concat(t)),!0),defineProperty:(...e)=>(se(...e.concat(t)),!0),ownKeys:(...e)=>ie(...e.concat(t))});return a(r).set(r,e),r},unproxy:U,observe:$,unobserve:Y,intercept:function(e,t,r,n={}){if(!f(e))throw new Error('Object must be of type subject; "'+s(r)+'" given!');if(h(t)&&(n=arguments.length>2?r:{},r=t,t=null),!h(r))throw new Error('Callback must be a function; "'+s(r)+'" given!');var i,a=R.getFirebase(e,!0,n.namespace),u={filter:t,handler:r,params:n};if(u.params.unique&&(i=a.match(u)).length){if("replace"!==u.params.unique)return i[0];a.remove(i[0])}return a.add(u)},unintercept:function(e,t,r=null,n={}){if(!e||!f(e))throw new Error('Object must be of type subject; "'+s(e)+'" given!');if(h(t)&&(n=arguments.length>2?r:{},r=t,t=null),r&&!h(r))throw new Error('Handler must be a function; "'+s(r)+'" given!');var i;if(i=R.getFirebase(e,!1,n.namespace))return i.removeMatches({filter:t,originalHandler:r,params:n})},closure:function(e,...t){var r=t.map(e=>{if(!f(e))throw new Error("Target must be of type object!");return{subject:e,subjectCopy:u(e)?e.slice(0):A(e)}}),n=e(...t);const s=()=>{r.map(e=>{var t,r,n=Object.keys(e.subjectCopy),s=Object.keys(e.subject),i=[],a=(t=n.concat(s),t.filter((e,t,r)=>r.indexOf(e)===t)).map(t=>{if(e.subjectCopy[t]!==e.subject[t]){i.push(t);var r={name:t,related:i,buffered:!0};return s.includes(t)?(r.type="set",r.value=e.subject[t],n.includes(t)&&(r.isUpdate=!0)):r.type="del",n.includes(t)&&(r.oldValue=e.subjectCopy[t]),f(e.subjectCopy[t])&&Z(e.subject,t,e.subjectCopy[t]),f(e.subject[t])&&G(e.subject,t,e.subject[t]),r}}).filter(e=>e);if(a.length&&(r=H.getFirebase(e.subject,!1)))return r.fire(a)})};return n instanceof Promise?n.then(s):s(),n},build:L,link:G,unlink:Z,Observers:H,Interceptors:R};window.WebQit||(window.WebQit={}),window.WebQit.Observer=ae}]);
=======
!function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);var n=function(e){return Array.isArray(e)},s=function(e){return e instanceof String||"string"==typeof e&&null!==e},i=function(e){return arguments.length&&(void 0===e||void 0===e)},a=function(e){return"function"==typeof e},o=function(e){return Array.isArray(e)||"object"==typeof e&&e||a(e)},u=function(e){return!Array.isArray(e)&&"object"==typeof e&&e},l=function(e,t=!0){return n(e)?e:!t&&u(e)?[e]:!1!==e&&0!==e&&function(e){return function(e){return null===e||""===e}(e)||i(e)||!1===e||0===e||o(e)&&!Object.keys(e).length}(e)?[]:function(e){return!s(e)&&!i(e.length)}(e)?Array.prototype.slice.call(e):u(e)?Object.values(e):[e]},c=function(e){return e instanceof Number||"number"==typeof e};const f=new Map;function h(e,...t){var r,n,s=f.get(e);if(!s){if(s=new Map,!1===t[0])return s;f.set(e,s)}for(;r=t.shift();)if((n=s)&&!(s=s.get(r))){if(s=new Map,!1===t[0])return s;n.set(r,s)}return s}var p=function(e,t,r=null){return n(t)?e.filter(e=>r?t.filter(t=>r(e,t)).length:-1!==t.indexOf(e)):[]},d=function(e){return a(e)||e&&"[object function]"==={}.toString.call(e)},b=function(e){return typeof e};function g(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?e.join(".")===t.join("."):e.length===t.length&&e.reduce((e,r,n)=>e&&r===t[n],!0)}function m(e){return(y(e)?e:l(e).length?[e]:[]).reduce((e,t)=>e.concat([l(t)]),[]).map(e=>v.resolve(e))}class v extends Array{static resolve(e){return e.every(e=>!(e+"").includes("."))?(new v).concat(e):e}get dotSafe(){return!0}}function y(e){return l(e).reduce((e,t)=>e||n(t),!1)}function j(e){return e.filter(e=>e||0===e).length!==e.length}class w{constructor(e){this.subject=e,this.fireables=[],this.currentlyFiring=[]}add(e){return this.fireables.push(e),e}remove(e){this.fireables=this.fireables.filter(t=>t!==e)}removeMatches(e){this.match(e).forEach(e=>{this.fireables=this.fireables.filter(t=>t!==e)})}match(e){return this.fireables.filter(t=>{var r=m(t.filter),n=l((t.params||{}).tags),s=m(e.filter),i=l((e.params||{}).tags);return(!e.originalHandler||t.handler===e.originalHandler)&&(!s.length||g(s,r))&&(!i.length||i.length===n.length&&p(n,i).length===i.length)})}static getFirebase(e,t=!0,r=null){var n=this;if(r&&this._namespaces&&this._namespaces.has(r)&&(n=this._namespaces.get(r)),!o(e))throw new Error('Subject must be of type object; "'+b(e)+'" given!');return!h(e,"firebases").has(n)&&t&&h(e,"firebases").set(n,new n(e)),h(e,"firebases").get(n)}static namespace(e,t=null){if(this._namespaces||(this._namespaces=new Map),1===arguments.length)return this._namespaces.get(e);if(!(t.prototype instanceof this))throw new Error(`The implementation of the namespace ${this.name}.${e} must be a subclass of ${this.name}.`);this._namespaces.set(e,t)}}class O{constructor(e,t){this.subject=e,this.handler=t.handler,this.filter=t.filter,this.params=t.params}disconnect(){this.disconnected=!0}}class P extends O{fire(e,t,r){return this.disconnected||this.filter&&!p(l(this.filter),[e.type]).length?t(...Array.prototype.slice.call(arguments,2)):this.handler(e,r,t)}}var E=function(e){return c(e)||!0!==e&&!1!==e&&null!==e&&""!==e&&!isNaN(1*e)},_=function(e,t){var r=void 0;return o(e)&&Object.keys(e).forEach((n,s)=>{!1!==r&&(r=t(E(n)?parseFloat(n):n,e[n],s))}),r};class F{constructor(e,t){if(this.subject=e,!t.type)throw new Error("Action type must be given in definition!");_(t,(e,t)=>{Object.defineProperty(this,e,{value:t,enumerable:!0})}),Object.seal(this)}}class S extends w{add(e){return super.add(new P(this.subject,e))}fire(e,t=null){if(e instanceof F||(e=new F(this.subject,e)),this.currentlyFiring.filter(t=>t.type===e.type&&t.name===e.name).length)return t?t():void 0;this.currentlyFiring.push(e);const r=(n,...s)=>{var i=this.fireables[n];return i?i.fire(e,(...e)=>r(n+1,...e),...s):t?t(...s):s[0]};var n=r(0);return this.currentlyFiring.pop(),n}}var x=function(e,t=1){var r=0;e.forEach(e=>{r++});var n=e.slice(e.length-r,t);return arguments.length>1?n:n[0]};function D(e,t,r=null,n=!1){var s=function(e,t,r=null,n=!1){return t.length>e.length?-1:("number"==typeof r?n?e.slice(0,r+1+(r<0?e.length:0)):e.slice(r):e).reduce((e,r,s)=>{var[i,a,o]=e;if(!n&&i>-1)return[i,a,o];var u=o+1,l=r===t[u]?0===u?[s,0]:[a,u]:[-1,-1];return l[1]===t.length-1&&(l[1]=-1,l[0]>-1)?[l[0]].concat(l):[i].concat(l)},[-1,-1,-1])[0]+(n||"number"!=typeof r?0:r>-1?r:e.length-r)}(e,t,r,n);return-1===s?[]:e.slice(s+t.length)}function z(e,t,r=null){return r||!1!==r&&e.dotSafe&&t.dotSafe?(e.join(".")+".").startsWith(t.join(".")+"."):t.reduce((t,r,n)=>t&&r===e[n],!0)}class V{constructor(e,t=!1){this._={},this._.target=e,this._.cancellable=t,this._.propagationStopped=!1,this._.defaultPrevented=!1,this._.promisesInstance=null,this._.promises=[]}get target(){return this._.target}get cancellable(){return this._.cancellable}stopPropagation(){this._.propagationStopped=!0}get propagationStopped(){return this._.propagationStopped}preventDefault(){this._.defaultPrevented=!0}get defaultPrevented(){return this._.defaultPrevented}waitUntil(e){e instanceof Promise&&(this._.promises.push(e),this._.promisesInstance=null)}get promises(){return!this._.promisesInstance&&this._.promises.length&&(this._.promisesInstance=Promise.all(this._.promises)),this._.promisesInstance}respondWith(e){var t,r=u(e)&&!i(e.propagationStopped)&&!i(e.defaultPrevented);!1===e||r&&e.propagationStopped?this.stopPropagation():!1===e||r&&e.defaultPrevented?this.preventDefault():(e instanceof Promise&&(t=e)||r&&(t=e.promises))&&this.waitUntil(t)}}class k extends O{constructor(e,t){if(super(e,t),this.filters2D=m(this.filter),this.filtersIsOriginally2D=y(this.filter),this.filtersIsDynamic=this.filters2D.filter(e=>j(l(e))).length>0,this.filtersIsDynamic&&this.filters2D.length>1)throw new Error('Only one "Dynamic Filter" must be observed at a time! "'+this.filters2D.map(e=>"["+e.join(", ")+"]").join(", ")+'" have been bound together.')}fire(e){if(this.disconnected||this.params.type&&(t=e=>this.params.type===e.type,!e.reduce((e,r,n)=>e||t(r,n),!1)))return;var t;const r=e=>!["set","def"].includes(e.type)||!this.params.diff||(d(this.params.diff)?this.params.diff(e.value,e.oldValue):e.value!==e.oldValue);var n=new V(this.subject);if(this.filters2D.length){var s=e.filter(e=>this.filters2D.filter((t,n)=>{var s=t.slice();return this.filtersIsDynamic&&e.path.forEach((e,t)=>{s[t]=s[t]||0===s[t]?s[t]:e}),(!this.filtersIsDynamic||!j(s))&&r(e)&&(!this.params.subtree&&g(s,e.path)||this.params.suptree&&z(s,e.path)&&(!E(this.params.suptree)||D(s,e.path).length<=this.params.suptree)||this.params.subtree&&e.path.length>=s.length&&z(e.path,s)&&(!E(this.params.subtree)||D(e.path,s).length<=this.params.subtree))}).length);if(s.length)if(this.filtersIsOriginally2D||this.params.subtree){var i=s;u(this.filter)&&(i={...this.filter},s.forEach((e,t)=>{i[e.name]=e})),n.respondWith(this.handler(i,n))}else s.forEach((e,t)=>{n.respondWith(this.handler(e,n))})}else(this.params.subtree||e.filter(e=>g(e.path,[e.name])).length===e.length)&&e.filter(e=>r(e)).length&&n.respondWith(this.handler(e,n));return n}}class A{constructor(e,t){if(this.subject=e,t.originalSubject||(this.originalSubject=e),!("type"in t))throw new Error("Delta type must be given in definition!");if(!("name"in t))throw new Error("Property name must be given in definition!");_(t,(e,t)=>{"path"===e&&(t=v.resolve(t)),Object.defineProperty(this,e,{value:t,enumerable:!0})}),this.path||Object.defineProperty(this,"path",{value:v.resolve([t.name]),enumerable:!0}),Object.seal(this)}}class I extends w{constructor(e){super(e),this.buffers=[]}add(e){return super.add(new k(this.subject,e))}fire(e,t){var r=new V(this.subject,t);return e=l(e,!1).map(e=>e instanceof A?e:new A(this.subject,e)),this.buffers.length?(function(e,t=1){return arguments.length>1?x(e.slice().reverse(),t).reverse():x(e.slice().reverse())}(this.buffers)(e),r):(this.currentlyFiring.filter(t=>e.filter(e=>t.type===e.type&&t.name===e.name).length).length,this.fireables.forEach(n=>{if(r.propagationStopped&&t)return r;r.respondWith(n.fire(e))}),r)}}var M=function(e){return h(e,!1).get(e)||e},T=function(e,t,r={}){if(!t||!o(t))throw new Error("Target must be of type object!");t=M(t);var n,s=function(r){return arguments.length?r:e?Object.getOwnPropertyNames(t):Object.keys(t)};return(n=S.getFirebase(t,!1,r.namespace))?n.fire({type:e?"ownKeys":"keys"},s)||[]:s()},C=function(e,t={}){return T(!1,...arguments)},W=function(e,t,r={}){if(!e||!o(e))throw new Error("Target must be of type object!");e=M(e);var s=l(t),i=s.map(t=>{var n,i=function(r){return arguments.length?r:h(e,"accessorizedProps").has(t)&&h(e,"accessorizedProps").get(t).touch(!0)?h(e,"accessorizedProps").get(t).read():e[t]};return(n=S.getFirebase(e,!0,r.namespace))?n.fire({type:"get",name:t,related:s},i):i()});return n()?i:i[0]},H=function(e,t){var r=[];return function(e,t){t=(t=t||Object.prototype)&&!n(t)?[t]:t;var r=[];for(e=e;e&&(!t||t.indexOf(e)<0)&&"default"!==e.name;)r.push(e),e=e?Object.getPrototypeOf(e):null;return r}(e,t).forEach(e=>{!function(e,...t){t.forEach(t=>{e.indexOf(t)<0&&e.push(t)})}(r,...Object.getOwnPropertyNames(e))}),r};function q(e,t,r=!1,s=!1,i=!1){var a=0,l=e.shift();if((E(l)||!0===l||!1===l)&&(a=l,l=e.shift()),!e.length)throw new Error("_merge() requires two or more array/objects.");return e.forEach((e,c)=>{(o(e)||d(e))&&(r?H(e):Object.getOwnPropertyNames(e)).forEach(o=>{if(t(o,l,e,c)){var f=l[o],h=e[o];if((n(f)&&n(h)||u(f)&&u(h))&&(!0===a||a>0))l[o]=n(f)&&n(h)?[]:{},q([E(a)?a-1:a,l[o],f,h],t,r,s,i);else if(n(l)&&n(e))s?l[o]=h:l.push(h);else try{i?Object.defineProperty(l,o,Object.getOwnPropertyDescriptor(e,o)):l[o]=e[o]}catch(e){}}})}),l}var B=function(...e){return q(e,(e,t,r)=>!0,!1,!1,!1)},N=function(e,t,r=null,n={}){if(!e||!o(e))throw new Error('Observable subjects must be of type object; "'+b(e)+'" given!');if(d(t)&&(n=arguments.length>2?r:{},r=t,t=null),!d(r))throw new Error('Handler must be a function; "'+b(r)+'" given!');var s,i=I.getFirebase(e,!0,n.namespace),a={filter:t,handler:r,params:n};if((a.filter||"*"===a.params.subtree||a.params.subtree&&$(e))&&Q(e,a.filter,a.params.subtree,n.namespace),a.params.unique&&(s=i.match({filter:t,params:n})).length){if("replace"!==a.params.unique)return s[0];i.remove(s[0])}return i.add(a)},U=function(e,t,r,n=null,s={}){var i;if(e!==r&&(N(r,(r,n)=>{if(i=I.getFirebase(e,!1,s.namespace)){var a=r.map(r=>{var n=r;do{if(n.subject===e)return}while(n=n.src);var s={};return _(r,(e,t)=>{"subject"!==e&&"name"!==e&&"path"!==e&&"src"!==e&&(s[e]=t)}),s.name=t,s.path=[t].concat(r.path),s.originalSubject=r.originalSubject,s.src=r,new A(e,s)}).filter(e=>e);if(a.length)return i.fire(a,n.cancellable)}},{subtree:!0,...s,unique:!0,tags:[K,t,e]}),u(n)&&(i=I.getFirebase(e,!1,s.namespace)))){var a=B({name:t,type:"set",value:r,related:[t]},n);let e=i.fire(a,s.cancellable);if(s.responseObject)return e}};const K={};function Q(e,t=null,r=!1,n=null){if(!e||!o(e))throw new Error("Target must be of type object!");var s=I.getFirebase(e,!0,n);if(s&&!s.build){s.build=r;var i=m(t),a=!i.length||i.filter(e=>!e[0]&&0!==e[0]).length?C(e):i.map(e=>e[0]),u=i.length?i.map(e=>e.slice(1)).filter(e=>e.length):null;s.subBuild=u&&u.length?u:null,a.forEach(t=>{var i=W(e,t);try{o(i)&&(U(e,t,i,null,params),(s.subBuild&&$(i)||(_isFunction(r)?r(i):r&&$(i)))&&Q(i,s.subBuild,r,n))}catch(e){}})}}const $=e=>(e instanceof Object||e instanceof Array||e instanceof Function)&&("undefined"==typeof window||e!==window);var G=function(e,t,r=null,n={}){if(!e||!o(e))throw new Error('Observable subjects must be of type object; "'+b(e)+'" given!');if(d(t)&&(n=arguments.length>2?r:{},r=t,t=null),r&&!d(r))throw new Error('Handler must be a function; "'+b(r)+'" given!');var s;if(s=I.getFirebase(e,!1,n.namespace))return s.removeMatches({filter:t,originalHandler:r,params:n})},J=function(e,t,r,n=null,s={}){var i;if(G(r,null,null,{...s,tags:[K,t,e]}),u(n)&&(i=I.getFirebase(e,!1,s.namespace))){var a=B({name:t,type:"del",oldValue:r,related:[t]},n);i.fire(a,s.cancellable)}},L=function(e,t,r={}){if(!e||!o(e))throw new Error("Target must be of type object!");e=M(e);var n,s=function(r){return arguments.length?r:t in e};return(n=S.getFirebase(e,!1,r.namespace))?n.fire({type:"has",name:t},s):s()},R=function(e,t,r,i=null,a={}){if(!t||!o(t))throw new Error("Target must be of type object!");u(r)&&(a=i||{},i=null),t=M(t);var f=S.getFirebase(t,!1,a.namespace),p=I.getFirebase(t,!1,a.namespace);const d=(r,n,s,i)=>{var u,l="set";e&&(l="def",n=(u=n||{}).value);var c,d=!1;L(t,r,a)&&(d=!0,c=W(t,r,a));var b={name:r,type:l,value:n,related:s,detail:i,isUpdate:d,oldValue:c},g=function(e){if(arguments.length&&(u?u=e:n=e),u){if(h(t,"accessorizedProps",!1).has(r)&&!h(t,"accessorizedProps").get(r).restore())return!1;Object.defineProperty(t,r,u)}else if(h(t,"accessorizedProps",!1).has(r))return h(t,"accessorizedProps").get(r).write(n);return t[r]=n,!0};if(f){var m=u?{type:"def",name:r,descriptor:u,related:s,detail:i,isUpdate:d,oldValue:c}:{type:"set",name:r,value:n,related:s,detail:i,isUpdate:d,oldValue:c};b.success=f.fire(m,g)}else b.success=g();return b.success&&b.value!==b.oldValue&&(o(b.oldValue)&&J(t,r,b.oldValue,null,a),o(b.value)&&(U(t,r,b.value,null,a),p&&(p.subBuild||p.build&&$(b.value))&&Q(b.value,p.subBuild,p.build,a.namespace))),b};var b,g=[];n(r)||(s(r)||c(r))&&(b=l(r))?g=b.map(e=>d(e,i,b,a.detail)):u(r)&&(b=Object.keys(r))&&(g=b.map(e=>d(e,r[e],b,a.detail)));var m,v=g.filter(e=>e.success);return p?(m=p.fire(v,a.cancellable)).successCount=v.length:a.responseObject&&(m=new V(t)),a.responseObject?m:v.length>0},X=function(e,t,r=null,n={}){return R(!1,...arguments)},Y=function(e,t,r={}){if(!e||!o(e))throw new Error("Target must be of type object!");e=M(e);var n,s,i=l(t),a=i.map(t=>{var n;L(e,t,r)&&(n=W(e,t,r));var s,a={name:t,type:"del",related:i,detail:r.detail,oldValue:n},u=function(r){return arguments.length?r:!(h(e,"accessorizedProps",!1).has(t)&&!h(e,"accessorizedProps").get(t).restore())&&(delete e[t],!0)};return(s=S.getFirebase(e,!1,r.namespace))?a.success=s.fire({type:"del",name:t,oldValue:n,related:i},u):a.success=u(),a.success&&o(a.oldValue)&&J(e,t,a.oldValue,null,r),a}).filter(e=>e.success);return(n=I.getFirebase(e,!1,r.namespace))?(s=n.fire(a,r.cancellable)).successCount=a.length:r.responseObject&&(s=new V(e)),r.responseObject?s:a.length>0},Z=function(e,t,r=null,n={}){return R(!0,...arguments)},ee=function(e,t={}){return T(!0,...arguments)},te=function(e,t=[],r=!0){var s=0;return E(arguments[0])&&o(arguments[1])&&(s=arguments[0],e=arguments[1],t=arguments[2]||[]),q([s,{},e],(e,r,s)=>d(t)?t(e):!n(t)||!t.length||t.indexOf(e)>-1,!1,!1,r)};var re={set:X,get:W,has:L,deleteProperty:Y,del:Y,defineProperty:Z,def:Z,keys:C,ownKeys:ee,accessorize:function(e,t=[],r={}){r=u(t)?t:r;var s=(1===arguments.length?Object.keys(e):l(t)).map(t=>{if(h(e,"accessorizedProps").has(t)&&h(e,"accessorizedProps").get(t).touch(!0))return!1;var n=Object.getOwnPropertyDescriptor(e,t)||{enumerable:!(t in e),configurable:!1!==r.configurable};"value"in n&&delete n.value,"writable"in n&&delete n.writable,n.get=()=>W(e,t,r),n.set=n=>X(e,t,n,r);try{const r=e[t];return Object.defineProperty(e,t,n),h(e,"accessorizedProps").set(t,{value:r,read:function(){return this.value},write:function(e){return this.value=e,!0},restore:function(){try{return this.intact()&&(delete e[t],e[t]=this.value,h(e,"accessorizedProps").delete(t)),!0}catch(e){}return!1},intact:function(){return(Object.getOwnPropertyDescriptor(e,t)||{}).get===n.get},touch:function(e=!1){return this.intact()||!!e&&!this.restore()}}),!0}catch(e){}return!1});return n(t)?s:s[0]},unaccessorize:function(e,t=[],r={}){r=u(t)?t:r;var s=(1===arguments.length?Object.keys(e):l(t)).map(t=>!h(e,"accessorizedProps",!1).has(t)||h(e,"accessorizedProps").get(t).restore());return n(t)?s:s[0]},proxy:function(e,t={}){if(!o(e))throw new Error('Object must be of type subject; "'+b(e)+'" given!');var r=new Proxy(e,{get:(e,n)=>{var s=W(e,n,t);return!1!==t.proxyAutoBinding&&d(s)&&!function(e){return a(e)&&/^class\s?/.test(Function.prototype.toString.call(e))}(s)?s.bind(r):s},set:(...e)=>(X(...e.concat(t)),!0),has:(...e)=>L(...e.concat(t)),deleteProperty:(...e)=>(Y(...e.concat(t)),!0),defineProperty:(...e)=>(Z(...e.concat(t)),!0),ownKeys:(...e)=>ee(...e.concat(t))});return h(r).set(r,e),r},unproxy:M,build:Q,link:U,unlink:J,observe:N,unobserve:G,intercept:function(e,t,r,n={}){if(!o(e))throw new Error('Object must be of type subject; "'+b(r)+'" given!');if(d(t)&&(n=arguments.length>2?r:{},r=t,t=null),!d(r))throw new Error('Callback must be a function; "'+b(r)+'" given!');var s,i=S.getFirebase(e,!0,n.namespace),a={filter:t,handler:r,params:n};if(a.params.unique&&(s=i.match(a)).length){if("replace"!==a.params.unique)return s[0];i.remove(s[0])}return i.add(a)},unintercept:function(e,t,r=null,n={}){if(!e||!o(e))throw new Error('Object must be of type subject; "'+b(e)+'" given!');if(d(t)&&(n=arguments.length>2?r:{},r=t,t=null),r&&!d(r))throw new Error('Handler must be a function; "'+b(r)+'" given!');var s;if(s=S.getFirebase(e,!1,n.namespace))return s.removeMatches({filter:t,originalHandler:r,params:n})},closure:function(e,...t){var r=t.map(e=>{if(!o(e))throw new Error("Target must be of type object!");return{subject:e,subjectCopy:n(e)?e.slice(0):te(e)}}),s=e(...t);const i=()=>{r.map(e=>{var t,r,n=Object.keys(e.subjectCopy),s=Object.keys(e.subject),i=[],a=(t=n.concat(s),t.filter((e,t,r)=>r.indexOf(e)===t)).map(t=>{if(e.subjectCopy[t]!==e.subject[t]){i.push(t);var r={name:t,related:i,buffered:!0};return s.includes(t)?(r.type="set",r.value=e.subject[t],n.includes(t)&&(r.isUpdate=!0)):r.type="del",n.includes(t)&&(r.oldValue=e.subjectCopy[t]),o(e.subjectCopy[t])&&J(e.subject,t,e.subjectCopy[t]),o(e.subject[t])&&U(e.subject,t,e.subject[t]),r}}).filter(e=>e);if(a.length&&(r=I.getFirebase(e.subject,!1)))return r.fire(a)})};return s instanceof Promise?s.then(i):i(),s},Observers:I,Interceptors:S};window.WebQit||(window.WebQit={}),window.WebQit.Observer=re}]);
>>>>>>> 61da1201f3c0964bfa06d65c69f2e564f3ef6e38
//# sourceMappingURL=main.js.map