/*!
 jQuery ColorBox v1.4.3 - 2013-02-18
 (c) 2013 Jack Moore - jacklmoore.com/colorbox
 license: http://www.opensource.org/licenses/mit-license.php
 */
(function (L, l, Y) {
    var M = {transition: "elastic", speed: 300, width: false, initialWidth: "600", innerWidth: false, maxWidth: false, height: false, initialHeight: "450", innerHeight: false, maxHeight: false, scalePhotos: true, scrolling: true, inline: false, html: false, iframe: false, fastIframe: true, photo: false, href: false, title: false, rel: false, opacity: 0.9, preloading: true, className: false, retinaImage: false, retinaUrl: false, retinaSuffix: "@2x.$1", current: "image {current} of {total}", previous: "previous", next: "next", close: "close", xhrError: "This content failed to load.", imgError: "This image failed to load.", open: false, returnFocus: true, reposition: true, loop: true, slideshow: false, slideshowAuto: true, slideshowSpeed: 2500, slideshowStart: "start slideshow", slideshowStop: "stop slideshow", photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i, onOpen: false, onLoad: false, onComplete: false, onCleanup: false, onClosed: false, overlayClose: true, escKey: true, arrowKey: true, top: false, bottom: false, left: false, right: false, fixed: false, data: undefined}, x = "colorbox", U = "cbox", r = U + "Element", X = U + "_open", e = U + "_load", W = U + "_complete", u = U + "_cleanup", ae = U + "_closed", i = U + "_purge", v = !L.support.leadingWhitespace, ai = v && !Y.XMLHttpRequest, ac = U + "_IE6", S, ak, al, d, J, p, b, R, c, ab, P, k, h, o, t, Z, s, T, z, B, H = L({}), ah, am, m, g, a, w, K, n, D, aa, O, A, N, ag = "div", af, ad;

    function I(an, aq, ap) {
        var ao = l.createElement(an);
        if (aq) {
            ao.id = U + aq
        }
        if (ap) {
            ao.style.cssText = ap
        }
        return L(ao)
    }

    function F(ao) {
        var an = c.length, ap = (K + ao) % an;
        return(ap < 0) ? an + ap : ap
    }

    function Q(an, ao) {
        return Math.round((/%/.test(an) ? ((ao === "x" ? ab.width() : ab.height()) / 100) : 1) * parseInt(an, 10))
    }

    function C(ao, an) {
        return ao.photo || ao.photoRegex.test(an)
    }

    function E(ao, an) {
        return ao.retinaUrl && Y.devicePixelRatio > 1 ? an.replace(ao.photoRegex, ao.retinaSuffix) : an
    }

    function aj(an) {
        if ("contains" in ak[0] && !ak[0].contains(an.target)) {
            an.stopPropagation();
            ak.focus()
        }
    }

    function V() {
        var an, ao = L.data(w, x);
        if (ao == null) {
            ah = L.extend({}, M);
            if (console && console.log) {
                console.log("Error: cboxElement missing settings object")
            }
        } else {
            ah = L.extend({}, ao)
        }
        for (an in ah) {
            if (L.isFunction(ah[an]) && an.slice(0, 2) !== "on") {
                ah[an] = ah[an].call(w)
            }
        }
        ah.rel = ah.rel || w.rel || L(w).data("rel") || "nofollow";
        ah.href = ah.href || L(w).attr("href");
        ah.title = ah.title || w.title;
        if (typeof ah.href === "string") {
            ah.href = L.trim(ah.href)
        }
    }

    function G(an, ao) {
        L(l).trigger(an);
        H.trigger(an);
        if (L.isFunction(ao)) {
            ao.call(w)
        }
    }

    function y() {
        var ao, aq = U + "Slideshow_", ar = "click." + U, an, au, at, ap;
        if (ah.slideshow && c[1]) {
            an = function () {
                clearTimeout(ao)
            };
            au = function () {
                if (ah.loop || c[K + 1]) {
                    ao = setTimeout(N.next, ah.slideshowSpeed)
                }
            };
            at = function () {
                Z.html(ah.slideshowStop).unbind(ar).one(ar, ap);
                H.bind(W, au).bind(e, an).bind(u, ap);
                ak.removeClass(aq + "off").addClass(aq + "on")
            };
            ap = function () {
                an();
                H.unbind(W, au).unbind(e, an).unbind(u, ap);
                Z.html(ah.slideshowStart).unbind(ar).one(ar, function () {
                    N.next();
                    at()
                });
                ak.removeClass(aq + "on").addClass(aq + "off")
            };
            if (ah.slideshowAuto) {
                at()
            } else {
                ap()
            }
        } else {
            ak.removeClass(aq + "off " + aq + "on")
        }
    }

    function f(an) {
        if (!O) {
            w = an;
            V();
            c = L(w);
            K = 0;
            if (ah.rel !== "nofollow") {
                c = L("." + r).filter(function () {
                    var ap = L.data(this, x), ao;
                    if (ap) {
                        ao = L(this).data("rel") || ap.rel || this.rel
                    }
                    return(ao === ah.rel)
                });
                K = c.index(w);
                if (K === -1) {
                    c = c.add(w);
                    K = c.length - 1
                }
            }
            S.css({opacity: parseFloat(ah.opacity), cursor: ah.overlayClose ? "pointer" : "auto", visibility: "visible"}).show();
            if (!D) {
                D = aa = true;
                ak.css({visibility: "hidden", display: "block"});
                P = I(ag, "LoadedContent", "width:0; height:0; overflow:hidden").appendTo(d);
                am = J.height() + R.height() + d.outerHeight(true) - d.height();
                m = p.width() + b.width() + d.outerWidth(true) - d.width();
                g = P.outerHeight(true);
                a = P.outerWidth(true);
                ah.w = Q(ah.initialWidth, "x");
                ah.h = Q(ah.initialHeight, "y");
                N.position();
                if (ai) {
                    ab.bind("resize." + ac + " scroll." + ac,function () {
                        S.css({width: ab.width(), height: ab.height(), top: ab.scrollTop(), left: ab.scrollLeft()})
                    }).trigger("resize." + ac)
                }
                y();
                G(X, ah.onOpen);
                B.add(o).hide();
                z.html(ah.close).show();
                ak.focus();
                if (l.addEventListener) {
                    l.addEventListener("focus", aj, true);
                    H.one(ae, function () {
                        l.removeEventListener("focus", aj, true)
                    })
                }
                if (ah.returnFocus) {
                    H.one(ae, function () {
                        L(w).focus()
                    })
                }
            }
            N.load(true)
        }
    }

    function q() {
        if (!ak && l.body) {
            ad = false;
            ab = L(Y);
            ak = I(ag).attr({id: x, "class": v ? U + (ai ? "IE6" : "IE") : "", role: "dialog", tabindex: "-1"}).hide();
            S = I(ag, "Overlay", ai ? "position:absolute" : "").hide();
            h = I(ag, "LoadingOverlay").add(I(ag, "LoadingGraphic"));
            al = I(ag, "Wrapper");
            d = I(ag, "Content").append(o = I(ag, "Title"), t = I(ag, "Current"), T = I("button", "Previous"), s = I("button", "Next"), Z = I("button", "Slideshow"), h, z = I("button", "Close"));
            al.append(I(ag).append(I(ag, "TopLeft"), J = I(ag, "TopCenter"), I(ag, "TopRight")), I(ag, false, "clear:left").append(p = I(ag, "MiddleLeft"), d, b = I(ag, "MiddleRight")), I(ag, false, "clear:left").append(I(ag, "BottomLeft"), R = I(ag, "BottomCenter"), I(ag, "BottomRight"))).find("div div").css({"float": "left"});
            k = I(ag, false, "position:absolute; width:9999px; visibility:hidden; display:none");
            B = s.add(T).add(t).add(Z);
            L(l.body).append(S, ak.append(al, k))
        }
    }

    function j() {
        function an(ao) {
            if (!(ao.which > 1 || ao.shiftKey || ao.altKey || ao.metaKey)) {
                ao.preventDefault();
                f(this)
            }
        }

        if (ak) {
            if (!ad) {
                ad = true;
                s.click(function () {
                    N.next()
                });
                T.click(function () {
                    N.prev()
                });
                z.click(function () {
                    N.close()
                });
                S.click(function () {
                    if (ah.overlayClose) {
                        N.close()
                    }
                });
                L(l).bind("keydown." + U, function (ap) {
                    var ao = ap.keyCode;
                    if (D && ah.escKey && ao === 27) {
                        ap.preventDefault();
                        N.close()
                    }
                    if (D && ah.arrowKey && c[1] && !ap.altKey) {
                        if (ao === 37) {
                            ap.preventDefault();
                            T.click()
                        } else {
                            if (ao === 39) {
                                ap.preventDefault();
                                s.click()
                            }
                        }
                    }
                });
                if (L.isFunction(L.fn.on)) {
                    L(l).on("click." + U, "." + r, an)
                } else {
                    L("." + r).live("click." + U, an)
                }
            }
            return true
        }
        return false
    }

    if (L.colorbox) {
        return
    }
    L(q);
    N = L.fn[x] = L[x] = function (an, ap) {
        var ao = this;
        an = an || {};
        q();
        if (j()) {
            if (L.isFunction(ao)) {
                ao = L("<a/>");
                an.open = true
            } else {
                if (!ao[0]) {
                    return ao
                }
            }
            if (ap) {
                an.onComplete = ap
            }
            ao.each(function () {
                L.data(this, x, L.extend({}, L.data(this, x) || M, an))
            }).addClass(r);
            if ((L.isFunction(an.open) && an.open.call(ao)) || an.open) {
                f(ao[0])
            }
        }
        return ao
    };
    N.position = function (ap, ar) {
        var au, aw = 0, ao = 0, at = ak.offset(), an, aq;
        ab.unbind("resize." + U);
        ak.css({top: -90000, left: -90000});
        an = ab.scrollTop();
        aq = ab.scrollLeft();
        if (ah.fixed && !ai) {
            at.top -= an;
            at.left -= aq;
            ak.css({position: "fixed"})
        } else {
            aw = an;
            ao = aq;
            ak.css({position: "absolute"})
        }
        if (ah.right !== false) {
            ao += Math.max(ab.width() - ah.w - a - m - Q(ah.right, "x"), 0)
        } else {
            if (ah.left !== false) {
                ao += Q(ah.left, "x")
            } else {
                ao += Math.round(Math.max(ab.width() - ah.w - a - m, 0) / 2)
            }
        }
        if (ah.bottom !== false) {
            aw += Math.max(ab.height() - ah.h - g - am - Q(ah.bottom, "y"), 0)
        } else {
            if (ah.top !== false) {
                aw += Q(ah.top, "y")
            } else {
                aw += Math.round(Math.max(ab.height() - ah.h - g - am, 0) / 2)
            }
        }
        ak.css({top: at.top, left: at.left, visibility: "visible"});
        ap = (ak.width() === ah.w + a && ak.height() === ah.h + g) ? 0 : ap || 0;
        al[0].style.width = al[0].style.height = "9999px";
        function av(ax) {
            J[0].style.width = R[0].style.width = d[0].style.width = (parseInt(ax.style.width, 10) - m) + "px";
            d[0].style.height = p[0].style.height = b[0].style.height = (parseInt(ax.style.height, 10) - am) + "px"
        }

        au = {width: ah.w + a + m, height: ah.h + g + am, top: aw, left: ao};
        if (ap === 0) {
            ak.css(au)
        }
        ak.dequeue().animate(au, {duration: ap, complete: function () {
            av(this);
            aa = false;
            al[0].style.width = (ah.w + a + m) + "px";
            al[0].style.height = (ah.h + g + am) + "px";
            if (ah.reposition) {
                setTimeout(function () {
                    ab.bind("resize." + U, N.position)
                }, 1)
            }
            if (ar) {
                ar()
            }
        }, step: function () {
            av(this)
        }})
    };
    N.resize = function (an) {
        if (D) {
            an = an || {};
            if (an.width) {
                ah.w = Q(an.width, "x") - a - m
            }
            if (an.innerWidth) {
                ah.w = Q(an.innerWidth, "x")
            }
            P.css({width: ah.w});
            if (an.height) {
                ah.h = Q(an.height, "y") - g - am
            }
            if (an.innerHeight) {
                ah.h = Q(an.innerHeight, "y")
            }
            if (!an.innerHeight && !an.height) {
                P.css({height: "auto"});
                ah.h = P.height()
            }
            P.css({height: ah.h});
            N.position(ah.transition === "none" ? 0 : ah.speed)
        }
    };
    N.prep = function (ao) {
        if (!D) {
            return
        }
        var ar, ap = ah.transition === "none" ? 0 : ah.speed;
        P.empty().remove();
        P = I(ag, "LoadedContent").append(ao);
        function an() {
            ah.w = ah.w || P.width();
            ah.w = ah.mw && ah.mw < ah.w ? ah.mw : ah.w;
            return ah.w
        }

        function aq() {
            ah.h = ah.h || P.height();
            ah.h = ah.mh && ah.mh < ah.h ? ah.mh : ah.h;
            return ah.h
        }

        P.hide().appendTo(k.show()).css({width: an(), overflow: ah.scrolling ? "auto" : "hidden"}).css({height: aq()}).prependTo(d);
        k.hide();
        L(n).css({"float": "none"});
        ar = function () {
            var ax = c.length, av, aw = "frameBorder", at = "allowTransparency", au;
            if (!D) {
                return
            }
            function ay() {
                if (v) {
                    ak[0].style.removeAttribute("filter")
                }
            }

            au = function () {
                clearTimeout(A);
                h.hide();
                G(W, ah.onComplete)
            };
            if (v) {
                if (n) {
                    P.fadeIn(100)
                }
            }
            o.html(ah.title).add(P).show();
            if (ax > 1) {
                if (typeof ah.current === "string") {
                    t.html(ah.current.replace("{current}", K + 1).replace("{total}", ax)).show()
                }
                s[(ah.loop || K < ax - 1) ? "show" : "hide"]().html(ah.next);
                T[(ah.loop || K) ? "show" : "hide"]().html(ah.previous);
                if (ah.slideshow) {
                    Z.show()
                }
                if (ah.preloading) {
                    L.each([F(-1), F(1)], function () {
                        var aC, az, aA = c[this], aB = L.data(aA, x);
                        if (aB && aB.href) {
                            aC = aB.href;
                            if (L.isFunction(aC)) {
                                aC = aC.call(aA)
                            }
                        } else {
                            aC = L(aA).attr("href")
                        }
                        if (aC && C(aB, aC)) {
                            aC = E(aB, aC);
                            az = new Image();
                            az.src = aC
                        }
                    })
                }
            } else {
                B.hide()
            }
            if (ah.iframe) {
                av = I("iframe")[0];
                if (aw in av) {
                    av[aw] = 0
                }
                if (at in av) {
                    av[at] = "true"
                }
                if (!ah.scrolling) {
                    av.scrolling = "no"
                }
                L(av).attr({src: ah.href, name: (new Date()).getTime(), "class": U + "Iframe", allowFullScreen: true, webkitAllowFullScreen: true, mozallowfullscreen: true}).one("load", au).appendTo(P);
                H.one(i, function () {
                    av.src = "//about:blank"
                });
                if (ah.fastIframe) {
                    L(av).trigger("load")
                }
            } else {
                au()
            }
            if (ah.transition === "fade") {
                ak.fadeTo(ap, 1, ay)
            } else {
                ay()
            }
        };
        if (ah.transition === "fade") {
            ak.fadeTo(ap, 0, function () {
                N.position(0, ar)
            })
        } else {
            N.position(ap, ar)
        }
    };
    N.load = function (aq) {
        var ap, ar, ao = N.prep, an;
        aa = true;
        n = false;
        w = c[K];
        if (!aq) {
            V()
        }
        if (af) {
            ak.add(S).removeClass(af)
        }
        if (ah.className) {
            ak.add(S).addClass(ah.className)
        }
        af = ah.className;
        G(i);
        G(e, ah.onLoad);
        ah.h = ah.height ? Q(ah.height, "y") - g - am : ah.innerHeight && Q(ah.innerHeight, "y");
        ah.w = ah.width ? Q(ah.width, "x") - a - m : ah.innerWidth && Q(ah.innerWidth, "x");
        ah.mw = ah.w;
        ah.mh = ah.h;
        if (ah.maxWidth) {
            ah.mw = Q(ah.maxWidth, "x") - a - m;
            ah.mw = ah.w && ah.w < ah.mw ? ah.w : ah.mw
        }
        if (ah.maxHeight) {
            ah.mh = Q(ah.maxHeight, "y") - g - am;
            ah.mh = ah.h && ah.h < ah.mh ? ah.h : ah.mh
        }
        ap = ah.href;
        A = setTimeout(function () {
            h.show()
        }, 100);
        if (ah.inline) {
            an = I(ag).hide().insertBefore(L(ap)[0]);
            H.one(i, function () {
                an.replaceWith(P.children())
            });
            ao(L(ap))
        } else {
            if (ah.iframe) {
                ao(" ")
            } else {
                if (ah.html) {
                    ao(ah.html)
                } else {
                    if (C(ah, ap)) {
                        ap = E(ah, ap);
                        L(n = new Image()).addClass(U + "Photo").bind("error",function () {
                            ah.title = false;
                            ao(I(ag, "Error").html(ah.imgError))
                        }).one("load", function () {
                            var at;
                            if (ah.retinaImage && Y.devicePixelRatio > 1) {
                                n.height = n.height / Y.devicePixelRatio;
                                n.width = n.width / Y.devicePixelRatio
                            }
                            if (ah.scalePhotos) {
                                ar = function () {
                                    n.height -= n.height * at;
                                    n.width -= n.width * at;
                                    if (jQuery.browser.msie) {
                                        L(n).css({height: n.height, width: n.width})
                                    }
                                };
                                if (ah.mw && n.width > ah.mw) {
                                    at = (n.width - ah.mw) / n.width;
                                    ar()
                                }
                                if (ah.mh && n.height > ah.mh) {
                                    at = (n.height - ah.mh) / n.height;
                                    ar()
                                }
                            }
                            if (ah.h) {
                                n.style.marginTop = Math.max(ah.mh - n.height, 0) / 2 + "px"
                            }
                            if (c[1] && (ah.loop || c[K + 1])) {
                                n.style.cursor = "pointer";
                                n.onclick = function () {
                                    N.next()
                                }
                            }
                            if (v) {
                                n.style.msInterpolationMode = "bicubic"
                            }
                            setTimeout(function () {
                                ao(n)
                            }, 1)
                        });
                        setTimeout(function () {
                            n.src = ap
                        }, 1)
                    } else {
                        if (ap) {
                            k.load(ap, ah.data, function (au, at) {
                                ao(at === "error" ? I(ag, "Error").html(ah.xhrError) : L(this).contents())
                            })
                        }
                    }
                }
            }
        }
    };
    N.next = function () {
        if (!aa && c[1] && (ah.loop || c[K + 1])) {
            K = F(1);
            N.load()
        }
    };
    N.prev = function () {
        if (!aa && c[1] && (ah.loop || K)) {
            K = F(-1);
            N.load()
        }
    };
    N.close = function () {
        if (D && !O) {
            O = true;
            D = false;
            G(u, ah.onCleanup);
            ab.unbind("." + U + " ." + ac);
            S.fadeTo(200, 0);
            ak.stop().fadeTo(300, 0, function () {
                ak.add(S).css({opacity: 1, cursor: "auto"}).hide();
                G(i);
                P.empty().remove();
                setTimeout(function () {
                    O = false;
                    G(ae, ah.onClosed)
                }, 1)
            })
        }
    };
    N.remove = function () {
        L([]).add(ak).add(S).remove();
        ak = null;
        L("." + r).removeData(x).removeClass(r);
        L(l).unbind("click." + U)
    };
    N.element = function () {
        return L(w)
    };
    N.settings = M
}(jQuery, document, window));