function getFragment(doc, template) {
  let fragment = new DocumentFragment();

  template.forEach(item => {
    buildFragment(doc, item, fragment);
  });

  return fragment;
}

function buildFragment(doc, template, parentElement) {
  let element = doc.createElement(template.component);

  if (template.innerHTML) {
    element.innerHTML = template.innerHTML;
  }

  if (template.props) {
    Object.keys(template.props).forEach(key => {
      element[key] = template.props[key];
    });
  }

  parentElement.appendChild(element);

  if (template.children) {
    for (const item of template.children) {
      buildFragment(doc, item, element);
    }
  }
}

export { getFragment };
