/// <reference path="scripts/typings/jquery/jquery.d.ts" />

module ui {

    export class select {

        static load() {
            var selectElements : NodeList = document.querySelectorAll("select");
            for (var i: number = 0; i < selectElements.length; i++) {
                new ui.select(selectElements[i]);
            }
        }

        constructor(selectNode: Node) {

            var select = $(selectNode);

            var selectedOption = select.find("option:selected").first();
            if (selectedOption.length == 0) {
                selectedOption = select.find("option").first();
            }

            var selectWrap = $("<div class='ui-select-container'><span>select menu</span></div>");

            selectWrap.insertBefore(select);

            var span = selectWrap.find("span");
            span.text(selectedOption.text());
            select.appendTo(selectWrap);
            select.hide()

            // Get items
            var items = new Array();
            select.find("option").each(function (index, item) {
                items.push({
                    text: this.innerText,
                    value: this.value,
                    index: index
                });
            });

            // Create a template 
            var wrap = $("<div class='ui-select-wrap' style='display:none;'></div");
            var list = $("<ul class='ui-select-list'></ul>");

            // Append items
            items.forEach(function (item, index) {
                var li = $("<li i='" + item.index + "'>" + item.text + "</li>");
                list.append(li);
            });
            wrap.append(list);
            var body = $("body");
            body.append(wrap);

            var selectItem = function (templateElement) {
                var index = $(templateElement).attr("i");
                var item = items[index];
                select.val(item.value);
                var selectedOption = select.find("option:selected").first();
                span.text(selectedOption.text());
            };

            // events
            selectWrap.click((e) => {
                this.toggleMenu(wrap, span);
                e.stopPropagation();
            });

            // click on an item
            list.find("li").click(function (e) {
                selectItem(this);
            });

            $(document).click(function (e) {
                if (wrap.is(":visible")) {
                    wrap.hide();
                }
            });           
        }

        private toggleMenu(wrap, span) {
            if (wrap.is(":visible")) {
                wrap.hide()
                    wrap.removeClass("menuActive");
                wrap.css({
                    position: ""
                });
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