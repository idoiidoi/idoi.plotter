// Run with: node --test test/
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../javascript/idoi.plotter.core.js");

test("SeriesBuffer keeps the newest frames in order", () => {
	const b = new core.SeriesBuffer(3);
	for (let i = 1; i <= 5; i++) b.push([i, i * 10]);
	assert.equal(b.count, 3);
	assert.equal(b.total, 5);
	assert.deepEqual(b.toArray(0), [3, 4, 5]);
	assert.deepEqual(b.toArray(1), [30, 40, 50]);
	assert.equal(b.latest(1), 50);
});

test("SeriesBuffer pads missing channels with NaN", () => {
	const b = new core.SeriesBuffer(4);
	b.push([1]);
	b.push([2, 20]);
	b.push([3]);
	assert.equal(b.numChannels, 2);
	assert.deepEqual(b.toArray(1), [NaN, 20, NaN]);
});

test("SeriesBuffer.resize keeps the newest frames", () => {
	const b = new core.SeriesBuffer(5);
	for (let i = 1; i <= 5; i++) b.push([i]);
	b.resize(3);
	assert.deepEqual(b.toArray(0), [3, 4, 5]);
	b.push([6]);
	assert.deepEqual(b.toArray(0), [4, 5, 6]);
	b.resize(6);
	b.push([7]);
	assert.deepEqual(b.toArray(0), [4, 5, 6, 7]);
});

test("SeriesBuffer rejects non-finite input", () => {
	const b = new core.SeriesBuffer(2);
	b.push([Infinity, "x"]);
	assert.deepEqual(b.toArray(0), [NaN]);
	assert.deepEqual(b.toArray(1), [NaN]);
});

test("movingAverage is a correct trailing mean with warm-up", () => {
	const out = core.movingAverage([1, 2, 3, 4, 5], 3);
	assert.deepEqual(out, [1, 1.5, 2, 3, 4]);
});

test("movingAverage window 1 is identity", () => {
	assert.deepEqual(core.movingAverage([3, 1, 2], 1), [3, 1, 2]);
});

test("movingAverage skips NaN and keeps gaps", () => {
	const out = core.movingAverage([2, NaN, 4, 6], 2);
	assert.deepEqual(out, [2, NaN, 4, 5]);
});

test("extent ignores NaN and handles empty input", () => {
	assert.deepEqual(core.extent([[1, NaN, -2], [5]]), { min: -2, max: 5 });
	assert.equal(core.extent([[NaN], []]), null);
});

test("padRange gives flat data a non-zero height", () => {
	const r = core.padRange(3, 3, 0.05);
	assert.ok(r.max > r.min);
	const z = core.padRange(0, 0, 0.05);
	assert.deepEqual(z, { min: -0.5, max: 0.5 });
});

test("niceTicks returns round values inside the range", () => {
	assert.deepEqual(core.niceTicks(0, 1, 5), [0, 0.2, 0.4, 0.6, 0.8, 1]);
	const t = core.niceTicks(-3.7, 12.2, 4);
	assert.deepEqual(t, [0, 5, 10]);
	assert.deepEqual(core.niceTicks(1, 1, 5), []);
});

test("mapRange does not divide by zero", () => {
	assert.equal(core.mapRange(5, 1, 1, 0, 10), 5);
	assert.equal(core.mapRange(0.5, 0, 1, 100, 0), 50);
});

test("formatValue picks decimals from the step", () => {
	assert.equal(core.formatValue(0.25, 0.05), "0.25");
	assert.equal(core.formatValue(150, 50), "150");
	assert.equal(core.formatValue(NaN, 1), "-");
});
