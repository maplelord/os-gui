const full_height_checkbox = document.getElementById('full-height-checkbox');
const rtl_checkbox = document.getElementById('rtl-checkbox');
function update_full_height() {
	document.body.style.height = document.documentElement.style.height = full_height_checkbox.checked ? "100%" : "";
}
function update_rtl() {
	document.body.dir = rtl_checkbox.checked ? "rtl" : "ltr";
}
full_height_checkbox.addEventListener('change', update_full_height);
rtl_checkbox.addEventListener('change', update_rtl);
update_full_height();
update_rtl();

document.getElementById("no-focus").addEventListener("mousedown", function (e) {
	e.preventDefault();
});
document.getElementById("no-focus-button").addEventListener("click", function (e) {
	e.target.textContent = "Clicked Button";
});

let disable_an_item = false;
const menus = {
	"&Dialogs": [
		{
			item: "&Generic",
			action: () => {
				const $w = $Window({ title: "Dialog", resizable: false, maximizeButton: false, minimizeButton: false });
				$w.$content.html("<p>Hello world.</p>");
				$w.$Button("OK", () => $w.close()).focus().css({ width: 100 });
			},
			shortcut: "Ctrl+Boring",
		},
	],
	"&Submenus": [
		{
			item: "&Physics",
			submenu: [
				{
					item: "&Schrödinger's Checkbox",
					checkbox: {
						check: () => {
							return Math.random() < 0.5;
						}
					}
				},
			]
		},
		{
			item: "&Many Items",
			submenu: new Array(100).fill(0).map((_, i) => ({
				item: `Item ${i}`,
				checkbox: {
					check: function () { return this.pointless_checkbox_value; },
					toggle: function () { this.pointless_checkbox_value = !this.pointless_checkbox_value; }
				},
				shortcut: `Ctrl+${i}`,
			}))
		},
		{
			item: "&No Items",
			submenu: [],
		},
		{
			item: "&Many Submenus",
			// this can get very slow to load with a lot of submenus, because it creates the DOM structure for the entire thing
			// so I've limited it for now, maybe later we can make it render as needed, perhaps optionally; I'm not sure of the implications on accessibility
			submenu: new Array(3).fill(0).map((_, i) => ({
				item: `Submenu ${i}`,
				submenu: [
					{
						item: "We Need To Go Deeper",
						submenu: [
							{
								item: "And We're Going Deeper",
								// I was hoping to make this infinite, using a getter, but it tries to build an infinite menu up front
								// (so I had to limit it)
								// can't do something like http://orteil.dashnet.org/nested apparently (without more thought)
								get submenu() {
									function recursive_submenu(n) {
										if (n > 5) {
											return [
												{
													item: "Okay, that's deep enough",
												}
											];
										}
										return new Array(2).fill(0).map((_, i) => ({
											item: `Recursion ${n} Submenu ${i}`,
											get submenu() {
												return recursive_submenu(n + 1);
											}
										}));
									}
									return recursive_submenu(1);
								}
							}
						]
					},
					...new Array(100).fill(0).map((_, j) => ({
						item: `Submenu ${i}.${j}`,
						checkbox: {
							check: function () { return this.pointless_checkbox_value; },
							toggle: function () { this.pointless_checkbox_value = !this.pointless_checkbox_value; }
						},
						shortcut: `Ctrl+${i}.${j}`,
					}))
				]
			}))
		},
	],
	"&Enabled": [
		{
			item: "No action",
			shortcut: "Ctrl+Fake",
		},
		{
			item: "Disabled",
			enabled: false,
			shortcut: "Ctrl+Fake",
		},
		{
			item: "disabled: true?",
			disabled: true,
			shortcut: "Ctrl+Fake",
		},
		MENU_DIVIDER,
		{
			item: "Disable the below item",
			checkbox: {
				check: () => disable_an_item,
				toggle: () => disable_an_item = !disable_an_item,
			},
			shortcut: "Ctrl+Fake",
		},
		{
			item: "Conditionally disabled",
			enabled: () => !disable_an_item,
			shortcut: "Ctrl+Fake",
		},
	],
	"&Help": new Array(100).fill(0).map((_, i) => ({
		item: new Array(i + 3).fill("A").join(""),
	})),
};

