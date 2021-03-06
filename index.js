
/**
 * @fileoverview 此类表示地图上的一个覆盖物，该覆盖物由文字和图标组成，从Overlay继承。
 * 主入口类是<a href="symbols/BMapLib.Infobox.html">TextIconOverlay</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group 
 * @version 1.2
 * http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox.js
 */
 
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = { default: factory(), InfoBox: factory() };
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.BMapLib = root.BMapLib || {};
        root.BMapLib.InfoBox = root.BMapLib.InfoBox || factory();
    }
})(this, function () {

    var INFOBOX_AT_TOP = 1,
        INFOBOX_AT_RIGHT = 2,
        INFOBOX_AT_BOTTOM = 3,
        INFOBOX_AT_LEFT = 4;

    function extend(subClass, superClass, className) {
        var key, proto,
            selfProps = subClass.prototype,
            clazz = new Function();

        clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new clazz();
        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
     
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;
        if ("string" == typeof className) {
            proto._className = className;
        }
    };

    var T, baidu = T = baidu || { version: '1.5.0' };
    baidu.guid = '$BAIDU$';
    window[baidu.guid] = window[baidu.guid] || {};

    baidu.lang = baidu.lang || {};
    baidu.lang.isString = function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    };
    baidu.lang.isFunction = function (source) {
        return '[object Function]' == Object.prototype.toString.call(source);
    };
    baidu.lang.Event = function (type, target) {
        this.type = type;
        this.returnValue = true;
        this.target = target || null;
        this.currentTarget = null;
    };


    baidu.object = baidu.object || {};
    baidu.extend =
        baidu.object.extend = function (target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }

            return target;
        };
    baidu.event = baidu.event || {};
    baidu.event._listeners = baidu.event._listeners || [];
    baidu.dom = baidu.dom || {};

    baidu.dom._g = function (id) {
        if (baidu.lang.isString(id)) {
            return document.getElementById(id);
        }
        return id;
    };
    baidu._g = baidu.dom._g;
    baidu.event.on = function (element, type, listener) {
        type = type.replace(/^on/i, '');
        element = baidu.dom._g(element);
        var realListener = function (ev) {

            listener.call(element, ev);
        },
            lis = baidu.event._listeners,
            filter = baidu.event._eventFilter,
            afterFilter,
            realType = type;
        type = type.toLowerCase();
        if (filter && filter[type]) {
            afterFilter = filter[type](element, type, realListener);
            realType = afterFilter.type;
            realListener = afterFilter.listener;
        }

        if (element.addEventListener) {
            element.addEventListener(realType, realListener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + realType, realListener);
        }
        lis[lis.length] = [element, type, listener, realListener, realType];
        return element;
    };

    baidu.on = baidu.event.on;
    baidu.event.un = function (element, type, listener) {
        element = baidu.dom._g(element);
        type = type.replace(/^on/i, '').toLowerCase();

        var lis = baidu.event._listeners,
            len = lis.length,
            isRemoveAll = !listener,
            item,
            realType, realListener;
        while (len--) {
            item = lis[len];

            if (item[1] === type
                && item[0] === element
                && (isRemoveAll || item[2] === listener)) {
                realType = item[4];
                realListener = item[3];
                if (element.removeEventListener) {
                    element.removeEventListener(realType, realListener, false);
                } else if (element.detachEvent) {
                    element.detachEvent('on' + realType, realListener);
                }
                lis.splice(len, 1);
            }
        }

        return element;
    };
    baidu.un = baidu.event.un;
    baidu.dom.g = function (id) {
        if ('string' == typeof id || id instanceof String) {
            return document.getElementById(id);
        } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
            return id;
        }
        return null;
    };
    baidu.g = baidu.G = baidu.dom.g;
    baidu.dom._styleFixer = baidu.dom._styleFixer || {};
    baidu.dom._styleFilter = baidu.dom._styleFilter || [];
    baidu.dom._styleFilter.filter = function (key, value, method) {
        for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
            if (filter = filter[method]) {
                value = filter(key, value);
            }
        }
        return value;
    };
    baidu.string = baidu.string || {};

    baidu.string.toCamelCase = function (source) {
        if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
            return source;
        }
        return source.replace(/[-_][^-_]/g, function (match) {
            return match.charAt(1).toUpperCase();
        });
    };

    baidu.dom.setStyle = function (element, key, value) {
        var dom = baidu.dom, fixer;
        element = dom.g(element);
        key = baidu.string.toCamelCase(key);

        if (fixer = dom._styleFilter) {
            value = fixer.filter(key, value, 'set');
        }
     
        fixer = dom._styleFixer[key];
        (fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);

        return element;
    };

    baidu.setStyle = baidu.dom.setStyle;

    baidu.dom.setStyles = function (element, styles) {
        element = baidu.dom.g(element);
        for (var key in styles) {
            baidu.dom.setStyle(element, key, styles[key]);
        }
        return element;
    };
    baidu.setStyles = baidu.dom.setStyles;
    baidu.browser = baidu.browser || {};
    baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
    baidu.dom._NAME_ATTRS = (function () {
        var result = {
            'cellpadding': 'cellPadding',
            'cellspacing': 'cellSpacing',
            'colspan': 'colSpan',
            'rowspan': 'rowSpan',
            'valign': 'vAlign',
            'usemap': 'useMap',
            'frameborder': 'frameBorder'
        };

        if (baidu.browser.ie < 8) {
            result['for'] = 'htmlFor';
            result['class'] = 'className';
        } else {
            result['htmlFor'] = 'for';
            result['className'] = 'class';
        }

        return result;
    })();
    baidu.dom.setAttr = function (element, key, value) {
        element = baidu.dom.g(element);
        if ('style' == key) {
            element.style.cssText = value;
        } else {
            key = baidu.dom._NAME_ATTRS[key] || key;
            element.setAttribute(key, value);
        }
        return element;
    };
    baidu.setAttr = baidu.dom.setAttr;
    baidu.dom.setAttrs = function (element, attributes) {
        element = baidu.dom.g(element);
        for (var key in attributes) {
            baidu.dom.setAttr(element, key, attributes[key]);
        }
        return element;
    };
    baidu.setAttrs = baidu.dom.setAttrs;
    baidu.dom.create = function (tagName, opt_attributes) {
        var el = document.createElement(tagName),
            attributes = opt_attributes || {};
        return baidu.dom.setAttrs(el, attributes);
    };
    T.undope = true;

    var InfoBox = function (map, content, opts) {
        try {
            BMap;
        } catch (e) {
            throw Error('Baidu Map JS API is not ready yet!');
        }

        if (!InfoBox._isExtended) {
            InfoBox._isExtended = true;
            extend(InfoBox, BMap.Overlay, "InfoBox");
            var infobox = new InfoBox(opts);
            this.__proto__ = infobox.__proto__;
        }

        this._content = content || "";
        this._isOpen = false;
        this._map = map;
        this._opts = opts = opts || {};
        this._opts.offset = opts.offset || new BMap.Size(0, 0);
        this._opts.boxClass = opts.boxClass || "infoBox";
        this._opts.boxStyle = opts.boxStyle || {};
        this._opts.closeIconMargin = opts.closeIconMargin || "2px";
        this._opts.closeIconUrl = opts.closeIconUrl || "//www.google.com/intl/en_us/mapfiles/close.gif";
        if (opts.closeIconUrl === "") {
        this.closeIconUrl = "";
         
        }
        this._opts.enableAutoPan = opts.enableAutoPan ? true : false;
        this._opts.align = opts.align || INFOBOX_AT_TOP;
    }


    InfoBox.prototype.initialize = function (map) {
        var me = this;
        var div = this._div = baidu.dom.create('div', { "class": this._opts.boxClass });
        baidu.dom.setStyles(div, this._opts.boxStyle);
        div.style.position = "absolute";
        this._setContent(this._content);

        var floatPane = map.getPanes().floatPane;
        floatPane.style.width = "auto";
        floatPane.appendChild(div);
        this._getInfoBoxSize();
        baidu.event.on(div, "onmousedown", function (e) {
            me._stopBubble(e);
        });
        baidu.event.on(div, "onmouseover", function (e) {
            me._stopBubble(e);
        });
        baidu.event.on(div, "click", function (e) {
            me._stopBubble(e);
        });
        baidu.event.on(div, "dblclick", function (e) {
            me._stopBubble(e);
        });
        return div;
    }
    InfoBox.prototype.draw = function () {
        this._isOpen && this._adjustPosition(this._point);
    }
    InfoBox.prototype.open = function (anchor) {
        var me = this, poi;
        if (!this._isOpen) {
            this._map.addOverlay(this);
            this._isOpen = true;
            setTimeout(function () {
                me._dispatchEvent(me, "open", { "point": me._point });
            }, 10);
        }
        if (anchor instanceof BMap.Point) {
            poi = anchor;
            this._removeMarkerEvt();
        } else if (anchor instanceof BMap.Marker) {
            if (this._marker) {
                this._removeMarkerEvt();
            }
            poi = anchor.getPosition();
            this._marker = anchor;
            !this._markerDragend && this._marker.addEventListener("dragend", this._markerDragend = function (e) {
                me._point = e.point;
                me._adjustPosition(me._point);
                me._panBox();
                me.show();
            });
            !this._markerDragging && this._marker.addEventListener("dragging", this._markerDragging = function () {
                me.hide();
                me._point = me._marker.getPosition();
                me._adjustPosition(me._point);
            });
        }
        this.show();
        this._point = poi;
        this._panBox();
        this._adjustPosition(this._point);
    }
    InfoBox.prototype.close = function () {
        if (this._isOpen) {
            this._map.removeOverlay(this);
            this._remove();
            this._isOpen = false;
            this._dispatchEvent(this, "close", { "point": this._point });
        }
    }

    InfoBox.prototype.enableAutoPan = function () {
        this._opts.enableAutoPan = true;
    }

    InfoBox.prototype.disableAutoPan = function () {
        this._opts.enableAutoPan = false;
    }

    InfoBox.prototype.setContent = function (content) {
        this._setContent(content);
        this._getInfoBoxSize();
        this._adjustPosition(this._point);
    }

    InfoBox.prototype.setPosition = function (poi) {
        this._point = poi;
        this._adjustPosition(poi);
        this._removeMarkerEvt();
    }

    InfoBox.prototype.getPosition = function () {
        return this._point;
    }

    InfoBox.prototype.getOffset = function () {
        return this._opts.offset;
    },

        InfoBox.prototype._remove = function () {
            var me = this;
            if (this.domElement && this.domElement.parentNode) {
                baidu.event.un(this._div.firstChild, "click", me._closeHandler());
                this.domElement.parentNode.removeChild(this.domElement);
            }
            this.domElement = null;
            this._isOpen = false;
            this.dispatchEvent("onremove");
        },
        baidu.object.extend(InfoBox.prototype, {

            _getCloseIcon: function () {
                var img = "<img src='" + this._opts.closeIconUrl + "' align='right' style='position:absolute;right:0px;cursor:pointer;margin:" + this._opts.closeIconMargin + "'/>";
                return img;
            },

            _setContent: function (content) {
                if (!this._div) {
                    return;
                }
                var closeHtml = this._getCloseIcon();
                if (typeof content.nodeType === "undefined") {
                    this._div.innerHTML = closeHtml + content;
                } else {
                    this._div.innerHTML = closeHtml;
                    this._div.appendChild(content);
                }
                this._content = content;
                this._addEventToClose();

            },

            _adjustPosition: function (poi) {
                var pixel = this._getPointPosition(poi);
                var icon = this._marker && this._marker.getIcon();
                switch (this._opts.align) {
                    case INFOBOX_AT_TOP:
                        if (this._marker) {
                            this._div.style.bottom = -(pixel.y - this._opts.offset.height - icon.anchor.height + icon.infoWindowAnchor.height) - this._marker.getOffset().height + 2 + "px";
                        } else {
                            this._div.style.bottom = -(pixel.y - this._opts.offset.height) + "px";
                        }
                        break;
                    case INFOBOX_AT_BOTTOM:
                        if (this._marker) {
                            this._div.style.top = pixel.y + this._opts.offset.height - icon.anchor.height + icon.infoWindowAnchor.height + this._marker.getOffset().height + "px";
                        } else {
                            this._div.style.top = pixel.y + this._opts.offset.height + "px";
                        }
                        break;
                }

                if (this._marker) {
                    this._div.style.left = pixel.x - icon.anchor.width + this._marker.getOffset().width + icon.infoWindowAnchor.width - this._boxWidth / 2 + "px";
                } else {
                    this._div.style.left = pixel.x - this._boxWidth / 2 + "px";
                }
            },
            _getPointPosition: function (poi) {
                this._pointPosition = this._map.pointToOverlayPixel(poi);
                return this._pointPosition;
            },
            _getInfoBoxSize: function () {
                this._boxWidth = parseInt(this._div.offsetWidth, 10);
                this._boxHeight = parseInt(this._div.offsetHeight, 10);
            },

            _addEventToClose: function () {
                var me = this;
                baidu.event.on(this._div.firstChild, "click", me._closeHandler());
                this._hasBindEventClose = true;
            },

            _closeHandler: function () {
                var me = this;
                return function (e) {
                    me.close();
                }
            },

            _stopBubble: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }
            },

            _panBox: function () {
                if (!this._opts.enableAutoPan) {
                    return;
                }
                var mapH = parseInt(this._map.getContainer().offsetHeight, 10),
                    mapW = parseInt(this._map.getContainer().offsetWidth, 10),
                    boxH = this._boxHeight,
                    boxW = this._boxWidth;
                if (boxH >= mapH || boxW >= mapW) {
                    return;
                }
                if (!this._map.getBounds().containsPoint(this._point)) {
                    this._map.setCenter(this._point);
                }
                var anchorPos = this._map.pointToPixel(this._point),
                    panTop, panBottom, panY,

                    panLeft = boxW / 2 - anchorPos.x,

                    panRight = boxW / 2 + anchorPos.x - mapW;
                if (this._marker) {
                    var icon = this._marker.getIcon();
                }

                switch (this._opts.align) {
                    case INFOBOX_AT_TOP:
                        var h = this._marker ? icon.anchor.height + this._marker.getOffset().height - icon.infoWindowAnchor.height : 0;
                        panTop = boxH - anchorPos.y + this._opts.offset.height + h + 2;
                        break;
                    case INFOBOX_AT_BOTTOM:
                        var h = this._marker ? -icon.anchor.height + icon.infoWindowAnchor.height + this._marker.getOffset().height + this._opts.offset.height : 0;
                        panBottom = boxH + anchorPos.y - mapH + h + 4;
                        break;
                }

                panX = panLeft > 0 ? panLeft : (panRight > 0 ? -panRight : 0);
                panY = panTop > 0 ? panTop : (panBottom > 0 ? -panBottom : 0);
                this._map.panBy(panX, panY);
            },
            _removeMarkerEvt: function () {
                this._markerDragend && this._marker.removeEventListener("dragend", this._markerDragend);
                this._markerDragging && this._marker.removeEventListener("dragging", this._markerDragging);
                this._markerDragend = this._markerDragging = null;
            },
            _dispatchEvent: function (instance, type, opts) {
                type.indexOf("on") != 0 && (type = "on" + type);
                var event = new baidu.lang.Event(type);
                if (!!opts) {
                    for (var p in opts) {
                        event[p] = opts[p];
                    }
                }
                instance.dispatchEvent(event);
            }
        });
    return InfoBox;
});
