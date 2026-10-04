// idoi.plotter.js -- real-time multi-channel time series plotter for v8ui (Max 9+)
//
// Usage: [v8ui @filename idoi.plotter.js]
// Send lists (one value per channel) or single numbers into the inlet.
// See help/idoi.plotter.maxhelp and README.md for all messages and attributes.

"use strict";

const core = require("idoi.plotter.core.js");

inlets = 1;
outlets = 1;

setinletassist(0, "list / float: one value per channel, messages");
setoutletassist(0, "autoscale <0/1>, ybounds <min> <max> when the view is changed by mouse");

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// ---------------------------------------------------------------------------
// Attributes (saved with the patcher)
// Backing variables use `var` as required by v8's declareattribute.

var samples = 300;
var autoscale = 1;
var ymin = 0;
var ymax = 1;
var smooth = 1;
var linewidth = 1.5;
var gridx = 100;
var gridy = 1;
var legend = 1;
var fps = 30;
var names = [];
var colors = [];
var background = [1, 1, 1, 1];

declareattribute("samples", { setter: "setSamples", type: "long", min: 2, default: 300, embed: 1,
	label: "Buffer Length (samples)" });
declareattribute("autoscale", { setter: "setAutoscale", style: "onoff", default: 1, embed: 1,
	label: "Auto Scale Y" });
declareattribute("ymin", { setter: "setYmin", type: "float", default: 0, embed: 1, label: "Y Minimum" });
declareattribute("ymax", { setter: "setYmax", type: "float", default: 1, embed: 1, label: "Y Maximum" });
declareattribute("smooth", { setter: "setSmooth", type: "long", min: 1, default: 1, embed: 1,
	label: "Moving Average Window (1 = off)" });
declareattribute("linewidth", { setter: "setLinewidth", type: "float", min: 0.1, default: 1.5, embed: 1,
	label: "Line Width" });
declareattribute("gridx", { setter: "setGridx", type: "long", min: 0, default: 100, embed: 1,
	label: "Vertical Grid Every N Samples (0 = off)" });
declareattribute("gridy", { setter: "setGridy", style: "onoff", default: 1, embed: 1, label: "Horizontal Grid" });
declareattribute("legend", { setter: "setLegend", style: "onoff", default: 1, embed: 1,
	label: "Legend / Latest Values" });
declareattribute("fps", { setter: "setFps", type: "long", min: 1, max: 120, default: 30, embed: 1,
	label: "Redraw Rate (fps)" });
declareattribute("names", { setter: "setNames", embed: 1, label: "Channel Names" });
declareattribute("colors", { setter: "setColors", embed: 1, label: "Channel Colors (r g b ...)" });
declareattribute("background", { setter: "setBackground", style: "rgba", default: [1, 1, 1, 1], embed: 1,
	label: "Background Color" });

// ---------------------------------------------------------------------------
// State

const buffer = new core.SeriesBuffer(samples);
let paused = false;
let dirty = true;
let compatWindow = 3; // remembered by `windowsize` for the legacy `interpolation` message

const mouse = { startY: 0, y: 0, value: 0, dragging: false, ignore: false };

// Layout of the last paint, used for mouse -> value conversion.
const plot = { x: 0, y: 0, w: 1, h: 1 };

const redrawTask = new Task(onTick, this);
redrawTask.interval = 1000 / fps;
redrawTask.repeat();

function onTick() {
	if (!dirty) return;
	dirty = false;
	mgraphics.redraw();
}
onTick.local = 1;

function invalidate() {
	dirty = true;
}
invalidate.local = 1;

function notifydeleted() {
	redrawTask.cancel();
}

// ---------------------------------------------------------------------------
// Attribute setters

function num(v, fallback) {
	v = Number(v);
	return Number.isFinite(v) ? v : fallback;
}
num.local = 1;

function setSamples(v) {
	samples = Math.max(2, Math.floor(num(v, 300)));
	buffer.resize(samples);
	invalidate();
}

function setAutoscale(v) {
	autoscale = num(v, 0) ? 1 : 0;
	invalidate();
}

function setYmin(v) {
	ymin = num(v, ymin);
	invalidate();
}

function setYmax(v) {
	ymax = num(v, ymax);
	invalidate();
}

function setSmooth(v) {
	smooth = Math.max(1, Math.floor(num(v, 1)));
	invalidate();
}

function setLinewidth(v) {
	linewidth = Math.max(0.1, num(v, 1.5));
	invalidate();
}

function setGridx(v) {
	gridx = Math.max(0, Math.floor(num(v, 0)));
	invalidate();
}

