//! Generate figures for "Change the problem: 18XX token placement".

use navig18xx::prelude::*;

static OUT_DIR: &str = "../../static/images";

fn main() {
    // Define the basic tile geometry.
    let hex_max_diameter = 125.0;

    // Draw the starting yellow Montreal tile.
    let yellow = draw_yellow_tile(hex_max_diameter);
    let yellow_out = format!("{}/18xx-montreal-yellow-tile.png", OUT_DIR);
    yellow.write_png(8, Some(Colour::WHITE), yellow_out);

    // Draw the starting yellow Montreal tile with placed tokens.
    let yellow_toks = draw_yellow_tile_with_tokens(hex_max_diameter);
    let y_toks_out = format!("{}/18xx-montreal-yellow-tile-tokens.png", OUT_DIR);
    yellow_toks.write_png(8, Some(Colour::WHITE), y_toks_out);

    // Draw the green Montreal tiles.
    let green = draw_green_tiles(hex_max_diameter);
    let green_out = format!("{}/18xx-montreal-green-tiles.png", OUT_DIR);
    green.write_png(8, Some(Colour::WHITE), green_out);

    // Upgrade from yellow to green X2, showing all 6 possible rotations.
    let green6 = draw_six_x2_tiles_with_tokens(hex_max_diameter);
    let green6_out = format!("{}/18xx-montreal-green-tokens.png", OUT_DIR);
    green6.write_png(8, Some(Colour::WHITE), green6_out);

    // Draw the brown Montreal tiles.
    let brown = draw_brown_tiles(hex_max_diameter);
    let brown_out = format!("{}/18xx-montreal-brown-tiles.png", OUT_DIR);
    brown.write_png(8, Some(Colour::WHITE), brown_out);

    // Upgrade from green X2 to brown X7, show all 6 possible rotations.
    let brown6 = draw_six_x7_tiles_with_tokens(hex_max_diameter);
    let brown6_out = format!("{}/18xx-montreal-brown-tokens.png", OUT_DIR);
    brown6.write_png(8, Some(Colour::WHITE), brown6_out);

    // Draw green X2 tiles with numbered token spaces.
    let x2_num = draw_x2_numbered_spaces(hex_max_diameter);
    let x2_num_out = format!("{}/18xx-montreal-x2-numbered.png", OUT_DIR);
    x2_num.write_png(8, Some(Colour::WHITE), x2_num_out);

    // Draw brown X7 tiles with numbered token spaces.
    let x7_num = draw_x7_numbered_spaces(hex_max_diameter);
    let x7_num_out = format!("{}/18xx-montreal-x7-numbered.png", OUT_DIR);
    x7_num.write_png(8, Some(Colour::WHITE), x7_num_out);
}

/// Return all of the Montreal tiles and company tokens from 1867.
fn montreal_tiles_and_tokens() -> (Vec<Tile>, Vec<(String, Token)>) {
    let montreal_label = Label::City("M".to_string());
    let game = navig18xx::game::new_1867();
    let tiles = game
        .catalogue()
        .tile_iter()
        .filter(|tile| {
            tile.labels()
                .iter()
                .any(|(label, _posn)| label == &montreal_label)
        })
        .cloned()
        .collect();
    let tokens = game
        .companies()
        .iter()
        .map(|company| (company.abbrev.clone(), company.token))
        .collect();
    (tiles, tokens)
}

/// Define the hexagonal grid coordinate system for the figures.
fn coord_system() -> Coordinates {
    Coordinates {
        orientation: Orientation::FlatTop,
        letters: Letters::AsColumns,
        first_row: FirstRow::OddColumns,
    }
}

/// Create a new figure, starting with some placed tiles.
fn new_example(hex_size: f64, placed_tiles: Vec<PlacedTile<'_>>) -> Example {
    let coords = coord_system();
    let (catalogue, tokens) = montreal_tiles_and_tokens();
    Example::new_catalogue(hex_size, tokens, placed_tiles, catalogue, coords)
}

