#!/usr/bin/env python3
"""Generate help/idoi.plotter.maxhelp.

The help patch is generated so that its layout stays consistent and diffs stay
readable. Edit this script and run `python3 tools/make_help.py`.
"""

import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "help" / "idoi.plotter.maxhelp"

boxes = []
lines = []
_n = 0


def box(maxclass, rect, text=None, inlets=1, outlets=0, outlettype=None, **extra):
    global _n
    _n += 1
    b = {
        "id": f"obj-{_n}",
        "maxclass": maxclass,
        "numinlets": inlets,
        "numoutlets": outlets,
        "patching_rect": list(map(float, rect)),
    }
    if outlets:
        b["outlettype"] = outlettype or [""] * outlets
    if text is not None:
        b["text"] = text
    b.update(extra)
    boxes.append({"box": b})
    return b["id"]


def obj(text, x, y, w=None, inlets=1, outlets=1, outlettype=None):
    return box("newobj", (x, y, w or max(40, 7 * len(text) + 14), 22), text, inlets, outlets, outlettype)


def msg(text, x, y, w=None):
    return box("message", (x, y, w or max(30, 7 * len(text) + 14), 22), text, 2, 1, [""])


def toggle(x, y):
    return box("toggle", (x, y, 20, 20), None, 1, 1, ["int"], parameter_enable=0)


def number(x, y, w=50, flo=False, minimum=None):
    extra = {"minimum": minimum} if minimum is not None else {}
    return box("flonum" if flo else "number", (x, y, w, 22), None, 1, 2,
               ["", "bang"], parameter_enable=0, **extra)


def comment(text, x, y, w=260, h=None, **extra):
    nlines = text.count("\n") + 1
    return box("comment", (x, y, w, h or 20 * nlines), text, 1, 0, **extra)


def connect(src, dst, outlet=0, inlet=0):
    lines.append({"patchline": {"source": [src, outlet], "destination": [dst, inlet]}})


# --- title -------------------------------------------------------------------
comment("idoi.plotter", 20, 12, 300, 32, fontsize=22.0, fontface=1)
comment("Real-time multi-channel time series plotter (v8ui, Max 9+)", 20, 44, 460)

# --- plotter -----------------------------------------------------------------
plotter = box("v8ui", (20, 470, 820, 240), None, 1, 1, [""],
              filename="idoi.plotter.js", parameter_enable=0, border=0)

# --- demo data -----------------------------------------------------------------
comment("demo data: 3 channels", 20, 76, 200)
t_on = toggle(20, 100)
metro = obj("metro 20", 20, 128, inlets=2, outlets=1, outlettype=["bang"])
trig = obj("t b b b", 20, 156, inlets=1, outlets=3, outlettype=["bang", "bang", "bang"])
cnt = obj("counter", 20, 186, inlets=3, outlets=4, outlettype=["int", "", "", "int"])
sine = obj("expr sin($i1 * 0.05)", 20, 214, inlets=1, outlets=1)
drunk = obj("drunk 200 20", 120, 186, inlets=3, outlets=1, outlettype=["int"])
dsc = obj("/ 200.", 120, 214, inlets=2, outlets=1, outlettype=["float"])
rnd = obj("random 100", 210, 186, inlets=2, outlets=1, outlettype=["int"])
rsc = obj("expr $i1 * 0.004 - 0.7", 210, 214, inlets=1, outlets=1)
pack = obj("pack 0. 0. 0.", 20, 250, inlets=3, outlets=1)
loadmess = obj("loadmess 1", 50, 100, inlets=1, outlets=1)

connect(loadmess, t_on)
connect(t_on, metro)
connect(metro, trig)
# t fires right to left: fill the cold inlets of pack first, the hot one last
connect(trig, rnd, 2)
connect(trig, drunk, 1)
connect(trig, cnt, 0)
connect(cnt, sine)
connect(drunk, dsc)
connect(rnd, rsc)
connect(sine, pack, 0, 0)
connect(dsc, pack, 0, 1)
connect(rsc, pack, 0, 2)
connect(pack, plotter)

comment("Send a list (one value per channel)\nor a single float.", 120, 250, 240)

# --- messages ------------------------------------------------------------------
X = 400
y = 76
comment("messages / attributes", X, y, 200, fontface=1)


def control(label, note, kind="msg", width=None, flo=False, minimum=None):
    """A labelled control wired into the plotter. Returns the toggle/number box."""
    global y
    y += 26
    widget = None
    if kind == "msg":
        m = msg(label, X, y, width)
        connect(m, plotter)
    elif kind == "toggle":
        t = toggle(X, y + 1)
        m = msg(label, X + 28, y, width)
        connect(t, m)
        connect(m, plotter)
        widget = t
    elif kind == "number":
        n = widget = number(X, y, flo=flo, minimum=minimum)
        m = msg(label, X + 56, y, width)
        connect(n, m)
        connect(m, plotter)
    comment(note, X + 190, y + 1, 260)
    return widget


t_autoscale = control("autoscale $1", "auto Y range (double click toggles)", "toggle")
r_autoscale = obj("r idoi.plotter.help.autoscale", X - 255, y, 175)
set_autoscale = obj("prepend set", X - 75, y, 70)
connect(r_autoscale, set_autoscale)
connect(set_autoscale, t_autoscale)
control("ybounds -1.5 1.5", "fixed Y range, turns autoscale off")
control("smooth $1", "moving average window (1 = raw)", "number", minimum=1)
control("samples $1", "buffer length in samples", "number", minimum=2)
control("linewidth $1", "line width in pixels", "number", flo=True, minimum=0.1)
control("gridx $1", "vertical grid every N samples (0 = off)", "number", minimum=0)
control("gridy $1", "horizontal grid + Y labels", "toggle")
control("legend $1", "channel names + latest values", "toggle")
control("names sine drunk noise", "channel names")
control("setcolor 0 0. 0. 0.", "color of channel 0 (r g b, 0-1)")
control("pause $1", "freeze the display", "toggle")
control("clear", "clear data, keep the view")
control("reset", "clear data, back to autoscale")

# --- output --------------------------------------------------------------------
route = obj("route autoscale", 20, 720, 100, inlets=2, outlets=2)
s_autoscale = obj("s idoi.plotter.help.autoscale", 20, 750, 190, outlets=0)
prepend = obj("prepend set", 220, 750, 80)
out = box("message", (310, 750, 220, 22), "", 2, 1, [""])
connect(plotter, route)
connect(route, s_autoscale)
connect(route, prepend, 1)
connect(prepend, out)
comment("mouse zoom / pan / double click reports the view.\nthe autoscale toggle follows it.", 450, 720, 330)

# --- mouse -----------------------------------------------------------------------
comment("mouse:\n  drag = zoom Y around the cursor (shift = fine)\n"
        "  cmd/ctrl + drag = move Y range\n  double click = toggle autoscale",
        20, 300, 330)

patcher = {
    "patcher": {
        "fileversion": 1,
        "appversion": {"major": 9, "minor": 1, "revision": 0, "architecture": "x64", "modernui": 1},
        "classnamespace": "box",
        "rect": [100.0, 80.0, 880.0, 840.0],
        "gridsize": [15.0, 15.0],
        "boxes": boxes,
        "lines": lines,
        "dependency_cache": [],
        "autosave": 0,
    }
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(patcher, indent="\t", ensure_ascii=False) + "\n")
print(f"wrote {OUT}")
