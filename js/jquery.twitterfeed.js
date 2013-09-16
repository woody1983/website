(function($) {
	
	 var TwitterFeed = function (element, options) {
		this.options = options
		this.$element = $(element)
		
		if (this.options.autoload) {
			this.load();
		}
	}
	
	TwitterFeed.prototype = {
		constructor: TwitterFeed
		
		,
		load: function() {
			
			if (!this.options.username) return;
			
			var self = this
			, $element = self.$element
			, o = self.options
			, _url = 'https://api.twitter.com/1/statuses/user_timeline/' + o.username + '.json?callback=?&count=' + o.tweets + '&include_rts=1';
			
			$.getJSON(_url, function(data) {
				
				if (data.length) {
					$element.html('');
				}
				
				for(var i = 0; i< data.length; i++){
					var tweet = data[i].text;
					var created = self.parseDate(data[i].created_at);
					var createdDate = created.getDate()+'-'+(created.getMonth()+1)+'-'+created.getFullYear()+' at '+created.getHours()+':'+created.getMinutes();
					tweet = self.parseURL(tweet);
					tweet = self.parseUsername(tweet);
					tweet = self.parseHashtag(tweet);
					//tweet += '<div class="twitter-user"><a href="https://twitter.com/#!/' + o.username + '" target="_blank" class="twitter-username">@' + o.username + '</a><a href="https://twitter.com/#!/' + o.username + '/status/'+data[i].id_str+'">'+createdDate+'</a></div>'
					$element.append('<p class="tweet">'+tweet+'</p>');
				}
			});
		}
		
		, 
		parseURL: function (str) {
			return str.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
				return url.link(url);
			});
		}
		
		,
		parseUsername: function(str) {
			return str.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
				var username = u.replace("@","")
				return u.link("https://twitter.com/"+username);
			});
		}
		
		,
		parseHashtag: function(str) {
			return str.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
				var tag = t.replace("#","%23")
				return t.link("https://search.twitter.com/search?q="+tag);
			});
		}
		
		,
		parseDate: function(str) {
			var v=str.split(' ');
			return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
		}
	}
	
	/* TWITTERFEED PLUGIN DEFINITION
	* ================================ */

	$.fn.twitterfeed = function (option) {
		return this.each(function () {
			var $this = $(this)
			, data = $this.data('twitterfeed')
			, options = $.extend({}, $.fn.twitterfeed.defaults, $this.data(), typeof option == 'object' && option)
			if (!data) $this.data('twitterfeed', (data = new TwitterFeed(this, options)))
			if (typeof option == 'string') data[option]()
			else if (options.load) data.load()
		})
	}

	$.fn.twitterfeed.defaults = {
		autoload: true,
		tweets: 1,
		username: ''
	}

	$.fn.twitterfeed.Constructor = TwitterFeed
	
	
})(window.jQuery);