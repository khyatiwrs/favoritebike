/*!
 * enquire.js v2.1.2 - Awesome Media Queries in JavaScript
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
!function(a,b,c){var d=window.matchMedia;"undefined"!=typeof module&&module.exports?module.exports=c(d):"function"==typeof define&&define.amd?define(function(){return b[a]=c(d)}):b[a]=c(d)}("enquire",this,function(a){"use strict";function b(a,b){var c,d=0,e=a.length;for(d;e>d&&(c=b(a[d],d),c!==!1);d++);}function c(a){return"[object Array]"===Object.prototype.toString.apply(a)}function d(a){return"function"==typeof a}function e(a){this.options=a,!a.deferSetup&&this.setup()}function f(b,c){this.query=b,this.isUnconditional=c,this.handlers=[],this.mql=a(b);var d=this;this.listener=function(a){d.mql=a,d.assess()},this.mql.addListener(this.listener)}function g(){if(!a)throw new Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!a("only all").matches}return e.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(a){return this.options===a||this.options.match===a}},f.prototype={addHandler:function(a){var b=new e(a);this.handlers.push(b),this.matches()&&b.on()},removeHandler:function(a){var c=this.handlers;b(c,function(b,d){return b.equals(a)?(b.destroy(),!c.splice(d,1)):void 0})},matches:function(){return this.mql.matches||this.isUnconditional},clear:function(){b(this.handlers,function(a){a.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var a=this.matches()?"on":"off";b(this.handlers,function(b){b[a]()})}},g.prototype={register:function(a,e,g){var h=this.queries,i=g&&this.browserIsIncapable;return h[a]||(h[a]=new f(a,i)),d(e)&&(e={match:e}),c(e)||(e=[e]),b(e,function(b){d(b)&&(b={match:b}),h[a].addHandler(b)}),this},unregister:function(a,b){var c=this.queries[a];return c&&(b?c.removeHandler(b):(c.clear(),delete this.queries[a])),this}},new g});

window.theme = window.theme || {};

// Returns a function which adds a vendor prefix to any CSS property name
// Source https://github.com/markdalgleish/stellar.js/blob/master/src/jquery.stellar.js
theme.vendorPrefix = (function () {
  var prefixes = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
      style = $('script')[0].style,
      prefix = '',
      prop;

  for (prop in style) {
    if (prefixes.test(prop)) {
      prefix = prop.match(prefixes)[0];
      break;
    }
  }

  if ('WebkitOpacity' in style) { prefix = 'Webkit'; }
  if ('KhtmlOpacity' in style) { prefix = 'Khtml'; }

  return function (property) {
    return prefix + (prefix.length > 0 ? property.charAt(0).toUpperCase() + property.slice(1) : property);
  };
}());

theme.variables = {
  productPageLoad     : false,
  productPageSticky   : true,

  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  mediaQuerySmall     : 'screen and (max-width: 590px)',
  mediaQueryMedium    : 'screen and (min-width: 591px) and (max-width: 768px)',
  mediaQueryLarge     : 'screen and (min-width: 769px)',
  bpSmall             : false
};

theme.initCache = function () {
  theme.cache = {
    $window                 : $(window),
    $html                   : $('html'),
    $body                   : $('body'),
    $drawerRight            : $('.drawer--right'),

    $customSelect           : $('.js-selector'),

    $collectionImage        : $('.collection-hero__image'),

    $siteNav                : $('.site-nav'),
    $cartBuggle             : $('.cart-link__bubble'),
    $logo                   : $('.site-header__logo img'),
    $toggleSearchModal      : $('.js-toggle-search-modal'),

    $productImages          : $('.product-single__photos'),
    $productImagePhoto      : $('.product-single__photo'),

    $indentedRteImages      : $('.rte--indented-images'),

    $productGridRows        : $('.collage-grid__row'),
    $productGridItem        : $('.grid__product'),
    $productGridPhotosLarge : $('.grid__item--large .grid-product__image-link'),

    $productSingleWrapper   : $('.product-single'),
    $productSingleMeta      : $('.product-single__meta'),
    $productReturnLink      : $('.return-link'),
    $productSelectors       : $('.radio-wrapper')
  };
};

theme.init = function () {
  theme.initCache();
  theme.setBreakpoints();
  theme.fitNav();
  theme.afterCartLoad();
  theme.checkoutIndicator();
  theme.collectionParallax();
  theme.initCollageGrid();
  theme.collectionBackButton();
  theme.hideSingleSelectors();
  theme.styleTextLinks();
  theme.searchModal();

  
    theme.productImageZoom();
  

  // Functions to run on load so image sizes can be calculated
  theme.cache.$window.on('load', theme.resizeLogo);
  theme.cache.$window.on('load', theme.initStickyProductMeta);
  theme.cache.$window.on('load', theme.articleImages);

  // Functions to re-run on resize
  theme.cache.$window.on('resize', theme.debounce(theme.resizeLogo, 150));
  theme.cache.$window.on('resize', theme.debounce(theme.initStickyProductMeta, 150));

};

theme.collectionBackButton = function () {
  if (!document.referrer || !theme.cache.$productReturnLink.length || !window.history.length) {
    return;
  }

  theme.cache.$productReturnLink.on('click', theme.backButton);
};

theme.backButton = function () {
  var referrerDomain = urlDomain(document.referrer);
  var shopDomain = urlDomain(document.url);

  if (shopDomain === referrerDomain) {
    history.back();
    return false;
  }

  function urlDomain(url) {
    var    a      = document.createElement('a');
           a.href = url;
    return a.hostname;
  }
};

theme.setBreakpoints = function () {
  if(!theme.cache.$html.hasClass('lt-ie9')) {
    enquire.register(theme.variables.mediaQuerySmall, {
      match: function () {
        theme.createImageCarousel();
        theme.clearCollageGridHeights();
        theme.variables.bpSmall = true;

        
          if (theme.cache.$productImagePhoto.length) {
            // remove event handlers for product zoom on mobile
            theme.cache.$productImagePhoto.off();
          };
        
      },
      unmatch: function () {
        theme.destroyImageCarousel();
        theme.variables.bpSmall = false;
        theme.initStickyProductMeta();

        
          // reinit product zoom
          theme.productImageZoom();
        
      }
    });
  }
};

theme.fitNav = function () {
  // Measure children of site nav on load and resize.
  // If wider than parent, switch to mobile nav.
  controlNav();
  theme.cache.$window.on('load', controlNav);
  theme.cache.$window.on('resize', theme.debounce(controlNav, 150));

  function controlNav() {
    // Subtract 20 from width to account for inline-block spacing
    var navWidth = theme.cache.$siteNav.parent().outerWidth() - 20;
    var navItemWidth = 0;
    theme.cache.$siteNav.find('> li').each(function() {
      var $el = $(this);
      if (!$el.hasClass('site-nav--compress__menu')) {
        // Round up to be safe
        navItemWidth += Math.ceil($(this).width());
      }
    });

    if (navItemWidth > navWidth) {
      theme.cache.$siteNav.addClass('site-nav--compress');
    } else {
      theme.cache.$siteNav.removeClass('site-nav--compress');
    }

    theme.cache.$siteNav.addClass('site-nav--init');
  }
};

theme.resizeLogo = function () {
  // Using .each() as there can be a reversed logo too
  theme.cache.$logo.each(function() {
    var $el = $(this),
        logoWidthOnScreen = $el.width(),
        containerWidth = $el.closest('.grid__item').width();
    // If image exceeds container, let's make it smaller
    if (logoWidthOnScreen > containerWidth) {
      $el.css('maxWidth', containerWidth);
    }
    else {
      $el.removeAttr('style');
    }
  });
};

theme.sizeCartDrawerFooter = function () {
  // Stop if our drawer doesn't have a fixed footer
  if (!theme.cache.$drawerRight.hasClass('drawer--has-fixed-footer')) {
    return;
  }

  // Elements are reprinted regularly so selectors are not cached
  var $cartFooter = $('.ajaxcart__footer').removeAttr('style'),
      $cartInner = $('.ajaxcart__inner').removeAttr('style'),
      cartFooterHeight = $cartFooter.outerHeight();

  $cartInner.css('bottom', cartFooterHeight);
  $cartFooter.css('height', cartFooterHeight);
};

theme.afterCartLoad = function () {
  theme.cache.$body.on('ajaxCart.afterCartLoad', function(evt, cart) {
    // Open cart drawer
    timber.RightDrawer.open();

    // Size the cart's fixed footer
    theme.sizeCartDrawerFooter();

    // Show cart bubble in nav if items exist
    if (cart.items.length > 0) {
      theme.cache.$cartBuggle.addClass('cart-link__bubble--visible');
    } else {
      theme.cache.$cartBuggle.removeClass('cart-link__bubble--visible');
    }
  });
};

theme.checkoutIndicator = function () {
  // Add a loading indicator on the cart checkout button (/cart and drawer)
  theme.cache.$body.on('click', '.cart__checkout', function() {
    $(this).addClass('btn--loading');
  });
};

theme.searchModal = function() {
  if (!theme.cache.$toggleSearchModal.length) {
    return;
  }

  theme.cache.$toggleSearchModal.magnificPopup({
    type: 'inline',
    mainClass: 'mfp-fade',
    closeOnBgClick: true,
    closeBtnInside: false,
    closeOnContentClick: false,
    tClose: 'Close (Esc)',
    alignTop: true,
    removalDelay: 500
  });
}

theme.productImageZoom = function() {
  if (!theme.cache.$productImagePhoto.length || theme.variables.bpSmall) {
    return;
  };

  theme.cache.$productImagePhoto.magnificPopup({
    type: 'image',
    mainClass: 'mfp-fade',
    closeOnBgClick: true,
    closeBtnInside: false,
    closeOnContentClick: true,
    tClose: 'Close (Esc)',
    removalDelay: 500,
    gallery: {
      enabled:true,
      navigateByImgClick: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><span class="mfp-chevron mfp-chevron-%dir%"></span></button>',
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)'
    }
  });
};

theme.collectionParallax = function () {
  if (!theme.cache.$collectionImage.length || !theme.cache.$html.hasClass('supports-csstransforms3d')) {
    return;
  }

  theme.cache.$collectionImage.addClass('is-init');

  var prefixedTransform = theme.vendorPrefix ? theme.vendorPrefix('transform') : 'transform';

  theme.cache.$window.on('scroll', function(evt) {
    var scrolled = theme.cache.$window.scrollTop();
    theme.cache.$collectionImage[0].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 4.5 + 'px, 0)';
  });
};

theme.createImageCarousel = function () {
  if (!theme.cache.$productImages.length || theme.cache.$productImagePhoto.length < 2) {
    return;
  }

  theme.cache.$productImages.slick({
    arrows         : false,
    dots           : true,
    adaptiveHeight : true
  });
};

theme.destroyImageCarousel = function () {
  if (!theme.cache.$productImages.length) {
    return;
  }

  theme.cache.$productImages.unslick();
};

theme.initCollageGrid = function () {
  if (!theme.cache.$productGridRows.length) {
    return;
  };

  theme.collageGridHeights();

  theme.cache.$window.on('resize', theme.debounce(theme.collageGridHeights, 500));
}

theme.collageGridHeights = function () {
  if (theme.variables.bpSmall || !theme.cache.$productGridRows.length) {
    return;
  }

  ///calculate image heights for each row of grid images
  for (var i = theme.cache.$productGridRows.length - 1; i >= 0; i--) {
    var $currentRow = $(theme.cache.$productGridRows[i]);
    var $smallImages = $currentRow.find('.grid__item--small .grid-product__image-wrapper');
    var $largeImageWrapper = $currentRow.find('.grid__item--large .grid-product__image-wrapper');
    var $largeImage = $largeImageWrapper.find('.grid-product__image-link');

    // calculate the bottom edge of the small image
    var smallImageOffset = $smallImages[1].offsetTop + $smallImages[1].offsetHeight;

    // calculate the bottom edge of the large image for the row
    var largeImageOffset = $largeImageWrapper[0].offsetTop + $largeImageWrapper[0].offsetHeight;

    // Depending on which image is lower, increase or decrease the large
    // image size
    if (smallImageOffset > largeImageOffset) {
      var largeImageHeight = $largeImage.height() + (smallImageOffset - largeImageOffset);
    } else {
      var largeImageHeight = $largeImage.height() - (largeImageOffset - smallImageOffset);
    };

    $largeImage.css('height', largeImageHeight);
  };
}

theme.clearCollageGridHeights = function () {
  if (!theme.cache.$productGridRows.length) {
    return;
  };

  theme.cache.$productGridPhotosLarge.removeAttr('style');
}

theme.initStickyProductMeta = function () {
  if (theme.cache.$productSingleMeta.find('#shopify-product-reviews').length) {
    return;
  }

  if (!theme.cache.$productSingleMeta.length || theme.cache.$productImagePhoto.length < 2) {
    return;
  }

  // Don't bother on IE8
  if (theme.cache.$html.hasClass('lt-ie9')) {
    return;
  }

  // Force detatch if already detached. Prevent layout issues.
  theme.cache.$productSingleMeta.trigger('detach.ScrollToFixed');

  // Detach and stop if on mobile breakpoint
  if (theme.variables.bpSmall) {
    return;
  };

  var productCopyHeight = theme.cache.$productSingleMeta.outerHeight();
  var productImagesHeight = theme.cache.$productImages.height();

  /*============================================================================
    Calculate when to detach fixed element to avoid content overlap.
    Subtract product copy height from the limit because plugin uses offset().top
  ==============================================================================*/
  var calcLimit = theme.cache.$productSingleWrapper.offset().top + theme.cache.$productSingleWrapper.height();
  calcLimit -= productCopyHeight;

  // Init sticky if desc shorter than images and fits in viewport
  if (productCopyHeight < productImagesHeight && productCopyHeight < theme.cache.$window.height()) {
    theme.variables.productPageSticky = true;
    theme.cache.$productSingleMeta.scrollToFixed({
      limit: calcLimit
    });
  } else {
    theme.variables.productPageSticky = false;
  }
}

