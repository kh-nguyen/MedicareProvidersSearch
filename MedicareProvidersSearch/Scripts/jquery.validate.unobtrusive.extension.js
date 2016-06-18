(function ($) {
  $.validator.unobtrusive.parseDynamicContent = function (selector) {
    //use the normal unobstrusive.parse method
    $.validator.unobtrusive.parse(selector);

    //get the relevant form
    var form = $(selector).first().closest('form');

    //get the collections of unobstrusive validators,
	//and jquery validators and compare the two
    var unobtrusiveValidation = form.data('unobtrusiveValidation');
    var validator = form.validate();
	
	//exit the function if there is no validation data
	if (typeof (unobtrusiveValidation) === 'undefined') {
		console.log('Warning: no unobtrusiveValidation');
		console.log('form');
		console.log(form);
		console.log('selector');
		console.log(selector);
		return;
	}

    $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
      if (validator.settings.rules[elname] == undefined) {
        var args = {};
        $.extend(args, elrules);
        args.messages = unobtrusiveValidation.options.messages[elname];
        $('[name="' + elname + '"]').rules("add", args);
      } else {
        $.each(elrules, function (rulename, data) {
          if (validator.settings.rules[elname][rulename] == undefined) {
            var args = {};
            args[rulename] = data;
            args.messages = unobtrusiveValidation.options.messages[elname][rulename];
            $('[name="' + elname + '"]').rules("add", args);
          }
        });
      }
    });
  };
})(jQuery);

(function ($) {
    //re-set all client validation given a jQuery selected form or child
    $.fn.resetValidation = function () {

        var $form = this.closest('form');

        //reset jQuery Validate's internals
        $form.validate().resetForm();

        //reset unobtrusive validation summary, if it exists
        $form.find("[data-valmsg-summary=true]")
            .removeClass("validation-summary-errors")
            .addClass("validation-summary-valid")
            .find("ul").empty();

        //reset unobtrusive field level, if it exists
        $form.find("[data-valmsg-replace]")
            .removeClass("field-validation-error")
            .addClass("field-validation-valid")
            .empty();
			
		/* added by the raw jquery.validate plugin */
		$form.removeData("validator");
		
		/* added by the jquery unobtrusive plugin */
		$form.removeData("unobtrusiveValidation"); 

        return $form;
    };
})(jQuery);

$.validator.unobtrusive.adapters.addBool("mandatory", "required");