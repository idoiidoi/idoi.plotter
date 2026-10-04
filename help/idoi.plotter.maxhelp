{
	"patcher": {
		"fileversion": 1,
		"appversion": {
			"major": 9,
			"minor": 1,
			"revision": 0,
			"architecture": "x64",
			"modernui": 1
		},
		"classnamespace": "box",
		"rect": [
			100.0,
			80.0,
			880.0,
			840.0
		],
		"gridsize": [
			15.0,
			15.0
		],
		"boxes": [
			{
				"box": {
					"id": "obj-1",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						20.0,
						12.0,
						300.0,
						32.0
					],
					"text": "idoi.plotter",
					"fontsize": 22.0,
					"fontface": 1
				}
			},
			{
				"box": {
					"id": "obj-2",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						20.0,
						44.0,
						460.0,
						20.0
					],
					"text": "Real-time multi-channel time series plotter (v8ui, Max 9+)"
				}
			},
			{
				"box": {
					"id": "obj-3",
					"maxclass": "v8ui",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						20.0,
						470.0,
						820.0,
						240.0
					],
					"outlettype": [
						""
					],
					"filename": "idoi.plotter.js",
					"parameter_enable": 0,
					"border": 0
				}
			},
			{
				"box": {
					"id": "obj-4",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						20.0,
						76.0,
						200.0,
						20.0
					],
					"text": "demo data: 3 channels"
				}
			},
			{
				"box": {
					"id": "obj-5",
					"maxclass": "toggle",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						20.0,
						100.0,
						20.0,
						20.0
					],
					"outlettype": [
						"int"
					],
					"parameter_enable": 0
				}
			},
			{
				"box": {
					"id": "obj-6",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						20.0,
						128.0,
						70.0,
						22.0
					],
					"outlettype": [
						"bang"
					],
					"text": "metro 20"
				}
			},
			{
				"box": {
					"id": "obj-7",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 3,
					"patching_rect": [
						20.0,
						156.0,
						63.0,
						22.0
					],
					"outlettype": [
						"bang",
						"bang",
						"bang"
					],
					"text": "t b b b"
				}
			},
			{
				"box": {
					"id": "obj-8",
					"maxclass": "newobj",
					"numinlets": 3,
					"numoutlets": 4,
					"patching_rect": [
						20.0,
						186.0,
						63.0,
						22.0
					],
					"outlettype": [
						"int",
						"",
						"",
						"int"
					],
					"text": "counter"
				}
			},
			{
				"box": {
					"id": "obj-9",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						20.0,
						214.0,
						154.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "expr sin($i1 * 0.05)"
				}
			},
			{
				"box": {
					"id": "obj-10",
					"maxclass": "newobj",
					"numinlets": 3,
					"numoutlets": 1,
					"patching_rect": [
						120.0,
						186.0,
						98.0,
						22.0
					],
					"outlettype": [
						"int"
					],
					"text": "drunk 200 20"
				}
			},
			{
				"box": {
					"id": "obj-11",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						120.0,
						214.0,
						56.0,
						22.0
					],
					"outlettype": [
						"float"
					],
					"text": "/ 200."
				}
			},
			{
				"box": {
					"id": "obj-12",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						210.0,
						186.0,
						84.0,
						22.0
					],
					"outlettype": [
						"int"
					],
					"text": "random 100"
				}
			},
			{
				"box": {
					"id": "obj-13",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						210.0,
						214.0,
						168.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "expr $i1 * 0.004 - 0.7"
				}
			},
			{
				"box": {
					"id": "obj-14",
					"maxclass": "newobj",
					"numinlets": 3,
					"numoutlets": 1,
					"patching_rect": [
						20.0,
						250.0,
						105.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "pack 0. 0. 0."
				}
			},
			{
				"box": {
					"id": "obj-15",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						50.0,
						100.0,
						84.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "loadmess 1"
				}
			},
			{
				"box": {
					"id": "obj-16",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						120.0,
						250.0,
						240.0,
						40.0
					],
					"text": "Send a list (one value per channel)\nor a single float."
				}
			},
			{
				"box": {
					"id": "obj-17",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						400.0,
						76.0,
						200.0,
						20.0
					],
					"text": "messages / attributes",
					"fontface": 1
				}
			},
			{
				"box": {
					"id": "obj-18",
					"maxclass": "toggle",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						103.0,
						20.0,
						20.0
					],
					"outlettype": [
						"int"
					],
					"parameter_enable": 0
				}
			},
			{
				"box": {
					"id": "obj-19",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						428.0,
						102.0,
						98.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "autoscale $1"
				}
			},
			{
				"box": {
					"id": "obj-20",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						103.0,
						260.0,
						20.0
					],
					"text": "auto Y range (double click toggles)"
				}
			},
			{
				"box": {
					"id": "obj-21",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						145.0,
						102.0,
						175.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "r idoi.plotter.help.autoscale"
				}
			},
			{
				"box": {
					"id": "obj-22",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						325.0,
						102.0,
						70.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-23",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						128.0,
						126.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "ybounds -1.5 1.5"
				}
			},
			{
				"box": {
					"id": "obj-24",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						129.0,
						260.0,
						20.0
					],
					"text": "fixed Y range, turns autoscale off"
				}
			},
			{
				"box": {
					"id": "obj-25",
					"maxclass": "number",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						400.0,
						154.0,
						50.0,
						22.0
					],
					"outlettype": [
						"",
						"bang"
					],
					"parameter_enable": 0,
					"minimum": 1
				}
			},
			{
				"box": {
					"id": "obj-26",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						456.0,
						154.0,
						77.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "smooth $1"
				}
			},
			{
				"box": {
					"id": "obj-27",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						155.0,
						260.0,
						20.0
					],
					"text": "moving average window (1 = raw)"
				}
			},
			{
				"box": {
					"id": "obj-28",
					"maxclass": "number",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						400.0,
						180.0,
						50.0,
						22.0
					],
					"outlettype": [
						"",
						"bang"
					],
					"parameter_enable": 0,
					"minimum": 2
				}
			},
			{
				"box": {
					"id": "obj-29",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						456.0,
						180.0,
						84.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "samples $1"
				}
			},
			{
				"box": {
					"id": "obj-30",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						181.0,
						260.0,
						20.0
					],
					"text": "buffer length in samples"
				}
			},
			{
				"box": {
					"id": "obj-31",
					"maxclass": "flonum",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						400.0,
						206.0,
						50.0,
						22.0
					],
					"outlettype": [
						"",
						"bang"
					],
					"parameter_enable": 0,
					"minimum": 0.1
				}
			},
			{
				"box": {
					"id": "obj-32",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						456.0,
						206.0,
						98.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "linewidth $1"
				}
			},
			{
				"box": {
					"id": "obj-33",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						207.0,
						260.0,
						20.0
					],
					"text": "line width in pixels"
				}
			},
			{
				"box": {
					"id": "obj-34",
					"maxclass": "number",
					"numinlets": 1,
					"numoutlets": 2,
					"patching_rect": [
						400.0,
						232.0,
						50.0,
						22.0
					],
					"outlettype": [
						"",
						"bang"
					],
					"parameter_enable": 0,
					"minimum": 0
				}
			},
			{
				"box": {
					"id": "obj-35",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						456.0,
						232.0,
						70.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "gridx $1"
				}
			},
			{
				"box": {
					"id": "obj-36",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						233.0,
						260.0,
						20.0
					],
					"text": "vertical grid every N samples (0 = off)"
				}
			},
			{
				"box": {
					"id": "obj-37",
					"maxclass": "toggle",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						259.0,
						20.0,
						20.0
					],
					"outlettype": [
						"int"
					],
					"parameter_enable": 0
				}
			},
			{
				"box": {
					"id": "obj-38",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						428.0,
						258.0,
						70.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "gridy $1"
				}
			},
			{
				"box": {
					"id": "obj-39",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						259.0,
						260.0,
						20.0
					],
					"text": "horizontal grid + Y labels"
				}
			},
			{
				"box": {
					"id": "obj-40",
					"maxclass": "toggle",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						285.0,
						20.0,
						20.0
					],
					"outlettype": [
						"int"
					],
					"parameter_enable": 0
				}
			},
			{
				"box": {
					"id": "obj-41",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						428.0,
						284.0,
						77.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "legend $1"
				}
			},
			{
				"box": {
					"id": "obj-42",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						285.0,
						260.0,
						20.0
					],
					"text": "channel names + latest values"
				}
			},
			{
				"box": {
					"id": "obj-43",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						310.0,
						168.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "names sine drunk noise"
				}
			},
			{
				"box": {
					"id": "obj-44",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						311.0,
						260.0,
						20.0
					],
					"text": "channel names"
				}
			},
			{
				"box": {
					"id": "obj-45",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						336.0,
						147.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "setcolor 0 0. 0. 0."
				}
			},
			{
				"box": {
					"id": "obj-46",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						337.0,
						260.0,
						20.0
					],
					"text": "color of channel 0 (r g b, 0-1)"
				}
			},
			{
				"box": {
					"id": "obj-47",
					"maxclass": "toggle",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						363.0,
						20.0,
						20.0
					],
					"outlettype": [
						"int"
					],
					"parameter_enable": 0
				}
			},
			{
				"box": {
					"id": "obj-48",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						428.0,
						362.0,
						70.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "pause $1"
				}
			},
			{
				"box": {
					"id": "obj-49",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						363.0,
						260.0,
						20.0
					],
					"text": "freeze the display"
				}
			},
			{
				"box": {
					"id": "obj-50",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						388.0,
						49.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "clear"
				}
			},
			{
				"box": {
					"id": "obj-51",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						389.0,
						260.0,
						20.0
					],
					"text": "clear data, keep the view"
				}
			},
			{
				"box": {
					"id": "obj-52",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						400.0,
						414.0,
						49.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "reset"
				}
			},
			{
				"box": {
					"id": "obj-53",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						590.0,
						415.0,
						260.0,
						20.0
					],
					"text": "clear data, back to autoscale"
				}
			},
			{
				"box": {
					"id": "obj-54",
					"maxclass": "newobj",
					"numinlets": 2,
					"numoutlets": 2,
					"patching_rect": [
						20.0,
						720.0,
						100.0,
						22.0
					],
					"outlettype": [
						"",
						""
					],
					"text": "route autoscale"
				}
			},
			{
				"box": {
					"id": "obj-55",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						20.0,
						750.0,
						190.0,
						22.0
					],
					"text": "s idoi.plotter.help.autoscale"
				}
			},
			{
				"box": {
					"id": "obj-56",
					"maxclass": "newobj",
					"numinlets": 1,
					"numoutlets": 1,
					"patching_rect": [
						220.0,
						750.0,
						80.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": "prepend set"
				}
			},
			{
				"box": {
					"id": "obj-57",
					"maxclass": "message",
					"numinlets": 2,
					"numoutlets": 1,
					"patching_rect": [
						310.0,
						750.0,
						220.0,
						22.0
					],
					"outlettype": [
						""
					],
					"text": ""
				}
			},
			{
				"box": {
					"id": "obj-58",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						450.0,
						720.0,
						330.0,
						40.0
					],
					"text": "mouse zoom / pan / double click reports the view.\nthe autoscale toggle follows it."
				}
			},
			{
				"box": {
					"id": "obj-59",
					"maxclass": "comment",
					"numinlets": 1,
					"numoutlets": 0,
					"patching_rect": [
						20.0,
						300.0,
						330.0,
						80.0
					],
					"text": "mouse:\n  drag = zoom Y around the cursor (shift = fine)\n  cmd/ctrl + drag = move Y range\n  double click = toggle autoscale"
				}
			}
		],
		"lines": [
			{
				"patchline": {
					"source": [
						"obj-15",
						0
					],
					"destination": [
						"obj-5",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-5",
						0
					],
					"destination": [
						"obj-6",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-6",
						0
					],
					"destination": [
						"obj-7",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-7",
						2
					],
					"destination": [
						"obj-12",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-7",
						1
					],
					"destination": [
						"obj-10",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-7",
						0
					],
					"destination": [
						"obj-8",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-8",
						0
					],
					"destination": [
						"obj-9",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-10",
						0
					],
					"destination": [
						"obj-11",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-12",
						0
					],
					"destination": [
						"obj-13",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-9",
						0
					],
					"destination": [
						"obj-14",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-11",
						0
					],
					"destination": [
						"obj-14",
						1
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-13",
						0
					],
					"destination": [
						"obj-14",
						2
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-14",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-18",
						0
					],
					"destination": [
						"obj-19",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-19",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-21",
						0
					],
					"destination": [
						"obj-22",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-22",
						0
					],
					"destination": [
						"obj-18",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-23",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-25",
						0
					],
					"destination": [
						"obj-26",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-26",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-28",
						0
					],
					"destination": [
						"obj-29",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-29",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-31",
						0
					],
					"destination": [
						"obj-32",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-32",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-34",
						0
					],
					"destination": [
						"obj-35",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-35",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-37",
						0
					],
					"destination": [
						"obj-38",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-38",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-40",
						0
					],
					"destination": [
						"obj-41",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-41",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-43",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-45",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-47",
						0
					],
					"destination": [
						"obj-48",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-48",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-50",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-52",
						0
					],
					"destination": [
						"obj-3",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-3",
						0
					],
					"destination": [
						"obj-54",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-54",
						0
					],
					"destination": [
						"obj-55",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-54",
						1
					],
					"destination": [
						"obj-56",
						0
					]
				}
			},
			{
				"patchline": {
					"source": [
						"obj-56",
						0
					],
					"destination": [
						"obj-57",
						0
					]
				}
			}
		],
		"dependency_cache": [],
		"autosave": 0
	}
}