const $app_window_1 = new $Window({
	title: "Testing Area", resizable: true,
	icons: { 16: "https://win98icons.alexmeub.com/icons/png/application_hammer_grouppol-0.png" },
});
$app_window_1.$content.append(new MenuBar(menus).element);
$app_window_1.$content.append(`
	<p>This is only some tests.</p>
	<button id="open-recursive-dialog">
		<img src="https://win98icons.alexmeub.com/icons/png/accessibility_two_windows.png" width="32" height="32" style="vertical-align: middle;" />
		Recursive Dialog
	</button>
	<button id="test-tabstop-wrapping">
		<img src="https://win98icons.alexmeub.com/icons/png/accessibility_big_keys.png" width="32" height="32" style="vertical-align: middle;" />
		Tabstop Wrapping
	</button>
	<br>
	<br>
	<button id="test-focus-other">Focus Other</button>
	<br>
	<br>
	<button id="test-delayed-focus">Focus Self (delayed)</button>
	<button id="test-delayed-close">Close Self (delayed)</button>
	<br>
	<br>
	<h3>Trigger mouse events on this window, delayed</h3>
	<p>Click then quickly click elsewhere to see if it's refocused.</p>
	<p>Currently "click" events don't refocus, but "mousedown" and "pointerdown" do.</p>
`);
const $tool_window_1 = new $Window({ title: "Tool Window", toolWindow: true, parentWindow: $app_window_1 });
$tool_window_1.$content.append(`
	<p>This tool window has controls in it:</p>
	<input type="text" placeholder="Text input">
	<button>Button</button>
`);
$app_window_1.on("closed", () => {
	$tool_window_1.close();
});
const open_recursive_dialog = (x, y) => {
	const $w = $Window({
		title: "Recursive Dialog", resizable: false, maximizeButton: false, minimizeButton: false,
		icons: {
			32: "https://win98icons.alexmeub.com/icons/png/accessibility_two_windows.png",
			16: "https://win98icons.alexmeub.com/icons/png/appwizard-1.png",
		},
	});
	$w.$content.html("<p>I want more. More!</p>");
	$w.$Button("Recurse", () => {
		open_recursive_dialog(x - 90, y + 100);
		open_recursive_dialog(x + 90, y + 100);
	}).focus().css({ width: 100 });
	$w.$Button("Cancel", () => $w.close()).css({ width: 100 });
	$w.css({
		left: x,
		top: y
	});
};

$app_window_1.find("#open-recursive-dialog").on("click", () => {
	open_recursive_dialog(innerWidth / 2, innerHeight / 2);
});
$app_window_1.find("#test-delayed-focus").on("click", () => {
	setTimeout(() => $app_window_1.focus(), 1000);
});
$app_window_1.find("#test-delayed-close").on("click", () => {
	setTimeout(() => $app_window_1.close(), 1000);
});
$app_window_1.find("#test-focus-other").on("click", () => {
	$app_window_2.focus();
});
for (const trigger_style of ["jQuery", "native"]) {
	for (const event_type of ["click", "pointerdown", "mousedown"]) {
		$app_window_1.$content.append(
			$("<button>").text(
				`Trigger ${event_type} (${trigger_style}, delayed)`
			).click(() => {
				setTimeout(() => {
					if (trigger_style === "jQuery") {
						$app_window_1.find("p").trigger(event_type);
					} else {
						$app_window_1.find("p")[0].dispatchEvent(new Event(event_type, {
							bubbles: true,
							cancelable: true,
						}));
					}
				}, 1000);
			}).prepend(
				// https://win98icons.alexmeub.com/icons/png/mouse_ms-0.png
				"<img src='https://win98icons.alexmeub.com/icons/png/mouse-2.png' width='16' height='16' style='vertical-align: middle;' />"
			),
			"<br>",
		);
	}
}

$app_window_1.find("#test-tabstop-wrapping").on("click", () => {
	// Test tabstop wrapping by creating many windows with different types of controls.
	let x = 0;
	let y = 300;
	const w = 200;
	const h = 200;
	for (const control_html of [
		"<input type='text'/>",
		"<input type='radio'/>(no <code>name</code>, pointless)",
		"<input type='radio' name='radio-group-1-0'/>(named group of 1, pointless)",
		"<input type='radio' name='radio-group-1-1'/><input type='radio' name='radio-group-1-1'/>(named group of 2)",
		"<input type='radio' name='radio-group-1-2'/><input type='radio' name='radio-group-1-2' checked/>(named group of 2)",
		"<input type='radio' name='radio-group-1-3' checked/><input type='radio' name='radio-group-1-3'/>(named group of 2)",
		"<input type='checkbox'/>",
		"<select></select>",
		"<textarea></textarea>",
		"<button>button</button>",
		"<a href='#'>link</a>",
		"<div>no controls</div>", // not a control :)
		"<div tabIndex='-1'>tabIndex=-1 (not tabbable)</div>",
		"<div tabIndex='0'>tabIndex=0 (tabbable)</div>",
		"<div contenteditable='true'>contenteditable=true</div><br><div contenteditable='true'>another contenteditable=true</div>",
		"<div contenteditable='false'>contenteditable=false (not tabbable)</div>",
		"<div contenteditable='plaintext-only'>contenteditable=plaintext-only</div><br><div contenteditable='plaintext-only'>another contenteditable=plaintext-only</div>",
		"<div tabIndex='-1' contenteditable='true'>tabIndex=-1, contenteditable=true (not tabbable)</div>",
		"<audio controls></audio>",
		"<video controls></video>",
	]) {
		const $w = $Window({
			title: "Tabstop Wrapping",
			resizable: false,
			maximizeButton: false,
			minimizeButton: false,
			// icons: {
			// 	32: "https://win98icons.alexmeub.com/icons/png/accessibility_big_keys.png",
			// 	16: "https://win98icons.alexmeub.com/icons/png/accessibility-5.png",
			// },
		});
		$w.$content.html(`
			<h2 style="font-size: 1em">First Control</h2>
			${control_html}
			<h2 style="font-size: 1em">Last Control</h2>
			${control_html.replace(/radio-group-1/g, "radio-group-2")}
		`).css({
			overflow: "auto",
		});
		$w.css({ left: x, top: y, width: w, height: h });
		x += w + 10;
		if (x > innerWidth - w) {
			x = 0;
			y += h + 10;
		}
	}
});

