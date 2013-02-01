﻿(function() {
	////////////////////////////////////////////////////////////////////////////////
	// DungeonGen.Dungeon
	var $DungeonGen_Dungeon = function() {
		this.map$1 = Array.multidim(String.getDefaultValue(), $DungeonGen_Dungeon.h, $DungeonGen_Dungeon.w);
		for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
			for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
				this.map$1.set(i, j, '#');
			}
		}
	};
	$DungeonGen_Dungeon.prototype = {
		map: function(p) {
			return this.map$1.get(p.r, p.c);
		},
		boundsCheck: function(r, c) {
			if (r > 0 && r < 21 && c > 0 && c < 65) {
				return true;
			}
			return false;
		}
	};
	$DungeonGen_Dungeon.rotateDir = function(dir, clockwise) {
		return $DungeonGen_Dungeon.rotateDir$1(dir, clockwise, 1);
	};
	$DungeonGen_Dungeon.rotateDir$1 = function(dir, clockwise, times) {
		if (dir === 5) {
			return 5;
		}
		for (var i = 0; i < times; ++i) {
			switch (dir) {
				case 7: {
					dir = (clockwise ? 8 : 4);
					break;
				}
				case 8: {
					dir = (clockwise ? 9 : 7);
					break;
				}
				case 9: {
					dir = (clockwise ? 6 : 8);
					break;
				}
				case 4: {
					dir = (clockwise ? 7 : 1);
					break;
				}
				case 6: {
					dir = (clockwise ? 3 : 9);
					break;
				}
				case 1: {
					dir = (clockwise ? 4 : 2);
					break;
				}
				case 2: {
					dir = (clockwise ? 1 : 3);
					break;
				}
				case 3: {
					dir = (clockwise ? 2 : 6);
					break;
				}
				default: {
					return 0;
				}
			}
		}
		return dir;
	};
	$DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10 = function(p1, p2) {
		return $DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10$1(p1.r, p1.c, p2.r, p2.c);
	};
	$DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10$1 = function(r1, c1, r2, c2) {
		// x10 so that orthogonal directions are closer than diagonals
		var dy = Math.abs(r1 - r2) * 10;
		var dx = Math.abs(c1 - c2) * 10;
		if (dx > dy) {
			return dx + ss.Int32.div(dy, 2);
		}
		else {
			return dy + ss.Int32.div(dx, 2);
		}
	};
	$DungeonGen_Dungeon.posInDir$1 = function(r, c, dir) {
		return $DungeonGen_Dungeon.posInDir(new $DungeonGen_pos(r, c), dir);
	};
	$DungeonGen_Dungeon.posInDir = function(p, dir) {
		switch (dir) {
			case 7: {
				return new $DungeonGen_pos(p.r - 1, p.c - 1);
			}
			case 8: {
				return new $DungeonGen_pos(p.r - 1, p.c);
			}
			case 9: {
				return new $DungeonGen_pos(p.r - 1, p.c + 1);
			}
			case 4: {
				return new $DungeonGen_pos(p.r, p.c - 1);
			}
			case 5: {
				return p;
			}
			case 6: {
				return new $DungeonGen_pos(p.r, p.c + 1);
			}
			case 1: {
				return new $DungeonGen_pos(p.r + 1, p.c - 1);
			}
			case 2: {
				return new $DungeonGen_pos(p.r + 1, p.c);
			}
			case 3: {
				return new $DungeonGen_pos(p.r + 1, p.c + 1);
			}
			default: {
				return new $DungeonGen_pos(-1, -1);
			}
		}
	};
	$DungeonGen_Dungeon.boundsCheck = function(r, c, H, W) {
		if (r > 0 && r < H - 1 && c > 0 && c < W - 1) {
			return true;
		}
		return false;
	};
	$DungeonGen_Dungeon.roll$1 = function(dice, sides) {
		var total = 0;
		for (var i = 0; i < dice; ++i) {
			total += ss.Int32.trunc(1 + Math.floor(ROT.RNG.getUniform() * sides));
		}
		return total;
	};
	$DungeonGen_Dungeon.roll = function(sides) {
		return ss.Int32.trunc(1 + Math.floor(ROT.RNG.getUniform() * sides));
	};
	$DungeonGen_Dungeon.coinFlip = function() {
		return 1 > Math.floor(ROT.RNG.getUniform() * 2);
	};
	////////////////////////////////////////////////////////////////////////////////
	// DungeonGen.MainClass
	var $DungeonGen_MainClass = function() {
	};
	$DungeonGen_MainClass.$main = function(args) {
		//	Console.TreatControlCAsInput = true;
		//Console.CursorVisible = false;
		//StreamWriter file = new StreamWriter("dungeons.txt",true);
		//StandardDungeon d = new StandardDungeon();
		//bool done = false;
		//int count = 1;
		//bool show_converted = false;
		//d.CreateBasicMap();
		//while(!done){
		//if(show_converted){
		//d.DrawConverted();
		//}
		//else{
		//d.Draw();
		//}
		////Console.SetCursorPosition(0,22);
		////Console.Write("generate "C"orridor; generate "R"oom; "G"enerate room/corridor; remove "D"iagonals;");
		////Console.SetCursorPosition(0,23);
		////Console.Write("remove "U"nconnected; remove dead "E"nds; re"J"ect map if floors < count;");
		////Console.SetCursorPosition(0,24);
		////Console.Write("1:toggle allow_all_corner_connections ("+d.allow_all_corner_connections+"); 2:toggle rooms_overwrite_corridors ("+d.rooms_overwrite_corridors+");  ");
		////Console.SetCursorPosition(0,25);
		////Console.Write("3:toggle show_converted ("+show_converted+"); reject ma"P" if too empty;  ");
		////Console.SetCursorPosition(0,26);
		////Console.Write("ESC: End program; "S"ave to file; Z:Reset map; X:Clear map; choose cou"N"t: " + count + "              ");
		//Console.SetCursorPosition(67,0);
		//Console.Write("q: corridor");
		//Console.SetCursorPosition(67,1);
		//Console.Write("w: room");
		//Console.SetCursorPosition(67,2);
		//Console.Write("e: room / cor");
		//Console.SetCursorPosition(67,4);
		//if(d.allow_all_corner_connections){
		//Console.ForegroundColor = ConsoleColor.Green;
		//}
		//else{
		//Console.ForegroundColor = ConsoleColor.Red;
		//}
		//Console.Write("1: corner");
		//Console.SetCursorPosition(67,5);
		//Console.Write(" connections?");
		//Console.SetCursorPosition(67,6);
		//if(d.rooms_overwrite_corridors){
		//Console.ForegroundColor = ConsoleColor.Green;
		//}
		//else{
		//Console.ForegroundColor = ConsoleColor.Red;
		//}
		//Console.Write("2: rooms");
		//Console.SetCursorPosition(67,7);
		//Console.Write(" overwrite");
		//Console.SetCursorPosition(67,8);
		//Console.Write(" corridors?");
		//Console.SetCursorPosition(67,9);
		//if(show_converted){
		//Console.ForegroundColor = ConsoleColor.Green;
		//}
		//else{
		//Console.ForegroundColor = ConsoleColor.Red;
		//}
		//Console.Write("3: display");
		//Console.SetCursorPosition(67,10);
		//Console.Write(" converted?");
		//Console.ForegroundColor = ConsoleColor.Gray;
		//Console.SetCursorPosition(67,12);
		//Console.Write("a: remove");
		//Console.SetCursorPosition(67,13);
		//Console.Write(" diagonals");
		//Console.SetCursorPosition(67,14);
		//Console.Write("s: remove");
		//Console.SetCursorPosition(67,15);
		//Console.Write(" unconnected");
		//Console.SetCursorPosition(67,16);
		//Console.Write("d: remove");
		//Console.SetCursorPosition(67,17);
		//Console.Write(" dead ends");
		//Console.SetCursorPosition(67,19);
		//Console.Write("z: reset map");
		//Console.SetCursorPosition(67,20);
		//Console.Write("x: fill map");
		//Console.SetCursorPosition(67,21);
		//Console.Write(" with walls");
		//Console.SetCursorPosition(0,22);
		//Console.Write("  c: reject map if too empty   v: reject map if floors < count");
		//Console.SetCursorPosition(0,23);
		//Console.Write("  ESC: end program   b: save to file   n: choose count: " + count + "     ");
		//Console.SetCursorPosition(0,24);
		//Console.Write("  Rooms: hjkl; Corridors: 67890;   {0} {1} {2} {3} ;  {4} {5} {6} {7} {8}    ",d.room_height_min,d.room_height_max,d.room_width_min,d.room_width_max,
		//d.corridor_length_min,d.corridor_length_max,d.corridor_chain_length_min,d.corridor_chain_length_max,d.corridor_length_addition);
		//ConsoleKeyInfo command = Console.ReadKey(true);
		//switch(command.Key){
		//case ConsoleKey.Q:
		//{
		//for(int i=0;i<count;++i){
		//d.CreateCorridor(Dungeon.Roll(d.corridor_chain_length_max - (d.corridor_chain_length_min-1)) + (d.corridor_chain_length_min-1));
		//}
		//break;
		//}
		//case ConsoleKey.W:
		//{
		//for(int i=0;i<count;++i){
		//d.CreateRoom();
		//}
		//break;
		//}
		//case ConsoleKey.E:
		//{
		//for(int i=0;i<count;++i){
		//if(Dungeon.CoinFlip()){
		//d.CreateCorridor(Dungeon.Roll(d.corridor_chain_length_max - (d.corridor_chain_length_min-1)) + (d.corridor_chain_length_min-1));
		//}
		//else{
		//d.CreateRoom();
		//}
		//}
		//break;
		//}
		//case ConsoleKey.T:
		//d.Convert();
		//break;
		//case ConsoleKey.Y:
		//d.ConvertToShowFloorType();
		//break;
		//case ConsoleKey.A:
		//{
		//d.RemoveDiagonals();
		//break;
		//}
		//case ConsoleKey.S:
		//{
		//d.RemoveUnconnected();
		//break;
		//}
		//case ConsoleKey.D:
		//{
		//d.RemoveDeadEnds();
		//break;
		//}
		//case ConsoleKey.V:
		//{
		////if(d.NumberOfFloors() < count || d.HasLargeUnusedSpaces()){
		//if(d.NumberOfFloors() < count){
		//d.Clear();
		//}
		//break;
		//}
		//case ConsoleKey.C:
		//{
		//if(d.HasLargeUnusedSpaces()){
		//d.Clear();
		//}
		//break;
		//}
		//case ConsoleKey.B:
		//{
		//string s;
		//for(int i=0;i<StandardDungeon.H;++i){
		//s = "";
		//for(int j=0;j<StandardDungeon.W;++j){
		//if(show_converted){
		//s = s + StandardDungeon.ConvertedChar(d.map[i,j]);
		//}
		//else{
		//s = s + d.map[i,j];
		//}
		//}
		//file.WriteLine(s);
		//}
		//file.WriteLine();
		//file.WriteLine();
		//break;
		//}
		//case ConsoleKey.X:
		//d.Clear();
		//break;
		//case ConsoleKey.Z:
		//d.Clear();
		//d.CreateBasicMap();
		//break;
		//case ConsoleKey.N:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//count = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.O:
		//d.CreateRandomWalls(count);
		//break;
		//case ConsoleKey.P:
		//d.ApplyCellularAutomataFourFiveRule();
		//break;
		//case ConsoleKey.I:
		//d.ApplyCellularAutomataXYRule(3);
		//break;
		//case ConsoleKey.G:
		//d.ApplyCaveModification();
		//break;
		//case ConsoleKey.F:
		//d.AddPillars(count);
		//break;
		//case ConsoleKey.M:
		//d.MarkInterestingLocations();
		//break;
		//case ConsoleKey.R:
		//switch(count % 10){
		//case 1:
		//d.Reflect(true,false);
		//break;
		//case 2:
		//d.Reflect(false,true);
		//break;
		//case 3:
		//d.Reflect(true,true);
		//break;
		//}
		//break;
		//case ConsoleKey.H:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.room_height_min = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.J:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.room_height_max = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.K:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.room_width_min = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.L:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.room_width_max = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.D6:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.corridor_length_min = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.D7:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.corridor_length_max = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.D8:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.corridor_chain_length_min = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.D9:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.corridor_chain_length_max = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.D0:
		//{
		//Console.SetCursorPosition(56,23);
		//Console.Write("          ");
		//Console.SetCursorPosition(56,23);
		//Console.CursorVisible = true;
		//try{
		//d.corridor_length_addition = int.Parse(Console.ReadLine());
		//}
		//catch(System.FormatException){
		////do nothing
		//}
		//Console.CursorVisible = false;
		//break;
		//}
		//case ConsoleKey.U:
		//d.ApplyRuin();
		//break;
		//case ConsoleKey.D1:
		//d.allow_all_corner_connections = !d.allow_all_corner_connections;
		//break;
		//case ConsoleKey.D2:
		//d.rooms_overwrite_corridors = !d.rooms_overwrite_corridors;
		//break;
		//case ConsoleKey.D3:
		//show_converted = !show_converted;
		//break;
		//case ConsoleKey.Escape:
		//done = true;
		//break;
		//default:
		//break;
		//}
		//}
		//if(show_converted){
		//d.DrawConverted();
		//}
		//else{
		//d.Draw();
		//}
		//file.Close();
		//Console.SetCursorPosition(0,21);
		//Console.CursorVisible = true;
	};
	////////////////////////////////////////////////////////////////////////////////
	// DungeonGen.pos
	var $DungeonGen_pos = function(r_, c_) {
		this.r = 0;
		this.c = 0;
		this.r = r_;
		this.c = c_;
	};
	$DungeonGen_pos.prototype = {
		equals: function(tgt) {
			return ss.isValue(tgt) && this.r === tgt.r && this.c === tgt.c;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// DungeonGen.StandardDungeon
	var $DungeonGen_StandardDungeon = function() {
		this.allow_all_corner_connections = false;
		this.rooms_overwrite_corridors = true;
		this.rooms_over_rooms = false;
		this.room_height_min = 3;
		this.room_height_max = 8;
		this.room_width_min = 3;
		this.room_width_max = 10;
		this.corridor_length_min = 3;
		this.corridor_length_max = 7;
		this.corridor_length_addition = 8;
		this.corridor_chain_length_min = 1;
		this.corridor_chain_length_max = 4;
		$DungeonGen_Dungeon.call(this);
		for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
			for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
				this.map$1.set(i, j, '#');
			}
		}
	};
	$DungeonGen_StandardDungeon.prototype = {
		generateStandard: function() {
			this.resetToDefaults();
			while (true) {
				this.createBasicMap();
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				this.addDoors();
				this.addPillars(30);
				this.markInterestingLocations();
				if (this.numberOfFloors() < 320 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateCave: function() {
			this.resetToDefaults();
			while (true) {
				this.createRandomWalls(25);
				this.applyCellularAutomataXYRule(3);
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				this.addFirePits();
				if (this.numberOfFloors() < 320 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateRuined: function() {
			this.resetToDefaults();
			while (true) {
				this.createBasicMap();
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				this.addDoors();
				this.addPillars(30);
				this.markInterestingLocations();
				if (this.numberOfFloors() < 320 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					for (var i = 0; i < 5; ++i) {
						this.applyRuin();
					}
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateHive: function() {
			this.resetToDefaults();
			this.room_height_max = 3;
			this.room_width_max = 3;
			this.corridor_length_min = 4;
			this.corridor_length_max = 4;
			this.corridor_length_addition = 4;
			while (true) {
				this.createBasicMap();
				for (var i = 0; i < 700; ++i) {
					if ($DungeonGen_Dungeon.coinFlip()) {
						this.createCorridor$1($DungeonGen_Dungeon.roll(this.corridor_chain_length_max - (this.corridor_chain_length_min - 1)) + (this.corridor_chain_length_min - 1));
					}
					else {
						this.createRoom();
					}
				}
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				if (this.numberOfFloors() < 320 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateMine: function() {
			this.resetToDefaults();
			this.room_height_min = 4;
			this.room_height_max = 10;
			this.room_width_min = 4;
			this.room_width_max = 12;
			while (true) {
				this.createBasicMap();
				this.removeUnconnected();
				if (!this.applyCaveModification()) {
					this.clear();
					continue;
				}
				this.removeDiagonals();
				this.removeUnconnected();
				this.addFirePits();
				this.markInterestingLocations();
				if (this.numberOfFloors() < 420 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					if ($DungeonGen_Dungeon.roll(10) === 10) {
						this.applyRuin();
					}
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateFortress: function() {
			this.resetToDefaults();
			while (true) {
				// it could require a certain number of room tiles if corridor-heavy fortresses are too common
				for (var i = 10; i < 12; ++i) {
					for (var j = 1; j < 65; ++j) {
						if (j === 1 || j === 64) {
							this.map$1.set(i, j, 'c');
						}
						else {
							this.map$1.set(i, j, 'E');
						}
					}
				}
				for (var i1 = 0; i1 < 700; ++i1) {
					if ($DungeonGen_Dungeon.roll(5) === 5) {
						this.createCorridor$1($DungeonGen_Dungeon.roll(this.corridor_chain_length_max - (this.corridor_chain_length_min - 1)) + (this.corridor_chain_length_min - 1));
					}
					else {
						this.createRoom();
					}
				}
				var reflect_features = $DungeonGen_Dungeon.roll(5) <= 4;
				if (reflect_features) {
					this.addDoors();
					this.addPillars(30);
				}
				this.reflect(true, false);
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				if (!reflect_features) {
					this.addDoors();
					this.addPillars(30);
				}
				var door_right = false;
				var door_left = false;
				var rightmost_door = 0;
				var leftmost_door = 999;
				for (var j1 = 0; j1 < 22; ++j1) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(9, j1)) === '.' || $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(9, j1)) === '+') {
						door_left = true;
						if (leftmost_door === 999) {
							leftmost_door = j1;
						}
					}
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(9, 65 - j1)) === '.' || $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(9, 65 - j1)) === '+') {
						door_right = true;
						if (rightmost_door === 0) {
							rightmost_door = 65 - j1;
						}
					}
				}
				if (!door_left || !door_right) {
					this.clear();
					continue;
				}
				for (var j2 = 1; j2 < leftmost_door - 6; ++j2) {
					this.map$1.set(10, j2, '#');
					this.map$1.set(11, j2, '#');
				}
				for (var j3 = 64; j3 > rightmost_door + 6; --j3) {
					this.map$1.set(10, j3, '#');
					this.map$1.set(11, j3, '#');
				}
				for (var j4 = 1; j4 < 65; ++j4) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(10, j4)) === '.') {
						this.map$1.set(10, j4, '&');
						this.map$1.set(11, j4, '&');
						break;
					}
					else if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(10, j4)) === '&') {
						break;
					}
				}
				for (var j5 = 64; j5 > 0; --j5) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(10, j5)) === '.') {
						this.map$1.set(10, j5, '&');
						this.map$1.set(11, j5, '&');
						break;
					}
					else if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(10, j5)) === '&') {
						break;
					}
				}
				this.markInterestingLocations();
				if (this.numberOfFloors() < 420 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					//for(int i=0;i<H;++i){
					//for(int j=0;j<W;++j){
					//Forays.Screen.WriteMapChar(i,j,map[i,j]);
					//}
					//}
					//Console.ReadKey(true);
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		generateExtravagant: function() {
			this.resetToDefaults();
			while (true) {
				this.createBasicMap();
				this.removeDiagonals();
				this.removeDeadEnds();
				this.removeUnconnected();
				this.addDoors();
				this.addPillars(100);
				this.markInterestingLocations();
				if (this.numberOfFloors() < 320 || this.hasLargeUnusedSpaces()) {
					this.clear();
				}
				else {
					this.convert();
					break;
				}
			}
			return this.map$1;
		},
		resetToDefaults: function() {
			this.allow_all_corner_connections = false;
			this.rooms_overwrite_corridors = true;
			this.rooms_over_rooms = false;
			this.room_height_min = 3;
			this.room_height_max = 8;
			this.room_width_min = 3;
			this.room_width_max = 10;
			this.corridor_length_min = 3;
			this.corridor_length_max = 7;
			this.corridor_length_addition = 8;
			this.corridor_chain_length_min = 1;
			this.corridor_chain_length_max = 4;
		},
		draw: function() {
			$Forays_Game.console.cursorVisible = false;
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					$Forays_Game.console.setCursorPosition(j, i);
					$Forays_Game.console.write$1(this.map$1.get(i, j));
				}
			}
		},
		drawConverted: function() {
			$Forays_Game.console.cursorVisible = false;
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					$Forays_Game.console.setCursorPosition(j, i);
					$Forays_Game.console.write$1($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)));
				}
			}
		},
		numberOfFloors: function() {
			var total = 0;
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '.') {
						total++;
					}
				}
			}
			return total;
		},
		clear: function() {
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					this.map$1.set(i, j, '#');
				}
			}
		},
		hasLargeUnusedSpaces: function() {
			for (var i = 1; i < 21; ++i) {
				for (var j = 1; j < 65; ++j) {
					var good = true;
					var width = -1;
					if ($DungeonGen_Dungeon.w - j - 1 < 15) {
						good = false;
					}
					else {
						for (var k = 0; k < $DungeonGen_Dungeon.w - j - 1; ++k) {
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j + k)) !== '#') {
								if (k < 15) {
									good = false;
								}
								break;
							}
							else {
								width = k + 1;
							}
						}
					}
					for (var lines = 1; lines < $DungeonGen_Dungeon.h - i - 1 && good; ++lines) {
						if (lines * width >= 300) {
							return true;
						}
						for (var k1 = 0; k1 < $DungeonGen_Dungeon.w - j - 1; ++k1) {
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + lines, j + k1)) !== '#') {
								if (k1 < 15) {
									good = false;
								}
								else if (k1 + 1 < width) {
									width = k1 + 1;
								}
								break;
							}
						}
					}
				}
			}
			return false;
		},
		convert: function() {
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					switch (this.map$1.get(i, j)) {
						case 'h':
						case 'v':
						case 'i':
						case 'E':
						case 'c':
						case 'N':
						case 'r': {
							this.map$1.set(i, j, '.');
							break;
						}
						case 'P': {
							this.map$1.set(i, j, '#');
							break;
						}
					}
				}
			}
		},
		convertToShowFloorType: function() {
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if (this.map$1.get(i, j) === '.') {
						this.map$1.set(i, j, this.findFloorType(i, j));
					}
				}
			}
		},
		isCorridor$1: function(ch) {
			switch (ch) {
				case 'h':
				case 'v':
				case 'i':
				case '+': {
					return true;
				}
				default: {
					return false;
				}
			}
		},
		isCorridor$2: function(r, c) {
			return this.isCorridor(new $DungeonGen_pos(r, c));
		},
		isCorridor: function(p) {
			if (!this.isRoom(p) && $DungeonGen_StandardDungeon.convertedChar(this.map(p)) !== '#') {
				return true;
			}
			return false;
		},
		isRoom$1: function(ch) {
			switch (ch) {
				case 'r':
				case 'E':
				case 'c':
				case 'N':
				case 'P':
				case '0':
				case '&':
				case '$': {
					return true;
				}
				default: {
					return false;
				}
			}
		},
		isRoomOrGenericFloor: function(ch) {
			if (this.isRoom$1(ch) || ch === '.') {
				return true;
			}
			return false;
		},
		isRoom$2: function(r, c) {
			return this.isRoom(new $DungeonGen_pos(r, c));
		},
		isRoom: function(p) {
			if (!this.isRoomOrGenericFloor(this.map(p))) {
				return false;
			}
			for (var i = 2; i <= 8; i += 2) {
				if (this.isRoomOrGenericFloor(this.map($DungeonGen_Dungeon.posInDir(p, i))) && this.isRoomOrGenericFloor(this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(i, true, 1)))) && this.isRoomOrGenericFloor(this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(i, true, 2))))) {
					return true;
				}
			}
			return false;
		},
		findFloorType: function(r, c) {
			var p = new $DungeonGen_pos(r, c);
			if ($DungeonGen_StandardDungeon.convertedChar(this.map(p)) !== '.') {
				return $DungeonGen_StandardDungeon.convertedChar(this.map(p));
			}
			if (this.isRoom$2(r, c)) {
				//int num_walls = ForEachDirection(r,c,ch => ConvertedChar(ch)=="#",true);
				var num_walls = 0;
				for (var i = 1; i <= 8; ++i) {
					var dir = i;
					if (dir === 5) {
						dir = 9;
					}
					if (!this.isRoom($DungeonGen_Dungeon.posInDir(p, dir))) {
						++num_walls;
					}
				}
				if (num_walls === 0) {
					return 'r';
				}
				var num_dirs_with_walls = 0;
				for (var i1 = 2; i1 <= 8; i1 += 2) {
					if (!this.isRoom($DungeonGen_Dungeon.posInDir(p, i1)) && !this.isRoom($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(i1, true, 1))) && !this.isRoom($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(i1, false, 1)))) {
						num_dirs_with_walls++;
					}
				}
				if (num_walls === 3 && num_dirs_with_walls === 1) {
					return 'E';
				}
				if (num_walls === 5 && num_dirs_with_walls === 2) {
					return 'c';
				}
			}
			else {
				if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 8))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 2))) === '#') {
					return 'h';
				}
				if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 4))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 6))) === '#') {
					return 'v';
				}
				if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 1))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 9))) === '#') {
					return 'i';
				}
				if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 7))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, 3))) === '#') {
					return 'i';
				}
			}
			return 'N';
		},
		removeDiagonals: function() {
			var walls = [];
			for (var i = 1; i < 20; ++i) {
				for (var j = 1; j < 64; ++j) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j + 1)) === '#') {
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + 1, j)) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + 1, j + 1)) === '.') {
							walls.add(new $DungeonGen_pos(i, j + 1));
							walls.add(new $DungeonGen_pos(i + 1, j));
						}
					}
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j + 1)) === '.') {
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + 1, j)) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + 1, j + 1)) === '#') {
							walls.add(new $DungeonGen_pos(i, j));
							walls.add(new $DungeonGen_pos(i + 1, j + 1));
						}
					}
					if (walls.length > 0) {
						var wall0 = walls[0];
						var wall1 = walls[1];
						while (walls.length > 0) {
							var p = walls[$DungeonGen_Dungeon.roll(walls.length) - 1];
							walls.remove(p);
							var direction_of_other_wall = 0;
							var rotated = new Array(8);
							for (var ii = 0; ii < 8; ++ii) {
								rotated[ii] = this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(8, true, ii)));
								var other_wall = new $DungeonGen_pos(-1, -1);
								if (p.r === wall0.r && p.c === wall0.c) {
									other_wall = wall1;
								}
								else {
									other_wall = wall0;
								}
								if ($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(8, true, ii)).r === other_wall.r && $DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(8, true, ii)).c === other_wall.c) {
									direction_of_other_wall = $DungeonGen_Dungeon.rotateDir$1(8, true, ii);
								}
							}
							var successive_walls = 0;
							for (var ii1 = 5; ii1 < 8; ++ii1) {
								if ($DungeonGen_StandardDungeon.convertedChar(rotated[ii1]) === '#') {
									successive_walls++;
								}
								else {
									successive_walls = 0;
								}
							}
							for (var ii2 = 0; ii2 < 8; ++ii2) {
								if ($DungeonGen_StandardDungeon.convertedChar(rotated[ii2]) === '#') {
									successive_walls++;
								}
								else {
									successive_walls = 0;
								}
								if (successive_walls === 4 || $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(direction_of_other_wall, true, 3)))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(direction_of_other_wall, true, 4)))) === '#' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(p, $DungeonGen_Dungeon.rotateDir$1(direction_of_other_wall, true, 5)))) === '#') {
									this.map$1.set(p.r, p.c, 'i');
									if (this.isLegal(p.r, p.c)) {
										walls.clear();
									}
									else {
										this.map$1.set(p.r, p.c, '#');
									}
									break;
								}
							}
						}
					}
				}
			}
		},
		removeDeadEnds: function() {
			var changed = true;
			while (changed) {
				changed = false;
				for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
					for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '.' || $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '+') {
							var total = 0;
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i + 1, j)) === '#') {
								++total;
							}
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i - 1, j)) === '#') {
								++total;
							}
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j + 1)) === '#') {
								++total;
							}
							if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j - 1)) === '#') {
								++total;
							}
							if (total >= 3) {
								this.map$1.set(i, j, '#');
								changed = true;
							}
						}
					}
				}
			}
		},
		removeUnconnected: function() {
			var num = Array.multidim(ss.Int32.getDefaultValue(), $DungeonGen_Dungeon.h, $DungeonGen_Dungeon.w);
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '.' || this.map$1.get(i, j) === '&' || this.map$1.get(i, j) === ':' || this.map$1.get(i, j) === 'P' || this.map$1.get(i, j) === '+') {
						num.set(i, j, 0);
					}
					else {
						num.set(i, j, -1);
					}
				}
			}
			var count = 0;
			for (var i1 = 0; i1 < $DungeonGen_Dungeon.h; ++i1) {
				for (var j1 = 0; j1 < $DungeonGen_Dungeon.w; ++j1) {
					if (num.get(i1, j1) === 0) {
						count++;
						num.set(i1, j1, count);
						var changed = true;
						while (changed) {
							changed = false;
							for (var s = 0; s < $DungeonGen_Dungeon.h; ++s) {
								for (var t = 0; t < $DungeonGen_Dungeon.w; ++t) {
									if (num.get(s, t) === count) {
										for (var ds = -1; ds <= 1; ++ds) {
											for (var dt = -1; dt <= 1; ++dt) {
												if (num.get(s + ds, t + dt) === 0) {
													num.set(s + ds, t + dt, count);
													changed = true;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			var biggest_area = -1;
			var size_of_biggest_area = 0;
			for (var k = 1; k <= count; ++k) {
				var size = 0;
				for (var i2 = 0; i2 < $DungeonGen_Dungeon.h; ++i2) {
					for (var j2 = 0; j2 < $DungeonGen_Dungeon.w; ++j2) {
						if (num.get(i2, j2) === k) {
							size++;
						}
					}
				}
				if (size > size_of_biggest_area) {
					size_of_biggest_area = size;
					biggest_area = k;
				}
			}
			for (var i3 = 0; i3 < $DungeonGen_Dungeon.h; ++i3) {
				for (var j3 = 0; j3 < $DungeonGen_Dungeon.w; ++j3) {
					if (num.get(i3, j3) !== biggest_area) {
						this.map$1.set(i3, j3, '#');
					}
				}
			}
		},
		addDoors: function() {
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '.') {
						if (this.map$1.get(i - 1, j) === '#' && this.map$1.get(i + 1, j) === '#' || this.map$1.get(i, j - 1) === '#' && this.map$1.get(i, j + 1) === '#') {
							//walls on opposite sides
							var potential_door = false;
							for (var k = 2; k <= 8; k += 2) {
								if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir$1(i, j, k))) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(i, j, k), k))) === '.') {
									if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(i, j, k), $DungeonGen_Dungeon.rotateDir$1(k, false, 2)))) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(i, j, k), $DungeonGen_Dungeon.rotateDir$1(k, false, 1)))) === '.') {
										potential_door = true;
									}
									if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(i, j, k), $DungeonGen_Dungeon.rotateDir$1(k, true, 2)))) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(i, j, k), $DungeonGen_Dungeon.rotateDir$1(k, true, 1)))) === '.') {
										potential_door = true;
									}
								}
								if (this.map($DungeonGen_Dungeon.posInDir$1(i, j, k)) === '+') {
									potential_door = false;
									break;
								}
							}
							if (potential_door && $DungeonGen_Dungeon.roll(4) === 4) {
								this.map$1.set(i, j, '+');
							}
						}
					}
				}
			}
		},
		addFirePits: function() {
			var num_firepits = 0;
			switch ($DungeonGen_Dungeon.roll(5)) {
				case 1: {
					num_firepits = 1;
					break;
				}
				case 2: {
					num_firepits = $DungeonGen_Dungeon.roll(4) + 1;
					break;
				}
			}
			for (var i = 0; i < num_firepits; ++i) {
				var tries = 0;
				for (var done = false; !done && tries < 100; ++tries) {
					var rr = $DungeonGen_Dungeon.roll(18) + 1;
					var rc = $DungeonGen_Dungeon.roll(62) + 1;
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(rr, rc)) === '.') {
						var floors = true;
						var temp = new $DungeonGen_pos(rr, rc);
						for (var ii = 1; ii <= 8; ++ii) {
							var dir = ii;
							if (dir === 5) {
								dir = 9;
							}
							if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir(temp, dir))) !== '.') {
								floors = false;
								break;
							}
						}
						if (floors) {
							this.map$1.set(rr, rc, '0');
							done = true;
						}
					}
				}
			}
		},
		isLegal: function(r, c) {
			if (r === 0 || r === 21 || c === 0 || c === 65) {
				return true;
			}
			var result = true;
			switch (this.map$1.get(r, c)) {
				case 'r': {
					break;
				}
				case 'E': {
					var roomdir = 0;
					if (this.map$1.get(r - 1, c) === 'r') {
						roomdir = 8;
					}
					if (this.map$1.get(r + 1, c) === 'r') {
						roomdir = 2;
					}
					if (this.map$1.get(r, c - 1) === 'r') {
						roomdir = 4;
					}
					if (this.map$1.get(r, c + 1) === 'r') {
						roomdir = 6;
					}
					if (roomdir === 0) {
						//return false; //no room found, error - disabled for the sake of special tiny rooms with h/w of 2
						var rotated = new Array(8);
						for (var i = 0; i < 8; ++i) {
							rotated[i] = this.map($DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(8, true, i)));
						}
						var successive_corridors = 0;
						if (this.isCorridor$1(rotated[7])) {
							successive_corridors++;
						}
						for (var i1 = 0; i1 < 8; ++i1) {
							if (this.isCorridor$1(rotated[i1])) {
								successive_corridors++;
							}
							else {
								successive_corridors = 0;
							}
							if (successive_corridors === 2) {
								return false;
							}
						}
						var successive_room_tiles = 0;
						if (this.isRoom$1(rotated[5])) {
							successive_room_tiles++;
						}
						if (this.isRoom$1(rotated[6])) {
							successive_room_tiles++;
						}
						else {
							successive_room_tiles = 0;
						}
						if (this.isRoom$1(rotated[7])) {
							successive_room_tiles++;
						}
						else {
							successive_room_tiles = 0;
						}
						for (var i2 = 0; i2 < 8; ++i2) {
							if (this.isRoom$1(rotated[i2])) {
								successive_room_tiles++;
							}
							else {
								successive_room_tiles = 0;
							}
							if (successive_room_tiles === 5) {
								return true;
							}
						}
					}
					else {
						var rotated1 = new Array(8);
						rotated1[0] = 'r';
						for (var i3 = 1; i3 < 8; ++i3) {
							rotated1[i3] = this.map($DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(roomdir, true, i3)));
						}
						if (rotated1[1] !== 'r' && rotated1[1] !== 'E') {
							return false;
						}
						if (rotated1[7] !== 'r' && rotated1[7] !== 'E') {
							return false;
						}
						if (rotated1[2] !== 'c' && rotated1[2] !== 'E' && rotated1[2] !== 'N') {
							return false;
						}
						if (rotated1[6] !== 'c' && rotated1[6] !== 'E' && rotated1[6] !== 'N') {
							return false;
						}
						if (!(rotated1[4] === '#' || rotated1[3] === '#' && rotated1[5] === '#')) {
							return false;
						}
					}
					break;
				}
				case 'c': {
					var roomdir1 = 0;
					if (this.map$1.get(r - 1, c - 1) === 'r') {
						roomdir1 = 7;
					}
					if (this.map$1.get(r - 1, c + 1) === 'r') {
						roomdir1 = 9;
					}
					if (this.map$1.get(r + 1, c - 1) === 'r') {
						roomdir1 = 1;
					}
					if (this.map$1.get(r + 1, c + 1) === 'r') {
						roomdir1 = 3;
					}
					if (roomdir1 === 0) {
						return false;
						//no room found, error
					}
					var rotated2 = new Array(8);
					rotated2[0] = 'r';
					for (var i4 = 1; i4 < 8; ++i4) {
						rotated2[i4] = this.map($DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(roomdir1, true, i4)));
					}
					if (rotated2[1] !== 'E') {
						return false;
					}
					if (rotated2[7] !== 'E') {
						return false;
					}
					if (this.allow_all_corner_connections) {
						if (rotated2[2] !== '#' && rotated2[3] !== '#') {
							return false;
						}
						if (rotated2[6] !== '#' && rotated2[5] !== '#') {
							return false;
						}
						if (rotated2[4] !== '#') {
							if (rotated2[3] !== '#' && rotated2[5] !== '#') {
								return false;
							}
							if (rotated2[3] === '#' && rotated2[5] === '#') {
								return false;
							}
						}
					}
					else if (rotated2[3] !== '#' || rotated2[4] !== '#' || rotated2[5] !== '#') {
						return false;
					}
					break;
				}
				case 'N': {
					break;
				}
				case 'i': {
					var rotated3 = new Array(8);
					for (var i5 = 0; i5 < 8; ++i5) {
						rotated3[i5] = this.map($DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(8, true, i5)));
					}
					var successive_floors = 0;
					if ($DungeonGen_StandardDungeon.convertedChar(rotated3[6]) === '.') {
						successive_floors++;
					}
					if ($DungeonGen_StandardDungeon.convertedChar(rotated3[7]) === '.') {
						successive_floors++;
					}
					else {
						successive_floors = 0;
					}
					for (var i6 = 0; i6 < 8; ++i6) {
						if ($DungeonGen_StandardDungeon.convertedChar(rotated3[i6]) === '.') {
							successive_floors++;
						}
						else {
							successive_floors = 0;
						}
						if (successive_floors === 3) {
							return false;
						}
					}
					break;
				}
				case 'h': {
					if (r > 19 || this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 2), 2)) === 'h') {
						return false;
					}
					if (r < 2 || this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 8), 8)) === 'h') {
						return false;
					}
					break;
				}
				case 'v': {
					if (c > 63 || this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 6), 6)) === 'v') {
						return false;
					}
					if (c < 2 || this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 4), 4)) === 'v') {
						return false;
					}
					break;
				}
				case 'X': {
					for (var i7 = 1; i7 <= 8; ++i7) {
						var dir = i7;
						if (dir === 5) {
							dir = 9;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir$1(r, c, dir))) !== '#') {
							return false;
						}
					}
					break;
				}
				default: {
					break;
				}
			}
			return result;
		},
		createRoom: function() {
			return this.createRoom$1($DungeonGen_Dungeon.roll(20), $DungeonGen_Dungeon.roll(64));
		},
		createRoom$1: function(rr, rc) {
			var dir = $DungeonGen_Dungeon.roll(4) * 2 - 1;
			if (dir === 5) {
				dir = 9;
			}
			return this.createRoom$2(rr, rc, dir);
		},
		createRoom$2: function(rr, rc, dir) {
			//int height = Roll(6)+2; //these 2 lines are still accurate, but were generalized for testing purposes below.
			//int width = Roll(8)+2;
			var height = $DungeonGen_Dungeon.roll(this.room_height_max - (this.room_height_min - 1)) + (this.room_height_min - 1);
			var width = $DungeonGen_Dungeon.roll(this.room_width_max - (this.room_width_min - 1)) + (this.room_width_min - 1);
			var h_offset = 0;
			var w_offset = 0;
			if (height % 2 === 0) {
				h_offset = $DungeonGen_Dungeon.roll(2) - 1;
			}
			if (width % 2 === 0) {
				w_offset = $DungeonGen_Dungeon.roll(2) - 1;
			}
			switch (dir) {
				case 7: {
					rr -= height - 1;
					rc -= width - 1;
					break;
				}
				case 9: {
					rr -= height - 1;
					break;
				}
				case 1: {
					rc -= width - 1;
					break;
				}
				case 8: {
					rr -= height - 1;
					rc -= ss.Int32.div(width, 2) - w_offset;
					break;
				}
				case 2: {
					rc -= ss.Int32.div(width, 2) - w_offset;
					break;
				}
				case 4: {
					rr -= ss.Int32.div(height, 2) - h_offset;
					rc -= width - 1;
					break;
				}
				case 6: {
					rr -= ss.Int32.div(height, 2) - h_offset;
					break;
				}
			}
			dir = 3;
			//does nothing at the moment
			var inbounds = true;
			for (var i = rr; i < rr + height && inbounds; ++i) {
				for (var j = rc; j < rc + width; ++j) {
					if (!this.boundsCheck(i, j)) {
						inbounds = false;
						break;
					}
				}
			}
			if (inbounds) {
				var submap = Array.multidim(String.getDefaultValue(), height, width);
				for (var i1 = 0; i1 < height; ++i1) {
					for (var j1 = 0; j1 < width; ++j1) {
						submap.set(i1, j1, this.map$1.get(i1 + rr, j1 + rc));
					}
				}
				var good = true;
				for (var i2 = 0; i2 < height && good; ++i2) {
					for (var j2 = 0; j2 < width && good; ++j2) {
						var place_here = false;
						switch (this.map$1.get(i2 + rr, j2 + rc)) {
							case 'h':
							case 'v':
							case 'i': {
								if (this.rooms_overwrite_corridors) {
									place_here = true;
								}
								else {
									good = false;
								}
								break;
							}
							case 'E':
							case 'c':
							case 'N':
							case 'r': {
								if (this.rooms_over_rooms) {
									place_here = true;
								}
								else {
									good = false;
								}
								break;
							}
							case 'X': {
								good = false;
								break;
							}
							default: {
								place_here = true;
								break;
							}
						}
						if (place_here) {
							var total = 0;
							if (i2 === 0) {
								++total;
							}
							if (i2 === height - 1) {
								++total;
							}
							if (j2 === 0) {
								++total;
							}
							if (j2 === width - 1) {
								++total;
							}
							switch (total) {
								case 0: {
									this.map$1.set(i2 + rr, j2 + rc, 'r');
									break;
								}
								case 1: {
									this.map$1.set(i2 + rr, j2 + rc, 'E');
									break;
								}
								case 2: {
									this.map$1.set(i2 + rr, j2 + rc, 'c');
									break;
								}
								default: {
									this.map$1.set(i2 + rr, j2 + rc, '$');
									break;
								}
							}
						}
					}
				}
				for (var i3 = -1; i3 < height + 1 && good; ++i3) {
					for (var j3 = -1; j3 < width + 1 && good; ++j3) {
						if (!this.isLegal(i3 + rr, j3 + rc)) {
							good = false;
						}
					}
				}
				//Draw();
				//Console.ReadKey(true);
				if (!good) {
					//if this addition is illegal...
					for (var i4 = 0; i4 < height; ++i4) {
						for (var j4 = 0; j4 < width; ++j4) {
							this.map$1.set(i4 + rr, j4 + rc, submap.get(i4, j4));
						}
					}
				}
				else {
					return true;
				}
			}
			return false;
		},
		createCorridor: function() {
			return this.createCorridor$4($DungeonGen_Dungeon.roll(20), $DungeonGen_Dungeon.roll(64), 1, $DungeonGen_Dungeon.roll(4) * 2);
		},
		createCorridor$1: function(count) {
			return this.createCorridor$4($DungeonGen_Dungeon.roll(20), $DungeonGen_Dungeon.roll(64), count, $DungeonGen_Dungeon.roll(4) * 2);
		},
		createCorridor$2: function(rr, rc) {
			return this.createCorridor$4(rr, rc, 1, $DungeonGen_Dungeon.roll(4) * 2);
		},
		createCorridor$3: function(rr, rc, count) {
			return this.createCorridor$4(rr, rc, count, $DungeonGen_Dungeon.roll(4) * 2);
		},
		createCorridor$4: function(rr, rc, count, dir) {
			var result = false;
			var endpoint = new $DungeonGen_pos(rr, rc);
			var potential_endpoint;
			var chain = null;
			if (count > 1) {
				chain = [];
			}
			var tries = 0;
			while (count > 0 && tries < 100) {
				//assume there's no room for a corridor if it fails 25 times in a row
				tries++;
				rr = endpoint.r;
				rc = endpoint.c;
				potential_endpoint = endpoint;
				if (ss.isValue(chain) && chain.length > 0) {
					//reroll direction ONLY after the first part of the chain.
					dir = $DungeonGen_Dungeon.roll(4) * 2;
				}
				//int length = Roll(5)+2;	//again, these 2 lines are still accurate, but have been generalized for
				//if(CoinFlip()){ length += 8; } //testing purposes below:
				var length = $DungeonGen_Dungeon.roll(this.corridor_length_max - (this.corridor_length_min - 1)) + (this.corridor_length_min - 1);
				if ($DungeonGen_Dungeon.coinFlip()) {
					length += this.corridor_length_addition;
				}
				switch (dir) {
					case 8: {
						dir = 2;
						rr -= length - 1;
						potential_endpoint.r = rr;
						break;
					}
					case 2: {
						potential_endpoint.r += length - 1;
						break;
					}
					case 4: {
						dir = 6;
						rc -= length - 1;
						potential_endpoint.c = rc;
						break;
					}
					case 6: {
						potential_endpoint.c += length - 1;
						break;
					}
				}
				switch (dir) {
					case 2: {
						var valid_position = true;
						for (var i = rr; i < rr + length; ++i) {
							if (!this.boundsCheck(i, rc)) {
								valid_position = false;
								break;
							}
							if (true) {
								if (ss.isValue(chain) && chain.length > 0 && i !== endpoint.r && chain.contains(new $DungeonGen_pos(i, rc))) {
									valid_position = false;
									break;
								}
							}
						}
						if (valid_position) {
							var submap = new Array(length + 2);
							for (var i1 = 0; i1 < length + 2; ++i1) {
								submap[i1] = this.map$1.get(i1 + rr - 1, rc);
							}
							var good = true;
							for (var i2 = 0; i2 < length; ++i2) {
								if (this.map$1.get(i2 + rr, rc) === 'h' || this.map$1.get(i2 + rr, rc - 1) === 'h' || this.map$1.get(i2 + rr, rc + 1) === 'h') {
									this.map$1.set(i2 + rr, rc, 'i');
								}
								else {
									switch (this.map$1.get(i2 + rr, rc)) {
										case 'i':
										case 'E':
										case 'r': {
											break;
										}
										case 'c': {
											if (this.allow_all_corner_connections === false) {
												good = false;
											}
											break;
										}
										case 'X': {
											good = false;
											break;
										}
										default: {
											this.map$1.set(i2 + rr, rc, 'v');
											break;
										}
									}
								}
							}
							if (good && this.map$1.get(rr - 1, rc) === 'h') {
								this.map$1.set(rr - 1, rc, 'i');
							}
							if (good && this.map$1.get(rr + length, rc) === 'h') {
								this.map$1.set(rr + length, rc, 'i');
							}
							for (var i3 = rr - 1; i3 < rr + length + 1 && good; ++i3) {
								//note that it doesn't check the bottom or right, since
								for (var j = rc - 1; j < rc + 2; ++j) {
									//they are checked by the others
									if (i3 !== rr + length && j !== rc + 1) {
										if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i3, j)) === '.') {
											if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i3, j + 1)) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i3 + 1, j)) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i3 + 1, j + 1)) === '.') {
												good = false;
												break;
											}
										}
									}
									if (!this.isLegal(i3, j)) {
										good = false;
										break;
									}
								}
							}
							//Draw();
							//if(chain != null){
							//foreach(pos p in chain){
							//Console.SetCursorPosition(25+p.c,p.r);
							//if(ConvertedChar(map[p.r,p.c]) == "."){
							//Console.Write("X");
							//}
							//else{
							//Console.Write("x");
							//}
							//}
							//}
							//Console.ReadKey(true);
							if (!good) {
								//if this addition is illegal...
								for (var i4 = 0; i4 < length + 2; ++i4) {
									this.map$1.set(i4 + rr - 1, rc, submap[i4]);
								}
							}
							else {
								count--;
								tries = 0;
								if (ss.isValue(chain)) {
									if (chain.length === 0) {
										chain.add(endpoint);
									}
									for (var i5 = rr; i5 < rr + length; ++i5) {
										var p = new $DungeonGen_pos(i5, rc);
										if (!p.equals(endpoint)) {
											chain.add(p);
										}
									}
								}
								endpoint = potential_endpoint;
								result = true;
							}
						}
						break;
					}
					case 6: {
						var valid_position1 = true;
						for (var j1 = rc; j1 < rc + length; ++j1) {
							if (!this.boundsCheck(rr, j1)) {
								valid_position1 = false;
								break;
							}
							if (true) {
								if (ss.isValue(chain) && chain.length > 0 && j1 !== endpoint.c && chain.contains(new $DungeonGen_pos(rr, j1))) {
									valid_position1 = false;
									break;
								}
							}
						}
						if (valid_position1) {
							var submap1 = new Array(length + 2);
							for (var j2 = 0; j2 < length + 2; ++j2) {
								submap1[j2] = this.map$1.get(rr, j2 + rc - 1);
							}
							var good1 = true;
							for (var j3 = 0; j3 < length; ++j3) {
								if (this.map$1.get(rr, j3 + rc) === 'v' || this.map$1.get(rr - 1, j3 + rc) === 'v' || this.map$1.get(rr + 1, j3 + rc) === 'v') {
									this.map$1.set(rr, j3 + rc, 'i');
								}
								else {
									switch (this.map$1.get(rr, j3 + rc)) {
										case 'i':
										case 'E':
										case 'r': {
											break;
										}
										case 'c': {
											if (this.allow_all_corner_connections === false) {
												good1 = false;
											}
											break;
										}
										case 'X': {
											good1 = false;
											break;
										}
										default: {
											this.map$1.set(rr, j3 + rc, 'h');
											break;
										}
									}
								}
							}
							if (good1 && this.map$1.get(rr, rc - 1) === 'v') {
								this.map$1.set(rr, rc - 1, 'i');
							}
							if (good1 && this.map$1.get(rr, rc + length) === 'v') {
								this.map$1.set(rr, rc + length, 'i');
							}
							for (var i6 = rr - 1; i6 < rr + 2 && good1; ++i6) {
								//note that it doesn't check the bottom or right, since
								for (var j4 = rc - 1; j4 < rc + length + 1; ++j4) {
									//they are checked by the others
									if (i6 !== rr + 1 && j4 !== rc + length) {
										if (this.isCorridor$1(this.map$1.get(i6, j4))) {
											if (this.isCorridor$1(this.map$1.get(i6, j4 + 1)) && this.isCorridor$1(this.map$1.get(i6 + 1, j4)) && this.isCorridor$1(this.map$1.get(i6 + 1, j4 + 1))) {
												good1 = false;
												break;
											}
										}
									}
									if (!this.isLegal(i6, j4)) {
										good1 = false;
										break;
									}
								}
							}
							//Draw();
							//if(chain != null){
							//foreach(pos p in chain){
							//Console.SetCursorPosition(25+p.c,p.r);
							//if(ConvertedChar(map[p.r,p.c]) == "."){
							//Console.Write("X");
							//}
							//else{
							//Console.Write("x");
							//}
							//}
							//}
							//Console.ReadKey(true);
							if (!good1) {
								//if this addition is illegal...
								for (var j5 = 0; j5 < length + 2; ++j5) {
									this.map$1.set(rr, j5 + rc - 1, submap1[j5]);
								}
							}
							else {
								count--;
								tries = 0;
								if (ss.isValue(chain)) {
									if (chain.length === 0) {
										chain.add(endpoint);
									}
									for (var j6 = rc; j6 < rc + length; ++j6) {
										var p1 = new $DungeonGen_pos(rr, j6);
										if (!p1.equals(endpoint)) {
											chain.add(p1);
										}
									}
								}
								endpoint = potential_endpoint;
								result = true;
							}
						}
						break;
					}
				}
			}
			return result;
		},
		createBasicMap: function() {
			//for(int i=20;i<20;++i){
			//CreateRoom();
			//}
			//for(int i=250;i<250;++i){
			//CreateCorridor(Roll(corridor_chain_length_max - (corridor_chain_length_min-1)) + (corridor_chain_length_min-1));
			//}
			var pointrows = 2;
			var pointcols = 4;
			var points = [];
			for (var i = 1; i <= pointrows; ++i) {
				for (var j = 1; j <= pointcols; ++j) {
					points.add(new $DungeonGen_pos(ss.Int32.div($DungeonGen_Dungeon.h * i, pointrows + 1), ss.Int32.div($DungeonGen_Dungeon.w * j, pointcols + 1)));
				}
			}
			for (var $t1 = 0; $t1 < points.length; $t1++) {
				var p = points[$t1];
				this.map$1.set(p.r, p.c, 'X');
			}
			var corners = false;
			for (var remaining = $DungeonGen_Dungeon.roll(4); points.length > remaining || !corners;) {
				var p1 = points[$DungeonGen_Dungeon.roll(points.length) - 1];
				this.map$1.set(p1.r, p1.c, '#');
				//remove the X
				//while(!CreateRoom(p.r,p.c)){ }
				for (var tries = 0; tries < 500; ++tries) {
					if (this.createRoom$1(p1.r, p1.c)) {
						break;
					}
				}
				points.remove(p1);
				if (points.contains(new $DungeonGen_pos(ss.Int32.div($DungeonGen_Dungeon.h, pointrows + 1), ss.Int32.div($DungeonGen_Dungeon.w, pointcols + 1))) === false && points.contains(new $DungeonGen_pos(ss.Int32.div($DungeonGen_Dungeon.h * pointrows, pointrows + 1), ss.Int32.div($DungeonGen_Dungeon.w * pointcols, pointcols + 1))) === false) {
					corners = true;
				}
				if (points.contains(new $DungeonGen_pos(ss.Int32.div($DungeonGen_Dungeon.h, pointrows + 1), ss.Int32.div($DungeonGen_Dungeon.w * pointcols, pointcols + 1))) === false && points.contains(new $DungeonGen_pos(ss.Int32.div($DungeonGen_Dungeon.h * pointrows, pointrows + 1), ss.Int32.div($DungeonGen_Dungeon.w, pointcols + 1))) === false) {
					corners = true;
				}
				//foreach(pos point in points){
				//Console.SetCursorPosition(25+point.c,point.r);
				//Console.Write("@");
				//Console.SetCursorPosition(25+point.c,point.r);
				//Console.ReadKey(true);
				//Console.Write("X");
				//}
			}
			for (var $t2 = 0; $t2 < points.length; $t2++) {
				var p2 = points[$t2];
				if (this.map$1.get(p2.r, p2.c) === 'X') {
					this.map$1.set(p2.r, p2.c, '#');
				}
			}
			for (var count = 100; count < 200; ++count) {
				var rr = -1;
				var rc = -1;
				var dir = 0;
				for (var i1 = 0; i1 < 9999 && dir === 0; ++i1) {
					rr = $DungeonGen_Dungeon.roll(18) + 1;
					rc = $DungeonGen_Dungeon.roll(62) + 1;
					if (this.map$1.get(rr, rc) === '#') {
						var total = 0;
						var lastdir = 0;
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(rr - 1, rc)) === '.') {
							++total;
							lastdir = 8;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(rr + 1, rc)) === '.') {
							++total;
							lastdir = 2;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(rr, rc - 1)) === '.') {
							++total;
							lastdir = 4;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(rr, rc + 1)) === '.') {
							++total;
							lastdir = 6;
						}
						if (total === 1) {
							dir = lastdir;
						}
					}
				}
				if (dir !== 0) {
					var connecting_to_room = false;
					if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(rr, rc, dir), dir))) === '.') {
						for (var s = 0; s < 2; ++s) {
							var clockwise = ((s === 0) ? false : true);
							if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(rr, rc, dir), $DungeonGen_Dungeon.rotateDir(dir, clockwise)))) === '.' && $DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir$1(rr, rc, $DungeonGen_Dungeon.rotateDir(dir, clockwise)))) === '.') {
								connecting_to_room = true;
							}
						}
					}
					var extra_chance_of_corridor = 0;
					if (connecting_to_room) {
						extra_chance_of_corridor = 6;
					}
					if ($DungeonGen_Dungeon.roll$1(1, 10) + extra_chance_of_corridor > 7) {
						//corridor
						this.createCorridor$4(rr, rc, $DungeonGen_Dungeon.roll(this.corridor_chain_length_max - (this.corridor_chain_length_min - 1)) + (this.corridor_chain_length_min - 1), dir);
					}
					else {
						this.createRoom$2(rr, rc, dir);
					}
				}
			}
		},
		forEachDirection: function(r, c, condition, OOB_automatically_passes) {
			var result = 0;
			for (var i = 1; i <= 8; ++i) {
				var dir = i;
				if (dir === 5) {
					dir = 9;
				}
				if (this.boundsCheck(r, c)) {
					if (condition(this.map($DungeonGen_Dungeon.posInDir$1(r, c, dir)))) {
						++result;
					}
				}
				else if (OOB_automatically_passes) {
					++result;
				}
			}
			return result;
		},
		forEachOrthDirection: function(r, c, condition, OOB_automatically_passes) {
			var result = 0;
			for (var i = 2; i <= 8; i += 2) {
				if (this.boundsCheck(r, c)) {
					if (condition(this.map($DungeonGen_Dungeon.posInDir$1(r, c, i)))) {
						++result;
					}
				}
				else if (OOB_automatically_passes) {
					++result;
				}
			}
			return result;
		},
		createRandomWalls: function(percentage_of_walls) {
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if ($DungeonGen_Dungeon.roll(100) <= percentage_of_walls) {
						this.map$1.set(i, j, '#');
					}
					else {
						this.map$1.set(i, j, '.');
					}
				}
			}
		},
		applyCellularAutomataFourFiveRule: function() {
			//string[,] result = new string[H,W];
			//for(int i=0;i<H;++i){
			//for(int j=0;j<W;++j){
			//int num_walls = ForEachDirection(i,j,ch => ConvertedChar(ch) == "#",true);
			//if(num_walls >= 5 || (num_walls >= 4 && ConvertedChar(map[i,j]) == "#")){
			//result[i,j] = "#";
			//}
			//else{
			//result[i,j] = ".";
			//}
			//}
			//}
			//for(int i=0;i<H;++i){
			//for(int j=0;j<W;++j){
			//map[i,j] = result[i,j];
			//}
			//}
			this.applyCellularAutomataXYRule(5);
		},
		applyCellularAutomataXYRule: function(target_number_of_walls) {
			var result = Array.multidim(String.getDefaultValue(), $DungeonGen_Dungeon.h, $DungeonGen_Dungeon.w);
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					var num_walls = this.forEachDirection(i, j, function(ch) {
						return $DungeonGen_StandardDungeon.convertedChar(ch) === '#';
					}, true);
					if (num_walls >= target_number_of_walls || num_walls >= target_number_of_walls - 1 && $DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i, j)) === '#') {
						result.set(i, j, '#');
					}
					else {
						result.set(i, j, '.');
					}
				}
			}
			for (var i1 = 0; i1 < $DungeonGen_Dungeon.h; ++i1) {
				for (var j1 = 0; j1 < $DungeonGen_Dungeon.w; ++j1) {
					this.map$1.set(i1, j1, result.get(i1, j1));
				}
			}
		},
		applyRuin: function() {
			var result = Array.multidim(String.getDefaultValue(), $DungeonGen_Dungeon.h, $DungeonGen_Dungeon.w);
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					result.set(i, j, this.map$1.get(i, j));
				}
			}
			for (var i1 = 1; i1 < 21; ++i1) {
				for (var j1 = 1; j1 < 65; ++j1) {
					if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(i1, j1)) === '#') {
						var num_walls = this.forEachDirection(i1, j1, function(ch) {
							return $DungeonGen_StandardDungeon.convertedChar(ch) === '#' || $DungeonGen_StandardDungeon.convertedChar(ch) === '&';
						}, true);
						if (num_walls < 8 && $DungeonGen_Dungeon.roll(20) === 20) {
							if ($DungeonGen_Dungeon.roll(2) === 2) {
								result.set(i1, j1, '.');
							}
							else {
								result.set(i1, j1, ':');
								for (var k = 1; k <= 8; ++k) {
									var dir = k;
									if (dir === 5) {
										dir = 9;
									}
									if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir$1(i1, j1, dir))) === '.' && $DungeonGen_Dungeon.roll(10) === 10) {
										var p = $DungeonGen_Dungeon.posInDir$1(i1, j1, dir);
										result.set(p.r, p.c, ':');
									}
								}
							}
						}
					}
					else {
						var num_walls1 = this.forEachDirection(i1, j1, function(ch1) {
							return $DungeonGen_StandardDungeon.convertedChar(ch1) === '#';
						}, true);
						if (num_walls1 === 0 && $DungeonGen_Dungeon.roll(100) === 100) {
							if ($DungeonGen_Dungeon.roll(6) === 6) {
								result.set(i1, j1, ':');
							}
							result.set(i1, j1, ':');
							for (var k1 = 1; k1 <= 8; ++k1) {
								var dir1 = k1;
								if (dir1 === 5) {
									dir1 = 9;
								}
								if ($DungeonGen_StandardDungeon.convertedChar(this.map($DungeonGen_Dungeon.posInDir$1(i1, j1, dir1))) === '.' && $DungeonGen_Dungeon.roll(6) === 6) {
									var p1 = $DungeonGen_Dungeon.posInDir$1(i1, j1, dir1);
									result.set(p1.r, p1.c, ':');
								}
							}
						}
					}
				}
			}
			for (var i2 = 0; i2 < $DungeonGen_Dungeon.h; ++i2) {
				for (var j2 = 0; j2 < $DungeonGen_Dungeon.w; ++j2) {
					this.map$1.set(i2, j2, result.get(i2, j2));
				}
			}
		},
		reflect: function(horizontal_axis, vertical_axis) {
			var half_h = 11;
			var half_w = 33;
			if (horizontal_axis) {
				if (vertical_axis) {
					for (var i = 0; i < half_h; ++i) {
						for (var j = 0; j < half_w; ++j) {
							this.map$1.set(21 - i, j, this.map$1.get(i, j));
							this.map$1.set(i, 65 - j, this.map$1.get(i, j));
							this.map$1.set(21 - i, 65 - j, this.map$1.get(i, j));
						}
					}
				}
				else {
					for (var i1 = 0; i1 < half_h; ++i1) {
						for (var j1 = 0; j1 < $DungeonGen_Dungeon.w; ++j1) {
							this.map$1.set(21 - i1, j1, this.map$1.get(i1, j1));
						}
					}
				}
			}
			else if (vertical_axis) {
				for (var i2 = 0; i2 < $DungeonGen_Dungeon.h; ++i2) {
					for (var j2 = 0; j2 < half_w; ++j2) {
						this.map$1.set(i2, 65 - j2, this.map$1.get(i2, j2));
					}
				}
			}
		},
		forEachRoom: function(action) {
			var rooms = Array.multidim(ss.Int32.getDefaultValue(), $DungeonGen_Dungeon.h, $DungeonGen_Dungeon.w);
			for (var i = 0; i < $DungeonGen_Dungeon.h; ++i) {
				for (var j = 0; j < $DungeonGen_Dungeon.w; ++j) {
					if (this.isRoom$2(i, j)) {
						rooms.set(i, j, 0);
					}
					else {
						rooms.set(i, j, -1);
					}
				}
			}
			var next_room_number = 1;
			for (var i1 = 0; i1 < 19; ++i1) {
				for (var j1 = 0; j1 < 63; ++j1) {
					if (rooms.get(i1, j1) === -1 && rooms.get(i1 + 1, j1 + 1) === 0 && rooms.get(i1 + 2, j1 + 2) === 0) {
						//checks 2 spaces down and right
						rooms.set(i1 + 1, j1 + 1, next_room_number);
						for (var done = false; !done;) {
							done = true;
							for (var s = i1 + 1; s < 21; ++s) {
								for (var t = j1 + 1; t < 65; ++t) {
									if (rooms.get(s, t) === next_room_number) {
										for (var u = s - 1; u <= s + 1; ++u) {
											for (var v = t - 1; v <= t + 1; ++v) {
												if (u !== s || v !== t) {
													if (rooms.get(u, v) === 0) {
														rooms.set(u, v, next_room_number);
														done = false;
													}
												}
											}
										}
									}
								}
							}
						}
						++next_room_number;
					}
				}
			}
			for (var k = 1; k < next_room_number; ++k) {
				var start_r = 999;
				var start_c = 999;
				var end_r = -1;
				var end_c = -1;
				for (var i2 = 1; i2 < 21; ++i2) {
					for (var j2 = 1; j2 < 65; ++j2) {
						if (rooms.get(i2, j2) === k) {
							if (i2 < start_r) {
								start_r = i2;
							}
							if (i2 > end_r) {
								end_r = i2;
							}
							if (j2 < start_c) {
								start_c = j2;
							}
							if (j2 > end_c) {
								end_c = j2;
							}
						}
					}
				}
				if (!action(start_r, start_c, end_r, end_c)) {
					return false;
				}
			}
			return true;
		},
		markInterestingLocations: function() {
			this.forEachRoom(Function.mkdel(this, function(start_r, start_c, end_r, end_c) {
				var height = end_r - start_r + 1;
				var width = end_c - start_c + 1;
				if (height % 2 === 1 || width % 2 === 1) {
					var exits = [];
					for (var i = start_r; i <= end_r; ++i) {
						for (var j = start_c; j <= end_c; ++j) {
							if (i === start_r || j === start_c || i === end_r || j === end_c) {
								if (this.isCorridor$1(this.map$1.get(i - 1, j)) || this.isCorridor$1(this.map$1.get(i, j - 1)) || this.isCorridor$1(this.map$1.get(i + 1, j)) || this.isCorridor$1(this.map$1.get(i, j + 1))) {
									exits.add(new $DungeonGen_pos(i, j));
								}
							}
						}
					}
					var half_r = ss.Int32.div(start_r + end_r, 2);
					var half_c = ss.Int32.div(start_c + end_c, 2);
					var half_r_offset = ss.Int32.div(start_r + end_r + 1, 2);
					var half_c_offset = ss.Int32.div(start_c + end_c + 1, 2);
					var centers = [];
					centers.add(new $DungeonGen_pos(half_r, half_c));
					if (half_r !== half_r_offset) {
						centers.add(new $DungeonGen_pos(half_r_offset, half_c));
					}
					else {
						//these can't both be true because the dimension can't be even X even
						if (half_c !== half_c_offset) {
							centers.add(new $DungeonGen_pos(half_r, half_c_offset));
						}
					}
					var in_middle_row_or_column = [];
					if (width % 2 === 1) {
						for (var i1 = start_r; i1 <= end_r; ++i1) {
							in_middle_row_or_column.add(new $DungeonGen_pos(i1, half_c));
						}
					}
					if (height % 2 === 1) {
						for (var j1 = start_c; j1 <= end_c; ++j1) {
							var good = true;
							for (var $t1 = 0; $t1 < in_middle_row_or_column.length; $t1++) {
								var p = in_middle_row_or_column[$t1];
								if (p.r === half_r && p.c === j1) {
									good = false;
									break;
								}
							}
							if (good) {
								in_middle_row_or_column.add(new $DungeonGen_pos(half_r, j1));
							}
						}
					}
					var rejected = [];
					for (var $t2 = 0; $t2 < in_middle_row_or_column.length; $t2++) {
						var p1 = in_middle_row_or_column[$t2];
						var floors = this.forEachDirection(p1.r, p1.c, function(ch) {
							return $DungeonGen_StandardDungeon.convertedChar(ch) === '.';
						}, true);
						if ($DungeonGen_StandardDungeon.convertedChar(this.map(p1)) !== '.' || floors !== 8) {
							rejected.add(p1);
						}
					}
					for (var $t3 = 0; $t3 < rejected.length; $t3++) {
						var p2 = rejected[$t3];
						in_middle_row_or_column.remove(p2);
					}
					rejected.clear();
					for (var $t4 = 0; $t4 < exits.length; $t4++) {
						var exit = exits[$t4];
						var greatest_distance = 0;
						for (var $t5 = 0; $t5 < centers.length; $t5++) {
							var center = centers[$t5];
							if ($DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10(exit, center) > greatest_distance) {
								greatest_distance = $DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10(exit, center);
							}
						}
						for (var $t6 = 0; $t6 < in_middle_row_or_column.length; $t6++) {
							var potential = in_middle_row_or_column[$t6];
							if ($DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10(exit, potential) <= greatest_distance) {
								rejected.add(potential);
							}
						}
					}
					for (var $t7 = 0; $t7 < rejected.length; $t7++) {
						var p3 = rejected[$t7];
						in_middle_row_or_column.remove(p3);
					}
					if (in_middle_row_or_column.length > 0) {
						var greatest_total_distance = 0;
						var positions_with_greatest_distance = [];
						for (var $t8 = 0; $t8 < in_middle_row_or_column.length; $t8++) {
							var potential1 = in_middle_row_or_column[$t8];
							var total_distance = 0;
							for (var $t9 = 0; $t9 < exits.length; $t9++) {
								var exit1 = exits[$t9];
								total_distance += $DungeonGen_Dungeon.estimatedEuclideanDistanceFromX10(potential1, exit1);
							}
							if (total_distance > greatest_total_distance) {
								greatest_total_distance = total_distance;
								positions_with_greatest_distance.clear();
								positions_with_greatest_distance.add(potential1);
							}
							else if (total_distance === greatest_total_distance) {
								positions_with_greatest_distance.add(potential1);
							}
						}
						for (var $t10 = 0; $t10 < positions_with_greatest_distance.length; $t10++) {
							var p4 = positions_with_greatest_distance[$t10];
							this.map$1.set(p4.r, p4.c, '$');
						}
					}
					else if (height % 2 === 1 && width % 2 === 1) {
						var floors1 = this.forEachDirection(half_r, half_c, function(ch1) {
							return $DungeonGen_StandardDungeon.convertedChar(ch1) === '.';
						}, true);
						if ($DungeonGen_StandardDungeon.convertedChar(this.map$1.get(half_r, half_c)) === '.' && floors1 === 8) {
							this.map$1.set(half_r, half_c, '$');
						}
					}
				}
				return true;
			}));
		},
		addPillars: function(percent_chance_per_room) {
			this.forEachRoom(Function.mkdel(this, function(start_r, start_c, end_r, end_c) {
				if ($DungeonGen_Dungeon.roll(100) <= percent_chance_per_room) {
					var height = end_r - start_r + 1;
					var width = end_c - start_c + 1;
					if (height > 3 || width > 3) {
						var layouts = [];
						if (height % 2 === 1 && width % 2 === 1) {
							layouts.add(0);
						}
						if ((height % 2 === 1 || width % 2 === 1) && height !== 4 && width !== 4) {
							layouts.add(3);
						}
						if (height >= 5 && width >= 5) {
							layouts.add(2);
						}
						if (height > 2 && width > 2 && height !== 4 && width !== 4) {
							layouts.add(1);
						}
						if (width % 2 === 1 && width >= 5 || height % 2 === 1 && height >= 5) {
							layouts.add(5);
						}
						//if((height == 4 && width % 2 == 0) || (width == 4 && height % 2 == 0)){
						if (layouts.length === 0 || $DungeonGen_Dungeon.coinFlip()) {
							//otherwise they're too common
							layouts.add(4);
						}
						if (layouts.length > 0) {
							var pillar = ' ';
							switch ($DungeonGen_Dungeon.roll(4)) {
								case 1:
								case 2: {
									pillar = 'P';
									break;
								}
								case 3: {
									pillar = '&';
									break;
								}
								case 4: {
									pillar = '0';
									break;
								}
							}
							switch (layouts[$DungeonGen_Dungeon.roll(layouts.length) - 1]) {
								case 0: {
									this.map$1.set(ss.Int32.div(start_r + end_r, 2), ss.Int32.div(start_c + end_c, 2), 'P');
									break;
								}
								case 3: {
									var vertical;
									if (width % 2 === 1 && height % 2 === 0) {
										vertical = true;
									}
									else if (height % 2 === 1 && width % 2 === 0) {
										vertical = false;
									}
									else {
										vertical = $DungeonGen_Dungeon.coinFlip();
									}
									if (vertical) {
										if (height % 2 === 1) {
											for (var i = start_r + 1; i <= end_r - 1; i += 2) {
												this.map$1.set(i, ss.Int32.div(start_c + end_c, 2), pillar);
											}
										}
										else {
											var offset = 0;
											if (height % 4 === 0) {
												offset = $DungeonGen_Dungeon.roll(2) - 1;
											}
											for (var i1 = start_r + 1 + offset; i1 < ss.Int32.div(start_r + end_r, 2); i1 += 2) {
												this.map$1.set(i1, ss.Int32.div(start_c + end_c, 2), pillar);
											}
											for (var i2 = end_r - 1 - offset; i2 > ss.Int32.div(start_r + end_r, 2) + 1; i2 -= 2) {
												this.map$1.set(i2, ss.Int32.div(start_c + end_c, 2), pillar);
											}
										}
									}
									else if (width % 2 === 1) {
										for (var i3 = start_c + 1; i3 <= end_c - 1; i3 += 2) {
											this.map$1.set(ss.Int32.div(start_r + end_r, 2), i3, pillar);
										}
									}
									else {
										var offset1 = 0;
										if (width % 4 === 0) {
											offset1 = $DungeonGen_Dungeon.roll(2) - 1;
										}
										for (var i4 = start_c + 1 + offset1; i4 < ss.Int32.div(start_c + end_c, 2); i4 += 2) {
											this.map$1.set(ss.Int32.div(start_r + end_r, 2), i4, pillar);
										}
										for (var i5 = end_c - 1 - offset1; i5 > ss.Int32.div(start_c + end_c, 2) + 1; i5 -= 2) {
											this.map$1.set(ss.Int32.div(start_r + end_r, 2), i5, pillar);
										}
									}
									break;
								}
								case 2: {
									var v_offset = 0;
									var h_offset = 0;
									if (height % 4 === 0) {
										v_offset = $DungeonGen_Dungeon.roll(2) - 1;
									}
									if (width % 4 === 0) {
										h_offset = $DungeonGen_Dungeon.roll(2) - 1;
									}
									this.map$1.set(start_r + 1 + v_offset, start_c + 1 + h_offset, pillar);
									this.map$1.set(start_r + 1 + v_offset, end_c - 1 - h_offset, pillar);
									this.map$1.set(end_r - 1 - v_offset, start_c + 1 + h_offset, pillar);
									this.map$1.set(end_r - 1 - v_offset, end_c - 1 - h_offset, pillar);
									break;
								}
								case 1: {
									var v_offset1 = 0;
									var h_offset1 = 0;
									if (height % 4 === 0) {
										v_offset1 = $DungeonGen_Dungeon.roll(2) - 1;
									}
									if (width % 4 === 0) {
										h_offset1 = $DungeonGen_Dungeon.roll(2) - 1;
									}
									var half_r = ss.Int32.div(start_r + end_r, 2);
									var half_c = ss.Int32.div(start_c + end_c, 2);
									var half_r_offset = ss.Int32.div(start_r + end_r + 1, 2);
									var half_c_offset = ss.Int32.div(start_c + end_c + 1, 2);
									for (var i6 = start_r + 1 + v_offset1; i6 < half_r; i6 += 2) {
										for (var j = start_c + 1 + h_offset1; j < half_c; j += 2) {
											this.map$1.set(i6, j, pillar);
										}
									}
									for (var i7 = start_r + 1 + v_offset1; i7 < half_r; i7 += 2) {
										for (var j1 = end_c - 1 - h_offset1; j1 > half_c_offset; j1 -= 2) {
											this.map$1.set(i7, j1, pillar);
										}
									}
									for (var i8 = end_r - 1 - v_offset1; i8 > half_r_offset; i8 -= 2) {
										for (var j2 = start_c + 1 + h_offset1; j2 < half_c; j2 += 2) {
											this.map$1.set(i8, j2, pillar);
										}
									}
									for (var i9 = end_r - 1 - v_offset1; i9 > half_r_offset; i9 -= 2) {
										for (var j3 = end_c - 1 - h_offset1; j3 > half_c_offset; j3 -= 2) {
											this.map$1.set(i9, j3, pillar);
										}
									}
									if ((width + 1) % 4 === 0) {
										if (height % 2 === 1) {
											for (var i10 = start_r + 1; i10 <= end_r - 1; i10 += 2) {
												this.map$1.set(i10, half_c, pillar);
											}
										}
										else {
											var offset2 = 0;
											if (height % 4 === 0) {
												offset2 = $DungeonGen_Dungeon.roll(2) - 1;
											}
											for (var i11 = start_r + 1 + offset2; i11 < half_r; i11 += 2) {
												this.map$1.set(i11, half_c, pillar);
											}
											for (var i12 = end_r - 1 - offset2; i12 > half_r_offset; i12 -= 2) {
												this.map$1.set(i12, half_c, pillar);
											}
										}
									}
									if ((height + 1) % 4 === 0) {
										if (width % 2 === 1) {
											for (var i13 = start_c + 1; i13 <= end_c - 1; i13 += 2) {
												this.map$1.set(half_r, i13, pillar);
											}
										}
										else {
											var offset3 = 0;
											if (width % 4 === 0) {
												offset3 = $DungeonGen_Dungeon.roll(2) - 1;
											}
											for (var i14 = start_c + 1 + offset3; i14 < half_c; i14 += 2) {
												this.map$1.set(half_r, i14, pillar);
											}
											for (var i15 = end_c - 1 - offset3; i15 > half_c_offset; i15 -= 2) {
												this.map$1.set(half_r, i15, pillar);
											}
										}
									}
									break;
								}
								case 4: {
									this.map$1.set(start_r, start_c, '&');
									this.map$1.set(start_r, end_c, '&');
									this.map$1.set(end_r, start_c, '&');
									this.map$1.set(end_r, end_c, '&');
									break;
								}
								case 5: {
									this.map$1.set(start_r, start_c, '&');
									this.map$1.set(start_r, end_c, '&');
									this.map$1.set(end_r, start_c, '&');
									this.map$1.set(end_r, end_c, '&');
									if (width % 2 === 1 && width > 3) {
										var half_c1 = ss.Int32.div(start_c + end_c, 2);
										var corridors = this.forEachOrthDirection(start_r, half_c1, Function.mkdel(this, function(ch) {
											return this.isCorridor$1(ch);
										}), false);
										if (corridors === 0) {
											this.map$1.set(start_r, half_c1, '&');
										}
										corridors = this.forEachOrthDirection(end_r, half_c1, Function.mkdel(this, function(ch1) {
											return this.isCorridor$1(ch1);
										}), false);
										if (corridors === 0) {
											this.map$1.set(end_r, half_c1, '&');
										}
									}
									if (height % 2 === 1 && height > 3) {
										var half_r1 = ss.Int32.div(start_r + end_r, 2);
										var corridors1 = this.forEachOrthDirection(half_r1, start_c, Function.mkdel(this, function(ch2) {
											return this.isCorridor$1(ch2);
										}), false);
										if (corridors1 === 0) {
											this.map$1.set(half_r1, start_c, '&');
										}
										corridors1 = this.forEachOrthDirection(half_r1, end_c, Function.mkdel(this, function(ch3) {
											return this.isCorridor$1(ch3);
										}), false);
										if (corridors1 === 0) {
											this.map$1.set(half_r1, end_c, '&');
										}
									}
									break;
								}
								default: {
									break;
								}
							}
						}
					}
				}
				return true;
			}));
		},
		applyCaveModification: function() {
			return this.forEachRoom(Function.mkdel(this, function(start_r, start_c, end_r, end_c) {
				var room = Array.multidim(String.getDefaultValue(), end_r - start_r + 3, end_c - start_c + 3);
				//includes borders
				var exits = [];
				for (var i = 1; i < room.getLength(0) - 1; ++i) {
					for (var j = 1; j < room.getLength(1) - 1; ++j) {
						if (i === 1 || j === 1 || i === room.getLength(0) - 2 || j === room.getLength(1) - 2) {
							if (this.isCorridor$1(this.map$1.get(start_r + i - 2, start_c + j - 1)) || this.isCorridor$1(this.map$1.get(start_r + i - 1, start_c + j - 2)) || this.isCorridor$1(this.map$1.get(start_r + i, start_c + j - 1)) || this.isCorridor$1(this.map$1.get(start_r + i - 1, start_c + j))) {
								exits.add(new $DungeonGen_pos(i, j));
							}
						}
					}
				}
				var tries = 0;
				while (true && tries < 500) {
					$DungeonGen_StandardDungeon.createRandomWalls(room, 25);
					$DungeonGen_StandardDungeon.applyCellularAutomataXYRule(room, 3);
					$DungeonGen_StandardDungeon.removeDiagonals(room);
					$DungeonGen_StandardDungeon.removeDeadEnds(room);
					$DungeonGen_StandardDungeon.removeUnconnected(room);
					var exits_open = true;
					for (var $t1 = 0; $t1 < exits.length; $t1++) {
						var p = exits[$t1];
						if ($DungeonGen_StandardDungeon.convertedChar(room.get(p.r, p.c)) !== '.') {
							exits_open = false;
						}
					}
					if (exits_open) {
						for (var i1 = start_r; i1 <= end_r; ++i1) {
							for (var j1 = start_c; j1 <= end_c; ++j1) {
								this.map$1.set(i1, j1, room.get(i1 - start_r + 1, j1 - start_c + 1));
							}
						}
						break;
					}
					++tries;
					if (tries > 50) {
						return false;
					}
				}
				return true;
			}));
			//return true;
		}
	};
	$DungeonGen_StandardDungeon.convertedChar = function(ch) {
		switch (ch) {
			case 'h':
			case 'v':
			case 'i':
			case 'E':
			case 'c':
			case 'N':
			case 'r':
			case '$':
			case '.': {
				return '.';
			}
			case '+': {
				return '+';
			}
			case ':': {
				return ':';
			}
			case '&': {
				return '&';
			}
			case '0': {
				return '0';
			}
			case '#':
			case 'P':
			default: {
				return '#';
			}
		}
	};
	$DungeonGen_StandardDungeon.forEachDirection = function(map, r, c, condition, OOB_automatically_passes) {
		var result = 0;
		for (var i = 1; i <= 8; ++i) {
			var dir = i;
			if (dir === 5) {
				dir = 9;
			}
			if ($DungeonGen_Dungeon.boundsCheck(r, c, map.getLength(0), map.getLength(1))) {
				var p = $DungeonGen_Dungeon.posInDir$1(r, c, dir);
				if (condition(map.get(p.r, p.c))) {
					++result;
				}
			}
			else if (OOB_automatically_passes) {
				++result;
			}
		}
		return result;
	};
	$DungeonGen_StandardDungeon.removeDiagonals = function(map) {
		var walls = [];
		for (var i = 1; i < map.getLength(0) - 2; ++i) {
			for (var j = 1; j < map.getLength(1) - 2; ++j) {
				if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '.' && $DungeonGen_StandardDungeon.convertedChar(map.get(i, j + 1)) === '#') {
					if ($DungeonGen_StandardDungeon.convertedChar(map.get(i + 1, j)) === '#' && $DungeonGen_StandardDungeon.convertedChar(map.get(i + 1, j + 1)) === '.') {
						walls.add(new $DungeonGen_pos(i, j + 1));
						walls.add(new $DungeonGen_pos(i + 1, j));
					}
				}
				if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '#' && $DungeonGen_StandardDungeon.convertedChar(map.get(i, j + 1)) === '.') {
					if ($DungeonGen_StandardDungeon.convertedChar(map.get(i + 1, j)) === '.' && $DungeonGen_StandardDungeon.convertedChar(map.get(i + 1, j + 1)) === '#') {
						walls.add(new $DungeonGen_pos(i, j));
						walls.add(new $DungeonGen_pos(i + 1, j + 1));
					}
				}
				while (walls.length > 0) {
					var p = walls[$DungeonGen_Dungeon.roll(walls.length) - 1];
					walls.remove(p);
					var rotated = new Array(8);
					for (var ii = 0; ii < 8; ++ii) {
						var p2 = $DungeonGen_Dungeon.posInDir$1(p.r, p.c, $DungeonGen_Dungeon.rotateDir$1(8, true, ii));
						rotated[ii] = map.get(p2.r, p2.c);
					}
					var successive_walls = 0;
					for (var ii1 = 5; ii1 < 8; ++ii1) {
						if ($DungeonGen_StandardDungeon.convertedChar(rotated[ii1]) === '#') {
							successive_walls++;
						}
						else {
							successive_walls = 0;
						}
					}
					for (var ii2 = 0; ii2 < 8; ++ii2) {
						if ($DungeonGen_StandardDungeon.convertedChar(rotated[ii2]) === '#') {
							successive_walls++;
						}
						else {
							successive_walls = 0;
						}
						if (successive_walls === 4) {
							map.set(p.r, p.c, 'i');
							if ($DungeonGen_StandardDungeon.isLegal(map, p.r, p.c)) {
								walls.clear();
							}
							else {
								map.set(p.r, p.c, '#');
							}
							break;
						}
					}
				}
			}
		}
	};
	$DungeonGen_StandardDungeon.removeDeadEnds = function(map) {
		var changed = true;
		while (changed) {
			changed = false;
			for (var i = 0; i < map.getLength(0); ++i) {
				for (var j = 0; j < map.getLength(1); ++j) {
					if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '.') {
						var total = 0;
						if ($DungeonGen_StandardDungeon.convertedChar(map.get(i + 1, j)) === '#') {
							++total;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(map.get(i - 1, j)) === '#') {
							++total;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j + 1)) === '#') {
							++total;
						}
						if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j - 1)) === '#') {
							++total;
						}
						if (total >= 3) {
							map.set(i, j, '#');
							changed = true;
						}
					}
				}
			}
		}
	};
	$DungeonGen_StandardDungeon.removeUnconnected = function(map) {
		var num = Array.multidim(ss.Int32.getDefaultValue(), map.getLength(0), map.getLength(1));
		for (var i = 0; i < map.getLength(0); ++i) {
			for (var j = 0; j < map.getLength(1); ++j) {
				if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '.' || map.get(i, j) === '&' || map.get(i, j) === ':') {
					num.set(i, j, 0);
				}
				else {
					num.set(i, j, -1);
				}
			}
		}
		var count = 0;
		for (var i1 = 0; i1 < map.getLength(0); ++i1) {
			for (var j1 = 0; j1 < map.getLength(1); ++j1) {
				if (num.get(i1, j1) === 0) {
					count++;
					num.set(i1, j1, count);
					var changed = true;
					while (changed) {
						changed = false;
						for (var s = 0; s < map.getLength(0); ++s) {
							for (var t = 0; t < map.getLength(1); ++t) {
								if (num.get(s, t) === count) {
									for (var ds = -1; ds <= 1; ++ds) {
										for (var dt = -1; dt <= 1; ++dt) {
											if (num.get(s + ds, t + dt) === 0) {
												num.set(s + ds, t + dt, count);
												changed = true;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		var biggest_area = -1;
		var size_of_biggest_area = 0;
		for (var k = 1; k <= count; ++k) {
			var size = 0;
			for (var i2 = 0; i2 < map.getLength(0); ++i2) {
				for (var j2 = 0; j2 < map.getLength(1); ++j2) {
					if (num.get(i2, j2) === k) {
						size++;
					}
				}
			}
			if (size > size_of_biggest_area) {
				size_of_biggest_area = size;
				biggest_area = k;
			}
		}
		for (var i3 = 0; i3 < map.getLength(0); ++i3) {
			for (var j3 = 0; j3 < map.getLength(1); ++j3) {
				if (num.get(i3, j3) !== biggest_area) {
					map.set(i3, j3, '#');
				}
			}
		}
	};
	$DungeonGen_StandardDungeon.isLegal = function(map, r, c) {
		return $DungeonGen_StandardDungeon.isLegal$1(map, r, c, false);
	};
	$DungeonGen_StandardDungeon.isLegal$1 = function(map, r, c, allow_all_corner_connections) {
		if (r === 0 || r === map.getLength(0) - 1 || c === 0 || c === map.getLength(1) - 1) {
			return true;
		}
		var result = true;
		switch (map.get(r, c)) {
			case 'r': {
				break;
			}
			case 'E': {
				var roomdir = 0;
				if (map.get(r - 1, c) === 'r') {
					roomdir = 8;
				}
				if (map.get(r + 1, c) === 'r') {
					roomdir = 2;
				}
				if (map.get(r, c - 1) === 'r') {
					roomdir = 4;
				}
				if (map.get(r, c + 1) === 'r') {
					roomdir = 6;
				}
				if (roomdir === 0) {
					return false;
					//no room found, error
				}
				var rotated = new Array(8);
				rotated[0] = 'r';
				for (var i = 1; i < 8; ++i) {
					var p = $DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(roomdir, true, i));
					rotated[i] = map.get(p.r, p.c);
				}
				if (rotated[1] !== 'r' && rotated[1] !== 'E') {
					return false;
				}
				if (rotated[7] !== 'r' && rotated[7] !== 'E') {
					return false;
				}
				if (rotated[2] !== 'c' && rotated[2] !== 'E' && rotated[2] !== 'N') {
					return false;
				}
				if (rotated[6] !== 'c' && rotated[6] !== 'E' && rotated[6] !== 'N') {
					return false;
				}
				if (!(rotated[4] === '#' || rotated[3] === '#' && rotated[5] === '#')) {
					return false;
				}
				break;
			}
			case 'c': {
				var roomdir1 = 0;
				if (map.get(r - 1, c - 1) === 'r') {
					roomdir1 = 7;
				}
				if (map.get(r - 1, c + 1) === 'r') {
					roomdir1 = 9;
				}
				if (map.get(r + 1, c - 1) === 'r') {
					roomdir1 = 1;
				}
				if (map.get(r + 1, c + 1) === 'r') {
					roomdir1 = 3;
				}
				if (roomdir1 === 0) {
					return false;
					//no room found, error
				}
				var rotated1 = new Array(8);
				rotated1[0] = 'r';
				for (var i1 = 1; i1 < 8; ++i1) {
					var p1 = $DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(roomdir1, true, i1));
					rotated1[i1] = map.get(p1.r, p1.c);
				}
				if (rotated1[1] !== 'E') {
					return false;
				}
				if (rotated1[7] !== 'E') {
					return false;
				}
				if (allow_all_corner_connections) {
					if (rotated1[2] !== '#' && rotated1[3] !== '#') {
						return false;
					}
					if (rotated1[6] !== '#' && rotated1[5] !== '#') {
						return false;
					}
					if (rotated1[4] !== '#') {
						if (rotated1[3] !== '#' && rotated1[5] !== '#') {
							return false;
						}
						if (rotated1[3] === '#' && rotated1[5] === '#') {
							return false;
						}
					}
				}
				else if (rotated1[3] !== '#' || rotated1[4] !== '#' || rotated1[5] !== '#') {
					return false;
				}
				break;
			}
			case 'N': {
				break;
			}
			case 'i': {
				var rotated2 = new Array(8);
				for (var i2 = 0; i2 < 8; ++i2) {
					var p2 = $DungeonGen_Dungeon.posInDir$1(r, c, $DungeonGen_Dungeon.rotateDir$1(8, true, i2));
					rotated2[i2] = map.get(p2.r, p2.c);
				}
				var successive_floors = 0;
				if ($DungeonGen_StandardDungeon.convertedChar(rotated2[6]) === '.') {
					successive_floors++;
				}
				if ($DungeonGen_StandardDungeon.convertedChar(rotated2[7]) === '.') {
					successive_floors++;
				}
				else {
					successive_floors = 0;
				}
				for (var i3 = 0; i3 < 8; ++i3) {
					if ($DungeonGen_StandardDungeon.convertedChar(rotated2[i3]) === '.') {
						successive_floors++;
					}
					else {
						successive_floors = 0;
					}
					if (successive_floors === 3) {
						return false;
					}
				}
				break;
			}
			case 'h': {
				var p3 = $DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 2), 2);
				if (r > 19 || map.get(p3.r, p3.c) === 'h') {
					return false;
				}
				p3 = $DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 8), 8);
				if (r < 2 || map.get(p3.r, p3.c) === 'h') {
					return false;
				}
				break;
			}
			case 'v': {
				var p4 = $DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 6), 6);
				if (c > 63 || map.get(p4.r, p4.c) === 'v') {
					return false;
				}
				p4 = $DungeonGen_Dungeon.posInDir($DungeonGen_Dungeon.posInDir$1(r, c, 4), 4);
				if (c < 2 || map.get(p4.r, p4.c) === 'v') {
					return false;
				}
				break;
			}
			case 'X': {
				for (var i4 = 1; i4 <= 8; ++i4) {
					var dir = i4;
					if (dir === 5) {
						dir = 9;
					}
					var p5 = $DungeonGen_Dungeon.posInDir$1(r, c, dir);
					if ($DungeonGen_StandardDungeon.convertedChar(map.get(p5.r, p5.c)) !== '#') {
						return false;
					}
				}
				break;
			}
			default: {
				break;
			}
		}
		return result;
	};
	$DungeonGen_StandardDungeon.createRandomWalls = function(map, percentage_of_walls) {
		for (var i = 0; i < map.getLength(0); ++i) {
			for (var j = 0; j < map.getLength(1); ++j) {
				if ($DungeonGen_Dungeon.roll(100) <= percentage_of_walls) {
					map.set(i, j, '#');
				}
				else {
					map.set(i, j, '.');
				}
			}
		}
	};
	$DungeonGen_StandardDungeon.applyCellularAutomataXYRule = function(map, target_number_of_walls) {
		var result = Array.multidim(String.getDefaultValue(), map.getLength(0), map.getLength(1));
		for (var i = 0; i < map.getLength(0); ++i) {
			for (var j = 0; j < map.getLength(1); ++j) {
				var num_walls = $DungeonGen_StandardDungeon.forEachDirection(map, i, j, function(ch) {
					return $DungeonGen_StandardDungeon.convertedChar(ch) === '#';
				}, true);
				if (num_walls >= target_number_of_walls || num_walls >= target_number_of_walls - 1 && $DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '#') {
					result.set(i, j, '#');
				}
				else {
					result.set(i, j, '.');
				}
			}
		}
		for (var i1 = 0; i1 < map.getLength(0); ++i1) {
			for (var j1 = 0; j1 < map.getLength(1); ++j1) {
				map.set(i1, j1, result.get(i1, j1));
			}
		}
	};
	$DungeonGen_StandardDungeon.numberOfFloors = function(map) {
		var total = 0;
		for (var i = 0; i < map.getLength(0); ++i) {
			for (var j = 0; j < map.getLength(1); ++j) {
				if ($DungeonGen_StandardDungeon.convertedChar(map.get(i, j)) === '.') {
					total++;
				}
			}
		}
		return total;
	};
	////////////////////////////////////////////////////////////////////////////////
	// DungeonGen.StandardDungeon.PillarArrangement
	var $DungeonGen_StandardDungeon$PillarArrangement = function() {
	};
	$DungeonGen_StandardDungeon$PillarArrangement.prototype = { single: 0, full: 1, corners: 2, row: 3, statueCorners: 4, statueEdges: 5 };
	Type.registerEnum(global, 'DungeonGen.StandardDungeon$PillarArrangement', $DungeonGen_StandardDungeon$PillarArrangement, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Actable
	var $Forays_Actable = function() {
		this.q = null;
	};
	$Forays_Actable.prototype = {
		getSpeed: function() {
			return 1;
		},
		act: function() {
			this.q.pop();
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Actor
	var $Forays_Actor = function() {
		this.$2$atypeField = 0;
		this.$2$maxhpField = 0;
		this.$2$curhpField = 0;
		this.$2$speedField = 0;
		this.$2$levelField = 0;
		this.$2$targetField = null;
		this.$2$invField = null;
		this.$2$FField = null;
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]))();
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]))();
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]))();
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]))();
		this.magic_penalty = 0;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.path = [];
		this.target_location = null;
		this.player_visibility_duration = 0;
		this.group = null;
		this.weapons = [];
		this.armors = [];
		this.magic_items = [];
		$Forays_PhysicalObject.call(this);
		this.set_atype(7);
		this.set_f(new Array(13));
		this.set_inv([]);
		this.weapons = [];
		this.armors = [];
		this.magic_items = [];
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]))();
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]))();
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]))();
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]))();
	};
	$Forays_Actor.prototype = {
		get_atype: function() {
			return this.$2$atypeField;
		},
		set_atype: function(value) {
			this.$2$atypeField = value;
		},
		get_maxhp: function() {
			return this.$2$maxhpField;
		},
		set_maxhp: function(value) {
			this.$2$maxhpField = value;
		},
		get_curhp: function() {
			return this.$2$curhpField;
		},
		set_curhp: function(value) {
			this.$2$curhpField = value;
		},
		get_speed: function() {
			return this.$2$speedField;
		},
		set_speed: function(value) {
			this.$2$speedField = value;
		},
		get_level: function() {
			return this.$2$levelField;
		},
		set_level: function(value) {
			this.$2$levelField = value;
		},
		get_target: function() {
			return this.$2$targetField;
		},
		set_target: function(value) {
			this.$2$targetField = value;
		},
		get_inv: function() {
			return this.$2$invField;
		},
		set_inv: function(value) {
			this.$2$invField = value;
		},
		get_f: function() {
			return this.$2$FField;
		},
		set_f: function(value) {
			this.$2$FField = value;
		},
		theVisible: function() {
			//returns the_name or "something"
			if ($Forays_Actor.get_player().canSee(this)) {
				return this.get_the_name();
			}
			else {
				return 'something';
			}
		},
		aVisible: function() {
			//returns a_name or "something"
			if ($Forays_Actor.get_player().canSee(this)) {
				return this.get_a_name();
			}
			else {
				return 'something';
			}
		},
		youVisible: function(s) {
			return this.youVisible$1(s, false);
		},
		youVisible$1: function(s, ends_in_es) {
			//if not visible, YouVisible("attack") returns "something attacks"
			if (this.get_name() === 'you') {
				return 'you ' + s;
			}
			else if (ends_in_es) {
				return this.theVisible() + ' ' + s + 'es';
			}
			else {
				return this.theVisible() + ' ' + s + 's';
			}
		},
		youVisibleAre: function() {
			if (this.get_name() === 'you') {
				return 'you are';
			}
			else if ($Forays_Actor.get_player().canSee(this)) {
				return this.get_the_name() + ' is';
			}
			else {
				return 'something is';
			}
		},
		yourVisible: function() {
			if (this.get_name() === 'you') {
				return 'your';
			}
			else if ($Forays_Actor.get_player().canSee(this)) {
				return this.get_the_name() + '\'s';
			}
			else {
				return 'something\'s';
			}
		},
		move: function(r, c) {
			this.move$1(r, c, true);
		},
		move$1: function(r, c, trigger_traps) {
			if (r >= 0 && r < $Forays_Actor.$ROWS && c >= 0 && c < $Forays_Actor.$COLS) {
				if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if (this.hasAttr(96)) {
						var $t1 = this.actorsAtDistance(1);
						for (var $t2 = 0; $t2 < $t1.length; $t2++) {
							var a = $t1[$t2];
							if (a.attrs.get_item(97) === a.directionOf(this)) {
								if (a.distanceFrom$2(r, c) > 1) {
									this.attrs.set_item(96, this.attrs.get_item(96) - 1);
									a.attrs.set_item(97, 0);
								}
								else {
									a.attrs.set_item(97, a.directionOf$1(new $Forays_pos(r, c)));
								}
							}
						}
					}
					var torch = false;
					if (this.lightRadius() > 0) {
						torch = true;
						this.updateRadius(this.lightRadius(), 0);
					}
					$Forays_PhysicalObject.get_m().actor.set_item(r, c, this);
					if (this.get_row() >= 0 && this.get_row() < $Forays_Actor.$ROWS && this.get_col() >= 0 && this.get_col() < $Forays_Actor.$COLS) {
						$Forays_PhysicalObject.get_m().actor.set_item(this.get_row(), this.get_col(), null);
						if (ss.referenceEquals(this, $Forays_Actor.get_player()) && ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv())) {
							$Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv().set_ignored(true);
						}
					}
					this.set_row(r);
					this.set_col(c);
					if (torch) {
						this.updateRadius(0, this.lightRadius());
					}
					if (trigger_traps && this.tile().isTrap() && !this.hasAttr(10) && !this.hasAttr(9) && (this.get_atype() === 0 || ss.referenceEquals(this.get_target(), $Forays_Actor.get_player()))) {
						//prevents wandering monsters from triggering traps
						this.tile().triggerTrap();
					}
				}
				else {
					//default is now to swap places, rather than do nothing, since everything checks anyway.
					var a1 = $Forays_PhysicalObject.get_m().actor.get_item(r, c);
					var torch1 = false;
					var other_torch = false;
					if (this.lightRadius() > 0) {
						torch1 = true;
						this.updateRadius(this.lightRadius(), 0);
					}
					if (a1.lightRadius() > 0) {
						other_torch = true;
						a1.updateRadius(a1.lightRadius(), 0);
					}
					if (this.get_row() >= 0 && this.get_row() < $Forays_Actor.$ROWS && this.get_col() >= 0 && this.get_col() < $Forays_Actor.$COLS) {
						if (ss.referenceEquals(this, $Forays_Actor.get_player()) && ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv())) {
							$Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv().set_ignored(true);
						}
					}
					$Forays_PhysicalObject.get_m().actor.set_item(r, c, this);
					$Forays_PhysicalObject.get_m().actor.set_item(this.get_row(), this.get_col(), a1);
					a1.set_row(this.get_row());
					a1.set_col(this.get_col());
					this.set_row(r);
					this.set_col(c);
					if (torch1) {
						this.updateRadius(0, this.lightRadius());
					}
					if (other_torch) {
						a1.updateRadius(0, a1.lightRadius());
					}
				}
			}
		},
		grabPreventsMovement: function(o) {
			if (!this.hasAttr(96) || this.distanceFrom(o) > 1) {
				return false;
			}
			var grabbers = [];
			var $t1 = this.actorsAtDistance(1);
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var a = $t1[$t2];
				if (a.attrs.get_item(97) === a.directionOf(this)) {
					grabbers.add(a);
				}
			}
			for (var $t3 = 0; $t3 < grabbers.length; $t3++) {
				var a1 = grabbers[$t3];
				if (o.distanceFrom(a1) > 1) {
					return true;
				}
			}
			return false;
		},
		inventoryCount: function() {
			var result = 0;
			var $t1 = this.get_inv();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var i = $t1[$t2];
				result += i.get_quantity();
			}
			return result;
		},
		hasAttr: function(attr) {
			return this.attrs.get_item(attr) > 0;
		},
		hasFeat: function(feat) {
			return this.feats.get_item(feat) > 0;
		},
		hasSpell: function(spell) {
			return this.spells.get_item(spell) > 0;
		},
		gainAttr: function(attr, duration) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + 1);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, duration, attr));
		},
		gainAttr$1: function(attr, duration, value) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + value);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor8(this, duration, attr, value));
		},
		gainAttr$4: function(attr, duration, msg, objs) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + 1);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(this, duration, attr, msg, objs));
		},
		gainAttr$2: function(attr, duration, msg) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + 1);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(this, duration, attr, msg));
		},
		gainAttr$5: function(attr, duration, value, msg, objs) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + value);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctore(this, duration, attr, value, msg, objs));
		},
		gainAttr$3: function(attr, duration, value, msg) {
			this.attrs.set_item(attr, this.attrs.get_item(attr) + value);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctorb(this, duration, attr, value, msg));
		},
		gainAttrRefreshDuration: function(attr, duration) {
			$Forays_Actor.get_q().killEvents(this, attr);
			this.attrs.set_item(attr, this.attrs.get_item(attr) + 1);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor8(this, duration, attr, this.attrs.get_item(attr)));
		},
		gainAttrRefreshDuration$1: function(attr, duration, msg, objs) {
			$Forays_Actor.get_q().killEvents(this, attr);
			this.attrs.set_item(attr, this.attrs.get_item(attr) + 1);
			$Forays_Actor.get_q().add(new $Forays_Event.$ctore(this, duration, attr, this.attrs.get_item(attr), msg, objs));
		},
		gainSpell: function(spell_list) {
			for (var $t1 = 0; $t1 < spell_list.length; $t1++) {
				var spell = spell_list[$t1];
				this.spells.set_item(spell, this.spells.get_item(spell) + 1);
			}
		},
		lightRadius: function() {
			return Math.max(this.get_light_radius(), this.attrs.get_item(31));
		},
		armorClass: function() {
			var total = this.totalSkill(1);
			if (this.weapons[0] === 3 || this.weapons[0] === 8) {
				total++;
			}
			if (this.magic_items.contains(2)) {
				total++;
			}
			total += $Forays_Armor.protection(this.armors[0]);
			return total;
		},
		stealth: function() {
			return this.stealth$1(this.get_row(), this.get_col());
		},
		stealth$1: function(r, c) {
			//this method should probably become part of TotalSkill
			if (this.lightRadius() > 0) {
				return 0;
				//negative stealth is the same as zero stealth
			}
			var total = this.totalSkill(4);
			if (!$Forays_PhysicalObject.get_m().tile.get_item(r, c).isLit()) {
				if (this.get_atype() === 0 || !$Forays_Actor.get_player().hasAttr(85)) {
					//+2 stealth while in darkness unless shadowsight is in effect
					total += 2;
				}
			}
			if (!this.hasFeat(4) || $Forays_Armor.baseArmor(this.armors[0]) !== 1) {
				total -= $Forays_Armor.stealthPenalty(this.armors[0]);
			}
			return total;
		},
		totalSkill: function(skill) {
			var result = this.skills.get_item(skill);
			switch (skill) {
				case 0: {
					result += this.attrs.get_item(98);
					break;
				}
				case 1: {
					result += this.attrs.get_item(99);
					break;
				}
				case 2: {
					result += this.attrs.get_item(100);
					break;
				}
				case 3: {
					result += this.attrs.get_item(101);
					break;
				}
				case 4: {
					result += this.attrs.get_item(102);
					break;
				}
			}
			return result;
		},
		woundStatus: function() {
			if (this.get_atype() === 53) {
				if (ss.isValue(this.group) && this.group.length > 0) {
					for (var $t1 = 0; $t1 < this.group.length; $t1++) {
						var a = this.group[$t1];
						if (a.get_atype() === 12) {
							return a.woundStatus();
						}
					}
				}
			}
			var percentage = ss.Int32.div(this.get_curhp() * 100, this.get_maxhp());
			if (percentage === 100) {
				return '(unhurt)';
			}
			else if (percentage > 90) {
				return '(scratched)';
			}
			else if (percentage > 70) {
				return '(slightly damaged)';
			}
			else if (percentage > 50) {
				return '(somewhat damaged)';
			}
			else if (percentage > 30) {
				return '(heavily damaged)';
			}
			else if (percentage > 10) {
				return '(extremely damaged)';
			}
			else if (this.hasAttr(1) || this.hasAttr(2)) {
				return '(almost destroyed)';
			}
			else {
				return '(almost dead)';
			}
		},
		durationOfMagicalEffect: function(original) {
			//intended to be used with whole turns, i.e. numbers below 50.
			var diff = ss.Int32.div(original * this.totalSkill(3), 20);
			//each point of Spirit takes off 1/20th of the duration
			var result = original - diff;
			//therefore, maxed Spirit cuts durations in half
			if (result < 1) {
				result = 1;
				//no negative turncounts please
			}
			return result;
		},
		canWander: function() {
			switch (this.get_atype()) {
				case 4:
				case 7:
				case 6:
				case 10:
				case 16:
				case 24:
				case 26:
				case 32:
				case 34:
				case 37:
				case 43:
				case 49:
				case 0:
				case 2: {
					return false;
				}
				default: {
					return true;
				}
			}
		},
		alwaysWanders: function() {
			switch (this.get_atype()) {
				case 17:
				case 28:
				case 36:
				case 40:
				case 45: {
					return true;
				}
				default: {
					return false;
				}
			}
		},
		removeTarget: function(a) {
			if (ss.referenceEquals(this.get_target(), a)) {
				this.set_target(null);
			}
		},
		q0: function() {
			//add movement event to queue, zero turns
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor1(this, 0));
		},
		q1: function() {
			//one turn
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor1(this, 100));
		},
		QS: function() {
			//equal to speed
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor1(this, this.get_speed()));
		},
		toString: function() {
			return this.get_symbol().toString();
		},
		input: function() {
			var skip_input = false;
			if (this.hasAttr(44)) {
				if ($Forays_PhysicalObject.get_m().get_wiz_lite() || $Forays_Actor.get_player().hasAttr(16) && this.distanceFrom($Forays_Actor.get_player()) <= $Forays_Actor.get_player().get_light_radius() && $Forays_Actor.get_player().hasBresenhamLine(this.get_row(), this.get_col())) {
					$Forays_Actor.get_b().add$1(this.you('turn') + ' to dust! ', this);
					this.takeDamage$1(0, 2, 9999, null);
					return;
				}
			}
			if (this.get_atype() === 54) {
				this.attrs.set_item(69, this.attrs.get_item(69) - 1);
				if (this.attrs.get_item(69) < 0) {
					this.takeDamage$1(0, 2, 9999, null);
					return;
				}
			}
			if (ss.referenceEquals(this, $Forays_Actor.get_player()) && this.tile().is$1(35)) {
				var drake_on_next_level = false;
				var $t1 = $Forays_PhysicalObject.get_m().allActors();
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var a = $t1[$t2];
					//if(a.type == ActorType.FIRE_DRAKE && a.tile().Is(TileType.CHASM)){
					//	drake_on_next_level = true;
					//	break;
					//}
				}
				var $t3 = $Forays_Actor.get_q().list;
				for (var $t4 = 0; $t4 < $t3.length; $t4++) {
					var e = $t3[$t4];
					if (e.get_evtype() === 21) {
						if (e.get_attr() === 69) {
							//if this attr is set, it means that the drake is supposed to be on the level above you.
							drake_on_next_level = false;
						}
						else {
							//drake_on_next_level = true;
						}
						break;
					}
				}
				$Forays_Actor.get_b().add('You fall. ');
				$Forays_Actor.get_b().printAll();
				var old_magic_penalty = this.magic_penalty;
				var old_resting_status = this.attrs.get_item(78);
				$Forays_PhysicalObject.get_m().generateBossLevel(drake_on_next_level);
				this.magic_penalty = old_magic_penalty;
				//falling to a new level doesn't let you rest again during the boss fight
				this.attrs.set_item(78, old_resting_status);
				this.q0();
				return;
			}
			if (this.get_atype() === 2 && this.tile().is$1(35)) {
				if ($Forays_Actor.get_player().tile().get_ttype() === 35) {
					$Forays_Actor.get_b().add('You fall. ');
					$Forays_Actor.get_b().printAll();
					var old_magic_penalty1 = $Forays_Actor.get_player().magic_penalty;
					var old_resting_status1 = $Forays_Actor.get_player().attrs.get_item(78);
					$Forays_PhysicalObject.get_m().generateBossLevel(true);
					$Forays_Actor.get_player().magic_penalty = old_magic_penalty1;
					//falling to a new level doesn't let you rest again during the boss fight
					$Forays_Actor.get_player().attrs.set_item(78, old_resting_status1);
					return;
				}
				else {
					if ($Forays_Actor.get_player().canSee(this)) {
						$Forays_Actor.get_b().add(this.get_the_name() + ' drops to the next level. ');
					}
					else {
						$Forays_Actor.get_b().add('You hear a crash as ' + this.get_the_name() + ' drops to the next level. ');
					}
					$Forays_Actor.get_q().add(new $Forays_Event.$ctorf(null, null, ($Forays_Global.roll(20) + 50) * 100, 21, 109, this.get_curhp(), ''));
					this.attrs.set_item(107, 0);
					this.takeDamage$1(0, 2, 9999, null);
					return;
				}
			}
			if (this.hasAttr(38)) {
				//this probably wouldn't work well for anyone but the player, yet.
				var $t5 = this.actorsWithinDistance(12);
				for (var $t6 = 0; $t6 < $t5.length; $t6++) {
					var a1 = $t5[$t6];
					a1.player_visibility_duration = -1;
					a1.attrs.set_item(15, 1);
					if (a1.hasLOS(this)) {
						a1.target_location = this.tile();
					}
					else {
						a1.findPath(this);
					}
				}
			}
			if (this.hasAttr(82)) {
				this.attrs.set_item(82, 0);
			}
			if (this.hasAttr(86)) {
				this.attrs.set_item(86, 0);
				if (this.hasFeat(12)) {
					this.gainAttrRefreshDuration(87, Math.max(this.get_speed(), 100));
					this.attrs.set_item(101, this.attrs.get_item(101) + 1);
					if (this.attrs.get_item(87) % 2 === 0) {
						this.attrs.set_item(98, this.attrs.get_item(98) + 1);
					}
				}
			}
			else if (this.hasAttr(36) && !this.hasAttr(37) && $Forays_Global.oneIn(4) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				$Forays_Actor.get_b().add$1(this.you('fall') + ' asleep. ', this);
				var duration = 4 + $Forays_Global.roll(2);
				this.attrs.set_item(37, this.durationOfMagicalEffect(duration));
			}
			if (this.hasAttr(42) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				this.attrs.set_item(42, this.attrs.get_item(42) - 1);
				if (!this.hasAttr(42)) {
					for (var i = 0; i < 9999; ++i) {
						var rr = $Forays_Global.roll$1(1, 20);
						var rc = $Forays_Global.roll$1(1, 64);
						if ($Forays_PhysicalObject.get_m().boundsCheck(rr, rc) && $Forays_PhysicalObject.get_m().tile.get_item(rr, rc).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(rr, rc))) {
							if (this.get_atype() === 0) {
								$Forays_Actor.get_b().add('You are suddenly somewhere else. ');
								this.interrupt();
								this.move(rr, rc);
							}
							else {
								var seen = false;
								if ($Forays_Actor.get_player().canSee(this)) {
									seen = true;
								}
								if ($Forays_Actor.get_player().canSee(this.tile())) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' suddenly disappears. ', this);
								}
								this.move(rr, rc);
								if ($Forays_Actor.get_player().canSee(this.tile())) {
									if (seen) {
										$Forays_Actor.get_b().add$1(this.get_the_name() + ' reappears. ', this);
									}
									else {
										$Forays_Actor.get_b().add$1(this.get_a_name() + ' suddenly appears! ', this);
									}
								}
							}
							break;
						}
					}
					this.attrs.set_item(42, $Forays_Global.roll$1(2, 10) + 5);
				}
			}
			if (this.hasAttr(37)) {
				this.attrs.set_item(37, this.attrs.get_item(37) - 1);
				$Forays_Global.flushInput();
				if (!this.hasAttr(37)) {
					$Forays_Actor.get_b().add$1(this.you('wake') + ' up. ', this);
				}
				if (this.get_atype() !== 0) {
					this.q1();
					skip_input = true;
				}
			}
			if (this.hasAttr(28)) {
				this.attrs.set_item(28, this.attrs.get_item(28) - 1);
				if (this.get_atype() === 0) {
					$Forays_Actor.get_b().addDependingOnLastPartialMessage('You can\'t move! ');
				}
				else {
					//handled differently for the player: since the map still needs to be drawn,
					$Forays_Actor.get_b().add$1(this.get_the_name() + ' can\'t move! ', this);
					this.q1();
					// this is handled in InputHuman().
					skip_input = true;
					//the message is still printed, of course.
				}
			}
			if (this.hasAttr(91)) {
				this.attrs.set_item(91, 0);
				this.q1();
				skip_input = true;
			}
			if (this.hasAttr(30)) {
				if (this.get_atype() !== 0) {
					var damage = $Forays_Global.roll$1($Forays_AttackList.attack(this.get_atype(), 0).damage.dice, 6) + this.totalSkill(0);
					this.attrs.set_item(30, this.attrs.get_item(30) - damage);
					if (this.attrs.get_item(30) < 0) {
						this.attrs.set_item(30, 0);
					}
					if (this.hasAttr(30)) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' attempts to break free. ', this);
					}
					else {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' breaks free! ', this);
					}
					this.q1();
					skip_input = true;
				}
			}
			if (this.hasAttr(34) && !this.hasAttr(30) && !this.hasAttr(28)) {
				var banshee = null;
				var dist = 100;
				var $t7 = $Forays_PhysicalObject.get_m().allActors();
				for (var $t8 = 0; $t8 < $t7.length; $t8++) {
					var a2 = $t7[$t8];
					if (a2.get_atype() === 22 && this.distanceFrom(a2) < dist && this.hasLOS$1(a2.get_row(), a2.get_col())) {
						banshee = a2;
						dist = this.distanceFrom(a2);
					}
				}
				if (this.get_atype() === 0) {
					if (ss.isValue(banshee)) {
						$Forays_Actor.get_b().addDependingOnLastPartialMessage('You flee. ');
						this.aI_Step$1(banshee, true);
					}
					else {
						$Forays_Actor.get_b().addDependingOnLastPartialMessage('You feel unsettled. ');
					}
				}
				else {
					//same story
					if (ss.isValue(banshee)) {
						$Forays_Actor.get_b().add$1(this.you('flee') + '. ', this);
						this.aI_Step$1(banshee, true);
					}
					else {
						$Forays_Actor.get_b().add$1(this.youFeel() + ' unsettled. ', this);
					}
					this.q1();
					skip_input = true;
				}
			}
			if (this.get_curhp() < this.get_maxhp()) {
				if (this.hasAttr(24) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
					this.set_curhp(this.get_curhp() + this.attrs.get_item(24));
					if (this.get_curhp() > this.get_maxhp()) {
						this.set_curhp(this.get_maxhp());
					}
					$Forays_Actor.get_b().add$1(this.you('regenerate') + '. ', this);
				}
				else {
					var hplimit = 10;
					if (this.hasFeat(13)) {
						//the feat lets you heal to an even 20
						hplimit = 20;
					}
					if (this.recover_time <= $Forays_Actor.get_q().get_turn() && this.get_curhp() % hplimit !== 0) {
						if (this.hasAttr(17)) {
							this.recover_time = $Forays_Actor.get_q().get_turn() + 100;
						}
						else {
							this.recover_time = $Forays_Actor.get_q().get_turn() + 500;
						}
						this.set_curhp(this.get_curhp() + 1);
					}
				}
			}
			if ((this.hasAttr(29) || this.tile().is(6)) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				var strength = this.attrs.get_item(29);
				if (this.tile().is(6) && strength < 3) {
					strength = 3;
				}
				if (true !== this.takeDamage$2(4, 2, $Forays_Global.roll(strength + 2) - 1, null, '*succumbed to poison')) {
					return;
				}
			}
			if (this.hasAttr(31) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				if (this.get_atype() === 52) {
					$Forays_Actor.get_b().add$1(this.get_the_name() + ' burns slowly. ', this);
				}
				else {
					$Forays_Actor.get_b().add$1(this.youAre() + ' on fire! ', this);
				}
				if (true !== this.takeDamage$2(1, 0, $Forays_Global.roll$1(this.attrs.get_item(31), 6), null, '*burned to death')) {
					return;
				}
			}
			if (this.hasAttr(43) && this.tile().isLit() && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				if (this.get_atype() === 0) {
					$Forays_Actor.get_b().add('The light burns you! ');
				}
				else {
					$Forays_Actor.get_b().add$1('The light burns ' + this.get_the_name() + '. ', this);
				}
				if (true !== this.takeDamage$2(0, 2, $Forays_Global.roll(6), null, '*shriveled in the light')) {
					return;
				}
			}
			if (this.hasAttr(94) && ss.referenceEquals(this, $Forays_Actor.get_player()) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				if (this.attrs.get_item(94) === 2) {
					if (this.attrs.get_item(92) >= this.get_curhp() && !this.hasAttr(67)) {
						$Forays_Actor.get_b().add('You can\'t resist the poison any longer. ');
						$Forays_Actor.get_b().add('You lose consciousness. ');
						if (true !== this.takeDamage$2(0, 2, this.get_curhp(), null, '*eaten alive by a pack of compys')) {
							return;
						}
					}
					else {
						$Forays_Actor.get_b().add('You manage to stay awake! ');
						this.attrs.set_item(94, 0);
					}
				}
				if (this.hasAttr(94)) {
					//it needs to go to 2 to ensure the proper timing
					this.attrs.set_item(94, this.attrs.get_item(94) + 1);
				}
			}
			if (!skip_input) {
				if (this.get_atype() === 0) {
					this.inputHuman();
				}
				else {
					this.inputAI();
				}
			}
			if (this.hasAttr(0)) {
				//monsters only
				if (($Forays_Actor.get_player().isWithinSightRangeOf$1(this.get_row(), this.get_col()) || $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).isLit()) && $Forays_Actor.get_player().hasLOS$1(this.get_row(), this.get_col())) {
					if (this.isHiddenFrom($Forays_Actor.get_player())) {
						//if they're stealthed and near the player...
						var $t11 = this.stealth() * this.distanceFrom($Forays_Actor.get_player()) * 10;
						var $t9 = this.attrs;
						var $t10 = this.attrs.get_item(77);
						$t9.set_item(77, $t10 + 1);
						if ($t11 - $t10 * 5 < $Forays_Global.roll$1(1, 100)) {
							this.attrs.set_item(77, -1);
							if (this.distanceFrom($Forays_Actor.get_player()) > 3) {
								$Forays_Actor.get_b().add('You notice ' + this.get_a_name() + '. ');
							}
							else {
								$Forays_Actor.get_b().add('You notice ' + this.get_a_name() + ' nearby. ');
							}
						}
					}
					else {
						this.attrs.set_item(77, -1);
					}
				}
				else if (this.attrs.get_item(77) >= 0) {
					//if they hadn't been seen yet...
					this.attrs.set_item(77, 0);
				}
				else {
					var $t12 = this.attrs;
					var $t13 = this.attrs.get_item(77);
					$t12.set_item(77, $t13 - 1);
					if ($t13 === -10) {
						//check this value for balance
						this.attrs.set_item(77, 0);
					}
				}
			}
			if (this.hasAttr(31) && this.attrs.get_item(31) < 5 && this.time_of_last_action < $Forays_Actor.get_q().get_turn() && this.get_atype() !== 52) {
				if ($Forays_Global.coinFlip()) {
					if (this.attrs.get_item(31) >= this.get_light_radius()) {
						this.updateRadius(this.attrs.get_item(31), this.attrs.get_item(31) + 1);
					}
					this.attrs.set_item(31, this.attrs.get_item(31) + 1);
				}
			}
			if (this.hasAttr(32) && this.time_of_last_action < $Forays_Actor.get_q().get_turn()) {
				if ($Forays_Global.oneIn(3)) {
					this.attrs.set_item(32, 0);
					if (!this.hasAttr(31)) {
						if (this.get_light_radius() === 0) {
							this.updateRadius(0, 1);
						}
						this.attrs.set_item(31, 1);
						$Forays_Help.tutorialTip(4);
					}
				}
			}
			if (this.hasAttr(33)) {
				//this hack is necessary because of
				if (!this.hasAttr(32)) {
					//  the timing involved - 
					this.attrs.set_item(32, 1);
					// anything that catches fire on its own turn would immediately be on fire.
				}
				this.attrs.set_item(33, 0);
			}
			this.time_of_last_action = $Forays_Actor.get_q().get_turn();
			//this might eventually need a slight rework for 0-time turns
		},
		inputHuman: function() {
			this.displayStats$1(true);
			if (this.hasFeat(19)) {
				$Forays_PhysicalObject.get_m().updateDangerValues();
			}
			$Forays_PhysicalObject.get_m().draw();
			if (this.hasAttr(81)) {
				if (this.path.length === 0) {
					if (!this.findAutoexplorePath()) {
						$Forays_Actor.get_b().add('You don\'t see a path for further exploration. ');
					}
				}
			}
			if (!this.hasAttr(34) && !this.hasAttr(28) && !this.hasAttr(30) && !this.hasAttr(37)) {
				$Forays_Actor.get_b().print(false);
			}
			else {
				$Forays_Actor.get_b().displayNow();
			}
			this.cursor();
			$Forays_Game.console.cursorVisible = true;
			if (this.hasAttr(28) || this.hasAttr(34) || this.hasAttr(37)) {
				if (this.hasAttr(34)) {
					$Forays_Game.game.e.lock();
					window.setTimeout(function() {
						$Forays_Game.game.e.unlock();
					}, 250);
				}
				if (this.hasAttr(37)) {
					$Forays_Game.game.e.lock();
					window.setTimeout(function() {
						$Forays_Game.game.e.unlock();
					}, 100);
				}
				this.q1();
				return true;
			}
			if (this.hasAttr(30)) {
				var damage = $Forays_Global.roll$1($Forays_Weapon.damage(this.weapons[0]).dice, 6) + this.totalSkill(0);
				this.attrs.set_item(30, this.attrs.get_item(30) - damage);
				if (this.attrs.get_item(30) < 0) {
					this.attrs.set_item(30, 0);
				}
				if (this.hasAttr(30)) {
					$Forays_Actor.get_b().add('You attempt to break free. ');
				}
				else {
					$Forays_Actor.get_b().add('You break free! ');
				}
				this.q1();
				return true;
			}
			if ($Forays_Global.option(1) && ss.isValue(this.tile().get_inv()) && !this.tile().get_inv().get_ignored() && !this.tile().is(3)) {
				var grenade = false;
				var $t1 = this.tilesWithinDistance(1);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (t.is(0)) {
						grenade = true;
					}
				}
				if (!grenade && !this.hasAttr(31) && !this.hasAttr(32)) {
					var monster = false;
					var $t3 = $Forays_PhysicalObject.get_m().allActors();
					for (var $t4 = 0; $t4 < $t3.length; $t4++) {
						var a = $t3[$t4];
						if (!ss.referenceEquals(a, this) && this.canSee(a)) {
							monster = true;
							break;
						}
					}
					if (!monster) {
						if (this.stunnedThisTurn()) {
							return true;
						}
						var i = this.tile().get_inv();
						i.set_row(-1);
						i.set_col(-1);
						this.tile().set_inv(null);
						$Forays_Actor.get_b().add('You pick up ' + i.theName() + '. ');
						var added = false;
						var $t5 = this.get_inv();
						for (var $t6 = 0; $t6 < $t5.length; $t6++) {
							var item = $t5[$t6];
							if (item.get_itype() === i.get_itype() && !item.get_do_not_stack() && !i.get_do_not_stack()) {
								item.set_quantity(item.get_quantity() + i.get_quantity());
								added = true;
								break;
							}
						}
						if (!added) {
							this.get_inv().add(i);
						}
						this.q1();
						return true;
					}
				}
			}
			if (this.path.length > 0) {
				var monsters_visible = false;
				var $t7 = $Forays_PhysicalObject.get_m().allActors();
				for (var $t8 = 0; $t8 < $t7.length; $t8++) {
					var a1 = $t7[$t8];
					if (!ss.referenceEquals(a1, this) && this.canSee(a1) && this.hasLOS$1(a1.get_row(), a1.get_col())) {
						//check LOS, prevents detected mobs from stopping you
						monsters_visible = true;
					}
				}
				if (!monsters_visible) {
					if ($Forays_Game.console.keyAvailable) {
						$Forays_Game.console.readKey(true);
						this.interrupt();
					}
					else {
						//AI_Step(M.tile[path[0]]);
						this.playerWalk(this.directionOf$1(this.path[0]));
						if (this.path.length > 0) {
							if (this.distanceFrom$1(this.path[0]) === 0) {
								this.path.removeAt(0);
							}
						}
						//QS();
						return true;
					}
				}
				else {
					this.interrupt();
				}
			}
			if (this.hasAttr(79)) {
				var monsters_visible1 = false;
				var $t9 = $Forays_PhysicalObject.get_m().allActors();
				for (var $t10 = 0; $t10 < $t9.length; $t10++) {
					var a2 = $t9[$t10];
					if (!ss.referenceEquals(a2, this) && this.canSee(a2) && this.hasLOS$1(a2.get_row(), a2.get_col())) {
						//check LOS, prevents detected mobs from stopping you
						monsters_visible1 = true;
					}
				}
				var t1 = this.tileInDirection(this.attrs.get_item(79));
				var stopped_by_terrain = false;
				if (t1.isKnownTrap() || t1.is(9) || t1.is(10) || t1.is(0) || t1.is(6) || t1.is(3)) {
					stopped_by_terrain = true;
				}
				if (!monsters_visible1 && !stopped_by_terrain && !$Forays_Game.console.keyAvailable) {
					if (this.attrs.get_item(79) === 5) {
						var hplimit = (this.hasFeat(13) ? 20 : 10);
						if (this.get_curhp() % hplimit === 0) {
							if (this.hasAttr(80)) {
								this.attrs.set_item(80, this.attrs.get_item(80) - 1);
								this.q1();
								return true;
							}
							else {
								this.attrs.set_item(79, 0);
							}
						}
						else {
							this.q1();
							return true;
						}
					}
					else if (t1.get_passable()) {
						this.playerWalk(this.attrs.get_item(79));
						return true;
					}
					else {
						var opposite = this.tileInDirection(this.rotateDirection$1(this.attrs.get_item(79), true, 4));
						var num_floors = 0;
						var floor_dir = 0;
						var $t11 = this.tilesAtDistance(1);
						for (var $t12 = 0; $t12 < $t11.length; $t12++) {
							var t2 = $t11[$t12];
							//if(t2 != opposite && t2.name == "floor"){
							if (!ss.referenceEquals(t2, opposite) && (t2.get_passable() || t2.get_ttype() === 3)) {
								num_floors++;
								floor_dir = this.directionOf(t2);
							}
						}
						if (num_floors === 1) {
							this.attrs.set_item(79, floor_dir);
							this.playerWalk(floor_dir);
							return true;
						}
						else {
							this.attrs.set_item(79, 0);
							this.attrs.set_item(80, 0);
						}
					}
				}
				else {
					if ($Forays_Game.console.keyAvailable) {
						$Forays_Game.console.readKey(true);
					}
					this.attrs.set_item(79, 0);
					this.attrs.set_item(80, 0);
				}
			}
			if (this.hasAttr(78)) {
				if (this.attrs.get_item(78) === 10) {
					this.attrs.set_item(78, -1);
					this.set_curhp(this.get_curhp() + ss.Int32.div(this.get_maxhp() - this.get_curhp(), 2));
					//recover half of your missing health
					this.resetSpells();
					$Forays_Actor.get_b().add('You rest...you feel great! ');
					$Forays_Actor.get_b().print(false);
					this.displayStats$1(true);
					this.cursor();
				}
				else {
					var monsters_visible2 = false;
					var $t13 = $Forays_PhysicalObject.get_m().allActors();
					for (var $t14 = 0; $t14 < $t13.length; $t14++) {
						var a3 = $t13[$t14];
						if (!ss.referenceEquals(a3, this) && this.canSee(a3) && this.hasLOS$1(a3.get_row(), a3.get_col())) {
							//check LOS, prevents detected mobs from stopping you
							monsters_visible2 = true;
						}
					}
					if (monsters_visible2 || $Forays_Game.console.keyAvailable) {
						if ($Forays_Game.console.keyAvailable) {
							$Forays_Game.console.readKey(true);
						}
						if (monsters_visible2) {
							this.attrs.set_item(78, 0);
							$Forays_Actor.get_b().add('You rest...you are interrupted! ');
							$Forays_Actor.get_b().print(false);
							this.cursor();
						}
						else {
							this.attrs.set_item(78, 0);
							$Forays_Actor.get_b().add('You rest...you stop resting. ');
							$Forays_Actor.get_b().print(false);
							this.cursor();
						}
					}
					else {
						this.attrs.set_item(78, this.attrs.get_item(78) + 1);
						$Forays_Actor.get_b().add('You rest... ');
						this.q1();
						return true;
					}
				}
			}
			if ($Forays_Actor.get_q().get_turn() === 0) {
				$Forays_Help.tutorialTip(0);
				this.cursor();
			}
			if (!$Forays_Help.displayed.get_item(1) && $Forays_Extensions.any($Forays_Actor).call(null, $Forays_PhysicalObject.get_m().allActors(), Function.mkdel(this, function(a4) {
				return !ss.referenceEquals(a4, this) && this.canSee(a4);
			}))) {
				$Forays_Help.tutorialTip(1);
				this.cursor();
			}
			var command = $Forays_Game.console.readKey(true);
			var ch = $Forays_Actor.convertInput(command);
			ch = $Forays_Actor.convertVIKeys(ch);
			var alt = false;
			var ctrl = false;
			var shift = false;
			if ((command.modifiers & $Forays_ConsoleModifiers.alt) === $Forays_ConsoleModifiers.alt) {
				alt = true;
			}
			if ((command.modifiers & $Forays_ConsoleModifiers.control) === $Forays_ConsoleModifiers.control) {
				ctrl = true;
			}
			if ((command.modifiers & $Forays_ConsoleModifiers.shift) === $Forays_ConsoleModifiers.shift) {
				shift = true;
			}
			switch (ch) {
				case '7':
				case '8':
				case '9':
				case '4':
				case '6':
				case '1':
				case '2':
				case '3': {
					$('#debug').replaceWith('<div id="debug"><p>DEBUG Key Down, Key is ' + command.key + ', Char is ' + String.fromCharCode(command.keyChar) + ', ch is ' + ch + '</p></div>');
					var dir = ch.charCodeAt(0) - 48;
					//ascii 0-9 are 48-57
					if (shift || alt || ctrl) {
						var monsters_visible3 = false;
						var $t15 = $Forays_PhysicalObject.get_m().allActors();
						for (var $t16 = 0; $t16 < $t15.length; $t16++) {
							var a5 = $t15[$t16];
							if (!ss.referenceEquals(a5, this) && this.canSee(a5) && this.hasLOS$1(a5.get_row(), a5.get_col())) {
								monsters_visible3 = true;
							}
						}
						this.playerWalk(dir);
						if (!monsters_visible3) {
							this.attrs.set_item(79, dir);
						}
					}
					else {
						this.playerWalk(dir);
					}
					break;
				}
				case '5':
				case '.': {
					if (this.hasFeat(6) && this.enemiesAdjacent() > 0) {
						if (!this.hasAttr(32) && !this.hasAttr(31)) {
							this.attrs.set_item(82, this.attrs.get_item(82) + 1);
							$Forays_Actor.get_b().add('You ready yourself. ');
						}
					}
					if (this.hasAttr(32)) {
						this.attrs.set_item(32, 0);
						$Forays_Actor.get_b().add('You stop the flames from spreading. ');
					}
					else if (this.hasAttr(31)) {
						var update = false;
						var oldradius = this.lightRadius();
						if (this.attrs.get_item(31) > this.get_light_radius()) {
							update = true;
						}
						var i1 = 2;
						if ($Forays_Global.roll$1(1, 3) === 3) {
							// 1 in 3 times, you don't make progress against the fire
							i1 = 1;
						}
						this.attrs.set_item(31, this.attrs.get_item(31) - i1);
						if (this.attrs.get_item(31) < 0) {
							this.attrs.set_item(31, 0);
						}
						if (update) {
							this.updateRadius(oldradius, this.lightRadius());
						}
						if (this.hasAttr(31)) {
							$Forays_Actor.get_b().add('You put out some of the fire. ');
							//better message?
						}
						else {
							$Forays_Actor.get_b().add('You put out the fire. ');
						}
					}
					if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv())) {
						$Forays_Actor.get_b().add('You see ' + $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv().aName() + '. ');
					}
					this.QS();
					break;
				}
				case 'w': {
					var dir1 = this.getDirection$3('Start walking in which direction? ', false, true);
					if (dir1 !== 0) {
						var monsters_visible4 = false;
						var $t17 = $Forays_PhysicalObject.get_m().allActors();
						for (var $t18 = 0; $t18 < $t17.length; $t18++) {
							var a6 = $t17[$t18];
							if (!ss.referenceEquals(a6, this) && this.canSee(a6) && this.hasLOS$1(a6.get_row(), a6.get_col())) {
								monsters_visible4 = true;
							}
						}
						if (dir1 !== 5) {
							this.playerWalk(dir1);
						}
						else {
							this.q1();
						}
						if (!monsters_visible4) {
							this.attrs.set_item(79, dir1);
							var hplimit1 = (this.hasFeat(13) ? 20 : 10);
							if (this.get_curhp() % hplimit1 === 0 && dir1 === 5) {
								this.attrs.set_item(80, 20);
							}
						}
					}
					else {
						this.q0();
					}
					break;
				}
				case 'o': {
					var dir2 = 0;
					var total = 0;
					var $t19 = this.tilesAtDistance(1);
					for (var $t20 = 0; $t20 < $t19.length; $t20++) {
						var t3 = $t19[$t20];
						if (t3.get_ttype() === 3 || t3.get_ttype() === 2 || t3.get_ttype() === 28 || this.hasFeat(17) && t3.isKnownTrap()) {
							if (ss.isNullOrUndefined(t3.actor()) && (ss.isNullOrUndefined(t3.get_inv()) || t3.isTrap())) {
								dir2 = this.directionOf(t3);
								++total;
							}
						}
					}
					if (total === 1) {
						var t4 = this.tileInDirection(dir2);
						if (t4.get_ttype() === 3 || t4.get_ttype() === 2 || t4.get_ttype() === 28) {
							if (this.stunnedThisTurn()) {
								return true;
							}
							t4.toggle(this);
							this.q1();
						}
						else if (t4.isTrap()) {
							if (this.grabPreventsMovement(t4)) {
								$Forays_Actor.get_b().add('You can\'t currently reach that trap. ');
								this.q0();
								return true;
							}
							else {
								if (this.stunnedThisTurn()) {
									return true;
								}
								if ($Forays_Global.roll(5) <= 4) {
									$Forays_Actor.get_b().add('You disarm ' + $Forays_Tile.prototype$1(t4.get_ttype()).get_the_name() + '. ');
									t4.toggle(this);
									this.q1();
								}
								else if ($Forays_Global.roll(20) <= this.skills.get_item(1)) {
									$Forays_Actor.get_b().add('You almost set off ' + $Forays_Tile.prototype$1(t4.get_ttype()).get_the_name() + '! ');
									this.q1();
								}
								else {
									$Forays_Actor.get_b().add('You set off ' + $Forays_Tile.prototype$1(t4.get_ttype()).get_the_name() + '! ');
									this.move(t4.get_row(), t4.get_col());
									this.q1();
								}
							}
						}
						else {
							this.q0();
							//shouldn't happen
						}
					}
					else {
						dir2 = this.getDirection$1('Operate something in which direction? ');
						if (dir2 !== -1) {
							var t5 = this.tileInDirection(dir2);
							if (t5.isKnownTrap()) {
								if (this.hasFeat(17)) {
									if (this.grabPreventsMovement(t5)) {
										$Forays_Actor.get_b().add('You can\'t currently reach that trap. ');
										this.q0();
										return true;
									}
									if (this.stunnedThisTurn()) {
										return true;
									}
									if ($Forays_Global.roll(5) <= 4) {
										$Forays_Actor.get_b().add('You disarm ' + $Forays_Tile.prototype$1(t5.get_ttype()).get_the_name() + '. ');
										t5.toggle(this);
										this.q1();
									}
									else if ($Forays_Global.roll(20) <= this.skills.get_item(1)) {
										$Forays_Actor.get_b().add('You almost set off ' + $Forays_Tile.prototype$1(t5.get_ttype()).get_the_name() + '! ');
										this.q1();
									}
									else {
										$Forays_Actor.get_b().add('You set off ' + $Forays_Tile.prototype$1(t5.get_ttype()).get_the_name() + '! ');
										this.move(t5.get_row(), t5.get_col());
										this.q1();
									}
								}
								else {
									$Forays_Actor.get_b().add('You don\'t know how to disable that trap. ');
									this.q0();
									return true;
								}
							}
							else {
								switch (t5.get_ttype()) {
									case 3:
									case 2:
									case 28: {
										if (this.stunnedThisTurn()) {
											break;
										}
										t5.toggle(this);
										this.q1();
										break;
									}
									case 5: {
										$Forays_Actor.get_b().add('Stand on the chest and press \'g\' to retrieve its contents. ');
										this.q0();
										break;
									}
									case 4: {
										$Forays_Actor.get_b().add('Stand on the stairs and press \'>\' to descend. ');
										this.q0();
										break;
									}
									default: {
										this.q0();
										break;
									}
								}
							}
						}
						else {
							this.q0();
						}
					}
					break;
				}
				case 's': {
					if ($Forays_Weapon.baseWeapon(this.weapons[0]) === 4 || this.hasFeat(0)) {
						if (this.actorsAtDistance(1).length > 0) {
							if (this.actorsAtDistance(1).length === 1) {
								$Forays_Actor.get_b().add('You can\'t fire with an enemy so close. ');
							}
							else {
								$Forays_Actor.get_b().add('You can\'t fire with enemies so close. ');
							}
							this.q0();
						}
						else {
							var line = this.getTarget$2(12);
							if (ss.isValue(line)) {
								//if(DistanceFrom(t) > 1 || t.actor() == null){
								this.fireArrow$1(line);
								//}
								//else{
								//B.Add("You can't fire at adjacent targets. ");
								//Q0();
								//}
							}
							else {
								this.q0();
							}
						}
					}
					else {
						$Forays_Actor.get_b().add('You can\'t fire arrows without your bow equipped. ');
						this.q0();
					}
					break;
				}
				case 'f': {
					var active_feats = [];
					var passive_feats = [];
					for (var $t21 = 0; $t21 < $Forays_Actor.feats_in_order.length; $t21++) {
						var ft = $Forays_Actor.feats_in_order[$t21];
						if ($Forays_Feat.isActivated(ft)) {
							active_feats.add(ft);
						}
						else {
							passive_feats.add(ft);
						}
					}
					$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
					var line1 = 1;
					if (active_feats.length > 0) {
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize('Active feats:'));
						++line1;
						var letter = 97;
						for (var $t22 = 0; $t22 < active_feats.length; $t22++) {
							var ft1 = active_feats[$t22];
							var s = '[' + String.fromCharCode(letter) + '] ' + $Forays_Feat.name$1(ft1);
							$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize(s));
							$Forays_Screen.writeMapChar$2(line1, 1, String.fromCharCode(letter), 8);
							++line1;
							++letter;
						}
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize(''));
						++line1;
					}
					if (passive_feats.length > 0) {
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize('Passive feats:'));
						++line1;
						for (var $t23 = 0; $t23 < passive_feats.length; $t23++) {
							var ft2 = passive_feats[$t23];
							var s1 = '    ' + $Forays_Feat.name$1(ft2);
							$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize(s1));
							++line1;
						}
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize(''));
						++line1;
					}
					$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize('Feats currently being learned:'));
					++line1;
					if ($Forays_Actor.partial_feats_in_order.length === 0) {
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize('    None'));
						++line1;
					}
					else if ($Forays_Actor.partial_feats_in_order.length + line1 > 21) {
						var extras = $Forays_Actor.partial_feats_in_order.length + line1 - 21;
						for (var $t24 = 0; $t24 < $Forays_Actor.partial_feats_in_order.length; $t24++) {
							var ft3 = $Forays_Actor.partial_feats_in_order[$t24];
							if (line1 === 21) {
								//don't print the bottommost feats again
								break;
							}
							$Forays_Screen.writeMapString$2(line1, 0, '    ' + $Forays_Feat.name$1(ft3).padRight(21));
							if (extras > 0) {
								$Forays_Screen.writeMapString$2(line1, 25, '(' + -this.feats.get_item(ft3) + '/' + $Forays_Feat.maxRank(ft3) + ')'.padRight(7));
								var ft21 = $Forays_Actor.partial_feats_in_order[$Forays_Actor.partial_feats_in_order.length - extras];
								$Forays_Screen.writeMapString$2(line1, 36, $Forays_Feat.name$1(ft21).padRight(21));
								$Forays_Screen.writeMapString$2(line1, 57, '(' + -this.feats.get_item(ft21) + '/' + $Forays_Feat.maxRank(ft21) + ')'.padRight(6));
								++line1;
								--extras;
							}
							else {
								$Forays_Screen.writeMapString$2(line1, 25, '(' + -this.feats.get_item(ft3) + '/' + $Forays_Feat.maxRank(ft3) + ')'.padRight(37));
								++line1;
							}
						}
					}
					else {
						for (var $t25 = 0; $t25 < $Forays_Actor.partial_feats_in_order.length; $t25++) {
							var ft4 = $Forays_Actor.partial_feats_in_order[$t25];
							$Forays_Screen.writeMapString$2(line1, 0, '    ' + $Forays_Feat.name$1(ft4).padRight(21));
							$Forays_Screen.writeMapString$2(line1, 25, '(' + -this.feats.get_item(ft4) + '/' + $Forays_Feat.maxRank(ft4) + ')'.padRight(37));
							++line1;
						}
					}
					$Forays_Screen.writeMapString$2(line1, 0, (''.padRight(25, 45) + '[?] for help').padRight($Forays_Actor.$COLS, 45));
					$Forays_Screen.writeMapChar(line1, 26, new $Forays_colorchar.$ctor2(8, '?'));
					++line1;
					if (line1 <= 21) {
						$Forays_Screen.writeMapString$2(line1, 0, $Forays_Extensions.padToMapSize(''));
					}
					$Forays_Screen.resetColors();
					if (active_feats.length > 0) {
						$Forays_Actor.get_b().displayNow$1('Use which feat? ');
					}
					else {
						$Forays_Actor.get_b().displayNow$1('Feats: ');
					}
					$Forays_Game.console.cursorVisible = true;
					var selected_feat = 21;
					var done = false;
					while (!done) {
						command = $Forays_Game.console.readKey(true);
						ch = $Forays_Actor.convertInput(command);
						var ii = ch.charCodeAt(0) - 97;
						if (active_feats.length > ii && ii >= 0) {
							selected_feat = active_feats[ii];
							done = true;
						}
						else if (ch === '?') {
							$Forays_Help.displayHelp$1(2);
							done = true;
						}
						else {
							done = true;
						}
					}
					$Forays_PhysicalObject.get_m().redrawWithStrings();
					if (selected_feat !== 21) {
						if (this.stunnedThisTurn()) {
							break;
						}
						if (true !== this.useFeat(selected_feat)) {
							this.q0();
						}
					}
					else {
						this.q0();
					}
					break;
				}
				case 'z': {
					var $t26 = this.actorsWithinDistance(2);
					for (var $t27 = 0; $t27 < $t26.length; $t27++) {
						var a7 = $t26[$t27];
						if (a7.hasAttr(75) && a7.hasLOE(this)) {
							if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
								if (this.canSee(a7)) {
									$Forays_Actor.get_b().add(a7.your() + ' presence prevents you from casting! ');
								}
								else {
									$Forays_Actor.get_b().add('Something prevents you from casting! ');
								}
							}
							this.q0();
							return true;
						}
					}
					var ls = [];
					var sp = [];
					//foreach(SpellType spell in Enum.GetValues(typeof(SpellType))){
					var bonus_marked = false;
					for (var $t28 = 0; $t28 < $Forays_Actor.spells_in_order.length; $t28++) {
						var spell = $Forays_Actor.spells_in_order[$t28];
						if (this.hasSpell(spell)) {
							//string s = Spell.Name(spell).PadRight(15) + Spell.Level(spell).ToString().PadLeft(3);
							//s = s + FailRate(spell).ToString().PadLeft(9) + "%";
							//s = s + Spell.Description(spell).PadLeft(34);
							var cs = new $Forays_colorstring.$ctor2($Forays_Spell.name$1(spell).padRight(15) + $Forays_Spell.level(spell).toString().padLeft(3), 2);
							cs.strings.add(new $Forays_cstr.$ctor1(this.failRate(spell).toString().padLeft(9) + '%', this.failColor(spell)));
							if (this.hasFeat(8) && $Forays_Spell.isDamaging(spell) && !bonus_marked) {
								bonus_marked = true;
								cs = $Forays_colorstring.op_Addition(cs, $Forays_Spell.descriptionWithIncreasedDamage(spell));
							}
							else {
								cs = $Forays_colorstring.op_Addition(cs, $Forays_Spell.description(spell));
							}
							ls.add(cs);
							sp.add(spell);
						}
					}
					if (sp.length > 0) {
						var topborder = new $Forays_colorstring.$ctor2('------------------Level---Fail rate--------Description------------', 2);
						var basefail = this.magic_penalty * 5;
						if (!this.hasFeat(5)) {
							basefail += $Forays_Armor.addedFailRate(this.armors[0]);
						}
						var bottomborder = new $Forays_colorstring.$ctor6('------------Base fail rate: ', 2, basefail.toString().padLeft(3) + '%', this.failColor$1(basefail), '----------[', 2, '?', 8, '] for help'.padRight(22, 45), 2);
						//int i = Select("Cast which spell? ",topborder,bottomborder,ls);
						var i2 = this.select$6('Cast which spell? ', topborder, bottomborder, ls, false, false, true, true, 3);
						if (i2 !== -1) {
							if (true !== this.castSpell(sp[i2])) {
								this.q0();
							}
						}
						else {
							this.q0();
						}
					}
					else {
						$Forays_Actor.get_b().add('You don\'t know any spells. ');
						this.q0();
					}
					break;
				}
				case 'r': {
					if (this.attrs.get_item(78) !== -1) {
						//gets set to -1 if you've rested on this level
						var monsters_visible5 = false;
						var $t29 = $Forays_PhysicalObject.get_m().allActors();
						for (var $t30 = 0; $t30 < $t29.length; $t30++) {
							var a8 = $t29[$t30];
							if (!ss.referenceEquals(a8, this) && this.canSee(a8) && this.hasLOS$1(a8.get_row(), a8.get_col())) {
								//check LOS, prevents detected mobs from stopping you
								monsters_visible5 = true;
							}
						}
						if (!monsters_visible5) {
							var can_recover_spells = false;
							if (this.magic_penalty > 0) {
								can_recover_spells = true;
							}
							if (this.get_curhp() < this.get_maxhp() || can_recover_spells) {
								if (this.stunnedThisTurn()) {
									break;
								}
								this.attrs.set_item(78, 1);
								$Forays_Actor.get_b().add('You rest... ');
								this.q1();
							}
							else {
								$Forays_Actor.get_b().add('You don\'t need to rest right now. ');
								this.q0();
							}
						}
						else {
							$Forays_Actor.get_b().add('You can\'t rest while there are enemies around! ');
							this.q0();
						}
					}
					else {
						$Forays_Actor.get_b().add('You find it impossible to rest again on this dungeon level. ');
						this.q0();
					}
					break;
				}
				case '>': {
					if ($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_ttype() === 4) {
						if (this.stunnedThisTurn()) {
							break;
						}
						var can_recover_spells1 = false;
						if (this.magic_penalty > 0) {
							can_recover_spells1 = true;
						}
						if (this.attrs.get_item(78) !== -1 && (this.get_curhp() < this.get_maxhp() || can_recover_spells1)) {
							$Forays_Actor.get_b().displayNow$1('Really take the stairs without resting first?(y/n): ');
							$Forays_Game.console.cursorVisible = true;
							var done1 = false;
							while (!done1) {
								command = $Forays_Game.console.readKey(true);
								switch (command.keyChar) {
									case 121:
									case 89: {
										done1 = true;
										break;
									}
									default: {
										this.q0();
										return true;
									}
								}
							}
						}
						$Forays_Actor.get_b().add('You walk down the stairs. ');
						$Forays_Actor.get_b().printAll();
						if ($Forays_PhysicalObject.get_m().get_current_level() < 20) {
							$Forays_PhysicalObject.get_m().generateLevel();
						}
						else {
							$Forays_PhysicalObject.get_m().generateBossLevel(false);
							$Forays_Actor.get_b().add('You enter a sweltering cavern. ');
							$Forays_Actor.get_b().add('Bones lie scattered across the sulfurous ground. ');
						}
						this.q0();
					}
					else {
						var stairs = null;
						var $t31 = $Forays_PhysicalObject.get_m().allTiles();
						for (var $t32 = 0; $t32 < $t31.length; $t32++) {
							var t6 = $t31[$t32];
							if (t6.get_ttype() === 4 && t6.get_seen()) {
								stairs = t6;
								break;
							}
						}
						if (ss.isValue(stairs)) {
							$Forays_Actor.get_b().displayNow$1('Travel to the stairs?(y/n): ');
							$Forays_Game.console.cursorVisible = true;
							var done2 = false;
							while (!done2) {
								command = $Forays_Game.console.readKey(true);
								switch (command.keyChar) {
									case 121:
									case 89:
									case 62:
									case 13: {
										done2 = true;
										break;
									}
									default: {
										this.q0();
										return true;
									}
								}
							}
							this.findPath$3(stairs, -1, true);
							this.q0();
						}
						else {
							$Forays_Actor.get_b().add('You don\'t see any stairs here. ');
							this.q0();
						}
					}
					break;
				}
				case 'x': {
					this.attrs.set_item(81, this.attrs.get_item(81) + 1);
					this.q0();
					break;
				}
				case 'g':
				case ';': {
					if (ss.isNullOrUndefined(this.tile().get_inv())) {
						if (this.tile().get_ttype() === 5) {
							if (this.stunnedThisTurn()) {
								break;
							}
							this.tile().openChest();
							this.q1();
						}
						else if (this.tile().isShrine()) {
							if (this.stunnedThisTurn()) {
								break;
							}
							switch (this.tile().get_ttype()) {
								case 21: {
									this.increaseSkill(0);
									break;
								}
								case 22: {
									this.increaseSkill(1);
									break;
								}
								case 23: {
									this.increaseSkill(2);
									break;
								}
								case 24: {
									this.increaseSkill(3);
									break;
								}
								case 25: {
									this.increaseSkill(4);
									break;
								}
								case 27: {
									var ls1 = [];
									var sp1 = [];
									var bonus_marked1 = false;
									for (var $t33 = 0; $t33 < $Forays_Actor.spells_in_order.length; $t33++) {
										var spell1 = $Forays_Actor.spells_in_order[$t33];
										if (this.hasSpell(spell1)) {
											var cs1 = new $Forays_colorstring.$ctor2($Forays_Spell.name$1(spell1).padRight(15) + $Forays_Spell.level(spell1).toString().padLeft(3), 2);
											cs1.strings.add(new $Forays_cstr.$ctor1(this.failRate(spell1).toString().padLeft(9) + '%', this.failColor(spell1)));
											if (this.hasFeat(8) && $Forays_Spell.isDamaging(spell1) && !bonus_marked1) {
												bonus_marked1 = true;
												cs1 = $Forays_colorstring.op_Addition(cs1, $Forays_Spell.descriptionWithIncreasedDamage(spell1));
											}
											else {
												cs1 = $Forays_colorstring.op_Addition(cs1, $Forays_Spell.description(spell1));
											}
											ls1.add(cs1);
											sp1.add(spell1);
										}
									}
									if (sp1.length > 0) {
										var topborder1 = new $Forays_colorstring.$ctor2('------------------Level---Fail rate--------Description------------', 2);
										var basefail1 = this.magic_penalty * 5;
										if (!this.hasFeat(5)) {
											basefail1 += $Forays_Armor.addedFailRate(this.armors[0]);
										}
										var bottomborder1 = new $Forays_colorstring.$ctor6('------------Base fail rate: ', 2, basefail1.toString().padLeft(3) + '%', this.failColor$1(basefail1), '----------[', 2, '?', 8, '] for help'.padRight(22, 45), 2);
										var i3 = this.select$6('Trade one of your spells for another? ', topborder1, bottomborder1, ls1, false, false, true, true, 3);
										if (i3 !== -1) {
											var unknown = [];
											var $t34 = $Forays_Actor.getSpellTypes();
											for (var $t35 = 0; $t35 < $t34.length; $t35++) {
												var spell2 = $t34[$t35];
												if (!this.hasSpell(spell2) && spell2 !== 20 && spell2 !== 21 && spell2 !== 22 && spell2 !== 24 && spell2 !== 23) {
													unknown.add(spell2);
												}
											}
											var forgotten = sp1[i3];
											$Forays_Actor.spells_in_order.remove(forgotten);
											this.spells.set_item(forgotten, 0);
											var learned = $Forays_Extensions.random($Forays_SpellType).call(null, unknown);
											this.spells.set_item(learned, 1);
											$Forays_Actor.spells_in_order.add(learned);
											$Forays_Actor.get_b().add('You forget ' + $Forays_Spell.name$1(forgotten) + '. You learn ' + $Forays_Spell.name$1(learned) + '. ');
											this.tile().transformTo(26);
										}
										else {
											this.q0();
										}
									}
									break;
								}
								default: {
									break;
								}
							}
							if (this.tile().get_ttype() !== 27) {
								this.q1();
							}
							if (this.tile().get_ttype() === 23 && $Forays_Actor.spells_in_order.length > 1) {
								this.tile().transformTo(27);
							}
							else if (this.tile().get_ttype() !== 27) {
								this.tile().transformTo(26);
							}
							var $t36 = this.tilesAtDistance(2);
							for (var $t37 = 0; $t37 < $t36.length; $t37++) {
								var t7 = $t36[$t37];
								if (t7.isShrine()) {
									t7.transformTo(26);
								}
							}
						}
						else {
							$Forays_Actor.get_b().add('There\'s nothing here to pick up. ');
							this.q0();
						}
					}
					else {
						if (this.stunnedThisTurn()) {
							break;
						}
						if (this.inventoryCount() < $Forays_Global.maX_INVENTORY_SIZE) {
							if (this.inventoryCount() + this.tile().get_inv().get_quantity() <= $Forays_Global.maX_INVENTORY_SIZE) {
								var i4 = this.tile().get_inv();
								this.tile().set_inv(null);
								if (i4.get_light_radius() > 0) {
									i4.updateRadius(i4.get_light_radius(), 0);
								}
								i4.set_row(-1);
								i4.set_col(-1);
								$Forays_Actor.get_b().add('You pick up ' + i4.theName() + '. ');
								var added1 = false;
								var $t38 = this.get_inv();
								for (var $t39 = 0; $t39 < $t38.length; $t39++) {
									var item1 = $t38[$t39];
									if (item1.get_itype() === i4.get_itype() && !item1.get_do_not_stack() && !i4.get_do_not_stack()) {
										item1.set_quantity(item1.get_quantity() + i4.get_quantity());
										added1 = true;
										break;
									}
								}
								if (!added1) {
									this.get_inv().add(i4);
								}
								this.q1();
							}
							else {
								var space_left = $Forays_Global.maX_INVENTORY_SIZE - this.inventoryCount();
								var i5 = this.tile().get_inv();
								var newitem = new $Forays_Item.$ctor1(i5, this.get_row(), this.get_col());
								newitem.set_quantity(space_left);
								i5.set_quantity(i5.get_quantity() - space_left);
								$Forays_Actor.get_b().add('You pick up ' + newitem.theName() + ', but have no room for the other ' + i5.get_quantity().toString() + '. ');
								var added2 = false;
								var $t40 = this.get_inv();
								for (var $t41 = 0; $t41 < $t40.length; $t41++) {
									var item2 = $t40[$t41];
									if (item2.get_itype() === newitem.get_itype() && !item2.get_do_not_stack() && !newitem.get_do_not_stack()) {
										item2.set_quantity(item2.get_quantity() + newitem.get_quantity());
										added2 = true;
										break;
									}
								}
								if (!added2) {
									this.get_inv().add(newitem);
								}
								this.q1();
							}
						}
						else {
							$Forays_Actor.get_b().add('Your pack is too full to pick up ' + this.tile().get_inv().theName() + '. ');
							this.q0();
						}
					}
					break;
				}
				case 'd': {
					if (this.get_inv().length === 0) {
						$Forays_Actor.get_b().add('You have nothing to drop. ');
						this.q0();
					}
					else {
						var num = -1;
						$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
						var letter1 = 97;
						var line2 = 1;
						var $t42 = this.inventoryList();
						for (var $t43 = 0; $t43 < $t42.length; $t43++) {
							var s2 = $t42[$t43];
							var s21 = '[' + String.fromCharCode(letter1) + '] ' + s2;
							$Forays_Screen.writeMapString$2(line2, 0, s21.padRight($Forays_Actor.$COLS));
							$Forays_Screen.writeMapChar(line2, 1, new $Forays_colorchar.$ctor1(8, letter1));
							letter1++;
							line2++;
						}
						//Screen.WriteMapString(line,0,("".PadRight(25,"-") + "[?] for help").PadRight(COLS,"-"));
						$Forays_Screen.writeMapString$2(line2, 0, ('------Space left: ' + ($Forays_Global.maX_INVENTORY_SIZE - this.inventoryCount()).toString().padRight(7, 45) + '[?] for help').padRight($Forays_Actor.$COLS, 45));
						$Forays_Screen.writeMapChar(line2, 26, new $Forays_colorchar.$ctor2(8, '?'));
						if (line2 < $Forays_Actor.$ROWS) {
							$Forays_Screen.writeMapString$2(line2 + 1, 0, ''.padRight($Forays_Actor.$COLS));
						}
						$Forays_Actor.get_b().displayNow$1('Drop which item? ');
						$Forays_Game.console.cursorVisible = true;
						while (true) {
							command = $Forays_Game.console.readKey(true);
							ch = $Forays_Actor.convertInput(command);
							var ii1 = ch.charCodeAt(0) - 97;
							if (ii1 >= 0 && ii1 < this.inventoryList().length) {
								num = ii1;
								break;
							}
							else if (ch === '?') {
								$Forays_Help.displayHelp$1(4);
								num = -1;
								break;
							}
							break;
						}
						$Forays_PhysicalObject.get_m().redrawWithStrings();
						if (num !== -1) {
							if (this.stunnedThisTurn()) {
								break;
							}
							var i6 = this.get_inv()[num];
							if (i6.get_quantity() <= 1) {
								if (this.tile().get_ttype() === 31) {
									$Forays_Actor.get_b().add('You drop ' + i6.theName() + ' into the healing pool. ');
									this.get_inv().remove(i6);
									if (this.get_curhp() < this.get_maxhp()) {
										$Forays_Actor.get_b().add('The pool glows briefly. ');
										$Forays_Actor.get_b().add('You suddenly feel great again! ');
										$Forays_Actor.get_b().add('The healing pool dries up. ');
										this.set_curhp(this.get_maxhp());
									}
									else {
										$Forays_Actor.get_b().add('The pool glows briefly, then dries up. ');
									}
									this.tile().turnToFloor();
									this.q1();
								}
								else if (this.tile().getItem(i6)) {
									$Forays_Actor.get_b().add('You drop ' + i6.theName() + '. ');
									this.get_inv().remove(i6);
									i6.set_ignored(true);
									this.q1();
								}
								else {
									$Forays_Actor.get_b().add('There is no room. ');
									this.q0();
								}
							}
							else if (this.tile().get_ttype() === 31) {
								var newitem1 = new $Forays_Item.$ctor1(i6, this.get_row(), this.get_col());
								newitem1.set_quantity(1);
								i6.set_quantity(i6.get_quantity() - 1);
								$Forays_Actor.get_b().add('You drop ' + newitem1.theName() + ' into the healing pool. ');
								if (this.get_curhp() < this.get_maxhp()) {
									$Forays_Actor.get_b().add('The pool glows briefly. ');
									$Forays_Actor.get_b().add('You suddenly feel great again! ');
									$Forays_Actor.get_b().add('The healing pool dries up. ');
									this.set_curhp(this.get_maxhp());
								}
								else {
									$Forays_Actor.get_b().add('The pool glows briefly, then dries up. ');
								}
								this.tile().turnToFloor();
								this.q1();
							}
							else {
								$Forays_Actor.get_b().displayNow$1('Drop how many? (1-' + i6.get_quantity() + '): ');
								var count = $Forays_Global.enterInt();
								if (count === 0) {
									this.q0();
								}
								else if (count >= i6.get_quantity() || count === -1) {
									if (this.tile().getItem(i6)) {
										$Forays_Actor.get_b().add('You drop ' + i6.theName() + '. ');
										this.get_inv().remove(i6);
										i6.set_ignored(true);
										this.q1();
									}
									else {
										$Forays_Actor.get_b().add('There is no room. ');
										this.q0();
									}
								}
								else {
									var newitem2 = new $Forays_Item.$ctor1(i6, this.get_row(), this.get_col());
									newitem2.set_quantity(count);
									if (this.tile().getItem(newitem2)) {
										i6.set_quantity(i6.get_quantity() - count);
										$Forays_Actor.get_b().add('You drop ' + newitem2.theName() + '. ');
										newitem2.set_ignored(true);
										this.q1();
									}
									else {
										$Forays_Actor.get_b().add('There is no room. ');
										this.q0();
									}
								}
							}
						}
						else {
							this.q0();
						}
					}
					break;
				}
				case 'i': {
					if (this.get_inv().length === 0) {
						$Forays_Actor.get_b().add('You have nothing in your pack. ');
						this.q0();
					}
					else {
						//					int i = Select("Use which item? ",InventoryList());
						$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
						var letter2 = 97;
						var line3 = 1;
						var $t44 = this.inventoryList();
						for (var $t45 = 0; $t45 < $t44.length; $t45++) {
							var s3 = $t44[$t45];
							var s22 = '[' + String.fromCharCode(letter2) + '] ' + s3;
							$Forays_Screen.writeMapString$2(line3, 0, s22.padRight($Forays_Actor.$COLS));
							$Forays_Screen.writeMapChar(line3, 1, new $Forays_colorchar.$ctor1(8, letter2));
							letter2++;
							line3++;
						}
						$Forays_Screen.writeMapString$2(line3, 0, ('------Space left: ' + ($Forays_Global.maX_INVENTORY_SIZE - this.inventoryCount()).toString().padRight(7, 45) + '[?] for help').padRight($Forays_Actor.$COLS, 45));
						$Forays_Screen.writeMapChar(line3, 26, new $Forays_colorchar.$ctor2(8, '?'));
						if (line3 < $Forays_Actor.$ROWS) {
							$Forays_Screen.writeMapString$2(line3 + 1, 0, ''.padRight($Forays_Actor.$COLS));
						}
						$Forays_Actor.get_b().displayNow$1('In your pack: ');
						$Forays_Game.console.cursorVisible = true;
						command = $Forays_Game.console.readKey(true);
						ch = $Forays_Actor.convertInput(command);
						if (ch === '?') {
							$Forays_Help.displayHelp$1(4);
						}
						$Forays_PhysicalObject.get_m().redrawWithStrings();
						this.q0();
					}
					break;
				}
				case 'a': {
					if (this.get_inv().length === 0) {
						$Forays_Actor.get_b().add('You have nothing in your pack. ');
						this.q0();
					}
					else {
						//					int i = Select("Use which item? ",InventoryList());
						var num1 = -1;
						$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
						var letter3 = 97;
						var line4 = 1;
						var $t46 = this.inventoryList();
						for (var $t47 = 0; $t47 < $t46.length; $t47++) {
							var s4 = $t46[$t47];
							var s23 = '[' + String.fromCharCode(letter3) + '] ' + s4;
							$Forays_Screen.writeMapString$2(line4, 0, s23.padRight($Forays_Actor.$COLS));
							$Forays_Screen.writeMapChar(line4, 1, new $Forays_colorchar.$ctor1(8, letter3));
							letter3++;
							line4++;
						}
						$Forays_Screen.writeMapString$2(line4, 0, ('------Space left: ' + ($Forays_Global.maX_INVENTORY_SIZE - this.inventoryCount()).toString().padRight(7, 45) + '[?] for help').padRight($Forays_Actor.$COLS, 45));
						//Screen.WriteMapString(line,0,("".PadRight(25,"-") + "[?] for help").PadRight(COLS,"-"));
						$Forays_Screen.writeMapChar(line4, 26, new $Forays_colorchar.$ctor2(8, '?'));
						if (line4 < $Forays_Actor.$ROWS) {
							$Forays_Screen.writeMapString$2(line4 + 1, 0, ''.padRight($Forays_Actor.$COLS));
						}
						$Forays_Actor.get_b().displayNow$1('Apply which item? ');
						$Forays_Game.console.cursorVisible = true;
						while (true) {
							command = $Forays_Game.console.readKey(true);
							ch = $Forays_Actor.convertInput(command);
							var ii2 = ch.charCodeAt(0) - 97;
							if (ii2 >= 0 && ii2 < this.inventoryList().length) {
								num1 = ii2;
								break;
							}
							else if (ch === '?') {
								$Forays_Help.displayHelp$1(4);
								num1 = -1;
								break;
							}
							break;
						}
						$Forays_PhysicalObject.get_m().redrawWithStrings();
						//if(i != -1){
						if (num1 !== -1) {
							if (this.stunnedThisTurn()) {
								break;
							}
							//if(inv[i].Use(this)){
							if (this.get_inv()[num1].use(this)) {
								this.q1();
							}
							else {
								this.q0();
							}
						}
						else {
							this.q0();
						}
					}
					break;
				}
				case 'e': {
					var changes = this.displayEquipment();
					var new_weapon = $Forays_Weapon.baseWeapon(changes[0]);
					var new_armor = $Forays_Armor.baseArmor(changes[1]);
					var old_weapon = this.weapons[0];
					var old_armor = this.armors[0];
					var weapon_changed = new_weapon !== $Forays_Weapon.baseWeapon(old_weapon);
					var armor_changed = new_armor !== $Forays_Armor.baseArmor(old_armor);
					var cursed_weapon = false;
					if (weapon_changed && this.hasAttr(39)) {
						cursed_weapon = true;
						weapon_changed = false;
					}
					if (!weapon_changed && !armor_changed) {
						if (cursed_weapon) {
							$Forays_Actor.get_b().add('Your ' + $Forays_Weapon.name$1(this.weapons[0]) + ' is stuck to your hand and can\'t be dropped. ');
						}
						this.q0();
					}
					else {
						if (this.stunnedThisTurn()) {
							break;
						}
						if (weapon_changed) {
							var done3 = false;
							while (!done3) {
								var w = this.weapons[0];
								this.weapons.remove(w);
								this.weapons.insert(this.weapons.length, w);
								if (new_weapon === $Forays_Weapon.baseWeapon(this.weapons[0])) {
									done3 = true;
								}
							}
							if (this.hasFeat(0) && !armor_changed) {
								$Forays_Actor.get_b().add('You quickly ready your ' + $Forays_Weapon.name$1(this.weapons[0]) + '. ');
							}
							else {
								$Forays_Actor.get_b().add('You ready your ' + $Forays_Weapon.name$1(this.weapons[0]) + '. ');
							}
							this.updateOnEquip$2(old_weapon, this.weapons[0]);
						}
						if (armor_changed) {
							var done4 = false;
							while (!done4) {
								var a9 = this.armors[0];
								this.armors.remove(a9);
								this.armors.insert(this.armors.length, a9);
								if (new_armor === $Forays_Armor.baseArmor(this.armors[0])) {
									done4 = true;
								}
							}
							$Forays_Actor.get_b().add('You wear your ' + $Forays_Armor.name$1(this.armors[0]) + '. ');
							this.updateOnEquip(old_armor, this.armors[0]);
						}
						if (cursed_weapon) {
							$Forays_Actor.get_b().add('Your ' + $Forays_Weapon.name$1(this.weapons[0]) + ' is stuck to your hand and can\'t be dropped. ');
						}
						if (this.hasFeat(0) && !armor_changed) {
							this.q0();
						}
						else {
							this.q1();
						}
					}
					break;
				}
				case '!':
				case '@':
				case '#':
				case '$':
				case '%': {
					if (this.hasAttr(39)) {
						$Forays_Actor.get_b().add('Your ' + $Forays_Weapon.name$1(this.weapons[0]) + ' is stuck to your hand and can\'t be dropped. ');
						this.q0();
					}
					else {
						var new_weapon1 = 11;
						switch (ch) {
							case '!': {
								new_weapon1 = 0;
								break;
							}
							case '@': {
								new_weapon1 = 1;
								break;
							}
							case '#': {
								new_weapon1 = 2;
								break;
							}
							case '$': {
								new_weapon1 = 3;
								break;
							}
							case '%': {
								new_weapon1 = 4;
								break;
							}
						}
						var old_weapon1 = this.weapons[0];
						if (new_weapon1 === $Forays_Weapon.baseWeapon(old_weapon1)) {
							this.q0();
						}
						else {
							if (this.stunnedThisTurn()) {
								break;
							}
							var done5 = false;
							while (!done5) {
								var w1 = this.weapons[0];
								this.weapons.remove(w1);
								this.weapons.insert(this.weapons.length, w1);
								if (new_weapon1 === $Forays_Weapon.baseWeapon(this.weapons[0])) {
									done5 = true;
								}
							}
							if (this.hasFeat(0)) {
								$Forays_Actor.get_b().add('You quickly ready your ' + $Forays_Weapon.name$1(this.weapons[0]) + '. ');
								this.q0();
							}
							else {
								$Forays_Actor.get_b().add('You ready your ' + $Forays_Weapon.name$1(this.weapons[0]) + '. ');
								this.q1();
							}
							this.updateOnEquip$2(old_weapon1, this.weapons[0]);
						}
					}
					break;
				}
				case '*':
				case '(':
				case ')': {
					var new_armor1 = 7;
					switch (ch) {
						case '*': {
							new_armor1 = 0;
							break;
						}
						case '(': {
							new_armor1 = 1;
							break;
						}
						case ')': {
							new_armor1 = 2;
							break;
						}
					}
					var old_armor1 = this.armors[0];
					if (new_armor1 === $Forays_Armor.baseArmor(old_armor1)) {
						this.q0();
					}
					else {
						if (this.stunnedThisTurn()) {
							break;
						}
						var done6 = false;
						while (!done6) {
							var a10 = this.armors[0];
							this.armors.remove(a10);
							this.armors.insert(this.armors.length, a10);
							if (new_armor1 === $Forays_Armor.baseArmor(this.armors[0])) {
								done6 = true;
							}
						}
						$Forays_Actor.get_b().add('You wear your ' + $Forays_Armor.name$1(this.armors[0]) + '. ');
						this.q1();
						this.updateOnEquip(old_armor1, this.armors[0]);
					}
					break;
				}
				case 't': {
					if (this.stunnedThisTurn()) {
						break;
					}
					if (this.get_light_radius() === 0) {
						if (this.hasAttr(16)) {
							this.updateRadius$1(this.lightRadius(), $Forays_Global.maX_LIGHT_RADIUS - this.attrs.get_item(46) * 2, true);
						}
						else {
							this.updateRadius$1(this.lightRadius(), 6 - this.attrs.get_item(46), true);
							//normal light radius is 6
						}
						if (!$Forays_PhysicalObject.get_m().get_wiz_dark()) {
							$Forays_Actor.get_b().add('You bring out your torch. ');
						}
						else {
							$Forays_Actor.get_b().add('You bring out your torch, but it gives off no light! ');
						}
					}
					else {
						this.updateRadius$1(this.lightRadius(), 0, true);
						this.updateRadius(0, this.attrs.get_item(31));
						if (!$Forays_PhysicalObject.get_m().get_wiz_lite()) {
							$Forays_Actor.get_b().add('You put away your torch. ');
						}
						else {
							$Forays_Actor.get_b().add('You put away your torch. The air still shines brightly. ');
						}
					}
					this.q1();
					break;
				}
				case '\r': {
					this.getTarget$5(true, -1, true);
					this.q0();
					break;
				}
				case 'p': {
					$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
					var i7 = 1;
					var $t48 = $Forays_Actor.get_b().getMessages();
					for (var $t49 = 0; $t49 < $t48.length; $t49++) {
						var s5 = $t48[$t49];
						$Forays_Screen.writeMapString$2(i7, 0, s5.padRight($Forays_Actor.$COLS));
						++i7;
					}
					$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Actor.$COLS, 45));
					$Forays_Actor.get_b().displayNow$1('Previous messages: ');
					$Forays_Game.console.cursorVisible = true;
					$Forays_Game.console.readKey(true);
					this.q0();
					break;
				}
				case 'c': {
					this.displayCharacterInfo();
					this.q0();
					break;
				}
				case 'O':
				case '=': {
					for (var done7 = false; !done7;) {
						var ls2 = [];
						ls2.add('Use last target when possible'.padRight(58) + ($Forays_Global.option(0) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Automatically pick up items (if safe)'.padRight(58) + ($Forays_Global.option(1) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Hide old messages instead of darkening them'.padRight(58) + ($Forays_Global.option(3) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Hide the command hints on the side'.padRight(58) + ($Forays_Global.option(4) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Cast a spell instead of attacking'.padRight(46) + ((this.get_f()[0] === 24) ? 'no ' : $Forays_Spell.name$1(this.get_f()[0])).padLeft(16));
						ls2.add('Don\'t use roman numerals for automatic naming'.padRight(58) + ($Forays_Global.option(2) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Never show tutorial tips'.padRight(58) + ($Forays_Global.option(5) ? 'yes ' : 'no ').padLeft(4));
						ls2.add('Reset tutorial tips before each game'.padRight(58) + ($Forays_Global.option(6) ? 'yes ' : 'no ').padLeft(4));
						this.select$3('Options: ', ls2, true, false, false);
						$Forays_Game.console.cursorVisible = true;
						ch = $Forays_Actor.convertInput($Forays_Game.console.readKey(true));
						switch (ch) {
							case 'a': {
								$Forays_Global.options[0] = !$Forays_Global.option(0);
								break;
							}
							case 'b': {
								$Forays_Global.options[1] = !$Forays_Global.option(1);
								break;
							}
							case 'c': {
								$Forays_Global.options[3] = !$Forays_Global.option(3);
								break;
							}
							case 'd': {
								$Forays_Global.options[4] = !$Forays_Global.option(4);
								break;
							}
							case 'e': {
								if (this.skills.get_item(2) > 0) {
									$Forays_PhysicalObject.get_m().redrawWithStrings();
									var list = [];
									var sp2 = [];
									var bonus_marked2 = false;
									for (var $t50 = 0; $t50 < $Forays_Actor.spells_in_order.length; $t50++) {
										var spell3 = $Forays_Actor.spells_in_order[$t50];
										if (this.hasSpell(spell3)) {
											var cs2 = new $Forays_colorstring.$ctor2($Forays_Spell.name$1(spell3).padRight(15) + $Forays_Spell.level(spell3).toString().padLeft(3), 2);
											cs2.strings.add(new $Forays_cstr.$ctor1(this.failRate(spell3).toString().padLeft(9) + '%', this.failColor(spell3)));
											if (this.hasFeat(8) && $Forays_Spell.isDamaging(spell3) && !bonus_marked2) {
												bonus_marked2 = true;
												cs2 = $Forays_colorstring.op_Addition(cs2, $Forays_Spell.descriptionWithIncreasedDamage(spell3));
											}
											else {
												cs2 = $Forays_colorstring.op_Addition(cs2, $Forays_Spell.description(spell3));
											}
											list.add(cs2);
											sp2.add(spell3);
										}
									}
									if (sp2.length > 0) {
										var topborder2 = new $Forays_colorstring.$ctor2('------------------Level---Fail rate--------Description------------', 2);
										var basefail2 = this.magic_penalty * 5;
										if (!this.hasFeat(5)) {
											basefail2 += $Forays_Armor.addedFailRate(this.armors[0]);
										}
										var bottomborder2 = new $Forays_colorstring.$ctor4('------------Base fail rate: ', 2, basefail2.toString().padLeft(3) + '%', this.failColor$1(basefail2), ''.padRight(37, 45), 2);
										var i8 = this.select$6('Automatically cast which spell? ', topborder2, bottomborder2, list, false, false, false, false, 0);
										if (i8 !== -1) {
											this.get_f()[0] = sp2[i8];
										}
										else {
											this.get_f()[0] = 24;
										}
									}
								}
								break;
							}
							case 'f': {
								$Forays_Global.options[2] = !$Forays_Global.option(2);
								break;
							}
							case 'g': {
								$Forays_Global.options[5] = !$Forays_Global.option(5);
								break;
							}
							case 'h': {
								$Forays_Global.options[6] = !$Forays_Global.option(6);
								break;
							}
							case '':
							case ' ':
							case '\r': {
								done7 = true;
								break;
							}
							default: {
								break;
							}
						}
					}
					this.q0();
					break;
				}
				case '?':
				case '/': {
					$Forays_Help.displayHelp();
					this.q0();
					break;
				}
				case '-': {
					$Forays_Game.console.cursorVisible = false;
					var commandhelp = $Forays_Help.helpText(5);
					commandhelp.removeRange(0, 2);
					$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
					for (var i9 = 0; i9 < 20; ++i9) {
						$Forays_Screen.writeMapString$2(i9 + 1, 0, commandhelp[i9].padRight($Forays_Actor.$COLS));
					}
					$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Actor.$COLS, 45));
					$Forays_Actor.get_b().displayNow$1('Commands: ');
					$Forays_Game.console.cursorVisible = true;
					$Forays_Game.console.readKey(true);
					this.q0();
					break;
				}
				case 'q': {
					var ls3 = [];
					ls3.add('Save your progress and exit to main menu');
					ls3.add('Save your progress and quit game');
					ls3.add('Abandon character and exit to main menu');
					ls3.add('Abandon character and quit game');
					ls3.add('Quit game immediately - don\'t save anything');
					ls3.add('Continue playing');
					$Forays_Game.console.cursorVisible = true;
					switch (this.select('Quit? ', ls3)) {
						case 0: {
							$Forays_Global.saveGame($Forays_Actor.get_b(), $Forays_PhysicalObject.get_m(), $Forays_Actor.get_q());
							$Forays_Global.gamE_OVER = true;
							$Forays_Global.SAVING = true;
							break;
						}
						case 1: {
							$Forays_Global.saveGame($Forays_Actor.get_b(), $Forays_PhysicalObject.get_m(), $Forays_Actor.get_q());
							$Forays_Global.gamE_OVER = true;
							$Forays_Global.QUITTING = true;
							$Forays_Global.SAVING = true;
							break;
						}
						case 2: {
							$Forays_Global.gamE_OVER = true;
							$Forays_Global.killeD_BY = 'giving up';
							break;
						}
						case 3: {
							$Forays_Global.gamE_OVER = true;
							$Forays_Global.QUITTING = true;
							$Forays_Global.killeD_BY = 'giving up';
							break;
						}
						case 4: {
							$Forays_Global.quit();
							break;
						}
						case 5:
						default: {
							break;
						}
					}
					this.q0();
					break;
				}
				case '~': {
					if (false) {
						var l = [];
						l.add('Throw a prismatic orb');
						l.add('create chests');
						l.add('Create a poison gas vent');
						l.add('create fog');
						l.add('Forget the map');
						l.add('Heal to full');
						l.add('Become invulnerable');
						l.add('get items!');
						l.add('Spawn a monster');
						l.add('Use a rune of passage');
						l.add('See the entire level');
						l.add('Generate new level');
						l.add('Gain all skills and feats');
						l.add('Spawn shrines');
						l.add('create trap');
						l.add('create door');
						l.add('spawn lots of goblins and lose neck snap');
						l.add('remove all enemies, spawn boss');
						l.add('detect monsters forever');
						l.add('trigger floor collapse');
						switch (this.select('Activate which cheat? ', l)) {
							case 0: {
								(new $Forays_Item.$ctor2(13, 'prismatic orb', '*', 1)).use(this);
								this.q1();
								break;
							}
							case 1: {
								var $t51 = this.tilesWithinDistance(3);
								for (var $t52 = 0; $t52 < $t51.length; $t52++) {
									var t8 = $t51[$t52];
									t8.transformTo(5);
								}
								this.q0();
								//Screen.AnimateExplosion(this,5,new colorchar(Color.RandomIce,"*"),25);
								//Q1();
								break;
							}
							case 2: {
								var line5 = this.getTarget$4(-1, -1);
								if (ss.isValue(line5)) {
									var t9 = $Forays_Extensions.last($Forays_Tile).call(null, line5);
									//if(t != null && t.inv == null){
									//Item.Create(Item.RandomItem(),t.row,t.col);
									//t.inv.do_not_stack = true;
									//Q.Add(new Event(t.inv,new List<Tile>{t},100,Forays.EventType.MIMIC,AttrType.NO_ATTR,0,""));
									//}
									if (ss.isValue(t9)) {
										//t.TransformTo(TileType.FIRE_GEYSER);
										//int frequency = Global.Roll(21) + 4; //5-25
										//int variance = Global.Roll(10) - 1; //0-9
										//int variance_amount = (frequency * variance) / 10;
										//int number_of_values = variance_amount*2 + 1;
										//int minimum_value = frequency - variance_amount;
										//if(minimum_value < 5){
										//int diff = 5 - minimum_value;
										//number_of_values -= diff;
										//minimum_value = 5;
										//}
										//int delay = ((minimum_value - 1) + Global.Roll(number_of_values)) * 100;
										//Q.Add(new Event(t,delay + 200,EventType.FIRE_GEYSER,(frequency*10)+variance)); //notice the hacky way the value is stored
										//Q.Add(new Event(t,delay,EventType.FIRE_GEYSER_ERUPTION,2));
										t9.transformTo(33);
										$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(t9, 100, 15));
									}
								}
								this.q0();
								break;
							}
							case 3: {
								//ConsoleKeyInfo command2 = Game.Console.ReadKey(true);
								//Game.Console.Write(command2.Key);
								var line6 = this.getTarget$4(-1, -1);
								if (ss.isValue(line6)) {
									var t10 = $Forays_Extensions.last($Forays_Tile).call(null, line6);
									if (ss.isValue(t10)) {
										t10.addOpaqueFeature(5);
									}
								}
								this.q0();
								break;
							}
							case 4: {
								$Forays_Game.console.cursorVisible = false;
								var cch;
								cch.c = ' ';
								cch.color = 0;
								cch.bgcolor = 0;
								var $t53 = $Forays_PhysicalObject.get_m().allTiles();
								for (var $t54 = 0; $t54 < $t53.length; $t54++) {
									var t11 = $t53[$t54];
									t11.set_seen(false);
									$Forays_Screen.writeMapChar(t11.get_row(), t11.get_col(), cch);
								}
								$Forays_Game.console.cursorVisible = true;
								this.q0();
								break;
							}
							case 5: {
								this.set_curhp(this.get_maxhp());
								this.q0();
								break;
							}
							case 6: {
								if (!this.hasAttr(103)) {
									this.attrs.set_item(103, this.attrs.get_item(103) + 1);
									$Forays_Actor.get_b().add('On. ');
								}
								else {
									this.attrs.set_item(103, 0);
									$Forays_Actor.get_b().add('Off. ');
								}
								this.q0();
								break;
							}
							case 7: {
								for (var i10 = 0; i10 < 50; ++i10) {
									$Forays_Item.create($Forays_Item.randomItem(), this);
								}
								this.q0();
								break;
							}
							case 8: {
								$Forays_PhysicalObject.get_m().spawnMob$1(19);
								this.q1();
								break;
							}
							case 9: {
								(new $Forays_Item.$ctor2(7, 'rune of passage', '&', 1)).use(this);
								this.q1();
								break;
							}
							case 10: {
								var $t55 = $Forays_PhysicalObject.get_m().allTiles();
								for (var $t56 = 0; $t56 < $t55.length; $t56++) {
									var t12 = $t55[$t56];
									t12.set_seen(true);
								}
								$Forays_PhysicalObject.get_m().draw();
								var $t57 = $Forays_PhysicalObject.get_m().allActors();
								for (var $t58 = 0; $t58 < $t57.length; $t58++) {
									var a11 = $t57[$t58];
									$Forays_Screen.writeMapChar(a11.get_row(), a11.get_col(), new $Forays_colorchar.$ctor6(a11.get_color(), 0, a11.get_symbol()));
								}
								$Forays_Game.console.readKey(true);
								this.q0();
								break;
							}
							case 11: {
								$Forays_PhysicalObject.get_m().generateLevel();
								this.q0();
								break;
							}
							case 12: {
								//Tile t = GetTarget();
								//if(t != null){
								//TileType oldtype = t.type;
								//t.TransformTo(TileType.GRENADE);
								//t.toggles_into = oldtype;
								//t.passable = Tile.Prototype(oldtype).passable;
								//t.opaque = Tile.Prototype(oldtype).opaque;
								//switch(oldtype){
								//case TileType.FLOOR:
								//t.the_name = "the grenade on the floor";
								//t.a_name = "a grenade on a floor";
								//break;
								//case TileType.STAIRS:
								//t.the_name = "the grenade on the stairway";
								//t.a_name = "a grenade on a stairway";
								//break;
								//case TileType.DOOR_O:
								//t.the_name = "the grenade in the open door";
								//t.a_name = "a grenade in an open door";
								//break;
								//default:
								//t.the_name = "the grenade and " + Tile.Prototype(oldtype).the_name;
								//t.a_name = "a grenade and " + Tile.Prototype(oldtype).a_name;
								//break;
								//}
								//Q.Add(new Event(t,100,EventType.GRENADE));
								//}
								this.set_level(10);
								this.skills.set_item(0, 10);
								this.skills.set_item(1, 10);
								this.skills.set_item(2, 10);
								this.skills.set_item(3, 10);
								this.skills.set_item(4, 10);
								var $t59 = this.getFeatTypes();
								for (var $t60 = 0; $t60 < $t59.length; $t60++) {
									var f = $t59[$t60];
									if (f !== 21 && f !== 20) {
										this.feats.set_item(f, 1);
									}
								}
								this.q0();
								$Forays_Actor.get_b().add('"I HAVE THE POWERRRR!" ');
								break;
							}
							case 13: {
								//LevelUp();
								var $t61 = this.tilesWithinDistance(2);
								for (var $t62 = 0; $t62 < $t61.length; $t62++) {
									var t13 = $t61[$t62];
									t13.transformTo($Forays_Global.roll(5) + 20);
								}
								this.q0();
								break;
							}
							case 14: {
								var $t63 = this.tilesAtDistance(1);
								for (var $t64 = 0; $t64 < $t63.length; $t64++) {
									var t14 = $t63[$t64];
									t14.transformTo($Forays_Tile.randomTrap());
								}
								this.q0();
								break;
							}
							case 15: {
								var line7 = this.getTarget$4(-1, -1);
								if (ss.isValue(line7)) {
									var t15 = $Forays_Extensions.last($Forays_Tile).call(null, line7);
									if (ss.isValue(t15)) {
										t15.transformTo(2);
									}
								}
								this.q0();
								break;
							}
							case 16: {
								for (var i11 = 0; i11 < 100; ++i11) {
									$Forays_PhysicalObject.get_m().spawnMob$1(3);
								}
								if (this.hasFeat(18)) {
									this.feats.set_item(18, 0);
								}
								this.q0();
								break;
							}
							case 17: {
								var $t65 = $Forays_PhysicalObject.get_m().allActors();
								for (var $t66 = 0; $t66 < $t65.length; $t66++) {
									var a12 = $t65[$t66];
									if (!ss.referenceEquals(a12, this)) {
										$Forays_Actor.get_q().killEvents$1(a12, 0);
										$Forays_PhysicalObject.get_m().removeTargets(a12);
										$Forays_PhysicalObject.get_m().actor.set_item$1(a12.p, null);
									}
								}
								var $t67 = $Forays_PhysicalObject.get_m().allTiles();
								for (var $t68 = 0; $t68 < $t67.length; $t68++) {
									var t16 = $t67[$t68];
									if (t16.get_passable() && ss.isNullOrUndefined(t16.actor())) {
										$Forays_Actor.create$1(2, t16.get_row(), t16.get_col(), true, false);
										break;
									}
								}
								this.q0();
								break;
							}
							case 18: {
								if (this.attrs.get_item(40) === 0) {
									this.attrs.set_item(40, 1);
								}
								else {
									this.attrs.set_item(40, 0);
								}
								this.q0();
								break;
							}
							case 19: {
								var line8 = this.getTarget$4(-1, -1);
								if (ss.isValue(line8)) {
									var t17 = $Forays_Extensions.last($Forays_Tile).call(null, line8);
									if (ss.isValue(t17)) {
										t17.toggle$1(null, 35);
										$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(t17, 100, 22));
										$Forays_Actor.get_b().add('The floor begins to collapse! ');
									}
								}
								this.q0();
								break;
							}
							default: {
								this.q0();
								break;
							}
						}
					}
					else {
						this.q0();
					}
					break;
				}
				case ' ': {
					this.q0();
					break;
				}
				default: {
					$Forays_Actor.get_b().add('Press \'?\' for help. ');
					this.q0();
					break;
				}
			}
			if (ch !== 'x') {
				this.attrs.set_item(81, 0);
			}
			$Forays_PhysicalObject.get_m().draw();
			return false;
		},
		getFeatTypes: function() {
			return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
		},
		playerWalk: function(dir) {
			if (dir > 0) {
				if (ss.isValue(this.actorInDirection(dir))) {
					if (!this.actorInDirection(dir).isHiddenFrom(this)) {
						if (this.get_f()[0] === 24) {
							this.attack(0, this.actorInDirection(dir));
						}
						else if (true !== this.castSpell$1(this.get_f()[0], this.tileInDirection(dir))) {
							this.q0();
						}
					}
					else {
						this.actorInDirection(dir).attrs.set_item(77, -1);
						var $t1 = this.actorInDirection(dir).attrs;
						$t1.set_item(14, $t1.get_item(14) + 1);
						if (!this.isHiddenFrom(this.actorInDirection(dir))) {
							$Forays_Actor.get_b().add('You walk straight into ' + this.actorInDirection(dir).aVisible() + '! ');
						}
						else {
							$Forays_Actor.get_b().add('You walk straight into ' + this.actorInDirection(dir).aVisible() + '! ');
							if (this.canSee(this.actorInDirection(dir))) {
								$Forays_Actor.get_b().add(this.actorInDirection(dir).get_the_name() + ' looks just as surprised as you. ');
							}
							this.actorInDirection(dir).player_visibility_duration = -1;
							var $t2 = this.actorInDirection(dir).attrs;
							$t2.set_item(15, $t2.get_item(15) + 1);
						}
						this.q1();
					}
				}
				else if (this.tileInDirection(dir).get_passable()) {
					if (this.grabPreventsMovement(this.tileInDirection(dir))) {
						var grabbers = [];
						var $t3 = this.actorsAtDistance(1);
						for (var $t4 = 0; $t4 < $t3.length; $t4++) {
							var a = $t3[$t4];
							if (a.attrs.get_item(97) === a.directionOf(this)) {
								grabbers.add(a);
							}
						}
						$Forays_Actor.get_b().add($Forays_Extensions.random($Forays_Actor).call(null, grabbers).get_the_name() + ' prevents you from moving away! ');
						this.q0();
						return true;
					}
					if (this.tileInDirection(dir).get_ttype() === 4) {
						if (!$Forays_Global.option(4)) {
							$Forays_Actor.get_b().add('There are stairs here - press > to descend. ');
						}
						else {
							$Forays_Actor.get_b().add('There are stairs here. ');
						}
					}
					if (this.tileInDirection(dir).isShrine()) {
						$Forays_Actor.get_b().add(this.tileInDirection(dir).get_the_name() + ' glows faintly - press g to touch it. ');
					}
					if (this.tileInDirection(dir).is$1(5)) {
						$Forays_Actor.get_b().add('There is a chest here - press g to open it. ');
					}
					if (this.tileInDirection(dir).is$1(31)) {
						$Forays_Actor.get_b().add('There is a healing pool here. ');
						$Forays_Help.tutorialTip(9);
					}
					if (this.tileInDirection(dir).is$1(35) && !this.hasAttr(10)) {
						this.interrupt();
						$Forays_Actor.get_b().displayNow$1('Jump into the chasm?(y/n): ');
						$Forays_Game.console.cursorVisible = true;
						var done = false;
						while (!done) {
							switch ($Forays_Game.console.readKey(true).keyChar) {
								case 121:
								case 89: {
									done = true;
									break;
								}
								default: {
									this.q0();
									return true;
								}
							}
						}
					}
					if (ss.isValue(this.tileInDirection(dir).get_inv())) {
						$Forays_Actor.get_b().add('You see ' + this.tileInDirection(dir).get_inv().aName() + '. ');
					}
					this.move(this.tileInDirection(dir).get_row(), this.tileInDirection(dir).get_col());
					this.QS();
					if (!$Forays_Help.displayed.get_item(5) && !this.hasAttr(29) && !this.hasAttr(31) && !this.hasAttr(32) && this.get_curhp() % 10 > 0 && this.get_curhp() % 10 <= 5 && !$Forays_Extensions.any($Forays_Actor).call(null, $Forays_PhysicalObject.get_m().allActors(), Function.mkdel(this, function(a1) {
						return !ss.referenceEquals(a1, this) && this.canSee(a1);
					})) && !$Forays_Extensions.any($Forays_Tile).call(null, this.tilesWithinDistance(1), function(t) {
						return t.is(9) || t.is(10) || t.is(0) || t.is(6) || t.is(3) || t.is$1(29);
					})) {
						$Forays_Help.tutorialTip(5);
						//not poisoned or on fire, can recover at least 5hp, can't see any enemies, and isn't adjacent to hazardous terrain
						this.interrupt();
					}
				}
				else if (this.tileInDirection(dir).get_ttype() === 3 || this.tileInDirection(dir).get_ttype() === 28) {
					if (this.stunnedThisTurn()) {
						return true;
					}
					this.tileInDirection(dir).toggle(this);
					this.q1();
				}
				else {
					$Forays_Actor.get_b().add('There is ' + this.tileInDirection(dir).get_a_name() + ' in the way. ');
					this.q0();
				}
			}
			else {
				this.q0();
			}
			return false;
		},
		inputAI: function() {
			var no_act = false;
			if (this.canSee($Forays_Actor.get_player())) {
				if (ss.isNullOrUndefined(this.target_location) && this.hasAttr(41)) {
					//orc warmages etc. when they first notice
					this.player_visibility_duration = -1;
					this.set_target($Forays_Actor.get_player());
					this.target_location = $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col());
					if (($Forays_Actor.get_player().isWithinSightRangeOf(this) || this.tile().isLit()) && $Forays_Actor.get_player().hasLOS(this)) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + '\'s gaze meets your eyes! ', this);
						if (this.distanceFrom($Forays_Actor.get_player()) <= 6) {
							$Forays_Actor.get_player().makeNoise();
						}
					}
					$Forays_Actor.get_b().add$1(this.get_the_name() + ' snarls loudly. ', this);
					this.q1();
					no_act = true;
				}
				else {
					this.set_target($Forays_Actor.get_player());
					this.target_location = $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col());
					this.player_visibility_duration = -1;
				}
			}
			else if ((this.isWithinSightRangeOf$1($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col()) || $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col()).isLit()) && this.hasLOS$1($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col()) && (!$Forays_Actor.get_player().hasAttr(13) || this.hasAttr(15) || $Forays_Actor.get_player().tile().isLit() || this.hasAttr(8))) {
				var multiplier = (this.hasAttr(7) ? 5 : 10);
				//animals etc. are approximately twice as hard to sneak past
				if ($Forays_Actor.get_player().stealth() * this.distanceFrom($Forays_Actor.get_player()) * multiplier - this.player_visibility_duration++ * 5 < $Forays_Global.roll$1(1, 100)) {
					this.player_visibility_duration = -1;
					this.attrs.set_item(15, this.attrs.get_item(15) + 1);
					this.set_target($Forays_Actor.get_player());
					this.target_location = $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col());
					if (ss.isValue(this.group)) {
						for (var $t1 = 0; $t1 < this.group.length; $t1++) {
							var a = this.group[$t1];
							if (!ss.referenceEquals(a, this) && this.distanceFrom(a) < 3) {
								a.player_visibility_duration = -1;
								a.attrs.set_item(15, a.attrs.get_item(15) + 1);
								a.set_target($Forays_Actor.get_player());
								a.target_location = $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col());
							}
						}
					}
					switch (this.get_atype()) {
						case 1:
						case 19: {
							$Forays_Actor.get_b().add(this.theVisible() + ' squeaks at you. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 3:
						case 14:
						case 15: {
							$Forays_Actor.get_b().add(this.theVisible() + ' growls. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 7: {
							if (!$Forays_PhysicalObject.get_m().get_wiz_lite() && !$Forays_PhysicalObject.get_m().get_wiz_dark() && $Forays_Actor.get_player().lightRadius() > 0) {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' notices your light. ', this);
							}
							break;
						}
						case 13:
						case 20: {
							$Forays_Actor.get_b().add(this.theVisible() + ' yells. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 18: {
							$Forays_Actor.get_b().add(this.theVisible() + ' moans. Uhhhhhhghhh. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 5: {
							$Forays_Actor.get_b().add(this.theVisible() + ' snarls at you. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 11: {
							$Forays_Actor.get_b().add(this.theVisible() + ' makes a chittering sound. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 8:
						case 30:
						case 33: {
							$Forays_Actor.get_b().add(this.theVisible() + ' shouts. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 22: {
							$Forays_Actor.get_b().add(this.theVisible() + ' shrieks. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 23: {
							$Forays_Actor.get_b().add(this.theVisible() + ' howls. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 25: {
							$Forays_Actor.get_b().add(this.theVisible() + ' starts babbling incoherently. ');
							break;
						}
						case 27: {
							$Forays_Actor.get_b().add(this.theVisible() + ' cackles. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 28: {
							$Forays_Actor.get_b().add(this.theVisible() + ' squeaks. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 38: {
							$Forays_Actor.get_b().add(this.theVisible() + ' bellows at you. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 21: {
							$Forays_Actor.get_b().add(this.theVisible() + ' hisses faintly. ');
							break;
						}
						case 39:
						case 48: {
							$Forays_Actor.get_b().add(this.theVisible() + ' snarls loudly. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 36: {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' stares at you for a moment. ', this);
							break;
						}
						case 43: {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' starts moving. ', this);
							break;
						}
						case 50: {
							$Forays_Actor.get_b().add(this.theVisible() + ' starts chanting in low tones. ');
							break;
						}
						case 31:
						case 46: {
							$Forays_Actor.get_b().add(this.theVisible() + ' growls viciously. ');
							$Forays_Actor.get_player().makeNoise();
							break;
						}
						case 10:
						case 16:
						case 54:
						case 37:
						case 55:
						case 49: {
							break;
						}
						default: {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' notices you. ', this);
							break;
						}
					}
					this.q1();
					no_act = true;
				}
			}
			else if (this.player_visibility_duration >= 0) {
				//if they hadn't seen the player yet...
				this.player_visibility_duration = 0;
			}
			else if (ss.isNullOrUndefined(this.target_location) && this.player_visibility_duration-- === -(10 + this.attrs.get_item(90) * 40)) {
				if (this.attrs.get_item(90) < 2) {
					//they'll forget the player after 10 turns the first time and
					this.attrs.set_item(90, this.attrs.get_item(90) + 1);
					//50 turns the second time, but that's the limit
					this.player_visibility_duration = 0;
					this.set_target(null);
				}
			}
			if (this.get_atype() === 37 && this.tile().isLit()) {
				$Forays_Actor.get_b().add$1('The marble horror reverts to its statue form. ', this);
				this.set_atype(55);
				this.setName('marble horror statue');
				this.attrs.set_item(12, 1);
				this.attrs.set_item(103, 1);
				this.attrs.set_item(64, 1);
			}
			if (this.get_atype() === 55 && !this.tile().isLit()) {
				$Forays_Actor.get_b().add$1('The marble horror animates once more. ', this);
				this.set_atype(37);
				this.setName('marble horror');
				this.attrs.set_item(12, 0);
				this.attrs.set_item(103, 0);
				this.attrs.set_item(64, 0);
			}
			if (this.get_atype() === 28 && ss.isValue(this.group) && ss.isValue(this.get_target())) {
				if (!$Forays_Extensions.any($Forays_Actor).call(null, this.group, function(a1) {
					return a1.get_curhp() < a1.get_maxhp();
				}) && this.get_target().get_curhp() >= 20 && !this.get_target().hasAttr(37) && !this.get_target().hasAttr(28) && !this.get_target().hasAttr(86)) {
					this.set_target(null);
					this.target_location = null;
				}
			}
			if (!no_act && this.get_atype() !== 13 && this.get_atype() !== 52 && this.get_atype() !== 7 && this.get_atype() !== 54 && this.get_atype() !== 53 && this.get_atype() !== 18 && this.get_atype() !== 10) {
				if (this.hasAttr(6)) {
					if (this.hasAttr(32) && $Forays_Global.oneIn(10)) {
						this.attrs.set_item(32, 0);
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' stops the flames from spreading. ', this);
						this.q1();
						no_act = true;
					}
					else if (this.hasAttr(31)) {
						if (this.attrs.get_item(31) === 1 && $Forays_Global.oneIn(4)) {
							var update = false;
							var oldradius = this.lightRadius();
							if (this.attrs.get_item(31) > this.get_light_radius()) {
								update = true;
							}
							this.attrs.set_item(31, 0);
							if (update) {
								this.updateRadius(oldradius, this.lightRadius());
							}
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out the fire. ', this);
							this.q1();
							no_act = true;
						}
						else if (this.attrs.get_item(31) > 1 && $Forays_Global.roll(10) <= 8) {
							var update1 = false;
							var oldradius1 = this.lightRadius();
							if (this.attrs.get_item(31) > this.get_light_radius()) {
								update1 = true;
							}
							var i = 2;
							if ($Forays_Global.roll$1(1, 3) === 3) {
								// 1 in 3 times, no progress against the fire
								i = 1;
							}
							this.attrs.set_item(31, this.attrs.get_item(31) - i);
							if (this.attrs.get_item(31) < 0) {
								this.attrs.set_item(31, 0);
							}
							if (update1) {
								this.updateRadius(oldradius1, this.lightRadius());
							}
							if (this.hasAttr(31)) {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out some of the fire. ', this);
							}
							else {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out the fire. ', this);
							}
							this.q1();
							no_act = true;
						}
						else if (this.attrs.get_item(31) > 2 && $Forays_Global.roll(2) + this.attrs.get_item(31) >= 5) {
							if (this.hasAttr(5)) {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' runs around with arms flailing. ', this);
							}
							else {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' flails about. ', this);
							}
							this.aI_Step(this.tileInDirection($Forays_Global.randomDirection()));
							this.q1();
							no_act = true;
						}
						else {
							var update2 = false;
							var oldradius2 = this.lightRadius();
							if (this.attrs.get_item(31) > this.get_light_radius()) {
								update2 = true;
							}
							var i1 = 2;
							if ($Forays_Global.roll$1(1, 3) === 3) {
								// 1 in 3 times, no progress against the fire
								i1 = 1;
							}
							this.attrs.set_item(31, this.attrs.get_item(31) - i1);
							if (this.attrs.get_item(31) < 0) {
								this.attrs.set_item(31, 0);
							}
							if (update2) {
								this.updateRadius(oldradius2, this.lightRadius());
							}
							if (this.hasAttr(31)) {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out some of the fire. ', this);
							}
							else {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out the fire. ', this);
							}
							this.q1();
							no_act = true;
						}
					}
				}
				else if (this.hasAttr(32) && $Forays_Global.coinFlip()) {
					this.attrs.set_item(32, 0);
					if (this.get_atype() === 21) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' reforms itself to stop the flames. ', this);
					}
					else if (this.get_atype() === 22 || this.get_atype() === 32) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' stops the flames from spreading. ', this);
					}
					else {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' rolls on the ground to stop the flames. ', this);
					}
					this.q1();
					no_act = true;
				}
				else if (this.hasAttr(31) && $Forays_Global.roll(3) >= 2) {
					var update3 = false;
					var oldradius3 = this.lightRadius();
					if (this.attrs.get_item(31) > this.get_light_radius()) {
						update3 = true;
					}
					var i2 = 2;
					if ($Forays_Global.roll$1(1, 3) === 3) {
						// 1 in 3 times, no progress against the fire
						i2 = 1;
					}
					this.attrs.set_item(31, this.attrs.get_item(31) - i2);
					if (this.attrs.get_item(31) < 0) {
						this.attrs.set_item(31, 0);
					}
					if (update3) {
						this.updateRadius(oldradius3, this.lightRadius());
					}
					if (this.hasAttr(31)) {
						if (this.get_atype() === 21) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' reforms itself to put out some of the fire. ', this);
						}
						else if (this.get_atype() === 22) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out some of the fire. ', this);
						}
						else {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' rolls on the ground to put out some of the fire. ', this);
						}
					}
					else if (this.get_atype() === 21) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' reforms itself to put out the fire. ', this);
					}
					else if (this.get_atype() === 22) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' puts out the fire. ', this);
					}
					else {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' rolls on the ground to put out the fire. ', this);
					}
					this.q1();
					no_act = true;
				}
			}
			if (this.tile().is(3) || this.tile().is(6) || this.hasAttr(43) && this.tile().isLit()) {
				var dangerous_terrain = [];
				var dangerous_terrain_here = false;
				if (this.hasAttr(43) && ss.isNullOrUndefined(this.get_target())) {
					//ignore this if the vampire sees the player already
					var $t2 = this.tilesWithinDistance(1);
					for (var $t3 = 0; $t3 < $t2.length; $t3++) {
						var t = $t2[$t3];
						if (t.isLit() && t.get_passable()) {
							dangerous_terrain.add(t);
							if (ss.referenceEquals(t, this.tile())) {
								dangerous_terrain_here = true;
							}
						}
					}
				}
				if (!this.hasAttr(64) && !this.hasAttr(103) && !this.hasAttr(61)) {
					if (this.get_atype() !== 18 && this.get_atype() !== 52 && this.get_atype() !== 6 && this.get_atype() !== 34 && this.get_atype() !== 13 && this.get_atype() !== 24 && this.get_atype() !== 37 && this.get_atype() !== 47) {
						var $t4 = this.tilesWithinDistance(1);
						for (var $t5 = 0; $t5 < $t4.length; $t5++) {
							var t1 = $t4[$t5];
							if (t1.is(3)) {
								$Forays_Extensions.addUnique($Forays_Tile).call(null, dangerous_terrain, t1);
								if (ss.referenceEquals(t1, this.tile())) {
									dangerous_terrain_here = true;
								}
							}
						}
					}
				}
				if (!this.hasAttr(67) && !this.hasAttr(1) && !this.hasAttr(2)) {
					if (this.get_atype() !== 13 && this.get_atype() !== 24 && this.get_atype() !== 47) {
						var $t6 = this.tilesWithinDistance(1);
						for (var $t7 = 0; $t7 < $t6.length; $t7++) {
							var t2 = $t6[$t7];
							if (t2.is(6)) {
								$Forays_Extensions.addUnique($Forays_Tile).call(null, dangerous_terrain, t2);
								if (ss.referenceEquals(t2, this.tile())) {
									dangerous_terrain_here = true;
								}
							}
						}
					}
				}
				if (dangerous_terrain_here) {
					//if(target == null || DistanceFrom(target) > 1 || Global.CoinFlip()){
					//}
					var safe = [];
					var $t8 = this.tilesAtDistance(1);
					for (var $t9 = 0; $t9 < $t8.length; $t9++) {
						var t3 = $t8[$t9];
						if (t3.get_passable() && ss.isNullOrUndefined(t3.actor()) && !dangerous_terrain.contains(t3)) {
							safe.add(t3);
						}
					}
					if (safe.length > 0) {
						if (this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, safe))) {
							this.QS();
							no_act = true;
						}
					}
				}
			}
			if (this.get_atype() === 47 && !this.hasAttr(69)) {
				this.attrs.set_item(76, 1);
				//if the knight was off balance, it regains its shield here.
			}
			if (ss.isValue(this.group) && this.group.length === 0) {
				//this shouldn't happen, but does. this stops it from crashing.
				this.group = null;
			}
			if (!no_act) {
				if (ss.isValue(this.get_target())) {
					if (this.canSee(this.get_target())) {
						this.activeAI();
					}
					else {
						this.seekAI();
					}
				}
				else {
					this.idleAI();
				}
			}
			if (this.get_atype() === 9) {
				if (this.hasAttr(70)) {
					if (this.tile().isLit()) {
						this.attrs.set_item(70, 5);
					}
					else {
						this.attrs.set_item(70, this.attrs.get_item(70) - 1);
					}
				}
				else if (this.tile().isLit()) {
					$Forays_Actor.get_b().add$1(this.get_the_name() + ' is blinded by the light! ', this);
					this.attrs.set_item(69, this.attrs.get_item(69) + 1);
					this.attrs.set_item(70, 5);
					$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(this, ($Forays_Global.roll(2) + 4) * 100, 69, this.get_the_name() + ' is no longer blinded. ', [this]));
				}
			}
			if (this.get_atype() === 21) {
				this.calculateDimming();
			}
		},
		activeAI: function() {
			if (this.path.length > 0) {
				this.path.clear();
			}
			switch (this.get_atype()) {
				case 4:
				case 62: {
					if (this.distanceFrom(this.get_target()) === 1) {
						var idx = $Forays_Global.roll$1(1, 2) - 1;
						this.attack(idx, this.get_target());
						if ($Forays_Global.coinFlip()) {
							//chance of retreating
							this.aI_Step$1(this.get_target(), true);
						}
					}
					else if ($Forays_Global.coinFlip()) {
						this.aI_Step(this.get_target());
						this.QS();
					}
					else {
						this.aI_Step(this.tileInDirection($Forays_Global.randomDirection()));
						//could also have RandomGoodDirection, but it
						this.QS();
						//would be part of Actor or Map
					}
					break;
				}
				case 7: {
					var brightest = null;
					if (!$Forays_PhysicalObject.get_m().get_wiz_lite() && !$Forays_PhysicalObject.get_m().get_wiz_dark()) {
						var current_brightest = [];
						var $t1 = $Forays_PhysicalObject.get_m().allTiles();
						for (var $t2 = 0; $t2 < $t1.length; $t2++) {
							var t = $t1[$t2];
							var pos_radius = t.get_light_radius();
							var pos_obj = t;
							if (ss.isValue(t.get_inv()) && t.get_inv().get_light_radius() > pos_radius) {
								pos_radius = t.get_inv().get_light_radius();
								pos_obj = t.get_inv();
							}
							if (ss.isValue(t.actor()) && t.actor().lightRadius() > pos_radius) {
								pos_radius = t.actor().lightRadius();
								pos_obj = t.actor();
							}
							if (pos_radius > 0) {
								if (current_brightest.length === 0 && this.canSee(t)) {
									current_brightest.add(pos_obj);
								}
								else {
									for (var $t3 = 0; $t3 < current_brightest.length; $t3++) {
										var o = current_brightest[$t3];
										if (pos_radius > o.get_light_radius()) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) < this.distanceFrom(o)) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) === this.distanceFrom(o) && ss.referenceEquals(pos_obj, $Forays_Actor.get_player())) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
									}
								}
							}
						}
						if (current_brightest.length > 0) {
							brightest = $Forays_Extensions.random($Forays_PhysicalObject).call(null, current_brightest);
						}
					}
					if (ss.isValue(brightest)) {
						if (this.distanceFrom(brightest) <= 1) {
							if (ss.referenceEquals(brightest, this.get_target())) {
								this.attack(0, this.get_target());
								if (ss.referenceEquals(this.get_target(), $Forays_Actor.get_player()) && $Forays_Actor.get_player().get_curhp() > 0) {
									$Forays_Help.tutorialTip(2);
								}
							}
							else {
								var open = [];
								var $t4 = this.tilesAtDistance(1);
								for (var $t5 = 0; $t5 < $t4.length; $t5++) {
									var t1 = $t4[$t5];
									if (t1.distanceFrom(brightest) <= 1 && t1.get_passable() && ss.isNullOrUndefined(t1.actor())) {
										open.add(t1);
									}
								}
								if (open.length > 0) {
									this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, open));
								}
								this.QS();
							}
						}
						else {
							this.aI_Step(brightest);
							this.QS();
						}
					}
					else {
						var dir = $Forays_Global.randomDirection();
						if ($Forays_Extensions.where($Forays_Tile).call(null, this.tilesAtDistance(1), function(t2) {
							return !t2.get_passable();
						}).length > 4 && !this.tileInDirection(dir).get_passable()) {
							dir = $Forays_Global.randomDirection();
						}
						if (this.tileInDirection(dir).get_passable() && ss.isNullOrUndefined(this.actorInDirection(dir))) {
							this.aI_Step(this.tileInDirection(dir));
							this.QS();
						}
						else if (this.get_curhp() < this.get_maxhp() && ss.referenceEquals(this.actorInDirection(dir), this.get_target())) {
							this.attack(0, this.get_target());
						}
						else {
							if ($Forays_Actor.get_player().hasLOS(this.tileInDirection(dir))) {
								if (!this.tileInDirection(dir).get_passable()) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.tileInDirection(dir).get_the_name() + '. ', this);
								}
								else if (ss.isValue(this.actorInDirection(dir))) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.actorInDirection(dir).theVisible() + '. ', this);
								}
							}
							this.QS();
						}
					}
					break;
				}
				case 8:
				case 63: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
						if (!this.hasAttr(69)) {
							$Forays_Actor.get_b().add$1(this.you('adopt') + ' a more aggressive stance. ', this);
							this.attrs.set_item(98, this.attrs.get_item(98) + 5);
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 9: {
					if (this.hasAttr(69)) {
						var dir1 = $Forays_Global.randomDirection();
						if (!this.tileInDirection(dir1).get_passable()) {
							$Forays_Actor.get_b().add$1(this.you('stagger') + ' into ' + this.tileInDirection(dir1).get_the_name() + '. ', this);
						}
						else if (ss.isValue(this.actorInDirection(dir1))) {
							$Forays_Actor.get_b().add$2(this.youVisible('stagger') + ' into ' + this.actorInDirection(dir1).theVisible() + '. ', [this, this.actorInDirection(dir1)]);
						}
						else if (this.grabPreventsMovement(this.tileInDirection(dir1))) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' staggers and almost falls over. ', this);
						}
						else {
							$Forays_Actor.get_b().add$1(this.you('stagger') + '. ', this);
							this.move(this.tileInDirection(dir1).get_row(), this.tileInDirection(dir1).get_col());
						}
						this.QS();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 10:
				case 54: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
						if (ss.referenceEquals(this.get_target(), $Forays_Actor.get_player()) && $Forays_Actor.get_player().get_curhp() > 0) {
							$Forays_Help.tutorialTip(6);
						}
					}
					else {
						this.QS();
					}
					break;
				}
				case 11: {
					if (this.distanceFrom(this.get_target()) === 1) {
						if (!this.hasAttr(70)) {
							//burst attack cooldown
							this.attrs.set_item(70, this.attrs.get_item(70) + 1);
							var cooldown = 100 * ($Forays_Global.roll$1(1, 3) + 8);
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, cooldown, 70));
							this.animateExplosion(this, 1, 17, '*');
							this.attack(2, this.get_target());
						}
						else if ($Forays_Global.coinFlip()) {
							this.attack(0, this.get_target());
						}
						else if (this.aI_Step$1(this.get_target(), true)) {
							this.QS();
						}
						else {
							this.attack(0, this.get_target());
						}
					}
					else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target()) && !this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 6) {
						var cooldown1 = $Forays_Global.roll$1(1, 4);
						if (cooldown1 !== 1) {
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							cooldown1 *= 100;
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, cooldown1, 69));
						}
						this.animateBoltProjectile(this.get_target(), 17);
						this.attack(1, this.get_target());
					}
					else {
						if (!this.hasAttr(70)) {
							this.aI_Step(this.get_target());
						}
						else {
							this.aI_Sidestep(this.get_target());
							//message for this? hmm.
						}
						this.QS();
					}
					break;
				}
				case 12: {
					if (this.distanceFrom(this.get_target()) === 1) {
						if (this.get_curhp() <= 18 && !this.hasAttr(69)) {
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							var openspaces = [];
							var $t6 = this.get_target().tilesAtDistance(1);
							for (var $t7 = 0; $t7 < $t6.length; $t7++) {
								var t3 = $t6[$t7];
								if (t3.get_passable() && ss.isNullOrUndefined(t3.actor())) {
									openspaces.add(t3);
								}
							}
							for (var $t8 = 0; $t8 < openspaces.length; $t8++) {
								var t4 = openspaces[$t8];
								if (ss.isNullOrUndefined(this.group)) {
									var $t9 = [];
									$t9.add(this);
									this.group = $t9;
								}
								$Forays_Actor.create$1(53, t4.get_row(), t4.get_col(), true, true);
								t4.actor().player_visibility_duration = -1;
								this.group.add($Forays_PhysicalObject.get_m().actor.get_item(t4.get_row(), t4.get_col()));
								$Forays_PhysicalObject.get_m().actor.get_item(t4.get_row(), t4.get_col()).group = this.group;
								$Forays_Extensions.randomize($Forays_Actor).call(null, this.group);
							}
							openspaces.add(this.tile());
							var newtile = openspaces[$Forays_Global.roll(openspaces.length) - 1];
							if (!ss.referenceEquals(newtile, this.tile())) {
								this.move$1(newtile.get_row(), newtile.get_col(), false);
							}
							if (openspaces.length > 1) {
								$Forays_Actor.get_b().add(this.get_the_name() + ' is suddenly standing all around ' + this.get_target().get_the_name() + '. ');
								this.q1();
							}
							else {
								this.attack(0, this.get_target());
							}
						}
						else {
							this.attack(0, this.get_target());
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 13: {
					if (this.get_curhp() <= 10 && !this.hasAttr(69)) {
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						var invocation;
						switch ($Forays_Global.roll(4)) {
							case 1: {
								invocation = 'ae vatra kersai';
								break;
							}
							case 2: {
								invocation = 'kersai dzaggath';
								break;
							}
							case 3: {
								invocation = 'od fir od bahgal';
								break;
							}
							case 4: {
								invocation = 'denei kersai nammat';
								break;
							}
							default: {
								invocation = 'gubed gubed gubed';
								break;
							}
						}
						if ($Forays_Global.coinFlip()) {
							$Forays_Actor.get_b().add$1(this.you('whisper') + ' \'' + invocation + '\'. ', this);
						}
						else {
							$Forays_Actor.get_b().add$1(this.you('scream') + ' \'' + invocation.toUpperCase() + '\'. ', this);
						}
						$Forays_Actor.get_b().add$1('Flames erupt from ' + this.get_the_name() + '. ', this);
						if (this.lightRadius() < 2) {
							this.updateRadius(this.lightRadius(), 2);
						}
						this.attrs.set_item(31, Math.max(this.attrs.get_item(31), 2));
						var $t10 = this.actorsAtDistance(1);
						for (var $t11 = 0; $t11 < $t10.length; $t11++) {
							var a = $t10[$t11];
							if (!a.hasAttr(61) && !a.hasAttr(64) && !a.hasAttr(31) && !a.hasAttr(32) && !a.hasAttr(33)) {
								if (a.get_name() === 'you') {
									$Forays_Actor.get_b().add('You start to catch fire! ');
								}
								else {
									$Forays_Actor.get_b().add$1(a.get_the_name() + ' starts to catch fire. ', a);
								}
								a.attrs.set_item(32, 1);
							}
						}
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 14:
				case 64: {
					switch (this.distanceFrom(this.get_target())) {
						case 1: {
							if (this.get_target().enemiesAdjacent() > 1) {
								this.attack(0, this.get_target());
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.attack(0, this.get_target());
							}
							break;
						}
						case 2: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.fireArrow(this.get_target());
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								if (this.aI_Sidestep(this.get_target())) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' tries to line up a shot. ', this);
								}
								this.QS();
							}
							break;
						}
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.fireArrow(this.get_target());
							}
							else {
								if (this.aI_Sidestep(this.get_target())) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' tries to line up a shot. ', this);
								}
								this.QS();
							}
							break;
						}
						default: {
							this.aI_Step(this.get_target());
							this.QS();
							break;
						}
					}
					break;
				}
				case 15: {
					var $t12 = this.actorsWithinDistance(2);
					for (var $t13 = 0; $t13 < $t12.length; $t13++) {
						var a1 = $t12[$t13];
						if (a1.hasAttr(75) && a1.hasLOE(this)) {
							if (this.distanceFrom(this.get_target()) === 1) {
								this.attack(0, this.get_target());
							}
							else {
								this.aI_Step(this.get_target());
								this.QS();
							}
							return;
						}
					}
					var valid_spells = [];
					valid_spells.add(2);
					valid_spells.add(1);
					if (this.get_target().hasAttr(31) || this.get_target().hasAttr(32)) {
						valid_spells.remove(1);
					}
					var close_spells = Enumerable.from(valid_spells).toArray();
					valid_spells.add(5);
					//SpellType[] all_spells = valid_spells.ToArray();
					valid_spells.remove(2);
					var ranged_spells = Enumerable.from(valid_spells).toArray();
					switch (this.distanceFrom(this.get_target())) {
						case 1: {
							if (this.get_target().enemiesAdjacent() > 1 || $Forays_Global.coinFlip()) {
								this.castRandomSpell(this.get_target(), close_spells);
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.castRandomSpell(this.get_target(), close_spells);
							}
							break;
						}
						case 2: {
							if ($Forays_Global.coinFlip()) {
								if (this.aI_Step$1(this.get_target(), true)) {
									this.QS();
								}
								else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
									this.castRandomSpell(this.get_target(), ranged_spells);
								}
								else {
									this.aI_Sidestep(this.get_target());
									this.QS();
								}
							}
							else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.castRandomSpell(this.get_target(), ranged_spells);
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.aI_Sidestep(this.get_target());
								this.QS();
							}
							break;
						}
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						case 12: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.castRandomSpell(this.get_target(), ranged_spells);
							}
							else {
								this.aI_Sidestep(this.get_target());
								this.QS();
							}
							break;
						}
						default: {
							this.aI_Step(this.get_target());
							this.QS();
							break;
						}
					}
					break;
				}
				case 17: {
					if (!this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 3) {
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						this.animateProjectile(this.get_target(), 13, '%');
						if (this.get_target().canSee(this)) {
							$Forays_Actor.get_b().add$3(this.get_the_name() + ' throws a bola at ' + this.get_target().get_the_name() + '. ', this, this.get_target());
						}
						else {
							$Forays_Actor.get_b().add$3('A bola whirls toward ' + this.get_target().get_the_name() + '. ', this, this.get_target());
						}
						this.attrs.set_item(77, -1);
						var $t14 = this.get_target().attrs;
						$t14.set_item(35, $t14.get_item(35) + 1);
						var $t15 = this.get_target();
						$t15.set_speed($t15.get_speed() + 100);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(this.get_target(), ($Forays_Global.roll(3) + 5) * 100, 35, this.get_target().youAre() + ' no longer slowed. ', [this.get_target()]));
						$Forays_Actor.get_b().add$1(this.get_target().youAre() + ' slowed by the bola. ', this.get_target());
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 18:
				case 57: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(1, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						if (this.distanceFrom(this.get_target()) === 1) {
							this.attack(0, this.get_target());
						}
						else {
							this.QS();
						}
					}
					break;
				}
				case 20: {
					var $t16 = this.actorsWithinDistance(2);
					for (var $t17 = 0; $t17 < $t16.length; $t17++) {
						var a2 = $t16[$t17];
						if (a2.hasAttr(75) && a2.hasLOE(this)) {
							if (this.distanceFrom(this.get_target()) === 1) {
								this.attack(0, this.get_target());
							}
							else {
								this.aI_Step(this.get_target());
								this.QS();
							}
							return;
						}
					}
					switch (this.distanceFrom(this.get_target())) {
						case 1: {
							if (this.hasAttr(71)) {
								this.attack(0, this.get_target());
							}
							else if (this.get_curhp() <= 13) {
								this.castSpell(21);
							}
							else if (this.get_curhp() < this.get_maxhp()) {
								if (this.hasAttr(72)) {
									this.castSpell(20);
								}
								else {
									this.castRandomSpell(null, [22, 20]);
								}
							}
							else {
								this.castSpell(20);
							}
							break;
						}
						case 2: {
							if (this.get_curhp() <= 20) {
								this.castSpell(21);
							}
							else if (this.hasAttr(71)) {
								if (this.aI_Step(this.get_target())) {
									this.QS();
								}
								else {
									this.aI_Sidestep(this.get_target());
									this.QS();
								}
							}
							else if ($Forays_Global.roll$1(1, 3) === 3) {
								this.castSpell(20);
							}
							else if (this.aI_Step(this.get_target())) {
								this.QS();
							}
							else if (this.aI_Sidestep(this.get_target())) {
								this.QS();
							}
							else {
								this.castSpell(20);
							}
							break;
						}
						default: {
							if (this.get_curhp() <= 26) {
								this.castSpell(21);
							}
							else if (this.get_curhp() < this.get_maxhp()) {
								if (this.hasAttr(72)) {
									if (this.aI_Step(this.get_target())) {
										this.QS();
									}
									else if (this.aI_Sidestep(this.get_target())) {
										this.QS();
									}
									else {
										this.castSpell(20);
									}
								}
								else if ($Forays_Global.coinFlip()) {
									this.castSpell(22);
								}
								else if (this.aI_Step(this.get_target())) {
									this.QS();
								}
								else if (this.aI_Sidestep(this.get_target())) {
									this.QS();
								}
								else {
									this.castSpell(20);
								}
							}
							else if (this.aI_Step(this.get_target())) {
								this.QS();
							}
							else if (this.aI_Sidestep(this.get_target())) {
								this.QS();
							}
							else {
								this.castSpell(20);
							}
							break;
						}
					}
					break;
				}
				case 22: {
					if (!this.hasAttr(69)) {
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, ($Forays_Global.roll(5) + 5) * 100, 69));
						if ($Forays_Actor.get_player().canSee(this)) {
							$Forays_Actor.get_b().add$1(this.you('scream') + '. ', this);
						}
						else if (this.distanceFrom($Forays_Actor.get_player()) <= 12) {
							$Forays_Actor.get_b().add('You hear a scream! ');
						}
						else {
							$Forays_Actor.get_b().add('You hear a distant scream! ');
						}
						var i = 1;
						var a3;
						var targets = [];
						for (var done = false; !done; ++i) {
							a3 = this.firstActorInLine$2(this.get_target(), i);
							if (ss.isValue(a3) && !a3.hasAttr(1) && !a3.hasAttr(2) && !a3.hasAttr(3)) {
								targets.add(a3);
							}
							if (ss.referenceEquals(a3, this.get_target())) {
								done = true;
							}
							if (i > 100) {
								$Forays_Actor.get_b().add$1(this.get_target().you('resist') + ' the scream. ', this.get_target());
								this.q1();
								return;
							}
						}
						for (var $t18 = 0; $t18 < targets.length; $t18++) {
							var actor = targets[$t18];
							if (actor.takeDamage$2(9, 1, $Forays_Global.roll(6), this, 'a banshee\'s scream')) {
								actor.attrs.set_item(34, actor.attrs.get_item(34) + 1);
								$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(actor, actor.durationOfMagicalEffect($Forays_Global.roll(3) + 2) * 100, 34));
							}
						}
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 24: {
					var action = 0;
					if (this.distanceFrom(this.get_target()) === 1) {
						if ($Forays_Global.coinFlip()) {
							action = 2;
							//disappear
						}
						else if ($Forays_Global.coinFlip()) {
							this.attack(0, this.get_target());
						}
						else {
							action = 1;
							//blink
						}
					}
					else if ($Forays_Global.coinFlip()) {
						//teleport next to target and attack
						var tilelist = [];
						for (var dir2 = 1; dir2 <= 9; ++dir2) {
							if (dir2 !== 5) {
								if (this.get_target().tileInDirection(dir2).get_passable() && ss.isNullOrUndefined(this.get_target().actorInDirection(dir2))) {
									tilelist.add(this.get_target().tileInDirection(dir2));
								}
							}
						}
						if (tilelist.length > 0) {
							var t5 = tilelist[$Forays_Global.roll$1(1, tilelist.length) - 1];
							this.move(t5.get_row(), t5.get_col());
							this.attack(0, this.get_target());
						}
						else {
							action = 2;
							//disappear
						}
					}
					else if ($Forays_Global.coinFlip()) {
						action = 1;
						//blink
					}
					else {
						action = 2;
						//disappear
					}
					switch (action) {
						case 1: {
							for (var i1 = 0; i1 < 9999; ++i1) {
								var a4 = $Forays_Global.roll$1(1, 17) - 9;
								//-8 to 8
								var b = $Forays_Global.roll$1(1, 17) - 9;
								if (Math.abs(a4) + Math.abs(b) >= 6) {
									a4 += this.get_row();
									b += this.get_col();
									if ($Forays_PhysicalObject.get_m().boundsCheck(a4, b)) {
										if ($Forays_PhysicalObject.get_m().tile.get_item(a4, b).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(a4, b))) {
											this.move(a4, b);
											break;
										}
									}
								}
							}
							this.QS();
							break;
						}
						case 2: {
							var valid_tiles = Array.multidim(Boolean.getDefaultValue(), $Forays_Actor.$ROWS, $Forays_Actor.$COLS);
							for (var i2 = 0; i2 < $Forays_Actor.$ROWS; ++i2) {
								for (var j = 0; j < $Forays_Actor.$COLS; ++j) {
									if ($Forays_PhysicalObject.get_m().tile.get_item(i2, j).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(i2, j)) && !this.get_target().canSee$1(i2, j)) {
										valid_tiles.set(i2, j, true);
									}
									else {
										valid_tiles.set(i2, j, false);
									}
								}
							}
							var tilelist1 = [];
							var found = false;
							for (var distance = 1; distance < $Forays_Actor.$COLS && !found; ++distance) {
								for (var i3 = this.get_row() - distance; i3 <= this.get_row() + distance; ++i3) {
									for (var j1 = this.get_col() - distance; j1 <= this.get_col() + distance; ++j1) {
										if ($Forays_PhysicalObject.get_m().boundsCheck(i3, j1) && valid_tiles.get(i3, j1) && this.distanceFrom$2(i3, j1) === distance) {
											found = true;
											tilelist1.add($Forays_PhysicalObject.get_m().tile.get_item(i3, j1));
										}
									}
								}
							}
							if (found) {
								var t6 = tilelist1[$Forays_Global.roll$1(1, tilelist1.length) - 1];
								this.move(t6.get_row(), t6.get_col());
							}
							this.QS();
							break;
						}
						default: {
							break;
						}
					}
					break;
				}
				case 25: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack($Forays_Global.roll(3) - 1, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 26: {
					if (this.get_inv().length === 0) {
						if (this.distanceFrom(this.get_target()) === 1) {
							var target_r = this.get_target().get_row();
							var target_c = this.get_target().get_col();
							if (this.attack(0, this.get_target()) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(target_r, target_c)) && $Forays_Extensions.any($Forays_Item).call(null, this.get_target().get_inv(), function(i4) {
								return !i4.get_do_not_stack();
							})) {
								var item = $Forays_Extensions.random($Forays_Item).call(null, $Forays_Extensions.where($Forays_Item).call(null, this.get_target().get_inv(), function(i5) {
									return !i5.get_do_not_stack();
								}));
								if (item.get_quantity() > 1) {
									this.get_inv().add(new $Forays_Item.$ctor1(item, -1, -1));
									item.set_quantity(item.get_quantity() - 1);
								}
								else {
									this.get_inv().add(item);
									this.get_target().get_inv().remove(item);
								}
								$Forays_Actor.get_b().add$3(this.youVisible('steal') + ' ' + this.get_target().yourVisible() + ' ' + item.name() + '! ', this, this.get_target());
							}
						}
						else {
							this.aI_Step(this.get_target());
							this.QS();
						}
					}
					else {
						var line = this.get_target().getBestExtendedLineOfEffect(this);
						var next = null;
						var found1 = false;
						for (var $t19 = 0; $t19 < line.length; $t19++) {
							var t7 = line[$t19];
							if (found1) {
								next = t7;
								break;
							}
							else if (ss.referenceEquals(t7.actor(), this)) {
								found1 = true;
							}
						}
						if (ss.isValue(next)) {
							if (next.get_passable() && ss.isNullOrUndefined(next.actor()) && this.aI_Step(next)) {
								this.QS();
							}
							else if (!next.get_passable()) {
								$Forays_Actor.get_b().add$1(this.get_the_name() + ' disappears into ' + next.get_the_name() + '. ', this);
								var $t20 = this.tilesWithinDistance(1);
								for (var $t21 = 0; $t21 < $t20.length; $t21++) {
									var t8 = $t20[$t21];
									if (t8.distanceFrom(next) === 1 && t8.get_name() === 'floor') {
										t8.features.add(7);
									}
								}
								var e = null;
								var $t22 = $Forays_Actor.get_q().list;
								for (var $t23 = 0; $t23 < $t22.length; $t23++) {
									var e2 = $t22[$t23];
									if (ss.referenceEquals(e2.get_target(), this) && e2.get_evtype() === 5) {
										e = e2;
										break;
									}
								}
								e.set_target(this.get_inv()[0]);
								$Forays_Actor.tiebreakers[e.get_tiebreaker()] = null;
								this.get_inv().clear();
								this.takeDamage$1(0, 2, 9999, null);
							}
							else if (ss.isValue(next.actor())) {
								if (!next.actor().hasAttr(12)) {
									this.move(next.get_row(), next.get_col());
									this.QS();
								}
								else if (next.actor().hasAttr(12)) {
									if (this.aI_Step(next)) {
										this.QS();
									}
									else if (this.distanceFrom(this.get_target()) === 1) {
										this.attack(1, this.get_target());
									}
									else {
										this.QS();
									}
								}
							}
							else {
								this.QS();
							}
						}
					}
					break;
				}
				case 27: {
					if (this.get_curhp() < this.get_maxhp() && !this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 12) {
						$Forays_Actor.get_b().add(this.get_the_name() + ' curses you! ');
						switch ($Forays_Global.roll(4)) {
							case 1: {
								$Forays_Actor.get_b().add('You become allergic to light! ');
								this.get_target().gainAttrRefreshDuration$1(43, 10000, 'You are no longer allergic to light. ', []);
								break;
							}
							case 2: {
								$Forays_Actor.get_b().add('The floor suddenly looks like a wonderful spot for a nap. ');
								this.get_target().gainAttrRefreshDuration$1(36, 10000, 'You are no longer quite so drowsy. ', []);
								break;
							}
							case 3: {
								$Forays_Actor.get_b().add('Every sound you make becomes amplified and echoes across the dungeon. ');
								this.get_target().gainAttrRefreshDuration$1(38, 10000, 'Your sounds are no longer amplified. ', []);
								break;
							}
							case 4: {
								$Forays_Actor.get_b().add('Your ' + $Forays_Weapon.name$1(this.get_target().weapons[0]) + ' becomes stuck to your hand! ');
								this.get_target().gainAttrRefreshDuration$1(39, 10000, 'Your ' + $Forays_Weapon.name$1(this.get_target().weapons[0]) + ' is no longer stuck to your hand. ', []);
								break;
							}
						}
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 28: {
					if (this.distanceFrom(this.get_target()) === 1) {
						var target_pos = this.get_target().p;
						if (this.attack(0, this.get_target()) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item$1(target_pos)) && ss.referenceEquals(this.get_target(), $Forays_Actor.get_player()) && !this.get_target().hasAttr(103) && !this.get_target().hasAttr(73) && !this.get_target().hasAttr(67)) {
							var first_bite = !this.get_target().hasAttr(92);
							this.get_target().gainAttrRefreshDuration$1(92, 5000, 'You no longer feel the effects of the poison. ', []);
							if (this.get_target().attrs.get_item(92) >= this.get_target().get_curhp()) {
								if (!this.get_target().hasAttr(94)) {
									$Forays_Actor.get_b().add('The poison is overwhelming you! ');
									$Forays_Actor.get_b().add('You\'re falling asleep. ');
									$Forays_Actor.get_b().add('You\'ll surely be eaten... ');
									$Forays_Actor.get_b().printAll();
									var $t24 = this.get_target().attrs;
									$t24.set_item(94, $t24.get_item(94) + 1);
								}
							}
							else if (this.get_target().attrs.get_item(92) >= ss.Int32.div(this.get_target().get_curhp(), 2) && !this.get_target().hasAttr(93)) {
								this.get_target().gainAttrRefreshDuration(93, 5000);
								$Forays_Actor.get_b().add('You feel the subtle poison starting to take effect. ');
								$Forays_Actor.get_b().add('Your injuries make it hard to stay awake. ');
								$Forays_Actor.get_b().printAll();
							}
							else if (first_bite) {
								$Forays_Actor.get_b().add('The compy\'s bite makes you momentarily fatigued. ');
								$Forays_Actor.get_b().add('You shake off the effects. ');
							}
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 29: {
					if (!this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 12) {
						$Forays_Actor.get_b().add(this.theVisible() + ' breathes poisonous gas. ');
						var area = [];
						var $t25 = this.get_target().tilesWithinDistance(1);
						for (var $t26 = 0; $t26 < $t25.length; $t26++) {
							var t9 = $t25[$t26];
							if (t9.get_passable() && this.get_target().hasLOE(t9) && !t9.is(6)) {
								t9.features.add(6);
								area.add(t9);
							}
						}
						var current = this.get_target().tile();
						var num = 8;
						for (var i6 = 0; i6 < num; ++i6) {
							//i should make this gas placement bit into a method
							if (!current.is(6)) {
								current.features.add(6);
								area.add(current);
							}
							else {
								for (var tries = 0; tries < 50; ++tries) {
									var open1 = [];
									var $t27 = current.tilesAtDistance(1);
									for (var $t28 = 0; $t28 < $t27.length; $t28++) {
										var t10 = $t27[$t28];
										if (t10.get_passable()) {
											open1.add(t10);
										}
									}
									if (open1.length > 0) {
										var possible = $Forays_Extensions.random($Forays_Tile).call(null, open1);
										if (!possible.is(6)) {
											possible.features.add(6);
											area.add(possible);
											break;
										}
										else {
											current = possible;
										}
									}
									else {
										break;
									}
								}
							}
						}
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor6(area, 600, 16));
						this.gainAttr(69, ($Forays_Global.roll(6) + 18) * 100);
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 30: {
					if (this.hasAttr(70)) {
						var dir3 = this.attrs.get_item(70);
						var cw = $Forays_Global.coinFlip();
						if (this.tileInDirection(dir3).get_passable() && ss.isNullOrUndefined(this.actorInDirection(dir3)) && !this.grabPreventsMovement(this.tileInDirection(dir3))) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' leaps forward swinging his axe! ', this);
							this.move(this.tileInDirection(dir3).get_row(), this.tileInDirection(dir3).get_col());
							var a5 = this.actorInDirection(this.rotateDirection(dir3, cw));
							if (ss.isValue(a5)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a5.get_the_name() + '. ', this, a5);
								a5.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							a5 = this.actorInDirection(dir3);
							if (ss.isValue(a5)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a5.get_the_name() + '. ', this, a5);
								a5.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							a5 = this.actorInDirection(this.rotateDirection(dir3, !cw));
							if (ss.isValue(a5)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a5.get_the_name() + '. ', this, a5);
								a5.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							this.q1();
						}
						else if (ss.isValue(this.actorInDirection(dir3)) || this.grabPreventsMovement(this.tileInDirection(dir3))) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' swings his axe furiously! ', this);
							var a6 = this.actorInDirection(this.rotateDirection(dir3, cw));
							if (ss.isValue(a6)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a6.get_the_name() + '. ', this, a6);
								a6.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							a6 = this.actorInDirection(dir3);
							if (ss.isValue(a6)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a6.get_the_name() + '. ', this, a6);
								a6.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							a6 = this.actorInDirection(this.rotateDirection(dir3, !cw));
							if (ss.isValue(a6)) {
								$Forays_Actor.get_b().add$3(this.your() + ' axe hits ' + a6.get_the_name() + '. ', this, a6);
								a6.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), this, 'a berserker\'s axe');
							}
							this.q1();
						}
						else {
							$Forays_Actor.get_b().add$3(this.get_the_name() + ' turns to face ' + this.get_target().get_the_name() + '. ', this, this.get_target());
							this.attrs.set_item(70, this.directionOf(this.get_target()));
							this.q1();
						}
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
						if (ss.isValue(this.get_target()) && $Forays_Global.roll(3) === 3) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' screams with fury! ', this);
							this.attrs.set_item(70, this.directionOf(this.get_target()));
							$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(this, 350, 70, this.your() + ' rage diminishes. ', [this]));
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 32: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else if (this.distanceFrom(this.get_target()) <= 12) {
						if (this.tile().isLit() && !this.hasAttr(69)) {
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' gestures. ', this);
							var tiles = [];
							var $t29 = this.get_target().tilesWithinDistance(6);
							for (var $t30 = 0; $t30 < $t29.length; $t30++) {
								var t11 = $t29[$t30];
								if (t11.get_passable() && ss.isNullOrUndefined(t11.actor()) && this.distanceFrom(t11) >= this.distanceFrom(this.get_target()) && this.get_target().hasLOS(t11) && this.get_target().hasLOE(t11)) {
									tiles.add(t11);
								}
							}
							if (tiles.length === 0) {
								var $t31 = this.get_target().tilesWithinDistance(6);
								for (var $t32 = 0; $t32 < $t31.length; $t32++) {
									var t12 = $t31[$t32];
									//same, but with no distance requirement
									if (t12.get_passable() && ss.isNullOrUndefined(t12.actor()) && this.get_target().hasLOS(t12) && this.get_target().hasLOE(t12)) {
										tiles.add(t12);
									}
								}
							}
							if (tiles.length === 0) {
								$Forays_Actor.get_b().add$1('Nothing happens. ', this);
							}
							else {
								if (tiles.length === 1) {
									$Forays_Actor.get_b().add('A blood moth appears! ');
								}
								else {
									$Forays_Actor.get_b().add('Blood moths appear! ');
								}
								for (var i7 = 0; i7 < 2; ++i7) {
									if (tiles.length > 0) {
										var t13 = $Forays_Extensions.removeRandom($Forays_Tile).call(null, tiles);
										$Forays_Actor.create$1(7, t13.get_row(), t13.get_col(), true, true);
										$Forays_PhysicalObject.get_m().actor.get_item(t13.get_row(), t13.get_col()).player_visibility_duration = -1;
									}
								}
							}
							this.q1();
						}
						else {
							this.aI_Step(this.get_target());
							this.QS();
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 35: {
					var count = 0;
					var walls = 0;
					var $t33 = this.get_target().tilesAtDistance(1);
					for (var $t34 = 0; $t34 < $t33.length; $t34++) {
						var t14 = $t33[$t34];
						if (t14.get_ttype() === 0) {
							++walls;
							if (ss.isNullOrUndefined(t14.actor())) {
								++count;
							}
						}
					}
					if (this.distanceFrom(this.get_target()) <= 12 && count >= 2 || count === 1 && walls === 1) {
						var $t35 = this.get_target().tilesAtDistance(1);
						for (var $t36 = 0; $t36 < $t35.length; $t36++) {
							var t15 = $t35[$t36];
							if (t15.get_ttype() === 0 && ss.isNullOrUndefined(t15.actor())) {
								$Forays_Actor.create$1(54, t15.get_row(), t15.get_col(), true, true);
								$Forays_PhysicalObject.get_m().actor.get_item$1(t15.p).player_visibility_duration = -1;
								$Forays_PhysicalObject.get_m().actor.get_item$1(t15.p).attrs.set_item(69, 20);
							}
						}
						if (count >= 2) {
							$Forays_Actor.get_b().add('Mud tentacles emerge from the walls! ');
						}
						else {
							$Forays_Actor.get_b().add('A mud tentacle emerges from the wall! ');
						}
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 36: {
					if (ss.isNullOrUndefined(this.group)) {
						if (this.aI_Step$1(this.get_target(), true)) {
							this.QS();
						}
						else if (this.distanceFrom(this.get_target()) === 1) {
							this.attack(0, this.get_target());
						}
						else {
							this.QS();
						}
					}
					else {
						var thrall = this.group[1];
						if (this.canSee(thrall)) {
							//cooldown 1 is teleport. cooldown 2 is shield.
							if (this.distanceFrom(this.get_target()) < thrall.distanceFrom(this.get_target()) && this.distanceFrom(thrall) === 1) {
								this.move(thrall.get_row(), thrall.get_col());
								this.QS();
							}
							else if (this.distanceFrom(this.get_target()) === 1 && this.get_curhp() < this.get_maxhp()) {
								var safe = $Forays_Extensions.where($Forays_Tile).call(null, this.tilesAtDistance(1), Function.mkdel(this, function(t16) {
									return t16.get_passable() && ss.isNullOrUndefined(t16.actor()) && this.get_target().getBestExtendedLineOfEffect(thrall).contains(t16);
								}));
								if (this.distanceFrom(thrall) === 1 && safe.length > 0) {
									this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, safe));
									this.QS();
								}
								else if (this.aI_Step$1(this.get_target(), true)) {
									this.QS();
								}
								else {
									this.attack(0, this.get_target());
								}
							}
							else if (!this.hasAttr(69) && (thrall.distanceFrom(this.get_target()) > 1 || !$Forays_Extensions.any($Forays_Tile).call(null, this.get_target().getBestExtendedLineOfEffect(thrall), Function.mkdel(this, function(t17) {
								return ss.referenceEquals(t17.actor(), this);
							})))) {
								//the entrancer tries to be smart about placing the thrall in a position that blocks ranged attacks
								var closest = [];
								var dist = 99;
								var $t37 = $Forays_Extensions.where($Forays_Tile).call(null, thrall.tilesWithinDistance(2), function(x) {
									return x.get_passable() && (ss.isNullOrUndefined(x.actor()) || ss.referenceEquals(x.actor(), thrall));
								});
								for (var $t38 = 0; $t38 < $t37.length; $t38++) {
									var t18 = $t37[$t38];
									if (t18.distanceFrom(this.get_target()) < dist) {
										closest.clear();
										closest.add(t18);
										dist = t18.distanceFrom(this.get_target());
									}
									else if (t18.distanceFrom(this.get_target()) === dist) {
										closest.add(t18);
									}
								}
								var in_line = [];
								for (var $t39 = 0; $t39 < closest.length; $t39++) {
									var t19 = closest[$t39];
									if ($Forays_Extensions.any($Forays_Tile).call(null, this.get_target().getBestExtendedLineOfEffect(t19), Function.mkdel(this, function(x1) {
										return ss.referenceEquals(x1.actor(), this);
									}))) {
										in_line.add(t19);
									}
								}
								var tile = null;
								if (in_line.length > 0) {
									tile = $Forays_Extensions.random($Forays_Tile).call(null, in_line);
								}
								else if (closest.length > 0) {
									tile = $Forays_Extensions.random($Forays_Tile).call(null, closest);
								}
								if (ss.isValue(tile) && !ss.referenceEquals(tile.actor(), thrall)) {
									this.gainAttr(69, 400);
									$Forays_Actor.get_b().add$3(this.theVisible() + ' teleports ' + thrall.theVisible() + '. ', this, thrall);
									$Forays_PhysicalObject.get_m().draw();
									thrall.move(tile.get_row(), tile.get_col());
									$Forays_Actor.get_b().displayNow();
									$Forays_Screen.animateStorm$1(tile.p, 1, 1, 4, thrall.get_symbol(), thrall.get_color());
									var $t40 = thrall.getBestLineOfEffect(tile);
									for (var $t41 = 0; $t41 < $t40.length; $t41++) {
										var t21 = $t40[$t41];
										$Forays_Screen.animateStorm$1(t21.p, 1, 1, 4, thrall.get_symbol(), thrall.get_color());
									}
									this.q1();
								}
								else {
									var safe1 = $Forays_Extensions.whereLeast($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.get_target().getBestExtendedLineOfEffect(thrall), Function.mkdel(this, function(t20) {
										return t20.get_passable() && ss.isNullOrUndefined(t20.actor()) && t20.distanceFrom(this.get_target()) > thrall.distanceFrom(this.get_target());
									})), Function.mkdel(this, function(t22) {
										return this.distanceFrom(t22);
									}));
									if ($Forays_Extensions.any($Forays_Tile).call(null, safe1, Function.mkdel(this, function(t23) {
										return t23.distanceFrom(this.get_target()) > 2;
									}))) {
										this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, safe1, Function.mkdel(this, function(t24) {
											return t24.distanceFrom(this.get_target()) > 2;
										}))));
									}
									else {
										this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, safe1));
									}
									this.QS();
								}
							}
							else if (!this.hasAttr(70) && !thrall.hasAttr(73)) {
								this.gainAttr(70, 1500);
								$Forays_Actor.get_b().add$3(this.theVisible() + ' shields ' + thrall.theVisible() + '. ', this, thrall);
								$Forays_Actor.get_b().displayNow();
								$Forays_Screen.animateStorm$1(thrall.p, 1, 2, 5, '*', 1);
								thrall.attrs.set_item(73, 25);
								$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(thrall, 2000, 73, thrall.your() + ' arcane shield dissolves. ', [thrall]));
								this.q1();
							}
							else {
								var safe2 = $Forays_Extensions.whereLeast($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.get_target().getBestExtendedLineOfEffect(thrall), function(t25) {
									return t25.get_passable() && ss.isNullOrUndefined(t25.actor());
								}), Function.mkdel(this, function(t26) {
									return this.distanceFrom(t26);
								}));
								if ($Forays_Extensions.any($Forays_Tile).call(null, safe2, Function.mkdel(this, function(t27) {
									return t27.distanceFrom(this.get_target()) > 2;
								}))) {
									this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, safe2, Function.mkdel(this, function(t28) {
										return t28.distanceFrom(this.get_target()) > 2;
									}))));
								}
								else {
									this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, safe2));
								}
								this.QS();
							}
						}
						else {
							this.group[1].findPath(this);
							//call for help
							if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else if (this.distanceFrom(this.get_target()) === 1) {
								this.attack(0, this.get_target());
							}
							else {
								this.QS();
							}
						}
					}
					break;
				}
				case 55: {
					this.QS();
					break;
				}
				case 39: {
					if (!this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 8) {
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, $Forays_Global.roll(2) * 100 + 150, 69));
						$Forays_Actor.get_b().add$3(this.get_the_name() + ' tosses a grenade toward ' + this.get_target().get_the_name() + '. ', this, this.get_target());
						var tiles1 = [];
						var $t42 = this.get_target().tilesWithinDistance(1);
						for (var $t43 = 0; $t43 < $t42.length; $t43++) {
							var tile1 = $t42[$t43];
							if (tile1.get_passable()) {
								tiles1.add(tile1);
							}
						}
						var t29 = tiles1[$Forays_Global.roll(tiles1.length) - 1];
						if (ss.isValue(t29.actor())) {
							if (ss.referenceEquals(t29.actor(), $Forays_Actor.get_player())) {
								$Forays_Actor.get_b().add('It lands under you! ');
							}
							else {
								$Forays_Actor.get_b().add$1('It lands under ' + t29.actor().get_the_name() + '. ', t29.actor());
							}
						}
						else if (ss.isValue(t29.get_inv())) {
							$Forays_Actor.get_b().add$1('It lands under ' + t29.get_inv().theName() + '. ', t29);
						}
						t29.features.add(0);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(t29, 100, 8));
						this.q1();
					}
					else if (this.get_curhp() <= 18) {
						if (this.aI_Step$1(this.get_target(), true)) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' backs away. ', this);
							this.QS();
						}
						else if (this.distanceFrom(this.get_target()) === 1) {
							this.attack(0, this.get_target());
						}
						else {
							this.QS();
						}
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 40: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
						if (ss.isValue(this.get_target())) {
							var valid_dirs = [];
							var $t44 = this.get_target().tilesAtDistance(1);
							for (var $t45 = 0; $t45 < $t44.length; $t45++) {
								var t30 = $t44[$t45];
								if (t30.get_passable() && ss.isNullOrUndefined(t30.actor()) && this.distanceFrom(t30) === 1) {
									valid_dirs.add(t30);
								}
							}
							if (valid_dirs.length > 0) {
								this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, valid_dirs));
							}
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 41: {
					if (this.distanceFrom(this.get_target()) === 1) {
						if (this.get_target().hasAttr(28)) {
							this.attack(0, this.get_target());
						}
						else {
							this.attack($Forays_Global.roll$1(1, 2) - 1, this.get_target());
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 42: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
						if ($Forays_Global.coinFlip()) {
							this.aI_Step$1(this.get_target(), true);
						}
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 44: {
					switch (this.distanceFrom(this.get_target())) {
						case 1: {
							if (this.get_target().enemiesAdjacent() > 1) {
								this.attack(0, this.get_target());
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.attack(0, this.get_target());
							}
							break;
						}
						case 2: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.fireArrow(this.get_target());
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								if (this.aI_Sidestep(this.get_target())) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' tries to line up a shot. ', this);
								}
								this.QS();
							}
							break;
						}
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						case 12: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.fireArrow(this.get_target());
							}
							else {
								if (this.aI_Sidestep(this.get_target())) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' tries to line up a shot. ', this);
								}
								this.QS();
							}
							break;
						}
						default: {
							this.aI_Step(this.get_target());
							this.QS();
							break;
						}
					}
					break;
				}
				case 46: {
					if (this.get_curhp() <= 10 && !this.hasAttr(69)) {
						for (var i8 = 0; i8 < 9999; ++i8) {
							var rr = $Forays_Global.roll$1(1, 20);
							var rc = $Forays_Global.roll$1(1, 64);
							if (Math.abs(rr - this.get_row()) >= 10 || Math.abs(rc - this.get_col()) >= 10 || Math.abs(rr - this.get_row()) >= 7 && Math.abs(rc - this.get_col()) >= 7) {
								if ($Forays_PhysicalObject.get_m().boundsCheck(rr, rc) && $Forays_PhysicalObject.get_m().tile.get_item(rr, rc).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(rr, rc)) && !this.hasLOS$1(rr, rc)) {
									$Forays_Actor.get_b().add$1(this.theVisible() + ' slashes at the air, sending a swirling vortex toward ' + this.get_target().get_the_name() + '. ', this.get_target());
									this.animateBeam$1(this.get_target(), '*', 4);
									this.get_target().animateStorm(3, 3, 10, '*', 4);
									this.get_target().move(rr, rc);
									$Forays_PhysicalObject.get_m().draw();
									this.get_target().animateStorm(3, 3, 10, '*', 4);
									$Forays_Actor.get_b().add(this.get_target().youAre() + ' transported elsewhere. ');
									this.attrs.set_item(69, this.attrs.get_item(69) + 1);
									break;
								}
							}
						}
						this.QS();
					}
					else {
						var $t46 = this.actorsWithinDistance(2);
						for (var $t47 = 0; $t47 < $t46.length; $t47++) {
							var a7 = $t46[$t47];
							if (a7.hasAttr(75) && a7.hasLOE(this)) {
								if (this.distanceFrom(this.get_target()) === 1) {
									this.attack(0, this.get_target());
								}
								else {
									this.aI_Step(this.get_target());
									this.QS();
								}
								return;
							}
						}
						if (this.distanceFrom(this.get_target()) === 1) {
							this.attack(0, this.get_target());
						}
						else if (this.distanceFrom(this.get_target()) <= 12 && ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
							this.castRandomSpell(this.get_target(), [12, 15]);
						}
						else {
							this.aI_Step(this.get_target());
							this.QS();
						}
					}
					break;
				}
				case 47: {
					if (this.distanceFrom(this.get_target()) === 1) {
						if (this.hasAttr(69)) {
							//no arms
							this.attack(1, this.get_target());
						}
						else if (true !== this.attack(0, this.get_target())) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' is off balance! ', this);
							this.attrs.set_item(76, 0);
						}
					}
					else {
						if (!this.hasAttr(70)) {
							//no legs
							this.aI_Step(this.get_target());
						}
						this.QS();
					}
					break;
				}
				case 48: {
					var $t48 = this.actorsWithinDistance(2);
					for (var $t49 = 0; $t49 < $t48.length; $t49++) {
						var a8 = $t48[$t49];
						if (a8.hasAttr(75) && a8.hasLOE(this)) {
							if (this.distanceFrom(this.get_target()) === 1) {
								this.attack(0, this.get_target());
							}
							else {
								this.aI_Step(this.get_target());
								this.QS();
							}
							return;
						}
					}
					if (this.get_curhp() <= 15 && this.hasLOS(this.get_target())) {
						var wall = null;
						var wall_distance_to_center = 9999;
						var center = new $Forays_pos(11, 33);
						for (var i9 = 2; i9 <= 8; i9 += 2) {
							if (this.tileInDirection(i9).get_ttype() === 0) {
								if (this.tileInDirection(i9).estimatedEuclideanDistanceFromX10$1(center) < wall_distance_to_center) {
									wall = this.tileInDirection(i9);
									wall_distance_to_center = this.tileInDirection(i9).estimatedEuclideanDistanceFromX10$1(center);
								}
							}
						}
						if (ss.isValue(wall)) {
							this.castSpell$1(13, wall);
							break;
						}
					}
					var valid_spells1 = [];
					valid_spells1.add(17);
					valid_spells1.add(1);
					valid_spells1.add(12);
					valid_spells1.add(12);
					if (this.get_target().hasAttr(31) || this.get_target().hasAttr(32)) {
						valid_spells1.remove(1);
					}
					var ranged_spells1 = Enumerable.from(valid_spells1).toArray();
					switch (this.distanceFrom(this.get_target())) {
						case 1: {
							if (this.get_target().enemiesAdjacent() > 1 || $Forays_Global.coinFlip()) {
								this.castRandomSpell(this.get_target(), [10, 10, 17]);
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.castRandomSpell(this.get_target(), [10, 10, 17]);
							}
							break;
						}
						case 2: {
							if (this.hasLOE(this.get_target()) && !ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.castSpell(9);
								break;
							}
							if ($Forays_Global.coinFlip()) {
								if (this.aI_Step$1(this.get_target(), true)) {
									this.QS();
								}
								else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
									this.castRandomSpell(this.get_target(), [1, 17, 12]);
								}
								else {
									this.aI_Sidestep(this.get_target());
									this.QS();
								}
							}
							else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.castRandomSpell(this.get_target(), [1, 17, 12]);
							}
							else if (this.aI_Step$1(this.get_target(), true)) {
								this.QS();
							}
							else {
								this.aI_Sidestep(this.get_target());
								this.QS();
							}
							break;
						}
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						case 12: {
							if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
								this.castRandomSpell(this.get_target(), ranged_spells1);
							}
							else {
								this.aI_Sidestep(this.get_target());
								this.QS();
							}
							break;
						}
						default: {
							this.aI_Step(this.get_target());
							this.QS();
							break;
						}
					}
					break;
				}
				case 49: {
					if (this.distanceFrom(this.get_target()) <= 12) {
						if (this.distanceFrom(this.get_target()) === 1) {
							this.attack(0, this.get_target());
						}
						else if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
							var line1 = this.getBestLine$1(this.get_target().get_row(), this.get_target().get_col());
							line1.remove(line1[line1.length - 1]);
							this.animateBoltBeam$1(line1, 11);
							if ($Forays_Global.roll$1(1, 4) === 4) {
								this.attack(0, this.get_target());
							}
							else {
								var target_r1 = this.get_target().get_row();
								var target_c1 = this.get_target().get_col();
								if (this.attack(1, this.get_target()) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(target_r1, target_c1))) {
									if (this.get_target().hasAttr(30)) {
										if (this.get_target().get_name() === 'you') {
											$Forays_Actor.get_b().add('You don\'t move far. ');
										}
										else {
											$Forays_Actor.get_b().add$1(this.get_target().get_the_name() + ' doesn\'t move far. ', this.get_target());
										}
									}
									else {
										var rowchange = 0;
										var colchange = 0;
										if (this.get_target().get_row() < this.get_row()) {
											rowchange = 1;
										}
										if (this.get_target().get_row() > this.get_row()) {
											rowchange = -1;
										}
										if (this.get_target().get_col() < this.get_col()) {
											colchange = 1;
										}
										if (this.get_target().get_col() > this.get_col()) {
											colchange = -1;
										}
										if (true !== this.get_target().aI_MoveOrOpen$1(this.get_target().get_row() + rowchange, this.get_target().get_col() + colchange)) {
											if (Math.abs(this.get_target().get_row() - this.get_row()) > Math.abs(this.get_target().get_col() - this.get_col())) {
												this.get_target().aI_Step($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_target().get_col()));
											}
											else if (Math.abs(this.get_target().get_row() - this.get_row()) < Math.abs(this.get_target().get_col() - this.get_col())) {
												this.get_target().aI_Step($Forays_PhysicalObject.get_m().tile.get_item(this.get_target().get_row(), this.get_col()));
											}
											else {
												this.get_target().aI_Step(this);
											}
										}
									}
								}
							}
						}
						else {
							this.q1();
						}
					}
					else {
						this.q1();
					}
					break;
				}
				case 50: {
					if (!this.hasAttr(69) && this.distanceFrom(this.get_target()) <= 12) {
						this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, ($Forays_Global.roll(4) + 8) * 100, 69));
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' calls out to the dead. ', this);
						var summon = ($Forays_Global.coinFlip() ? 6 : 18);
						var tiles2 = [];
						var $t50 = this.tilesWithinDistance(2);
						for (var $t51 = 0; $t51 < $t50.length; $t51++) {
							var tile2 = $t50[$t51];
							if (tile2.get_passable() && ss.isNullOrUndefined(tile2.actor()) && this.directionOf(tile2) === this.directionOf(this.get_target())) {
								tiles2.add(tile2);
							}
						}
						if (tiles2.length === 0) {
							var $t52 = this.tilesWithinDistance(2);
							for (var $t53 = 0; $t53 < $t52.length; $t53++) {
								var tile3 = $t52[$t53];
								if (tile3.get_passable() && ss.isNullOrUndefined(tile3.actor())) {
									tiles2.add(tile3);
								}
							}
						}
						if (tiles2.length === 0 || ss.isValue(this.group) && this.group.length > 3) {
							$Forays_Actor.get_b().add$1('Nothing happens. ', this);
						}
						else {
							var t31 = $Forays_Extensions.random($Forays_Tile).call(null, tiles2);
							$Forays_Actor.get_b().add($Forays_Actor.prototype$1(summon).get_a_name() + ' digs through the floor! ');
							$Forays_Actor.create$1(summon, t31.get_row(), t31.get_col(), true, true);
							$Forays_PhysicalObject.get_m().actor.get_item(t31.get_row(), t31.get_col()).player_visibility_duration = -1;
							if (ss.isNullOrUndefined(this.group)) {
								var $t54 = [];
								$t54.add(this);
								this.group = $t54;
							}
							this.group.add($Forays_PhysicalObject.get_m().actor.get_item(t31.get_row(), t31.get_col()));
							$Forays_PhysicalObject.get_m().actor.get_item(t31.get_row(), t31.get_col()).group = this.group;
						}
						this.q1();
					}
					else {
						var blast = false;
						switch (this.distanceFrom(this.get_target())) {
							case 1: {
								if (this.aI_Step$1(this.get_target(), true)) {
									this.QS();
								}
								else {
									this.attack(0, this.get_target());
								}
								break;
							}
							case 2: {
								if ($Forays_Global.coinFlip() && ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
									blast = true;
								}
								else if (this.aI_Step$1(this.get_target(), true)) {
									this.QS();
								}
								else {
									blast = true;
								}
								break;
							}
							case 3:
							case 4:
							case 5:
							case 6: {
								if (ss.referenceEquals(this.firstActorInLine(this.get_target()), this.get_target())) {
									blast = true;
								}
								else {
									this.aI_Sidestep(this.get_target());
									this.QS();
								}
								break;
							}
							default: {
								this.aI_Step(this.get_target());
								this.QS();
								break;
							}
						}
						if (blast) {
							$Forays_Actor.get_b().add$3(this.get_the_name() + ' fires dark energy at ' + this.get_target().get_the_name() + '. ', this, this.get_target());
							this.animateBoltProjectile(this.get_target(), 12);
							this.get_target().takeDamage$2(9, 1, $Forays_Global.roll(6), this, '*blasted by a necromancer');
							this.q1();
						}
					}
					break;
				}
				case 51: {
					if (this.get_curhp() <= 10 && !$Forays_PhysicalObject.get_m().get_wiz_dark()) {
						if ($Forays_Actor.get_player().canSee(this)) {
							$Forays_Actor.get_b().add(this.get_the_name() + ' absorbs the light from the air. ');
						}
						else {
							$Forays_Actor.get_b().add('Something drains the light from the air. ');
						}
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' is restored. ', this);
						this.set_curhp(this.get_maxhp());
						$Forays_PhysicalObject.get_m().set_wiz_dark(true);
						$Forays_PhysicalObject.get_m().set_wiz_lite(false);
						this.q1();
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				case 2: {
					if ($Forays_Actor.get_player().magic_items.contains(1) && this.distanceFrom($Forays_Actor.get_player()) <= 12 && this.canSee($Forays_Actor.get_player())) {
						$Forays_Actor.get_b().add(this.get_the_name() + ' exhales an orange mist toward you. ');
						var $t55 = this.getBestLine($Forays_Actor.get_player());
						for (var $t56 = 0; $t56 < $t55.length; $t56++) {
							var t32 = $t55[$t56];
							$Forays_Screen.animateStorm$1(t32.p, 1, 2, 3, '*', 3);
						}
						$Forays_Actor.get_b().add('Your ring of resistance melts and drips onto the floor! ');
						$Forays_Actor.get_player().magic_items.remove(1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(this, 100, 1));
					}
					else if ($Forays_Actor.get_player().armors[0] === 5 && this.distanceFrom($Forays_Actor.get_player()) <= 12 && this.canSee($Forays_Actor.get_player())) {
						$Forays_Actor.get_b().add(this.get_the_name() + ' exhales an orange mist toward you. ');
						var $t57 = this.getBestLine($Forays_Actor.get_player());
						for (var $t58 = 0; $t58 < $t57.length; $t58++) {
							var t33 = $t57[$t58];
							$Forays_Screen.animateStorm$1(t33.p, 1, 2, 3, '*', 3);
						}
						$Forays_Actor.get_b().add('The runes drip from your full plate of resistance! ');
						$Forays_Actor.get_player().armors[0] = 2;
						$Forays_Actor.get_player().updateOnEquip(5, 2);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(this, 100, 1));
					}
					else if (!this.hasAttr(69)) {
						if (this.distanceFrom(this.get_target()) <= 12) {
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							var cooldown2 = ($Forays_Global.roll$1(1, 4) + 1) * 100;
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, cooldown2, 69));
							this.animateBeam(this.get_target(), 16, '*');
							this.attack(2, this.get_target());
							if (ss.isValue(this.get_target()) && !this.get_target().hasAttr(31) && !this.get_target().hasAttr(32)) {
								this.get_target().attrs.set_item(32, 1);
								$Forays_Actor.get_b().add$1(this.get_target().you('start') + ' catching fire! ', this.get_target());
							}
						}
						else {
							this.aI_Step(this.get_target());
							this.QS();
						}
					}
					else if (this.distanceFrom(this.get_target()) === 1) {
						this.attack($Forays_Global.roll$1(1, 2) - 1, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
				default: {
					if (this.distanceFrom(this.get_target()) === 1) {
						this.attack(0, this.get_target());
					}
					else {
						this.aI_Step(this.get_target());
						this.QS();
					}
					break;
				}
			}
		},
		seekAI: function() {
			if (this.pathStep()) {
				return;
			}
			switch (this.get_atype()) {
				case 7: {
					var brightest = null;
					if (!$Forays_PhysicalObject.get_m().get_wiz_lite()) {
						var current_brightest = [];
						var $t1 = $Forays_PhysicalObject.get_m().allTiles();
						for (var $t2 = 0; $t2 < $t1.length; $t2++) {
							var t = $t1[$t2];
							var pos_radius = t.get_light_radius();
							var pos_obj = t;
							if (ss.isValue(t.get_inv()) && t.get_inv().get_light_radius() > pos_radius) {
								pos_radius = t.get_inv().get_light_radius();
								pos_obj = t.get_inv();
							}
							if (ss.isValue(t.actor()) && t.actor().lightRadius() > pos_radius) {
								pos_radius = t.actor().lightRadius();
								pos_obj = t.actor();
							}
							if (pos_radius > 0) {
								if (current_brightest.length === 0 && this.canSee(t)) {
									current_brightest.add(pos_obj);
								}
								else {
									for (var $t3 = 0; $t3 < current_brightest.length; $t3++) {
										var o = current_brightest[$t3];
										if (pos_radius > o.get_light_radius()) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) < this.distanceFrom(o)) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) === this.distanceFrom(o) && ss.referenceEquals(pos_obj, $Forays_Actor.get_player())) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
									}
								}
							}
						}
						if (current_brightest.length > 0) {
							brightest = $Forays_Extensions.random($Forays_PhysicalObject).call(null, current_brightest);
						}
					}
					if (ss.isValue(brightest)) {
						if (this.distanceFrom(brightest) <= 1) {
							var open = [];
							var $t4 = this.tilesAtDistance(1);
							for (var $t5 = 0; $t5 < $t4.length; $t5++) {
								var t1 = $t4[$t5];
								if (t1.distanceFrom(brightest) <= 1 && t1.get_passable() && ss.isNullOrUndefined(t1.actor())) {
									open.add(t1);
								}
							}
							if (open.length > 0) {
								this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, open));
							}
							this.QS();
						}
						else {
							this.aI_Step(brightest);
							this.QS();
						}
					}
					else {
						var dir = $Forays_Global.randomDirection();
						if ($Forays_Extensions.where($Forays_Tile).call(null, this.tilesAtDistance(1), function(t2) {
							return !t2.get_passable();
						}).length > 4 && !this.tileInDirection(dir).get_passable()) {
							dir = $Forays_Global.randomDirection();
						}
						if (this.tileInDirection(dir).get_passable() && ss.isNullOrUndefined(this.actorInDirection(dir))) {
							this.aI_Step(this.tileInDirection(dir));
							this.QS();
						}
						else {
							if ($Forays_Actor.get_player().hasLOS(this.tileInDirection(dir))) {
								if (!this.tileInDirection(dir).get_passable()) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.tileInDirection(dir).get_the_name() + '. ', this);
								}
								else if (ss.isValue(this.actorInDirection(dir))) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.actorInDirection(dir).theVisible() + '. ', this);
								}
							}
							this.QS();
						}
					}
					break;
				}
				case 24: {
					if (this.distanceFrom(this.get_target()) <= 10) {
						if ($Forays_Global.roll$1(1, 4) === 4) {
							//teleport into target's LOS somewhere nearby
							var tilelist = [];
							for (var i = 0; i < $Forays_Actor.$ROWS; ++i) {
								for (var j = 0; j < $Forays_Actor.$COLS; ++j) {
									if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(i, j))) {
										if (this.distanceFrom$2(i, j) <= 10 && this.get_target().distanceFrom$2(i, j) <= 10 && this.get_target().canSee$1(i, j)) {
											tilelist.add($Forays_PhysicalObject.get_m().tile.get_item(i, j));
										}
									}
								}
							}
							if (tilelist.length > 0) {
								var t3 = tilelist[$Forays_Global.roll$1(1, tilelist.length) - 1];
								this.move(t3.get_row(), t3.get_col());
							}
							this.QS();
						}
						else {
							//do nothing
							this.QS();
						}
					}
					else {
						//forget about target, do nothing
						this.set_target(null);
						this.QS();
					}
					break;
				}
				case 48: {
					var $t6 = this.actorsWithinDistance(2);
					for (var $t7 = 0; $t7 < $t6.length; $t7++) {
						var a = $t6[$t7];
						if (a.hasAttr(75) && a.hasLOE(this)) {
							this.QS();
							return;
						}
					}
					if (!this.hasAttr(41)) {
						this.castSpell(6);
					}
					else {
						this.QS();
					}
					break;
				}
				case 10:
				case 54:
				case 49:
				case 55: {
					this.QS();
					break;
				}
				case 2: {
					this.findPath($Forays_Actor.get_player());
					this.QS();
					break;
				}
				default: {
					if (ss.isValue(this.target_location)) {
						if (this.distanceFrom(this.target_location) === 1 && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item$1(this.target_location.p))) {
							if (this.grabPreventsMovement(this.target_location) || $Forays_PhysicalObject.get_m().actor.get_item$1(this.target_location.p).grabPreventsMovement(this.tile()) || this.hasAttr(12) || $Forays_PhysicalObject.get_m().actor.get_item$1(this.target_location.p).hasAttr(12)) {
								this.QS();
								//todo: should target_location be cleared here?
							}
							else {
								this.move(this.target_location.get_row(), this.target_location.get_col());
								//swap places
								this.target_location = null;
								this.QS();
							}
						}
						else if (this.aI_Step(this.target_location)) {
							this.QS();
							if (this.distanceFrom(this.target_location) === 0) {
								this.target_location = null;
							}
						}
						else {
							//could not move, end turn.
							if (this.distanceFrom(this.target_location) === 1 && !this.target_location.get_passable()) {
								this.target_location = null;
							}
							this.QS();
						}
					}
					else if (this.distanceFrom(this.get_target()) <= 5) {
						if (this.distanceFrom(this.get_target()) <= 3) {
							var path2 = this.getPath$1(this.get_target(), 4);
							if (path2.length > 0) {
								this.path = path2;
								this.player_visibility_duration = -1;
								//stay at -1 while in close pursuit
							}
						}
						else {
							var path21 = this.getPath$1(this.get_target(), 8);
							if (path21.length <= 10) {
								this.path = path21;
							}
						}
						//FindPath(target,8);
						if (this.pathStep()) {
							return;
						}
						this.QS();
					}
					else {
						//if they're too far away, forget them and end turn.
						this.set_target(null);
						if (ss.isValue(this.group) && !ss.referenceEquals(this.group[0], this)) {
							if (this.distanceFrom(this.group[0]) > 1) {
								var dir1 = this.directionOf(this.group[0]);
								var found = false;
								for (var i1 = -1; i1 <= 1; ++i1) {
									var a1 = this.actorInDirection(this.rotateDirection$1(dir1, true, i1));
									if (ss.isValue(a1) && this.group.contains(a1)) {
										found = true;
										break;
									}
								}
								if (!found) {
									if (this.hasLOS(this.group[0])) {
										this.aI_Step(this.group[0]);
									}
									else {
										this.findPath$1(this.group[0], 8);
										if (this.pathStep()) {
											return;
										}
									}
								}
							}
						}
						this.QS();
					}
					break;
				}
			}
		},
		idleAI: function() {
			if (this.pathStep()) {
				return;
			}
			//if(HasAttr(AttrType.LIGHT_ALLERGY) && tile().IsLit()){
			//List<Tile> dark = TilesAtDistance(1).Where(t=>t.passable && !t.IsLit() && t.actor() == null);
			//if(dark.Count > 0 && AI_Step(dark.Random())){
			//QS();
			//}
			//else{
			//AI_Step(TileInDirection(Global.RandomDirection()));
			//QS();
			//}
			//return;
			//}
			switch (this.get_atype()) {
				case 4:
				case 62: {
					this.aI_Step(this.tileInDirection($Forays_Global.randomDirection()));
					this.QS();
					return;
				}
				case 7: {
					var brightest = null;
					if (!$Forays_PhysicalObject.get_m().get_wiz_lite()) {
						var current_brightest = [];
						var $t1 = $Forays_PhysicalObject.get_m().allTiles();
						for (var $t2 = 0; $t2 < $t1.length; $t2++) {
							var t = $t1[$t2];
							var pos_radius = t.get_light_radius();
							var pos_obj = t;
							if (ss.isValue(t.get_inv()) && t.get_inv().get_light_radius() > pos_radius) {
								pos_radius = t.get_inv().get_light_radius();
								pos_obj = t.get_inv();
							}
							if (ss.isValue(t.actor()) && t.actor().lightRadius() > pos_radius) {
								pos_radius = t.actor().lightRadius();
								pos_obj = t.actor();
							}
							if (pos_radius > 0) {
								if (current_brightest.length === 0 && this.canSee(t)) {
									current_brightest.add(pos_obj);
								}
								else {
									for (var $t3 = 0; $t3 < current_brightest.length; $t3++) {
										var o = current_brightest[$t3];
										if (pos_radius > o.get_light_radius()) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) < this.distanceFrom(o)) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
										else if (pos_radius === o.get_light_radius() && this.distanceFrom(t) === this.distanceFrom(o) && ss.referenceEquals(pos_obj, $Forays_Actor.get_player())) {
											if (this.canSee(t)) {
												current_brightest.clear();
												current_brightest.add(pos_obj);
												break;
											}
										}
									}
								}
							}
						}
						if (current_brightest.length > 0) {
							brightest = $Forays_Extensions.random($Forays_PhysicalObject).call(null, current_brightest);
						}
					}
					if (ss.isValue(brightest)) {
						if (this.distanceFrom(brightest) <= 1) {
							var open = [];
							var $t4 = this.tilesAtDistance(1);
							for (var $t5 = 0; $t5 < $t4.length; $t5++) {
								var t1 = $t4[$t5];
								if (t1.distanceFrom(brightest) <= 1 && t1.get_passable() && ss.isNullOrUndefined(t1.actor())) {
									open.add(t1);
								}
							}
							if (open.length > 0) {
								this.aI_Step($Forays_Extensions.random($Forays_Tile).call(null, open));
							}
							this.QS();
						}
						else {
							this.aI_Step(brightest);
							this.QS();
						}
					}
					else {
						var dir = $Forays_Global.randomDirection();
						if ($Forays_Extensions.where($Forays_Tile).call(null, this.tilesAtDistance(1), function(t2) {
							return !t2.get_passable();
						}).length > 4 && !this.tileInDirection(dir).get_passable()) {
							dir = $Forays_Global.randomDirection();
						}
						if (this.tileInDirection(dir).get_passable() && ss.isNullOrUndefined(this.actorInDirection(dir))) {
							this.aI_Step(this.tileInDirection(dir));
							this.QS();
						}
						else {
							if ($Forays_Actor.get_player().hasLOS(this.tileInDirection(dir))) {
								if (!this.tileInDirection(dir).get_passable()) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.tileInDirection(dir).get_the_name() + '. ', this);
								}
								else if (ss.isValue(this.actorInDirection(dir))) {
									$Forays_Actor.get_b().add$1(this.get_the_name() + ' brushes up against ' + this.actorInDirection(dir).theVisible() + '. ', this);
								}
							}
							this.QS();
						}
					}
					return;
				}
				case 48: {
					var $t6 = this.actorsWithinDistance(2);
					for (var $t7 = 0; $t7 < $t6.length; $t7++) {
						var a = $t6[$t7];
						if (a.hasAttr(75) && a.hasLOE(this)) {
							this.QS();
							return;
						}
					}
					if (!this.hasAttr(41)) {
						this.castSpell(6);
						return;
						//<--!
					}
					break;
				}
				case 8:
				case 63: {
					if (this.attrs.get_item(98) > 0) {
						this.attrs.set_item(98, 0);
					}
					break;
				}
				case 2: {
					this.findPath($Forays_Actor.get_player());
					this.QS();
					return;
				}
				default: {
					break;
				}
			}
			if (this.hasAttr(11)) {
				if ($Forays_Global.roll(10) <= 6) {
					var in_los = [];
					var $t8 = $Forays_PhysicalObject.get_m().allTiles();
					for (var $t9 = 0; $t9 < $t8.length; $t9++) {
						var t3 = $t8[$t9];
						if (t3.get_passable() && this.canSee(t3)) {
							in_los.add(t3);
						}
					}
					if (in_los.length > 0) {
						this.findPath($Forays_Extensions.random($Forays_Tile).call(null, in_los));
					}
					else {
						//trapped?
						this.attrs.set_item(11, 0);
					}
				}
				else if ($Forays_Global.oneIn(4)) {
					var passable = [];
					var $t10 = $Forays_PhysicalObject.get_m().allTiles();
					for (var $t11 = 0; $t11 < $t10.length; $t11++) {
						var t4 = $t10[$t11];
						if (t4.get_passable()) {
							passable.add(t4);
						}
					}
					if (passable.length > 0) {
						this.findPath($Forays_Extensions.random($Forays_Tile).call(null, passable));
					}
					else {
						//trapped?
						this.attrs.set_item(11, 0);
					}
				}
				else {
					var nearby = [];
					var $t12 = $Forays_PhysicalObject.get_m().allTiles();
					for (var $t13 = 0; $t13 < $t12.length; $t13++) {
						var t5 = $t12[$t13];
						if (t5.get_passable() && this.distanceFrom(t5) <= 12) {
							nearby.add(t5);
						}
					}
					if (nearby.length > 0) {
						this.findPath($Forays_Extensions.random($Forays_Tile).call(null, nearby));
					}
					else {
						//trapped?
						this.attrs.set_item(11, 0);
					}
				}
				if (this.pathStep()) {
					return;
				}
				this.QS();
			}
			else {
				if (ss.isValue(this.group) && !ss.referenceEquals(this.group[0], this)) {
					if (this.distanceFrom(this.group[0]) > 1) {
						var dir1 = this.directionOf(this.group[0]);
						var found = false;
						for (var i = -1; i <= 1; ++i) {
							var a1 = this.actorInDirection(this.rotateDirection$1(dir1, true, i));
							if (ss.isValue(a1) && this.group.contains(a1)) {
								found = true;
								break;
							}
						}
						if (!found) {
							if (this.hasLOS(this.group[0])) {
								this.aI_Step(this.group[0]);
							}
							else {
								this.findPath$1(this.group[0], 8);
								if (this.pathStep()) {
									return;
								}
							}
						}
					}
				}
				this.QS();
			}
		},
		calculateDimming: function() {
			if ($Forays_PhysicalObject.get_m().get_wiz_lite() || $Forays_PhysicalObject.get_m().get_wiz_dark()) {
				return;
			}
			var actors = [];
			var $t1 = $Forays_PhysicalObject.get_m().allActors();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var a = $t1[$t2];
				if (a.get_light_radius() > 0) {
					actors.add(a);
				}
			}
			for (var $t3 = 0; $t3 < actors.length; $t3++) {
				var actor = actors[$t3];
				var dist = 100;
				var closest_shadow = null;
				var $t4 = actor.actorsWithinDistance$1(10, true);
				for (var $t5 = 0; $t5 < $t4.length; $t5++) {
					var a1 = $t4[$t5];
					if (a1.get_atype() === 21) {
						if (a1.distanceFrom(actor) < dist) {
							dist = a1.distanceFrom(actor);
							closest_shadow = a1;
						}
					}
				}
				if (ss.isNullOrUndefined(closest_shadow)) {
					if (actor.hasAttr(46)) {
						actor.attrs.set_item(46, 0);
						if (actor.get_light_radius() > 0) {
							$Forays_Actor.get_b().add$1(actor.your() + ' light grows brighter. ', actor);
							if (actor.hasAttr(16)) {
								actor.updateRadius$1(actor.lightRadius(), 12, true);
							}
							else {
								actor.updateRadius$1(actor.lightRadius(), 6, true);
							}
						}
					}
				}
				else {
					var sh = closest_shadow;
					//laziness
					var dimness = 0;
					if (sh.distanceFrom(actor) <= 2) {
						dimness = 5;
					}
					else if (sh.distanceFrom(actor) <= 3) {
						dimness = 4;
					}
					else if (sh.distanceFrom(actor) <= 5) {
						dimness = 3;
					}
					else if (sh.distanceFrom(actor) <= 7) {
						dimness = 2;
					}
					else if (sh.distanceFrom(actor) <= 10) {
						dimness = 1;
					}
					if (dimness > actor.attrs.get_item(46)) {
						var difference = dimness - actor.attrs.get_item(46);
						actor.attrs.set_item(46, dimness);
						if (actor.get_light_radius() > 0) {
							if (actor.attrs.get_item(31) < actor.get_light_radius()) {
								//if the player should notice...
								$Forays_Actor.get_b().add$1(actor.your() + ' light grows dimmer. ', actor);
								actor.updateRadius$1(actor.get_light_radius(), actor.get_light_radius() - difference, true);
								if (actor.attrs.get_item(31) > actor.get_light_radius()) {
									actor.updateRadius(actor.get_light_radius(), actor.attrs.get_item(31));
								}
							}
						}
					}
					else if (dimness < actor.attrs.get_item(46)) {
						var difference1 = dimness - actor.attrs.get_item(46);
						actor.attrs.set_item(46, dimness);
						if (actor.get_light_radius() > 0) {
							if (actor.attrs.get_item(31) < actor.get_light_radius() - difference1) {
								//if the player should notice...
								$Forays_Actor.get_b().add$1(actor.your() + ' light grows brighter. ', actor);
								actor.updateRadius$1(actor.lightRadius(), actor.get_light_radius() - difference1, true);
							}
						}
					}
				}
			}
		},
		aI_Step: function(obj) {
			return this.aI_Step$1(obj, false);
		},
		aI_Step$1: function(obj, flee) {
			var rowchange = 0;
			var colchange = 0;
			if (obj.get_row() < this.get_row()) {
				rowchange = -1;
			}
			if (obj.get_row() > this.get_row()) {
				rowchange = 1;
			}
			if (obj.get_col() < this.get_col()) {
				colchange = -1;
			}
			if (obj.get_col() > this.get_col()) {
				colchange = 1;
			}
			if (flee) {
				rowchange = -rowchange;
				colchange = -colchange;
			}
			var dirs = [];
			if (rowchange === -1) {
				if (colchange === -1) {
					dirs.add(7);
				}
				if (colchange === 0) {
					dirs.add(8);
				}
				if (colchange === 1) {
					dirs.add(9);
				}
			}
			if (rowchange === 0) {
				if (colchange === -1) {
					dirs.add(4);
				}
				if (colchange === 1) {
					dirs.add(6);
				}
			}
			if (rowchange === 1) {
				if (colchange === -1) {
					dirs.add(1);
				}
				if (colchange === 0) {
					dirs.add(2);
				}
				if (colchange === 1) {
					dirs.add(3);
				}
			}
			if (dirs.length === 0) {
				return true;
			}
			var cw = $Forays_Global.coinFlip();
			dirs.add(this.rotateDirection(dirs[0], cw));
			dirs.add(this.rotateDirection(dirs[0], !cw));
			//building a list of directions to try: first the primary direction,
			cw = $Forays_Global.coinFlip();
			//then the ones next to it, then the ones next to THOSE(in random order)
			dirs.add(this.rotateDirection(this.rotateDirection(dirs[0], cw), cw));
			dirs.add(this.rotateDirection(this.rotateDirection(dirs[0], !cw), !cw));
			//this completes the list of 5 directions.
			for (var $t1 = 0; $t1 < dirs.length; $t1++) {
				var i = dirs[$t1];
				if (ss.isValue(this.actorInDirection(i)) && this.actorInDirection(i).isHiddenFrom(this)) {
					this.player_visibility_duration = -1;
					if (ss.referenceEquals(this.actorInDirection(i), $Forays_Actor.get_player())) {
						this.attrs.set_item(15, this.attrs.get_item(15) + 1);
					}
					this.set_target($Forays_Actor.get_player());
					//not extensible yet
					this.target_location = $Forays_PhysicalObject.get_m().tile.get_item($Forays_Actor.get_player().get_row(), $Forays_Actor.get_player().get_col());
					var walks = ' walks straight into you! ';
					if (this.hasAttr(10)) {
						walks = ' flies straight into you! ';
					}
					if (!this.isHiddenFrom($Forays_Actor.get_player())) {
						$Forays_Actor.get_b().add(this.theVisible() + walks);
						if ($Forays_Actor.get_player().canSee(this)) {
							$Forays_Actor.get_b().add(this.get_the_name() + ' looks startled. ');
						}
					}
					else {
						this.attrs.set_item(77, -1);
						this.attrs.set_item(14, this.attrs.get_item(14) + 1);
						$Forays_Actor.get_b().add(this.aVisible() + walks);
						if ($Forays_Actor.get_player().canSee(this)) {
							$Forays_Actor.get_b().add(this.get_the_name() + ' looks just as surprised as you. ');
						}
					}
					return true;
				}
				if (this.aI_MoveOrOpen(i)) {
					return true;
				}
			}
			return false;
		},
		aI_MoveOrOpen: function(dir) {
			return this.aI_MoveOrOpen$1(this.tileInDirection(dir).get_row(), this.tileInDirection(dir).get_col());
		},
		aI_MoveOrOpen$1: function(r, c) {
			if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !this.grabPreventsMovement($Forays_PhysicalObject.get_m().tile.get_item(r, c)) && $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() !== 35) {
				this.move(r, c);
				return true;
			}
			else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() === 3 && this.hasAttr(6)) {
				$Forays_PhysicalObject.get_m().tile.get_item(r, c).toggle(this);
				return true;
			}
			else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() === 28) {
				if (this.hasAttr(9)) {
					if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !this.grabPreventsMovement($Forays_PhysicalObject.get_m().tile.get_item(r, c))) {
						this.move(r, c);
					}
					else {
						return false;
					}
				}
				else {
					$Forays_PhysicalObject.get_m().tile.get_item(r, c).toggle(this);
				}
				return true;
			}
			else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() === 20 && this.hasAttr(107)) {
				$Forays_PhysicalObject.get_m().tile.get_item(r, c).toggle(this);
				$Forays_PhysicalObject.get_m().tile.get_item(r, c).toggle(this);
				return true;
			}
			return false;
		},
		aI_Sidestep: function(obj) {
			var dist = this.distanceFrom(obj);
			var tiles = [];
			for (var i = this.get_row() - 1; i <= this.get_row() + 1; ++i) {
				for (var j = this.get_col() - 1; j <= this.get_col() + 1; ++j) {
					if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).distanceFrom(obj) === dist && $Forays_PhysicalObject.get_m().tile.get_item(i, j).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(i, j))) {
						tiles.add($Forays_PhysicalObject.get_m().tile.get_item(i, j));
					}
				}
			}
			while (tiles.length > 0) {
				var idx = $Forays_Global.roll$1(1, tiles.length) - 1;
				if (this.aI_Step(tiles[idx])) {
					return true;
				}
				else {
					tiles.removeAt(idx);
				}
			}
			return false;
		},
		pathStep: function() {
			return this.pathStep$1(false);
		},
		pathStep$1: function(never_clear_path) {
			if (this.path.length > 0 && !this.hasAttr(12)) {
				if (this.distanceFrom$1(this.path[0]) === 1 && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item$1(this.path[0]))) {
					if (ss.isValue(this.group) && ss.referenceEquals(this.group[0], this) && this.group.contains($Forays_PhysicalObject.get_m().actor.get_item$1(this.path[0]))) {
						if (this.grabPreventsMovement($Forays_PhysicalObject.get_m().tile.get_item$1(this.path[0])) || $Forays_PhysicalObject.get_m().actor.get_item$1(this.path[0]).grabPreventsMovement(this.tile())) {
							this.path.clear();
						}
						else {
							this.move(this.path[0].row, this.path[0].col);
							//leaders can push through their followers
							if (this.distanceFrom$1(this.path[0]) === 0) {
								this.path.removeAt(0);
							}
						}
					}
					else if (this.path.length === 1) {
						if (!never_clear_path) {
							this.path.clear();
						}
					}
					else {
						this.aI_Step($Forays_PhysicalObject.get_m().tile.get_item$1(this.path[0]));
						if (this.distanceFrom$1(this.path[1]) > 1) {
							if (!never_clear_path) {
								this.path.clear();
							}
						}
						else if (this.distanceFrom$1(this.path[1]) === 0) {
							this.path.removeAt(0);
							this.path.removeAt(0);
						}
					}
				}
				else {
					this.aI_Step($Forays_PhysicalObject.get_m().tile.get_item$1(this.path[0]));
					if (this.distanceFrom$1(this.path[0]) === 0) {
						this.path.removeAt(0);
					}
					else {
						if (this.path.length > 0 && $Forays_PhysicalObject.get_m().tile.get_item$1(this.path[0]).get_ttype() === 35) {
							this.path.clear();
						}
						if (this.path.length > 1 && this.distanceFrom$1(this.path[1]) === 1) {
							this.path.removeAt(0);
						}
					}
				}
				this.QS();
				return true;
			}
			return false;
		},
		attack: function(attack_idx, a) {
			//returns true if attack hit
			if (this.stunnedThisTurn()) {
				return false;
			}
			//pos pos_of_target = new pos(a.row,a.col);
			var info = $Forays_AttackList.attack(this.get_atype(), attack_idx);
			if (this.weapons[0] !== 11) {
				info.damage = $Forays_Weapon.damage(this.weapons[0]);
			}
			info.damage.source = this;
			var plus_to_hit = this.totalSkill(0);
			var sneak_attack = false;
			if (this.isHiddenFrom(a) || !a.canSee(this) || ss.referenceEquals(this, $Forays_Actor.get_player()) && this.hasAttr(13) && !this.tile().isLit() && !a.hasAttr(8)) {
				sneak_attack = true;
			}
			if (sneak_attack) {
				//sneak attacks get +25% accuracy. this usually totals 100% vs. unarmored targets.
				plus_to_hit += 25;
			}
			if (this.hasAttr(71)) {
				plus_to_hit += 10;
			}
			plus_to_hit -= a.armorClass() * 2;
			var hit = a.isHit(plus_to_hit);
			if (this.hasFeat(3)) {
				var nowhere_to_run = true;
				var dir = this.directionOf(a);
				if (a.tileInDirection(dir).get_passable() && ss.isNullOrUndefined(a.actorInDirection(dir))) {
					nowhere_to_run = false;
				}
				if (a.tileInDirection(this.rotateDirection(dir, true)).get_passable() && ss.isNullOrUndefined(a.actorInDirection(this.rotateDirection(dir, true)))) {
					nowhere_to_run = false;
				}
				if (a.tileInDirection(this.rotateDirection(dir, false)).get_passable() && ss.isNullOrUndefined(a.actorInDirection(this.rotateDirection(dir, false)))) {
					nowhere_to_run = false;
				}
				if (a.hasAttr(30) || a.hasAttr(12)) {
					nowhere_to_run = true;
				}
				if (nowhere_to_run) {
					hit = true;
				}
			}
			var no_armor_message = false;
			//no_armor_message means "don't print 'your armor blocks the attack' for misses"
			if (a.hasAttr(82) && $Forays_Global.coinFlip()) {
				hit = false;
				no_armor_message = true;
			}
			if ((this.tile().is(5) || a.tile().is(5)) && $Forays_Global.coinFlip()) {
				hit = false;
				no_armor_message = true;
			}
			if (a.isHiddenFrom(this) || !this.canSee(a) || ss.referenceEquals(a, $Forays_Actor.get_player()) && a.hasAttr(13) && !a.tile().isLit() && !this.hasAttr(8)) {
				if ($Forays_Global.coinFlip()) {
					hit = false;
					no_armor_message = true;
				}
			}
			var player_in_combat = false;
			if (ss.referenceEquals(this, $Forays_Actor.get_player()) || ss.referenceEquals(a, $Forays_Actor.get_player())) {
				player_in_combat = true;
			}
			if (attack_idx === 2 && (this.get_atype() === 11 || this.get_atype() === 2)) {
				hit = true;
				//hack! these are the 2 'area' attacks that always hit
				player_in_combat = false;
			}
			if (ss.referenceEquals(a, $Forays_Actor.get_player()) && this.get_atype() === 53) {
				player_in_combat = false;
			}
			if (player_in_combat) {
				var $t1 = $Forays_Actor.get_player().attrs;
				$t1.set_item(86, $t1.get_item(86) + 1);
			}
			var s = info.desc + '. ';
			if (hit) {
				if (this.hasFeat(18) && a.hasAttr(5) && this.isHiddenFrom(a)) {
					if (!this.hasAttr(68)) {
						$Forays_Actor.get_b().add(this.you('silently snap') + ' ' + a.your() + ' neck. ');
						a.takeDamage$1(0, 2, 9001, this);
						this.q1();
						return true;
					}
					else {
						$Forays_Actor.get_b().add(this.you('silently snap') + ' ' + a.your() + ' neck. ');
						$Forays_Actor.get_b().add('It doesn\'t seem to affect ' + a.get_the_name() + '. ');
					}
				}
				var dice = info.damage.dice;
				var crit = false;
				var pos = s.indexOf('&');
				if (pos !== -1) {
					s = s.substring(0, pos) + this.theVisible() + s.substring(pos + 1);
				}
				pos = s.indexOf('^');
				if (pos !== -1) {
					var sc = '';
					var critical_target = 20;
					if (this.weapons[0] === 2) {
						critical_target -= 2;
					}
					if (this.hasFeat(1)) {
						//10% crit plus 5% for each 20% health the target is missing
						critical_target -= 2;
						var fifth = ss.Int32.div(a.get_maxhp(), 5);
						//uses int because it assumes everything has a multiple of 5hp
						var totaldamage = a.get_maxhp() - a.get_curhp();
						if (fifth > 0) {
							var missing_fifths = ss.Int32.div(totaldamage, fifth);
							critical_target -= missing_fifths;
						}
					}
					if ((info.damage.type === 0 || info.damage.type === 8 || info.damage.type === 7 || info.damage.type === 6) && $Forays_Global.roll$1(1, 20) >= critical_target) {
						//maybe this should become a check for physical damage - todo?
						crit = true;
						sc = 'critically ';
					}
					s = s.substring(0, pos) + sc + s.substring(pos + 1);
				}
				pos = s.indexOf('*');
				if (pos !== -1) {
					s = s.substring(0, pos) + a.theVisible() + s.substring(pos + 1);
				}
				if (sneak_attack && crit) {
					if (!a.hasAttr(1) && !a.hasAttr(2) && !a.hasAttr(3) && !a.hasAttr(107)) {
						if (a.get_atype() !== 0) {
							//being nice to the player here...
							switch (this.weapons[0]) {
								case 0:
								case 5: {
									$Forays_Actor.get_b().add('You run ' + a.theVisible() + ' through! ');
									break;
								}
								case 1:
								case 6: {
									$Forays_Actor.get_b().add('You bash ' + a.yourVisible() + ' head in! ');
									break;
								}
								case 2:
								case 7: {
									$Forays_Actor.get_b().add('You pierce one of ' + a.yourVisible() + ' vital organs! ');
									break;
								}
								case 3:
								case 8: {
									$Forays_Actor.get_b().add('You bring your staff down on ' + a.yourVisible() + ' head with a loud crack! ');
									break;
								}
								case 4:
								case 9: {
									$Forays_Actor.get_b().add('You choke ' + a.theVisible() + ' with your bowstring! ');
									break;
								}
								default: {
									break;
								}
							}
							this.makeNoise();
							a.takeDamage$1(0, 2, 1337, this);
							this.q1();
							return true;
						}
						else {
							//...but not too nice
							$Forays_Actor.get_b().add(this.aVisible() + ' strikes from hiding! ');
							$Forays_Actor.get_b().add('The deadly attack leaves you stunned! ');
							var lotsofdamage = Math.max(dice * 6, ss.Int32.div(a.get_curhp(), 2));
							a.attrs.set_item(27, a.attrs.get_item(27) + 1);
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(a, $Forays_Global.roll$1(2, 5) * 100, 27, 'You are no longer stunned. '));
							a.takeDamage$2(0, 0, lotsofdamage, this, this.get_a_name());
						}
					}
				}
				if (sneak_attack) {
					$Forays_Actor.get_b().add(this.youVisible('strike') + ' from hiding! ');
					if (this.get_atype() !== 0) {
						this.attrs.set_item(77, -1);
						this.attrs.set_item(14, this.attrs.get_item(14) + 1);
					}
					else {
						a.player_visibility_duration = -1;
						a.attrs.set_item(15, a.attrs.get_item(15) + 1);
					}
				}
				$Forays_Actor.get_b().add$3(s, this, a);
				var dmg;
				if (crit) {
					dmg = dice * 6;
				}
				else {
					dmg = $Forays_Global.roll$1(dice, 6);
				}
				dmg += this.totalSkill(0);
				var r = a.get_row();
				var c = a.get_col();
				var troll = a.get_atype() === 31 || a.get_atype() === 46;
				var mech_shield = a.hasAttr(76);
				if (crit && mech_shield) {
					a.attrs.set_item(76, 0);
				}
				a.takeDamage$2(info.damage.type, info.damage.damclass, dmg, this, this.get_a_name());
				if (crit && mech_shield) {
					a.attrs.set_item(76, a.attrs.get_item(76) + 1);
				}
				if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if (this.hasAttr(47) || this.attrs.get_item(31) >= 3) {
						//todo: a frostling's ranged attack shouldn't apply this
						if (!a.hasAttr(103)) {
							//to prevent the message
							var amount = $Forays_Global.roll(6);
							if (!a.hasAttr(61) || ss.Int32.div(amount, a.attrs.get_item(61)) > 0) {
								//todo i think resistance is wrong here
								$Forays_Actor.get_b().add$1(a.youAre() + ' burned. ', a);
							}
							a.takeDamage$2(1, 0, amount, this, this.get_a_name());
						}
					}
				}
				if (troll && this.hasAttr(47) && $Forays_PhysicalObject.get_m().tile.get_item(r, c).is(1)) {
					$Forays_PhysicalObject.get_m().tile.get_item(r, c).features.remove(1);
					$Forays_Actor.get_b().add$1('The troll corpse burns to ashes! ', $Forays_PhysicalObject.get_m().tile.get_item(r, c));
				}
				if (troll && this.hasAttr(47) && $Forays_PhysicalObject.get_m().tile.get_item(r, c).is(2)) {
					$Forays_PhysicalObject.get_m().tile.get_item(r, c).features.remove(2);
					$Forays_Actor.get_b().add$1('The troll seer corpse burns to ashes! ', $Forays_PhysicalObject.get_m().tile.get_item(r, c));
				}
				if (this.hasAttr(48) && attack_idx === 0 && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					//hack: only applies to attack 0
					if (!a.hasAttr(103)) {
						//to prevent the message
						$Forays_Actor.get_b().add$1(a.youAre() + ' chilled. ', a);
						a.takeDamage$2(2, 0, $Forays_Global.roll$1(1, 6), this, this.get_a_name());
					}
				}
				if (this.hasAttr(49) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if (!a.hasAttr(1) && !a.hasAttr(2) && !a.hasAttr(49) && !a.hasAttr(67)) {
						if (a.hasAttr(29)) {
							$Forays_Actor.get_b().add$1(a.youAre() + ' more poisoned. ', a);
						}
						else {
							$Forays_Actor.get_b().add$1(a.youAre() + ' poisoned. ', a);
						}
						a.attrs.set_item(29, a.attrs.get_item(29) + 1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(a, ($Forays_Global.roll(6) + 6) * 100, 29));
					}
				}
				if (this.hasAttr(50) && attack_idx === 1 && this.get_atype() === 41 && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if (!a.hasAttr(67)) {
						//hack: carrion crawler only
						$Forays_Actor.get_b().add$1(a.youAre() + ' paralyzed. ', a);
						a.attrs.set_item(28, $Forays_Global.roll$1(1, 3) + 3);
					}
				}
				if (this.hasAttr(51) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if ($Forays_Global.oneIn(3)) {
						if ($Forays_Global.coinFlip()) {
							a.getKnockedBack(this);
						}
						else if (!a.hasAttr(27)) {
							$Forays_Actor.get_b().add$1(a.youAre() + ' stunned. ', a);
							a.attrs.set_item(27, a.attrs.get_item(27) + 1);
							var duration = ($Forays_Global.roll(4) + 3) * 100;
							if (crit) {
								duration += 250;
								crit = false;
								//note this - don't try to use crit again after this on-hit stuff.
							}
							$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(a, duration, 27, a.youAre() + ' no longer stunned. ', [a]));
						}
					}
				}
				if (this.hasAttr(52) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					var str = '';
					if (a.get_atype() === 0) {
						$Forays_Actor.get_b().add('Your vision grows weak. ');
						str = 'Your vision returns to normal. ';
					}
					//a.attrs[AttrType.DIM_VISION]++;
					//Q.Add(new Event(a,a.DurationOfMagicalEffect(Global.Roll(2,20)+20)*100,AttrType.DIM_VISION,str));
					a.gainAttrRefreshDuration$1(45, a.durationOfMagicalEffect($Forays_Global.roll$1(2, 20) + 20) * 100, str, []);
				}
				if (this.hasAttr(53)) {
					var tiles = [];
					var $t2 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).tilesWithinDistance(1);
					for (var $t3 = 0; $t3 < $t2.length; $t3++) {
						var t = $t2[$t3];
						if (ss.isNullOrUndefined(t.actor()) && (t.get_ttype() === 1 || t.get_ttype() === 7)) {
							if ($Forays_Global.coinFlip()) {
								//50% for each...
								tiles.add(t);
							}
						}
					}
					for (var $t4 = 0; $t4 < tiles.length; $t4++) {
						var t1 = tiles[$t4];
						if (t1.get_ttype() === 7) {
							$Forays_Actor.get_q().killEvents$1(t1, 10);
						}
						else {
							t1.toggle$1(this, 7);
						}
					}
					$Forays_Actor.get_q().add(new $Forays_Event.$ctor6(tiles, 150, 10));
				}
				if (this.hasAttr(56) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !this.hasAttr(97) && this.distanceFrom(a) === 1) {
					a.attrs.set_item(96, a.attrs.get_item(96) + 1);
					this.attrs.set_item(97, this.directionOf(a));
					$Forays_Actor.get_b().add$3(this.get_the_name() + ' grabs ' + a.get_the_name() + '. ', this, a);
				}
				if (this.hasAttr(55) && this.get_curhp() < this.get_maxhp()) {
					this.set_curhp(this.get_curhp() + 10);
					if (this.get_curhp() > this.get_maxhp()) {
						this.set_curhp(this.get_maxhp());
					}
					$Forays_Actor.get_b().add$1(this.youFeel() + ' restored. ', this);
				}
				if (this.hasAttr(54) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					$Forays_Actor.get_b().add$1(a.youAre() + ' stunned. ', a);
					var duration1 = 550;
					if (crit) {
						duration1 += 250;
						crit = false;
					}
					a.gainAttrRefreshDuration$1(27, duration1, a.youAre() + ' no longer stunned. ', [a]);
				}
				if (crit && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					$Forays_Actor.get_b().add$1(a.youAre() + ' stunned. ', a);
					a.gainAttrRefreshDuration$1(27, 250, a.youAre() + ' no longer stunned. ', [a]);
				}
				if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && a.get_atype() === 8) {
					if (a.attrs.get_item(98) > 0) {
						$Forays_Actor.get_b().add$1(a.get_the_name() + ' returns to a defensive stance. ', a);
						a.attrs.set_item(98, 0);
					}
					a.attrs.set_item(69, a.attrs.get_item(69) + 1);
					$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(a, 100, 69));
				}
			}
			else {
				if (a.hasAttr(82) || a.hasFeat(6) && $Forays_Global.coinFlip()) {
					//make an attack against a random enemy next to a
					var list = a.actorsWithinDistance$1(1, true);
					list.remove(this);
					//don't consider yourself or the original target
					if (list.length > 0) {
						$Forays_Actor.get_b().add$3(a.you('deflect') + ' the attack. ', this, a);
						return this.attack(attack_idx, list[$Forays_Global.roll$1(1, list.length) - 1]);
					}
					//this would currently enter an infinite loop if two adjacent things used it at the same time
				}
				if (ss.referenceEquals(this, $Forays_Actor.get_player()) || ss.referenceEquals(a, $Forays_Actor.get_player()) || $Forays_Actor.get_player().canSee(this) || $Forays_Actor.get_player().canSee(a)) {
					//didn't change this yet
					if (s === '& lunges forward and ^hits *. ') {
						$Forays_Actor.get_b().add(this.get_the_name() + ' lunges forward and misses ' + a.get_the_name() + '. ');
					}
					else if (s === '& hits * with a blast of cold. ') {
						$Forays_Actor.get_b().add(this.get_the_name() + ' nearly hits ' + a.get_the_name() + ' with a blast of cold. ');
					}
					else if (s.length >= 20 && s.substring(0, 20) === '& extends a tentacle') {
						$Forays_Actor.get_b().add(this.get_the_name() + ' misses ' + a.get_the_name() + ' with a tentacle. ');
					}
					else if (this.hasFeat(3)) {
						$Forays_Actor.get_b().add(this.you('drive') + ' ' + a.theVisible() + ' back. ');
					}
					else if (a.armorClass() > 0 && !no_armor_message) {
						if (a.get_atype() !== 0) {
							$Forays_Actor.get_b().add(a.yourVisible() + ' armor blocks ' + this.yourVisible() + ' attack. ');
						}
						else {
							var miss_chance = 25 - plus_to_hit;
							if ($Forays_Global.roll(miss_chance) <= $Forays_Armor.protection(a.armors[0]) * 2) {
								$Forays_Actor.get_b().add(a.yourVisible() + ' armor blocks ' + this.yourVisible() + ' attack. ');
							}
							else {
								$Forays_Actor.get_b().add(this.youVisible$1('miss', true) + ' ' + a.theVisible() + '. ');
							}
						}
					}
					else {
						$Forays_Actor.get_b().add(this.youVisible$1('miss', true) + ' ' + a.theVisible() + '. ');
					}
				}
				if (this.hasFeat(3)) {
					if (!a.hasAttr(30) && !this.hasAttr(30)) {
						a.aI_Step$1(this, true);
						this.aI_Step(a);
					}
				}
				if (a.get_atype() === 8) {
					if (a.attrs.get_item(98) > 0) {
						$Forays_Actor.get_b().add$1(a.get_the_name() + ' returns to a defensive stance. ', a);
						a.attrs.set_item(98, 0);
					}
					a.attrs.set_item(69, a.attrs.get_item(69) + 1);
					$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(a, 100, 69));
				}
			}
			this.makeNoise();
			$Forays_Actor.get_q().add(new $Forays_Event.$ctor1(this, info.cost));
			return hit;
		},
		fireArrow: function(obj) {
			this.fireArrow$1(this.getBestExtendedLine(obj));
		},
		fireArrow$1: function(line) {
			if (this.stunnedThisTurn()) {
				return;
			}
			var mod = -30;
			//bows have base accuracy 45%
			if (this.hasAttr(18)) {
				mod = -20;
				//keen eyes makes it 55%
			}
			mod += this.totalSkill(0);
			//Tile t = M.tile[obj.row,obj.col];
			var t = null;
			var a = null;
			var actor_present = false;
			var misses = [];
			var missed = [];
			line.removeAt(0);
			//remove the source of the arrow first
			if (line.length > 12) {
				line = $Forays_Extensions.getRange($Forays_Tile).call(null, line, 0, Math.min(12, line.length));
			}
			for (var i = 0; i < line.length; ++i) {
				a = line[i].actor();
				t = line[i];
				if (ss.isValue(a)) {
					actor_present = true;
					if (a.isHit(mod)) {
						if (a.hasAttr(83)) {
							a.attrs.set_item(83, 0);
						}
						else {
							break;
						}
					}
					else {
						misses.add('The arrow misses ' + a.get_the_name() + '. ');
						missed.add(a);
					}
					a = null;
				}
				if (!t.get_passable()) {
					a = null;
					break;
				}
			}
			if (this.hasAttr(57)) {
				$Forays_Actor.get_b().add$1(this.you('fire') + ' a flaming arrow. ', this);
			}
			else {
				$Forays_Actor.get_b().add$1(this.you('fire') + ' an arrow. ', this);
			}
			$Forays_Actor.get_b().displayNow();
			if (ss.isValue(a)) {
				$Forays_Screen.animateBoltProjectile$1($Forays_Extensions.to(line, a), 13, 20);
			}
			else {
				$Forays_Screen.animateBoltProjectile$1($Forays_Extensions.to(line, t), 13, 20);
			}
			var idx = 0;
			for (var $t1 = 0; $t1 < misses.length; $t1++) {
				var s = misses[$t1];
				$Forays_Actor.get_b().add$1(s, missed[idx]);
				++idx;
			}
			if (ss.isValue(a)) {
				if (a.hasAttr(66)) {
					$Forays_Actor.get_b().add$1('The arrow sticks out ineffectively from ' + a.get_the_name() + '. ', a);
				}
				else {
					var alive = true;
					var critical_target = 20;
					if (this.hasFeat(1)) {
						//10% crit plus 5% for each 20% health the target is missing
						critical_target -= 2;
						var fifth = ss.Int32.div(a.get_maxhp(), 5);
						//uses int because it assumes everything has a multiple of 5hp
						var totaldamage = a.get_maxhp() - a.get_curhp();
						var missing_fifths = ss.Int32.div(totaldamage, fifth);
						critical_target -= missing_fifths;
					}
					if ($Forays_Global.roll$1(1, 20) >= critical_target) {
						$Forays_Actor.get_b().add$1('The arrow critically hits ' + a.get_the_name() + '. ', a);
						if (true !== a.takeDamage$2(8, 0, 18 + this.totalSkill(0), this, this.your() + ' arrow')) {
							alive = false;
						}
					}
					else {
						$Forays_Actor.get_b().add$1('The arrow hits ' + a.get_the_name() + '. ', a);
						if (true !== a.takeDamage$2(8, 0, $Forays_Global.roll$1(3, 6) + this.totalSkill(0), this, this.your() + ' arrow')) {
							alive = false;
						}
					}
					if (alive && (a.hasAttr(4) || a.hasAttr(1))) {
						for (var $t2 = 0; $t2 < this.weapons.length; $t2++) {
							var w = this.weapons[$t2];
							if (w === 9) {
								$Forays_Actor.get_b().add$1(a.get_the_name() + ' is blasted with holy energy! ', a);
								if (true !== a.takeDamage$1(9, 1, $Forays_Global.roll$1(3, 6), this)) {
									alive = false;
								}
								break;
							}
						}
					}
					if (alive && this.hasAttr(57) && !a.hasAttr(64) && !a.hasAttr(103)) {
						if (true !== a.takeDamage$2(1, 0, $Forays_Global.roll(6), this, this.your() + ' arrow')) {
							alive = false;
						}
					}
				}
			}
			else if (!actor_present) {
				$Forays_Actor.get_b().add$1('The arrow hits ' + t.get_the_name() + '. ', t);
			}
			this.q1();
		},
		isHit: function(plus_to_hit) {
			if ($Forays_Global.roll$1(1, 100) + plus_to_hit <= 25) {
				//base hit chance is 75%
				return false;
			}
			return true;
		},
		takeDamage$1: function(dmgtype, damclass, dmg, source) {
			return this.takeDamage(new $Forays_Damage(dmgtype, damclass, source, dmg), '');
		},
		takeDamage$2: function(dmgtype, damclass, dmg, source, cause_of_death) {
			return this.takeDamage(new $Forays_Damage(dmgtype, damclass, source, dmg), cause_of_death);
		},
		takeDamage: function(dmg, cause_of_death) {
			//returns true if still alive
			var damage_dealt = false;
			var old_hp = this.get_curhp();
			if (this.hasAttr(30)) {
				//attrs[Forays.AttrType.FROZEN] -= (dmg.amount+1) / 2;
				this.attrs.set_item(30, this.attrs.get_item(30) - ss.Int32.div(dmg.get_amount() * 9, 10));
				if (this.attrs.get_item(30) <= 0) {
					this.attrs.set_item(30, 0);
					$Forays_Actor.get_b().add$1('The ice breaks! ', this);
				}
				//dmg.amount = dmg.amount / 2;
				dmg.set_amount(ss.Int32.div(dmg.get_amount(), 10));
			}
			if (this.hasAttr(76)) {
				$Forays_Actor.get_b().add$1(this.your() + ' shield moves to protect it from harm. ', this);
				return true;
			}
			if (this.hasAttr(103)) {
				dmg.set_amount(0);
			}
			if (this.hasAttr(19) && dmg.damclass === 0) {
				dmg.set_amount(dmg.get_amount() - 2);
			}
			if (dmg.damclass === 1) {
				dmg.set_amount(dmg.get_amount() - ss.Int32.div(this.totalSkill(3), 2));
			}
			if (this.hasAttr(73)) {
				if (this.attrs.get_item(73) >= dmg.get_amount()) {
					this.attrs.set_item(73, this.attrs.get_item(73) - dmg.get_amount());
					if (this.attrs.get_item(73) < 0) {
						this.attrs.set_item(73, 0);
					}
					dmg.set_amount(0);
				}
				else {
					dmg.set_amount(dmg.get_amount() - this.attrs.get_item(73));
					this.attrs.set_item(73, 0);
				}
				if (!this.hasAttr(73)) {
					$Forays_Actor.get_b().add$1(this.your() + ' arcane shield crumbles. ', this);
				}
			}
			var resisted = false;
			switch (dmg.type) {
				case 0: {
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' undamaged. ', this);
					}
					break;
				}
				case 6: {
					var div = 1;
					if (this.hasAttr(58)) {
						for (var i = this.attrs.get_item(58); i > 0; --i) {
							div = div * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 7: {
					var div1 = 1;
					if (this.hasAttr(60)) {
						for (var i1 = this.attrs.get_item(60); i1 > 0; --i1) {
							div1 = div1 * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div1));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 8: {
					var div2 = 1;
					if (this.hasAttr(59)) {
						for (var i2 = this.attrs.get_item(59); i2 > 0; --i2) {
							div2 = div2 * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div2));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 9: {
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 1: {
					var div3 = 1;
					if (this.hasAttr(64)) {
						dmg.set_amount(0);
						//B.Add(the_name + " is immune! ",this);
					}
					else if (this.hasAttr(61)) {
						for (var i3 = this.attrs.get_item(61); i3 > 0; --i3) {
							div3 = div3 * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div3));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
						//if(type == ActorType.SHAMBLING_SCARECROW && speed != 50){
						//speed = 50;
						//if(attrs[AttrType.ON_FIRE] >= LightRadius()){
						//UpdateRadius(LightRadius(),LightRadius()+1);
						//}
						//attrs[AttrType.ON_FIRE]++;
						//B.Add(the_name + " leaps about as it catches fire! ",this);
						//}
					}
					else if (this.get_atype() !== 52) {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unburnt. ', this);
					}
					break;
				}
				case 2: {
					var div4 = 1;
					if (this.hasAttr(65)) {
						dmg.set_amount(0);
						//B.Add(YouAre() + " unharmed. ",this);
					}
					else if (this.hasAttr(62)) {
						for (var i4 = this.attrs.get_item(62); i4 > 0; --i4) {
							div4 = div4 * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div4));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 3: {
					var div5 = 1;
					if (this.hasAttr(63)) {
						for (var i5 = this.attrs.get_item(63); i5 > 0; --i5) {
							div5 = div5 * 2;
						}
						$Forays_Actor.get_b().add$1(this.you('resist') + '. ', this);
						resisted = true;
					}
					dmg.set_amount(ss.Int32.div(dmg.get_amount(), div5));
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' unharmed. ', this);
					}
					break;
				}
				case 4: {
					if (this.hasAttr(1) || this.hasAttr(2) || this.hasAttr(67)) {
						dmg.set_amount(0);
					}
					if (dmg.get_amount() > 0) {
						this.set_curhp(this.get_curhp() - dmg.get_amount());
						damage_dealt = true;
						if (this.get_atype() === 0) {
							if (this.tile().is(6)) {
								$Forays_Actor.get_b().add('The poisonous gas burns your skin! ');
							}
							else {
								$Forays_Actor.get_b().add('You feel the poison coursing through your veins! ');
							}
						}
						else if ($Forays_Global.roll$1(1, 5) === 5) {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' shudders. ', this);
						}
					}
					break;
				}
				case 5: {
					this.set_curhp(this.get_curhp() + dmg.get_amount());
					if (this.get_curhp() > this.get_maxhp()) {
						this.set_curhp(this.get_maxhp());
					}
					break;
				}
				case 10: {
					break;
				}
			}
			if (ss.isValue(dmg.source) && ss.referenceEquals(dmg.source, $Forays_Actor.get_player()) && dmg.damclass === 0 && resisted && !(cause_of_death.search(new RegExp('arrow')) > -1)) {
				$Forays_Help.tutorialTip(3);
			}
			if (damage_dealt) {
				if (this.hasAttr(17)) {
					this.recover_time = $Forays_Actor.get_q().get_turn() + 200;
				}
				else {
					this.recover_time = $Forays_Actor.get_q().get_turn() + 500;
				}
				this.interrupt();
				if (this.hasAttr(37)) {
					this.attrs.set_item(37, 0);
					$Forays_Global.flushInput();
				}
				if (ss.isValue(dmg.source)) {
					if (this.get_atype() !== 0 && !ss.referenceEquals(dmg.source, this)) {
						this.set_target(dmg.source);
						this.target_location = $Forays_PhysicalObject.get_m().tile.get_item(dmg.source.get_row(), dmg.source.get_col());
						if (dmg.source.isHiddenFrom(this)) {
							this.player_visibility_duration = -1;
						}
						if (this.get_atype() === 33 && ss.referenceEquals(dmg.source, $Forays_Actor.get_player()) && !this.hasAttr(69) && !$Forays_PhysicalObject.get_m().get_wiz_lite() && !this.canSee($Forays_Actor.get_player()) && this.get_curhp() > 0) {
							var $t1 = [];
							$t1.add('Show yourself');
							$t1.add('Reveal yourself');
							$t1.add('Unfold thyself');
							$t1.add('Present yourself');
							$t1.add('Unveil yourself');
							$t1.add('Make yourself known');
							var verb = $t1;
							var $t2 = [];
							$t2.add('despicable');
							$t2.add('filthy');
							$t2.add('foul');
							$t2.add('nefarious');
							$t2.add('vulgar');
							$t2.add('sorry');
							$t2.add('unworthy');
							var adjective = $t2;
							var $t3 = [];
							$t3.add('villain');
							$t3.add('blackguard');
							$t3.add('devil');
							$t3.add('scoundrel');
							$t3.add('wretch');
							$t3.add('cur');
							$t3.add('rogue');
							var noun = $t3;
							$Forays_Actor.get_b().add(this.theVisible() + ' shouts "' + $Forays_Extensions.random(String).call(null, verb) + ', ' + $Forays_Extensions.random(String).call(null, adjective) + ' ' + $Forays_Extensions.random(String).call(null, noun) + '!" ');
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' raises a gauntlet. ', this);
							$Forays_Actor.get_b().add('Sunlight fills the dungeon. ');
							$Forays_PhysicalObject.get_m().set_wiz_lite(true);
							$Forays_PhysicalObject.get_m().set_wiz_dark(false);
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
						}
					}
				}
				if (this.hasAttr(74) && !this.hasAttr(69)) {
					this.attrs.set_item(69, this.attrs.get_item(69) + 1);
					$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, ($Forays_Global.roll$1(1, 5) + 1) * 100, 69));
					$Forays_Actor.get_b().add$1(this.you('retaliate') + ' with a burst of spores! ', this);
					for (var i6 = 2; i6 <= 8; i6 += 2) {
						this.animateStorm(i6, 1, ss.Int32.div((i6 * 2 + 1) * (i6 * 2 + 1), 4), '*', 13);
					}
					var $t4 = this.actorsWithinDistance(8);
					for (var $t5 = 0; $t5 < $t4.length; $t5++) {
						var a = $t4[$t5];
						if (this.hasLOE$1(a.get_row(), a.get_col()) && !ss.referenceEquals(a, this)) {
							$Forays_Actor.get_b().add$1('The spores hit ' + a.get_the_name() + '. ', a);
							if (!a.hasAttr(1) && !a.hasAttr(2) && !a.hasAttr(74) && !a.hasAttr(67)) {
								var duration = $Forays_Global.roll$1(2, 4);
								a.attrs.set_item(29, a.attrs.get_item(29) + 1);
								$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(a, duration * 100, 29));
								if (a.get_name() === 'you') {
									$Forays_Actor.get_b().add('You are poisoned. ');
								}
								if (!a.hasAttr(27)) {
									a.attrs.set_item(27, a.attrs.get_item(27) + 1);
									$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(a, duration * 100, 27, a.youAre() + ' no longer stunned. ', [a]));
									$Forays_Actor.get_b().add$1(a.youAre() + ' stunned. ', a);
								}
							}
							else {
								$Forays_Actor.get_b().add$1(a.youAre() + ' unaffected. ', a);
							}
						}
					}
				}
				if (this.hasAttr(72) && ss.isValue(dmg.source)) {
					$Forays_Actor.get_b().add$2(this.yourVisible() + ' holy shield burns ' + dmg.source.theVisible() + '. ', [this, dmg.source]);
					var amount = $Forays_Global.roll$1(2, 6);
					if (amount >= dmg.source.get_curhp()) {
						amount = dmg.source.get_curhp() - 1;
					}
					dmg.source.takeDamage$1(9, 1, amount, this);
					//doesn't yet prevent loops involving 2 holy shields.
				}
				if (this.hasFeat(15) && dmg.type !== 4 && this.attrs.get_item(84) < 5) {
					//if(!Global.Option(OptionType.NO_BLOOD_BOIL_MESSAGE)){
					$Forays_Actor.get_b().add('Your blood boils! ');
					//}
					this.set_speed(this.get_speed() - 10);
					this.attrs.set_item(84, this.attrs.get_item(84) + 1);
					$Forays_Actor.get_q().killEvents(this, 84);
					//eventually replace this with refreshduration
					//GainAttr(AttrType.BLOOD_BOILED,1001,attrs[Forays.AttrType.BLOOD_BOILED],"Your blood cools. ");
					$Forays_Actor.get_q().add(new $Forays_Event.$ctorb(this, 1000, 84, this.attrs.get_item(84), 'Your blood cools. '));
				}
				if (this.get_atype() === 47) {
					if (this.get_curhp() <= 10 && this.get_curhp() > 0 && !this.hasAttr(69) && !this.hasAttr(70)) {
						if ($Forays_Global.coinFlip()) {
							$Forays_Actor.get_b().add$1(this.your() + ' arms are destroyed! ', this);
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							this.attrs.set_item(76, 0);
						}
						else {
							$Forays_Actor.get_b().add$1(this.your() + ' legs are destroyed! ', this);
							this.attrs.set_item(70, this.attrs.get_item(70) + 1);
							this.attrs.set_item(12, this.attrs.get_item(12) + 1);
							this.path.clear();
							this.target_location = null;
						}
					}
				}
			}
			if (this.get_curhp() <= 0) {
				if (this.get_atype() === 0) {
					if (this.magic_items.contains(0)) {
						this.magic_items.remove(0);
						this.set_curhp(1);
						$Forays_Actor.get_b().add('Your pendant glows brightly, then crumbles to dust. ');
					}
					else {
						if (cause_of_death.length > 0 && cause_of_death.charCodeAt(0) === 42) {
							$Forays_Global.killeD_BY = cause_of_death.substring(1);
						}
						else {
							$Forays_Global.killeD_BY = 'killed by ' + cause_of_death;
						}
						$Forays_PhysicalObject.get_m().draw();
						if ($Forays_Global.gamE_OVER === false) {
							$Forays_Actor.get_b().add('You die. ');
						}
						$Forays_Actor.get_b().printAll();
						$Forays_Global.gamE_OVER = true;
						return false;
					}
				}
				else {
					if (this.hasAttr(107)) {
						$Forays_PhysicalObject.get_m().draw();
						$Forays_Actor.get_b().add('The fire drake dies. ');
						$Forays_Actor.get_b().printAll();
						if ($Forays_Actor.get_player().get_curhp() > 0) {
							$Forays_Actor.get_b().add('The threat to your nation has been slain! You begin the long trek home to deliver the good news... ');
							$Forays_Global.killeD_BY = 'Died of ripe old age';
						}
						else {
							$Forays_Actor.get_b().add('The threat to your nation has been slain! Unfortunately, you won\'t be able to deliver the news... ');
						}
						$Forays_Actor.get_b().printAll();
						$Forays_Global.gamE_OVER = true;
						$Forays_Global.bosS_KILLED = true;
					}
					if (this.get_atype() === 30 && dmg.get_amount() < 1000) {
						//hack
						if (!this.hasAttr(69)) {
							this.attrs.set_item(69, this.attrs.get_item(69) + 1);
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, 350, 69));
							$Forays_Actor.get_q().killEvents(this, 70);
							if (!this.hasAttr(70)) {
								this.attrs.set_item(70, this.directionOf($Forays_Actor.get_player()));
							}
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' somehow remains standing! He screams with fury! ', this);
						}
						return true;
					}
					if (this.hasAttr(25) && dmg.type !== 1) {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' falls to the ground, still twitching. ', this);
						var troll = null;
						for (var i7 = 0; i7 < $Forays_Actor.$COLS && ss.isNullOrUndefined(troll); ++i7) {
							var $t6 = this.tilesAtDistance(i7);
							for (var $t7 = 0; $t7 < $t6.length; $t7++) {
								var t = $t6[$t7];
								if (t.get_passable() && !t.is(1) && !t.is(2) && !t.is(3)) {
									if (this.get_atype() === 31) {
										t.features.add(1);
									}
									else {
										t.features.add(2);
									}
									troll = t;
									break;
								}
							}
						}
						this.set_curhp(this.get_curhp() - ($Forays_Global.roll(10) + 5));
						if (this.get_curhp() < -50) {
							this.set_curhp(-50);
						}
						var attr = (this.hasAttr(69) ? 69 : 109);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctorf(troll, null, 200, 7, attr, this.get_curhp(), ''));
					}
					else if (dmg.get_amount() < 1000 && !this.hasAttr(107)) {
						//everything that deals this much damage
						if (this.hasAttr(1) || this.hasAttr(2)) {
							//prints its own message
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' is destroyed. ', this);
						}
						else {
							$Forays_Actor.get_b().add$1(this.get_the_name() + ' dies. ', this);
						}
					}
					if (this.lightRadius() > 0) {
						this.updateRadius(this.lightRadius(), 0);
					}
					if (this.get_atype() === 21) {
						if ($Forays_Actor.get_player().hasAttr(46)) {
							this.set_atype(18);
							//awful awful hack. (CalculateDimming checks for Shadows)
							this.calculateDimming();
						}
					}
					if (this.get_atype() === 43) {
						var $t8 = this.tilesWithinDistance(4);
						for (var $t9 = 0; $t9 < $t8.length; $t9++) {
							var t1 = $t8[$t9];
							if (t1.get_name() === 'floor' && (ss.isNullOrUndefined(t1.actor()) || ss.referenceEquals(t1.actor(), this)) && this.hasLOE(t1)) {
								if (this.distanceFrom(t1) <= 2 || $Forays_Global.coinFlip()) {
									t1.transformTo(28);
								}
							}
						}
					}
					if ($Forays_Actor.get_player().hasAttr(87)) {
						var $t10 = $Forays_Actor.get_player().attrs;
						$t10.set_item(88, $t10.get_item(88) + 1);
					}
					if (this.hasAttr(6) && this.get_atype() !== 53 && this.get_atype() !== 2 || this.get_atype() === 18) {
						if ($Forays_Global.coinFlip() && !this.hasAttr(26)) {
							this.tile().getItem($Forays_Item.create$1($Forays_Item.randomItem(), -1, -1));
						}
					}
					var $t11 = this.get_inv();
					for (var $t12 = 0; $t12 < $t11.length; $t12++) {
						var item = $t11[$t12];
						this.tile().getItem(item);
					}
					//int divisor = 1;
					//if(HasAttr(AttrType.SMALL_GROUP)){ divisor = 2; }
					//if(HasAttr(AttrType.MEDIUM_GROUP)){ divisor = 3; }
					//if(HasAttr(AttrType.LARGE_GROUP)){ divisor = 5; }
					//if(!Global.GAME_OVER){
					//player.GainXP(xp + (level*(10 + level - player.level))/divisor); //experimentally giving the player any
					//}
					$Forays_Actor.get_q().killEvents$1(this, 0);
					// XP that the monster had collected. currently always 0.
					$Forays_PhysicalObject.get_m().removeTargets(this);
					var idx = $Forays_Actor.tiebreakers.indexOf(this);
					if (idx !== -1) {
						$Forays_Actor.tiebreakers[$Forays_Actor.tiebreakers.indexOf(this)] = null;
					}
					if (ss.isValue(this.group)) {
						if (this.group.length >= 2 && ss.referenceEquals(this, this.group[0]) && this.hasAttr(11)) {
							if (this.get_atype() !== 50 && this.get_atype() !== 12) {
								var $t13 = this.group[1].attrs;
								$t13.set_item(11, $t13.get_item(11) + 1);
							}
						}
						if (this.group.length <= 2 || this.get_atype() === 50 || this.get_atype() === 12) {
							for (var $t14 = 0; $t14 < this.group.length; $t14++) {
								var a1 = this.group[$t14];
								if (!ss.referenceEquals(a1, this)) {
									a1.group = null;
								}
							}
							this.group.clear();
							this.group = null;
						}
						else {
							this.group.remove(this);
							this.group = null;
						}
					}
					$Forays_PhysicalObject.get_m().actor.set_item(this.get_row(), this.get_col(), null);
					return false;
				}
			}
			else {
				if (this.hasFeat(14) && damage_dealt && this.get_curhp() < 20 && old_hp >= 20) {
					$Forays_Actor.get_b().add('You can feel no pain! ');
					this.attrs.set_item(103, this.attrs.get_item(103) + 1);
					$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(this, 500, 103, 'You can feel pain again. '));
				}
				if (this.magic_items.contains(3) && damage_dealt && dmg.get_amount() >= this.get_curhp()) {
					$Forays_Actor.get_b().printAll();
					$Forays_PhysicalObject.get_m().draw();
					$Forays_Actor.get_b().displayNow$1('Your cloak starts to vanish. Use your cloak to escape?(y/n): ');
					$Forays_Game.console.cursorVisible = true;
					var command;
					var done = false;
					while (!done) {
						command = $Forays_Game.console.readKey(true);
						switch (command.keyChar) {
							case 110:
							case 78: {
								done = true;
								break;
							}
							case 121:
							case 89: {
								done = true;
								var good = Array.multidim(Boolean.getDefaultValue(), $Forays_Actor.$ROWS, $Forays_Actor.$COLS);
								var $t15 = $Forays_PhysicalObject.get_m().allTiles();
								for (var $t16 = 0; $t16 < $t15.length; $t16++) {
									var t2 = $t15[$t16];
									if (t2.get_passable()) {
										good.set(t2.get_row(), t2.get_col(), true);
									}
									else {
										good.set(t2.get_row(), t2.get_col(), false);
									}
								}
								var $t17 = $Forays_PhysicalObject.get_m().allActors();
								for (var $t18 = 0; $t18 < $t17.length; $t18++) {
									var a2 = $t17[$t18];
									var $t19 = $Forays_PhysicalObject.get_m().allTiles();
									for (var $t20 = 0; $t20 < $t19.length; $t20++) {
										var t3 = $t19[$t20];
										if (good.get(t3.get_row(), t3.get_col())) {
											if (a2.distanceFrom(t3) < 6 || a2.hasLOS$1(t3.get_row(), t3.get_col())) {
												//was CanSee, but this is safer
												good.set(t3.get_row(), t3.get_col(), false);
											}
										}
									}
								}
								var tilelist = [];
								var destination = null;
								for (var i8 = 4; i8 < $Forays_Actor.$COLS; ++i8) {
									var $t21 = this.positionsAtDistance(i8);
									for (var $t22 = 0; $t22 < $t21.length; $t22++) {
										var p = $t21[$t22];
										if (good.get(p.row, p.col)) {
											tilelist.add($Forays_PhysicalObject.get_m().tile.get_item(p.row, p.col));
										}
									}
									if (tilelist.length > 0) {
										destination = tilelist[$Forays_Global.roll$1(1, tilelist.length) - 1];
										break;
									}
								}
								if (ss.isValue(destination)) {
									this.move(destination.get_row(), destination.get_col());
								}
								else {
									for (var i9 = 0; i9 < 9999; ++i9) {
										var rr = $Forays_Global.roll$1(1, 20);
										var rc = $Forays_Global.roll$1(1, 64);
										if ($Forays_PhysicalObject.get_m().tile.get_item(rr, rc).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(rr, rc)) && this.distanceFrom$2(rr, rc) >= 6 && !$Forays_PhysicalObject.get_m().tile.get_item(rr, rc).isTrap()) {
											this.move(rr, rc);
											break;
										}
									}
								}
								$Forays_Actor.get_b().add('You escape. ');
								break;
							}
							default: {
								break;
							}
						}
					}
					$Forays_Actor.get_b().add('Your cloak vanishes completely! ');
					this.magic_items.remove(3);
				}
			}
			return true;
		},
		getKnockedBack: function(obj) {
			return this.getKnockedBack$1(obj.getBestExtendedLine$1(this.get_row(), this.get_col()));
		},
		getKnockedBack$1: function(line) {
			var idx = line.indexOf($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()));
			if (idx === -1) {
				$Forays_Actor.get_b().add('DEBUG: Error - ' + this.get_the_name() + '\'s position doesn\'t seem to be in the line. ');
				return false;
			}
			var next = line[idx + 1];
			var source = $Forays_PhysicalObject.get_m().actor.get_item(line[0].get_row(), line[0].get_col());
			var no_movement = this.grabPreventsMovement(next) || this.hasAttr(12);
			if (next.get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col())) && !no_movement) {
				if ($Forays_Actor.get_player().canSee(this.tile())) {
					$Forays_Actor.get_b().add$1(this.youAre() + ' knocked back. ', this);
				}
				if (this.hasAttr(30)) {
					this.attrs.set_item(30, 0);
					if ($Forays_Actor.get_player().canSee(this.tile())) {
						$Forays_Actor.get_b().add$1('The ice breaks! ', this);
					}
				}
				this.move(next.get_row(), next.get_col());
			}
			else {
				var r = this.get_row();
				var c = this.get_col();
				var immobilized = this.hasAttr(30);
				if (!next.get_passable()) {
					if ($Forays_Actor.get_player().canSee(this.tile())) {
						$Forays_Actor.get_b().add$2(this.youVisibleAre() + ' knocked into ' + next.theVisible() + '. ', [this, next]);
					}
					this.takeDamage$2(0, 0, $Forays_Global.roll$1(1, 6), source, '*smashed against ' + next.get_a_name());
				}
				else if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item$1(next.p))) {
					if ($Forays_Actor.get_player().canSee(this.tile())) {
						$Forays_Actor.get_b().add$2(this.youVisibleAre() + ' knocked into ' + $Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col()).theVisible() + '. ', [this, $Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col())]);
						//vis
					}
					var this_name = this.get_a_name();
					this.takeDamage$2(0, 0, $Forays_Global.roll$1(1, 6), source, '*smashed against ' + $Forays_PhysicalObject.get_m().actor.get_item$1(next.p).get_a_name());
					$Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col()).takeDamage$2(0, 0, $Forays_Global.roll$1(1, 6), source, '*smashed against ' + this_name);
				}
				else {
					//grabbed
					if ($Forays_Actor.get_player().canSee(this.tile())) {
						$Forays_Actor.get_b().add$1(this.youVisibleAre() + ' knocked about. ', this);
					}
					var grabber = null;
					var $t1 = this.actorsAtDistance(1);
					for (var $t2 = 0; $t2 < $t1.length; $t2++) {
						var a = $t1[$t2];
						if (a.attrs.get_item(97) === a.directionOf(this)) {
							grabber = a;
						}
					}
					var grabber_name = '';
					if (ss.isValue(grabber)) {
						grabber_name = grabber.get_a_name();
					}
					this.takeDamage$2(0, 0, $Forays_Global.roll(6), source, '*smashed against ' + grabber_name);
				}
				if (immobilized && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
					if ($Forays_Actor.get_player().canSee(this.tile())) {
						$Forays_Actor.get_b().add$1('The ice breaks! ', this);
					}
				}
			}
			return true;
		},
		castSpell: function(spell) {
			return this.castSpell$3(spell, null, false);
		},
		castSpell$2: function(spell, force_of_will) {
			return this.castSpell$3(spell, null, force_of_will);
		},
		castSpell$1: function(spell, obj) {
			return this.castSpell$3(spell, obj, false);
		},
		castSpell$3: function(spell, obj, force_of_will) {
			//returns false if targeting is canceled.
			if (this.stunnedThisTurn() && !force_of_will) {
				//eventually this will be moved to the last possible second
				return true;
				//returns true because turn was used up. 
			}
			if (!this.hasSpell(spell)) {
				return false;
			}
			var $t1 = this.actorsWithinDistance(2);
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var a = $t1[$t2];
				if (a.hasAttr(75) && a.hasLOE(this)) {
					if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
						if (this.canSee(a)) {
							$Forays_Actor.get_b().add(a.your() + ' presence disrupts your spell! ');
						}
						else {
							$Forays_Actor.get_b().add('Something disrupts your spell! ');
						}
					}
					return false;
				}
			}
			var t = null;
			var line = null;
			if (ss.isValue(obj)) {
				t = $Forays_PhysicalObject.get_m().tile.get_item(obj.get_row(), obj.get_col());
				if (spell === 17) {
					//force beam requires a line for proper knockback
					line = this.getBestExtendedLine(t);
				}
				else {
					line = this.getBestLine(t);
				}
			}
			var bonus = 0;
			//used for bonus damage on spells - currently, only Master's Edge adds bonus damage.
			if (this.failRate(spell) > 0) {
				var fail = this.failRate(spell);
				if (force_of_will) {
					fail = this.magic_penalty * 5;
					fail -= this.skills.get_item(3) * 2;
					if (fail < 0) {
						fail = 0;
					}
				}
				if ($Forays_Global.roll$1(1, 100) - fail <= 0) {
					if ($Forays_Actor.get_player().canSee(this)) {
						$Forays_Actor.get_b().add$1('Sparks fly from ' + this.your() + ' fingers. ', this);
					}
					else if ($Forays_Actor.get_player().distanceFrom(this) <= 4 || $Forays_Actor.get_player().distanceFrom(this) <= 12 && $Forays_Actor.get_player().hasLOS$1(this.get_row(), this.get_col())) {
						$Forays_Actor.get_b().add('You hear words of magic, but nothing happens. ');
					}
					this.q1();
					return true;
				}
			}
			if (this.hasFeat(8)) {
				for (var $t3 = 0; $t3 < $Forays_Actor.spells_in_order.length; $t3++) {
					var s = $Forays_Actor.spells_in_order[$t3];
					if ($Forays_Spell.isDamaging(s)) {
						if (s === spell) {
							bonus = 1;
						}
						break;
					}
				}
			}
			switch (spell) {
				case 0: {
					if (!this.hasAttr(16)) {
						$Forays_Actor.get_b().add('You cast shine. ');
						if (!$Forays_PhysicalObject.get_m().get_wiz_dark()) {
							$Forays_Actor.get_b().add('Your torch begins to shine brightly. ');
						}
						this.attrs.set_item(16, this.attrs.get_item(16) + 1);
						if (this.get_light_radius() > 0) {
							this.updateRadius$1(this.lightRadius(), $Forays_Global.maX_LIGHT_RADIUS - this.attrs.get_item(46) * 2, true);
						}
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor3(9500, 'Your torch begins to flicker a bit. '));
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(this, 10000, 16, 'Your torch no longer shines as brightly. '));
					}
					else {
						$Forays_Actor.get_b().add('Your torch is already shining brightly! ');
						return false;
					}
					break;
				}
				case 1: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' immolate. ', this);
						var a1 = this.firstActorInLine$1(line);
						if (ss.isValue(a1)) {
							this.animateBeam$2($Forays_Extensions.toFirstObstruction(line), '*', 16);
							if (!a1.hasAttr(61) && !a1.hasAttr(32) && !a1.hasAttr(31)) {
								if (a1.get_name() === 'you') {
									$Forays_Actor.get_b().add('You start to catch fire! ');
								}
								else {
									$Forays_Actor.get_b().add$1(a1.get_the_name() + ' starts to catch fire. ', a1);
								}
								a1.attrs.set_item(32, a1.attrs.get_item(32) + 1);
							}
							else {
								$Forays_Actor.get_b().add$1(a1.you('shrug') + ' off the flames. ', a1);
							}
						}
						else {
							for (var $t4 = 0; $t4 < line.length; $t4++) {
								var t2 = line[$t4];
								if (t2.is(1) || t2.is(2)) {
									line = $Forays_Extensions.to(line, t2);
								}
							}
							this.animateBeam$2(line, '*', 16);
							$Forays_Actor.get_b().add$1(this.you('throw') + ' flames. ', this);
							if ($Forays_Extensions.last($Forays_Tile).call(null, line).is(1)) {
								$Forays_Extensions.last($Forays_Tile).call(null, line).features.remove(1);
								$Forays_Actor.get_b().add$1('The troll corpse burns to ashes! ', $Forays_Extensions.last($Forays_Tile).call(null, line));
							}
							if ($Forays_Extensions.last($Forays_Tile).call(null, line).is(2)) {
								$Forays_Extensions.last($Forays_Tile).call(null, line).features.remove(2);
								$Forays_Actor.get_b().add$1('The troll seer corpse burns to ashes! ', $Forays_Extensions.last($Forays_Tile).call(null, line));
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				case 2: {
					if (ss.isNullOrUndefined(t)) {
						t = this.tileInDirection(this.getDirection());
					}
					if (ss.isValue(t)) {
						var a2 = $Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col());
						$Forays_Actor.get_b().add$1(this.you('cast') + ' force palm. ', this);
						//AnimateMapCell(t,Color.DarkCyan,"*");
						$Forays_Actor.get_b().displayNow();
						$Forays_Screen.animateMapCell$1(t.get_row(), t.get_col(), new $Forays_colorchar.$ctor4('*', 5), 100);
						if (ss.isValue(a2)) {
							$Forays_Actor.get_b().add$2(this.you('strike') + ' ' + a2.theVisible() + '. ', [this, a2]);
							var s1 = a2.get_the_name();
							var s2 = a2.get_a_name();
							var line2 = this.getBestExtendedLine$1(a2.get_row(), a2.get_col());
							var idx = line2.indexOf($Forays_PhysicalObject.get_m().tile.get_item(a2.get_row(), a2.get_col()));
							var next = line2[idx + 1];
							a2.takeDamage$2(9, 1, $Forays_Global.roll$1(1 + bonus, 6), this, this.get_a_name());
							if ($Forays_Global.roll$1(1, 10) <= 7) {
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
									a2.getKnockedBack(this);
								}
								else if (!next.get_passable()) {
									$Forays_Actor.get_b().add$2(s1 + '\'s corpse is knocked into ' + next.get_the_name() + '. ', [t, next]);
								}
								else if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col()))) {
									$Forays_Actor.get_b().add$2(s1 + '\'s corpse is knocked into ' + $Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col()).get_the_name() + '. ', [t, $Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col())]);
									$Forays_PhysicalObject.get_m().actor.get_item(next.get_row(), next.get_col()).takeDamage$2(0, 0, $Forays_Global.roll$1(1, 6), this, s2 + '\'s falling corpse');
								}
							}
						}
						else if (t.get_passable()) {
							$Forays_Actor.get_b().add('You strike at empty space. ');
						}
						else {
							$Forays_Actor.get_b().add('You strike ' + t.get_the_name() + ' with your palm. ');
							if (t.get_ttype() === 3) {
								//heh, why not?
								$Forays_Actor.get_b().add('It flies open! ');
								t.toggle(this);
							}
							if (t.get_ttype() === 20) {
								//and this one gives it an actual use
								$Forays_Actor.get_b().add('A hidden door flies open! ');
								t.toggle(this);
								t.toggle(this);
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				case 3: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' freeze. ', this);
						var a3 = this.firstActorInLine$1(line);
						if (ss.isValue(a3)) {
							this.animateBoltBeam$1($Forays_Extensions.toFirstObstruction(line), 8);
							if (!a3.hasAttr(30) && !a3.hasAttr(95)) {
								$Forays_Actor.get_b().add$1(a3.youAre() + ' encased in ice. ', a3);
								a3.attrs.set_item(30, 25);
							}
							else {
								$Forays_Actor.get_b().add$1('The beam dissipates on the remaining ice. ', a3);
							}
						}
						else {
							this.animateBoltBeam$1(line, 8);
							$Forays_Actor.get_b().add$1('A bit of ice forms on ' + t.get_the_name() + '. ', t);
						}
					}
					else {
						return false;
					}
					break;
				}
				case 4: {
					for (var i = 0; i < 9999; ++i) {
						var a4 = $Forays_Global.roll$1(1, 17) - 9;
						//-8 to 8
						var b = $Forays_Global.roll$1(1, 17) - 9;
						if (Math.abs(a4) + Math.abs(b) >= 6) {
							a4 += this.get_row();
							b += this.get_col();
							if ($Forays_PhysicalObject.get_m().boundsCheck(a4, b) && $Forays_PhysicalObject.get_m().tile.get_item(a4, b).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(a4, b))) {
								$Forays_Actor.get_b().add$1(this.you('cast') + ' blink. ', this);
								$Forays_Actor.get_b().add$1(this.you('step') + ' through a rip in reality. ', this);
								this.animateStorm(2, 3, 4, '*', 14);
								this.move(a4, b);
								$Forays_PhysicalObject.get_m().draw();
								this.animateStorm(2, 3, 4, '*', 14);
								break;
							}
						}
					}
					break;
				}
				case 5: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' scorch. ', this);
						var a5 = this.firstActorInLine$1(line);
						if (ss.isValue(a5)) {
							this.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 16);
							$Forays_Actor.get_b().add$1('The scorching bolt hits ' + a5.get_the_name() + '. ', a5);
							a5.takeDamage$2(1, 1, $Forays_Global.roll$1(2 + bonus, 6), this, this.get_a_name());
						}
						else {
							for (var $t5 = 0; $t5 < line.length; $t5++) {
								var t21 = line[$t5];
								if (t21.is(1) || t21.is(2)) {
									line = $Forays_Extensions.to(line, t21);
								}
							}
							this.animateProjectile$2(line, '*', 16);
							$Forays_Actor.get_b().add$1('The scorching bolt hits ' + t.get_the_name() + '. ', t);
							if ($Forays_Extensions.last($Forays_Tile).call(null, line).is(1)) {
								$Forays_Extensions.last($Forays_Tile).call(null, line).features.remove(1);
								$Forays_Actor.get_b().add$1('The troll corpse burns to ashes! ', $Forays_Extensions.last($Forays_Tile).call(null, line));
							}
							if ($Forays_Extensions.last($Forays_Tile).call(null, line).is(2)) {
								$Forays_Extensions.last($Forays_Tile).call(null, line).features.remove(2);
								$Forays_Actor.get_b().add$1('The troll seer corpse burns to ashes! ', $Forays_Extensions.last($Forays_Tile).call(null, line));
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				case 6: {
					if (!this.hasAttr(41)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' bloodscent. ', this);
						this.attrs.set_item(41, this.attrs.get_item(41) + 1);
						if (this.get_atype() === 0) {
							$Forays_Actor.get_b().add('You smell fear. ');
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(this, 10000, 41, 'You lose the scent. '));
						}
						else {
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, 10000, 41));
						}
					}
					else {
						$Forays_Actor.get_b().add('You can already smell the blood of your enemies. ');
						return false;
					}
					break;
				}
				case 7: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' lightning bolt. ', this);
						var bolt_target = null;
						var damage_targets = [];
						for (var $t6 = 0; $t6 < line.length; $t6++) {
							var t22 = line[$t6];
							if (ss.isValue(t22.actor()) && !ss.referenceEquals(t22.actor(), this)) {
								bolt_target = t22.actor();
								damage_targets.add(t22.actor());
								break;
							}
							else if (t22.conductsElectricity()) {
								bolt_target = t22;
								break;
							}
						}
						if (ss.isValue(bolt_target)) {
							var chain = new (Type.makeGenericType($Forays_Dict$2, [$Forays_PhysicalObject, Array]))();
							var $t7 = [];
							$t7.add(bolt_target);
							chain.set_item(this, $t7);
							var $t8 = [];
							$t8.add(bolt_target);
							var last_added = $t8;
							for (var done = false; !done;) {
								done = true;
								var new_last_added = [];
								for (var $t9 = 0; $t9 < last_added.length; $t9++) {
									var added = last_added[$t9];
									var sort_list = [];
									var $t10 = added.tilesWithinDistance$1(3, true);
									for (var $t11 = 0; $t11 < $t10.length; $t11++) {
										var nearby = $t10[$t11];
										if (ss.isValue(nearby.actor()) || nearby.conductsElectricity()) {
											if (added.hasLOE(nearby)) {
												if (ss.isValue(nearby.actor())) {
													bolt_target = nearby.actor();
												}
												else {
													bolt_target = nearby;
												}
												var contains_value = false;
												var $t12 = Object.keys(chain.d).getEnumerator();
												try {
													while ($t12.moveNext()) {
														var k = $t12.get_current();
														var list = chain.d[k];
														for (var $t13 = 0; $t13 < list.length; $t13++) {
															var o = list[$t13];
															if (ss.referenceEquals(o, bolt_target)) {
																contains_value = true;
																break;
															}
														}
														if (contains_value) {
															break;
														}
													}
												}
												finally {
													$t12.dispose();
												}
												if (!Object.keyExists(chain.d, bolt_target) && !contains_value) {
													if (ss.isValue(Type.safeCast(bolt_target, $Forays_Actor))) {
														$Forays_Extensions.addUnique($Forays_Actor).call(null, damage_targets, Type.safeCast(bolt_target, $Forays_Actor));
													}
													done = false;
													if (sort_list.length === 0) {
														sort_list.add(bolt_target);
													}
													else {
														var idx1 = 0;
														for (var $t14 = 0; $t14 < sort_list.length; $t14++) {
															var o1 = sort_list[$t14];
															if (bolt_target.distanceFrom(added) < o1.distanceFrom(added)) {
																sort_list.insert(idx1, bolt_target);
																break;
															}
															++idx1;
														}
														if (idx1 === sort_list.length) {
															sort_list.add(bolt_target);
														}
													}
													if (ss.isNullOrUndefined(chain.get_item(added))) {
														var $t15 = [];
														$t15.add(bolt_target);
														chain.set_item(added, $t15);
													}
													else {
														chain.get_item(added).add(bolt_target);
													}
												}
											}
										}
									}
									for (var $t16 = 0; $t16 < sort_list.length; $t16++) {
										var o2 = sort_list[$t16];
										new_last_added.add(o2);
									}
								}
								if (!done) {
									last_added = new_last_added;
								}
							}
							//whew. the tree structure is complete. start at chain[this] and go from there...
							var frames = new (Type.makeGenericType($Forays_Dict$2, [ss.Int32, Array]))();
							var line_length = new (Type.makeGenericType($Forays_Dict$2, [$Forays_PhysicalObject, ss.Int32]))();
							line_length.set_item(this, 0);
							var $t17 = [];
							$t17.add(this);
							var current = $t17;
							var next1 = [];
							while (current.length > 0) {
								for (var $t18 = 0; $t18 < current.length; $t18++) {
									var o3 = current[$t18];
									if (ss.isValue(chain.get_item(o3))) {
										var $t19 = chain.get_item(o3);
										for (var $t20 = 0; $t20 < $t19.length; $t20++) {
											var o21 = $t19[$t20];
											var bres = o3.getBestLine(o21);
											bres.removeAt(0);
											line_length.set_item(o21, bres.length + line_length.get_item(o3));
											var idx2 = 0;
											for (var $t21 = 0; $t21 < bres.length; $t21++) {
												var t23 = bres[$t21];
												if (ss.isValue(frames.get_item(idx2 + line_length.get_item(o3)))) {
													frames.get_item(idx2 + line_length.get_item(o3)).add(new $Forays_pos(t23.get_row(), t23.get_col()));
												}
												else {
													var $t23 = idx2 + line_length.get_item(o3);
													var $t22 = [];
													$t22.add(new $Forays_pos(t23.get_row(), t23.get_col()));
													frames.set_item($t23, $t22);
												}
												++idx2;
											}
											next1.add(o21);
										}
									}
								}
								current = next1;
								next1 = [];
							}
							var frame = frames.get_item(0);
							for (var i1 = 0; ss.isValue(frame); ++i1) {
								for (var $t24 = 0; $t24 < frame.length; $t24++) {
									var p = frame[$t24];
									$Forays_Screen.writeMapChar$2(p.row, p.col, '*', 18);
								}
								$Forays_Game.game.e.lock();
								window.setTimeout(function() {
									$Forays_Game.game.e.unlock();
								}, 50);
								frame = frames.get_item(i1);
							}
							for (var $t25 = 0; $t25 < damage_targets.length; $t25++) {
								var ac = damage_targets[$t25];
								$Forays_Actor.get_b().add$1('The bolt hits ' + ac.get_the_name() + '. ', ac);
								ac.takeDamage$2(3, 1, $Forays_Global.roll$1(2 + bonus, 6), this, this.get_a_name());
							}
						}
						else {
							this.animateBeam$2(line, '*', 18);
							$Forays_Actor.get_b().add$1('The bolt hits ' + t.get_the_name() + '. ', t);
						}
					}
					else {
						return false;
					}
					break;
				}
				case 8: {
					if (!this.hasAttr(85)) {
						$Forays_Actor.get_b().add('You cast shadowsight. ');
						$Forays_Actor.get_b().add('Your eyes pierce the darkness. ');
						var duration = 10001;
						this.gainAttr$2(85, duration, 'You no longer see as well in darkness. ');
						this.gainAttr(22, duration);
					}
					else {
						$Forays_Actor.get_b().add('Your eyes are already attuned to darkness. ');
						return false;
					}
					break;
				}
				case 9: {
					var targets = [];
					var $t26 = this.actorsWithinDistance$1(2, true);
					for (var $t27 = 0; $t27 < $t26.length; $t27++) {
						var a6 = $t26[$t27];
						if (this.hasLOE(a6)) {
							targets.add(a6);
						}
					}
					$Forays_Actor.get_b().add$1(this.you('cast') + ' voltaic surge. ', this);
					this.animateExplosion(this, 2, 18, '*');
					if (targets.length === 0) {
						$Forays_Actor.get_b().add$1('The air around ' + this.get_the_name() + ' crackles. ', this);
					}
					else {
						while (targets.length > 0) {
							var a7 = $Forays_Extensions.random($Forays_Actor).call(null, targets);
							targets.remove(a7);
							$Forays_Actor.get_b().add$1('Electricity blasts ' + a7.get_the_name() + '. ', a7);
							a7.takeDamage$2(3, 1, $Forays_Global.roll$1(3 + bonus, 6), this, this.get_a_name());
						}
					}
					break;
				}
				case 10: {
					if (ss.isNullOrUndefined(t)) {
						t = this.tileInDirection(this.getDirection());
					}
					if (ss.isValue(t)) {
						var a8 = t.actor();
						$Forays_Actor.get_b().add$1(this.you('cast') + ' magic hammer. ', this);
						$Forays_Actor.get_b().displayNow();
						$Forays_Screen.animateMapCell$1(t.get_row(), t.get_col(), new $Forays_colorchar.$ctor4('*', 7), 100);
						if (ss.isValue(a8)) {
							$Forays_Actor.get_b().add$3(this.you$1('smash', true) + ' ' + a8.theVisible() + '. ', this, a8);
							if (a8.takeDamage$2(9, 1, $Forays_Global.roll$1(4 + bonus, 6), this, this.get_a_name())) {
								a8.gainAttrRefreshDuration$1(27, 201, a8.youAre() + ' no longer stunned. ', [a8]);
								$Forays_Actor.get_b().add$1(a8.youAre() + ' stunned. ', a8);
							}
						}
						else {
							$Forays_Actor.get_b().add('You smash ' + t.get_the_name() + '. ');
						}
					}
					else {
						return false;
					}
					break;
				}
				case 11: {
					$Forays_Actor.get_b().add('You cast retreat. ');
					if (ss.isNullOrUndefined(this.target_location)) {
						this.target_location = $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col());
						$Forays_Actor.get_b().add('You create a rune of transport on ' + $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_the_name() + '. ');
						this.target_location.features.add(4);
					}
					else if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(this.target_location.get_row(), this.target_location.get_col())) && this.target_location.get_passable()) {
						$Forays_Actor.get_b().add('You activate your rune of transport. ');
						this.move(this.target_location.get_row(), this.target_location.get_col());
						this.target_location.features.remove(4);
						this.target_location = null;
					}
					else {
						$Forays_Actor.get_b().add('Something blocks your transport. ');
					}
					break;
				}
				case 12: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' glacial blast. ', this);
						var a9 = this.firstActorInLine$1(line);
						if (ss.isValue(a9)) {
							this.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 17);
							$Forays_Actor.get_b().add$1('The glacial blast hits ' + a9.get_the_name() + '. ', a9);
							a9.takeDamage$2(2, 1, $Forays_Global.roll$1(3 + bonus, 6), this, this.get_a_name());
						}
						else {
							this.animateProjectile$2(line, '*', 17);
							$Forays_Actor.get_b().add$1('The glacial blast hits ' + t.get_the_name() + '. ', t);
						}
					}
					else {
						return false;
					}
					break;
				}
				case 13: {
					var i2 = this.directionOfOnlyUnblocked$1(0, true);
					if (i2 === 0) {
						$Forays_Actor.get_b().add$1('There\'s no wall here. ', this);
						return false;
					}
					else {
						if (ss.isNullOrUndefined(t)) {
							i2 = this.getDirection$2(true, false);
							t = this.tileInDirection(i2);
						}
						else {
							i2 = this.directionOf(t);
						}
						if (ss.isValue(t)) {
							if (t.get_ttype() === 0) {
								$Forays_Actor.get_b().add$1(this.you('cast') + ' passage. ', this);
								var ch = new $Forays_colorchar.$ctor2(8, '!');
								if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
									$Forays_Game.console.cursorVisible = false;
									switch (this.directionOf(t)) {
										case 8:
										case 2: {
											ch.c = '|';
											break;
										}
										case 4:
										case 6: {
											ch.c = '-';
											break;
										}
									}
								}
								var tiles = [];
								var memlist = [];
								while (!t.get_passable()) {
									if (t.get_row() === 0 || t.get_row() === 21 || t.get_col() === 0 || t.get_col() === 65) {
										break;
									}
									if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
										tiles.add(t);
										memlist.add($Forays_Screen.mapChar(t.get_row(), t.get_col()));
										$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), ch);
										$Forays_Game.game.e.lock();
										window.setTimeout(function() {
											$Forays_Game.game.e.unlock();
										}, 35);
										//									Thread.Sleep(35);
									}
									t = t.tileInDirection(i2);
								}
								if (t.get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
									if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
										if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()).get_inv())) {
											$Forays_Screen.writeMapChar(this.get_row(), this.get_col(), new $Forays_colorchar.$ctor2(this.tile().get_inv().get_color(), this.tile().get_inv().get_symbol()));
										}
										else {
											$Forays_Screen.writeMapChar(this.get_row(), this.get_col(), new $Forays_colorchar.$ctor2(this.tile().get_color(), this.tile().get_symbol()));
										}
										$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), new $Forays_colorchar.$ctor2(this.get_color(), this.get_symbol()));
										var j = 0;
										for (var $t28 = 0; $t28 < tiles.length; $t28++) {
											var tile = tiles[$t28];
											$Forays_Screen.writeMapChar(tile.get_row(), tile.get_col(), memlist[j++]);
											$Forays_Game.game.e.lock();
											window.setTimeout(function() {
												$Forays_Game.game.e.unlock();
											}, 35);
											//Thread.Sleep(35);
										}
									}
									this.move(t.get_row(), t.get_col());
									$Forays_PhysicalObject.get_m().draw();
									$Forays_Actor.get_b().add$1(this.you('travel') + ' through the passage. ', this);
								}
								else if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
									var j1 = 0;
									for (var $t29 = 0; $t29 < tiles.length; $t29++) {
										var tile1 = tiles[$t29];
										$Forays_Screen.writeMapChar(tile1.get_row(), tile1.get_col(), memlist[j1++]);
										$Forays_Game.game.e.lock();
										window.setTimeout(function() {
											$Forays_Game.game.e.unlock();
										}, 35);
										//Thread.Sleep(35);
									}
									$Forays_Actor.get_b().add('The passage is blocked. ');
								}
							}
							else {
								if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
									$Forays_Actor.get_b().add$1('There\'s no wall here. ', this);
								}
								return false;
							}
						}
						else {
							return false;
						}
					}
					break;
				}
				case 14: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$4(12, 2);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						var a10 = this.firstActorInLine$1(line);
						if (ss.isValue(a10)) {
							t = a10.tile();
						}
						$Forays_Actor.get_b().add$1(this.you('cast') + ' flashfire. ', this);
						this.animateBoltProjectile$1($Forays_Extensions.toFirstObstruction(line), 3);
						this.animateExplosion$1(t, 2, '*', 16);
						$Forays_Actor.get_b().add$2('Fwoosh! ', [this, t]);
						var targets1 = [];
						var prev = $Forays_Extensions.toFirstObstruction(line)[$Forays_Extensions.toFirstObstruction(line).length - 2];
						var $t30 = t.actorsWithinDistance(2);
						for (var $t31 = 0; $t31 < $t30.length; $t31++) {
							var ac1 = $t30[$t31];
							if (t.get_passable()) {
								if (t.hasBresenhamLine(ac1.get_row(), ac1.get_col())) {
									targets1.add(ac1);
								}
							}
							else if (prev.hasBresenhamLine(ac1.get_row(), ac1.get_col())) {
								targets1.add(ac1);
							}
						}
						var $t32 = t.tilesWithinDistance(2);
						for (var $t33 = 0; $t33 < $t32.length; $t33++) {
							var t24 = $t32[$t33];
							if (t.get_passable()) {
								if (t.hasBresenhamLine(t24.get_row(), t24.get_col())) {
									if (ss.isValue(t24.actor())) {
										targets1.add(t24.actor());
									}
									if (t24.is(1)) {
										t24.features.remove(1);
										$Forays_Actor.get_b().add$1('The troll corpse burns to ashes! ', t24);
									}
									if (t24.is(2)) {
										t24.features.remove(2);
										$Forays_Actor.get_b().add$1('The troll seer corpse burns to ashes! ', t24);
									}
								}
							}
							else if (prev.hasBresenhamLine(t24.get_row(), t24.get_col())) {
								if (ss.isValue(t24.actor())) {
									targets1.add(t24.actor());
								}
								if (t24.is(1)) {
									t24.features.remove(1);
									$Forays_Actor.get_b().add$1('The troll corpse burns to ashes! ', t24);
								}
								if (t24.is(2)) {
									t24.features.remove(2);
									$Forays_Actor.get_b().add$1('The troll seer corpse burns to ashes! ', t24);
								}
							}
						}
						while (targets1.length > 0) {
							var ac2 = $Forays_Extensions.removeRandom($Forays_Actor).call(null, targets1);
							$Forays_Actor.get_b().add$1('The explosion hits ' + ac2.get_the_name() + '. ', ac2);
							ac2.takeDamage$2(1, 1, $Forays_Global.roll$1(3 + bonus, 6), this, this.get_a_name());
						}
					}
					else {
						return false;
					}
					break;
				}
				case 15: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$2(12);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' sonic boom. ', this);
						var a11 = this.firstActorInLine$1(line);
						if (ss.isValue(a11)) {
							this.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '~', 6);
							$Forays_Actor.get_b().add$1('A wave of sound hits ' + a11.get_the_name() + '. ', a11);
							var r = a11.get_row();
							var c = a11.get_col();
							a11.takeDamage$2(9, 1, $Forays_Global.roll$1(3 + bonus, 6), this, this.get_a_name());
							if ($Forays_Global.roll$1(1, 10) <= 5 && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !$Forays_PhysicalObject.get_m().actor.get_item(r, c).hasAttr(27)) {
								$Forays_Actor.get_b().add$1(a11.youAre() + ' stunned. ', a11);
								a11.attrs.set_item(27, a11.attrs.get_item(27) + 1);
								var duration1 = this.durationOfMagicalEffect($Forays_Global.roll$1(1, 4) + 2) * 100;
								$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(a11, duration1, 27, a11.youAre() + ' no longer stunned. ', [a11]));
							}
						}
						else {
							this.animateProjectile$2(line, '~', 6);
							$Forays_Actor.get_b().add('Sonic boom! ');
						}
					}
					else {
						return false;
					}
					break;
				}
				case 16: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget$4(12, -1);
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' collapse. ', this);
						$Forays_Actor.get_b().displayNow();
						for (var dist = 2; dist > 0; --dist) {
							var cells = [];
							var chars = [];
							var p2 = new $Forays_pos(t.get_row() - dist, t.get_col() - dist);
							if (p2.boundsCheck()) {
								cells.add(p2);
								chars.add(new $Forays_colorchar.$ctor4('\\', 11));
							}
							p2 = new $Forays_pos(t.get_row() - dist, t.get_col() + dist);
							if (p2.boundsCheck()) {
								cells.add(p2);
								chars.add(new $Forays_colorchar.$ctor4('/', 11));
							}
							p2 = new $Forays_pos(t.get_row() + dist, t.get_col() - dist);
							if (p2.boundsCheck()) {
								cells.add(p2);
								chars.add(new $Forays_colorchar.$ctor4('/', 11));
							}
							p2 = new $Forays_pos(t.get_row() + dist, t.get_col() + dist);
							if (p2.boundsCheck()) {
								cells.add(p2);
								chars.add(new $Forays_colorchar.$ctor4('\\', 11));
							}
							$Forays_Screen.animateMapCells$1(cells, chars);
						}
						$Forays_Screen.animateMapCell(t.get_row(), t.get_col(), new $Forays_colorchar.$ctor4('X', 11));
						var a12 = t.actor();
						if (ss.isValue(a12)) {
							$Forays_Actor.get_b().add$1('Part of the ceiling falls onto ' + a12.get_the_name() + '. ', a12);
							a12.takeDamage$2(7, 0, $Forays_Global.roll$1(4 + bonus, 6), this, this.get_a_name());
						}
						else if (t.get_row() === 0 || t.get_col() === 0 || t.get_row() === 21 || t.get_col() === 65) {
							$Forays_Actor.get_b().add('The wall resists. ');
						}
						else if (t.get_ttype() === 0 || t.get_ttype() === 20) {
							$Forays_Actor.get_b().add('The wall crashes down! ');
							t.turnToFloor();
							var $t34 = t.tilesAtDistance(1);
							for (var $t35 = 0; $t35 < $t34.length; $t35++) {
								var neighbor = $t34[$t35];
								if (neighbor.get_solid_rock()) {
									neighbor.set_solid_rock(false);
								}
							}
						}
						var open_spaces = [];
						var $t36 = t.tilesWithinDistance(1);
						for (var $t37 = 0; $t37 < $t36.length; $t37++) {
							var neighbor1 = $t36[$t37];
							if (neighbor1.get_passable()) {
								if (ss.isNullOrUndefined(a12) || !ss.referenceEquals(neighbor1, t)) {
									//don't hit the same guy again
									open_spaces.add(neighbor1);
								}
							}
						}
						var count = 4;
						if (open_spaces.length < 4) {
							count = open_spaces.length;
						}
						for (; count > 0; --count) {
							var chosen = $Forays_Extensions.random($Forays_Tile).call(null, open_spaces);
							open_spaces.remove(chosen);
							if (ss.isValue(chosen.actor())) {
								$Forays_Actor.get_b().add$1('A rock falls onto ' + chosen.actor().get_the_name() + '. ', chosen.actor());
								chosen.actor().takeDamage$2(7, 0, $Forays_Global.roll$1(2, 6), this, this.get_a_name());
							}
							else {
								var prev1 = chosen.get_ttype();
								chosen.transformTo(28);
								chosen.toggles_into = prev1;
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				case 17: {
					if (ss.isNullOrUndefined(t)) {
						line = this.getTarget();
						if (ss.isValue(line)) {
							t = $Forays_Extensions.last($Forays_Tile).call(null, line);
						}
					}
					if (ss.isValue(t)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' force beam. ', this);
						$Forays_Actor.get_b().displayNow();
						//List<Tile> line2 = GetBestExtendedLine(t.row,t.col);
						var full_line = line.clone();
						line = $Forays_Extensions.getRange($Forays_Tile).call(null, line, 0, Math.min(13, line.length));
						for (var i3 = 0; i3 < 3; ++i3) {
							//hits thrice
							var firstactor = null;
							var nextactor = null;
							var firsttile = null;
							var nexttile = null;
							for (var $t38 = 0; $t38 < line.length; $t38++) {
								var tile2 = line[$t38];
								if (!tile2.get_passable()) {
									firsttile = tile2;
									break;
								}
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(tile2.get_row(), tile2.get_col())) && !ss.referenceEquals($Forays_PhysicalObject.get_m().actor.get_item(tile2.get_row(), tile2.get_col()), this)) {
									var idx3 = full_line.indexOf(tile2);
									firsttile = tile2;
									firstactor = $Forays_PhysicalObject.get_m().actor.get_item(tile2.get_row(), tile2.get_col());
									nexttile = full_line[idx3 + 1];
									nextactor = $Forays_PhysicalObject.get_m().actor.get_item(nexttile.get_row(), nexttile.get_col());
									break;
								}
							}
							this.animateBoltBeam$1($Forays_Extensions.toFirstObstruction(line), 8);
							if (ss.isValue(firstactor)) {
								var s3 = firstactor.theVisible();
								var s21 = firstactor.get_a_name();
								firstactor.takeDamage$2(9, 1, $Forays_Global.roll$1(1 + bonus, 6), this, this.get_a_name());
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(firsttile.get_row(), firsttile.get_col()))) {
									firstactor.getKnockedBack$1(full_line);
								}
								else if (!nexttile.get_passable()) {
									$Forays_Actor.get_b().add$2(s3 + '\'s corpse is knocked into ' + nexttile.get_the_name() + '. ', [firsttile, nexttile]);
								}
								else if (ss.isValue(nextactor)) {
									$Forays_Actor.get_b().add$2(s3 + '\'s corpse is knocked into ' + nextactor.theVisible() + '. ', [firsttile, nextactor]);
									nextactor.takeDamage$2(0, 0, $Forays_Global.roll$1(1, 6), this, s21 + '\'s falling corpse');
								}
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				case 18: {
					if (ss.isNullOrUndefined(t)) {
						t = this.tileInDirection(this.getDirection());
					}
					if (ss.isValue(t)) {
						var a13 = t.actor();
						if (ss.isValue(a13)) {
							$Forays_Actor.get_b().add$1(this.you('cast') + ' amnesia. ', this);
							//for(int i=0;i<4;++i){
							//List<pos> cells = new List<pos>();
							//List<colorchar> chars = new List<colorchar>();
							//List<pos> nearby = a.p.PositionsWithinDistance(2);
							//for(int j=0;j<4;++j){
							//cells.Add(nearby.RemoveRandom());
							//chars.Add(new colorchar('*',Color.RandomPrismatic));
							//}
							//Screen.AnimateMapCells(cells,chars);
							//}
							a13.animateStorm(2, 4, 4, '*', 19);
							$Forays_Actor.get_b().add('You fade from ' + a13.theVisible() + '\'s awareness. ');
							a13.player_visibility_duration = 0;
							a13.set_target(null);
							a13.target_location = null;
							a13.attrs.set_item(91, a13.attrs.get_item(91) + 1);
						}
						else {
							$Forays_Actor.get_b().add('There\'s nothing to target there. ');
							return false;
						}
					}
					else {
						return false;
					}
					break;
				}
				case 19: {
					var targets2 = this.actorsWithinDistance$1(5, true);
					$Forays_Actor.get_b().add$1(this.you('cast') + ' blizzard. ', this);
					this.animateStorm(5, 8, 24, '*', 17);
					$Forays_Actor.get_b().add$1('A massive ice storm surrounds ' + this.get_the_name() + '. ', this);
					while (targets2.length > 0) {
						var idx4 = $Forays_Global.roll$1(1, targets2.length) - 1;
						var a14 = targets2[idx4];
						targets2.remove(a14);
						$Forays_Actor.get_b().add$1('The blizzard hits ' + a14.get_the_name() + '. ', a14);
						var r1 = a14.get_row();
						var c1 = a14.get_col();
						a14.takeDamage$2(2, 1, $Forays_Global.roll$1(5 + bonus, 6), this, this.get_a_name());
						if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r1, c1)) && $Forays_Global.roll$1(1, 10) <= 8) {
							$Forays_Actor.get_b().add$1(a14.get_the_name() + ' is encased in ice. ', a14);
							a14.attrs.set_item(30, 25);
						}
					}
					break;
				}
				case 20: {
					if (!this.hasAttr(71)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' bless. ', this);
						$Forays_Actor.get_b().add$1(this.you('shine') + ' briefly with inner light. ', this);
						this.attrs.set_item(71, this.attrs.get_item(71) + 1);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor4(this, 400, 71));
					}
					else {
						$Forays_Actor.get_b().add$1(this.youAre() + ' already blessed! ', this);
						return false;
					}
					break;
				}
				case 21: {
					$Forays_Actor.get_b().add$1(this.you('cast') + ' minor heal. ', this);
					$Forays_Actor.get_b().add$1('A bluish glow surrounds ' + this.get_the_name() + '. ', this);
					this.takeDamage$1(5, 2, $Forays_Global.roll$1(4, 6), null);
					break;
				}
				case 22: {
					if (!this.hasAttr(72)) {
						$Forays_Actor.get_b().add$1(this.you('cast') + ' holy shield. ', this);
						$Forays_Actor.get_b().add$1('A fiery halo appears above ' + this.get_the_name() + '. ', this);
						this.attrs.set_item(72, this.attrs.get_item(72) + 1);
						var duration2 = ($Forays_Global.roll$1(3, 2) + 1) * 100;
						$Forays_Actor.get_q().add(new $Forays_Event.$ctorc(this, duration2, 72, this.get_the_name() + '\'s halo fades. ', [this]));
					}
					else {
						$Forays_Actor.get_b().add$1(this.your() + ' holy shield is already active. ', this);
						return false;
					}
					break;
				}
			}
			if (this.get_atype() === 0 && spell !== 18) {
				this.makeNoise();
			}
			if (!force_of_will) {
				if ($Forays_Spell.level(spell) - this.totalSkill(2) > 0) {
					if (this.hasFeat(9)) {
						if ($Forays_Global.coinFlip()) {
							this.magic_penalty++;
							$Forays_Actor.get_b().add$1(this.youFeel() + ' drained. ', this);
						}
						else if (this.get_atype() === 0) {
							$Forays_Actor.get_b().add('You feel lucky. ');
							//punk
						}
					}
					else {
						this.magic_penalty++;
						$Forays_Actor.get_b().add$1(this.youFeel() + ' drained. ', this);
					}
				}
			}
			else {
				this.magic_penalty += 5;
				if (this.magic_penalty > 20) {
					this.magic_penalty = 20;
				}
				$Forays_Actor.get_b().add('You drain your magic reserves. ');
			}
			this.q1();
			return true;
		},
		castRandomSpell: function(obj, spells) {
			if (spells.length === 0) {
				return false;
			}
			return this.castSpell$1(spells[$Forays_Global.roll$1(1, spells.length) - 1], obj);
		},
		failRate: function(spell) {
			var failrate = ($Forays_Spell.level(spell) - this.totalSkill(2)) * 5;
			if (failrate < 0) {
				failrate = 0;
			}
			failrate += this.magic_penalty * 5;
			if (!this.hasFeat(5)) {
				failrate += $Forays_Armor.addedFailRate(this.armors[0]);
			}
			if (failrate > 100) {
				failrate = 100;
			}
			return failrate;
		},
		failColor: function(spell) {
			var failcolor = 1;
			if (this.failRate(spell) > 50) {
				failcolor = 10;
			}
			else if (this.failRate(spell) > 20) {
				failcolor = 3;
			}
			else if (this.failRate(spell) > 0) {
				failcolor = 6;
			}
			return failcolor;
		},
		failColor$1: function(failrate) {
			var failcolor = 1;
			if (failrate > 50) {
				failcolor = 10;
			}
			else if (failrate > 20) {
				failcolor = 3;
			}
			else if (failrate > 0) {
				failcolor = 6;
			}
			return failcolor;
		},
		resetSpells: function() {
			this.magic_penalty = 0;
		},
		resetForNewLevel: function() {
			this.set_target(null);
			this.target_location = null;
			if (this.hasAttr(46)) {
				this.attrs.set_item(46, 0);
				if (this.get_light_radius() > 0) {
					if (this.hasAttr(16)) {
						this.set_light_radius(12);
					}
					else {
						this.set_light_radius(6);
					}
				}
			}
			if (this.attrs.get_item(78) === -1) {
				this.attrs.set_item(78, 0);
			}
			if (this.hasAttr(96)) {
				this.attrs.set_item(96, 0);
			}
			this.resetSpells();
			$Forays_Actor.get_q().killEvents$1(null, 3);
		},
		useFeat: function(feat) {
			switch (feat) {
				case 2: {
					var line = this.getTarget$2(2);
					var t = null;
					if (ss.isValue(line)) {
						t = $Forays_Extensions.last($Forays_Tile).call(null, line);
					}
					if (ss.isValue(t) && ss.isValue(t.actor())) {
						var moved = false;
						//foreach(Tile neighbor in t.NeighborsBetween(row,col)){
						//if(neighbor.passable && neighbor.actor() == null){
						//moved = true;
						//B.Add("You lunge! ");
						//Move(neighbor.row,neighbor.col);
						//attrs[AttrType.BONUS_COMBAT] += 4;
						//Attack(0,t.actor());
						//attrs[AttrType.BONUS_COMBAT] -= 4;
						//break;
						//}
						//}
						if (this.distanceFrom(t) === 2 && line[1].get_passable() && ss.isNullOrUndefined(line[1].actor()) && !this.grabPreventsMovement(line[1])) {
							moved = true;
							$Forays_Actor.get_b().add('You lunge! ');
							this.move(line[1].get_row(), line[1].get_col());
							this.attrs.set_item(98, this.attrs.get_item(98) + 4);
							this.attack(0, t.actor());
							this.attrs.set_item(98, this.attrs.get_item(98) - 4);
						}
						if (!moved) {
							if (this.grabPreventsMovement(line[1])) {
								$Forays_Actor.get_b().add('You can\'t currently reach that spot. ');
								return false;
							}
							else {
								$Forays_Actor.get_b().add('The way is blocked! ');
								return false;
							}
						}
						else {
							this.makeNoise();
							return true;
						}
					}
					else {
						return false;
					}
					//break;
				}
				case 7: {
					this.set_target(null);
					//don't try to automatically pick previous targets while tumbling. this solution isn't ideal.
					var line1 = this.getTarget$5(false, 2, false);
					this.set_target(null);
					//then, don't remember an actor picked as the target of tumble
					var t1 = null;
					if (ss.isValue(line1)) {
						t1 = $Forays_Extensions.last($Forays_Tile).call(null, line1);
					}
					if (ss.isValue(t1) && t1.get_passable() && ss.isNullOrUndefined(t1.actor()) && !this.grabPreventsMovement(t1)) {
						var actors_moved_past = [];
						var moved1 = false;
						var $t1 = t1.neighborsBetween(this.get_row(), this.get_col());
						for (var $t2 = 0; $t2 < $t1.length; $t2++) {
							var neighbor = $t1[$t2];
							if (ss.isValue(neighbor.actor())) {
								actors_moved_past.add(neighbor.actor());
							}
							if (neighbor.get_passable() && !moved1) {
								$Forays_Actor.get_b().add('You tumble. ');
								this.move(t1.get_row(), t1.get_col());
								moved1 = true;
								this.attrs.set_item(83, this.attrs.get_item(83) + 1);
								if (this.hasAttr(32)) {
									//copy&paste happened here: todo, make a single fire-handling method
									this.attrs.set_item(32, 0);
									$Forays_Actor.get_b().add('You stop the flames from spreading. ');
									if (this.hasAttr(33)) {
										this.attrs.set_item(33, 0);
										$Forays_Actor.get_b().add('You stop the flames from spreading. ');
									}
								}
								else if (this.hasAttr(33)) {
									this.attrs.set_item(33, 0);
									$Forays_Actor.get_b().add('You stop the flames from spreading. ');
								}
								else if (this.hasAttr(31)) {
									var update = false;
									var oldradius = this.lightRadius();
									if (this.attrs.get_item(31) > this.get_light_radius()) {
										update = true;
									}
									var i = 2;
									if ($Forays_Global.roll$1(1, 3) === 3) {
										// 1 in 3 times, you don't make progress against the fire
										i = 1;
									}
									this.attrs.set_item(31, this.attrs.get_item(31) - i);
									if (this.attrs.get_item(31) < 0) {
										this.attrs.set_item(31, 0);
									}
									if (update) {
										this.updateRadius(oldradius, this.lightRadius());
									}
									if (this.hasAttr(31)) {
										$Forays_Actor.get_b().add('You put out some of the fire. ');
									}
									else {
										$Forays_Actor.get_b().add('You put out the fire. ');
									}
								}
							}
						}
						if (moved1) {
							for (var $t3 = 0; $t3 < actors_moved_past.length; $t3++) {
								var a = actors_moved_past[$t3];
								var i1 = 10 - $Forays_Global.roll(this.stealth());
								if (i1 < 0) {
									i1 = 0;
								}
								a.player_visibility_duration = i1;
							}
							$Forays_Actor.get_q().add(new $Forays_Event.$ctor5(this, 200, 1));
							return true;
						}
						else {
							$Forays_Actor.get_b().add('The way is blocked! ');
							return false;
						}
					}
					else {
						if (this.grabPreventsMovement(t1)) {
							$Forays_Actor.get_b().add('You can\'t currently reach that spot. ');
						}
						return false;
					}
					//break;
				}
				case 10: {
					if (this.magic_penalty < 20) {
						//if(curhp < maxhp){ here's the old arcane healing feat
						//magic_penalty += 5;
						//if(magic_penalty > 20){
						//magic_penalty = 20;
						//}
						//B.Add("You drain your magic reserves. ");
						//int amount = Global.Roll(TotalSkill(SkillType.MAGIC)/2,6) + 25;
						//TakeDamage(DamageType.HEAL,DamageClass.NO_TYPE,amount,null);
						//if(curhp == maxhp){
						//B.Add("Your wounds close. ");
						//}
						//else{
						//B.Add("Some of your wounds close. ");
						//}
						//}
						//else{
						//B.Add("You're not injured. ");
						//return false;
						//}
						this.magic_penalty += 5;
						if (this.magic_penalty > 20) {
							this.magic_penalty = 20;
						}
						$Forays_Actor.get_b().add('You drain your magic reserves. ');
						var amount = $Forays_Global.roll$1(ss.Int32.div(this.totalSkill(2), 2), 6) + 25;
						if (this.hasAttr(73)) {
							$Forays_Actor.get_b().add('You strengthen your arcane barrier. ');
						}
						else {
							$Forays_Actor.get_b().add('An arcane barrier surrounds you. ');
						}
						this.attrs.set_item(73, this.attrs.get_item(73) + amount);
						$Forays_Actor.get_q().killEvents(this, 73);
						$Forays_Actor.get_q().add(new $Forays_Event.$ctor9(this, 2000, 73, 'Your arcane shield dissolves. '));
					}
					else {
						$Forays_Actor.get_b().add('Your magic reserves are empty! ');
						return false;
					}
					break;
				}
				case 11: {
					var $t4 = this.actorsWithinDistance(2);
					for (var $t5 = 0; $t5 < $t4.length; $t5++) {
						var a1 = $t4[$t5];
						if (a1.hasAttr(75) && a1.hasLOE(this)) {
							if (ss.referenceEquals(this, $Forays_Actor.get_player())) {
								if (this.canSee(a1)) {
									$Forays_Actor.get_b().add(a1.your() + ' presence prevents you from casting! ');
								}
								else {
									$Forays_Actor.get_b().add('Something prevents you from casting! ');
								}
							}
							return false;
						}
					}
					if (this.magic_penalty < 20) {
						var basefail = this.magic_penalty * 5;
						basefail -= this.skills.get_item(3) * 2;
						if (basefail > 100) {
							basefail = 100;
						}
						if (basefail < 0) {
							basefail = 0;
						}
						var ls = [];
						var sp = [];
						var bonus_marked = false;
						for (var $t6 = 0; $t6 < $Forays_Actor.spells_in_order.length; $t6++) {
							var spell = $Forays_Actor.spells_in_order[$t6];
							if (this.hasSpell(spell)) {
								var cs = new $Forays_colorstring.$ctor2($Forays_Spell.name$1(spell).padRight(15) + $Forays_Spell.level(spell).toString().padLeft(3), 2);
								cs.strings.add(new $Forays_cstr.$ctor1(basefail.toString().padLeft(9) + '%', this.failColor$1(basefail)));
								if (this.hasFeat(8) && $Forays_Spell.isDamaging(spell) && !bonus_marked) {
									bonus_marked = true;
									cs = $Forays_colorstring.op_Addition(cs, $Forays_Spell.descriptionWithIncreasedDamage(spell));
								}
								else {
									cs = $Forays_colorstring.op_Addition(cs, $Forays_Spell.description(spell));
								}
								ls.add(cs);
								sp.add(spell);
							}
						}
						if (sp.length > 0) {
							var topborder = new $Forays_colorstring.$ctor2('------------------Level---Fail rate--------Description------------', 2);
							var bottomborder = new $Forays_colorstring.$ctor4('---Force of will fail rate: ', 2, basefail.toString().padLeft(3) + '%', this.failColor$1(basefail), ''.padRight(37, 45), 2);
							var i2 = this.select$6('Use force of will to cast which spell? ', topborder, bottomborder, ls, false, false, true, true, 3);
							if (i2 !== -1) {
								if (true !== this.castSpell$2(sp[i2], true)) {
									this.q0();
									return true;
								}
								else {
									//drained magic is now handled in CastSpell
									return true;
								}
							}
							else {
								this.q0();
								return true;
							}
						}
						else {
							this.q0();
							return true;
						}
					}
					else {
						$Forays_Actor.get_b().add('Your magic reserves are empty! ');
						return false;
					}
				}
				case 17: {
					var dir = this.getDirection$1('Disarm which trap? ');
					if (dir !== -1 && this.tileInDirection(dir).isKnownTrap()) {
						if (ss.isValue(this.actorInDirection(dir))) {
							$Forays_Actor.get_b().add('There is ' + this.actorInDirection(dir).aVisible() + ' in the way. ');
						}
						else {
							if (this.grabPreventsMovement(this.tileInDirection(dir))) {
								$Forays_Actor.get_b().add('You can\'t currently reach that trap. ');
								this.q0();
								return true;
							}
							if ($Forays_Global.roll(5) <= 4) {
								$Forays_Actor.get_b().add('You disarm ' + $Forays_Tile.prototype$1(this.tileInDirection(dir).get_ttype()).get_the_name() + '. ');
								this.tileInDirection(dir).toggle(this);
								this.q1();
							}
							else if ($Forays_Global.roll(20) <= this.skills.get_item(1)) {
								$Forays_Actor.get_b().add('You almost set off ' + $Forays_Tile.prototype$1(this.tileInDirection(dir).get_ttype()).get_the_name() + '! ');
								this.q1();
							}
							else {
								$Forays_Actor.get_b().add('You set off ' + $Forays_Tile.prototype$1(this.tileInDirection(dir).get_ttype()).get_the_name() + '! ');
								this.move(this.tileInDirection(dir).get_row(), this.tileInDirection(dir).get_col());
								this.q1();
							}
						}
					}
					else {
						this.q0();
					}
					return true;
				}
				case 16: {
					var line2 = this.getTarget$4(12, 3);
					var t2 = null;
					if (ss.isValue(line2)) {
						t2 = $Forays_Extensions.last($Forays_Tile).call(null, line2);
					}
					if (ss.isValue(t2)) {
						if (!t2.get_passable()) {
							t2 = $Forays_Extensions.lastBeforeSolidTile(line2);
						}
						$Forays_Actor.get_b().add('You throw a small stone. ');
						var $t7 = t2.actorsWithinDistance(3);
						for (var $t8 = 0; $t8 < $t7.length; $t8++) {
							var a2 = $t7[$t8];
							if (!ss.referenceEquals(a2, this) && a2.player_visibility_duration >= 0) {
								if (a2.hasAttr(89)) {
									$Forays_Actor.get_b().add$1(a2.get_the_name() + ' isn\'t fooled. ', a2);
									a2.player_visibility_duration = 999;
									//automatic detection next turn
								}
								else {
									var p = a2.getPath(t2);
									if (p.length <= 6) {
										a2.path = p;
										if ($Forays_Global.coinFlip()) {
											a2.attrs.set_item(89, a2.attrs.get_item(89) + 1);
										}
									}
								}
							}
						}
					}
					else {
						return false;
					}
					break;
				}
				default: {
					return false;
				}
			}
			this.q1();
			return true;
		},
		interrupt: function() {
			if (this.hasAttr(78)) {
				this.attrs.set_item(78, 0);
			}
			this.attrs.set_item(79, 0);
			this.attrs.set_item(80, 0);
			this.attrs.set_item(81, 0);
			if (ss.isValue(this.path) && this.path.length > 0) {
				this.path.clear();
			}
		},
		stunnedThisTurn: function() {
			if (this.hasAttr(27) && $Forays_Global.oneIn(3)) {
				if (this.hasAttr(12)) {
					this.QS();
					return true;
				}
				var dir = $Forays_Global.randomDirection();
				if (!this.tileInDirection(dir).get_passable()) {
					$Forays_Actor.get_b().add$1(this.you('stagger') + ' into ' + this.tileInDirection(dir).get_the_name() + '. ', this);
				}
				else if (ss.isValue(this.actorInDirection(dir))) {
					$Forays_Actor.get_b().add$2(this.youVisible('stagger') + ' into ' + this.actorInDirection(dir).theVisible() + '. ', [this, this.actorInDirection(dir)]);
				}
				else if (this.grabPreventsMovement(this.tileInDirection(dir))) {
					if (this.get_atype() === 0) {
						$Forays_Actor.get_b().add('You stagger and almost fall over. ');
					}
					else {
						$Forays_Actor.get_b().add$1(this.get_the_name() + ' staggers and almost falls over. ', this);
					}
				}
				else {
					$Forays_Actor.get_b().add$1(this.you('stagger') + '. ', this);
					this.move(this.tileInDirection(dir).get_row(), this.tileInDirection(dir).get_col());
				}
				this.QS();
				return true;
			}
			return false;
		},
		makeNoise: function() {
			var $t1 = this.actorsWithinDistance$1(12, true);
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var a = $t1[$t2];
				if (!ss.referenceEquals(a, $Forays_Actor.get_player())) {
					var heard = false;
					var los = a.hasLOS$1(this.get_row(), this.get_col());
					if (a.distanceFrom(this) <= 4) {
						heard = true;
					}
					else if ((a.isWithinSightRangeOf$1(this.get_row(), this.get_col()) || this.tile().isLit()) && los) {
						heard = true;
					}
					if (heard) {
						a.player_visibility_duration = -1;
						a.attrs.set_item(15, 1);
						if (los) {
							a.target_location = this.tile();
						}
						else {
							a.findPath$1(this, 8);
						}
					}
				}
			}
		},
		updateOnEquip$2: function(from, to) {
			switch (from) {
				case 5: {
					this.attrs.set_item(47, this.attrs.get_item(47) - 1);
					break;
				}
				case 6: {
					this.attrs.set_item(51, this.attrs.get_item(51) - 1);
					break;
				}
				case 7: {
					this.attrs.set_item(49, this.attrs.get_item(49) - 1);
					break;
				}
				case 8: {
					this.attrs.set_item(100, this.attrs.get_item(100) - 1);
					break;
				}
			}
			switch (to) {
				case 5: {
					this.attrs.set_item(47, this.attrs.get_item(47) + 1);
					break;
				}
				case 6: {
					this.attrs.set_item(51, this.attrs.get_item(51) + 1);
					break;
				}
				case 7: {
					this.attrs.set_item(49, this.attrs.get_item(49) + 1);
					break;
				}
				case 8: {
					this.attrs.set_item(100, this.attrs.get_item(100) + 1);
					break;
				}
			}
		},
		updateOnEquip: function(from, to) {
			switch (from) {
				case 3: {
					this.attrs.set_item(102, this.attrs.get_item(102) - 2);
					break;
				}
				case 4: {
					this.attrs.set_item(100, this.attrs.get_item(100) - 1);
					break;
				}
				case 5: {
					this.attrs.set_item(61, this.attrs.get_item(61) - 1);
					this.attrs.set_item(62, this.attrs.get_item(62) - 1);
					this.attrs.set_item(63, this.attrs.get_item(63) - 1);
					break;
				}
			}
			switch (to) {
				case 3: {
					this.attrs.set_item(102, this.attrs.get_item(102) + 2);
					break;
				}
				case 4: {
					this.attrs.set_item(100, this.attrs.get_item(100) + 1);
					break;
				}
				case 5: {
					this.attrs.set_item(61, this.attrs.get_item(61) + 1);
					this.attrs.set_item(62, this.attrs.get_item(62) + 1);
					this.attrs.set_item(63, this.attrs.get_item(63) + 1);
					if (this.hasAttr(31) || this.hasAttr(32) || this.hasAttr(33)) {
						$Forays_Actor.get_b().add('You are no longer on fire. ');
						var oldradius = this.lightRadius();
						this.attrs.set_item(31, 0);
						this.attrs.set_item(32, 0);
						this.attrs.set_item(33, 0);
						if (oldradius !== this.lightRadius()) {
							this.updateRadius(oldradius, this.lightRadius());
						}
					}
					break;
				}
			}
		},
		updateOnEquip$1: function(from, to) {
			switch (from) {
				case 1: {
					this.attrs.set_item(61, this.attrs.get_item(61) - 1);
					this.attrs.set_item(62, this.attrs.get_item(62) - 1);
					this.attrs.set_item(63, this.attrs.get_item(63) - 1);
					break;
				}
			}
			switch (to) {
				case 1: {
					this.attrs.set_item(61, this.attrs.get_item(61) + 1);
					this.attrs.set_item(62, this.attrs.get_item(62) + 1);
					this.attrs.set_item(63, this.attrs.get_item(63) + 1);
					if (this.hasAttr(31) || this.hasAttr(32) || this.hasAttr(33)) {
						$Forays_Actor.get_b().add('You are no longer on fire. ');
						var oldradius = this.lightRadius();
						this.attrs.set_item(31, 0);
						this.attrs.set_item(32, 0);
						this.attrs.set_item(33, 0);
						if (oldradius !== this.lightRadius()) {
							this.updateRadius(oldradius, this.lightRadius());
						}
					}
					break;
				}
			}
		},
		inventoryList: function() {
			var result = [];
			var $t1 = this.get_inv();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var i = $t1[$t2];
				result.add(i.aName());
			}
			return result;
		},
		displayStats: function() {
			this.displayStats$1(false);
		},
		displayStats$1: function(cyan_letters) {
			$Forays_Game.console.cursorVisible = false;
			$Forays_Screen.writeStatsString$1(2, 0, 'HP: ');
			if (this.get_curhp() < 50) {
				if (this.get_curhp() < 20) {
					$Forays_Screen.writeStatsString(2, 4, new $Forays_cstr(10, this.get_curhp().toString() + '  '));
				}
				else {
					$Forays_Screen.writeStatsString(2, 4, new $Forays_cstr(3, this.get_curhp().toString() + '  '));
				}
			}
			else {
				$Forays_Screen.writeStatsString$1(2, 4, this.get_curhp().toString() + '  ');
			}
			$Forays_Screen.writeStatsString$1(3, 0, 'Depth: ' + $Forays_PhysicalObject.get_m().get_current_level() + '  ');
			$Forays_Screen.writeStatsString$1(4, 0, 'AC: ' + this.armorClass() + '  ');
			var magic_item_lines = this.magic_items.length;
			var cs = $Forays_Weapon.statsName(this.weapons[0]);
			cs.s = cs.s.padRight(12);
			$Forays_Screen.writeStatsString(5, 0, cs);
			cs = $Forays_Armor.statsName(this.armors[0]);
			cs.s = cs.s.padRight(12);
			$Forays_Screen.writeStatsString(6, 0, cs);
			var line = 7;
			for (var $t1 = 0; $t1 < this.magic_items.length; $t1++) {
				var m = this.magic_items[$t1];
				cs = $Forays_MagicItem.statsName(m);
				cs.s = cs.s.padRight(12);
				$Forays_Screen.writeStatsString(line, 0, cs);
				++line;
			}
			if (!$Forays_Global.option(4)) {
				//[i]nventory
				//[e]quipment
				//[c]haracter
				//[t]orch off
				//Use [f]eat
				//Cast [z]
				//[s]hoot			here is the full list, to be completed when there's enough room.
				//[a]pply item
				//[g]et item
				//[d]rop item     missing only drop, now. I don't think it really needs a spot.
				//[r]est
				//[w]alk
				//E[x]plore
				//[o]perate
				//[tab] Look
				for (var i = 7 + magic_item_lines; i < 11; ++i) {
					$Forays_Screen.writeStatsString$1(i, 0, ''.padRight(12));
				}
				var commandhints = ['[i]nventory ', '[e]quipment ', '[c]haracter ', 'SPECIAL', 'Use [f]eat  ', 'Cast [z]    ', '[s]hoot     ', '[Tab] Look  ', '[a]pply item', '[g]et item  ', '[r]est      ', '[w]alk      ', 'E[x]plore   ', '[o]perate   '];
				if (this.get_light_radius() > 0) {
					commandhints[3] = '[t]orch off ';
				}
				else {
					commandhints[3] = '[t]orch on  ';
				}
				var lettercolor = (cyan_letters ? 8 : 15);
				var wordcolor = (cyan_letters ? 2 : 9);
				for (var i1 = 0; i1 < commandhints.length; ++i1) {
					var open = commandhints[i1].lastIndexOf('[');
					var front = new $Forays_cstr.$ctor1(commandhints[i1].substring(0, open + 1), wordcolor);
					var close = commandhints[i1].lastIndexOf(']');
					var middle = new $Forays_cstr.$ctor1(commandhints[i1].substring(open + 1, close), lettercolor);
					// was close - open
					var end = new $Forays_cstr.$ctor1(commandhints[i1].substring(close), wordcolor);
					$Forays_Screen.writeString(11 + i1, 0, new $Forays_colorstring.$ctor1([front, middle, end]));
				}
			}
			else {
				for (var i2 = 7 + magic_item_lines; i2 < $Forays_Global.screeN_H; ++i2) {
					$Forays_Screen.writeStatsString$1(i2, 0, ''.padRight(12));
				}
			}
			$Forays_Screen.resetColors();
		},
		displayCharacterInfo: function() {
			this.displayCharacterInfo$1(true);
		},
		displayCharacterInfo$1: function(readkey) {
			this.displayStats();
			for (var i = 1; i < 21; ++i) {
				$Forays_Screen.writeMapString$2(i, 0, ''.padRight($Forays_Actor.$COLS));
			}
			$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
			$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Actor.$COLS, 45));
			var catcolor = 4;
			var s = ('Name: ' + $Forays_Actor.player_name).padRight(33) + 'Turns played: ' + ss.Int32.div($Forays_Actor.get_q().get_turn(), 100);
			$Forays_Screen.writeMapString$2(2, 0, s);
			$Forays_Screen.writeMapString$1(2, 0, new $Forays_cstr(catcolor, 'Name'));
			$Forays_Screen.writeMapString$1(2, 33, new $Forays_cstr(catcolor, 'Turns played'));
			s = 'Trait: ';
			if (this.hasAttr(17)) {
				s = s + 'Magical blood';
			}
			if (this.hasAttr(19)) {
				s = s + 'Tough';
			}
			if (this.hasAttr(18)) {
				s = s + 'Keen eyes';
			}
			if (this.hasAttr(22)) {
				s = s + 'Low light vision';
			}
			if (this.hasAttr(20)) {
				s = s + 'Long stride';
			}
			if (this.hasAttr(21)) {
				s = s + 'Runic birthmark';
			}
			$Forays_Screen.writeMapString$2(5, 0, s);
			$Forays_Screen.writeMapString$1(5, 0, new $Forays_cstr(catcolor, 'Trait'));
			$Forays_Screen.writeMapString$2(8, 0, 'Skills:');
			$Forays_Screen.writeMapString$1(8, 0, new $Forays_cstr(catcolor, 'Skills'));
			var pos = 7;
			for (var sk = 0; sk < 5; ++sk) {
				if (sk === 4 && pos > 50) {
					$Forays_Screen.writeMapString$2(9, 8, 'Stealth(' + this.skills.get_item(4).toString());
					pos = 16 + this.skills.get_item(4).toString().length;
					if (this.hasAttr(102)) {
						$Forays_Screen.writeMapString$1(9, pos, new $Forays_cstr(6, '+' + this.attrs.get_item(102).toString()));
						pos += this.attrs.get_item(102).toString().length + 1;
					}
					$Forays_Screen.writeMapChar$1(9, pos, ')');
				}
				else {
					$Forays_Screen.writeMapString$2(8, pos, ' ' + $Forays_Skill.name$1(sk));
					pos += $Forays_Skill.name$1(sk).length + 1;
					var count1 = this.skills.get_item(sk).toString();
					var count2;
					switch (sk) {
						case 0: {
							count2 = this.attrs.get_item(98).toString();
							break;
						}
						case 1: {
							count2 = this.attrs.get_item(99).toString();
							break;
						}
						case 2: {
							count2 = this.attrs.get_item(100).toString();
							break;
						}
						case 3: {
							count2 = this.attrs.get_item(101).toString();
							break;
						}
						case 4: {
							count2 = this.attrs.get_item(102).toString();
							break;
						}
						default: {
							count2 = 'error';
							break;
						}
					}
					$Forays_Screen.writeMapString$2(8, pos, '(' + count1);
					pos += count1.length + 1;
					if (count2 !== '0') {
						$Forays_Screen.writeMapString$1(8, pos, new $Forays_cstr(6, '+' + count2));
						pos += count2.length + 1;
					}
					$Forays_Screen.writeMapChar$1(8, pos, ')');
					pos++;
				}
			}
			$Forays_Screen.writeMapString$2(11, 0, 'Feats: ');
			$Forays_Screen.writeMapString$1(11, 0, new $Forays_cstr(catcolor, 'Feats'));
			var featlist = '';
			for (var f = 0; f < 20; ++f) {
				if (this.hasFeat(f)) {
					if (featlist.length === 0) {
						//if this is the first one...
						featlist = featlist + $Forays_Feat.name$1(f);
					}
					else {
						featlist = featlist + ', ' + $Forays_Feat.name$1(f);
					}
				}
			}
			var currentrow = 11;
			while (featlist.length > 59) {
				var currentcol = 58;
				while (featlist.charCodeAt(currentcol) !== 44) {
					--currentcol;
				}
				$Forays_Screen.writeMapString$2(currentrow, 7, featlist.substring(0, currentcol + 1));
				featlist = featlist.substring(currentcol + 2);
				++currentrow;
			}
			$Forays_Screen.writeMapString$2(currentrow, 7, featlist);
			$Forays_Screen.writeMapString$2(14, 0, 'Spells: ');
			$Forays_Screen.writeMapString$1(14, 0, new $Forays_cstr(catcolor, 'Spells'));
			var spelllist = '';
			for (var sp = 0; sp < 23; ++sp) {
				if (this.hasSpell(sp)) {
					if (spelllist.length === 0) {
						//if this is the first one...
						spelllist = spelllist + $Forays_Spell.name$1(sp);
					}
					else {
						spelllist = spelllist + ', ' + $Forays_Spell.name$1(sp);
					}
				}
			}
			currentrow = 14;
			while (spelllist.length > 58) {
				var currentcol1 = 57;
				while (spelllist.charCodeAt(currentcol1) !== 44) {
					--currentcol1;
				}
				$Forays_Screen.writeMapString$2(currentrow, 8, spelllist.substring(0, currentcol1 + 1));
				spelllist = spelllist.substring(currentcol1 + 2);
				++currentrow;
			}
			$Forays_Screen.writeMapString$2(currentrow, 8, spelllist);
			$Forays_Screen.resetColors();
			$Forays_Actor.get_b().displayNow$1('Character information: ');
			$Forays_Game.console.cursorVisible = true;
			if (readkey) {
				$Forays_Game.console.readKey(true);
			}
		},
		displayEquipment: function() {
			var new_weapon = this.weapons[0];
			var new_armor = this.armors[0];
			var heldweapon = new (Type.makeGenericType($Forays_Dict$2, [$Forays_WeaponType, $Forays_WeaponType]))();
			var heldarmor = new (Type.makeGenericType($Forays_Dict$2, [$Forays_ArmorType, $Forays_ArmorType]))();
			for (var w = 0; w <= 4; ++w) {
				for (var $t1 = 0; $t1 < this.weapons.length; $t1++) {
					var wt = this.weapons[$t1];
					if ($Forays_Weapon.baseWeapon(wt) === w) {
						heldweapon.set_item(w, wt);
					}
				}
			}
			for (var a = 0; a <= 2; ++a) {
				for (var $t2 = 0; $t2 < this.armors.length; $t2++) {
					var at = this.armors[$t2];
					if ($Forays_Armor.baseArmor(at) === a) {
						heldarmor.set_item(a, at);
					}
				}
			}
			$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
			for (var i = 1; i < 21; ++i) {
				$Forays_Screen.writeMapString$2(i, 0, ''.padRight($Forays_Actor.$COLS));
			}
			var line = 2;
			for (var w1 = 0; w1 <= 4; ++w1) {
				$Forays_Screen.writeMapString$1(line, 11, $Forays_Weapon.equipmentScreenName(heldweapon.get_item(w1)));
				++line;
			}
			line = 2;
			for (var a1 = 0; a1 <= 2; ++a1) {
				$Forays_Screen.writeMapString$1(line, 42, $Forays_Armor.equipmentScreenName(heldarmor.get_item(a1)));
				++line;
			}
			$Forays_Screen.writeMapString$1(9, 1, new $Forays_cstr(10, 'Weapon: '));
			$Forays_Screen.writeMapChar$1(9, 7, ':');
			$Forays_Screen.writeMapString$1(11, 1, new $Forays_cstr(15, 'Armor: '));
			$Forays_Screen.writeMapChar$1(11, 6, ':');
			$Forays_Screen.writeMapString$1(13, 1, new $Forays_cstr(11, 'Magic items: '));
			$Forays_Screen.writeMapChar$1(13, 12, ':');
			line = 13;
			for (var $t3 = 0; $t3 < this.magic_items.length; $t3++) {
				var m = this.magic_items[$t3];
				var s = $Forays_MagicItem.description(m);
				$Forays_Screen.writeMapString$2(line, 14, s[0]);
				$Forays_Screen.writeMapString$2(line + 1, 14, s[1]);
				line += 2;
			}
			var command;
			var done = false;
			while (!done) {
				line = 2;
				for (var w2 = 0; w2 <= 4; ++w2) {
					if (new_weapon === heldweapon.get_item(w2)) {
						$Forays_Screen.writeMapChar$1(line, 5, '>');
						$Forays_Screen.writeMapString$1(line, 7, new $Forays_cstr(3, '[' + String.fromCharCode(w2 + 97) + ']'));
					}
					else {
						$Forays_Screen.writeMapChar$1(line, 5, ' ');
						$Forays_Screen.writeMapString$1(line, 7, new $Forays_cstr(8, '[' + String.fromCharCode(w2 + 97) + ']'));
					}
					++line;
				}
				line = 2;
				for (var a2 = 0; a2 <= 2; ++a2) {
					if (new_armor === heldarmor.get_item(a2)) {
						$Forays_Screen.writeMapChar$1(line, 36, '>');
						$Forays_Screen.writeMapString$1(line, 38, new $Forays_cstr(3, '[' + String.fromCharCode(a2 + 102) + ']'));
					}
					else {
						$Forays_Screen.writeMapChar$1(line, 36, ' ');
						$Forays_Screen.writeMapString$1(line, 38, new $Forays_cstr(8, '[' + String.fromCharCode(a2 + 102) + ']'));
					}
					++line;
				}
				$Forays_Screen.writeMapString$2(9, 9, $Forays_Weapon.description($Forays_Weapon.baseWeapon(new_weapon)).padRight($Forays_Actor.$COLS));
				if (new_weapon !== $Forays_Weapon.baseWeapon(new_weapon)) {
					$Forays_Screen.writeMapString$2(10, 9, $Forays_Weapon.description(new_weapon).padRight($Forays_Actor.$COLS));
				}
				else {
					$Forays_Screen.writeMapString$2(10, 9, ''.padRight($Forays_Actor.$COLS));
				}
				$Forays_Screen.writeMapString$2(11, 8, $Forays_Armor.description($Forays_Armor.baseArmor(new_armor)).padRight($Forays_Actor.$COLS));
				if (new_armor !== $Forays_Armor.baseArmor(new_armor)) {
					$Forays_Screen.writeMapString$2(12, 8, $Forays_Armor.description(new_armor).padRight($Forays_Actor.$COLS));
				}
				else {
					$Forays_Screen.writeMapString$2(12, 8, ''.padRight($Forays_Actor.$COLS));
				}
				if (new_weapon === this.weapons[0] && new_armor === this.armors[0]) {
					$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Actor.$COLS, 45));
				}
				else {
					$Forays_Screen.writeMapString$2(21, 0, '[Enter] to confirm-----'.padLeft(43, 45));
					$Forays_Screen.writeMapString$1(21, 21, new $Forays_cstr(7, 'Enter'));
				}
				$Forays_Screen.resetColors();
				$Forays_Actor.get_b().displayNow$1('Your equipment: ');
				$Forays_Game.console.cursorVisible = true;
				command = $Forays_Game.console.readKey(true);
				var ch = $Forays_Actor.convertInput(command);
				switch (ch) {
					case 'a':
					case 'b':
					case 'c':
					case 'd':
					case 'e':
					case '!':
					case '@':
					case '#':
					case '$':
					case '%': {
						switch (ch) {
							case '!': {
								ch = 'a';
								break;
							}
							case '@': {
								ch = 'b';
								break;
							}
							case '#': {
								ch = 'c';
								break;
							}
							case '$': {
								ch = 'd';
								break;
							}
							case '%': {
								ch = 'e';
								break;
							}
						}
						if (ch.charCodeAt(0) - 97 !== $Forays_Weapon.baseWeapon(new_weapon)) {
							new_weapon = heldweapon.get_item(ch.charCodeAt(0) - 97);
						}
						break;
					}
					case 'f':
					case 'g':
					case 'h':
					case '*':
					case '(':
					case ')': {
						switch (ch) {
							case '*': {
								ch = 'f';
								break;
							}
							case '(': {
								ch = 'g';
								break;
							}
							case ')': {
								ch = 'h';
								break;
							}
						}
						if (ch.charCodeAt(0) - 102 !== $Forays_Armor.baseArmor(new_armor)) {
							new_armor = heldarmor.get_item(ch.charCodeAt(0) - 102);
						}
						break;
					}
					case ' ': {
						new_weapon = this.weapons[0];
						new_armor = this.armors[0];
						done = true;
						break;
					}
					case '\r': {
						done = true;
						break;
					}
					default: {
						break;
					}
				}
			}
			return [$Forays_Weapon.baseWeapon(new_weapon), $Forays_Armor.baseArmor(new_armor)];
		},
		increaseSkill: function(skill) {
			var learned = [];
			this.skills.set_item(skill, this.skills.get_item(skill) + 1);
			$Forays_Actor.get_b().add('You feel a rush of power. ');
			//DisplayStats();
			$Forays_Actor.get_b().printAll();
			var command;
			var feat_increased = 21;
			var done = false;
			while (!done) {
				$Forays_Screen.resetColors();
				$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Actor.$COLS, 45));
				for (var i = 0; i < 4; ++i) {
					var ft = $Forays_Feat.ofSkill(skill, i);
					var featcolor = ((feat_increased === ft) ? 4 : 2);
					var lettercolor = 8;
					var featlevel = ((feat_increased === ft) ? (-this.feats.get_item(ft) + 1) : -this.feats.get_item(ft));
					if (this.hasFeat(ft)) {
						featcolor = 7;
						lettercolor = 10;
						featlevel = $Forays_Feat.maxRank(ft);
					}
					$Forays_Screen.writeMapString$2(1 + i * 5, 0, '[' + String.fromCharCode(i + 97) + '] ');
					$Forays_Screen.writeMapChar$2(1 + i * 5, 1, String.fromCharCode(i + 97), lettercolor);
					$Forays_Screen.writeMapString$3(1 + i * 5, 4, $Forays_Feat.name$1(ft).padRight(21) + '(' + featlevel + '/' + $Forays_Feat.maxRank(ft) + ')', featcolor);
					if ($Forays_Feat.isActivated(ft)) {
						$Forays_Screen.writeMapString$2(1 + i * 5, 30, $Forays_Extensions.padToMapSize('        Active'));
					}
					else {
						$Forays_Screen.writeMapString$2(1 + i * 5, 30, $Forays_Extensions.padToMapSize('        Passive'));
					}
					var desc = $Forays_Feat.description(ft);
					for (var j = 0; j < 4; ++j) {
						if (desc.length > j) {
							$Forays_Screen.writeMapString$2(2 + j + i * 5, 0, '    ' + desc[j].padRight(64));
						}
						else {
							$Forays_Screen.writeMapString$2(2 + j + i * 5, 0, ''.padRight(66));
						}
					}
				}
				if (feat_increased !== 21) {
					$Forays_Screen.writeMapString$2(21, 0, '--Type [a-d] to choose a feat---[?] for help---[Enter] to accept--');
					$Forays_Screen.writeMapChar(21, 8, new $Forays_colorchar.$ctor1(8, 97));
					$Forays_Screen.writeMapChar(21, 10, new $Forays_colorchar.$ctor1(8, 100));
					$Forays_Screen.writeMapChar(21, 33, new $Forays_colorchar.$ctor1(8, 63));
					$Forays_Screen.writeMapString$1(21, 48, new $Forays_cstr(7, 'Enter'));
				}
				else {
					$Forays_Screen.writeMapString$2(21, 0, '--Type [a-d] to choose a feat---[?] for help----------------------');
					$Forays_Screen.writeMapChar(21, 8, new $Forays_colorchar.$ctor1(8, 97));
					$Forays_Screen.writeMapChar(21, 10, new $Forays_colorchar.$ctor1(8, 100));
					$Forays_Screen.writeMapChar(21, 33, new $Forays_colorchar.$ctor1(8, 63));
				}
				$Forays_Actor.get_b().displayNow$1('Your ' + $Forays_Skill.name$1(skill) + ' skill increases to ' + this.skills.get_item(skill) + '. Choose a feat: ');
				if (!$Forays_Help.displayed.get_item(7)) {
					$Forays_Help.tutorialTip(7);
					$Forays_Actor.get_b().displayNow$1('Your ' + $Forays_Skill.name$1(skill) + ' skill increases to ' + this.skills.get_item(skill) + '. Choose a feat: ');
				}
				$Forays_Game.console.cursorVisible = true;
				command = $Forays_Game.console.readKey(true);
				$Forays_Game.console.cursorVisible = false;
				var ch = $Forays_Actor.convertInput(command);
				switch (ch) {
					case 'a':
					case 'b':
					case 'c':
					case 'd': {
						var ft1 = $Forays_Feat.ofSkill(skill, ch.charCodeAt(0) - 97);
						if (feat_increased === ft1) {
							feat_increased = 21;
						}
						else if (feat_increased === 21 && !this.hasFeat(ft1)) {
							feat_increased = ft1;
						}
						break;
					}
					case '?': {
						$Forays_Help.displayHelp$1(2);
						this.displayStats();
						break;
					}
					case '\r': {
						if (feat_increased !== 21) {
							done = true;
						}
						break;
					}
					default: {
						break;
					}
				}
			}
			this.feats.set_item(feat_increased, this.feats.get_item(feat_increased) - 1);
			//negative values are used until you've completely learned a feat
			$Forays_Extensions.addUnique($Forays_FeatType).call(null, $Forays_Actor.partial_feats_in_order, feat_increased);
			if (this.feats.get_item(feat_increased) === -$Forays_Feat.maxRank(feat_increased)) {
				this.feats.set_item(feat_increased, 1);
				$Forays_Actor.partial_feats_in_order.remove(feat_increased);
				$Forays_Actor.feats_in_order.add(feat_increased);
				learned.add('You master the ' + $Forays_Feat.name$1(feat_increased) + ' feat. ');
			}
			else {
				var points = 'points';
				if ($Forays_Feat.maxRank(feat_increased) + this.feats.get_item(feat_increased) === 1) {
					points = 'point';
				}
				if (this.feats.get_item(feat_increased) === -1) {
					learned.add('You start learning the ' + $Forays_Feat.name$1(feat_increased) + ' feat (' + ($Forays_Feat.maxRank(feat_increased) + this.feats.get_item(feat_increased)) + ' ' + points + ' left). ');
				}
				else {
					learned.add('You continue learning the ' + $Forays_Feat.name$1(feat_increased) + ' feat (' + ($Forays_Feat.maxRank(feat_increased) + this.feats.get_item(feat_increased)) + ' ' + points + ' left). ');
				}
			}
			if (skill === 2) {
				var unknown = [];
				var unknownstr = [];
				var $t1 = $Forays_Actor.getSpellTypes();
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var spell = $t1[$t2];
					if (!this.hasSpell(spell) && spell !== 20 && spell !== 21 && spell !== 22 && spell !== 24 && spell !== 23) {
						unknown.add(spell);
						var cs = new $Forays_colorstring();
						cs.strings.add(new $Forays_cstr.$ctor1($Forays_Spell.name$1(spell).padRight(15) + $Forays_Spell.level(spell).toString().padLeft(3), 2));
						var failrate = ($Forays_Spell.level(spell) - this.totalSkill(2)) * 5;
						if (failrate < 0) {
							failrate = 0;
						}
						cs.strings.add(new $Forays_cstr.$ctor1(failrate.toString().padLeft(9) + '%', this.failColor$1(failrate)));
						unknownstr.add($Forays_colorstring.op_Addition(cs, $Forays_Spell.description(spell)));
					}
				}
				for (var i1 = unknown.length + 2; i1 < $Forays_Actor.$ROWS; ++i1) {
					$Forays_Screen.writeMapString$2(i1, 0, ''.padRight($Forays_Actor.$COLS));
				}
				var topborder = new $Forays_colorstring.$ctor2('------------------Level---Fail rate--------Description------------', 2);
				var selection = this.select$6('Learn which spell? ', topborder, new $Forays_colorstring.$ctor4(''.padRight(25, 45) + '[', 2, '?', 8, '] for help'.padRight($Forays_Actor.$COLS, 45), 2), unknownstr, false, true, false, true, 3);
				this.spells.set_item(unknown[selection], 1);
				learned.add('You learn ' + $Forays_Spell.name$1(unknown[selection]) + '. ');
				$Forays_Actor.spells_in_order.add(unknown[selection]);
			}
			if (learned.length > 0) {
				for (var $t3 = 0; $t3 < learned.length; $t3++) {
					var s = learned[$t3];
					$Forays_Actor.get_b().add(s);
				}
			}
		},
		canSee$1: function(r, c) {
			return this.canSee($Forays_PhysicalObject.get_m().tile.get_item(r, c));
		},
		canSee: function(o) {
			if (ss.referenceEquals(o, this)) {
				return true;
			}
			if (this.hasAttr(37)) {
				return false;
			}
			var a = Type.safeCast(o, $Forays_Actor);
			if (ss.isValue(a)) {
				if (this.hasAttr(41) && !a.hasAttr(1) && !a.hasAttr(2)) {
					var distance_of_closest = 99;
					var $t1 = this.actorsWithinDistance$1(12, true);
					for (var $t2 = 0; $t2 < $t1.length; $t2++) {
						var a2 = $t1[$t2];
						if (!a2.hasAttr(1) && !a2.hasAttr(2)) {
							if (this.distanceFrom(a2) < distance_of_closest) {
								distance_of_closest = this.distanceFrom(a2);
							}
						}
					}
					if (distance_of_closest === this.distanceFrom(a)) {
						return true;
					}
				}
				if (this.hasAttr(40)) {
					return true;
				}
				if (a.hasAttr(13) && !a.tile().isLit() && !this.hasAttr(8)) {
					if (!ss.referenceEquals(a, $Forays_Actor.get_player()) || !this.hasAttr(15)) {
						//player is visible once noticed
						return false;
					}
				}
			}
			var t = Type.safeCast(o, $Forays_Tile);
			if (ss.isValue(t)) {
				if (t.get_solid_rock()) {
					return false;
				}
			}
			if (this.isWithinSightRangeOf$1(o.get_row(), o.get_col()) || $Forays_PhysicalObject.get_m().tile.get_item(o.get_row(), o.get_col()).isLit()) {
				if (this.hasLOS$1(o.get_row(), o.get_col())) {
					if (Type.isInstanceOfType(o, $Forays_Actor)) {
						if (Type.safeCast(o, $Forays_Actor).isHiddenFrom(this)) {
							return false;
						}
						return true;
					}
					else {
						return true;
					}
				}
			}
			return false;
		},
		sightRange: function() {
			var divisor = (this.hasAttr(45) ? 3 : 1);
			if (this.hasAttr(23)) {
				return ss.Int32.div(8, divisor);
			}
			if (this.hasAttr(22)) {
				return ss.Int32.div(5, divisor);
			}
			return ss.Int32.div(3, divisor);
		},
		isWithinSightRangeOf: function(o) {
			return this.isWithinSightRangeOf$1(o.get_row(), o.get_col());
		},
		isWithinSightRangeOf$1: function(r, c) {
			var dist = this.distanceFrom$2(r, c);
			var divisor = (this.hasAttr(45) ? 3 : 1);
			if (dist <= ss.Int32.div(3, divisor)) {
				return true;
			}
			if (dist <= ss.Int32.div(5, divisor) && this.hasAttr(22)) {
				return true;
			}
			if (dist <= ss.Int32.div(8, divisor) && this.hasAttr(23)) {
				return true;
			}
			if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_opaque()) {
				var $t1 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).neighborsBetween(this.get_row(), this.get_col());
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (this.isWithinSightRangeOf$1(t.get_row(), t.get_col())) {
						return true;
					}
				}
			}
			return false;
		},
		isHiddenFrom: function(a) {
			if (ss.referenceEquals(this, a)) {
				//you can always see yourself
				return false;
			}
			//if(a.HasAttr(AttrType.ASLEEP)){ //todo: testing this
			//	return true;
			//}
			if (this.hasAttr(13) && !this.tile().isLit() && !a.hasAttr(8)) {
				if (ss.referenceEquals(this, $Forays_Actor.get_player()) && !a.hasAttr(15)) {
					//monsters aren't hidden from each other
					return true;
				}
				if (ss.referenceEquals(a, $Forays_Actor.get_player()) && !this.hasAttr(14)) {
					return true;
				}
			}
			if (this.get_atype() === 0) {
				if (a.player_visibility_duration < 0) {
					return false;
				}
				return true;
			}
			else {
				if (a.get_atype() !== 0) {
					//monsters are never hidden from each other
					return false;
				}
				if (this.hasAttr(0) && this.attrs.get_item(77) >= 0) {
					return true;
				}
				return false;
			}
		},
		findPath: function(o) {
			this.path = this.getPath(o);
		},
		findPath$1: function(o, max_distance) {
			this.path = this.getPath$1(o, max_distance);
		},
		findPath$3: function(o, max_distance, path_around_seen_traps) {
			this.path = this.getPath$3(o, max_distance, path_around_seen_traps);
		},
		findPath$2: function(r, c) {
			this.path = this.getPath$2(r, c);
		},
		findPath$4: function(r, c, max_distance) {
			this.path = this.getPath$4(r, c, max_distance);
		},
		findPath$5: function(r, c, max_distance, path_around_seen_traps) {
			this.path = this.getPath$5(r, c, max_distance, path_around_seen_traps);
		},
		getPath: function(o) {
			return this.getPath$5(o.get_row(), o.get_col(), -1, false);
		},
		getPath$1: function(o, max_distance) {
			return this.getPath$5(o.get_row(), o.get_col(), max_distance, false);
		},
		getPath$3: function(o, max_distance, path_around_seen_traps) {
			return this.getPath$5(o.get_row(), o.get_col(), max_distance, path_around_seen_traps);
		},
		getPath$2: function(r, c) {
			return this.getPath$5(r, c, -1, false);
		},
		getPath$4: function(r, c, max_distance) {
			return this.getPath$5(r, c, max_distance, false);
		},
		getPath$5: function(r, c, max_distance, path_around_seen_traps) {
			//tiles past this distance are ignored entirely
			var path = [];
			var values = Array.multidim(ss.Int32.getDefaultValue(), $Forays_Actor.$ROWS, $Forays_Actor.$COLS);
			for (var i = 0; i < $Forays_Actor.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Actor.$COLS; ++j) {
					if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_passable() || this.hasAttr(6) && $Forays_PhysicalObject.get_m().tile.get_item(i, j).is$1(3) || this.hasAttr(107) && $Forays_PhysicalObject.get_m().tile.get_item(i, j).is$1(20)) {
						if (path_around_seen_traps && $Forays_PhysicalObject.get_m().tile.get_item(i, j).isKnownTrap()) {
							values.set(i, j, -1);
						}
						else {
							values.set(i, j, 0);
						}
						if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_ttype() === 35) {
							//don't path over chasms
							values.set(i, j, -1);
						}
					}
					else {
						values.set(i, j, -1);
					}
				}
			}
			var minrow = Math.max(1, this.get_row() - max_distance);
			var maxrow = Math.min(20, this.get_row() + max_distance);
			var mincol = Math.max(1, this.get_col() - max_distance);
			var maxcol = Math.min(64, this.get_col() + max_distance);
			if (max_distance === -1) {
				minrow = 1;
				maxrow = 20;
				mincol = 1;
				maxcol = 64;
			}
			values.set(this.get_row(), this.get_col(), 1);
			var val = 1;
			var done = false;
			while (!done) {
				for (var i1 = minrow; !done && i1 <= maxrow; ++i1) {
					for (var j1 = mincol; !done && j1 <= maxcol; ++j1) {
						if (values.get(i1, j1) === val) {
							for (var s = i1 - 1; !done && s <= i1 + 1; ++s) {
								for (var t = j1 - 1; !done && t <= j1 + 1; ++t) {
									if (s !== i1 || t !== j1) {
										if (values.get(s, t) === 0) {
											values.set(s, t, val + 1);
											if (s === r && t === c) {
												//if we've found the target..
												done = true;
												path.add(new $Forays_pos(s, t));
											}
										}
									}
								}
							}
						}
					}
				}
				++val;
				if (val > 1000) {
					//not sure what this value should be
					path.clear();
					return path;
				}
			}
			//val is now equal to the value of the target's position
			var p = path[0];
			for (var i2 = val - 1; i2 > 1; --i2) {
				var best = null;
				var $t1 = p.positionsAtDistance(1);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var neighbor = $t1[$t2];
					if (values.get(neighbor.row, neighbor.col) === i2) {
						if (ss.isNullOrUndefined(best)) {
							best = neighbor;
						}
						else if (neighbor.estimatedEuclideanDistanceFromX10$1(p) < best.estimatedEuclideanDistanceFromX10$1(p)) {
							best = neighbor;
						}
					}
				}
				if (ss.isNullOrUndefined(best)) {
					//<--hope this doesn't happen
					path.clear();
					return path;
				}
				p = best;
				path.add(p);
			}
			path.reverse();
			if (this.distanceFrom$1(path[0]) > 1) {
				throw new ss.Exception('too far away');
			}
			return path;
		},
		findAutoexplorePath: function() {
			//returns true if successful
			var path = [];
			var values = Array.multidim(ss.Int32.getDefaultValue(), $Forays_Actor.$ROWS, $Forays_Actor.$COLS);
			for (var i = 0; i < $Forays_Actor.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Actor.$COLS; ++j) {
					if (!$Forays_PhysicalObject.get_m().tile.get_item(i, j).get_passable() && !($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_ttype() === 3)) {
						//default is 0 of course
						values.set(i, j, -1);
					}
					if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).isKnownTrap()) {
						values.set(i, j, -1);
					}
					if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_ttype() === 35) {
						values.set(i, j, -1);
					}
				}
			}
			var minrow = 1;
			var maxrow = 20;
			var mincol = 1;
			var maxcol = 64;
			values.set(this.get_row(), this.get_col(), 1);
			var val = 1;
			var val_plus_one = false;
			//a bit hacky; changes based on whether you're going to an item or not.
			var frontiers = [];
			while (frontiers.length === 0) {
				for (var i1 = minrow; i1 <= maxrow; ++i1) {
					for (var j1 = mincol; j1 <= maxcol; ++j1) {
						if (values.get(i1, j1) === val) {
							for (var s = i1 - 1; s <= i1 + 1; ++s) {
								for (var t = j1 - 1; t <= j1 + 1; ++t) {
									if (s !== i1 || t !== j1) {
										if (values.get(s, t) === 0) {
											values.set(s, t, val + 1);
											if (!$Forays_PhysicalObject.get_m().tile.get_item(s, t).get_seen() && ($Forays_PhysicalObject.get_m().tile.get_item(s, t).get_passable() || $Forays_PhysicalObject.get_m().tile.get_item(s, t).get_ttype() === 3)) {
												//frontiers.AddUnique(new pos(i,j));
												$Forays_Extensions.addUnique($Forays_pos).call(null, frontiers, new $Forays_pos(s, t));
												val_plus_one = true;
											}
											if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(s, t).get_inv()) && !$Forays_PhysicalObject.get_m().tile.get_item(s, t).get_inv().get_ignored()) {
												$Forays_Extensions.addUnique($Forays_pos).call(null, frontiers, new $Forays_pos(s, t));
												val_plus_one = true;
											}
										}
									}
								}
							}
						}
					}
				}
				++val;
				if (val > 1000) {
					//not sure what this value should be
					this.path.clear();
					return false;
				}
			}
			if (val_plus_one) {
				++val;
			}
			//val is now equal to the value of the unseen tile's position
			var frontier = new $Forays_pos(-1, -1);
			var unseen_tiles = 9;
			for (var $t1 = 0; $t1 < frontiers.length; $t1++) {
				var p = frontiers[$t1];
				var total = 0;
				var $t2 = p.positionsAtDistance(1);
				for (var $t3 = 0; $t3 < $t2.length; $t3++) {
					var neighbor = $t2[$t3];
					if (!$Forays_PhysicalObject.get_m().tile.get_item$1(neighbor).get_seen() && ($Forays_PhysicalObject.get_m().tile.get_item$1(neighbor).get_passable() || $Forays_PhysicalObject.get_m().tile.get_item$1(neighbor).get_ttype() === 3)) {
						++total;
					}
				}
				if (total < unseen_tiles) {
					unseen_tiles = total;
					frontier = p;
				}
			}
			path.add(frontier);
			var current = frontier;
			for (var i2 = val - 2; i2 > 1; --i2) {
				var best = null;
				var $t4 = current.positionsAtDistance(1);
				for (var $t5 = 0; $t5 < $t4.length; $t5++) {
					var neighbor1 = $t4[$t5];
					if (values.get(neighbor1.row, neighbor1.col) === i2) {
						//forgot to use the PosArray type for values, whoops
						if (ss.isNullOrUndefined(best)) {
							best = neighbor1;
						}
						else if (neighbor1.estimatedEuclideanDistanceFromX10$1(current) < best.estimatedEuclideanDistanceFromX10$1(current)) {
							best = neighbor1;
						}
					}
				}
				if (ss.isNullOrUndefined(best)) {
					//<--hope this doesn't happen
					this.path.clear();
					return false;
				}
				current = best;
				path.add(current);
			}
			path.reverse();
			this.path = path;
			return true;
		},
		enemiesAdjacent: function() {
			//currently counts ALL actors adjacent, and as such really only applies to the player.
			var count = -1;
			//don't count self
			for (var i = this.get_row() - 1; i <= this.get_row() + 1; ++i) {
				for (var j = this.get_col() - 1; j <= this.get_col() + 1; ++j) {
					if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i, j))) {
						//no bounds check, actors shouldn't be on edge tiles.
						++count;
					}
				}
			}
			return count;
		},
		getDirection: function() {
			return this.getDirection$3('Which direction? ', false, false);
		},
		getDirection$2: function(orth, allow_self_targeting) {
			return this.getDirection$3('Which direction? ', orth, allow_self_targeting);
		},
		getDirection$1: function(s) {
			return this.getDirection$3(s, false, false);
		},
		getDirection$3: function(s, orth, allow_self_targeting) {
			$Forays_Actor.get_b().displayNow$1(s);
			var command;
			var ch;
			$Forays_Game.console.cursorVisible = true;
			while (true) {
				command = $Forays_Game.console.readKey(true);
				ch = $Forays_Actor.convertInput(command);
				if (command.keyChar === 46) {
					ch = '5';
				}
				ch = $Forays_Actor.convertVIKeys(ch);
				var i = ch.charCodeAt(0);
				if (i >= 49 && i <= 57) {
					if (i !== 53) {
						if (!orth || (i - 48) % 2 === 0) {
							//in orthogonal mode, return only even dirs
							$Forays_Game.console.cursorVisible = false;
							return i;
						}
					}
					else if (allow_self_targeting) {
						$Forays_Game.console.cursorVisible = false;
						return i;
					}
				}
				if (ss.referenceEquals(ch, String.fromCharCode(27))) {
					//escape
					$Forays_Game.console.cursorVisible = false;
					return -1;
				}
				if (ch === ' ') {
					$Forays_Game.console.cursorVisible = false;
					return -1;
				}
			}
		},
		getTarget: function() {
			return this.getTarget$5(false, -1, true);
		},
		getTarget$1: function(lookmode) {
			return this.getTarget$5(lookmode, -1, !lookmode);
		},
		getTarget$2: function(max_distance) {
			return this.getTarget$5(false, max_distance, true);
		},
		getTarget$4: function(max_distance, radius) {
			return this.getTarget$6(false, max_distance, true, radius);
		},
		getTarget$3: function(lookmode, max_distance) {
			return this.getTarget$5(lookmode, max_distance, !lookmode);
		},
		getTarget$5: function(lookmode, max_distance, start_at_interesting_target) {
			return this.getTarget$6(lookmode, max_distance, start_at_interesting_target, 0);
		},
		getTarget$6: function(lookmode, max_distance, start_at_interesting_target, radius) {
			var result = null;
			var command;
			var r, c;
			var minrow = 0;
			var maxrow = 21;
			var mincol = 0;
			var maxcol = 65;
			if (max_distance > 0) {
				minrow = Math.max(minrow, this.get_row() - max_distance);
				maxrow = Math.min(maxrow, this.get_row() + max_distance);
				mincol = Math.max(mincol, this.get_col() - max_distance);
				maxcol = Math.min(maxcol, this.get_col() + max_distance);
			}
			var allow_targeting_ground = false;
			var hide_descriptions = false;
			if (radius < 0) {
				if (radius !== -1) {
					//negative radius is a hacky signal value
					radius = -radius;
				}
				allow_targeting_ground = true;
			}
			var interesting_targets = [];
			var target_idx = 0;
			for (var i = 1; (i <= max_distance || max_distance === -1) && i <= $Forays_Actor.$COLS; ++i) {
				var $t1 = this.actorsAtDistance(i);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var a = $t1[$t2];
					if (this.canSee(a)) {
						if (lookmode || (this.isWithinSightRangeOf(a) || a.tile().isLit()) && this.hasLOS(a)) {
							interesting_targets.add(a);
						}
					}
				}
			}
			if (lookmode) {
				for (var i1 = 1; (i1 <= max_distance || max_distance === -1) && i1 <= $Forays_Actor.$COLS; ++i1) {
					var $t3 = this.tilesAtDistance(i1);
					for (var $t4 = 0; $t4 < $t3.length; $t4++) {
						var t = $t3[$t4];
						if (t.get_ttype() === 4 || t.get_ttype() === 5 || t.is(0) || t.get_ttype() === 6 || t.is(3) || t.get_ttype() === 7 || t.is(1) || t.is(2) || t.is(4) || t.is$1(29) || t.is(6) || t.is(5) || t.is(8) || t.is(9) || t.is(10) || t.is$1(32) || t.is$1(31) || t.is$1(33) || t.isShrine() || ss.isValue(t.get_inv())) {
							if (this.canSee(t)) {
								interesting_targets.add(t);
							}
						}
						if (lookmode && t.isKnownTrap() && this.canSee(t)) {
							$Forays_Extensions.addUnique($Forays_PhysicalObject).call(null, interesting_targets, t);
						}
					}
				}
			}
			var mem = Array.multidim($Forays_colorchar.getDefaultValue(), $Forays_Actor.$ROWS, $Forays_Actor.$COLS);
			var line = [];
			var oldline = [];
			var description_shown_last_time = false;
			var desc_row = -1;
			var desc_col = -1;
			var desc_height = -1;
			var desc_width = -1;
			for (var i2 = 0; i2 < $Forays_Actor.$ROWS; ++i2) {
				for (var j = 0; j < $Forays_Actor.$COLS; ++j) {
					mem.set(i2, j, $Forays_Screen.mapChar(i2, j));
				}
			}
			if (!start_at_interesting_target || interesting_targets.length === 0) {
				if (lookmode) {
					$Forays_Actor.get_b().displayNow$1('Move the cursor to look around. ');
				}
				else {
					$Forays_Actor.get_b().displayNow$1('Move cursor to choose target, then press Enter. ');
				}
			}
			if (lookmode) {
				if (!start_at_interesting_target || interesting_targets.length === 0) {
					r = this.get_row();
					c = this.get_col();
					target_idx = -1;
				}
				else {
					r = interesting_targets[0].get_row();
					c = interesting_targets[0].get_col();
				}
			}
			else if (ss.isNullOrUndefined(this.get_target()) || !this.canSee(this.get_target()) || max_distance > 0 && this.distanceFrom(this.get_target()) > max_distance) {
				if (!start_at_interesting_target || interesting_targets.length === 0) {
					r = this.get_row();
					c = this.get_col();
					target_idx = -1;
				}
				else {
					r = interesting_targets[0].get_row();
					c = interesting_targets[0].get_col();
				}
			}
			else {
				r = this.get_target().get_row();
				c = this.get_target().get_col();
				if ($Forays_Global.option(0)) {
					//return M.tile[r,c];
					var bestline = this.getBestExtendedLine(this.get_target());
					bestline = $Forays_Extensions.toFirstSolidTile(bestline);
					if (bestline.length > max_distance + 1) {
						bestline.removeRange(max_distance + 1, bestline.length - max_distance - 1);
					}
					return bestline;
				}
				target_idx = interesting_targets.indexOf(this.get_target());
			}
			var first_iteration = true;
			var done = false;
			//when done==true, we're ready to return 'result'
			while (!done) {
				if (!done) {
					//i moved this around, thus this relic.
					$Forays_Screen.resetColors();
					var contents = 'You see ';
					var items = [];
					if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !ss.referenceEquals($Forays_PhysicalObject.get_m().actor.get_item(r, c), this) && this.canSee($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
						items.add($Forays_PhysicalObject.get_m().actor.get_item(r, c).get_a_name() + ' ' + $Forays_PhysicalObject.get_m().actor.get_item(r, c).woundStatus());
					}
					if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv())) {
						items.add($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv().aName());
					}
					var $t5 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).features;
					for (var $t6 = 0; $t6 < $t5.length; $t6++) {
						var f = $t5[$t6];
						items.add($Forays_Tile.feature(f).get_a_name());
					}
					if (items.length === 0) {
						contents += $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_a_name();
					}
					else if (items.length === 1) {
						contents += items[0] + $Forays_PhysicalObject.get_m().tile.get_item(r, c).preposition() + $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_a_name();
					}
					else if (items.length === 2) {
						if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() !== 1) {
							if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).preposition() === ' and ') {
								contents += items[0] + ', ' + items[1] + ',';
								contents += $Forays_PhysicalObject.get_m().tile.get_item(r, c).preposition() + $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_a_name();
							}
							else {
								contents += items[0] + ' and ' + items[1];
								contents += $Forays_PhysicalObject.get_m().tile.get_item(r, c).preposition() + $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_a_name();
							}
						}
						else {
							contents += items[0] + ' and ' + items[1];
						}
					}
					else {
						for (var $t7 = 0; $t7 < items.length; $t7++) {
							var s = items[$t7];
							if (!ss.referenceEquals(s, $Forays_Extensions.last(String).call(null, items))) {
								contents += s + ', ';
							}
							else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() !== 1) {
								contents += s + ',';
								//because preposition contains a space already
							}
							else {
								contents += 'and ' + s;
							}
						}
						if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() !== 1) {
							contents += $Forays_PhysicalObject.get_m().tile.get_item(r, c).preposition() + $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_a_name();
						}
					}
					if (r === this.get_row() && c === this.get_col()) {
						if (!first_iteration) {
							var s1 = 'You\'re standing here. ';
							if (items.length === 0 && $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_ttype() === 1) {
								$Forays_Actor.get_b().displayNow$1(s1);
							}
							else {
								$Forays_Actor.get_b().displayNow$1(s1 + contents + ' here. ');
							}
						}
					}
					else if (this.canSee($Forays_PhysicalObject.get_m().tile.get_item(r, c))) {
						$Forays_Actor.get_b().displayNow$1(contents + '. ');
					}
					else if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && this.canSee($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
						$Forays_Actor.get_b().displayNow$1('You sense ' + $Forays_PhysicalObject.get_m().actor.get_item(r, c).get_a_name() + ' ' + $Forays_PhysicalObject.get_m().actor.get_item(r, c).woundStatus() + '. ');
					}
					else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_seen()) {
						$Forays_Actor.get_b().displayNow$1('You can no longer see this ' + $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_name() + '. ');
					}
					else if (lookmode) {
						$Forays_Actor.get_b().displayNow$1('');
					}
					else {
						$Forays_Actor.get_b().displayNow$1('Move cursor to choose target, then press Enter. ');
					}
					if (!lookmode) {
						var blocked = false;
						$Forays_Game.console.cursorVisible = false;
						line = this.getBestLineOfEffect$1(r, c);
						//Tile last_good = tile();
						for (var $t8 = 0; $t8 < line.length; $t8++) {
							var t1 = line[$t8];
							if (t1.get_row() !== this.get_row() || t1.get_col() !== this.get_col()) {
								var cch = mem.get(t1.get_row(), t1.get_col());
								if (t1.get_row() === r && t1.get_col() === c) {
									if (!blocked) {
										cch.bgcolor = 4;
										if ($Forays_Global.LINUX) {
											//no bright bg in terminals
											cch.bgcolor = 11;
										}
										if (cch.color === cch.bgcolor) {
											cch.color = 0;
										}
										$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), cch);
									}
									else {
										cch.bgcolor = 3;
										if ($Forays_Global.LINUX) {
											cch.bgcolor = 10;
										}
										if (cch.color === cch.bgcolor) {
											cch.color = 0;
										}
										$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), cch);
									}
								}
								else if (!blocked) {
									cch.bgcolor = 11;
									if (cch.color === cch.bgcolor) {
										cch.color = 0;
									}
									$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), cch);
								}
								else {
									cch.bgcolor = 10;
									if (cch.color === cch.bgcolor) {
										cch.color = 0;
									}
									$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), cch);
								}
								//if(!blocked){
								//last_good = t;
								//}
								if (t1.get_seen() && !t1.get_passable() && (t1.get_row() !== r || t1.get_col() !== c)) {
									blocked = true;
								}
							}
							oldline.remove(t1);
						}
						if (radius > 0) {
							var $t9 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).tilesWithinDistance$1(radius, true);
							for (var $t10 = 0; $t10 < $t9.length; $t10++) {
								var t2 = $t9[$t10];
								if (!line.contains(t2)) {
									var cch1 = mem.get(t2.get_row(), t2.get_col());
									if (blocked) {
										cch1.bgcolor = 10;
									}
									else {
										cch1.bgcolor = 11;
									}
									if (cch1.color === cch1.bgcolor) {
										cch1.color = 0;
									}
									$Forays_Screen.writeMapChar(t2.get_row(), t2.get_col(), cch1);
									oldline.remove(t2);
								}
							}
						}
					}
					else {
						var cch2 = mem.get(r, c);
						cch2.bgcolor = 4;
						if ($Forays_Global.LINUX) {
							//no bright bg in terminals
							cch2.bgcolor = 11;
						}
						if (cch2.color === cch2.bgcolor) {
							cch2.color = 0;
						}
						$Forays_Screen.writeMapChar(r, c, cch2);
						var $t11 = [];
						$t11.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						line = $t11;
						oldline.remove($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						if (!hide_descriptions && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && !ss.referenceEquals($Forays_PhysicalObject.get_m().actor.get_item(r, c), this) && this.canSee($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
							var description_on_right = false;
							var max_length = 29;
							if (c - 6 < max_length) {
								max_length = c - 6;
							}
							if (max_length < 20) {
								description_on_right = true;
								max_length = 29;
							}
							var desc = $Forays_Actor.monsterDescriptionBox($Forays_PhysicalObject.get_m().actor.get_item(r, c).get_atype(), max_length);
							if (description_on_right) {
								var start_c = $Forays_Actor.$COLS - desc[0].length();
								description_shown_last_time = true;
								desc_row = 0;
								desc_col = start_c;
								desc_height = desc.length;
								desc_width = desc[0].length();
								for (var i3 = 0; i3 < desc.length; ++i3) {
									$Forays_Screen.writeMapString(i3, start_c, desc[i3]);
									//for(int j=start_c;j<COLS;++j){
									//line.Add(M.tile[i,j]);
									//oldline.Remove(M.tile[i,j]);
									//}
								}
							}
							else {
								description_shown_last_time = true;
								desc_row = 0;
								desc_col = 0;
								desc_height = desc.length;
								desc_width = desc[0].length();
								for (var i4 = 0; i4 < desc.length; ++i4) {
									$Forays_Screen.writeMapString(i4, 0, desc[i4]);
									//int length = desc[0].Length();
									//for(int j=0;j<length;++j){
									//line.Add(M.tile[i,j]);
									//oldline.Remove(M.tile[i,j]);
									//}
								}
							}
						}
						else {
							//description_shown_last_time = false;
						}
					}
					for (var $t12 = 0; $t12 < oldline.length; $t12++) {
						var t3 = oldline[$t12];
						$Forays_Screen.writeMapChar(t3.get_row(), t3.get_col(), mem.get(t3.get_row(), t3.get_col()));
					}
					oldline = line.clone();
					if (radius > 0) {
						var $t13 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).tilesWithinDistance$1(radius, true);
						for (var $t14 = 0; $t14 < $t13.length; $t14++) {
							var t4 = $t13[$t14];
							$Forays_Extensions.addUnique($Forays_Tile).call(null, oldline, t4);
						}
					}
					first_iteration = false;
					$Forays_PhysicalObject.get_m().tile.get_item(r, c).cursor();
				}
				//if(lookmode && Screen.MapChar(r,c).c == ' ' && Screen.BackgroundColor == ConsoleColor.Black){
				////testing for foregroundcolor == black does NOT work
				////testing for backgroundcolor == black DOES work.
				//Screen.WriteMapChar(r,c,' ');
				//Game.Console.SetCursorPosition(c+Global.MAP_OFFSET_COLS,r+Global.MAP_OFFSET_ROWS);
				//}
				$Forays_Game.console.cursorVisible = true;
				command = $Forays_Game.console.readKey(true);
				var ch = $Forays_Actor.convertInput(command);
				ch = $Forays_Actor.convertVIKeys(ch);
				var move_value = 1;
				if ((command.modifiers & $Forays_ConsoleModifiers.alt) === $Forays_ConsoleModifiers.alt || (command.modifiers & $Forays_ConsoleModifiers.control) === $Forays_ConsoleModifiers.control || (command.modifiers & $Forays_ConsoleModifiers.shift) === $Forays_ConsoleModifiers.shift) {
					move_value = 10;
				}
				switch (ch) {
					case '7': {
						r -= move_value;
						c -= move_value;
						break;
					}
					case '8': {
						r -= move_value;
						break;
					}
					case '9': {
						r -= move_value;
						c += move_value;
						break;
					}
					case '4': {
						c -= move_value;
						break;
					}
					case '6': {
						c += move_value;
						break;
					}
					case '1': {
						r += move_value;
						c -= move_value;
						break;
					}
					case '2': {
						r += move_value;
						break;
					}
					case '3': {
						r += move_value;
						c += move_value;
						break;
					}
					case '\t': {
						if (interesting_targets.length > 0) {
							target_idx++;
							if (target_idx === interesting_targets.length) {
								target_idx = 0;
							}
							r = interesting_targets[target_idx].get_row();
							c = interesting_targets[target_idx].get_col();
							//		interesting_targets[target_idx].Cursor();
						}
						break;
					}
					case '=': {
						if (lookmode) {
							hide_descriptions = !hide_descriptions;
						}
						break;
					}
					case '':
					case ' ': {
						done = true;
						break;
					}
					case '\r':
					case 's': {
						if (r !== this.get_row() || c !== this.get_col()) {
							if (this.hasBresenhamLineOfEffect(r, c)) {
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(r, c)) && this.canSee($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
									this.set_target($Forays_PhysicalObject.get_m().actor.get_item(r, c));
								}
								//result = M.tile[r,c];
								if (radius === 0) {
									result = $Forays_Extensions.toFirstSolidTile(this.getBestExtendedLineOfEffect$1(r, c));
									if (max_distance > 0 && result.length > max_distance + 1) {
										result = $Forays_Extensions.getRange($Forays_Tile).call(null, result, 0, max_distance + 1);
									}
								}
								else {
									var nearby_actors = false;
									var $t15 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).actorsWithinDistance(radius);
									for (var $t16 = 0; $t16 < $t15.length; $t16++) {
										var a1 = $t15[$t16];
										if (!ss.referenceEquals(a1, this)) {
											nearby_actors = true;
											break;
										}
									}
									if (nearby_actors || allow_targeting_ground) {
										result = this.getBestLineOfEffect$1(r, c);
										if (max_distance > 0 && result.length > max_distance + 1) {
											result = $Forays_Extensions.getRange($Forays_Tile).call(null, result, 0, max_distance + 1);
										}
									}
									else {
										//same as for radius 0
										result = $Forays_Extensions.toFirstSolidTile(this.getBestExtendedLineOfEffect$1(r, c));
										if (max_distance > 0 && result.length > max_distance + 1) {
											result = $Forays_Extensions.getRange($Forays_Tile).call(null, result, 0, max_distance + 1);
										}
									}
								}
							}
							else {
								//result = FirstSolidTileInLine(M.tile[r,c]);
								//result = M.tile[r,c];
								result = $Forays_Extensions.toFirstSolidTile(this.getBestExtendedLineOfEffect$1(r, c));
								if (max_distance > 0 && result.length > max_distance + 1) {
									result = $Forays_Extensions.getRange($Forays_Tile).call(null, result, 0, max_distance + 1);
								}
							}
							done = true;
						}
						else {
							var nearby_actors1 = false;
							var $t17 = this.actorsWithinDistance(radius);
							for (var $t18 = 0; $t18 < $t17.length; $t18++) {
								var a2 = $t17[$t18];
								if (!ss.referenceEquals(a2, this)) {
									nearby_actors1 = true;
									break;
								}
							}
							if (nearby_actors1) {
								result = this.getBestLineOfEffect(this);
								done = true;
							}
						}
						break;
					}
					default: {
						break;
					}
				}
				if (r < minrow) {
					r = minrow;
				}
				if (r > maxrow) {
					r = maxrow;
				}
				if (c < mincol) {
					c = mincol;
				}
				if (c > maxcol) {
					c = maxcol;
				}
				if (description_shown_last_time) {
					$Forays_Screen.mapDrawWithStrings(mem, desc_row, desc_col, desc_height, desc_width);
					description_shown_last_time = false;
				}
				if (done) {
					$Forays_Game.console.cursorVisible = false;
					for (var $t19 = 0; $t19 < line.length; $t19++) {
						var t5 = line[$t19];
						$Forays_Screen.writeMapChar(t5.get_row(), t5.get_col(), mem.get(t5.get_row(), t5.get_col()));
					}
					if (radius > 0) {
						var $t20 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).tilesWithinDistance$1(radius, true);
						for (var $t21 = 0; $t21 < $t20.length; $t21++) {
							var t6 = $t20[$t21];
							if (!line.contains(t6)) {
								$Forays_Screen.writeMapChar(t6.get_row(), t6.get_col(), mem.get(t6.get_row(), t6.get_col()));
							}
						}
					}
					$Forays_Game.console.cursorVisible = true;
				}
			}
			return result;
		},
		select: function(message, strings) {
			return this.select$5(message, ''.padLeft($Forays_Actor.$COLS, 45), ''.padLeft($Forays_Actor.$COLS, 45), strings, false, false, true);
		},
		select$3: function(message, strings, no_ask, no_cancel, easy_cancel) {
			return this.select$5(message, ''.padLeft($Forays_Actor.$COLS, 45), ''.padLeft($Forays_Actor.$COLS, 45), strings, no_ask, no_cancel, easy_cancel);
		},
		select$1: function(message, top_border, strings) {
			return this.select$5(message, top_border, ''.padLeft($Forays_Actor.$COLS, 45), strings, false, false, true);
		},
		select$4: function(message, top_border, strings, no_ask, no_cancel, easy_cancel) {
			return this.select$5(message, top_border, ''.padLeft($Forays_Actor.$COLS, 45), strings, no_ask, no_cancel, easy_cancel);
		},
		select$2: function(message, top_border, bottom_border, strings) {
			return this.select$5(message, top_border, bottom_border, strings, false, false, true);
		},
		select$5: function(message, top_border, bottom_border, strings, no_ask, no_cancel, easy_cancel) {
			$Forays_Screen.writeMapString$2(0, 0, top_border);
			var letter = 97;
			var i = 1;
			for (var $t1 = 0; $t1 < strings.length; $t1++) {
				var s = strings[$t1];
				var s2 = '[' + String.fromCharCode(letter) + '] ' + s;
				$Forays_Screen.writeMapString$2(i, 0, s2.padRight($Forays_Actor.$COLS));
				$Forays_Screen.writeMapChar(i, 1, new $Forays_colorchar.$ctor1(8, letter));
				letter++;
				i++;
			}
			$Forays_Screen.writeMapString$2(i, 0, bottom_border);
			if (i < 21) {
				$Forays_Screen.writeMapString$2(i + 1, 0, ''.padRight($Forays_Actor.$COLS));
			}
			if (no_ask) {
				$Forays_Actor.get_b().displayNow$1(message);
				return -1;
			}
			else {
				var result = this.getSelection(message, strings.length, no_cancel, easy_cancel, false);
				$Forays_PhysicalObject.get_m().redrawWithStrings();
				return result;
			}
		},
		select$6: function(message, top_border, bottom_border, strings, no_ask, no_cancel, easy_cancel, help_key, help_topic) {
			var result = -2;
			while (result === -2) {
				$Forays_Screen.writeMapString(0, 0, top_border);
				var letter = 97;
				var i = 1;
				for (var $t1 = 0; $t1 < strings.length; $t1++) {
					var s = strings[$t1];
					$Forays_Screen.writeMapString(i, 0, new $Forays_colorstring.$ctor4('[', 2, String.fromCharCode(letter), 8, '] ', 2));
					$Forays_Screen.writeMapString(i, 4, s);
					letter++;
					i++;
				}
				$Forays_Screen.writeMapString(i, 0, bottom_border);
				if (i < 21) {
					$Forays_Screen.writeMapString$2(i + 1, 0, ''.padRight($Forays_Actor.$COLS));
				}
				if (no_ask) {
					$Forays_Actor.get_b().displayNow$1(message);
					return -1;
				}
				else {
					result = this.getSelection(message, strings.length, no_cancel, easy_cancel, help_key);
					if (result === -2) {
						$Forays_Help.displayHelp$1(help_topic);
					}
					else {
						$Forays_PhysicalObject.get_m().redrawWithStrings();
						return result;
					}
				}
			}
			return -1;
		},
		getSelection: function(s, count, no_cancel, easy_cancel, help_key) {
			if (count === 0) {
				return -1;
			}
			$Forays_Actor.get_b().displayNow$1(s);
			$Forays_Game.console.cursorVisible = true;
			var command;
			var ch;
			while (true) {
				command = $Forays_Game.console.readKey(true);
				ch = $Forays_Actor.convertInput(command);
				var i = ch.charCodeAt(0) - 97;
				if (i >= 0 && i < count) {
					return i;
				}
				if (help_key && ch === '?') {
					return -2;
				}
				if (no_cancel === false) {
					if (easy_cancel) {
						return -1;
					}
					if (ss.referenceEquals(ch, String.fromCharCode(27)) || ch === ' ') {
						return -1;
					}
				}
			}
		},
		animateProjectile: function(o, color, c) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateProjectile(this.getBestLine$1(o.get_row(), o.get_col()), new $Forays_colorchar.$ctor2(color, c));
		},
		animateMapCell: function(o, color, c) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateMapCell(o.get_row(), o.get_col(), new $Forays_colorchar.$ctor2(color, c));
		},
		animateBoltProjectile: function(o, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBoltProjectile(this.getBestLine$1(o.get_row(), o.get_col()), color);
		},
		animateExplosion: function(o, radius, color, c) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateExplosion(o, radius, new $Forays_colorchar.$ctor2(color, c));
		},
		animateBeam: function(o, color, c) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBeam(this.getBestLine$1(o.get_row(), o.get_col()), new $Forays_colorchar.$ctor2(color, c));
		},
		animateBoltBeam: function(o, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBoltBeam(this.getBestLine$1(o.get_row(), o.get_col()), color);
		},
		animateProjectile$1: function(o, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateProjectile(this.getBestLine$1(o.get_row(), o.get_col()), new $Forays_colorchar.$ctor2(color, c));
		},
		animateMapCell$1: function(o, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateMapCell(o.get_row(), o.get_col(), new $Forays_colorchar.$ctor2(color, c));
		},
		animateExplosion$1: function(o, radius, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateExplosion(o, radius, new $Forays_colorchar.$ctor2(color, c));
		},
		animateBeam$1: function(o, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBeam(this.getBestLine$1(o.get_row(), o.get_col()), new $Forays_colorchar.$ctor2(color, c));
		},
		animateStorm: function(radius, num_frames, num_per_frame, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateStorm(this.p, radius, num_frames, num_per_frame, new $Forays_colorchar.$ctor4(c, color));
		},
		animateProjectile$2: function(line, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateProjectile(line, new $Forays_colorchar.$ctor2(color, c));
		},
		animateBeam$2: function(line, c, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBeam(line, new $Forays_colorchar.$ctor2(color, c));
		},
		animateBoltProjectile$1: function(line, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBoltProjectile(line, color);
		},
		animateBoltBeam$1: function(line, color) {
			$Forays_Actor.get_b().displayNow();
			$Forays_Screen.animateBoltBeam(line, color);
		}
	};
	$Forays_Actor.$ctor1 = function(a, r, c) {
		this.$2$atypeField = 0;
		this.$2$maxhpField = 0;
		this.$2$curhpField = 0;
		this.$2$speedField = 0;
		this.$2$levelField = 0;
		this.$2$targetField = null;
		this.$2$invField = null;
		this.$2$FField = null;
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]))();
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]))();
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]))();
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]))();
		this.magic_penalty = 0;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.path = [];
		this.target_location = null;
		this.player_visibility_duration = 0;
		this.group = null;
		this.weapons = [];
		this.armors = [];
		this.magic_items = [];
		$Forays_PhysicalObject.call(this);
		this.set_atype(a.get_atype());
		this.set_name(a.get_name());
		this.set_the_name(a.get_the_name());
		this.set_a_name(a.get_a_name());
		this.set_symbol(a.get_symbol());
		this.set_color(a.get_color());
		this.set_maxhp(a.get_maxhp());
		this.set_curhp(this.get_maxhp());
		this.set_speed(a.get_speed());
		this.set_level(a.get_level());
		this.set_light_radius(a.get_light_radius());
		this.set_target(null);
		this.set_f(new Array(13));
		for (var i = 0; i < 13; ++i) {
			this.get_f()[i] = 24;
		}
		this.set_inv([]);
		this.set_row(r);
		this.set_col(c);
		this.target_location = null;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.player_visibility_duration = 0;
		this.weapons = a.weapons.clone();
		this.armors = a.armors.clone();
		this.magic_items = a.magic_items.clone();
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]).$ctor1)(a.attrs);
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]).$ctor1)(a.skills);
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]).$ctor1)(a.feats);
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]).$ctor1)(a.spells);
		this.magic_penalty = 0;
	};
	$Forays_Actor.$ctor3 = function(type_, name_, symbol_, color_, maxhp_, speed_, level_, light_radius_, attrlist) {
		this.$2$atypeField = 0;
		this.$2$maxhpField = 0;
		this.$2$curhpField = 0;
		this.$2$speedField = 0;
		this.$2$levelField = 0;
		this.$2$targetField = null;
		this.$2$invField = null;
		this.$2$FField = null;
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]))();
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]))();
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]))();
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]))();
		this.magic_penalty = 0;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.path = [];
		this.target_location = null;
		this.player_visibility_duration = 0;
		this.group = null;
		this.weapons = [];
		this.armors = [];
		this.magic_items = [];
		$Forays_PhysicalObject.call(this);
		this.set_atype(type_);
		this.setName(name_);
		this.set_symbol(symbol_);
		this.set_color(color_);
		this.set_maxhp(maxhp_);
		this.set_curhp(this.get_maxhp());
		this.set_speed(speed_);
		this.set_level(level_);
		this.set_light_radius(light_radius_);
		this.set_target(null);
		this.set_inv(null);
		this.target_location = null;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.player_visibility_duration = 0;
		this.weapons.insert(0, 11);
		this.armors.insert(0, 7);
		this.set_f(new Array(13));
		for (var i = 0; i < 13; ++i) {
			this.get_f()[i] = 24;
		}
		this.magic_penalty = 0;
		for (var i1 = 0; i1 < attrlist.length; i1++) {
			var $t1 = attrlist[i1];
			this.attrs.set_item($t1, this.attrs.get_item($t1) + 1);
		}
		//row and col are -1
	};
	$Forays_Actor.$ctor2 = function(type_, name_, symbol_, color_, maxhp_, speed_, level_, light_radius_) {
		this.$2$atypeField = 0;
		this.$2$maxhpField = 0;
		this.$2$curhpField = 0;
		this.$2$speedField = 0;
		this.$2$levelField = 0;
		this.$2$targetField = null;
		this.$2$invField = null;
		this.$2$FField = null;
		this.attrs = new (Type.makeGenericType($Forays_Dict$2, [$Forays_AttrType, ss.Int32]))();
		this.skills = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SkillType, ss.Int32]))();
		this.feats = new (Type.makeGenericType($Forays_Dict$2, [$Forays_FeatType, ss.Int32]))();
		this.spells = new (Type.makeGenericType($Forays_Dict$2, [$Forays_SpellType, ss.Int32]))();
		this.magic_penalty = 0;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.path = [];
		this.target_location = null;
		this.player_visibility_duration = 0;
		this.group = null;
		this.weapons = [];
		this.armors = [];
		this.magic_items = [];
		$Forays_PhysicalObject.call(this);
		this.set_atype(type_);
		this.setName(name_);
		this.set_symbol(symbol_);
		this.set_color(color_);
		this.set_maxhp(maxhp_);
		this.set_curhp(this.get_maxhp());
		this.set_speed(speed_);
		this.set_level(level_);
		this.set_light_radius(light_radius_);
		this.set_target(null);
		this.set_inv(null);
		this.target_location = null;
		this.time_of_last_action = 0;
		this.recover_time = 0;
		this.player_visibility_duration = 0;
		this.weapons.insert(0, 11);
		this.armors.insert(0, 7);
		this.set_f(new Array(13));
		for (var i = 0; i < 13; ++i) {
			this.get_f()[i] = 24;
		}
		this.magic_penalty = 0;
	};
	$Forays_Actor.$ctor1.prototype = $Forays_Actor.$ctor3.prototype = $Forays_Actor.$ctor2.prototype = $Forays_Actor.prototype;
	$Forays_Actor.prototype$1 = function(type) {
		return $Forays_Actor.$proto.get_item(type);
	};
	$Forays_Actor.get_q = function() {
		return $Forays_Actor.$2$QField;
	};
	$Forays_Actor.set_q = function(value) {
		$Forays_Actor.$2$QField = value;
	};
	$Forays_Actor.get_b = function() {
		return $Forays_Actor.$2$BField;
	};
	$Forays_Actor.set_b = function(value) {
		$Forays_Actor.$2$BField = value;
	};
	$Forays_Actor.get_player = function() {
		return $Forays_Actor.$2$playerField;
	};
	$Forays_Actor.set_player = function(value) {
		$Forays_Actor.$2$playerField = value;
	};
	$Forays_Actor.$define = function(type_, name_, symbol_, color_, maxhp_, speed_, level_, light_radius_, attrlist) {
		$Forays_Actor.$proto.set_item(type_, new $Forays_Actor.$ctor3(type_, name_, symbol_, color_, maxhp_, speed_, level_, light_radius_, attrlist));
	};
	$Forays_Actor.create = function(type, r, c) {
		return $Forays_Actor.create$1(type, r, c, false, false);
	};
	$Forays_Actor.create$1 = function(type, r, c, add_to_tiebreaker_list, insert_after_current) {
		var a = null;
		if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(r, c))) {
			a = new $Forays_Actor.$ctor1($Forays_Actor.$proto.get_item(type), r, c);
			$Forays_PhysicalObject.get_m().actor.set_item(r, c, a);
			if (add_to_tiebreaker_list) {
				if (insert_after_current) {
					$Forays_Actor.tiebreakers.insert($Forays_Actor.get_q().get_tiebreaker() + 1, a);
					$Forays_Actor.get_q().updateTiebreaker($Forays_Actor.get_q().get_tiebreaker() + 1);
					var e = new $Forays_Event.$ctor5(a, a.get_speed(), 1);
					e.set_tiebreaker($Forays_Actor.get_q().get_tiebreaker() + 1);
					$Forays_Actor.get_q().add(e);
				}
				else {
					$Forays_Actor.tiebreakers.add(a);
					var e1 = new $Forays_Event.$ctor5(a, a.get_speed(), 1);
					e1.set_tiebreaker($Forays_Actor.tiebreakers.length - 1);
					//since it's the last one
					$Forays_Actor.get_q().add(e1);
				}
			}
			else {
				a.QS();
			}
			if (a.get_light_radius() > 0) {
				a.updateRadius(0, a.get_light_radius());
			}
		}
		return a;
	};
	$Forays_Actor.createPhantom = function(r, c) {
		var a = $Forays_Actor.create$1(56, r, c, true, true);
		if (ss.isNullOrUndefined(a)) {
			return null;
		}
		var type = $Forays_Global.roll(9) + 56;
		a.set_atype(type);
		switch (type) {
			case 64: {
				a.setName('phantom archer');
				a.set_symbol('g');
				break;
			}
			case 61: {
				a.setName('phantom behemoth');
				a.set_symbol('H');
				a.set_speed(120);
				a.attrs.set_item(54, a.attrs.get_item(54) + 1);
				break;
			}
			case 62: {
				a.setName('phantom blightwing');
				a.set_symbol('b');
				a.set_speed(60);
				break;
			}
			case 65: {
				a.setName('phantom constrictor');
				a.set_symbol('S');
				a.attrs.set_item(56, a.attrs.get_item(56) + 1);
				break;
			}
			case 58: {
				a.setName('phantom crusader');
				a.set_symbol('p');
				a.updateRadius$1(0, 6, true);
				break;
			}
			case 60: {
				a.setName('phantom ogre');
				a.set_symbol('O');
				break;
			}
			case 63: {
				a.setName('phantom swordmaster');
				a.set_symbol('h');
				break;
			}
			case 59: {
				a.setName('phantom tiger');
				a.set_symbol('f');
				a.set_speed(50);
				break;
			}
			case 57: {
				a.setName('phantom zombie');
				a.set_symbol('z');
				a.set_speed(150);
				break;
			}
		}
		return a;
	};
	$Forays_Actor.convertInput = function(k) {
		switch (k.key) {
			case 38:
			case 104: {
				return '8';
			}
			case 56: {
				return '*';
			}
			case 40:
			case 98: {
				return '2';
			}
			case 50: {
				return '@';
			}
			case 37:
			case 100: {
				return '4';
			}
			case 52: {
				return '$';
			}
			case 101: {
				return '5';
			}
			case 53: {
				return '%';
			}
			case 39:
			case 102: {
				return '6';
			}
			case 54: {
				return '^';
			}
			case 36:
			case 103: {
				return '7';
			}
			case 55: {
				return '&';
			}
			case 33:
			case 105: {
				return '9';
			}
			case 57: {
				return '(';
			}
			case 35:
			case 97: {
				return '1';
			}
			case 49: {
				return '!';
			}
			case 34:
			case 99: {
				return '3';
			}
			case 51: {
				return '#';
			}
			case 48: {
				return ')';
			}
			case 9: {
				return '\t';
			}
			case 27: {
				return '';
			}
			case 13: {
				return '\r';
			}
			default: {
				if ((k.modifiers & $Forays_ConsoleModifiers.shift) === $Forays_ConsoleModifiers.shift) {
					return String.fromCharCode(k.keyChar).toUpperCase();
				}
				else {
					return String.fromCharCode(k.keyChar);
				}
			}
		}
	};
	$Forays_Actor.convertVIKeys = function(ch) {
		switch (ch) {
			case 'h':
			case 'H': {
				return '4';
			}
			case 'j':
			case 'J': {
				return '2';
			}
			case 'k':
			case 'K': {
				return '8';
			}
			case 'l':
			case 'L': {
				return '6';
			}
			case 'y':
			case 'Y': {
				return '7';
			}
			case 'u':
			case 'U': {
				return '9';
			}
			case 'b':
			case 'B': {
				return '1';
			}
			case 'n':
			case 'N': {
				return '3';
			}
			default: {
				return ch;
			}
		}
	};
	$Forays_Actor.getSpellTypes = function() {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
	};
	$Forays_Actor.monsterDescriptionText = function(type) {
		switch (type) {
			case 3: {
				return 'The goblin is a small ugly humanoid, often found inhabiting the upper reaches of any cave, chamber, or tunnel it can find.';
			}
			case 4: {
				return 'The bats here are substantially bigger than most, perhaps because their insect prey is also unusually large.';
			}
			case 5: {
				return 'Lithe and quick, this canine predator has formidable teeth and powerful jaws.';
			}
			case 6: {
				return 'A humanoid skeleton, animated by magic, seeing without eyes, and moving without muscles.';
			}
			case 7: {
				return 'Found fluttering around any source of light, this huge moth is named for the rivulets of crimson on its wings that mimic dripping blood. Unlike most moths, it has a wide razor-filled mouth.';
			}
			case 8: {
				return 'Always ready for a fight, the swordsman twirls his sword in his hand as he walks. His eyes never leave his foe, watching and waiting for the next advance.';
			}
			case 9: {
				return 'This pale dirty humanoid wears tattered rags. Its huge eyes are sensitive to light.';
			}
			case 10: {
				return 'Sharp tangles of thorny branches spread out from its center. The closest branches seem to follow your movements.';
			}
			case 11: {
				return 'An alien-looking creature of cold, the frostling possesses insectlike mandibles, claws, and smooth whitish skin. A fog of chill condensation surrounds it.';
			}
			case 12:
			case 53: {
				return 'The features of this warrior are hard to make out, but the curved blade held at the ready is clear enough.';
			}
			case 13: {
				return 'This cultist wears a crimson robe that reaches the ground. His head has been shaved and tattooed in devotion to his demon lord.';
			}
			case 14: {
				return 'This goblin carries a crude bow and wears a quiver of arrows. It glances around, looking for inviting targets.';
			}
			case 15: {
				return 'This goblin\'s markings identify it as a tribe leader and shaman. It carries a small staff and wears a necklace of ears and fingers.';
			}
			case 16: {
				return 'The mimic changes its shape to that of an ordinary object, then waits for an unwary goblin or adventurer. It can secrete a powerful adhesive to hold its prey.';
			}
			case 17: {
				return 'This rogue dashes from shadow to shadow, dagger in hand. A smirk appears as the killer overtakes another victim.';
			}
			case 18: {
				return 'The zombie is a rotting, shambling corpse animated by the dark art of necromancy. It mindlessly seeks the flesh of the living.';
			}
			case 19: {
				return 'With red eyes and long yellow teeth, most dire rats outweigh forty of their smaller brethren.';
			}
			case 20: {
				return 'A holy symbol hangs, silver and forked, from the neck of the zealot. The holy magic of the church\'s spells promises the zealot a swift victory over heretics.';
			}
			case 21: {
				return 'Shadows are manifest darkness, barely maintaining a physical presence. A dark environment hides them utterly, but the light reveals their warped human shape.';
			}
			case 22: {
				return 'The banshee floats shrieking, trailing wisps of a faded dress behind her. Her nails are blood-caked claws. The banshee\'s hateful scream is painful for the living to hear.';
			}
			case 23: {
				return 'This wolf has white fur with black markings. Its eyes are too human for your liking.';
			}
			case 24: {
				return 'Heedless of the laws of nature, this brilliantly iridescent spider steps to the side and appears twenty feet away. Even when you\'re looking right at it, you think you can hear it behind you.';
			}
			case 25: {
				return 'This solitary monk constantly kicks and punches at empty space, madly repeating words of nonsense. Those nearby will find themselves uttering the same gibberish.';
			}
			case 26: {
				return 'This troublesome spirit has a penchant for throwing things and upending furniture. It affords no rest to intruders in the area that it haunts.';
			}
			case 27: {
				return 'The hag\'s foul brand of magic can impart a nasty curse on those who cross her. Cracked, warty skin hides surprising strength, used to wrestle her victims into the stewpot.';
			}
			case 28: {
				return 'Compys are little waste-eating scavengers that possess a subtle poison. These lizards tend to ignore healthy creatures, preferring to surround those who are weak, helpless, or otherwise occupied.';
			}
			case 29: {
				return 'The noxious worm, almost as tall as a man, slams foes with its bulk. It vomits a thick stench from its maw.';
			}
			case 30: {
				return 'In battle, the berserker enters a state of unfeeling rage, axe swinging at anything within reach. Trophies of war adorn the berserker\'s minimally armored form.';
			}
			case 31: {
				return 'The troll towers above you, all muscles, claws, and warty greenish skin. The regenerative powers of the troll are well-known, as is the suggestion to fight them with fire.';
			}
			case 32: {
				return 'The vampire floats above the ground with hunger in its eyes. A dark cape flows around its pale form.';
			}
			case 33: {
				return 'This knight\'s armor bears the holy symbols of his church. He holds his torch aloft, awaiting the appearance of evildoers.';
			}
			case 34: {
				return 'The skeletal remains of an enormous feline predator stand here, seemingly ready to pounce at any moment.';
			}
			case 35: {
				return 'As the mud elemental oozes across the floor, bits of dirt seem to animate and are absorbed into its body.';
			}
			case 54: {
				return 'A writhing, grasping tendril of mud emerges from the wall.';
			}
			case 36: {
				return 'The entrancer bends a weak-minded being to her will and has it fight on her behalf, at least until a more desirable thrall appears. In battle, the entrancer can protect and teleport the enthralled creature.';
			}
			case 37: {
				return 'Its shape is still that of a statue, but the darkness reveals the diseased appearance of its pale skin. No light is reflected from its empty eyes.';
			}
			case 55: {
				return 'As a statue, the marble horror is invulnerable and inactive. It will remain in this form as long as light falls upon it.';
			}
			case 38: {
				return 'Built like an orc, but as big as a troll, this tusked brute wields a giant club.';
			}
			case 39: {
				return 'Orcs are a burly and warlike race, quick to make enemies. This one carries a satchel filled with deadly orcish explosives.';
			}
			case 40: {
				return 'The shadowveil duelist hides under a cloak of shadows to strike unseen. A spinning, feinting fighting style keeps the duelist in motion.';
			}
			case 41: {
				return 'This many-legged segmented insect crawls over the ground and walls in search of carrion. When threatened or lacking another source of food, tentacles on its head are used to apply a paralyzing substance to living prey.';
			}
			case 42: {
				return 'Using fairy enchantments to influence the flow of magic, this pixie causes its every wingbeat to reverberate in the skulls of those nearby, stifling words of magic.';
			}
			case 43: {
				return 'Constructs of stone are often created to guard or serve. Their rocky nature grants them a degree of resistance to many forms of attack.';
			}
			case 44: {
				return 'Tall and wide-shouldered descendants of flame, the pyren are a strange race of men. Though they are flesh and blood, they still possess the power to ignite nearby objects.';
			}
			case 45: {
				return 'This orcish stalker is well camouflaged. A wicked grin shows off sharp teeth as the assassin brandishes a long blade.';
			}
			case 46: {
				return 'The seer is a leader among the solitary troll population, sought for augury and council. Spells and arcane tricks are passed down from seer to seer. ';
			}
			case 47: {
				return 'The mechanical knight\'s shield moves with unnatural speed, ready to foil any onslaught. Its exposed gears appear vulnerable to any attack that could bypass its shield.';
			}
			case 48: {
				return 'The destruction wreaked by warmages evokes respect and feat even among their own kind. They often lead raids and war parties, using tracking spells to complement their lethal magic.';
			}
			case 49: {
				return 'The lasher is a tall mass of fungal growth with several ropelike tentacles extending from it.';
			}
			case 50: {
				return 'Necromancers practice the dark arts, raising the dead to serve them. They gain power through unholy rituals that make them unwelcome in any civilized place.';
			}
			case 51: {
				return 'The radiance of this empyreal being makes your eyes hurt after a few seconds. When you look again it still has the shape of a human, but occasionally its silhouette seems to have wings, horns, or four legs.';
			}
			case 52: {
				return 'This monstrosity looks like it was stitched together from corpses of several different species. You see pieces of humans, orcs, and trolls, in addition to some you can\'t begin to identify.';
			}
			case 2: {
				return 'Huge, deadly, and hungry for your charred flesh, the fire drake prepares to drag your valuables back to its lair. You have no doubts that you now face the snarling fiery master of this dungeon.';
			}
			default: {
				return 'Phantoms are beings of illusion, but real enough to do lasting harm. Because they vanish at the slightest touch, they are easily dispatched with magic spells.';
			}
		}
	};
	$Forays_Actor.monsterDescriptionBox = function(type, max_string_length) {
		var text = $Forays_Extensions.getWordWrappedList($Forays_Actor.monsterDescriptionText(type), max_string_length);
		var box_edge_color = 4;
		var box_corner_color = 6;
		var text_color = 2;
		var widest = 20;
		// length of "[=] Hide description"
		for (var $t1 = 0; $t1 < text.length; $t1++) {
			var s = text[$t1];
			if (s.length > widest) {
				widest = s.length;
			}
		}
		widest += 2;
		//one space on each side
		var box = [];
		box.add(new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(widest, 45), box_edge_color, '+', box_corner_color));
		for (var $t2 = 0; $t2 < text.length; $t2++) {
			var s1 = text[$t2];
			box.add($Forays_colorstring.op_Addition($Forays_colorstring.op_Addition(new $Forays_colorstring.$ctor2('|', box_edge_color), $Forays_Extensions.getColorString$1($Forays_Extensions.padOuter(s1, widest), text_color)), new $Forays_colorstring.$ctor2('|', box_edge_color)));
		}
		box.add(new $Forays_colorstring.$ctor4('|', box_edge_color, ''.padRight(widest), 2, '|', box_edge_color));
		box.add($Forays_colorstring.op_Addition($Forays_colorstring.op_Addition(new $Forays_colorstring.$ctor2('|', box_edge_color), $Forays_Extensions.getColorString$1($Forays_Extensions.padOuter('[=] Hide description', widest), text_color)), new $Forays_colorstring.$ctor2('|', box_edge_color)));
		box.add(new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(widest, 45), box_edge_color, '+', box_corner_color));
		return box;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ActorType
	var $Forays_ActorType = function() {
	};
	$Forays_ActorType.prototype = { PLAYER: 0, RAT: 1, firE_DRAKE: 2, GOBLIN: 3, largE_BAT: 4, WOLF: 5, SKELETON: 6, blooD_MOTH: 7, SWORDSMAN: 8, darknesS_DWELLER: 9, carnivorouS_BRAMBLE: 10, FROSTLING: 11, dreaM_WARRIOR: 12, CULTIST: 13, gobliN_ARCHER: 14, gobliN_SHAMAN: 15, MIMIC: 16, skulkinG_KILLER: 17, ZOMBIE: 18, dirE_RAT: 19, robeD_ZEALOT: 20, SHADOW: 21, BANSHEE: 22, WARG: 23, phasE_SPIDER: 24, derangeD_ASCETIC: 25, POLTERGEIST: 26, caverN_HAG: 27, COMPY: 28, noxiouS_WORM: 29, BERSERKER: 30, TROLL: 31, VAMPIRE: 32, crusadinG_KNIGHT: 33, skeletaL_SABERTOOTH: 34, muD_ELEMENTAL: 35, ENTRANCER: 36, marblE_HORROR: 37, OGRE: 38, orC_GRENADIER: 39, shadowveiL_DUELIST: 40, carrioN_CRAWLER: 41, spellmuddlE_PIXIE: 42, stonE_GOLEM: 43, pyreN_ARCHER: 44, orC_ASSASSIN: 45, trolL_SEER: 46, mechanicaL_KNIGHT: 47, orC_WARMAGE: 48, lasheR_FUNGUS: 49, NECROMANCER: 50, luminouS_AVENGER: 51, corpsetoweR_BEHEMOTH: 52, dreaM_CLONE: 53, muD_TENTACLE: 54, marblE_HORROR_STATUE: 55, PHANTOM: 56, phantoM_ZOMBIE: 57, phantoM_CRUSADER: 58, phantoM_TIGER: 59, phantoM_OGRE: 60, phantoM_BEHEMOTH: 61, phantoM_BLIGHTWING: 62, phantoM_SWORDMASTER: 63, phantoM_ARCHER: 64, phantoM_CONSTRICTOR: 65 };
	Type.registerEnum(global, 'Forays.ActorType', $Forays_ActorType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Armor
	var $Forays_Armor = function() {
	};
	$Forays_Armor.protection = function(type) {
		switch (type) {
			case 0:
			case 3: {
				return 2;
			}
			case 1:
			case 4: {
				return 4;
			}
			case 2:
			case 5: {
				return 6;
			}
			default: {
				return 0;
			}
		}
	};
	$Forays_Armor.baseArmor = function(type) {
		switch (type) {
			case 0:
			case 3: {
				return 0;
			}
			case 1:
			case 4: {
				return 1;
			}
			case 2:
			case 5: {
				return 2;
			}
			default: {
				return 7;
			}
		}
	};
	$Forays_Armor.addedFailRate = function(type) {
		switch (type) {
			case 1: {
				return 5;
			}
			case 2:
			case 5: {
				return 15;
			}
			default: {
				return 0;
			}
		}
	};
	$Forays_Armor.stealthPenalty = function(type) {
		switch (type) {
			case 1:
			case 4: {
				return 1;
			}
			case 2:
			case 5: {
				return 3;
			}
			default: {
				return 0;
			}
		}
	};
	$Forays_Armor.name$1 = function(type) {
		switch (type) {
			case 0: {
				return 'leather';
			}
			case 3: {
				return 'elven leather';
			}
			case 1: {
				return 'chainmail';
			}
			case 4: {
				return 'chainmail of arcana';
			}
			case 2: {
				return 'full plate';
			}
			case 5: {
				return 'full plate of resistance';
			}
			default: {
				return 'no armor';
			}
		}
	};
	$Forays_Armor.statsName = function(type) {
		var cs = new $Forays_cstr.$ctor3('', 2, 0);
		cs.bgcolor = 0;
		cs.color = 2;
		switch (type) {
			case 0: {
				cs.s = 'Leather';
				break;
			}
			case 3: {
				cs.s = '+Leather+';
				cs.color = 15;
				break;
			}
			case 1: {
				cs.s = 'Chainmail';
				break;
			}
			case 4: {
				cs.s = '+Chainmail+';
				cs.color = 7;
				break;
			}
			case 2: {
				cs.s = 'Full plate';
				break;
			}
			case 5: {
				cs.s = '+Full plate+';
				cs.color = 5;
				break;
			}
			default: {
				cs.s = 'no armor';
				break;
			}
		}
		return cs;
	};
	$Forays_Armor.equipmentScreenName = function(type) {
		var cs = new $Forays_cstr.$ctor3('', 2, 0);
		cs.bgcolor = 0;
		cs.color = 2;
		switch (type) {
			case 0: {
				cs.s = 'Leather';
				break;
			}
			case 3: {
				cs.s = 'Elven leather';
				cs.color = 15;
				break;
			}
			case 1: {
				cs.s = 'Chainmail';
				break;
			}
			case 4: {
				cs.s = 'Chainmail of arcana';
				cs.color = 7;
				break;
			}
			case 2: {
				cs.s = 'Full plate';
				break;
			}
			case 5: {
				cs.s = 'Full plate of resistance';
				cs.color = 5;
				break;
			}
			default: {
				cs.s = 'no armor';
				break;
			}
		}
		return cs;
	};
	$Forays_Armor.description = function(type) {
		switch (type) {
			case 0: {
				return 'Leather -- Light armor. Provides some basic protection.';
			}
			case 3: {
				return 'Elven leather -- Grants a bonus to stealth skill.';
			}
			case 1: {
				return 'Chainmail -- Good protection. Noisy and hard to cast in.';
			}
			case 4: {
				return 'Chainmail of arcana -- Bonus to magic. No cast penalty.';
			}
			case 2: {
				return 'Full plate -- The thickest, noisiest, and bulkiest armor.';
			}
			case 5: {
				return 'Full plate of resistance -- Grants resistance to elements.';
			}
			default: {
				return 'no armor';
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ArmorType
	var $Forays_ArmorType = function() {
	};
	$Forays_ArmorType.prototype = { LEATHER: 0, CHAINMAIL: 1, fulL_PLATE: 2, elveN_LEATHER: 3, chainmaiL_OF_ARCANA: 4, fulL_PLATE_OF_RESISTANCE: 5, nuM_ARMORS: 6, nO_ARMOR: 7 };
	Type.registerEnum(global, 'Forays.ArmorType', $Forays_ArmorType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.AttackInfo
	var $Forays_AttackInfo = function(a) {
		this.cost = 0;
		this.damage = null;
		this.desc = null;
		this.cost = a.cost;
		this.damage = a.damage;
		this.desc = a.desc;
	};
	$Forays_AttackInfo.$ctor1 = function(cost_, dice_, type_, desc_) {
		this.cost = 0;
		this.damage = null;
		this.desc = null;
		this.cost = cost_;
		this.damage = new $Forays_Damage.$ctor1(dice_, type_, 0, null);
		//			damage.dice=dice_;
		//			damage.type=type_;
		//			damage.damclass=DamageClass.PHYSICAL;
		this.desc = desc_;
	};
	$Forays_AttackInfo.$ctor2 = function(cost_, dice_, type_, damclass_, desc_) {
		this.cost = 0;
		this.damage = null;
		this.desc = null;
		this.cost = cost_;
		this.damage = new $Forays_Damage.$ctor1(dice_, type_, damclass_, null);
		//			damage.dice=dice_;
		//			damage.type=type_;
		//			damage.damclass=damclass_;
		this.desc = desc_;
	};
	$Forays_AttackInfo.$ctor1.prototype = $Forays_AttackInfo.$ctor2.prototype = $Forays_AttackInfo.prototype;
	////////////////////////////////////////////////////////////////////////////////
	// Forays.AttackList
	var $Forays_AttackList = function() {
	};
	$Forays_AttackList.attack = function(type, num) {
		switch (type) {
			case 0: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[0]);
			}
			case 1: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
			}
			case 3: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 4: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[3]);
					}
					default: {
						return null;
					}
				}
			}
			case 5: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[4]);
			}
			case 6: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 7: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
			}
			case 8: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 9: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 10: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[6]);
			}
			case 11: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[7]);
					}
					case 2: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[8]);
					}
					default: {
						return null;
					}
				}
			}
			case 12: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 53: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[9]);
			}
			case 13: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 14:
			case 64: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 15: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 16: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 17: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 18:
			case 57: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[11]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
					}
					default: {
						return null;
					}
				}
			}
			case 19: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
			}
			case 20: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[12]);
			}
			case 21: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[13]);
			}
			case 22: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[14]);
			}
			case 23: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[4]);
			}
			case 24: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
			}
			case 25: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[15]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[16]);
					}
					case 2: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[17]);
					}
					default: {
						return null;
					}
				}
			}
			case 26: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[19]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[18]);
					}
					default: {
						return null;
					}
				}
			}
			case 27: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[20]);
			}
			case 28: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
			}
			case 29: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[21]);
					}
					default: {
						return null;
					}
				}
			}
			case 30: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 31: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[22]);
			}
			case 32: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[4]);
			}
			case 33:
			case 58: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[23]);
			}
			case 34:
			case 59: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
			}
			case 35: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 54: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[24]);
			}
			case 36: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 37: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 38:
			case 60: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[25]);
			}
			case 39: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 40: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 41: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[2]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[26]);
					}
					default: {
						return null;
					}
				}
			}
			case 42: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[27]);
			}
			case 43: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[28]);
			}
			case 44: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 45: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 46: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[22]);
			}
			case 47: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[16]);
					}
					default: {
						return null;
					}
				}
			}
			case 48: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 49: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[29]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[30]);
					}
					default: {
						return null;
					}
				}
			}
			case 50: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[1]);
			}
			case 51: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[17]);
			}
			case 52:
			case 61: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[31]);
			}
			case 2: {
				switch (num) {
					case 0: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
					}
					case 1: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[22]);
					}
					case 2: {
						return new $Forays_AttackInfo($Forays_AttackList.$attack[32]);
					}
					default: {
						return null;
					}
				}
			}
			case 62: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[5]);
			}
			case 63: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[10]);
			}
			case 65: {
				return new $Forays_AttackInfo($Forays_AttackList.$attack[21]);
			}
			default: {
				return null;
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.AttrType
	var $Forays_AttrType = function() {
	};
	$Forays_AttrType.prototype = { STEALTHY: 0, UNDEAD: 1, CONSTRUCT: 2, PLANTLIKE: 3, DEMON: 4, mediuM_HUMANOID: 5, humanoiD_INTELLIGENCE: 6, keeN_SENSES: 7, BLINDSIGHT: 8, SMALL: 9, FLYING: 10, WANDERING: 11, neveR_MOVES: 12, shadoW_CLOAK: 13, NOTICED: 14, playeR_NOTICED: 15, enhanceD_TORCH: 16, magicaL_BLOOD: 17, keeN_EYES: 18, TOUGH: 19, lonG_STRIDE: 20, runiC_BIRTHMARK: 21, loW_LIGHT_VISION: 22, DARKVISION: 23, REGENERATING: 24, regenerateS_FROM_DEATH: 25, nO_ITEM: 26, STUNNED: 27, PARALYZED: 28, POISONED: 29, FROZEN: 30, oN_FIRE: 31, catchinG_FIRE: 32, starteD_CATCHING_FIRE_THIS_TURN: 33, AFRAID: 34, SLOWED: 35, magicaL_DROWSINESS: 36, ASLEEP: 37, AGGRAVATING: 38, curseD_WEAPON: 39, detectinG_MONSTERS: 40, BLOODSCENT: 41, TELEPORTING: 42, lighT_ALLERGY: 43, destroyeD_BY_SUNLIGHT: 44, diM_VISION: 45, diM_LIGHT: 46, firE_HIT: 47, colD_HIT: 48, poisoN_HIT: 49, paralysiS_HIT: 50, forcE_HIT: 51, diM_VISION_HIT: 52, stalagmitE_HIT: 53, stuN_HIT: 54, lifE_DRAIN_HIT: 55, graB_HIT: 56, fierY_ARROWS: 57, resisT_SLASH: 58, resisT_PIERCE: 59, resisT_BASH: 60, resisT_FIRE: 61, resisT_COLD: 62, resisT_ELECTRICITY: 63, immunE_FIRE: 64, immunE_COLD: 65, immunE_ARROWS: 66, immunE_TOXINS: 67, resisT_NECK_SNAP: 68, cooldowN_1: 69, cooldowN_2: 70, BLESSED: 71, holY_SHIELDED: 72, arcanE_SHIELDED: 73, sporE_BURST: 74, spelL_DISRUPTION: 75, mechanicaL_SHIELD: 76, turnS_VISIBLE: 77, RESTING: 78, RUNNING: 79, WAITING: 80, AUTOEXPLORE: 81, defensivE_STANCE: 82, TUMBLING: 83, blooD_BOILED: 84, SHADOWSIGHT: 85, iN_COMBAT: 86, CONVICTION: 87, KILLSTREAK: 88, DISTRACTED: 89, ALERTED: 90, amnesiA_STUN: 91, compY_POISON_COUNTER: 92, compY_POISON_WARNING: 93, compY_POISON_LETHAL: 94, UNFROZEN: 95, GRABBED: 96, GRABBING: 97, bonuS_COMBAT: 98, bonuS_DEFENSE: 99, bonuS_MAGIC: 100, bonuS_SPIRIT: 101, bonuS_STEALTH: 102, INVULNERABLE: 103, smalL_GROUP: 104, mediuM_GROUP: 105, largE_GROUP: 106, bosS_MONSTER: 107, nuM_ATTRS: 108, nO_ATTR: 109 };
	Type.registerEnum(global, 'Forays.AttrType', $Forays_AttrType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Buffer
	var $Forays_Buffer = function(g) {
		this.$max_length = 0;
		this.$str = [];
		this.$overflow = null;
		this.$log = null;
		this.$position = 0;
		this.$max_length = $Forays_Global.COLS;
		//because the message window runs along the top of the map
		//str = "";
		//str2 = "";
		this.$str.add('');
		this.$overflow = '';
		this.$log = new Array(20);
		for (var i = 0; i < 20; ++i) {
			this.$log[i] = '';
		}
		this.$position = 0;
		$Forays_Buffer.set_m(g.m);
		$Forays_Buffer.set_player(g.player);
	};
	$Forays_Buffer.prototype = {
		add$1: function(s, obj) {
			//if there's at least one object, the player must be able to
			var add = false;
			if (ss.referenceEquals(obj, $Forays_Buffer.get_player()) || $Forays_Buffer.get_player().canSee(obj)) {
				add = true;
			}
			else {
				add = true;
			}
			if (add && s.length > 0) {
				if (ss.isValue(s.match(new RegExp('^[a-z]'))) && s.match(new RegExp('^[a-z]')).length > 0) {
					s = s.replace(new RegExp('^[a-z]'), function(sr) {
						return String.fromCharCode(sr.charCodeAt(0)).toUpperCase();
					});
					//					c[0] = Char.ToUpper(s[0]);
					//s = new string(c);
				}
				var idx = this.$str.length - 1;
				this.$str[idx] = this.$str[idx] + s;
				//str.Add(str[idx]);
				//while (str[idx].Length > max_length)
				//{
				//    int extra_space_for_more = 7;
				//    if (str.Count < 3)
				//    {
				//        extra_space_for_more = 1;
				//    }
				//    for (int i = max_length - extra_space_for_more; i >= 0; --i)
				//    {
				//        if (str[idx].Substring(i, 1) == " ")
				//        {
				//            if (str.Count == 3)
				//            {
				//                overflow = str[idx].Substring(i + 1);
				//            }
				//            else
				//            {
				//                //(str[idx].Substring(i + 1)); //todo - this breaks very long lines again.
				//            }
				//            str[idx] = str[idx].Substring(0, i + 1);
				//            break;
				//        }
				//    }
				if (this.$overflow !== '') {
					$Forays_Screen.resetColors();
					this.print(false);
					idx = 0;
				}
			}
		},
		add$3: function(s, obj1, obj2) {
			//if there's at least one object, the player must be able to
			var add = false;
			if (ss.isValue(obj1) && ss.isValue(obj2)) {
				//see at least one of them. if not, no message is added. 
				var objs = [obj1, obj2];
				for (var $t1 = 0; $t1 < objs.length; $t1++) {
					var obj = objs[$t1];
					if (ss.referenceEquals(obj, $Forays_Buffer.get_player()) || $Forays_Buffer.get_player().canSee(obj)) {
						add = true;
						break;
					}
				}
			}
			else {
				add = true;
			}
			if (add && s.length > 0) {
				if (ss.isValue(s.match(new RegExp('^[a-z]'))) && s.match(new RegExp('^[a-z]')).length > 0) {
					s = s.replace(new RegExp('^[a-z]'), function(sr) {
						return String.fromCharCode(sr.charCodeAt(0)).toUpperCase();
					});
					//					c[0] = Char.ToUpper(s[0]);
					//s = new string(c);
				}
				var idx = this.$str.length - 1;
				this.$str[idx] = this.$str[idx] + s;
				//str.Add(str[idx]);
				//while (str[idx].Length > max_length)
				//{
				//    int extra_space_for_more = 7;
				//    if (str.Count < 3)
				//    {
				//        extra_space_for_more = 1;
				//    }
				//    for (int i = max_length - extra_space_for_more; i >= 0; --i)
				//    {
				//        if (str[idx].Substring(i, 1) == " ")
				//        {
				//            if (str.Count == 3)
				//            {
				//                overflow = str[idx].Substring(i + 1);
				//            }
				//            else
				//            {
				//                //(str[idx].Substring(i + 1)); //todo - this breaks very long lines again.
				//            }
				//            str[idx] = str[idx].Substring(0, i + 1);
				//            break;
				//        }
				//    }
				if (this.$overflow !== '') {
					$Forays_Screen.resetColors();
					this.print(false);
					idx = 0;
				}
			}
		},
		add$2: function(s, objs) {
			//if there's at least one object, the player must be able to
			var add = false;
			if (ss.isValue(objs) && objs.length > 0) {
				//see at least one of them. if not, no message is added. 
				for (var $t1 = 0; $t1 < objs.length; $t1++) {
					var obj = objs[$t1];
					if (ss.referenceEquals(obj, $Forays_Buffer.get_player()) || $Forays_Buffer.get_player().canSee(obj)) {
						add = true;
						break;
					}
				}
			}
			else {
				add = true;
			}
			if (add && ss.isValue(s) && s.length > 0) {
				if (ss.isValue(s.match(new RegExp('^[a-z]'))) && s.match(new RegExp('^[a-z]')).length > 0) {
					s = s.replace(new RegExp('^[a-z]'), function(sr) {
						return String.fromCharCode(sr.charCodeAt(0)).toUpperCase();
					});
					//					c[0] = Char.ToUpper(s[0]);
					//s = new string(c);
				}
				var idx = this.$str.length - 1;
				this.$str[idx] = this.$str[idx] + s;
				//  str.Add(str[idx]);
				//while (str[idx].Length > max_length)
				//{
				//    int extra_space_for_more = 7;
				//    if (str.Count < 3)
				//    {
				//        extra_space_for_more = 1;
				//    }
				//    for (int i = max_length - extra_space_for_more; i >= 0; --i)
				//    {
				//        if (str[idx].Substring(i, 1) == " ")
				//        {
				//            if (str.Count == 3)
				//            {
				//                overflow = str[idx].Substring(i + 1);
				//            }
				//            else
				//            {
				//                //(str[idx].Substring(i + 1)); //todo - this breaks very long lines again.
				//            }
				//            str[idx] = str[idx].Substring(0, i + 1);
				//            break;
				//        }
				//    }
				if (this.$overflow !== '') {
					$Forays_Screen.resetColors();
					this.print(false);
					idx = 0;
				}
			}
		},
		add: function(s) {
			//if there's at least one object, the player must be able to
			var add = true;
			if (add && s.length > 0) {
				if (ss.isValue(s.match(new RegExp('^[a-z]'))) && s.match(new RegExp('^[a-z]')).length > 0) {
					s = s.replace(new RegExp('^[a-z]'), function(sr) {
						return String.fromCharCode(sr.charCodeAt(0)).toUpperCase();
					});
					//					c[0] = Char.ToUpper(s[0]);
					//s = new string(c);
				}
				var idx = this.$str.length - 1;
				this.$str[idx] = this.$str[idx] + s;
				//  str.Add(str[idx]);
				//while (str[idx].Length > max_length)
				//{
				//    int extra_space_for_more = 7;
				//    if (str.Count < 3)
				//    {
				//        extra_space_for_more = 1;
				//    }
				//    for (int i = max_length - extra_space_for_more; i >= 0; --i)
				//    {
				//        if (str[idx].Substring(i, 1) == " ")
				//        {
				//            if (str.Count == 3)
				//            {
				//                overflow = str[idx].Substring(i + 1);
				//            }
				//            else
				//            {
				//                //(str[idx].Substring(i + 1)); //todo - this breaks very long lines again.
				//            }
				//            str[idx] = str[idx].Substring(0, i + 1);
				//            break;
				//        }
				//    }
				if (this.$overflow !== '') {
					$Forays_Screen.resetColors();
					this.print(false);
					idx = 0;
				}
			}
		},
		displayNow$1: function(s) {
			this.displayNow$2(s, true);
		},
		displayNow$2: function(s, display_stats) {
			if (display_stats) {
				$Forays_Buffer.get_player().displayStats();
			}
			$Forays_Game.console.cursorVisible = false;
			var strings = [];
			if (s.length > this.$max_length) {
				for (var i = this.$max_length - 1; i >= 0; --i) {
					if (s.substring(i, 1) === ' ') {
						strings.add(s.substring(0, i + 1));
						s = s.substring(i + 1);
						break;
					}
				}
			}
			if (s.length > this.$max_length) {
				for (var i1 = this.$max_length - 1; i1 >= 0; --i1) {
					if (s.substring(i1, 1) === ' ') {
						strings.add(s.substring(0, i1 + 1));
						s = s.substring(i1 + 1);
						break;
					}
				}
			}
			strings.add(s);
			for (var i2 = 0; i2 < 3; ++i2) {
				if (3 - i2 > strings.length) {
					$Forays_Screen.writeMapString$2(i2 - 3, 0, $Forays_Extensions.padToMapSize(''));
				}
				else {
					$Forays_Screen.writeMapString$2(i2 - 3, 0, $Forays_Extensions.padToMapSize(strings[i2 + strings.length - 3]));
				}
			}
			$Forays_Game.console.setCursorPosition($Forays_Global.maP_OFFSET_COLS + s.length, 2);
		},
		displayNow: function() {
			//displays whatever is in the buffer. used before animations.
			$Forays_Game.console.cursorVisible = false;
			$Forays_Screen.resetColors();
			//int idx = 3-str.Count;
			//foreach(string s in str){
			////Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,idx);
			////Game.Console.Write(s.PadRight(Global.COLS));
			//Screen.WriteMapString(idx-3,0,s.PadToMapSize());
			//++idx;
			//}
			if ($Forays_Global.option(3)) {
				for (var i = 0; i < 3; ++i) {
					if (i < this.$str.length) {
						$Forays_Screen.writeMapString$2(i - 3, 0, $Forays_Extensions.padToMapSize(this.$str[i]));
					}
					else {
						$Forays_Screen.writeMapString$2(i - 3, 0, $Forays_Extensions.padToMapSize(''));
					}
				}
			}
			else {
				var lines = this.$str.length;
				if ($Forays_Extensions.last(String).call(null, this.$str) === '') {
					--lines;
				}
				for (var i1 = 0; i1 < 3; ++i1) {
					var old_message = true;
					if (3 - i1 <= lines) {
						old_message = false;
					}
					if (old_message) {
						$Forays_Screen.writeMapString$3(i1 - 3, 0, $Forays_Extensions.padToMapSize(this.previousMessage(3 - (i1 + lines))), 9);
						$Forays_Screen.set_foregroundColor(7);
					}
					else {
						$Forays_Screen.writeMapString$2(i1 - 3, 0, $Forays_Extensions.padToMapSize(this.$str[i1 + lines - 3]));
					}
				}
			}
		},
		print: function(special_message) {
			$Forays_Game.console.cursorVisible = false;
			//if(str.Last() != ""){
			for (var $t1 = 0; $t1 < this.$str.length; $t1++) {
				var s = this.$str[$t1];
				if (s !== 'You regenerate. ' && s !== 'You rest... ' && s !== '') {
					$Forays_Buffer.get_player().interrupt();
				}
			}
			var repeated_message = false;
			for (var $t2 = 0; $t2 < this.$str.length; $t2++) {
				var s1 = this.$str[$t2];
				if (s1 !== '') {
					var last = this.$position - 1;
					if (last === -1) {
						last = 19;
					}
					var prev = this.$log[last];
					var count = '1';
					var pos = prev.lastIndexOf(' (x');
					if (pos !== -1) {
						count = prev.substring(pos + 3);
						count = count.substring(0, count.length - 1);
						prev = prev.substring(0, pos + 1);
					}
					var too_long_if_repeated = false;
					if (prev.length + 3 + (parseInt(count) + 1).toString().length > this.$max_length) {
						too_long_if_repeated = true;
					}
					if (ss.referenceEquals(prev, s1) && this.$str.length === 1 && !too_long_if_repeated) {
						//trying this - only add the (x2) part if it's a single-line message, for ease of reading
						this.$log[last] = prev + '(x' + (parseInt(count) + 1).toString() + ')';
						repeated_message = true;
					}
					else {
						this.$log[this.$position] = s1;
						++this.$position;
						if (this.$position === 20) {
							this.$position = 0;
						}
						repeated_message = false;
					}
				}
			}
			//			for(int i=0;i<3;++i){
			//			//Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
			//			//Game.Console.Write("".PadRight(Global.COLS));
			//			Screen.WriteMapString(i-3,0,"".PadToMapSize());
			//			}
			if ($Forays_Global.option(3)) {
				for (var i = 0; i < 3; ++i) {
					if (i <= this.$str.length - 1) {
						//Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
						//Game.Console.Write(str[i]);
						$Forays_Screen.writeMapString$2(i - 3, 0, $Forays_Extensions.padToMapSize(this.$str[i]));
					}
					else {
						$Forays_Screen.writeMapString$2(i - 3, 0, $Forays_Extensions.padToMapSize(''));
					}
				}
			}
			else {
				var lines = this.$str.length;
				if ($Forays_Extensions.last(String).call(null, this.$str) === '') {
					--lines;
				}
				for (var i1 = 0; i1 < 3; ++i1) {
					//Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
					//					if(i >= 3-lines && str[(i+lines)-3] != ""){
					//					Game.Console.Write(str[(i+lines)-3]);
					//					}
					//					else{
					//					Screen.ForegroundColor = ConsoleColor.DarkGray;
					//					Game.Console.Write(PreviousMessage(3-(i+lines)));
					//					Screen.ForegroundColor = ConsoleColor.Gray;
					//					}
					var old_message = true;
					if (3 - i1 <= lines) {
						old_message = false;
					}
					if (old_message) {
						//Screen.ForegroundColor = ConsoleColor.DarkGray;
						//Game.Console.Write(PreviousMessage(3-i));
						$Forays_Screen.writeMapString$3(i1 - 3, 0, $Forays_Extensions.padToMapSize(this.previousMessage(3 - i1)), 9);
						$Forays_Screen.set_foregroundColor(7);
					}
					else if (repeated_message) {
						var pos1 = this.previousMessage(3 - i1).lastIndexOf(' (x');
						if (pos1 !== -1) {
							//Game.Console.Write(PreviousMessage(3-i).Substring(0,pos));
							//Screen.ForegroundColor = ConsoleColor.DarkGray;
							//Game.Console.Write(PreviousMessage(3-i).Substring(pos));
							$Forays_Screen.writeMapString$2(i1 - 3, 0, this.previousMessage(3 - i1).substring(0, pos1));
							$Forays_Screen.writeMapString$3(i1 - 3, pos1, $Forays_Extensions.padToMapSize(this.previousMessage(3 - i1).substring(pos1)), 9);
							$Forays_Screen.set_foregroundColor(7);
						}
						else {
							//Game.Console.Write(PreviousMessage(3-i));
							$Forays_Screen.writeMapString$2(i1 - 3, 0, $Forays_Extensions.padToMapSize(this.previousMessage(3 - i1)));
						}
					}
					else {
						//Game.Console.Write(PreviousMessage(3-i));
						$Forays_Screen.writeMapString$2(i1 - 3, 0, $Forays_Extensions.padToMapSize(this.previousMessage(3 - i1)));
					}
				}
			}
			if (this.$overflow !== '' || special_message === true) {
				var cursor_col = $Forays_Extensions.last(String).call(null, this.$str).length + $Forays_Global.maP_OFFSET_COLS;
				var cursor_row = $Forays_Game.console.cursorTop;
				if (cursor_row > 2) {
					cursor_row = 2;
					//hack - attempts a quick fix for the [more] appearing at the player's row
				}
				if ($Forays_Screen.mapChar(0, 0).c === '-') {
					//hack
					$Forays_Buffer.get_m().redrawWithStrings();
				}
				else {
					$Forays_Buffer.get_m().draw();
				}
				//Game.Console.SetCursorPosition(cursor_col,cursor_row);
				//Screen.ForegroundColor = ConsoleColor.Yellow;
				//Game.Console.Write("[more]");
				$Forays_Screen.writeString$3(cursor_row, cursor_col, '[more]', 6);
				$Forays_Screen.set_foregroundColor(7);
				$Forays_Game.console.cursorVisible = true;
				$Forays_Game.console.readKey(true);
			}
			this.$str.clear();
			this.$str.add(this.$overflow);
			this.$overflow = '';
			//			}
			//			else{
			//			for(int i=0;i<3;++i){
			//			Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
			//			Game.Console.Write("".PadRight(Global.COLS));
			//			}
			//			}
		},
		printAll: function() {
			$Forays_Screen.resetColors();
			if ($Forays_Extensions.last(String).call(null, this.$str) !== '') {
				if ($Forays_Extensions.last(String).call(null, this.$str).length > this.$max_length - 7) {
					for (var i = this.$max_length - 7; i >= 0; --i) {
						if ($Forays_Extensions.last(String).call(null, this.$str).substring(i, 1) === ' ') {
							this.$overflow = $Forays_Extensions.last(String).call(null, this.$str).substring(i + 1);
							this.$str[this.$str.length - 1] = $Forays_Extensions.last(String).call(null, this.$str).substring(0, i + 1);
							break;
						}
					}
					this.print(true);
					if ($Forays_Extensions.last(String).call(null, this.$str) !== '') {
						this.print(true);
					}
				}
				else {
					this.print(true);
				}
			}
		},
		printed: function(num) {
			return this.$log[(this.$position + num) % 20];
		},
		previousMessage: function(num) {
			var idx = this.$position - num;
			if (idx < 0) {
				idx += 20;
			}
			return this.$log[idx];
		},
		setPreviousMessages: function(s) {
			for (var i = 0; i < 20; ++i) {
				this.$log[i] = s[i];
			}
		},
		getMessages: function() {
			var result = [];
			for (var i = 0; i < 20; ++i) {
				result.add(this.printed(i));
			}
			return result;
		},
		addDependingOnLastPartialMessage: function(s) {
			//   =|
			if (!$Forays_Extensions.last(String).call(null, this.$str).endsWith(s)) {
				this.add(s);
			}
		},
		addIfEmpty: function(s) {
			if ($Forays_Extensions.last(String).call(null, this.$str).length === 0) {
				this.add(s);
			}
		}
	};
	$Forays_Buffer.get_m = function() {
		return $Forays_Buffer.$1$MField;
	};
	$Forays_Buffer.set_m = function(value) {
		$Forays_Buffer.$1$MField = value;
	};
	$Forays_Buffer.get_player = function() {
		return $Forays_Buffer.$1$playerField;
	};
	$Forays_Buffer.set_player = function(value) {
		$Forays_Buffer.$1$playerField = value;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Color
	var $Forays_Color = function() {
	};
	$Forays_Color.prototype = { black: 0, white: 1, gray: 2, red: 3, green: 4, blue: 5, yellow: 6, magenta: 7, cyan: 8, darkGray: 9, darkRed: 10, darkGreen: 11, darkBlue: 12, darkYellow: 13, darkMagenta: 14, darkCyan: 15, randomFire: 16, randomIce: 17, randomLightning: 18, randomPrismatic: 19, randomDark: 20, randomBright: 21 };
	Type.registerEnum(global, 'Forays.Color', $Forays_Color, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.colorchar
	var $Forays_colorchar = function() {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = 1;
		this.bgcolor = 0;
		this.c = ' ';
	};
	$Forays_colorchar.prototype = {
		equals: function(tgt) {
			return ss.isValue(tgt) && this.color === tgt.color && this.bgcolor === tgt.bgcolor && ss.referenceEquals(this.c, tgt.c);
		}
	};
	$Forays_colorchar.$ctor7 = function(c_, color_, bgcolor_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.c = String.fromCharCode(c_);
	};
	$Forays_colorchar.$ctor3 = function(c_, color_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = 0;
		this.c = String.fromCharCode(c_);
	};
	$Forays_colorchar.$ctor5 = function(color_, bgcolor_, c_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.c = String.fromCharCode(c_);
	};
	$Forays_colorchar.$ctor1 = function(color_, c_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = 0;
		this.c = String.fromCharCode(c_);
	};
	$Forays_colorchar.$ctor8 = function(c_, color_, bgcolor_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.c = c_;
	};
	$Forays_colorchar.$ctor4 = function(c_, color_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = 0;
		this.c = c_;
	};
	$Forays_colorchar.$ctor6 = function(color_, bgcolor_, c_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.c = c_;
	};
	$Forays_colorchar.$ctor2 = function(color_, c_) {
		this.color = 0;
		this.bgcolor = 0;
		this.c = null;
		this.color = color_;
		this.bgcolor = 0;
		this.c = c_;
	};
	$Forays_colorchar.$ctor7.prototype = $Forays_colorchar.$ctor3.prototype = $Forays_colorchar.$ctor5.prototype = $Forays_colorchar.$ctor1.prototype = $Forays_colorchar.$ctor8.prototype = $Forays_colorchar.$ctor4.prototype = $Forays_colorchar.$ctor6.prototype = $Forays_colorchar.$ctor2.prototype = $Forays_colorchar.prototype;
	////////////////////////////////////////////////////////////////////////////////
	// Forays.colorstring
	var $Forays_colorstring = function() {
		this.strings = [];
	};
	$Forays_colorstring.prototype = {
		length: function() {
			var total = 0;
			for (var $t1 = 0; $t1 < this.strings.length; $t1++) {
				var s = this.strings[$t1];
				total += s.s.length;
			}
			return total;
		}
	};
	$Forays_colorstring.$ctor2 = function(s1, c1) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
	};
	$Forays_colorstring.$ctor3 = function(s1, c1, s2, c2) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
		this.strings.add(new $Forays_cstr.$ctor1(s2, c2));
	};
	$Forays_colorstring.$ctor4 = function(s1, c1, s2, c2, s3, c3) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
		this.strings.add(new $Forays_cstr.$ctor1(s2, c2));
		this.strings.add(new $Forays_cstr.$ctor1(s3, c3));
	};
	$Forays_colorstring.$ctor5 = function(s1, c1, s2, c2, s3, c3, s4, c4) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
		this.strings.add(new $Forays_cstr.$ctor1(s2, c2));
		this.strings.add(new $Forays_cstr.$ctor1(s3, c3));
		this.strings.add(new $Forays_cstr.$ctor1(s4, c4));
	};
	$Forays_colorstring.$ctor6 = function(s1, c1, s2, c2, s3, c3, s4, c4, s5, c5) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
		this.strings.add(new $Forays_cstr.$ctor1(s2, c2));
		this.strings.add(new $Forays_cstr.$ctor1(s3, c3));
		this.strings.add(new $Forays_cstr.$ctor1(s4, c4));
		this.strings.add(new $Forays_cstr.$ctor1(s5, c5));
	};
	$Forays_colorstring.$ctor7 = function(s1, c1, s2, c2, s3, c3, s4, c4, s5, c5, s6, c6) {
		this.strings = [];
		this.strings.add(new $Forays_cstr.$ctor1(s1, c1));
		this.strings.add(new $Forays_cstr.$ctor1(s2, c2));
		this.strings.add(new $Forays_cstr.$ctor1(s3, c3));
		this.strings.add(new $Forays_cstr.$ctor1(s4, c4));
		this.strings.add(new $Forays_cstr.$ctor1(s5, c5));
		this.strings.add(new $Forays_cstr.$ctor1(s6, c6));
	};
	$Forays_colorstring.$ctor1 = function(cstrs) {
		this.strings = [];
		if (ss.isValue(cstrs) && cstrs.length > 0) {
			for (var i = 0; i < cstrs.length; i++) {
				this.strings.add(cstrs[i]);
			}
		}
	};
	$Forays_colorstring.$ctor2.prototype = $Forays_colorstring.$ctor3.prototype = $Forays_colorstring.$ctor4.prototype = $Forays_colorstring.$ctor5.prototype = $Forays_colorstring.$ctor6.prototype = $Forays_colorstring.$ctor7.prototype = $Forays_colorstring.$ctor1.prototype = $Forays_colorstring.prototype;
	$Forays_colorstring.op_Addition = function(one, two) {
		var result = new $Forays_colorstring();
		for (var $t1 = 0; $t1 < one.strings.length; $t1++) {
			var s = one.strings[$t1];
			result.strings.add(s);
		}
		for (var $t2 = 0; $t2 < two.strings.length; $t2++) {
			var s1 = two.strings[$t2];
			result.strings.add(s1);
		}
		return result;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ConsoleColor
	var $Forays_ConsoleColor = function() {
	};
	$Forays_ConsoleColor.prototype = { black: 0, darkBlue: 1, darkGreen: 2, darkCyan: 3, darkRed: 4, darkMagenta: 5, darkYellow: 6, gray: 7, darkGray: 8, blue: 9, green: 10, cyan: 11, red: 12, magenta: 13, yellow: 14, white: 15 };
	Type.registerEnum(global, 'Forays.ConsoleColor', $Forays_ConsoleColor, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ConsoleKey
	var $Forays_ConsoleKey = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ConsoleKeyInfo
	var $Forays_ConsoleKeyInfo = function(keycode) {
		this.key = 0;
		this.keyChar = 0;
		this.modifiers = 0;
		this.key = keycode;
		this.keyChar = keycode;
		this.modifiers = $Forays_ConsoleModifiers.plain;
	};
	$Forays_ConsoleKeyInfo.$ctor1 = function(key) {
		this.key = 0;
		this.keyChar = 0;
		this.modifiers = 0;
		this.key = key;
		this.keyChar = String.fromCharCode(key).toLowerCase().charCodeAt(0);
		this.modifiers = $Forays_ConsoleModifiers.plain;
	};
	$Forays_ConsoleKeyInfo.$ctor2 = function(key, mods) {
		this.key = 0;
		this.keyChar = 0;
		this.modifiers = 0;
		this.key = key;
		if ((mods & $Forays_ConsoleModifiers.shift) === $Forays_ConsoleModifiers.shift) {
			this.keyChar = String.fromCharCode(key).toUpperCase().charCodeAt(0);
		}
		else {
			this.keyChar = String.fromCharCode(key).toLowerCase().charCodeAt(0);
		}
		this.modifiers = mods;
	};
	$Forays_ConsoleKeyInfo.$ctor1.prototype = $Forays_ConsoleKeyInfo.$ctor2.prototype = $Forays_ConsoleKeyInfo.prototype;
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ConsoleModifiers
	var $Forays_ConsoleModifiers = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ConsumableType
	var $Forays_ConsumableType = function() {
	};
	$Forays_ConsumableType.prototype = { HEALING: 0, REGENERATION: 1, toxiN_IMMUNITY: 2, CLARITY: 3, CLOAKING: 4, BLINKING: 5, TELEPORTATION: 6, PASSAGE: 7, TIME: 8, detecT_MONSTERS: 9, magiC_MAP: 10, SUNLIGHT: 11, DARKNESS: 12, PRISMATIC: 13, FREEZING: 14, QUICKFIRE: 15, FOG: 16, BANDAGE: 17 };
	Type.registerEnum(global, 'Forays.ConsumableType', $Forays_ConsumableType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.cstr
	var $Forays_cstr = function(color_, s_) {
		this.color = 0;
		this.bgcolor = 0;
		this.s = null;
		this.color = color_;
		this.bgcolor = 0;
		this.s = s_;
	};
	$Forays_cstr.$ctor1 = function(s_, color_) {
		this.color = 0;
		this.bgcolor = 0;
		this.s = null;
		this.color = color_;
		this.bgcolor = 0;
		this.s = s_;
	};
	$Forays_cstr.$ctor3 = function(s_, color_, bgcolor_) {
		this.color = 0;
		this.bgcolor = 0;
		this.s = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.s = s_;
	};
	$Forays_cstr.$ctor2 = function(color_, bgcolor_, s_) {
		this.color = 0;
		this.bgcolor = 0;
		this.s = null;
		this.color = color_;
		this.bgcolor = bgcolor_;
		this.s = s_;
	};
	$Forays_cstr.$ctor1.prototype = $Forays_cstr.$ctor3.prototype = $Forays_cstr.$ctor2.prototype = $Forays_cstr.prototype;
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Damage
	var $Forays_Damage = function(type_, damclass_, source_, totaldamage) {
		this.$num = null;
		this.dice = 0;
		this.type = 0;
		this.damclass = 0;
		this.source = null;
		this.dice = 0;
		this.$num = totaldamage;
		this.type = type_;
		this.damclass = damclass_;
		this.source = source_;
	};
	$Forays_Damage.prototype = {
		get_amount: function() {
			if (!ss.isValue(this.$num)) {
				this.$num = $Forays_Global.roll$1(this.dice, 6);
			}
			return ss.Nullable.unbox(this.$num);
		},
		set_amount: function(value) {
			this.$num = value;
		}
	};
	$Forays_Damage.$ctor1 = function(dice_, type_, damclass_, source_) {
		this.$num = null;
		this.dice = 0;
		this.type = 0;
		this.damclass = 0;
		this.source = null;
		this.dice = dice_;
		this.$num = null;
		this.type = type_;
		this.damclass = damclass_;
		this.source = source_;
	};
	$Forays_Damage.$ctor1.prototype = $Forays_Damage.prototype;
	////////////////////////////////////////////////////////////////////////////////
	// Forays.DamageClass
	var $Forays_DamageClass = function() {
	};
	$Forays_DamageClass.prototype = { PHYSICAL: 0, MAGICAL: 1, nO_TYPE: 2 };
	Type.registerEnum(global, 'Forays.DamageClass', $Forays_DamageClass, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.DamageType
	var $Forays_DamageType = function() {
	};
	$Forays_DamageType.prototype = { NORMAL: 0, FIRE: 1, COLD: 2, ELECTRIC: 3, POISON: 4, HEAL: 5, SLASHING: 6, BASHING: 7, PIERCING: 8, MAGIC: 9, NONE: 10 };
	Type.registerEnum(global, 'Forays.DamageType', $Forays_DamageType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Dict
	var $Forays_Dict$2 = function(TKey, TValue) {
		var $type = function() {
			this.d = null;
			this.d = {};
		};
		$type.prototype = {
			get_item: function(key) {
				return (Object.keyExists(this.d, key) ? this.d[key] : TValue.getDefaultValue());
			},
			set_item: function(key, value) {
				this.d[key] = value;
			}
		};
		$type.$ctor1 = function(d2) {
			this.d = null;
			this.d = ss.mkdict([d2.d]);
		};
		$type.$ctor1.prototype = $type.prototype;
		Type.registerGenericClassInstance($type, $Forays_Dict$2, [TKey, TValue], function() {
			return Object;
		}, function() {
			return [];
		});
		return $type;
	};
	Type.registerGenericClass(global, 'Forays.Dict$2', $Forays_Dict$2, 2);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Event
	var $Forays_Event = function() {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
	};
	$Forays_Event.prototype = {
		get_target: function() {
			return this.$1$targetField;
		},
		set_target: function(value) {
			this.$1$targetField = value;
		},
		get_delay: function() {
			return this.$1$delayField;
		},
		set_delay: function(value) {
			this.$1$delayField = value;
		},
		get_evtype: function() {
			return this.$1$evtypeField;
		},
		set_evtype: function(value) {
			this.$1$evtypeField = value;
		},
		get_attr: function() {
			return this.$1$attrField;
		},
		set_attr: function(value) {
			this.$1$attrField = value;
		},
		get_value: function() {
			return this.$1$valueField;
		},
		set_value: function(value) {
			this.$1$valueField = value;
		},
		get_msg: function() {
			return this.$1$msgField;
		},
		set_msg: function(value) {
			this.$1$msgField = value;
		},
		get_time_created: function() {
			return this.$1$time_createdField;
		},
		set_time_created: function(value) {
			this.$1$time_createdField = value;
		},
		get_dead: function() {
			return this.$1$deadField;
		},
		set_dead: function(value) {
			this.$1$deadField = value;
		},
		get_tiebreaker: function() {
			return this.$1$tiebreakerField;
		},
		set_tiebreaker: function(value) {
			this.$1$tiebreakerField = value;
		},
		timeToExecute: function() {
			return this.get_delay() + this.get_time_created();
		},
		kill$1: function(target_, type_) {
			if (ss.isValue(this.msg_objs) && (this.get_evtype() === type_ || type_ === 0)) {
				if (this.msg_objs.contains(this.get_target())) {
					this.msg_objs.remove(this.get_target());
				}
			}
			var t = Type.safeCast(target_, $Forays_Tile);
			if (ss.isValue(t) && ss.isValue(this.area) && this.area.contains(t)) {
				//				target = null;
				//				if(msg_objs != null){
				//				msg_objs.Clear();
				//				msg_objs = null;
				//				}
				//				area.Clear();
				//				area = null;
				//				dead = true;
				this.area.remove(t);
			}
			if (ss.referenceEquals(this.get_target(), target_) && (this.get_evtype() === type_ || type_ === 0)) {
				this.set_target(null);
				if (ss.isValue(this.msg_objs)) {
					this.msg_objs.clear();
					this.msg_objs = null;
				}
				if (ss.isValue(this.area)) {
					this.area.clear();
					this.area = null;
				}
				this.set_dead(true);
			}
			if (type_ === 3 && this.get_evtype() === 3) {
				this.set_dead(true);
			}
			if (ss.isNullOrUndefined(target_) && type_ === 7 && this.get_evtype() === 7) {
				this.set_dead(true);
			}
			if (ss.isNullOrUndefined(target_) && type_ === 5 && this.get_evtype() === 5) {
				this.set_dead(true);
			}
			if (ss.isNullOrUndefined(target_) && type_ === 4 && this.get_evtype() === 4) {
				this.set_dead(true);
			}
			if (ss.isNullOrUndefined(target_) && type_ === 9 && this.get_evtype() === 9) {
				this.set_dead(true);
			}
		},
		kill: function(target_, attr_) {
			if (ss.referenceEquals(this.get_target(), target_) && this.get_evtype() === 2 && this.get_attr() === attr_) {
				this.set_target(null);
				if (ss.isValue(this.msg_objs)) {
					this.msg_objs.clear();
					this.msg_objs = null;
				}
				if (ss.isValue(this.area)) {
					this.area.clear();
					this.area = null;
				}
				this.set_dead(true);
			}
		},
		execute: function() {
			if (!this.get_dead()) {
				switch (this.get_evtype()) {
					case 1: {
						var temp = Type.safeCast(this.get_target(), $Forays_Actor);
						temp.input();
						break;
					}
					case 2: {
						var temp1 = Type.safeCast(this.get_target(), $Forays_Actor);
						if (temp1.get_atype() === 30 && this.get_attr() === 70) {
							temp1.attrs.set_item(this.get_attr(), 0);
						}
						else {
							var $t1 = temp1.attrs;
							var $t2 = this.get_attr();
							$t1.set_item($t2, $t1.get_item($t2) - this.get_value());
						}
						if (this.get_attr() === 42 || this.get_attr() === 73) {
							temp1.attrs.set_item(this.get_attr(), 0);
						}
						if (this.get_attr() === 16 && temp1.get_light_radius() > 0) {
							temp1.updateRadius$1(temp1.lightRadius(), 6 - temp1.attrs.get_item(46), true);
							//where 6 is the default radius
							if (temp1.attrs.get_item(31) > temp1.get_light_radius()) {
								temp1.updateRadius(temp1.get_light_radius(), temp1.attrs.get_item(31));
							}
						}
						if (this.get_attr() === 35) {
							if (temp1.get_atype() !== 0) {
								temp1.set_speed($Forays_Actor.prototype$1(temp1.get_atype()).get_speed());
							}
							else if (temp1.hasAttr(20)) {
								temp1.set_speed(80);
							}
							else {
								temp1.set_speed(100);
							}
						}
						if (this.get_attr() === 34 && ss.referenceEquals(this.get_target(), $Forays_Event.get_player())) {
							$Forays_Global.flushInput();
						}
						if (this.get_attr() === 84) {
							temp1.set_speed(temp1.get_speed() + 10 * this.get_value());
						}
						if (this.get_attr() === 87) {
							if (temp1.hasAttr(86)) {
								temp1.attrs.set_item(87, temp1.attrs.get_item(87) + this.get_value());
								//whoops, undo that
							}
							else {
								temp1.attrs.set_item(101, temp1.attrs.get_item(101) - this.get_value());
								//otherwise, set things to normal
								temp1.attrs.set_item(98, temp1.attrs.get_item(98) - ss.Int32.div(this.get_value(), 2));
								if (temp1.attrs.get_item(88) >= 2) {
									$Forays_Event.get_b().add('You wipe off your weapon. ');
								}
								temp1.attrs.set_item(88, 0);
							}
						}
						if (this.get_attr() === 27 && this.get_msg().search(new RegExp('disoriented')) > 0) {
							if (!$Forays_Event.get_player().canSee(this.get_target())) {
								this.set_msg('');
							}
						}
						if (this.get_attr() === 29 && ss.referenceEquals(temp1, $Forays_Event.get_player())) {
							if (temp1.hasAttr(29)) {
								$Forays_Event.get_b().add('The poison begins to subside. ');
							}
							else {
								$Forays_Event.get_b().add('You are no longer poisoned. ');
							}
						}
						if (this.get_attr() === 69 && temp1.get_atype() === 30) {
							$Forays_Event.get_b().add$1(temp1.your() + ' rage diminishes. ', temp1);
							$Forays_Event.get_b().add$1(temp1.get_the_name() + ' dies. ', temp1);
							temp1.takeDamage$1(0, 2, 8888, null);
						}
						break;
					}
					case 3: {
						var removed = [];
						for (var $t3 = 0; $t3 < this.area.length; $t3++) {
							var t = this.area[$t3];
							if ($Forays_Event.get_player().canSee(t)) {
								var exponent = $Forays_Event.get_player().distanceFrom(t) + 1;
								if ($Forays_Event.get_player().hasAttr(18)) {
									--exponent;
								}
								if (!t.isLit()) {
									if (!$Forays_Event.get_player().hasAttr(85)) {
										++exponent;
									}
								}
								if (exponent > 8) {
									exponent = 8;
									//because 1 in 256 is enough.
								}
								var difficulty = 1;
								for (var i = exponent; i > 0; --i) {
									difficulty = difficulty * 2;
								}
								if ($Forays_Global.roll(difficulty) === difficulty) {
									if (t.isTrap() || t.is$1(29) || t.is$1(32) || t.is$1(33)) {
										t.set_name($Forays_Tile.prototype$1(t.get_ttype()).get_name());
										t.set_a_name($Forays_Tile.prototype$1(t.get_ttype()).get_a_name());
										t.set_the_name($Forays_Tile.prototype$1(t.get_ttype()).get_the_name());
										t.set_symbol($Forays_Tile.prototype$1(t.get_ttype()).get_symbol());
										t.set_color($Forays_Tile.prototype$1(t.get_ttype()).get_color());
										$Forays_Event.get_b().add('You notice ' + t.get_a_name() + '. ');
									}
									else if (t.get_ttype() === 20) {
										t.toggle(null);
										$Forays_Event.get_b().add('You notice a hidden door. ');
									}
									removed.add(t);
								}
							}
						}
						for (var $t4 = 0; $t4 < removed.length; $t4++) {
							var t1 = removed[$t4];
							this.area.remove(t1);
						}
						if (this.area.length > 0) {
							$Forays_Event.get_q().add(new $Forays_Event.$ctor6(this.area, 100, 3));
						}
						break;
					}
					case 4: {
						if ($Forays_Event.get_m().allActors().length === 1 && !$Forays_Event.get_q().contains(5) && !$Forays_Event.get_q().contains(21) && !$Forays_Event.get_q().contains(7) && !$Forays_Event.get_q().contains(6) && !$Forays_Event.get_q().contains(18)) {
							$Forays_Event.get_b().add('The dungeon is still and silent. ');
							$Forays_Event.get_b().printAll();
						}
						else {
							$Forays_Event.get_q().add(new $Forays_Event.$ctor2(($Forays_Global.roll(20) + 40) * 100, 4));
						}
						break;
					}
					case 5: {
						if (ss.isValue(this.get_target()) && Type.isInstanceOfType(this.get_target(), $Forays_Actor)) {
							//target can either be a stolen item, or the currently manifested poltergeist.
							$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, ($Forays_Global.roll(8) + 6) * 100, 5, 109, 0, ''));
							break;
							//if it's manifested, the event does nothing for now.
						}
						if ($Forays_Extensions.any($Forays_Tile).call(null, this.area, function(t2) {
							return ss.referenceEquals(t2.actor(), $Forays_Event.get_player());
						})) {
							var manifested = false;
							if (this.get_value() === 0) {
								$Forays_Event.get_b().add('You feel like you\'re being watched. ');
							}
							else if (ss.isValue(this.get_target())) {
								//if it has a stolen item
								var tile = null;
								tile = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.area, function(t3) {
									return ss.isNullOrUndefined(t3.actor()) && t3.distanceFrom($Forays_Event.get_player()) >= 2 && t3.hasLOE($Forays_Event.get_player()) && ss.referenceEquals(t3.firstActorInLine($Forays_Event.get_player()), $Forays_Event.get_player());
								}));
								if (ss.isValue(tile)) {
									var temporary = new $Forays_Actor.$ctor2(26, 'something', 'G', 11, 1, 1, 0, 0);
									temporary.set_a_name('something');
									temporary.set_the_name('something');
									temporary.p = tile.p;
									temporary.set_inv([]);
									temporary.get_inv().add(Type.safeCast(this.get_target(), $Forays_Item));
									var item = temporary.get_inv()[0];
									if (item.get_symbol() === '*') {
										//orbs
										if (item.get_itype() === 11 || item.get_itype() === 12) {
											$Forays_Event.get_b().add$1(temporary.you('throw') + ' ' + item.aName() + '. ', temporary);
											$Forays_Event.get_b().displayNow();
											$Forays_Screen.animateProjectile($Forays_Extensions.toFirstObstruction(tile.getBestExtendedLineOfEffect($Forays_Event.get_player())), new $Forays_colorchar.$ctor2(item.get_color(), item.get_symbol()));
											$Forays_Event.get_b().add(item.theName() + ' shatters on you! ');
										}
										temporary.get_inv()[0].use$1(temporary, temporary.getBestExtendedLineOfEffect($Forays_Event.get_player()));
									}
									else {
										$Forays_Event.get_b().add$1(temporary.you('throw') + ' ' + item.aName() + '. ', temporary);
										$Forays_Event.get_b().displayNow();
										$Forays_Screen.animateProjectile($Forays_Extensions.toFirstObstruction(tile.getBestExtendedLineOfEffect($Forays_Event.get_player())), new $Forays_colorchar.$ctor2(item.get_color(), item.get_symbol()));
										$Forays_Event.get_player().tile().getItem(item);
										$Forays_Event.get_b().add(item.theName() + ' hits you. ');
										$Forays_Event.get_player().takeDamage$2(0, 0, $Forays_Global.roll(6), temporary, 'a flying ' + item.name());
									}
									this.set_target(null);
								}
								else {
									$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, 100, 5, 109, this.get_value(), ''));
									return;
									//try again next turn
								}
							}
							else if (this.get_value() >= 3 && $Forays_Extensions.any($Forays_Tile).call(null, this.area, function(t4) {
								return t4.distanceFrom($Forays_Event.get_player()) === 1 && t4.get_passable() && ss.isNullOrUndefined(t4.actor());
							})) {
								var tile1 = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.area, function(t5) {
									return t5.distanceFrom($Forays_Event.get_player()) === 1 && t5.get_passable() && ss.isNullOrUndefined(t5.actor());
								}));
								$Forays_Event.get_b().displayNow();
								for (var i1 = 4; i1 > 0; --i1) {
									$Forays_Screen.animateStorm$1(tile1.p, i1, 2, 1, 'G', 11);
								}
								var a = $Forays_Actor.create(26, tile1.get_row(), tile1.get_col());
								$Forays_Event.get_q().killEvents$1(a, 1);
								a.q0();
								a.player_visibility_duration = -1;
								var $t5 = $Forays_Event.get_q().list;
								for (var $t6 = 0; $t6 < $t5.length; $t6++) {
									var e = $t5[$t6];
									if (ss.isValue(e) && ss.isValue(e.get_target()) && ss.referenceEquals(e.get_target(), a) && e.get_evtype() === 1) {
										e.set_tiebreaker(this.get_tiebreaker());
										break;
									}
								}
								$Forays_Actor.tiebreakers[this.get_tiebreaker()] = a;
								$Forays_Event.get_b().add('A poltergeist manifests in front of you! ');
								$Forays_Event.get_q().add(new $Forays_Event.$ctorf(a, this.area, ($Forays_Global.roll(8) + 6) * 100, 5, 109, 0, ''));
								manifested = true;
							}
							else if ($Forays_Event.get_player().tile().get_ttype() === 2) {
								$Forays_Event.get_b().add('The door slams closed on you! ');
								$Forays_Event.get_player().takeDamage$2(0, 0, $Forays_Global.roll(6), null, 'a slamming door');
							}
							else {
								var tile2 = null;
								//check for items to throw...
								tile2 = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.area, function(t6) {
									return ss.isValue(t6.get_inv()) && ss.isNullOrUndefined(t6.actor()) && t6.distanceFrom($Forays_Event.get_player()) >= 2 && t6.hasLOE($Forays_Event.get_player()) && ss.referenceEquals(t6.firstActorInLine($Forays_Event.get_player()), $Forays_Event.get_player());
								}));
								if (ss.isValue(tile2)) {
									var temporary1 = new $Forays_Actor.$ctor2(26, 'something', 'G', 11, 1, 1, 0, 0);
									temporary1.set_a_name('something');
									temporary1.set_the_name('something');
									temporary1.p = tile2.p;
									temporary1.set_inv([]);
									if (tile2.get_inv().get_quantity() <= 1) {
										temporary1.get_inv().add(tile2.get_inv());
										tile2.set_inv(null);
									}
									else {
										temporary1.get_inv().add(new $Forays_Item.$ctor1(tile2.get_inv(), -1, -1));
										var $t7 = tile2.get_inv();
										$t7.set_quantity($t7.get_quantity() - 1);
									}
									$Forays_Event.get_m().draw();
									var item1 = temporary1.get_inv()[0];
									if (item1.get_symbol() === '*') {
										//orbs
										if (item1.get_itype() === 11 || item1.get_itype() === 12) {
											$Forays_Event.get_b().add$1(temporary1.you('throw') + ' ' + item1.theName() + '. ', temporary1);
											$Forays_Event.get_b().displayNow();
											$Forays_Screen.animateProjectile($Forays_Extensions.toFirstObstruction(tile2.getBestExtendedLineOfEffect($Forays_Event.get_player())), new $Forays_colorchar.$ctor2(item1.get_color(), item1.get_symbol()));
											$Forays_Event.get_b().add(item1.theName() + ' shatters on you! ');
										}
										temporary1.get_inv()[0].use$1(temporary1, temporary1.getBestExtendedLineOfEffect($Forays_Event.get_player()));
									}
									else {
										$Forays_Event.get_b().add$1(temporary1.you('throw') + ' ' + item1.theName() + '. ', temporary1);
										$Forays_Event.get_b().displayNow();
										$Forays_Screen.animateProjectile($Forays_Extensions.toFirstObstruction(tile2.getBestExtendedLineOfEffect($Forays_Event.get_player())), new $Forays_colorchar.$ctor2(item1.get_color(), item1.get_symbol()));
										$Forays_Event.get_player().tile().getItem(item1);
										$Forays_Event.get_b().add(item1.theName() + ' hits you. ');
										$Forays_Event.get_player().takeDamage$2(0, 0, $Forays_Global.roll(6), temporary1, 'a flying ' + item1.name());
									}
								}
								else if ($Forays_Extensions.any($Forays_Tile).call(null, this.area, function(t7) {
									return t7.get_ttype() === 2 || t7.get_ttype() === 3;
								})) {
									var door = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.area, function(t8) {
										return t8.get_ttype() === 2 || t8.get_ttype() === 3;
									}));
									if (door.get_ttype() === 3) {
										if ($Forays_Event.get_player().canSee(door)) {
											$Forays_Event.get_b().add$1('The door flies open! ', door);
										}
										else if (door.get_seen() || $Forays_Event.get_player().distanceFrom(door) <= 12) {
											$Forays_Event.get_b().add('You hear a door slamming. ');
										}
										door.toggle(null);
									}
									else if (ss.isNullOrUndefined(door.actor())) {
										if ($Forays_Event.get_player().canSee(door)) {
											$Forays_Event.get_b().add$1('The door slams closed! ', door);
										}
										else if (door.get_seen() || $Forays_Event.get_player().distanceFrom(door) <= 12) {
											$Forays_Event.get_b().add('You hear a door slamming. ');
										}
										door.toggle(null);
									}
									else {
										if ($Forays_Event.get_player().canSee(door)) {
											$Forays_Event.get_b().add$1('The door slams closed on ' + door.actor().theVisible() + '! ', door);
										}
										else if ($Forays_Event.get_player().distanceFrom(door) <= 12) {
											$Forays_Event.get_b().add('You hear a door slamming and a grunt of pain. ');
										}
										door.actor().takeDamage$2(0, 0, $Forays_Global.roll(6), null, 'a slamming door');
									}
								}
								else {
									$Forays_Event.get_b().add('You hear mocking laughter from nearby. ');
								}
							}
							if (!manifested) {
								$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, ($Forays_Global.roll(8) + 6) * 100, 5, 109, this.get_value() + 1, ''));
							}
						}
						else {
							$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, ($Forays_Global.roll(8) + 6) * 100, 5, 109, 0, ''));
						}
						break;
					}
					case 6: {
						var item2 = Type.safeCast(this.get_target(), $Forays_Item);
						if (!ss.referenceEquals(this.area[0].get_inv(), item2)) {
							//it could have been picked up by the player or moved in another way
							var $t8 = $Forays_Event.get_m().allTiles();
							for (var $t9 = 0; $t9 < $t8.length; $t9++) {
								var t9 = $t8[$t9];
								//if it was moved, make the correction to the event's area.
								if (ss.referenceEquals(t9.get_inv(), item2)) {
									var $t10 = [];
									$t10.add(t9);
									this.area = $t10;
									break;
								}
							}
						}
						if (ss.referenceEquals(this.area[0].get_inv(), item2)) {
							var attacked = false;
							if ($Forays_Event.get_player().distanceFrom(this.area[0]) === 1 && ss.isNullOrUndefined(this.area[0].actor())) {
								if ($Forays_Event.get_player().stealth() * 5 < $Forays_Global.roll$1(1, 100)) {
									$Forays_Event.get_b().add(item2.theName() + ' suddenly grows tentacles! ');
									attacked = true;
									this.area[0].set_inv(null);
									var a1 = $Forays_Actor.create(16, this.area[0].get_row(), this.area[0].get_col());
									$Forays_Event.get_q().killEvents$1(a1, 1);
									a1.q0();
									a1.player_visibility_duration = -1;
									a1.set_symbol(item2.get_symbol());
									a1.set_color(item2.get_color());
									var $t11 = $Forays_Event.get_q().list;
									for (var $t12 = 0; $t12 < $t11.length; $t12++) {
										var e1 = $t11[$t12];
										if (ss.referenceEquals(e1.get_target(), a1) && e1.get_evtype() === 1) {
											e1.set_tiebreaker(this.get_tiebreaker());
											break;
										}
									}
									$Forays_Actor.tiebreakers[this.get_tiebreaker()] = a1;
								}
							}
							if (!attacked) {
								$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, 100, 6, 109, 0, ''));
							}
						}
						else {
							//if the item is missing, we assume that the player just picked it up
							var open = [];
							var $t13 = $Forays_Event.get_player().tilesAtDistance(1);
							for (var $t14 = 0; $t14 < $t13.length; $t14++) {
								var t10 = $t13[$t14];
								if (t10.get_passable() && ss.isNullOrUndefined(t10.actor())) {
									open.add(t10);
								}
							}
							if (open.length > 0) {
								var t11 = $Forays_Extensions.random($Forays_Tile).call(null, open);
								$Forays_Event.get_b().add(item2.theName() + ' suddenly grows tentacles! ');
								var a2 = $Forays_Actor.create(16, t11.get_row(), t11.get_col());
								$Forays_Event.get_q().killEvents$1(a2, 1);
								a2.q0();
								a2.player_visibility_duration = -1;
								a2.set_symbol(item2.get_symbol());
								a2.set_color(item2.get_color());
								var $t15 = $Forays_Event.get_q().list;
								for (var $t16 = 0; $t16 < $t15.length; $t16++) {
									var e2 = $t15[$t16];
									if (ss.referenceEquals(e2.get_target(), a2) && e2.get_evtype() === 1) {
										e2.set_tiebreaker(this.get_tiebreaker());
										break;
									}
								}
								$Forays_Actor.tiebreakers[this.get_tiebreaker()] = a2;
								$Forays_Event.get_player().get_inv().remove(item2);
							}
							else {
								$Forays_Event.get_b().add('Your pack feels lighter. ');
								$Forays_Event.get_player().get_inv().remove(item2);
							}
						}
						break;
					}
					case 8: {
						var t12 = Type.safeCast(this.get_target(), $Forays_Tile);
						if (t12.is(0)) {
							t12.features.remove(0);
							$Forays_Event.get_b().add$1('The grenade explodes! ', t12);
							if (t12.get_seen()) {
								$Forays_Screen.writeMapChar(t12.get_row(), t12.get_col(), $Forays_Event.get_m().visibleColorChar(t12.get_row(), t12.get_col()));
							}
							$Forays_Event.get_b().displayNow();
							var cells = [];
							var $t17 = t12.tilesWithinDistance(1);
							for (var $t18 = 0; $t18 < $t17.length; $t18++) {
								var tile3 = $t17[$t18];
								if (tile3.get_passable() && tile3.get_seen()) {
									cells.add(tile3.p);
								}
							}
							$Forays_Screen.animateMapCells(cells, new $Forays_colorchar.$ctor3(42, 10));
							//Screen.AnimateExplosion(t,1,new colorchar('*',Color.DarkRed));
							var $t19 = t12.actorsWithinDistance(1);
							for (var $t20 = 0; $t20 < $t19.length; $t20++) {
								var a3 = $t19[$t20];
								a3.takeDamage$2(0, 0, $Forays_Global.roll$1(3, 6), null, 'an exploding grenade');
							}
							if (ss.isValue(t12.actor())) {
								var dir = $Forays_Global.randomDirection();
								t12.actor().getKnockedBack(t12.tileInDirection(t12.actor().rotateDirection$1(dir, true, 4)));
							}
							if ($Forays_Event.get_player().distanceFrom(t12) <= 3) {
								$Forays_Event.get_player().makeNoise();
								//hacky - todo change
							}
						}
						break;
					}
					case 9: {
						var t13 = Type.safeCast(this.get_target(), $Forays_Tile);
						if (t13.is(10)) {
							t13.features.remove(10);
							$Forays_Event.get_b().add$1('The blast fungus explodes! ', t13);
							if (t13.get_seen()) {
								$Forays_Screen.writeMapChar(t13.get_row(), t13.get_col(), $Forays_Event.get_m().visibleColorChar(t13.get_row(), t13.get_col()));
							}
							$Forays_Event.get_b().displayNow();
							for (var i2 = 1; i2 <= 3; ++i2) {
								var cells1 = [];
								var $t21 = t13.tilesWithinDistance(i2);
								for (var $t22 = 0; $t22 < $t21.length; $t22++) {
									var tile4 = $t21[$t22];
									if (t13.hasLOE(tile4) && tile4.get_passable() && tile4.get_seen()) {
										cells1.add(tile4.p);
									}
								}
								$Forays_Screen.animateMapCells(cells1, new $Forays_colorchar.$ctor3(42, 10));
							}
							var $t23 = t13.actorsWithinDistance(3);
							for (var $t24 = 0; $t24 < $t23.length; $t24++) {
								var a4 = $t23[$t24];
								if (t13.hasLOE(a4)) {
									a4.takeDamage$2(0, 0, $Forays_Global.roll$1(5, 6), null, 'an exploding blast fungus');
								}
							}
							if (ss.isValue(t13.actor())) {
								var dir1 = $Forays_Global.randomDirection();
								t13.actor().getKnockedBack(t13.tileInDirection(t13.actor().rotateDirection$1(dir1, true, 4)));
							}
							if ($Forays_Event.get_player().distanceFrom(t13) <= 3) {
								$Forays_Event.get_player().makeNoise();
								//hacky - todo change
							}
						}
						if (t13.is(9)) {
							t13.features.remove(9);
							t13.features.add(10);
							$Forays_Event.get_q().add(new $Forays_Event.$ctor5(t13, 100, 9));
						}
						break;
					}
					case 10: {
						var stalagmites = 0;
						for (var $t25 = 0; $t25 < this.area.length; $t25++) {
							var tile5 = this.area[$t25];
							if (tile5.get_ttype() === 7) {
								stalagmites++;
							}
						}
						if (stalagmites > 0) {
							if (stalagmites > 1) {
								$Forays_Event.get_b().add$2('The stalagmites crumble. ', Enumerable.from(this.area).toArray());
							}
							else {
								$Forays_Event.get_b().add$2('The stalagmite crumbles. ', Enumerable.from(this.area).toArray());
							}
							for (var $t26 = 0; $t26 < this.area.length; $t26++) {
								var tile6 = this.area[$t26];
								if (tile6.get_ttype() === 7) {
									tile6.toggle(null);
								}
							}
						}
						break;
					}
					case 11: {
						var frequency = ss.Int32.div(this.get_value(), 10);
						//5-25
						var variance = this.get_value() % 10;
						//0-9
						var variance_amount = ss.Int32.div(frequency * variance, 10);
						var number_of_values = variance_amount * 2 + 1;
						var minimum_value = frequency - variance_amount;
						if (minimum_value < 5) {
							var diff = 5 - minimum_value;
							number_of_values -= diff;
							minimum_value = 5;
						}
						var delay = (minimum_value - 1 + $Forays_Global.roll(number_of_values)) * 100;
						$Forays_Event.get_q().add(new $Forays_Event.$ctora(this.get_target(), delay + 200, 11, this.get_value()));
						$Forays_Event.get_q().add(new $Forays_Event.$ctora(this.get_target(), delay, 12, 2));
						break;
					}
					case 12: {
						if (this.get_target().get_name() === 'floor') {
							var hiddencheck = null;
							var t14 = Type.safeCast(this.get_target(), $Forays_Tile);
							var $t27 = $Forays_Event.get_q().list;
							for (var $t28 = 0; $t28 < $t27.length; $t28++) {
								var e3 = $t27[$t28];
								if (!e3.get_dead() && e3.get_evtype() === 3) {
									hiddencheck = e3;
									break;
								}
							}
							if ($Forays_Event.get_player().hasLOS(t14)) {
								//t.seen = true;
								if (ss.isValue(hiddencheck)) {
									hiddencheck.area.remove(t14);
								}
								t14.set_name($Forays_Tile.prototype$1(t14.get_ttype()).get_name());
								t14.set_a_name($Forays_Tile.prototype$1(t14.get_ttype()).get_a_name());
								t14.set_the_name($Forays_Tile.prototype$1(t14.get_ttype()).get_the_name());
								t14.set_symbol($Forays_Tile.prototype$1(t14.get_ttype()).get_symbol());
								t14.set_color($Forays_Tile.prototype$1(t14.get_ttype()).get_color());
							}
						}
						if (this.get_value() >= 0) {
							//a value of -1 means 'reset light radius to 0'
							if (this.get_target().get_light_radius() === 0) {
								this.get_target().updateRadius$1(0, 8, true);
							}
							$Forays_Event.get_b().add$1(this.get_target().get_the_name() + ' spouts flames! ', this.get_target());
							$Forays_Event.get_m().draw();
							for (var i3 = 0; i3 < 3; ++i3) {
								var cells2 = [];
								var tiles = this.get_target().tilesWithinDistance(1);
								for (var j = 0; j < 5; ++j) {
									var t15 = $Forays_Extensions.removeRandom($Forays_Tile).call(null, tiles);
									if ($Forays_Event.get_player().canSee(t15)) {
										cells2.add(t15.p);
									}
								}
								if (cells2.length > 0) {
									$Forays_Screen.animateMapCells$2(cells2, new $Forays_colorchar.$ctor3(42, 3), 35);
								}
							}
							var $t29 = this.get_target().tilesWithinDistance(1);
							for (var $t30 = 0; $t30 < $t29.length; $t30++) {
								var t16 = $t29[$t30];
								var a5 = t16.actor();
								if (ss.isValue(a5)) {
									if (a5.takeDamage$2(1, 0, $Forays_Global.roll$1(2, 6), null, 'a fiery eruption')) {
										if (!a5.hasAttr(61) && !a5.hasAttr(64) && !a5.hasAttr(31) && !a5.hasAttr(32) && !a5.hasAttr(33)) {
											if (a5.get_name() === 'you') {
												$Forays_Event.get_b().add('You start to catch fire! ');
											}
											else {
												$Forays_Event.get_b().add$1(a5.get_the_name() + ' starts to catch fire. ', a5);
											}
											a5.attrs.set_item(32, 1);
										}
									}
								}
								if (t16.is(1)) {
									t16.features.remove(1);
									$Forays_Event.get_b().add$1('The troll corpse burns to ashes! ', t16);
								}
								if (t16.is(2)) {
									t16.features.remove(2);
									$Forays_Event.get_b().add$1('The troll seer corpse burns to ashes! ', t16);
								}
							}
							$Forays_Event.get_q().add(new $Forays_Event.$ctora(this.get_target(), 100, 12, this.get_value() - 1));
						}
						else {
							this.get_target().updateRadius$1(8, 0, true);
						}
						break;
					}
					case 13: {
						if (this.get_target().get_name() === 'floor') {
							var hiddencheck1 = null;
							var t17 = Type.safeCast(this.get_target(), $Forays_Tile);
							var $t31 = $Forays_Event.get_q().list;
							for (var $t32 = 0; $t32 < $t31.length; $t32++) {
								var e4 = $t31[$t32];
								if (!e4.get_dead() && e4.get_evtype() === 3) {
									hiddencheck1 = e4;
									break;
								}
							}
							if ($Forays_Event.get_player().canSee(t17)) {
								//t.seen = true;
								if (ss.isValue(hiddencheck1)) {
									hiddencheck1.area.remove(t17);
								}
								t17.set_name($Forays_Tile.prototype$1(t17.get_ttype()).get_name());
								t17.set_a_name($Forays_Tile.prototype$1(t17.get_ttype()).get_a_name());
								t17.set_the_name($Forays_Tile.prototype$1(t17.get_ttype()).get_the_name());
								t17.set_symbol($Forays_Tile.prototype$1(t17.get_ttype()).get_symbol());
								t17.set_color($Forays_Tile.prototype$1(t17.get_ttype()).get_color());
							}
						}
						var current = Type.safeCast(this.get_target(), $Forays_Tile);
						if (!current.is(5)) {
							current.addOpaqueFeature(5);
							var $t34 = $Forays_Event.get_q();
							var $t33 = [];
							$t33.add(current);
							$t34.add(new $Forays_Event.$ctor6($t33, 400, 14));
						}
						else {
							for (var tries = 0; tries < 50; ++tries) {
								var open1 = [];
								var $t35 = current.tilesAtDistance(1);
								for (var $t36 = 0; $t36 < $t35.length; $t36++) {
									var t18 = $t35[$t36];
									if (t18.get_passable()) {
										open1.add(t18);
									}
								}
								if (open1.length > 0) {
									var possible = $Forays_Extensions.random($Forays_Tile).call(null, open1);
									if (!possible.is(5)) {
										possible.addOpaqueFeature(5);
										var $t38 = $Forays_Event.get_q();
										var $t37 = [];
										$t37.add(possible);
										$t38.add(new $Forays_Event.$ctor6($t37, 400, 14));
										break;
									}
									else {
										current = possible;
									}
								}
								else {
									break;
								}
							}
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor5(this.get_target(), 100, 13));
						break;
					}
					case 14: {
						var removed1 = [];
						for (var $t39 = 0; $t39 < this.area.length; $t39++) {
							var t19 = this.area[$t39];
							if (t19.is(5) && $Forays_Global.oneIn(4)) {
								t19.removeOpaqueFeature(5);
								removed1.add(t19);
							}
						}
						for (var $t40 = 0; $t40 < removed1.length; $t40++) {
							var t20 = removed1[$t40];
							this.area.remove(t20);
						}
						if (this.area.length > 0) {
							$Forays_Event.get_q().add(new $Forays_Event.$ctor6(this.area, 100, 14));
						}
						break;
					}
					case 15: {
						if (this.get_target().get_name() === 'floor') {
							var hiddencheck2 = null;
							var t21 = Type.safeCast(this.get_target(), $Forays_Tile);
							var $t41 = $Forays_Event.get_q().list;
							for (var $t42 = 0; $t42 < $t41.length; $t42++) {
								var e5 = $t41[$t42];
								if (!e5.get_dead() && e5.get_evtype() === 3) {
									hiddencheck2 = e5;
									break;
								}
							}
							if ($Forays_Event.get_player().canSee(t21)) {
								//t.seen = true;
								if (ss.isValue(hiddencheck2)) {
									hiddencheck2.area.remove(t21);
								}
								t21.set_name($Forays_Tile.prototype$1(t21.get_ttype()).get_name());
								t21.set_a_name($Forays_Tile.prototype$1(t21.get_ttype()).get_a_name());
								t21.set_the_name($Forays_Tile.prototype$1(t21.get_ttype()).get_the_name());
								t21.set_symbol($Forays_Tile.prototype$1(t21.get_ttype()).get_symbol());
								t21.set_color($Forays_Tile.prototype$1(t21.get_ttype()).get_color());
							}
						}
						var current1 = Type.safeCast(this.get_target(), $Forays_Tile);
						if ($Forays_Global.oneIn(7)) {
							var num = $Forays_Global.roll(5) + 2;
							var new_area = [];
							for (var i4 = 0; i4 < num; ++i4) {
								if (!current1.is(6)) {
									current1.features.add(6);
									new_area.add(current1);
								}
								else {
									for (var tries1 = 0; tries1 < 50; ++tries1) {
										var open2 = [];
										var $t43 = current1.tilesAtDistance(1);
										for (var $t44 = 0; $t44 < $t43.length; $t44++) {
											var t22 = $t43[$t44];
											if (t22.get_passable()) {
												open2.add(t22);
											}
										}
										if (open2.length > 0) {
											var possible1 = $Forays_Extensions.random($Forays_Tile).call(null, open2);
											if (!possible1.is(6)) {
												possible1.features.add(6);
												new_area.add(possible1);
												break;
											}
											else {
												current1 = possible1;
											}
										}
										else {
											break;
										}
									}
								}
							}
							if (new_area.length > 0) {
								$Forays_Event.get_b().add$1('Toxic vapors pour from ' + this.get_target().get_the_name() + '! ', this.get_target());
								$Forays_Event.get_q().add(new $Forays_Event.$ctor6(new_area, 200, 16));
							}
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor5(this.get_target(), 100, 15));
						break;
					}
					case 16: {
						var removed2 = [];
						for (var $t45 = 0; $t45 < this.area.length; $t45++) {
							var t23 = this.area[$t45];
							if (t23.is(6) && $Forays_Global.oneIn(6)) {
								t23.removeOpaqueFeature(6);
								removed2.add(t23);
							}
						}
						for (var $t46 = 0; $t46 < removed2.length; $t46++) {
							var t24 = removed2[$t46];
							this.area.remove(t24);
						}
						if (this.area.length > 0) {
							$Forays_Event.get_q().add(new $Forays_Event.$ctor6(this.area, 100, 16));
						}
						break;
					}
					case 17: {
						var t25 = Type.safeCast(this.get_target(), $Forays_Tile);
						if (t25.get_ttype() === 34 && (t25.isLitFromAnywhere$1(true) || $Forays_Extensions.any($Forays_Tile).call(null, this.area, function(x) {
							return ss.isValue(x.actor());
						}))) {
							var vis = $Forays_Event.get_player().canSee(t25);
							t25.toggle$1(null, 1);
							if (!vis && $Forays_Event.get_player().canSee(t25)) {
								vis = true;
							}
							if (vis) {
								$Forays_Event.get_b().add('The stone slab rises with a grinding sound. ');
							}
							else if ($Forays_Event.get_player().distanceFrom(t25) <= 6) {
								$Forays_Event.get_b().add('You hear a grinding sound. ');
							}
						}
						else if (t25.get_ttype() === 1 && !t25.isLitFromAnywhere$1(true) && ss.isNullOrUndefined(t25.actor()) && !$Forays_Extensions.any($Forays_Tile).call(null, this.area, function(x1) {
							return ss.isValue(x1.actor());
						})) {
							var vis1 = $Forays_Event.get_player().canSee(t25);
							t25.toggle$1(null, 34);
							if (!vis1 && $Forays_Event.get_player().canSee(t25)) {
								vis1 = true;
							}
							if (vis1) {
								$Forays_Event.get_b().add('The stone slab descends with a grinding sound. ');
							}
							else if ($Forays_Event.get_player().distanceFrom(t25) <= 6) {
								$Forays_Event.get_b().add('You hear a grinding sound. ');
							}
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor7(this.get_target(), this.area, 100, 17));
						break;
					}
					case 18: {
						var t26 = Type.safeCast(this.get_target(), $Forays_Tile);
						if (t26.get_ttype() === 30) {
							if (this.get_value() === 1 && $Forays_Event.get_player().canSee(t26) && !t26.isLit() && ss.isNullOrUndefined(t26.actor())) {
								//if target was visible last turn & this turn, and it's currently in darkness...
								t26.transformTo(1);
								var a6 = $Forays_Actor.create$1(37, t26.get_row(), t26.get_col(), true, true);
								var $t47 = $Forays_Event.get_q().list;
								for (var $t48 = 0; $t48 < $t47.length; $t48++) {
									var e6 = $t47[$t48];
									if (ss.referenceEquals(e6.get_target(), a6) && e6.get_evtype() === 1) {
										e6.set_dead(true);
										break;
									}
								}
								a6.q0();
								switch ($Forays_Global.roll(2)) {
									case 1: {
										$Forays_Event.get_b().add('You think that statue might have just moved... ');
										break;
									}
									case 2: {
										$Forays_Event.get_b().add('The statue turns its head to face you. ');
										break;
									}
								}
							}
							else if ($Forays_Event.get_player().canSee(t26)) {
								$Forays_Event.get_q().add(new $Forays_Event.$ctora(this.get_target(), 100, 18, 1));
							}
							else {
								$Forays_Event.get_q().add(new $Forays_Event.$ctora(this.get_target(), 100, 18, 0));
							}
						}
						break;
					}
					case 7: {
						if (this.get_target().tile().is(1)) {
							//otherwise, assume it was destroyed by fire
							this.set_value(this.get_value() + 1);
							if (this.get_value() > 0 && ss.isNullOrUndefined(this.get_target().actor())) {
								var a7 = $Forays_Actor.create(31, this.get_target().get_row(), this.get_target().get_col());
								var $t49 = $Forays_Event.get_q().list;
								for (var $t50 = 0; $t50 < $t49.length; $t50++) {
									var e7 = $t49[$t50];
									if (ss.referenceEquals(e7.get_target(), $Forays_Event.get_m().actor.get_item(this.get_target().get_row(), this.get_target().get_col())) && e7.get_evtype() === 1) {
										e7.set_tiebreaker(this.get_tiebreaker());
										break;
									}
								}
								$Forays_Actor.tiebreakers[this.get_tiebreaker()] = a7;
								this.get_target().actor().set_curhp(this.get_value());
								this.get_target().actor().set_level(0);
								var $t51 = this.get_target().actor().attrs;
								$t51.set_item(26, $t51.get_item(26) + 1);
								$Forays_Event.get_b().add$1('The troll stands up! ', this.get_target());
								this.get_target().actor().player_visibility_duration = -1;
								if (this.get_target().tile().get_ttype() === 3) {
									this.get_target().tile().toggle(this.get_target().actor());
								}
								this.get_target().tile().features.remove(1);
								if ($Forays_Global.oneIn(3)) {
									var $t52 = this.get_target().actor().attrs;
									$t52.set_item(11, $t52.get_item(11) + 1);
								}
							}
							else {
								var roll = $Forays_Global.roll(20);
								if (this.get_value() === -1) {
									roll = 1;
								}
								if (this.get_value() === 0) {
									roll = 3;
								}
								switch (roll) {
									case 1:
									case 2: {
										$Forays_Event.get_b().add$1('The troll\'s corpse twitches. ', this.get_target());
										break;
									}
									case 3:
									case 4: {
										$Forays_Event.get_b().add$1('You hear sounds coming from the troll\'s corpse. ', this.get_target());
										break;
									}
									case 5: {
										$Forays_Event.get_b().add$1('The troll on the floor regenerates. ', this.get_target());
										break;
									}
									default: {
										break;
									}
								}
								$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), null, 100, 7, this.get_attr(), this.get_value(), ''));
							}
						}
						if (this.get_target().tile().is(2)) {
							//otherwise, assume it was destroyed by fire
							this.set_value(this.get_value() + 1);
							if (this.get_value() > 0 && ss.isNullOrUndefined(this.get_target().actor())) {
								var a8 = $Forays_Actor.create(46, this.get_target().get_row(), this.get_target().get_col());
								var $t53 = $Forays_Event.get_q().list;
								for (var $t54 = 0; $t54 < $t53.length; $t54++) {
									var e8 = $t53[$t54];
									if (ss.referenceEquals(e8.get_target(), $Forays_Event.get_m().actor.get_item(this.get_target().get_row(), this.get_target().get_col())) && e8.get_evtype() === 1) {
										e8.set_tiebreaker(this.get_tiebreaker());
										break;
									}
								}
								$Forays_Actor.tiebreakers[this.get_tiebreaker()] = a8;
								this.get_target().actor().set_curhp(this.get_value());
								this.get_target().actor().set_level(0);
								var $t55 = this.get_target().actor().attrs;
								$t55.set_item(26, $t55.get_item(26) + 1);
								$Forays_Event.get_b().add$1('The troll seer stands up! ', this.get_target());
								this.get_target().actor().player_visibility_duration = -1;
								if (this.get_attr() === 69) {
									var $t56 = this.get_target().actor().attrs;
									$t56.set_item(69, $t56.get_item(69) + 1);
								}
								if (this.get_target().tile().get_ttype() === 3) {
									this.get_target().tile().toggle(this.get_target().actor());
								}
								this.get_target().tile().features.remove(2);
								if ($Forays_Global.oneIn(3)) {
									var $t57 = this.get_target().actor().attrs;
									$t57.set_item(11, $t57.get_item(11) + 1);
								}
							}
							else {
								var roll1 = $Forays_Global.roll(20);
								if (this.get_value() === -1) {
									roll1 = 1;
								}
								if (this.get_value() === 0) {
									roll1 = 3;
								}
								switch (roll1) {
									case 1:
									case 2: {
										$Forays_Event.get_b().add$1('The troll seer\'s corpse twitches. ', this.get_target());
										break;
									}
									case 3:
									case 4: {
										$Forays_Event.get_b().add$1('You hear sounds coming from the troll seer\'s corpse. ', this.get_target());
										break;
									}
									case 5: {
										$Forays_Event.get_b().add$1('The troll seer on the floor regenerates. ', this.get_target());
										break;
									}
									default: {
										break;
									}
								}
								$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), null, 100, 7, this.get_attr(), this.get_value(), ''));
							}
						}
						break;
					}
					case 19: {
						var actors = [];
						if (this.get_value() >= 0) {
							for (var $t58 = 0; $t58 < this.area.length; $t58++) {
								var t27 = this.area[$t58];
								if (ss.isValue(t27.actor())) {
									actors.add(t27.actor());
								}
								if (t27.is(1)) {
									t27.features.remove(1);
									$Forays_Event.get_b().add$1('The troll corpse burns to ashes! ', t27);
								}
								if (t27.is(2)) {
									t27.features.remove(2);
									$Forays_Event.get_b().add$1('The troll seer corpse burns to ashes! ', t27);
								}
								if (t27.is(8)) {
									$Forays_Event.get_q().add(new $Forays_Event.$ctor5(t27, 200, 9));
									$Forays_Actor.get_b().add$1('The blast fungus starts to smolder in the light. ', t27);
									t27.features.remove(8);
									t27.features.add(9);
								}
							}
						}
						if (this.get_value() > 0) {
							var radius = 4 - this.get_value();
							var added = [];
							var $t59 = this.get_target().tilesWithinDistance(radius);
							for (var $t60 = 0; $t60 < $t59.length; $t60++) {
								var t28 = $t59[$t60];
								if (t28.get_passable() && !t28.is(3) && t28.isAdjacentTo(3) && !this.area.contains(t28)) {
									added.add(t28);
								}
							}
							for (var $t61 = 0; $t61 < added.length; $t61++) {
								var t29 = added[$t61];
								this.area.add(t29);
								t29.features.add(3);
							}
						}
						if (this.get_value() < 0) {
							var radius1 = 4 + this.get_value();
							var removed3 = [];
							for (var $t62 = 0; $t62 < this.area.length; $t62++) {
								var t30 = this.area[$t62];
								if (t30.distanceFrom(this.get_target()) === radius1) {
									removed3.add(t30);
								}
								else {
									if (ss.isValue(t30.actor())) {
										actors.add(t30.actor());
									}
									if (t30.is(1)) {
										t30.features.remove(1);
										$Forays_Event.get_b().add$1('The troll corpse burns to ashes! ', t30);
									}
									if (t30.is(2)) {
										t30.features.remove(2);
										$Forays_Event.get_b().add$1('The troll seer corpse burns to ashes! ', t30);
									}
									if (t30.is(8)) {
										$Forays_Event.get_q().add(new $Forays_Event.$ctor5(t30, 200, 9));
										$Forays_Actor.get_b().add$1('The blast fungus starts to smolder in the light. ', t30);
										t30.features.remove(8);
										t30.features.add(9);
									}
								}
							}
							for (var $t63 = 0; $t63 < removed3.length; $t63++) {
								var t31 = removed3[$t63];
								this.area.remove(t31);
								t31.features.remove(3);
							}
						}
						for (var $t64 = 0; $t64 < actors.length; $t64++) {
							var a9 = actors[$t64];
							if (!a9.hasAttr(64) && !a9.hasAttr(103)) {
								if ($Forays_Event.get_player().canSee(a9.tile())) {
									$Forays_Event.get_b().add$1('The quickfire burns ' + a9.get_the_name() + '. ', a9);
								}
								a9.takeDamage$2(1, 0, $Forays_Global.roll(6), null, 'quickfire');
							}
						}
						this.set_value(this.get_value() - 1);
						if (this.get_value() > -5) {
							$Forays_Event.get_q().add(new $Forays_Event.$ctorf(this.get_target(), this.area, 100, 19, 109, this.get_value(), ''));
						}
						break;
					}
					case 20: {
						var s = '';
						switch ($Forays_Global.roll(8)) {
							case 1: {
								s = 'You see scratch marks on the walls and floor. ';
								break;
							}
							case 2: {
								s = 'There are deep gouges in the floor here. ';
								break;
							}
							case 3: {
								s = 'The floor here is scorched and blackened. ';
								break;
							}
							case 4: {
								s = 'You notice bones of an unknown sort on the floor. ';
								break;
							}
							case 5: {
								s = 'You hear a distant roar. ';
								break;
							}
							case 6: {
								s = 'You smell smoke. ';
								break;
							}
							case 7: {
								s = 'You spot a large reddish scale on the floor. ';
								break;
							}
							case 8: {
								s = 'A small tremor shakes the area. ';
								break;
							}
							default: {
								s = 'Debug message. ';
								break;
							}
						}
						if (!$Forays_Event.get_player().hasAttr(78)) {
							$Forays_Event.get_b().addIfEmpty(s);
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor2(($Forays_Global.roll(20) + 35) * 100, 20));
						break;
					}
					case 21: {
						var spawned = false;
						var a10 = null;
						if ($Forays_Event.get_m().allActors().length === 1 && !$Forays_Event.get_q().contains(5)) {
							var trolls = [];
							var $t65 = $Forays_Event.get_q().list;
							for (var $t66 = 0; $t66 < $t65.length; $t66++) {
								var current2 = $t65[$t66];
								if (current2.get_evtype() === 7) {
									trolls.add(Type.safeCast(current2.get_target(), $Forays_Tile));
								}
							}
							for (var $t67 = 0; $t67 < trolls.length; $t67++) {
								var troll = trolls[$t67];
								if (troll.is(1)) {
									$Forays_Event.get_b().add$1('The troll corpse burns to ashes! ', troll);
									troll.features.remove(1);
								}
								else if (troll.is(2)) {
									$Forays_Event.get_b().add$1('The troll seer corpse burns to ashes! ', troll);
									troll.features.remove(2);
								}
							}
							$Forays_Event.get_q().killEvents$1(null, 7);
							var goodtiles = $Forays_Event.get_m().allTiles();
							var removed4 = [];
							for (var $t68 = 0; $t68 < goodtiles.length; $t68++) {
								var t32 = goodtiles[$t68];
								if (!t32.get_passable() || t32.is$1(35) || $Forays_Event.get_player().canSee(t32)) {
									removed4.add(t32);
								}
							}
							for (var $t69 = 0; $t69 < removed4.length; $t69++) {
								var t33 = removed4[$t69];
								goodtiles.remove(t33);
							}
							if (goodtiles.length > 0) {
								$Forays_Event.get_b().add('You hear a loud crash and a nearby roar! ');
								var t34 = goodtiles[$Forays_Global.roll(goodtiles.length) - 1];
								a10 = $Forays_Actor.create$1(2, t34.get_row(), t34.get_col(), true, false);
								spawned = true;
							}
							else if ($Forays_Extensions.any($Forays_Tile).call(null, $Forays_Event.get_m().allTiles(), function(t35) {
								return t35.get_passable() && !t35.is$1(35) && ss.isNullOrUndefined(t35.actor());
							})) {
								$Forays_Event.get_b().add('You hear a loud crash and a nearby roar! ');
								var tile7 = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, $Forays_Event.get_m().allTiles(), function(t36) {
									return t36.get_passable() && !t36.is$1(35) && ss.isNullOrUndefined(t36.actor());
								}));
								a10 = $Forays_Actor.create$1(2, tile7.get_row(), tile7.get_col(), true, false);
								spawned = true;
							}
						}
						if (!spawned) {
							$Forays_Event.get_q().add(new $Forays_Event.$ctorf(null, null, ($Forays_Global.roll(20) + 10) * 100, 21, this.get_attr(), this.get_value(), ''));
						}
						else if (this.get_value() > 0) {
							a10.set_curhp(this.get_value());
						}
						else {
							//if there's no good value, this means that this is the first appearance.
							$Forays_Event.get_b().add('The ground shakes as dust and rocks fall from the cavern ceiling. ');
							$Forays_Event.get_b().add('This place is falling apart! ');
							var floors = $Forays_Extensions.where($Forays_Tile).call(null, $Forays_Event.get_m().allTiles(), function(t37) {
								return t37.get_passable() && t37.get_ttype() !== 35 && !ss.referenceEquals($Forays_Event.get_player().tile(), t37);
							});
							var tile8 = null;
							if (floors.length > 0) {
								tile8 = $Forays_Extensions.random($Forays_Tile).call(null, floors);
								tile8.toggle$1(null, 35);
							}
							$Forays_Event.get_q().add(new $Forays_Event.$ctor5(tile8, 100, 22));
							$Forays_Event.get_q().add(new $Forays_Event.$ctor2(($Forays_Global.roll(20) + 20) * 100, 23));
						}
						break;
					}
					case 22: {
						var current3 = Type.safeCast(this.get_target(), $Forays_Tile);
						var tries2 = 0;
						if (ss.isValue(current3)) {
							for (tries2 = 0; tries2 < 50; ++tries2) {
								var open3 = [];
								var $t70 = current3.tilesAtDistance(1);
								for (var $t71 = 0; $t71 < $t70.length; $t71++) {
									var t38 = $t70[$t71];
									if (t38.get_passable() || t38.is$1(28)) {
										open3.add(t38);
									}
								}
								if (open3.length > 0) {
									var possible2 = $Forays_Extensions.random($Forays_Tile).call(null, open3);
									if (!possible2.is$1(35)) {
										possible2.toggle$1(null, 35);
										var open_neighbors = $Forays_Extensions.where($Forays_Tile).call(null, possible2.tilesAtDistance(1), function(t39) {
											return t39.get_passable() && t39.get_ttype() !== 35;
										});
										var num_neighbors = open_neighbors.length;
										while (open_neighbors.length > ss.Int32.div(num_neighbors, 2)) {
											var neighbor = $Forays_Extensions.removeRandom($Forays_Tile).call(null, open_neighbors);
											neighbor.toggle$1(null, 35);
										}
										break;
									}
									else {
										current3 = possible2;
									}
								}
								else {
									break;
								}
							}
						}
						if (tries2 === 50 || ss.isNullOrUndefined(current3)) {
							var floors1 = $Forays_Extensions.where($Forays_Tile).call(null, $Forays_Event.get_m().allTiles(), function(t40) {
								return t40.get_passable() && t40.get_ttype() !== 35 && !ss.referenceEquals($Forays_Event.get_player().tile(), t40);
							});
							if (floors1.length > 0) {
								this.set_target($Forays_Extensions.random($Forays_Tile).call(null, floors1));
								Type.safeCast(this.get_target(), $Forays_Tile).toggle$1(null, 35);
							}
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor5(this.get_target(), 100, 22));
						break;
					}
					case 23: {
						$Forays_Event.get_b().add('The ground shakes and debris falls from the ceiling! ');
						for (var i5 = 1; i5 < 21; ++i5) {
							for (var j1 = 1; j1 < 65; ++j1) {
								var t41 = $Forays_Event.get_m().tile.get_item(i5, j1);
								if (t41.is$1(0)) {
									var num_walls = $Forays_Extensions.where($Forays_Tile).call(null, t41.tilesAtDistance(1), function(x2) {
										return x2.is$1(0);
									}).length;
									if (num_walls < 8 && $Forays_Global.oneIn(20)) {
										if ($Forays_Global.coinFlip()) {
											t41.toggle$1(null, 1);
											var $t72 = t41.tilesAtDistance(1);
											for (var $t73 = 0; $t73 < $t72.length; $t73++) {
												var neighbor1 = $t72[$t73];
												neighbor1.set_solid_rock(false);
											}
										}
										else {
											t41.toggle$1(null, 28);
											var $t74 = t41.tilesAtDistance(1);
											for (var $t75 = 0; $t75 < $t74.length; $t75++) {
												var neighbor2 = $t74[$t75];
												neighbor2.set_solid_rock(false);
												if (neighbor2.get_ttype() === 1 && $Forays_Global.oneIn(10)) {
													neighbor2.toggle$1(null, 28);
												}
											}
										}
									}
								}
								else {
									var num_walls1 = $Forays_Extensions.where($Forays_Tile).call(null, t41.tilesAtDistance(1), function(x3) {
										return x3.is$1(0);
									}).length;
									if (num_walls1 === 0 && $Forays_Global.oneIn(100)) {
										if ($Forays_Global.oneIn(6)) {
											t41.toggle$1(null, 28);
										}
										var $t76 = t41.tilesAtDistance(1);
										for (var $t77 = 0; $t77 < $t76.length; $t77++) {
											var neighbor3 = $t76[$t77];
											if (neighbor3.get_ttype() === 1 && $Forays_Global.oneIn(6)) {
												neighbor3.toggle$1(null, 28);
											}
										}
									}
								}
							}
						}
						$Forays_Event.get_q().add(new $Forays_Event.$ctor2(($Forays_Global.roll(20) + 20) * 100, 23));
						break;
					}
				}
				if (this.get_msg() !== '') {
					if (ss.isNullOrUndefined(this.msg_objs)) {
						$Forays_Event.get_b().add(this.get_msg());
					}
					else {
						$Forays_Event.get_b().add$2(this.get_msg(), Enumerable.from(this.msg_objs).toArray());
					}
				}
			}
		}
	};
	$Forays_Event.$ctor1 = function(target_, delay_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(1);
		this.set_value(0);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor4 = function(target_, delay_, attr_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(1);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor8 = function(target_, delay_, attr_, value_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(value_);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor9 = function(target_, delay_, attr_, msg_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(1);
		this.set_msg(msg_);
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctorb = function(target_, delay_, attr_, value_, msg_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(value_);
		this.set_msg(msg_);
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctorc = function(target_, delay_, attr_, msg_, objs) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(1);
		this.set_msg(msg_);
		this.msg_objs = [];
		for (var i = 0; i < objs.length; i++) {
			this.msg_objs.add(objs[i]);
		}
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctore = function(target_, delay_, attr_, value_, msg_, objs) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(2);
		this.set_attr(attr_);
		this.set_value(value_);
		this.set_msg(msg_);
		this.msg_objs = [];
		for (var i = 0; i < objs.length; i++) {
			this.msg_objs.add(objs[i]);
		}
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor2 = function(delay_, type_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(null);
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor5 = function(target_, delay_, type_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctora = function(target_, delay_, type_, value_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(value_);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor3 = function(delay_, msg_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(null);
		this.set_delay(delay_);
		this.set_evtype(0);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg(msg_);
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor6 = function(area_, delay_, type_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(null);
		this.area = [];
		for (var $t1 = 0; $t1 < area_.length; $t1++) {
			var t = area_[$t1];
			this.area.add(t);
		}
		//area=area_;
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctord = function(area_, delay_, type_, msg_, objs) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(null);
		this.area = area_;
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg(msg_);
		this.msg_objs = [];
		for (var i = 0; i < objs.length; i++) {
			this.msg_objs.add(objs[i]);
		}
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor7 = function(target_, area_, delay_, type_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.area = area_;
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(109);
		this.set_value(0);
		this.set_msg('');
		this.msg_objs = null;
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctorg = function(target_, area_, delay_, type_, attr_, value_, msg_, objs) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.area = area_;
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(attr_);
		this.set_value(value_);
		this.set_msg(msg_);
		this.msg_objs = [];
		for (var i = 0; i < objs.length; i++) {
			this.msg_objs.add(objs[i]);
		}
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctorf = function(target_, area_, delay_, type_, attr_, value_, msg_) {
		this.$1$targetField = null;
		this.area = null;
		this.$1$delayField = 0;
		this.$1$evtypeField = 0;
		this.$1$attrField = 0;
		this.$1$valueField = 0;
		this.$1$msgField = null;
		this.msg_objs = null;
		this.$1$time_createdField = 0;
		this.$1$deadField = false;
		this.$1$tiebreakerField = 0;
		this.set_target(target_);
		this.area = area_;
		this.set_delay(delay_);
		this.set_evtype(type_);
		this.set_attr(attr_);
		this.set_value(value_);
		this.set_msg(msg_);
		this.set_time_created($Forays_Event.get_q().get_turn());
		this.set_dead(false);
		this.set_tiebreaker($Forays_Event.get_q().get_tiebreaker());
	};
	$Forays_Event.$ctor1.prototype = $Forays_Event.$ctor4.prototype = $Forays_Event.$ctor8.prototype = $Forays_Event.$ctor9.prototype = $Forays_Event.$ctorb.prototype = $Forays_Event.$ctorc.prototype = $Forays_Event.$ctore.prototype = $Forays_Event.$ctor2.prototype = $Forays_Event.$ctor5.prototype = $Forays_Event.$ctora.prototype = $Forays_Event.$ctor3.prototype = $Forays_Event.$ctor6.prototype = $Forays_Event.$ctord.prototype = $Forays_Event.$ctor7.prototype = $Forays_Event.$ctorg.prototype = $Forays_Event.$ctorf.prototype = $Forays_Event.prototype;
	$Forays_Event.get_q = function() {
		return $Forays_Event.$1$QField;
	};
	$Forays_Event.set_q = function(value) {
		$Forays_Event.$1$QField = value;
	};
	$Forays_Event.get_b = function() {
		return $Forays_Event.$1$BField;
	};
	$Forays_Event.set_b = function(value) {
		$Forays_Event.$1$BField = value;
	};
	$Forays_Event.get_e = function() {
		return $Forays_Event.$1$EField;
	};
	$Forays_Event.set_e = function(value) {
		$Forays_Event.$1$EField = value;
	};
	$Forays_Event.get_m = function() {
		return $Forays_Event.$1$MField;
	};
	$Forays_Event.set_m = function(value) {
		$Forays_Event.$1$MField = value;
	};
	$Forays_Event.get_player = function() {
		return $Forays_Event.$1$playerField;
	};
	$Forays_Event.set_player = function(value) {
		$Forays_Event.$1$playerField = value;
	};
	$Forays_Event.op_LessThan = function(one, two) {
		if (one.timeToExecute() < two.timeToExecute()) {
			return true;
		}
		if (one.timeToExecute() > two.timeToExecute()) {
			return false;
		}
		if (one.get_tiebreaker() < two.get_tiebreaker()) {
			return true;
		}
		if (one.get_tiebreaker() > two.get_tiebreaker()) {
			return false;
		}
		if (one.get_evtype() === 1 && two.get_evtype() !== 1) {
			return true;
		}
		return false;
	};
	$Forays_Event.op_GreaterThan = function(one, two) {
		//currently unused
		if (one.timeToExecute() > two.timeToExecute()) {
			return true;
		}
		if (one.timeToExecute() < two.timeToExecute()) {
			return false;
		}
		if (one.get_tiebreaker() > two.get_tiebreaker()) {
			return true;
		}
		if (one.get_tiebreaker() < two.get_tiebreaker()) {
			return false;
		}
		if (one.get_evtype() !== 1 && two.get_evtype() === 1) {
			return true;
		}
		return false;
	};
	$Forays_Event.op_LessThanOrEqual = function(one, two) {
		//currently unused
		if (one.timeToExecute() < two.timeToExecute()) {
			return true;
		}
		if (one.timeToExecute() > two.timeToExecute()) {
			return false;
		}
		if (one.get_tiebreaker() < two.get_tiebreaker()) {
			return true;
		}
		if (one.get_tiebreaker() > two.get_tiebreaker()) {
			return false;
		}
		if (one.get_evtype() === 1) {
			return true;
		}
		if (one.get_evtype() !== 1 && two.get_evtype() !== 1) {
			return true;
		}
		return false;
	};
	$Forays_Event.op_GreaterThanOrEqual = function(one, two) {
		if (one.timeToExecute() > two.timeToExecute()) {
			return true;
		}
		if (one.timeToExecute() < two.timeToExecute()) {
			return false;
		}
		if (one.get_tiebreaker() > two.get_tiebreaker()) {
			return true;
		}
		if (one.get_tiebreaker() < two.get_tiebreaker()) {
			return false;
		}
		if (one.get_evtype() !== 1) {
			return true;
		}
		if (one.get_evtype() === 1 && two.get_evtype() === 1) {
			return true;
		}
		return false;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.EventType
	var $Forays_EventType = function() {
	};
	$Forays_EventType.prototype = { anY_EVENT: 0, MOVE: 1, removE_ATTR: 2, checK_FOR_HIDDEN: 3, relativelY_SAFE: 4, POLTERGEIST: 5, MIMIC: 6, regeneratinG_FROM_DEATH: 7, GRENADE: 8, blasT_FUNGUS: 9, STALAGMITE: 10, firE_GEYSER: 11, firE_GEYSER_ERUPTION: 12, foG_VENT: 13, FOG: 14, poisoN_GAS_VENT: 15, poisoN_GAS: 16, stonE_SLAB: 17, marblE_HORROR: 18, QUICKFIRE: 19, bosS_SIGN: 20, bosS_ARRIVE: 21, flooR_COLLAPSE: 22, ceilinG_COLLAPSE: 23 };
	Type.registerEnum(global, 'Forays.EventType', $Forays_EventType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Extensions
	var $Forays_Extensions = function() {
	};
	$Forays_Extensions.getValues = function(e) {
		if (Object.keys(Type.getInstanceType(e)).length === 0) {
			return [];
		}
		var ret = [];
		for (var i = 0; i < Object.keys(e).length; i++) {
			ret[i] = i;
		}
		return ret;
	};
	$Forays_Extensions.find = function(T) {
		return function(l, toFind) {
			if (l.length === 0 || !l.contains(toFind)) {
				return new (Type.makeGenericType($Forays_Wrapper$1, [T]))();
			}
			return new (Type.makeGenericType($Forays_Wrapper$1, [T]).$ctor1)(l[l.indexOf(toFind)]);
		};
	};
	$Forays_Extensions.random = function(T) {
		return function(l) {
			if (l.length === 0) {
				return T.getDefaultValue();
			}
			return l[$Forays_Global.roll(l.length) - 1];
		};
	};
	$Forays_Extensions.removeRandom = function(T) {
		return function(l) {
			if (l.length === 0) {
				return T.getDefaultValue();
			}
			var result = l[$Forays_Global.roll(l.length) - 1];
			l.remove(result);
			return result;
		};
	};
	$Forays_Extensions.addUnique = function(T) {
		return function(l, obj) {
			if (!l.contains(obj)) {
				l.add(obj);
			}
		};
	};
	$Forays_Extensions.last = function(T) {
		return function(l) {
			//note that this doesn't work the way I wanted it to - 
			if (l.length === 0) {
				// you can't assign to list.Last()
				return T.getDefaultValue();
			}
			return l[l.length - 1];
		};
	};
	$Forays_Extensions.randomize = function(T) {
		return function(l) {
			var temp = l.clone();
			l.clear();
			while (temp.length > 0) {
				l.add($Forays_Extensions.removeRandom(T).call(null, temp));
			}
		};
	};
	$Forays_Extensions.getRange = function(T) {
		return function(l, min, upper) {
			var temp = [];
			for (var i = min; i < upper && i < l.length; i++) {
				temp.add(l[i]);
			}
			return temp;
		};
	};
	$Forays_Extensions.rotateDirection = function(dir, clockwise) {
		return $Forays_Extensions.rotateDirection$1(dir, clockwise, 1);
	};
	$Forays_Extensions.rotateDirection$1 = function(dir, clockwise, num) {
		for (var i = 0; i < num; ++i) {
			switch (dir) {
				case 7: {
					dir = (clockwise ? 8 : 4);
					break;
				}
				case 8: {
					dir = (clockwise ? 9 : 7);
					break;
				}
				case 9: {
					dir = (clockwise ? 6 : 8);
					break;
				}
				case 4: {
					dir = (clockwise ? 7 : 1);
					break;
				}
				case 5: {
					break;
				}
				case 6: {
					dir = (clockwise ? 3 : 9);
					break;
				}
				case 1: {
					dir = (clockwise ? 4 : 2);
					break;
				}
				case 2: {
					dir = (clockwise ? 1 : 3);
					break;
				}
				case 3: {
					dir = (clockwise ? 2 : 6);
					break;
				}
				default: {
					dir = 0;
					break;
				}
			}
		}
		return dir;
	};
	$Forays_Extensions.getWordWrappedList = function(s, max_length) {
		var result = [];
		while (s.length > max_length) {
			for (var i = max_length; i >= 0; --i) {
				if (s.substring(i, 1) === ' ') {
					result.add(s.substring(0, i));
					s = s.substring(i + 1);
					break;
				}
			}
		}
		result.add(s);
		return result;
	};
	$Forays_Extensions.padOuter = function(s, totalWidth) {
		return $Forays_Extensions.padOuter$1(s, totalWidth, 32);
	};
	$Forays_Extensions.padOuter$1 = function(s, totalWidth, paddingChar) {
		if (s.length >= totalWidth) {
			return s;
		}
		var added = totalWidth - s.length;
		var left = '';
		for (var i = 0; i < ss.Int32.div(added + 1, 2); ++i) {
			left = left + String.fromCharCode(paddingChar);
		}
		var right = '';
		for (var i1 = 0; i1 < ss.Int32.div(added, 2); ++i1) {
			right = right + String.fromCharCode(paddingChar);
		}
		return left + s + right;
	};
	$Forays_Extensions.padToMapSize = function(s) {
		return s.padRight($Forays_Global.COLS);
	};
	$Forays_Extensions.getColorString = function(s) {
		return $Forays_Extensions.getColorString$1(s, 2);
	};
	$Forays_Extensions.getColorString$1 = function(s, color) {
		if (s.search(new RegExp('\\[')) > -1) {
			var temp = s;
			var result = new $Forays_colorstring();
			while (temp.search(new RegExp('\\[')) > -1) {
				var open = temp.indexOf('[');
				var close = temp.indexOf(']');
				if (close === -1) {
					result.strings.add(new $Forays_cstr.$ctor1(temp, color));
					temp = '';
				}
				else {
					var hyphen = temp.indexOf('-');
					if (hyphen !== -1 && hyphen > open && hyphen < close) {
						result.strings.add(new $Forays_cstr.$ctor1(temp.substring(0, open + 1), color));
						//result.strings.Add(new cstr(temp.Substring(open+1,(close-open)-1),Color.Cyan));
						result.strings.add(new $Forays_cstr.$ctor1(temp.substring(open + 1, hyphen), 8));
						//was hyphen - open
						result.strings.add(new $Forays_cstr.$ctor1('-', color));
						result.strings.add(new $Forays_cstr.$ctor1(temp.substring(hyphen + 1, close), 8));
						// was close - hyphen
						result.strings.add(new $Forays_cstr.$ctor1(']', color));
						temp = temp.substring(close + 1);
					}
					else {
						result.strings.add(new $Forays_cstr.$ctor1(temp.substring(0, open + 1), color));
						result.strings.add(new $Forays_cstr.$ctor1(temp.substring(open + 1, close), 8));
						// was close-open
						result.strings.add(new $Forays_cstr.$ctor1(']', color));
						temp = temp.substring(close + 1);
					}
				}
			}
			if (temp !== '') {
				result.strings.add(new $Forays_cstr.$ctor1(temp, color));
			}
			return result;
		}
		else {
			return new $Forays_colorstring.$ctor2(s, color);
		}
	};
	$Forays_Extensions.each = function(T) {
		return function(l, del) {
			for (var $t1 = 0; $t1 < l.length; $t1++) {
				var t = l[$t1];
				del(t);
			}
		};
	};
	$Forays_Extensions.where = function(T) {
		return function(l, condition) {
			//now THIS one is useful. probably the same as the official version.
			var result = [];
			for (var $t1 = 0; $t1 < l.length; $t1++) {
				var t = l[$t1];
				if (condition(t)) {
					result.add(t);
				}
			}
			return result;
		};
	};
	$Forays_Extensions.any = function(T) {
		return function(l, condition) {
			for (var $t1 = 0; $t1 < l.length; $t1++) {
				var t = l[$t1];
				if (condition(t)) {
					return true;
				}
			}
			return false;
		};
	};
	$Forays_Extensions.whereGreatest = function(T) {
		return function(l, value) {
			var result = [];
			var highest = 0;
			var first = true;
			for (var $t1 = 0; $t1 < l.length; $t1++) {
				var t = l[$t1];
				var i = value(t);
				if (first) {
					first = false;
					highest = i;
					result.add(t);
				}
				else if (i > highest) {
					highest = i;
					result.clear();
					result.add(t);
				}
				else if (i === highest) {
					result.add(t);
				}
			}
			return result;
		};
	};
	$Forays_Extensions.whereLeast = function(T) {
		return function(l, value) {
			var result = [];
			var lowest = 0;
			var first = true;
			for (var $t1 = 0; $t1 < l.length; $t1++) {
				var t = l[$t1];
				var i = value(t);
				if (first) {
					first = false;
					lowest = i;
					result.add(t);
				}
				else if (i < lowest) {
					lowest = i;
					result.clear();
					result.add(t);
				}
				else if (i === lowest) {
					result.add(t);
				}
			}
			return result;
		};
	};
	$Forays_Extensions.toFirstSolidTile = function(line) {
		var result = [];
		for (var $t1 = 0; $t1 < line.length; $t1++) {
			var t = line[$t1];
			result.add(t);
			if (!t.get_passable()) {
				break;
			}
		}
		return result;
	};
	$Forays_Extensions.toFirstObstruction = function(line) {
		//impassible tile OR actor
		var result = [];
		var idx = 0;
		for (var $t1 = 0; $t1 < line.length; $t1++) {
			var t = line[$t1];
			result.add(t);
			if (idx !== 0) {
				//skip the first, as it is assumed to be the origin
				if (!t.get_passable() || ss.isValue(t.actor())) {
					break;
				}
			}
			++idx;
		}
		return result;
	};
	$Forays_Extensions.to = function(line, o) {
		var result = [];
		for (var $t1 = 0; $t1 < line.length; $t1++) {
			var t = line[$t1];
			result.add(t);
			if (o.get_row() === t.get_row() && o.get_col() === t.get_col()) {
				break;
			}
		}
		return result;
	};
	$Forays_Extensions.lastBeforeSolidTile = function(line) {
		var result = null;
		for (var $t1 = 0; $t1 < line.length; $t1++) {
			var t = line[$t1];
			if (!t.get_passable()) {
				break;
			}
			else {
				result = t;
			}
		}
		return result;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Feat
	var $Forays_Feat = function() {
	};
	$Forays_Feat.maxRank = function(type) {
		switch (type) {
			case 0:
			case 4:
			case 15:
			case 16:
			case 17: {
				return 2;
			}
			case 8:
			case 13:
			case 18:
			case 19: {
				return 4;
			}
			case 1:
			case 2:
			case 3:
			case 5:
			case 6:
			case 7:
			case 9:
			case 10:
			case 11:
			case 12:
			case 14: {
				return 3;
			}
			default: {
				return 0;
			}
		}
	};
	$Forays_Feat.isActivated = function(type) {
		switch (type) {
			case 2:
			case 7:
			case 10:
			case 11:
			case 17:
			case 16: {
				return true;
			}
			case 0:
			case 1:
			case 3:
			case 4:
			case 5:
			case 6:
			case 8:
			case 9:
			case 12:
			case 13:
			case 14:
			case 15:
			case 18:
			case 19:
			default: {
				return false;
			}
		}
	};
	$Forays_Feat.ofSkill = function(skill, num) {
		// 0 through 3
		switch (skill) {
			case 0: {
				return num;
			}
			case 1: {
				return num + 4;
			}
			case 2: {
				return num + 8;
			}
			case 3: {
				return num + 12;
			}
			case 4: {
				return num + 16;
			}
			default: {
				return 21;
			}
		}
	};
	$Forays_Feat.name$1 = function(type) {
		switch (type) {
			case 16: {
				return 'Distract';
			}
			case 0: {
				return 'Quick draw';
			}
			case 4: {
				return 'Silent chainmail';
			}
			case 19: {
				return 'Danger sense';
			}
			case 6: {
				return 'Full defense';
			}
			case 13: {
				return 'Enduring soul';
			}
			case 18: {
				return 'Neck snap';
			}
			case 15: {
				return 'Boiling blood';
			}
			case 1: {
				return 'Lethality';
			}
			case 2: {
				return 'Lunge';
			}
			case 3: {
				return 'Drive back';
			}
			case 5: {
				return 'Armored mage';
			}
			case 7: {
				return 'Tumble';
			}
			case 8: {
				return 'Master\'s edge';
			}
			case 9: {
				return 'Student\'s luck';
			}
			case 10: {
				return 'Arcane shield';
			}
			case 11: {
				return 'Force of will';
			}
			case 12: {
				return 'Conviction';
			}
			case 14: {
				return 'Feel no pain';
			}
			case 17: {
				return 'Disarm trap';
			}
			default: {
				return 'no feat';
			}
		}
	};
	$Forays_Feat.description = function(type) {
		switch (type) {
			case 0: {
				var $t1 = [];
				$t1.add('Wielding a different weapon takes no time.');
				$t1.add('(This also enables you to fire arrows without first switching');
				$t1.add('to your bow.)');
				return $t1;
			}
			case 1: {
				var $t2 = [];
				$t2.add('Your chance to score a critical hit increases by 10%. This');
				$t2.add('bonus also increases by 5% for each 20% health that the target');
				$t2.add('is missing.');
				return $t2;
			}
			case 2: {
				var $t3 = [];
				$t3.add('Leap from one space away and attack your target (with a +4');
				$t3.add('bonus to Combat). The intervening space must be unoccupied.');
				return $t3;
			}
			case 3: {
				var $t4 = [];
				$t4.add('Enemies must yield ground in order to avoid your attacks.');
				$t4.add('(If your target has nowhere to run, your attacks will');
				$t4.add('automatically hit.)');
				return $t4;
			}
			case 4: {
				var $t5 = [];
				$t5.add('You can wear chainmail with no penalty to stealth.');
				return $t5;
			}
			case 5: {
				var $t6 = [];
				$t6.add('You can cast spells with no penalty from your armor.');
				return $t6;
			}
			case 6: {
				var $t7 = [];
				$t7.add('Stand still to ready yourself for attack. You gain an extra');
				$t7.add('50% chance to avoid attacks while readied. Enemies that try to');
				$t7.add('hit you might hit other adjacent enemies instead.');
				return $t7;
			}
			case 7: {
				var $t8 = [];
				$t8.add('Move up to 2 spaces while avoiding arrows. (Also useful for');
				$t8.add('slipping behind enemies and putting out fires.)');
				return $t8;
			}
			case 8: {
				var $t9 = [];
				$t9.add('The first offensive spell you\'ve learned will deal 1d6 extra');
				$t9.add('damage. (Affects the first spell in the list that deals damage');
				$t9.add('directly.)');
				return $t9;
			}
			case 9: {
				var $t10 = [];
				$t10.add('Casting a spell of higher level than your Magic skill will now');
				$t10.add('only drain your magic reserves 50% of the time.');
				return $t10;
			}
			case 10: {
				var $t11 = [];
				$t11.add('Drain your magic reserves to shield yourself. The shield lasts');
				$t11.add('for 20 turns and can block 25 damage, plus a bonus for Magic');
				$t11.add('skill. (Each drain on your magic reserves gives an extra 25%');
				$t11.add('failure rate to your spells, and lasts until you rest.)');
				return $t11;
			}
			case 11: {
				var $t12 = [];
				$t12.add('Drain your magic reserves to flawlessly cast a spell. (The');
				$t12.add('spell\'s level and any penalty from your armor are ignored. Any');
				$t12.add('drain on your magic reserves still decreases your chances.)');
				$t12.add('If you have skill in Spirit, your chances are increased.');
				return $t12;
			}
			case 12: {
				var $t13 = [];
				$t13.add('Each turn you\'re engaged in combat (attacking/being attacked),');
				$t13.add('you gain 1 bonus Spirit, and bonus Combat skill equal to half');
				$t13.add('that.');
				return $t13;
			}
			case 13: {
				var $t14 = [];
				$t14.add('Improves the amount by which your natural recovery can heal');
				$t14.add('you. (You can recover to a multiple of 20HP instead of 10.)');
				return $t14;
			}
			case 14: {
				var $t15 = [];
				$t15.add('When your health becomes very low (less than 20%), you');
				$t15.add('briefly enter a state of invulnerability. (For about 5 turns,');
				$t15.add('you\'ll be immune to damage, but not other effects.)');
				return $t15;
			}
			case 15: {
				var $t16 = [];
				$t16.add('Taking damage briefly increases your movement speed. (This');
				$t16.add('effect can stack up to 5 times. At 5 stacks, your speed is');
				$t16.add('doubled.)');
				return $t16;
			}
			case 16: {
				var $t17 = [];
				$t17.add('Attempt to misdirect an unaware enemy, causing it to');
				$t17.add('investigate the source of the sound.');
				return $t17;
			}
			case 17: {
				var $t18 = [];
				$t18.add('Attempt to disable a trap without setting it off. If you have');
				$t18.add('skill in Defense, you might avoid damage if you do trigger it.');
				return $t18;
			}
			case 18: {
				var $t19 = [];
				$t19.add('Automatically perform a stealth kill when attacking an unaware');
				$t19.add('medium humanoid. (Living enemies of approximately human size.)');
				return $t19;
			}
			case 19: {
				var $t20 = [];
				$t20.add('You can sense where it\'s safe and where enemies might detect');
				$t20.add('you. Your torch must be extinguished while you\'re sneaking.');
				return $t20;
			}
			default: {
				return null;
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.FeatType
	var $Forays_FeatType = function() {
	};
	$Forays_FeatType.prototype = { quicK_DRAW: 0, LETHALITY: 1, LUNGE: 2, drivE_BACK: 3, silenT_CHAINMAIL: 4, armoreD_MAGE: 5, fulL_DEFENSE: 6, TUMBLE: 7, masterS_EDGE: 8, studentS_LUCK: 9, arcanE_SHIELD: 10, forcE_OF_WILL: 11, CONVICTION: 12, endurinG_SOUL: 13, feeL_NO_PAIN: 14, boilinG_BLOOD: 15, DISTRACT: 16, disarM_TRAP: 17, necK_SNAP: 18, dangeR_SENSE: 19, nuM_FEATS: 20, nO_FEAT: 21 };
	Type.registerEnum(global, 'Forays.FeatType', $Forays_FeatType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.FeatureType
	var $Forays_FeatureType = function() {
	};
	$Forays_FeatureType.prototype = { GRENADE: 0, trolL_CORPSE: 1, trolL_SEER_CORPSE: 2, QUICKFIRE: 3, runE_OF_RETREAT: 4, FOG: 5, poisoN_GAS: 6, SLIME: 7, FUNGUS: 8, funguS_ACTIVE: 9, funguS_PRIMED: 10 };
	Type.registerEnum(global, 'Forays.FeatureType', $Forays_FeatureType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Game
	var $Forays_Game = function() {
		this.m = null;
		this.q = null;
		this.b = null;
		this.player = null;
		this.e = null;
	};
	$Forays_Game.$main = function() {
		//{
		//    int os = (int)Environment.OSVersion.Platform;
		//    if(os == 4 || os == 6 ||  os == 128){
		//        Global.LINUX = true;
		//    }
		//}
		$(function() {
			$('#main').append($Forays_Game.console.display.getContainer());
			$('canvas').on('keydown', Function.thisFix(function(elem, ev) {
				$Forays_Game.console.keyAvailable = true;
			}));
			//if (Global.LINUX)
			//{
			//    Console.SetCursorPosition(0, 0);
			//    if (Console.BufferWidth < 80 || Console.BufferHeight < 25)
			//    {
			//        Console.Write("Please resize your terminal to 80x25, then press any key.");
			//        Console.SetCursorPosition(0, 1);
			//        Console.Write("         Current dimensions are {0}x{1}.".PadRight(57), Console.BufferWidth, Console.BufferHeight);
			//        Console.ReadKey(true);
			//        Console.SetCursorPosition(0, 0);
			//        if (Console.BufferWidth < 80 || Console.BufferHeight < 25)
			//        {
			//            Environment.Exit(0);
			//        }
			//    }
			//    Screen.Blank();
			//}
			//else
			//{
			//    Console.Title = "Forays into Norrendrin";
			//    Console.BufferHeight = Global.SCREEN_H; //25
			//}
			//Console.TreatControlCAsInput = true;
			//Console.CursorSize = 100;
			for (var i = 0; i < 24; ++i) {
				var color = 6;
				if (i === 18) {
					color = 4;
				}
				if (i > 18) {
					color = 9;
				}
				for (var j = 0; j < 80; ++j) {
					if ($Forays_Global.titlescreen[i].charCodeAt(j) !== 32) {
						if ($Forays_Global.titlescreen[i].charCodeAt(j) === 35) {
							$Forays_Screen.writeChar(i, j, new $Forays_colorchar.$ctor5(0, 6, 32));
						}
						else {
							$Forays_Screen.writeChar(i, j, new $Forays_colorchar.$ctor5(color, 0, $Forays_Global.titlescreen[i].charCodeAt(j)));
						}
					}
				}
			}
			$Forays_Game.game = new $Forays_Game();
			$Forays_Game.game.q = new $Forays_Queue($Forays_Game.game);
			$Forays_Game.game.e = new ROT.Engine();
			var $t1 = new $Forays_Actable();
			$t1.q = $Forays_Game.game.q;
			var ah = $t1;
			$Forays_Game.game.e.addActor(ah);
			$Forays_Game.console.readKey(true);
			// await new Task(() => Console.ReadKey(true));
			$Forays_Game.game.e = $Forays_Game.game.e.start();
			$Forays_Game.$mainMenu();
			//await new Task(() => 
		});
	};
	$Forays_Game.$mainMenu = function() {
		var command;
		var recentname = ''.padRight(30);
		var recentdepth = -1;
		var recentwin = 45;
		var recentcause = '';
		while (true) {
			$Forays_Screen.blank();
			$Forays_Screen.writeMapString$1(1, 0, new $Forays_cstr(6, 'Forays into Norrendrin version 0.7.0 '));
			var saved_game = false;
			//File.Exists("forays.sav");
			if (!saved_game) {
				$Forays_Screen.writeMapString$2(4, 0, '[a] Start a new game');
			}
			else {
				$Forays_Screen.writeMapString$2(4, 0, '[a] Resume saved game');
			}
			$Forays_Screen.writeMapString$2(5, 0, '[b] How to play');
			$Forays_Screen.writeMapString$2(6, 0, '[c] High scores');
			$Forays_Screen.writeMapString$2(7, 0, '[d] Quit');
			for (var i = 0; i < 4; ++i) {
				$Forays_Screen.writeMapChar(i + 4, 1, new $Forays_colorchar.$ctor1(8, i + 97));
			}
			$Forays_Screen.resetColors();
			$Forays_Game.console.setCursorPosition($Forays_Global.maP_OFFSET_COLS, 11);
			command = $Forays_Game.console.readKey(true);
			switch (command.keyChar) {
				case 97: {
					$Forays_Global.gamE_OVER = false;
					$Forays_Global.bosS_KILLED = false;
					$Forays_Global.SAVING = false;
					$Forays_Global.loadOptions();
					var game = new $Forays_Game();
					if (!saved_game) {
						game.player = new $Forays_Actor.$ctor3(0, 'you', '@', 1, 100, 100, 0, 0, [6]);
						game.player.set_inv([]);
						$Forays_Actor.feats_in_order = [];
						$Forays_Actor.partial_feats_in_order = [];
						$Forays_Actor.spells_in_order = [];
						game.player.weapons.remove(11);
						game.player.weapons.insert(game.player.weapons.length, 0);
						game.player.weapons.insert(game.player.weapons.length, 1);
						game.player.weapons.insert(game.player.weapons.length, 2);
						game.player.weapons.insert(game.player.weapons.length, 3);
						game.player.weapons.insert(game.player.weapons.length, 4);
						game.player.armors.remove(7);
						game.player.armors.insert(game.player.armors.length, 0);
						game.player.armors.insert(game.player.armors.length, 1);
						game.player.armors.insert(game.player.armors.length, 2);
					}
					game.m = new $Forays_Map(game);
					game.b = new $Forays_Buffer(game);
					game.q = new $Forays_Queue(game);
					game.e = new ROT.Engine();
					$Forays_Map.set_q(game.q);
					$Forays_Map.set_b(game.b);
					$Forays_Map.set_e(game.e);
					$Forays_PhysicalObject.set_m(game.m);
					$Forays_PhysicalObject.set_m(game.m);
					$Forays_Actor.set_q(game.q);
					$Forays_Actor.set_b(game.b);
					$Forays_Actor.set_player(game.player);
					$Forays_PhysicalObject.set_m(game.m);
					$Forays_Item.set_q(game.q);
					$Forays_Item.set_b(game.b);
					$Forays_Item.set_player(game.player);
					$Forays_Event.set_q(game.q);
					$Forays_Event.set_b(game.b);
					$Forays_Event.set_m(game.m);
					$Forays_Event.set_player(game.player);
					$Forays_Event.set_e(game.e);
					$Forays_PhysicalObject.set_m(game.m);
					$Forays_Tile.set_b(game.b);
					$Forays_Tile.set_q(game.q);
					$Forays_Tile.set_player(game.player);
					if (!saved_game) {
						$Forays_Actor.player_name = '';
						if (ss.isValue(window.localStorage['name.txt'])) {
							var file = Type.cast(window.localStorage['name.txt'], Array);
							var base_name = file[0];
							$Forays_Actor.player_name = base_name;
							var num = 1;
							if (!$Forays_Global.option(2) && file.length > 1) {
								num = parseInt(file[1]);
								if (num > 1) {
									$Forays_Actor.player_name = $Forays_Actor.player_name + ' ' + $Forays_Global.romanNumeral(num);
								}
							}
							var $t1 = [];
							$t1.add(base_name);
							var fileout = $t1;
							//							fileout.WriteLine(base_name);
							if (!$Forays_Global.option(2)) {
								fileout[1] = '' + (num + 1).toString();
							}
							window.localStorage['name.txt'] = fileout;
						}
						while ($Forays_Actor.player_name === '') {
							$Forays_Game.console.cursorVisible = false;
							game.b.displayNow$2(''.padRight($Forays_Global.COLS), false);
							game.b.displayNow$2('Enter name: ', false);
							$Forays_Actor.player_name = $Forays_Global.enterString$1(26);
						}
						game.m.generateLevelTypes();
						game.m.generateLevel();
						$Forays_Screen.blank();
						$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Global.COLS, 45));
						$Forays_Screen.writeMapString$2(1, 0, '[a] Toughness - You have a slight resistance to physical damage.');
						$Forays_Screen.writeMapString$2(2, 0, '[b] Magical blood - Your natural recovery is faster than normal.');
						$Forays_Screen.writeMapString$2(3, 0, '[c] Low-light vision - You can see farther in darkness.');
						$Forays_Screen.writeMapString$2(4, 0, '[d] Keen eyes - You\'re better at spotting traps and aiming arrows.');
						$Forays_Screen.writeMapString$2(5, 0, '[e] Long stride - You walk a good bit faster than normal.');
						$Forays_Screen.writeMapString$2(6, 0, ''.padRight($Forays_Global.COLS, 45));
						$Forays_Screen.writeMapString$2(9, 4, '(Your character will keep the chosen trait');
						$Forays_Screen.writeMapString$2(10, 4, '     for his or her entire adventuring career.)');
						if (ss.isValue(window.localStorage['quickstart.txt'])) {
							$Forays_Screen.writeMapString$2(16, 5, '[ ] Repeat previous choices and start immediately.');
							$Forays_Screen.writeMapChar(16, 6, new $Forays_colorchar.$ctor3(112, 8));
						}
						if (ss.isNullOrUndefined(window.localStorage['name.txt'])) {
							$Forays_Screen.writeMapString$2(18, 5, '[ ] Automatically name future characters after this one.');
							$Forays_Screen.writeMapChar(18, 6, new $Forays_colorchar.$ctor3(110, 8));
						}
						for (var i1 = 0; i1 < 5; ++i1) {
							$Forays_Screen.writeMapChar(i1 + 1, 1, new $Forays_colorchar.$ctor1(8, i1 + 97));
						}
						$Forays_Screen.writeMapString$2(-1, 0, 'Select a trait: ');
						//haha, it works
						$Forays_Game.console.cursorVisible = true;
						var quickstarted = false;
						$Forays_Global.quickstartinfo = [];
						for (var good = false; !good;) {
							command = $Forays_Game.console.readKey(true);
							switch (command.keyChar) {
								case 97: {
									good = true;
									game.player.attrs.set_item(19, game.player.attrs.get_item(19) + 1);
									$Forays_Global.quickstartinfo.add('tough');
									break;
								}
								case 98: {
									good = true;
									game.player.attrs.set_item(17, game.player.attrs.get_item(17) + 1);
									$Forays_Global.quickstartinfo.add('magical_blood');
									break;
								}
								case 99: {
									good = true;
									game.player.attrs.set_item(22, game.player.attrs.get_item(22) + 1);
									$Forays_Global.quickstartinfo.add('low_light_vision');
									break;
								}
								case 100: {
									good = true;
									game.player.attrs.set_item(18, game.player.attrs.get_item(18) + 1);
									$Forays_Global.quickstartinfo.add('keen_eyes');
									break;
								}
								case 101: {
									good = true;
									game.player.attrs.set_item(20, game.player.attrs.get_item(20) + 1);
									game.player.set_speed(80);
									$Forays_Global.quickstartinfo.add('long_stride');
									break;
								}
								case 112: {
									if (ss.isValue(window.localStorage['quickstart.txt'])) {
										quickstarted = true;
										good = true;
										game.b.add('Welcome, ' + $Forays_Actor.player_name + '! ');
										var file1 = Type.cast(window.localStorage['quickstart.txt'], Array);
										var attr = Type.cast(ss.Enum.parse($Forays_AttrType, file1[0]), ss.Int32);
										game.player.attrs.set_item(attr, game.player.attrs.get_item(attr) + 1);
										var magic = false;
										for (var i2 = 0; i2 < 3; ++i2) {
											var skill = Type.cast(ss.Enum.parse($Forays_SkillType, file1[i2 + 1]), ss.Int32);
											if (skill === 2) {
												magic = true;
											}
											game.player.skills.set_item(skill, game.player.skills.get_item(skill) + 1);
										}
										for (var i3 = 0; i3 < 3; ++i3) {
											var feat = Type.cast(ss.Enum.parse($Forays_FeatType, file1[i3 + 4]), ss.Int32);
											game.player.feats.set_item(feat, game.player.feats.get_item(feat) - 1);
											if (game.player.feats.get_item(feat) === -$Forays_Feat.maxRank(feat)) {
												game.player.feats.set_item(feat, 1);
												game.b.add('You learn the ' + $Forays_Feat.name$1(feat) + ' feat. ');
											}
										}
										if (magic) {
											var spell = Type.cast(ss.Enum.parse($Forays_SpellType, file1[7]), ss.Int32);
											game.player.spells.set_item(spell, game.player.spells.get_item(spell) + 1);
											game.b.add('You learn ' + $Forays_Spell.name$1(spell) + '. ');
										}
										//									file.Close();
									}
									break;
								}
								case 110: {
									if (ss.isNullOrUndefined(window.localStorage['name.txt'])) {
										var fileout1 = [];
										fileout1[0] = $Forays_Actor.player_name;
										if (!$Forays_Global.option(2)) {
											fileout1[1] = '2';
										}
										window.localStorage['name.txt'] = fileout1;
										//Screen.WriteMapString(18,5,"                                                        ");
										$Forays_Screen.writeMapString$2(18, 5, '(to stop automatically naming characters, delete name.txt)');
										$Forays_Game.console.setCursorPosition(29, 1);
									}
									break;
								}
								default: {
									break;
								}
							}
						}
						//game.player.Q0();
						{
							var e = new $Forays_Event.$ctor5(game.player, 0, 1);
							e.set_tiebreaker(0);
							game.q.add(e);
						}
						//game.player.Move(10,20,false); //this is why the voodoo was needed before: the player must be moved onto the map *before*
						game.player.updateRadius$1(0, 6, true);
						//gaining a light radius.
						$Forays_Item.create(0, game.player);
						$Forays_Item.create(5, game.player);
						$Forays_Item.create(17, game.player);
						$Forays_Item.create(17, game.player);
						if (quickstarted) {
							game.player.set_level(1);
						}
						else {
							//game.player.GainXP(1);
							var fileout2 = [];
							//("quickstart.txt",false);
							window.localStorage['quickstart.txt'] = $Forays_Global.quickstartinfo.map(function(s) {
								return s.toLowerCase();
							});
							//							fileout.Close();
							$Forays_Global.quickstartinfo = null;
						}
					}
					else {
						//loading
						//FileStream file = new FileStream("forays.sav",FileMode.Open);
						//BinaryReader b = new BinaryReader(file);
						//Dictionary<int,PhysicalObject> id = new Dictionary<int, PhysicalObject>();
						//id.Add(0,null);
						//Dict<PhysicalObject,int> missing_target_id = new Dict<PhysicalObject, int>();
						//List<Actor> need_targets = new List<Actor>();
						//Dict<PhysicalObject,int> missing_location_id = new Dict<PhysicalObject, int>();
						//List<Actor> need_location = new List<Actor>();
						//Actor.player_name = b.ReadString();
						//game.M.current_level = b.ReadInt32();
						//game.M.level_types = new List<LevelType>();
						//for(int i=0;i<20;++i){
						//game.M.level_types.Add((LevelType)b.ReadInt32());
						//}
						//game.M.wiz_lite = b.ReadBoolean();
						//game.M.wiz_dark = b.ReadBoolean();
						////skipping danger_sensed
						//Actor.feats_in_order = new List<FeatType>();
						//Actor.partial_feats_in_order = new List<FeatType>();
						//Actor.spells_in_order = new List<SpellType>();
						//int num_featlist = b.ReadInt32();
						//for(int i=0;i<num_featlist;++i){
						//Actor.feats_in_order.Add((FeatType)b.ReadInt32());
						//}
						//int num_partialfeatlist = b.ReadInt32();
						//for(int i=0;i<num_partialfeatlist;++i){
						//Actor.partial_feats_in_order.Add((FeatType)b.ReadInt32());
						//}
						//int num_spelllist = b.ReadInt32();
						//for(int i=0;i<num_spelllist;++i){
						//Actor.spells_in_order.Add((SpellType)b.ReadInt32());
						//}
						//int num_actors = b.ReadInt32();
						//for(int i=0;i<num_actors;++i){
						//Actor a = new Actor();
						//int ID = b.ReadInt32();
						//id.Add(ID,a);
						//a.row = b.ReadInt32();
						//a.col = b.ReadInt32();
						//game.M.actor[a.row,a.col] = a;
						//a.name = b.ReadString();
						//a.the_name = b.ReadString();
						//a.a_name = b.ReadString();
						//a.symbol = b.ReadChar();
						//a.color = (Color)b.ReadInt32();
						//a.type = (ActorType)b.ReadInt32();
						//if(a.type == ActorType.PLAYER){
						//game.player = a;
						//Actor.player = a;
						//Buffer.player = a;
						//Item.player = a;
						//Map.player = a;
						//Event.player = a;
						//Tile.player = a;
						//}
						//a.maxhp = b.ReadInt32();
						//a.curhp = b.ReadInt32();
						//a.speed = b.ReadInt32();
						//a.level = b.ReadInt32();
						//a.light_radius = b.ReadInt32();
						//int target_ID = b.ReadInt32();
						//if(id.ContainsKey(target_ID)){
						//a.target = (Actor)id[target_ID];
						//}
						//else{
						//a.target = null;
						//need_targets.Add(a);
						//missing_target_id[a] = target_ID;
						//}
						//int num_items = b.ReadInt32();
						//for(int j=0;j<num_items;++j){
						//Item item = new Item();
						//item.name = b.ReadString();
						//item.the_name = b.ReadString();
						//item.a_name = b.ReadString();
						//item.symbol = b.ReadChar();
						//item.color = (Color)b.ReadInt32();
						//item.type = (ConsumableType)b.ReadInt32();
						//item.quantity = b.ReadInt32();
						//item.ignored = b.ReadBoolean();
						//a.inv.Add(item);
						//}
						//for(int j=0;j<13;++j){
						//a.F[j] = (SpellType)b.ReadInt32();
						//}
						//int num_attrs = b.ReadInt32();
						//for(int j=0;j<num_attrs;++j){
						//AttrType t = (AttrType)b.ReadInt32();
						//a.attrs[t] = b.ReadInt32();
						//}
						//int num_skills = b.ReadInt32();
						//for(int j=0;j<num_skills;++j){
						//SkillType t = (SkillType)b.ReadInt32();
						//a.skills[t] = b.ReadInt32();
						//}
						//int num_feats = b.ReadInt32();
						//for(int j=0;j<num_feats;++j){
						//FeatType t = (FeatType)b.ReadInt32();
						//a.feats[t] = b.ReadInt32();
						//}
						//int num_spells = b.ReadInt32();
						//for(int j=0;j<num_spells;++j){
						//SpellType t = (SpellType)b.ReadInt32();
						//a.spells[t] = b.ReadInt32();
						//}
						//a.magic_penalty = b.ReadInt32();
						//a.time_of_last_action = b.ReadInt32();
						//a.recover_time = b.ReadInt32();
						//int path_count = b.ReadInt32();
						//for(int j=0;j<path_count;++j){
						//a.path.Add(new pos(b.ReadInt32(),b.ReadInt32()));
						//}
						//int location_ID = b.ReadInt32();
						//if(id.ContainsKey(location_ID)){
						//a.target_location = (Tile)id[location_ID];
						//}
						//else{
						//a.target_location = null;
						//need_location.Add(a);
						//missing_location_id[a] = location_ID;
						//}
						//a.player_visibility_duration = b.ReadInt32();
						//int num_weapons = b.ReadInt32();
						//for(int j=0;j<num_weapons;++j){
						//a.weapons.Insert(a.weapons.Count, (WeaponType)b.ReadInt32());
						//}
						//int num_armors = b.ReadInt32();
						//for(int j=0;j<num_armors;++j){
						//a.armors.Insert(a.armors.Count, (ArmorType)b.ReadInt32());
						//}
						//int num_magic_items = b.ReadInt32();
						//for(int j=0;j<num_magic_items;++j){
						//a.magic_items.Insert(a.magic_items.Count, (MagicItemType)b.ReadInt32());
						//}
						//}
						//int num_groups = b.ReadInt32();
						//for(int i=0;i<num_groups;++i){
						//List<Actor> group = new List<Actor>();
						//int group_size = b.ReadInt32();
						//for(int j=0;j<group_size;++j){
						//group.Add((Actor)id[b.ReadInt32()]);
						//}
						//foreach(Actor a in group){
						//a.group = group;
						//}
						//}
						//int num_tiles = b.ReadInt32();
						//for(int i=0;i<num_tiles;++i){
						//Tile t = new Tile();
						//int ID = b.ReadInt32();
						//id.Add(ID,t);
						//t.row = b.ReadInt32();
						//t.col = b.ReadInt32();
						//game.M.tile[t.row,t.col] = t;
						//t.name = b.ReadString();
						//t.the_name = b.ReadString();
						//t.a_name = b.ReadString();
						//t.symbol = b.ReadChar();
						//t.color = (Color)b.ReadInt32();
						//t.type = (TileType)b.ReadInt32();
						//t.passable = b.ReadBoolean();
						//t.opaque = b.ReadBoolean();
						//t.seen = b.ReadBoolean();
						//t.solid_rock = b.ReadBoolean();
						//t.light_value = b.ReadInt32();
						//if(b.ReadBoolean()){ //indicates a toggles_into value
						//t.toggles_into = (TileType)b.ReadInt32();
						//}
						//else{
						//t.toggles_into = null;
						//}
						//if(b.ReadBoolean()){ //indicates an item
						//t.inv = new Item();
						//t.inv.name = b.ReadString();
						//t.inv.the_name = b.ReadString();
						//t.inv.a_name = b.ReadString();
						//t.inv.symbol = b.ReadChar();
						//t.inv.color = (Color)b.ReadInt32();
						//t.inv.type = (ConsumableType)b.ReadInt32();
						//t.inv.quantity = b.ReadInt32();
						//t.inv.ignored = b.ReadBoolean();
						//}
						//else{
						//t.inv = null;
						//}
						//int num_features = b.ReadInt32();
						//for(int j=0;j<num_features;++j){
						//t.features.Add((FeatureType)b.ReadInt32());
						//}
						//}
						//foreach(Actor a in need_targets){
						//if(id.ContainsKey(missing_target_id[a])){
						//a.target = (Actor)id[missing_target_id[a]];
						//}
						//else{
						//throw new Exception("Error: some actors weren't loaded(1). ");
						//}
						//}
						//foreach(Actor a in need_location){
						//if(id.ContainsKey(missing_location_id[a])){
						//a.target_location = (Tile)id[missing_location_id[a]];
						//}
						//else{
						//throw new Exception("Error: some tiles weren't loaded(2). ");
						//}
						//}
						//int game_turn = b.ReadInt32();
						//game.Q.turn = -1; //this keeps events from being added incorrectly to the front of the queue while loading. turn is set correctly after events are all loaded.
						//int num_tiebreakers = b.ReadInt32();
						//Actor.tiebreakers = new List<Actor>(num_tiebreakers);
						//for(int i=0;i<num_tiebreakers;++i){
						//int tiebreaker_ID = b.ReadInt32();
						//if(id.ContainsKey(tiebreaker_ID)){
						//Actor.tiebreakers.Add((Actor)id[tiebreaker_ID]);
						//}
						//else{
						//throw new Exception("Error: some actors weren't loaded(3). ");
						//}
						//}
						//int num_events = b.ReadInt32();
						//for(int i=0;i<num_events;++i){
						//Event e = new Event();
						//int target_ID = b.ReadInt32();
						//if(id.ContainsKey(target_ID)){
						//e.target = id[target_ID];
						//}
						//else{
						//throw new Exception("Error: some tiles/actors weren't loaded(4). ");
						//}
						//int area_count = b.ReadInt32();
						//for(int j=0;j<area_count;++j){
						//if(e.area == null){
						//e.area = new List<Tile>();
						//}
						//int tile_ID = b.ReadInt32();
						//if(id.ContainsKey(tile_ID)){
						//e.area.Add((Tile)id[tile_ID]);
						//}
						//else{
						//throw new Exception("Error: some tiles weren't loaded(5). ");
						//}
						//}
						//e.delay = b.ReadInt32();
						//e.type = (EventType)b.ReadInt32();
						//e.attr = (AttrType)b.ReadInt32();
						//e.value = b.ReadInt32();
						//e.msg = b.ReadString();
						//int objs_count = b.ReadInt32();
						//for(int j=0;j<objs_count;++j){
						//if(e.msg_objs == null){
						//e.msg_objs = new List<PhysicalObject>();
						//}
						//int obj_ID = b.ReadInt32();
						//if(id.ContainsKey(obj_ID)){
						//e.msg_objs.Add(id[obj_ID]);
						//}
						//else{
						//throw new Exception("Error: some actors/tiles weren't loaded(6). ");
						//}
						//}
						//e.time_created = b.ReadInt32();
						//e.dead = b.ReadBoolean();
						//e.tiebreaker = b.ReadInt32();
						//game.Q.Add(e);
						//}
						//game.Q.turn = game_turn;
						//string[] messages = new string[20];
						//for(int i=0;i<20;++i){
						//messages[i] = b.ReadString();
						//}
						//game.B.SetPreviousMessages(messages);
						//b.Close();
						//file.Close();
						window.localStorage.removeItem('forays.sav');
					}
					var actionator = new $Forays_Actable();
					actionator.q = game.q;
					game.e.addActor(actionator);
					while (!$Forays_Global.gamE_OVER) {
						game.e = game.e.start();
						//    game.Q.Pop();
						//}
						//catch (Exception exc)
						//{
						//    Window.Alert("Main Loop Exception!!!  \n    " + exc.Message);
						//}
					}
					$Forays_Game.console.cursorVisible = false;
					$Forays_Global.saveOptions();
					recentdepth = game.m.get_current_level();
					recentname = $Forays_Actor.player_name;
					recentwin = ($Forays_Global.bosS_KILLED ? 87 : 45);
					recentcause = $Forays_Global.killeD_BY;
					if (!$Forays_Global.SAVING) {
						var newhighscores = [];
						var num_scores = 0;
						var added = false;
						var file2 = Type.cast(window.localStorage['highscore.txt'], Array);
						var s1 = '';
						var cr = 0;
						while (s1.length < 2 || s1.substring(0, 2) !== '--') {
							s1 = file2[cr];
							cr++;
							newhighscores.add(s1);
						}
						s1 = '!!';
						while (s1.substring(0, 2) !== '--') {
							s1 = file2[cr];
							if (s1.substring(0, 2) === '--') {
								if (!added && num_scores < 22) {
									var symbol = ($Forays_Global.bosS_KILLED ? 87 : 45);
									newhighscores.add(game.m.get_current_level().toString() + ' ' + String.fromCharCode(symbol) + ' ' + $Forays_Actor.player_name + ' -- ' + $Forays_Global.killeD_BY);
								}
								newhighscores.add(s1);
								break;
							}
							if (num_scores < 22) {
								var tokens = s1.split(String.fromCharCode(32));
								var dlev = parseInt(tokens[0]);
								if (dlev < game.m.get_current_level()) {
									if (!added) {
										var symbol1 = ($Forays_Global.bosS_KILLED ? 87 : 45);
										newhighscores.add(game.m.get_current_level().toString() + ' ' + String.fromCharCode(symbol1) + ' ' + $Forays_Actor.player_name + ' -- ' + $Forays_Global.killeD_BY);
										++num_scores;
										added = true;
									}
									if (num_scores < 22) {
										newhighscores.add(s1);
										++num_scores;
									}
								}
								else {
									newhighscores.add(s1);
									++num_scores;
								}
							}
						}
						//List<string> fileout = new List<string>(); //new StreamWriter("highscore.txt",false);
						//foreach(string str in newhighscores){
						//fileout.WriteLine(str);
						//}
						window.localStorage['highscore.txt'] = newhighscores;
						//						fileout.Close();
					}
					if (!$Forays_Global.QUITTING && !$Forays_Global.SAVING) {
						game.player.displayStats$1(false);
						if ($Forays_Global.killeD_BY !== 'giving up' && !$Forays_Help.displayed.get_item(10)) {
							if ($Forays_Extensions.where($Forays_Item).call(null, game.player.get_inv(), function(item) {
								return item.get_itype() === 0 || item.get_itype() === 6;
							}).length > 0) {
								$Forays_Help.tutorialTip(10);
								$Forays_Global.saveOptions();
							}
						}
						var ls = [];
						ls.add('See the map');
						ls.add('See last messages');
						ls.add('Examine your equipment');
						ls.add('Examine your inventory');
						ls.add('See character info');
						ls.add('Write this information to a file');
						ls.add('Done');
						for (var done = false; !done;) {
							game.player.select$5('Would you like to examine your character! ', ''.padRight($Forays_Global.COLS), ''.padRight($Forays_Global.COLS), ls, true, false, false);
							var sel = game.player.getSelection('Would you like to examine your character? ', 7, true, false, false);
							switch (sel) {
								case 0: {
									var $t2 = game.m.allTiles();
									for (var $t3 = 0; $t3 < $t2.length; $t3++) {
										var t = $t2[$t3];
										if (t.get_ttype() !== 1 && !t.isTrap()) {
											var good1 = false;
											var $t4 = t.tilesAtDistance(1);
											for (var $t5 = 0; $t5 < $t4.length; $t5++) {
												var neighbor = $t4[$t5];
												if (neighbor.get_ttype() !== 0) {
													good1 = true;
												}
											}
											if (good1) {
												t.set_seen(true);
											}
										}
									}
									game.b.displayNow$1('Press any key to continue. ');
									$Forays_Game.console.cursorVisible = true;
									$Forays_Screen.writeMapChar$1(0, 0, '-');
									game.m.draw();
									$Forays_Game.console.readKey(true);
									break;
								}
								case 1: {
									$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Global.COLS, 45));
									var i4 = 1;
									var $t6 = game.b.getMessages();
									for (var $t7 = 0; $t7 < $t6.length; $t7++) {
										var s2 = $t6[$t7];
										$Forays_Screen.writeMapString$2(i4, 0, s2.padRight($Forays_Global.COLS));
										++i4;
									}
									$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Global.COLS, 45));
									game.b.displayNow$1('Previous messages: ');
									$Forays_Game.console.cursorVisible = true;
									$Forays_Game.console.readKey(true);
									break;
								}
								case 2: {
									game.player.displayEquipment();
									break;
								}
								case 3: {
									for (var i5 = 1; i5 < 8; ++i5) {
										$Forays_Screen.writeMapString$2(i5, 0, ''.padRight($Forays_Global.COLS));
									}
									game.player.select$3('In your pack: ', game.player.inventoryList(), true, false, false);
									$Forays_Game.console.readKey(true);
									break;
								}
								case 4: {
									game.player.displayCharacterInfo();
									break;
								}
								case 5: {
									game.b.displayNow$1('Enter file name: ');
									$Forays_Game.console.cursorVisible = true;
									var filename = $Forays_Global.enterString$1(40);
									if (filename === '') {
										break;
									}
									var fileout3 = [];
									//(filename,true);
									game.player.displayCharacterInfo$1(false);
									var screen = $Forays_Screen.getCurrentScreen();
									fileout3[0] = '';
									for (var i6 = 2; i6 < $Forays_Global.screeN_H; ++i6) {
										for (var j = 0; j < $Forays_Global.screeN_W; ++j) {
											fileout3[0] += screen.get(i6, j).c;
										}
										fileout3[0] += '\n';
									}
									fileout3[0] += '\n';
									fileout3[0] += 'Inventory: \n';
									var $t8 = game.player.inventoryList();
									for (var $t9 = 0; $t9 < $t8.length; $t9++) {
										var s3 = $t8[$t9];
										fileout3[0] += s3 + '\n';
									}
									fileout3[0] += '\n';
									fileout3[0] += '\n';
									var $t10 = game.m.allTiles();
									for (var $t11 = 0; $t11 < $t10.length; $t11++) {
										var t1 = $t10[$t11];
										if (t1.get_ttype() !== 1 && !t1.isTrap()) {
											var good2 = false;
											var $t12 = t1.tilesAtDistance(1);
											for (var $t13 = 0; $t13 < $t12.length; $t13++) {
												var neighbor1 = $t12[$t13];
												if (neighbor1.get_ttype() !== 0) {
													good2 = true;
												}
											}
											if (good2) {
												t1.set_seen(true);
											}
										}
									}
									$Forays_Screen.writeMapChar$1(0, 0, '-');
									game.m.draw();
									var col = 0;
									var $t14 = $Forays_Screen.getCurrentMap();
									for (var $t15 = 0; $t15 < $t14.length; $t15++) {
										var cch = $t14[$t15];
										fileout3[0] += cch.c;
										++col;
										if (col === $Forays_Global.COLS) {
											fileout3[0] += '\n';
											col = 0;
										}
									}
									fileout3[0] += '\n';
									$Forays_Screen.writeMapString$2(0, 0, ''.padRight($Forays_Global.COLS, 45));
									var line = 1;
									var $t16 = game.b.getMessages();
									for (var $t17 = 0; $t17 < $t16.length; $t17++) {
										var s4 = $t16[$t17];
										$Forays_Screen.writeMapString$2(line, 0, s4.padRight($Forays_Global.COLS));
										++line;
									}
									$Forays_Screen.writeMapString$2(21, 0, ''.padRight($Forays_Global.COLS, 45));
									fileout3[0] += 'Last messages: \n';
									col = 0;
									var $t18 = $Forays_Screen.getCurrentMap();
									for (var $t19 = 0; $t19 < $t18.length; $t19++) {
										var cch1 = $t18[$t19];
										fileout3[0] += cch1.c;
										++col;
										if (col === $Forays_Global.COLS) {
											fileout3[0] += '\n';
											col = 0;
										}
									}
									fileout3[0] += '\n';
									//								fileout.Close();
									break;
								}
								case 6: {
									done = true;
									break;
								}
								default: {
									break;
								}
							}
						}
					}
					break;
				}
				case 98: {
					$Forays_Help.displayHelp();
					break;
				}
				case 99: {
					$Forays_Screen.blank();
					var scores = [];
					{
						var file3 = Type.cast(window.localStorage['highscore.txt'], Array);
						var s5 = '';
						var cr1 = 0;
						while (s5.length < 2 || s5.substring(0, 2) !== '--') {
							s5 = file3[cr1];
							cr1++;
						}
						s5 = '!!';
						while (s5.substring(0, 2) !== '--') {
							s5 = file3[cr1];
							cr1++;
							if (s5.substring(0, 2) === '--') {
								break;
							}
							else {
								scores.add(s5);
							}
						}
						//						file.Close();
					}
					var longest_name = 0;
					var longest_cause = 0;
					for (var $t20 = 0; $t20 < scores.length; $t20++) {
						var s6 = scores[$t20];
						var tokens1 = s6.split(String.fromCharCode(32));
						var name_and_cause_of_death = s6.substring(tokens1[0].length + 3);
						var idx = name_and_cause_of_death.lastIndexOf(' -- ');
						var name = name_and_cause_of_death.substring(0, idx);
						var cause_of_death = name_and_cause_of_death.substring(idx + 4);
						if (name.length > longest_name) {
							longest_name = name.length;
						}
						if (cause_of_death.length > longest_cause) {
							longest_cause = cause_of_death.length;
						}
					}
					var total_spaces = 76 - (longest_name + longest_cause);
					//max name length is 26 and max cause length is 42. The other 4 spaces are used for depth.
					var half_spaces = ss.Int32.div(total_spaces, 2);
					var half_spaces_offset = ss.Int32.div(total_spaces + 1, 2);
					var spaces1 = ss.Int32.div(half_spaces, 4);
					var spaces2 = half_spaces - ss.Int32.div(half_spaces, 4);
					var spaces3 = half_spaces_offset - ss.Int32.div(half_spaces_offset, 4);
					//int spaces4 = half_spaces_offset / 4;
					var name_middle = spaces1 + ss.Int32.div(longest_name, 2);
					var depth_middle = spaces1 + spaces2 + longest_name + 1;
					var cause_middle = spaces1 + spaces2 + spaces3 + longest_name + 4 + ss.Int32.div(longest_cause - 1, 2);
					var primary = 4;
					var recent = 8;
					$Forays_Screen.writeString$1(0, 34, new $Forays_cstr.$ctor1('HIGH SCORES', 6));
					$Forays_Screen.writeString$1(1, 34, new $Forays_cstr.$ctor1('-----------', 8));
					$Forays_Screen.writeString$1(2, name_middle - 4, new $Forays_cstr.$ctor1('Character', primary));
					$Forays_Screen.writeString$1(2, depth_middle - 2, new $Forays_cstr.$ctor1('Depth', primary));
					$Forays_Screen.writeString$1(2, cause_middle - 6, new $Forays_cstr.$ctor1('Cause of death', primary));
					var written_recent = false;
					var line1 = 3;
					for (var $t21 = 0; $t21 < scores.length; $t21++) {
						var s7 = scores[$t21];
						if (line1 > 24) {
							continue;
						}
						var tokens2 = s7.split(String.fromCharCode(32));
						var dlev1 = parseInt(tokens2[0]);
						var winning = tokens2[1].charCodeAt(0);
						var name_and_cause_of_death1 = s7.substring(tokens2[0].length + 3);
						var idx1 = name_and_cause_of_death1.lastIndexOf(' -- ');
						var name1 = name_and_cause_of_death1.substring(0, idx1);
						var cause_of_death1 = name_and_cause_of_death1.substring(idx1 + 4);
						var cause_capitalized = cause_of_death1.substring(0, 1).toUpperCase() + cause_of_death1.substring(1);
						var current_color = 1;
						if (!written_recent && ss.referenceEquals(name1, recentname) && dlev1 === recentdepth && winning === recentwin && ss.referenceEquals(cause_of_death1, recentcause)) {
							current_color = recent;
							written_recent = true;
						}
						else {
							current_color = 1;
						}
						$Forays_Screen.writeString$1(line1, spaces1, new $Forays_cstr.$ctor1(name1, current_color));
						$Forays_Screen.writeString$1(line1, spaces1 + spaces2 + longest_name, new $Forays_cstr.$ctor1(dlev1.toString().padLeft(2), current_color));
						$Forays_Screen.writeString$1(line1, spaces1 + spaces2 + spaces3 + longest_name + 4, new $Forays_cstr.$ctor1(cause_capitalized, current_color));
						if (winning === 87) {
							$Forays_Screen.writeString$1(line1, spaces1 + spaces2 + longest_name + 3, new $Forays_cstr.$ctor1('W', 6));
						}
						++line1;
					}
					$Forays_Game.console.readKey(true);
					break;
				}
				case 100: {
					$Forays_Global.quit();
					break;
				}
				default: {
					break;
				}
			}
			if ($Forays_Global.QUITTING) {
				$Forays_Global.quit();
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Global
	var $Forays_Global = function() {
	};
	$Forays_Global.option = function(option) {
		var result = false;
		if (Object.keyExists($Forays_Global.options, option)) {
			result = $Forays_Global.options[option];
		}
		return result;
	};
	$Forays_Global.setSeed = function(seed) {
		ROT.RNG.setSeed(seed);
	};
	$Forays_Global.roll$1 = function(dice, sides) {
		var total = 0;
		for (var i = 0; i < dice; ++i) {
			total += ss.Int32.trunc(1 + Math.floor(ROT.RNG.getUniform() * sides));
			//Next's maxvalue is exclusive, thus the +1
		}
		return total;
	};
	$Forays_Global.roll = function(sides) {
		//note that Roll(0) returns 1. I think I should eventually change that.
		var total = 0;
		total += ss.Int32.trunc(1 + Math.floor(ROT.RNG.getUniform() * sides));
		//Next's maxvalue is exclusive, thus the +1
		return total;
	};
	$Forays_Global.oneIn = function(num) {
		var i = $Forays_Global.roll(num);
		if (i === num) {
			return true;
		}
		return false;
	};
	$Forays_Global.coinFlip = function() {
		return 1 > Math.floor(ROT.RNG.getUniform() * 2);
	};
	$Forays_Global.randomDirection = function() {
		var result = 1 + ss.Int32.trunc(Math.floor(ROT.RNG.getUniform() * 8));
		if (result === 5) {
			result = 9;
		}
		return result;
	};
	$Forays_Global.rotateDirection = function(dir, clockwise) {
		return $Forays_Global.rotateDirection$1(dir, clockwise, 1);
	};
	$Forays_Global.rotateDirection$1 = function(dir, clockwise, num) {
		for (var i = 0; i < num; ++i) {
			switch (dir) {
				case 7: {
					dir = (clockwise ? 8 : 4);
					break;
				}
				case 8: {
					dir = (clockwise ? 9 : 7);
					break;
				}
				case 9: {
					dir = (clockwise ? 6 : 8);
					break;
				}
				case 4: {
					dir = (clockwise ? 7 : 1);
					break;
				}
				case 5: {
					break;
				}
				case 6: {
					dir = (clockwise ? 3 : 9);
					break;
				}
				case 1: {
					dir = (clockwise ? 4 : 2);
					break;
				}
				case 2: {
					dir = (clockwise ? 1 : 3);
					break;
				}
				case 3: {
					dir = (clockwise ? 2 : 6);
					break;
				}
				default: {
					dir = 0;
					break;
				}
			}
		}
		return dir;
	};
	$Forays_Global.boundsCheck = function(r, c) {
		if (r >= 0 && r < $Forays_Global.ROWS && c >= 0 && c < $Forays_Global.COLS) {
			return true;
		}
		return false;
	};
	$Forays_Global.flushInput = function() {
		while ($Forays_Game.console.keyAvailable) {
			$Forays_Game.console.readKey(true);
		}
	};
	$Forays_Global.enterInt = function() {
		return $Forays_Global.enterInt$1(4);
	};
	$Forays_Global.enterInt$1 = function(max_length) {
		var s = '';
		var command;
		$Forays_Game.console.cursorVisible = true;
		var done = false;
		var pos = $Forays_Game.console.cursorLeft;
		$Forays_Screen.writeString$2($Forays_Game.console.cursorTop, pos, ''.padRight(max_length));
		while (!done) {
			$Forays_Game.console.setCursorPosition(pos, $Forays_Game.console.cursorTop);
			command = $Forays_Game.console.readKey(true);
			if (command.keyChar >= 48 && command.keyChar <= 57) {
				if (s.length < max_length) {
					s = s + String.fromCharCode(command.keyChar);
					$Forays_Screen.writeChar$1($Forays_Game.console.cursorTop, pos, command.keyChar);
					++pos;
				}
			}
			else if (command.key === $Forays_ConsoleKey.backspace && s.length > 0) {
				s = s.substring(0, s.length - 1);
				--pos;
				$Forays_Screen.writeChar$1($Forays_Game.console.cursorTop, pos, 32);
				$Forays_Game.console.setCursorPosition(pos, $Forays_Game.console.cursorTop);
			}
			else if (command.key === $Forays_ConsoleKey.escape) {
				return 0;
			}
			else if (command.key === $Forays_ConsoleKey.enter) {
				if (s.length === 0) {
					return -1;
				}
				done = true;
			}
		}
		return parseInt(s);
	};
	$Forays_Global.enterString = function() {
		return $Forays_Global.enterString$1(65);
	};
	$Forays_Global.enterString$1 = function(max_length) {
		var s = '';
		var command;
		$Forays_Game.console.cursorVisible = true;
		var done = false;
		var pos = $Forays_Game.console.cursorLeft;
		$Forays_Screen.writeString$2($Forays_Game.console.cursorTop, pos, ''.padRight(max_length));
		while (!done) {
			$Forays_Game.console.setCursorPosition(pos, $Forays_Game.console.cursorTop);
			command = $Forays_Game.console.readKey(true);
			if (command.keyChar >= 33 && command.keyChar <= 126 || command.keyChar === 32) {
				if (s.length < max_length) {
					s = s + String.fromCharCode(command.keyChar);
					$Forays_Screen.writeChar$1($Forays_Game.console.cursorTop, pos, command.keyChar);
					++pos;
				}
			}
			else if (command.key === $Forays_ConsoleKey.backspace && s.length > 0) {
				s = s.substring(0, s.length - 1);
				--pos;
				$Forays_Screen.writeChar$1($Forays_Game.console.cursorTop, pos, 32);
				$Forays_Game.console.setCursorPosition(pos, $Forays_Game.console.cursorTop);
			}
			else if (command.key === $Forays_ConsoleKey.escape) {
				return '';
			}
			else if (command.key === $Forays_ConsoleKey.enter) {
				if (s.length === 0) {
					return '';
				}
				done = true;
			}
		}
		return s;
	};
	$Forays_Global.romanNumeral = function(num) {
		var result = '';
		while (num > 1000) {
			result = result + 'M';
			num -= 1000;
		}
		result = result + $Forays_Global.$romanPattern(ss.Int32.div(num, 100), 67, 68, 77);
		num -= ss.Int32.div(num, 100) * 100;
		result = result + $Forays_Global.$romanPattern(ss.Int32.div(num, 10), 88, 76, 67);
		num -= ss.Int32.div(num, 10) * 10;
		result = result + $Forays_Global.$romanPattern(num, 73, 86, 88);
		return result;
	};
	$Forays_Global.$romanPattern = function(num, oneI, fiveV, tenX) {
		var one = String.fromCharCode(oneI);
		var five = String.fromCharCode(fiveV);
		var ten = String.fromCharCode(tenX);
		switch (num) {
			case 1: {
				return '' + one;
			}
			case 2: {
				return '' + one + one;
			}
			case 3: {
				return '' + one + one + one;
			}
			case 4: {
				return '' + one + five;
			}
			case 5: {
				return '' + five;
			}
			case 6: {
				return '' + five + one;
			}
			case 7: {
				return '' + five + one + one;
			}
			case 8: {
				return '' + five + one + one + one;
			}
			case 9: {
				return '' + one + ten;
			}
			default: {
				return '';
			}
		}
	};
	$Forays_Global.loadOptions = function() {
		//StreamReader file = new StreamReader("options.txt");
		//string s = "";
		//while(s.Length < 2 || s.Substring(0,2) != "--"){
		//s = file.ReadLine();
		//if(s.Length >= 2 && s.Substring(0,2) == "--"){
		//break;
		//}
		//string[] tokens = s.Split(' ');
		//if(tokens[0].Length == 1){
		//char c = (tokens[0][0]).ToString().ToUpperCase()[0];
		//if(c == 'F' || c == 'T'){
		//OptionType option = (OptionType)Enum.Parse(typeof(OptionType),tokens[1]);
		//if(c == 'F'){
		//Options[option] = false;
		//}
		//else{
		//Options[option] = true;
		//}
		//}
		//}
		//}
		//s = "";
		//while(s.Length < 2 || s.Substring(0,2) != "--"){
		//s = file.ReadLine();
		//if(s.Length >= 2 && s.Substring(0,2) == "--"){
		//break;
		//}
		//string[] tokens = s.Split(' ');
		//if(tokens[0].Length == 1){
		//char c = (tokens[0][0]).ToString().ToUpperCase()[0];
		//if(c == 'F' || c == 'T'){
		//TutorialTopic topic = (TutorialTopic)Enum.Parse(typeof(TutorialTopic),tokens[1]);
		//if(c == 'F' || Global.Option(OptionType.ALWAYS_RESET_TIPS)){
		//Help.displayed[topic] = false;
		//}
		//else{
		//Help.displayed[topic] = true;
		//}
		//}
		//}
		//}
	};
	$Forays_Global.saveOptions = function() {
		//JsDictionary<string, string> sav =  new JsDictionary<string, string>() { };
		//foreach(OptionType op in OptionType.ALWAYS_RESET_TIPS.GetValues()){
		//if(Options[op]){
		//sav[op.ToString()] = "t" + op.ToString().ToLower();//file.Write("t ");
		//}
		//else{
		//sav[op.ToString()] = "f" + op.ToString().ToLower();
		//}
		////file.WriteLine(Enum.GetName(typeof(OptionType),op).ToLower());
		//}
		////file.WriteLine("-- Tracking which tutorial tips have been displayed:");
		//foreach(TutorialTopic topic in TutorialTopic.Armor.GetValues()){
		//if(Help.displayed[topic]){
		//sav[topic.ToString()] = "t" + topic.ToString().ToLower();
		//}
		//else{
		//sav[topic.ToString()] = "f" + topic.ToString().ToLower();
		//}
		////file.WriteLine(Enum.GetName(typeof(TutorialTopic),topic).ToLower());
		//}
		////			file.WriteLine("--");
		////			file.Close();
	};
	$Forays_Global.saveGame = function(B, M, Q) {
		//games are loaded in Main.cs
		//
		//            FileStream file = new FileStream("forays.sav",FileMode.CreateNew);
		//
		//            BinaryWriter b = new BinaryWriter(file);
		//
		//            JsDictionary<PhysicalObject, int> id = new JsDictionary<PhysicalObject, int>();
		//
		//            int next_id = 1;
		//
		//            IDMethod GetID = delegate(PhysicalObject o){
		//
		//            if(o == null){
		//
		//            return 0;
		//
		//            }
		//
		//            if(!id.ContainsKey(o)){
		//
		//            id[o] = next_id;
		//
		//            ++next_id;
		//
		//            }
		//
		//            return id[o];
		//
		//            };
		//
		//            b.Write(Actor.player_name);
		//
		//            b.Write(M.current_level);
		//
		//            for(int i=0;i<20;++i){
		//
		//            b.Write((int)M.level_types[i]);
		//
		//            }
		//
		//            b.Write(M.wiz_lite);
		//
		//            b.Write(M.wiz_dark);
		//
		//            //skipping danger_sensed
		//
		//            b.Write(Actor.feats_in_order.Count);
		//
		//            foreach(FeatType ft in Actor.feats_in_order){
		//
		//            b.Write((int)ft);
		//
		//            }
		//
		//            b.Write(Actor.partial_feats_in_order.Count);
		//
		//            foreach(FeatType ft in Actor.partial_feats_in_order){
		//
		//            b.Write((int)ft);
		//
		//            }
		//
		//            b.Write(Actor.spells_in_order.Count);
		//
		//            foreach(SpellType sp in Actor.spells_in_order){
		//
		//            b.Write((int)sp);
		//
		//            }
		//
		//            List<List<Actor>> groups = new List<List<Actor>>();
		//
		//            b.Write(M.AllActors().Count);
		//
		//            foreach(Actor a in M.AllActors()){
		//
		//            b.Write(GetID(a));
		//
		//            b.Write(a.row);
		//
		//            b.Write(a.col);
		//
		//            b.Write(a.name);
		//
		//            b.Write(a.the_name);
		//
		//            b.Write(a.a_name);
		//
		//            b.Write(a.symbol);
		//
		//            b.Write((int)a.color);
		//
		//            b.Write((int)a.type);
		//
		//            b.Write(a.maxhp);
		//
		//            b.Write(a.curhp);
		//
		//            b.Write(a.speed);
		//
		//            b.Write(a.level);
		//
		//            b.Write(a.light_radius);
		//
		//            b.Write(GetID(a.target));
		//
		//            b.Write(a.inv.Count);
		//
		//            foreach(Item i in a.inv){
		//
		//            b.Write(i.name);
		//
		//            b.Write(i.the_name);
		//
		//            b.Write(i.a_name);
		//
		//            b.Write(i.symbol);
		//
		//            b.Write((int)i.color);
		//
		//            b.Write((int)i.type);
		//
		//            b.Write(i.quantity);
		//
		//            b.Write(i.ignored);
		//
		//            }
		//
		//            for(int i=0;i<13;++i){
		//
		//            b.Write((int)a.F[i]);
		//
		//            }
		//
		//            b.Write(a.attrs.d.Count);
		//
		//            foreach(AttrType at in a.attrs.d.Keys){
		//
		//            b.Write((int)at);
		//
		//            b.Write(a.attrs[at]);
		//
		//            }
		//
		//            b.Write(a.skills.d.Count);
		//
		//            foreach(SkillType st in a.skills.d.Keys){
		//
		//            b.Write((int)st);
		//
		//            b.Write(a.skills[st]);
		//
		//            }
		//
		//            b.Write(a.feats.d.Count);
		//
		//            foreach(FeatType ft in a.feats.d.Keys){
		//
		//            b.Write((int)ft);
		//
		//            b.Write(a.feats[ft]);
		//
		//            }
		//
		//            b.Write(a.spells.d.Count);
		//
		//            foreach(SpellType sp in a.spells.d.Keys){
		//
		//            b.Write((int)sp);
		//
		//            b.Write(a.spells[sp]);
		//
		//            }
		//
		//            b.Write(a.magic_penalty);
		//
		//            b.Write(a.time_of_last_action);
		//
		//            b.Write(a.recover_time);
		//
		//            b.Write(a.path.Count);
		//
		//            foreach(pos p in a.path){
		//
		//            b.Write(p.row);
		//
		//            b.Write(p.col);
		//
		//            }
		//
		//            b.Write(GetID(a.target_location));
		//
		//            b.Write(a.player_visibility_duration);
		//
		//            if(a.group != null){
		//
		//            groups.AddUnique(a.group);
		//
		//            }
		//
		//            b.Write(a.weapons.Count);
		//
		//            foreach(WeaponType w in a.weapons){
		//
		//            b.Write((int)w);
		//
		//            }
		//
		//            b.Write(a.armors.Count);
		//
		//            foreach(ArmorType ar in a.armors){
		//
		//            b.Write((int)ar);
		//
		//            }
		//
		//            b.Write(a.magic_items.Count);
		//
		//            foreach(MagicItemType m in a.magic_items){
		//
		//            b.Write((int)m);
		//
		//            }
		//
		//            }
		//
		//            b.Write(groups.Count);
		//
		//            foreach(List<Actor> group in groups){
		//
		//            b.Write(group.Count);
		//
		//            foreach(Actor a in group){
		//
		//            b.Write(GetID(a));
		//
		//            }
		//
		//            }
		//
		//            b.Write(M.AllTiles().Count);
		//
		//            foreach(Tile t in M.AllTiles()){
		//
		//            b.Write(GetID(t));
		//
		//            b.Write(t.row);
		//
		//            b.Write(t.col);
		//
		//            b.Write(t.name);
		//
		//            b.Write(t.the_name);
		//
		//            b.Write(t.a_name);
		//
		//            b.Write(t.symbol);
		//
		//            b.Write((int)t.color);
		//
		//            b.Write((int)t.type);
		//
		//            b.Write(t.passable);
		//
		//            b.Write(t.opaque);
		//
		//            b.Write(t.seen);
		//
		//            b.Write(t.solid_rock);
		//
		//            b.Write(t.light_value);
		//
		//            if(t.toggles_into.HasValue){
		//
		//            b.Write(true);
		//
		//            b.Write((int)t.toggles_into.Value);
		//
		//            }
		//
		//            else{
		//
		//            b.Write(false);
		//
		//            }
		//
		//            if(t.inv != null){
		//
		//            b.Write(true);
		//
		//            b.Write(t.inv.name);
		//
		//            b.Write(t.inv.the_name);
		//
		//            b.Write(t.inv.a_name);
		//
		//            b.Write(t.inv.symbol);
		//
		//            b.Write((int)t.inv.color);
		//
		//            b.Write((int)t.inv.type);
		//
		//            b.Write(t.inv.quantity);
		//
		//            b.Write(t.inv.ignored);
		//
		//            }
		//
		//            else{
		//
		//            b.Write(false);
		//
		//            }
		//
		//            b.Write(t.features.Count);
		//
		//            foreach(FeatureType f in t.features){
		//
		//            b.Write((int)f);
		//
		//            }
		//
		//            }
		//
		//            b.Write(Q.turn);
		//
		//            b.Write(Actor.tiebreakers.Count);
		//
		//            foreach(Actor a in Actor.tiebreakers){
		//
		//            b.Write(GetID(a));
		//
		//            }
		//
		//            b.Write(Q.list.Count);
		//
		//            foreach(Event e in Q.list){
		//
		//            b.Write(GetID(e.target));
		//
		//            if(e.area == null){
		//
		//            b.Write(0);
		//
		//            }
		//
		//            else{
		//
		//            b.Write(e.area.Count);
		//
		//            foreach(Tile t in e.area){
		//
		//            b.Write(GetID(t));
		//
		//            }
		//
		//            }
		//
		//            b.Write(e.delay);
		//
		//            b.Write((int)e.type);
		//
		//            b.Write((int)e.attr);
		//
		//            b.Write(e.value);
		//
		//            b.Write(e.msg);
		//
		//            if(e.msg_objs == null){
		//
		//            b.Write(0);
		//
		//            }
		//
		//            else{
		//
		//            b.Write(e.msg_objs.Count);
		//
		//            foreach(PhysicalObject o in e.msg_objs){
		//
		//            b.Write(GetID(o));
		//
		//            }
		//
		//            }
		//
		//            b.Write(e.time_created);
		//
		//            b.Write(e.dead);
		//
		//            b.Write(e.tiebreaker);
		//
		//            }
		//
		//            for(int i=0;i<20;++i){
		//
		//            b.Write(B.Printed(i));
		//
		//            }
		//
		//            b.Close();
		//
		//            file.Close();
	};
	$Forays_Global.quit = function() {
		$Forays_Screen.blank();
		$Forays_Screen.resetColors();
		$Forays_Game.console.setCursorPosition(0, 0);
		$Forays_Game.console.cursorVisible = true;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Help
	var $Forays_Help = function() {
	};
	$Forays_Help.getTutorialTopics = function() {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	};
	$Forays_Help.displayHelp = function() {
		$Forays_Help.displayHelp$1(0);
	};
	$Forays_Help.displayHelp$1 = function(h) {
		$Forays_Game.console.cursorVisible = false;
		$Forays_Screen.blank();
		var num_topics = $Forays_Help.getHelpTopics().length;
		$Forays_Screen.writeString$3(5, 4, 'Topics:', 6);
		for (var i = 0; i < num_topics + 1; ++i) {
			$Forays_Screen.writeString$2(i + 7, 0, '[ ]');
			$Forays_Screen.writeChar$2(i + 7, 1, i + 97, 8);
		}
		$Forays_Screen.writeString$2(num_topics + 7, 4, 'Quit');
		$Forays_Screen.writeString$2(0, 16, ''.padRight(61, 45));
		$Forays_Screen.writeString$2(23, 16, ''.padRight(61, 45));
		var text = $Forays_Help.helpText(h);
		var startline = 0;
		var command;
		var ch;
		for (var done = false; !done;) {
			var $t1 = $Forays_Help.getHelpTopics();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var help = $t1[$t2];
				if (h === help) {
					$Forays_Screen.writeString$3(7 + help, 4, ss.Enum.toString($Forays_HelpTopic, help), 6);
				}
				else {
					$Forays_Screen.writeString$2(7 + help, 4, ss.Enum.toString($Forays_HelpTopic, help));
				}
			}
			if (startline > 0) {
				$Forays_Screen.writeString(0, 77, new $Forays_colorstring.$ctor4('[', 6, '-', 8, ']', 6));
			}
			else {
				$Forays_Screen.writeString$2(0, 77, '---');
			}
			var more = false;
			if (startline + 22 < text.length) {
				more = true;
			}
			if (more) {
				$Forays_Screen.writeString(23, 77, new $Forays_colorstring.$ctor4('[', 6, '+', 8, ']', 6));
			}
			else {
				$Forays_Screen.writeString$2(23, 77, '---');
			}
			for (var i1 = 1; i1 <= 22; ++i1) {
				if (text.length - startline < i1) {
					$Forays_Screen.writeString$2(i1, 16, ''.padRight(64));
				}
				else {
					$Forays_Screen.writeString$2(i1, 16, text[i1 + startline - 1].padRight(64));
				}
			}
			command = $Forays_Game.console.readKey(true);
			var ck = command.key;
			if (ck === $Forays_ConsoleKey.backspace || ck === $Forays_ConsoleKey.pageUp) {
				ch = String.fromCharCode(8);
			}
			else if (ck === $Forays_ConsoleKey.pageDown) {
				ch = ' ';
			}
			else {
				ch = $Forays_Actor.convertInput(command);
			}
			switch (ch) {
				case 'a': {
					if (h !== 0) {
						h = 0;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'b': {
					if (h !== 1) {
						h = 1;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'c': {
					if (h !== 2) {
						h = 2;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'd': {
					if (h !== 3) {
						h = 3;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'e': {
					if (h !== 4) {
						h = 4;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'f': {
					if (h !== 5) {
						h = 5;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'g': {
					if (h !== 6) {
						h = 6;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'h': {
					if (h !== 7) {
						h = 7;
						text = $Forays_Help.helpText(h);
						startline = 0;
					}
					break;
				}
				case 'i':
				case '': {
					done = true;
					break;
				}
				case '8':
				case '-':
				case '_': {
					if (startline > 0) {
						--startline;
					}
					break;
				}
				case '2':
				case '+':
				case '=': {
					if (more) {
						++startline;
					}
					break;
				}
				case '\b': {
					if (startline > 0) {
						startline -= 22;
						if (startline < 0) {
							startline = 0;
						}
					}
					break;
				}
				case ' ':
				case '\r': {
					if (text.length > 22) {
						startline += 22;
						if (startline + 22 > text.length) {
							startline = text.length - 22;
						}
					}
					break;
				}
				default: {
					break;
				}
			}
		}
		$Forays_Screen.blank();
	};
	$Forays_Help.getHelpTopics = function() {
		return [0, 1, 2, 3, 4, 5, 6, 7];
	};
	$Forays_Help.helpText = function(h) {
		var path = '';
		var startline = 0;
		var num_lines = -1;
		//-1 means read until end
		switch (h) {
			case 0: {
				path = 'help.txt';
				num_lines = 54;
				break;
			}
			case 5: {
				path = 'help.txt';
				startline = 56;
				num_lines = 26;
				break;
			}
			case 4: {
				path = 'item_help.txt';
				break;
			}
			case 1: {
				path = 'feat_help.txt';
				num_lines = 19;
				break;
			}
			case 2: {
				path = 'feat_help.txt';
				startline = 21;
				break;
			}
			case 3: {
				path = 'spell_help.txt';
				break;
			}
			case 6: {
				path = 'advanced_help.txt';
				break;
			}
			default: {
				path = 'feat_help.txt';
				break;
			}
		}
		var result = [];
		if (h === 7) {
			//these aren't read from a file
			result.add('Viewing all tutorial tips:');
			result.add('');
			result.add('');
			result.add('');
			var $t1 = $Forays_Help.getTutorialTopics();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var topic = $t1[$t2];
				var $t3 = $Forays_Help.tutorialText(topic);
				for (var $t4 = 0; $t4 < $t3.length; $t4++) {
					var s = $t3[$t4];
					result.add(s);
				}
				result.add('');
				result.add('');
				result.add('');
			}
			return result;
		}
		if (path !== '') {
			//				StreamReader file = new StreamReader(path);
			//				for(int i=0;i<startline;++i){
			//				file.ReadLine();
			//				}
			//				for(int i=0;i<num_lines || num_lines == -1;++i){
			//				if(file.Peek() != -1){
			//				result.Add(file.ReadLine());
			//				}
			//				else{
			//				break;
			//				}
			//				}
			//				file.Close();
		}
		return result;
	};
	$Forays_Help.nextColor = function(c) {
		if (c === 15) {
			return 1;
		}
		else {
			return 1 + c;
		}
	};
	$Forays_Help.tutorialText = function(topic) {
		switch (topic) {
			case 0: {
				return ['Moving around', '', 'Use the numpad [1-9] to move. Press', '[5] to wait.', '', 'If you have no numpad, you can use', 'the arrow keys or [hjkl] to move,', 'using [yubn] for diagonal moves.', '', 'This tip won\'t appear again. If you', 'wish to view all tips, you can find', 'them by pressing [?] for help.'];
			}
			case 1: {
				return ['Attacking enemies', '', 'To make a melee attack, simply try to', 'move toward an adjacent monster.'];
			}
			case 2: {
				return ['Using your torch', '', 'You carry a torch that illuminates', 'your surroundings, but its light makes', 'your presence obvious to enemies.', '', 'To put your torch away (or bring it', 'back out), press [t].', '', 'You won\'t be able to see quite as far without', 'your torch (and you\'ll have a harder time', 'spotting hidden things), but you\'ll be able', 'to sneak around without automatically', 'alerting monsters.'];
			}
			case 3: {
				return ['Resisted!', '', 'Some monsters take half damage from certain', 'attack types. If a monster resists one of your', 'attacks, you can switch to a different', 'weapon by pressing [e] to access the', 'equipment screen.', '', 'For example, skeletons resist several types of', 'damage, but are fully vulnerable to maces.'];
			}
			case 6: {
				return ['Ranged attacks', '', 'There are some monsters that are best dispatched', 'at a safe distance. You can switch to your bow', 'by pressing [e] to access the equipment screen.', '', 'Once you\'ve readied your bow, press [s] to shoot.'];
			}
			case 7: {
				return ['Feats', '', 'Feats are special abilities', 'you can learn at shrines.', '', 'You need to put ALL of the required', 'points into a feat before you can', 'use it.'];
			}
			case 8: {
				return ['Armor', '', 'Armor helps you to avoid taking damage from', 'attacks, but heavy armor also interferes with', 'both stealth and magic spells.', '', 'If you don\'t need stealth or magic, wear', 'full plate for the best protection.'];
			}
			case 4: {
				return ['You\'re on fire!', '', 'You\'ll take damage each turn', 'until you put it out.', '', 'Stand still by pressing [.] and', 'you\'ll try to put out the fire.'];
			}
			case 5: {
				return ['Recovering health', '', 'Take advantage of your natural recovery. Your', 'health will slowly return until your HP reaches', 'a multiple of 10 (so if your health is 74/100,', 'it\'ll go back up to 80/100, and then stop).', '', 'If that isn\'t enough, you can restore more HP by', 'resting. Press [r], and if you\'re undisturbed for', '10 turns, you\'ll regain half of your missing HP', '(and restore your magic reserves, if applicable).', '', 'You can rest only once per dungeon level, but your', 'natural recovery always works.'];
			}
			case 9: {
				return ['Healing pools', '', 'Perhaps a relative of wishing wells, healing', 'pools are a rare feature of the dungeon that', 'can fully restore your health.', '', 'To activate a healing pool, drop in an item', 'by pressing [d].'];
			}
			case 10: {
				return ['Using consumable items', '', 'Sometimes death is unavoidable.', '', 'However, consumable items can', 'get you out of some desperate', 'situations.', '', 'When all hope seems lost, be sure to', 'check your inventory.'];
			}
			default: {
				return [];
			}
		}
	};
	$Forays_Help.$boxAnimationFrame = function(height, width) {
		var box_edge_color = 5;
		var box_corner_color = 6;
		var box = [];
		box.add(new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(width - 2, 45), box_edge_color, '+', box_corner_color));
		for (var i = 0; i < height - 2; ++i) {
			box.add(new $Forays_colorstring.$ctor4('|', box_edge_color, ''.padRight(width - 2), 2, '|', box_edge_color));
		}
		box.add(new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(width - 2, 45), box_edge_color, '+', box_corner_color));
		return box;
	};
	$Forays_Help.$frameWidth = function(previous_height, previous_width) {
		return previous_width - ss.Int32.div(previous_width * 2, previous_height);
		//2 lines are removed, so the width loses 2/height to keep similar dimensions
	};
	$Forays_Help.tutorialTip = function(topic) {
		if ($Forays_Global.option(5) || $Forays_Help.displayed.get_item(topic)) {
			return;
		}
		var box_edge_color = 5;
		var box_corner_color = 6;
		var first_line_color = 6;
		var text_color = 2;
		var text = $Forays_Help.tutorialText(topic);
		var stringwidth = 27;
		// length of "[Press any key to continue]"
		for (var $t1 = 0; $t1 < text.length; $t1++) {
			var s = text[$t1];
			if (s.length > stringwidth) {
				stringwidth = s.length;
			}
		}
		stringwidth += 4;
		//2 blanks on each side
		var boxwidth = stringwidth + 2;
		var boxheight = text.length + 5;
		//for(bool done=false;!done;){
		var box = new Array(boxheight);
		//maybe i should make this a list to match the others
		box[0] = new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(stringwidth, 45), box_edge_color, '+', box_corner_color);
		box[text.length + 1] = new $Forays_colorstring.$ctor4('|', box_edge_color, ''.padRight(stringwidth), 2, '|', box_edge_color);
		box[text.length + 2] = $Forays_colorstring.op_Addition($Forays_colorstring.op_Addition(new $Forays_colorstring.$ctor2('|', box_edge_color), $Forays_Extensions.getColorString$1($Forays_Extensions.padOuter('[Press any key to continue]', stringwidth), text_color)), new $Forays_colorstring.$ctor2('|', box_edge_color));
		//PadOuter originally here
		box[text.length + 3] = $Forays_colorstring.op_Addition($Forays_colorstring.op_Addition(new $Forays_colorstring.$ctor2('|', box_edge_color), $Forays_Extensions.getColorString$1($Forays_Extensions.padOuter('[=] Stop showing tips', stringwidth), text_color)), new $Forays_colorstring.$ctor2('|', box_edge_color));
		//PadOuter originally here
		box[text.length + 4] = new $Forays_colorstring.$ctor4('+', box_corner_color, ''.padRight(stringwidth, 45), box_edge_color, '+', box_corner_color);
		var pos = 1;
		for (var $t2 = 0; $t2 < text.length; $t2++) {
			var s1 = text[$t2];
			box[pos] = $Forays_colorstring.op_Addition($Forays_colorstring.op_Addition(new $Forays_colorstring.$ctor2('|', box_edge_color), $Forays_Extensions.getColorString$1($Forays_Extensions.padOuter(s1, stringwidth), text_color)), new $Forays_colorstring.$ctor2('|', box_edge_color));
			//PadOuter originally here
			if (pos === 1) {
				box[pos] = new $Forays_colorstring();
				box[pos].strings.add(new $Forays_cstr.$ctor1('|', box_edge_color));
				box[pos].strings.add(new $Forays_cstr.$ctor1($Forays_Extensions.padOuter(s1, stringwidth), first_line_color));
				//PadOuter originally here
				box[pos].strings.add(new $Forays_cstr.$ctor1('|', box_edge_color));
			}
			++pos;
		}
		var y = ss.Int32.div($Forays_Global.screeN_H - boxheight, 2);
		var x = ss.Int32.div($Forays_Global.screeN_W - boxwidth, 2);
		var memory = $Forays_Screen.getCurrentRect(y, x, boxheight, boxwidth);
		var frames = [];
		frames.add($Forays_Help.$boxAnimationFrame(boxheight - 2, $Forays_Help.$frameWidth(boxheight, boxwidth)));
		for (var i = boxheight - 4; i > 0; i -= 2) {
			frames.add($Forays_Help.$boxAnimationFrame(i, $Forays_Help.$frameWidth($Forays_Extensions.last(Array).call(null, frames).length, $Forays_Extensions.last(Array).call(null, frames)[0].length())));
		}
		for (var i1 = frames.length - 1; i1 >= 0; --i1) {
			//since the frames are in reverse order
			var y_offset = i1 + 1;
			var x_offset = ss.Int32.div(boxwidth - frames[i1][0].length(), 2);
			$Forays_Screen.writeList(y + y_offset, x + x_offset, frames[i1]);
			$Forays_Game.game.e.lock();
			window.setTimeout(function() {
				$Forays_Game.game.e.unlock();
			}, 20);
		}
		for (var $t3 = 0; $t3 < box.length; $t3++) {
			var s2 = box[$t3];
			$Forays_Screen.writeString(y, x, s2);
			++y;
		}
		$Forays_Actor.get_player().displayStats$1(false);
		if (topic !== 7) {
			//hacky exception - don't get rid of the line that's already there.
			$Forays_Actor.get_b().displayNow();
		}
		$Forays_Game.console.cursorVisible = false;
		//Game.game.E.Lock();  Window.SetTimeout(() => Game.game.E.Unlock(), 500);
		$Forays_Global.flushInput();
		//	switch(Game.Console.ReadKey(true).KeyChar){
		//	case 'q':
		//	box_edge_color = NextColor(box_edge_color);
		//	break;
		//	case 'w':
		//	box_corner_color = NextColor(box_corner_color);
		//	break;
		//	case 'e':
		//	first_line_color = NextColor(first_line_color);
		//	break;
		//	case 'r':
		//	text_color = NextColor(text_color);
		//	break;
		//	default:
		//	done=true;
		//	break;
		//	}
		//	}
		if ($Forays_Game.console.readKey(true).keyChar === 61) {
			$Forays_Global.options[5] = true;
		}
		$Forays_Screen.writeArray(ss.Int32.div($Forays_Global.screeN_H - boxheight, 2), x, memory);
		if (topic !== 7) {
			//another exception
			$Forays_Actor.get_player().displayStats$1(true);
		}
		$Forays_Help.displayed.set_item(topic, true);
		$Forays_Game.console.cursorVisible = true;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.HelpTopic
	var $Forays_HelpTopic = function() {
	};
	$Forays_HelpTopic.prototype = { overview: 0, skills: 1, feats: 2, spells: 3, items: 4, commands: 5, advanced: 6, tips: 7 };
	Type.registerEnum(global, 'Forays.HelpTopic', $Forays_HelpTopic, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Item
	var $Forays_Item = function() {
		this.$2$itypeField = 0;
		this.$2$quantityField = 0;
		this.$2$ignoredField = false;
		this.$2$do_not_stackField = false;
		$Forays_PhysicalObject.call(this);
	};
	$Forays_Item.prototype = {
		get_itype: function() {
			return this.$2$itypeField;
		},
		set_itype: function(value) {
			this.$2$itypeField = value;
		},
		get_quantity: function() {
			return this.$2$quantityField;
		},
		set_quantity: function(value) {
			this.$2$quantityField = value;
		},
		get_ignored: function() {
			return this.$2$ignoredField;
		},
		set_ignored: function(value) {
			this.$2$ignoredField = value;
		},
		get_do_not_stack: function() {
			return this.$2$do_not_stackField;
		},
		set_do_not_stack: function(value) {
			this.$2$do_not_stackField = value;
		},
		name: function() {
			var result;
			var position;
			var qty = this.get_quantity().toString();
			switch (this.get_quantity()) {
				case 0: {
					return 'a buggy item';
				}
				case 1: {
					result = this.get_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = result.substring(0, position) + result.substring(position + 1);
					}
					return result;
				}
				default: {
					result = this.get_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = qty + ' ' + result.substring(0, position) + 's' + result.substring(position + 1);
					}
					return result;
				}
			}
		},
		aName: function() {
			var result;
			var position;
			var qty = this.get_quantity().toString();
			switch (this.get_quantity()) {
				case 0: {
					return 'a buggy item';
				}
				case 1: {
					result = this.get_a_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = result.substring(0, position) + result.substring(position + 1);
					}
					return result;
				}
				default: {
					result = this.get_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = qty + ' ' + result.substring(0, position) + 's' + result.substring(position + 1);
					}
					return result;
				}
			}
		},
		theName: function() {
			var result;
			var position;
			var qty = this.get_quantity().toString();
			switch (this.get_quantity()) {
				case 0: {
					return 'the buggy item';
				}
				case 1: {
					result = this.get_the_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = result.substring(0, position) + result.substring(position + 1);
					}
					return result;
				}
				default: {
					result = this.get_name();
					position = result.indexOf('~');
					if (position !== -1) {
						result = qty + ' ' + result.substring(0, position) + 's' + result.substring(position + 1);
					}
					return result;
				}
			}
		},
		use: function(user) {
			return this.use$1(user, null);
		},
		use$1: function(user, line) {
			var used = true;
			switch (this.get_itype()) {
				case 0: {
					user.takeDamage$1(5, 2, 50, null);
					$Forays_Item.get_b().add$2('A blue glow surrounds ' + user.get_the_name() + '. ', [user]);
					break;
				}
				case 2: {
					if (!user.hasAttr(67)) {
						if (user.hasAttr(29)) {
							user.attrs.set_item(29, 0);
							$Forays_Item.get_b().add$1(user.youFeel() + ' relieved. ', user);
						}
						user.gainAttr$4(67, 5100, user.youAre() + ' no longer immune to toxins. ', [user]);
					}
					else {
						$Forays_Item.get_b().add$1('Nothing happens. ', user);
					}
					break;
				}
				case 1: {
					user.attrs.set_item(24, user.attrs.get_item(24) + 1);
					if (user.get_name() === 'you') {
						$Forays_Item.get_b().add$1('Your blood tingles. ', user);
					}
					else {
						$Forays_Item.get_b().add$1(user.get_the_name() + ' looks energized. ', user);
					}
					var duration = 60;
					//was Roll(10)+20
					$Forays_Item.get_q().add(new $Forays_Event.$ctor4(user, duration * 100, 24));
					break;
				}
				case 3: {
					user.resetSpells();
					if (user.get_name() === 'you') {
						$Forays_Item.get_b().add('Your mind clears. ');
					}
					else {
						$Forays_Item.get_b().add$1(user.get_the_name() + ' seems focused. ', user);
					}
					break;
				}
				case 4: {
					if (user.tile().isLit()) {
						$Forays_Item.get_b().add('You would feel at home in the shadows. ');
					}
					else {
						$Forays_Item.get_b().add('You fade away in the darkness. ');
					}
					user.gainAttrRefreshDuration$1(13, ($Forays_Global.roll(41) + 29) * 100, 'You are no longer cloaked. ', [user]);
					break;
				}
				case 5: {
					for (var i = 0; i < 9999; ++i) {
						var rr = $Forays_Global.roll$1(1, 17) - 9;
						var rc = $Forays_Global.roll$1(1, 17) - 9;
						if (Math.abs(rr) + Math.abs(rc) >= 6) {
							rr += user.get_row();
							rc += user.get_col();
							if ($Forays_PhysicalObject.get_m().boundsCheck(rr, rc) && $Forays_PhysicalObject.get_m().tile.get_item(rr, rc).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(rr, rc))) {
								$Forays_Item.get_b().add$2(user.you('step') + ' through a rip in reality. ', [$Forays_PhysicalObject.get_m().tile.get_item(user.get_row(), user.get_col()), $Forays_PhysicalObject.get_m().tile.get_item(rr, rc)]);
								user.animateStorm(2, 3, 4, '*', 14);
								user.move(rr, rc);
								$Forays_PhysicalObject.get_m().draw();
								user.animateStorm(2, 3, 4, '*', 14);
								break;
							}
						}
					}
					break;
				}
				case 6: {
					for (var i1 = 0; i1 < 9999; ++i1) {
						var rr1 = $Forays_Global.roll$1(1, 20);
						var rc1 = $Forays_Global.roll$1(1, 64);
						if (Math.abs(rr1 - user.get_row()) >= 10 || Math.abs(rc1 - user.get_col()) >= 10 || Math.abs(rr1 - user.get_row()) >= 7 && Math.abs(rc1 - user.get_col()) >= 7) {
							if ($Forays_PhysicalObject.get_m().boundsCheck(rr1, rc1) && $Forays_PhysicalObject.get_m().tile.get_item(rr1, rc1).get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(rr1, rc1))) {
								$Forays_Item.get_b().add$2(user.you('jump') + ' through a rift in reality. ', [$Forays_PhysicalObject.get_m().tile.get_item(user.get_row(), user.get_col()), $Forays_PhysicalObject.get_m().tile.get_item(rr1, rc1)]);
								user.animateStorm(3, 3, 10, '*', 4);
								user.move(rr1, rc1);
								$Forays_PhysicalObject.get_m().draw();
								user.animateStorm(3, 3, 10, '*', 4);
								break;
							}
						}
					}
					break;
				}
				case 7: {
					var i2 = user.directionOfOnlyUnblocked$1(0, true);
					if (i2 === 0) {
						$Forays_Item.get_b().add('This item requires an adjacent wall. ');
						used = false;
						break;
					}
					else {
						i2 = user.getDirection$2(true, false);
						var t = user.tileInDirection(i2);
						if (ss.isValue(t)) {
							if (t.get_ttype() === 0) {
								$Forays_Game.console.cursorVisible = false;
								var ch = new $Forays_colorchar.$ctor2(8, '!');
								switch (user.directionOf(t)) {
									case 8:
									case 2: {
										ch.c = '|';
										break;
									}
									case 4:
									case 6: {
										ch.c = '-';
										break;
									}
								}
								var tiles = [];
								var memlist = [];
								while (!t.get_passable()) {
									if (t.get_row() === 0 || t.get_row() === 21 || t.get_col() === 0 || t.get_col() === 65) {
										break;
									}
									tiles.add(t);
									memlist.add($Forays_Screen.mapChar(t.get_row(), t.get_col()));
									$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), ch);
									$Forays_Game.game.e.lock();
									window.setTimeout(function() {
										$Forays_Game.game.e.unlock();
									}, 35);
									t = t.tileInDirection(i2);
								}
								if (t.get_passable() && ss.isNullOrUndefined($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
									if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(user.get_row(), user.get_col()).get_inv())) {
										$Forays_Screen.writeMapChar(user.get_row(), user.get_col(), new $Forays_colorchar.$ctor2(user.tile().get_inv().get_color(), user.tile().get_inv().get_symbol()));
									}
									else {
										$Forays_Screen.writeMapChar(user.get_row(), user.get_col(), new $Forays_colorchar.$ctor2(user.tile().get_color(), user.tile().get_symbol()));
									}
									$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), new $Forays_colorchar.$ctor2(user.get_color(), user.get_symbol()));
									var j = 0;
									for (var $t1 = 0; $t1 < tiles.length; $t1++) {
										var tile = tiles[$t1];
										$Forays_Screen.writeMapChar(tile.get_row(), tile.get_col(), memlist[j++]);
										$Forays_Game.game.e.lock();
										window.setTimeout(function() {
											$Forays_Game.game.e.unlock();
										}, 35);
									}
									$Forays_Item.get_b().add$3(user.you('travel') + ' through the passage. ', user, t);
									user.move(t.get_row(), t.get_col());
								}
								else {
									var j1 = 0;
									for (var $t2 = 0; $t2 < tiles.length; $t2++) {
										var tile1 = tiles[$t2];
										$Forays_Screen.writeMapChar(tile1.get_row(), tile1.get_col(), memlist[j1++]);
										$Forays_Game.game.e.lock();
										window.setTimeout(function() {
											$Forays_Game.game.e.unlock();
										}, 35);
									}
									$Forays_Item.get_b().add$1('The passage is blocked. ', user);
								}
							}
							else {
								$Forays_Item.get_b().add('This item requires an adjacent wall. ');
								used = false;
								break;
							}
						}
						else {
							used = false;
						}
					}
					break;
				}
				case 8: {
					$Forays_Item.get_b().add('Time stops for a moment. ');
					var $t3 = $Forays_Item.get_q();
					$t3.set_turn($t3.get_turn() - 200);
					break;
				}
				case 9: {
					//user.attrs[AttrType.DETECTING_MONSTERS]++;
					$Forays_Item.get_b().add$1('The scroll reveals ' + user.your() + ' foes. ', user);
					var duration1 = $Forays_Global.roll(20) + 30;
					//Q.Add(new Event(user,duration*100,AttrType.DETECTING_MONSTERS,user.Your() + " foes are no longer revealed. ",user));
					user.gainAttrRefreshDuration$1(40, duration1 * 100, user.your() + ' foes are no longer revealed. ', [user]);
					break;
				}
				case 10: {
					$Forays_Item.get_b().add('The scroll reveals the layout of this level. ');
					var hiddencheck = null;
					var $t4 = $Forays_Item.get_q().list;
					for (var $t5 = 0; $t5 < $t4.length; $t5++) {
						var e = $t4[$t5];
						if (!e.get_dead() && e.get_evtype() === 3) {
							hiddencheck = e;
							break;
						}
					}
					var $t6 = $Forays_PhysicalObject.get_m().allTiles();
					for (var $t7 = 0; $t7 < $t6.length; $t7++) {
						var t1 = $t6[$t7];
						if (t1.get_ttype() !== 1) {
							var good = false;
							var $t8 = t1.tilesAtDistance(1);
							for (var $t9 = 0; $t9 < $t8.length; $t9++) {
								var neighbor = $t8[$t9];
								if (neighbor.get_ttype() !== 0) {
									good = true;
								}
							}
							if (good) {
								t1.set_seen(true);
								if (t1.isTrapOrVent() || t1.is$1(20)) {
									if (ss.isValue(hiddencheck)) {
										hiddencheck.area.remove(t1);
									}
								}
								if (t1.isTrapOrVent()) {
									t1.set_name($Forays_Tile.prototype$1(t1.get_ttype()).get_name());
									t1.set_a_name($Forays_Tile.prototype$1(t1.get_ttype()).get_a_name());
									t1.set_the_name($Forays_Tile.prototype$1(t1.get_ttype()).get_the_name());
									t1.set_symbol($Forays_Tile.prototype$1(t1.get_ttype()).get_symbol());
									t1.set_color($Forays_Tile.prototype$1(t1.get_ttype()).get_color());
								}
								if (t1.is$1(20)) {
									t1.toggle(null);
								}
							}
						}
					}
					break;
				}
				case 11: {
					if (!$Forays_PhysicalObject.get_m().get_wiz_lite()) {
						$Forays_PhysicalObject.get_m().set_wiz_lite(true);
						$Forays_PhysicalObject.get_m().set_wiz_dark(false);
						$Forays_Item.get_b().add('The air itself seems to shine. ');
					}
					else {
						$Forays_Item.get_b().add('Nothing happens. ');
					}
					break;
				}
				case 12: {
					if (!$Forays_PhysicalObject.get_m().get_wiz_dark()) {
						$Forays_PhysicalObject.get_m().set_wiz_dark(true);
						$Forays_PhysicalObject.get_m().set_wiz_lite(false);
						$Forays_Item.get_b().add('The air itself grows dark. ');
					}
					else {
						$Forays_Item.get_b().add('Nothing happens. ');
					}
					break;
				}
				case 13: {
					if (ss.isNullOrUndefined(line)) {
						line = user.getTarget$4(12, 1);
					}
					if (ss.isValue(line)) {
						var t2 = $Forays_Extensions.last($Forays_Tile).call(null, line);
						var prev = $Forays_Extensions.lastBeforeSolidTile(line);
						var first = user.firstActorInLine$1(line);
						//todo - consider allowing thrown items to pass over actors, because they fly in an arc
						$Forays_Item.get_b().add$1(user.you('throw') + ' the prismatic orb. ', user);
						if (ss.isValue(first)) {
							t2 = first.tile();
							$Forays_Item.get_b().add$1('It shatters on ' + first.get_the_name() + '! ', first);
						}
						else {
							$Forays_Item.get_b().add$1('It shatters on ' + t2.get_the_name() + '! ', t2);
						}
						user.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 19);
						var dmg = [];
						dmg.add(1);
						dmg.add(2);
						dmg.add(3);
						while (dmg.length > 0) {
							var damtype = $Forays_Extensions.random($Forays_DamageType).call(null, dmg);
							var ch1 = new $Forays_colorchar.$ctor2(0, '*');
							switch (damtype) {
								case 1: {
									ch1.color = 16;
									break;
								}
								case 2: {
									ch1.color = 17;
									break;
								}
								case 3: {
									ch1.color = 18;
									break;
								}
							}
							$Forays_Item.get_b().displayNow();
							$Forays_Screen.animateExplosion$2(t2, 1, ch1, 100);
							if (t2.get_passable()) {
								var $t10 = t2.tilesWithinDistance(1);
								for (var $t11 = 0; $t11 < $t10.length; $t11++) {
									var t21 = $t10[$t11];
									if (ss.isValue(t21.actor())) {
										t21.actor().takeDamage$2(damtype, 1, $Forays_Global.roll$1(2, 6), user, 'a prismatic orb');
									}
									if (damtype === 1 && t21.is(1)) {
										t21.features.remove(1);
										$Forays_Item.get_b().add$1('The troll corpse burns to ashes! ', t21);
									}
									if (damtype === 1 && t21.is(2)) {
										t21.features.remove(2);
										$Forays_Item.get_b().add$1('The troll seer corpse burns to ashes! ', t21);
									}
								}
							}
							else {
								var $t12 = t2.tilesWithinDistance(1);
								for (var $t13 = 0; $t13 < $t12.length; $t13++) {
									var t22 = $t12[$t13];
									if (ss.isValue(prev) && prev.hasBresenhamLine(t22.get_row(), t22.get_col())) {
										if (ss.isValue(t22.actor())) {
											t22.actor().takeDamage$2(damtype, 1, $Forays_Global.roll$1(2, 6), user, 'a prismatic orb');
										}
										if (damtype === 1 && t22.is(1)) {
											t22.features.remove(1);
											$Forays_Item.get_b().add$1('The troll corpse burns to ashes! ', t22);
										}
										if (damtype === 1 && t22.is(2)) {
											t22.features.remove(2);
											$Forays_Item.get_b().add$1('The troll seer corpse burns to ashes! ', t22);
										}
									}
								}
							}
							dmg.remove(damtype);
						}
					}
					else {
						used = false;
					}
					break;
				}
				case 14: {
					if (ss.isNullOrUndefined(line)) {
						line = user.getTarget$4(12, 3);
					}
					if (ss.isValue(line)) {
						var t3 = $Forays_Extensions.last($Forays_Tile).call(null, line);
						var prev1 = $Forays_Extensions.lastBeforeSolidTile(line);
						var first1 = user.firstActorInLine$1(line);
						$Forays_Item.get_b().add$1(user.you('throw') + ' the freezing orb. ', user);
						if (ss.isValue(first1)) {
							t3 = first1.tile();
							$Forays_Item.get_b().add$1('It shatters on ' + first1.get_the_name() + '! ', first1);
						}
						else {
							$Forays_Item.get_b().add$1('It shatters on ' + t3.get_the_name() + '! ', t3);
						}
						user.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 17);
						user.animateExplosion$1(t3, 3, '*', 8);
						var targets = [];
						if (t3.get_passable()) {
							var $t14 = t3.actorsWithinDistance(3);
							for (var $t15 = 0; $t15 < $t14.length; $t15++) {
								var ac = $t14[$t15];
								if (t3.hasLOE(ac)) {
									targets.add(ac);
								}
							}
						}
						else {
							var $t16 = t3.actorsWithinDistance(3);
							for (var $t17 = 0; $t17 < $t16.length; $t17++) {
								var ac1 = $t16[$t17];
								if (ss.isValue(prev1) && prev1.hasLOE(ac1)) {
									targets.add(ac1);
								}
							}
						}
						while (targets.length > 0) {
							var ac2 = $Forays_Extensions.removeRandom($Forays_Actor).call(null, targets);
							$Forays_Item.get_b().add$1(ac2.youAre() + ' encased in ice. ', ac2);
							ac2.attrs.set_item(30, 25);
						}
					}
					else {
						used = false;
					}
					break;
				}
				case 15: {
					if (ss.isNullOrUndefined(line)) {
						line = user.getTarget$4(12, -1);
					}
					if (ss.isValue(line)) {
						var t4 = $Forays_Extensions.last($Forays_Tile).call(null, line);
						var prev2 = $Forays_Extensions.lastBeforeSolidTile(line);
						var first2 = user.firstActorInLine$1(line);
						$Forays_Item.get_b().add$1(user.you('throw') + ' the orb of quickfire. ', user);
						if (ss.isValue(first2)) {
							t4 = first2.tile();
							$Forays_Item.get_b().add$1('It shatters on ' + first2.get_the_name() + '! ', first2);
						}
						else {
							$Forays_Item.get_b().add$1('It shatters on ' + t4.get_the_name() + '! ', t4);
						}
						user.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 16);
						if (t4.get_passable()) {
							t4.features.add(3);
							var $t19 = $Forays_Item.get_q();
							var $t18 = [];
							$t18.add(t4);
							$t19.add(new $Forays_Event.$ctorf(t4, $t18, 100, 19, 109, 3, ''));
						}
						else {
							prev2.features.add(3);
							var $t21 = $Forays_Item.get_q();
							var $t20 = [];
							$t20.add(prev2);
							$t21.add(new $Forays_Event.$ctorf(prev2, $t20, 100, 19, 109, 3, ''));
						}
					}
					else {
						used = false;
					}
					break;
				}
				case 16: {
					if (ss.isNullOrUndefined(line)) {
						line = user.getTarget$4(12, -3);
					}
					if (ss.isValue(line)) {
						var t5 = $Forays_Extensions.last($Forays_Tile).call(null, line);
						var prev3 = $Forays_Extensions.lastBeforeSolidTile(line);
						var first3 = user.firstActorInLine$1(line);
						$Forays_Item.get_b().add$1(user.you('throw') + ' the orb of fog. ', user);
						if (ss.isValue(first3)) {
							t5 = first3.tile();
							$Forays_Item.get_b().add$1('It shatters on ' + first3.get_the_name() + '! ', first3);
						}
						else {
							$Forays_Item.get_b().add$1('It shatters on ' + t5.get_the_name() + '! ', t5);
						}
						user.animateProjectile$2($Forays_Extensions.toFirstObstruction(line), '*', 2);
						var area = [];
						var cells = [];
						if (t5.get_passable()) {
							var $t22 = t5.tilesWithinDistance(3);
							for (var $t23 = 0; $t23 < $t22.length; $t23++) {
								var tile2 = $t22[$t23];
								if (tile2.get_passable() && t5.hasLOE(tile2)) {
									tile2.addOpaqueFeature(5);
									area.add(tile2);
									cells.add(tile2.p);
								}
							}
						}
						else {
							var $t24 = t5.tilesWithinDistance(3);
							for (var $t25 = 0; $t25 < $t24.length; $t25++) {
								var tile3 = $t24[$t25];
								if (ss.isValue(prev3) && tile3.get_passable() && prev3.hasLOE(tile3)) {
									tile3.addOpaqueFeature(5);
									area.add(tile3);
									cells.add(tile3.p);
								}
							}
						}
						$Forays_Screen.animateMapCells(cells, new $Forays_colorchar.$ctor4('*', 2));
						$Forays_Item.get_q().add(new $Forays_Event.$ctor6(area, 400, 14));
					}
					else {
						used = false;
					}
					break;
				}
				case 17: {
					user.takeDamage$1(5, 2, 1, null);
					if (user.hasAttr(17)) {
						user.recover_time = $Forays_Item.get_q().get_turn() + 200;
					}
					else {
						user.recover_time = $Forays_Item.get_q().get_turn() + 500;
					}
					if (user.get_name() === 'you') {
						$Forays_Item.get_b().add('You apply a bandage. ');
					}
					else {
						$Forays_Item.get_b().add$1(user.get_the_name() + ' applies a bandage. ', user);
					}
					break;
				}
				default: {
					used = false;
					break;
				}
			}
			if (used) {
				if (this.get_quantity() > 1) {
					this.set_quantity(this.get_quantity() - 1);
				}
				else if (ss.isValue(user)) {
					user.get_inv().remove(this);
				}
			}
			return used;
		}
	};
	$Forays_Item.$ctor2 = function(type_, name_, symbol_, color_) {
		this.$2$itypeField = 0;
		this.$2$quantityField = 0;
		this.$2$ignoredField = false;
		this.$2$do_not_stackField = false;
		$Forays_PhysicalObject.call(this);
		this.set_itype(type_);
		this.set_quantity(1);
		this.set_ignored(false);
		this.set_do_not_stack(false);
		this.set_name(name_);
		this.set_the_name('the ' + this.get_name());
		switch (this.get_name().charCodeAt(0)) {
			case 97:
			case 101:
			case 105:
			case 111:
			case 117:
			case 65:
			case 69:
			case 73:
			case 79:
			case 85: {
				this.set_a_name('an ' + this.get_name());
				break;
			}
			default: {
				this.set_a_name('a ' + this.get_name());
				break;
			}
		}
		this.set_symbol(symbol_);
		this.set_color(color_);
		this.set_row(-1);
		this.set_col(-1);
		this.set_light_radius(0);
	};
	$Forays_Item.$ctor1 = function(i, r, c) {
		this.$2$itypeField = 0;
		this.$2$quantityField = 0;
		this.$2$ignoredField = false;
		this.$2$do_not_stackField = false;
		$Forays_PhysicalObject.call(this);
		this.set_itype(i.get_itype());
		this.set_quantity(1);
		this.set_ignored(false);
		this.set_do_not_stack(false);
		this.set_name(i.get_name());
		this.set_a_name(i.get_a_name());
		this.set_the_name(i.get_the_name());
		this.set_symbol(i.get_symbol());
		this.set_color(i.get_color());
		this.set_row(r);
		this.set_col(c);
		this.set_light_radius(i.get_light_radius());
	};
	$Forays_Item.$ctor2.prototype = $Forays_Item.$ctor1.prototype = $Forays_Item.prototype;
	$Forays_Item.prototype$1 = function(type) {
		return $Forays_Item.$proto[type];
	};
	$Forays_Item.get_q = function() {
		return $Forays_Item.$2$QField;
	};
	$Forays_Item.set_q = function(value) {
		$Forays_Item.$2$QField = value;
	};
	$Forays_Item.get_b = function() {
		return $Forays_Item.$2$BField;
	};
	$Forays_Item.set_b = function(value) {
		$Forays_Item.$2$BField = value;
	};
	$Forays_Item.get_player = function() {
		return $Forays_Item.$2$playerField;
	};
	$Forays_Item.set_player = function(value) {
		$Forays_Item.$2$playerField = value;
	};
	$Forays_Item.$define = function(type_, name_, symbol_, color_) {
		$Forays_Item.$proto[type_] = new $Forays_Item.$ctor2(type_, name_, symbol_, color_);
	};
	$Forays_Item.create$1 = function(type, r, c) {
		var i = null;
		if ($Forays_Global.boundsCheck(r, c)) {
			if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv())) {
				i = new $Forays_Item.$ctor1($Forays_Item.$proto[type], r, c);
				if (i.get_light_radius() > 0) {
					i.updateRadius(0, i.get_light_radius());
				}
				$Forays_PhysicalObject.get_m().tile.get_item(r, c).set_inv(i);
			}
			else if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv().get_itype() === type) {
				var $t1 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv();
				$t1.set_quantity($t1.get_quantity() + 1);
				return $Forays_PhysicalObject.get_m().tile.get_item(r, c).get_inv();
			}
		}
		else {
			i = new $Forays_Item.$ctor1($Forays_Item.$proto[type], r, c);
		}
		return i;
	};
	$Forays_Item.create = function(type, a) {
		var i = null;
		if (a.inventoryCount() < $Forays_Global.maX_INVENTORY_SIZE) {
			var $t1 = a.get_inv();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var held = $t1[$t2];
				if (held.get_itype() === type) {
					held.set_quantity(held.get_quantity() + 1);
					return held;
				}
			}
			i = new $Forays_Item.$ctor1($Forays_Item.$proto[type], -1, -1);
			a.get_inv().add(i);
		}
		else {
			i = $Forays_Item.create$1(type, a.get_row(), a.get_col());
		}
		return i;
	};
	$Forays_Item.rarity = function(type) {
		switch (type) {
			case 2:
			case 3:
			case 6:
			case 11:
			case 12:
			case 13:
			case 0:
			case 1:
			case 4:
			case 16: {
				return 2;
			}
			default: {
				return 1;
			}
		}
	};
	$Forays_Item.randomItem = function() {
		var list = [];
		var $t1 = $Forays_Item.getConsumableTypes();
		for (var $t2 = 0; $t2 < $t1.length; $t2++) {
			var item = $t1[$t2];
			if ($Forays_Item.rarity(item) === 1) {
				list.add(item);
			}
			else if ($Forays_Global.roll$1(1, $Forays_Item.rarity(item)) === $Forays_Item.rarity(item)) {
				list.add(item);
			}
		}
		return $Forays_Extensions.random($Forays_ConsumableType).call(null, list);
	};
	$Forays_Item.getConsumableTypes = function() {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.LevelType
	var $Forays_LevelType = function() {
	};
	$Forays_LevelType.prototype = { standard: 0, cave: 1, ruined: 2, hive: 3, mine: 4, fortress: 5, extravagant: 6 };
	Type.registerEnum(global, 'Forays.LevelType', $Forays_LevelType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.MagicItem
	var $Forays_MagicItem = function() {
	};
	$Forays_MagicItem.statsName = function(type) {
		var cs = new $Forays_cstr.$ctor3('', 2, 0);
		cs.bgcolor = 0;
		cs.color = 11;
		switch (type) {
			case 2: {
				cs.s = 'Ring (prot)';
				break;
			}
			case 1: {
				cs.s = 'Ring (res)';
				break;
			}
			case 0: {
				cs.s = 'Pendant';
				break;
			}
			case 3: {
				cs.s = 'Cloak';
				break;
			}
			default: {
				cs.s = 'No item';
				break;
			}
		}
		return cs;
	};
	$Forays_MagicItem.name$1 = function(type) {
		switch (type) {
			case 0: {
				return 'pendant of life';
			}
			case 2: {
				return 'ring of protection';
			}
			case 1: {
				return 'ring of resistance';
			}
			case 3: {
				return 'cloak of disappearance';
			}
			default: {
				return 'no item';
			}
		}
	};
	$Forays_MagicItem.description = function(type) {
		switch (type) {
			case 0: {
				return ['Pendant of life -- Prevents a lethal attack from', 'finishing you, but only works once.'];
			}
			case 2: {
				return ['Ring of protection -- Grants a small bonus to', 'defense.'];
			}
			case 1: {
				return ['Ring of resistance -- Grants resistance to cold,', 'fire, and electricity.'];
			}
			case 3: {
				return ['Cloak of disappearance -- When your health falls,', 'gives you a chance to escape to safety.'];
			}
			default: {
				return ['no', 'item'];
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.MagicItemType
	var $Forays_MagicItemType = function() {
	};
	$Forays_MagicItemType.prototype = { pendanT_OF_LIFE: 0, rinG_OF_RESISTANCE: 1, rinG_OF_PROTECTION: 2, cloaK_OF_DISAPPEARANCE: 3, nuM_MAGIC_ITEMS: 4, nO_MAGIC_ITEM: 5 };
	Type.registerEnum(global, 'Forays.MagicItemType', $Forays_MagicItemType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Map
	var $Forays_Map = function(g) {
		this.tile = new (Type.makeGenericType($Forays_Map$PosArray$1, [$Forays_Tile]))($Forays_Map.$ROWS, $Forays_Map.$COLS);
		this.actor = new (Type.makeGenericType($Forays_Map$PosArray$1, [$Forays_Actor]))($Forays_Map.$ROWS, $Forays_Map.$COLS);
		this.$1$current_levelField = 0;
		this.level_types = null;
		this.$internal_wiz_lite = false;
		this.$1$wiz_darkField = false;
		this.$generated_this_level = null;
		this.$1$danger_sensedField = null;
		//tile = new Tile[ROWS,COLS];
		//actor = new Actor[ROWS,COLS];
		this.set_current_level(0);
		$Forays_Map.set_player(g.player);
		$Forays_Map.set_q(g.q);
		$Forays_Map.set_b(g.b);
	};
	$Forays_Map.prototype = {
		get_current_level: function() {
			return this.$1$current_levelField;
		},
		set_current_level: function(value) {
			this.$1$current_levelField = value;
		},
		get_wiz_lite: function() {
			return this.$internal_wiz_lite;
		},
		set_wiz_lite: function(value) {
			this.$internal_wiz_lite = value;
			if (value === true) {
				var $t1 = this.allTiles();
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (t.is(8)) {
						$Forays_Map.get_q().add(new $Forays_Event.$ctor5(t, 200, 9));
						$Forays_Map.get_b().add$1('The blast fungus starts to smolder in the light. ', t);
						t.features.remove(8);
						t.features.add(9);
					}
				}
			}
		},
		get_wiz_dark: function() {
			return this.$1$wiz_darkField;
		},
		set_wiz_dark: function(value) {
			this.$1$wiz_darkField = value;
		},
		get_$danger_sensed: function() {
			return this.$1$danger_sensedField;
		},
		set_$danger_sensed: function(value) {
			this.$1$danger_sensedField = value;
		},
		boundsCheck: function(r, c) {
			if (r >= 0 && r < $Forays_Map.$ROWS && c >= 0 && c < $Forays_Map.$COLS) {
				return true;
			}
			return false;
		},
		allTiles: function() {
			//possible speed issues? is there anywhere that I should be using 'alltiles' directly?
			var result = [];
			//should i have one method that allows modification and one that doesn't?
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					result.add(this.tile.get_item(i, j));
				}
			}
			return result;
		},
		allActors: function() {
			var result = [];
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					if (ss.isValue(this.actor.get_item(i, j))) {
						result.add(this.actor.get_item(i, j));
					}
				}
			}
			return result;
		},
		allPositions: function() {
			return $Forays_Map.$allpositions;
		},
		chooseNextLevelType: function(current) {
			var types = [];
			var $t1 = this.getLevelTypes();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var l = $t1[$t2];
				if (l !== current) {
					types.add(l);
				}
			}
			return $Forays_Extensions.random($Forays_LevelType).call(null, types);
		},
		getLevelTypes: function() {
			return [0, 1, 2, 3, 4, 5, 6];
		},
		generateLevelTypes: function() {
			var $t1 = [];
			$t1.add(0);
			$t1.add(0);
			this.level_types = $t1;
			var current = 0;
			while (this.level_types.length < 20) {
				var num = $Forays_Global.roll$1(2, 2) - 1;
				current = this.chooseNextLevelType(current);
				for (var i = 0; i < num; ++i) {
					if (this.level_types.length < 20) {
						this.level_types.add(current);
					}
				}
			}
		},
		updateDangerValues: function() {
			this.set_$danger_sensed(Array.multidim(Boolean.getDefaultValue(), $Forays_Map.$ROWS, $Forays_Map.$COLS));
			var $t1 = this.allActors();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var a = $t1[$t2];
				if (!ss.referenceEquals(a, $Forays_Map.get_player())) {
					var $t3 = this.allTiles();
					for (var $t4 = 0; $t4 < $t3.length; $t4++) {
						var t = $t3[$t4];
						if (this.get_$danger_sensed().get(t.get_row(), t.get_col()) === false && t.get_passable() && !t.get_opaque()) {
							if (a.canSee(t)) {
								var multiplier = (a.hasAttr(7) ? 5 : 10);
								var value = $Forays_Map.get_player().stealth$1(t.get_row(), t.get_col()) * a.distanceFrom(t) * multiplier - 5 * a.player_visibility_duration;
								if (value < 100 || a.player_visibility_duration < 0) {
									this.get_$danger_sensed().set(t.get_row(), t.get_col(), true);
								}
							}
						}
					}
				}
			}
		},
		initLevel: function() {
			//creates an empty level surrounded by walls. used for testing purposes.
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					if (i === 0 || j === 0 || i === 21 || j === 65) {
						this.tile.set_item(i, j, $Forays_Tile.create(0, i, j));
					}
					else {
						this.tile.set_item(i, j, $Forays_Tile.create(1, i, j));
					}
					//alltiles.Add(tile[i,j]);
				}
			}
		},
		draw: function() {
			if ($Forays_Screen.mapChar(0, 0).c === '-') {
				//kinda hacky. there won't be an open door in the corner, so this looks for
				this.redrawWithStrings();
				//evidence of Select being called (& therefore, the map needing to be redrawn entirely)
			}
			else {
				$Forays_Game.console.cursorVisible = false;
				if ($Forays_Map.get_player().hasAttr(31) || $Forays_Map.get_player().hasAttr(32)) {
					$Forays_Screen.drawMapBorder(new $Forays_colorchar.$ctor2(16, '&'));
					for (var i = 1; i < 21; ++i) {
						for (var j = 1; j < 65; ++j) {
							$Forays_Screen.writeMapChar(i, j, this.visibleColorChar(i, j));
						}
					}
				}
				else {
					for (var i1 = 0; i1 < $Forays_Map.$ROWS; ++i1) {
						//if(ch.c == '#'){ ch.c = Encoding.GetEncoding(437).GetChars(new byte[] {177})[0]; }
						for (var j1 = 0; j1 < $Forays_Map.$COLS; ++j1) {
							//^--top secret, mostly because it doesn't work well - 
							$Forays_Screen.writeMapChar(i1, j1, this.visibleColorChar(i1, j1));
							//redrawing leaves gaps for some reason.
						}
					}
				}
				$Forays_Screen.resetColors();
			}
		},
		redrawWithStrings: function() {
			$Forays_Game.console.cursorVisible = false;
			var s = new $Forays_cstr.$ctor3('', 0, 0);
			//s.s = "";
			//s.bgcolor = Color.Black;
			//s.color = Color.Black;
			var r = 0;
			var c = 0;
			if ($Forays_Map.get_player().hasAttr(31) || $Forays_Map.get_player().hasAttr(32)) {
				$Forays_Screen.drawMapBorder(new $Forays_colorchar.$ctor2(16, '&'));
				for (var i = 1; i < 21; ++i) {
					s.s = '';
					r = i;
					c = 1;
					for (var j = 1; j < 65; ++j) {
						var ch = this.visibleColorChar(i, j);
						if ($Forays_Screen.resolveColor(ch.color) !== s.color) {
							if (s.s.length > 0) {
								$Forays_Screen.writeMapString$1(r, c, s);
								s.s = '';
								s.s += ch.c;
								s.color = ch.color;
								r = i;
								c = j;
							}
							else {
								s.s += ch.c;
								s.color = ch.color;
							}
						}
						else {
							s.s += ch.c;
						}
					}
					$Forays_Screen.writeMapString$1(r, c, s);
				}
			}
			else {
				for (var i1 = 0; i1 < $Forays_Map.$ROWS; ++i1) {
					s.s = '';
					r = i1;
					c = 0;
					for (var j1 = 0; j1 < $Forays_Map.$COLS; ++j1) {
						var ch1 = this.visibleColorChar(i1, j1);
						if ($Forays_Screen.resolveColor(ch1.color) !== s.color) {
							if (s.s.length > 0) {
								$Forays_Screen.writeMapString$1(r, c, s);
								s.s = '';
								s.s += ch1.c;
								s.color = ch1.color;
								r = i1;
								c = j1;
							}
							else {
								s.s += ch1.c;
								s.color = ch1.color;
							}
						}
						else {
							s.s += ch1.c;
						}
					}
					$Forays_Screen.writeMapString$1(r, c, s);
				}
			}
			$Forays_Screen.resetColors();
		},
		visibleColorChar: function(r, c) {
			var ch = new $Forays_colorchar.$ctor4(' ', 0);
			ch.bgcolor = 0;
			if ($Forays_Map.get_player().canSee$1(r, c)) {
				this.tile.get_item(r, c).set_seen(true);
				if (ss.isValue(this.actor.get_item(r, c)) && $Forays_Map.get_player().canSee(this.actor.get_item(r, c))) {
					ch.c = this.actor.get_item(r, c).get_symbol();
					ch.color = this.actor.get_item(r, c).get_color();
					if (ss.referenceEquals(this.actor.get_item(r, c), $Forays_Map.get_player()) && $Forays_Map.get_player().hasAttr(13) && !$Forays_Map.get_player().tile().isLit()) {
						ch.color = 12;
					}
					if (ss.referenceEquals(this.actor.get_item(r, c), $Forays_Map.get_player()) && $Forays_Map.get_player().hasFeat(19) && ss.isValue(this.get_$danger_sensed()) && this.get_$danger_sensed().get(r, c) && $Forays_Map.get_player().lightRadius() === 0 && !this.get_wiz_lite()) {
						ch.color = 3;
					}
				}
				else if (ss.isValue(this.tile.get_item(r, c).get_inv())) {
					ch.c = this.tile.get_item(r, c).get_inv().get_symbol();
					ch.color = this.tile.get_item(r, c).get_inv().get_color();
				}
				else if (this.tile.get_item(r, c).features.length > 0) {
					ch.c = this.tile.get_item(r, c).featureSymbol();
					ch.color = this.tile.get_item(r, c).featureColor();
				}
				else {
					ch.c = this.tile.get_item(r, c).get_symbol();
					ch.color = this.tile.get_item(r, c).get_color();
					if (ch.c === '.' && ch.color === 1 || ch.c === '#' && ch.color === 2) {
						if (this.tile.get_item(r, c).isLit()) {
							ch.color = 6;
						}
						else {
							ch.color = 15;
						}
					}
					if ($Forays_Map.get_player().hasFeat(19) && ss.isValue(this.get_$danger_sensed()) && this.get_$danger_sensed().get(r, c) && $Forays_Map.get_player().lightRadius() === 0 && !this.get_wiz_lite() && !this.tile.get_item(r, c).isKnownTrap() && !this.tile.get_item(r, c).isShrine()) {
						ch.color = 3;
					}
				}
			}
			else if (ss.isValue(this.actor.get_item(r, c)) && $Forays_Map.get_player().canSee(this.actor.get_item(r, c))) {
				ch.c = this.actor.get_item(r, c).get_symbol();
				ch.color = this.actor.get_item(r, c).get_color();
			}
			else if (this.tile.get_item(r, c).get_seen()) {
				if (ss.isValue(this.tile.get_item(r, c).get_inv())) {
					ch.c = this.tile.get_item(r, c).get_inv().get_symbol();
					ch.color = this.tile.get_item(r, c).get_inv().get_color();
				}
				else if (this.tile.get_item(r, c).is(4)) {
					//some features stay visible when out of sight
					ch.c = $Forays_Tile.feature(4).get_symbol();
					ch.color = $Forays_Tile.feature(4).get_color();
				}
				else if (this.tile.get_item(r, c).is(8)) {
					ch.c = $Forays_Tile.feature(8).get_symbol();
					ch.color = $Forays_Tile.feature(8).get_color();
				}
				else if (this.tile.get_item(r, c).is(9)) {
					ch.c = $Forays_Tile.feature(9).get_symbol();
					ch.color = $Forays_Tile.feature(9).get_color();
				}
				else if (this.tile.get_item(r, c).is(10)) {
					ch.c = $Forays_Tile.feature(10).get_symbol();
					ch.color = $Forays_Tile.feature(10).get_color();
				}
				else {
					ch.c = this.tile.get_item(r, c).get_symbol();
					ch.color = this.tile.get_item(r, c).get_color();
					if (ch.c === '.' && ch.color === 1 || ch.c === '#' && ch.color === 2) {
						ch.color = 9;
					}
				}
			}
			else {
				ch.c = ' ';
				ch.color = 0;
			}
			return ch;
		},
		removeTargets: function(a) {
			//cleanup of references to dead monsters
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					if (ss.isValue(this.actor.get_item(i, j))) {
						this.actor.get_item(i, j).removeTarget(a);
					}
				}
			}
		},
		spawnItem: function() {
			var result = $Forays_Item.randomItem();
			for (var done = false; !done;) {
				var rr = $Forays_Global.roll(20);
				var rc = $Forays_Global.roll(64);
				var t = this.tile.get_item(rr, rc);
				if (t.get_passable() && ss.isNullOrUndefined(t.get_inv()) && t.get_ttype() !== 5 && t.get_ttype() !== 6 && t.get_ttype() !== 4 && !t.isShrine()) {
					return $Forays_Item.create$1(result, rr, rc);
					//done = true;
				}
			}
			//return result;
			return null;
		},
		mobType: function() {
			//List<ActorType> types = new List<ActorType>();
			//while(types.Count == 0){
			//foreach(ActorType atype in Enum.GetValues(typeof(ActorType))){
			//if(atype != ActorType.PLAYER){
			//int i = 1 + Math.Abs(Actor.Prototype(atype).level - (current_level+1)/2);
			//if(i <= 3 && Global.OneIn(i)){ //level-based check
			//if(Global.Roll(Actor.Rarity(atype)) == Actor.Rarity(atype)){ //note that Roll(0) apparently returns 1. hmm.
			//types.Add(atype); // at least that has the nice side effect of not generating 0-rarity monsters.
			//}
			//}
			//}
			//}
			//}
			//return types.Random();
			var result = 1;
			var good_result = false;
			while (!good_result) {
				var level = 1;
				var monster_depth = ss.Int32.div(this.get_current_level() + 1, 2);
				//1-10, not 1-20
				if (this.get_current_level() !== 1) {
					//depth 1 only generates level 1 monsters
					var levels = [];
					for (var i = -2; i <= 2; ++i) {
						if (monster_depth + i >= 1 && monster_depth + i <= 10) {
							var j = 1 + Math.abs(i);
							if ($Forays_Global.oneIn(j)) {
								//current depth is considered 1 out of 1 times, depth+1 and depth-1 one out of 2 times, etc.
								levels.add(monster_depth + i);
							}
						}
					}
					level = $Forays_Extensions.random(ss.Int32).call(null, levels);
				}
				if (monster_depth === 1) {
					result = level * 5 + $Forays_Global.roll(5) - 3;
					//equal probability for the level 1 monsters
				}
				else if ($Forays_Global.oneIn(5)) {
					//rarer types
					if ($Forays_Global.coinFlip()) {
						result = level * 5 + 1;
					}
					else {
						result = level * 5 + 2;
					}
				}
				else {
					var roll = $Forays_Global.roll(3);
					if (roll === 1) {
						result = level * 5 - 2;
					}
					else if (roll === 2) {
						result = level * 5 - 1;
					}
					else {
						result = level * 5;
					}
				}
				if (this.get_current_level() <= 2) {
					//the first 2 levels try to generate a wider variety of types
					if (this.$generated_this_level.get_item(result) === 0) {
						good_result = true;
					}
					else if ($Forays_Global.oneIn(this.$generated_this_level.get_item(result) + 1)) {
						// 1 in 2 for the 2nd, 1 in 3 for the 3rd, and so on
						good_result = true;
					}
				}
				else if (this.$generated_this_level.get_item(result) < 2) {
					good_result = true;
				}
				else if ($Forays_Global.oneIn(this.$generated_this_level.get_item(result))) {
					// 1 in 2 for the 3rd, 1 in 3 for the 4th, and so on
					good_result = true;
				}
			}
			this.$generated_this_level.set_item(result, this.$generated_this_level.get_item(result) + 1);
			return result;
		},
		spawnMob: function() {
			return this.spawnMob$1(this.mobType());
		},
		spawnMob$1: function(type) {
			var result = null;
			if (type === 26) {
				for (var tries = 0; tries < 1000; ++tries) {
					var rr = $Forays_Global.roll(18) + 1;
					var rc = $Forays_Global.roll(62) + 1;
					var tiles = [];
					var $t1 = this.tile.get_item(rr, rc).tilesWithinDistance(3);
					for (var $t2 = 0; $t2 < $t1.length; $t2++) {
						var t = $t1[$t2];
						if (t.get_passable() || t.get_ttype() === 3) {
							tiles.add(t);
						}
					}
					if (tiles.length >= 15) {
						$Forays_Actor.tiebreakers.add(null);
						//a placeholder for the poltergeist once it manifests
						var e = new $Forays_Event.$ctor7(null, tiles, ($Forays_Global.roll(8) + 6) * 100, 5);
						e.set_tiebreaker($Forays_Actor.tiebreakers.length - 1);
						$Forays_Map.get_q().add(e);
						//return type;
						return null;
					}
				}
				return null;
			}
			if (type === 16) {
				while (true) {
					var rr1 = $Forays_Global.roll(20);
					var rc1 = $Forays_Global.roll(64);
					var t1 = this.tile.get_item(rr1, rc1);
					if (t1.get_passable() && ss.isNullOrUndefined(t1.get_inv()) && t1.get_ttype() !== 5 && t1.get_ttype() !== 6 && t1.get_ttype() !== 4 && !t1.isShrine()) {
						var item = $Forays_Item.create$1($Forays_Item.randomItem(), rr1, rc1);
						$Forays_Actor.tiebreakers.add(null);
						//placeholder
						var $t3 = [];
						$t3.add(t1);
						var e1 = new $Forays_Event.$ctorf(item, $t3, 100, 6, 109, 0, '');
						e1.set_tiebreaker($Forays_Actor.tiebreakers.length - 1);
						$Forays_Map.get_q().add(e1);
						return null;
					}
				}
			}
			if (type === 37) {
				var statue = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.allTiles(), function(t2) {
					return t2.get_ttype() === 30;
				}));
				if (ss.isValue(statue)) {
					$Forays_Map.get_q().add(new $Forays_Event.$ctor5(statue, 100, 18));
				}
				return null;
			}
			var number = 1;
			if ($Forays_Actor.prototype$1(type).hasAttr(104)) {
				number = $Forays_Global.roll(2) + 1;
			}
			if ($Forays_Actor.prototype$1(type).hasAttr(105)) {
				number = $Forays_Global.roll(2) + 2;
			}
			if ($Forays_Actor.prototype$1(type).hasAttr(106)) {
				number = $Forays_Global.roll(3) + 4;
			}
			var group_tiles = [];
			var group = null;
			if (number > 1) {
				group = [];
			}
			for (var i = 0; i < number; ++i) {
				if (i === 0) {
					for (var j = 0; j < 9999; ++j) {
						var rr2 = $Forays_Global.roll(20);
						var rc2 = $Forays_Global.roll(64);
						var good = true;
						var $t4 = this.tile.get_item(rr2, rc2).tilesWithinDistance(1);
						for (var $t5 = 0; $t5 < $t4.length; $t5++) {
							var t3 = $t4[$t5];
							if (t3.isTrap()) {
								good = false;
							}
						}
						if (good && this.tile.get_item(rr2, rc2).get_passable() && ss.isNullOrUndefined(this.actor.get_item(rr2, rc2))) {
							result = $Forays_Actor.create$1(type, rr2, rc2, true, false);
							if (number > 1) {
								group_tiles.add(this.tile.get_item(rr2, rc2));
								group.add(result);
								result.group = group;
							}
							break;
						}
					}
				}
				else {
					for (var j1 = 0; j1 < 9999; ++j1) {
						if (group_tiles.length === 0) {
							//no space left!
							if (ss.isValue(group) && group.length > 0) {
								return group[0];
							}
							else {
								return result;
							}
						}
						var t4 = $Forays_Extensions.random($Forays_Tile).call(null, group_tiles);
						var empty_neighbors = [];
						var $t6 = t4.tilesAtDistance(1);
						for (var $t7 = 0; $t7 < $t6.length; $t7++) {
							var neighbor = $t6[$t7];
							if (neighbor.get_passable() && !neighbor.isTrap() && ss.isNullOrUndefined(neighbor.actor())) {
								empty_neighbors.add(neighbor);
							}
						}
						if (empty_neighbors.length > 0) {
							t4 = $Forays_Extensions.random($Forays_Tile).call(null, empty_neighbors);
							result = $Forays_Actor.create$1(type, t4.get_row(), t4.get_col(), true, false);
							group_tiles.add(t4);
							group.add(result);
							result.group = group;
							break;
						}
						else {
							group_tiles.remove(t4);
						}
					}
				}
			}
			//return type;
			if (number > 1) {
				return group[0];
			}
			else {
				return result;
			}
		},
		generateLevel: function() {
			if (this.get_current_level() < 20) {
				this.set_current_level(this.get_current_level() + 1);
			}
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					if (ss.isValue(this.actor.get_item(i, j))) {
						if (!ss.referenceEquals(this.actor.get_item(i, j), $Forays_Map.get_player())) {
							this.actor.get_item(i, j).get_inv().clear();
							this.actor.get_item(i, j).set_target(null);
							//Q.KillEvents(actor[i,j],EventType.ANY_EVENT);
							if (ss.isValue(this.actor.get_item(i, j).group)) {
								this.actor.get_item(i, j).group.clear();
								this.actor.get_item(i, j).group = null;
							}
						}
						this.actor.set_item(i, j, null);
					}
					if (ss.isValue(this.tile.get_item(i, j))) {
						this.tile.get_item(i, j).set_inv(null);
					}
					this.tile.set_item(i, j, null);
				}
			}
			this.set_wiz_lite(false);
			this.set_wiz_dark(false);
			this.$generated_this_level = new (Type.makeGenericType($Forays_Dict$2, [$Forays_ActorType, ss.Int32]))();
			//Q.KillEvents(null,EventType.BLAST_FUNGUS);
			//Q.KillEvents(null,EventType.RELATIVELY_SAFE);
			//Q.KillEvents(null,EventType.POLTERGEIST);
			//Q.KillEvents(null,EventType.MIMIC);
			//Q.KillEvents(null,EventType.FIRE_GEYSER);
			//Q.KillEvents(null,EventType.FIRE_GEYSER_ERUPTION);
			//Q.KillEvents(null,EventType.FOG);
			//Q.KillEvents(null,EventType.GRENADE);
			//Q.KillEvents(null,EventType.POISON_GAS);
			//Q.KillEvents(null,EventType.QUICKFIRE);
			//Q.KillEvents(null,EventType.REGENERATING_FROM_DEATH);
			//Q.KillEvents(null,EventType.STALAGMITE);
			$Forays_Map.get_q().resetForNewLevel();
			var $t1 = [];
			$t1.add($Forays_Map.get_player());
			$Forays_Actor.tiebreakers = $t1;
			//alltiles.Clear();
			var dungeon = new $DungeonGen_StandardDungeon();
			var charmap = null;
			switch (this.level_types[this.get_current_level() - 1]) {
				case 0: {
					charmap = dungeon.generateStandard();
					break;
				}
				case 1: {
					charmap = dungeon.generateCave();
					break;
				}
				case 2: {
					charmap = dungeon.generateRuined();
					break;
				}
				case 3: {
					charmap = dungeon.generateHive();
					break;
				}
				case 4: {
					charmap = dungeon.generateMine();
					break;
				}
				case 5: {
					charmap = dungeon.generateFortress();
					break;
				}
				case 6: {
					charmap = dungeon.generateExtravagant();
					break;
				}
			}
			//for(int i=0;i<ROWS;++i){
			//for(int j=0;j<COLS;++j){
			//Screen.WriteMapChar(i,j,charmap[i,j]);
			//}
			//}
			//Console.ReadKey(true);
			var interesting_tiles = [];
			for (var i1 = 0; i1 < $Forays_Map.$ROWS; ++i1) {
				for (var j1 = 0; j1 < $Forays_Map.$COLS; ++j1) {
					if (charmap.get(i1, j1) === '$') {
						interesting_tiles.add(new $Forays_pos(i1, j1));
					}
				}
			}
			var attempts = 0;
			if (this.get_current_level() % 2 === 1) {
				var $t2 = [];
				$t2.add(0);
				$t2.add(1);
				$t2.add(2);
				$t2.add(3);
				$t2.add(4);
				var ints = $t2;
				while (ints.length > 0) {
					attempts = 0;
					for (var done = false; !done; ++attempts) {
						var rr = $Forays_Global.roll(18) + 1;
						var rc = $Forays_Global.roll(62) + 1;
						if (interesting_tiles.length > 0 && (ints.length > 1 || attempts > 1000)) {
							var p = $Forays_Extensions.random($Forays_pos).call(null, interesting_tiles);
							rr = p.row;
							rc = p.col;
							charmap.set(rr, rc, '.');
						}
						var temp = new $Forays_pos(rr, rc);
						if (ints.length > 1) {
							if (charmap.get(rr, rc) === '.') {
								if (attempts > 1000) {
									var good = true;
									var $t3 = temp.positionsWithinDistance(4);
									for (var $t4 = 0; $t4 < $t3.length; $t4++) {
										var p1 = $t3[$t4];
										var ch = charmap.get(p1.row, p1.col);
										if (ch === 'a' || ch === 'b' || ch === 'c' || ch === 'd' || ch === 'e') {
											good = false;
										}
									}
									if (good) {
										var dist2 = [];
										var $t5 = temp.positionsAtDistance(2);
										for (var $t6 = 0; $t6 < $t5.length; $t6++) {
											var p2 = $t5[$t6];
											if (charmap.get(p2.row, p2.col) === '.') {
												dist2.add(p2);
											}
										}
										if (dist2.length > 0) {
											charmap.set(rr, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
											var p21 = $Forays_Extensions.random($Forays_pos).call(null, dist2);
											charmap.set(p21.row, p21.col, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
											done = true;
											break;
										}
									}
									else {
										interesting_tiles.remove(temp);
									}
								}
								var floors = true;
								var $t7 = temp.positionsAtDistance(1);
								for (var $t8 = 0; $t8 < $t7.length; $t8++) {
									var p3 = $t7[$t8];
									if (charmap.get(p3.row, p3.col) !== '.') {
										floors = false;
									}
								}
								var $t9 = temp.positionsWithinDistance(3);
								for (var $t10 = 0; $t10 < $t9.length; $t10++) {
									var p4 = $t9[$t10];
									var ch1 = charmap.get(p4.row, p4.col);
									if (ch1 === 'a' || ch1 === 'b' || ch1 === 'c' || ch1 === 'd' || ch1 === 'e') {
										floors = false;
									}
								}
								if (floors) {
									if ($Forays_Global.coinFlip()) {
										charmap.set(rr - 1, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
										charmap.set(rr + 1, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
									}
									else {
										charmap.set(rr, rc - 1, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
										charmap.set(rr, rc + 1, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
									}
									var center = ' ';
									switch ($Forays_Global.roll(3)) {
										case 1: {
											center = '#';
											break;
										}
										case 2: {
											center = '&';
											break;
										}
										case 3: {
											center = '0';
											break;
										}
									}
									charmap.set(rr, rc, center);
									interesting_tiles.remove(temp);
									done = true;
									break;
								}
							}
						}
						else {
							if (charmap.get(rr, rc) === '.') {
								var good1 = true;
								var $t11 = temp.positionsWithinDistance(2);
								for (var $t12 = 0; $t12 < $t11.length; $t12++) {
									var p5 = $t11[$t12];
									var ch2 = charmap.get(p5.row, p5.col);
									if (ch2 === 'a' || ch2 === 'b' || ch2 === 'c' || ch2 === 'd' || ch2 === 'e') {
										good1 = false;
									}
								}
								if (good1) {
									if (attempts > 1000) {
										charmap.set(rr, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
										interesting_tiles.remove(temp);
										done = true;
										break;
									}
									else {
										var floors1 = true;
										var $t13 = temp.positionsAtDistance(1);
										for (var $t14 = 0; $t14 < $t13.length; $t14++) {
											var p6 = $t13[$t14];
											if (charmap.get(p6.row, p6.col) !== '.') {
												floors1 = false;
											}
										}
										if (floors1) {
											charmap.set(rr, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
											interesting_tiles.remove(temp);
											done = true;
											break;
										}
									}
								}
							}
							if (charmap.get(rr, rc) === '#') {
								if (charmap.get(rr + 1, rc) !== '.' && charmap.get(rr - 1, rc) !== '.' && charmap.get(rr, rc - 1) !== '.' && charmap.get(rr, rc + 1) !== '.') {
									continue;
									//no floors? retry.
								}
								var no_good = false;
								var $t15 = temp.positionsAtDistance(2);
								for (var $t16 = 0; $t16 < $t15.length; $t16++) {
									var p7 = $t15[$t16];
									var ch3 = charmap.get(p7.row, p7.col);
									if (ch3 === 'a' || ch3 === 'b' || ch3 === 'c' || ch3 === 'd' || ch3 === 'e') {
										no_good = true;
									}
								}
								if (no_good) {
									continue;
								}
								var walls = 0;
								var $t17 = temp.positionsAtDistance(1);
								for (var $t18 = 0; $t18 < $t17.length; $t18++) {
									var p8 = $t17[$t18];
									if (charmap.get(p8.row, p8.col) === '#') {
										++walls;
									}
								}
								if (walls >= 5) {
									var successive_walls = 0;
									var rotated = new Array(8);
									for (var i2 = 0; i2 < 8; ++i2) {
										var temp2;
										temp2 = temp.positionInDirection($Forays_Global.rotateDirection$1(8, true, i2));
										rotated[i2] = charmap.get(temp2.row, temp2.col);
									}
									for (var i3 = 0; i3 < 15; ++i3) {
										if (rotated[i3 % 8] === '#') {
											++successive_walls;
										}
										else {
											successive_walls = 0;
										}
										if (successive_walls === 5) {
											done = true;
											charmap.set(rr, rc, String.fromCharCode($Forays_Extensions.removeRandom(ss.Int32).call(null, ints) + 97));
											interesting_tiles.remove(temp);
											break;
										}
									}
								}
							}
						}
					}
				}
			}
			var num_chests = $Forays_Global.roll(2);
			if ($Forays_Global.oneIn(50)) {
				num_chests = 3;
			}
			for (var i4 = 0; i4 < num_chests; ++i4) {
				var tries = 0;
				for (var done1 = false; !done1; ++tries) {
					var rr1 = $Forays_Global.roll(18) + 1;
					var rc1 = $Forays_Global.roll(62) + 1;
					if (interesting_tiles.length > 0) {
						var p9 = $Forays_Extensions.removeRandom($Forays_pos).call(null, interesting_tiles);
						rr1 = p9.row;
						rc1 = p9.col;
						charmap.set(rr1, rc1, '.');
					}
					if (charmap.get(rr1, rc1) === '.') {
						var floors2 = true;
						var temp1 = new $Forays_pos(rr1, rc1);
						var $t19 = temp1.positionsAtDistance(1);
						for (var $t20 = 0; $t20 < $t19.length; $t20++) {
							var p10 = $t19[$t20];
							if (charmap.get(p10.row, p10.col) !== '.') {
								floors2 = false;
							}
						}
						if (floors2 || tries > 1000) {
							//after 1000 tries, place it anywhere
							charmap.set(rr1, rc1, '=');
							done1 = true;
						}
					}
				}
			}
			attempts = 0;
			for (var done2 = false; !done2; ++attempts) {
				var rr2 = $Forays_Global.roll(18) + 1;
				var rc2 = $Forays_Global.roll(62) + 1;
				if (interesting_tiles.length > 0) {
					var p11 = $Forays_Extensions.removeRandom($Forays_pos).call(null, interesting_tiles);
					rr2 = p11.row;
					rc2 = p11.col;
					charmap.set(rr2, rc2, '.');
				}
				if (charmap.get(rr2, rc2) === '.') {
					var floors3 = true;
					var temp3 = new $Forays_pos(rr2, rc2);
					var $t21 = temp3.positionsAtDistance(1);
					for (var $t22 = 0; $t22 < $t21.length; $t22++) {
						var p12 = $t21[$t22];
						if (charmap.get(p12.row, p12.col) !== '.') {
							floors3 = false;
						}
					}
					if (floors3 || attempts > 1000) {
						charmap.set(rr2, rc2, '>');
						done2 = true;
					}
				}
			}
			if ($Forays_Global.oneIn(30)) {
				attempts = 0;
				for (var done3 = false; !done3; ++attempts) {
					var rr3 = $Forays_Global.roll(18) + 1;
					var rc3 = $Forays_Global.roll(62) + 1;
					if (interesting_tiles.length > 0) {
						var p13 = $Forays_Extensions.removeRandom($Forays_pos).call(null, interesting_tiles);
						rr3 = p13.row;
						rc3 = p13.col;
						charmap.set(rr3, rc3, '.');
					}
					if (charmap.get(rr3, rc3) === '.') {
						var floors4 = true;
						var temp4 = new $Forays_pos(rr3, rc3);
						var $t23 = temp4.positionsAtDistance(1);
						for (var $t24 = 0; $t24 < $t23.length; $t24++) {
							var p14 = $t23[$t24];
							if (charmap.get(p14.row, p14.col) !== '.') {
								floors4 = false;
							}
						}
						if (floors4 || attempts > 1000) {
							charmap.set(rr3, rc3, 'P');
							done3 = true;
						}
					}
				}
			}
			if ($Forays_Global.oneIn(20) && this.get_current_level() > 2) {
				var lt = this.level_types[this.get_current_level() - 1];
				if (lt === 0 || lt === 1 || lt === 2 || lt === 4) {
					switch ($Forays_Global.roll(4)) {
						case 1:
						case 2: {
							for (attempts = 0; attempts < 100; ++attempts) {
								var rr4 = $Forays_Global.roll(18) + 1;
								var rc4 = $Forays_Global.roll(62) + 1;
								if (charmap.get(rr4, rc4) === '.') {
									charmap.set(rr4, rc4, 'F');
									break;
								}
							}
							break;
						}
						case 3: {
							for (attempts = 0; attempts < 100; ++attempts) {
								var rr5 = $Forays_Global.roll(18) + 1;
								var rc5 = $Forays_Global.roll(62) + 1;
								var p15 = new $Forays_pos(rr5, rc5);
								if (charmap.get(rr5, rc5) === '.') {
									var other_pos = [];
									var $t25 = p15.positionsWithinDistance$1(5, true);
									for (var $t26 = 0; $t26 < $t25.length; $t26++) {
										var nearby = $t25[$t26];
										if (charmap.get(nearby.row, nearby.col) === '.') {
											other_pos.add(nearby);
										}
									}
									if (other_pos.length > 0) {
										charmap.set(rr5, rc5, 'F');
										var other = $Forays_Extensions.random($Forays_pos).call(null, other_pos);
										charmap.set(other.row, other.col, 'F');
										break;
									}
								}
							}
							break;
						}
						case 4: {
							var num = $Forays_Global.roll(5) + 2;
							for (var i5 = 0; i5 < num; ++i5) {
								for (attempts = 0; attempts < 100; ++attempts) {
									var rr6 = $Forays_Global.roll(18) + 1;
									var rc6 = $Forays_Global.roll(62) + 1;
									if (charmap.get(rr6, rc6) === '.') {
										charmap.set(rr6, rc6, 'F');
										break;
									}
								}
							}
							break;
						}
					}
				}
			}
			var num_traps = $Forays_Global.roll$1(2, 3);
			for (var i6 = 0; i6 < num_traps; ++i6) {
				var tries1 = 0;
				for (var done4 = false; !done4 && tries1 < 100; ++tries1) {
					var rr7 = $Forays_Global.roll(20);
					var rc7 = $Forays_Global.roll(64);
					if (charmap.get(rr7, rc7) === '.') {
						charmap.set(rr7, rc7, '^');
						done4 = true;
					}
				}
			}
			var percentage_of_traps_to_become_vents = 1;
			if (this.level_types[this.get_current_level() - 1] === 1 || this.level_types[this.get_current_level() - 1] === 3) {
				percentage_of_traps_to_become_vents = 20;
			}
			if (this.level_types[this.get_current_level() - 1] === 4) {
				percentage_of_traps_to_become_vents = 5;
			}
			if (this.level_types[this.get_current_level() - 1] === 6 || this.level_types[this.get_current_level() - 1] === 5) {
				percentage_of_traps_to_become_vents = 0;
			}
			var hidden = [];
			for (var i7 = 0; i7 < $Forays_Map.$ROWS; ++i7) {
				for (var j2 = 0; j2 < $Forays_Map.$COLS; ++j2) {
					//Screen.WriteMapChar(i,j,charmap[i,j]);
					switch (charmap.get(i7, j2)) {
						case '#': {
							$Forays_Tile.create(0, i7, j2);
							break;
						}
						case '.':
						case '$': {
							$Forays_Tile.create(1, i7, j2);
							break;
						}
						case '+': {
							$Forays_Tile.create(3, i7, j2);
							break;
						}
						case '-': {
							$Forays_Tile.create(2, i7, j2);
							break;
						}
						case '>': {
							if (this.get_current_level() < 20) {
								$Forays_Tile.create(4, i7, j2);
							}
							else if (this.get_current_level() === 20) {
								$Forays_Tile.create(4, i7, j2);
								this.tile.get_item(i7, j2).set_color(3);
								this.tile.get_item(i7, j2).setName('scorched stairway');
							}
							else {
								$Forays_Tile.create(1, i7, j2);
							}
							break;
						}
						case '&': {
							$Forays_Tile.create(30, i7, j2);
							break;
						}
						case ':': {
							$Forays_Tile.create(28, i7, j2);
							break;
						}
						case '0': {
							$Forays_Tile.create(6, i7, j2);
							break;
						}
						case 'P': {
							$Forays_Tile.create(31, i7, j2);
							break;
						}
						case 'F': {
							$Forays_Tile.create(1, i7, j2);
							this.tile.get_item(i7, j2).features.add(8);
							break;
						}
						case '=': {
							$Forays_Tile.create(5, i7, j2);
							break;
						}
						case '~': {
							$Forays_Tile.create(29, i7, j2);
							break;
						}
						case '^': {
							var type = $Forays_Tile.randomTrap();
							if ($Forays_Global.roll(100) <= percentage_of_traps_to_become_vents) {
								type = $Forays_Tile.randomVent();
							}
							$Forays_Tile.create(type, i7, j2);
							this.tile.get_item(i7, j2).set_name('floor');
							this.tile.get_item(i7, j2).set_the_name('the floor');
							this.tile.get_item(i7, j2).set_a_name('a floor');
							this.tile.get_item(i7, j2).set_symbol('.');
							this.tile.get_item(i7, j2).set_color(1);
							hidden.add(this.tile.get_item(i7, j2));
							if (type === 29) {
								var frequency = $Forays_Global.roll(21) + 4;
								//5-25
								var variance = $Forays_Global.roll(10) - 1;
								//0-9
								var variance_amount = ss.Int32.div(frequency * variance, 10);
								var number_of_values = variance_amount * 2 + 1;
								var minimum_value = frequency - variance_amount;
								if (minimum_value < 5) {
									var diff = 5 - minimum_value;
									number_of_values -= diff;
									minimum_value = 5;
								}
								var delay = (minimum_value - 1 + $Forays_Global.roll(number_of_values)) * 100;
								$Forays_Map.get_q().add(new $Forays_Event.$ctora(this.tile.get_item(i7, j2), delay + 200, 11, frequency * 10 + variance));
								//notice the hacky way the value is stored
								$Forays_Map.get_q().add(new $Forays_Event.$ctora(this.tile.get_item(i7, j2), delay, 12, 2));
							}
							if (type === 32) {
								$Forays_Map.get_q().add(new $Forays_Event.$ctor5(this.tile.get_item(i7, j2), 100, 13));
							}
							if (type === 33) {
								$Forays_Map.get_q().add(new $Forays_Event.$ctor5(this.tile.get_item(i7, j2), 100, 15));
							}
							break;
						}
						case 'H': {
							$Forays_Tile.create(20, i7, j2);
							hidden.add(this.tile.get_item(i7, j2));
							break;
						}
						case 'a': {
							$Forays_Tile.create(21, i7, j2);
							break;
						}
						case 'b': {
							$Forays_Tile.create(22, i7, j2);
							break;
						}
						case 'c': {
							$Forays_Tile.create(23, i7, j2);
							break;
						}
						case 'd': {
							$Forays_Tile.create(24, i7, j2);
							break;
						}
						case 'e': {
							$Forays_Tile.create(25, i7, j2);
							break;
						}
						default: {
							$Forays_Tile.create(1, i7, j2);
							break;
						}
					}
					//alltiles.Add(tile[i,j]);
					this.tile.get_item(i7, j2).set_solid_rock(true);
				}
			}
			//Console.ReadKey(true);
			$Forays_Map.get_player().resetForNewLevel();
			var $t27 = this.allTiles();
			for (var $t28 = 0; $t28 < $t27.length; $t28++) {
				var t = $t27[$t28];
				if (t.get_light_radius() > 0) {
					t.updateRadius(0, t.get_light_radius());
				}
				//if(t.type == TileType.FIREPIT){
				//foreach(Tile tt in t.TilesWithinDistance(1)){
				//tt.light_value++;
				//}
				//}
			}
			var num_items = 1;
			switch ($Forays_Global.roll(5)) {
				case 1: {
					num_items = 0;
					break;
				}
				case 5: {
					num_items = 2;
					break;
				}
			}
			for (var i8 = num_items; i8 > 0; --i8) {
				this.spawnItem();
			}
			var poltergeist_spawned = false;
			//i'm not sure this is the right call, but for now
			var mimic_spawned = false;
			// i'm limiting these guys, to avoid "empty" levels
			var marble_horror_spawned = false;
			for (var i9 = $Forays_Global.roll$1(2, 2) + 3; i9 > 0; --i9) {
				var type1 = this.mobType();
				if (type1 === 26) {
					if (!poltergeist_spawned) {
						this.spawnMob$1(type1);
						poltergeist_spawned = true;
					}
					else {
						++i9;
						//try again..
					}
				}
				else if (type1 === 16) {
					if (!mimic_spawned) {
						this.spawnMob$1(type1);
						mimic_spawned = true;
					}
					else {
						++i9;
					}
				}
				else if (type1 === 37) {
					var statue = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.allTiles(), function(t1) {
						return t1.get_ttype() === 30;
					}));
					if (!marble_horror_spawned && ss.isValue(statue)) {
						this.spawnMob$1(type1);
						marble_horror_spawned = true;
					}
					else {
						++i9;
					}
				}
				else if (type1 === 36) {
					if (i9 >= 2) {
						//need 2 slots here
						var entrancer = this.spawnMob$1(type1);
						entrancer.attrs.set_item(11, entrancer.attrs.get_item(11) + 1);
						var tiles = [];
						var dist = 1;
						while (tiles.length === 0 && dist < 100) {
							var $t29 = entrancer.tilesAtDistance(dist);
							for (var $t30 = 0; $t30 < $t29.length; $t30++) {
								var t2 = $t29[$t30];
								if (t2.get_passable() && !t2.isTrap() && ss.isNullOrUndefined(t2.actor())) {
									tiles.add(t2);
								}
							}
							++dist;
						}
						if (tiles.length > 0) {
							var thralltype = 1;
							var done5 = false;
							while (!done5) {
								thralltype = this.mobType();
								switch (thralltype) {
									case 18:
									case 20:
									case 22:
									case 23:
									case 25:
									case 29:
									case 30:
									case 31:
									case 32:
									case 33:
									case 34:
									case 38:
									case 40:
									case 43:
									case 51:
									case 52: {
										done5 = true;
										break;
									}
								}
							}
							var t3 = $Forays_Extensions.random($Forays_Tile).call(null, tiles);
							var thrall = $Forays_Actor.create$1(thralltype, t3.get_row(), t3.get_col(), true, true);
							if (ss.isNullOrUndefined(entrancer.group)) {
								var $t31 = [];
								$t31.add(entrancer);
								entrancer.group = $t31;
							}
							entrancer.group.add(thrall);
							thrall.group = entrancer.group;
							--i9;
						}
					}
					else {
						++i9;
					}
				}
				else {
					var a = this.spawnMob$1(type1);
					if (a.alwaysWanders() || $Forays_Global.coinFlip() && a.canWander()) {
						a.attrs.set_item(11, a.attrs.get_item(11) + 1);
					}
				}
			}
			var good_location = Array.multidim(Boolean.getDefaultValue(), $Forays_Map.$ROWS, $Forays_Map.$COLS);
			for (var i10 = 0; i10 < $Forays_Map.$ROWS; ++i10) {
				for (var j3 = 0; j3 < $Forays_Map.$COLS; ++j3) {
					if (this.tile.get_item(i10, j3).get_ttype() === 1) {
						good_location.set(i10, j3, true);
					}
					else {
						good_location.set(i10, j3, false);
					}
				}
			}
			var $t32 = this.allActors();
			for (var $t33 = 0; $t33 < $t32.length; $t33++) {
				var a1 = $t32[$t33];
				if (!ss.referenceEquals(a1, $Forays_Map.get_player())) {
					good_location.set(a1.get_row(), a1.get_col(), false);
					for (var i11 = 0; i11 < $Forays_Map.$ROWS; ++i11) {
						for (var j4 = 0; j4 < $Forays_Map.$COLS; ++j4) {
							if (good_location.get(i11, j4) && a1.hasLOS$1(i11, j4)) {
								good_location.set(i11, j4, false);
							}
						}
					}
				}
			}
			var at_least_one_good = false;
			for (var i12 = 0; i12 < $Forays_Map.$ROWS && !at_least_one_good; ++i12) {
				for (var j5 = 0; j5 < $Forays_Map.$COLS && !at_least_one_good; ++j5) {
					if (good_location.get(i12, j5)) {
						at_least_one_good = true;
					}
				}
			}
			if (!at_least_one_good) {
				var $t34 = this.allActors();
				for (var $t35 = 0; $t35 < $t34.length; $t35++) {
					var a2 = $t34[$t35];
					if (!ss.referenceEquals(a2, $Forays_Map.get_player())) {
						good_location.set(a2.get_row(), a2.get_col(), false);
						for (var i13 = 0; i13 < $Forays_Map.$ROWS; ++i13) {
							for (var j6 = 0; j6 < $Forays_Map.$COLS; ++j6) {
								if (good_location.get(i13, j6) && a2.canSee$1(i13, j6)) {
									//checking CanSee this time
									good_location.set(i13, j6, false);
								}
							}
						}
					}
				}
			}
			var goodtiles = [];
			for (var i14 = 0; i14 < $Forays_Map.$ROWS; ++i14) {
				for (var j7 = 0; j7 < $Forays_Map.$COLS; ++j7) {
					if (good_location.get(i14, j7)) {
						goodtiles.add(this.tile.get_item(i14, j7));
					}
				}
			}
			if (goodtiles.length > 0) {
				var t4 = $Forays_Extensions.random($Forays_Tile).call(null, goodtiles);
				var light = $Forays_Map.get_player().get_light_radius();
				$Forays_Map.get_player().set_light_radius(0);
				$Forays_Map.get_player().move(t4.get_row(), t4.get_col());
				$Forays_Map.get_player().updateRadius$1(0, light, true);
			}
			else {
				for (var done6 = false; !done6;) {
					var rr8 = $Forays_Global.roll(20);
					var rc8 = $Forays_Global.roll(64);
					var good2 = true;
					var $t36 = this.tile.get_item(rr8, rc8).tilesWithinDistance(1);
					for (var $t37 = 0; $t37 < $t36.length; $t37++) {
						var t5 = $t36[$t37];
						if (t5.isTrap()) {
							good2 = false;
						}
					}
					if (good2 && this.tile.get_item(rr8, rc8).get_passable() && ss.isNullOrUndefined(this.actor.get_item(rr8, rc8))) {
						var light1 = $Forays_Map.get_player().get_light_radius();
						var fire = $Forays_Map.get_player().attrs.get_item(31);
						$Forays_Map.get_player().set_light_radius(0);
						$Forays_Map.get_player().attrs.set_item(31, 0);
						$Forays_Map.get_player().move(rr8, rc8);
						$Forays_Map.get_player().updateRadius$1(0, Math.max(light1, fire), true);
						$Forays_Map.get_player().set_light_radius(light1);
						$Forays_Map.get_player().attrs.set_item(31, fire);
						done6 = true;
					}
				}
			}
			if ($Forays_Global.coinFlip()) {
				//is 50% the best rate for hidden areas? it seems to be working well so far.
				var done7 = false;
				for (var tries2 = 0; !done7 && tries2 < 500; ++tries2) {
					var rr9 = $Forays_Global.roll(18) + 1;
					var rc9 = $Forays_Global.roll(62) + 1;
					var good3 = true;
					var $t38 = this.tile.get_item(rr9, rc9).tilesWithinDistance(2);
					for (var $t39 = 0; $t39 < $t38.length; $t39++) {
						var t6 = $t38[$t39];
						if (t6.get_ttype() !== 0) {
							good3 = false;
							break;
						}
					}
					if (good3) {
						var dirs = [];
						var long_corridor = false;
						var connections = 0;
						for (var i15 = 2; i15 <= 8; i15 += 2) {
							var t7 = this.tile.get_item(rr9, rc9).tileInDirection(i15).tileInDirection(i15);
							var good_dir = true;
							var distance = -1;
							while (good_dir && ss.isValue(t7) && t7.get_ttype() === 0) {
								if (t7.tileInDirection(t7.rotateDirection$1(i15, false, 2)).get_ttype() !== 0) {
									good_dir = false;
								}
								if (t7.tileInDirection(t7.rotateDirection$1(i15, true, 2)).get_ttype() !== 0) {
									good_dir = false;
								}
								t7 = t7.tileInDirection(i15);
								if (ss.isValue(t7) && t7.get_ttype() === 30) {
									good_dir = false;
								}
								++distance;
							}
							if (good_dir && ss.isValue(t7)) {
								dirs.add(i15);
								++connections;
								if (distance >= 4) {
									long_corridor = true;
								}
							}
						}
						if (dirs.length > 0) {
							var possible_traps = [];
							var trap_roll = $Forays_Global.roll(7);
							if (trap_roll === 1 || trap_roll === 4 || trap_roll === 5 || trap_roll === 7) {
								possible_traps.add(12);
							}
							if (trap_roll === 2 || trap_roll === 4 || trap_roll === 6 || trap_roll === 7) {
								possible_traps.add(16);
							}
							if (trap_roll === 3 || trap_roll === 5 || trap_roll === 6 || trap_roll === 7) {
								possible_traps.add(19);
							}
							var stone_slabs = false;
							//(instead of hidden doors)
							if ($Forays_Global.oneIn(4)) {
								stone_slabs = true;
							}
							for (var $t40 = 0; $t40 < dirs.length; $t40++) {
								var i16 = dirs[$t40];
								var t8 = this.tile.get_item(rr9, rc9).tileInDirection(i16);
								var distance1 = -2;
								//distance of the corridor between traps and secret door
								while (t8.get_ttype() === 0) {
									++distance1;
									t8 = t8.tileInDirection(i16);
								}
								if (long_corridor && distance1 < 4) {
									continue;
								}
								t8 = this.tile.get_item(rr9, rc9).tileInDirection(i16);
								while (t8.get_ttype() === 0) {
									if (distance1 >= 4) {
										var tt = 1;
										if ($Forays_Global.roll(3) >= 2) {
											tt = $Forays_Extensions.random($Forays_TileType).call(null, possible_traps);
											hidden.add(t8);
										}
										t8.transformTo(tt);
										t8.set_name('floor');
										t8.set_the_name('the floor');
										t8.set_a_name('a floor');
										t8.set_symbol('.');
										t8.set_color(1);
										if (t8.distanceFrom(this.tile.get_item(rr9, rc9)) < distance1 + 2) {
											var neighbor = t8.tileInDirection(t8.rotateDirection$1(i16, false, 2));
											if (neighbor.tileInDirection(t8.rotateDirection$1(i16, false, 1)).get_ttype() === 0 && neighbor.tileInDirection(t8.rotateDirection$1(i16, false, 2)).get_ttype() === 0 && neighbor.tileInDirection(t8.rotateDirection$1(i16, false, 3)).get_ttype() === 0) {
												tt = 1;
												if ($Forays_Global.roll(3) >= 2) {
													tt = $Forays_Extensions.random($Forays_TileType).call(null, possible_traps);
												}
												neighbor.transformTo(tt);
												if (possible_traps.contains(tt)) {
													neighbor.set_name('floor');
													neighbor.set_the_name('the floor');
													neighbor.set_a_name('a floor');
													neighbor.set_symbol('.');
													neighbor.set_color(1);
													hidden.add(neighbor);
												}
											}
											neighbor = t8.tileInDirection(t8.rotateDirection$1(i16, true, 2));
											if (neighbor.tileInDirection(t8.rotateDirection$1(i16, true, 1)).get_ttype() === 0 && neighbor.tileInDirection(t8.rotateDirection$1(i16, true, 2)).get_ttype() === 0 && neighbor.tileInDirection(t8.rotateDirection$1(i16, true, 3)).get_ttype() === 0) {
												tt = 1;
												if ($Forays_Global.roll(3) >= 2) {
													tt = $Forays_Extensions.random($Forays_TileType).call(null, possible_traps);
												}
												neighbor.transformTo(tt);
												if (possible_traps.contains(tt)) {
													neighbor.set_name('floor');
													neighbor.set_the_name('the floor');
													neighbor.set_a_name('a floor');
													neighbor.set_symbol('.');
													neighbor.set_color(1);
													hidden.add(neighbor);
												}
											}
										}
									}
									else {
										var tt1 = 1;
										if ($Forays_Global.coinFlip()) {
											tt1 = $Forays_Tile.randomTrap();
											hidden.add(t8);
										}
										t8.transformTo(tt1);
										if (tt1 !== 1) {
											t8.set_name('floor');
											t8.set_the_name('the floor');
											t8.set_a_name('a floor');
											t8.set_symbol('.');
											t8.set_color(1);
										}
									}
									t8 = t8.tileInDirection(i16);
								}
								t8 = t8.tileInDirection(t8.rotateDirection$1(i16, true, 4));
								if (stone_slabs) {
									t8.transformTo(34);
									var $t42 = $Forays_Map.get_q();
									var $t41 = [];
									$t41.add(t8.tileInDirection($Forays_Extensions.rotateDirection$1(i16, true, 4)));
									$t42.add(new $Forays_Event.$ctor7(t8, $t41, 100, 17));
								}
								else {
									t8.transformTo(20);
									$Forays_Extensions.addUnique($Forays_Tile).call(null, hidden, t8);
								}
								t8 = t8.tileInDirection(t8.rotateDirection$1(i16, true, 4));
								if ($Forays_Global.coinFlip()) {
									if (t8.isTrap()) {
										t8.set_ttype(14);
									}
									else {
										t8.transformTo(14);
										t8.set_name('floor');
										t8.set_the_name('the floor');
										t8.set_a_name('a floor');
										t8.set_symbol('.');
										t8.set_color(1);
										$Forays_Extensions.addUnique($Forays_Tile).call(null, hidden, t8);
									}
								}
							}
							if (long_corridor && connections === 1) {
								var $t43 = this.tile.get_item(rr9, rc9).tilesWithinDistance(1);
								for (var $t44 = 0; $t44 < $t43.length; $t44++) {
									var t9 = $t43[$t44];
									t9.transformTo($Forays_Extensions.random($Forays_TileType).call(null, possible_traps));
									t9.set_name('floor');
									t9.set_the_name('the floor');
									t9.set_a_name('a floor');
									t9.set_symbol('.');
									t9.set_color(1);
									hidden.add(t9);
								}
								this.tile.get_item(rr9, rc9).tileInDirection(this.tile.get_item(rr9, rc9).rotateDirection$1(dirs[0], true, 4)).transformTo(5);
							}
							else {
								var $t45 = this.tile.get_item(rr9, rc9).tilesAtDistance(1);
								for (var $t46 = 0; $t46 < $t45.length; $t46++) {
									var t10 = $t45[$t46];
									t10.transformTo($Forays_Tile.randomTrap());
									t10.set_name('floor');
									t10.set_the_name('the floor');
									t10.set_a_name('a floor');
									t10.set_symbol('.');
									t10.set_color(1);
									hidden.add(t10);
								}
								this.tile.get_item(rr9, rc9).transformTo(5);
							}
							done7 = true;
						}
					}
				}
			}
			var $t47 = this.allTiles();
			for (var $t48 = 0; $t48 < $t47.length; $t48++) {
				var t11 = $t47[$t48];
				if (t11.get_ttype() !== 0) {
					var $t49 = t11.tilesAtDistance(1);
					for (var $t50 = 0; $t50 < $t49.length; $t50++) {
						var neighbor1 = $t49[$t50];
						neighbor1.set_solid_rock(false);
					}
				}
			}
			if (hidden.length > 0) {
				var e = new $Forays_Event.$ctor6(hidden, 100, 3);
				e.set_tiebreaker(0);
				$Forays_Map.get_q().add(e);
			}
			if (this.get_current_level() === 20) {
				var e1 = new $Forays_Event.$ctor2(1066, 20);
				e1.set_tiebreaker(0);
				$Forays_Map.get_q().add(e1);
			}
			{
				var e2 = new $Forays_Event.$ctor2(10000, 4);
				e2.set_tiebreaker(0);
				$Forays_Map.get_q().add(e2);
			}
			if (this.get_current_level() === 1) {
				$Forays_Map.get_b().add('Welcome, ' + $Forays_Actor.player_name + '! ');
			}
			else {
				$Forays_Map.get_b().add(this.levelMessage());
			}
		},
		generateBossLevel: function(boss_already_on_level) {
			this.set_current_level(21);
			var boss_hp = -1;
			var $t1 = $Forays_Map.get_q().list;
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var e = $t1[$t2];
				if (e.get_evtype() === 21) {
					boss_hp = e.get_value();
					break;
				}
			}
			var $t3 = this.allActors();
			for (var $t4 = 0; $t4 < $t3.length; $t4++) {
				var a = $t3[$t4];
				if (a.get_atype() === 2) {
					boss_hp = a.get_curhp();
					break;
				}
			}
			for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
				for (var j = 0; j < $Forays_Map.$COLS; ++j) {
					if (ss.isValue(this.actor.get_item(i, j))) {
						if (!ss.referenceEquals(this.actor.get_item(i, j), $Forays_Map.get_player())) {
							this.actor.get_item(i, j).get_inv().clear();
							this.actor.get_item(i, j).set_target(null);
							if (ss.isValue(this.actor.get_item(i, j).group)) {
								this.actor.get_item(i, j).group.clear();
								this.actor.get_item(i, j).group = null;
							}
						}
						this.actor.set_item(i, j, null);
					}
					if (ss.isValue(this.tile.get_item(i, j))) {
						this.tile.get_item(i, j).set_inv(null);
					}
					this.tile.set_item(i, j, null);
				}
			}
			this.set_wiz_lite(false);
			this.set_wiz_dark(false);
			var newlist = [];
			var $t5 = $Forays_Map.get_q().list;
			for (var $t6 = 0; $t6 < $t5.length; $t6++) {
				var current = $t5[$t6];
				if (ss.referenceEquals(current.get_target(), $Forays_Event.get_player()) || current.get_evtype() === 23 || current.get_evtype() === 22) {
					if (current.get_evtype() === 22) {
						current.set_target(null);
					}
					newlist.insert(newlist.length, current);
				}
			}
			$Forays_Map.get_q().list = newlist;
			//same as Q.ResetForNewLevel, but it keeps collapse events.
			var $t7 = [];
			$t7.add($Forays_Map.get_player());
			$Forays_Actor.tiebreakers = $t7;
			var dungeon = new $DungeonGen_StandardDungeon();
			var charmap = dungeon.generateCave();
			var num_traps = $Forays_Global.roll$1(1, 3);
			for (var i1 = 0; i1 < num_traps; ++i1) {
				var tries = 0;
				for (var done = false; !done && tries < 100; ++tries) {
					var rr = $Forays_Global.roll(20);
					var rc = $Forays_Global.roll(64);
					if (charmap.get(rr, rc) === '.') {
						charmap.set(rr, rc, '^');
						done = true;
					}
				}
			}
			var hidden = [];
			for (var i2 = 0; i2 < $Forays_Map.$ROWS; ++i2) {
				for (var j1 = 0; j1 < $Forays_Map.$COLS; ++j1) {
					switch (charmap.get(i2, j1)) {
						case '#': {
							$Forays_Tile.create(0, i2, j1);
							break;
						}
						case '.':
						case '$': {
							$Forays_Tile.create(1, i2, j1);
							break;
						}
						case ':': {
							$Forays_Tile.create(28, i2, j1);
							break;
						}
						case 'P': {
							$Forays_Tile.create(31, i2, j1);
							break;
						}
						case '~': {
							$Forays_Tile.create(29, i2, j1);
							break;
						}
						case '^': {
							var type = 29;
							$Forays_Tile.create(type, i2, j1);
							this.tile.get_item(i2, j1).set_name('floor');
							this.tile.get_item(i2, j1).set_the_name('the floor');
							this.tile.get_item(i2, j1).set_a_name('a floor');
							this.tile.get_item(i2, j1).set_symbol('.');
							this.tile.get_item(i2, j1).set_color(1);
							hidden.add(this.tile.get_item(i2, j1));
							var frequency = $Forays_Global.roll(21) + 4;
							//5-25
							var variance = $Forays_Global.roll(10) - 1;
							//0-9
							var variance_amount = ss.Int32.div(frequency * variance, 10);
							var number_of_values = variance_amount * 2 + 1;
							var minimum_value = frequency - variance_amount;
							if (minimum_value < 5) {
								var diff = 5 - minimum_value;
								number_of_values -= diff;
								minimum_value = 5;
							}
							var delay = (minimum_value - 1 + $Forays_Global.roll(number_of_values)) * 100;
							$Forays_Map.get_q().add(new $Forays_Event.$ctora(this.tile.get_item(i2, j1), delay + 200, 11, frequency * 10 + variance));
							//notice the hacky way the value is stored
							$Forays_Map.get_q().add(new $Forays_Event.$ctora(this.tile.get_item(i2, j1), delay, 12, 2));
							break;
						}
						default: {
							$Forays_Tile.create(1, i2, j1);
							break;
						}
					}
					this.tile.get_item(i2, j1).set_solid_rock(true);
				}
			}
			$Forays_Map.get_player().resetForNewLevel();
			var $t8 = this.allTiles();
			for (var $t9 = 0; $t9 < $t8.length; $t9++) {
				var t = $t8[$t9];
				if (t.get_light_radius() > 0) {
					t.updateRadius(0, t.get_light_radius());
				}
			}
			var goodtiles = $Forays_Extensions.where($Forays_Tile).call(null, this.allTiles(), function(t1) {
				return t1.get_ttype() === 1 && !t1.isAdjacentTo$1(29);
			});
			if (goodtiles.length > 0) {
				var t2 = $Forays_Extensions.random($Forays_Tile).call(null, goodtiles);
				var light = $Forays_Map.get_player().get_light_radius();
				var fire = $Forays_Map.get_player().attrs.get_item(31);
				$Forays_Map.get_player().set_light_radius(0);
				$Forays_Map.get_player().attrs.set_item(31, 0);
				$Forays_Map.get_player().move(t2.get_row(), t2.get_col());
				$Forays_Map.get_player().updateRadius$1(0, Math.max(light, fire), true);
				$Forays_Map.get_player().set_light_radius(light);
				$Forays_Map.get_player().attrs.set_item(31, fire);
			}
			else {
				for (var done1 = false; !done1;) {
					var rr1 = $Forays_Global.roll(20);
					var rc1 = $Forays_Global.roll(64);
					var good = true;
					var $t10 = this.tile.get_item(rr1, rc1).tilesWithinDistance(1);
					for (var $t11 = 0; $t11 < $t10.length; $t11++) {
						var t3 = $t10[$t11];
						if (t3.isTrap()) {
							good = false;
						}
					}
					if (good && this.tile.get_item(rr1, rc1).get_passable() && ss.isNullOrUndefined(this.actor.get_item(rr1, rc1))) {
						var light1 = $Forays_Map.get_player().get_light_radius();
						$Forays_Map.get_player().set_light_radius(0);
						$Forays_Map.get_player().move(rr1, rc1);
						$Forays_Map.get_player().updateRadius$1(0, light1, true);
						done1 = true;
					}
				}
			}
			var $t12 = this.allTiles();
			for (var $t13 = 0; $t13 < $t12.length; $t13++) {
				var t4 = $t12[$t13];
				if (t4.get_ttype() !== 0) {
					var $t14 = t4.tilesAtDistance(1);
					for (var $t15 = 0; $t15 < $t14.length; $t15++) {
						var neighbor = $t14[$t15];
						neighbor.set_solid_rock(false);
					}
				}
			}
			if (hidden.length > 0) {
				var e1 = new $Forays_Event.$ctor6(hidden, 100, 3);
				e1.set_tiebreaker(0);
				$Forays_Map.get_q().add(e1);
			}
			if (boss_already_on_level) {
				var tile = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.allTiles(), function(t5) {
					return t5.get_passable() && !t5.is$1(35) && ss.isNullOrUndefined(t5.actor());
				}));
				var a1 = $Forays_Actor.create$1(2, tile.get_row(), tile.get_col(), true, false);
				if (boss_hp > 0) {
					a1.set_curhp(boss_hp);
				}
			}
			else {
				var e2 = new $Forays_Event.$ctorf(null, null, ($Forays_Global.roll(20) + 50) * 100, 21, 69, boss_hp, '');
				e2.set_tiebreaker(0);
				$Forays_Map.get_q().add(e2);
			}
		},
		levelMessage: function() {
			if (this.get_current_level() === 1 || this.level_types[this.get_current_level() - 2] === this.level_types[this.get_current_level() - 1]) {
				return '';
			}
			var messages = [];
			switch (this.level_types[this.get_current_level() - 1]) {
				case 0: {
					messages.add('You enter a complex of ancient rooms and hallways. ');
					messages.add('Well-worn corridors suggest that these rooms are frequently used. ');
					break;
				}
				case 1: {
					messages.add('You enter a large natural cave. ');
					messages.add('This cavern\'s rough walls shine with moisture. ');
					messages.add('A cave opens up before you. A dry, dusty scent lingers in the ancient tunnels. ');
					break;
				}
				case 2: {
					messages.add('You enter a badly damaged rubble-strewn area of the dungeon. ');
					messages.add('Broken walls and piles of rubble cover parts of the floor here. ');
					messages.add('This section of the dungeon has partially collapsed. ');
					break;
				}
				case 3: {
					messages.add('You enter an area made up of small chambers. Some of the walls are covered in a waxy substance. ');
					messages.add('As you enter the small chambers here, you hear a faint buzzing. It sounds like insects. ');
					break;
				}
				case 4: {
					messages.add('You enter a system of mining tunnels. ');
					messages.add('Mining tools are scattered on the ground of this level. ');
					messages.add('You notice half-finished tunnels and mining equipment here. ');
					break;
				}
				case 5: {
					messages.add('You pass through a broken gate and enter the remnants of a fortress. ');
					messages.add('This level looks like it was intended to be a stronghold. ');
					break;
				}
				case 6: {
					messages.add('This area is decorated with fine tapestries, marble statues, and other luxuries. ');
					messages.add('Patterned decorative tiles, fine rugs, and beautifully worked stone greet you upon entering this level. ');
					break;
				}
			}
			if (this.get_current_level() > 1) {
				var transition = this.transitionMessage(this.level_types[this.get_current_level() - 2], this.level_types[this.get_current_level() - 1]);
				if (transition !== '') {
					messages.add(transition);
				}
			}
			return $Forays_Extensions.random(String).call(null, messages);
		},
		transitionMessage: function(from, to) {
			switch (from) {
				case 0: {
					switch (to) {
						case 1: {
							return 'Rooms and corridors disappear from your surroundings as you reach a large natural cavern. ';
						}
						case 2: {
							return 'More corridors and rooms appear before you, but many of the walls here are shattered and broken. Rubble covers the floor. ';
						}
						case 3: {
							return 'The rooms get smaller as you continue. A waxy substance appears on some of the walls. ';
						}
						case 4: {
							return 'As you continue, you notice that the rooms and corridors here seem only partly finished. ';
						}
						case 5: {
							return 'You pass through an undefended gate. This area was obviously intended to be secure against intruders. ';
						}
						case 6: {
							return 'As you continue, you notice that every corridor is extravagantly decorated and every room is magnificently furnished. ';
						}
					}
					break;
				}
				case 1: {
					switch (to) {
						case 0: {
							return 'Leaving the cave behind, you again encounter signs of humanoid habitation. ';
						}
						case 2: {
							return 'The cave leads you to ruined corridors long abandoned by their creators. ';
						}
						case 3: {
							return 'The wide-open spaces of the cave disappear, replaced by small chambers that remind you of an insect hive. ';
						}
						case 4: {
							return 'As you continue, the rough natural edges of the cave are broken up by artificial tunnels. You notice mining tools on the ground. ';
						}
						case 5: {
							return 'A smashed set of double doors leads you out of the cave. This area seems to have been well-defended, once. ';
						}
						case 6: {
							return 'You encounter a beautifully crafted door in the cave wall. It leads to corridors richly decorated with tiles and tapestries. ';
						}
					}
					break;
				}
				case 2: {
					switch (to) {
						case 0: {
							return 'This part of the dungeon is in much better condition. Rubble no longer covers the floor. ';
						}
						case 1: {
							return 'You leave ruined rooms behind and enter natural cave tunnels, never touched by picks. ';
						}
						case 3: {
							return 'It looks like this section was taken over by insects. The rubble has been cleared and used to build small chambers. ';
						}
						case 4: {
							return 'Rubble still covers the floor here. However, this area isn\'t ruined - it\'s still being mined. ';
						}
						case 5: {
							return 'You no longer see crumbling walls in this section, but this fortress has clearly fallen into disuse. ';
						}
						case 6: {
							return 'The rubble disappears, replaced by extravagant decorations. Whatever ruined that part of the dungeon didn\'t affect this area. ';
						}
					}
					break;
				}
				case 3: {
					switch (to) {
						case 0: {
							return 'The rooms around you begin to look more typical, created by picks instead of by thousands of insects. ';
						}
						case 1: {
							return 'You leave the cramped chambers behind and enter a wider cave. ';
						}
						case 2: {
							return 'This area was clearly built by intelligent life, but nature seems to be reclaiming the ruined tunnels. ';
						}
						case 4: {
							return 'Tools on the ground reveal that the rooms here are being made by humanoids rather than insects. ';
						}
						case 5: {
							return 'A wide hole in the wall leads to a fortress, abandoned by its creators. ';
						}
						case 6: {
							return 'Your skin stops crawling as you leave the hives behind and enter a beautifully furnished area. ';
						}
					}
					break;
				}
				case 4: {
					switch (to) {
						case 0: {
							return 'You leave the mines behind and return to finished corridors and rooms. ';
						}
						case 1: {
							return 'The half-finished tunnels disappear as natural cave walls surround you. ';
						}
						case 2: {
							return 'This area is collapsing and ruined. It looks much older than the mines you just left. ';
						}
						case 3: {
							return 'As you continue, signs of humanoid construction vanish and hive walls appear. ';
						}
						case 5: {
							return 'You reach a section that is not only complete, but easily defensible. ';
						}
						case 6: {
							return 'As you walk, incomplete tunnels turn into luxurious carpeted hallways. ';
						}
					}
					break;
				}
				case 5: {
					switch (to) {
						case 0: {
							return 'You enter a section outside the main area of the fortress. ';
						}
						case 1: {
							return 'You leave the fortress behind. The corridors open up into natural caves. ';
						}
						case 2: {
							return 'Unlike the fortress, this area has deteriorated immensely. ';
						}
						case 3: {
							return 'A wide hole in the wall leads to an area filled with small chambers. You are reminded of an insect hive. ';
						}
						case 4: {
							return 'This section might have been part of the fortress, but pickaxes are still scattered in the unfinished rooms. ';
						}
						case 6: {
							return 'As you continue, the military focus of your surroundings is replaced by rich luxury. ';
						}
					}
					break;
				}
				case 6: {
					switch (to) {
						case 0: {
							return 'The marvelous luxury vanishes. These rooms look unexciting in comparison. ';
						}
						case 1: {
							return 'Extravagance is replaced by nature as you enter a large cavern. ';
						}
						case 2: {
							return 'The opulence of your surroundings vanishes, replaced by ruined walls and scattered rubble. ';
						}
						case 3: {
							return 'As you continue, the lavish decorations give way to the waxy walls of an insect hive. ';
						}
						case 4: {
							return 'You find no comfortable excess of luxury here, just the tools of workers. ';
						}
						case 5: {
							return 'You enter what was once a fortress. Your new surroundings trade ornate comfort for spartan efficiency. ';
						}
					}
					break;
				}
			}
			return '';
		}
	};
	$Forays_Map.get_e = function() {
		return $Forays_Map.$1$EField;
	};
	$Forays_Map.set_e = function(value) {
		$Forays_Map.$1$EField = value;
	};
	$Forays_Map.get_player = function() {
		return $Forays_Map.$1$playerField;
	};
	$Forays_Map.set_player = function(value) {
		$Forays_Map.$1$playerField = value;
	};
	$Forays_Map.get_q = function() {
		return $Forays_Map.$1$QField;
	};
	$Forays_Map.set_q = function(value) {
		$Forays_Map.$1$QField = value;
	};
	$Forays_Map.get_b = function() {
		return $Forays_Map.$1$BField;
	};
	$Forays_Map.set_b = function(value) {
		$Forays_Map.$1$BField = value;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Map.PosArray
	var $Forays_Map$PosArray$1 = function(T) {
		var $type = function(rows, cols) {
			this.$objs = null;
			this.$objs = Array.multidim(T.getDefaultValue(), rows, cols);
		};
		$type.prototype = {
			get_item: function(row, col) {
				return this.$objs.get(row, col);
			},
			set_item: function(row, col, value) {
				this.$objs.set(row, col, value);
			},
			get_item$1: function(p) {
				return this.$objs.get(p.row, p.col);
			},
			set_item$1: function(p, value) {
				this.$objs.set(p.row, p.col, value);
			}
		};
		Type.registerGenericClassInstance($type, $Forays_Map$PosArray$1, [T], function() {
			return Object;
		}, function() {
			return [];
		});
		return $type;
	};
	Type.registerGenericClass(global, 'Forays.Map$PosArray$1', $Forays_Map$PosArray$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.OptionType
	var $Forays_OptionType = function() {
	};
	$Forays_OptionType.prototype = { lasT_TARGET: 0, AUTOPICKUP: 1, nO_ROMAN_NUMERALS: 2, hidE_OLD_MESSAGES: 3, hidE_COMMANDS: 4, neveR_DISPLAY_TIPS: 5, alwayS_RESET_TIPS: 6 };
	Type.registerEnum(global, 'Forays.OptionType', $Forays_OptionType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.PhysicalObject
	var $Forays_PhysicalObject = function() {
		this.p = null;
		this.$1$nameField = null;
		this.$1$a_nameField = null;
		this.$1$the_nameField = null;
		this.$1$symbolField = null;
		this.$1$colorField = 0;
		this.$1$light_radiusField = 0;
		this.p = new $Forays_pos(-1, -1);
		this.set_row(-1);
		this.set_col(-1);
		this.set_name('');
		this.set_a_name('');
		this.set_the_name('');
		this.set_symbol('%');
		this.set_color(1);
		this.set_light_radius(0);
	};
	$Forays_PhysicalObject.prototype = {
		get_row: function() {
			return this.p.row;
		},
		set_row: function(value) {
			this.p.row = value;
		},
		get_col: function() {
			return this.p.col;
		},
		set_col: function(value) {
			this.p.col = value;
		},
		get_name: function() {
			return this.$1$nameField;
		},
		set_name: function(value) {
			this.$1$nameField = value;
		},
		get_a_name: function() {
			return this.$1$a_nameField;
		},
		set_a_name: function(value) {
			this.$1$a_nameField = value;
		},
		get_the_name: function() {
			return this.$1$the_nameField;
		},
		set_the_name: function(value) {
			this.$1$the_nameField = value;
		},
		get_symbol: function() {
			return this.$1$symbolField;
		},
		set_symbol: function(value) {
			this.$1$symbolField = value;
		},
		get_color: function() {
			return this.$1$colorField;
		},
		set_color: function(value) {
			this.$1$colorField = value;
		},
		get_light_radius: function() {
			return this.$1$light_radiusField;
		},
		set_light_radius: function(value) {
			this.$1$light_radiusField = value;
		},
		setName: function(new_name) {
			this.set_name(new_name);
			this.set_the_name('the ' + this.get_name());
			this.set_a_name('a ' + this.get_name());
			if (this.get_name() === 'you') {
				this.set_the_name('you');
				this.set_a_name('you');
			}
			switch (this.get_name().charCodeAt(0)) {
				case 97:
				case 101:
				case 105:
				case 111:
				case 117:
				case 65:
				case 69:
				case 73:
				case 79:
				case 85: {
					this.set_a_name('an ' + this.get_name());
					break;
				}
			}
		},
		cursor: function() {
			$Forays_Game.console.setCursorPosition(this.get_col() + $Forays_Global.maP_OFFSET_COLS, this.get_row() + $Forays_Global.maP_OFFSET_ROWS);
		},
		updateRadius: function(from, to) {
			this.updateRadius$1(from, to, false);
		},
		updateRadius$1: function(from, to, change) {
			if (from > 0) {
				for (var i = this.get_row() - from; i <= this.get_row() + from; ++i) {
					for (var j = this.get_col() - from; j <= this.get_col() + from; ++j) {
						if (i > 0 && i < 21 && j > 0 && j < 65) {
							if (!$Forays_PhysicalObject.get_m().tile.get_item(i, j).get_opaque() && this.hasBresenhamLine(i, j)) {
								var $t1 = $Forays_PhysicalObject.get_m().tile.get_item(i, j);
								$t1.set_light_value($t1.get_light_value() - 1);
							}
						}
					}
				}
			}
			if (to > 0) {
				for (var i1 = this.get_row() - to; i1 <= this.get_row() + to; ++i1) {
					for (var j1 = this.get_col() - to; j1 <= this.get_col() + to; ++j1) {
						if (i1 > 0 && i1 < 21 && j1 > 0 && j1 < 65) {
							if (!$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_opaque() && this.hasBresenhamLine(i1, j1)) {
								var $t2 = $Forays_PhysicalObject.get_m().tile.get_item(i1, j1);
								$t2.set_light_value($t2.get_light_value() + 1);
							}
						}
					}
				}
			}
			if (change) {
				this.set_light_radius(to);
			}
		},
		youAre: function() {
			if (this.get_name() === 'you') {
				return 'you are';
			}
			else {
				return this.get_the_name() + ' is';
			}
		},
		your: function() {
			if (this.get_name() === 'you') {
				return 'your';
			}
			else {
				return this.get_the_name() + '\'s';
			}
		},
		you: function(s) {
			return this.you$1(s, false);
		},
		you$1: function(s, ends_in_es) {
			if (this.get_name() === 'you') {
				return 'you ' + s;
			}
			else if (ends_in_es) {
				return this.get_the_name() + ' ' + s + 'es';
			}
			else {
				return this.get_the_name() + ' ' + s + 's';
			}
		},
		youVisible: function(s) {
			return this.youVisible$1(s, false);
		},
		youVisible$1: function(s, ends_in_es) {
			//same as You(). overridden by Actor.
			if (this.get_name() === 'you') {
				return 'you ' + s;
			}
			else if (ends_in_es) {
				return this.get_the_name() + ' ' + s + 'es';
			}
			else {
				return this.get_the_name() + ' ' + s + 's';
			}
		},
		youFeel: function() {
			if (this.get_name() === 'you') {
				return 'you feel';
			}
			else {
				return this.get_the_name() + ' looks';
			}
		},
		theVisible: function() {
			//always returns the_name. overridden by Actor.
			return this.get_the_name();
		},
		aVisible: function() {
			//always returns a_name. overridden by Actor.
			return this.get_a_name();
		},
		distanceFrom: function(o) {
			return this.distanceFrom$2(o.get_row(), o.get_col());
		},
		distanceFrom$1: function(p) {
			return this.distanceFrom$2(p.row, p.col);
		},
		distanceFrom$2: function(r, c) {
			var dy = Math.abs(r - this.get_row());
			var dx = Math.abs(c - this.get_col());
			if (dx > dy) {
				return dx;
			}
			else {
				return dy;
			}
		},
		estimatedEuclideanDistanceFromX10: function(o) {
			return this.estimatedEuclideanDistanceFromX10$2(o.get_row(), o.get_col());
		},
		estimatedEuclideanDistanceFromX10$1: function(p) {
			return this.estimatedEuclideanDistanceFromX10$2(p.row, p.col);
		},
		estimatedEuclideanDistanceFromX10$2: function(r, c) {
			// x10 so that orthogonal directions are closer than diagonals
			var dy = Math.abs(r - this.get_row()) * 10;
			var dx = Math.abs(c - this.get_col()) * 10;
			if (dx > dy) {
				return dx + ss.Int32.div(dy, 2);
			}
			else {
				return dy + ss.Int32.div(dx, 2);
			}
		},
		actorInDirection: function(dir) {
			switch (dir) {
				case 7: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() - 1, this.get_col() - 1);
					}
					break;
				}
				case 8: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col())) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() - 1, this.get_col());
					}
					break;
				}
				case 9: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() - 1, this.get_col() + 1);
					}
					break;
				}
				case 4: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row(), this.get_col() - 1);
					}
					break;
				}
				case 5: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col())) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row(), this.get_col());
					}
					break;
				}
				case 6: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row(), this.get_col() + 1);
					}
					break;
				}
				case 1: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() + 1, this.get_col() - 1);
					}
					break;
				}
				case 2: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col())) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() + 1, this.get_col());
					}
					break;
				}
				case 3: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row() + 1, this.get_col() + 1);
					}
					break;
				}
				default: {
					return null;
				}
			}
			return null;
		},
		tileInDirection: function(dir) {
			switch (dir) {
				case 7: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() - 1, this.get_col() - 1);
					}
					break;
				}
				case 8: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col())) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() - 1, this.get_col());
					}
					break;
				}
				case 9: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() - 1, this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() - 1, this.get_col() + 1);
					}
					break;
				}
				case 4: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col() - 1);
					}
					break;
				}
				case 5: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col())) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col());
					}
					break;
				}
				case 6: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row(), this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col() + 1);
					}
					break;
				}
				case 1: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col() - 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() + 1, this.get_col() - 1);
					}
					break;
				}
				case 2: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col())) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() + 1, this.get_col());
					}
					break;
				}
				case 3: {
					if ($Forays_PhysicalObject.get_m().boundsCheck(this.get_row() + 1, this.get_col() + 1)) {
						return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row() + 1, this.get_col() + 1);
					}
					break;
				}
				default: {
					return null;
				}
			}
			return null;
		},
		firstActorInLine: function(obj) {
			return this.firstActorInLine$2(obj, 1);
		},
		firstActorInLine$2: function(obj, num) {
			if (ss.isNullOrUndefined(obj)) {
				return null;
			}
			var count = 0;
			var line = this.getBestLine$1(obj.get_row(), obj.get_col());
			line.removeAt(0);
			for (var $t1 = 0; $t1 < line.length; $t1++) {
				var t = line[$t1];
				if (!t.get_passable()) {
					return null;
				}
				if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
					++count;
					if (count === num) {
						return $Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col());
					}
				}
			}
			return null;
		},
		firstActorInLine$1: function(line) {
			return this.firstActorInLine$3(line, 1);
		},
		firstActorInLine$3: function(line, num) {
			if (ss.isNullOrUndefined(line)) {
				return null;
			}
			var count = 0;
			var idx = 0;
			//note that the first position is thrown out, as it is assumed to be the origin of the line
			for (var $t1 = 0; $t1 < line.length; $t1++) {
				var t = line[$t1];
				if (idx !== 0) {
					if (!t.get_passable()) {
						return null;
					}
					if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
						++count;
						if (count === num) {
							return $Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col());
						}
					}
				}
				++idx;
			}
			return null;
		},
		firstActorInExtendedLine: function(obj) {
			return this.firstActorInExtendedLine$2(obj, 1, -1);
		},
		firstActorInExtendedLine$1: function(obj, max_distance) {
			return this.firstActorInExtendedLine$2(obj, 1, max_distance);
		},
		firstActorInExtendedLine$2: function(obj, num, max_distance) {
			if (ss.isNullOrUndefined(obj)) {
				return null;
			}
			var count = 0;
			var line = this.getBestExtendedLine$1(obj.get_row(), obj.get_col());
			line.removeAt(0);
			for (var $t1 = 0; $t1 < line.length; $t1++) {
				var t = line[$t1];
				if (!t.get_passable()) {
					return null;
				}
				if (max_distance !== -1 && this.distanceFrom(t) > max_distance) {
					return null;
				}
				if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col()))) {
					++count;
					if (count === num) {
						return $Forays_PhysicalObject.get_m().actor.get_item(t.get_row(), t.get_col());
					}
				}
			}
			return null;
		},
		firstSolidTileInLine: function(obj) {
			return this.firstSolidTileInLine$1(obj, 1);
		},
		firstSolidTileInLine$1: function(obj, num) {
			if (ss.isNullOrUndefined(obj)) {
				return null;
			}
			var count = 0;
			var line = this.getBestLine$1(obj.get_row(), obj.get_col());
			line.removeAt(0);
			for (var $t1 = 0; $t1 < line.length; $t1++) {
				var t = line[$t1];
				if (!t.get_passable()) {
					++count;
					if (count === num) {
						return t;
					}
				}
			}
			return null;
		},
		rotateDirection: function(dir, clockwise) {
			return this.rotateDirection$1(dir, clockwise, 1);
		},
		rotateDirection$1: function(dir, clockwise, num) {
			if (num < 0) {
				num = -num;
				clockwise = !clockwise;
			}
			for (var i = 0; i < num; ++i) {
				switch (dir) {
					case 7: {
						dir = (clockwise ? 8 : 4);
						break;
					}
					case 8: {
						dir = (clockwise ? 9 : 7);
						break;
					}
					case 9: {
						dir = (clockwise ? 6 : 8);
						break;
					}
					case 4: {
						dir = (clockwise ? 7 : 1);
						break;
					}
					case 5: {
						break;
					}
					case 6: {
						dir = (clockwise ? 3 : 9);
						break;
					}
					case 1: {
						dir = (clockwise ? 4 : 2);
						break;
					}
					case 2: {
						dir = (clockwise ? 1 : 3);
						break;
					}
					case 3: {
						dir = (clockwise ? 2 : 6);
						break;
					}
					default: {
						dir = 0;
						break;
					}
				}
			}
			return dir;
		},
		directionOf: function(obj) {
			return this.directionOf$1(obj.p);
		},
		directionOf$1: function(obj) {
			var dy = Math.abs(obj.row - this.get_row());
			var dx = Math.abs(obj.col - this.get_col());
			if (dy === 0) {
				if (this.get_col() < obj.col) {
					return 6;
				}
				if (this.get_col() > obj.col) {
					return 4;
				}
				else if (dx === 0) {
					return 5;
				}
			}
			if (dx === 0) {
				if (this.get_row() > obj.row) {
					return 8;
				}
				else if (this.get_row() < obj.row) {
					return 2;
				}
			}
			if (this.get_row() + this.get_col() === obj.row + obj.col) {
				//slope is -1
				if (this.get_row() > obj.row) {
					return 9;
				}
				else if (this.get_row() < obj.row) {
					return 1;
				}
			}
			if (this.get_row() - this.get_col() === obj.row - obj.col) {
				//slope is 1
				if (this.get_row() > obj.row) {
					return 7;
				}
				else if (this.get_row() < obj.row) {
					return 3;
				}
			}
			// calculate all other dirs here
			//.................flipped y
			//........m........
			//.......l|n.......
			//........|........
			//.....k..|..o.....
			//......\.|./......
			//...j...\|/...p...
			//..i-----@-----a.1
			//...h.../|\...b.2.
			//....../.|.\.B.3..
			//.....g..|..c.4...
			//........|...5....
			//.......f|d.......
			//........e........
			//
			//@-------------...
			//|\;..b.2.........
			//|.\.B.3..........
			//|..\.4;..........
			//|...\...;........
			//|....\....;6.....
			//|.....\.....;....
			//|......\.....5;..
			//rise:	run:	ri/ru:	angle(flipped y):
			//b:	1	5	1/5		(obviously the dividing line should be 22.5 degrees here)
			//d:	5	1	5		67.5
			//f:	5	-1	-5		112.5
			//h:	1	-5	-1/5		157.5
			//j:	-1	-5	1/5		202.5
			//l:	-5	-1	5		247.5
			//n:	-5	1	-5		292.5
			//p:	-1	5	-1/5		337.5
			//algorithm for determining direction...			(for b)		(for 4)		(for 6)		(for 5)		(for B)
			//first, determine 'major' direction - NSEW		E		E		E		E		E
			//then, determine 'minor' direction - diagonals		SE		SE		SE		SE		SE
			//find the ratio of d-major/d(other dir) (both positive)	1/5		3/5		5/11		7/13		2/4
			//compare this number to 1/2:  if less than 1/2, major.
			//if more than 1/2, minor.
			//if exactly 1/2, tiebreaker.
			//major(E)	minor(SE)	major(E)	minor(SE)	tiebreak
			var primary;
			//orthogonal
			var secondary;
			//diagonal
			var dprimary = Math.min(dy, dx);
			var dsecondary = Math.max(dy, dx);
			if (this.get_row() < obj.row) {
				//down
				if (this.get_col() < obj.col) {
					//right
					secondary = 3;
					if (dx > dy) {
						//slope less than 1
						primary = 6;
					}
					else {
						//slope greater than 1
						primary = 2;
					}
				}
				else {
					//left
					secondary = 1;
					if (dx > dy) {
						//slope less than 1
						primary = 4;
					}
					else {
						//slope greater than 1
						primary = 2;
					}
				}
			}
			else {
				//up
				if (this.get_col() < obj.col) {
					//right
					secondary = 9;
					if (dx > dy) {
						//slope less than 1
						primary = 6;
					}
					else {
						//slope greater than 1
						primary = 8;
					}
				}
				else {
					//left
					secondary = 7;
					if (dx > dy) {
						//slope less than 1
						primary = 4;
					}
					else {
						//slope greater than 1
						primary = 8;
					}
				}
			}
			var tiebreaker = primary;
			var ratio = dprimary / dsecondary;
			if (ratio < 0.5) {
				return primary;
			}
			else if (ratio > 0.5) {
				return secondary;
			}
			else {
				return tiebreaker;
			}
		},
		directionOfOnlyUnblocked: function(tiletype) {
			return this.directionOfOnlyUnblocked$1(tiletype, false);
		},
		directionOfOnlyUnblocked$1: function(tiletype, orth) {
			//if there's only 1 unblocked tile of this kind, return its dir
			var total = 0;
			var dir = 0;
			for (var i = 1; i <= 9; ++i) {
				if (i !== 5) {
					if (this.tileInDirection(i).get_ttype() === tiletype && ss.isNullOrUndefined(this.actorInDirection(i)) && ss.isNullOrUndefined(this.tileInDirection(i).get_inv())) {
						if (!orth || i % 2 === 0) {
							++total;
							dir = i;
						}
					}
				}
				//else{
				//if(tile().type == tiletype && !orth){
				//++total;
				//dir = i;
				//}
				//}
			}
			if (total > 1) {
				return -1;
			}
			else if (total === 1) {
				return dir;
			}
			else {
				return 0;
			}
		},
		actor: function() {
			return $Forays_PhysicalObject.get_m().actor.get_item(this.get_row(), this.get_col());
		},
		tile: function() {
			return $Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col());
		},
		actorsWithinDistance: function(dist) {
			return this.actorsWithinDistance$1(dist, false);
		},
		actorsWithinDistance$1: function(dist, exclude_origin) {
			var result = [];
			for (var i = this.get_row() - dist; i <= this.get_row() + dist; ++i) {
				for (var j = this.get_col() - dist; j <= this.get_col() + dist; ++j) {
					if (i !== this.get_row() || j !== this.get_col() || exclude_origin === false) {
						if ($Forays_PhysicalObject.get_m().boundsCheck(i, j) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i, j))) {
							result.add($Forays_PhysicalObject.get_m().actor.get_item(i, j));
						}
					}
				}
			}
			return result;
		},
		actorsAtDistance: function(dist) {
			var result = [];
			for (var i = this.get_row() - dist; i <= this.get_row() + dist; ++i) {
				for (var j = this.get_col() - dist; j <= this.get_col() + dist; ++j) {
					if (this.distanceFrom$2(i, j) === dist && $Forays_PhysicalObject.get_m().boundsCheck(i, j) && ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i, j))) {
						result.add($Forays_PhysicalObject.get_m().actor.get_item(i, j));
					}
				}
			}
			return result;
		},
		tilesWithinDistance: function(dist) {
			return this.tilesWithinDistance$1(dist, false);
		},
		tilesWithinDistance$1: function(dist, exclude_origin) {
			var result = [];
			for (var i = this.get_row() - dist; i <= this.get_row() + dist; ++i) {
				for (var j = this.get_col() - dist; j <= this.get_col() + dist; ++j) {
					if (i !== this.get_row() || j !== this.get_col() || exclude_origin === false) {
						if ($Forays_PhysicalObject.get_m().boundsCheck(i, j)) {
							result.add($Forays_PhysicalObject.get_m().tile.get_item(i, j));
						}
					}
				}
			}
			return result;
		},
		tilesAtDistance: function(dist) {
			var result = [];
			for (var i = this.get_row() - dist; i <= this.get_row() + dist; ++i) {
				for (var j = this.get_col() - dist; j <= this.get_col() + dist; ++j) {
					if (this.distanceFrom$2(i, j) === dist && $Forays_PhysicalObject.get_m().boundsCheck(i, j)) {
						result.add($Forays_PhysicalObject.get_m().tile.get_item(i, j));
					}
				}
			}
			return result;
		},
		positionsAtDistance: function(dist) {
			var result = [];
			for (var i = this.get_row() - dist; i <= this.get_row() + dist; ++i) {
				for (var j = this.get_col() - dist; j <= this.get_col() + dist; ++j) {
					if (this.distanceFrom$2(i, j) === dist && $Forays_PhysicalObject.get_m().boundsCheck(i, j)) {
						result.add(new $Forays_pos(i, j));
					}
				}
			}
			return result;
		},
		isAdjacentTo$1: function(type) {
			return this.isAdjacentTo$3(type, false);
		},
		isAdjacentTo$3: function(type, consider_origin) {
			var $t1 = this.tilesWithinDistance$1(1, !consider_origin);
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var t = $t1[$t2];
				if (t.get_ttype() === type) {
					return true;
				}
			}
			return false;
		},
		isAdjacentTo: function(type) {
			return this.isAdjacentTo$2(type, false);
		},
		isAdjacentTo$2: function(type, consider_origin) {
			var $t1 = this.tilesWithinDistance$1(1, !consider_origin);
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var t = $t1[$t2];
				if (t.features.contains(type)) {
					return true;
				}
			}
			return false;
		},
		hasLOS: function(o) {
			return this.hasLOS$1(o.get_row(), o.get_col());
		},
		hasLOS$1: function(r, c) {
			var y1 = this.get_row();
			var x1 = this.get_col();
			var y2 = r;
			var x2 = c;
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			if (dx <= 1 && dy <= 1) {
				//everything adjacent
				return true;
			}
			if (this.hasBresenhamLine(r, c)) {
				//basic LOS check
				return true;
			}
			if ($Forays_PhysicalObject.get_m().tile.get_item(r, c).get_opaque()) {
				//for walls, check nearby tiles
				var $t1 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).neighborsBetween(this.get_row(), this.get_col());
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (this.hasBresenhamLine(t.get_row(), t.get_col())) {
						return true;
					}
				}
			}
			return false;
		},
		hasBresenhamLine: function(r, c) {
			var line = this.getBestLine$1(r, c);
			var length = line.length;
			if (length === 1) {
				return true;
			}
			for (var i = 1; i < length - 1; ++i) {
				//todo: experimentally changed i=0 to i=1, to skip the first tile.
				if (line[i].get_opaque()) {
					// this should allow actors to see out of solid tiles.
					return false;
				}
			}
			return true;
		},
		getBestLine: function(o) {
			return this.getBestLine$1(o.get_row(), o.get_col());
		},
		getBestLine$1: function(r, c) {
			var list = this.getBresenhamLine$1(r, c);
			var list2 = this.getAlternateBresenhamLine$1(r, c);
			for (var i = 0; i < list.length; ++i) {
				if (list2[i].get_opaque()) {
					return list;
				}
				if (list[i].get_opaque()) {
					return list2;
				}
			}
			return list;
		},
		getBestExtendedLine: function(o) {
			return this.getBestExtendedLine$1(o.get_row(), o.get_col());
		},
		getBestExtendedLine$1: function(r, c) {
			var list = this.getExtendedBresenhamLine$1(r, c);
			var list2 = this.getAlternateExtendedBresenhamLine$1(r, c);
			for (var i = 0; i < list.length; ++i) {
				if (list2[i].get_opaque()) {
					return list;
				}
				if (list[i].get_opaque()) {
					return list2;
				}
			}
			return list;
		},
		getBresenhamLine: function(o) {
			return this.getBresenhamLine$1(o.get_row(), o.get_col());
		},
		getBresenhamLine$1: function(r, c) {
			//bresenham (inverted y)
			var y2 = r;
			var x2 = c;
			var y1 = this.get_row();
			var x1 = this.get_col();
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			var er = 0;
			var list = [];
			if (dy === 0) {
				if (dx === 0) {
					list.add($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()));
					return list;
				}
				for (; x1 < x2; ++x1) {
					//right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				for (; x1 > x2; --x1) {
					//left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (dx === 0) {
				for (; y1 > y2; --y1) {
					//up
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				for (; y1 < y2; ++y1) {
					//down
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 + x1 === y2 + x2) {
				//slope is -1
				for (; x1 < x2; ++x1) {
					//up-right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					--y1;
				}
				for (; x1 > x2; --x1) {
					//down-left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					++y1;
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 - x1 === y2 - x2) {
				//slope is 1
				for (; x1 < x2; ++x1) {
					//down-right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					++y1;
				}
				for (; x1 > x2; --x1) {
					//up-left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					--y1;
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 < y2) {
				//down
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 < x2; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								++y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 < y2; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								++x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 > x2; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								++y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 < y2; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								--x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
			}
			else {
				//up
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 < x2; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								--y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 > y2; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								++x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 > x2; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								--y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 > y2; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								--x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
			}
		},
		getExtendedBresenhamLine: function(o) {
			return this.getExtendedBresenhamLine$1(o.get_row(), o.get_col());
		},
		getExtendedBresenhamLine$1: function(r, c) {
			//extends to edge of map
			var y2 = r;
			var x2 = c;
			var y1 = this.get_row();
			var x1 = this.get_col();
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			var er = 0;
			var COLS = $Forays_Global.COLS;
			//for laziness
			var ROWS = $Forays_Global.ROWS;
			var list = [];
			if (dy === 0) {
				if (dx === 0) {
					list.add($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()));
					return list;
				}
				if (x1 < x2) {
					for (; x1 <= COLS - 1; ++x1) {
						//right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				else {
					for (; x1 >= 0; --x1) {
						//left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				return list;
			}
			if (dx === 0) {
				if (y1 > y2) {
					for (; y1 >= 0; --y1) {
						//up
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				else {
					for (; y1 <= ROWS - 1; ++y1) {
						//down
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				return list;
			}
			if (y1 + x1 === y2 + x2) {
				//slope is -1
				if (x1 < x2) {
					for (; x1 <= COLS - 1 && y1 >= 0; ++x1) {
						//up-right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						--y1;
					}
				}
				else {
					for (; x1 >= 0 && y1 <= ROWS - 1; --x1) {
						//down-left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						++y1;
					}
				}
				return list;
			}
			if (y1 - x1 === y2 - x2) {
				//slope is 1
				if (x1 < x2) {
					for (; x1 <= COLS - 1 && y1 <= ROWS - 1; ++x1) {
						//down-right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						++y1;
					}
				}
				else {
					for (; x1 >= 0 && y1 >= 0; --x1) {
						//up-left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						--y1;
					}
				}
				return list;
			}
			if (y1 < y2) {
				//down
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 <= COLS - 1 && y1 <= ROWS - 1; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								++y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 <= ROWS - 1 && x1 <= COLS - 1; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								++x1;
								er -= dy;
							}
						}
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 >= 0 && y1 <= ROWS - 1; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								++y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 <= ROWS - 1 && x1 >= 0; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								--x1;
								er -= dy;
							}
						}
						return list;
					}
				}
			}
			else {
				//up
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 <= COLS - 1 && y1 >= 0; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								--y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 >= 0 && x1 <= COLS - 1; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								++x1;
								er -= dy;
							}
						}
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 >= 0 && y1 >= 0; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 >= dx) {
								--y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 >= 0 && x1 >= 0; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 >= dy) {
								--x1;
								er -= dy;
							}
						}
						return list;
					}
				}
			}
		},
		getAlternateBresenhamLine: function(o) {
			return this.getAlternateBresenhamLine$1(o.get_row(), o.get_col());
		},
		getAlternateBresenhamLine$1: function(r, c) {
			//bresenham (inverted y)
			var y2 = r;
			var x2 = c;
			var y1 = this.get_row();
			var x1 = this.get_col();
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			var er = 0;
			var list = [];
			if (dy === 0) {
				if (dx === 0) {
					list.add($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()));
					return list;
				}
				for (; x1 < x2; ++x1) {
					//right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				for (; x1 > x2; --x1) {
					//left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (dx === 0) {
				for (; y1 > y2; --y1) {
					//up
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				for (; y1 < y2; ++y1) {
					//down
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 + x1 === y2 + x2) {
				//slope is -1
				for (; x1 < x2; ++x1) {
					//up-right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					--y1;
				}
				for (; x1 > x2; --x1) {
					//down-left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					++y1;
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 - x1 === y2 - x2) {
				//slope is 1
				for (; x1 < x2; ++x1) {
					//down-right
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					++y1;
				}
				for (; x1 > x2; --x1) {
					//up-left
					list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					--y1;
				}
				list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
				return list;
			}
			if (y1 < y2) {
				//down
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 < x2; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								++y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 < y2; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								++x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 > x2; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								++y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 < y2; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								--x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
			}
			else {
				//up
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 < x2; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								--y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 > y2; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								++x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 > x2; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								--y1;
								er -= dx;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 > y2; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								--x1;
								er -= dy;
							}
						}
						list.add($Forays_PhysicalObject.get_m().tile.get_item(r, c));
						return list;
					}
				}
			}
		},
		getAlternateExtendedBresenhamLine: function(o) {
			return this.getAlternateExtendedBresenhamLine$1(o.get_row(), o.get_col());
		},
		getAlternateExtendedBresenhamLine$1: function(r, c) {
			//extends to edge of map
			var y2 = r;
			var x2 = c;
			var y1 = this.get_row();
			var x1 = this.get_col();
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			var er = 0;
			var COLS = $Forays_Global.COLS;
			//for laziness
			var ROWS = $Forays_Global.ROWS;
			var list = [];
			if (dy === 0) {
				if (dx === 0) {
					list.add($Forays_PhysicalObject.get_m().tile.get_item(this.get_row(), this.get_col()));
					return list;
				}
				if (x1 < x2) {
					for (; x1 <= COLS - 1; ++x1) {
						//right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				else {
					for (; x1 >= 0; --x1) {
						//left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				return list;
			}
			if (dx === 0) {
				if (y1 > y2) {
					for (; y1 >= 0; --y1) {
						//up
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				else {
					for (; y1 <= ROWS - 1; ++y1) {
						//down
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
					}
				}
				return list;
			}
			if (y1 + x1 === y2 + x2) {
				//slope is -1
				if (x1 < x2) {
					for (; x1 <= COLS - 1 && y1 >= 0; ++x1) {
						//up-right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						--y1;
					}
				}
				else {
					for (; x1 >= 0 && y1 <= ROWS - 1; --x1) {
						//down-left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						++y1;
					}
				}
				return list;
			}
			if (y1 - x1 === y2 - x2) {
				//slope is 1
				if (x1 < x2) {
					for (; x1 <= COLS - 1 && y1 <= ROWS - 1; ++x1) {
						//down-right
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						++y1;
					}
				}
				else {
					for (; x1 >= 0 && y1 >= 0; --x1) {
						//up-left
						list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
						--y1;
					}
				}
				return list;
			}
			if (y1 < y2) {
				//down
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 <= COLS - 1 && y1 <= ROWS - 1; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								++y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 <= ROWS - 1 && x1 <= COLS - 1; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								++x1;
								er -= dy;
							}
						}
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 >= 0 && y1 <= ROWS - 1; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								++y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 <= ROWS - 1 && x1 >= 0; ++y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								--x1;
								er -= dy;
							}
						}
						return list;
					}
				}
			}
			else {
				//up
				if (x1 < x2) {
					//right
					if (dx > dy) {
						//slope less than 1
						for (; x1 <= COLS - 1 && y1 >= 0; ++x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								--y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 >= 0 && x1 <= COLS - 1; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								++x1;
								er -= dy;
							}
						}
						return list;
					}
				}
				else {
					//left
					if (dx > dy) {
						//slope less than 1
						for (; x1 >= 0 && y1 >= 0; --x1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dy;
							if (er << 1 > dx) {
								--y1;
								er -= dx;
							}
						}
						return list;
					}
					else {
						//slope greater than 1
						for (; y1 >= 0 && x1 >= 0; --y1) {
							list.add($Forays_PhysicalObject.get_m().tile.get_item(y1, x1));
							er += dx;
							if (er << 1 > dy) {
								--x1;
								er -= dy;
							}
						}
						return list;
					}
				}
			}
		},
		hasLOE: function(o) {
			return this.hasLOE$1(o.get_row(), o.get_col());
		},
		hasLOE$1: function(r, c) {
			var y1 = this.get_row();
			var x1 = this.get_col();
			var y2 = r;
			var x2 = c;
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			if (dx <= 1 && dy <= 1) {
				//everything adjacent
				return true;
			}
			if (this.hasBresenhamLineOfEffect(r, c)) {
				//basic LOE check
				return true;
			}
			if (!$Forays_PhysicalObject.get_m().tile.get_item(r, c).get_passable()) {
				//for walls, check nearby tiles
				var $t1 = $Forays_PhysicalObject.get_m().tile.get_item(r, c).neighborsBetween(this.get_row(), this.get_col());
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (this.hasBresenhamLineOfEffect(t.get_row(), t.get_col())) {
						return true;
					}
				}
			}
			return false;
		},
		hasBresenhamLineOfEffect: function(r, c) {
			var line = this.getBestLineOfEffect$1(r, c);
			var length = line.length;
			if (length === 1) {
				return true;
			}
			for (var i = 1; i < length - 1; ++i) {
				//todo: experimentally changed i=0 to i=1, to skip the first tile.
				if (!line[i].get_passable()) {
					// this should allow actors to fire out of solid tiles.
					return false;
				}
			}
			return true;
		},
		getBestLineOfEffect: function(o) {
			return this.getBestLineOfEffect$1(o.get_row(), o.get_col());
		},
		getBestLineOfEffect$1: function(r, c) {
			var list = this.getBresenhamLine$1(r, c);
			var list2 = this.getAlternateBresenhamLine$1(r, c);
			for (var i = 0; i < list.length; ++i) {
				if (!list2[i].get_passable()) {
					return list;
				}
				if (!list[i].get_passable()) {
					return list2;
				}
			}
			return list;
		},
		getBestExtendedLineOfEffect: function(o) {
			return this.getBestExtendedLineOfEffect$1(o.get_row(), o.get_col());
		},
		getBestExtendedLineOfEffect$1: function(r, c) {
			var list = this.getExtendedBresenhamLine$1(r, c);
			var list2 = this.getAlternateExtendedBresenhamLine$1(r, c);
			for (var i = 0; i < list.length; ++i) {
				if (!list2[i].get_passable()) {
					return list;
				}
				if (!list[i].get_passable()) {
					return list2;
				}
			}
			return list;
		}
	};
	$Forays_PhysicalObject.$ctor1 = function(name_, symbol_, color_) {
		this.p = null;
		this.$1$nameField = null;
		this.$1$a_nameField = null;
		this.$1$the_nameField = null;
		this.$1$symbolField = null;
		this.$1$colorField = 0;
		this.$1$light_radiusField = 0;
		this.p = new $Forays_pos(-1, -1);
		this.set_row(-1);
		this.set_col(-1);
		this.setName(name_);
		this.set_symbol(String.fromCharCode(symbol_));
		this.set_color(color_);
		this.set_light_radius(0);
	};
	$Forays_PhysicalObject.$ctor1.prototype = $Forays_PhysicalObject.prototype;
	$Forays_PhysicalObject.get_m = function() {
		return $Forays_PhysicalObject.$1$MField;
	};
	$Forays_PhysicalObject.set_m = function(value) {
		$Forays_PhysicalObject.$1$MField = value;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.pos
	var $Forays_pos = function(r, c) {
		this.row = 0;
		this.col = 0;
		this.row = r;
		this.col = c;
	};
	$Forays_pos.prototype = {
		distanceFrom: function(o) {
			return this.distanceFrom$2(o.get_row(), o.get_col());
		},
		distanceFrom$1: function(p) {
			return this.distanceFrom$2(p.row, p.col);
		},
		distanceFrom$2: function(r, c) {
			var dy = Math.abs(r - this.row);
			var dx = Math.abs(c - this.col);
			if (dx > dy) {
				return dx;
			}
			else {
				return dy;
			}
		},
		estimatedEuclideanDistanceFromX10: function(o) {
			return this.estimatedEuclideanDistanceFromX10$2(o.get_row(), o.get_col());
		},
		estimatedEuclideanDistanceFromX10$1: function(p) {
			return this.estimatedEuclideanDistanceFromX10$2(p.row, p.col);
		},
		estimatedEuclideanDistanceFromX10$2: function(r, c) {
			// x10 so that orthogonal directions are closer than diagonals
			var dy = Math.abs(r - this.row) * 10;
			var dx = Math.abs(c - this.col) * 10;
			if (dx > dy) {
				return dx + ss.Int32.div(dy, 2);
			}
			else {
				return dy + ss.Int32.div(dx, 2);
			}
		},
		positionsWithinDistance: function(dist) {
			return this.positionsWithinDistance$1(dist, false);
		},
		positionsWithinDistance$1: function(dist, exclude_origin) {
			var result = [];
			for (var i = this.row - dist; i <= this.row + dist; ++i) {
				for (var j = this.col - dist; j <= this.col + dist; ++j) {
					if (i !== this.row || j !== this.col || exclude_origin === false) {
						if ($Forays_Global.boundsCheck(i, j)) {
							result.add(new $Forays_pos(i, j));
						}
					}
				}
			}
			return result;
		},
		positionsAtDistance: function(dist) {
			var result = [];
			for (var i = this.row - dist; i <= this.row + dist; ++i) {
				for (var j = this.col - dist; j <= this.col + dist; ++j) {
					if (this.distanceFrom$2(i, j) === dist && $Forays_Global.boundsCheck(i, j)) {
						result.add(new $Forays_pos(i, j));
					}
				}
			}
			return result;
		},
		positionInDirection: function(dir) {
			switch (dir) {
				case 1: {
					return new $Forays_pos(this.row + 1, this.col - 1);
				}
				case 2: {
					return new $Forays_pos(this.row + 1, this.col);
				}
				case 3: {
					return new $Forays_pos(this.row + 1, this.col + 1);
				}
				case 4: {
					return new $Forays_pos(this.row, this.col - 1);
				}
				case 5: {
					return new $Forays_pos(this.row, this.col);
				}
				case 6: {
					return new $Forays_pos(this.row, this.col + 1);
				}
				case 7: {
					return new $Forays_pos(this.row - 1, this.col - 1);
				}
				case 8: {
					return new $Forays_pos(this.row - 1, this.col);
				}
				case 9: {
					return new $Forays_pos(this.row - 1, this.col + 1);
				}
				default: {
					return new $Forays_pos(-2, -2);
				}
			}
		},
		boundsCheck: function() {
			if (this.row >= 0 && this.row < $Forays_Global.ROWS && this.col >= 0 && this.col < $Forays_Global.COLS) {
				return true;
			}
			return false;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Queue
	var $Forays_Queue = function(g) {
		this.list = null;
		this.$1$turnField = 0;
		this.list = [];
		this.set_turn(0);
		$Forays_Queue.set_b(g.b);
	};
	$Forays_Queue.prototype = {
		get_turn: function() {
			return this.$1$turnField;
		},
		set_turn: function(value) {
			this.$1$turnField = value;
		},
		count: function() {
			return this.list.length;
		},
		get_tiebreaker: function() {
			if (this.list.length > 0) {
				return this.list[0].get_tiebreaker();
			}
			else {
				return -1;
			}
		},
		add: function(e) {
			if (e.timeToExecute() === this.get_turn()) {
				//0-time action
				this.list.insert(0, e);
			}
			else if (this.list.length === 0 || this.list.length > 0 && ss.isNullOrUndefined(this.list[0])) {
				this.list.insert(0, e);
			}
			else if (this.list.length > 0 && $Forays_Event.op_GreaterThanOrEqual(e, this.list[this.list.length - 1])) {
				this.list.insert(this.list.length, e);
			}
			else if (this.list.length > 0 && $Forays_Event.op_LessThan(e, this.list[0])) {
				this.list.insert(0, e);
			}
			else {
				//it's going between two events
				var current = this.list[this.list.length - 1];
				var cr = this.list.length;
				while (true) {
					cr--;
					if ($Forays_Event.op_GreaterThanOrEqual(e, this.list[cr])) {
						this.list.insert(cr + 1, e);
						return;
					}
				}
				//if(e.TimeToExecute() == current.Value.TimeToExecute()){
				//if(e.type != EventType.MOVE){
				//list.AddAfter(current,e);
				//return;
				//}
				//else{
				//while(current.Value.type != EventType.MOVE){
				//if(current == list.First){
				//list.AddFirst(e);
				//return;
				//}
				//else{
				//if(e.TimeToExecute() != current.Previous.Value.TimeToExecute()){
				//list.AddBefore(current,e);
				//return;
				//}
				//else{
				//current = current.Previous;
				//}
				//}
				//}
				//list.AddAfter(current,e);
				//return;
				//}
				//}
				//else{
				//if(e < current.Value){
				//if(e > current.Previous.Value){
				//list.AddBefore(current,e);
				//return;
				//}
				//else{
				//current = current.Previous;
				//}
				//}
				//}
				//}
			}
		},
		pop: function() {
			this.set_turn(this.list[0].timeToExecute());
			var e = this.list[0];
			//list.First.Value.Execute();
			//list.RemoveFirst();
			try {
				e.execute();
			}
			catch ($t1) {
				var ex = ss.Exception.wrap($t1);
				window.alert('Exception!  \n  ' + ex.get_message());
			}
			$Forays_Game.game.e.lock();
			window.setTimeout(function() {
				$Forays_Game.game.e.unlock();
			}, 1000);
			this.list.remove(e);
			return true;
		},
		resetForNewLevel: function() {
			var newlist = [];
			var i = 0;
			for (var current = this.list[0]; ss.isValue(current); i++, current = this.list[i]) {
				if (ss.referenceEquals(current.get_target(), $Forays_Event.get_player())) {
					newlist.insert(newlist.length, current);
				}
			}
			this.list = newlist;
		},
		killEvents$1: function(target, type) {
			var i = 0;
			for (var current = this.list[0]; ss.isValue(current); i++, current = this.list[i]) {
				current.kill$1(target, type);
			}
		},
		killEvents: function(target, attr) {
			var i = 0;
			for (var current = this.list[0]; ss.isValue(current); i++, current = this.list[i]) {
				current.kill(target, attr);
			}
		},
		contains: function(type) {
			var i = 0;
			for (var current = this.list[0]; ss.isValue(current); i++, current = this.list[i]) {
				if (current.get_evtype() === type) {
					return true;
				}
			}
			return false;
		},
		updateTiebreaker: function(new_tiebreaker) {
			var i = 0;
			for (var current = this.list[0]; ss.isValue(current); i++, current = this.list[i]) {
				if (current.get_tiebreaker() >= new_tiebreaker) {
					current.set_tiebreaker(current.get_tiebreaker() + 1);
				}
			}
		}
	};
	$Forays_Queue.get_b = function() {
		return $Forays_Queue.$1$BField;
	};
	$Forays_Queue.set_b = function(value) {
		$Forays_Queue.$1$BField = value;
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.ROTConsole
	var $Forays_ROTConsole = function() {
		this.display = null;
		this.cursorLeft = 0;
		this.cursorTop = 0;
		this.cursorVisible = false;
		this.$bg = null;
		this.$fg = null;
		this.background = 0;
		this.foreground = 15;
		this.keyAvailable = false;
		this.$intercept = false;
		this.$kc = new $Forays_ConsoleKeyInfo(97);
		this.$1$isReadingField = false;
		this.display = new ROT.Display({ width: 80, height: 27 });
	};
	$Forays_ROTConsole.prototype = {
		get_backgroundColor: function() {
			return this.background;
		},
		set_backgroundColor: function(value) {
			this.background = value;
			this.$assignBG(value);
		},
		$assignBG: function(value) {
			switch (value) {
				case 0: {
					this.$bg = '#000000';
					break;
				}
				case 9: {
					this.$bg = '#0000FF';
					break;
				}
				case 11: {
					this.$bg = '#00FFFF';
					break;
				}
				case 1: {
					this.$bg = '#000099';
					break;
				}
				case 3: {
					this.$bg = '#009999';
					break;
				}
				case 8: {
					this.$bg = '#666666';
					break;
				}
				case 2: {
					this.$bg = '#009900';
					break;
				}
				case 5: {
					this.$bg = '#990099';
					break;
				}
				case 4: {
					this.$bg = '#990000';
					break;
				}
				case 6: {
					this.$bg = '#999900';
					break;
				}
				case 7: {
					this.$bg = '#AAAAAA';
					break;
				}
				case 10: {
					this.$bg = '#00FF00';
					break;
				}
				case 13: {
					this.$bg = '#FF00FF';
					break;
				}
				case 12: {
					this.$bg = '#FF0000';
					break;
				}
				case 15: {
					this.$bg = '#FFFFFF';
					break;
				}
				case 14: {
					this.$bg = '#FFFF00';
					break;
				}
			}
		},
		$assignFG: function(value) {
			switch (value) {
				case 0: {
					this.$fg = '#000000';
					break;
				}
				case 9: {
					this.$fg = '#0000FF';
					break;
				}
				case 11: {
					this.$fg = '#00FFFF';
					break;
				}
				case 1: {
					this.$fg = '#000099';
					break;
				}
				case 3: {
					this.$fg = '#009999';
					break;
				}
				case 8: {
					this.$fg = '#666666';
					break;
				}
				case 2: {
					this.$fg = '#009900';
					break;
				}
				case 5: {
					this.$fg = '#990099';
					break;
				}
				case 4: {
					this.$fg = '#990000';
					break;
				}
				case 6: {
					this.$fg = '#999900';
					break;
				}
				case 7: {
					this.$fg = '#AAAAAA';
					break;
				}
				case 10: {
					this.$fg = '#00FF00';
					break;
				}
				case 13: {
					this.$fg = '#FF00FF';
					break;
				}
				case 12: {
					this.$fg = '#FF0000';
					break;
				}
				case 15: {
					this.$fg = '#FFFFFF';
					break;
				}
				case 14: {
					this.$fg = '#FFFF00';
					break;
				}
			}
		},
		get_foregroundColor: function() {
			return this.foreground;
		},
		set_foregroundColor: function(value) {
			this.foreground = value;
			this.$assignFG(value);
		},
		$processKey: function(elem, ev) {
			var m = 0;
			if (ev.altKey) {
				m = m | $Forays_ConsoleModifiers.alt;
			}
			if (ev.ctrlKey) {
				m = m | $Forays_ConsoleModifiers.control;
			}
			if (ev.shiftKey) {
				m = m | $Forays_ConsoleModifiers.shift;
			}
			if (m !== 0) {
				this.$kc = new $Forays_ConsoleKeyInfo.$ctor2(ev.which, m);
			}
			else {
				this.$kc = new $Forays_ConsoleKeyInfo.$ctor1(ev.which);
			}
			//if (!Intercept && KeyAvailable)
			//{
			//// SetCursorPosition(CursorLeft - 1, CursorTop);
			//Write(kc.KeyChar);
			//}
			$('#key').replaceWith('<div id="key"><p>Key Down, Key is ' + this.$kc.key + ', Char is ' + String.fromCharCode(this.$kc.keyChar) + '</p></div>');
			//cki = Task<ConsoleKeyInfo>.FromResult(kc);
			this.keyAvailable = false;
			//jQuery.Select("#main").Off("keyup", "canvas", processKey);
			//defr = new TaskCompletionSource<ConsoleKeyInfo>();
			//defr.TrySetResult(kc);
			this.set_isReading(false);
			$Forays_Game.game.e = $Forays_Game.game.e.unlock();
		},
		readKey: function(intercept) {
			//            cki = null;
			this.$intercept = intercept;
			this.set_isReading(true);
			$Forays_Game.game.e.lock();
			// defr = new TaskCompletionSource<ConsoleKeyInfo>();
			//defr.Done(() => );
			$('body').one('keyup', Function.thisFix(Function.mkdel(this, this.$processKey)));
			//(, 2, "on", "keydown", "canvas", "processKey");
			//while (cki == null)
			//Task.Delay(35);
			return this.$kc;
		},
		setCursorPosition: function(x, y) {
			this.cursorLeft = x;
			this.cursorTop = y;
		},
		write$1: function(text) {
			for (var i = 0; i < text.length; i++) {
				this.display.draw(this.cursorLeft + i, this.cursorTop, String.fromCharCode(text.charCodeAt(i)), this.$fg, this.$bg);
			}
		},
		write: function(text) {
			this.display.draw(this.cursorLeft, this.cursorTop, String.fromCharCode(text), this.$fg, this.$bg);
		},
		get_isReading: function() {
			return this.$1$isReadingField;
		},
		set_isReading: function(value) {
			this.$1$isReadingField = value;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Screen
	var $Forays_Screen = function() {
	};
	$Forays_Screen.get_foregroundColor = function() {
		if ($Forays_Global.LINUX && $Forays_Screen.$terminal_bold) {
			return $Forays_Game.console.get_foregroundColor() + 8;
		}
		return $Forays_Game.console.get_foregroundColor();
	};
	$Forays_Screen.set_foregroundColor = function(value) {
		//if(Global.LINUX && (int)value >= 8){
		//    Game.Console.ForegroundColor = value - 8;
		//    if(!terminal_bold){
		//        terminal_bold = true;
		//        Game.Console.Write(bold_on);
		//    }
		//}
		//else{
		//    if(Global.LINUX && terminal_bold){
		//        Game.Console.Write(bold_off);
		//        terminal_bold = false;
		//    }
		$Forays_Game.console.set_foregroundColor(value);
		//}
	};
	$Forays_Screen.get_backgroundColor = function() {
		return $Forays_Game.console.get_backgroundColor();
	};
	$Forays_Screen.set_backgroundColor = function(value) {
		if ($Forays_Global.LINUX && value >= 8) {
			$Forays_Game.console.set_backgroundColor(value - 8);
		}
		else {
			$Forays_Game.console.set_backgroundColor(value);
		}
	};
	$Forays_Screen.char = function(r, c) {
		return $Forays_Screen.$memory.get(r, c);
	};
	$Forays_Screen.mapChar = function(r, c) {
		return $Forays_Screen.$memory.get(r + $Forays_Global.maP_OFFSET_ROWS, c + $Forays_Global.maP_OFFSET_COLS);
	};
	$Forays_Screen.statsChar = function(r, c) {
		return $Forays_Screen.$memory.get(r, c);
	};
	$Forays_Screen.blankChar = function() {
		return new $Forays_colorchar.$ctor1(0, 32);
	};
	$Forays_Screen.getCurrentScreen = function() {
		var result = Array.multidim($Forays_colorchar.getDefaultValue(), $Forays_Global.screeN_H, $Forays_Global.screeN_W);
		for (var i = 0; i < $Forays_Global.screeN_H; ++i) {
			for (var j = 0; j < $Forays_Global.screeN_W; ++j) {
				result.set(i, j, $Forays_Screen.char(i, j));
			}
		}
		return result;
	};
	$Forays_Screen.getCurrentMap = function() {
		var result = Array.multidim($Forays_colorchar.getDefaultValue(), $Forays_Global.ROWS, $Forays_Global.COLS);
		for (var i = 0; i < $Forays_Global.ROWS; ++i) {
			for (var j = 0; j < $Forays_Global.COLS; ++j) {
				result.set(i, j, $Forays_Screen.mapChar(i, j));
			}
		}
		return result;
	};
	$Forays_Screen.getCurrentRect = function(row, col, height, width) {
		var result = Array.multidim($Forays_colorchar.getDefaultValue(), height, width);
		for (var i = 0; i < height; ++i) {
			for (var j = 0; j < width; ++j) {
				result.set(i, j, $Forays_Screen.char(row + i, col + j));
			}
		}
		return result;
	};
	$Forays_Screen.boundsCheck = function(r, c) {
		if (r >= 0 && r < $Forays_Global.screeN_H && c >= 0 && c < $Forays_Global.screeN_W) {
			return true;
		}
		return false;
	};
	$Forays_Screen.mapBoundsCheck = function(r, c) {
		if (r >= 0 && r < $Forays_Global.ROWS && c >= 0 && c < $Forays_Global.COLS) {
			return true;
		}
		return false;
	};
	$Forays_Screen.blank = function() {
		//jQuery.Select("#main").ReplaceWith(Game.Console.display.getContainer());
		$Forays_Game.console.cursorVisible = false;
		for (var i = 0; i < $Forays_Global.screeN_H; ++i) {
			$Forays_Game.console.setCursorPosition(0, i);
			$Forays_Game.console.write$1(''.padRight($Forays_Global.screeN_W));
			for (var j = 0; j < $Forays_Global.screeN_W; ++j) {
				$Forays_Screen.$memory.get(i, j).c = ' ';
				$Forays_Screen.$memory.get(i, j).color = 0;
				$Forays_Screen.$memory.get(i, j).bgcolor = 0;
			}
		}
		$Forays_Game.console.display.clear();
	};
	$Forays_Screen.writeChar$1 = function(r, c, ch) {
		$Forays_Screen.writeChar(r, c, new $Forays_colorchar.$ctor1(2, ch));
	};
	$Forays_Screen.writeChar$2 = function(r, c, ch, color) {
		$Forays_Screen.writeChar(r, c, new $Forays_colorchar.$ctor3(ch, color));
	};
	$Forays_Screen.writeChar = function(r, c, ch) {
		if (!$Forays_Screen.$memory.get(r, c).equals(ch)) {
			ch.color = $Forays_Screen.resolveColor(ch.color);
			ch.bgcolor = $Forays_Screen.resolveColor(ch.bgcolor);
			$Forays_Screen.$memory.set(r, c, ch);
			var co = $Forays_Screen.getColor(ch.color);
			if (co !== $Forays_Screen.get_foregroundColor()) {
				$Forays_Screen.set_foregroundColor(co);
			}
			co = $Forays_Screen.getColor(ch.bgcolor);
			if (co !== $Forays_Game.console.get_backgroundColor() || $Forays_Global.LINUX && ch.c === ' ' && ch.color === 0) {
				//voodoo here. not sure why this is needed. (possible Mono bug)
				$Forays_Screen.set_backgroundColor(co);
			}
			$Forays_Game.console.setCursorPosition(c, r);
			$Forays_Game.console.write$1(ch.c);
		}
	};
	$Forays_Screen.writeArray = function(r, c, array) {
		var h = array.getLength(0);
		var w = array.getLength(1);
		for (var i = 0; i < h; ++i) {
			for (var j = 0; j < w; ++j) {
				$Forays_Screen.writeChar(i + r, j + c, array.get(i, j));
			}
		}
	};
	$Forays_Screen.writeList = function(r, c, ls) {
		var line = r;
		for (var $t1 = 0; $t1 < ls.length; $t1++) {
			var cs = ls[$t1];
			$Forays_Screen.writeString(line, c, cs);
			++line;
		}
	};
	$Forays_Screen.writeString$2 = function(r, c, s) {
		$Forays_Screen.writeString$1(r, c, new $Forays_cstr(2, s));
	};
	$Forays_Screen.writeString$3 = function(r, c, s, color) {
		$Forays_Screen.writeString$1(r, c, new $Forays_cstr.$ctor1(s, color));
	};
	$Forays_Screen.writeString$1 = function(r, c, s) {
		if ($Forays_Global.screeN_W - c > s.s.length) {
			//s.s = s.s.Substring(0,; //don't move down to the next line
		}
		else {
			s.s = s.s.substring(0, $Forays_Global.screeN_W - c);
		}
		if (s.s.length > 0) {
			s.color = $Forays_Screen.resolveColor(s.color);
			s.bgcolor = $Forays_Screen.resolveColor(s.bgcolor);
			var cch = new $Forays_colorchar.$ctor7(32, s.color, s.bgcolor);
			cch.color = s.color;
			cch.bgcolor = s.bgcolor;
			var co = $Forays_Screen.getColor(s.color);
			if ($Forays_Screen.get_foregroundColor() !== co) {
				$Forays_Screen.set_foregroundColor(co);
			}
			co = $Forays_Screen.getColor(s.bgcolor);
			if ($Forays_Screen.get_backgroundColor() !== co) {
				$Forays_Screen.set_backgroundColor(co);
			}
			var i = 0;
			var changed = false;
			for (var ii = 0; ii < s.s.length; ii++) {
				cch.c = s.s.charAt(ii);
				if (!$Forays_Screen.$memory.get(r, c + i).equals(cch)) {
					$Forays_Screen.$memory.set(r, c + i, cch);
					changed = true;
				}
				++i;
			}
			if (changed) {
				$Forays_Game.console.setCursorPosition(c, r);
				$Forays_Game.console.write$1(s.s);
			}
		}
	};
	$Forays_Screen.writeString = function(r, c, cs) {
		if (cs.length() > 0) {
			var pos = c;
			for (var $t1 = 0; $t1 < cs.strings.length; $t1++) {
				var s1 = cs.strings[$t1];
				var s = new $Forays_cstr.$ctor3(s1.s, s1.color, s1.bgcolor);
				if (s.s.length + pos > $Forays_Global.screeN_W) {
					s.s = s.s.substring(0, $Forays_Global.screeN_W - pos);
				}
				s.color = $Forays_Screen.resolveColor(s.color);
				s.bgcolor = $Forays_Screen.resolveColor(s.bgcolor);
				var cch = new $Forays_colorchar.$ctor7(32, s.color, s.bgcolor);
				//cch.color = s.color;
				//cch.bgcolor = s.bgcolor;
				var co = $Forays_Screen.getColor(s.color);
				if ($Forays_Screen.get_foregroundColor() !== co) {
					$Forays_Screen.set_foregroundColor(co);
				}
				co = $Forays_Screen.getColor(s.bgcolor);
				if ($Forays_Screen.get_backgroundColor() !== co) {
					$Forays_Screen.set_backgroundColor(co);
				}
				var i = 0;
				var changed = false;
				for (var ii = 0; ii < s.s.length; ii++) {
					cch.c = s.s.charAt(ii);
					if (!$Forays_Screen.$memory.get(r, pos + i).equals(cch)) {
						$Forays_Screen.$memory.set(r, pos + i, cch);
						changed = true;
					}
					++i;
				}
				if (changed) {
					$Forays_Game.console.setCursorPosition(pos, r);
					$Forays_Game.console.write$1(s.s);
				}
				pos += s.s.length;
			}
		}
	};
	$Forays_Screen.resetColors = function() {
		if ($Forays_Screen.get_foregroundColor() !== 7) {
			$Forays_Screen.set_foregroundColor(7);
		}
		if ($Forays_Screen.get_backgroundColor() !== 0) {
			$Forays_Screen.set_backgroundColor(0);
		}
	};
	$Forays_Screen.writeMapChar$1 = function(r, c, ch) {
		$Forays_Screen.writeMapChar(r, c, new $Forays_colorchar.$ctor2(2, ch));
	};
	$Forays_Screen.writeMapChar$2 = function(r, c, ch, color) {
		$Forays_Screen.writeMapChar(r, c, new $Forays_colorchar.$ctor4(ch, color));
	};
	$Forays_Screen.writeMapChar = function(r, c, ch) {
		$Forays_Screen.writeChar(r + $Forays_Global.maP_OFFSET_ROWS, c + $Forays_Global.maP_OFFSET_COLS, ch);
	};
	$Forays_Screen.writeMapString$2 = function(r, c, s) {
		var cs = new $Forays_cstr.$ctor2(2, 0, s);
		cs.color = 2;
		cs.bgcolor = 0;
		cs.s = s;
		$Forays_Screen.writeMapString$1(r, c, cs);
	};
	$Forays_Screen.writeMapString$3 = function(r, c, s, color) {
		var cs = new $Forays_cstr.$ctor2(color, 0, s);
		//cs.color = color;
		//cs.bgcolor = Color.Black;
		//cs.s = s;
		$Forays_Screen.writeMapString$1(r, c, cs);
	};
	$Forays_Screen.writeMapString$1 = function(r, c, s) {
		if ($Forays_Global.COLS - c > s.s.length) {
			//s.s = s.s.Substring(0); //don't move down to the next line
		}
		else {
			s.s = s.s.substring(0, $Forays_Global.COLS - c);
		}
		if (s.s.length > 0) {
			r += $Forays_Global.maP_OFFSET_ROWS;
			c += $Forays_Global.maP_OFFSET_COLS;
			s.color = $Forays_Screen.resolveColor(s.color);
			s.bgcolor = $Forays_Screen.resolveColor(s.bgcolor);
			var cch = new $Forays_colorchar.$ctor7(32, s.color, s.bgcolor);
			//cch.color = s.color;
			//cch.bgcolor = s.bgcolor;
			var co = $Forays_Screen.getColor(s.color);
			if ($Forays_Screen.get_foregroundColor() !== co) {
				$Forays_Screen.set_foregroundColor(co);
			}
			co = $Forays_Screen.getColor(s.bgcolor);
			if ($Forays_Screen.get_backgroundColor() !== co) {
				$Forays_Screen.set_backgroundColor(co);
			}
			var i = 0;
			var changed = false;
			for (var ii = 0; ii < s.s.length; ii++) {
				cch.c = s.s.charAt(ii);
				if (!$Forays_Screen.$memory.get(r, c + i).equals(cch)) {
					$Forays_Screen.$memory.set(r, c + i, cch);
					changed = true;
				}
				++i;
			}
			if (changed) {
				$Forays_Game.console.setCursorPosition(c, r);
				$Forays_Game.console.write$1(s.s);
			}
		}
	};
	$Forays_Screen.writeMapString = function(r, c, cs) {
		if (cs.length() > 0) {
			r += $Forays_Global.maP_OFFSET_ROWS;
			c += $Forays_Global.maP_OFFSET_COLS;
			var cpos = c;
			for (var $t1 = 0; $t1 < cs.strings.length; $t1++) {
				var s1 = cs.strings[$t1];
				var s = new $Forays_cstr.$ctor3(s1.s, s1.color, s1.bgcolor);
				if (cpos - $Forays_Global.maP_OFFSET_COLS + s.s.length > $Forays_Global.COLS) {
					s.s = s.s.substring(0, $Forays_Global.COLS - (cpos - $Forays_Global.maP_OFFSET_COLS));
				}
				s.color = $Forays_Screen.resolveColor(s.color);
				s.bgcolor = $Forays_Screen.resolveColor(s.bgcolor);
				var cch = new $Forays_colorchar.$ctor7(32, s.color, s.bgcolor);
				//					cch.color = s.color;
				//					cch.bgcolor = s.bgcolor;
				var co = $Forays_Screen.getColor(s.color);
				if ($Forays_Screen.get_foregroundColor() !== co) {
					$Forays_Screen.set_foregroundColor(co);
				}
				co = $Forays_Screen.getColor(s.bgcolor);
				if ($Forays_Screen.get_backgroundColor() !== co) {
					$Forays_Screen.set_backgroundColor(co);
				}
				var i = 0;
				var changed = false;
				for (var ii = 0; ii < s.s.length; ii++) {
					cch.c = s.s.charAt(ii);
					if (!$Forays_Screen.$memory.get(r, cpos + i).equals(cch)) {
						$Forays_Screen.$memory.set(r, cpos + i, cch);
						changed = true;
					}
					++i;
				}
				if (changed) {
					$Forays_Game.console.setCursorPosition(cpos, r);
					$Forays_Game.console.write$1(s.s);
				}
				cpos += s.s.length;
			}
			//if(cpos-Global.MAP_OFFSET_COLS < Global.COLS){
			//WriteString(r,cpos,"".PadRight(Global.COLS-(cpos-Global.MAP_OFFSET_COLS)));
			//}
		}
	};
	$Forays_Screen.writeStatsChar = function(r, c, ch) {
		$Forays_Screen.writeChar(r, c, ch);
	};
	$Forays_Screen.writeStatsString$1 = function(r, c, s) {
		var cs = new $Forays_cstr.$ctor2(2, 0, s);
		//cs.color = Color.Gray;
		//cs.bgcolor = Color.Black;
		//cs.s = s;
		$Forays_Screen.writeStatsString(r, c, cs);
	};
	$Forays_Screen.writeStatsString$2 = function(r, c, s, color) {
		var cs = new $Forays_cstr.$ctor2(color, 0, s);
		//cs.color = color;
		//cs.bgcolor = Color.Black;
		//cs.s = s;
		$Forays_Screen.writeStatsString(r, c, cs);
	};
	$Forays_Screen.writeStatsString = function(r, c, s) {
		if (12 - c > s.s.length) {
			//s.s = s.s.Substring(0); //don't move down to the next line - 12 is the width of the stats area
		}
		else {
			s.s = s.s.substring(0, 12 - c);
		}
		if (s.s.length > 0) {
			//++r; //was ++r
			s.color = $Forays_Screen.resolveColor(s.color);
			s.bgcolor = $Forays_Screen.resolveColor(s.bgcolor);
			var cch = new $Forays_colorchar.$ctor7(32, s.color, s.bgcolor);
			//cch.color = s.color;
			//cch.bgcolor = s.bgcolor;
			var co = $Forays_Screen.getColor(s.color);
			if ($Forays_Screen.get_foregroundColor() !== co) {
				$Forays_Screen.set_foregroundColor(co);
			}
			co = $Forays_Screen.getColor(s.bgcolor);
			if ($Forays_Screen.get_backgroundColor() !== co) {
				$Forays_Screen.set_backgroundColor(co);
			}
			var i = 0;
			for (var ii = 0; ii < s.s.length; ii++) {
				cch.c = s.s.charAt(ii);
				if (!$Forays_Screen.$memory.get(r, c + i).equals(cch)) {
					$Forays_Screen.$memory.set(r, c + i, cch);
				}
				++i;
			}
			$Forays_Game.console.setCursorPosition(c, r);
			$Forays_Game.console.write$1(s.s);
		}
	};
	$Forays_Screen.mapDrawWithStrings = function(array, row, col, height, width) {
		var s = new $Forays_cstr.$ctor3('', 0, 0);
		//s.s = "";
		//s.bgcolor = Color.Black;
		//s.color = Color.Black;
		var current_c = col;
		for (var i = row; i < row + height; ++i) {
			s.s = '';
			current_c = col;
			for (var j = col; j < col + width; ++j) {
				var ch = array.get(i, j);
				if ($Forays_Screen.resolveColor(ch.color) !== s.color) {
					if (s.s.length > 0) {
						$Forays_Screen.writeMapString$1(i, current_c, s);
						s.s = '';
						s.s += ch.c;
						s.color = ch.color;
						current_c = j;
					}
					else {
						s.s += ch.c;
						s.color = ch.color;
					}
				}
				else {
					s.s += ch.c;
				}
			}
			$Forays_Screen.writeMapString$1(i, current_c, s);
		}
	};
	$Forays_Screen.animateCell = function(r, c, ch, duration) {
		var prev = $Forays_Screen.$memory.get(r, c);
		$Forays_Screen.writeChar(r, c, ch);
		$Forays_Game.game.e.lock();
		window.setTimeout(function() {
			$Forays_Game.game.e.unlock();
		}, duration);
		$Forays_Screen.writeChar(r, c, prev);
	};
	$Forays_Screen.animateMapCell = function(r, c, ch) {
		$Forays_Screen.animateMapCell$1(r, c, ch, 50);
	};
	$Forays_Screen.animateMapCell$1 = function(r, c, ch, duration) {
		$Forays_Screen.animateCell(r + $Forays_Global.maP_OFFSET_ROWS, c + $Forays_Global.maP_OFFSET_COLS, ch, duration);
	};
	$Forays_Screen.animateMapCells$1 = function(cells, chars) {
		$Forays_Screen.animateMapCells$3(cells, chars, 50);
	};
	$Forays_Screen.animateMapCells$3 = function(cells, chars, duration) {
		var prev = [];
		var idx = 0;
		for (var $t1 = 0; $t1 < cells.length; $t1++) {
			var p = cells[$t1];
			prev.add($Forays_Screen.mapChar(p.row, p.col));
			$Forays_Screen.writeMapChar(p.row, p.col, chars[idx]);
			++idx;
		}
		$Forays_Game.game.e.lock();
		window.setTimeout(function() {
			$Forays_Game.game.e.unlock();
		}, duration);
		idx = 0;
		for (var $t2 = 0; $t2 < cells.length; $t2++) {
			var p1 = cells[$t2];
			$Forays_Screen.writeMapChar(p1.row, p1.col, prev[idx]);
			++idx;
		}
	};
	$Forays_Screen.animateMapCells = function(cells, ch) {
		$Forays_Screen.animateMapCells$2(cells, ch, 50);
	};
	$Forays_Screen.animateMapCells$2 = function(cells, ch, duration) {
		var prev = [];
		var idx = 0;
		for (var $t1 = 0; $t1 < cells.length; $t1++) {
			var p = cells[$t1];
			prev.add($Forays_Screen.mapChar(p.row, p.col));
			$Forays_Screen.writeMapChar(p.row, p.col, ch);
			++idx;
		}
		$Forays_Game.game.e.lock();
		window.setTimeout(function() {
			$Forays_Game.game.e.unlock();
		}, duration);
		idx = 0;
		for (var $t2 = 0; $t2 < cells.length; $t2++) {
			var p1 = cells[$t2];
			$Forays_Screen.writeMapChar(p1.row, p1.col, prev[idx]);
			++idx;
		}
	};
	$Forays_Screen.animateProjectile = function(list, ch) {
		$Forays_Screen.animateProjectile$1(list, ch, 50);
	};
	$Forays_Screen.animateProjectile$1 = function(list, ch, duration) {
		$Forays_Game.console.cursorVisible = false;
		list.removeAt(0);
		for (var $t1 = 0; $t1 < list.length; $t1++) {
			var t = list[$t1];
			$Forays_Screen.animateMapCell$1(t.get_row(), t.get_col(), ch, duration);
		}
		$Forays_Game.console.cursorVisible = true;
	};
	$Forays_Screen.animateBoltProjectile = function(list, color) {
		$Forays_Screen.animateBoltProjectile$1(list, color, 50);
	};
	$Forays_Screen.animateBoltProjectile$1 = function(list, color, duration) {
		$Forays_Game.console.cursorVisible = false;
		var ch = new $Forays_colorchar.$ctor7(33, color, 0);
		//ch.color = color;
		//ch.bgcolor = Color.Black;
		//ch.c='!';
		switch (list[0].directionOf(list[list.length - 1])) {
			case 7:
			case 3: {
				ch.c = '\\';
				break;
			}
			case 8:
			case 2: {
				ch.c = '|';
				break;
			}
			case 9:
			case 1: {
				ch.c = '/';
				break;
			}
			case 4:
			case 6: {
				ch.c = '-';
				break;
			}
		}
		list.removeAt(0);
		for (var $t1 = 0; $t1 < list.length; $t1++) {
			var t = list[$t1];
			$Forays_Screen.animateMapCell$1(t.get_row(), t.get_col(), ch, duration);
		}
		$Forays_Game.console.cursorVisible = true;
	};
	$Forays_Screen.animateExplosion = function(obj, radius, ch) {
		$Forays_Screen.animateExplosion$3(obj, radius, ch, 50, false);
	};
	$Forays_Screen.animateExplosion$1 = function(obj, radius, ch, single_frame) {
		$Forays_Screen.animateExplosion$3(obj, radius, ch, 50, single_frame);
	};
	$Forays_Screen.animateExplosion$2 = function(obj, radius, ch, duration) {
		$Forays_Screen.animateExplosion$3(obj, radius, ch, duration, false);
	};
	$Forays_Screen.animateExplosion$3 = function(obj, radius, ch, duration, single_frame) {
		$Forays_Game.console.cursorVisible = false;
		var prev = Array.multidim($Forays_colorchar.getDefaultValue(), radius * 2 + 1, radius * 2 + 1);
		for (var i = 0; i <= radius * 2; ++i) {
			for (var j = 0; j <= radius * 2; ++j) {
				if ($Forays_Screen.mapBoundsCheck(obj.get_row() - radius + i, obj.get_col() - radius + j)) {
					prev.set(i, j, $Forays_Screen.mapChar(obj.get_row() - radius + i, obj.get_col() - radius + j));
				}
			}
		}
		if (!single_frame) {
			for (var i1 = 0; i1 <= radius; ++i1) {
				var $t1 = obj.tilesAtDistance(i1);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), ch);
				}
				$Forays_Game.game.e.lock();
				window.setTimeout(function() {
					$Forays_Game.game.e.unlock();
				}, duration);
			}
		}
		else {
			var $t3 = obj.tilesWithinDistance(radius);
			for (var $t4 = 0; $t4 < $t3.length; $t4++) {
				var t1 = $t3[$t4];
				$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), ch);
			}
			$Forays_Game.game.e.lock();
			window.setTimeout(function() {
				$Forays_Game.game.e.unlock();
			}, duration);
		}
		for (var i2 = 0; i2 <= radius * 2; ++i2) {
			for (var j1 = 0; j1 <= radius * 2; ++j1) {
				if ($Forays_Screen.mapBoundsCheck(obj.get_row() - radius + i2, obj.get_col() - radius + j1)) {
					$Forays_Screen.writeMapChar(obj.get_row() - radius + i2, obj.get_col() - radius + j1, prev.get(i2, j1));
				}
			}
		}
		$Forays_Game.console.cursorVisible = true;
	};
	$Forays_Screen.animateBoltBeam = function(list, color) {
		$Forays_Screen.animateBoltBeam$1(list, color, 50);
	};
	$Forays_Screen.animateBoltBeam$1 = function(list, color, duration) {
		$Forays_Game.console.cursorVisible = false;
		var ch = new $Forays_colorchar.$ctor8('!', color, 0);
		//ch.color = color;
		//ch.bgcolor = Color.Black;
		//ch.c="!";
		switch (list[0].directionOf(list[list.length - 1])) {
			case 7:
			case 3: {
				ch.c = '\\';
				break;
			}
			case 8:
			case 2: {
				ch.c = '|';
				break;
			}
			case 9:
			case 1: {
				ch.c = '/';
				break;
			}
			case 4:
			case 6: {
				ch.c = '-';
				break;
			}
		}
		list.removeAt(0);
		var memlist = [];
		for (var $t1 = 0; $t1 < list.length; $t1++) {
			var t = list[$t1];
			memlist.add($Forays_Screen.mapChar(t.get_row(), t.get_col()));
			$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), ch);
			$Forays_Game.game.e.lock();
			window.setTimeout(function() {
				$Forays_Game.game.e.unlock();
			}, duration);
		}
		var i = 0;
		for (var $t2 = 0; $t2 < list.length; $t2++) {
			var t1 = list[$t2];
			$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), memlist[i++]);
		}
		$Forays_Game.console.cursorVisible = true;
	};
	$Forays_Screen.animateBeam = function(list, ch) {
		$Forays_Screen.animateBeam$1(list, ch, 50);
	};
	$Forays_Screen.animateBeam$1 = function(list, ch, duration) {
		$Forays_Game.console.cursorVisible = false;
		list.removeAt(0);
		var memlist = [];
		for (var $t1 = 0; $t1 < list.length; $t1++) {
			var t = list[$t1];
			memlist.add($Forays_Screen.mapChar(t.get_row(), t.get_col()));
			$Forays_Screen.writeMapChar(t.get_row(), t.get_col(), ch);
			$Forays_Game.game.e.lock();
			window.setTimeout(function() {
				$Forays_Game.game.e.unlock();
			}, duration);
		}
		var i = 0;
		for (var $t2 = 0; $t2 < list.length; $t2++) {
			var t1 = list[$t2];
			$Forays_Screen.writeMapChar(t1.get_row(), t1.get_col(), memlist[i++]);
		}
		$Forays_Game.console.cursorVisible = true;
	};
	$Forays_Screen.animateStorm$1 = function(origin, radius, num_frames, num_per_frame, c, color) {
		$Forays_Screen.animateStorm(origin, radius, num_frames, num_per_frame, new $Forays_colorchar.$ctor4(c, color));
	};
	$Forays_Screen.animateStorm = function(origin, radius, num_frames, num_per_frame, ch) {
		for (var i = 0; i < num_frames; ++i) {
			var cells = [];
			var nearby = origin.positionsWithinDistance(radius);
			for (var j = 0; j < num_per_frame; ++j) {
				cells.add($Forays_Extensions.removeRandom($Forays_pos).call(null, nearby));
			}
			$Forays_Screen.animateMapCells(cells, ch);
		}
	};
	$Forays_Screen.drawMapBorder = function(ch) {
		for (var i = 0; i < $Forays_Global.ROWS; i += 21) {
			for (var j = 0; j < $Forays_Global.COLS; ++j) {
				$Forays_Screen.writeMapChar(i, j, ch);
			}
		}
		for (var j1 = 0; j1 < $Forays_Global.COLS; j1 += 65) {
			for (var i1 = 0; i1 < $Forays_Global.ROWS; ++i1) {
				$Forays_Screen.writeMapChar(i1, j1, ch);
			}
		}
		$Forays_Screen.resetColors();
	};
	$Forays_Screen.getColor = function(c) {
		switch (c) {
			case 0: {
				return 0;
			}
			case 1: {
				return 15;
			}
			case 2: {
				return 7;
			}
			case 3: {
				return 12;
			}
			case 4: {
				return 10;
			}
			case 5: {
				return 9;
			}
			case 6: {
				return 14;
			}
			case 7: {
				return 13;
			}
			case 8: {
				return 11;
			}
			case 9: {
				return 8;
			}
			case 10: {
				return 4;
			}
			case 11: {
				return 2;
			}
			case 12: {
				return 1;
			}
			case 13: {
				return 6;
			}
			case 14: {
				return 5;
			}
			case 15: {
				return 3;
			}
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21: {
				return $Forays_Screen.getColor($Forays_Screen.resolveColor(c));
			}
			default: {
				return 0;
			}
		}
	};
	$Forays_Screen.resolveColor = function(c) {
		switch (c) {
			case 16: {
				switch ($Forays_Global.roll$1(1, 3)) {
					case 1: {
						return 3;
					}
					case 2: {
						return 10;
					}
					case 3: {
						return 6;
					}
					default: {
						return 0;
					}
				}
			}
			case 17: {
				switch ($Forays_Global.roll$1(1, 4)) {
					case 1: {
						return 1;
					}
					case 2: {
						return 8;
					}
					case 3: {
						return 5;
					}
					case 4: {
						return 12;
					}
					default: {
						return 0;
					}
				}
			}
			case 18: {
				switch ($Forays_Global.roll$1(1, 4)) {
					case 1: {
						return 1;
					}
					case 2: {
						return 6;
					}
					case 3: {
						return 6;
					}
					case 4: {
						return 13;
					}
					default: {
						return 0;
					}
				}
			}
			case 19: {
				switch ($Forays_Global.roll(3)) {
					case 1: {
						return 3;
					}
					case 2: {
						return 5;
					}
					case 3: {
						return 6;
					}
					default: {
						return 0;
					}
				}
			}
			case 20: {
				switch ($Forays_Global.roll(7)) {
					case 1: {
						return 12;
					}
					case 2: {
						return 15;
					}
					case 3: {
						return 9;
					}
					case 4: {
						return 11;
					}
					case 5: {
						return 14;
					}
					case 6: {
						return 10;
					}
					case 7: {
						return 13;
					}
					default: {
						return 0;
					}
				}
			}
			case 21: {
				switch ($Forays_Global.roll(8)) {
					case 1: {
						return 5;
					}
					case 2: {
						return 8;
					}
					case 3: {
						return 2;
					}
					case 4: {
						return 4;
					}
					case 5: {
						return 7;
					}
					case 6: {
						return 3;
					}
					case 7: {
						return 6;
					}
					case 8: {
						return 1;
					}
					default: {
						return 0;
					}
				}
			}
			default: {
				return c;
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Skill
	var $Forays_Skill = function() {
	};
	$Forays_Skill.name$1 = function(type) {
		switch (type) {
			case 0: {
				return 'Combat';
			}
			case 1: {
				return 'Defense';
			}
			case 2: {
				return 'Magic';
			}
			case 3: {
				return 'Spirit';
			}
			case 4: {
				return 'Stealth';
			}
			default: {
				return 'no skill';
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.SkillType
	var $Forays_SkillType = function() {
	};
	$Forays_SkillType.prototype = { COMBAT: 0, DEFENSE: 1, MAGIC: 2, SPIRIT: 3, STEALTH: 4, nuM_SKILLS: 5, nO_SKILL: 6 };
	Type.registerEnum(global, 'Forays.SkillType', $Forays_SkillType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Spell
	var $Forays_Spell = function() {
	};
	$Forays_Spell.level = function(spell) {
		switch (spell) {
			case 0: {
				return 1;
			}
			case 1:
			case 2: {
				return 2;
			}
			case 3: {
				return 3;
			}
			case 4:
			case 5: {
				return 4;
			}
			case 6: {
				return 5;
			}
			case 7: {
				return 6;
			}
			case 8:
			case 9: {
				return 7;
			}
			case 10: {
				return 8;
			}
			case 11: {
				return 9;
			}
			case 12: {
				return 10;
			}
			case 13: {
				return 11;
			}
			case 14: {
				return 13;
			}
			case 15: {
				return 15;
			}
			case 16: {
				return 16;
			}
			case 17: {
				return 17;
			}
			case 18: {
				return 18;
			}
			case 19: {
				return 20;
			}
			case 20: {
				return 3;
			}
			case 21: {
				return 7;
			}
			case 22: {
				return 9;
			}
			default: {
				return 20;
			}
		}
	};
	$Forays_Spell.name$1 = function(spell) {
		switch (spell) {
			case 5: {
				return 'Scorch';
			}
			case 6: {
				return 'Bloodscent';
			}
			case 7: {
				return 'Lightning bolt';
			}
			case 9: {
				return 'Voltaic surge';
			}
			case 10: {
				return 'Magic hammer';
			}
			case 12: {
				return 'Glacial blast';
			}
			case 14: {
				return 'Flashfire';
			}
			case 16: {
				return 'Collapse';
			}
			case 18: {
				return 'Amnesia';
			}
			case 0: {
				return 'Shine';
			}
			case 15: {
				return 'Sonic boom';
			}
			case 2: {
				return 'Force palm';
			}
			case 4: {
				return 'Blink';
			}
			case 1: {
				return 'Immolate';
			}
			case 3: {
				return 'Freeze';
			}
			case 8: {
				return 'Shadowsight';
			}
			case 11: {
				return 'Retreat';
			}
			case 13: {
				return 'Passage';
			}
			case 17: {
				return 'Force beam';
			}
			case 19: {
				return 'Blizzard';
			}
			case 20: {
				return 'Bless';
			}
			case 21: {
				return 'Minor heal';
			}
			case 22: {
				return 'Holy shield';
			}
			default: {
				return 'unknown spell';
			}
		}
	};
	$Forays_Spell.isDamaging = function(spell) {
		switch (spell) {
			case 19:
			case 16:
			case 14:
			case 17:
			case 2:
			case 12:
			case 7:
			case 10:
			case 5:
			case 15:
			case 9: {
				return true;
			}
		}
		return false;
	};
	$Forays_Spell.description = function(spell) {
		switch (spell) {
			case 0: {
				return new $Forays_colorstring.$ctor2('  Doubles your torch\'s radius     ', 2);
			}
			case 1: {
				return new $Forays_colorstring.$ctor2('  Throws flame to ignite an enemy ', 2);
			}
			case 2: {
				return new $Forays_colorstring.$ctor2('  1d6 damage, range 1, knockback  ', 2);
			}
			case 3: {
				return new $Forays_colorstring.$ctor2('  Encases an enemy in ice         ', 2);
			}
			case 4: {
				return new $Forays_colorstring.$ctor2('  Teleports you a short distance  ', 2);
			}
			case 5: {
				return new $Forays_colorstring.$ctor2('  2d6 fire damage, ranged         ', 2);
			}
			case 6: {
				return new $Forays_colorstring.$ctor2('  Tracks one nearby living enemy  ', 2);
			}
			case 7: {
				return new $Forays_colorstring.$ctor2('  2d6 electric, leaps between foes', 2);
			}
			case 8: {
				return new $Forays_colorstring.$ctor2('  Grants better vision in the dark', 2);
			}
			case 9: {
				return new $Forays_colorstring.$ctor2('  3d6 electric, radius 2 burst    ', 2);
			}
			case 10: {
				return new $Forays_colorstring.$ctor2('  4d6 damage, range 1, stun       ', 2);
			}
			case 11: {
				return new $Forays_colorstring.$ctor2('  Marks a spot, then returns to it', 2);
			}
			case 12: {
				return new $Forays_colorstring.$ctor2('  3d6 cold damage, ranged         ', 2);
			}
			case 13: {
				return new $Forays_colorstring.$ctor2('  Move to the other side of a wall', 2);
			}
			case 14: {
				return new $Forays_colorstring.$ctor2('  3d6 fire damage, ranged radius 2', 2);
			}
			case 15: {
				return new $Forays_colorstring.$ctor2('  3d6 magic damage, can stun foes ', 2);
			}
			case 16: {
				return new $Forays_colorstring.$ctor2('  4d6, breaks walls, leaves rubble', 2);
			}
			case 17: {
				return new $Forays_colorstring.$ctor2('  Three 1d6 beams knock foes back ', 2);
			}
			case 18: {
				return new $Forays_colorstring.$ctor2('  An enemy forgets your presence  ', 2);
			}
			case 19: {
				return new $Forays_colorstring.$ctor2('  5d6 radius 5 burst, freezes foes', 2);
			}
			case 20: {
				return new $Forays_colorstring.$ctor2('  Increases Combat skill briefly  ', 2);
			}
			case 21: {
				return new $Forays_colorstring.$ctor2('  Heals 4d6 damage                ', 2);
			}
			case 22: {
				return new $Forays_colorstring.$ctor2('  Attackers take 2d6 magic damage ', 2);
			}
			default: {
				return new $Forays_colorstring.$ctor2('  Unknown.                        ', 2);
			}
		}
	};
	$Forays_Spell.descriptionWithIncreasedDamage = function(spell) {
		switch (spell) {
			case 2: {
				return new $Forays_colorstring.$ctor3('  2d6', 6, ' damage, range 1, knockback  ', 2);
			}
			case 5: {
				return new $Forays_colorstring.$ctor3('  3d6', 6, ' fire damage, ranged         ', 2);
			}
			case 7: {
				return new $Forays_colorstring.$ctor3('  3d6', 6, ' electric, leaps between foes', 2);
			}
			case 9: {
				return new $Forays_colorstring.$ctor3('  4d6', 6, ' electric, radius 2 burst    ', 2);
			}
			case 10: {
				return new $Forays_colorstring.$ctor3('  5d6', 6, ' damage, range 1, stun       ', 2);
			}
			case 12: {
				return new $Forays_colorstring.$ctor3('  4d6', 6, ' cold damage, ranged         ', 2);
			}
			case 14: {
				return new $Forays_colorstring.$ctor3('  4d6', 6, ' fire damage, ranged radius 2', 2);
			}
			case 15: {
				return new $Forays_colorstring.$ctor3('  4d6', 6, ' magic damage, can stun foes ', 2);
			}
			case 16: {
				return new $Forays_colorstring.$ctor3('  5d6', 6, ', breaks walls, leaves rubble', 2);
			}
			case 17: {
				return new $Forays_colorstring.$ctor4('  Three ', 2, '2d6', 6, ' beams knock foes back ', 2);
			}
			case 19: {
				return new $Forays_colorstring.$ctor3('  6d6', 6, ' radius 5 burst, freezes foes', 2);
			}
			default: {
				return $Forays_Spell.description(spell);
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.SpellType
	var $Forays_SpellType = function() {
	};
	$Forays_SpellType.prototype = { SHINE: 0, IMMOLATE: 1, forcE_PALM: 2, FREEZE: 3, BLINK: 4, SCORCH: 5, BLOODSCENT: 6, lightninG_BOLT: 7, SHADOWSIGHT: 8, voltaiC_SURGE: 9, magiC_HAMMER: 10, RETREAT: 11, glaciaL_BLAST: 12, PASSAGE: 13, FLASHFIRE: 14, soniC_BOOM: 15, COLLAPSE: 16, forcE_BEAM: 17, AMNESIA: 18, BLIZZARD: 19, BLESS: 20, minoR_HEAL: 21, holY_SHIELD: 22, nuM_SPELLS: 23, nO_SPELL: 24 };
	Type.registerEnum(global, 'Forays.SpellType', $Forays_SpellType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Tile
	var $Forays_Tile = function() {
		this.$2$ttypeField = 0;
		this.$2$passableField = false;
		this.$internal_opaque = false;
		this.$2$seenField = false;
		this.$2$solid_rockField = false;
		this.$internal_light_value = 0;
		this.toggles_into = null;
		this.$2$invField = null;
		this.features = [];
		$Forays_PhysicalObject.call(this);
	};
	$Forays_Tile.prototype = {
		get_ttype: function() {
			return this.$2$ttypeField;
		},
		set_ttype: function(value) {
			this.$2$ttypeField = value;
		},
		get_passable: function() {
			return this.$2$passableField;
		},
		set_passable: function(value) {
			this.$2$passableField = value;
		},
		get_opaque: function() {
			return this.$internal_opaque || this.features.contains(5);
		},
		set_opaque: function(value) {
			this.$internal_opaque = value;
		},
		get_seen: function() {
			return this.$2$seenField;
		},
		set_seen: function(value) {
			this.$2$seenField = value;
		},
		get_solid_rock: function() {
			return this.$2$solid_rockField;
		},
		set_solid_rock: function(value) {
			this.$2$solid_rockField = value;
		},
		get_light_value: function() {
			return this.$internal_light_value;
		},
		set_light_value: function(value) {
			this.$internal_light_value = value;
			if (value > 0 && this.features.contains(8)) {
				$Forays_Tile.get_q().add(new $Forays_Event.$ctor5(this, 200, 9));
				$Forays_Tile.get_b().add$2('The blast fungus starts to smolder in the light. ', [this]);
				this.features.remove(8);
				this.features.add(9);
			}
		},
		get_inv: function() {
			return this.$2$invField;
		},
		set_inv: function(value) {
			this.$2$invField = value;
		},
		toString: function() {
			switch (this.get_ttype()) {
				case 1: {
					return '.';
				}
				case 0: {
					return '#';
				}
				case 3: {
					return '+';
				}
				case 2: {
					return '-';
				}
				case 4: {
					return '>';
				}
				case 5: {
					return '~';
				}
				case 6: {
					return '0';
				}
				case 30: {
					return '&';
				}
				case 21:
				case 22:
				case 23:
				case 26:
				case 27:
				case 24:
				case 25: {
					return '_';
				}
				default: {
					return '.';
				}
			}
		},
		is$1: function(t) {
			if (this.get_ttype() === t) {
				return true;
			}
			return false;
		},
		is: function(t) {
			for (var $t1 = 0; $t1 < this.features.length; $t1++) {
				var feature = this.features[$t1];
				if (feature === t) {
					return true;
				}
			}
			return false;
		},
		featureSymbol: function() {
			if (this.is(10)) {
				return $Forays_Tile.feature(10).get_symbol();
			}
			else if (this.is(0)) {
				return $Forays_Tile.feature(0).get_symbol();
			}
			else if (this.is(3)) {
				return $Forays_Tile.feature(3).get_symbol();
			}
			else if (this.is(6)) {
				return $Forays_Tile.feature(6).get_symbol();
			}
			else if (this.is(9)) {
				return $Forays_Tile.feature(9).get_symbol();
			}
			else if (this.is(5)) {
				return $Forays_Tile.feature(5).get_symbol();
			}
			else if (this.is(8)) {
				return $Forays_Tile.feature(8).get_symbol();
			}
			else if (this.is(2)) {
				return $Forays_Tile.feature(2).get_symbol();
			}
			else if (this.is(1)) {
				return $Forays_Tile.feature(1).get_symbol();
			}
			else if (this.is(4)) {
				return $Forays_Tile.feature(4).get_symbol();
			}
			else if (this.is(7)) {
				return $Forays_Tile.feature(7).get_symbol();
			}
			else {
				return this.get_symbol();
			}
		},
		featureColor: function() {
			if (this.is(10)) {
				return $Forays_Tile.feature(10).get_color();
			}
			else if (this.is(0)) {
				return $Forays_Tile.feature(0).get_color();
			}
			else if (this.is(3)) {
				return $Forays_Tile.feature(3).get_color();
			}
			else if (this.is(6)) {
				return $Forays_Tile.feature(6).get_color();
			}
			else if (this.is(9)) {
				return $Forays_Tile.feature(9).get_color();
			}
			else if (this.is(5)) {
				return $Forays_Tile.feature(5).get_color();
			}
			else if (this.is(8)) {
				return $Forays_Tile.feature(8).get_color();
			}
			else if (this.is(2)) {
				return $Forays_Tile.feature(2).get_color();
			}
			else if (this.is(1)) {
				return $Forays_Tile.feature(1).get_color();
			}
			else if (this.is(4)) {
				return $Forays_Tile.feature(4).get_color();
			}
			else if (this.is(7)) {
				return $Forays_Tile.feature(7).get_color();
			}
			else {
				return this.get_color();
			}
		},
		preposition: function() {
			switch (this.get_ttype()) {
				case 1:
				case 4: {
					return ' on ';
				}
				case 2: {
					return ' in ';
				}
				default: {
					return ' and ';
				}
			}
		},
		getItem: function(item) {
			if (ss.isNullOrUndefined(this.get_inv())) {
				item.set_row(this.get_row());
				item.set_col(this.get_col());
				if (item.get_light_radius() > 0) {
					item.updateRadius(0, item.get_light_radius());
				}
				this.set_inv(item);
				return true;
			}
			else if (this.get_inv().get_itype() === item.get_itype() && !this.get_inv().get_do_not_stack() && !item.get_do_not_stack()) {
				var $t1 = this.get_inv();
				$t1.set_quantity($t1.get_quantity() + item.get_quantity());
				return true;
			}
			else {
				for (var i = 1; i < $Forays_Tile.$COLS; ++i) {
					var tiles = this.tilesAtDistance(i);
					while (tiles.length > 0) {
						var t = $Forays_Extensions.random($Forays_Tile).call(null, tiles);
						if (t.get_passable() && ss.isNullOrUndefined(t.get_inv())) {
							item.set_row(t.get_row());
							item.set_col(t.get_col());
							if (item.get_light_radius() > 0) {
								item.updateRadius(0, item.get_light_radius());
							}
							t.set_inv(item);
							return true;
						}
						tiles.remove(t);
					}
				}
			}
			return false;
		},
		toggle: function(toggler) {
			if (ss.Nullable.ne(this.toggles_into, null)) {
				this.toggle$1(toggler, ss.Nullable.unbox(this.toggles_into));
			}
		},
		toggle$1: function(toggler, toggle_to) {
			var lighting_update = false;
			var light_sources = [];
			var original_type = this.get_ttype();
			if (this.get_opaque() !== $Forays_Tile.prototype$1(toggle_to).get_opaque()) {
				for (var i = this.get_row() - 1; i <= this.get_row() + 1; ++i) {
					for (var j = this.get_col() - 1; j <= this.get_col() + 1; ++j) {
						if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).isLit()) {
							lighting_update = true;
						}
					}
				}
			}
			if (lighting_update) {
				for (var i1 = this.get_row() - $Forays_Global.maX_LIGHT_RADIUS; i1 <= this.get_row() + $Forays_Global.maX_LIGHT_RADIUS; ++i1) {
					for (var j1 = this.get_col() - $Forays_Global.maX_LIGHT_RADIUS; j1 <= this.get_col() + $Forays_Global.maX_LIGHT_RADIUS; ++j1) {
						if (i1 > 0 && i1 < $Forays_Tile.$ROWS - 1 && j1 > 0 && j1 < $Forays_Tile.$COLS - 1) {
							if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i1, j1)) && $Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().actor.get_item(i1, j1));
								$Forays_PhysicalObject.get_m().actor.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius(), 0);
							}
							if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv()) && $Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv());
								$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius(), 0);
							}
							if ($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1));
								$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius(), 0);
							}
						}
					}
				}
			}
			this.transformTo(toggle_to);
			if (lighting_update) {
				for (var $t1 = 0; $t1 < light_sources.length; $t1++) {
					var o = light_sources[$t1];
					if (Type.isInstanceOfType(o, $Forays_Actor)) {
						var a = Type.safeCast(o, $Forays_Actor);
						a.updateRadius(0, a.lightRadius());
					}
					else {
						o.updateRadius(0, o.get_light_radius());
					}
				}
			}
			if (ss.isValue(toggler) && !ss.referenceEquals(toggler, $Forays_Tile.get_player())) {
				if (this.get_ttype() === 3 && original_type === 2) {
					if ($Forays_Tile.get_player().canSee(this)) {
						$Forays_Tile.get_b().add(toggler.theVisible() + ' closes the door. ');
					}
					else if (this.get_seen() || $Forays_Tile.get_player().distanceFrom(this) <= 6) {
						$Forays_Tile.get_b().add('You hear a door closing. ');
					}
				}
				if (this.get_ttype() === 2 && original_type === 3) {
					if ($Forays_Tile.get_player().canSee(this)) {
						$Forays_Tile.get_b().add(toggler.theVisible() + ' opens the door. ');
					}
					else if (this.get_seen() || $Forays_Tile.get_player().distanceFrom(this) <= 6) {
						$Forays_Tile.get_b().add('You hear a door opening. ');
					}
				}
			}
			if (ss.isValue(toggler)) {
				if (original_type === 28) {
					$Forays_Tile.get_b().add$1(toggler.youVisible('shift') + ' the rubble aside. ', this);
				}
			}
		},
		transformTo: function(type_) {
			this.set_name($Forays_Tile.prototype$1(type_).get_name());
			this.set_a_name($Forays_Tile.prototype$1(type_).get_a_name());
			this.set_the_name($Forays_Tile.prototype$1(type_).get_the_name());
			this.set_symbol($Forays_Tile.prototype$1(type_).get_symbol());
			this.set_color($Forays_Tile.prototype$1(type_).get_color());
			this.set_ttype($Forays_Tile.prototype$1(type_).get_ttype());
			this.set_passable($Forays_Tile.prototype$1(type_).get_passable());
			this.set_opaque($Forays_Tile.prototype$1(type_).get_opaque());
			this.toggles_into = $Forays_Tile.prototype$1(type_).toggles_into;
			if (this.get_opaque()) {
				this.set_light_value(0);
			}
			if (this.get_light_radius() !== $Forays_Tile.prototype$1(type_).get_light_radius()) {
				this.updateRadius(this.get_light_radius(), $Forays_Tile.prototype$1(type_).get_light_radius());
			}
			this.set_light_radius($Forays_Tile.prototype$1(type_).get_light_radius());
		},
		turnToFloor: function() {
			var lighting_update = false;
			var light_sources = [];
			if (this.get_opaque()) {
				var $t1 = this.tilesWithinDistance(1);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (t.isLit()) {
						lighting_update = true;
					}
				}
			}
			if (lighting_update) {
				for (var i = this.get_row() - $Forays_Global.maX_LIGHT_RADIUS; i <= this.get_row() + $Forays_Global.maX_LIGHT_RADIUS; ++i) {
					for (var j = this.get_col() - $Forays_Global.maX_LIGHT_RADIUS; j <= this.get_col() + $Forays_Global.maX_LIGHT_RADIUS; ++j) {
						if (i > 0 && i < $Forays_Tile.$ROWS - 1 && j > 0 && j < $Forays_Tile.$COLS - 1) {
							if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i, j)) && $Forays_PhysicalObject.get_m().actor.get_item(i, j).lightRadius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().actor.get_item(i, j));
								$Forays_PhysicalObject.get_m().actor.get_item(i, j).updateRadius($Forays_PhysicalObject.get_m().actor.get_item(i, j).lightRadius(), 0);
							}
							if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_inv()) && $Forays_PhysicalObject.get_m().tile.get_item(i, j).get_inv().get_light_radius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_inv());
								$Forays_PhysicalObject.get_m().tile.get_item(i, j).get_inv().updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_inv().get_light_radius(), 0);
							}
							if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_light_radius() > 0) {
								light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i, j));
								$Forays_PhysicalObject.get_m().tile.get_item(i, j).updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i, j).get_light_radius(), 0);
							}
						}
					}
				}
			}
			this.transformTo(1);
			if (lighting_update) {
				for (var $t3 = 0; $t3 < light_sources.length; $t3++) {
					var o = light_sources[$t3];
					if (Type.isInstanceOfType(o, $Forays_Actor)) {
						var a = Type.safeCast(o, $Forays_Actor);
						a.updateRadius(0, a.lightRadius());
					}
					else {
						o.updateRadius(0, o.get_light_radius());
					}
				}
			}
		},
		addOpaqueFeature: function(f) {
			if (!this.features.contains(f)) {
				var lighting_update = false;
				var light_sources = [];
				for (var i = this.get_row() - 1; i <= this.get_row() + 1; ++i) {
					for (var j = this.get_col() - 1; j <= this.get_col() + 1; ++j) {
						if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).isLit()) {
							lighting_update = true;
						}
					}
				}
				if (lighting_update) {
					for (var i1 = this.get_row() - $Forays_Global.maX_LIGHT_RADIUS; i1 <= this.get_row() + $Forays_Global.maX_LIGHT_RADIUS; ++i1) {
						for (var j1 = this.get_col() - $Forays_Global.maX_LIGHT_RADIUS; j1 <= this.get_col() + $Forays_Global.maX_LIGHT_RADIUS; ++j1) {
							if (i1 > 0 && i1 < $Forays_Tile.$ROWS - 1 && j1 > 0 && j1 < $Forays_Tile.$COLS - 1) {
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i1, j1)) && $Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().actor.get_item(i1, j1));
									$Forays_PhysicalObject.get_m().actor.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius(), 0);
								}
								if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv()) && $Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv());
									$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius(), 0);
								}
								if ($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1));
									$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius(), 0);
								}
							}
						}
					}
				}
				this.features.add(f);
				if (lighting_update) {
					for (var $t1 = 0; $t1 < light_sources.length; $t1++) {
						var o = light_sources[$t1];
						if (Type.isInstanceOfType(o, $Forays_Actor)) {
							var a = Type.safeCast(o, $Forays_Actor);
							a.updateRadius(0, a.lightRadius());
						}
						else {
							o.updateRadius(0, o.get_light_radius());
						}
					}
				}
			}
		},
		removeOpaqueFeature: function(f) {
			if (this.features.contains(f)) {
				var lighting_update = false;
				var light_sources = [];
				for (var i = this.get_row() - 1; i <= this.get_row() + 1; ++i) {
					for (var j = this.get_col() - 1; j <= this.get_col() + 1; ++j) {
						if ($Forays_PhysicalObject.get_m().tile.get_item(i, j).isLit()) {
							lighting_update = true;
						}
					}
				}
				if (lighting_update) {
					for (var i1 = this.get_row() - $Forays_Global.maX_LIGHT_RADIUS; i1 <= this.get_row() + $Forays_Global.maX_LIGHT_RADIUS; ++i1) {
						for (var j1 = this.get_col() - $Forays_Global.maX_LIGHT_RADIUS; j1 <= this.get_col() + $Forays_Global.maX_LIGHT_RADIUS; ++j1) {
							if (i1 > 0 && i1 < $Forays_Tile.$ROWS - 1 && j1 > 0 && j1 < $Forays_Tile.$COLS - 1) {
								if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(i1, j1)) && $Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().actor.get_item(i1, j1));
									$Forays_PhysicalObject.get_m().actor.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().actor.get_item(i1, j1).lightRadius(), 0);
								}
								if (ss.isValue($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv()) && $Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv());
									$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_inv().get_light_radius(), 0);
								}
								if ($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius() > 0) {
									light_sources.add($Forays_PhysicalObject.get_m().tile.get_item(i1, j1));
									$Forays_PhysicalObject.get_m().tile.get_item(i1, j1).updateRadius($Forays_PhysicalObject.get_m().tile.get_item(i1, j1).get_light_radius(), 0);
								}
							}
						}
					}
				}
				this.features.remove(f);
				if (lighting_update) {
					for (var $t1 = 0; $t1 < light_sources.length; $t1++) {
						var o = light_sources[$t1];
						if (Type.isInstanceOfType(o, $Forays_Actor)) {
							var a = Type.safeCast(o, $Forays_Actor);
							a.updateRadius(0, a.lightRadius());
						}
						else {
							o.updateRadius(0, o.get_light_radius());
						}
					}
				}
			}
		},
		triggerTrap: function() {
			if (this.actor().get_atype() === 2) {
				if (this.get_name() === 'floor') {
					$Forays_Tile.get_b().add$1(this.actor().get_the_name() + ' smashes ' + $Forays_Tile.prototype$1(this.get_ttype()).get_a_name() + '. ', this);
				}
				else {
					$Forays_Tile.get_b().add$1(this.actor().get_the_name() + ' smashes ' + this.get_the_name() + '. ', this);
				}
				this.transformTo(1);
				return;
			}
			if ($Forays_Tile.get_player().canSee(this)) {
				$Forays_Tile.get_b().add$1('*CLICK* ', this);
				$Forays_Tile.get_b().printAll();
			}
			switch (this.get_ttype()) {
				case 12: {
					if ($Forays_Tile.get_player().canSee(this.actor())) {
						$Forays_Tile.get_b().add$1('Grenades fall from the ceiling above ' + this.actor().get_the_name() + '! ', this);
					}
					else {
						$Forays_Tile.get_b().add$1('Grenades fall from the ceiling! ', this);
					}
					//bool nade_here = false;
					var valid = [];
					var $t1 = this.tilesWithinDistance(1);
					for (var $t2 = 0; $t2 < $t1.length; $t2++) {
						var t = $t1[$t2];
						if (t.get_passable() && !t.is(0)) {
							valid.add(t);
						}
					}
					var count = ($Forays_Global.oneIn(10) ? 3 : 2);
					for (; count > 0 & valid.length > 0; --count) {
						var t1 = $Forays_Extensions.random($Forays_Tile).call(null, valid);
						//if(t == this){
						//nade_here = true;
						//}
						if (ss.isValue(t1.actor())) {
							if (ss.referenceEquals(t1.actor(), $Forays_Tile.get_player())) {
								$Forays_Tile.get_b().add('One lands under you! ');
							}
							else if ($Forays_Tile.get_player().canSee(this)) {
								$Forays_Tile.get_b().add$1('One lands under ' + t1.actor().get_the_name() + '. ', t1.actor());
							}
						}
						else if (ss.isValue(t1.get_inv())) {
							$Forays_Tile.get_b().add$1('One lands under ' + t1.get_inv().theName() + '. ', t1);
						}
						t1.features.add(0);
						valid.remove(t1);
						$Forays_Tile.get_q().add(new $Forays_Event.$ctor5(t1, 100, 8));
					}
					this.toggle(this.actor());
					break;
				}
				case 11: {
					var dirs = [];
					for (var i = 2; i <= 8; i += 2) {
						var t2 = this;
						var good = true;
						while (t2.get_ttype() !== 0) {
							t2 = t2.tileInDirection(i);
							if (t2.get_opaque() && t2.get_ttype() !== 0) {
								good = false;
								break;
							}
							if (this.distanceFrom(t2) > 6) {
								good = false;
								break;
							}
						}
						if (good && t2.get_row() > 0 && t2.get_row() < $Forays_Tile.$ROWS - 1 && t2.get_col() > 0 && t2.get_col() < $Forays_Tile.$COLS - 1) {
							t2 = t2.tileInDirection(i);
						}
						else {
							good = false;
						}
						if (good && t2.get_row() > 0 && t2.get_row() < $Forays_Tile.$ROWS - 1 && t2.get_col() > 0 && t2.get_col() < $Forays_Tile.$COLS - 1) {
							var $t3 = t2.tilesWithinDistance(1);
							for (var $t4 = 0; $t4 < $t3.length; $t4++) {
								var tt = $t3[$t4];
								if (tt.get_ttype() !== 0) {
									good = false;
								}
							}
						}
						else {
							good = false;
						}
						if (good) {
							dirs.add(i);
						}
					}
					if (dirs.length === 0) {
						$Forays_Tile.get_b().add$1('Nothing happens. ', this);
					}
					else {
						var dir = dirs[$Forays_Global.roll(dirs.length) - 1];
						var first = this;
						while (first.get_ttype() !== 0) {
							first = first.tileInDirection(dir);
						}
						first.tileInDirection(dir).turnToFloor();
						var ac = ($Forays_Global.coinFlip() ? 6 : 18);
						$Forays_Actor.create$1(ac, first.tileInDirection(dir).get_row(), first.tileInDirection(dir).get_col(), true, true);
						first.turnToFloor();
						var $t5 = first.tileInDirection(dir).tilesWithinDistance(1);
						for (var $t6 = 0; $t6 < $t5.length; $t6++) {
							var t3 = $t5[$t6];
							t3.set_solid_rock(false);
						}
						//first.ActorInDirection(dir).target_location = this;
						//first.ActorInDirection(dir).player_visibility_duration = -1;
						first.actorInDirection(dir).findPath(this.tileInDirection(dir));
						if ($Forays_Tile.get_player().canSee(first)) {
							$Forays_Tile.get_b().add('The wall slides away. ');
						}
						else if (this.distanceFrom($Forays_Tile.get_player()) <= 6) {
							$Forays_Tile.get_b().add('You hear rock sliding on rock. ');
						}
					}
					this.toggle(this.actor());
					break;
				}
				case 9: {
					$Forays_Tile.get_b().add$1('An unstable energy covers ' + this.actor().theVisible() + '. ', this.actor());
					this.actor().attrs.set_item(42, $Forays_Global.roll(4));
					$Forays_Tile.get_q().killEvents(this.actor(), 42);
					$Forays_Tile.get_q().add(new $Forays_Event.$ctorc(this.actor(), this.actor().durationOfMagicalEffect($Forays_Global.roll(10) + 25) * 100, 42, this.actor().youFeel() + ' more stable. ', [this.actor()]));
					this.toggle(this.actor());
					break;
				}
				case 13: {
					if ($Forays_Tile.get_player().canSee(this.actor())) {
						$Forays_Tile.get_b().add$1('A disorienting flash assails ' + this.actor().get_the_name() + '. ', this);
					}
					else {
						$Forays_Tile.get_b().add$1('You notice a flash of light. ', this);
					}
					this.actor().gainAttrRefreshDuration$1(27, this.actor().durationOfMagicalEffect($Forays_Global.roll(10) + 7) * 100, this.actor().youFeel() + ' less disoriented. ', [this.actor()]);
					this.toggle(this.actor());
					break;
				}
				case 10: {
					if ($Forays_PhysicalObject.get_m().get_wiz_lite() === false) {
						if ($Forays_Tile.get_player().hasLOS$1(this.get_row(), this.get_col()) && !this.actor().isHiddenFrom($Forays_Tile.get_player())) {
							$Forays_Tile.get_b().add('A wave of light washes out from above ' + this.actor().get_the_name() + '! ');
						}
						else {
							$Forays_Tile.get_b().add('A wave of light washes over the area! ');
						}
						$Forays_PhysicalObject.get_m().set_wiz_lite(true);
						$Forays_PhysicalObject.get_m().set_wiz_dark(false);
					}
					else {
						$Forays_Tile.get_b().add$1('Nothing happens. ', this);
					}
					this.toggle(this.actor());
					break;
				}
				case 15: {
					if ($Forays_PhysicalObject.get_m().get_wiz_dark() === false) {
						if ($Forays_Tile.get_player().canSee(this.actor())) {
							$Forays_Tile.get_b().add('A surge of darkness radiates out from above ' + this.actor().get_the_name() + '! ');
							if ($Forays_Tile.get_player().get_light_radius() > 0) {
								$Forays_Tile.get_b().add('Your light is extinguished! ');
							}
						}
						else {
							$Forays_Tile.get_b().add('A surge of darkness extinguishes all light in the area! ');
						}
						$Forays_PhysicalObject.get_m().set_wiz_dark(true);
						$Forays_PhysicalObject.get_m().set_wiz_lite(false);
					}
					else {
						$Forays_Tile.get_b().add$1('Nothing happens. ', this);
					}
					this.toggle(this.actor());
					break;
				}
				case 8: {
					$Forays_Tile.get_b().add$1('Fire pours over ' + this.actor().theVisible() + ' and starts to spread! ', this);
					var a = this.actor();
					if (!a.hasAttr(61) && !a.hasAttr(32) && !a.hasAttr(31) && !a.hasAttr(64) && !a.hasAttr(33)) {
						if (ss.referenceEquals(a, this.actor())) {
							// to work properly, 
							a.attrs.set_item(33, 1);
							//this would need to determine what actor's turn it is
						}
						else {
							a.attrs.set_item(32, 1);
						}
						if ($Forays_Tile.get_player().canSee(a.tile())) {
							$Forays_Tile.get_b().add$1(a.you('start') + ' to catch fire. ', a);
						}
					}
					this.features.add(3);
					this.toggle(this.actor());
					var newarea = [];
					newarea.add(this);
					$Forays_Tile.get_q().add(new $Forays_Event.$ctorf(this, newarea, 100, 19, 109, 3, ''));
					break;
				}
				case 14: {
					if (ss.referenceEquals(this.actor(), $Forays_Tile.get_player())) {
						$Forays_Tile.get_b().add('A high-pitched ringing sound reverberates from above you. ');
					}
					else if ($Forays_Tile.get_player().canSee(this.actor())) {
						$Forays_Tile.get_b().add('A high-pitched ringing sound reverberates from above ' + this.actor().get_the_name() + '. ');
					}
					else {
						$Forays_Tile.get_b().add('You hear a high-pitched ringing sound. ');
					}
					var $t7 = this.actorsWithinDistance$1(12, true);
					for (var $t8 = 0; $t8 < $t7.length; $t8++) {
						var a1 = $t7[$t8];
						if (a1.get_atype() !== 4 && a1.get_atype() !== 7 && a1.get_atype() !== 10 && a1.get_atype() !== 49 && a1.get_atype() !== 24) {
							a1.findPath(this);
						}
					}
					this.toggle(this.actor());
					break;
				}
				case 17: {
					$Forays_Tile.get_b().add$1('A dart strikes ' + this.actor().get_the_name() + '. ', this.actor());
					if (ss.referenceEquals(this.actor(), $Forays_Tile.get_player())) {
						$Forays_Tile.get_b().add('Your vision becomes weaker! ');
						this.actor().gainAttrRefreshDuration$1(45, this.actor().durationOfMagicalEffect($Forays_Global.roll(10) + 20) * 100, 'Your vision returns to normal. ', []);
					}
					else if (!this.actor().hasAttr(67) && !this.actor().hasAttr(1) && !this.actor().hasAttr(8) && this.actor().get_atype() !== 7 && this.actor().get_atype() !== 24) {
						if ($Forays_Tile.get_player().canSee(this.actor())) {
							$Forays_Tile.get_b().add(this.actor().get_the_name() + ' seems to have trouble seeing. ');
						}
						this.actor().gainAttrRefreshDuration(45, this.actor().durationOfMagicalEffect($Forays_Global.roll(10) + 20) * 100);
					}
					this.toggle(this.actor());
					break;
				}
				case 18: {
					if ($Forays_Tile.get_player().canSee(this)) {
						$Forays_Tile.get_b().add('The air suddenly freezes, encasing ' + this.actor().theVisible() + ' in ice. ');
					}
					this.actor().attrs.set_item(30, 25);
					this.toggle(this.actor());
					break;
				}
				case 19: {
					var open = $Forays_Extensions.random($Forays_Tile).call(null, $Forays_Extensions.where($Forays_Tile).call(null, this.tilesWithinDistance(3), Function.mkdel(this, function(t4) {
						return t4.get_passable() && ss.isNullOrUndefined(t4.actor()) && t4.hasLOE(this);
					})));
					if (ss.isValue(open)) {
						var a2 = $Forays_Actor.createPhantom(open.get_row(), open.get_col());
						if (ss.isValue(a2)) {
							a2.attrs.set_item(15, a2.attrs.get_item(15) + 1);
							a2.player_visibility_duration = -1;
							$Forays_Tile.get_b().add$1('A ghostly image rises! ', a2);
						}
						else {
							$Forays_Tile.get_b().add$1('Nothing happens. ', this);
						}
					}
					else {
						$Forays_Tile.get_b().add$1('Nothing happens. ', this);
					}
					this.toggle(this.actor());
					break;
				}
				case 16: {
					var current = this;
					var num = $Forays_Global.roll(5) + 7;
					var new_area = [];
					for (var i1 = 0; i1 < num; ++i1) {
						if (!current.is(6)) {
							current.features.add(6);
							new_area.add(current);
						}
						else {
							for (var tries = 0; tries < 50; ++tries) {
								var open1 = [];
								var $t9 = current.tilesAtDistance(1);
								for (var $t10 = 0; $t10 < $t9.length; $t10++) {
									var t5 = $t9[$t10];
									if (t5.get_passable()) {
										open1.add(t5);
									}
								}
								if (open1.length > 0) {
									var possible = $Forays_Extensions.random($Forays_Tile).call(null, open1);
									if (!possible.is(6)) {
										possible.features.add(6);
										new_area.add(possible);
										break;
									}
									else {
										current = possible;
									}
								}
								else {
									break;
								}
							}
						}
					}
					if (new_area.length > 0) {
						$Forays_Tile.get_b().add$1('Poisonous gas fills the area! ', this);
						$Forays_Tile.get_q().add(new $Forays_Event.$ctor6(new_area, 300, 16));
					}
					this.toggle(this.actor());
					break;
				}
				default: {
					break;
				}
			}
		},
		openChest: function() {
			if (this.get_ttype() === 5) {
				if ($Forays_Global.roll$1(1, 10) === 10) {
					var upgrades = [];
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().weapons.contains(5)) {
						upgrades.add(0);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().weapons.contains(6)) {
						upgrades.add(1);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().weapons.contains(7)) {
						upgrades.add(2);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().weapons.contains(8)) {
						upgrades.add(3);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().weapons.contains(9)) {
						upgrades.add(4);
					}
					if ($Forays_Global.roll$1(1, 3) === 3 && !$Forays_Tile.get_player().armors.contains(3)) {
						upgrades.add(5);
					}
					if ($Forays_Global.roll$1(1, 3) === 3 && !$Forays_Tile.get_player().armors.contains(4)) {
						upgrades.add(6);
					}
					if ($Forays_Global.roll$1(1, 3) === 3 && !$Forays_Tile.get_player().armors.contains(5)) {
						upgrades.add(7);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().magic_items.contains(0)) {
						upgrades.add(8);
					}
					if ($Forays_Global.roll$1(1, 3) === 3 && !$Forays_Tile.get_player().magic_items.contains(1)) {
						upgrades.add(9);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().magic_items.contains(2)) {
						upgrades.add(10);
					}
					if ($Forays_Global.roll$1(1, 2) === 2 && !$Forays_Tile.get_player().magic_items.contains(3)) {
						upgrades.add(11);
					}
					if (upgrades.length === 0) {
						this.openChest();
						return;
					}
					var upgrade = upgrades[$Forays_Global.roll$1(1, upgrades.length) - 1];
					switch (upgrade) {
						case 0: {
							$Forays_Extensions.find($Forays_WeaponType).call(null, $Forays_Tile.get_player().weapons, 0).value = 5;
							if ($Forays_Weapon.baseWeapon($Forays_Tile.get_player().weapons[0]) === 0) {
								$Forays_Tile.get_player().updateOnEquip$2(0, 5);
							}
							break;
						}
						case 1: {
							$Forays_Extensions.find($Forays_WeaponType).call(null, $Forays_Tile.get_player().weapons, 1).value = 6;
							if ($Forays_Weapon.baseWeapon($Forays_Tile.get_player().weapons[0]) === 1) {
								$Forays_Tile.get_player().updateOnEquip$2(1, 6);
							}
							break;
						}
						case 2: {
							$Forays_Extensions.find($Forays_WeaponType).call(null, $Forays_Tile.get_player().weapons, 2).value = 7;
							if ($Forays_Weapon.baseWeapon($Forays_Tile.get_player().weapons[0]) === 2) {
								$Forays_Tile.get_player().updateOnEquip$2(2, 7);
							}
							break;
						}
						case 3: {
							$Forays_Extensions.find($Forays_WeaponType).call(null, $Forays_Tile.get_player().weapons, 3).value = 8;
							if ($Forays_Weapon.baseWeapon($Forays_Tile.get_player().weapons[0]) === 3) {
								$Forays_Tile.get_player().updateOnEquip$2(3, 8);
							}
							break;
						}
						case 4: {
							$Forays_Extensions.find($Forays_WeaponType).call(null, $Forays_Tile.get_player().weapons, 4).value = 9;
							if ($Forays_Weapon.baseWeapon($Forays_Tile.get_player().weapons[0]) === 4) {
								$Forays_Tile.get_player().updateOnEquip$2(4, 9);
							}
							break;
						}
						case 5: {
							$Forays_Extensions.find($Forays_ArmorType).call(null, $Forays_Tile.get_player().armors, 0).value = 3;
							if ($Forays_Armor.baseArmor($Forays_Tile.get_player().armors[0]) === 0) {
								$Forays_Tile.get_player().updateOnEquip(0, 3);
							}
							break;
						}
						case 6: {
							$Forays_Extensions.find($Forays_ArmorType).call(null, $Forays_Tile.get_player().armors, 1).value = 4;
							if ($Forays_Armor.baseArmor($Forays_Tile.get_player().armors[0]) === 1) {
								$Forays_Tile.get_player().updateOnEquip(1, 4);
							}
							break;
						}
						case 7: {
							$Forays_Extensions.find($Forays_ArmorType).call(null, $Forays_Tile.get_player().armors, 2).value = 5;
							if ($Forays_Armor.baseArmor($Forays_Tile.get_player().armors[0]) === 2) {
								$Forays_Tile.get_player().updateOnEquip(2, 5);
							}
							break;
						}
						case 8: {
							$Forays_Tile.get_player().magic_items.insert($Forays_Tile.get_player().magic_items.length, 0);
							break;
						}
						case 9: {
							$Forays_Tile.get_player().magic_items.insert($Forays_Tile.get_player().magic_items.length, 1);
							break;
						}
						case 10: {
							$Forays_Tile.get_player().magic_items.insert($Forays_Tile.get_player().magic_items.length, 2);
							break;
						}
						case 11: {
							$Forays_Tile.get_player().magic_items.insert($Forays_Tile.get_player().magic_items.length, 3);
							break;
						}
						default: {
							break;
						}
					}
					if (upgrade <= 4) {
						$Forays_Tile.get_b().add('You find a ' + $Forays_Weapon.name$1(upgrade + 5) + '! ');
					}
					else if (upgrade <= 7) {
						$Forays_Tile.get_b().add('You find ' + $Forays_Armor.name$1(upgrade - 2) + '! ');
					}
					else {
						$Forays_Tile.get_b().add('You find a ' + $Forays_MagicItem.name$1(upgrade - 8) + '! ');
					}
				}
				else {
					var no_room = false;
					if ($Forays_Tile.get_player().inventoryCount() >= $Forays_Global.maX_INVENTORY_SIZE) {
						no_room = true;
					}
					var i = $Forays_Item.create($Forays_Item.randomItem(), $Forays_Tile.get_player());
					if (ss.isValue(i)) {
						$Forays_Tile.get_b().add('You find ' + $Forays_Item.prototype$1(i.get_itype()).aName() + '. ');
						if (no_room) {
							$Forays_Tile.get_b().add('Your pack is too full to pick it up. ');
						}
					}
				}
				this.turnToFloor();
			}
		},
		isLit: function() {
			//default is player as viewer
			return this.isLit$1($Forays_Tile.get_player().get_row(), $Forays_Tile.get_player().get_col());
		},
		isLit$1: function(viewer_row, viewer_col) {
			if ($Forays_PhysicalObject.get_m().get_wiz_lite()) {
				return true;
			}
			if ($Forays_PhysicalObject.get_m().get_wiz_dark()) {
				return false;
			}
			if (this.get_light_value() > 0) {
				return true;
			}
			if (this.features.contains(3)) {
				return true;
			}
			if (this.get_opaque()) {
				var $t1 = this.neighborsBetween(viewer_row, viewer_col);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (t.get_light_value() > 0) {
						return true;
					}
				}
				if (ss.isValue($Forays_PhysicalObject.get_m().actor.get_item(viewer_row, viewer_col)) && $Forays_PhysicalObject.get_m().actor.get_item(viewer_row, viewer_col).lightRadius() > 0) {
					if ($Forays_PhysicalObject.get_m().actor.get_item(viewer_row, viewer_col).lightRadius() >= this.distanceFrom$2(viewer_row, viewer_col)) {
						if ($Forays_PhysicalObject.get_m().actor.get_item(viewer_row, viewer_col).hasBresenhamLine(this.get_row(), this.get_col())) {
							return true;
						}
					}
				}
			}
			return false;
		},
		isLitFromAnywhere: function() {
			return this.isLitFromAnywhere$1(this.get_opaque());
		},
		isLitFromAnywhere$1: function(considered_opaque) {
			if ($Forays_PhysicalObject.get_m().get_wiz_lite()) {
				return true;
			}
			if ($Forays_PhysicalObject.get_m().get_wiz_dark()) {
				return false;
			}
			if (this.get_light_value() > 0) {
				return true;
			}
			if (this.features.contains(3)) {
				return true;
			}
			if (considered_opaque) {
				var $t1 = this.tilesAtDistance(1);
				for (var $t2 = 0; $t2 < $t1.length; $t2++) {
					var t = $t1[$t2];
					if (t.get_light_value() > 0) {
						return true;
					}
				}
				var $t3 = this.actorsWithinDistance($Forays_Global.maX_LIGHT_RADIUS);
				for (var $t4 = 0; $t4 < $t3.length; $t4++) {
					var a = $t3[$t4];
					if (a.lightRadius() > 0 && a.lightRadius() >= a.distanceFrom(this) && a.hasBresenhamLine(this.get_row(), this.get_col())) {
						return true;
					}
				}
			}
			return false;
		},
		isTrap: function() {
			switch (this.get_ttype()) {
				case 8:
				case 12:
				case 10:
				case 11:
				case 9:
				case 13:
				case 14:
				case 15:
				case 17:
				case 18:
				case 19:
				case 16: {
					return true;
				}
				default: {
					return false;
				}
			}
		},
		isTrapOrVent: function() {
			return this.isTrap() || this.get_ttype() === 29 || this.get_ttype() === 32 || this.get_ttype() === 33;
		},
		isKnownTrap: function() {
			if (this.isTrap() && this.get_name() !== 'floor') {
				return true;
			}
			return false;
		},
		isShrine: function() {
			switch (this.get_ttype()) {
				case 21:
				case 22:
				case 23:
				case 24:
				case 25:
				case 27: {
					return true;
				}
				default: {
					return false;
				}
			}
		},
		conductsElectricity: function() {
			if (this.isShrine() || this.get_ttype() === 5 || this.get_ttype() === 26) {
				return true;
			}
			return false;
		},
		neighborsBetween: function(r, c) {
			//list of non-opaque tiles next to this one that are between you and it
			var Clamp = function(x) {
				return ((x < -1) ? -1 : ((x > 1) ? 1 : x));
			};
			//clamps to a value between -1 and 1
			var dy = r - this.get_row();
			var dx = c - this.get_col();
			var result = [];
			if (dy === 0 && dx === 0) {
				return result;
				//return the empty set
			}
			var newrow = this.get_row() + Clamp(dy);
			var newcol = this.get_col() + Clamp(dx);
			if (!$Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol).get_opaque()) {
				result.add($Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol));
			}
			if (Math.abs(dy) < Math.abs(dx) && dy !== 0) {
				newrow -= Clamp(dy);
				if (!$Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol).get_opaque()) {
					result.add($Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol));
				}
			}
			if (Math.abs(dx) < Math.abs(dy) && dx !== 0) {
				newcol -= Clamp(dx);
				if (!$Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol).get_opaque()) {
					result.add($Forays_PhysicalObject.get_m().tile.get_item(newrow, newcol));
				}
			}
			return result;
		}
	};
	$Forays_Tile.$ctor1 = function(t, r, c) {
		this.$2$ttypeField = 0;
		this.$2$passableField = false;
		this.$internal_opaque = false;
		this.$2$seenField = false;
		this.$2$solid_rockField = false;
		this.$internal_light_value = 0;
		this.toggles_into = null;
		this.$2$invField = null;
		this.features = [];
		$Forays_PhysicalObject.call(this);
		this.set_ttype(t.get_ttype());
		this.set_name(t.get_name());
		this.set_a_name(t.get_a_name());
		this.set_the_name(t.get_the_name());
		this.set_symbol(t.get_symbol());
		this.set_color(t.get_color());
		this.set_passable(t.get_passable());
		this.set_opaque(t.get_opaque());
		this.set_seen(false);
		this.set_solid_rock(false);
		this.set_light_value(0);
		this.toggles_into = t.toggles_into;
		this.set_inv(null);
		this.set_row(r);
		this.set_col(c);
		this.set_light_radius(t.get_light_radius());
	};
	$Forays_Tile.$ctor2 = function(type_, name_, symbol_, color_, passable_, opaque_, toggles_into_) {
		this.$2$ttypeField = 0;
		this.$2$passableField = false;
		this.$internal_opaque = false;
		this.$2$seenField = false;
		this.$2$solid_rockField = false;
		this.$internal_light_value = 0;
		this.toggles_into = null;
		this.$2$invField = null;
		this.features = [];
		$Forays_PhysicalObject.call(this);
		this.set_ttype(type_);
		this.set_name(name_);
		this.set_the_name('the ' + this.get_name());
		switch (this.get_name().charCodeAt(0)) {
			case 97:
			case 101:
			case 105:
			case 111:
			case 117:
			case 65:
			case 69:
			case 73:
			case 79:
			case 85: {
				this.set_a_name('an ' + this.get_name());
				break;
			}
			default: {
				this.set_a_name('a ' + this.get_name());
				break;
			}
		}
		this.set_symbol(String.fromCharCode(symbol_));
		this.set_color(color_);
		this.set_passable(passable_);
		this.set_opaque(opaque_);
		this.set_seen(false);
		this.set_solid_rock(false);
		this.set_light_value(0);
		this.toggles_into = toggles_into_;
		this.set_inv(null);
		this.set_light_radius(0);
	};
	$Forays_Tile.$ctor1.prototype = $Forays_Tile.$ctor2.prototype = $Forays_Tile.prototype;
	$Forays_Tile.prototype$1 = function(type) {
		return $Forays_Tile.$proto[type];
	};
	$Forays_Tile.feature = function(type) {
		return $Forays_Tile.$proto_feature[type];
	};
	$Forays_Tile.get_b = function() {
		return $Forays_Tile.$2$BField;
	};
	$Forays_Tile.set_b = function(value) {
		$Forays_Tile.$2$BField = value;
	};
	$Forays_Tile.get_q = function() {
		return $Forays_Tile.$2$QField;
	};
	$Forays_Tile.set_q = function(value) {
		$Forays_Tile.$2$QField = value;
	};
	$Forays_Tile.get_player = function() {
		return $Forays_Tile.$2$playerField;
	};
	$Forays_Tile.set_player = function(value) {
		$Forays_Tile.$2$playerField = value;
	};
	$Forays_Tile.$define = function(type_, name_, symbol_, color_, passable_, opaque_, toggles_into_) {
		$Forays_Tile.$proto[type_] = new $Forays_Tile.$ctor2(type_, name_, symbol_, color_, passable_, opaque_, toggles_into_);
	};
	$Forays_Tile.create = function(type, r, c) {
		var t = null;
		if (ss.isNullOrUndefined($Forays_PhysicalObject.get_m().tile.get_item(r, c))) {
			t = new $Forays_Tile.$ctor1($Forays_Tile.$proto[type], r, c);
			$Forays_PhysicalObject.get_m().tile.set_item(r, c, t);
			//bounds checking here?
		}
		return t;
	};
	$Forays_Tile.randomTrap = function() {
		var i = $Forays_Global.roll(12) + 7;
		return i;
	};
	$Forays_Tile.randomVent = function() {
		switch ($Forays_Global.roll(3)) {
			case 1: {
				return 29;
			}
			case 2: {
				return 32;
			}
			case 3:
			default: {
				return 33;
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.TileType
	var $Forays_TileType = function() {
	};
	$Forays_TileType.prototype = { WALL: 0, FLOOR: 1, dooR_O: 2, dooR_C: 3, STAIRS: 4, CHEST: 5, FIREPIT: 6, STALAGMITE: 7, quickfirE_TRAP: 8, teleporT_TRAP: 9, lighT_TRAP: 10, undeaD_TRAP: 11, grenadE_TRAP: 12, stuN_TRAP: 13, alarM_TRAP: 14, darknesS_TRAP: 15, poisoN_GAS_TRAP: 16, diM_VISION_TRAP: 17, icE_TRAP: 18, phantoM_TRAP: 19, hiddeN_DOOR: 20, combaT_SHRINE: 21, defensE_SHRINE: 22, magiC_SHRINE: 23, spiriT_SHRINE: 24, stealtH_SHRINE: 25, ruineD_SHRINE: 26, spelL_EXCHANGE_SHRINE: 27, RUBBLE: 28, firE_GEYSER: 29, STATUE: 30, healinG_POOL: 31, foG_VENT: 32, poisoN_GAS_VENT: 33, stonE_SLAB: 34, CHASM: 35 };
	Type.registerEnum(global, 'Forays.TileType', $Forays_TileType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.TutorialTopic
	var $Forays_TutorialTopic = function() {
	};
	$Forays_TutorialTopic.prototype = { movement: 0, attacking: 1, torch: 2, resistance: 3, fire: 4, recovery: 5, rangedAttacks: 6, feats: 7, armor: 8, healingPool: 9, consumables: 10 };
	Type.registerEnum(global, 'Forays.TutorialTopic', $Forays_TutorialTopic, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Weapon
	var $Forays_Weapon = function() {
	};
	$Forays_Weapon.damage = function(type) {
		switch (type) {
			case 0:
			case 5: {
				return new $Forays_Damage.$ctor1(3, 6, 0, null);
			}
			case 1:
			case 6: {
				return new $Forays_Damage.$ctor1(3, 7, 0, null);
			}
			case 2:
			case 7: {
				return new $Forays_Damage.$ctor1(2, 8, 0, null);
			}
			case 3:
			case 8:
			case 4:
			case 9: {
				return new $Forays_Damage.$ctor1(1, 7, 0, null);
			}
			default: {
				return new $Forays_Damage.$ctor1(0, 10, 2, null);
			}
		}
	};
	$Forays_Weapon.baseWeapon = function(type) {
		switch (type) {
			case 0:
			case 5: {
				return 0;
			}
			case 1:
			case 6: {
				return 1;
			}
			case 2:
			case 7: {
				return 2;
			}
			case 3:
			case 8: {
				return 3;
			}
			case 4:
			case 9: {
				return 4;
			}
			default: {
				return 11;
			}
		}
	};
	$Forays_Weapon.name$1 = function(type) {
		switch (type) {
			case 0: {
				return 'sword';
			}
			case 5: {
				return 'flamebrand';
			}
			case 1: {
				return 'mace';
			}
			case 6: {
				return 'mace of force';
			}
			case 2: {
				return 'dagger';
			}
			case 7: {
				return 'venomous dagger';
			}
			case 3: {
				return 'staff';
			}
			case 8: {
				return 'staff of magic';
			}
			case 4: {
				return 'bow';
			}
			case 9: {
				return 'holy longbow';
			}
			default: {
				return 'no weapon';
			}
		}
	};
	$Forays_Weapon.statsName = function(type) {
		var cs = new $Forays_cstr.$ctor3('', 2, 0);
		cs.bgcolor = 0;
		cs.color = 2;
		switch (type) {
			case 0: {
				cs.s = 'Sword';
				break;
			}
			case 5: {
				cs.s = '+Sword+';
				cs.color = 3;
				break;
			}
			case 1: {
				cs.s = 'Mace';
				break;
			}
			case 6: {
				cs.s = '+Mace+';
				cs.color = 8;
				break;
			}
			case 2: {
				cs.s = 'Dagger';
				break;
			}
			case 7: {
				cs.s = '+Dagger+';
				cs.color = 4;
				break;
			}
			case 3: {
				cs.s = 'Staff';
				break;
			}
			case 8: {
				cs.s = '+Staff+';
				cs.color = 7;
				break;
			}
			case 4: {
				cs.s = 'Bow';
				break;
			}
			case 9: {
				cs.s = '+Bow+';
				cs.color = 6;
				break;
			}
			default: {
				cs.s = 'no weapon';
				break;
			}
		}
		return cs;
	};
	$Forays_Weapon.equipmentScreenName = function(type) {
		var cs = new $Forays_cstr.$ctor3('', 2, 0);
		cs.bgcolor = 0;
		cs.color = 2;
		switch (type) {
			case 0: {
				cs.s = 'Sword';
				break;
			}
			case 5: {
				cs.s = 'Flamebrand';
				cs.color = 3;
				break;
			}
			case 1: {
				cs.s = 'Mace';
				break;
			}
			case 6: {
				cs.s = 'Mace of force';
				cs.color = 8;
				break;
			}
			case 2: {
				cs.s = 'Dagger';
				break;
			}
			case 7: {
				cs.s = 'Venomous dagger';
				cs.color = 4;
				break;
			}
			case 3: {
				cs.s = 'Staff';
				break;
			}
			case 8: {
				cs.s = 'Staff of magic';
				cs.color = 7;
				break;
			}
			case 4: {
				cs.s = 'Bow';
				break;
			}
			case 9: {
				cs.s = 'Holy longbow';
				cs.color = 6;
				break;
			}
			default: {
				cs.s = 'no weapon';
				break;
			}
		}
		return cs;
	};
	$Forays_Weapon.description = function(type) {
		switch (type) {
			case 0: {
				return 'Sword -- A powerful 3d6 damage slashing weapon.';
			}
			case 5: {
				return 'Flamebrand -- Deals extra fire damage.';
			}
			case 1: {
				return 'Mace -- A powerful 3d6 damage bashing weapon.';
			}
			case 6: {
				return 'Mace of force -- Chance to knock back or stun.';
			}
			case 2: {
				return 'Dagger -- 2d6 damage. Extra chance for critical hits.';
			}
			case 7: {
				return 'Venomous dagger -- Chance to poison any foe it hits.';
			}
			case 3: {
				return 'Staff -- 1d6 damage. Grants a small bonus to defense.';
			}
			case 8: {
				return 'Staff of magic -- Grants a bonus to magic skill.';
			}
			case 4: {
				return 'Bow -- 3d6 damage at range. Less accurate than melee.';
			}
			case 9: {
				return 'Holy longbow - Deals extra damage to undead and demons.';
			}
			default: {
				return 'no weapon';
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// Forays.WeaponType
	var $Forays_WeaponType = function() {
	};
	$Forays_WeaponType.prototype = { SWORD: 0, MACE: 1, DAGGER: 2, STAFF: 3, BOW: 4, FLAMEBRAND: 5, macE_OF_FORCE: 6, venomouS_DAGGER: 7, stafF_OF_MAGIC: 8, holY_LONGBOW: 9, nuM_WEAPONS: 10, nO_WEAPON: 11 };
	Type.registerEnum(global, 'Forays.WeaponType', $Forays_WeaponType, false);
	////////////////////////////////////////////////////////////////////////////////
	// Forays.Wrapper
	var $Forays_Wrapper$1 = function(T) {
		var $type = function() {
			this.value = T.getDefaultValue();
			this.value = T.getDefaultValue();
		};
		$type.$ctor1 = function(v) {
			this.value = T.getDefaultValue();
			this.value = v;
		};
		$type.$ctor1.prototype = $type.prototype;
		Type.registerGenericClassInstance($type, $Forays_Wrapper$1, [T], function() {
			return Object;
		}, function() {
			return [];
		});
		return $type;
	};
	Type.registerGenericClass(global, 'Forays.Wrapper$1', $Forays_Wrapper$1, 1);
	Type.registerClass(global, 'DungeonGen.Dungeon', $DungeonGen_Dungeon, Object);
	Type.registerClass(global, 'DungeonGen.MainClass', $DungeonGen_MainClass, Object);
	Type.registerClass(global, 'DungeonGen.pos', $DungeonGen_pos, Object);
	Type.registerClass(global, 'DungeonGen.StandardDungeon', $DungeonGen_StandardDungeon, $DungeonGen_Dungeon);
	Type.registerClass(global, 'Forays.Actable', $Forays_Actable, Object);
	Type.registerClass(global, 'Forays.PhysicalObject', $Forays_PhysicalObject, Object);
	Type.registerClass(global, 'Forays.Actor', $Forays_Actor, $Forays_PhysicalObject);
	Type.registerClass(global, 'Forays.Armor', $Forays_Armor, Object);
	Type.registerClass(global, 'Forays.AttackInfo', $Forays_AttackInfo, Object);
	Type.registerClass(global, 'Forays.AttackList', $Forays_AttackList, Object);
	Type.registerClass(global, 'Forays.Buffer', $Forays_Buffer, Object);
	Type.registerClass(global, 'Forays.colorchar', $Forays_colorchar, Object);
	Type.registerClass(global, 'Forays.colorstring', $Forays_colorstring, Object);
	Type.registerClass(global, 'Forays.ConsoleKey', $Forays_ConsoleKey, Object);
	Type.registerClass(global, 'Forays.ConsoleKeyInfo', $Forays_ConsoleKeyInfo, Object);
	Type.registerClass(global, 'Forays.ConsoleModifiers', $Forays_ConsoleModifiers, Object);
	Type.registerClass(global, 'Forays.cstr', $Forays_cstr, Object);
	Type.registerClass(global, 'Forays.Damage', $Forays_Damage, Object);
	Type.registerClass(global, 'Forays.Event', $Forays_Event, Object);
	Type.registerClass(global, 'Forays.Extensions', $Forays_Extensions, Object);
	Type.registerClass(global, 'Forays.Feat', $Forays_Feat, Object);
	Type.registerClass(global, 'Forays.Game', $Forays_Game, Object);
	Type.registerClass(global, 'Forays.Global', $Forays_Global, Object);
	Type.registerClass(global, 'Forays.Help', $Forays_Help, Object);
	Type.registerClass(global, 'Forays.Item', $Forays_Item, $Forays_PhysicalObject);
	Type.registerClass(global, 'Forays.MagicItem', $Forays_MagicItem, Object);
	Type.registerClass(global, 'Forays.Map', $Forays_Map, Object);
	Type.registerClass(global, 'Forays.pos', $Forays_pos, Object);
	Type.registerClass(global, 'Forays.Queue', $Forays_Queue, Object);
	Type.registerClass(global, 'Forays.ROTConsole', $Forays_ROTConsole, Object);
	Type.registerClass(global, 'Forays.Screen', $Forays_Screen, Object);
	Type.registerClass(global, 'Forays.Skill', $Forays_Skill, Object);
	Type.registerClass(global, 'Forays.Spell', $Forays_Spell, Object);
	Type.registerClass(global, 'Forays.Tile', $Forays_Tile, $Forays_PhysicalObject);
	Type.registerClass(global, 'Forays.Weapon', $Forays_Weapon, Object);
	$DungeonGen_Dungeon.h = 22;
	$DungeonGen_Dungeon.w = 66;
	$Forays_ConsoleKey.d0 = 48;
	$Forays_ConsoleKey.d1 = 49;
	$Forays_ConsoleKey.d2 = 50;
	$Forays_ConsoleKey.d3 = 51;
	$Forays_ConsoleKey.d4 = 52;
	$Forays_ConsoleKey.d5 = 53;
	$Forays_ConsoleKey.d6 = 54;
	$Forays_ConsoleKey.d7 = 55;
	$Forays_ConsoleKey.d8 = 56;
	$Forays_ConsoleKey.d9 = 57;
	$Forays_ConsoleKey.alt = 18;
	$Forays_ConsoleKey.backspace = 8;
	$Forays_ConsoleKey.capS_LOCK = 20;
	$Forays_ConsoleKey.COMMA = 188;
	$Forays_ConsoleKey.COMMAND = 91;
	$Forays_ConsoleKey.commanD_LEFT = 91;
	$Forays_ConsoleKey.commanD_RIGHT = 93;
	$Forays_ConsoleKey.CONTROL = 17;
	$Forays_ConsoleKey.delete = 46;
	$Forays_ConsoleKey.downArrow = 40;
	$Forays_ConsoleKey.end = 35;
	$Forays_ConsoleKey.enter = 13;
	$Forays_ConsoleKey.escape = 27;
	$Forays_ConsoleKey.home = 36;
	$Forays_ConsoleKey.INSERT = 45;
	$Forays_ConsoleKey.leftArrow = 37;
	$Forays_ConsoleKey.MENU = 93;
	$Forays_ConsoleKey.numpaD_ADD = 107;
	$Forays_ConsoleKey.numpaD_DECIMAL = 110;
	$Forays_ConsoleKey.numpaD_DIVIDE = 111;
	$Forays_ConsoleKey.numpaD_ENTER = 108;
	$Forays_ConsoleKey.numpaD_MULTIPLY = 106;
	$Forays_ConsoleKey.numpaD_SUBTRACT = 109;
	$Forays_ConsoleKey.pageDown = 34;
	$Forays_ConsoleKey.pageUp = 33;
	$Forays_ConsoleKey.PERIOD = 190;
	$Forays_ConsoleKey.rightArrow = 39;
	$Forays_ConsoleKey.SHIFT = 16;
	$Forays_ConsoleKey.SPACE = 32;
	$Forays_ConsoleKey.tab = 9;
	$Forays_ConsoleKey.upArrow = 38;
	$Forays_ConsoleKey.WINDOWS = 91;
	$Forays_ConsoleKey.numPad0 = 96;
	$Forays_ConsoleKey.numPad1 = 97;
	$Forays_ConsoleKey.numPad2 = 98;
	$Forays_ConsoleKey.numPad3 = 99;
	$Forays_ConsoleKey.numPad4 = 100;
	$Forays_ConsoleKey.numPad5 = 101;
	$Forays_ConsoleKey.numPad6 = 102;
	$Forays_ConsoleKey.numPad7 = 103;
	$Forays_ConsoleKey.numPad8 = 104;
	$Forays_ConsoleKey.numPad9 = 105;
	$Forays_ConsoleModifiers.plain = 0;
	$Forays_ConsoleModifiers.alt = 1;
	$Forays_ConsoleModifiers.shift = 2;
	$Forays_ConsoleModifiers.control = 4;
	$Forays_Buffer.$1$MField = null;
	$Forays_Buffer.$1$playerField = null;
	$Forays_Queue.$1$BField = null;
	$Forays_PhysicalObject.$1$MField = null;
	$Forays_Event.$1$QField = null;
	$Forays_Event.$1$BField = null;
	$Forays_Event.$1$EField = null;
	$Forays_Event.$1$MField = null;
	$Forays_Event.$1$playerField = null;
	$Forays_Help.displayed = new (Type.makeGenericType($Forays_Dict$2, [$Forays_TutorialTopic, Boolean]))();
	$Forays_Global.VERSION = 'version 0.7.0 ';
	$Forays_Global.LINUX = false;
	$Forays_Global.screeN_H = 25;
	$Forays_Global.screeN_W = 80;
	$Forays_Global.ROWS = 22;
	$Forays_Global.COLS = 66;
	$Forays_Global.maP_OFFSET_ROWS = 3;
	$Forays_Global.maP_OFFSET_COLS = 13;
	$Forays_Global.maX_LIGHT_RADIUS = 12;
	$Forays_Global.maX_INVENTORY_SIZE = 20;
	$Forays_Global.gamE_OVER = false;
	$Forays_Global.bosS_KILLED = false;
	$Forays_Global.QUITTING = false;
	$Forays_Global.SAVING = false;
	$Forays_Global.killeD_BY = 'debugged to death';
	$Forays_Global.quickstartinfo = null;
	$Forays_Global.options = {};
	$Forays_Global.titlescreen = ['                                                                                ', '                                                                                ', '        #######                                                                 ', '        #######                                                                 ', '        ##    #                                                                 ', '        ##                                                                      ', '        ##  #                                                                   ', '        #####                                                                   ', '        #####                                                                   ', '        ##  #   ###   # ##   ###    #   #   ###                                 ', '        ##     #   #  ##    #   #   #   #  #                                    ', '        ##     #   #  #     #   #    # #    ##                                  ', '        ##     #   #  #     #   #     #       #                                 ', '        ##      ###   #      ### ##   #    ###                                  ', '                                     #                                          ', '                                    #                                           ', '                                                                                ', '                                                                                ', '                         I N T O     N O R R E N D R I N                        ', '                                                                                ', '                                                                                ', '                                                                                ', '                                                                  version 0.7.0 ', '                                                             by Derrick Creamer '];
	$Forays_Tile.$proto = {};
	$Forays_Tile.$proto_feature = {};
	$Forays_Tile.$ROWS = $Forays_Global.ROWS;
	$Forays_Tile.$COLS = $Forays_Global.COLS;
	$Forays_Tile.$2$BField = null;
	$Forays_Tile.$2$QField = null;
	$Forays_Tile.$2$playerField = null;
	$Forays_Tile.$proto[1] = new $Forays_Tile.$ctor2(1, 'floor', 46, 1, true, false, null);
	$Forays_Tile.$proto[0] = new $Forays_Tile.$ctor2(0, 'wall', 35, 2, false, true, null);
	$Forays_Tile.$proto[3] = new $Forays_Tile.$ctor2(3, 'closed door', 43, 13, false, true, 2);
	$Forays_Tile.$proto[2] = new $Forays_Tile.$ctor2(2, 'open door', 45, 13, true, false, 3);
	$Forays_Tile.$proto[4] = new $Forays_Tile.$ctor2(4, 'stairway', 62, 1, true, false, null);
	$Forays_Tile.$proto[5] = new $Forays_Tile.$ctor2(5, 'treasure chest', 61, 13, true, false, null);
	$Forays_Tile.$proto[6] = new $Forays_Tile.$ctor2(6, 'fire pit', 48, 3, true, false, null);
	$Forays_Tile.$proto[6].set_light_radius(1);
	$Forays_Tile.$proto[7] = new $Forays_Tile.$ctor2(7, 'stalagmite', 94, 1, false, true, 1);
	$Forays_Tile.$proto[8] = new $Forays_Tile.$ctor2(8, 'quickfire trap', 94, 16, true, false, 1);
	$Forays_Tile.$proto[10] = new $Forays_Tile.$ctor2(10, 'light trap', 94, 6, true, false, 1);
	$Forays_Tile.$proto[9] = new $Forays_Tile.$ctor2(9, 'teleport trap', 94, 7, true, false, 1);
	$Forays_Tile.$proto[11] = new $Forays_Tile.$ctor2(11, 'sliding wall trap', 94, 15, true, false, 1);
	$Forays_Tile.$proto[12] = new $Forays_Tile.$ctor2(12, 'grenade trap', 94, 9, true, false, 1);
	$Forays_Tile.$proto[13] = new $Forays_Tile.$ctor2(13, 'stun trap', 94, 3, true, false, 1);
	$Forays_Tile.$define(14, 'alarm trap', 94, 1, true, false, 1);
	$Forays_Tile.$define(15, 'darkness trap', 94, 5, true, false, 1);
	$Forays_Tile.$define(16, 'poison gas trap', 94, 4, true, false, 1);
	$Forays_Tile.$define(17, 'dim vision trap', 94, 14, true, false, 1);
	$Forays_Tile.$define(18, 'ice trap', 94, 17, true, false, 1);
	$Forays_Tile.$define(19, 'phantom trap', 94, 8, true, false, 1);
	$Forays_Tile.$proto[20] = new $Forays_Tile.$ctor2(20, 'wall', 35, 2, false, true, 3);
	$Forays_Tile.$define(28, 'pile of rubble', 58, 2, false, true, 1);
	$Forays_Tile.$define(21, 'shrine of combat', 95, 10, true, false, 26);
	$Forays_Tile.$define(22, 'shrine of defense', 95, 1, true, false, 26);
	$Forays_Tile.$define(23, 'shrine of magic', 95, 7, true, false, 26);
	$Forays_Tile.$define(24, 'shrine of spirit', 95, 6, true, false, 26);
	$Forays_Tile.$define(25, 'shrine of stealth', 95, 5, true, false, 26);
	$Forays_Tile.$define(26, 'ruined shrine', 95, 9, true, false, null);
	$Forays_Tile.$define(27, 'spell exchange shrine', 95, 14, true, false, 26);
	$Forays_Tile.$define(29, 'fire geyser', 126, 3, true, false, null);
	$Forays_Tile.$define(30, 'statue', 38, 2, false, false, null);
	$Forays_Tile.$define(31, 'healing pool', 48, 8, true, false, 1);
	$Forays_Tile.$define(32, 'fog vent', 126, 2, true, false, null);
	$Forays_Tile.$define(33, 'gas vent', 126, 11, true, false, null);
	$Forays_Tile.$define(34, 'stone slab', 35, 1, false, true, null);
	$Forays_Tile.$define(35, 'chasm', 58, 12, true, false, null);
	$Forays_Tile.$proto_feature[0] = new $Forays_PhysicalObject.$ctor1('grenade', 44, 3);
	$Forays_Tile.$proto_feature[3] = new $Forays_PhysicalObject.$ctor1('quickfire', 38, 16);
	$Forays_Tile.$proto_feature[3].set_a_name('quickfire');
	$Forays_Tile.$proto_feature[1] = new $Forays_PhysicalObject.$ctor1('troll corpse', 37, 11);
	$Forays_Tile.$proto_feature[2] = new $Forays_PhysicalObject.$ctor1('troll seer corpse', 37, 8);
	$Forays_Tile.$proto_feature[4] = new $Forays_PhysicalObject.$ctor1('rune of retreat', 38, 19);
	$Forays_Tile.$proto_feature[6] = new $Forays_PhysicalObject.$ctor1('cloud of poison gas', 42, 11);
	$Forays_Tile.$proto_feature[5] = new $Forays_PhysicalObject.$ctor1('cloud of fog', 42, 2);
	$Forays_Tile.$proto_feature[7] = new $Forays_PhysicalObject.$ctor1('slime', 44, 4);
	$Forays_Tile.$proto_feature[7].set_a_name('slime');
	$Forays_Tile.$proto_feature[8] = new $Forays_PhysicalObject.$ctor1('blast fungus', 34, 10);
	$Forays_Tile.$proto_feature[9] = new $Forays_PhysicalObject.$ctor1('blast fungus(active)', 34, 3);
	$Forays_Tile.$proto_feature[10] = new $Forays_PhysicalObject.$ctor1('blast fungus(exploding)', 34, 6);
	//mimic
	//not an actual trap, but arena rooms, too. perhaps you'll see the opponent, in stasis.
	//"Touch the [tile]?(Y/N) "   if you touch it, you're stuck in the arena until one of you dies.
	//poison gas
	$Forays_Item.$proto = {};
	$Forays_Item.$2$QField = null;
	$Forays_Item.$2$BField = null;
	$Forays_Item.$2$playerField = null;
	$Forays_Item.$proto[0] = new $Forays_Item.$ctor2(0, 'potion~ of healing', '!', 14);
	$Forays_Item.$proto[1] = new $Forays_Item.$ctor2(1, 'potion~ of regeneration', '!', 4);
	$Forays_Item.$proto[2] = new $Forays_Item.$ctor2(2, 'potion~ of toxin immunity', '!', 3);
	//			proto[ConsumableType.RESISTANCE] = new Item(ConsumableType.RESISTANCE,"potion~ of resistance","!",Color.Yellow);
	$Forays_Item.$proto[3] = new $Forays_Item.$ctor2(3, 'potion~ of clarity', '!', 2);
	$Forays_Item.$proto[5] = new $Forays_Item.$ctor2(5, 'rune~ of blinking', '&', 8);
	$Forays_Item.$proto[6] = new $Forays_Item.$ctor2(6, 'rune~ of teleportation', '&', 10);
	$Forays_Item.$proto[7] = new $Forays_Item.$ctor2(7, 'rune~ of passage', '&', 5);
	$Forays_Item.$proto[9] = new $Forays_Item.$ctor2(9, 'scroll~ of detect monsters', '?', 1);
	$Forays_Item.$proto[10] = new $Forays_Item.$ctor2(10, 'scroll~ of magic map', '?', 2);
	$Forays_Item.$proto[11] = new $Forays_Item.$ctor2(11, 'orb~ of sunlight', '*', 1);
	$Forays_Item.$proto[12] = new $Forays_Item.$ctor2(12, 'orb~ of darkness', '*', 9);
	$Forays_Item.$proto[13] = new $Forays_Item.$ctor2(13, 'prismatic orb~', '*', 19);
	$Forays_Item.$proto[14] = new $Forays_Item.$ctor2(14, 'orb~ of freezing', '*', 17);
	$Forays_Item.$proto[17] = new $Forays_Item.$ctor2(17, 'bandage~', '{', 1);
	$Forays_Item.$define(15, 'orb~ of quickfire', '*', 16);
	$Forays_Item.$define(4, 'potion~ of cloaking', '!', 12);
	$Forays_Item.$define(16, 'orb~ of fog', '*', 2);
	$Forays_Item.$define(8, 'rune~ of time', '&', 4);
	$Forays_Actor.player_name = null;
	$Forays_Actor.feats_in_order = null;
	$Forays_Actor.partial_feats_in_order = null;
	$Forays_Actor.spells_in_order = null;
	$Forays_Actor.tiebreakers = null;
	$Forays_Actor.attack = new Array(20);
	$Forays_Actor.$proto = new (Type.makeGenericType($Forays_Dict$2, [$Forays_ActorType, $Forays_Actor]))();
	$Forays_Actor.$ROWS = $Forays_Global.ROWS;
	$Forays_Actor.$COLS = $Forays_Global.COLS;
	$Forays_Actor.$2$QField = null;
	$Forays_Actor.$2$BField = null;
	$Forays_Actor.$2$playerField = null;
	$Forays_Actor.$define(1, 'rat', 'r', 9, 15, 90, 1, 0, [22, 9, 7]);
	$Forays_Actor.$define(3, 'goblin', 'g', 4, 25, 100, 1, 0, [6, 5, 22]);
	$Forays_Actor.$define(4, 'large bat', 'b', 9, 20, 60, 1, 0, [23, 10, 9, 7, 8]);
	$Forays_Actor.$define(5, 'wolf', 'c', 13, 25, 50, 1, 0, [22, 7]);
	$Forays_Actor.$define(6, 'skeleton', 's', 1, 30, 100, 1, 0, [1, 58, 59, 61, 62, 63, 23]);
	$Forays_Actor.$define(7, 'blood moth', 'i', 3, 25, 100, 1, 0, [10]);
	//Define(ActorType.SHAMBLING_SCARECROW,"shambling scarecrow","x",Color.DarkYellow,30,90,0,1,0,AttrType.CONSTRUCT,AttrType.RESIST_BASH,AttrType.RESIST_PIERCE,AttrType.IMMUNE_ARROWS,AttrType.DARKVISION});
	$Forays_Actor.$define(8, 'swordsman', 'p', 1, 35, 100, 2, 0, [6, 5]);
	$Forays_Actor.$define(9, 'darkness dweller', 'h', 11, 45, 100, 2, 0, [6, 5, 23]);
	$Forays_Actor.$define(10, 'carnivorous bramble', 'B', 13, 35, 100, 2, 0, [3, 12, 8]);
	$Forays_Actor.$define(11, 'frostling', 'E', 2, 35, 100, 2, 0, [65, 48]);
	$Forays_Actor.$define(12, 'dream warrior', 'p', 8, 40, 100, 2, 0, [6, 5, 22]);
	$Forays_Actor.$define(53, 'dream warrior', 'p', 8, 1, 100, 0, 0, [6, 5, 2, 22]);
	$Forays_Actor.$define(13, 'cultist', 'p', 10, 35, 100, 3, 0, [6, 5, 104]);
	$Forays_Actor.$define(14, 'goblin archer', 'g', 15, 25, 100, 3, 0, [6, 5, 22]);
	$Forays_Actor.$define(15, 'goblin shaman', 'g', 7, 25, 100, 3, 0, [6, 5, 22]);
	$Forays_Actor.prototype$1(15).gainSpell([2, 1, 5]);
	$Forays_Actor.prototype$1(15).skills.set_item(2, 4);
	$Forays_Actor.$define(16, 'mimic', 'm', 1, 30, 200, 3, 0, [56]);
	$Forays_Actor.$define(17, 'skulking killer', 'p', 12, 35, 100, 3, 0, [6, 5, 0, 22]);
	$Forays_Actor.prototype$1(17).skills.set_item(4, 4);
	$Forays_Actor.$define(18, 'zombie', 'z', 9, 50, 150, 4, 0, [1, 5, 68, 59, 62]);
	$Forays_Actor.$define(19, 'dire rat', 'r', 10, 25, 90, 4, 0, [22, 106, 9, 7]);
	$Forays_Actor.$define(20, 'robed zealot', 'p', 6, 40, 100, 4, 6, [6, 5]);
	$Forays_Actor.prototype$1(20).gainSpell([21, 20, 22]);
	$Forays_Actor.prototype$1(20).skills.set_item(2, 6);
	$Forays_Actor.$define(21, 'shadow', 'G', 9, 40, 100, 4, 0, [1, 62, 23, 13]);
	$Forays_Actor.$define(22, 'banshee', 'G', 7, 40, 80, 4, 0, [1, 62, 22, 10]);
	$Forays_Actor.$define(23, 'warg', 'c', 1, 30, 50, 5, 0, [22, 105, 7]);
	$Forays_Actor.$define(24, 'phase spider', 'A', 8, 45, 100, 5, 0, [49, 22]);
	$Forays_Actor.$define(25, 'deranged ascetic', 'p', 20, 40, 100, 5, 0, [6, 5, 75]);
	$Forays_Actor.$define(26, 'poltergeist', 'G', 11, 35, 100, 5, 0, [1, 62, 22, 9, 10]);
	$Forays_Actor.$define(27, 'cavern hag', 'h', 5, 40, 100, 5, 0, [6, 5]);
	$Forays_Actor.$define(28, 'compy', 'l', 4, 25, 100, 6, 0, [9, 106, 7]);
	$Forays_Actor.$define(29, 'noxious worm', 'w', 14, 55, 140, 6, 0, [60, 67]);
	$Forays_Actor.$define(30, 'berserker', 'p', 3, 40, 100, 6, 0, [6, 5]);
	$Forays_Actor.$define(31, 'troll', 'T', 11, 50, 100, 6, 0, [6, 24, 25, 23]);
	$Forays_Actor.$define(32, 'vampire', 'V', 5, 40, 100, 6, 0, [1, 5, 68, 10, 43, 44, 55, 62]);
	$Forays_Actor.$define(33, 'crusading knight', 'p', 9, 45, 100, 7, 6, [6, 5]);
	$Forays_Actor.prototype$1(33).skills.set_item(1, 7);
	$Forays_Actor.$define(34, 'skeletal sabertooth', 'f', 1, 40, 50, 7, 0, [1, 58, 59, 61, 62, 63, 23, 7]);
	$Forays_Actor.$define(35, 'mud elemental', 'E', 13, 35, 100, 7, 0, [60, 58, 59, 67, 66]);
	$Forays_Actor.$define(54, 'mud tentacle', '~', 13, 1, 100, 0, 0, [2, 8, 56, 12, 67]);
	$Forays_Actor.$define(36, 'entrancer', 'p', 14, 35, 100, 7, 0, [6, 5]);
	$Forays_Actor.$define(37, 'marble horror', '&', 2, 45, 100, 7, 0, [2, 23, 52, 67, 44]);
	$Forays_Actor.$define(38, 'ogre', 'O', 4, 55, 100, 8, 0, [6, 23, 104]);
	$Forays_Actor.$define(39, 'orc grenadier', 'o', 13, 50, 100, 8, 0, [6, 5, 22]);
	$Forays_Actor.$define(40, 'shadowveil duelist', 'p', 15, 40, 100, 8, 0, [6, 5, 13]);
	$Forays_Actor.$define(41, 'carrion crawler', 'i', 11, 35, 100, 8, 0, [50, 23]);
	$Forays_Actor.$define(42, 'spellmuddle pixie', 'y', 21, 35, 50, 8, 0, [9, 10, 75]);
	$Forays_Actor.$define(43, 'stone golem', 'x', 2, 65, 120, 9, 0, [2, 53, 58, 59, 61, 62, 63, 23]);
	$Forays_Actor.$define(44, 'pyren archer', 'P', 10, 55, 100, 9, 0, [6, 5, 47, 57, 61]);
	$Forays_Actor.$define(45, 'orc assassin', 'o', 12, 50, 100, 9, 0, [6, 5, 0]);
	$Forays_Actor.prototype$1(45).skills.set_item(4, 9);
	$Forays_Actor.$define(46, 'troll seer', 'T', 8, 50, 100, 9, 0, [6, 24, 25, 23]);
	$Forays_Actor.prototype$1(46).gainSpell([12, 15]);
	$Forays_Actor.prototype$1(46).skills.set_item(2, 9);
	$Forays_Actor.$define(47, 'mechanical knight', 'x', 10, 20, 100, 9, 0, [2, 76, 7, 8]);
	$Forays_Actor.$define(48, 'orc warmage', 'o', 3, 50, 100, 10, 0, [6, 5, 22]);
	$Forays_Actor.prototype$1(48).gainSpell([17, 1, 9, 10, 12, 6, 13]);
	$Forays_Actor.prototype$1(48).skills.set_item(2, 10);
	$Forays_Actor.$define(49, 'lasher fungus', 'F', 11, 50, 100, 10, 0, [3, 74, 60, 61, 23, 8, 12]);
	$Forays_Actor.$define(50, 'necromancer', 'p', 5, 40, 100, 10, 0, [6, 5]);
	$Forays_Actor.$define(51, 'luminous avenger', 'E', 6, 40, 50, 10, 12, [72]);
	$Forays_Actor.$define(52, 'corpsetower behemoth', 'z', 14, 75, 120, 10, 0, [1, 19, 24, 62, 54]);
	$Forays_Actor.$define(2, 'fire drake', 'D', 10, 200, 50, 10, 2, [107, 23, 47, 64, 6]);
	$Forays_Actor.$define(56, 'phantom', '?', 8, 1, 100, 0, 0, [2, 10, 67]);
	//the template on which the different types of phantoms are based
	$Forays_Game.game = null;
	$Forays_Game.console = null;
	$Forays_Game.console = new $Forays_ROTConsole();
	$Forays_Game.console.cursorVisible = false;
	$Forays_Screen.$memory = null;
	$Forays_Screen.$terminal_bold = false;
	$Forays_Screen.$memory = Array.multidim($Forays_colorchar.getDefaultValue(), $Forays_Global.screeN_H, $Forays_Global.screeN_W);
	for (var i = 0; i < $Forays_Global.screeN_H; ++i) {
		for (var j = 0; j < $Forays_Global.screeN_W; ++j) {
			$Forays_Screen.$memory.set(i, j, new $Forays_colorchar.$ctor8(' ', 0, 0));
			//					memory[i,j].c = " ";
			//					memory[i,j].color = Color.Black;
			//					memory[i,j].bgcolor = Color.Black;
		}
	}
	$Forays_Screen.set_backgroundColor($Forays_Game.console.get_backgroundColor());
	$Forays_Screen.set_foregroundColor($Forays_Game.console.get_foregroundColor());
	$Forays_Map.$allpositions = [];
	$Forays_Map.$ROWS = $Forays_Global.ROWS;
	$Forays_Map.$COLS = $Forays_Global.COLS;
	$Forays_Map.$1$EField = null;
	$Forays_Map.$1$playerField = null;
	$Forays_Map.$1$QField = null;
	$Forays_Map.$1$BField = null;
	for (var i = 0; i < $Forays_Map.$ROWS; ++i) {
		for (var j = 0; j < $Forays_Map.$COLS; ++j) {
			$Forays_Map.$allpositions.add(new $Forays_pos(i, j));
		}
	}
	$Forays_AttackList.$attack = new Array(33);
	$Forays_AttackList.$attack[0] = new $Forays_AttackInfo.$ctor1(100, 1, 0, '& ^hit *');
	//the player's default attack
	$Forays_AttackList.$attack[1] = new $Forays_AttackInfo.$ctor1(100, 2, 0, '& ^hits *');
	$Forays_AttackList.$attack[2] = new $Forays_AttackInfo.$ctor1(100, 1, 8, '& ^bites *');
	$Forays_AttackList.$attack[3] = new $Forays_AttackInfo.$ctor1(100, 1, 6, '& ^scratches *');
	$Forays_AttackList.$attack[4] = new $Forays_AttackInfo.$ctor1(100, 2, 8, '& ^bites *');
	$Forays_AttackList.$attack[5] = new $Forays_AttackInfo.$ctor1(100, 3, 8, '& ^bites *');
	$Forays_AttackList.$attack[6] = new $Forays_AttackInfo.$ctor1(100, 3, 6, '& ^rakes *');
	$Forays_AttackList.$attack[7] = new $Forays_AttackInfo.$ctor1(100, 2, 2, '& hits * with a blast of cold');
	$Forays_AttackList.$attack[8] = new $Forays_AttackInfo.$ctor1(100, 4, 2, '& releases a burst of cold');
	$Forays_AttackList.$attack[9] = new $Forays_AttackInfo.$ctor1(100, 0, 10, '& ^hits *');
	//dream warrior's clone attack
	$Forays_AttackList.$attack[10] = new $Forays_AttackInfo.$ctor1(100, 3, 0, '& ^hits *');
	$Forays_AttackList.$attack[11] = new $Forays_AttackInfo.$ctor1(200, 2, 0, '& lunges forward and ^hits *');
	$Forays_AttackList.$attack[12] = new $Forays_AttackInfo.$ctor1(100, 3, 7, '& ^hammers *');
	$Forays_AttackList.$attack[13] = new $Forays_AttackInfo.$ctor1(100, 2, 0, '& touches *');
	$Forays_AttackList.$attack[14] = new $Forays_AttackInfo.$ctor1(100, 2, 6, '& ^claws *');
	$Forays_AttackList.$attack[15] = new $Forays_AttackInfo.$ctor1(100, 3, 0, '& ^punches *');
	$Forays_AttackList.$attack[16] = new $Forays_AttackInfo.$ctor1(100, 3, 0, '& ^kicks *');
	$Forays_AttackList.$attack[17] = new $Forays_AttackInfo.$ctor1(100, 3, 0, '& ^strikes *');
	$Forays_AttackList.$attack[18] = new $Forays_AttackInfo.$ctor1(100, 2, 0, '& slimes *');
	$Forays_AttackList.$attack[19] = new $Forays_AttackInfo.$ctor1(100, 0, 10, '& grabs at *');
	$Forays_AttackList.$attack[20] = new $Forays_AttackInfo.$ctor1(100, 2, 0, '& clutches at *');
	$Forays_AttackList.$attack[21] = new $Forays_AttackInfo.$ctor1(100, 3, 7, '& ^slams *');
	$Forays_AttackList.$attack[22] = new $Forays_AttackInfo.$ctor1(100, 3, 6, '& ^claws *');
	$Forays_AttackList.$attack[23] = new $Forays_AttackInfo.$ctor1(200, 5, 7, '& ^hits * with a huge mace');
	$Forays_AttackList.$attack[24] = new $Forays_AttackInfo.$ctor1(100, 1, 0, '& hits *');
	$Forays_AttackList.$attack[25] = new $Forays_AttackInfo.$ctor1(100, 4, 0, '& ^hits *');
	$Forays_AttackList.$attack[26] = new $Forays_AttackInfo.$ctor1(100, 0, 10, '& lashes * with a tentacle');
	$Forays_AttackList.$attack[27] = new $Forays_AttackInfo.$ctor1(100, 2, 6, '& ^scratches *');
	$Forays_AttackList.$attack[28] = new $Forays_AttackInfo.$ctor1(100, 4, 7, '& ^slams *');
	$Forays_AttackList.$attack[29] = new $Forays_AttackInfo.$ctor1(120, 3, 0, '& extends a tentacle and ^hits *');
	$Forays_AttackList.$attack[30] = new $Forays_AttackInfo.$ctor1(120, 1, 0, '& extends a tentacle and drags * closer');
	$Forays_AttackList.$attack[31] = new $Forays_AttackInfo.$ctor1(100, 5, 7, '& ^clobbers *');
	$Forays_AttackList.$attack[32] = new $Forays_AttackInfo.$ctor1(150, 6, 1, '& breathes fire');
	$Forays_Game.$main();
})();
