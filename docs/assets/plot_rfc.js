/**
 * plot.js
 *
 * Produces an interactive plot of acute renal function curves and model
 * simulations.
 *
 * Copyright 2013 Robert Moss.
 *
 * This work is distributed under the terms of the BSD 2-Clause License
 * (http://opensource.org/licenses/BSD-2-Clause).
 */

// Create a new namespace to contain all of the variables and functions.
var Plot = Plot || {};

Plot.create = function(data_file, hull_file, dims, labels, selector) {
    // Create a new namespace to contain the plot.
    var plot = {};

    // Save the arguments to Plot.create() in plot._info.
    plot._info = {};
    plot._info.data_file = data_file;
    plot._info.hull_file = hull_file;
    plot._info.dims = dims;
    plot._info.labels = labels;
    plot._info.selector = selector;

    var tmp_x = parseFloat(dims.w) + parseFloat(dims.margin_x),
        tmp_y = parseFloat(dims.h) + parseFloat(dims.margin_y)

    // Create the SVG element that will contain the plot.
    var svg_elt = d3.select(selector)
        .append("svg:svg")
        .attr("width", tmp_x)
        .attr("height", tmp_y)
        .attr("preserveAspectRatio", "none");

    // Create the group element that will contain every plot component.
    plot.contents = svg_elt.append("svg:g")
        .attr("transform",
              "translate(" + dims.margin_x + ", " + dims.h + ")");

    // Create the tooltip.
    plot._info.tooltip = {};
    plot._info.tooltip.div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", "0");

    plot._info.tooltip.fixed = false;

    plot._info.tooltip.do_display = function(study, cond, series) {
        /* Do nothing if the current series is highlighted. */
        if (d3.select(series).attr("id") === "highlight") {
            return;
        }

        /* Only remove highlighting from *this* plot. */
        plot.contents.selectAll("#highlight")
            .attr("id", null);
        /* Highlight the select series. */
        d3.select(series)
            .attr("id", "highlight");

        /* Hide the tooltip. */
        plot._info.tooltip.div
            .style("opacity", "0");

        /* Set the tooltip contents. */
        if (study === "model") {
            var lbl = "";
            if (cond === "min") {
                lbl = "minimal";
            } else if (cond === "half") {
                lbl = "half-maximal";
            } else if (cond === "max") {
                lbl = "maximal";
            }
            //plot._info.tooltip.div.html("<strong>Simulation:</strong> " + cond)
            plot._info.tooltip.div.html("<strong>Hormones:</strong> " + lbl)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        } else {
            plot._info.tooltip.div.html(
                "<strong>Study:</strong> " + study + "<br/>"
                    + "<strong>Group:</strong> " + cond)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }

        /* Fade in the tooltip. */
        plot._info.tooltip.div.transition()
            .duration(500)
            .style("opacity", "0.9");
    }

    plot._info.tooltip.show = function(d, i) {
        if (! plot._info.tooltip.fixed) {
            var study = d3.select(this).attr("study");
            var cond = d3.select(this).attr("cond");
            plot._info.tooltip.do_display(study, cond, this);
        }
    }

    plot._info.tooltip.hide = function(d, i) {
        /* Only remove highlighting from *this* plot. */
        plot.contents.selectAll("#highlight")
            .attr("id", null);

        plot._info.tooltip.div.transition()
            .duration(500)
            .style("opacity", "0");

        plot._info.tooltip.fixed = false;
    }

    plot._info.tooltip.show_fixed = function(d, i) {
        var study = d3.select(this).attr("study");
        var cond = d3.select(this).attr("cond");

        plot._info.tooltip.fixed = true;
        plot._info.tooltip.do_display(study, cond, this);
    }

    plot._info.tooltip.toggle_fixed = function(d, i) {
        plot._info.tooltip.fixed = ! plot._info.tooltip.fixed;
    }

    plot._info.tooltip.div
        .on("click", plot._info.tooltip.toggle_fixed);

    // Draw the plot elements once the data files have been loaded.
    var draw_plot = function(hull_rows, data_rows) {
        plot.axis = {
            x_dom: d3.extent(data_rows, function(d) { return +d.x; } ),
            y_dom: d3.extent(data_rows, function(d) { return +d.y; } )
        };

        // Make the y-axis start at zero.
        plot.axis.y_dom[0] = 0;

        plot.axis.x = d3.scale.linear().domain(plot.axis.x_dom)
            .range([0, dims.w]);

        plot.axis.y = d3.scale.linear().domain(plot.axis.y_dom)
            .range([0, dims.h]);

        // How to construct a line from a given data series.
        var line = d3.svg.line()
            .x(function(d, i) { return plot.axis.x(d.x); })
            .y(function(d) { return - plot.axis.y(d.y); });

        // Draw the x-axis.
        plot.contents.append("svg:line")
            .attr("x1", plot.axis.x(plot.axis.x_dom[0]))
            .attr("y1", -1 * plot.axis.y(plot.axis.y_dom[0]))
            .attr("x2", plot.axis.x(plot.axis.x_dom[1]))
            .attr("y2", -1 * plot.axis.y(plot.axis.y_dom[0]));

        // Draw the y-axis.
        plot.contents.append("svg:line")
            .attr("x1", plot.axis.x(plot.axis.x_dom[0]))
            .attr("y1", -1 * plot.axis.y(plot.axis.y_dom[0]))
            .attr("x2", plot.axis.x(plot.axis.x_dom[0]))
            .attr("y2", -1 * plot.axis.y(plot.axis.y_dom[1]));

        // Draw the x-axis tick labels.
        plot.contents.selectAll(".xLabel")
            .data(plot.axis.x.ticks(8))
            .enter().append("svg:text")
            .attr("class", "xLabel")
            .text(String)
            .attr("x", function(d) { return plot.axis.x(d) })
            .attr("y", 0.5 * dims.margin_y)
            .attr("text-anchor", "middle");

        // Draw the x-axis label.
        plot.contents.append("text")
            .attr("x", dims.w / 2)
            .attr("y", dims.margin_y)
            .attr("dy", "-0.4em")
            .style("text-anchor", "middle")
            .text(labels.x);

        // Draw the y-axis label.
        plot.contents.append("text")
            .attr("y", - 0.6 * dims.margin_x)
            .attr("x", dims.h / 2)
            .attr("dy", "-0.8em")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(labels.y);

        // Draw the y-axis tick labels.
        plot.contents.selectAll(".yLabel")
            .data(plot.axis.y.ticks(8))
            .enter().append("svg:text")
            .attr("class", "yLabel")
            .text(String)
            .attr("x", - 0.25 * dims.margin_x)
            .attr("y", function(d) { return -1 * plot.axis.y(d) })
            .attr("text-anchor", "end")
            .attr("dy", 4);

        plot.contents.selectAll(".xTicks")
            .data(plot.axis.x.ticks(8))
            .enter().append("svg:line")
            .attr("class", "xTicks")
            .attr("x1", function(d) { return plot.axis.x(d); })
            .attr("y1", -1 * plot.axis.y(0))
            .attr("x2", function(d) { return plot.axis.x(d); })
            /* Scale the size of the ticks relative to the y domain. */
            .attr("y2", -1 * plot.axis.y(- plot.axis.y_dom[1] / 50));

        plot.contents.selectAll(".yTicks")
            .data(plot.axis.y.ticks(8))
            .enter().append("svg:line")
            .attr("class", "yTicks")
            .attr("y1", function(d) { return -1 * plot.axis.y(d); })
            .attr("x1", - 0.125 * dims.margin_x)
            .attr("y2", function(d) { return -1 * plot.axis.y(d); })
            .attr("x2", 0);

        // Plot the vertical grid lines.
        plot.contents.selectAll(".xGrid")
            .data(plot.axis.x.ticks(8))
            .enter().append("svg:line")
            .attr("class", "grid")
            .attr("x1", function(d) { return plot.axis.x(d); })
            .attr("y1", -1 * plot.axis.y(0))
            .attr("x2", function(d) { return plot.axis.x(d); })
            /* Scale the size of the ticks relative to the y domain. */
            .attr("y2", - plot.axis.y(plot.axis.y_dom[1]));

        // Plot the horizontal grid lines.
        plot.contents.selectAll(".yGrid")
            .data(plot.axis.y.ticks(8))
            .enter().append("svg:line")
            .attr("class", "grid")
            .attr("y1", function(d) { return -1 * plot.axis.y(d); })
            .attr("x1", plot.axis.x(plot.axis.x_dom[0]))
            .attr("y2", function(d) { return -1 * plot.axis.y(d); })
            /* Scale the size of the ticks relative to the y domain. */
            .attr("x2", plot.axis.x(plot.axis.x_dom[1]));

        var legend = plot.contents.selectAll('g')
            .data([{name: "Experimental Study", color: "steelblue", cl: "exp"},
                   {name: "Model Simulation", color: "red", cl: "model"}])
            .enter()
            .append('g')
            .attr('class', 'legend');

        legend.append('rect')
            .attr('x', plot.axis.x(95))
            .attr('y', function(d, i){
                return - dims.h + 0.25 * dims.margin_y + i * 20; })
            .attr('width', 10)
            .attr('height', 10)
            .attr('class', function(d) {
                return d.cl;
            })
            //.style('fill', function(d) {
            //    return d.color;
            //});

        legend.append('text')
            .attr('x', plot.axis.x(95) + 15)
            .attr('y', function(d, i){
                return - dims.h + 0.25 * dims.margin_y + i * 20 + 10; })
            .text(function(d){ return d.name; });

        // Plot the convex hull as a shaded region.
        plot.contents.append("svg:path")
            .data([hull_rows])
            .attr("d", line)
            .attr("class", "hull");

        // Build a sequence of nested arrays, indexed by study and then by
        // the experimental conditions for each data series.
        var series_data = d3.nest()
            .key(function(d) { return d.study; })
            .key(function(d) { return d.cond; })
            .entries(data_rows);

        for (i = 0; i < series_data.length; i++) {
            study_data = series_data[i].values;
            var series_class = "experiment";

            if (series_data[i].key == "model") {
                series_class = "model";
            }

            // Iterate over each data series in the study.
            for (j = 0; j < study_data.length; j++) {
                single_exp = study_data[j].values;

                // Plot a line for the data series.
                plot.contents.append("svg:path")
                    .data([single_exp])
                    .attr("d", line)
                    .attr("study", series_data[i].key)
                    .attr("cond", study_data[j].key)
                    .attr("class", series_class)
                    .on("mouseover", plot._info.tooltip.show)
                    .on("click", plot._info.tooltip.show_fixed);
            }
        }
    }

    // Asynchronously load the data files.
    d3.csv(
        hull_file,
        function(error, hull_rows) {
            if (error == null) {
                d3.csv(
                    data_file,
                    function(error, data_rows) {
                        if (error == null) {
                            draw_plot(hull_rows, data_rows);
                        } else {
                            console.log(error);
                        }
                    }
                );
            } else {
                console.log(error);
            }
        }
    );

    plot.study_visibility = function(study, visible) {
        var display = "none";

        if (visible) {
            display = "inline";
        }

        d3.select(selector).selectAll("path").filter(
            function(d,i) { return d3.select(this).attr("study") == study; })
        .style("display", display);
    };

    return plot;
}

