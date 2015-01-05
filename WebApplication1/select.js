/// <reference path="scripts/typings/jquery/jquery.d.ts" />
var ui;
(function (ui) {
    var select = (function () {
        function select(selectNode) {
            var _this = this;
            var select = $(selectNode);

            var selectWrap = $("<div class='ui-select-container'><span></span></div>");
            selectWrap.insertBefore(select);

            var selectedOption = this.getSelectedOption(select);
            var span = selectWrap.find("span");
            span.text(selectedOption.text());

            select.appendTo(selectWrap);
            select.hide();

            this._items = this.getItems(select);

            // Create a template
            var wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            var list = this.createListFromItems(this._items);
            wrap.append(list);
            var body = $("body");
            body.append(wrap);

            // events
            //select.change(e => {
            //    e.relatedTarget
            //});
            selectWrap.click(function (e) {
                _this.toggleMenu(wrap, span);
                e.stopPropagation();
            });

            // click on an item
            list.find("li").click(function (e) {
                var li = e.currentTarget;
                _this.selectItem(select, span, li);
            });

            // Hide the menu if click anywhere else in the document
            $(document).click(function (e) {
                if (wrap.is(":visible")) {
                    wrap.hide();
                }
            });
        }
        select.load = function () {
            var selectElements = document.querySelectorAll("select");
            for (var i = 0; i < selectElements.length; i++) {
                new ui.select(selectElements[i]);
            }
        };

        select.prototype.createListFromItems = function (items) {
            var list = $("<ul class='ui-select-list'></ul>");
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            return list;
        };

        select.prototype.selectItem = function (select, span, templateElement) {
            var index = $(templateElement).attr("i");
            var item = this._items[index];
            select.val(item.value);
            var selectedOption = select.find("option:selected").first();
            span.text(selectedOption.text());
        };

        select.prototype.getSelectedOption = function (select) {
            var selectedOption = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        };

        select.prototype.getItems = function (select) {
            var items = new Array();
            select.find("option").each(function (index, item) {
                items.push({
                    text: this.innerText,
                    value: this.value,
                    index: index
                });
            });
            return items;
        };

        select.prototype.toggleMenu = function (wrap, span) {
            if (wrap.is(":visible")) {
                wrap.hide();
                wrap.removeClass("menuActive");
                wrap.css({ position: "" });
            } else {
                var position = span.offset();
                var width = span.outerWidth();
                var height = span.outerHeight();

                //show the menu directly under
                wrap.css({
                    position: "absolute",
                    top: (position.top + height) + "px",
                    width: width,
                    left: (position.left) + "px"
                });
                wrap.addClass("menuActive");
                wrap.show();
            }
        };
        return select;
    })();
    ui.select = select;
})(ui || (ui = {}));
//# sourceMappingURL=select.js.map
