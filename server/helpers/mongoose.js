module.exports = {
  normalizedErrors: function(errors) {
    let normalizeErrors = [];
    for (var property in errors) {
      if (errors.hasOwnProperty(property)) {
        normalizeErrors.push({
          title: property,
          detail: errors[property].message
        });
      }
    }
    return normalizeErrors;
  }
};
