// idoi.plotter.core.js
// Drawing-independent logic for idoi.plotter. No Max globals are used here,
// so this file can be unit-tested with plain node (see test/core.test.js).

"use strict";

// Fixed-capacity multi-channel ring buffer. Missing values are stored as NaN,
// so the channel count may change while streaming.
class SeriesBuffer {
	constructor(capacity) {
		this.capacity = Math.max(2, Math.floor(capacity) || 2);
		this.channels = []; // Float64Array per channel
		this.head = 0;      // next write position
		this.count = 0;     // number of valid frames (<= capacity)
		this.total = 0;     // frames pushed since last clear (absolute index)
	}

	get numChannels() {
		return this.channels.length;
	}

	ensureChannels(n) {
		while (this.channels.length < n) {
			this.channels.push(new Float64Array(this.capacity).fill(NaN));
		}
	}

	push(values) {
		this.ensureChannels(values.length);
		for (let c = 0; c < this.channels.length; c++) {
			const v = c < values.length ? Number(values[c]) : NaN;
			this.channels[c][this.head] = Number.isFinite(v) ? v : NaN;
		}
		this.head = (this.head + 1) % this.capacity;
		if (this.count < this.capacity) this.count++;
		this.total++;
	}

	// i = 0 is the oldest valid frame, i = count - 1 the newest.
	get(channel, i) {
		const ch = this.channels[channel];
		if (!ch || i < 0 || i >= this.count) return NaN;
		return ch[(this.head - this.count + i + this.capacity) % this.capacity];
	}

	latest(channel) {
		return this.get(channel, this.count - 1);
	}

	// Copy one channel into a plain array, oldest first.
	toArray(channel) {
		const out = new Array(this.count);
		for (let i = 0; i < this.count; i++) out[i] = this.get(channel, i);
		return out;
	}

	resize(capacity) {
		capacity = Math.max(2, Math.floor(capacity) || 2);
		if (capacity === this.capacity) return;
		const keep = Math.min(this.count, capacity);
		const old = this.channels.map((_, c) => this.toArray(c).slice(this.count - keep));
		this.capacity = capacity;
		this.channels = old.map((arr) => {
			const ch = new Float64Array(capacity).fill(NaN);
			ch.set(arr);
			return ch;
		});
		this.count = keep;
		this.head = keep % capacity;
	}

	clear() {
		this.channels = [];
		this.head = 0;
		this.count = 0;
		this.total = 0;
	}
}

// Trailing moving average over `window` samples. NaN samples are skipped;
// during warm-up the average uses however many samples are available.
// O(n) regardless of window size, recomputed from scratch so there is no
// accumulated drift and window changes take effect immediately.
function movingAverage(values, window) {
	window = Math.max(1, Math.floor(window) || 1);
	const n = values.length;
	const out = new Array(n);
	if (window === 1) {
		for (let i = 0; i < n; i++) out[i] = values[i];
		return out;
	}
	let sum = 0;
	let valid = 0;
	for (let i = 0; i < n; i++) {
		const v = values[i];
		if (!Number.isNaN(v)) { sum += v; valid++; }
		if (i >= window) {
			const old = values[i - window];
			if (!Number.isNaN(old)) { sum -= old; valid--; }
		}
		out[i] = valid > 0 && !Number.isNaN(v) ? sum / valid : NaN;
	}
	return out;
}

// Min/max over a list of series, ignoring NaN. Returns null when empty.
function extent(seriesList) {
	let min = Infinity;
	let max = -Infinity;
	for (const s of seriesList) {
		for (let i = 0; i < s.length; i++) {
			const v = s[i];
			if (v < min) min = v;
			if (v > max) max = v;
		}
	}
	return min <= max ? { min, max } : null;
}

// Pad a range so lines do not touch the edges, and give flat data a height.
function padRange(min, max, ratio) {
	if (max - min < 1e-12) {
		const d = Math.abs(min) > 1e-12 ? Math.abs(min) * 0.1 : 0.5;
		return { min: min - d, max: max + d };
	}
	const pad = (max - min) * (ratio || 0);
	return { min: min - pad, max: max + pad };
}

// "Nice" tick values (1, 2, 5 x 10^n) covering [min, max] with roughly `count` ticks.
function niceTicks(min, max, count) {
	if (!(max > min) || !Number.isFinite(min) || !Number.isFinite(max)) return [];
	count = Math.max(2, count || 5);
	const raw = (max - min) / count;
	const mag = Math.pow(10, Math.floor(Math.log10(raw)));
	const norm = raw / mag;
	const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
	const ticks = [];
	const first = Math.ceil(min / step - 1e-9);
	const last = Math.floor(max / step + 1e-9);
	for (let k = first; k <= last; k++) {
		ticks.push(k === 0 ? 0 : parseFloat((k * step).toPrecision(12)));
	}
	return ticks;
}

// Format a value with precision suited to the tick step.
function formatValue(v, step) {
	if (!Number.isFinite(v)) return "-";
	const decimals = step > 0 ? Math.max(0, Math.min(6, -Math.floor(Math.log10(step)))) : 2;
	return v.toFixed(decimals);
}

function mapRange(v, inMin, inMax, outMin, outMax) {
	const span = inMax - inMin;
	if (span === 0) return (outMin + outMax) / 2;
	return (v - inMin) * (outMax - outMin) / span + outMin;
}

function hslToRgb(h, s, l) {
	if (s === 0) return [l, l, l];
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

// Default color for channel i. Uses the golden angle so colors stay
// distinct and stable no matter how many channels arrive later.
function defaultColor(i) {
	const h = (0.6 + i * 0.381966) % 1;
	return hslToRgb(h, 0.7, 0.45);
}

const core = {
	SeriesBuffer,
	movingAverage,
	extent,
	padRange,
	niceTicks,
	formatValue,
	mapRange,
	hslToRgb,
	defaultColor,
};

if (typeof module !== "undefined" && module.exports) {
	module.exports = core;
}
