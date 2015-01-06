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

        static load(options?: IOptions): Array<select> {
            factory.setOptions(options);

            var items = new Array<select>();
            var selectElements: NodeList = document.querySelectorAll("select:not([multiple=multiple])");
            for (var i: number = 0; i < selectElements.length; i++) {
                var item = new ui.select(selectElements[i], factory._options);
                items.push(item);
            }
            return items;
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