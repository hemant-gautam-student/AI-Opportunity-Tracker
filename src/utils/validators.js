export function validateOpportunity(form) {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = 'Opportunity name is required';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!form.organization?.trim()) {
    errors.organization = 'Organization name is required';
  }

  if (form.link && !isValidUrl(form.link)) {
    errors.link = 'Please enter a valid URL';
  }

  if (!form.category) {
    errors.category = 'Please select a category';
  }

  if (!form.status) {
    errors.status = 'Please select a status';
  }

  if (form.status === 'Interview') {
    if (!form.interviewDate) {
      errors.interviewDate = 'Interview date is required';
    }
    if (!form.interviewTime) {
      errors.interviewTime = 'Interview time is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function searchOpportunities(opportunities, query) {
  if (!query?.trim()) return opportunities;
  const q = query.toLowerCase().trim();
  return opportunities.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.organization.toLowerCase().includes(q)
  );
}

export function filterOpportunities(opportunities, { category, status }) {
  return opportunities.filter((o) => {
    if (category && o.category !== category) return false;
    if (status && o.status !== status) return false;
    return true;
  });
}