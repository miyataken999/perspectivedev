// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ ██████ ██████ ██████       █      █      █      █      █ █▄  ▀███ █       ┃
// ┃ ▄▄▄▄▄█ █▄▄▄▄▄ ▄▄▄▄▄█  ▀▀▀▀▀█▀▀▀▀▀ █ ▀▀▀▀▀█ ████████▌▐███ ███▄  ▀█ █ ▀▀▀▀▀ ┃
// ┃ █▀▀▀▀▀ █▀▀▀▀▀ █▀██▀▀ ▄▄▄▄▄ █ ▄▄▄▄▄█ ▄▄▄▄▄█ ████████▌▐███ █████▄   █ ▄▄▄▄▄ ┃
// ┃ █      ██████ █  ▀█▄       █ ██████      █      ███▌▐███ ███████▄ █       ┃
// ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
// ┃ Copyright (c) 2017, the Perspective Authors.                              ┃
// ┃ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ ┃
// ┃ This file is part of the Perspective library, distributed under the terms ┃
// ┃ of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import { sortHandler } from "./sort.js";
import { activate_plugin_menu } from "../style_menu.js";
import { expandCollapseHandler } from "./expand_collapse.js";

export async function mousedown_listener(regularTable, event) {
    if (event.which !== 1) {
        return;
    }

    let target = event.target;
    if (target.tagName === "A") {
        return;
    }

    while (target.tagName !== "TD" && target.tagName !== "TH") {
        target = target.parentElement;
        if (!regularTable.contains(target)) {
            return;
        }
    }

    if (target.classList.contains("psp-tree-label")) {
        expandCollapseHandler.call(this, regularTable, event);
        event.stopImmediatePropagation();
        return;
    }

    if (target.classList.contains("psp-menu-enabled")) {
        target.classList.add("psp-menu-open");
        const meta = regularTable.getMeta(target);
        const column_name = meta.column_header?.[this._config.split_by.length];
        const column_type = this._schema[column_name];
        this._open_column_styles_menu.unshift(meta._virtual_x);
        if (
            column_type === "string" ||
            column_type === "date" ||
            column_type === "datetime"
        ) {
            activate_plugin_menu.call(this, regularTable, target);
        } else {
            const [min, max] = await this._view.get_min_max(column_name);
            let bound = Math.max(Math.abs(min), Math.abs(max));
            if (bound > 1) {
                bound = Math.round(bound * 100) / 100;
            }

            activate_plugin_menu.call(this, regularTable, target, bound);
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    } else if (target.classList.contains("psp-sort-enabled")) {
        sortHandler.call(this, regularTable, event, target);
        event.stopImmediatePropagation();
    }
}

export function click_listener(regularTable, event) {
    if (event.which !== 1) {
        return;
    }

    let target = event.target;
    while (target.tagName !== "TD" && target.tagName !== "TH") {
        target = target.parentElement;
        if (!regularTable.contains(target)) {
            return;
        }
    }

    if (target.classList.contains("psp-tree-label") && event.offsetX < 26) {
        event.stopImmediatePropagation();
    } else if (
        target.classList.contains("psp-header-leaf") &&
        !target.classList.contains("psp-header-corner")
    ) {
        event.stopImmediatePropagation();
    }
}