Plot.study_table = function(study_file, selector) {
    var table_div = d3.select(selector).append("div")
        .attr("id", "plot-legend");
    var label = table_div.append("span");
    var table = table_div.append("table")
        .attr("id", "refs").append("style", "margin: 0 auto;");
    var captn = table.append("caption").attr("class", "md-typeset");
    var thead = table.append("thead").attr("class", "md-typeset");
    var tbody = table.append("tbody").attr("class", "md-typeset");

    show_table = function(d, i) {
        table.style("display", "block");
        label.style("display", "none");
    }
    hide_table = function(d, i) {
        table.style("display", "none");
        label.style("display", "block");
    }

    captn.html("<strong>Table 1:</strong> Experimental studies in the rat.");

    table._info = {};
    table._info.plots = [];

    table.add_plot = function(plot) {
        table._info.plots.push(plot);
    }

    toggle = function(d, i) {
        var study = d3.select(this).attr("study");
        var shown = d3.select(this).attr("shown") == "true";
        var display = "none"

        if (shown) {
            d3.select(this).attr("shown", "false")
                //.style("background-color", "pink")
                .attr('class', 'toggle showno')
                //.text("No");
                .html("<a href=\"javascript:;\">No</a>");
        } else {
            d3.select(this).attr("shown", "true")
                //.style("background-color", "lightgreen")
                .attr('class', 'toggle showyes')
                //.text("Yes");
                .html("<a href=\"javascript:;\">Yes</a>");
            display = "table-cell";
        }

        for (i = 0; i < table._info.plots.length; i++) {
            var plot = table._info.plots[i];
            plot.study_visibility(study, ! shown);
        }
    }

    d3.csv(study_file, function(data) {
        pub_data = [];
        for (i = 0; i < data.length; i++) {
            var row = data[i];
            pub_data.push({ study: row.Study, pubmed: row.PubMed,
                            title: row.Title });
        }

        thead.append("tr")
            .selectAll("th")
            .data(["Study", "Plot?"])
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(pub_data)
            .enter()
            .append("tr")
            .html(function(d, i) {
                return "<td><a href=\""
                    + "http://www.ncbi.nlm.nih.gov/pubmed/" + d.pubmed
                    + "\" title=\""
                    + d.title
                    + "\">" + d.study + "</td>"
                    + "<td class=\"toggle\"></td>";
            });

        // identify odd and even rows as such
        tbody.selectAll("tr")
            .data(pub_data)
            .attr("class", function(d, i) {
                if (i % 2 == 0) {
                    return "even";
                } else {
                    return "odd";
                }
            });

        // add event handles to toggle the visibility of each data series
        tbody.selectAll("td[class=toggle]")
            .data(pub_data)
            //.style("background-color", "lightgreen")
            //.text("Yes")
            .html("<a href=\"javascript:;\">Yes</a>")
            .attr("class", "toggle showyes")
            .attr("study", function(d) {return d.study;})
            .attr("shown", "true")
            .on("click", toggle);
    });

    // Default to showing the table of experimental studies.
    show_table(null, null);

    return table;
}

