/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Browser fixes.

		// IE: Flexbox min-height bug.
		if (skel.vars.browser == 'ie')
			(function () {

				var flexboxFixTimeoutId;

				$window.on('resize.flexbox-fix', function () {

					var $x = $('.fullscreen');

					clearTimeout(flexboxFixTimeoutId);

					flexboxFixTimeoutId = setTimeout(function () {

						if ($x.prop('scrollHeight') > $window.height())
							$x.css('height', 'auto');
						else
							$x.css('height', '100vh');

					}, 250);

				}).triggerHandler('resize.flexbox-fix');

			})();

		// Object fit workaround.
		if (!skel.canUse('object-fit'))
			(function () {

				$('.banner .image, .spotlight .image').each(function () {

					var $this = $(this),
						$img = $this.children('img'),
						positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

					// Set image.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-repeat', 'no-repeat')
						.css('background-size', 'cover');

					// Set position.
					switch (positionClass.length > 1 ? positionClass[1] : '') {

						case 'left':
							$this.css('background-position', 'left');
							break;

						case 'right':
							$this.css('background-position', 'right');
							break;

						default:
						case 'center':
							$this.css('background-position', 'center');
							break;

					}

					// Hide original.
					$img.css('opacity', '0');

				});

			})();

		// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({
			anchor: 'middle'
		});

		// Wrapper.
		$wrapper.children()
			.scrollex({
				top: '30vh',
				bottom: '30vh',
				initialize: function () {
					$(this).addClass('is-inactive');
				},
				terminate: function () {
					$(this).removeClass('is-inactive');
				},
				enter: function () {
					$(this).removeClass('is-inactive');
				},
				leave: function () {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

		// Items.
		$('.items')
			.scrollex({
				top: '30vh',
				bottom: '30vh',
				delay: 50,
				initialize: function () {
					$(this).addClass('is-inactive');
				},
				terminate: function () {
					$(this).removeClass('is-inactive');
				},
				enter: function () {
					$(this).removeClass('is-inactive');
				},
				leave: function () {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
			.wrapInner('<div class="inner"></div>');

		// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			.prepend(skel.vars.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top: '30vh',
				bottom: '30vh',
				delay: 50,
				initialize: function () {
					$(this).addClass('is-inactive');
				},
				terminate: function () {
					$(this).removeClass('is-inactive');
				},
				enter: function () {
					$(this).removeClass('is-inactive');
				},
				leave: function () {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
			//.css('overflow', 'hidden')
			.css('overflow-y', skel.vars.mobile ? 'visible' : 'hidden')
			.css('overflow-x', skel.vars.mobile ? 'scroll' : 'hidden')
			.scrollLeft(0);

		// Style #1.
		// ...

		// Style #2.
		$('.gallery')
			.on('wheel', '.inner', function (event) {

				var $this = $(this),
					delta = (event.originalEvent.deltaX * 10);

				// Cap delta.
				if (delta > 0)
					delta = Math.min(25, delta);
				else if (delta < 0)
					delta = Math.max(-25, delta);

				// Scroll.
				$this.scrollLeft($this.scrollLeft() + delta);

			})
			.on('mouseenter', '.forward, .backward', function (event) {

				var $this = $(this),
					$inner = $this.siblings('.inner'),
					direction = ($this.hasClass('forward') ? 1 : -1);

				// Clear move interval.
				clearInterval(this._gallery_moveIntervalId);

				// Start interval.
				this._gallery_moveIntervalId = setInterval(function () {
					$inner.scrollLeft($inner.scrollLeft() + (5 * direction));
				}, 10);

			})
			.on('mouseleave', '.forward, .backward', function (event) {

				// Clear move interval.
				clearInterval(this._gallery_moveIntervalId);

			});

		// Lightbox.
		$('.gallery.lightbox')
			.on('click', 'a', function (event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
				if (!href.match(/\.(jpg|gif|png|mp4)$/))
					return;

				// Prevent default.
				event.preventDefault();
				event.stopPropagation();

				// Locked? Bail.
				if ($modal[0]._locked)
					return;

				// Lock.
				$modal[0]._locked = true;

				// Set src.
				$modalImg.attr('src', href);

				// Set visible.
				$modal.addClass('visible');

				// Focus.
				$modal.focus();

				// Delay.
				setTimeout(function () {

					// Unlock.
					$modal[0]._locked = false;

				}, 600);

			})
			.on('click', '.modal', function (event) {

				var $modal = $(this),
					$modalImg = $modal.find('img');

				// Locked? Bail.
				if ($modal[0]._locked)
					return;

				// Already hidden? Bail.
				if (!$modal.hasClass('visible'))
					return;

				// Lock.
				$modal[0]._locked = true;

				// Clear visible, loaded.
				$modal
					.removeClass('loaded')

				// Delay.
				setTimeout(function () {

					$modal
						.removeClass('visible')

					setTimeout(function () {

						// Clear src.
						$modalImg.attr('src', '');

						// Unlock.
						$modal[0]._locked = false;

						// Focus.
						$body.focus();

					}, 475);

				}, 125);

			})
			.on('keypress', '.modal', function (event) {

				var $modal = $(this);

				// Escape? Hide modal.
				if (event.keyCode == 27)
					$modal.trigger('click');

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
			.find('img')
			.on('load', function (event) {

				var $modalImg = $(this),
					$modal = $modalImg.parents('.modal');

				setTimeout(function () {

					// No longer visible? Bail.
					if (!$modal.hasClass('visible'))
						return;

					// Set loaded.
					$modal.addClass('loaded');

				}, 275);

			});

	});

})(jQuery);

$('div.modal').on('show.bs.modal', function () {
	var modal = this;
	var hash = modal.id;
	window.location.hash = hash;
	window.onhashchange = function () {
		if (!location.hash) {
			$(modal).modal('hide');
		}
	}
});


// Minified Bootstrap Modal Function 
+
function (a) {
	"use strict";

	function b(b, d) {
		return this.each(function () {
			var e = a(this),
				f = e.data("bs.modal"),
				g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
			f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
		})
	}
	var c = function (b, c) {
		this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
			this.$element.trigger("loaded.bs.modal")
		}, this))
	};
	c.VERSION = "3.2.0", c.DEFAULTS = {
		backdrop: !0,
		keyboard: !0,
		show: !0
	}, c.prototype.toggle = function (a) {
		return this.isShown ? this.hide() : this.show(a)
	}, c.prototype.show = function (b) {
		var c = this,
			d = a.Event("show.bs.modal", {
				relatedTarget: b
			});
		this.$element.trigger(d), this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function () {
			var d = a.support.transition && c.$element.hasClass("fade");
			c.$element.parent().length || c.$element.appendTo(c.$body), c.$element.show().scrollTop(0), d && c.$element[0].offsetWidth, c.$element.addClass("in").attr("aria-hidden", !1), c.enforceFocus();
			var e = a.Event("shown.bs.modal", {
				relatedTarget: b
			});
			d ? c.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
				c.$element.trigger("focus").trigger(e)
			}).emulateTransitionEnd(300) : c.$element.trigger("focus").trigger(e)
		}))
	}, c.prototype.hide = function (b) {
		b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.$body.removeClass("modal-open"), this.resetScrollbar(), this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
	}, c.prototype.enforceFocus = function () {
		a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
			this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
		}, this))
	}, c.prototype.escape = function () {
		this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function (a) {
			27 == a.which && this.hide()
		}, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
	}, c.prototype.hideModal = function () {
		var a = this;
		this.$element.hide(), this.backdrop(function () {
			a.$element.trigger("hidden.bs.modal")
		})
	}, c.prototype.removeBackdrop = function () {
		this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
	}, c.prototype.backdrop = function (b) {
		var c = this,
			d = this.$element.hasClass("fade") ? "fade" : "";
		if (this.isShown && this.options.backdrop) {
			var e = a.support.transition && d;
			if (this.$backdrop = a('<div class="modal-backdrop ' + d + '" />').appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function (a) {
					a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
				}, this)), e && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
			e ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(150) : b()
		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass("in");
			var f = function () {
				c.removeBackdrop(), b && b()
			};
			a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", f).emulateTransitionEnd(150) : f()
		} else b && b()
	}, c.prototype.checkScrollbar = function () {
		document.body.clientWidth >= window.innerWidth || (this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar())
	}, c.prototype.setScrollbar = function () {
		var a = parseInt(this.$body.css("padding-right") || 0, 10);
		this.scrollbarWidth && this.$body.css("padding-right", a + this.scrollbarWidth)
	}, c.prototype.resetScrollbar = function () {
		this.$body.css("padding-right", "")
	}, c.prototype.measureScrollbar = function () {
		var a = document.createElement("div");
		a.className = "modal-scrollbar-measure", this.$body.append(a);
		var b = a.offsetWidth - a.clientWidth;
		return this.$body[0].removeChild(a), b
	};
	var d = a.fn.modal;
	a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
		return a.fn.modal = d, this
	}, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
		var d = a(this),
			e = d.attr("href"),
			f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
			g = f.data("bs.modal") ? "toggle" : a.extend({
				remote: !/#/.test(e) && e
			}, f.data(), d.data());
		d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
			a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
				d.is(":visible") && d.trigger("focus")
			})
		}), b.call(f, g, this)
	})
}(jQuery)