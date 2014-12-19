﻿/**
 * jQuery.query - Query String Modification and Creation for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/8/13
 *
 * @author Blair Mitchelmore
 * @version 2.1.7
 *
 **/
new function (e) {
    var d = e.separator || "&";
    var c = e.spaces === false ? false : true;
    var a = e.suffix === false ? "" : "[]";
    var g = e.prefix === false ? false : true;
    var b = g ? e.hash === true ? "#" : "?" : "";
    var f = e.numbers === false ? false : true;
    jQuery.query = new function () {
        var h = function (m, l) {
            return m != undefined && m !== null && (!!l ? m.constructor == l : true)
        };
        var i = function (r) {
            var l, q = /\[([^[]*)\]/g, n = /^([^[]+)(\[.*\])?$/.exec(r), o = n[1], p = [];
            while (l = q.exec(n[2])) {
                p.push(l[1])
            }
            return[o, p]
        };
        var k = function (s, r, q) {
            var t, p = r.shift();
            if (typeof s != "object") {
                s = null
            }
            if (p === "") {
                if (!s) {
                    s = []
                }
                if (h(s, Array)) {
                    s.push(r.length == 0 ? q : k(null, r.slice(0), q))
                } else {
                    if (h(s, Object)) {
                        var n = 0;
                        while (s[n++] != null) {
                        }
                        s[--n] = r.length == 0 ? q : k(s[n], r.slice(0), q)
                    } else {
                        s = [];
                        s.push(r.length == 0 ? q : k(null, r.slice(0), q))
                    }
                }
            } else {
                if (p && p.match(/^\s*[0-9]+\s*$/)) {
                    var m = parseInt(p, 10);
                    if (!s) {
                        s = []
                    }
                    s[m] = r.length == 0 ? q : k(s[m], r.slice(0), q)
                } else {
                    if (p) {
                        var m = p.replace(/^\s*|\s*$/g, "");
                        if (!s) {
                            s = {}
                        }
                        if (h(s, Array)) {
                            var l = {};
                            for (var n = 0; n < s.length; ++n) {
                                l[n] = s[n]
                            }
                            s = l
                        }
                        s[m] = r.length == 0 ? q : k(s[m], r.slice(0), q)
                    } else {
                        return q
                    }
                }
            }
            return s
        };
        var j = function (l) {
            var m = this;
            m.keys = {};
            if (l.queryObject) {
                jQuery.each(l.get(), function (n, o) {
                    m.SET(n, o)
                })
            } else {
                jQuery.each(arguments, function () {
                    var n = "" + this;
                    n = n.replace(/^[?#]/, "");
                    n = n.replace(/[;&]$/, "");
                    if (c) {
                        n = n.replace(/[+]/g, " ")
                    }
                    jQuery.each(n.split(/[&;]/), function () {
                        var o = decodeURIComponent(this.split("=")[0] || "");
                        var p = decodeURIComponent(this.split("=")[1] || "");
                        if (!o) {
                            return
                        }
                        if (f) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(p)) {
                                p = parseFloat(p)
                            } else {
                                if (/^[+-]?[0-9]+$/.test(p)) {
                                    p = parseInt(p, 10)
                                }
                            }
                        }
                        p = (!p && p !== 0) ? true : p;
                        if (p !== false && p !== true && typeof p != "number") {
                            p = p
                        }
                        m.SET(o, p)
                    })
                })
            }
            return m
        };
        j.prototype = {queryObject: true, has: function (l, m) {
            var n = this.get(l);
            return h(n, m)
        }, GET: function (m) {
            if (!h(m)) {
                return this.keys
            }
            var l = i(m), n = l[0], p = l[1];
            var o = this.keys[n];
            while (o != null && p.length != 0) {
                o = o[p.shift()]
            }
            return typeof o == "number" ? o : o || ""
        }, get: function (l) {
            var m = this.GET(l);
            if (h(m, Object)) {
                return jQuery.extend(true, {}, m)
            } else {
                if (h(m, Array)) {
                    return m.slice(0)
                }
            }
            return m
        }, SET: function (m, r) {
            var o = !h(r) ? null : r;
            var l = i(m), n = l[0], q = l[1];
            var p = this.keys[n];
            this.keys[n] = k(p, q.slice(0), o);
            return this
        }, set: function (l, m) {
            return this.copy().SET(l, m)
        }, REMOVE: function (l) {
            return this.SET(l, null).COMPACT()
        }, remove: function (l) {
            return this.copy().REMOVE(l)
        }, EMPTY: function () {
            var l = this;
            jQuery.each(l.keys, function (m, n) {
                delete l.keys[m]
            });
            return l
        }, load: function (l) {
            var n = l.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
            var m = l.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
            return new j(l.length == m.length ? "" : m, l.length == n.length ? "" : n)
        }, empty: function () {
            return this.copy().EMPTY()
        }, copy: function () {
            return new j(this)
        }, COMPACT: function () {
            function l(o) {
                var n = typeof o == "object" ? h(o, Array) ? [] : {} : o;
                if (typeof o == "object") {
                    function m(r, p, q) {
                        if (h(r, Array)) {
                            r.push(q)
                        } else {
                            r[p] = q
                        }
                    }

                    jQuery.each(o, function (p, q) {
                        if (!h(q)) {
                            return true
                        }
                        m(n, p, l(q))
                    })
                }
                return n
            }

            this.keys = l(this.keys);
            return this
        }, compact: function () {
            return this.copy().COMPACT()
        }, toString: function () {
            var n = 0, r = [], q = [], m = this;
            var o = function (s) {
                s = s + "";
                if (c) {
                    s = s.replace(/ /g, "+")
                }
                return encodeURIComponent(s)
            };
            var l = function (s, t, u) {
                if (!h(u) || u === false) {
                    return
                }
                var v = [o(t)];
                if (u !== true) {
                    v.push("=");
                    v.push(o(u))
                }
                s.push(v.join(""))
            };
            var p = function (t, s) {
                var u = function (v) {
                    return !s || s == "" ? [v].join("") : [s, "[", v, "]"].join("")
                };
                jQuery.each(t, function (v, w) {
                    if (typeof w == "object") {
                        p(w, u(v))
                    } else {
                        l(q, u(v), w)
                    }
                })
            };
            p(this.keys);
            if (q.length > 0) {
                r.push(b)
            }
            r.push(q.join(d));
            return r.join("")
        }};
        return new j(location.search, location.hash)
    }
}(jQuery.query || {});