/// Draw the starting yellow Montreal tile.
fn draw_yellow_tile(hex_size: f64) -> Example {
    let yellow_tiles = vec![PlacedTile {
        name: "Montreal",
        addr: "A1",
        rotn: RotateCW::Zero,
        toks: vec![],
    }];
    let example = new_example(hex_size, yellow_tiles);
    example.draw_map();
    example
}

/// Draw the starting yellow Montreal tile with two placed tokens.
fn draw_yellow_tile_with_tokens(hex_size: f64) -> Example {
    let yellow_tiles = vec![PlacedTile {
        name: "Montreal",
        addr: "A1",
        rotn: RotateCW::Zero,
        toks: vec![(0, "LPS"), (1, "QLS")],
    }];
    let example = new_example(hex_size, yellow_tiles);
    example.draw_map();
    example
}

/// Draw the green Montreal tiles.
fn draw_green_tiles(hex_size: f64) -> Example {
    let green_tiles = vec![
        PlacedTile {
            name: "637",
            addr: "A1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X1",
            addr: "C1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X2",
            addr: "E1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X3",
            addr: "B4",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X4",
            addr: "D4",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
    ];
    let example = new_example(hex_size, green_tiles);
    example.draw_map();
    example
}

/// Draw the brown Montreal tiles.
fn draw_brown_tiles(hex_size: f64) -> Example {
    let brown_tiles = vec![
        PlacedTile {
            name: "X5",
            addr: "A1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X6",
            addr: "C1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "X7",
            addr: "E1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
    ];
    let example = new_example(hex_size, brown_tiles);
    example.draw_map();
    example
}

/// Draw green X2 tiles with numbered token spaces.
fn draw_x2_numbered_spaces(hex_size: f64) -> Example {
    let yellow_tiles = vec![
        PlacedTile {
            name: "Montreal",
            addr: "A1",
            rotn: RotateCW::Zero,
            toks: vec![(0, "LPS"), (1, "QLS")],
        },
        PlacedTile {
            name: "Montreal",
            addr: "C1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "Montreal",
            addr: "E1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
    ];
    let mut example = new_example(hex_size, yellow_tiles);
    let coords = coord_system();
    let c1 = coords.parse("C1").unwrap();
    let e1 = coords.parse("E1").unwrap();
    let tiles = [(c1, RotateCW::Zero), (e1, RotateCW::Two)];
    {
        let map = example.map_mut();
        for (addr, rotn) in tiles {
            map.place_tile(addr, "X2", rotn);
        }
    }

    example.draw_map();
    number_each_revenue_center(&example, &tiles);
    example
}

/// Draw brown X7 tiles with numbered token spaces.
fn draw_x7_numbered_spaces(hex_size: f64) -> Example {
    let yellow_tiles = vec![
        PlacedTile {
            name: "Montreal",
            addr: "A1",
            rotn: RotateCW::Zero,
            toks: vec![(0, "LPS"), (1, "QLS")],
        },
        PlacedTile {
            name: "Montreal",
            addr: "C1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
        PlacedTile {
            name: "Montreal",
            addr: "E1",
            rotn: RotateCW::Zero,
            toks: vec![],
        },
    ];
    let mut example = new_example(hex_size, yellow_tiles);
    let coords = coord_system();
    let a1 = coords.parse("A1").unwrap();
    let c1 = coords.parse("C1").unwrap();
    let e1 = coords.parse("E1").unwrap();
    let tiles = [(c1, RotateCW::Zero), (e1, RotateCW::Three)];
    {
        let map = example.map_mut();
        // Upgrade from yellow to green.
        map.place_tile(a1, "X2", RotateCW::Zero);
        map.place_tile(c1, "X2", RotateCW::Zero);
        map.place_tile(e1, "X2", RotateCW::Zero);
        // Upgrade from green to brown.
        for (addr, rotn) in tiles {
            map.place_tile(addr, "X7", rotn);
        }
    }

    example.draw_map();
    number_each_revenue_center(&example, &tiles);
    example
}

/// Assign a number to each city, and draw these numbers in city token spaces.
fn number_each_revenue_center(example: &Example, tiles: &[(HexAddress, RotateCW)]) {
    let map = example.map();
    let hex = example.hex();
    let ctx = example.context();

    for &(addr, rotn) in tiles {
        let tile = map.tile_at(addr).unwrap();
        let m = map.prepare_to_draw(addr, hex, ctx);

        for (ix, city) in tile.cities().iter().enumerate() {
            ctx.save().unwrap();
            city.define_token_path(0, hex, ctx);
            let (x0, y0, x1, y1) = ctx.fill_extents().unwrap();
            let x = 0.5 * (x0 + x1);
            let y = 0.5 * (y0 + y1);
            let text_centre = navig18xx::hex::Coord::from((x, y));

            // NOTE: account for tile rotation.
            ctx.move_to(text_centre.x, text_centre.y);
            ctx.translate(-text_centre.x, -text_centre.y);
            ctx.rotate(-rotn.radians());
            ctx.translate(text_centre.x, text_centre.y);

            let mut text = hex.theme.token_label;
            let labeller = text
                .halign(navig18xx::hex::theme::AlignH::Centre)
                .valign(navig18xx::hex::theme::AlignV::Middle)
                .font_size(16.0)
                .labeller(ctx, hex);
            labeller.draw_at_current_point(&format!("{}", ix + 1));
            ctx.restore().unwrap();
        }

        ctx.set_matrix(m);
    }
}

/// Draw six copies of the starting yellow Montreal tile with two tokens.
fn draw_six_yellow_tiles_with_tokens(hex_size: f64) -> Example {
    let yellow_tiles = ["A1", "C1", "E1", "A5", "C5", "E5"]
        .iter()
        .map(|addr| PlacedTile {
            name: "Montreal",
            addr,
            rotn: RotateCW::Zero,
            toks: vec![(0, "LPS"), (1, "QLS")],
        })
        .collect();
    let example = new_example(hex_size, yellow_tiles);
    example.draw_map();
    example
}

/// Draw the six green X2 tile orientations, placing tokens when possible.
fn draw_six_x2_tiles_with_tokens(hex_size: f64) -> Example {
    let mut example = draw_six_yellow_tiles_with_tokens(hex_size);
    let map = example.map_mut();
    let coords = coord_system();

    for (addr, rotn) in [
        ("A1", RotateCW::Zero),
        ("C1", RotateCW::One),
        ("E1", RotateCW::Two),
        ("A5", RotateCW::Three),
        ("C5", RotateCW::Four),
        ("E5", RotateCW::Five),
    ] {
        map.place_tile(coords.parse(addr).unwrap(), "X2", rotn);
    }

    example.erase_all().unwrap();
    example.draw_map();
    example
}

/// Draw the six brown X7 tile orientations, placing tokens when possible.
fn draw_six_x7_tiles_with_tokens(hex_size: f64) -> Example {
    let mut example = draw_six_yellow_tiles_with_tokens(hex_size);
    let map = example.map_mut();
    let coords = coord_system();

    for addr in ["A1", "C1", "E1", "A5", "C5", "E5"] {
        map.place_tile(coords.parse(addr).unwrap(), "X2", RotateCW::Zero);
    }

    for (addr, rotn) in [
        ("A1", RotateCW::Zero),
        ("C1", RotateCW::One),
        ("E1", RotateCW::Two),
        ("A5", RotateCW::Three),
        ("C5", RotateCW::Four),
        ("E5", RotateCW::Five),
    ] {
        map.place_tile(coords.parse(addr).unwrap(), "X7", rotn);
    }

    example.erase_all().unwrap();
    example.draw_map();
    example
}
