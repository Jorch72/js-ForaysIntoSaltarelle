/*Copyright (c) 2011-2012  Derrick Creamer
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
using System;
using System.Collections.Generic;
using System.Html;
using System.Linq;
using System.Threading.Tasks;
namespace Forays{
	public class Tile : PhysicalObject{
		public TileType ttype{get;set;}
		public bool passable{get;set;}
		public bool opaque{get{ return internal_opaque || features.Contains(FeatureType.FOG); } set{ internal_opaque = value; }}
		private bool internal_opaque; //no need to ever access this directly
		public bool seen{get;set;}
		public bool solid_rock{get;set;} //used for walls that will never be seen, to speed up LOS checks
		public int light_value{get{ return internal_light_value; }
			set{
				internal_light_value = value;
				if(value > 0 && features.Contains(FeatureType.FUNGUS)){
					Q.Add(new Event(this,200,EventType.BLAST_FUNGUS));
					B.Add("The blast fungus starts to smolder in the light. ",new PhysicalObject[]{this});
					features.Remove(FeatureType.FUNGUS);
					features.Add(FeatureType.FUNGUS_ACTIVE);
				}
			}
		}
		private int internal_light_value; //no need to ever access this directly, either
		public TileType? toggles_into;
		public Item inv{get;set;}
		public List<FeatureType> features = new List<FeatureType>();

        private static JsDictionary<TileType, Tile> proto = new JsDictionary<TileType, Tile>();
		public static Tile Prototype(TileType type){ return proto[type]; }
        private static JsDictionary<FeatureType, PhysicalObject> proto_feature = new JsDictionary<FeatureType, PhysicalObject>();
		public static PhysicalObject Feature(FeatureType type){ return proto_feature[type]; }
		private static int ROWS = Global.ROWS;
		private static int COLS = Global.COLS;
		//public static Map M{get;set;} //inherited
		public static Buffer B{get;set;}
		public static Queue Q{get;set;}
		public static Actor player{get;set;}
		static Tile(){
			proto[TileType.FLOOR] = new Tile(TileType.FLOOR,"floor",'.',Color.White,true,false,null);
			proto[TileType.WALL] = new Tile(TileType.WALL,"wall",'#',Color.Gray,false,true,null);
			proto[TileType.DOOR_C] = new Tile(TileType.DOOR_C,"closed door",'+',Color.DarkYellow,false,true,TileType.DOOR_O);
			proto[TileType.DOOR_O] = new Tile(TileType.DOOR_O,"open door",'-',Color.DarkYellow,true,false,TileType.DOOR_C);
			proto[TileType.STAIRS] = new Tile(TileType.STAIRS,"stairway",'>',Color.White,true,false,null);
			proto[TileType.CHEST] = new Tile(TileType.CHEST,"treasure chest",'=',Color.DarkYellow,true,false,null);
			proto[TileType.FIREPIT] = new Tile(TileType.FIREPIT,"fire pit",'0',Color.Red,true,false,null);
			proto[TileType.FIREPIT].light_radius = 1;
			proto[TileType.STALAGMITE] = new Tile(TileType.STALAGMITE,"stalagmite",'^',Color.White,false,true,TileType.FLOOR);
			proto[TileType.QUICKFIRE_TRAP] = new Tile(TileType.QUICKFIRE_TRAP,"quickfire trap",'^',Color.RandomFire,true,false,TileType.FLOOR);
			proto[TileType.LIGHT_TRAP] = new Tile(TileType.LIGHT_TRAP,"light trap",'^',Color.Yellow,true,false,TileType.FLOOR);
			proto[TileType.TELEPORT_TRAP] = new Tile(TileType.TELEPORT_TRAP,"teleport trap",'^',Color.Magenta,true,false,TileType.FLOOR);
			proto[TileType.UNDEAD_TRAP] = new Tile(TileType.UNDEAD_TRAP,"sliding wall trap",'^',Color.DarkCyan,true,false,TileType.FLOOR);
			proto[TileType.GRENADE_TRAP] = new Tile(TileType.GRENADE_TRAP,"grenade trap",'^',Color.DarkGray,true,false,TileType.FLOOR);
			proto[TileType.STUN_TRAP] = new Tile(TileType.STUN_TRAP,"stun trap",'^',Color.Red,true,false,TileType.FLOOR);
			Define(TileType.ALARM_TRAP,"alarm trap",'^',Color.White,true,false,TileType.FLOOR);
			Define(TileType.DARKNESS_TRAP,"darkness trap",'^',Color.Blue,true,false,TileType.FLOOR);
			Define(TileType.POISON_GAS_TRAP,"poison gas trap",'^',Color.Green,true,false,TileType.FLOOR);
			Define(TileType.DIM_VISION_TRAP,"dim vision trap",'^',Color.DarkMagenta,true,false,TileType.FLOOR);
			Define(TileType.ICE_TRAP,"ice trap",'^',Color.RandomIce,true,false,TileType.FLOOR);
			Define(TileType.PHANTOM_TRAP,"phantom trap",'^',Color.Cyan,true,false,TileType.FLOOR);
			proto[TileType.HIDDEN_DOOR] = new Tile(TileType.HIDDEN_DOOR,"wall",'#',Color.Gray,false,true,TileType.DOOR_C);
			Define(TileType.RUBBLE,"pile of rubble",':',Color.Gray,false,true,TileType.FLOOR);
			Define(TileType.COMBAT_SHRINE,"shrine of combat",'_',Color.DarkRed,true,false,TileType.RUINED_SHRINE);
			Define(TileType.DEFENSE_SHRINE,"shrine of defense",'_',Color.White,true,false,TileType.RUINED_SHRINE);
			Define(TileType.MAGIC_SHRINE,"shrine of magic",'_',Color.Magenta,true,false,TileType.RUINED_SHRINE);
			Define(TileType.SPIRIT_SHRINE,"shrine of spirit",'_',Color.Yellow,true,false,TileType.RUINED_SHRINE);
			Define(TileType.STEALTH_SHRINE,"shrine of stealth",'_',Color.Blue,true,false,TileType.RUINED_SHRINE);
			Define(TileType.RUINED_SHRINE,"ruined shrine",'_',Color.DarkGray,true,false,null);
			Define(TileType.SPELL_EXCHANGE_SHRINE,"spell exchange shrine",'_',Color.DarkMagenta,true,false,TileType.RUINED_SHRINE);
			Define(TileType.FIRE_GEYSER,"fire geyser",'~',Color.Red,true,false,null);
			Define(TileType.STATUE,"statue",'&',Color.Gray,false,false,null);
			Define(TileType.HEALING_POOL,"healing pool",'0',Color.Cyan,true,false,TileType.FLOOR);
			Define(TileType.FOG_VENT,"fog vent",'~',Color.Gray,true,false,null);
			Define(TileType.POISON_GAS_VENT,"gas vent",'~',Color.DarkGreen,true,false,null);
			Define(TileType.STONE_SLAB,"stone slab",'#',Color.White,false,true,null);
			Define(TileType.CHASM,"chasm",':',Color.DarkBlue,true,false,null);

			proto_feature[FeatureType.GRENADE] = new PhysicalObject("grenade",',',Color.Red);
			proto_feature[FeatureType.QUICKFIRE] = new PhysicalObject("quickfire",'&',Color.RandomFire);
			proto_feature[FeatureType.QUICKFIRE].a_name = "quickfire";
			proto_feature[FeatureType.TROLL_CORPSE] = new PhysicalObject("troll corpse",'%',Color.DarkGreen);
			proto_feature[FeatureType.TROLL_SEER_CORPSE] = new PhysicalObject("troll seer corpse",'%',Color.Cyan);
			proto_feature[FeatureType.RUNE_OF_RETREAT] = new PhysicalObject("rune of retreat",'&',Color.RandomPrismatic);
			proto_feature[FeatureType.POISON_GAS] = new PhysicalObject("cloud of poison gas",'*',Color.DarkGreen);
			proto_feature[FeatureType.FOG] = new PhysicalObject("cloud of fog",'*',Color.Gray);
			proto_feature[FeatureType.SLIME] = new PhysicalObject("slime",',',Color.Green);
			proto_feature[FeatureType.SLIME].a_name = "slime";
			proto_feature[FeatureType.FUNGUS] = new PhysicalObject("blast fungus",'"',Color.DarkRed);
			proto_feature[FeatureType.FUNGUS_ACTIVE] = new PhysicalObject("blast fungus(active)",'"',Color.Red);
			proto_feature[FeatureType.FUNGUS_PRIMED] = new PhysicalObject("blast fungus(exploding)",'"',Color.Yellow);

			//mimic
			//not an actual trap, but arena rooms, too. perhaps you'll see the opponent, in stasis.
				//"Touch the [tile]?(Y/N) "   if you touch it, you're stuck in the arena until one of you dies.
			//poison gas
		}
		private static void Define(TileType type_,string name_,char symbol_,Color color_,bool passable_,bool opaque_,TileType? toggles_into_){
			proto[type_] = new Tile(type_,name_,symbol_,color_,passable_,opaque_,toggles_into_);
		}
		public Tile(){}
		public Tile(Tile t,int r,int c){
			ttype = t.ttype;
			name = t.name;
			a_name = t.a_name;
			the_name = t.the_name;
			symbol = t.symbol;
			color = t.color;
			passable = t.passable;
			opaque = t.opaque;
			seen = false;
			solid_rock = false;
			light_value = 0;
			toggles_into = t.toggles_into;
			inv = null;
			row = r;
			col = c;
			light_radius = t.light_radius;
		}
		public Tile(TileType type_,string name_,char symbol_,Color color_,bool passable_,bool opaque_,TileType? toggles_into_){
			ttype = type_;
			name = name_;
			the_name = "the " + name;
			switch(name[0]){
			case 'a':
			case 'e':
			case 'i':
			case 'o':
			case 'u':
			case 'A':
			case 'E':
			case 'I':
			case 'O':
			case 'U':
				a_name = "an " + name;
				break;
			default:
				a_name = "a " + name;
				break;
			}
			symbol = string.FromCharCode(symbol_);
			color = color_;
			passable = passable_;
			opaque = opaque_;
			seen = false;
			solid_rock = false;
			light_value = 0;
			toggles_into = toggles_into_;
			inv = null;
			light_radius = 0;
		}
		public override string ToString(){
			switch(ttype){
			case TileType.FLOOR:
				return ".";
			case TileType.WALL:
				return "#";
			case TileType.DOOR_C:
				return "+";
			case TileType.DOOR_O:
				return "-";
			case TileType.STAIRS:
				return ">";
			case TileType.CHEST:
				return "~";
			case TileType.FIREPIT:
				return "0";
			case TileType.STATUE:
				return "&";
			case TileType.COMBAT_SHRINE:
			case TileType.DEFENSE_SHRINE:
			case TileType.MAGIC_SHRINE:
			case TileType.RUINED_SHRINE:
			case TileType.SPELL_EXCHANGE_SHRINE:
			case TileType.SPIRIT_SHRINE:
			case TileType.STEALTH_SHRINE:
				return "_"; //this is really only useful while debugging
			default:
				return ".";
			}
		}
		public static Tile Create(TileType type,int r,int c){
			Tile t = null;
			if(M.tile[r,c] == null){
				t = new Tile(proto[type],r,c);
				M.tile[r,c] = t; //bounds checking here?
			}
			return t;
		}
		public static TileType RandomTrap(){
			int i = Global.Roll(12) + 7;
			return (TileType)i;
		}
		public static TileType RandomVent(){
			switch(Global.Roll(3)){
			case 1:
				return TileType.FIRE_GEYSER;
			case 2:
				return TileType.FOG_VENT;
			case 3:
			default:
				return TileType.POISON_GAS_VENT;
			}
		}
		public bool Is(TileType t){
			if(ttype == t){
				return true;
			}
			return false;
		}
		public bool Is(FeatureType t){
			foreach(FeatureType feature in features){
				if(feature == t){
					return true;
				}
			}
			return false;
		}
		public string FeatureSymbol(){
			if(Is(FeatureType.FUNGUS_PRIMED)){
				return Tile.Feature(FeatureType.FUNGUS_PRIMED).symbol;
			}
			else{
				if(Is(FeatureType.GRENADE)){
					return Tile.Feature(FeatureType.GRENADE).symbol;
				}
				else{
					if(Is(FeatureType.QUICKFIRE)){
						return Tile.Feature(FeatureType.QUICKFIRE).symbol;
					}
					else{
						if(Is(FeatureType.POISON_GAS)){
							return Tile.Feature(FeatureType.POISON_GAS).symbol;
						}
						else{
							if(Is(FeatureType.FUNGUS_ACTIVE)){
								return Tile.Feature(FeatureType.FUNGUS_ACTIVE).symbol;
							}
							else{
								if(Is(FeatureType.FOG)){
									return Tile.Feature(FeatureType.FOG).symbol;
								}
								else{
									if(Is(FeatureType.FUNGUS)){
										return Tile.Feature(FeatureType.FUNGUS).symbol;
									}
									else{
										if(Is(FeatureType.TROLL_SEER_CORPSE)){
											return Tile.Feature(FeatureType.TROLL_SEER_CORPSE).symbol;
										}
										else{
											if(Is(FeatureType.TROLL_CORPSE)){
												return Tile.Feature(FeatureType.TROLL_CORPSE).symbol;
											}
											else{
												if(Is(FeatureType.RUNE_OF_RETREAT)){
													return Tile.Feature(FeatureType.RUNE_OF_RETREAT).symbol;
												}
												else{
													if(Is(FeatureType.SLIME)){
														return Tile.Feature(FeatureType.SLIME).symbol;
													}
													else{
														return symbol;
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
			}
		}
		public Color FeatureColor(){
			if(Is(FeatureType.FUNGUS_PRIMED)){
				return Tile.Feature(FeatureType.FUNGUS_PRIMED).color;
			}
			else{
				if(Is(FeatureType.GRENADE)){
					return Tile.Feature(FeatureType.GRENADE).color;
				}
				else{
					if(Is(FeatureType.QUICKFIRE)){
						return Tile.Feature(FeatureType.QUICKFIRE).color;
					}
					else{
						if(Is(FeatureType.POISON_GAS)){
							return Tile.Feature(FeatureType.POISON_GAS).color;
						}
						else{
							if(Is(FeatureType.FUNGUS_ACTIVE)){
								return Tile.Feature(FeatureType.FUNGUS_ACTIVE).color;
							}
							else{
								if(Is(FeatureType.FOG)){
									return Tile.Feature(FeatureType.FOG).color;
								}
								else{
									if(Is(FeatureType.FUNGUS)){
										return Tile.Feature(FeatureType.FUNGUS).color;
									}
									else{
										if(Is(FeatureType.TROLL_SEER_CORPSE)){
											return Tile.Feature(FeatureType.TROLL_SEER_CORPSE).color;
										}
										else{
											if(Is(FeatureType.TROLL_CORPSE)){
												return Tile.Feature(FeatureType.TROLL_CORPSE).color;
											}
											else{
												if(Is(FeatureType.RUNE_OF_RETREAT)){
													return Tile.Feature(FeatureType.RUNE_OF_RETREAT).color;
												}
												else{
													if(Is(FeatureType.SLIME)){
														return Tile.Feature(FeatureType.SLIME).color;
													}
													else{
														return color;
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
			}
		}
		public string Preposition(){
			switch(ttype){
			case TileType.FLOOR:
			case TileType.STAIRS:
				return " on ";
			case TileType.DOOR_O:
				return " in ";
			default:
				return " and ";
			}
		}
		public bool GetItem(Item item){
			if(inv == null){
				item.row = row;
				item.col = col;
				if(item.light_radius > 0){
					item.UpdateRadius(0,item.light_radius);
				}
				inv = item;
				return true;
			}
			else{
				if(inv.itype == item.itype && !inv.do_not_stack && !item.do_not_stack){
					inv.quantity += item.quantity;
					return true;
				}
				else{
					for(int i=1;i<COLS;++i){
						List<Tile> tiles = TilesAtDistance(i);
						while(tiles.Count > 0){
							Tile t = tiles.Random();
							if(t.passable && t.inv == null){
								item.row = t.row;
								item.col = t.col;
								if(item.light_radius > 0){
									item.UpdateRadius(0,item.light_radius);
								}
								t.inv = item;
								return true;
							}
							tiles.Remove(t);
						}
					}
				}
			}
			return false;
		}
		public void Toggle(PhysicalObject toggler){
			if(toggles_into != null){
				Toggle(toggler,toggles_into.Value);
			}
		}
		public void Toggle(PhysicalObject toggler,TileType toggle_to){
			bool lighting_update = false;
			List<PhysicalObject> light_sources = new List<PhysicalObject>();
			TileType original_type = ttype;
			if(opaque != Prototype(toggle_to).opaque){
				for(int i=row-1;i<=row+1;++i){
					for(int j=col-1;j<=col+1;++j){
						if(M.tile[i,j].IsLit()){
							lighting_update = true;
						}
					}
				}
			}
			if(lighting_update){
				for(int i=row-Global.MAX_LIGHT_RADIUS;i<=row+Global.MAX_LIGHT_RADIUS;++i){
					for(int j=col-Global.MAX_LIGHT_RADIUS;j<=col+Global.MAX_LIGHT_RADIUS;++j){
						if(i>0 && i<ROWS-1 && j>0 && j<COLS-1){
							if(M.actor[i,j] != null && M.actor[i,j].LightRadius() > 0){
								light_sources.Add(M.actor[i,j]);
								M.actor[i,j].UpdateRadius(M.actor[i,j].LightRadius(),0);
							}
							if(M.tile[i,j].inv != null && M.tile[i,j].inv.light_radius > 0){
								light_sources.Add(M.tile[i,j].inv);
								M.tile[i,j].inv.UpdateRadius(M.tile[i,j].inv.light_radius,0);
							}
							if(M.tile[i,j].light_radius > 0){
								light_sources.Add(M.tile[i,j]);
								M.tile[i,j].UpdateRadius(M.tile[i,j].light_radius,0);
							}
						}
					}
				}
			}

			TransformTo(toggle_to);

			if(lighting_update){
				foreach(PhysicalObject o in light_sources){
					if(o is Actor){
						Actor a = o as Actor;
						a.UpdateRadius(0,a.LightRadius());
					}
					else{
						o.UpdateRadius(0,o.light_radius);
					}
				}
			}
			if(toggler != null && toggler != player){
				if(ttype == TileType.DOOR_C && original_type == TileType.DOOR_O){
					if(player.CanSee(this)){
						B.Add(toggler.TheVisible() + " closes the door. ");
					}
					else{
						if(seen || player.DistanceFrom(this) <= 6){
							B.Add("You hear a door closing. ");
						}
					}
				}
				if(ttype == TileType.DOOR_O && original_type == TileType.DOOR_C){
					if(player.CanSee(this)){
						B.Add(toggler.TheVisible() + " opens the door. ");
					}
					else{
						if(seen || player.DistanceFrom(this) <= 6){
							B.Add("You hear a door opening. ");
						}
					}
				}
			}
			if(toggler != null){
				if(original_type == TileType.RUBBLE){
					B.Add(toggler.YouVisible("shift") + " the rubble aside. ",this);
				}
			}
		}
		public void TransformTo(TileType type_){
			name=Prototype(type_).name;
			a_name=Prototype(type_).a_name;
			the_name=Prototype(type_).the_name;
			symbol=Prototype(type_).symbol;
			color=Prototype(type_).color;
			ttype=Prototype(type_).ttype;
			passable=Prototype(type_).passable;
			opaque=Prototype(type_).opaque;
			toggles_into=Prototype(type_).toggles_into;
			if(opaque){
				light_value = 0;
			}
			if(light_radius != Prototype(type_).light_radius){
				UpdateRadius(light_radius,Prototype(type_).light_radius);
			}
			light_radius = Prototype(type_).light_radius;
		}
		public void TurnToFloor(){
			bool lighting_update = false;
			List<PhysicalObject> light_sources = new List<PhysicalObject>();
			if(opaque){
				foreach(Tile t in TilesWithinDistance(1)){
					if(t.IsLit()){
						lighting_update = true;
					}
				}
			}
			if(lighting_update){
				for(int i=row-Global.MAX_LIGHT_RADIUS;i<=row+Global.MAX_LIGHT_RADIUS;++i){
					for(int j=col-Global.MAX_LIGHT_RADIUS;j<=col+Global.MAX_LIGHT_RADIUS;++j){
						if(i>0 && i<ROWS-1 && j>0 && j<COLS-1){
							if(M.actor[i,j] != null && M.actor[i,j].LightRadius() > 0){
								light_sources.Add(M.actor[i,j]);
								M.actor[i,j].UpdateRadius(M.actor[i,j].LightRadius(),0);
							}
							if(M.tile[i,j].inv != null && M.tile[i,j].inv.light_radius > 0){
								light_sources.Add(M.tile[i,j].inv);
								M.tile[i,j].inv.UpdateRadius(M.tile[i,j].inv.light_radius,0);
							}
							if(M.tile[i,j].light_radius > 0){
								light_sources.Add(M.tile[i,j]);
								M.tile[i,j].UpdateRadius(M.tile[i,j].light_radius,0);
							}
						}
					}
				}
			}
			
			TransformTo(TileType.FLOOR);
			
			if(lighting_update){
				foreach(PhysicalObject o in light_sources){
					if(o is Actor){
						Actor a = o as Actor;
						a.UpdateRadius(0,a.LightRadius());
					}
					else{
						o.UpdateRadius(0,o.light_radius);
					}
				}
			}
		}
		public void AddOpaqueFeature(FeatureType f){
			if(!features.Contains(f)){
				bool lighting_update = false;
				List<PhysicalObject> light_sources = new List<PhysicalObject>();
				for(int i=row-1;i<=row+1;++i){
					for(int j=col-1;j<=col+1;++j){
						if(M.tile[i,j].IsLit()){
							lighting_update = true;
						}
					}
				}
				if(lighting_update){
					for(int i=row-Global.MAX_LIGHT_RADIUS;i<=row+Global.MAX_LIGHT_RADIUS;++i){
						for(int j=col-Global.MAX_LIGHT_RADIUS;j<=col+Global.MAX_LIGHT_RADIUS;++j){
							if(i>0 && i<ROWS-1 && j>0 && j<COLS-1){
								if(M.actor[i,j] != null && M.actor[i,j].LightRadius() > 0){
									light_sources.Add(M.actor[i,j]);
									M.actor[i,j].UpdateRadius(M.actor[i,j].LightRadius(),0);
								}
								if(M.tile[i,j].inv != null && M.tile[i,j].inv.light_radius > 0){
									light_sources.Add(M.tile[i,j].inv);
									M.tile[i,j].inv.UpdateRadius(M.tile[i,j].inv.light_radius,0);
								}
								if(M.tile[i,j].light_radius > 0){
									light_sources.Add(M.tile[i,j]);
									M.tile[i,j].UpdateRadius(M.tile[i,j].light_radius,0);
								}
							}
						}
					}
				}
	
				features.Add(f);
	
				if(lighting_update){
					foreach(PhysicalObject o in light_sources){
						if(o is Actor){
							Actor a = o as Actor;
							a.UpdateRadius(0,a.LightRadius());
						}
						else{
							o.UpdateRadius(0,o.light_radius);
						}
					}
				}
			}
		}
		public void RemoveOpaqueFeature(FeatureType f){
			if(features.Contains(f)){
				bool lighting_update = false;
				List<PhysicalObject> light_sources = new List<PhysicalObject>();
				for(int i=row-1;i<=row+1;++i){
					for(int j=col-1;j<=col+1;++j){
						if(M.tile[i,j].IsLit()){
							lighting_update = true;
						}
					}
				}
				if(lighting_update){
					for(int i=row-Global.MAX_LIGHT_RADIUS;i<=row+Global.MAX_LIGHT_RADIUS;++i){
						for(int j=col-Global.MAX_LIGHT_RADIUS;j<=col+Global.MAX_LIGHT_RADIUS;++j){
							if(i>0 && i<ROWS-1 && j>0 && j<COLS-1){
								if(M.actor[i,j] != null && M.actor[i,j].LightRadius() > 0){
									light_sources.Add(M.actor[i,j]);
									M.actor[i,j].UpdateRadius(M.actor[i,j].LightRadius(),0);
								}
								if(M.tile[i,j].inv != null && M.tile[i,j].inv.light_radius > 0){
									light_sources.Add(M.tile[i,j].inv);
									M.tile[i,j].inv.UpdateRadius(M.tile[i,j].inv.light_radius,0);
								}
								if(M.tile[i,j].light_radius > 0){
									light_sources.Add(M.tile[i,j]);
									M.tile[i,j].UpdateRadius(M.tile[i,j].light_radius,0);
								}
							}
						}
					}
				}
	
				features.Remove(f);
	
				if(lighting_update){
					foreach(PhysicalObject o in light_sources){
						if(o is Actor){
							Actor a = o as Actor;
							a.UpdateRadius(0,a.LightRadius());
						}
						else{
							o.UpdateRadius(0,o.light_radius);
						}
					}
				}
			}
		}
		public async Task TriggerTrap(){
			if(actor().atype == ActorType.FIRE_DRAKE){
				if(name == "floor"){
					B.Add(actor().the_name + " smashes " + Tile.Prototype(ttype).a_name + ". ",this);
				}
				else{
					B.Add(actor().the_name + " smashes " + the_name + ". ",this);
				}
				TransformTo(TileType.FLOOR);
				return;
			}
			if(player.CanSee(this)){
				B.Add("*CLICK* ",this);
				await B.PrintAll();
			}
			switch(ttype){
			case TileType.GRENADE_TRAP:
			{
				if(player.CanSee(actor())){
					B.Add("Grenades fall from the ceiling above " + actor().the_name + "! ",this);
				}
				else{
					B.Add("Grenades fall from the ceiling! ",this);
				}
				//bool nade_here = false;
				List<Tile> valid = new List<Tile>();
				foreach(Tile t in TilesWithinDistance(1)){
					if(t.passable && !t.Is(FeatureType.GRENADE)){
						valid.Add(t);
					}
				}
				int count = Global.OneIn(10)? 3 : 2;
				for(;count>0 & valid.Count > 0;--count){
					Tile t = valid.Random();
					/*if(t == this){
						nade_here = true;
					}*/
					if(t.actor() != null){
						if(t.actor() == player){
							B.Add("One lands under you! ");
						}
						else{
							if(player.CanSee(this)){
								B.Add("One lands under " + t.actor().the_name + ". ",t.actor());
							}
						}
					}
					else{
						if(t.inv != null){
							B.Add("One lands under " + t.inv.TheName() + ". ",t);
						}
					}
					t.features.Add(FeatureType.GRENADE);
					valid.Remove(t);
					Q.Add(new Event(t,100,EventType.GRENADE));
				}
				Toggle(actor());
				break;
			}
			case TileType.UNDEAD_TRAP:
			{
				List<int> dirs = new List<int>();
				for(int i=2;i<=8;i+=2){
					Tile t = this;
					bool good = true;
					while(t.ttype != TileType.WALL){
						t = t.TileInDirection(i);
						if(t.opaque && t.ttype != TileType.WALL){
							good = false;
							break;
						}
						if(DistanceFrom(t) > 6){
							good = false;
							break;
						}
					}
					if(good && t.row > 0 && t.row < ROWS-1 && t.col > 0 && t.col < COLS-1){
						t = t.TileInDirection(i);
					}
					else{
						good = false;
					}
					if(good && t.row > 0 && t.row < ROWS-1 && t.col > 0 && t.col < COLS-1){
						foreach(Tile tt in t.TilesWithinDistance(1)){
							if(tt.ttype != TileType.WALL){
								good = false;
							}
						}
					}
					else{
						good = false;
					}
					if(good){
						dirs.Add(i);
					}
				}
				if(dirs.Count == 0){
					B.Add("Nothing happens. ",this);
				}
				else{
					int dir = dirs[Global.Roll(dirs.Count)-1];
					Tile first = this;
					while(first.ttype != TileType.WALL){
						first = first.TileInDirection(dir);
					}
					first.TileInDirection(dir).TurnToFloor();
					ActorType ac = Global.CoinFlip()? ActorType.SKELETON : ActorType.ZOMBIE;
					Actor.Create(ac,first.TileInDirection(dir).row,first.TileInDirection(dir).col,true,true);
					first.TurnToFloor();
					foreach(Tile t in first.TileInDirection(dir).TilesWithinDistance(1)){
						t.solid_rock = false;
					}
					//first.ActorInDirection(dir).target_location = this;
					//first.ActorInDirection(dir).player_visibility_duration = -1;
					first.ActorInDirection(dir).FindPath(TileInDirection(dir));
					if(player.CanSee(first)){
						B.Add("The wall slides away. ");
					}
					else{
						if(DistanceFrom(player) <= 6){
							B.Add("You hear rock sliding on rock. ");
						}
					}
				}
				Toggle(actor());
				break;
			}
			case TileType.TELEPORT_TRAP:
				B.Add("An unstable energy covers " + actor().TheVisible() + ". ",actor());
				actor().attrs[AttrType.TELEPORTING] = Global.Roll(4);
				Q.KillEvents(actor(),AttrType.TELEPORTING); //should be replaced by refreshduration eventually. works the same way, though.
				Q.Add(new Event(actor(),actor().DurationOfMagicalEffect(Global.Roll(10)+25)*100,AttrType.TELEPORTING,actor().YouFeel() + " more stable. ",new PhysicalObject[]{actor()}));
				Toggle(actor());
				break;
			case TileType.STUN_TRAP:
				if(player.CanSee(actor())){
					B.Add("A disorienting flash assails " + actor().the_name + ". ",this);
				}
				else{
					B.Add("You notice a flash of light. ",this);
				}
				//actor().attrs[AttrType.STUNNED]++;
				//Q.Add(new Event(actor(),actor().DurationOfMagicalEffect(Global.Roll(10)+7)*100,AttrType.STUNNED,(actor().YouFeel() + " less disoriented. "),(this.actor())));
				actor().GainAttrRefreshDuration(AttrType.STUNNED,actor().DurationOfMagicalEffect(Global.Roll(10)+7)*100,(actor().YouFeel() + " less disoriented. "),(this.actor()));
				Toggle(actor());
				break;
			case TileType.LIGHT_TRAP:
				if(M.wiz_lite == false){
					if(player.HasLOS(row,col) && !actor().IsHiddenFrom(player)){
						B.Add("A wave of light washes out from above " + actor().the_name + "! ");
					}
					else{
						B.Add("A wave of light washes over the area! ");
					}
					M.wiz_lite = true;
					M.wiz_dark = false;
				}
				else{
					B.Add("Nothing happens. ",this);
				}
				Toggle(actor());
				break;
			case TileType.DARKNESS_TRAP:
				if(M.wiz_dark == false){
					if(player.CanSee(actor())){
						B.Add("A surge of darkness radiates out from above " + actor().the_name + "! ");
						if(player.light_radius > 0){
							B.Add("Your light is extinguished! ");
						}
					}
					else{
						B.Add("A surge of darkness extinguishes all light in the area! ");
					}
					M.wiz_dark = true;
					M.wiz_lite = false;
				}
				else{
					B.Add("Nothing happens. ",this);
				}
				Toggle(actor());
				break;
			case TileType.QUICKFIRE_TRAP:
			{
				B.Add("Fire pours over " + actor().TheVisible() + " and starts to spread! ",this);
				Actor a = actor();
				if(!a.HasAttr(AttrType.RESIST_FIRE) && !a.HasAttr(AttrType.CATCHING_FIRE) && !a.HasAttr(AttrType.ON_FIRE)
				&& !a.HasAttr(AttrType.IMMUNE_FIRE) && !a.HasAttr(AttrType.STARTED_CATCHING_FIRE_THIS_TURN)){
					if(a == actor()){							// to work properly, 
						a.attrs[AttrType.STARTED_CATCHING_FIRE_THIS_TURN] = 1; //this would need to determine what actor's turn it is
					} //therefore, hack
					else{
						a.attrs[AttrType.CATCHING_FIRE] = 1;
					}
					if(player.CanSee(a.tile())){
						B.Add(a.You("start") + " to catch fire. ",a);
					}
				}
				features.Add(FeatureType.QUICKFIRE);
				Toggle(actor());
				List<Tile> newarea = new List<Tile>();
				newarea.Add(this);
				Q.Add(new Event(this,newarea,100,EventType.QUICKFIRE,AttrType.NO_ATTR,3,""));
				break;
			}
			case TileType.ALARM_TRAP:
				if(actor() == player){
					B.Add("A high-pitched ringing sound reverberates from above you. ");
				}
				else{
					if(player.CanSee(actor())){
						B.Add("A high-pitched ringing sound reverberates from above " + actor().the_name + ". ");
					}
					else{
						B.Add("You hear a high-pitched ringing sound. ");
					}
				}
				foreach(Actor a in ActorsWithinDistance(12,true)){
					if(a.atype != ActorType.LARGE_BAT && a.atype != ActorType.BLOOD_MOTH && a.atype != ActorType.CARNIVOROUS_BRAMBLE
					&& a.atype != ActorType.LASHER_FUNGUS && a.atype != ActorType.PHASE_SPIDER){
						a.FindPath(this);
					}
				}
				Toggle(actor());
				break;
			case TileType.DIM_VISION_TRAP:
				B.Add("A dart strikes " + actor().the_name + ". ",actor());
				if(actor() == player){
					B.Add("Your vision becomes weaker! ");
					actor().GainAttrRefreshDuration(AttrType.DIM_VISION,actor().DurationOfMagicalEffect(Global.Roll(10) + 20) * 100,"Your vision returns to normal. ");
				}
				else{
					if(!actor().HasAttr(AttrType.IMMUNE_TOXINS) && !actor().HasAttr(AttrType.UNDEAD) && !actor().HasAttr(Forays.AttrType.BLINDSIGHT)
					&& actor().atype != ActorType.BLOOD_MOTH && actor().atype != ActorType.PHASE_SPIDER){
						if(player.CanSee(actor())){
							B.Add(actor().the_name + " seems to have trouble seeing. ");
						}
						actor().GainAttrRefreshDuration(AttrType.DIM_VISION,actor().DurationOfMagicalEffect(Global.Roll(10) + 20) * 100);
					}
				}
				Toggle(actor());
				break;
			case TileType.ICE_TRAP:
				if(player.CanSee(this)){
					B.Add("The air suddenly freezes, encasing " + actor().TheVisible() + " in ice. ");
				}
				actor().attrs[AttrType.FROZEN] = 25;
				Toggle(actor());
				break;
			case TileType.PHANTOM_TRAP:
			{
				Tile open = TilesWithinDistance(3).Where(t => t.passable && t.actor() == null && t.HasLOE(this)).Random();
				if(open != null){
					Actor a = Actor.CreatePhantom(open.row,open.col);
					if(a != null){
						a.attrs[AttrType.PLAYER_NOTICED]++;
						a.player_visibility_duration = -1;
						B.Add("A ghostly image rises! ",a);
					}
					else{
						B.Add("Nothing happens. ",this);
					}
				}
				else{
					B.Add("Nothing happens. ",this);
				}
				Toggle(actor());
				break;
			}
			case TileType.POISON_GAS_TRAP:
			{
				Tile current = this;
				int num = Global.Roll(5) + 7;
				List<Tile> new_area = new List<Tile>();
				for(int i=0;i<num;++i){
					if(!current.Is(FeatureType.POISON_GAS)){
						current.features.Add(FeatureType.POISON_GAS);
						new_area.Add(current);
					}
					else{
						for(int tries=0;tries<50;++tries){
							List<Tile> open = new List<Tile>();
							foreach(Tile t in current.TilesAtDistance(1)){
								if(t.passable){
									open.Add(t);
								}
							}
							if(open.Count > 0){
								Tile possible = open.Random();
								if(!possible.Is(FeatureType.POISON_GAS)){
									possible.features.Add(FeatureType.POISON_GAS);
									new_area.Add(possible);
									break;
								}
								else{
									current = possible;
								}
							}
							else{
								break;
							}
						}
					}
				}
				if(new_area.Count > 0){
					B.Add("Poisonous gas fills the area! ",this);
					Q.Add(new Event(new_area,300,EventType.POISON_GAS));
				}
				Toggle(actor());
				break;
			}
			default:
				break;
			}
		}
		public void OpenChest(){
			if(ttype == TileType.CHEST){
				if(Global.Roll(1,10) == 10){
					List<int> upgrades = new List<int>();
					if(Global.Roll(1,2) == 2 && !player.weapons.Contains(WeaponType.FLAMEBRAND)){
						upgrades.Add(0);
					}
					if(Global.Roll(1,2) == 2 && !player.weapons.Contains(WeaponType.MACE_OF_FORCE)){
						upgrades.Add(1);
					}
					if(Global.Roll(1,2) == 2 && !player.weapons.Contains(WeaponType.VENOMOUS_DAGGER)){
						upgrades.Add(2);
					}
					if(Global.Roll(1,2) == 2 && !player.weapons.Contains(WeaponType.STAFF_OF_MAGIC)){
						upgrades.Add(3);
					}
					if(Global.Roll(1,2) == 2 && !player.weapons.Contains(WeaponType.HOLY_LONGBOW)){
						upgrades.Add(4);
					}
					if(Global.Roll(1,3) == 3 && !player.armors.Contains(ArmorType.ELVEN_LEATHER)){
						upgrades.Add(5);
					}
					if(Global.Roll(1,3) == 3 && !player.armors.Contains(ArmorType.CHAINMAIL_OF_ARCANA)){
						upgrades.Add(6);
					}
					if(Global.Roll(1,3) == 3 && !player.armors.Contains(ArmorType.FULL_PLATE_OF_RESISTANCE)){
						upgrades.Add(7);
					}
					if(Global.Roll(1,2) == 2 && !player.magic_items.Contains(MagicItemType.PENDANT_OF_LIFE)){
						upgrades.Add(8);
					}
					if(Global.Roll(1,3) == 3 && !player.magic_items.Contains(MagicItemType.RING_OF_RESISTANCE)){
						upgrades.Add(9);
					}
					if(Global.Roll(1,2) == 2 && !player.magic_items.Contains(MagicItemType.RING_OF_PROTECTION)){
						upgrades.Add(10);
					}
					if(Global.Roll(1,2) == 2 && !player.magic_items.Contains(MagicItemType.CLOAK_OF_DISAPPEARANCE)){
						upgrades.Add(11);
					}
					if(upgrades.Count == 0){
						OpenChest();
						return;
					}
					int upgrade = upgrades[Global.Roll(1,upgrades.Count)-1];
					switch(upgrade){
					case 0: //flamebrand
                            player.weapons.Find(WeaponType.SWORD).Value = WeaponType.FLAMEBRAND;
						if(Weapon.BaseWeapon(player.weapons[0]) == WeaponType.SWORD){
							player.UpdateOnEquip(WeaponType.SWORD,WeaponType.FLAMEBRAND);
						}
						break;
					case 1: //mace of force
						player.weapons.Find(WeaponType.MACE).Value = WeaponType.MACE_OF_FORCE;
						if(Weapon.BaseWeapon(player.weapons[0]) == WeaponType.MACE){
							player.UpdateOnEquip(WeaponType.MACE,WeaponType.MACE_OF_FORCE);
						}
						break;
					case 2: //venomous dagger
						player.weapons.Find(WeaponType.DAGGER).Value = WeaponType.VENOMOUS_DAGGER;
						if(Weapon.BaseWeapon(player.weapons[0]) == WeaponType.DAGGER){
							player.UpdateOnEquip(WeaponType.DAGGER,WeaponType.VENOMOUS_DAGGER);
						}
						break;
					case 3: //staff of magic
						player.weapons.Find(WeaponType.STAFF).Value = WeaponType.STAFF_OF_MAGIC;
						if(Weapon.BaseWeapon(player.weapons[0]) == WeaponType.STAFF){
							player.UpdateOnEquip(WeaponType.STAFF,WeaponType.STAFF_OF_MAGIC);
						}
						break;
					case 4: //holy longbow
						player.weapons.Find(WeaponType.BOW).Value = WeaponType.HOLY_LONGBOW;
						if(Weapon.BaseWeapon(player.weapons[0]) == WeaponType.BOW){
							player.UpdateOnEquip(WeaponType.BOW,WeaponType.HOLY_LONGBOW);
						}
						break;
					case 5: //elven leather
						player.armors.Find(ArmorType.LEATHER).Value = ArmorType.ELVEN_LEATHER;
						if(Armor.BaseArmor(player.armors[0]) == ArmorType.LEATHER){
							player.UpdateOnEquip(ArmorType.LEATHER,ArmorType.ELVEN_LEATHER);
						}
						break;
					case 6: //chainmail of arcana
						player.armors.Find(ArmorType.CHAINMAIL).Value = ArmorType.CHAINMAIL_OF_ARCANA;
						if(Armor.BaseArmor(player.armors[0]) == ArmorType.CHAINMAIL){
							player.UpdateOnEquip(ArmorType.CHAINMAIL,ArmorType.CHAINMAIL_OF_ARCANA);
						}
						break;
					case 7: //full plate of resistance
						player.armors.Find(ArmorType.FULL_PLATE).Value = ArmorType.FULL_PLATE_OF_RESISTANCE;
						if(Armor.BaseArmor(player.armors[0]) == ArmorType.FULL_PLATE){
							player.UpdateOnEquip(ArmorType.FULL_PLATE,ArmorType.FULL_PLATE_OF_RESISTANCE);
						}
						break;
					case 8: //pendant of life
						player.magic_items.Insert(player.magic_items.Count, MagicItemType.PENDANT_OF_LIFE);
						break;
					case 9: //ring of resistance
                        player.magic_items.Insert(player.magic_items.Count, MagicItemType.RING_OF_RESISTANCE);
						break;
					case 10: //ring of protection
                        player.magic_items.Insert(player.magic_items.Count, MagicItemType.RING_OF_PROTECTION);
						break;
					case 11: //cloak of disappearance
                        player.magic_items.Insert(player.magic_items.Count, MagicItemType.CLOAK_OF_DISAPPEARANCE);
						break;
					default:
						break;
					}
					if(upgrade <= 4){
						B.Add("You find a " + Weapon.Name((WeaponType)(upgrade+5)) + "! ");
					}
					else{
						if(upgrade <= 7){
							B.Add("You find " + Armor.Name((ArmorType)(upgrade-2)) + "! ");
						}
						else{
							B.Add("You find a " + MagicItem.Name((MagicItemType)(upgrade-8)) + "! ");
						}
					}
				}
				else{
					bool no_room = false;
					if(player.InventoryCount() >= Global.MAX_INVENTORY_SIZE){
						no_room = true;
					}
					Item i = Item.Create(Item.RandomItem(),player);
					if(i != null){
						B.Add("You find " + Item.Prototype(i.itype).AName() + ". ");
						if(no_room){
							B.Add("Your pack is too full to pick it up. ");
						}
					}
				}
				TurnToFloor();
			}
		}
		public bool IsLit(){ //default is player as viewer
			return IsLit(player.row,player.col);
		}
		public bool IsLit(int viewer_row,int viewer_col){
			if(M.wiz_lite){
				return true;
			}
			if(M.wiz_dark){
				return false;
			}
			if(light_value > 0){
				return true;
			}
			if(features.Contains(FeatureType.QUICKFIRE)){
				return true;
			}
			if(opaque){
				foreach(Tile t in NeighborsBetween(viewer_row,viewer_col)){
					if(t.light_value > 0){
						return true;
					}
				}
				if(M.actor[viewer_row,viewer_col] != null && M.actor[viewer_row,viewer_col].LightRadius() > 0){
					if(M.actor[viewer_row,viewer_col].LightRadius() >= DistanceFrom(viewer_row,viewer_col)){
						if(M.actor[viewer_row,viewer_col].HasBresenhamLine(row,col)){
							return true;
						}
					}
				}
			}
			return false;
		}
		public bool IsLitFromAnywhere(){ return IsLitFromAnywhere(opaque); }
		public bool IsLitFromAnywhere(bool considered_opaque){
			if(M.wiz_lite){
				return true;
			}
			if(M.wiz_dark){
				return false;
			}
			if(light_value > 0){
				return true;
			}
			if(features.Contains(FeatureType.QUICKFIRE)){
				return true;
			}
			if(considered_opaque){
				foreach(Tile t in TilesAtDistance(1)){
					if(t.light_value > 0){
						return true;
					}
				}
				foreach(Actor a in ActorsWithinDistance(Global.MAX_LIGHT_RADIUS)){
					if(a.LightRadius() > 0 && a.LightRadius() >= a.DistanceFrom(this) && a.HasBresenhamLine(row,col)){
						return true;
					}
				}
			}
			return false;
		}
		public bool IsTrap(){
			switch(ttype){
			case TileType.QUICKFIRE_TRAP:
			case TileType.GRENADE_TRAP:
			case TileType.LIGHT_TRAP:
			case TileType.UNDEAD_TRAP:
			case TileType.TELEPORT_TRAP:
			case TileType.STUN_TRAP:
			case TileType.ALARM_TRAP:
			case TileType.DARKNESS_TRAP:
			case TileType.DIM_VISION_TRAP:
			case TileType.ICE_TRAP:
			case TileType.PHANTOM_TRAP:
			case TileType.POISON_GAS_TRAP:
				return true;
			default:
				return false;
			}
		}
		public bool IsTrapOrVent(){
			return IsTrap() || ttype == TileType.FIRE_GEYSER || ttype == TileType.FOG_VENT || ttype == TileType.POISON_GAS_VENT;
		}
		public bool IsKnownTrap(){
			if(IsTrap() && name != "floor"){
				return true;
			}
			return false;
		}
		public bool IsShrine(){
			switch(ttype){
			case TileType.COMBAT_SHRINE:
			case TileType.DEFENSE_SHRINE:
			case TileType.MAGIC_SHRINE:
			case TileType.SPIRIT_SHRINE:
			case TileType.STEALTH_SHRINE:
			case TileType.SPELL_EXCHANGE_SHRINE:
				return true;
			default:
				return false;
			}
		}
		public bool ConductsElectricity(){
			if(IsShrine() || ttype == TileType.CHEST || ttype == TileType.RUINED_SHRINE){
				return true;
			}
			return false;
		}
		delegate int del(int i);
		public List<Tile> NeighborsBetween(int r,int c){ //list of non-opaque tiles next to this one that are between you and it
			del Clamp = x => x<-1? -1 : x>1? 1 : x; //clamps to a value between -1 and 1
			int dy = r - row;
			int dx = c - col;
			List<Tile> result = new List<Tile>();
			if(dy==0 && dx==0){
				return result; //return the empty set
			}
			int newrow = row+Clamp(dy);
			int newcol = col+Clamp(dx);
			if(!M.tile[newrow,newcol].opaque){
				result.Add(M.tile[newrow,newcol]);
			}
			if(Math.Abs(dy) < Math.Abs(dx) && dy!=0){
				newrow -= Clamp(dy);
				if(!M.tile[newrow,newcol].opaque){
					result.Add(M.tile[newrow,newcol]);
				}
			}
			if(Math.Abs(dx) < Math.Abs(dy) && dx!=0){
				newcol -= Clamp(dx);
				if(!M.tile[newrow,newcol].opaque){
					result.Add(M.tile[newrow,newcol]);
				}
			}
			return result;
		}
	}
}

