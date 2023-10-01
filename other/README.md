# idoi.plotter

This repository offers a tool designed for visualizing time series data, leveraging the capabilities of JSUI within the Max environment.
## Features

- **Time Series Visualization**: Stream data into the tool, and it'll render a 2D graph in real-time.
- **Interactivity**: Mouse-based controls for zooming in/out and moving the graph vertically.
- **Auto-Scaling**: Automatically adjust the Y-axis bounds based on incoming data.
- **Moving Averages with Adjustable Window**: Display smoothed data using moving averages. The size of the averaging window can be customized.
- **Interpolation Mode**: Decide whether to use raw data or smoothed data for visualization.
- **Color Customization**: Change the color of each plotted line.
- **Grid Lines**: Horizontal grid lines for easier data reading.
- **Custom Line Width**: Adjust the thickness of plotted lines.

## Usage
You can send messages to the tool using the message object. The available commands are:

### autoscale(mode)

Enable or disable the auto-scaling feature.

### ybounds(min, max)

Set the Y-axis bounds manually.

### setColor(idx, r, g, b)

Change the color of a specific line.

### linewidth(newWidth)

Set the line width for plotted timeseries.

### lineinterval(step)

Adjust the horizontal grid line interval.

### windowsize(newSize)

Set the window size for moving averages.

### interpolation(mode)

Enable or disable the interpolation mode.

### clear()

Clear the graph and reset to default settings.

## Mouse Controls

- **Drag**: Zoom in or out vertically.
- **Ctrl + Drag**: Move the graph up or down.
- **Double Click**: Toggle auto-scaling on/off.

## Dependencies

This tool requires the Max environment with sketch object support.