function setGridy(v) {
	gridy = num(v, 0) ? 1 : 0;
	invalidate();
}

function setLegend(v) {
	legend = num(v, 0) ? 1 : 0;
	invalidate();
}

function setFps(v) {
	fps = Math.min(120, Math.max(1, Math.floor(num(v, 30))));
	redrawTask.interval = 1000 / fps;
}

function setNames(...args) {
	names = args.map(String);
	invalidate();
}

function setColors(...args) {
	colors = args.map((v) => num(v, 0));
	invalidate();
}

function setBackground(...args) {
	if (args.length >= 3) {
		background = [num(args[0], 1), num(args[1], 1), num(args[2], 1), num(args[3], 1)];
		invalidate();
	}
}

// ---------------------------------------------------------------------------
// Data input

function list(...values) {
	if (paused) return;
	buffer.push(values);
	invalidate();
}

function msg_float(v) {
	list(v);
}

function msg_int(v) {
	list(v);
}

// ---------------------------------------------------------------------------
// Messages

// pause 1 / pause 0: freeze the display, incoming data is dropped.
function pause(v) {
	paused = v === undefined ? !paused : !!v;
	invalidate();
}

// Clear the data only. The view settings are kept.
function clear() {
	buffer.clear();
	invalidate();
}

// Clear the data and return to auto scaling.
function reset() {
	buffer.clear();
	setAutoscale(1);
}

// ybounds <min> <max>: set the Y range and turn auto scaling off.
function ybounds(min, max) {
	min = num(min, ymin);
	max = num(max, ymax);
	if (min > max) [min, max] = [max, min];
	ymin = min;
	ymax = max;
	autoscale = 0;
	invalidate();
}

// setcolor <channel> <r> <g> <b>: channel numbers start at 0.
function setcolor(idx, r, g, b) {
	idx = Math.floor(num(idx, -1));
	if (idx < 0) {
		post("idoi.plotter: setcolor needs a channel index >= 0\n");
		return;
	}
	const next = colors.slice();
	while (next.length < idx * 3 + 3) {
		const c = core.defaultColor(next.length / 3);
		next.push(c[0], c[1], c[2]);
	}
	next[idx * 3] = num(r, 0);
	next[idx * 3 + 1] = num(g, 0);
	next[idx * 3 + 2] = num(b, 0);
	setColors(...next);
}

// label <channel> <text>: set one channel name for the legend.
function label(idx, ...text) {
	idx = Math.floor(num(idx, -1));
	if (idx < 0) return;
	const next = names.slice();
	while (next.length <= idx) next.push(String(next.length));
	next[idx] = text.join(" ");
	setNames(...next);
}

// --- Messages kept for compatibility with the jsui version ---

function setColor(idx, r, g, b) {
	setcolor(idx, r, g, b);
}

function lineinterval(step) {
	setGridx(step);
}

function windowsize(n) {
	compatWindow = Math.max(1, Math.floor(num(n, 3)));
	if (smooth > 1) setSmooth(compatWindow);
}

function interpolation(mode) {
	setSmooth(num(mode, 0) ? compatWindow : 1);
}

function anything() {
	post("idoi.plotter: unknown message \"" + messagename + "\"\n");
}

// ---------------------------------------------------------------------------
// Drawing

const FONT = "Arial";
const FONT_SIZE = 10;
const TEXT_COLOR = [0.25, 0.25, 0.25, 1];
const GRID_COLOR = [0.85, 0.85, 0.85, 1];
const ZERO_COLOR = [0.65, 0.65, 0.65, 1];

function channelColor(c) {
	if (colors.length >= c * 3 + 3) return [colors[c * 3], colors[c * 3 + 1], colors[c * 3 + 2], 1];
	const d = core.defaultColor(c);
	return [d[0], d[1], d[2], 1];
}
channelColor.local = 1;

function channelName(c) {
	return names[c] !== undefined && names[c] !== "" ? names[c] : String(c);
}
channelName.local = 1;

// Series as drawn (raw or smoothed), one array per channel.
function displaySeries() {
	const out = [];
	for (let c = 0; c < buffer.numChannels; c++) {
		out.push(core.movingAverage(buffer.toArray(c), smooth));
	}
	return out;
}
displaySeries.local = 1;

