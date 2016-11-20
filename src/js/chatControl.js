var $ = require('jquery');
var config = require('chatConfig.js');

/**
 * An object for doing the chat control and DOM manipulation.
 * @type {object}
 */
var chatController = {
    elId: '#messages',
    el: null,
    activeTab: '',
    tabContents: {
        IC: [],
        OOC: [],
        MIX: []
    },
    config: null,

    /**
     * Initializes the data by fetching the specific DOM element, and loading the config.
     * @param {string} newEl
     * @param {boolean} isAdmin
     * @throws {string} A description of the error, if an invalid operation is requested.
     */
    Init: function(newEl, isAdmin) {
        if (newEl) {
            this.elId = newEl;
        }
        this.el = $(elId);

        if (isAdmin == true) {
            this.tabContents.ADMIN = [];
        }

        this.config = config.Init(this);
        this.activeTab = this.config.lastTab;
    },

    /**
     * Appends a message to the chat DOM element, and inserts it into the context specific memory array.
     * @param {string} msg
     * @throws {string} A description of the error, if an invalid operation is requested or bad data sent.
     */
    AddMessage: function(msg) {
        // Parse and validate the message as a JSON object.
        msg = JSON.parse(msg);
        if (msg.length != 3) {
            throw "Bad message format.";
        }

        if (this.tabContents.hasOwnProperty(msg.context) == false) {
            throw "Invalid message context.";
        }

        var messageContent = this.ParseMarkup(msg.contents, this.config.markupEnabled);
        var appendElement = false;

        // WIP: Finish writing this piece of shit code. And probably think it through.

        // Appending works in one of two cases. Either we're using a preset filter (tab).
        // Or we're viewing the MIXed tab, at which point, complete user control. Weeeee.
        if (msg.context == this.activeTab) {
            appendElement = true;
        }
        
        if (this.activeTab == "MIX" && this.config.mixPreference.indexOf(msg.type) != -1) {
            appendElement = true;
        }

        // Add it to the proper array.
        this.tabContents[msg.context].push(messageContent);

        // Nix the top most entry from both memory and DOM if we're at the limit.
        if (this.tabContents[msg.context].length > this.config.messageLimit) {
            this.tabContents[msg.context].shift();

            if (this.activeTab == msg.context) {
                this.el.children().first().remove();
            }
        }

        if (appendElement == true) {

        }
    },

    /**
     * Clears the contents of the chat DOM element, and then loads an array of saved messages into it.
     * @param {string} newTab
     * @throws {string} A description of the error, if an invalid operation is requested.
     */
    SwapTab: function(newTab) {
        if (newTab == this.activeTab) {
            return;
        }

        if (this.tabContents.hasOwnProperty(newTab) == false) {
            throw "Attempted to open an unset tab.";
        }

        // Empty the DOM.
        this.el.empty();

        // Load up all of them old messages.
        for (var i = 0; i < this.tabContents[newTab].length, i++) {
            this.el.append($(this.tabContents[newTab][i]));
        }
    },

    // TODO: Implement markup.
    ParseMarkup: function(msg, markupEnabled) {
        return msg;
    },

    /**
     * Sets a cookie with the name of cname, and value of cvalue.
     * @param {string} cname
     * @param {string} cvalue
     */
    SetCookie: function(cname, cvalue) {
        document.cookie = cname + '=' + cvalue + '; path=/';
    },

    /**
     * Returns the value of a cookie with the name of cname, or an empty string.
     * @param {string} cname
     * @returns {string}
     */
    GetCookie: function(cname) {
        if (document.cookie.length > 0) {
            var cstart = document.cookie.indexOf(cname + '=');
            if (cstart != -1) {
                cstart = cstart + cname.length + 1;
                var cend = document.cookie.indexOf(";", cstart);
                if (cend == -1) {
                    cend = document.cookie.length;
                }
                return decodeURI(document.cookie.substring(cstart, cend));
            }
        }

        return '';
    }
}