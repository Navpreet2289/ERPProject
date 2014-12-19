/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;
(function (d) {
    var k = d.scrollTo = function (a, i, e) {
        d(window).scrollTo(a, i, e)
    };
    k.defaults = {axis: 'xy', duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1};
    k.window = function (a) {
        return d(window)._scrollable()
    };
    d.fn._scrollable = function () {
        return this.map(function () {
            var a = this, i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
            if (!i)return a;
            var e = (a.contentWindow || a).document || a.ownerDocument || a;
            return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement
        })
    };
    d.fn.scrollTo = function (n, j, b) {
        if (typeof j == 'object') {
            b = j;
            j = 0
        }
        if (typeof b == 'function')b = {onAfter: b};
        if (n == 'max')n = 9e9;
        b = d.extend({}, k.defaults, b);
        j = j || b.speed || b.duration;
        b.queue = b.queue && b.axis.length > 1;
        if (b.queue)j /= 2;
        b.offset = p(b.offset);
        b.over = p(b.over);
        return this._scrollable().each(function () {
            var q = this, r = d(q), f = n, s, g = {}, u = r.is('html,body');
            switch (typeof f) {
                case'number':
                case'string':
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) {
                        f = p(f);
                        break
                    }
                    f = d(f, this);
                case'object':
                    if (f.is || f.style)s = (f = d(f)).offset()
            }
            d.each(b.axis.split(''), function (a, i) {
                var e = i == 'x' ? 'Left' : 'Top', h = e.toLowerCase(), c = 'scroll' + e, l = q[c], m = k.max(q, i);
                if (s) {
                    g[c] = s[h] + (u ? 0 : l - r.offset()[h]);
                    if (b.margin) {
                        g[c] -= parseInt(f.css('margin' + e)) || 0;
                        g[c] -= parseInt(f.css('border' + e + 'Width')) || 0
                    }
                    g[c] += b.offset[h] || 0;
                    if (b.over[h])g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h]
                } else {
                    var o = f[h];
                    g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o
                }
                if (/^\d+$/.test(g[c]))g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m);
                if (!a && b.queue) {
                    if (l != g[c])t(b.onAfterFirst);
                    delete g[c]
                }
            });
            t(b.onAfter);
            function t(a) {
                r.animate(g, j, b.easing, a && function () {
                    a.call(this, n, b)
                })
            }
        }).end()
    };
    k.max = function (a, i) {
        var e = i == 'x' ? 'Width' : 'Height', h = 'scroll' + e;
        if (!d(a).is('html,body'))return a[h] - d(a)[e.toLowerCase()]();
        var c = 'client' + e, l = a.ownerDocument.documentElement, m = a.ownerDocument.body;
        return Math.max(l[h], m[h]) - Math.min(l[c], m[c])
    };
    function p(a) {
        return typeof a == 'object' ? a : {top: a, left: a}
    }
})(jQuery);

/**
 // Monkey patch jQuery 1.3.1+ css() method to support CSS 'transform'
 // property uniformly across Safari/Chrome/Webkit, Firefox 3.5+, IE 9+, and Opera 11+.
 // 2009-2011 Zachary Johnson www.zachstronaut.com
 // Updated 2011.05.04 (May the fourth be with you!)
 */
(function (c) {
    var b = null, f = c.fn.css;
    c.fn.css = function (a, g) {
        null === b && (b = "undefined" != typeof c.cssProps ? c.cssProps : "undefined" != typeof c.props ? c.props : {});
        if ("undefined" == typeof b.transform && ("transform" == a || "object" == typeof a && "undefined" != typeof a.transform)) {
            var h = b, d;
            a:{
                d = this.get(0);
                for (var i = ["transform", "WebkitTransform", "msTransform", "MozTransform", "OTransform"], e; e = i.shift();)if ("undefined" != typeof d.style[e]) {
                    d = e;
                    break a
                }
                d = "transform"
            }
            h.transform = d
        }
        if ("transform" != b.transform)if ("transform" == a) {
            if (a = b.transform, "undefined" == typeof g && jQuery.style)return jQuery.style(this.get(0), a)
        } else"object" == typeof a && "undefined" != typeof a.transform && (a[b.transform] = a.transform, delete a.transform);
        return f.apply(this, arguments)
    }
})(jQuery);

