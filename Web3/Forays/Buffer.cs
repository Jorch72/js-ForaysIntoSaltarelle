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
using System.Threading.Tasks;
namespace Forays
{
    public class Buffer
    {
        private int max_length;
        private List<string> str = new List<string>();
        private string overflow;
        private string[] log;
        private int position;

        public static Map M { get; set; }
        public static Actor player { get; set; }
        public Buffer(Game g)
        {
            max_length = Global.COLS; //because the message window runs along the top of the map
            //str = "";
            //str2 = "";
            str.Add("");
            overflow = "";
            log = new string[20];
            for (int i = 0; i < 20; ++i)
            {
                log[i] = "";
            }
            position = 0;
            M = g.M;
            player = g.player;
        }
        public async void Add(string s, PhysicalObject obj)
        { //if there's at least one object, the player must be able to
            bool add = false;
            if (obj == player || player.CanSee(obj))
            {
                add = true;
            }

            else
            {
                add = true;
            }
            if (add && s.Length > 0)
            {
                if (s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")) != null && s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")).Length > 0)
                {
                    s = s.Replace(new System.Text.RegularExpressions.Regex("^[a-z]"), (sr) => sr[0].ToString().ToUpper());
                    //					c[0] = Char.ToUpper(s[0]);
                    //s = new string(c);
                }
                int idx = str.Count - 1;
                str[idx] = str[idx] + s;
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
                if (overflow != "")
                {
                    Screen.ResetColors();
                    await Print(false);
                    idx = 0;
                }

            }
        }
        public async void Add(string s, PhysicalObject obj1, PhysicalObject obj2)
        { //if there's at least one object, the player must be able to
            bool add = false;
            if (obj1 != null && obj2 != null)
            { //see at least one of them. if not, no message is added. 
                PhysicalObject[] objs = new PhysicalObject[] { obj1, obj2 };
                foreach (PhysicalObject obj in objs)
                {
                    if (obj == player || player.CanSee(obj))
                    {
                        add = true;
                        break;
                    }
                }
            }
            else
            {
                add = true;
            }
            if (add && s.Length > 0)
            {
                if (s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")) != null && s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")).Length > 0)
                {
                    s = s.Replace(new System.Text.RegularExpressions.Regex("^[a-z]"), (sr) => sr[0].ToString().ToUpper());
                    //					c[0] = Char.ToUpper(s[0]);
                    //s = new string(c);
                }
                int idx = str.Count - 1;
                str[idx] = str[idx] + s;
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
                if (overflow != "")
                {
                    Screen.ResetColors();
                    await Print(false);
                    idx = 0;
                }

            }
        }
        public async void Add(string s, PhysicalObject[] objs)
        { //if there's at least one object, the player must be able to
            bool add = false;
            if (objs != null && objs.Length > 0)
            { //see at least one of them. if not, no message is added. 
                foreach (PhysicalObject obj in objs)
                {
                    if (obj == player || player.CanSee(obj))
                    {
                        add = true;
                        break;
                    }
                }
            }
            else
            {
                add = true;
            }
            if (add && s != null && s.Length > 0)
            {
                if (s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")) != null && s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")).Length > 0)
                {
                    s = s.Replace(new System.Text.RegularExpressions.Regex("^[a-z]"), (sr) => sr[0].ToString().ToUpper());
                    //					c[0] = Char.ToUpper(s[0]);
                    //s = new string(c);
                }
                int idx = str.Count - 1;
                str[idx] = str[idx] + s;
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
                if (overflow != "")
                {
                    Screen.ResetColors();
                    await Print(false);
                    idx = 0;
                }

            }
        
        }
        public async void Add(string s)
        { //if there's at least one object, the player must be able to
            bool add = true;

            if (add && s.Length > 0)
            {
                if (s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")) != null && s.Match(new System.Text.RegularExpressions.Regex("^[a-z]")).Length > 0)
                {
                    s = s.Replace(new System.Text.RegularExpressions.Regex("^[a-z]"), (sr) => sr[0].ToString().ToUpper());
                    //					c[0] = Char.ToUpper(s[0]);
                    //s = new string(c);
                }
                int idx = str.Count - 1;
                str[idx] = str[idx] + s;
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
                if (overflow != "")
                {
                    Screen.ResetColors();
                    await Print(false);
                    idx = 0;
                }

            }
        }
        public void DisplayNow(string s) { DisplayNow(s, true); }
        public void DisplayNow(string s, bool display_stats)
        {
            if (display_stats)
            {
                player.DisplayStats();
            }
            Game.Console.CursorVisible = false;
            List<string> strings = new List<string>();
            if (s.Length > max_length)
            {
                for (int i = max_length - 1; i >= 0; --i)
                {
                    if (s.Substring(i, 1) == " ")
                    {
                        strings.Add(s.Substring(0, i + 1));
                        s = s.Substring(i + 1);
                        break;
                    }
                }
            }
            if (s.Length > max_length)
            {
                for (int i = max_length - 1; i >= 0; --i)
                {
                    if (s.Substring(i, 1) == " ")
                    {
                        strings.Add(s.Substring(0, i + 1));
                        s = s.Substring(i + 1);
                        break;
                    }
                }
            }
            strings.Add(s);
            for (int i = 0; i < 3; ++i)
            {
                if (3 - i > strings.Count)
                {
                    Screen.WriteMapString(i - 3, 0, "".PadToMapSize());
                }
                else
                {
                    Screen.WriteMapString(i - 3, 0, strings[(i + strings.Count) - 3].PadToMapSize());
                }
            }
            Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS + s.Length, 2);
        }
        public void DisplayNow()
        { //displays whatever is in the buffer. used before animations.
            Game.Console.CursorVisible = false;
            Screen.ResetColors();
            /*int idx = 3-str.Count;
            foreach(string s in str){
                //Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,idx);
                //Game.Console.Write(s.PadRight(Global.COLS));
                Screen.WriteMapString(idx-3,0,s.PadToMapSize());
                ++idx;
            }*/
            if (Global.Option(OptionType.HIDE_OLD_MESSAGES))
            {
                for (int i = 0; i < 3; ++i)
                {
                    if (i < str.Count)
                    {
                        Screen.WriteMapString(i - 3, 0, str[i].PadToMapSize());
                    }
                    else
                    {
                        Screen.WriteMapString(i - 3, 0, "".PadToMapSize());
                    }
                }
            }
            else
            {
                int lines = str.Count;
                if (str.Last() == "")
                {
                    --lines;
                }
                for (int i = 0; i < 3; ++i)
                {
                    bool old_message = true;
                    if (3 - i <= lines)
                    {
                        old_message = false;
                    }
                    if (old_message)
                    {
                        Screen.WriteMapString(i - 3, 0, PreviousMessage(3 - (i + lines)).PadToMapSize(), Color.DarkGray);
                        Screen.ForegroundColor = ConsoleColor.Gray;
                    }
                    else
                    {
                        Screen.WriteMapString(i - 3, 0, str[(i + lines) - 3].PadToMapSize());
                    }
                }
            }
        }
        public async Task Print(bool special_message)
        {
            Game.Console.CursorVisible = false;
            //if(str.Last() != ""){
            foreach (string s in str)
            {
                if (s != "You regenerate. " && s != "You rest... " && s != "")
                {
                    player.Interrupt();
                }
            }
            bool repeated_message = false;
            foreach (string s in str)
            {
                if (s != "")
                {
                    int last = position - 1;
                    if (last == -1) { last = 19; }
                    string prev = log[last];
                    string count = "1";
                    int pos = prev.LastIndexOf(" (x");
                    if (pos != -1)
                    {
                        count = prev.Substring(pos + 3);
                        count = count.Substring(0, count.Length - 1);
                        prev = prev.Substring(0, pos + 1);
                    }
                    bool too_long_if_repeated = false;
                    if (prev.Length + 3 + (int.Parse(count) + 1).ToString().Length > max_length)
                    {
                        too_long_if_repeated = true;
                    }
                    if (prev == s && str.Count == 1 && !too_long_if_repeated)
                    { //trying this - only add the (x2) part if it's a single-line message, for ease of reading
                        log[last] = prev + "(x" + (int.Parse(count) + 1).ToString() + ")";
                        repeated_message = true;
                    }
                    else
                    {
                        log[position] = s;
                        ++position;
                        if (position == 20) { position = 0; }
                        repeated_message = false;
                    }
                }
            }
            /*			for(int i=0;i<3;++i){
                            //Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
                            //Game.Console.Write("".PadRight(Global.COLS));
                            Screen.WriteMapString(i-3,0,"".PadToMapSize());
                        }*/
            if (Global.Option(OptionType.HIDE_OLD_MESSAGES))
            {
                for (int i = 0; i < 3; ++i)
                {
                    if (i <= str.Count - 1)
                    {
                        //Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
                        //Game.Console.Write(str[i]);
                        Screen.WriteMapString(i - 3, 0, str[i].PadToMapSize());
                    }
                    else
                    {
                        Screen.WriteMapString(i - 3, 0, "".PadToMapSize());
                    }
                }
            }
            else
            {
                int lines = str.Count;
                if (str.Last() == "")
                {
                    --lines;
                }
                for (int i = 0; i < 3; ++i)
                {
                    //Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
                    /*					if(i >= 3-lines && str[(i+lines)-3] != ""){
                                            Game.Console.Write(str[(i+lines)-3]);
                                        }
                                        else{
                                            Screen.ForegroundColor = ConsoleColor.DarkGray;
                                            Game.Console.Write(PreviousMessage(3-(i+lines)));
                                            Screen.ForegroundColor = ConsoleColor.Gray;
                                        }*/
                    bool old_message = true;
                    if (3 - i <= lines)
                    {
                        old_message = false;
                    }
                    if (old_message)
                    {
                        //Screen.ForegroundColor = ConsoleColor.DarkGray;
                        //Game.Console.Write(PreviousMessage(3-i));
                        Screen.WriteMapString(i - 3, 0, PreviousMessage(3 - i).PadToMapSize(), Color.DarkGray);
                        Screen.ForegroundColor = ConsoleColor.Gray;
                    }
                    else
                    {
                        if (repeated_message)
                        {
                            int pos = PreviousMessage(3 - i).LastIndexOf(" (x");
                            if (pos != -1)
                            {
                                //Game.Console.Write(PreviousMessage(3-i).Substring(0,pos));
                                //Screen.ForegroundColor = ConsoleColor.DarkGray;
                                //Game.Console.Write(PreviousMessage(3-i).Substring(pos));
                                Screen.WriteMapString(i - 3, 0, PreviousMessage(3 - i).Substring(0, pos));
                                Screen.WriteMapString(i - 3, pos, PreviousMessage(3 - i).Substring(pos).PadToMapSize(), Color.DarkGray);
                                Screen.ForegroundColor = ConsoleColor.Gray;
                            }
                            else
                            {
                                //Game.Console.Write(PreviousMessage(3-i));
                                Screen.WriteMapString(i - 3, 0, PreviousMessage(3 - i).PadToMapSize());
                            }
                        }
                        else
                        {
                            //Game.Console.Write(PreviousMessage(3-i));
                            Screen.WriteMapString(i - 3, 0, PreviousMessage(3 - i).PadToMapSize());
                        }
                    }
                }
            }
            if (overflow != "" || special_message == true)
            {
                int cursor_col = str.Last().Length + Global.MAP_OFFSET_COLS;
                int cursor_row = Game.Console.CursorTop;
                if (cursor_row > 2)
                {
                    cursor_row = 2; //hack - attempts a quick fix for the [more] appearing at the player's row
                }
                if (Screen.MapChar(0, 0).c == "-")
                { //hack
                    M.RedrawWithStrings();
                }
                else
                {
                    M.Draw();
                }
                //Game.Console.SetCursorPosition(cursor_col,cursor_row);
                //Screen.ForegroundColor = ConsoleColor.Yellow;
                //Game.Console.Write("[more]");
                Screen.WriteString(cursor_row, cursor_col, "[more]", Color.Yellow);
                Screen.ForegroundColor = ConsoleColor.Gray;
                Game.Console.CursorVisible = true;
                await Game.Console.ReadKey(true);
            }
            str.Clear();
            str.Add(overflow);
            overflow = "";
            /*			}
                        else{
                            for(int i=0;i<3;++i){
                                Game.Console.SetCursorPosition(Global.MAP_OFFSET_COLS,i);
                                Game.Console.Write("".PadRight(Global.COLS));
                            }
                        }*/
        }
        public async Task PrintAll()
        {
            Screen.ResetColors();
            if (str.Last() != "")
            {
                if (str.Last().Length > max_length - 7)
                {
                    for (int i = max_length - 7; i >= 0; --i)
                    {
                        if (str.Last().Substring(i, 1) == " ")
                        {
                            overflow = str.Last().Substring(i + 1);
                            str[str.Count - 1] = str.Last().Substring(0, i + 1);
                            break;
                        }
                    }
                    await Print(true);
                    if (str.Last() != "")
                    {
                        await Print(true);
                    }
                }
                else
                {
                    await Print(true);
                }
            }
        }
        public string Printed(int num) { return log[(position + num) % 20]; } //like PreviousMessage, but starting at the oldest
        public string PreviousMessage(int num)
        {
            int idx = position - num;
            if (idx < 0)
            {
                idx += 20;
            }
            return log[idx];
        }
        public void SetPreviousMessages(string[] s)
        {
            for (int i = 0; i < 20; ++i)
            {
                log[i] = s[i];
            }
        }
        public List<string> GetMessages()
        {
            List<string> result = new List<string>();
            for (int i = 0; i < 20; ++i)
            {
                result.Add(Printed(i));
            }
            return result;
        }
        public void AddDependingOnLastPartialMessage(string s)
        { //   =|
            if (!str.Last().EndsWith(s))
            {
                Add(s);
            }
        }
        public void AddIfEmpty(string s)
        {
            if (str.Last().Length == 0)
            {
                Add(s);
            }
        }
    }
}

