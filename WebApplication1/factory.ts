module ui {

    export interface IOptions {
        maxHeight: number;
        menuActiveCssClass: string;
        containerActiveCssClass: string;
    }

    export class factory {
        private static _options: IOptions;
        private static _defaultOptions: IOptions = {
            maxHeight: 200,
            menuActiveCssClass: "active",
            containerActiveCssClass: "active"
        };

        private static _items: Array<select>;

        static load(options?: IOptions): Array<select> {
            factory.setOptions(options);

            this._items = new Array<select>();
            var selectElements: NodeList = document.querySelectorAll("select:not([multiple=multiple])");
            for (var i: number = 0; i < selectElements.length; i++) {
                var item = new ui.select(i, selectElements[i], factory._options);
                item.activated = (id) => {
                    this.resetOtherSelectMenus(id);
                };
                this._items.push(item);
            }
            return this._items;
        }

        private static resetOtherSelectMenus( id : number) {
            this._items.forEach((item: select, index: number) => {
                if (item.getId() !== id) {
                    item.reset();
                }
            });
        }

        private static setOptions(options?: IOptions) {
            factory._options = options ? options : factory._defaultOptions;
            for (var propertyName in factory._defaultOptions) {
                if (!factory._options[propertyName]) {
                    factory._options[propertyName] = factory._defaultOptions[propertyName];
                }
            }
        }
    }

} 