/**
 * Isotope v1.5.05
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2011 David DeSandro / Metafizzy
 */
/*jshint curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, undef: true */
/*global Modernizr: true, jQuery: true */
(function (a, b, c) {
    "use strict";
    var d = function (a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }, e = "Moz Webkit Khtml O Ms".split(" "), f = function (a) {
        var b = document.documentElement.style, c;
        if (typeof b[a] == "string")return a;
        a = d(a);
        for (var f = 0, g = e.length; f < g; f++) {
            c = e[f] + a;
            if (typeof b[c] == "string")return c
        }
    }, g = f("transform"), h = f("transitionProperty"), i = {csstransforms: function () {
        return!!g
    }, csstransforms3d: function () {
        var a = !!f("perspective");
        if (a) {
            var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "), d = "@media (" + c.join("transform-3d),(") + "modernizr)", e = b("<style>" + d + "{#modernizr{height:3px}}" + "</style>").appendTo("head"), g = b('<div id="modernizr" />').appendTo("html");
            a = g.height() === 3, g.remove(), e.remove()
        }
        return a
    }, csstransitions: function () {
        return!!h
    }};
    if (a.Modernizr)for (var j in i)Modernizr.hasOwnProperty(j) || Modernizr.addTest(j, i[j]); else a.Modernizr = function () {
        var a = {_version: "1.6ish: miniModernizr for Isotope"}, c = " ", d, e;
        for (e in i)d = i[e](), a[e] = d, c += " " + (d ? "" : "no-") + e;
        b("html").addClass(c);
        return a
    }();
    if (Modernizr.csstransforms) {
        var k = Modernizr.csstransforms3d ? {translate: function (a) {
            return"translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
        }, scale: function (a) {
            return"scale3d(" + a + ", " + a + ", 1) "
        }} : {translate: function (a) {
            return"translate(" + a[0] + "px, " + a[1] + "px) "
        }, scale: function (a) {
            return"scale(" + a + ") "
        }}, l = function (a, c, d) {
            var e = b.data(a, "isoTransform") || {}, f = {}, h, i = {}, j;
            f[c] = d, b.extend(e, f);
            for (h in e)j = e[h], i[h] = k[h](j);
            var l = i.translate || "", m = i.scale || "", n = l + m;
            b.data(a, "isoTransform", e), a.style[g] = n
        };
        b.cssNumber.scale = !0, b.cssHooks.scale = {set: function (a, b) {
            l(a, "scale", b)
        }, get: function (a, c) {
            var d = b.data(a, "isoTransform");
            return d && d.scale ? d.scale : 1
        }}, b.fx.step.scale = function (a) {
            b.cssHooks.scale.set(a.elem, a.now + a.unit)
        }, b.cssNumber.translate = !0, b.cssHooks.translate = {set: function (a, b) {
            l(a, "translate", b)
        }, get: function (a, c) {
            var d = b.data(a, "isoTransform");
            return d && d.translate ? d.translate : [0, 0]
        }}
    }
    var m, n;
    Modernizr.csstransitions && (m = {WebkitTransitionProperty: "webkitTransitionEnd", MozTransitionProperty: "transitionend", OTransitionProperty: "oTransitionEnd", transitionProperty: "transitionEnd"}[h], n = f("transitionDuration"));
    var o = b.event, p;
    o.special.smartresize = {setup: function () {
        b(this).bind("resize", o.special.smartresize.handler)
    }, teardown: function () {
        b(this).unbind("resize", o.special.smartresize.handler)
    }, handler: function (a, b) {
        var c = this, d = arguments;
        a.type = "smartresize", p && clearTimeout(p), p = setTimeout(function () {
            jQuery.event.handle.apply(c, d)
        }, b === "execAsap" ? 0 : 100)
    }}, b.fn.smartresize = function (a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"])
    }, b.Isotope = function (a, c, d) {
        this.element = b(c), this._create(a), this._init(d)
    };
    var q = ["overflow", "position", "width", "height"];
    b.Isotope.settings = {resizable: !0, layoutMode: "masonry", containerClass: "isotope", itemClass: "isotope-item", hiddenClass: "isotope-hidden", hiddenStyle: {opacity: 0, scale: .001}, visibleStyle: {opacity: 1, scale: 1}, animationEngine: "best-available", animationOptions: {queue: !1, duration: 800}, sortBy: "original-order", sortAscending: !0, resizesContainer: !0, transformsEnabled: !b.browser.opera, itemPositionDataEnabled: !1}, b.Isotope.prototype = {_create: function (c) {
        this.options = b.extend({}, b.Isotope.settings, c), this.styleQueue = [], this.elemCount = 0;
        var d = this.element[0].style;
        this.originalStyle = {};
        for (var e = 0, f = q.length; e < f; e++) {
            var g = q[e];
            this.originalStyle[g] = d[g] || ""
        }
        this.element.css({overflow: "visible", position: "relative"}), this._updateAnimationEngine(), this._updateUsingTransforms();
        var h = {"original-order": function (a, b) {
            b.elemCount++;
            return b.elemCount
        }, random: function () {
            return Math.random()
        }};
        this.options.getSortData = b.extend(this.options.getSortData, h), this.reloadItems();
        var i = b(document.createElement("div")).prependTo(this.element);
        this.offset = i.position(), i.remove();
        var j = this;
        setTimeout(function () {
            j.element.addClass(j.options.containerClass)
        }, 0), this.options.resizable && b(a).bind("smartresize.isotope", function () {
            j.resize()
        }), this.element.delegate("." + this.options.hiddenClass, "click", function () {
            return!1
        })
    }, _getAtoms: function (a) {
        var b = this.options.itemSelector, c = b ? a.filter(b).add(a.find(b)) : a, d = {position: "absolute"};
        this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(this.options.itemClass), this.updateSortData(c, !0);
        return c
    }, _init: function (a) {
        this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(), this.reLayout(a)
    }, option: function (a) {
        if (b.isPlainObject(a)) {
            this.options = b.extend(!0, this.options, a);
            var c;
            for (var e in a)c = "_update" + d(e), this[c] && this[c]()
        }
    }, _updateAnimationEngine: function () {
        var a = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, "");
        switch (a) {
            case"css":
            case"none":
                this.isUsingJQueryAnimation = !1;
                break;
            case"jquery":
                this.isUsingJQueryAnimation = !0;
                break;
            default:
                this.isUsingJQueryAnimation = !Modernizr.csstransitions
        }
        this._updateUsingTransforms()
    }, _updateTransformsEnabled: function () {
        this._updateUsingTransforms()
    }, _updateUsingTransforms: function () {
        var a = this.usingTransforms = this.options.transformsEnabled && Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;
        a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), this.getPositionStyles = a ? this._translate : this._positionAbs
    }, _filter: function (a) {
        var b = this.options.filter === "" ? "*" : this.options.filter;
        if (!b)return a;
        var c = this.options.hiddenClass, d = "." + c, e = a.filter(d), f = e;
        if (b !== "*") {
            f = e.filter(b);
            var g = a.not(d).not(b).addClass(c);
            this.styleQueue.push({$el: g, style: this.options.hiddenStyle})
        }
        this.styleQueue.push({$el: f, style: this.options.visibleStyle}), f.removeClass(c);
        return a.filter(b)
    }, updateSortData: function (a, c) {
        var d = this, e = this.options.getSortData, f, g;
        a.each(function () {
            f = b(this), g = {};
            for (var a in e)!c && a === "original-order" ? g[a] = b.data(this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
            b.data(this, "isotope-sort-data", g)
        })
    }, _sort: function () {
        var a = this.options.sortBy, b = this._getSorter, c = this.options.sortAscending ? 1 : -1, d = function (d, e) {
            var f = b(d, a), g = b(e, a);
            f === g && a !== "original-order" && (f = b(d, "original-order"), g = b(e, "original-order"));
            return(f > g ? 1 : f < g ? -1 : 0) * c
        };
        this.$filteredAtoms.sort(d)
    }, _getSorter: function (a, c) {
        return b.data(a, "isotope-sort-data")[c]
    }, _translate: function (a, b) {
        return{translate: [a, b]}
    }, _positionAbs: function (a, b) {
        return{left: a, top: b}
    }, _pushPosition: function (a, b, c) {
        b += this.offset.left, c += this.offset.top;
        var d = this.getPositionStyles(b, c);
        this.styleQueue.push({$el: a, style: d}), this.options.itemPositionDataEnabled && a.data("isotope-item-position", {x: b, y: c})
    }, layout: function (a, b) {
        var c = this.options.layoutMode;
        this["_" + c + "Layout"](a);
        if (this.options.resizesContainer) {
            var d = this["_" + c + "GetContainerSize"]();
            this.styleQueue.push({$el: this.element, style: d})
        }
        this._processStyleQueue(a, b), this.isLaidOut = !0
    }, _processStyleQueue: function (a, c) {
        var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css", e = this.options.animationOptions, f, g, h, i;
        g = function (a, b) {
            b.$el[d](b.style, e)
        };
        if (this._isInserting && this.isUsingJQueryAnimation)g = function (a, b) {
            f = b.$el.hasClass("no-transition") ? "css" : d, b.$el[f](b.style, e)
        }; else if (c) {
            var j = !1, k = this;
            h = !0, i = function () {
                j || (c.call(k.element, a), j = !0)
            };
            if (this.isUsingJQueryAnimation && d === "animate")e.complete = i, h = !1; else if (Modernizr.csstransitions) {
                var l = 0, o = this.styleQueue[0].$el, p;
                while (!o.length) {
                    p = this.styleQueue[l++];
                    if (!p)return;
                    o = p.$el
                }
                var q = parseFloat(getComputedStyle(o[0])[n]);
                q > 0 && (g = function (a, b) {
                    b.$el[d](b.style, e).one(m, i)
                }, h = !1)
            }
        }
        b.each(this.styleQueue, g), h && i(), this.styleQueue = []
    }, resize: function () {
        this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout()
    }, reLayout: function (a) {
        this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, a)
    }, addItems: function (a, b) {
        var c = this._getAtoms(a);
        this.$allAtoms = this.$allAtoms.add(c), b && b(c)
    }, insert: function (a, b) {
        this.element.append(a);
        var c = this;
        this.addItems(a, function (a) {
            var d = c._filter(a);
            c._addHideAppended(d), c._sort(), c.reLayout(), c._revealAppended(d, b)
        })
    }, appended: function (a, b) {
        var c = this;
        this.addItems(a, function (a) {
            c._addHideAppended(a), c.layout(a), c._revealAppended(a, b)
        })
    }, _addHideAppended: function (a) {
        this.$filteredAtoms = this.$filteredAtoms.add(a), a.addClass("no-transition"), this._isInserting = !0, this.styleQueue.push({$el: a, style: this.options.hiddenStyle})
    }, _revealAppended: function (a, b) {
        var c = this;
        setTimeout(function () {
            a.removeClass("no-transition"), c.styleQueue.push({$el: a, style: c.options.visibleStyle}), c._isInserting = !1, c._processStyleQueue(a, b)
        }, 10)
    }, reloadItems: function () {
        this.$allAtoms = this._getAtoms(this.element.children())
    }, remove: function (a) {
        var b = this, c = function () {
            b.$allAtoms = b.$allAtoms.not(a), a.remove()
        };
        a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({$el: a, style: this.options.hiddenStyle}), this.$filteredAtoms = this.$filteredAtoms.not(a), this._sort(), this.reLayout(c)) : c()
    }, shuffle: function (a) {
        this.updateSortData(this.$allAtoms), this.options.sortBy = "random", this._sort(), this.reLayout(a)
    }, destroy: function () {
        var c = this.usingTransforms;
        this.$allAtoms.removeClass(this.options.hiddenClass + " " + this.options.itemClass).each(function () {
            this.style.position = "", this.style.top = "", this.style.left = "", this.style.opacity = "", c && (this.style[g] = "")
        });
        var d = this.element[0].style;
        for (var e = 0, f = q.length; e < f; e++) {
            var h = q[e];
            d[h] = this.originalStyle[h]
        }
        this.element.unbind(".isotope").undelegate("." + this.options.hiddenClass, "click").removeClass(this.options.containerClass).removeData("isotope"), b(a).unbind(".isotope")
    }, _getSegments: function (a) {
        var b = this.options.layoutMode, c = a ? "rowHeight" : "columnWidth", e = a ? "height" : "width", f = a ? "rows" : "cols", g = this.element[e](), h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + d(e)](!0) || g;
        h = Math.floor(g / i), h = Math.max(h, 1), this[b][f] = h, this[b][c] = i
    }, _checkIfSegmentsChanged: function (a) {
        var b = this.options.layoutMode, c = a ? "rows" : "cols", d = this[b][c];
        this._getSegments(a);
        return this[b][c] !== d
    }, _masonryReset: function () {
        this.masonry = {}, this._getSegments();
        var a = this.masonry.cols;
        this.masonry.colYs = [];
        while (a--)this.masonry.colYs.push(0)
    }, _masonryLayout: function (a) {
        var c = this, d = c.masonry;
        a.each(function () {
            var a = b(this), e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
            e = Math.min(e, d.cols);
            if (e === 1)c._masonryPlaceBrick(a, d.colYs); else {
                var f = d.cols + 1 - e, g = [], h, i;
                for (i = 0; i < f; i++)h = d.colYs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                c._masonryPlaceBrick(a, g)
            }
        })
    }, _masonryPlaceBrick: function (a, b) {
        var c = Math.min.apply(Math, b), d = 0;
        for (var e = 0, f = b.length; e < f; e++)if (b[e] === c) {
            d = e;
            break
        }
        var g = this.masonry.columnWidth * d, h = c;
        this._pushPosition(a, g, h);
        var i = c + a.outerHeight(!0), j = this.masonry.cols + 1 - f;
        for (e = 0; e < j; e++)this.masonry.colYs[d + e] = i
    }, _masonryGetContainerSize: function () {
        var a = Math.max.apply(Math, this.masonry.colYs);
        return{height: a}
    }, _masonryResizeChanged: function () {
        return this._checkIfSegmentsChanged()
    }, _fitRowsReset: function () {
        this.fitRows = {x: 0, y: 0, height: 0}
    }, _fitRowsLayout: function (a) {
        var c = this, d = this.element.width(), e = this.fitRows;
        a.each(function () {
            var a = b(this), f = a.outerWidth(!0), g = a.outerHeight(!0);
            e.x !== 0 && f + e.x > d && (e.x = 0, e.y = e.height), c._pushPosition(a, e.x, e.y), e.height = Math.max(e.y + g, e.height), e.x += f
        })
    }, _fitRowsGetContainerSize: function () {
        return{height: this.fitRows.height}
    }, _fitRowsResizeChanged: function () {
        return!0
    }, _cellsByRowReset: function () {
        this.cellsByRow = {index: 0}, this._getSegments(), this._getSegments(!0)
    }, _cellsByRowLayout: function (a) {
        var c = this, d = this.cellsByRow;
        a.each(function () {
            var a = b(this), e = d.index % d.cols, f = Math.floor(d.index / d.cols), g = Math.round((e + .5) * d.columnWidth - a.outerWidth(!0) / 2), h = Math.round((f + .5) * d.rowHeight - a.outerHeight(!0) / 2);
            c._pushPosition(a, g, h), d.index++
        })
    }, _cellsByRowGetContainerSize: function () {
        return{height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top}
    }, _cellsByRowResizeChanged: function () {
        return this._checkIfSegmentsChanged()
    }, _straightDownReset: function () {
        this.straightDown = {y: 0}
    }, _straightDownLayout: function (a) {
        var c = this;
        a.each(function (a) {
            var d = b(this);
            c._pushPosition(d, 0, c.straightDown.y), c.straightDown.y += d.outerHeight(!0)
        })
    }, _straightDownGetContainerSize: function () {
        return{height: this.straightDown.y}
    }, _straightDownResizeChanged: function () {
        return!0
    }, _masonryHorizontalReset: function () {
        this.masonryHorizontal = {}, this._getSegments(!0);
        var a = this.masonryHorizontal.rows;
        this.masonryHorizontal.rowXs = [];
        while (a--)this.masonryHorizontal.rowXs.push(0)
    }, _masonryHorizontalLayout: function (a) {
        var c = this, d = c.masonryHorizontal;
        a.each(function () {
            var a = b(this), e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
            e = Math.min(e, d.rows);
            if (e === 1)c._masonryHorizontalPlaceBrick(a, d.rowXs); else {
                var f = d.rows + 1 - e, g = [], h, i;
                for (i = 0; i < f; i++)h = d.rowXs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                c._masonryHorizontalPlaceBrick(a, g)
            }
        })
    }, _masonryHorizontalPlaceBrick: function (a, b) {
        var c = Math.min.apply(Math, b), d = 0;
        for (var e = 0, f = b.length; e < f; e++)if (b[e] === c) {
            d = e;
            break
        }
        var g = c, h = this.masonryHorizontal.rowHeight * d;
        this._pushPosition(a, g, h);
        var i = c + a.outerWidth(!0), j = this.masonryHorizontal.rows + 1 - f;
        for (e = 0; e < j; e++)this.masonryHorizontal.rowXs[d + e] = i
    }, _masonryHorizontalGetContainerSize: function () {
        var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
        return{width: a}
    }, _masonryHorizontalResizeChanged: function () {
        return this._checkIfSegmentsChanged(!0)
    }, _fitColumnsReset: function () {
        this.fitColumns = {x: 0, y: 0, width: 0}
    }, _fitColumnsLayout: function (a) {
        var c = this, d = this.element.height(), e = this.fitColumns;
        a.each(function () {
            var a = b(this), f = a.outerWidth(!0), g = a.outerHeight(!0);
            e.y !== 0 && g + e.y > d && (e.x = e.width, e.y = 0), c._pushPosition(a, e.x, e.y), e.width = Math.max(e.x + f, e.width), e.y += g
        })
    }, _fitColumnsGetContainerSize: function () {
        return{width: this.fitColumns.width}
    }, _fitColumnsResizeChanged: function () {
        return!0
    }, _cellsByColumnReset: function () {
        this.cellsByColumn = {index: 0}, this._getSegments(), this._getSegments(!0)
    }, _cellsByColumnLayout: function (a) {
        var c = this, d = this.cellsByColumn;
        a.each(function () {
            var a = b(this), e = Math.floor(d.index / d.rows), f = d.index % d.rows, g = Math.round((e + .5) * d.columnWidth - a.outerWidth(!0) / 2), h = Math.round((f + .5) * d.rowHeight - a.outerHeight(!0) / 2);
            c._pushPosition(a, g, h), d.index++
        })
    }, _cellsByColumnGetContainerSize: function () {
        return{width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth}
    }, _cellsByColumnResizeChanged: function () {
        return this._checkIfSegmentsChanged(!0)
    }, _straightAcrossReset: function () {
        this.straightAcross = {x: 0}
    }, _straightAcrossLayout: function (a) {
        var c = this;
        a.each(function (a) {
            var d = b(this);
            c._pushPosition(d, c.straightAcross.x, 0), c.straightAcross.x += d.outerWidth(!0)
        })
    }, _straightAcrossGetContainerSize: function () {
        return{width: this.straightAcross.x}
    }, _straightAcrossResizeChanged: function () {
        return!0
    }}, b.fn.imagesLoaded = function (a) {
        function h(a) {
            --e <= 0 && a.target.src !== f && (setTimeout(g), d.unbind("load error", h))
        }

        function g() {
            a.call(b, d)
        }

        var b = this, d = b.find("img").add(b.filter("img")), e = d.length, f = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        e || g(), d.bind("load error", h).each(function () {
            if (this.complete || this.complete === c) {
                var a = this.src;
                this.src = f, this.src = a
            }
        });
        return b
    };
    var r = function (b) {
        a.console && a.console.error(b)
    };
    b.fn.isotope = function (a, c) {
        if (typeof a == "string") {
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var c = b.data(this, "isotope");
                if (!c)r("cannot call methods on isotope prior to initialization; attempted to call method '" + a + "'"); else {
                    if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                        r("no such method '" + a + "' for isotope instance");
                        return
                    }
                    c[a].apply(c, d)
                }
            })
        } else this.each(function () {
            var d = b.data(this, "isotope");
            d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(a, this, c))
        });
        return this
    }
})(window, jQuery);
