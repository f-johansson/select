/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="factory.ts" />
var ui;
(function (ui) {
    var selectTemplate = (function () {
        function selectTemplate(select, items) {
            this.select = select;

            this.container = $("<div class='ui-select-container'><a href=\"#\"><span></span></a></div>");
            this.container.insertBefore(select);

            var selectedOption = this.getSelectedOption(this.select);
            this.span = this.container.find("span");
            this.span.text(selectedOption.text());

            this.select.appendTo(this.container);
            this.select.hide();

            // Create a template
            this.wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            this.list = this.createListFromItems(items);

            this.wrap.append(this.list);
        }
        selectTemplate.prototype.getSelectedOption = function (select) {
            var selectedOption = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        };

        selectTemplate.prototype.createListFromItems = function (items) {
            var list = $("<ul class='ui-select-list'></ul>");
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            return list;
        };
        return selectTemplate;
    })();

    var select = (function () {
        function select(id, selectNode, options) {
            var _this = this;
            this._id = id;
            this._options = options;

            var select = $(selectNode);
            this._items = this.getItems(select);
            this._template = new selectTemplate(select, this._items);

            var body = $("body");
            body.append(this._template.wrap);

            // events
            var a = this._template.container.find("a");
            a.click(function (e) {
                _this._template.container.click();
                return false;
            });

            a.keydown(function (e) {
                _this.handleKeys(e);
            });

            a.focus(function (e) {
                _this.activated(_this._id);
                _this.toggleFocus(_this._template.container);
            });

            this._template.container.click(function (e) {
                _this.toggleMenu(_this._template);
                e.stopPropagation();
            });

            this._template.list.find("li").keydown(function (e) {
                _this.handleKeys(e);
            });

            this._template.list.find("li").click(function (e) {
                var li = e.currentTarget;
                _this.selectItem(li);
            });

            $(document).click(function (e) {
                return _this.reset();
            });
        }
        select.prototype.getId = function () {
            return this._id;
        };

        select.prototype.handleKeys = function (e) {
            if (e.altKey && (e.keyCode === 40 || e.keyCode == 38)) {
                this.toggleMenu(this._template);
            }

            if (e.keyCode === 40) {
                this.alterSelection(1);
            } else if (e.keyCode === 38) {
                this.alterSelection(-1);
            }
        };

        select.prototype.reset = function () {
            this._template.wrap.hide();
            this._template.container.removeClass(this._options.containerActiveCssClass);
        };

        select.prototype.alterSelection = function (indexAdjustment) {
            var option = this.getSelectedOption(this._template.select);
            var selectedValue = $(this._template.select).val();
            var item = this._items.filter(function (value, index) {
                return value.value == selectedValue;
            });
            var currentIndex = item[0].index;
            var newIndex = currentIndex + indexAdjustment;

            if (newIndex < 0) {
                newIndex = 0;
            }
            var maxIndex = this._items.length - 1;
            if (newIndex > maxIndex) {
                newIndex = maxIndex;
            }
            var newItem = this._items[newIndex];
            this.selectItem(this._template.list.find("li[i=" + newIndex + "]")[0]);
        };

        select.prototype.getSelectedOption = function (select) {
            var selectedOption = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        };

        select.prototype.toggleFocus = function (container) {
            if (container.hasClass("focus")) {
                container.removeClass("focus");
            } else {
                container.addClass("focus");
            }
        };

        select.prototype.selectItem = function (listItem) {
            var $item = $(listItem);
            var item = this._items[$item.attr("i")];
            this._template.select.val(item.value);
            var selectedOption = this._template.select.find("option:selected").first();
            this._template.span.text(selectedOption.text());

            this._template.list.find("li").removeClass("selected");
            $item.addClass("selected");
        };

        select.prototype.getItems = function (select) {
            var items = new Array();
            var options = select.find("option");
            options.each(function (index, element) {
                var item = {
                    text: this.innerText,
                    value: this.value,
                    index: index
                };
                items.push(item);
            });
            return items;
        };

        select.prototype.toggleMenu = function (template) {
            var wrap = template.wrap;
            var container = template.container;
            var a = template.container.find("a");

            if (wrap.is(":visible")) {
                wrap.hide();
                wrap.removeClass(this._options.menuActiveCssClass);
                container.removeClass(this._options.containerActiveCssClass);
                wrap.css({ position: "" });
            } else {
                var position = a.offset();
                var width = a.outerWidth();
                var height = a.outerHeight();

                //show the menu directly under
                wrap.css({
                    position: "absolute",
                    top: (position.top + height) + "px",
                    width: width,
                    left: (position.left) + "px"
                });

                var maxHeight = Math.min(window.innerHeight, this._options.maxHeight);
                if (wrap.height() > maxHeight) {
                    wrap.css({ height: maxHeight });
                    var style = wrap.attr("style");
                    style += " overflow-y: scroll";
                    wrap.attr("style", style);
                }
                wrap.addClass(this._options.menuActiveCssClass);
                container.addClass(this._options.containerActiveCssClass);
                wrap.show();

                this.activated(this._id);
            }
        };
        return select;
    })();
    ui.select = select;
})(ui || (ui = {}));
//# sourceMappingURL=select.js.map
