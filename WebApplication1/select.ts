/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="factory.ts" />
module ui {

    interface ISelectMenuItem {
        text: string;
        value: string;
        index: number;
    }

    class selectTemplate {

        public container: JQuery;
        public wrap: JQuery;
        public span: JQuery;
        public list: JQuery;
        public select: JQuery;

        constructor(select: JQuery, items: Array<ISelectMenuItem>) {

            this.select = select;

            this.container = $("<div class='ui-select-container'><a href=\"#\"><span></span></a></div>");
            this.container.insertBefore(select);

            var selectedOption: JQuery = this.getSelectedOption(this.select);
            this.span = this.container.find("span");
            this.span.text(selectedOption.text());

            this.select.appendTo(this.container);
            this.select.hide();

            // Create a template 
            this.wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            this.list = this.createListFromItems(items);

            this.wrap.append(this.list);
        }

        private getSelectedOption(select: JQuery): JQuery {
            var selectedOption: JQuery = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        }

        private createListFromItems(items: Array<ISelectMenuItem>): JQuery {
            var list = $("<ul class='ui-select-list'></ul>");
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            return list;
        }
    }

    export class select {

        private _items: Array<ISelectMenuItem>;
        private _options: IOptions;
        private _id: number;
        private _template: selectTemplate;

        public activated: (id: number) => void;
        public getId(): number {
            return this._id;
        }

        constructor(id: number, selectNode: Node, options: IOptions) {

            this._id = id;
            this._options = options;

            var select = $(selectNode);
            this._items = this.getItems(select);
            this._template = new selectTemplate(select, this._items);

            var body = $("body");
            body.append(this._template.wrap);

            // events
            var a = this._template.container.find("a");
            a.click(e => {
                this._template.container.click();
                return false; // supress actual link click
            });

            a.keydown(e => { this.handleKeys(e); });

            a.focus(e => {
                this.activated(this._id);
                this.toggleFocus(this._template.container);
            });

            this._template.container.click(e => {
                this.toggleMenu(this._template);
                e.stopPropagation();
            });

            this._template.list.find("li").keydown(e => { this.handleKeys(e); });

            this._template.list.find("li").click(e => {
                var li: Element = <Element>e.currentTarget;
                this.selectItem(li);
            });

            $(document).click(e => this.reset());
        }

        private handleKeys(e: JQueryKeyEventObject) {
            if (e.altKey && (e.keyCode === 40 || e.keyCode == 38)) {
                this.toggleMenu(this._template);
            }

            if (e.keyCode === 40) { // down
                this.alterSelection(1);
            }
            else if (e.keyCode === 38) { // up
                this.alterSelection(-1);
            }
        }

        public reset(): void {
            this._template.wrap.hide();
            this._template.container.removeClass(this._options.containerActiveCssClass);
        }

        private alterSelection(indexAdjustment: number) {
            var option = this.getSelectedOption(this._template.select);
            var selectedValue = $(this._template.select).val();
            var item = this._items.filter((value, index) => { return value.value == selectedValue; });
            var currentIndex: number = item[0].index;
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
        }

        private getSelectedOption(select: JQuery): JQuery {
            var selectedOption: JQuery = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }
            return selectedOption;
        }

        private toggleFocus(container: JQuery) {
            if (container.hasClass("focus")) {
                container.removeClass("focus");
            } else {
                container.addClass("focus");
            }
        }

        private selectItem(listItem: Element) {
            var $item = $(listItem);
            var item = this._items[$item.attr("i")];
            this._template.select.val(item.value);
            var selectedOption = this._template.select.find("option:selected").first();
            this._template.span.text(selectedOption.text());

            this._template.list.find("li").removeClass("selected");
            $item.addClass("selected");
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

        private toggleMenu(template: selectTemplate) {
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
                    left: (position.left) + "px",
                });

                var maxHeight = Math.min(window.innerHeight, this._options.maxHeight);
                if (wrap.height() > maxHeight) {
                    wrap.css({ height: maxHeight });
                    var style = wrap.attr("style");
                    style += " overflow-y: scroll";
                    wrap.attr("style", style);
                }
                wrap.addClass(this._options.menuActiveCssClass)
                container.addClass(this._options.containerActiveCssClass);
                wrap.show();

                this.activated(this._id);
            }
        }
    }
} 