function paint() {
	const [width, height] = mgraphics.size;
	const series = displaySeries();

	if (autoscale) {
		const e = core.extent(series);
		if (e) {
			const r = core.padRange(e.min, e.max, 0.05);
			ymin = r.min;
			ymax = r.max;
		}
	}
	const view = ymax - ymin > 1e-12 ? { min: ymin, max: ymax } : core.padRange(ymin, ymax, 0);

	mgraphics.select_font_face(FONT);
	mgraphics.set_font_size(FONT_SIZE);

	const ticks = gridy ? core.niceTicks(view.min, view.max, Math.max(2, Math.floor(height / 40))) : [];
	const tickStep = ticks.length > 1 ? ticks[1] - ticks[0] : (view.max - view.min) / 4;
	const labels = ticks.map((t) => core.formatValue(t, tickStep));
	let gutter = 0;
	for (const s of labels) gutter = Math.max(gutter, mgraphics.text_measure(s)[0]);
	gutter = gutter > 0 ? gutter + 8 : 0;

	plot.x = gutter;
	plot.y = 4;
	plot.w = Math.max(1, width - gutter - 4);
	plot.h = Math.max(1, height - 8);

	const yOf = (v) => core.mapRange(v, view.min, view.max, plot.y + plot.h, plot.y);

	// background
	mgraphics.set_source_rgba(background);
	mgraphics.rectangle(0, 0, width, height);
	mgraphics.fill();

	// x: the whole buffer spans the plot width, newest sample at the right edge
	const dx = plot.w / (buffer.capacity - 1);
	const right = plot.x + plot.w;
	const count = buffer.count;
	const xOf = (i) => right - (count - 1 - i) * dx;

	// vertical grid, aligned to the absolute sample index so it scrolls with the data
	if (gridx > 0 && count > 0) {
		const firstAbs = buffer.total - count;
		mgraphics.set_source_rgba(GRID_COLOR);
		for (let k = Math.ceil(firstAbs / gridx); k * gridx <= buffer.total - 1; k++) {
			const x = Math.round(xOf(k * gridx - firstAbs)) + 0.5;
			mgraphics.move_to(x, plot.y);
			mgraphics.line_to(x, plot.y + plot.h);
		}
		mgraphics.stroke();
	}

	// horizontal grid
	mgraphics.set_line_width(1);
	for (const t of ticks) {
		const y = Math.round(yOf(t)) + 0.5;
		mgraphics.set_source_rgba(t === 0 ? ZERO_COLOR : GRID_COLOR);
		mgraphics.move_to(plot.x, y);
		mgraphics.line_to(plot.x + plot.w, y);
		mgraphics.stroke();
	}

	// series
	mgraphics.set_line_width(linewidth);
	mgraphics.set_line_join("round");
	mgraphics.set_line_cap("round");
	for (let c = 0; c < series.length; c++) {
		drawSeries(series[c], xOf, yOf, dx);
		mgraphics.set_source_rgba(channelColor(c));
		mgraphics.stroke();
	}

	// mgraphics has no clip(), so cover everything outside the plot area
	mgraphics.set_source_rgba(background);
	mgraphics.rectangle(0, 0, width, plot.y);
	mgraphics.rectangle(0, plot.y + plot.h, width, height - plot.y - plot.h);
	mgraphics.rectangle(0, 0, plot.x, height);
	mgraphics.rectangle(plot.x + plot.w, 0, width - plot.x - plot.w, height);
	mgraphics.fill();

	// Y labels
	mgraphics.set_source_rgba(TEXT_COLOR);
	for (let i = 0; i < ticks.length; i++) {
		const y = yOf(ticks[i]);
		const tw = mgraphics.text_measure(labels[i])[0];
		mgraphics.move_to(gutter - 4 - tw, Math.min(height - 2, Math.max(FONT_SIZE, y + FONT_SIZE / 2 - 1)));
		mgraphics.show_text(labels[i]);
	}

	if (legend && series.length > 0) drawLegend(series);

	if (paused) {
		mgraphics.set_source_rgba(TEXT_COLOR);
		const tw = mgraphics.text_measure("paused")[0];
		mgraphics.move_to(right - tw - 4, plot.y + plot.h - 4);
		mgraphics.show_text("paused");
	}
}

