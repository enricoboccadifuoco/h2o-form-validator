# NOTE: this project was developer more than 3 years ago but it's recently published ;)

# H2o form validator

H2o form validator is a simple and tiny form validation library, 3KB minified, no dependecies.

## Install

```
npm i @enricoboccadifuoco/h2o-form-validator
```

## How it works

Form Validation or single fields validation

```javascript
    var formValidator = validator(domFormObject);

    formValidator.on('error', function(e) {
        // log error
        console.error(e.detail.message, e.detail.el);
    });

    if (formValidator.validate()) {
        // form is correctly validate
    } else {
        // validation not successful
    }
```

## HTML implementation

```html
<form action="#">
    <input type="text" data-validation="alphanumeric" minlength="10" required>
    <button type="submit">Submit</button>
</form>
```

| attributes                | possible values                                   | default      |
| --------------------------|---------------------------------------------------|--------------|
| data-validation           | (see allowed validation types)                    | none         |
| minlength                 | number                                            |              |
| maxlength                 | number                                            |              |
| required                  | Boolean                                           |              |

## Events

Validation trigger the following events:

* error => returns the following params, message and DOM element

## Validation types
* email
* url
* noProtocolUrl
* alphanumeric
* number
* alpha

## Error messages

* email: Please provide a valid e-mail address
* url: Please provide a valid URL
* noProtocolUrl: empty
* alphanumeric: Letters and numbers only, please
* number: Numbers only, please
* alpha: Letters only, please

## Helpers

validator object return a static object called helpers.
It contains static helper methods.

* addHttp: validate a url without protocol and add http into it
