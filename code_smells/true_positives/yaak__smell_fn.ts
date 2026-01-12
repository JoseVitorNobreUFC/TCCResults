// @ts-nocheck
enter(node) {
  if (node.name === 'Tag') {
    if (isSelectionInsideNode(view, node)) return;
    const rawTag = view.state.doc.sliceString(node.from, node.to);
    const inner = rawTag.replace(/^\$\{\[\s*/, '').replace(/\s*]}$/, '');
    let name = inner.match(/([\w.]+)[(]/)?.[1] ?? inner;
    if (inner.includes('\n')) {
      return;
    }
    if (name === 'Response') {
      name = 'response';
    }
    let option = options.find(
      (o) => o.name === name || (o.type === 'function' && o.aliases?.includes(name)),
    );
    if (option == null) {
      const from = node.from;
      option = {
        invalid: true,
        type: 'variable',
        name: inner,
        value: null,
        label: inner,
        onClick: () => {
          onClickMissingVariable(name, rawTag, from);
        },
      };
    }
    let invalid = false;
    if (option.type === 'function') {
      const tokens = parseTemplate(rawTag);
      const values = collectArgumentValues(tokens, option);
      for (const arg of option.args) {
        if (!('optional' in arg)) continue;
        if (!arg.optional && values[arg.name] == null) {
          invalid = true;
          break;
        }
      }
    }
    const widget = new TemplateTagWidget({ ...option, invalid }, rawTag, node.from);
    const deco = Decoration.replace({ widget, inclusive: true });
    widgets.push(deco.range(node.from, node.to));
  }
}