/// <reference path="scripts/typings/jquery/jquery.d.ts" />

module ui {

    interface SelectMenuItem {
        text: string;
        value: string;
        index: number;
    }

    export class select {

        static load() {
            var selectElements: NodeList = document.querySelectorAll("select");
            for (var i: number = 0; i < selectElements.length; i++) {
                new ui.select(selectElements[i]);
            }
        }

        private _items: Array<SelectMenuItem>;

        constructor(selectNode: Node) {

            var select = $(selectNode);

            var selectWrap = $("<div class='ui-select-container'><span></span></div>");
            selectWrap.insertBefore(select);

            var selectedOption: JQuery = this.getSelectedOption(select);
            var span = selectWrap.find("span");
            span.text(selectedOption.text());

            select.appendTo(selectWrap);
            select.hide()

            this._items = this.getItems(select);

            // Create a template 
            var wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            var list: JQuery = this.createListFromItems(this._items);
            wrap.append(list);
            var body = $("body");
            body.append(wrap);

            // events
            //select.change(e => {
            //    e.relatedTarget
            //});

            selectWrap.click(e => {
                this.toggleMenu(wrap, span);
                e.stopPropagation();
            });

            // click on an item
            list.find("li").click(e => {
                var li: Element = <Element>e.currentTarget;
                this.selectItem(select, span, li);
            });

            // Hide the menu if click anywhere else in the document
            $(document).click(e => {
                if (wrap.is(":visible")) {
                    wrap.hide();
                }
            });
        }

        private createListFromItems(items: Array<SelectMenuItem>): JQuery {
            var list = $("<ul class='ui-select-list'></ul>");
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            return list;
        }

        private selectItem(select: JQuery, span: JQuery, templateElement: Element) {
            var index = $(templateElement).attr("i");
            var item = this._items[index];
            select.val(item.value);
            var selectedOption = select.find("option:selected").first();
            span.text(selectedOption.text());
        }

        private getSelectedOption(select: JQuery): JQuery {
            var selectedOption: JQuery = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        }

        private getItems(select: JQuery): Array<SelectMenuItem> {
            var items = new Array();
            select.find("option").each(function (index, item) {
                items.push({
                    text: this.innerText,
                    value: this.value,
                    index: index
                });
            });
            return items;
        }

        private toggleMenu(wrap: JQuery, span: JQuery) {
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
                wrap.addClass("menuActive")
                wrap.show();
            }
        }
    }
} 