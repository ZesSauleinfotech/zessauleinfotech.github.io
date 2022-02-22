/**
* PHP Email Form Validation - v2.3
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
!(function($) {
  "use strict";

  $('form.php-email-form').submit(function(e) {
    e.preventDefault();
    
    var f = $(this).find('.form-group'),
    ferror = false,
    emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
          if (i.val() === '') {
            ferror = ierror = true;
          }
          break;

          case 'minlen':
          if (i.val().length < parseInt(exp)) {
            ferror = ierror = true;
          }
          break;

          case 'email':
          if (!emailExp.test(i.val())) {
            ferror = ierror = true;
          }
          break;

          case 'checked':
          if (! i.is(':checked')) {
            ferror = ierror = true;
          }
          break;

          case 'regexp':
          exp = new RegExp(exp);
          if (!exp.test(i.val())) {
            ferror = ierror = true;
          }
          break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
          if (i.val() === '') {
            ferror = ierror = true;
          }
          break;

          case 'minlen':
          if (i.val().length < parseInt(exp)) {
            ferror = ierror = true;
          }
          break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;

    var this_form = $(this);
    var action = $(this).attr('action');

    if( ! action ) {
      this_form.find('.loading').slideUp();
      this_form.find('.error-message').slideDown().html('The form action property is not set!');
      return false;
    }
    
    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();

    if ( $(this).data('recaptcha-site-key') ) {
      var recaptcha_site_key = $(this).data('recaptcha-site-key');
      grecaptcha.ready(function() {
        grecaptcha.execute(recaptcha_site_key, {action: 'php_email_form_submit'}).then(function(token) {
          php_email_form_submit(this_form,action,this_form.serialize() + '&recaptcha-response=' + token);
        });
      });
    } else {
      php_email_form_submit(this_form,action,this_form.serialize());
    }
    
    return true;
  });

  function php_email_form_submit(this_form, action, data) {
    var form_id_js = "javascript_form";

    var data_js = {
      "access_token": "yyxl1k4y0r6wsqle7isztw7b"
    };

    function js_onSuccess() {
        // remove this to avoid redirect
        document.querySelector("#" + form_id_js + " [name='subject']").value="";
        document.querySelector("#" + form_id_js + " [name='text']").value="";
        document.querySelector("#" + form_id_js + " [name='name']").value="";
        sendButton.innerHTML='Send Message';
        document.getElementById('success').style.display="block"; 
        //window.location = window.location.pathname + "?message=Email+Successfully+Sent%21&isError=0";
      }

      function js_onError(error) {
        // remove this to avoid redirect
        //window.location = window.location.pathname + "?message=Email+could+not+be+sent.&isError=1";
      }

      var sendButton = document.getElementById("js_send");

      function js_send() {
        sendButton.innerHTML='Sending…';
        sendButton.disabled=true;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if (request.readyState == 4 && request.status == 200) {
            js_onSuccess();
          } else
          if(request.readyState == 4) {
            js_onError(request.response);
          }
        };

        var subject = document.querySelector("#" + form_id_js + " [name='subject']").value;
        var message = document.querySelector("#" + form_id_js + " [name='text']").value;
        data_js['subject'] = subject;
        data_js['text'] = message;
        var params = toParams(data_js);

        request.open("POST", "https://postmail.invotes.com/send", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.send(params);

        return false;
      }

      sendButton.onclick = js_send;

      function toParams(data_js) {
        var form_data = [];
        for ( var key in data_js ) {
          form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
        }

        return form_data.join("&");
      }

      var js_form = document.getElementById(form_id_js);
      js_form.addEventListener("submit", function (e) {
        e.preventDefault();
      });
    }

  })(jQuery);
