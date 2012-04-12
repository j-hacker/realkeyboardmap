/* Non Latin Keyboard Plugin for jQuery 
    
    --
    Copyright 2010 Marc Stober
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    --
    
    Incorporates code from Ze'ev Clementson, http://bc.tech.coop/DavidKeyboard.html

*/


// TODO: Separate mapping file
// TODO: Default keyboard if map is null (not sure this makes sense, since what would we show...maybe a way to turn it off?)
// TODO: regular US mapping
// TODO: Support alt-shift (without ctrl) for fourth state?
// TODO: My own "prayerbook" mapping.
// TODO: start with selected mapping
// TODO: make it float
// TODO: Support David Troidl's Greek mapping file (fully, with deadkeys)
// TODO: Drop-down mapping selection
// TODO: able to click the keys
// TODO: Alt key gets "stuck"
// TODO: sticky state key option, also clicking input
// Limitation: Tab key is just for navigation, no real purpose being on screen except to make it look like a keyboard.
// TODO: Fix ctrl-c, etc. work.
// BUG: Shift key stuck in Debian?
// TODO: Docs? How to insert, resize, change mappings
// TODO: Not all characters on all platforms?

(function($) {

    // jQuery extension method for initialization; e.g.: $("textarea").nonLatinKeyboard();
    $.fn.nonLatinKeyboard = function(options) {
        
        // apply defaults
        var settings = $.extend({
            appendTo: document.body // append created keyboard to document.body if not otherwise specified
        }, options);
        
        // create a keyboard
        var $keyboard = $(settings.appendTo).append("<div id=\"nlk-keyboard\">" + 
            "<div class=\"toolbar\"><button id=\"nlk-rtl\">Right-to-Left</button></div>" +
            "<div class=\"row\">" + 
            "       <button class=\"key\" id=\"nlk192\"></button>" + 
            "       <button class=\"key\" id=\"nlk49\"></button>" + 
            "       <button class=\"key\" id=\"nlk50\"></button>" + 
            "       <button class=\"key\" id=\"nlk51\"></button>" + 
            "       <button class=\"key\" id=\"nlk52\"></button>" + 
            "       <button class=\"key\" id=\"nlk53\"></button>" + 
            "       <button class=\"key\" id=\"nlk54\"></button>" + 
            "       <button class=\"key\" id=\"nlk55\"></button>" + 
            "       <button class=\"key\" id=\"nlk56\"></button>" + 
            "       <button class=\"key\" id=\"nlk57\"></button>" + 
            "       <button class=\"key\" id=\"nlk48\"></button>" + 
            "       <button class=\"key\" id=\"nlk187\"></button>" + 
            "       <button class=\"key\" id=\"nlk189\"></button>" + 
            "       <button class=\"key wordkey\" id=\"nlk8\">Backsp</button>" + 
            "</div>" + 
            "<div class=\"row\">" + 
            "       <button class=\"key wordkey\" id=\"nlk9\">Tab</button>" + 
            "       <button class=\"key\" id=\"nlk81\"></button>" + 
            "       <button class=\"key\" id=\"nlk87\"></button>" + 
            "       <button class=\"key\" id=\"nlk69\"></button>" + 
            "       <button class=\"key\" id=\"nlk82\"></button>" + 
            "       <button class=\"key\" id=\"nlk84\"></button>" + 
            "       <button class=\"key\" id=\"nlk89\"></button>" + 
            "       <button class=\"key\" id=\"nlk85\"></button>" + 
            "       <button class=\"key\" id=\"nlk73\"></button>" + 
            "       <button class=\"key\" id=\"nlk79\"></button>" + 
            "       <button class=\"key\" id=\"nlk80\"></button>" + 
            "       <button class=\"key\" id=\"nlk219\"></button>" + 
            "       <button class=\"key\" id=\"nlk221\"></button>" + 
            "       <button class=\"key\" id=\"nlk220\"></button>" + 
            "</div>" + 
            "<div class=\"row\">" + 
            "       <button class=\"key wordkey\" id=\"nlk20\">Caps</button>" + 
            "       <button class=\"key homekey\" id=\"nlk65\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk83\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk68\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk70\"></button>" + 
            "       <button class=\"key\" id=\"nlk71\"></button>" + 
            "       <button class=\"key\" id=\"nlk72\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk74\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk75\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk76\"></button>" + 
            "       <button class=\"key homekey\" id=\"nlk186\"></button>" + 
            "       <button class=\"key\" id=\"nlk222\"></button>" + 
            "       <button class=\"key wordkey\" id=\"nlk13\">Enter</button>" + 
            "</div>" + 
            "<div class=\"row\">" + 
            "       <button class=\"key statekey\" id=\"nlk16\">Shift</button>" + 
            "       <button class=\"key\" id=\"nlk90\"></button>" + 
            "       <button class=\"key\" id=\"nlk88\"></button>" + 
            "       <button class=\"key\" id=\"nlk67\"></button>" + 
            "       <button class=\"key\" id=\"nlk86\"></button>" + 
            "       <button class=\"key\" id=\"nlk66\"></button>" + 
            "       <button class=\"key\" id=\"nlk78\"></button>" + 
            "       <button class=\"key\" id=\"nlk77\"></button>" + 
            "       <button class=\"key\" id=\"nlk188\"></button>" + 
            "       <button class=\"key\" id=\"nlk190\"></button>" + 
            "       <button class=\"key\" id=\"nlk191\"></button>" + 
            "       <button class=\"key statekey\" id=\"nlk16r\">Shift</button>" + 
            "</div>" + 
            "<div class=\"row\">" + 
            "       <button class=\"key statekey\" id=\"nlk17\">Ctrl</button>" + 
            "       <button class=\"key statekey\" id=\"nlk18\">Alt</button>" + 
            "       <button class=\"key wordkey\" id=\"nlk32\">Space</button>" + 
            "       <button class=\"key statekey\" id=\"nlk18r\">Alt</button>" + 
            "       <button class=\"key statekey\" id=\"nlk17r\">Ctrl</button>" + 
            "</div>");

	$keyboard.append("<div id=\"nlk-status\">Ready.</div>");
        
        $("#nlk-rtl").click(function() {
            // TODO: should reflect "current" textarea
            var $textarea = $("textarea");
            if ($textarea.attr("dir") == "rtl") {
                $textarea.attr("dir", "");
                $("#nlk-rtl").removeClass("down");
            }
            else {
                $textarea.attr("dir", "rtl");
                $("#nlk-rtl").addClass("down");
            }
        });
        
        showCurrentState();
        
        this.each(function() {
            var $input = $(this);
            $input.focus(function(event) {
                if ($(event.target)[0].dir == "rtl") {
                    $("#nlk-rtl").addClass("down");
                }
                else {
                    $("#nlk-rtl").removeClass("down");
                }
            });
            
            $input.keydown(function(event) {
                $("#nlk" + event.keyCode).addClass("down");
                $("#nlk" + event.keyCode + "r").addClass("down"); // right shift/alt/ctrl
                refreshState(event);
                handleKeyDown(event);
            });

            $input.keyup(function(event) {
                $("#nlk" + event.keyCode).removeClass("down");
                $("#nlk" + event.keyCode + "r").removeClass("down"); // right shift/alt/ctrl
                refreshState(event);
            });
        });
        return this;
    };
    
    // public data
    $.nonLatinKeyboard = {
        mappings: [
            {
                name: "Hebrew-SIL",         
                map: [
                    {"32": "\u0020", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "59": "\u05b0", "61": "\u05bc", "65": "\u05b7", "66": "\u05d1", "67": "\u05e6", "68": "\u05d3", "69": "\u05b6", "70": "\u05e9\u05c2", "71": "\u05d2", "72": "\u05d4", "73": "\u05b4", "74": "\u05e9\u05c1", "75": "\u05db", "76": "\u05dc", "77": "\u05de", "78": "\u05e0", "79": "\u05b9", "80": "\u05e4", "81": "\u05e7", "82": "\u05e8", "83": "\u05e1", "84": "\u05ea", "85": "\u05bb", "86": "\u05d8", "87": "\u05d5", "88": "\u05d7", "89": "\u05d9", "90": "\u05d6", "109": "\u05be", "186": "\u05b0", "187": "\u05bc", "188": ",", "189": "\u05be", "190": ".", "191": "\/", "192": "\u20ac", "219": "[", "220": "\u05c0", "221": "]", "222": "\u2019"},
                    {"32": "\u0020", "48": ")", "49": "!", "50": "\u0598", "51": "\u05a8", "52": "\u059c", "53": "\u059e", "55": "\u05ac", "56": "\u059d", "57": "(", "59": "\u05f4", "65": "\u05b8", "67": "\u05e5", "69": "\u05b5", "75": "\u05da", "77": "\u05dd", "78": "\u05df", "79": "\u05b9", "80": "\u05e3", "81": "\u0597", "83": "\u05e9", "89": "\u059f", "109": "\u2013", "186": "\u05f4", "188": "\u05e2", "189": "\u2013", "190": "\u05d0", "191": "?", "192": "\u20aa", "219": "{", "220": "\u05c0", "221": "}", "222": "\u201d"},
                    {"32": "\u2009", "48": "\u05aa", "49": "\u05bd", "50": "\u05a2", "51": "\u0596", "52": "\u05a5", "53": "\u05a6", "54": "\u05ad", "55": "\u05a3", "56": "\u059b", "57": "\u05a7", "59": ";", "61": "\u0591", "65": "\u05c7", "71": "\u25e6", "72": "\u0336", "77": "\u200c", "79": "\u05c7", "109": "\u2014", "186": ";", "187": "\u0591", "188": "\u00ab", "189": "\u2014", "190": "\u00bb", "191": "\u05f3", "192": "$", "220": "\u05a4", "221": "\u059a", "222": "\u0323"},
                    {"32": "\u00a0", "48": "\u05af", "49": "\u0597", "50": "\u05ae", "51": "\u0599", "52": "\u05a0", "53": "\u05a9", "54": "\u059f", "55": "\u05a1", "56": "\u0595", "57": "\u0593", "59": "\u05c3", "61": "\u25cc", "65": "\u05b2", "69": "\u05b1", "71": "\u2022", "72": "\u030a", "77": "\u200d", "79": "\u05b3", "80": "\u034f", "109": "\u05bf", "186": "\u05c3", "187": "\u25cc", "188": "\u0307", "189": "\u05bf", "190": "\u0308", "219": "\u0594", "220": "\u05ab", "221": "\u0592", "222": "\u05c4"}
                ]
            },
            {
                name: "Hebrew-Tiro",
                map: [
                    {"32": "\u0020", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "59": "\u05e3", "61": "\u25e6", "65": "\u05e9", "66": "\u05e0", "67": "\u05d1", "68": "\u05d2", "69": "\u05e7", "70": "\u05db", "71": "\u05e2", "72": "\u05d9", "73": "\u05df", "74": "\u05d7", "75": "\u05dc", "76": "\u05da", "77": "\u05e6", "78": "\u05de", "79": "\u05dd", "80": "\u05e4", "81": "\u0307", "82": "\u05e8", "83": "\u05d3", "84": "\u05d0", "85": "\u05d5", "86": "\u05d4", "87": "\u05f3", "88": "\u05e1", "89": "\u05d8", "90": "\u05d6", "109": "\u05be", "186": "\u05e3", "187": "\u25e6", "188": "\u05ea", "189": "\u05be", "190": "\u05e5", "191": "\u05ad", "192": "\u05c3", "219": "[", "220": "\u05c0", "221": "]", "222": "\u059a"},
                    {"32": "\u0020", "48": "\u059d", "49": "\u05a9", "50": "\u0599", "51": "\u0592", "52": "\u05af", "53": "\u05ba", "54": "\u05b9", "55": "\u05bf", "56": "\u05c2", "57": "\u05c1", "59": "\u05b2", "61": "\u05bc", "65": "\u05bd", "66": "\u05a5", "67": "\u05aa", "68": "\u05bb", "69": "\u05ab", "70": "\u05b4", "71": "\u05b1", "72": "\u05b6", "73": "\u05a1", "74": "\u05b5", "75": "\u05b3", "76": "\u05b8", "77": "\u059b", "78": "\u05a7", "79": "\u0595", "80": "\u0594", "81": "\u05c4", "82": "\u059f", "83": "\u05b0", "84": "\u0593", "85": "\u059c", "86": "\u05a6", "87": "\u05ac", "88": "\u05a4", "89": "\u059e", "90": "\u05c5", "109": "\u05a0", "186": "\u05b2", "187": "\u05bc", "188": "\u0591", "189": "\u05a0", "190": "\u0596", "191": "\u05a3", "192": "\u05ae", "219": "\u0597", "220": "\u05a8", "221": "\u0598", "222": "\u05b7"},
                    {"32": "\u0020", "48": "\u25cc", "50": "\u0336", "51": "\u030a", "52": "\u20aa", "53": "\u200d", "54": "\u200c", "55": "\u034f", "56": "\u200e", "57": "\u200f", "61": "\u2022", "72": "\u05f2", "74": "\u05f1", "76": "\u05c7", "81": "\u0308", "85": "\u05f0", "87": "\u05f4", "109": "\u002d", "187": "\u2022", "189": "\u002d", "191": "\u002e", "192": "\u003b", "220": "\u005c", "222": "\u002c"},
                    {"32": "\u0020", "48": "\)", "49": "!", "50": "@", "51": "#", "52": "$", "53": "%", "54": "^", "55": "&", "56": "*", "57": "(", "59": ":", "61": "+", "81": "\/", "87": "'", "109": "_", "186": ":", "187": "+", "188": "<", "189": "_", "190": ">", "191": "?", "192": "~", "219": "{", "220": "|", "221": "}", "222": "\""}
                ]
            },
            {
                name: "Hebrew-QWERTY",
                map: [
                    {"32": "\u0020", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "59": ";", "61": "=", "65": "\u05d0", "66": "\u05d1", "67": "\u05e6", "68": "\u05d3", "69": "\u05e2", "70": "\u05e4", "71": "\u05d2", "72": "\u05d4", "73": "\u05d9", "74": "\u05d7", "75": "\u05db", "76": "\u05dc", "77": "\u05de", "78": "\u05e0", "79": "\u05d5", "80": "\u05e4", "81": "\u05e7", "82": "\u05e8", "83": "\u05e1", "84": "\u05ea", "85": "\u05d5", "86": "\u05d5", "87": "\u05e9", "88": "\u05db", "89": "\u05d8", "90": "\u05d6", "109": "-", "186": ";", "187": "=", "188": ",", "189": "-", "190": ".", "191": "\/", "192": "`", "219": "\u2019", "220": "\u05bf", "221": "\u05f2\u05b7", "222": "'"},
                    {"32": "\u0020", "48": "(", "49": "!", "50": "\u201c", "51": "#", "52": "$", "53": "%", "54": "^-\u201d", "55": "\u20aa", "56": "*", "57": "\)", "59": ":", "61": "+", "65": "\u05b8", "66": "\u05d1", "67": "\u05e5", "68": "\u201e", "69": "\u05b5", "70": "\u05e3", "71": "", "72": "\u05d7", "73": "\u05f2\u05b7", "74": "", "75": "\u05da", "76": "\u05dc\u05b9", "77": "\u05dd", "78": "\u05df", "79": "\u05d5\u05b9", "80": "\u05e3", "81": "", "82": "", "83": "\u05e9", "84": "\u05d8", "85": "\u05d5\u05bc", "86": "05d1", "87": "\u05e9\u05c1", "88": "\u05da", "89": "\u05ea", "90": "", "109": "_", "186": ":", "187": "+", "188": ">", "189": "_", "190": "<", "191": "?", "192": "\u05bc", "219": "}", "220": "-", "221": "{", "222": "\u2019"},
                    {"32": "\u00a0", "48": "\u05b0", "49": "\u05b2", "50": "\u05b3", "51": "\u05b1", "52": "\u05b4", "53": "\u05b5", "54": "\u05b7", "55": "\u05b8", "56": "\u05bb", "57": "\u05b6", "59": "\u05b0", "61": "-", "65": "\u05b7", "66": "\u2018", "67": "\u201c", "68": "", "69": "\u05b6", "70": "", "71": "", "72": "\u05d7", "73": "\u05b4", "74": "\u05b4", "75": "", "76": "", "77": "\u05dd", "78": "\u05a7", "79": "\u2019", "80": "\u05b0", "81": "", "82": "\u05b8", "83": "\u05e9\u05c1", "84": "\u05b8", "85": "\u05bb", "86": "\u201d", "87": "\u05e9\u05c2", "88": "\u2014", "89": "\u05f2\u05b7", "90": "\u2013", "109": "+", "186": "\u05b0", "187": "-", "188": "\u2019", "189": "+", "190": "\u05bc", "191": "", "192": "\u05bc", "219": "]", "220": "\u05be", "221": "[", "222": "\u2019"},
                    {"32": "\u00a0", "48": "\u05b0", "49": "\u05b2", "50": "\u05b3", "51": "\u05b1", "52": "\u05b4", "53": "\u05b5", "54": "\u05b7", "55": "\u05b8", "56": "\u05bb", "57": "\u05b6", "59": "\u05b0", "61": "+", "65": "\u05b2", "66": "\u059c", "67": "\u059e", "68": "", "69": "\u05b1", "70": "\u20ac", "71": "", "72": "\u05d7", "73": "\u05b4", "74": "\u05b4", "75": "", "76": "", "77": "\u05dd", "78": "\u05a7", "79": "\u2019", "80": "\u05b0", "81": "", "82": "\u05b3", "83": "\u05e9\u05c1", "84": "\u05b3", "85": "\u05bb", "86": "\u201d", "87": "\u05e9\u05c2", "88": "\u2014", "89": "\u05f2\u05b7", "90": "\u2013", "109": "-", "186": "\u05b0", "187": "+", "188": "\u2018", "189": "-", "190": "\u2026", "191": "", "192": "\u05bc", "219": "}", "220": "\u05bf", "221": "{", "222": "\u2019"}
                ]
            },
            {
                name: "Hebrew-ZC",
                map: [
                    {"32": "\u0020", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "59": ";", "61": "=", "65": "\u05d0", "66": "\u05d1", "67": "\u05e6", "68": "\u05d3", "69": "\u05e2", "70": "\u05e4", "71": "\u05d2", "72": "\u05d4", "73": "\u05d9", "74": "\u05d7", "75": "\u05db", "76": "\u05dc", "77": "\u05de", "78": "\u05e0", "79": "\u05d5", "80": "\u05e4", "81": "\u05e7", "82": "\u05e8", "83": "\u05e1", "84": "\u05ea", "85": "\u05d5", "86": "\u05d8", "87": "\u05e9", "88": "\u05db", "89": "\u05d9", "90": "\u05d6", "109": "-", "186": ";", "187": "=", "188": ",", "189": "-", "190": ".", "191": "\/", "192": "`", "219": "[", "220": "\\", "221": "]", "222": "'"},
                    {"32": "\u0020", "48": "\)", "49": "!", "50": "@", "51": "#", "52": "$", "53": "%", "54": "^", "55": "&", "56": "*", "57": "(", "59": ":", "61": "+", "65": "\u05c3", "66": "", "67": "\u05e5", "68": "", "69": "", "70": "\u05e3", "71": "", "72": "", "73": "\u05f2", "74": "", "75": "\u05da", "76": "\u05dc\u05b9", "77": "\u05dd", "78": "\u05df", "79": "\u05d5\u05b9", "80": "\u05e3", "81": "\u05be", "82": "", "83": "\u05e9\u05c2", "84": "\u25e6", "85": "\u05d5\u05bc", "86": "", "87": "\u05e9\u05c1", "88": "\u05da", "89": "\u20aa", "90": "\u05c0", "109": "_", "186": ":", "187": "+", "188": "<", "189": "_", "190": ">", "191": "?", "192": "~", "219": "{", "220": "|", "221": "}", "222": "\""},
                    {"32": "\u0020", "48": "\u059d", "49": "\u05a9", "50": "\u0599", "51": "\u0592", "52": "\u05af", "53": "\u05ba", "54": "\u05b9", "55": "\u05bf", "56": "\u05c2", "57": "\u05c1", "59": "\u05b6", "61": "\u05bc", "65": "\u05b7", "66": "\u05a5", "67": "\u05aa", "68": "\u05b0", "69": "\u05ab", "70": "\u05b2", "71": "\u05b3", "72": "\u05bd", "73": "\u05a1", "74": "\u05bb", "75": "\u05b4", "76": "\u05b5", "77": "\u059b", "78": "\u05a7", "79": "\u0595", "80": "\u0594", "81": "\u05c4", "82": "\u059f", "83": "\u05b8", "84": "\u0593", "85": "\u059c", "86": "\u05a6", "87": "\u05ac", "88": "\u05a4", "89": "\u059e", "90": "\u05c5", "109": "\u05a0", "186": "\u05b6", "187": "\u05bc", "188": "\u0591", "189": "\u05a0", "190": "\u0596", "191": "\u05a3", "192": "\u05ae", "219": "\u0597", "220": "\u05a8", "221": "\u0598", "222": "\u05b1"},
                    {"32": "\u0020", "48": "\u25cc", "49": "", "50": "", "51": "", "52": "\u20ac", "53": "", "54": "", "55": "", "56": "", "57": "", "59": "", "61": "", "65": "", "66": "", "67": "", "68": "", "69": "", "70": "", "71": "", "72": "", "73": "\u05f2", "74": "", "75": "", "76": "", "77": "", "78": "\u05c6", "79": "\u05f0", "80": "", "81": "\u05bf", "82": "", "83": "\u05c7", "84": "\u2022", "85": "\u05f1", "86": "", "87": "", "88": "", "89": "", "90": "", "109": "", "186": "", "187": "", "188": "\u05a2", "189": "", "190": "", "191": "", "192": "", "219": "", "220": "", "221": "", "222": ""}
                ]
            }
        ],
        getMap: function() {
            return this.mapping.map;
        }
    };
    $.nonLatinKeyboard.mapping = $.nonLatinKeyboard.mappings[1];  // default
    
    // private data
    var currentState = 0;
    
    // private methods
    function getState(e) {
        var state = 0;
        if (e.shiftKey) { state += 1; }
        if (e.ctrlKey && e.altKey) { state += 2; }
        if (e.ctrlKey && !e.altKey) { state = 9; } // allow regular control key shortcuts to work (e.g., ctrl-c to copy)
        return state;
    }
    
    function refreshState(e) {
        var newState = getState(e);

        if (newState != currentState)
        {
            currentState = newState;
            $("#debug").append("remap!");
    
            showCurrentState(currentState);
        }
    }
    
    function showCurrentState() {
        var thisMap = $.nonLatinKeyboard.getMap()[currentState];
        
        for(key in thisMap)
        {
            $("#nlk" + key).text(thisMap[key]);
        }
    }

    function mapKey(e) {
        var keycode = 0;
        e = e ? e : event;
        keycode = e.keyCode;
	// FF kludge: 
	// see: https://bugzilla.mozilla.org/show_bug.cgi?format=multiple&id=537955
	if (keycode == 107) { keycode = 187; }
        if (keycode > 47 || keycode == 32) {
            var mod = getState(e);
            if (mod < 4) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
		var mapped = ($.nonLatinKeyboard.getMap())[mod][keycode];
		// TODO: Unicode "description"
		$("#nlk-status").text(mod + "," + keycode + " " + mapped.charCodeAt(0) + 
				      " " + mapped.charCodeAt(0).toString(16));
                return mapped;
            }
        }
        return false;
    }
    
    function insert(elem, text) {
        if (elem.selectionStart || elem.selectionStart == 0) {
            var start = elem.selectionStart;
            var end = elem.selectionEnd;
            var newText = elem.value.substring(0, start);
            newText += text;
            newText += elem.value.substring(end, elem.value.length);
            elem.value = newText;
            elem.selectionStart = start + text.length;
            elem.selectionEnd = elem.selectionStart;
        } else if (document.selection) {
            var textRange = document.selection.createRange();
            textRange.text = text;
        } else {
            elem.value += text;
        }
    }
    function handleKeyDown(event) {
        var output = mapKey(event);
        if (output) {
            insert(event.target, output);
            return false; // prevent default
        }
        return true;
    }       
    
})(jQuery)