theme.hideSingleSelectors = function () {
  if (!theme.cache.$productSelectors.length) {
    return;
  }

  // loop through radio buttons and hide any fieldsets which only contain
  // one option
  for (var i = 0; i < theme.cache.$productSelectors.length; i++) {
    var $selector = $(theme.cache.$productSelectors[i]);
    var $radioButtons = $selector.find('.single-option-selector__radio');

    if ($radioButtons.length === 1) {
      $selector.hide();
    }
  };
}

theme.showVariantImage = function (src, imgObject, el) {
  // Called when a new product variant is selected

  var $newImage = $('.product-single__photo[data-image-id="'+ imgObject.id +'"]');

  if (theme.variables.productPageLoad) {
    scrollToImage();
  } else {
    // Run on load to prevent Chrome scroll jerk
    $(window).on('load', function() {
      scrollToImage('load');
    });
    theme.variables.productPageLoad = true;
  }

  function scrollToImage(onLoad) {
    if (theme.variables.bpSmall) {
      // Switch carousel slide, unless it's the first photo on load
      var imageIndex = $newImage.parent().attr('index');
      // Navigate to slide unless it's the first photo on load
      if (imageIndex != 0 || !onLoad) {
        theme.cache.$productImages.slickGoTo(imageIndex);
      }
    } else {
      var imageIndex = $newImage.parent().index();
      // Scroll to/reorder image unless it's the first photo on load
      if (imageIndex != 0 || !onLoad) {
        if (!theme.variables.productPageSticky) {
          // Move selected variant image to top
          $newImage.parent().prependTo(theme.cache.$productImages);
        } else {
          // Scroll to variant image
          $('html, body').animate({
            scrollTop: $newImage.offset().top
          }, 250);
        }
      }
    }
  }
};

theme.articleImages = function () {
  if (!theme.cache.$indentedRteImages.length) {
    return;
  }

  theme.cache.$indentedRteImages.find('img').each(function() {
    var $el = $(this);
    var attr = $el.attr('style');

    // Check if undefined or float: none
    if (!attr || attr == 'float: none;') {
      // Remove grid-breaking styles if image isn't wider than parent
      if ($el.width() < theme.cache.$indentedRteImages.width()) {
        $el.addClass('rte__no-indent');
      }
    }
  });
};

theme.styleTextLinks = function () {
  $('.rte').find('a:not(:has(img))').addClass('text-link');
}

/*
 * Debounce function
 * based on unminified version from http://davidwalsh.name/javascript-debounce-function
 */
theme.debounce = function(n,t,u){var e;return function(){var a=this,r=arguments,i=function(){e=null,u||n.apply(a,r)},o=u&&!e;clearTimeout(e),e=setTimeout(i,t),o&&n.apply(a,r)}}

// Initialize theme's JS on docready
$(theme.init);