// Build the path for one series. NaN breaks the line. When there are more
// samples than pixels, each pixel column is reduced to its min and max so
// spikes stay visible and the cost is bounded by the plot width.
function drawSeries(values, xOf, yOf, dx) {
	const perPixel = 1 / dx;
	let penDown = false;

	if (perPixel <= 2) {
		for (let i = 0; i < values.length; i++) {
			const v = values[i];
			if (Number.isNaN(v)) { penDown = false; continue; }
			const x = xOf(i);
			const y = yOf(v);
			if (penDown) mgraphics.line_to(x, y);
			else { mgraphics.move_to(x, y); penDown = true; }
		}
		return;
	}

	let col = null;
	let lo = 0, hi = 0, loI = 0, hiI = 0;
	const flush = () => {
		const a = loI <= hiI ? lo : hi;
		const b = loI <= hiI ? hi : lo;
		const x = col + 0.5;
		if (penDown) mgraphics.line_to(x, yOf(a));
		else { mgraphics.move_to(x, yOf(a)); penDown = true; }
		if (a !== b) mgraphics.line_to(x, yOf(b));
	};
	for (let i = 0; i < values.length; i++) {
		const v = values[i];
		if (Number.isNaN(v)) {
			if (col !== null) flush();
			col = null;
			penDown = false;
			continue;
		}
		const px = Math.floor(xOf(i));
		if (px !== col) {
			if (col !== null) flush();
			col = px; lo = hi = v; loI = hiI = i;
		} else {
			if (v < lo) { lo = v; loI = i; }
			if (v > hi) { hi = v; hiI = i; }
		}
	}
	if (col !== null) flush();
}
drawSeries.local = 1;

function drawLegend(series) {
	const sw = 8;
	const pad = 4;
	let x = plot.x + pad;
	let y = plot.y + pad;
	for (let c = 0; c < series.length; c++) {
		const latest = series[c].length ? series[c][series[c].length - 1] : NaN;
		const label = channelName(c) + " " + core.formatValue(latest, 0.001);
		const tw = mgraphics.text_measure(label)[0];
		const itemW = sw + 4 + tw + 10;
		if (x + itemW > plot.x + plot.w && x > plot.x + pad) {
			x = plot.x + pad;
			y += FONT_SIZE + 4;
		}
		mgraphics.set_source_rgba(background[0], background[1], background[2], 0.75);
		mgraphics.rectangle(x - 2, y - 1, itemW - 6, FONT_SIZE + 3);
		mgraphics.fill();
		mgraphics.set_source_rgba(channelColor(c));
		mgraphics.rectangle(x, y + 1, sw, sw);
		mgraphics.fill();
		mgraphics.set_source_rgba(TEXT_COLOR);
		mgraphics.move_to(x + sw + 4, y + FONT_SIZE - 1);
		mgraphics.show_text(label);
		x += itemW;
	}
}
drawLegend.local = 1;

// ---------------------------------------------------------------------------
// Mouse
//   drag             zoom Y around the clicked value (shift: fine)
//   cmd/ctrl + drag  move Y range up/down
//   double click     toggle auto scaling

function valueAt(y) {
	return core.mapRange(y, plot.y + plot.h, plot.y, ymin, ymax);
}
valueAt.local = 1;

// Mouse changes to the view (and the initial state on load) are reported
// so other UI can follow.
function reportView() {
	outlet(0, "autoscale", autoscale);
	outlet(0, "ybounds", ymin, ymax);
}
reportView.local = 1;

function loadbang() {
	reportView();
}

const DRAG_THRESHOLD = 3; // pixels before a click turns into a drag

function onclick(x, y) {
	mouse.startY = y;
	mouse.y = y;
	mouse.value = valueAt(y);
	mouse.dragging = false;
	mouse.ignore = false;
}
onclick.local = 1;

function ondrag(x, y, but, cmd, shift, capslock, option, ctrl) {
	if (!but) {
		if (mouse.dragging) reportView();
		mouse.dragging = false;
		mouse.ignore = false;
		return;
	}
	if (mouse.ignore) return;
	if (!mouse.dragging) {
		if (Math.abs(y - mouse.startY) < DRAG_THRESHOLD) return;
		mouse.dragging = true;
	}
	const dy = y - mouse.y;
	mouse.y = y;
	if (dy === 0) return;
	autoscale = 0;

	if (cmd || ctrl) {
		const shiftBy = dy * (ymax - ymin) / plot.h;
		ymin += shiftBy;
		ymax += shiftBy;
	} else {
		const factor = Math.exp(dy * (shift ? 0.002 : 0.01));
		ymin = mouse.value + (ymin - mouse.value) * factor;
		ymax = mouse.value + (ymax - mouse.value) * factor;
	}
	invalidate();
}
ondrag.local = 1;

function ondblclick() {
	// Max may deliver this before or after the second mouse up;
	// either way no drag may follow until the next click.
	mouse.ignore = true;
	setAutoscale(autoscale ? 0 : 1);
	reportView();
}
ondblclick.local = 1;

function onresize() {
	invalidate();
}
onresize.local = 1;