$app_window_1.center();
$tool_window_1.css({
	top: $app_window_1[0].offsetTop + $app_window_1[0].offsetHeight + 30,
	left: $app_window_1[0].offsetLeft,
});

// Radio buttons should be treated as a group with one tabstop.
// If there's no selected ("checked") radio, it should still visit the group,
// but if there is a selected radio in the group, it should skip all unselected radios in the group.

// todo: test <label> surrounding or not surrounding <input> (do labels even factor in to tabstop wrapping?)
// test hidden controls, disabled controls


const $app_window_2 = new $Window({
	title: "Selectable Text",
	resizable: true,
	icons: {
		16: "https://win98icons.alexmeub.com/icons/png/file_lines-1.png",
	},
});
$app_window_2.$content.append(`
	<p style="user-select: text; cursor: text">You should be able to select text in this window.</p>
	<p style="user-select: text; cursor: text">I also have a control that should be default-focused but not if you select text.</p>
	<button>Button</button>
	<button class="default" disabled>Disabled Default Button</button>
	<button class="default">True Default Button</button>
	<p style="user-select: text; cursor: text">Make sure you test selecting text as the first thing you do upon loading the page.</p>
`);
$app_window_2.css({
	left: innerWidth * 0.3,
	top: innerHeight * 0.75,
});


const $app_window_3 = new $Window({
	title: "Iframe Window", resizable: true,
	icons: {
		16: "https://win98icons.alexmeub.com/icons/png/html-4.png",
		32: "https://win98icons.alexmeub.com/icons/png/html-3.png",
		48: "https://win98icons.alexmeub.com/icons/png/html-5.png",
	},
});
$app_window_3.$content.append(new MenuBar(menus).element);
$app_window_3.$content.append(`
	<iframe class="inset-deep"></iframe>
`);
$app_window_3.find("iframe").attr("srcdoc", `
	<p>This is an iframe test.</p>
	<p>You should be able to focus controls, and restore focus when focusing the window.</p>
	<p>Focus should be restored after selecting menu items.</p>
	<button>Button</button>
	<textarea>Text Area</textarea>
	<iframe class="inset-deep" srcdoc='<p>Nested iframe!</p><button>Button</button>' style="width: 200px; height: 100px;"></iframe>
	<iframe class="inset-deep" src="https://urlme.me/true_story/cross-origin/can't_work.jpg" style="width: 400px; height: 400px;"></iframe>
	<p>You should also be able to select text in this window.</p>
	<link rel="stylesheet" href="../build/layout.css">
	<link rel="stylesheet" href="../build/windows-98.css">
`).css({
	boxSizing: "border-box",
	display: "flex",
	flex: 1,
	margin: 30,
});
$app_window_3.css({
	left: innerWidth * 0.05,
	top: innerHeight * 0.5,
	width: 500,
	height: 400,
});
$app_window_3.$content.css({
	paddingTop: "2px",
	display: "flex",
	flexDirection: "column",
});


const $app_window_4 = new $Window({
	title: "Icon Size Test",
	resizable: true,
	icons: {
		"16": "https://win98icons.alexmeub.com/icons/png/camera3_network-5.png",
		"32": "https://win98icons.alexmeub.com/icons/png/camera3_network-3.png",
		"48": "https://win98icons.alexmeub.com/icons/png/camera3_network-4.png",
	},
});
$app_window_4.$content.append(`
	<p>See different titlebar and icon sizes.</p>
	<button id="size-8">8px</button>
	<button id="size-16"><strong>16px</strong></button>
	<button id="size-24">24px</button>
	<button id="size-32"><strong>32px</strong></button>
	<button id="size-48"><strong>48px</strong></button>
	<button id="size-64">64px</button>
`);
for (const button_el of $app_window_4.find("button")) {
	button_el.addEventListener("click", () => {
		$app_window_4.$titlebar.css({
			height: parseInt(button_el.innerText) + 2,
		});
		$app_window_4.setIconSize(parseInt(button_el.innerText));
	});
}
$app_window_4.css({
	left: innerWidth * 0.8,
	top: innerHeight * 0.5,
});


$app_window_2.bringToFront();
$app_window_1.bringToFront();