var md = { w: 560, h: 420, margin_x: 75, margin_y: 50 },
    sm = { w: 400, h: 300, margin_x: 75, margin_y: 50 },
    lg = { w: 800, h: 600, margin_x: 75, margin_y: 50 },
    tt = { w: "40", h: "30", margin_x: 7.5, margin_y: 5.0 },
    na_lbl = {
        x: "Renal Perfusion Pressure (mmHg)",
        y: "Sodium Excretion (µEq/min/gkwt)"
    },
    v_lbl = {
        x: "Renal Perfusion Pressure (mmHg)",
        y: "Volume Excretion (µL/min/gkwt)"
    };

var width = document.getElementsByClassName('rfc_plot')[0].offsetWidth;
var height = 0.75 * width;
var sm = { w: width - 75, h: height - 50,
           margin_x: 75, margin_y: 50 };

// Add the legend table to the left-hand navigation side bar.
var tbl_sel = "div.md-sidebar--primary div.md-sidebar__inner";
var tbl = Plot.study_table("/assets/studies.csv", tbl_sel),
    pjna = Plot.create("/assets/jna.csv", "/assets/jna_hull.csv",
                       sm, na_lbl, "#jna"),
    pjv = Plot.create("/assets/jv.csv", "/assets/jv_hull.csv",
                      sm, v_lbl, "#jv");

tbl.add_plot(pjna);
tbl.add_plot(pjv);

// Hide the warning about javascript being disabled.
d3.selectAll(".hidejs").style("display", "none")

// Show the javascript-generated content.
d3.selectAll(".showjs").style("display", "block")
