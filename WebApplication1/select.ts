/// <reference path="scripts/typings/jquery/jquery.d.ts" />

module ui {

    interface ISelectMenuItem {
        text: string;
        value: string;
        index: number;
    }

    export interface IOptions {
        maxHeight: number;
        menuActiveCssClass: string;
    }

    export class select {

        static _options: IOptions;
        static _defaultOptions: IOptions = {
            maxHeight: 200,
            menuActiveCssClass: "menuActive"
        };

        static load(options?: IOptions): Array<select> {
            select.setOptions(options);

            var array = new Array<select>();
            var selectElements: NodeList = document.querySelectorAll("select:not([multiple=multiple])");
            for (var i: number = 0; i < selectElements.length; i++) {
                var item = new ui.select(selectElements[i]);
                array.push(item);
            }
            return array;
        }

        private static setOptions(options?: IOptions) {
            select._options = options ? options : select._defaultOptions;
            for (var propertyName in select._defaultOptions) {
                if (!select._options[propertyName]) {
                    select._options[propertyName] = select._defaultOptions[propertyName];
                }
            }
        }

        private _items: Array<ISelectMenuItem>;

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
            selectWrap.click(e => {
                this.toggleMenu(wrap, span);
                e.stopPropagation();
            });

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

        private createListFromItems(items: Array<ISelectMenuItem>): JQuery {
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

        private getItems(select: JQuery): Array<ISelectMenuItem> {
            var items = new Array<ISelectMenuItem>();
            var options = select.find("option");
            options.each(function (index, element) {
                var item: ISelectMenuItem = {
                    text: this.innerText,
                    value: this.value,
                    index: index
                };
                items.push(item);
            });
            return items;
        }

        private toggleMenu(wrap: JQuery, span: JQuery) {
            if (wrap.is(":visible")) {
                wrap.hide();
                wrap.removeClass(select._options.menuActiveCssClass);
                wrap.css({ position: "" });
            } else {
                $(".ui-select-wrap." + select._options.menuActiveCssClass).hide();
                var position = span.offset();
                var width = span.outerWidth();
                var height = span.outerHeight();
                //show the menu directly under
                wrap.css({
                    position: "absolute",
                    top: (position.top + height) + "px",
                    width: width,
                    left: (position.left) + "px",
                });

                var maxHeight = Math.min(window.innerHeight, select._options.maxHeight);
                if (wrap.height() > maxHeight) {
                    wrap.css({ height: maxHeight });
                    var style = wrap.attr("style");
                    style += " overflow-y: scroll";
                    wrap.attr("style", style);
                }
                wrap.addClass(select._options.menuActiveCssClass)
                wrap.show();
            }
        }
    }
} 