import type { Plugin, Hook } from "flatpickr/dist/types/options";
import type { Instance as FlatPickr } from "flatpickr/dist/types/instance";
import { locale } from "../i18n/i18n-svelte";
import { get } from "svelte/store";

const farsi = get(locale) === 'fa';

let allFormatter: Intl.DateTimeFormat
let withoutTimeFormatter: Intl.DateTimeFormat

const dayFormatter = new Intl.DateTimeFormat('fa-IR', {day: 'numeric'});
const monthFormatter = new Intl.DateTimeFormat('fa-IR', {month: "long"});
const yearFormatter = new Intl.DateTimeFormat('fa-IR', {year: "numeric"});

function initPrettyFromatters(){
    if (allFormatter)
        return

    const farsi = get(locale) === 'fa';

    allFormatter = new Intl.DateTimeFormat(farsi?'fa-IR': undefined, {year: "numeric", month: "numeric", day: "numeric",hour:"2-digit", minute: '2-digit'})
    
    withoutTimeFormatter = new Intl.DateTimeFormat(farsi?'fa-IR': undefined, {year: "numeric", month: "numeric", day: "numeric"})
}

function maxDate(a: Date, b?: Date){
    if (!b || a > b)
        return a
    
    return b 
}

function minDate(a: Date, b?: Date){
    if (!b || a < b)
        return a
    
    return b 
}

function createElement<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, className: string, content?: string): T {

    let e = window.document.createElement(tag);

    className = className || "";

    content = content || "";

    e.className = className;

    if (content !== undefined)
        e.textContent = content;

    return e as T;

}
	
	
let defaultConfig = {

    showHijriDates: true,

    showHijriToggle: false,

    theme: "light",

    hijriToggleText: "Show Hijri Date",
    
    justDate: false,

};

const buildDay: Hook = function (_dObj, _dStr:string, _fp:FlatPickr, dayElem:HTMLSpanElement) {
    const farsi = get(locale) === 'fa';

    if (!farsi) {
        return;
    }
    
    // @ts-ignore
    const day: Date = dayElem.dateObj
    const persianDay = dayFormatter.format(day);
    

    const date = dayElem.innerText;

    const wrapper = createElement("span", "flatpickr-hijri-date-wrapper", "");

    const dateEl = createElement("span", "flatpickr-hijri-date-date", date);

    let className = "flatpickr-hijri-date-hijri";

    if (dayElem.classList.contains("nextMonthDay") ||

        dayElem.classList.contains("prevMonthDay")) {

        className += " flatpickr-hijri-date-not-allowed";

    }

    if (dayElem.classList.contains("selected")) {

        className += " flatpickr-hijri-date-selected";

    }

    const hijriEl = createElement("span", className, persianDay);

    wrapper.appendChild(dateEl);

    wrapper.appendChild(hijriEl);

    dayElem.innerHTML = wrapper.outerHTML;

}
	
function hijriCalendarPlugin(pluginConfig): Plugin {
    const farsi = get(locale) === 'fa';

    const config = Object.assign(Object.assign({}, defaultConfig), pluginConfig);

    return function (fp) {
    initPrettyFromatters()

        let self = {
            hijriMonthContainer: null as  HTMLDivElement,
            hijriMonthName: null as HTMLSpanElement,
        };

        function build() {

            if (!fp.rContainer || !farsi)

                return;

            self.hijriMonthContainer = createElement<HTMLDivElement>("div", "flatpickr-hijri-month-container");

            self.hijriMonthName = createElement<HTMLSpanElement>("span", "flatpickr-hijri-month-name");

            self.hijriMonthName.innerHTML = "فروردین";

            self.hijriMonthContainer.appendChild(self.hijriMonthName);

            fp.monthNav.insertAdjacentElement("afterend", self.hijriMonthContainer);

            self.hijriMonthContainer.tabIndex = -1;

            buildMonth();

            buildActions();

            return;

        }

        

        function buildMonth() {
            if (!self.hijriMonthContainer || !self.hijriMonthName || !farsi) {
                return;
            }
        
            if (typeof fp.config.locale === "string" &&
                fp.config.locale.startsWith("fa")) {
            }

            let monthBeginDate = new Date(fp.currentYear, fp.currentMonth, 1);
            let monthEndDate = new Date(fp.currentYear, fp.currentMonth + 1, 0);

            monthBeginDate = maxDate(monthBeginDate, fp.config.minDate)
            monthEndDate = minDate(monthEndDate, fp.config.maxDate)
            
            const monthBegin = monthFormatter.format(monthBeginDate);
            const monthEnd = monthFormatter.format(monthEndDate)

            const yearBegin = yearFormatter.format(monthBeginDate);
            const yearEnd = yearFormatter.format(monthEndDate);

            let month: string;

            if (yearBegin !== yearEnd) {

                if (monthBegin !== monthEnd) {
                    month = "".concat(monthBegin, " ").concat(yearBegin, " / ").concat(monthEnd, " ").concat(yearEnd);
                }
                else {
                    month = monthBegin;
                }
            }

            else {

                if (monthBegin !== monthEnd) {
                    month = "".concat(monthBegin, " / ").concat(monthEnd, " ").concat(yearBegin);
                }
                else {
                    month = "".concat(monthBegin, " ").concat(yearBegin);
                }
            }
            self.hijriMonthName.innerHTML = month;
        }

        function buildActions() {

            const actionsContainer = createElement("div", "flatpickr-hijri-actions ".concat(config.showHijriToggle ? "visible" : "", " ").concat(config.theme, "Theme"), "ACTIONS");

            actionsContainer.innerHTML = "\n        <label for=\"flatpickr-hijri-switch\">".concat(config.hijriToggleText, "</label>\n        <label class=\"flatpickr-hijri-switch\">\n            <input id=\"flatpickr-hijri-switch\" class=\"flatpickr-hijri-switch\" type=\"checkbox\">\n            <span class=\"flatpickr-hijri-slider\"></span>\n        </label>\n      ");

            actionsContainer.tabIndex = -1;

            const confirmDateContainer = fp.calendarContainer.querySelector(".flatpickr-confirm");

            fp.calendarContainer.appendChild(actionsContainer);

            fp.calendarContainer.insertBefore(actionsContainer, confirmDateContainer);

            const switchInput: HTMLInputElement = fp.calendarContainer.querySelector("input.flatpickr-hijri-switch");

            switchInput.checked = true;

            switchInput.addEventListener("change", function (event) {
                let _a;

                config.showHijriDates = (_a = event.target) === null || _a === void 0 ? void 0 : _a.checked;

                if (self.hijriMonthName) {
                    self.hijriMonthName.innerHTML = "";
                }

                if (config.showHijriDates) {
                    buildMonth();
                }

                fp.redraw();
            });

        }

        return {

            onMonthChange: function (_dObj, _dStr:string, _fp:FlatPickr, data){
                buildMonth()
            } ,

            onDayCreate: buildDay,

            onReady: build,

            formatDate: function(date:Date, format:string, locale):string {
                if (config.justDate)
                    return withoutTimeFormatter.format(date)

                return allFormatter.format(date)
            },

        };

    };

}

export {hijriCalendarPlugin};
	
